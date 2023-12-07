const express = require('express');
const { Client } = require('pg');

const client = new Client({
  host: 'localhost',
  user: 'postgres',
  port: 5433,
  database: 'Fitness App',
});

const app = express();
const PORT = 5002;

client.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
  } else {
    console.log('Connected to the database!');
  }
});

app.get('/api/userGoals', async (req, res) => {
  console.log('Before query execution');
try {
    const Qresult = await client.query('SELECT * FROM user_name_goal');
    const userGoals = Qresult.rows.map((row) => row.username);
    console.log('Inside the try block - result.rows:', userGoals);
    res.json(userGoals);
  } catch (error) {
    console.log('Error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
  console.log('After query execution2');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
