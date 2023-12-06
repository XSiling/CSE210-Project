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

document.addEventListener('DOMContentLoaded', function() {
    checkLoginStatus();
});


// Function to handle login
async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();



        if (data.success) {
            // Redirect to recommendations page on successful login
            let url = 'recommendations.html?username=' + data.userName;
            // Array.from(data.interests).forEach((element)=>{
            //     url += '&Interests=';
            //     url += element;
            // });
            // url += '&mastodonAccount=';
            // url += data.mastodonAccount;
            window.location.href = url;
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Error during login:', error);
    }
}



// function checkLoginStatus() {
//     fetch('/check-login')
//         .then(response => response.json())
//         .then(data => {
//             if (data.loggedIn) {

//                 document.getElementById('loginButton').style.display = 'none';
//                 // Additional actions based on login status
//             }
//         });
// }

window.onload = checkLoginStatus; // Call this function on window load

//Handling Logout
// document.getElementById('logoutButton').addEventListener('click', () => {
//     fetch('/logout')
//         .then(response => response.json())
//         .then(data => {
//             if (data.success) {
//                 window.location.reload(); // Reload the page after logout
//             }
//         });
// });


// Function to handle registration
async function register() {
    const username = document.getElementById('newUsername').value;
    const password = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const email = document.getElementById('email').value;

    // make sure the password matches
    if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password, confirmPassword}),
        });

        const data = await response.json();
        console.log(data);
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

async function logOut() {
  const url = "register.html";
  window.location.href = url;
}


//Handling Logout
const logoutButton = document.getElementById('logoutButton');
if (logoutButton) {
    logoutButton.addEventListener('click', () => {
        fetch('/logout')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    window.location.reload(); // Reload the page after logout
                }
            });
    });
}


// Function to update user interests
async function updateInterests() {
    const username = document.getElementById('username').value.split('&')[0];
    const mastodonAccount = document.getElementById('mastodonInput').value;

    // need to modify here
    const interestsList = document.getElementsByClassName("interestsRadio");
    const interests = [];
    let radiosData = [];

    for (let i=0; i<interestsData1.length; ++i){
        radiosData = radiosData.concat(interestsData1[i]);
    }

    for(let i=0; i<interestsList.length; ++i){
        if (interestsList[i].checked){
            interests.push(radiosData[i]);
        }
    }
    console.log("!");

    try {
        // Send a POST request to local server containing user:interests info
        const response = await fetch('http://localhost:3000/interests', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, interests, mastodonAccount }),
        });

        const data = await response.json();

        if (data.success) {
            //Redirect to recommendations page on successful interests update
            let url = 'recommendations.html?username=' + username;
           window.location.href = url;
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Error updating interests:', error);
    }
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}



function checkLoginStatus() {
    console.log("check login status");
    fetch('http://localhost:3000/check-login', { credentials: 'include' }) // Ensure credentials are included for session cookies
        .then(response => response.json())
        .then(data => {
            if (data.loggedIn) {
                console.log("logged in");
                let url = 'recommendations.html?username=' + data.user.username;
                console.log(url);
                window.location.href = url;
            }
            
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// Call this function when the login page is loaded
if (window.location.href.includes('login')) {
    console.log("login");
    window.onload = checkLoginStatus;
}


// // Call this function on window load for login.html
// if (window.location.href.includes('http://127.0.0.1:5500/CSE210-Project/src/view/login.html')) {
//     window.onload = checkLoginStatus;
// }


// window.onscroll = function () {
//   if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
//     document.getElementById("backToTopButton").style.display = "block";
//   } else {
//     document.getElementById("backToTopButton").style.display = "none";
//   }
// };

// Call loadRecommendations when the recommendations page is loaded
// if (window.location.href.includes('recommendations.html')) {
//     // loadRecommendations();
// }
