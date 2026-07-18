const fs = require('fs');
const path = require('path');
const pool = require('./db');

async function applySchema() {
  const sql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  await pool.query(sql);
}

async function seedIfEmpty() {
  const { rows } = await pool.query('SELECT COUNT(*)::int AS n FROM clients');
  if (rows[0].n > 0) return;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const clientRes = await client.query(
      `INSERT INTO clients (name, industry) VALUES ($1, $2) RETURNING id`,
      ['Aroi Delight Co., Ltd.', 'ธุรกิจร้านอาหาร']
    );
    const clientId = clientRes.rows[0].id;

    const staff = [
      ['s1', 'พีรพัฒน์ วงศ์', 'Project Manager (PM)', 'peerapat.pm@agency.co.th', '089-123-4567', '@peerapat.pm'],
      ['s2', 'สุชาดา อินทร์แก้ว', 'Producer & UI/UX Designer', 'suchada.d@agency.co.th', '081-234-5678', '@suchada.design'],
      ['s3', 'ธนกร ศรีสุข', 'Developer (Frontend)', 'thanakorn.dev@agency.co.th', '082-345-6789', '@thanakorn.fe'],
      ['s4', 'มนัสวี ชัยพร', 'Developer (Backend)', 'manasawee.dev@agency.co.th', '083-456-7890', '@manasawee.be'],
      ['s5', 'อรวรรณ พงษ์ไพบูลย์', 'QA & Content', 'orawan.qa@agency.co.th', '084-567-8901', '@orawan.qa'],
      ['s6', 'ชนากานต์ ทิพย์เนตร', 'Account Executive (AE)', 'chanakan.ae@agency.co.th', '085-678-9012', '@chanakan.ae'],
      ['s7', 'ผู้ดูแลระบบ', 'Admin', 'ppakarakit01@gmail.com', '', ''],
    ];
    for (const [id, name, role, email, phone, line] of staff) {
      await client.query(
        `INSERT INTO staff (id, name, role, email, phone, line) VALUES ($1,$2,$3,$4,$5,$6)`,
        [id, name, role, email, phone, line]
      );
    }

    const contacts = [
      ['ct1', 'คุณกัญญา รักษ์ไพศาล', 'เจ้าของร้าน (ผู้อนุมัติหลัก)', 'kanya@aroidelight.com', '081-111-2222', true],
      ['ct2', 'คุณปวีณา ทองดี', 'ผู้จัดการฝ่ายการตลาด', 'paweena@aroidelight.com', '082-222-3333', false],
    ];
    for (const [id, name, role, email, phone, primary] of contacts) {
      await client.query(
        `INSERT INTO client_contacts (id, client_id, name, role, email, phone, is_primary) VALUES ($1,$2,$3,$4,$5,$6,$7)`,
        [id, clientId, name, role, email, phone, primary]
      );
    }

    const projects = [
      ['p1', 'เว็บไซต์ร้านอาหาร Aroi Delight', 'เว็บไซต์หลักของร้าน ครอบคลุมหน้า Landing, ระบบสั่งอาหารออนไลน์ และ SEO', '🌐'],
      ['p2', 'บริการการตลาดออนไลน์ Aroi Delight', 'ดูแลการตลาดออนไลน์ประจำไตรมาส ครอบคลุมโฆษณา คอนเทนต์ และรายงานผลลัพธ์', '📣'],
    ];
    for (const [id, name, description, icon] of projects) {
      await client.query(
        `INSERT INTO projects (id, client_id, name, description, icon) VALUES ($1,$2,$3,$4,$5)`,
        [id, clientId, name, description, icon]
      );
    }

    const tasks = [
      ['t1', 'p1', 'ออกแบบ UI หน้า Landing Page', 's2', 'completed', '2026-06-20', '2026-06-30', null, '2026-07-03', 100, 'https://figma.com/file/aroi-landing-page'],
      ['t2', 'p1', 'พัฒนาโครงสร้างหน้าเว็บไซต์ (Frontend)', 's3', 'in_progress', '2026-07-01', '2026-07-20', null, null, 55, 'https://github.com/aroi-delight/web-frontend'],
      ['t3', 'p1', 'เชื่อมต่อระบบสั่งอาหารออนไลน์ (Backend)', 's4', 'in_progress', '2026-06-25', '2026-07-10', null, null, 70, 'https://github.com/aroi-delight/order-api'],
      ['t4', 'p1', 'เขียนคอนเทนต์และ SEO หน้าเมนูอาหาร', 's5', 'review', '2026-07-05', '2026-07-15', null, null, 90, 'https://docs.google.com/document/aroi-menu-seo'],
      ['t5', 'p1', 'ทดสอบระบบก่อนเปิดใช้งานจริง (QA)', 's5', 'not_started', '2026-07-22', '2026-07-28', null, null, 0, ''],
      ['t6', 'p1', 'ปรับแก้หน้า Landing Page รอบ 2', 's2', 'revision', '2026-07-14', '2026-07-16', null, null, 40, 'https://figma.com/file/aroi-landing-page-v2'],
      ['t7', 'p2', 'วางแผนกลยุทธ์การตลาดออนไลน์ไตรมาส 3', 's6', 'completed', '2026-06-10', '2026-06-18', null, '2026-06-17', 100, 'https://docs.google.com/document/marketing-strategy-q3'],
      ['t8', 'p2', 'ผลิตคอนเทนต์และถ่ายภาพสำหรับโซเชียลมีเดีย', 's2', 'completed', '2026-06-18', '2026-06-28', null, '2026-07-02', 100, 'https://drive.google.com/folder/aroi-social-content'],
      ['t9', 'p2', 'บริหารจัดการแคมเปญโฆษณา Facebook & Instagram Ads', 's6', 'in_progress', '2026-06-20', '2026-07-05', null, null, 60, 'https://business.facebook.com/adsmanager/aroi-delight'],
      ['t10', 'p2', 'ออกแบบกราฟิกโปรโมชั่นและป้ายประชาสัมพันธ์หน้าร้าน', 's2', 'in_progress', '2026-07-10', '2026-07-25', null, null, 30, 'https://figma.com/file/aroi-promo-graphics'],
      ['t11', 'p2', 'วางแผนความร่วมมือกับ Influencer ท้องถิ่น', 's6', 'not_started', '2026-07-21', '2026-08-02', null, null, 0, ''],
      ['t12', 'p2', 'จัดทำรายงานสรุปผลลัพธ์แคมเปญและงบประมาณ', 's5', 'review', '2026-07-08', '2026-07-17', null, null, 95, 'https://docs.google.com/document/campaign-performance-report'],
    ];
    for (const [id, projectId, name, assigneeId, status, startDate, originalDeadline, deadlineOverride, completedDate, progress, workLink] of tasks) {
      await client.query(
        `INSERT INTO tasks (id, project_id, name, assignee_id, status, start_date, original_deadline, deadline_override, completed_date, progress, work_link)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
        [id, projectId, name, assigneeId, status, startDate, originalDeadline, deadlineOverride, completedDate, progress, workLink]
      );
    }

    // t6 is manually flagged as waiting on the client (photo assets), independent of its 'revision' status
    await client.query(`UPDATE tasks SET waiting_on_client = true, waiting_note = $1 WHERE id = 't6'`,
      ['รอรูปถ่ายอาหารชุดใหม่จากลูกค้าเพื่อใช้ในหน้าเว็บ']);

    const revisions = [
      ['t1', '2026-06-29', 'ลูกค้า', 'ขอปรับโทนสีธีมให้เข้ากับโลโก้ร้าน', 2],
      ['t6', '2026-07-15', 'ลูกค้า', 'รอรูปถ่ายอาหารชุดใหม่จากลูกค้าเพื่อใส่ในหน้าเว็บ', 3],
      ['t8', '2026-06-27', 'ลูกค้า', 'ขอเปลี่ยนธีมภาพถ่ายจากโทนอบอุ่นเป็นโทนสดใสให้เข้ากับแคมเปญซัมเมอร์', 1],
    ];
    for (const [taskId, date, requestedBy, reason, daysAdded] of revisions) {
      await client.query(
        `INSERT INTO revisions (task_id, date, requested_by, reason, days_added) VALUES ($1,$2,$3,$4,$5)`,
        [taskId, date, requestedBy, reason, daysAdded]
      );
    }

    const files = [
      ['f1', 't1', 'landing-page-draft-v1.pdf', '#', 's2', '2026-06-28', 'rejected', 'ขอปรับโทนสีให้เข้ากับโลโก้ร้านมากขึ้น และเพิ่มรูปเมนูแนะนำ'],
      ['f2', 't1', 'landing-page-final-v2.pdf', '#', 's2', '2026-07-03', 'approved', 'อนุมัติแล้ว ใช้งานได้เลย'],
      ['f3', 't4', 'content-menu-seo-draft.docx', '#', 's5', '2026-07-16', 'pending', ''],
      ['f4', 't7', 'marketing-strategy-brief-q3.pdf', '#', 's6', '2026-06-17', 'approved', 'กลยุทธ์ชัดเจนดีมาก อนุมัติ'],
      ['f5', 't8', 'social-content-batch1.zip', '#', 's2', '2026-07-02', 'approved', ''],
      ['f6', 't12', 'campaign-performance-report.pdf', '#', 's5', '2026-07-17', 'pending', ''],
    ];
    for (const [id, taskId, name, link, uploadedBy, uploadedDate, status, comment] of files) {
      await client.query(
        `INSERT INTO files (id, task_id, name, link, uploaded_by, uploaded_date, status, comment) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
        [id, taskId, name, link, uploadedBy, uploadedDate, status, comment]
      );
    }

    const requests = [
      ['r1', 'p1', 'ct2', 'ขอเปลี่ยนรูปภาพหน้าปกเว็บไซต์', 'แก้ไขงาน', 'ปานกลาง', '2026-07-22', 'อยากเปลี่ยนรูปหน้าปกเป็นรูปที่ถ่ายใหม่ล่าสุดของทางร้าน', 'รับทราบแล้ว', '2026-07-15'],
      ['r2', 'p2', 'ct1', 'สอบถามความคืบหน้าแคมเปญโฆษณา', 'สอบถาม', 'สูง', null, 'อยากทราบว่าแคมเปญ Facebook & Instagram Ads คืบหน้าถึงไหนแล้ว เพราะกระทบกำหนดโปรโมชั่นสาขาใหม่', 'รอดำเนินการ', '2026-07-17'],
    ];
    for (const [id, projectId, requesterId, subject, category, priority, desiredDate, description, status, submittedDate] of requests) {
      await client.query(
        `INSERT INTO requests (id, project_id, requester_id, subject, category, priority, desired_date, description, status, submitted_date)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
        [id, projectId, requesterId, subject, category, priority, desiredDate, description, status, submittedDate]
      );
    }

    await client.query('COMMIT');
    console.log('Seed data inserted.');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}

async function initDb() {
  await applySchema();
  await seedIfEmpty();
}

module.exports = { initDb };
