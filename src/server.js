const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(cors());


let users = [];

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


app.post('/login', async (req, res) => {
    try {
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
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

app.post('/interests', (req, res) => {
    const { username, interests } = req.body;
    const userIndex = users.findIndex(u => u.username === username);

    if (userIndex !== -1) {
        users[userIndex].interests = interests;
        res.json({ success: true, message: 'Interests updated successfully' });
    } else {
        res.status(404).json({ success: false, message: 'User not found' });
    }
});

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