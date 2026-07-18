/* =========================================================
   Client Portal Dashboard — mock data + rendering (vanilla JS)
   ========================================================= */

const TODAY = new Date('2026-07-18T00:00:00');
const TODAY_STR = '2026-07-18';

/* ---------- Icons (Feather-style, stroke based) ---------- */
const ICONS = {
  grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  list: '<line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><circle cx="3.6" cy="6" r="1"/><circle cx="3.6" cy="12" r="1"/><circle cx="3.6" cy="18" r="1"/>',
  timeline: '<line x1="3" y1="6" x2="13" y2="6"/><circle cx="16" cy="6" r="2.1"/><line x1="3" y1="12" x2="9" y2="12"/><circle cx="12" cy="12" r="2.1"/><line x1="3" y1="18" x2="17" y2="18"/><circle cx="20" cy="18" r="2.1"/>',
  file: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><polyline points="14 3 14 8 19 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="13" y2="17"/>',
  revision: '<polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>',
  alert: '<path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
  chat: '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="6.34" y2="6.34"/><line x1="17.66" y1="17.66" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="6.34" y2="17.66"/><line x1="17.66" y1="6.34" x2="19.07" y2="4.93"/>',
  moon: '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>',
  menu: '<line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>',
  close: '<line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/>',
  search: '<circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
  link: '<path d="M10 13a5 5 0 0 0 7.07 0l2.83-2.83a5 5 0 0 0-7.07-7.07L11.5 4.5"/><path d="M14 11a5 5 0 0 0-7.07 0L4.1 13.83a5 5 0 0 0 7.07 7.07L12.5 19.5"/>',
  check: '<polyline points="20 6 9 17 4 12"/>',
  plus: '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
  calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
  mail: '<path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/><polyline points="22 6 12 13 2 6"/>',
  phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.338 1.85.574 2.81.7A2 2 0 0 1 22 16.92z"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
  external: '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>',
  users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  trending: '<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>',
  clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  inbox: '<polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>',
  edit: '<path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>',
  trash: '<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/>',
};
function icon(name) {
  return `<span class="nav-icon"><svg viewBox="0 0 24 24">${ICONS[name] || ''}</svg></span>`;
}

/* ---------- Mock data ---------- */
const CLIENT = { name: 'Aroi Delight Co., Ltd.', industry: 'ธุรกิจร้านอาหาร' };

const PROJECTS = [
  { id: 'p1', name: 'เว็บไซต์ร้านอาหาร Aroi Delight', description: 'เว็บไซต์หลักของร้าน ครอบคลุมหน้า Landing, ระบบสั่งอาหารออนไลน์ และ SEO' },
  { id: 'p2', name: 'ระบบจองคิวออนไลน์ (สาขาใหม่)', description: 'ระบบจองคิวสำหรับลูกค้าที่สาขาใหม่ พร้อมแดชบอร์ดผู้ดูแลระบบ' },
];

const STAFF_SEED = [
  { id: 's1', name: 'พีรพัฒน์ วงศ์', role: 'Project Manager (PM)', email: 'peerapat.pm@agency.co.th', phone: '089-123-4567', line: '@peerapat.pm' },
  { id: 's2', name: 'สุชาดา อินทร์แก้ว', role: 'Producer & UI/UX Designer', email: 'suchada.d@agency.co.th', phone: '081-234-5678', line: '@suchada.design' },
  { id: 's3', name: 'ธนกร ศรีสุข', role: 'Developer (Frontend)', email: 'thanakorn.dev@agency.co.th', phone: '082-345-6789', line: '@thanakorn.fe' },
  { id: 's4', name: 'มนัสวี ชัยพร', role: 'Developer (Backend)', email: 'manasawee.dev@agency.co.th', phone: '083-456-7890', line: '@manasawee.be' },
  { id: 's5', name: 'อรวรรณ พงษ์ไพบูลย์', role: 'QA & Content', email: 'orawan.qa@agency.co.th', phone: '084-567-8901', line: '@orawan.qa' },
  { id: 's6', name: 'ชนากานต์ ทิพย์เนตร', role: 'Account Executive (AE)', email: 'chanakan.ae@agency.co.th', phone: '085-678-9012', line: '@chanakan.ae' },
];

const CLIENT_TEAM_SEED = [
  { id: 'ct1', name: 'คุณกัญญา รักษ์ไพศาล', role: 'เจ้าของร้าน (ผู้อนุมัติหลัก)', email: 'kanya@aroidelight.com', phone: '081-111-2222', primary: true },
  { id: 'ct2', name: 'คุณปวีณา ทองดี', role: 'ผู้จัดการฝ่ายการตลาด', email: 'paweena@aroidelight.com', phone: '082-222-3333', primary: false },
];

const TASKS = [
  { id: 't1', projectId: 'p1', name: 'ออกแบบ UI หน้า Landing Page', assigneeId: 's2', status: 'completed',
    startDate: '2026-06-20', originalDeadline: '2026-06-30', completedDate: '2026-07-03', progress: 100,
    workLink: 'https://figma.com/file/aroi-landing-page',
    revisions: [{ date: '2026-06-29', requestedBy: 'ลูกค้า', reason: 'ขอปรับโทนสีธีมให้เข้ากับโลโก้ร้าน', daysAdded: 2 }] },

  { id: 't2', projectId: 'p1', name: 'พัฒนาโครงสร้างหน้าเว็บไซต์ (Frontend)', assigneeId: 's3', status: 'in_progress',
    startDate: '2026-07-01', originalDeadline: '2026-07-20', completedDate: null, progress: 55,
    workLink: 'https://github.com/aroi-delight/web-frontend', revisions: [] },

  { id: 't3', projectId: 'p1', name: 'เชื่อมต่อระบบสั่งอาหารออนไลน์ (Backend)', assigneeId: 's4', status: 'in_progress',
    startDate: '2026-06-25', originalDeadline: '2026-07-10', completedDate: null, progress: 70,
    workLink: 'https://github.com/aroi-delight/order-api', revisions: [] },

  { id: 't4', projectId: 'p1', name: 'เขียนคอนเทนต์และ SEO หน้าเมนูอาหาร', assigneeId: 's5', status: 'review',
    startDate: '2026-07-05', originalDeadline: '2026-07-15', completedDate: null, progress: 90,
    workLink: 'https://docs.google.com/document/aroi-menu-seo', revisions: [] },

  { id: 't5', projectId: 'p1', name: 'ทดสอบระบบก่อนเปิดใช้งานจริง (QA)', assigneeId: 's5', status: 'not_started',
    startDate: '2026-07-22', originalDeadline: '2026-07-28', completedDate: null, progress: 0,
    workLink: '', revisions: [] },

  { id: 't6', projectId: 'p1', name: 'ปรับแก้หน้า Landing Page รอบ 2', assigneeId: 's2', status: 'revision',
    startDate: '2026-07-14', originalDeadline: '2026-07-16', completedDate: null, progress: 40,
    workLink: 'https://figma.com/file/aroi-landing-page-v2',
    revisions: [{ date: '2026-07-15', requestedBy: 'ลูกค้า', reason: 'รอรูปถ่ายอาหารชุดใหม่จากลูกค้าเพื่อใส่ในหน้าเว็บ', daysAdded: 3 }] },

  { id: 't7', projectId: 'p2', name: 'ออกแบบ Wireframe ระบบจองคิวทั้งหมด', assigneeId: 's2', status: 'completed',
    startDate: '2026-06-10', originalDeadline: '2026-06-18', completedDate: '2026-06-17', progress: 100,
    workLink: 'https://figma.com/file/queue-wireframe', revisions: [] },

  { id: 't8', projectId: 'p2', name: 'พัฒนาระบบ Login / Register', assigneeId: 's3', status: 'completed',
    startDate: '2026-06-18', originalDeadline: '2026-06-28', completedDate: '2026-07-02', progress: 100,
    workLink: 'https://github.com/aroi-delight/queue-auth-service',
    revisions: [{ date: '2026-06-27', requestedBy: 'ลูกค้า', reason: 'เปลี่ยนวิธียืนยันตัวตนจาก Email เป็น OTP ผ่าน SMS', daysAdded: 1 }] },

  { id: 't9', projectId: 'p2', name: 'พัฒนาระบบจองคิวหลัก (Core Queue Engine)', assigneeId: 's4', status: 'in_progress',
    startDate: '2026-06-20', originalDeadline: '2026-07-05', completedDate: null, progress: 60,
    workLink: 'https://github.com/aroi-delight/queue-engine', revisions: [] },

  { id: 't10', projectId: 'p2', name: 'ออกแบบ Dashboard ผู้ดูแลระบบ (Admin)', assigneeId: 's2', status: 'in_progress',
    startDate: '2026-07-10', originalDeadline: '2026-07-25', completedDate: null, progress: 30,
    workLink: 'https://figma.com/file/queue-admin', revisions: [] },

  { id: 't11', projectId: 'p2', name: 'พัฒนา API ระบบแจ้งเตือน (Notification)', assigneeId: 's3', status: 'not_started',
    startDate: '2026-07-21', originalDeadline: '2026-08-02', completedDate: null, progress: 0,
    workLink: '', revisions: [] },

  { id: 't12', projectId: 'p2', name: 'ตรวจสอบความปลอดภัยระบบชำระเงิน', assigneeId: 's4', status: 'review',
    startDate: '2026-07-08', originalDeadline: '2026-07-17', completedDate: null, progress: 95,
    workLink: 'https://docs.google.com/document/queue-security-report', revisions: [] },
];

const FILES_SEED = [
  { id: 'f1', taskId: 't1', name: 'landing-page-draft-v1.pdf', link: '#', uploadedBy: 's2', uploadedDate: '2026-06-28', status: 'rejected', comment: 'ขอปรับโทนสีให้เข้ากับโลโก้ร้านมากขึ้น และเพิ่มรูปเมนูแนะนำ' },
  { id: 'f2', taskId: 't1', name: 'landing-page-final-v2.pdf', link: '#', uploadedBy: 's2', uploadedDate: '2026-07-03', status: 'approved', comment: 'อนุมัติแล้ว ใช้งานได้เลย' },
  { id: 'f3', taskId: 't4', name: 'content-menu-seo-draft.docx', link: '#', uploadedBy: 's5', uploadedDate: '2026-07-16', status: 'pending', comment: '' },
  { id: 'f4', taskId: 't7', name: 'wireframe-all-screens.pdf', link: '#', uploadedBy: 's2', uploadedDate: '2026-06-17', status: 'approved', comment: 'ชัดเจนดีมาก อนุมัติ' },
  { id: 'f5', taskId: 't8', name: 'login-register-demo.mp4', link: '#', uploadedBy: 's3', uploadedDate: '2026-07-02', status: 'approved', comment: '' },
  { id: 'f6', taskId: 't12', name: 'security-review-report.pdf', link: '#', uploadedBy: 's4', uploadedDate: '2026-07-17', status: 'pending', comment: '' },
];

const REQUESTS_SEED = [
  { id: 'r1', projectId: 'p1', requesterId: 'ct2', subject: 'ขอเปลี่ยนรูปภาพหน้าปกเว็บไซต์', category: 'แก้ไขงาน', priority: 'ปานกลาง', desiredDate: '2026-07-22', description: 'อยากเปลี่ยนรูปหน้าปกเป็นรูปที่ถ่ายใหม่ล่าสุดของทางร้าน', status: 'รับทราบแล้ว', submittedDate: '2026-07-15' },
  { id: 'r2', projectId: 'p2', requesterId: 'ct1', subject: 'สอบถามความคืบหน้าระบบจองคิวหลัก', category: 'สอบถาม', priority: 'สูง', desiredDate: '', description: 'อยากทราบว่าระบบจองคิวหลักจะเสร็จเมื่อไหร่ เพราะกระทบกำหนดเปิดตัว', status: 'รอดำเนินการ', submittedDate: '2026-07-17' },
];

const STATUS_META = {
  not_started: { label: 'ยังไม่เริ่ม', badge: 'neutral' },
  in_progress: { label: 'กำลังดำเนินการ', badge: 'info' },
  review: { label: 'รอลูกค้าตรวจสอบ', badge: 'waiting' },
  revision: { label: 'กำลังแก้ไข', badge: 'warning' },
  completed: { label: 'เสร็จสิ้น', badge: 'success' },
};
const FILE_STATUS_META = {
  pending: { label: 'รอตรวจสอบ', badge: 'warning' },
  approved: { label: 'อนุมัติแล้ว', badge: 'success' },
  rejected: { label: 'ขอแก้ไข', badge: 'danger' },
};

/* ---------- Local persistence ---------- */
const store = {
  get(key, fallback) { try { const v = JSON.parse(localStorage.getItem(key)); return v == null ? fallback : v; } catch (e) { return fallback; } },
  set(key, val) { localStorage.setItem(key, JSON.stringify(val)); },
};
let deadlineOverrides = store.get('cp_deadline_overrides', {});
let linkOverrides = store.get('cp_link_overrides', {});
let assigneeOverrides = store.get('cp_assignee_overrides', {});
let waitingOverrides = store.get('cp_waiting_overrides', { t6: true });
let waitingNotes = store.get('cp_waiting_notes', { t6: 'รอรูปถ่ายอาหารชุดใหม่จากลูกค้าเพื่อใช้ในหน้าเว็บ' });
let fileOverrides = store.get('cp_file_overrides', {});
let extraFiles = store.get('cp_extra_files', []);
let extraRequests = store.get('cp_extra_requests', []);
let staff = store.get('cp_staff', STAFF_SEED);
let clientTeam = store.get('cp_client_team', CLIENT_TEAM_SEED);

/* ---------- Date helpers ---------- */
const THAI_MONTHS = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
function parseDate(s) { return new Date(s + 'T00:00:00'); }
function toISO(d) { return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; }
function fmtDate(s) {
  if (!s) return '—';
  const d = parseDate(s);
  return `${d.getDate()} ${THAI_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}
function fmtDateShort(s) {
  if (!s) return '—';
  const d = parseDate(s);
  return `${d.getDate()} ${THAI_MONTHS[d.getMonth()]}`;
}
function addDays(s, n) { const d = parseDate(s); d.setDate(d.getDate() + n); return toISO(d); }
function diffDays(fromStr, toStr) { return Math.round((parseDate(toStr) - parseDate(fromStr)) / 86400000); }

function getStaff(id) { return staff.find(s => s.id === id) || staff[0]; }
function getAssignee(task) { return getStaff(assigneeOverrides[task.id] || task.assigneeId); }
function getClientPerson(id) { return clientTeam.find(c => c.id === id); }
function getPrimaryClientContact() { return clientTeam.find(c => c.primary) || clientTeam[0]; }
function getProject(id) { return PROJECTS.find(p => p.id === id); }

function getCurrentDeadline(task) {
  if (deadlineOverrides[task.id]) return deadlineOverrides[task.id];
  const extra = (task.revisions || []).reduce((sum, r) => sum + (r.daysAdded || 0), 0);
  return addDays(task.originalDeadline, extra);
}
function getWorkLink(task) { return linkOverrides[task.id] !== undefined ? linkOverrides[task.id] : task.workLink; }

function isWaitingOnClient(task) {
  const ov = waitingOverrides[task.id];
  if (typeof ov === 'boolean') return ov;
  return task.status === 'review';
}
function getWaitingNote(task) {
  if (waitingNotes[task.id]) return waitingNotes[task.id];
  if (task.status === 'review') return 'ส่งงานให้ลูกค้าตรวจสอบแล้ว กำลังรอการอนุมัติ/ฟีดแบ็ก';
  return '';
}

function getDelayInfo(task) {
  const current = getCurrentDeadline(task);
  if (task.status === 'completed') {
    const d = diffDays(current, task.completedDate);
    return { days: Math.max(0, d), late: d > 0, label: d > 0 ? `ส่งช้ากว่ากำหนด ${d} วัน` : d < 0 ? `ส่งก่อนกำหนด ${-d} วัน` : 'ส่งตรงเวลา' };
  }
  const d = diffDays(current, TODAY_STR);
  return { days: Math.max(0, d), late: d > 0, label: d > 0 ? `ล่าช้า ${d} วัน` : d === 0 ? 'ครบกำหนดวันนี้' : `เหลือเวลา ${-d} วัน` };
}

function allFiles() { return [...FILES_SEED, ...extraFiles].map(f => fileOverrides[f.id] ? { ...f, ...fileOverrides[f.id] } : f); }
function allRequests() { return [...REQUESTS_SEED, ...extraRequests]; }

/* ---------- App state ---------- */
const state = { view: 'dashboard', project: 'all', statusFilter: 'all', search: '' };

function filteredTasks() {
  return TASKS.filter(t => {
    if (state.project !== 'all' && t.projectId !== state.project) return false;
    if (state.statusFilter !== 'all' && t.status !== state.statusFilter) return false;
    if (state.search) {
      const q = state.search.toLowerCase();
      const assignee = getAssignee(t);
      if (!t.name.toLowerCase().includes(q) && !(assignee && assignee.name.toLowerCase().includes(q))) return false;
    }
    return true;
  });
}

/* ---------- Toast ---------- */
let toastTimer;
function toast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2600);
}

function initials(name) { const parts = name.trim().split(' '); return parts.length > 1 ? parts[0][0] + parts[1][0] : name.slice(0, 2); }
function waitingTag(t) { return isWaitingOnClient(t) ? `<span class="badge badge-waiting">${icon('clock')} รอลูกค้า</span>` : ''; }

/* =========================================================
   RENDER: Dashboard
   ========================================================= */
function renderDashboard() {
  const tasks = filteredTasks();
  const total = tasks.length;
  const completed = tasks.filter(t => t.status === 'completed').length;
  const active = tasks.filter(t => t.status !== 'completed');
  const lateOur = active.filter(t => getDelayInfo(t).late && !isWaitingOnClient(t)).length;
  const lateClient = active.filter(t => getDelayInfo(t).late && isWaitingOnClient(t)).length;
  const avgProgress = total ? Math.round(tasks.reduce((s, t) => s + t.progress, 0) / total) : 0;

  const kpis = [
    { label: 'งานทั้งหมด', value: total, icon: 'list', color: 'info', delta: `${active.length} กำลังดำเนินการ` },
    { label: 'เสร็จสิ้นแล้ว', value: completed, icon: 'check', color: 'success', delta: total ? `${Math.round(completed / total * 100)}% ของทั้งหมด` : '—' },
    { label: 'ล่าช้าฝั่งเรา', value: lateOur, icon: 'alert', color: 'danger', delta: lateOur ? 'ต้องติดตามด่วน' : 'ไม่มีงานล่าช้า' },
    { label: 'รอลูกค้าดำเนินการ', value: lateClient, icon: 'clock', color: 'waiting', delta: lateClient ? 'รอคำตอบ/ไฟล์จากลูกค้า' : 'ไม่มีงานรอ' },
  ];

  const kpiHtml = kpis.map(k => `
    <div class="card kpi-card">
      <div class="kpi-top">
        <div class="kpi-icon" style="background:var(--${k.color}-soft);color:var(--${k.color})">${icon(k.icon)}</div>
      </div>
      <div class="kpi-value">${k.value}</div>
      <div class="kpi-label">${k.label}</div>
      <span class="kpi-delta" style="background:var(--bg-soft);color:var(--text-muted)">${k.delta}</span>
    </div>`).join('');

  const projList = state.project === 'all' ? PROJECTS : PROJECTS.filter(p => p.id === state.project);
  const projRows = projList.map(p => {
    const pt = TASKS.filter(t => t.projectId === p.id);
    const pc = pt.filter(t => t.status === 'completed').length;
    const pct = pt.length ? Math.round(pc / pt.length * 100) : 0;
    return `
      <div style="margin-bottom:16px">
        <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:6px">
          <strong>${p.name}</strong>
          <span class="mono" style="color:var(--text-muted)">${pc}/${pt.length} งานเสร็จ · ${pct}%</span>
        </div>
        <div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div>
      </div>`;
  }).join('');

  const circumference = 2 * Math.PI * 58;
  const offset = circumference * (1 - avgProgress / 100);

  const upcoming = active
    .map(t => ({ t, d: getDelayInfo(t), dl: getCurrentDeadline(t) }))
    .sort((a, b) => diffDays(TODAY_STR, a.dl) - diffDays(TODAY_STR, b.dl))
    .slice(0, 6);

  const upcomingRows = upcoming.length ? upcoming.map(({ t, d, dl }) => {
    const assignee = getAssignee(t);
    return `<tr>
      <td><div class="row-name">${t.name}</div><div class="row-sub">${getProject(t.projectId).name}</div></td>
      <td><div class="assignee"><div class="avatar">${initials(assignee.name)}</div><div><div>${assignee.name}</div><div class="row-sub">${assignee.role}</div></div></div></td>
      <td>${fmtDateShort(dl)}</td>
      <td><span class="delay-pill ${d.late ? 'late' : 'ontime'}">${d.label}</span> ${waitingTag(t)}</td>
    </tr>`;
  }).join('') : `<tr><td colspan="4"><div class="empty-state">${icon('inbox')}<p>ไม่มีงานที่ใกล้ถึงกำหนด</p></div></td></tr>`;

  document.getElementById('view-dashboard').innerHTML = `
    <div class="client-projects-note">${icon('users')} กำลังทำงานร่วมกับ <strong>${CLIENT.name}</strong> ใน ${PROJECTS.length} โปรเจกต์</div>
    <div class="grid kpi-grid">${kpiHtml}</div>
    <div class="grid two-col" style="margin-bottom:22px">
      <div class="card">
        <div class="section-head"><div><h2>ความคืบหน้ารายโปรเจกต์</h2><div class="hint">สัดส่วนงานที่เสร็จสิ้นแล้วในแต่ละโปรเจกต์</div></div></div>
        ${projRows}
      </div>
      <div class="card" style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px">
        <div class="ring-wrap">
          <svg viewBox="0 0 132 132">
            <circle class="ring-bg" cx="66" cy="66" r="58"/>
            <circle class="ring-fg" cx="66" cy="66" r="58" stroke-dasharray="${circumference}" stroke-dashoffset="${offset}"/>
          </svg>
          <div class="ring-center"><strong>${avgProgress}%</strong><span>ความคืบหน้ารวม</span></div>
        </div>
        <div style="display:flex;gap:14px;flex-wrap:wrap;justify-content:center">
          ${Object.entries(STATUS_META).map(([k, m]) => {
            const c = tasks.filter(t => t.status === k).length;
            return `<span class="badge badge-${m.badge}">${m.label} · ${c}</span>`;
          }).join('')}
        </div>
      </div>
    </div>
    <div class="section-head"><div><h2>งานใกล้ถึงกำหนดส่ง</h2><div class="hint">เรียงตามวันที่ใกล้ครบกำหนดที่สุด</div></div></div>
    <div class="table-wrap">
      <table>
        <thead><tr><th>งาน</th><th>ผู้รับผิดชอบ</th><th>กำหนดส่ง</th><th>สถานะเวลา</th></tr></thead>
        <tbody>${upcomingRows}</tbody>
      </table>
    </div>`;
}

/* =========================================================
   RENDER: Task Tracking
   ========================================================= */
function renderTasks() {
  const tasks = filteredTasks();
  const statusChips = ['all', ...Object.keys(STATUS_META)].map(s => {
    const label = s === 'all' ? 'ทั้งหมด' : STATUS_META[s].label;
    return `<button class="filter-chip ${state.statusFilter === s ? 'active' : ''}" data-action="status-filter" data-status="${s}">${label}</button>`;
  }).join('');

  const rows = tasks.length ? tasks.map(t => {
    const assignee = getAssignee(t);
    const meta = STATUS_META[t.status];
    const cur = getCurrentDeadline(t);
    const changed = cur !== t.originalDeadline;
    const delay = getDelayInfo(t);
    const link = getWorkLink(t);
    return `<tr>
      <td><div class="row-name">${t.name}</div><div class="row-sub">${getProject(t.projectId).name}</div></td>
      <td><div class="assignee"><div class="avatar">${initials(assignee.name)}</div><div><div>${assignee.name}</div><div class="row-sub">${assignee.role}</div></div></div></td>
      <td><span class="badge badge-${meta.badge}">${meta.label}</span> ${t.status !== 'review' ? waitingTag(t) : ''}</td>
      <td style="min-width:120px">
        <div class="progress-track"><div class="progress-fill" style="width:${t.progress}%"></div></div>
        <div class="row-sub mono">${t.progress}%</div>
      </td>
      <td>${fmtDateShort(t.originalDeadline)}</td>
      <td>${fmtDateShort(cur)}${changed ? `<div class="row-sub">+${diffDays(t.originalDeadline, cur)} วันจากแก้ไข</div>` : ''}</td>
      <td><span class="delay-pill ${delay.late ? 'late' : 'ontime'}">${delay.label}</span></td>
      <td>${link ? `<a class="link-cell" href="${link}" target="_blank" rel="noopener">${icon('external')} เปิดลิงก์</a>` : '<span class="row-sub">ยังไม่มีลิงก์</span>'}</td>
      <td><button class="btn btn-sm" data-action="open-task" data-id="${t.id}">รายละเอียด</button></td>
    </tr>`;
  }).join('') : `<tr><td colspan="9"><div class="empty-state">${icon('inbox')}<p>ไม่พบงานที่ตรงกับตัวกรอง</p></div></td></tr>`;

  document.getElementById('view-tasks').innerHTML = `
    <div class="toolbar">${statusChips}</div>
    <div class="table-wrap">
      <table>
        <thead><tr><th>งาน</th><th>ผู้รับผิดชอบ</th><th>สถานะ</th><th>ความคืบหน้า</th><th>เดดไลน์เดิม</th><th>เดดไลน์ล่าสุด</th><th>สถานะเวลา</th><th>ลิงก์งาน</th><th></th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
}

/* =========================================================
   RENDER: Timeline
   ========================================================= */
function renderTimeline() {
  const tasks = filteredTasks();
  if (!tasks.length) {
    document.getElementById('view-timeline').innerHTML = `<div class="card"><div class="empty-state">${icon('inbox')}<p>ไม่พบงานที่ตรงกับตัวกรอง</p></div></div>`;
    return;
  }
  const starts = tasks.map(t => parseDate(t.startDate).getTime());
  const ends = tasks.map(t => parseDate(t.completedDate || getCurrentDeadline(t)).getTime());
  let min = Math.min(...starts);
  let max = Math.max(...ends, TODAY.getTime());
  min -= 2 * 86400000; max += 2 * 86400000;
  const span = max - min;

  const legend = `
    <div class="timeline-legend">
      <span><i style="background:var(--text-faint)"></i>ยังไม่เริ่ม</span>
      <span><i style="background:var(--info)"></i>กำลังดำเนินการ</span>
      <span><i style="background:var(--waiting)"></i>รอลูกค้าตรวจสอบ</span>
      <span><i style="background:var(--warning)"></i>กำลังแก้ไข</span>
      <span><i style="background:var(--success)"></i>เสร็จสิ้น</span>
      <span><i style="background:var(--danger)"></i>เส้นวันนี้</span>
    </div>`;

  const tickCount = 5;
  const ticks = Array.from({ length: tickCount }, (_, i) => {
    const t = min + (span * i) / (tickCount - 1);
    const pct = (i / (tickCount - 1)) * 100;
    return `<span class="gantt-scale-tick" style="left:${pct}%">${fmtDateShort(toISO(new Date(t)))}</span>`;
  }).join('');

  const todayPct = ((TODAY.getTime() - min) / span) * 100;

  const rows = tasks.map(t => {
    const s = parseDate(t.startDate).getTime();
    const e = parseDate(t.completedDate || getCurrentDeadline(t)).getTime();
    const left = ((s - min) / span) * 100;
    const width = Math.max(((e - s) / span) * 100, 2.5);
    const assignee = getAssignee(t);
    return `
      <div class="gantt-row">
        <div class="gantt-label">${t.name}<div class="row-sub">${assignee.name}</div></div>
        <div class="gantt-track" title="${fmtDate(t.startDate)} — ${fmtDate(t.completedDate || getCurrentDeadline(t))}">
          <div class="gantt-bar status-${t.status}" style="left:${left}%;width:${width}%">${t.progress}%</div>
          ${todayPct >= 0 && todayPct <= 100 ? `<div class="gantt-today" style="left:${todayPct}%"></div>` : ''}
        </div>
      </div>`;
  }).join('');

  document.getElementById('view-timeline').innerHTML = `
    <div class="card">
      ${legend}
      <div class="gantt-scale"><div></div><div class="gantt-scale-track">${ticks}</div></div>
      <div class="gantt">${rows}</div>
    </div>`;
}

/* =========================================================
   RENDER: Files & Approval
   ========================================================= */
function renderFiles() {
  const tasks = filteredTasks();
  const taskIds = new Set(tasks.map(t => t.id));
  const files = allFiles().filter(f => taskIds.has(f.taskId)).sort((a, b) => b.uploadedDate.localeCompare(a.uploadedDate));

  const taskOptions = tasks.map(t => `<option value="${t.id}">${t.name}</option>`).join('');

  const cards = files.length ? files.map(f => {
    const task = TASKS.find(t => t.id === f.taskId);
    const uploader = getStaff(f.uploadedBy);
    const meta = FILE_STATUS_META[f.status];
    return `
      <div class="card file-card">
        <div class="file-head">
          <div class="file-icon">${icon('file')}</div>
          <div class="file-meta">
            <strong>${f.name}</strong>
            <span>${task.name}</span>
          </div>
        </div>
        <div class="row-sub">ส่งโดย ${uploader.name} · ${fmtDateShort(f.uploadedDate)}</div>
        <span class="badge badge-${meta.badge}" style="width:fit-content">${meta.label}</span>
        ${f.comment ? `<div class="file-comment">${f.comment}</div>` : ''}
        <div class="file-actions">
          <a class="btn btn-sm" href="${f.link}" target="_blank" rel="noopener">${icon('external')} เปิดไฟล์</a>
          ${f.status === 'pending' ? `
            <button class="btn btn-sm btn-success" data-action="approve-file" data-id="${f.id}">${icon('check')} อนุมัติ</button>
            <button class="btn btn-sm btn-danger" data-action="reject-file" data-id="${f.id}">${icon('close')} ขอแก้ไข</button>` : ''}
        </div>
      </div>`;
  }).join('') : `<div class="card"><div class="empty-state">${icon('inbox')}<p>ยังไม่มีไฟล์งานในโปรเจกต์นี้</p></div></div>`;

  document.getElementById('view-files').innerHTML = `
    <div class="card" style="margin-bottom:20px">
      <div class="section-head"><div><h2>ส่งลิงก์งานใหม่</h2><div class="hint">แนบลิงก์ไฟล์หรือผลงานเพื่อให้ลูกค้าตรวจและอนุมัติ</div></div></div>
      <form class="add-link-form" data-form="add-link">
        <select name="taskId" required>${taskOptions}</select>
        <input type="text" name="name" placeholder="ชื่อไฟล์ เช่น homepage-v3.pdf" required>
        <input type="url" name="link" placeholder="วางลิงก์ไฟล์งาน (Google Drive, Figma, GitHub...)" required>
        <button class="btn btn-primary" type="submit">${icon('plus')} ส่งลิงก์</button>
      </form>
    </div>
    <div class="grid file-grid">${cards}</div>`;
}

/* =========================================================
   RENDER: Revision Tracking
   ========================================================= */
function renderRevisions() {
  const tasks = filteredTasks();
  const rows = [];
  tasks.forEach(t => (t.revisions || []).forEach(r => rows.push({ t, r })));
  rows.sort((a, b) => b.r.date.localeCompare(a.r.date));

  const totalDays = rows.reduce((s, x) => s + x.r.daysAdded, 0);
  const summary = `
    <div class="grid kpi-grid" style="margin-bottom:22px">
      <div class="card kpi-card">
        <div class="kpi-icon" style="background:var(--warning-soft);color:var(--warning)">${icon('revision')}</div>
        <div class="kpi-value">${rows.length}</div>
        <div class="kpi-label">คำขอแก้ไขทั้งหมด</div>
      </div>
      <div class="card kpi-card">
        <div class="kpi-icon" style="background:var(--danger-soft);color:var(--danger)">${icon('clock')}</div>
        <div class="kpi-value">${totalDays} วัน</div>
        <div class="kpi-label">รวมวันที่เพิ่มจากเดดไลน์เดิม</div>
      </div>
      <div class="card kpi-card">
        <div class="kpi-icon" style="background:var(--info-soft);color:var(--info)">${icon('list')}</div>
        <div class="kpi-value">${rows.length ? Math.round(totalDays / rows.length * 10) / 10 : 0}</div>
        <div class="kpi-label">วันเฉลี่ยต่อคำขอ</div>
      </div>
    </div>`;

  const body = rows.length ? rows.map(({ t, r }) => `
    <tr>
      <td><div class="row-name">${t.name}</div><div class="row-sub">${getProject(t.projectId).name}</div></td>
      <td>${r.requestedBy}</td>
      <td>${fmtDateShort(r.date)}</td>
      <td style="max-width:260px">${r.reason}</td>
      <td><span class="badge badge-warning">+${r.daysAdded} วัน</span></td>
      <td>${fmtDateShort(t.originalDeadline)} → <strong>${fmtDateShort(getCurrentDeadline(t))}</strong></td>
    </tr>`).join('') : `<tr><td colspan="6"><div class="empty-state">${icon('inbox')}<p>ยังไม่มีคำขอแก้ไขงานในโปรเจกต์นี้</p></div></td></tr>`;

  document.getElementById('view-revisions').innerHTML = `
    ${summary}
    <div class="table-wrap">
      <table>
        <thead><tr><th>งาน</th><th>ผู้ขอแก้ไข</th><th>วันที่ขอ</th><th>เหตุผล</th><th>วันที่เพิ่ม</th><th>เดดไลน์เดิม → ใหม่</th></tr></thead>
        <tbody>${body}</tbody>
      </table>
    </div>`;
}

/* =========================================================
   RENDER: Delay Report
   ========================================================= */
function renderDelays() {
  const tasks = filteredTasks();
  const withDelay = tasks.map(t => ({ t, d: getDelayInfo(t) }));
  const activeLate = withDelay.filter(x => x.t.status !== 'completed' && x.d.late).sort((a, b) => b.d.days - a.d.days);
  const historyLate = withDelay.filter(x => x.t.status === 'completed' && x.d.late).sort((a, b) => b.d.days - a.d.days);

  const ourDelay = activeLate.filter(x => !isWaitingOnClient(x.t));
  const clientWait = activeLate.filter(x => isWaitingOnClient(x.t));

  const byStaff = {};
  ourDelay.forEach(({ t, d }) => {
    const a = getAssignee(t);
    byStaff[a.id] = (byStaff[a.id] || 0) + d.days;
  });
  const staffBars = Object.entries(byStaff).sort((a, b) => b[1] - a[1]);
  const maxStaffDays = staffBars.length ? staffBars[0][1] : 1;

  const worstOur = ourDelay[0];
  const worstClient = clientWait[0];

  let callouts = '';
  if (worstOur) {
    callouts += `
    <div class="callout callout-danger" style="margin-bottom:14px">
      ${icon('alert')}
      <div>
        <strong>ล่าช้าฝั่งเราที่สุดตอนนี้: ${worstOur.t.name}</strong>
        <p>รับผิดชอบโดย ${getAssignee(worstOur.t).name} — ${worstOur.d.label} จากกำหนดส่ง ${fmtDate(getCurrentDeadline(worstOur.t))} ควรติดตามด่วน</p>
      </div>
    </div>`;
  }
  if (worstClient) {
    callouts += `
    <div class="callout" style="margin-bottom:14px;background:var(--waiting-soft)">
      ${icon('clock')}
      <div>
        <strong>รอลูกค้านานที่สุด: ${worstClient.t.name}</strong>
        <p>${getWaitingNote(worstClient.t)} — รอมาแล้ว ${worstClient.d.days} วัน อาจต้องติดตามลูกค้าเพิ่มเติม</p>
      </div>
    </div>`;
  }
  if (!worstOur && !worstClient) {
    callouts = `
    <div class="callout" style="margin-bottom:14px;background:var(--success-soft)">
      ${icon('check')}
      <div><strong>ไม่มีงานล่าช้าในขณะนี้</strong><p>ทุกงานอยู่ในกำหนดเวลาที่ตกลงกันไว้</p></div>
    </div>`;
  }

  const barsHtml = staffBars.length ? staffBars.map(([sid, days]) => {
    const s = getStaff(sid);
    return `
      <div class="delay-bar-row">
        <div class="delay-bar-name">${s.name}</div>
        <div class="delay-bar-track"><div class="delay-bar-fill" style="width:${Math.round(days / maxStaffDays * 100)}%"></div></div>
        <div class="delay-bar-value">${days}วัน</div>
      </div>`;
  }).join('') : `<div class="empty-state">${icon('inbox')}<p>ไม่มีข้อมูลความล่าช้าฝั่งเรา</p></div>`;

  const ourRows = ourDelay.length ? ourDelay.map(({ t, d }) => `
    <tr>
      <td><div class="row-name">${t.name}</div><div class="row-sub">${getProject(t.projectId).name}</div></td>
      <td><div class="assignee"><div class="avatar">${initials(getAssignee(t).name)}</div>${getAssignee(t).name}</div></td>
      <td>${fmtDateShort(t.originalDeadline)}</td>
      <td>${fmtDateShort(getCurrentDeadline(t))}</td>
      <td><span class="delay-pill late">${d.label}</span></td>
      <td><span class="badge badge-${STATUS_META[t.status].badge}">${STATUS_META[t.status].label}</span></td>
    </tr>`).join('') : `<tr><td colspan="6"><div class="empty-state">${icon('check')}<p>ไม่มีงานที่ล่าช้าฝั่งเราในขณะนี้</p></div></td></tr>`;

  const clientRows = clientWait.length ? clientWait.map(({ t, d }) => `
    <tr>
      <td><div class="row-name">${t.name}</div><div class="row-sub">${getProject(t.projectId).name}</div></td>
      <td>${getAssignee(t).name}</td>
      <td style="max-width:220px">${getWaitingNote(t)}</td>
      <td><span class="badge badge-waiting">รอมาแล้ว ${d.days} วัน</span></td>
    </tr>`).join('') : `<tr><td colspan="4"><div class="empty-state">${icon('check')}<p>ไม่มีงานที่รอลูกค้าอยู่ในขณะนี้</p></div></td></tr>`;

  const historyRows = historyLate.length ? historyLate.map(({ t, d }) => `
    <tr>
      <td><div class="row-name">${t.name}</div><div class="row-sub">${getProject(t.projectId).name}</div></td>
      <td>${getAssignee(t).name}</td>
      <td>${fmtDateShort(getCurrentDeadline(t))}</td>
      <td>${fmtDateShort(t.completedDate)}</td>
      <td><span class="delay-pill late">${d.label}</span></td>
    </tr>`).join('') : `<tr><td colspan="5"><div class="empty-state"><p>ไม่มีประวัติการส่งงานล่าช้า</p></div></td></tr>`;

  document.getElementById('view-delays').innerHTML = `
    ${callouts}
    <div class="grid two-col" style="margin-bottom:24px">
      <div class="card">
        <div class="section-head"><div><h2>ล่าช้าฝั่งเรา (ทีมงาน)</h2><div class="hint">เรียงจากล่าช้ามากไปน้อย</div></div></div>
        <div class="table-wrap" style="box-shadow:none">
          <table><thead><tr><th>งาน</th><th>ผู้รับผิดชอบ</th><th>เดดไลน์เดิม</th><th>เดดไลน์ล่าสุด</th><th>ล่าช้า</th><th>สถานะ</th></tr></thead>
          <tbody>${ourRows}</tbody></table>
        </div>
      </div>
      <div class="card">
        <div class="section-head"><div><h2>ล่าช้ารวมตามผู้รับผิดชอบ</h2><div class="hint">จำนวนวันล่าช้าสะสม (เฉพาะที่เป็นความรับผิดชอบของเรา)</div></div></div>
        ${barsHtml}
      </div>
    </div>
    <div class="section-head"><div><h2>รอดำเนินการจากฝั่งลูกค้า</h2><div class="hint">งานที่เราส่งมอบแล้ว แต่ยังรอไฟล์/การอนุมัติ/ฟีดแบ็กจากลูกค้า</div></div></div>
    <div class="table-wrap" style="margin-bottom:24px">
      <table><thead><tr><th>งาน</th><th>ผู้ส่งงาน</th><th>รอเรื่องอะไร</th><th>ระยะเวลาที่รอ</th></tr></thead>
      <tbody>${clientRows}</tbody></table>
    </div>
    <div class="section-head"><div><h2>ประวัติงานที่เคยส่งล่าช้า (เสร็จแล้ว)</h2></div></div>
    <div class="table-wrap">
      <table><thead><tr><th>งาน</th><th>ผู้รับผิดชอบ</th><th>เดดไลน์ล่าสุด</th><th>วันที่ส่งจริง</th><th>ผลลัพธ์</th></tr></thead>
      <tbody>${historyRows}</tbody></table>
    </div>`;
}

/* =========================================================
   RENDER: Contact & Requests
   ========================================================= */
function renderContact() {
  const staffCards = staff.map(s => `
    <div class="card staff-card side-us">
      <div class="person-card-top">
        <div class="avatar">${initials(s.name)}</div>
        <div class="person-actions">
          <button class="icon-btn-sm" data-action="edit-person" data-kind="staff" data-id="${s.id}" title="แก้ไข">${icon('edit')}</button>
        </div>
      </div>
      <div>
        <strong>${s.name}</strong>
        <div class="role">${s.role}</div>
      </div>
      <div class="staff-contact-row">${icon('mail')} <a href="mailto:${s.email}">${s.email}</a></div>
      <div class="staff-contact-row">${icon('phone')} <a href="tel:${s.phone.replace(/-/g,'')}">${s.phone}</a></div>
      <div class="staff-contact-row">${icon('chat')} Line: ${s.line || '—'}</div>
    </div>`).join('');

  const clientCards = clientTeam.map(c => `
    <div class="card staff-card side-client">
      <div class="person-card-top">
        <div class="avatar">${initials(c.name)}</div>
        <div class="person-actions">
          <button class="icon-btn-sm" data-action="edit-person" data-kind="client" data-id="${c.id}" title="แก้ไข">${icon('edit')}</button>
        </div>
      </div>
      <div>
        <strong>${c.name}</strong>
        <div class="role">${c.role}</div>
      </div>
      ${c.primary ? `<span class="tag-primary">ผู้ติดต่อหลัก</span>` : ''}
      <div class="staff-contact-row">${icon('mail')} <a href="mailto:${c.email}">${c.email}</a></div>
      <div class="staff-contact-row">${icon('phone')} <a href="tel:${c.phone.replace(/-/g,'')}">${c.phone}</a></div>
    </div>`).join('');

  const projectOptions = PROJECTS.map(p => `<option value="${p.id}">${p.name}</option>`).join('');
  const primaryContact = getPrimaryClientContact();
  const requesterOptions = clientTeam.map(c => `<option value="${c.id}" ${primaryContact && c.id === primaryContact.id ? 'selected' : ''}>${c.name} (${c.role})</option>`).join('');

  const reqList = allRequests().slice().sort((a, b) => b.submittedDate.localeCompare(a.submittedDate)).map(r => {
    const requester = getClientPerson(r.requesterId);
    return `
    <div class="request-item">
      <div>
        <h4>${r.subject}</h4>
        <p>${r.description}</p>
        <div class="meta">
          <span>${getProject(r.projectId).name}</span>
          <span>หมวด: ${r.category}</span>
          <span>ความสำคัญ: ${r.priority}</span>
          ${r.desiredDate ? `<span>ต้องการภายใน: ${fmtDateShort(r.desiredDate)}</span>` : ''}
          <span>ส่งโดย ${requester ? requester.name : 'ไม่ระบุ'} · ${fmtDateShort(r.submittedDate)}</span>
        </div>
      </div>
      <span class="badge badge-${r.status === 'รอดำเนินการ' ? 'warning' : r.status === 'รับทราบแล้ว' ? 'info' : 'success'}" style="height:fit-content">${r.status}</span>
    </div>`;
  }).join('');

  document.getElementById('view-contact').innerHTML = `
    <div class="section-block">
      <div class="section-head"><div><h2>ทีมงานฝั่งเรา</h2><div class="hint">ทีมที่ดูแลโปรเจกต์ของคุณ ติดต่อได้โดยตรงตามช่องทางด้านล่าง</div></div></div>
      <div class="grid staff-grid">
        ${staffCards}
        <button class="add-person-card" data-action="add-person" data-kind="staff">${icon('plus')} เพิ่มทีมงาน</button>
      </div>
    </div>

    <div class="section-block">
      <div class="section-head"><div><h2>ทีมงานฝั่งคุณ</h2><div class="hint">รายชื่อผู้ติดต่อฝั่งลูกค้า ไม่ว่าจะติดต่อเราคนเดียวหรือมีทีม สามารถเพิ่ม/แก้ไขได้เอง</div></div></div>
      <div class="grid staff-grid">
        ${clientCards}
        <button class="add-person-card" data-action="add-person" data-kind="client">${icon('plus')} เพิ่มผู้ติดต่อ</button>
      </div>
    </div>

    <div class="card" style="margin-bottom:24px">
      <div class="section-head"><div><h2>ส่งคำขอถึงทีมงาน</h2><div class="hint">แจ้งขอแก้ไขงาน ของานเพิ่ม หรือสอบถามความคืบหน้า พร้อมกำหนดวันที่ต้องการ</div></div></div>
      <form class="form-grid" data-form="request">
        <div class="form-field full"><label>หัวข้อ</label><input type="text" name="subject" placeholder="เช่น ขอแก้ไขสีปุ่มหน้าแรก" required></div>
        <div class="form-field"><label>ผู้ส่งคำขอ</label><select name="requesterId">${requesterOptions}</select></div>
        <div class="form-field"><label>โปรเจกต์</label><select name="projectId">${projectOptions}</select></div>
        <div class="form-field"><label>ประเภทคำขอ</label>
          <select name="category">
            <option>แก้ไขงาน</option><option>ของานเพิ่ม</option><option>สอบถาม</option><option>เร่งด่วนอื่นๆ</option>
          </select>
        </div>
        <div class="form-field"><label>ความสำคัญ</label>
          <select name="priority"><option>ต่ำ</option><option selected>ปานกลาง</option><option>สูง</option><option>เร่งด่วน</option></select>
        </div>
        <div class="form-field"><label>ต้องการภายในวันที่</label><input type="date" name="desiredDate"></div>
        <div class="form-field full"><label>รายละเอียด</label><textarea name="description" rows="3" placeholder="อธิบายรายละเอียดคำขอของคุณ" required></textarea></div>
        <div class="form-field full"><button class="btn btn-primary" type="submit">${icon('plus')} ส่งคำขอ</button></div>
      </form>
    </div>

    <div class="section-head"><div><h2>คำขอที่ส่งไปแล้ว</h2></div></div>
    <div class="card">${reqList || `<div class="empty-state">${icon('inbox')}<p>ยังไม่มีคำขอ</p></div>`}</div>`;
}

/* =========================================================
   Task detail modal
   ========================================================= */
function openTaskModal(id) {
  const t = TASKS.find(x => x.id === id);
  const assignee = getAssignee(t);
  const meta = STATUS_META[t.status];
  const cur = getCurrentDeadline(t);
  const delay = getDelayInfo(t);
  const link = getWorkLink(t);
  const files = allFiles().filter(f => f.taskId === t.id);

  const revisionsHtml = (t.revisions || []).length ? t.revisions.map(r => `
    <div style="padding:10px 0;border-bottom:1px solid var(--border)">
      <div style="display:flex;justify-content:space-between"><strong style="font-size:13px">${fmtDateShort(r.date)} · ${r.requestedBy}</strong><span class="badge badge-warning">+${r.daysAdded} วัน</span></div>
      <p style="font-size:12.5px;color:var(--text-muted);margin-top:4px">${r.reason}</p>
    </div>`).join('') : `<p class="row-sub">ไม่มีประวัติการขอแก้ไข</p>`;

  const filesHtml = files.length ? files.map(f => `
    <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid var(--border);font-size:12.5px">
      <span>${f.name}</span>
      <span class="badge badge-${FILE_STATUS_META[f.status].badge}">${FILE_STATUS_META[f.status].label}</span>
    </div>`).join('') : `<p class="row-sub">ยังไม่มีไฟล์แนบ</p>`;

  const assigneeOptions = staff.map(s => `<option value="${s.id}" ${s.id === assignee.id ? 'selected' : ''}>${s.name} — ${s.role}</option>`).join('');

  document.getElementById('taskModal').innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:16px">
      <div>
        <div class="row-sub">${getProject(t.projectId).name}</div>
        <h2 style="font-size:18px;margin-top:2px">${t.name}</h2>
      </div>
      <button class="icon-btn" data-action="close-modal">${icon('close')}</button>
    </div>

    <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:18px">
      <span class="badge badge-${meta.badge}">${meta.label}</span>
      <span class="delay-pill ${delay.late ? 'late' : 'ontime'}">${delay.label}</span>
      ${t.status !== 'review' ? waitingTag(t) : ''}
    </div>

    <div class="progress-track" style="margin-bottom:6px"><div class="progress-fill" style="width:${t.progress}%"></div></div>
    <div class="row-sub" style="margin-bottom:18px">ความคืบหน้า ${t.progress}%</div>

    <div class="grid" style="grid-template-columns:1fr 1fr;gap:12px;margin-bottom:18px;font-size:13px">
      <div><div class="row-sub">วันที่เริ่มงาน</div>${fmtDate(t.startDate)}</div>
      <div><div class="row-sub">เดดไลน์เดิม</div>${fmtDate(t.originalDeadline)}</div>
    </div>

    <form data-form="update-assignee" data-id="${t.id}" style="display:flex;gap:8px;align-items:flex-end;margin-bottom:16px">
      <div class="form-field" style="flex:1"><label>ผู้รับผิดชอบ</label><select name="assigneeId">${assigneeOptions}</select></div>
      <button class="btn btn-sm" type="submit">บันทึก</button>
    </form>

    <form data-form="update-deadline" data-id="${t.id}" style="display:flex;gap:8px;align-items:flex-end;margin-bottom:16px">
      <div class="form-field" style="flex:1"><label>กำหนดการส่งงานล่าสุด</label><input type="date" name="deadline" value="${cur}"></div>
      <button class="btn btn-sm" type="submit">บันทึก</button>
    </form>

    <form data-form="update-link" data-id="${t.id}" style="display:flex;gap:8px;align-items:flex-end;margin-bottom:16px">
      <div class="form-field" style="flex:1"><label>ลิงก์งาน</label><input type="url" name="link" value="${link || ''}" placeholder="วางลิงก์ไฟล์งาน"></div>
      <button class="btn btn-sm" type="submit">บันทึก</button>
    </form>

    <form data-form="update-waiting" data-id="${t.id}" style="margin-bottom:22px;padding:12px;border:1px solid var(--border);border-radius:var(--radius-sm);background:var(--bg-soft)">
      <label style="display:flex;align-items:center;gap:8px;font-size:13px;font-weight:500;margin-bottom:10px">
        <input type="checkbox" name="waiting" ${isWaitingOnClient(t) ? 'checked' : ''}> งานนี้กำลังรอฝั่งลูกค้าดำเนินการอยู่
      </label>
      <div class="form-field" style="margin-bottom:10px"><textarea name="note" rows="2" placeholder="เช่น รอไฟล์ภาพจากลูกค้า, รอการอนุมัติ...">${getWaitingNote(t)}</textarea></div>
      <button class="btn btn-sm" type="submit">บันทึกสถานะการรอ</button>
    </form>

    <h3 style="font-size:13.5px;margin-bottom:8px">ประวัติการขอแก้ไข</h3>
    <div style="margin-bottom:20px">${revisionsHtml}</div>

    <h3 style="font-size:13.5px;margin-bottom:8px">ไฟล์ที่เกี่ยวข้อง</h3>
    <div>${filesHtml}</div>`;

  document.getElementById('modalBackdrop').classList.add('open');
}

/* =========================================================
   Person (staff / client contact) edit modal
   ========================================================= */
function openPersonModal(kind, id) {
  const isStaff = kind === 'staff';
  const roster = isStaff ? staff : clientTeam;
  const person = id ? roster.find(p => p.id === id) : null;
  const title = person ? `แก้ไขข้อมูล${isStaff ? 'ทีมงาน' : 'ผู้ติดต่อ'}` : `เพิ่ม${isStaff ? 'ทีมงานฝั่งเรา' : 'ผู้ติดต่อฝั่งลูกค้า'}`;

  document.getElementById('taskModal').innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:18px">
      <h2 style="font-size:17px">${title}</h2>
      <button class="icon-btn" data-action="close-modal">${icon('close')}</button>
    </div>
    <form data-form="save-person" data-kind="${kind}" data-id="${person ? person.id : ''}">
      <div class="form-grid">
        <div class="form-field full"><label>ชื่อ-นามสกุล</label><input type="text" name="name" value="${person ? person.name : ''}" required></div>
        <div class="form-field full"><label>ตำแหน่ง${isStaff ? ' (เช่น PM, Producer, Developer, AE)' : ''}</label><input type="text" name="role" value="${person ? person.role : ''}" required></div>
        <div class="form-field"><label>อีเมล</label><input type="email" name="email" value="${person ? person.email : ''}"></div>
        <div class="form-field"><label>เบอร์โทร</label><input type="text" name="phone" value="${person ? person.phone : ''}"></div>
        ${isStaff ? `<div class="form-field full"><label>Line ID</label><input type="text" name="line" value="${person ? (person.line || '') : ''}"></div>` : ''}
        ${!isStaff ? `<div class="form-field full"><label style="display:flex;align-items:center;gap:8px;font-weight:500;color:var(--text)"><input type="checkbox" name="primary" ${person && person.primary ? 'checked' : ''}> ตั้งเป็นผู้ติดต่อหลัก</label></div>` : ''}
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:20px">
        ${person ? `<button type="button" class="btn btn-danger btn-sm" data-action="delete-person" data-kind="${kind}" data-id="${person.id}">${icon('trash')} ลบ</button>` : '<span></span>'}
        <button class="btn btn-primary" type="submit">${icon('check')} บันทึก</button>
      </div>
    </form>`;

  document.getElementById('modalBackdrop').classList.add('open');
}

function closeModal() { document.getElementById('modalBackdrop').classList.remove('open'); }

/* =========================================================
   Render all + navigation
   ========================================================= */
function renderAll() {
  renderDashboard();
  renderTasks();
  renderTimeline();
  renderFiles();
  renderRevisions();
  renderDelays();
  renderContact();
  renderClientChip();
}

function renderClientChip() {
  const primary = getPrimaryClientContact();
  document.getElementById('clientChipName').textContent = primary ? primary.name : 'ลูกค้า';
  document.getElementById('clientChipCompany').textContent = CLIENT.name;
  document.getElementById('clientChipAvatar').textContent = primary ? initials(primary.name) : initials(CLIENT.name);
}

const VIEW_META = {
  dashboard: { title: 'Dashboard Progress', sub: 'ภาพรวมความคืบหน้าของทุกโปรเจกต์แบบเรียลไทม์' },
  tasks: { title: 'Task Tracking', sub: 'งานอยู่ที่ใคร ถึงไหนแล้ว และใครล่าช้า' },
  timeline: { title: 'Timeline', sub: 'มุมมองระยะเวลาของแต่ละงานเทียบกับวันนี้' },
  files: { title: 'File & Approval', sub: 'ส่งลิงก์งานและติดตามการอนุมัติไฟล์' },
  revisions: { title: 'Revision Tracking', sub: 'ติดตามจำนวนวันที่เพิ่มจากการขอแก้ไขงาน' },
  delays: { title: 'Delay Report', sub: 'สรุปว่างานใดล่าช้าฝั่งเรา และงานใดกำลังรอฝั่งลูกค้า' },
  contact: { title: 'ติดต่อ & คำขอ', sub: 'ทีมงานฝั่งเรา ทีมงานฝั่งคุณ และช่องทางส่งคำขอใหม่' },
};

function switchView(view) {
  state.view = view;
  document.querySelectorAll('.nav-item').forEach(b => b.classList.toggle('active', b.dataset.view === view));
  document.querySelectorAll('.view').forEach(v => v.classList.toggle('active', v.id === 'view-' + view));
  document.getElementById('viewTitle').textContent = VIEW_META[view].title;
  document.getElementById('viewSubtitle').textContent = VIEW_META[view].sub;
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('scrim').classList.remove('open');
  document.getElementById('content').scrollTop = 0;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ---------- Theme ---------- */
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  document.getElementById('themeLabel').textContent = theme === 'dark' ? 'โหมดมืด' : 'โหมดสว่าง';
  document.querySelector('#themeToggle .nav-icon').innerHTML = theme === 'dark' ? ICONS.moon : ICONS.sun;
  store.set('cp_theme', theme);
}

/* ---------- Init ---------- */
function init() {
  // project select
  const sel = document.getElementById('projectFilter');
  sel.innerHTML = `<option value="all">ทุกโปรเจกต์</option>` + PROJECTS.map(p => `<option value="${p.id}">${p.name}</option>`).join('');
  sel.addEventListener('change', () => { state.project = sel.value; renderAll(); });

  // nav
  document.getElementById('nav').addEventListener('click', e => {
    const btn = e.target.closest('.nav-item');
    if (btn) switchView(btn.dataset.view);
  });

  // mobile sidebar
  document.getElementById('menuBtn').addEventListener('click', () => {
    document.getElementById('sidebar').classList.add('open');
    document.getElementById('scrim').classList.add('open');
  });
  const closeSidebar = () => { document.getElementById('sidebar').classList.remove('open'); document.getElementById('scrim').classList.remove('open'); };
  document.getElementById('sidebarClose').addEventListener('click', closeSidebar);
  document.getElementById('scrim').addEventListener('click', closeSidebar);

  // theme
  const savedTheme = store.get('cp_theme', window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  applyTheme(savedTheme);
  document.getElementById('themeToggle').addEventListener('click', () => {
    applyTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  });

  // global search
  document.getElementById('globalSearch').addEventListener('input', e => {
    state.search = e.target.value.trim();
    if (state.search) switchView('tasks');
    renderTasks();
  });

  // modal close
  document.getElementById('modalBackdrop').addEventListener('click', e => { if (e.target.id === 'modalBackdrop') closeModal(); });

  // delegated clicks
  document.getElementById('content').addEventListener('click', e => {
    const statusBtn = e.target.closest('[data-action="status-filter"]');
    if (statusBtn) { state.statusFilter = statusBtn.dataset.status; renderTasks(); return; }

    const openBtn = e.target.closest('[data-action="open-task"]');
    if (openBtn) { openTaskModal(openBtn.dataset.id); return; }

    const editPersonBtn = e.target.closest('[data-action="edit-person"]');
    if (editPersonBtn) { openPersonModal(editPersonBtn.dataset.kind, editPersonBtn.dataset.id); return; }

    const addPersonBtn = e.target.closest('[data-action="add-person"]');
    if (addPersonBtn) { openPersonModal(addPersonBtn.dataset.kind, null); return; }

    const approveBtn = e.target.closest('[data-action="approve-file"]');
    if (approveBtn) {
      fileOverrides[approveBtn.dataset.id] = { status: 'approved', comment: 'ลูกค้าอนุมัติไฟล์นี้แล้ว' };
      store.set('cp_file_overrides', fileOverrides);
      renderFiles(); toast('อนุมัติไฟล์เรียบร้อยแล้ว');
      return;
    }
    const rejectBtn = e.target.closest('[data-action="reject-file"]');
    if (rejectBtn) {
      const reason = prompt('ระบุสิ่งที่ต้องการให้แก้ไข:');
      if (reason === null) return;
      fileOverrides[rejectBtn.dataset.id] = { status: 'rejected', comment: reason || 'ลูกค้าขอให้แก้ไขไฟล์นี้' };
      store.set('cp_file_overrides', fileOverrides);
      renderFiles(); toast('ส่งคำขอแก้ไขไฟล์แล้ว');
      return;
    }
  });

  document.getElementById('taskModal').addEventListener('click', e => {
    if (e.target.closest('[data-action="close-modal"]')) { closeModal(); return; }

    const delPersonBtn = e.target.closest('[data-action="delete-person"]');
    if (delPersonBtn) {
      const kind = delPersonBtn.dataset.kind;
      const id = delPersonBtn.dataset.id;
      if (kind === 'staff') {
        const inUse = TASKS.some(t => (assigneeOverrides[t.id] || t.assigneeId) === id);
        if (inUse) { toast('ไม่สามารถลบได้ เนื่องจากยังมีงานที่มอบหมายให้คนนี้อยู่ กรุณาเปลี่ยนผู้รับผิดชอบก่อน'); return; }
        if (staff.length <= 1) { toast('ต้องมีทีมงานอย่างน้อย 1 คน'); return; }
        staff = staff.filter(s => s.id !== id);
        store.set('cp_staff', staff);
      } else {
        const inUse = allRequests().some(r => r.requesterId === id);
        if (inUse) { toast('ไม่สามารถลบได้ เนื่องจากมีคำขอที่ส่งโดยผู้ติดต่อนี้อยู่'); return; }
        if (clientTeam.length <= 1) { toast('ต้องมีผู้ติดต่อฝั่งลูกค้าอย่างน้อย 1 คน'); return; }
        const wasPrimary = clientTeam.find(c => c.id === id)?.primary;
        clientTeam = clientTeam.filter(c => c.id !== id);
        if (wasPrimary && clientTeam.length) clientTeam[0].primary = true;
        store.set('cp_client_team', clientTeam);
      }
      closeModal(); renderAll(); toast('ลบข้อมูลเรียบร้อยแล้ว');
    }
  });

  // delegated form submits
  document.getElementById('content').addEventListener('submit', e => {
    e.preventDefault();
    const form = e.target;
    if (form.dataset.form === 'add-link') {
      const fd = new FormData(form);
      const id = 'fx' + Date.now();
      extraFiles.push({ id, taskId: fd.get('taskId'), name: fd.get('name'), link: fd.get('link'), uploadedBy: 's1', uploadedDate: TODAY_STR, status: 'pending', comment: '' });
      store.set('cp_extra_files', extraFiles);
      form.reset();
      renderFiles(); toast('ส่งลิงก์งานเรียบร้อยแล้ว รอการอนุมัติ');
    }
    if (form.dataset.form === 'request') {
      const fd = new FormData(form);
      const id = 'rx' + Date.now();
      extraRequests.push({
        id, projectId: fd.get('projectId'), requesterId: fd.get('requesterId'), subject: fd.get('subject'), category: fd.get('category'),
        priority: fd.get('priority'), desiredDate: fd.get('desiredDate') || '', description: fd.get('description'),
        status: 'รอดำเนินการ', submittedDate: TODAY_STR,
      });
      store.set('cp_extra_requests', extraRequests);
      form.reset();
      renderContact(); toast('ส่งคำขอถึงทีมงานเรียบร้อยแล้ว');
    }
  });

  document.getElementById('taskModal').addEventListener('submit', e => {
    e.preventDefault();
    const form = e.target;
    const id = form.dataset.id;

    if (form.dataset.form === 'update-assignee') {
      const val = new FormData(form).get('assigneeId');
      assigneeOverrides[id] = val; store.set('cp_assignee_overrides', assigneeOverrides);
      toast('เปลี่ยนผู้รับผิดชอบแล้ว');
      renderAll(); openTaskModal(id); return;
    }
    if (form.dataset.form === 'update-deadline') {
      const val = new FormData(form).get('deadline');
      if (val) { deadlineOverrides[id] = val; store.set('cp_deadline_overrides', deadlineOverrides); toast('อัปเดตกำหนดการส่งงานแล้ว'); }
      renderAll(); openTaskModal(id); return;
    }
    if (form.dataset.form === 'update-link') {
      const val = new FormData(form).get('link');
      linkOverrides[id] = val; store.set('cp_link_overrides', linkOverrides); toast('อัปเดตลิงก์งานแล้ว');
      renderAll(); openTaskModal(id); return;
    }
    if (form.dataset.form === 'update-waiting') {
      const fd = new FormData(form);
      waitingOverrides[id] = fd.get('waiting') === 'on';
      waitingNotes[id] = fd.get('note') || '';
      store.set('cp_waiting_overrides', waitingOverrides);
      store.set('cp_waiting_notes', waitingNotes);
      toast('บันทึกสถานะการรอแล้ว');
      renderAll(); openTaskModal(id); return;
    }

    if (form.dataset.form === 'save-person') {
      const kind = form.dataset.kind;
      const existingId = form.dataset.id;
      const fd = new FormData(form);
      const name = (fd.get('name') || '').trim();
      const role = (fd.get('role') || '').trim();
      if (!name || !role) { toast('กรุณากรอกชื่อและตำแหน่ง'); return; }

      if (kind === 'staff') {
        const data = { name, role, email: fd.get('email') || '', phone: fd.get('phone') || '', line: fd.get('line') || '' };
        if (existingId) {
          staff = staff.map(s => s.id === existingId ? { ...s, ...data } : s);
        } else {
          staff = [...staff, { id: 's' + Date.now(), ...data }];
        }
        store.set('cp_staff', staff);
      } else {
        const primary = fd.get('primary') === 'on';
        const data = { name, role, email: fd.get('email') || '', phone: fd.get('phone') || '', primary };
        if (existingId) {
          clientTeam = clientTeam.map(c => c.id === existingId ? { ...c, ...data } : (primary ? { ...c, primary: false } : c));
        } else {
          if (primary) clientTeam = clientTeam.map(c => ({ ...c, primary: false }));
          clientTeam = [...clientTeam, { id: 'ct' + Date.now(), ...data, primary: primary || clientTeam.length === 0 }];
        }
        store.set('cp_client_team', clientTeam);
      }
      closeModal(); renderAll(); toast('บันทึกข้อมูลเรียบร้อยแล้ว');
    }
  });

  renderAll();
}

document.addEventListener('DOMContentLoaded', init);
