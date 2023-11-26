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
            window.location.href = 'interests.html';
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



function addInterest(){
    const interest = document.getElementById("interestsText").value;
    const radiosData = ["Star","Fun","Emotion","Beauty","Movie","Sociaty","TV","Food","International","Finance","Book","Photography","Car","Sport","Digital","Fashion","Military","Home","Pet","Technology","Comic","Travel","History","Art","Law","Design","Music","Game","School","Childcare","Education","Dance","Relationship","Charity"];
    const idx = radiosData.indexOf(interest);
    if (idx==-1){
        alert("No such existed interests.");
    }else{
        const checkboxItem = document.getElementById(interest);
        checkboxItem.checked=true;
    }

}

// Call loadRecommendations when the recommendations page is loaded
if (window.location.href.includes('recommendations.html')) {
    loadRecommendations();
    createInterestsButtons();
}


function createInterestsButtons(){
    const container = document.getElementById("interestsButtons");

    // fetch from the database



    // if not, predefined.
    const radiosData = ["Star","Fun","Emotion","Beauty","Movie","Sociaty","TV","Food","International","Finance","Book","Photography","Car","Sport","Digital","Fashion","Military","Home","Pet","Technology","Comic","Travel","History","Art","Law","Design","Music","Game","School","Childcare","Education","Dance","Relationship","Charity"];
    const lineNumber = 5;
    const eachLineNumber = radiosData.length/6;
    
    var line=0;
    
    for(line; line<lineNumber; ++line){
        var container1 = document.createElement("div");
        container1.setAttribute('class', 'interestsContainerLine')
        // container1.className = "interestsContainer";

        radiosData.slice(line*eachLineNumber,(line+1)*eachLineNumber).forEach(radioText=>{
            var container2 = document.createElement("div");
            container2.setAttribute("class", "interestsContainer");

            var radioLabel = document.createElement("label");
            radioLabel.setAttribute("for", radioText);
            radioLabel.setAttribute("class", "interestsLabel");
            radioLabel.innerHTML = "<input id=" + radioText + ' type="checkbox" value="' + radioText + 
            '" name="interests" class="interestsRadio"><i>' + radioText + '</i>';
            container2.appendChild(radioLabel);
            container1.appendChild(container2);
        })

        container.appendChild(container1);
    }

}


// Call when the interests page is loaded
if (window.location.href.includes('interests.html')) {
    createInterestsButtons();
}

