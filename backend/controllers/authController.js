const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// In-memory user store (mock database)
const users = [];

const SECRET = process.env.JWT_SECRET || 'secret123';

exports.register = (req, res) => {
  const { email, password, role } = req.body;

  const userExists = users.find(u => u.email === email);
  if (userExists) {
    return res.status(409).json({ message: 'User already exists' });
  }

  const hashedPassword = bcrypt.hashSync(password, 8);
  const newUser = { id: Date.now().toString(), email, password: hashedPassword, role };

  users.push(newUser);

  res.status(201).json({ message: 'User registered' });
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user.id, role: user.role }, SECRET, { expiresIn: '1d' });

  res.json({ token });
};

// For debugging only
exports.getUsers = (req, res) => {
  res.json(users);
};
