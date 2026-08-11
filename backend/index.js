const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const User = require('./models/User');
// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

// Ensure permanent admin exists
const ensureAdminExists = async () => {
  try {
    const adminEmail = 'admin@nexcart.com';
    const adminExists = await User.findOne({ email: adminEmail });
    
    if (!adminExists) {
      await User.create({
        name: 'Super Admin',
        email: adminEmail,
        phone: 'XXXXX-96995',
        password: 'admin123',
        isAdmin: true
      });
      console.log('Permanent Admin account created: admin@nexcart.com / admin123');
    }
  } catch (error) {
    console.error('Error creating permanent admin:', error);
  }
};
ensureAdminExists();

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000'], // Next.js frontend port
  credentials: true
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files route for uploaded product images
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/email', require('./routes/email'));

// Basic health check route
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'NexCart Backend API is running smoothly' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
