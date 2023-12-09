// Express.js Initializations
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const app = express();
const PORT = 3000;
const session = require('express-session');

// Middleware setup
app.use(bodyParser.json());
app.use(cors());

// Session setup
app.use(session({
    secret: 'negative_10x_developers',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

/**
 * User data structure.
 * @typedef {Object} User
 * @property {string} username - User's username.
 * @property {string} hashedPassword - Hashed password using bcrypt.
 * @property {string[]} interests - Array of user interests.
 * @property {string} mastodonAccount - User's Mastodon account.
 * @property {string} profile_img - User's profile image.
 */

/** @type {User[]} */
let users = [];

/**
 * Registration endpoint.
 * @function
 * @name POST/register
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
app.post("/register", async (req, res) => {
  const { username, password, confirmPassword } = req.body;

  // Check if either username, password, or confirmPassword is missing
  if (!username || !password || !confirmPassword) {
    return res
      .status(400)
      .json({ success: false, message: "Username and password are required" });
  }

  // Check if the password and confirmPassword match
  if (password !== confirmPassword) {
    return res
      .status(400)
      .json({ success: false, message: "Passwords do not match" });
  }

  // Check if the username is already taken
  if (users.some((u) => u.username === username)) {
    return res
      .status(400)
      .json({ success: false, message: "Username already exists" });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Add the new user
  users.push({ username, hashedPassword, interests: [], mastodonAccount: "" });

  res.json({
    success: true,
    message: "Registration successful",
    userName: username,
  });
});

/**
 * Login endpoint.
 * @function
 * @name POST/login
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = users.find((u) => u.username === username);

    if (user) {
      // Compare hashed password
      const match = await bcrypt.compare(password, user.hashedPassword);

      if (match) {
        req.session.user = { username: username, interests: user.interests, mastodonAccount: user.mastodonAccount };
        res.json({ success: true, message: 'Login successful', userName: username, interests: user.interests, mastodonAccount: user.mastodonAccount });
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

/**
 * Check login status endpoint.
 * @function
 * @name GET/check-login
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
app.get('/check-login', (req, res) => {
    if (req.session.user) {
        res.json({ loggedIn: true, user: req.session.user });
    } else {
        res.json({ loggedIn: false });
    }
});

/**
 * Logout endpoint.
 * @function
 * @name GET/logout
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true, message: 'Logged out successfully' });
});

/**
 * Get all users endpoint.
 * @function
 * @name GET/users
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
app.get('/users', (req, res) => {
  // Create a new array that contains user information without hashed passwords
  const safeUserData = users.map((user) => {
    return {
      username: user.username,
      interests: user.interests,
      mastodonAccount: user.mastodonAccount,
      profile_img: user.profile_img,
      // followers: user.followers,
    };
  });

  res.json({ success: true, users: safeUserData });
});

/**
 * Update user interests endpoint.
 * @function
 * @name POST/interests
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
app.post("/interests", (req, res) => {
  const { username, interests, mastodonAccount, profile_img } = req.body;
  const userIndex = users.findIndex((u) => u.username === username);

  // Update user interests in backend if user is located
  if (userIndex !== -1) {
    users[userIndex].interests = interests;
    if (mastodonAccount != undefined){
      users[userIndex].mastodonAccount = mastodonAccount;
    }

    if (profile_img != undefined){
      users[userIndex].profile_img = profile_img;
    }
    res.json({ success: true, message: "Interests updated successfully" });
  } else {
    res.status(404).json({ success: false, message: "User not found" });
  }
});

/**
 * Get user recommendations endpoint.
 * @function
 * @name GET/recommendations/:username
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
app.get("/recommendations/:username", (req, res) => {
  const { username } = req.params;
  const user = users.find((u) => u.username === username);

  if (user) {
    // Dummy recommendations
    const recommendations = ["User 3", "User 4", "Group B"];
    res.json({ success: true, recommendations });
  } else {
    res.status(404).json({ success: false, message: "User not found" });
  }
});

  /**
  * Server initialization.
  * @type {Object}
  * @property {Object} app - Express application instance.
  * @property {User[]} users - Array of user data.
  * @property {Object} server - Express server instance.
  */
const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
module.exports = { app, users, server };