const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const SECRET = process.env.JWT_SECRET || 'secret123';

exports.login = (req, res) => {
  const { email, password } = req.body;
  const user = User.findByEmail(email);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: user.id, role: user.role }, SECRET, { expiresIn: '1d' });
  res.json({ token });
};

exports.register = (req, res) => {
  const { email, password, role } = req.body;
  if (User.findByEmail(email)) {
    return res.status(409).json({ message: 'User already exists' });
  }
  const hashed = bcrypt.hashSync(password, 8);
  const newUser = { id: Date.now().toString(), email, password: hashed, role };
  User.createUser(newUser);
  res.status(201).json({ message: 'User registered' });
};
