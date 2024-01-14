const express = require('express');
const { Client } = require('pg');

const client = new Client({
  host: 'localhost',
  user: 'postgres',
  port: 5433,
  database: 'Fitness App',
});

const app = express();
const PORT = 5001;

client.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
  } else {
    console.log('Connected to the database!');
  }
});

app.get('/api/goals', async (req, res) => {
  console.log('Before query execution');
  try {
    const result = await client.query('SELECT * FROM goals');
    const goalNames = result.rows.map((row) => row.goal_name);
    console.log('Inside the try block - result.rows:', goalNames);
    res.json(goalNames);
  } catch (error) {
    console.log('Error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
  console.log('After query execution 1');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
