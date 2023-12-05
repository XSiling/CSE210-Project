// script.js

const interestsData1 = [
  ["Star", "Fun", "Movie", "TV", "Photography", "Music", "Pop", "Comic"],
  [
    "Beauty",
    "Food",
    "Fashion",
    "Travel",
    "Art",
    "Dance",
    "Wellness",
    "Recreation",
  ],
  [
    "Customs",
    "International",
    "History",
    "Law",
    "Tradition",
    "Culture",
    "Community",
    "Heritage",
  ],
  [
    "Digital",
    "Data",
    "Innovation",
    "Gadgets",
    "Software",
    "Internet",
    "Cybersecurity",
    "Programming",
  ],
  [
    "Finance",
    "Business",
    "Investment",
    "Banking",
    "Markets",
    "Stocks",
    "Wealth",
    "Budgeting",
  ],
  [
    "Home",
    "Pet",
    "Family",
    "Domestic",
    "Decor",
    "Garden",
    "Housing",
    "Comfort",
  ],
  [
    "Book",
    "School",
    "Library",
    "Learning",
    "Knowledge",
    "Study",
    "Research",
    "Literature",
  ],
  [
    "Sport",
    "Athletics",
    "Exercise",
    "Fitness",
    "Competition",
    "Games",
    "Outdoor",
    "Adventure",
  ],
  [
    "Emotion",
    "Relationship",
    "Charity",
    "Love",
    "Empathy",
    "Advocacy",
    "Philanthropy",
    "Volunteer",
  ],
];
const interestsCategory1 = [
  "Media",
  "Leisure",
  "Society",
  "Technology",
  "Economy",
  "Living",
  "Education",
  "Recreation",
  "Relationship",
];
const category1 = 9;

/**
 * Handles the login functionality.
 * @async
 * @function
 */
async function login() {
    /**
     * Gets the username from the input field.
     * @type {string}
     */
    const username = document.getElementById('username').value;

    /**
     * Gets the password from the input field.
     * @type {string}
     */
    const password = document.getElementById('password').value;

    try {
        /**
         * Sends a login request to the server.
         * @type {Response}
         */
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        /**
         * Parses the JSON data from the response.
         * @type {Object}
         */
        const data = await response.json();

        if (data.success) {
            // Redirect to recommendations page on successful login
            let url = 'recommendations.html?username=' + data.userName;
            window.location.href = url;
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Error during login:', error);
    }
}

/**
 * Checks the login status and performs actions based on it.
 * @function
 */
function checkLoginStatus() {
    fetch('/check-login')
        .then(response => response.json())
        .then(data => {
            if (data.loggedIn) {
                document.getElementById('loginButton').style.display = 'none';
                // Additional actions based on login status
            }
        });
}

/**
 * Loads the checkLoginStatus function on window load.
 */
window.onload = checkLoginStatus;

/**
 * Handles the logout functionality.
 */
document.getElementById('logoutButton').addEventListener('click', () => {
    fetch('/logout')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                window.location.reload(); // Reload the page after logout
            }
        });
});

/**
 * Handles the registration functionality.
 * @async
 * @function
 */
async function register() {
    /**
     * Gets the new username from the input field.
     * @type {string}
     */
    const username = document.getElementById('newUsername').value;

    /**
     * Gets the new password from the input field.
     * @type {string}
     */
    const password = document.getElementById('newPassword').value;

    /**
     * Gets the confirmed password from the input field.
     * @type {string}
     */
    const confirmPassword = document.getElementById('confirmPassword').value;

    /**
     * Gets the email from the input field.
     * @type {string}
     */
    const email = document.getElementById('email').value;

    // make sure the password matches
    if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
    }

    try {
        /**
         * Sends a registration request to the server.
         * @type {Response}
         */
        const response = await fetch('http://localhost:3000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password, confirmPassword, email }),
        });

        /**
         * Parses the JSON data from the response.
         * @type {Object}
         */
        const data = await response.json();

        if (data.success) {
            let url = '../view/interests.html?username=' + data.userName;
            alert(data.message);
            window.location.href = url;
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Error during registration:', error);
    }
}

/**
 * Logs out the user.
 */
async function logOut() {
    const url = "register.html";
    window.location.href = url;
}

/**
 * Updates user interests.
 * @async
 * @function
 */
async function updateInterests() {
    /**
     * Gets the username from the input field.
     * @type {string}
     */
    const username = document.getElementById('username').value.split('&')[0];

    /**
     * Gets the Mastodon account from the input field.
     * @type {string}
     */
    const mastodonAccount = document.getElementById('mastodonInput').value;

    /**
     * Gets the profile image from the selected image.
     * @type {string}
     */
    const profile_img = document.getElementsByClassName('selected-img')[0].id;

    /**
     * Gets the list of interest radio buttons.
     * @type {NodeList}
     */
    const interestsList = document.getElementsByClassName("interestsRadio");

    /**
     * Array to store selected interests.
     * @type {Array}
     */
    const interests = [];
    
    /**
     * Array to store interests data.
     * @type {Array}
     */
    let radiosData = [];

    // Combine interestsData1 arrays
    for (let i = 0; i < interestsData1.length; ++i) {
        radiosData = radiosData.concat(interestsData1[i]);
    }

    // Check selected interests
    for (let i = 0; i < interestsList.length; ++i) {
        if (interestsList[i].checked) {
            interests.push(radiosData[i]);
        }
    }
    console.log("!");

    try {
        /**
         * Sends a POST request to update user interests.
         * @type {Response}
         */
        const response = await fetch('http://localhost:3000/interests', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, interests, mastodonAccount, profile_img }),
        });
    
        /**
         * Parses the JSON data from the response.
         * @type {Object}
         */
        const data = await response.json();
    
        if (data.success) {
            // Redirect to recommendations page on successful interests update
            let url = 'recommendations.html?username=' + username;
            window.location.href = url;
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Error updating interests:', error);
    }
    
    /**
    Scrolls to the top of the window smoothly.
    */
    function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
    }
}