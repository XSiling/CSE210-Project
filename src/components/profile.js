import {createInterestsButtons, expand, close, checkRadio} from "../components/interests.js"
import { flaskApikey,nodeApikey } from "../api/api.js";

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

function addInterest(){
    const interest = document.getElementById("interestsText").value;

    let radiosData = [];
    for (let i=0; i< interestsData.length; ++i){
        radiosData = radiosData.concat(interestsData[i]);
    }
    const idx = radiosData.indexOf(interest);
    if (idx==-1){
        alert("Enter one of the available interests");
    }else{
        const checkboxItem = document.getElementById(interest);
        checkboxItem.checked=true;
        checkRadio(checkboxItem);
    }
}

async function updateCurrentInterests(){
    console.log(parent.window.location.href);
    const url = parent.window.location.href;
    const username = url.split('=')[1].split('&')[0];

    try {
        const response = await fetch(`${nodeApikey}/users`,{
            method: 'GET',
            headers:{
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();

        if (data.success){
            // set the mastodon content into some UI
            var interests = [];
            var profile_img = '';
            for(var i=0; i<data.users.length; ++i){
                if (data.users[i].username === username){
                    interests = data.users[i].interests;
                    profile_img = data.users[i].profile_img;
                    break;
                }
            }
            let radiosData = [];
            for (let i=0; i< interestsData.length; ++i){
                radiosData = radiosData.concat(interestsData[i]);
            }
            Array.from(interests).forEach(interest=>{
                document.getElementById(interest).checked=true;
            });


        }else{
            alert("fetching user interests failure");
        }
    }catch(error){
        console.error('Error during fetching user interests');
    }

}

async function saveInformation(save){
    if (save){
        const url = parent.window.location.href;
        const username = url.split('=')[1].split('&')[0];
        const profile_img = document.getElementsByClassName('selected-img')[0].id;
        const interestsList = document.getElementsByClassName("interestsRadio");
        const mastodonAccount = undefined;
        const interests = [];
        let radiosData = [];
    
        for (let i=0; i<interestsData1.length; ++i){
            radiosData = radiosData.concat(interestsData[i]);
        }
    
        for(let i=0; i<interestsList.length; ++i){
            if (interestsList[i].checked){
                interests.push(radiosData[i]);
            }
        }

        try {
            // Send a POST request to local server containing user:interests info
            const response = await fetch('http://localhost:3000/interests', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, interests, mastodonAccount, profile_img }),
            });

            const data = await response.json();

            if (data.success) {
                //Redirect to recommendations page on successful interests update
                let url = 'recommendations.html?username=' + username;
                parent.window.location.href = url;
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error updating interests:', error);
        }
    }else{
        return;
    }
}


document.addEventListener("DOMContentLoaded", (event) => {
    let images = document.querySelectorAll(".profile-predefined-img");
    images.forEach((img) => {
      img.addEventListener("click", function () {
        images.forEach((i) => i.classList.remove("selected-img"));
        this.classList.add("selected-img");
      });
    });
});


document.addEventListener("DOMContentLoaded", (event)=>{
    createInterestsButtons();
    updateCurrentInterests();
})

document.addEventListener("DOMContentLoaded", (event)=>{
    const profileSaveButton = document.getElementById("profileSaveButton");
    // const profileCloseButton = document.getElementById("profileCloseButton");
    profileSaveButton.addEventListener("click", function(){
        saveInformation(true);
    })

    // profileCloseButton.addEventListener("click", function(){
        // saveInformation(false);
    // })

})

document.addEventListener("DOMContentLoaded", (event)=>{
    const interestsTextButton = document.getElementById("interestsTextButton");
    interestsTextButton.addEventListener("click", function(){
        addInterest();
    })
})