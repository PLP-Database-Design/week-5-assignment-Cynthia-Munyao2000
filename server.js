const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to the database');
});

// Question 1: Retrieve all patients
const getAllPatients = (req, res) => {
    const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients';
    db.query(query, (err, results) => {
      if (err) return res.status(500).send(err);
      res.json(results);
    });
  };
  app.get('/patients', getAllPatients);
  
  // Question 2: Retrieve all providers
  const getAllProviders = (req, res) => {
    const query = 'SELECT first_name, last_name, provider_specialty FROM providers';
    db.query(query, (err, results) => {
      if (err) return res.status(500).send(err);
      res.json(results);
    });
  };
  app.get('/providers', getAllProviders);
  
  // Question 3: Filter patients by first name
  const getPatientsByFirstName = (req, res) => {
    const { first_name } = req.params;
    const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients WHERE first_name = ?';
    db.query(query, [first_name], (err, results) => {
      if (err) return res.status(500).send(err);
      res.json(results);
    });
  };
  app.get('/patients/:first_name', getPatientsByFirstName);
  
  // Question 4: Retrieve all providers by their specialty
  const getProvidersBySpecialty = (req, res) => {
    const { provider_specialty } = req.params;
    const query = 'SELECT first_name, last_name FROM providers WHERE provider_specialty = ?';
    db.query(query, [provider_specialty], (err, results) => {
      if (err) return res.status(500).send(err);
      res.json(results);
    });
  };
  app.get('/providers/specialty/:provider_specialty', getProvidersBySpecialty);

// Listen to the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
