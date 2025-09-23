
const User = require('../Models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const zxcvbn = require('zxcvbn');

const signupSchema = Joi.object({
  firstName: Joi.string().min(1).max(50).required(),
  lastName: Joi.string().min(1).max(50).required(),
  nickname: Joi.string().min(1).max(50).required(),
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
    'any.only': 'Passwords do not match.'
  })
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

exports.signup = async (req, res) => {
  try {
    const { error } = signupSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
  const { firstName, lastName, nickname, username, email, password } = req.body;
    // Check password strength and data breach
    const pwdStrength = zxcvbn(password);
    if (pwdStrength.score < 3) {
      let feedback = pwdStrength.feedback && pwdStrength.feedback.suggestions && pwdStrength.feedback.suggestions.length > 0
        ? pwdStrength.feedback.suggestions.join(' ')
        : 'Password is too weak.';
      // Chrome and some browsers use zxcvbn's feedback for breached/common passwords
      if (pwdStrength.feedback.warning) {
        feedback += ' ' + pwdStrength.feedback.warning;
      }
      return res.status(400).json({ error: feedback });
    }
    // Check for duplicate email or username
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ error: 'Email or username already exists.' });
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      firstName,
      lastName,
      nickname,
      username,
      email,
      password: hashedPassword
    });
    await user.save();
    console.log('User saved:', user);
    console.log('Mongoose connection:', user.collection.conn.name, 'Collection:', user.collection.name);
    return res.status(201).json({ message: 'Signup successful! Please login.' });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Signup failed.' });
  }
};

exports.login = async (req, res) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }
    // Issue JWT
    const token = jwt.sign({ id: user._id }, process.env.TOKEN_SECRET, { expiresIn: '1d' });
    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    return res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Login failed.' });
  }
};

exports.logout = (req, res) => {
  res.clearCookie('token');
  return res.status(200).json({ message: 'Logged out successfully.' });
};
