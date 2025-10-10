const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');

const app = express();
const PORT = 3000;
const JWT_SECRET = 'your_super_secret_jwt_key';

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/churnguard')
.then(() => console.log("Successfully connected to MongoDB."))
.catch(err => console.error("MongoDB connection error:", err));

// User Schema
const userSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  modelId: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
});
const User = mongoose.model('User', userSchema);

// Use memory storage as we are just forwarding the file
const upload = multer({ storage: multer.memoryStorage() });

// --- Authentication Middleware ---
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token.' });
    req.user = decoded;
    next();
  });
};

// --- API Routes ---

// Signup
app.post('/signup', upload.single('dataset'), async (req, res) => {
    try {
        const { companyName, email, password } = req.body;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ error: 'Dataset file is required.' });
        }

        const formData = new FormData();
        formData.append('dataset', file.buffer, file.originalname);

        const pythonApiResponse = await axios.post('http://127.0.0.1:5000/train', formData, {
            headers: formData.getHeaders(),
        });

        const { model_id, accuracy } = pythonApiResponse.data;
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ companyName, email, password: hashedPassword, modelId: model_id });
        await newUser.save();
        
        res.status(201).json({ message: 'User registered and model trained!', accuracy });

    } catch (error) {
        console.error('Signup Error:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'An error occurred during signup.', detail: error.message });
    }
});


// Login
app.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user || !await bcrypt.compare(req.body.password, user.password)) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        if (!user.modelId) {
            return res.status(400).json({ 
                error: 'Your account is outdated and does not have a model associated with it. Please sign up again to create a new model.' 
            });
        }

        const tokenPayload = {
            userId: user._id.toString(),
            companyName: user.companyName,
            modelId: user.modelId,
        };
        const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '8h' });
        res.json({ token, companyName: user.companyName });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred during login.' });
    }
});

// GET Current User Details
app.get('/user', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user details.' });
  }
});

// UPDATE User Details
app.put('/user/update', authenticateToken, async (req, res) => {
  try {
    const { companyName, email, password } = req.body;
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ error: 'User not found.' });

    // Update fields if they were provided
    if (companyName) user.companyName = companyName;
    if (email) user.email = email;
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }
    
    await user.save();
    res.json({ message: 'Account details updated successfully!' });
  } catch (error) {
    if (error.code === 11000) { // Handle duplicate email
      return res.status(400).json({ error: 'This email is already in use.' });
    }
    res.status(500).json({ error: 'Failed to update user details.' });
  }
});

// START Company Verification
app.post('/user/verify/start', authenticateToken, async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Verification email is required.' });
  }
  // In a real app, you'd generate a token and send an email.
  // Here, we just simulate the success response.
  console.log(`Simulating verification email to ${email} for user ${req.user.userId}`);
  res.json({ message: `A verification link has been sent to ${email}. Please check your inbox.` });
});


// Dashboard
app.post('/dashboard', authenticateToken, async (req, res) => {
  try {
    const { modelId } = req.user;
    if (!modelId) return res.status(400).json({ error: 'Invalid token: modelId is missing. Please log out and log in again.' });

    const pythonResponse = await axios.post('http://127.0.0.1:5000/dashboard_stats', { model_id: modelId });
    res.json(pythonResponse.data);

  } catch (error) {
    const detail = error.response?.data || error.message;
    console.error('Dashboard Error:', detail);
    res.status(500).json({ error: 'Failed to fetch dashboard data.', detail });
  }
});

// Churn Factors
app.post('/churn_factors', authenticateToken, async (req, res) => {
    try {
        const { modelId } = req.user;
        if (!modelId) return res.status(400).json({ error: 'Invalid token: modelId is missing.' });
        
        const pythonResponse = await axios.post('http://127.0.0.1:5000/churn_factors', { model_id: modelId });
        res.json(pythonResponse.data);

    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch churn factors.', detail: error.response?.data || error.message });
    }
});

// Customer Segmentation
app.post('/segmentation', authenticateToken, async (req, res) => {
    try {
        const { modelId } = req.user;
        if (!modelId) return res.status(400).json({ error: 'Invalid token: modelId is missing.' });
        
        const pythonResponse = await axios.post('http://127.0.0.1:5000/segmentation', { model_id: modelId });
        res.json(pythonResponse.data);

    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch segmentation data.', detail: error.response?.data || error.message });
    }
});


// Performance
app.post('/performance', authenticateToken, async (req, res) => {
    try {
        const { modelId } = req.user;
        if (!modelId) return res.status(400).json({ error: 'Invalid token: modelId is missing. Please log out and log in again.' });

        const pythonResponse = await axios.post('http://127.0.0.1:5000/performance_stats', { model_id: modelId });
        res.json(pythonResponse.data);

    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch performance data.', detail: error.response?.data || error.message });
    }
});

// Predict Churn
app.post('/predict', authenticateToken, async (req, res) => {
    try {
        const { modelId } = req.user;
        if (!modelId) return res.status(400).json({ error: 'Invalid token: modelId is missing. Please log out and log in again.' });
        
        const pythonResponse = await axios.post('http://127.0.0.1:5000/predict', { ...req.body, model_id: modelId });
        res.json(pythonResponse.data);

    } catch (error) {
        res.status(500).json({ error: 'Failed to get prediction.', detail: error.response?.data || error.message });
    }
});

// Retrain Model
app.post('/retrain', authenticateToken, async (req, res) => {
    try {
        const { modelId } = req.user;
        const { modelType } = req.body;

        if (!modelId) {
            return res.status(400).json({ error: 'Invalid token: modelId is missing.' });
        }
        
        const pythonResponse = await axios.post('http://127.0.0.1:5000/retrain', {
            model_id: modelId,
            modelType: modelType
        });

        res.json(pythonResponse.data);

    } catch (error) {
        res.status(500).json({
            error: 'Failed to retrain model.',
            detail: error.response?.data || error.message
        });
    }
});


// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});