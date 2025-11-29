-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  anonymous_id TEXT UNIQUE,
  pseudonym TEXT,
  email TEXT UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('victim', 'counsellor', 'legal', 'admin')),
  gender TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Help requests table
CREATE TABLE IF NOT EXISTS help_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('counselling', 'legal')),
  abuse_type TEXT,
  description TEXT,
  since_when TEXT,
  preferred_contact_mode TEXT CHECK(preferred_contact_mode IN ('chat', 'call')),
  status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'active', 'closed')),
  assigned_to INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (assigned_to) REFERENCES users(id)
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  help_request_id INTEGER NOT NULL,
  sender_id INTEGER NOT NULL,
  sender_role TEXT NOT NULL,
  content TEXT NOT NULL,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (help_request_id) REFERENCES help_requests(id),
  FOREIGN KEY (sender_id) REFERENCES users(id)
);

-- Availability table
CREATE TABLE IF NOT EXISTS availability (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL UNIQUE,
  status TEXT DEFAULT 'offline' CHECK(status IN ('available', 'busy', 'offline')),
  note TEXT,
  time_window TEXT,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Resources table
CREATE TABLE IF NOT EXISTS resources (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('online_resource', 'helpline', 'legal_info', 'health_info')),
  description TEXT,
  link_or_number TEXT,
  category TEXT,
  created_by_admin_id INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by_admin_id) REFERENCES users(id)
);

-- Audit logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  admin_id INTEGER NOT NULL,
  action_type TEXT NOT NULL,
  description TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (admin_id) REFERENCES users(id)
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_anonymous_id ON users(anonymous_id);
CREATE INDEX IF NOT EXISTS idx_help_requests_user_id ON help_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_help_requests_assigned_to ON help_requests(assigned_to);
CREATE INDEX IF NOT EXISTS idx_messages_help_request_id ON messages(help_request_id);
CREATE INDEX IF NOT EXISTS idx_availability_user_id ON availability(user_id);

