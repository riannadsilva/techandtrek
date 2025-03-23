const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('../'));
app.get('/', (req, res) => {
    res.redirect('/bookworm.html');
  });

// PostgreSQL connection - REPLACE USERNAME AND PASSWORD WITH YOURS
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'reading_tracker',
  password: 'admin',
  port: 5432,
});

// Get all items
app.get('/api/items', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM reading_items ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching items:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update an item's status
app.patch('/api/items/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  try {
    const result = await pool.query(
      'UPDATE reading_items SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [status, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating item:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add a new item
app.post('/api/items', async (req, res) => {
  const { title } = req.body;
  
  try {
    const result = await pool.query(
      'INSERT INTO reading_items (title, status) VALUES ($1, $2) RETURNING *',
      [title, 'backlog']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error adding item:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});