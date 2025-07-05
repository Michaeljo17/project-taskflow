const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { testConnection } = require('./config/database');

dotenv.config();
const app = express();

testConnection();

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

// Routes
app.use('/api', require('./routes/taskRoutes'));

// Health check endpoint
app.get('/api/health', (req, res) => res.json({ success: true, message: 'Server is running' }));

// Handle 404
app.use('*', (req, res) => res.status(404).json({ success: false, error: 'Route not found' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));