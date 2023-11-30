const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(cors());

// MongoDB URI for GitHub Actions
const mongoUri = process.env.GITHUB_ACTIONS
  ? 'mongodb://localhost:27017/test'
  : 'mongodb://admin:admin@localhost:27017/userdb';

// Connect to MongoDB
mongoose.connect(mongoUri);

// Define a user schema
const userSchema = new mongoose.Schema({
  username: String,
  hashedPassword: String,
  interests: [String],
  mastodonAccount: String,
});

// Create a user model
const UserModel = mongoose.model('User', userSchema);

// Registration function
app.post('/register', async (req, res) => {
  const { username, password, confirmPassword } = req.body;

  // Check if either username, password, or confirmPassword is missing
  if (!username || !password || !confirmPassword) {
    return res.status(400).json({ success: false, message: 'Username and password are required' });
  }

  // Check if the password and confirmPassword match
  if (password !== confirmPassword) {
    return res.status(400).json({ success: false, message: 'Passwords do not match' });
  }

  try {
    // Check if the username is already taken
    const existingUser = await UserModel.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Username already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user document
    const newUser = new UserModel({
      username,
      hashedPassword,
      interests: [],
      mastodonAccount: '',
    });

    // Save the user to the database
    await newUser.save();

    res.json({ success: true, message: 'Registration successful', userName: username });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// Login function
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await UserModel.findOne({ username });

    if (user) {
      // Compare hashed password
      const match = await bcrypt.compare(password, user.hashedPassword);

      if (match) {
        res.json({
          success: true,
          message: 'Login successful',
          userName: username,
          interests: user.interests,
          mastodonAccount: user.mastodonAccount,
        });
      } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});


app.get('/users', async (req, res) => {
  try {
    // Retrieve all users from the database, excluding hashed passwords
    const users = await UserModel.find({}, { hashedPassword: 0 });

    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// POST endpoint to receive interest data
app.post('/interests', async (req, res) => {
  const { username, interests, mastodonAccount } = req.body;

  try {
    // Find the user in the database
    const user = await UserModel.findOne({ username });

    // Update user interests in the database if user is found
    if (user) {
      user.interests = interests;
      user.mastodonAccount = mastodonAccount;
      await user.save();
      res.json({ success: true, message: 'Interests updated successfully' });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// GET user recommendations from endpoint
app.get('/recommendations/:username', async (req, res) => {
  const { username } = req.params;

  try {
    // Find the user in the database
    const user = await UserModel.findOne({ username });

    if (user) {
      // Dummy recommendations
      const recommendations = ['User 3', 'User 4', 'Group B'];
      res.json({ success: true, recommendations });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

const db = mongoose.connection;
module.exports = { app, server, db };