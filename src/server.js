// Express.js Initializations
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const fetch = require('node-fetch');
const app = express();
const PORT = 3000;

// Middleware setup
app.use(express.json());
const corsOptions = {
  origin: ['http://127.0.0.1:5500', 'http://127.0.0.1:3001'],
  credentials: true,
};

app.use(cors(corsOptions));

/**
 * User data structure.
 * @typedef {Object} User
 * @property {string} username - User's username.
 * @property {string} hashedPassword - Hashed password using bcrypt.
 * @property {string[]} interests - Array of user interests.
 * @property {string} mastodonAccount - User's Mastodon account.
 * @property {string} profile_img - User's profile image.
 * @property {string[]} following - Array of user followings
 */

/** @type {User[]}*/

let users = [];
let active_user = null;

app.get('/proxy', async (req, res) => {
  const url = req.query.url;
  try {
      const response = await fetch(url);
      const data = await response.buffer();
      res.set('Access-Control-Allow-Origin', '*');
      res.set('Content-Type', response.headers.get('content-type'));
      res.send(data);
  } catch (error) {
      console.error('Error during fetch:', error);
      res.status(500).send('Error fetching resource');
  }
});

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
  users.push({ username, hashedPassword, interests: [], mastodonAccount: "", following:[] });

  active_user = username;
  const user = users.find((u) => u.username === username);
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
    console.log("In login");
  try {
    const { username, password } = req.body;
    const user = users.find((u) => u.username === username);

    if (user) {
      // Compare hashed password
      const match = await bcrypt.compare(password, user.hashedPassword);
            if (match) {
                active_user = username
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
  if (active_user) {
    return res.json({ loggedIn: true, redirectUrl: 'recommendations.html?username=' + active_user});
  } else{
    res.json({ loggedIn: false, redirectUrl: "" })
  }
});

/**
 * Logout endpoint.
 * @function
 * @name POST/logout
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
app.post('/logout', (req, res) => {
    active_user = null;
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
      following: user.following
      // followers: user.followers,
    };
  });

  res.json({ success: true, users: safeUserData });
});

/**
 * Update user following
 */
app.post("/follow", (req, res)=>{
  const username = req.body.username;
  const account = req.body.following;
  const userIndex = users.findIndex((u)=> u.username === username);
  // update the user following...
  if (userIndex !== -1){
    // check whether have followed first
    const followIndex = users[userIndex].following.findIndex((f) => f === account);
    if (followIndex === -1){
      users[userIndex].following.push(account);
      res.json({ success: true, message: "Has updated the following."});
    }else{
      res.json({ success: false, message: "The user has already followed, check the code."});
    }
  }else{
    res.json({ success: false, message: "No such user, check the code."});
  }
})

/**
 * Update user following by unfollow
 */
app.post("/unfollow", (req, res)=>{
  const username = req.body.username;
  const account = req.body.following;
  const userIndex = users.findIndex((u)=> u.username === username);

  // update the user following...
  if (userIndex !== -1){
    // check whether have followed first
    const followIndex = users[userIndex].following.findIndex((f) => f === account);
    if (followIndex === -1){
      res.json({ success: false, message: "The user has not already followed, check the code." });
    }else{
      users[userIndex].following.splice(followIndex, 1);
      res.json({ success: true, message: "Has updated the following." });
    }
  }else{
    res.json({ success: false, message: "No such user, check the code." });
  }

})


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

  console.log("happen");
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