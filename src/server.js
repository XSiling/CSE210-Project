// Express.js Initializations
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(cors());


let users = [];

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

    // Check if the username is already taken
    if (users.some(u => u.username === username)) {
        return res.status(400).json({ success: false, message: 'Username already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Add the new user
    users.push({ username, hashedPassword, interests: [] });

    res.json({ success: true, message: 'Registration successful' });
});


// Login function
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);

    if (user) {
        // Compare hashed password
        const match = await bcrypt.compare(password, user.hashedPassword);

        if (match) {
            res.json({ success: true, message: 'Login successful' });
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

// POST endpoint to receive interest data
app.post('/interests', (req, res) => {
    const { username, interests } = req.body;
    const userIndex = users.findIndex(u => u.username === username);

    // Update user interests in backend if user is located
    if (userIndex !== -1) {
        users[userIndex].interests = interests;
        res.json({ success: true, message: 'Interests updated successfully' });
    } else {
        res.status(404).json({ success: false, message: 'User not found' });
    }
});

// GET user recommendations from endpoint
app.get('/recommendations/:username', (req, res) => {
    const { username } = req.params;
    const user = users.find(u => u.username === username);

    if (user) {
        // Dummy recommendations
        const recommendations = ['User 3', 'User 4', 'Group B'];
        res.json({ success: true, recommendations });
    } else {
        res.status(404).json({ success: false, message: 'User not found' });
    }
});

const server = app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = { app, users, server };