const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); 
const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(cors());

// Dummy user data for testing
let users = [
    { username: 'user1', password: 'pass1', interests: ['Programming', 'Music'] },
    { username: 'user2', password: 'pass2', interests: ['Travel', 'Cooking'] },
];

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        res.json({ success: true, message: 'Login successful' });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
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

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
