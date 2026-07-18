const path = require('path');
const express = require('express');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const { OAuth2Client } = require('google-auth-library');

const pool = require('./db');
const { initDb } = require('./db-init');
const { sendTagEmail } = require('./email');
const { hashPassword, verifyPassword } = require('./local-auth');

const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.APP_BASE_URL || 'https://nondegree-production.up.railway.app';
const GOOGLE_CONFIGURED = !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

const oauthClient = GOOGLE_CONFIGURED
  ? new OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, `${BASE_URL}/auth/google/callback`)
  : null;

const app = express();
app.set('trust proxy', 1);
app.use(express.json());

app.use(session({
  store: new pgSession({ pool, tableName: 'session', createTableIfMissing: true }),
  secret: process.env.SESSION_SECRET || 'dev-secret-change-me',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  },
}));

function requireAuth(req, res, next) {
  if (!req.session.user) return res.status(401).json({ error: 'กรุณาเข้าสู่ระบบก่อน' });
  next();
}
function requireRole(role) {
  return (req, res, next) => {
    if (!req.session.user) return res.status(401).json({ error: 'กรุณาเข้าสู่ระบบก่อน' });
    if (req.session.user.role !== role) return res.status(403).json({ error: 'คุณไม่มีสิทธิ์ทำรายการนี้' });
    next();
  };
}
function newId(prefix) {
  return `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

/* ---------------- Auth ---------------- */

app.get('/auth/google', (req, res) => {
  if (!GOOGLE_CONFIGURED) return res.status(503).send('Google login is not configured yet. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET.');
  const url = oauthClient.generateAuthUrl({ scope: ['openid', 'email', 'profile'], prompt: 'select_account' });
  res.redirect(url);
});

app.get('/auth/google/callback', async (req, res) => {
  if (!GOOGLE_CONFIGURED) return res.redirect('/?auth_error=not_configured');
  try {
    const { tokens } = await oauthClient.getToken(req.query.code);
    const ticket = await oauthClient.verifyIdToken({ idToken: tokens.id_token, audience: process.env.GOOGLE_CLIENT_ID });
    const payload = ticket.getPayload();
    const email = payload.email;

    const staffRes = await pool.query('SELECT * FROM staff WHERE email = $1', [email]);
    const contactRes = staffRes.rows.length ? { rows: [] } : await pool.query('SELECT * FROM client_contacts WHERE email = $1', [email]);

    let role, staffId = null, clientContactId = null, avatarTargetTable = null, avatarTargetId = null;
    if (staffRes.rows.length) {
      role = 'agency'; staffId = staffRes.rows[0].id;
      avatarTargetTable = 'staff'; avatarTargetId = staffId;
      if (!staffRes.rows[0].avatar_url && payload.picture) {
        await pool.query('UPDATE staff SET avatar_url = $1 WHERE id = $2', [payload.picture, staffId]);
      }
    } else if (contactRes.rows.length) {
      role = 'client'; clientContactId = contactRes.rows[0].id;
      avatarTargetTable = 'client_contacts'; avatarTargetId = clientContactId;
      if (!contactRes.rows[0].avatar_url && payload.picture) {
        await pool.query('UPDATE client_contacts SET avatar_url = $1 WHERE id = $2', [payload.picture, clientContactId]);
      }
    } else {
      return res.redirect('/?auth_error=not_allowed');
    }

    await pool.query(
      `INSERT INTO users (google_id, email, name, picture, role, staff_id, client_contact_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       ON CONFLICT (google_id) DO UPDATE SET name = $3, picture = $4, role = $5, staff_id = $6, client_contact_id = $7`,
      [payload.sub, email, payload.name, payload.picture, role, staffId, clientContactId]
    );

    req.session.user = { email, name: payload.name, picture: payload.picture, role, staffId, clientContactId };
    res.redirect('/');
  } catch (e) {
    console.error('OAuth callback failed:', e.message);
    res.redirect('/?auth_error=1');
  }
});

app.post('/auth/register', async (req, res) => {
  const email = (req.body.email || '').trim().toLowerCase();
  const password = req.body.password || '';
  if (!email || password.length < 6) return res.status(400).json({ error: 'กรุณากรอกอีเมล และตั้งรหัสผ่านอย่างน้อย 6 ตัวอักษร' });

  const staffRes = await pool.query('SELECT * FROM staff WHERE lower(email) = $1', [email]);
  const contactRes = staffRes.rows.length ? { rows: [] } : await pool.query('SELECT * FROM client_contacts WHERE lower(email) = $1', [email]);

  let row, role, table;
  if (staffRes.rows.length) { row = staffRes.rows[0]; role = 'agency'; table = 'staff'; }
  else if (contactRes.rows.length) { row = contactRes.rows[0]; role = 'client'; table = 'client_contacts'; }
  else return res.status(403).json({ error: 'อีเมลนี้ยังไม่ได้รับสิทธิ์เข้าถึงระบบ กรุณาติดต่อผู้ดูแลระบบให้เพิ่มอีเมลของคุณก่อน' });

  if (row.password_hash) return res.status(409).json({ error: 'บัญชีนี้ตั้งรหัสผ่านไปแล้ว กรุณาเข้าสู่ระบบแทน' });

  const hash = hashPassword(password);
  await pool.query(`UPDATE ${table} SET password_hash = $1 WHERE id = $2`, [hash, row.id]);

  req.session.user = {
    email: row.email, name: row.name, picture: row.avatar_url, role,
    staffId: role === 'agency' ? row.id : null, clientContactId: role === 'client' ? row.id : null,
  };
  res.json({ ok: true });
});

app.post('/auth/login', async (req, res) => {
  const email = (req.body.email || '').trim().toLowerCase();
  const password = req.body.password || '';

  const staffRes = await pool.query('SELECT * FROM staff WHERE lower(email) = $1', [email]);
  const contactRes = staffRes.rows.length ? { rows: [] } : await pool.query('SELECT * FROM client_contacts WHERE lower(email) = $1', [email]);

  let row, role;
  if (staffRes.rows.length) { row = staffRes.rows[0]; role = 'agency'; }
  else if (contactRes.rows.length) { row = contactRes.rows[0]; role = 'client'; }
  else return res.status(401).json({ error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });

  if (!row.password_hash) return res.status(409).json({ error: 'บัญชีนี้ยังไม่ได้ตั้งรหัสผ่าน กรุณาสมัครใช้งานครั้งแรกก่อน' });
  if (!verifyPassword(password, row.password_hash)) return res.status(401).json({ error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });

  req.session.user = {
    email: row.email, name: row.name, picture: row.avatar_url, role,
    staffId: role === 'agency' ? row.id : null, clientContactId: role === 'client' ? row.id : null,
  };
  res.json({ ok: true });
});

app.post('/auth/logout', (req, res) => {
  req.session.destroy(() => res.json({ ok: true }));
});

app.get('/api/me', (req, res) => {
  res.json({ user: req.session.user || null, googleConfigured: GOOGLE_CONFIGURED });
});

/* ---------------- Bootstrap (single read) ---------------- */

app.get('/api/bootstrap', requireAuth, async (req, res) => {
  try {
    const [clientRes, projects, staff, contacts, tasks, revisions, files, requests, tags] = await Promise.all([
      pool.query('SELECT * FROM clients LIMIT 1'),
      pool.query('SELECT * FROM projects ORDER BY created_at'),
      pool.query('SELECT * FROM staff ORDER BY name'),
      pool.query('SELECT * FROM client_contacts ORDER BY is_primary DESC, name'),
      pool.query('SELECT * FROM tasks ORDER BY created_at'),
      pool.query('SELECT * FROM revisions ORDER BY date'),
      pool.query('SELECT * FROM files ORDER BY uploaded_date DESC'),
      pool.query('SELECT * FROM requests ORDER BY submitted_date DESC'),
      pool.query('SELECT * FROM task_tags ORDER BY created_at DESC'),
    ]);

    const revByTask = {};
    revisions.rows.forEach(r => {
      (revByTask[r.task_id] = revByTask[r.task_id] || []).push({
        date: r.date, requestedBy: r.requested_by, reason: r.reason, daysAdded: r.days_added,
      });
    });

    const tasksOut = tasks.rows.map(t => ({
      id: t.id, projectId: t.project_id, name: t.name, description: t.description || '',
      assigneeId: t.assignee_id, status: t.status, startDate: t.start_date,
      originalDeadline: t.original_deadline, deadlineOverride: t.deadline_override,
      completedDate: t.completed_date, progress: t.progress, workLink: t.work_link || '',
      waitingOnClient: t.waiting_on_client, waitingNote: t.waiting_note || '',
      revisions: revByTask[t.id] || [],
    }));

    res.json({
      me: req.session.user,
      client: clientRes.rows[0] || null,
      projects: projects.rows.map(p => ({ id: p.id, name: p.name, description: p.description || '', icon: p.icon || '📁' })),
      staff: staff.rows.map(s => ({ id: s.id, name: s.name, role: s.role, email: s.email, phone: s.phone, line: s.line, avatarUrl: s.avatar_url })),
      clientTeam: contacts.rows.map(c => ({ id: c.id, name: c.name, role: c.role, email: c.email, phone: c.phone, avatarUrl: c.avatar_url, primary: c.is_primary })),
      tasks: tasksOut,
      files: files.rows.map(f => ({ id: f.id, taskId: f.task_id, name: f.name, link: f.link, uploadedBy: f.uploaded_by, uploadedDate: f.uploaded_date, status: f.status, comment: f.comment || '' })),
      requests: requests.rows.map(r => ({ id: r.id, projectId: r.project_id, requesterId: r.requester_id, subject: r.subject, category: r.category, priority: r.priority, desiredDate: r.desired_date, description: r.description, status: r.status, submittedDate: r.submitted_date })),
      tags: tags.rows.map(t => ({ id: t.id, taskId: t.task_id, taggedEmail: t.tagged_email, taggedName: t.tagged_name, message: t.message, taggedByName: t.tagged_by_name, createdAt: t.created_at, emailSent: t.email_sent })),
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'server_error' });
  }
});

/* ---------------- Projects ---------------- */

app.post('/api/projects', requireRole('agency'), async (req, res) => {
  const { name, description, icon } = req.body;
  if (!name) return res.status(400).json({ error: 'name required' });
  const clientRow = await pool.query('SELECT id FROM clients LIMIT 1');
  const id = newId('p');
  await pool.query('INSERT INTO projects (id, client_id, name, description, icon) VALUES ($1,$2,$3,$4,$5)',
    [id, clientRow.rows[0].id, name, description || '', icon || '📁']);
  res.json({ id });
});

app.patch('/api/projects/:id', requireAuth, async (req, res) => {
  const { name, description, icon } = req.body;
  await pool.query('UPDATE projects SET name = COALESCE($1,name), description = COALESCE($2,description), icon = COALESCE($3,icon) WHERE id = $4',
    [name, description, icon, req.params.id]);
  res.json({ ok: true });
});

/* ---------------- Tasks ---------------- */

app.post('/api/tasks', requireRole('agency'), async (req, res) => {
  const { projectId, name, description, assigneeId, status, startDate, originalDeadline, workLink } = req.body;
  if (!projectId || !name) return res.status(400).json({ error: 'projectId and name required' });
  const id = newId('t');
  await pool.query(
    `INSERT INTO tasks (id, project_id, name, description, assignee_id, status, start_date, original_deadline, progress, work_link)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,0,$9)`,
    [id, projectId, name, description || '', assigneeId || null, status || 'not_started', startDate || null, originalDeadline || null, workLink || '']
  );
  res.json({ id });
});

const TASK_FIELD_MAP = {
  name: 'name', description: 'description', assigneeId: 'assignee_id', status: 'status',
  startDate: 'start_date', originalDeadline: 'original_deadline', deadlineOverride: 'deadline_override',
  completedDate: 'completed_date', progress: 'progress', workLink: 'work_link',
  waitingOnClient: 'waiting_on_client', waitingNote: 'waiting_note',
};

app.patch('/api/tasks/:id', requireRole('agency'), async (req, res) => {
  const sets = [];
  const vals = [];
  let i = 1;
  for (const [key, col] of Object.entries(TASK_FIELD_MAP)) {
    if (Object.prototype.hasOwnProperty.call(req.body, key)) {
      sets.push(`${col} = $${i++}`);
      vals.push(req.body[key]);
    }
  }
  if (!sets.length) return res.json({ ok: true });
  vals.push(req.params.id);
  await pool.query(`UPDATE tasks SET ${sets.join(', ')} WHERE id = $${i}`, vals);
  res.json({ ok: true });
});

app.post('/api/tasks/:id/revisions', requireRole('agency'), async (req, res) => {
  const { date, requestedBy, reason, daysAdded } = req.body;
  await pool.query('INSERT INTO revisions (task_id, date, requested_by, reason, days_added) VALUES ($1,$2,$3,$4,$5)',
    [req.params.id, date, requestedBy || 'ลูกค้า', reason || '', daysAdded || 0]);
  res.json({ ok: true });
});

app.post('/api/tasks/:id/tag', requireAuth, async (req, res) => {
  const { email, name, message } = req.body;
  if (!email) return res.status(400).json({ error: 'email required' });

  const taskRes = await pool.query('SELECT t.name AS task_name, p.name AS project_name FROM tasks t JOIN projects p ON p.id = t.project_id WHERE t.id = $1', [req.params.id]);
  if (!taskRes.rows.length) return res.status(404).json({ error: 'task not found' });

  const result = await sendTagEmail({
    to: email, toName: name, taskName: taskRes.rows[0].task_name, projectName: taskRes.rows[0].project_name,
    taggedByName: req.session.user.name || req.session.user.email, message, portalUrl: BASE_URL,
  });

  await pool.query(
    'INSERT INTO task_tags (task_id, tagged_email, tagged_name, message, tagged_by_name, email_sent) VALUES ($1,$2,$3,$4,$5,$6)',
    [req.params.id, email, name || '', message || '', req.session.user.name || req.session.user.email, result.sent]
  );
  res.json(result);
});

/* ---------------- Staff (our team) ---------------- */

app.post('/api/staff', requireRole('agency'), async (req, res) => {
  const { name, role, email, phone, line } = req.body;
  if (!name || !role || !email) return res.status(400).json({ error: 'name, role, email required' });
  const id = newId('s');
  try {
    await pool.query('INSERT INTO staff (id, name, role, email, phone, line) VALUES ($1,$2,$3,$4,$5,$6)',
      [id, name, role, email, phone || '', line || '']);
    res.json({ id });
  } catch (e) {
    res.status(400).json({ error: e.code === '23505' ? 'อีเมลนี้ถูกใช้งานแล้ว' : 'เกิดข้อผิดพลาด กรุณาลองใหม่' });
  }
});

app.patch('/api/staff/:id', requireRole('agency'), async (req, res) => {
  const { name, role, email, phone, line, avatarUrl } = req.body;
  await pool.query(
    `UPDATE staff SET name=COALESCE($1,name), role=COALESCE($2,role), email=COALESCE($3,email),
     phone=COALESCE($4,phone), line=COALESCE($5,line), avatar_url=COALESCE($6,avatar_url) WHERE id=$7`,
    [name, role, email, phone, line, avatarUrl, req.params.id]
  );
  res.json({ ok: true });
});

app.delete('/api/staff/:id', requireRole('agency'), async (req, res) => {
  const inUse = await pool.query('SELECT 1 FROM tasks WHERE assignee_id = $1 LIMIT 1', [req.params.id]);
  if (inUse.rows.length) return res.status(409).json({ error: 'ไม่สามารถลบได้ เนื่องจากยังมีงานที่มอบหมายให้คนนี้อยู่ กรุณาเปลี่ยนผู้รับผิดชอบก่อน' });
  await pool.query('DELETE FROM staff WHERE id = $1', [req.params.id]);
  res.json({ ok: true });
});

/* ---------------- Client contacts (client's team) ---------------- */

app.post('/api/client-contacts', requireAuth, async (req, res) => {
  const { name, role, email, phone, primary } = req.body;
  if (!name || !role || !email) return res.status(400).json({ error: 'name, role, email required' });
  const clientRow = await pool.query('SELECT id FROM clients LIMIT 1');
  const id = newId('ct');
  try {
    if (primary) await pool.query('UPDATE client_contacts SET is_primary = false');
    await pool.query('INSERT INTO client_contacts (id, client_id, name, role, email, phone, is_primary) VALUES ($1,$2,$3,$4,$5,$6,$7)',
      [id, clientRow.rows[0].id, name, role, email, phone || '', !!primary]);
    res.json({ id });
  } catch (e) {
    res.status(400).json({ error: e.code === '23505' ? 'อีเมลนี้ถูกใช้งานแล้ว' : 'เกิดข้อผิดพลาด กรุณาลองใหม่' });
  }
});

app.patch('/api/client-contacts/:id', requireAuth, async (req, res) => {
  const { name, role, email, phone, primary, avatarUrl } = req.body;
  if (primary) await pool.query('UPDATE client_contacts SET is_primary = false');
  await pool.query(
    `UPDATE client_contacts SET name=COALESCE($1,name), role=COALESCE($2,role), email=COALESCE($3,email),
     phone=COALESCE($4,phone), is_primary=COALESCE($5,is_primary), avatar_url=COALESCE($6,avatar_url) WHERE id=$7`,
    [name, role, email, phone, typeof primary === 'boolean' ? primary : null, avatarUrl, req.params.id]
  );
  res.json({ ok: true });
});

app.delete('/api/client-contacts/:id', requireAuth, async (req, res) => {
  const inUse = await pool.query('SELECT 1 FROM requests WHERE requester_id = $1 LIMIT 1', [req.params.id]);
  if (inUse.rows.length) return res.status(409).json({ error: 'ไม่สามารถลบได้ เนื่องจากมีคำขอที่ส่งโดยผู้ติดต่อนี้อยู่' });
  const wasPrimary = await pool.query('SELECT is_primary FROM client_contacts WHERE id = $1', [req.params.id]);
  await pool.query('DELETE FROM client_contacts WHERE id = $1', [req.params.id]);
  if (wasPrimary.rows[0]?.is_primary) {
    await pool.query(`UPDATE client_contacts SET is_primary = true WHERE id = (SELECT id FROM client_contacts ORDER BY name LIMIT 1)`);
  }
  res.json({ ok: true });
});

/* ---------------- Files ---------------- */

app.post('/api/files', requireRole('agency'), async (req, res) => {
  const { taskId, name, link } = req.body;
  if (!taskId || !name || !link) return res.status(400).json({ error: 'taskId, name, link required' });
  const id = newId('f');
  await pool.query(
    'INSERT INTO files (id, task_id, name, link, uploaded_by, uploaded_date, status) VALUES ($1,$2,$3,$4,$5,CURRENT_DATE,$6)',
    [id, taskId, name, link, req.session.user.staffId, 'pending']
  );
  res.json({ id });
});

app.patch('/api/files/:id', requireRole('client'), async (req, res) => {
  const { status, comment } = req.body;
  await pool.query('UPDATE files SET status = COALESCE($1,status), comment = COALESCE($2,comment) WHERE id = $3',
    [status, comment, req.params.id]);
  res.json({ ok: true });
});

/* ---------------- Requests ---------------- */

app.post('/api/requests', requireAuth, async (req, res) => {
  const { projectId, requesterId, subject, category, priority, desiredDate, description } = req.body;
  if (!projectId || !subject) return res.status(400).json({ error: 'projectId and subject required' });
  const id = newId('r');
  await pool.query(
    `INSERT INTO requests (id, project_id, requester_id, subject, category, priority, desired_date, description, status, submitted_date)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'รอดำเนินการ',CURRENT_DATE)`,
    [id, projectId, requesterId || req.session.user.clientContactId, subject, category || '', priority || '', desiredDate || null, description || '']
  );
  res.json({ id });
});

/* ---------------- Profile ---------------- */

app.patch('/api/me/avatar', requireAuth, async (req, res) => {
  const { avatarUrl } = req.body;
  if (!avatarUrl) return res.status(400).json({ error: 'avatarUrl required' });
  const u = req.session.user;
  if (u.role === 'agency') await pool.query('UPDATE staff SET avatar_url = $1 WHERE id = $2', [avatarUrl, u.staffId]);
  else await pool.query('UPDATE client_contacts SET avatar_url = $1 WHERE id = $2', [avatarUrl, u.clientContactId]);
  u.picture = avatarUrl;
  res.json({ ok: true });
});

/* ---------------- Static frontend ---------------- */

app.use(express.static(path.join(__dirname, '..', 'public')));
app.get('*', (req, res) => res.sendFile(path.join(__dirname, '..', 'public', 'index.html')));

/* ---------------- Boot ---------------- */

initDb()
  .then(() => {
    app.listen(PORT, () => console.log(`Client Portal server listening on :${PORT}`));
  })
  .catch((e) => {
    console.error('Failed to initialize database:', e);
    process.exit(1);
  });
