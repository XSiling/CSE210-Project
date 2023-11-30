// script.js

const interestsData = [
    ["Star", "Fun", "Movie", "TV", "Photography", "Music", "Pop", "Comic"],
    ["Beauty", "Food", "Fashion", "Travel", "Art", "Dance", "Wellness", "Recreation"],
    ["Customs", "International", "History", "Law", "Tradition", "Culture", "Community", "Heritage"],
    ["Digital","Data", "Innovation","Gadgets","Software", "Internet", "Cybersecurity", "Programming"],
    ["Finance", "Business", "Investment", "Banking", "Markets", "Stocks", "Wealth", "Budgeting"],
    ["Home", "Pet", "Family", "Domestic", "Decor", "Garden", "Housing", "Comfort"],
    ["Book", "School", "Library", "Learning", "Knowledge", "Study", "Research", "Literature"],
    ["Sport", "Athletics", "Exercise", "Fitness", "Competition", "Games", "Outdoor", "Adventure"],
    ["Emotion", "Relationship", "Charity", "Love", "Empathy", "Advocacy", "Philanthropy", "Volunteer"],
]
const interestsCategory = [
    'Media', 'Leisure', 'Society', 'Technology', 'Economy', 'Living', 'Education', 'Recreation', 'Relationship'
]
const category = 9;


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
            var url = 'recommendations.html?=username=' + data.userName;
            Array.from(data.interests).forEach((element)=>{
                url += '&Interests=';
                url += element;
            });

            window.location.href = url;
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Error during login:', error);
    }
}

// Function to handle registration
async function register() {
    const username = document.getElementById('newUsername').value;
    const password = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const email = document.getElementById('email').value;

    // make sure the passward matches
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
            var url = '../view/interests.html?username=' + data.userName;
            alert(data.message);
            window.location.href = url;
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Error during registration:', error);
    }
}


// Function to update user interests
async function updateInterests() {
    const username = document.getElementById('username').value.split('&')[0];

    // need to modify here
    const interestsList = document.getElementsByClassName("interestsRadio");
    const interests = [];
    let radiosData = [];
    for (var i=0; i< interestsData.length; ++i){
        radiosData = radiosData.concat(interestsData[i]);
    }

    for(var i=0; i<interestsList.length; ++i){
        if (interestsList[i].checked){
            interests.push(radiosData[i]);
        }
    }
    console.log("!");

    debugger;

    try {
        // Send a POST request to local server containing user:interests info
        const response = await fetch('http://localhost:3000/interests', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, interests }),
        });

        const data = await response.json();

        if (data.success) {
            //Redirect to recommendations page on successful interests update
            var url = 'recommendations.html?username=' + username;
            for (var j=0; j<interests.length; ++j){
                url += '&interests='
                url += interests[j];
            }
           window.location.href = url;
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Error updating interests:', error);
    }
}


// Call loadRecommendations when the recommendations page is loaded
if (window.location.href.includes('recommendations.html')) {
    // loadRecommendations();
}
