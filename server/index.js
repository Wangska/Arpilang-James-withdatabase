
const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const cors = require('cors');
const authRoutes = require('./Routes/authRoutes');
const authMiddleware = require('./Middlewares/authMiddleware');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;

// MongoDB connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mvc_auth')
	.then(() => console.log('MongoDB connected'))
	.catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(cors({ origin: true, credentials: true }));

// Auth API routes
app.use('/', authRoutes);

// Example protected route
app.get('/dashboard', authMiddleware, (req, res) => {
	res.json({ user: req.user });
});

app.get('/', (req, res) => {
	res.json({ message: 'API is running' });
});

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
