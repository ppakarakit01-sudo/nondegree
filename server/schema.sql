-- Client Portal schema

CREATE TABLE IF NOT EXISTS clients (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  industry TEXT
);

CREATE TABLE IF NOT EXISTS staff (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  line TEXT,
  avatar_url TEXT
);

CREATE TABLE IF NOT EXISTS client_contacts (
  id TEXT PRIMARY KEY,
  client_id INTEGER REFERENCES clients(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  is_primary BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  client_id INTEGER REFERENCES clients(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  icon TEXT DEFAULT '📁',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY,
  project_id TEXT REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  assignee_id TEXT REFERENCES staff(id),
  status TEXT NOT NULL DEFAULT 'not_started',
  start_date DATE,
  original_deadline DATE,
  deadline_override DATE,
  completed_date DATE,
  progress INTEGER DEFAULT 0,
  work_link TEXT DEFAULT '',
  waiting_on_client BOOLEAN,
  waiting_note TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS revisions (
  id SERIAL PRIMARY KEY,
  task_id TEXT REFERENCES tasks(id) ON DELETE CASCADE,
  date DATE,
  requested_by TEXT,
  reason TEXT,
  days_added INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS files (
  id TEXT PRIMARY KEY,
  task_id TEXT REFERENCES tasks(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  link TEXT NOT NULL,
  uploaded_by TEXT REFERENCES staff(id),
  uploaded_date DATE,
  status TEXT DEFAULT 'pending',
  comment TEXT DEFAULT ''
);

CREATE TABLE IF NOT EXISTS requests (
  id TEXT PRIMARY KEY,
  project_id TEXT REFERENCES projects(id) ON DELETE CASCADE,
  requester_id TEXT REFERENCES client_contacts(id),
  subject TEXT NOT NULL,
  category TEXT,
  priority TEXT,
  desired_date DATE,
  description TEXT DEFAULT '',
  status TEXT DEFAULT 'รอดำเนินการ',
  submitted_date DATE DEFAULT CURRENT_DATE
);

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  google_id TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  picture TEXT,
  role TEXT NOT NULL,
  staff_id TEXT REFERENCES staff(id),
  client_contact_id TEXT REFERENCES client_contacts(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS task_tags (
  id SERIAL PRIMARY KEY,
  task_id TEXT REFERENCES tasks(id) ON DELETE CASCADE,
  tagged_email TEXT NOT NULL,
  tagged_name TEXT,
  message TEXT DEFAULT '',
  tagged_by_name TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  email_sent BOOLEAN DEFAULT false
);
