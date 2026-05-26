import express, { type Request, type Response } from 'express';
import cors from 'cors';
import path from 'path';
import pool from './db';
import type { Task, PhaseStats } from './types';

const app = express();
app.use(cors());
app.use(express.json());

const staticDir = process.env.NODE_ENV === 'production'
  ? path.join(__dirname, '..', 'client')
  : path.join(__dirname, '..', 'public');
app.use(express.static(staticDir));

app.get('/api/tasks', async (_req: Request, res: Response) => {
  try {
    const result = await pool.query<Task>(
      'SELECT * FROM tasks ORDER BY phase_order, sort_order'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

interface UpdateBody {
  status?: string;
  notes?: string;
}

app.patch('/api/tasks/:id', async (
  req: Request<{ id: string }, Task | { error: string }, UpdateBody>,
  res: Response
) => {
  const { id } = req.params;
  const { status, notes } = req.body;

  const fields: string[] = [];
  const values: (string | undefined)[] = [];
  let idx = 1;

  if (status !== undefined) {
    fields.push(`status = $${idx++}`);
    values.push(status);
  }
  if (notes !== undefined) {
    fields.push(`notes = $${idx++}`);
    values.push(notes);
  }

  if (fields.length === 0) {
    return res.status(400).json({ error: 'No fields to update' });
  }

  fields.push(`updated_at = CURRENT_TIMESTAMP`);
  values.push(id);

  try {
    const result = await pool.query<Task>(
      `UPDATE tasks SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
      values
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

app.get('/api/stats', async (_req: Request, res: Response) => {
  try {
    const total = await pool.query('SELECT COUNT(*) FROM tasks');
    const completed = await pool.query(
      "SELECT COUNT(*) FROM tasks WHERE status = 'done'"
    );
    const byPhase = await pool.query<PhaseStats>(
      `SELECT phase, phase_order,
        COUNT(*) FILTER (WHERE status = 'done') AS done,
        COUNT(*) AS total
       FROM tasks GROUP BY phase, phase_order ORDER BY phase_order`
    );
    res.json({
      total: parseInt(total.rows[0].count),
      completed: parseInt(completed.rows[0].count),
      phases: byPhase.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

app.post('/api/tasks/reset', async (_req: Request, res: Response) => {
  try {
    await pool.query("UPDATE tasks SET status = 'pending', notes = NULL, updated_at = CURRENT_TIMESTAMP");
    res.json({ message: 'All tasks reset' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to reset tasks' });
  }
});

app.get('/{*splat}', (_req: Request, res: Response) => {
  res.sendFile(path.join(staticDir, 'index.html'));
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
