const express = require('express');
const { Pool } = require('pg');
const cors = require('cors'); // Import the cors module

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors()); // Enable CORS for all routes

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'zitara',
  password: 'Bhagi@123',
  port: 5432,
});

// Middleware to parse JSON bodies
app.use(express.json());

// Route to fetch customers data
app.get('/api/customers', async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  // try {
  //   const { rows } = await pool.query('SELECT * FROM ZITARA');
  //   res.json(rows);
  // } catch (error) {
  //   console.error('Error fetching customers:', error);
  //   res.status(500).json({ error: 'Internal Server Error' });
  // }
  const { page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;
  try {
    const { rows } = await pool.query('SELECT * FROM ZITARA OFFSET $1 LIMIT $2', [offset, limit]);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
