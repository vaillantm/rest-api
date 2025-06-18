const express = require('express');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
const users = {};

// Validate input
function validateUserInput(name, email) {
  const errors = [];
  if (!name || typeof name !== 'string' || name.trim() === '') {
    errors.push('Name is required and must be a non-empty string');
  }
  if (!email || typeof email !== 'string') {
    errors.push('Email is required and must be a string');
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.push('Email must be a valid email address');
    }
  }
  return errors;
}

// POST /users - create a new user
app.post('/users', (req, res) => {
  const { name, email } = req.body;
  const errors = validateUserInput(name, email);
  if (errors.length > 0) {
    return res.status(400).json({ error: 'Validation failed', details: errors });
  }

  const id = uuidv4();
  const newUser = { id, name: name.trim(), email: email.toLowerCase().trim() };
  users[id] = newUser;

  res.status(201).json(newUser);
});

// GET /users/:id - get user by id
app.get('/users/:id', (req, res) => {
  const id = req.params.id;
  const user = users[id];

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json(user);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
