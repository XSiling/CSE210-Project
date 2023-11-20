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
            // Redirect to interests page on successful login
            window.location.href = 'interests.html';
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Error during login:', error);
    }
}

// Function to update user interests
async function updateInterests() {
    const username = document.getElementById('username').value;
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
