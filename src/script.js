// script.js

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
            window.location.href = 'recommendations.html';
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
            body: JSON.stringify({ username, password, email }),
        });

        const data = await response.json();

        if (data.success) {
            //After successful registration, process accordingly, such as redirecting to the login page
            window.location.href = 'login.html';
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Error during registration:', error);
    }
}


// Function to update user interests
async function updateInterests() {
    const username = document.getElementById('username').value;

    // need to modify here
    const interestsInput = document.getElementById('interests');
    const interests = interestsInput.value.split(',');

    try {
        const response = await fetch('http://localhost:3000/interests', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, interests }),
        });

        const data = await response.json();

        if (data.success) {
            // Redirect to recommendations page on successful interests update
            window.location.href = 'recommendations.html';
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Error updating interests:', error);
    }
}

// Function to load recommendations
async function loadRecommendations() {
    const username = 'user1'; // replace with the actual username
    try {
        const response = await fetch(`http://localhost:3000/recommendations/${username}`);
        const data = await response.json();

        if (data.success) {
            const recommendationBubbles = document.getElementById('recommendationBubbles');
            recommendationBubbles.innerHTML = data.recommendations.map(recommendation => (
                `<div class="bubble">${recommendation}</div>`
            )).join('');
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Error loading recommendations:', error);
    }
}

// Call loadRecommendations when the recommendations page is loaded
if (window.location.href.includes('recommendations.html')) {
    loadRecommendations();
}


function createInterestsButtons(){
    const container = document.getElementById("interestsButtons");

    // fetch from the database



    // if not, predefined.
    const radiosData = ["Star","Fun","Emotion","Beauty","Movie","Sociaty","TV","Food","International","Finance","Book","Photography","Car","Sport","Digital","Fashion","Military","Home","Pet","Technology","Comic","Travel","History","Art","Law","Design","Music","Game","School","Childcare","Education","Dance","Relationship","Charity"];

    radiosData.forEach(radioText => {
        var container1 = document.createElement("div");
        container1.className = "interestsContainer";

        var radio = document.createElement("input");
        
        radio.type="checkbox";
        radio.value=radioText;
        radio.id=radioText;
        radio.className = "interestsRadio";
        radio.setAttribute('name', 'interests');
        container1.appendChild(radio);

        var radioLabel = document.createElement("label")
        radioLabel.setAttribute('for', radioText);
        radioLabel.innerText = radioText;
        container1.appendChild(radioLabel);

        container.appendChild(container1);
    });

}


// Call when the interests page is loaded
if (window.location.href.includes('interests.html')) {
    createInterestsButtons();
}


