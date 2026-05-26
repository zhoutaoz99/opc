CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  phase VARCHAR(50) NOT NULL,
  phase_order INTEGER NOT NULL,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  notes TEXT,
  sort_order INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tasks_phase ON tasks(phase);
CREATE INDEX idx_tasks_status ON tasks(status);
