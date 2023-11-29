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
            body: JSON.stringify({ username, password, confirmPassword}),
        });

        const data = await response.json();

        if (data.success) {
            alert(data.message);
            window.location.href = '../view/interests.html';
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
    const interestsList = document.getElementsByClassName("interestsRadio");
    const interests = [];

    for(var i=0; i<interestsList.length; ++i){
        interests.push(interestsList[i].checked);
    }
    
    // const interestsInput = document.getElementById('interests');
    // const interests = interestsInput.value.split(',');

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
// async function loadRecommendations() {
//     const username = 'user1'; // replace with the actual username
//     try {
//         const response = await fetch(`http://localhost:3000/recommendations/${username}`);
//         const data = await response.json();

//         if (data.success) {
//             const recommendationBubbles = document.getElementById('recommendationBubbles');
//             recommendationBubbles.innerHTML = data.recommendations.map(recommendation => (
//                 `<div class="bubble">${recommendation}</div>`
//             )).join('');
//         } else {
//             alert(data.message);
//         }
//     } catch (error) {
//         console.error('Error loading recommendations:', error);
//     }
// }




// TODO
// Call loadRecommendations when the recommendations page is loaded
if (window.location.href.includes('recommendations.html')) {
    // loadRecommendations();
}
