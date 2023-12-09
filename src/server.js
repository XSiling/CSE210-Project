// Express.js Initializations
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const app = express();
const PORT = 3000;
const session = require('express-session');
app.use(bodyParser.json());
app.use(cors());

app.use(session({
    secret: 'negative_10x_developers',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

let users = [];
let active_users = [];

const corsOptions = {
  origin: 'http://127.0.0.1:5500', // Your client's origin
  credentials: true, // To allow cookies to be sent
};

app.use(cors(corsOptions));


// Registration function
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
  if (active_users.includes(username)) {
    return res.redirect("/recommendations/" + username);
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Add the new user
  users.push({ username, hashedPassword, interests: [], mastodonAccount: "" });
  active_users.push(username);
  const user = users.find((u) => u.username === username);
  req.session.user = { username: username, interests: user.interests, mastodonAccount: user.mastodonAccount };
  console.log('Session after Registration:', req.session);
  res.json({
    success: true,
    message: "Registration successful",
    userName: username,
  });
});


// function redirectIfLoggedIn(req, res, next) {
//     if (req.session.user) {
//         res.redirect('/home'); // Replace '/home' with your home page route
//     } else {
//         next();
//     }
// }


// Login function
app.post("/login", async (req, res) => {
    console.log("In login");
  try {
    const { username, password } = req.body;
    const user = users.find((u) => u.username === username);

    if (user) {
      // Compare hashed password
      const match = await bcrypt.compare(password, user.hashedPassword);
            
            if (match) {
              if (active_users.includes(username)) {
                return res.redirect("/recommendations/" + username);
            }
                active_users.push(username);
                req.session.user = { username: username, interests: user.interests, mastodonAccount: user.mastodonAccount };
                console.log("Login successful")
                console.log('Session after login:', req.session);
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

app.get('/check-login', (req, res) => {
    if (req.session.user) {
        console.log("In check-login");
        console.log(req.session.user);
        
        res.json({ loggedIn: true, user: req.session.user });
    } else {
        res.json({ loggedIn: false });
    }
});


// Logout function
app.get('/logout', (req, res) => {
  const index = active_users.indexOf(req.session.user.username);
  if (index > -1) {
      active_users.splice(index, 1);
  }
    req.session.destroy();
    res.json({ success: true, message: 'Logged out successfully' });
});


app.get('/check-login', (req, res) => {
    if (req.session.user) {
        res.json({ loggedIn: true, user: req.session.user });
    } else {
        res.json({ loggedIn: false });
    }
});


// Logout function
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true, message: 'Logged out successfully' });
});


app.get('/users', (req, res) => {
  // Create a new array that contains user information without hashed passwords
  const safeUserData = users.map((user) => {
    return {
      username: user.username,
      interests: user.interests,
      mastodonAccount: user.mastodonAccount,
      profile_img: user.profile_img,
    };
  });

  res.json({ success: true, users: safeUserData });
});

// POST endpoint to receive interest data
app.post("/interests", (req, res) => {
  // console.log("interest:", users);
  const { username, interests, mastodonAccount, profile_img } = req.body;
  const userIndex = users.findIndex((u) => u.username === username);

  // Update user interests in backend if user is located
  if (userIndex !== -1) {
    users[userIndex].interests = interests;
    users[userIndex].mastodonAccount = mastodonAccount;
    users[userIndex].profile_img = profile_img;
    res.json({ success: true, message: "Interests updated successfully" });
  } else {
    // users.push({ username, hashedPassword, interests: interests });
    // res.json({ success: true, message: 'Interests updated successfully' });
    res.status(404).json({ success: false, message: "User not found" });
  }

  // console.log(users)
});

// GET user recommendations from endpoint
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

const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = { app, users, server };
