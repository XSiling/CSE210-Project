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


function createList(items, containerId) {
  // Find the container element
  const container = document.getElementById(containerId);
  if (!container) {
    console.error("Container not found");
    return;
  }

  // Create a list element
  const list = document.createElement("ul");

  // Iterate over the items and add them to the list
  items.forEach((item) => {
    const listItem = document.createElement("li");
    listItem.textContent = item;
    list.appendChild(listItem);
  });

  // Append the list to the container
  container.appendChild(list);

import { renderRecommendation } from './card.js';
// import { apiKey } from './apiKey.js';

function fetchRecommendations() {
  fetch('http://localhost:5000/get_recommendations')
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          return response.json(); // This parses the JSON from the response
      })
      .then(data => {
          console.log(data);
      })
      .catch(error => {
          console.error('There has been a problem with your fetch operation:', error);
      });
}

// Fetch recommendation list (5) from flask backend
function fetchRecommendedPeople(userMastodonURL) {
  const url = `http://localhost:5000/get_recommendedpeople?userMastodonURL=${encodeURIComponent(userMastodonURL)}`;

  fetch(url)
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          return response.json();
      })
      .then(data => {
          console.log(data); // For debugging
          const container = document.getElementById('recommendationContainer');
          container.innerHTML = '';
          data.forEach(userData => { // Changed from dataArray to data
              const card = renderRecommendation(userData); // Ensure createCard is defined and correct
              container.appendChild(card);
          });
      })
      .catch(error => {
          console.error('Fetch error:', error);
      });
}

async function closeProfile(){
  const smallWindow = document.getElementById('container-profile');
  smallWindow.style.display = 'none';
}



function createInterestsButtons(){
  const container = document.getElementById("interestsButtons");

  // fetch from the database

  var line=0;
  
  for(line; line<category; ++line){
      var container1 = document.createElement("div");
      container1.setAttribute('class', 'interestsContainerLine')
      // container1.className = "interestsContainer";

      interestsData[line].forEach(radioText=>{
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

createInterestsButtons();

document.addEventListener('DOMContentLoaded', () => {
  const refreshButton = document.getElementById('refreshButton');
  refreshButton.addEventListener('click', () => {
      fetchRecommendedPeople('cse210team1@mastodon.social');
  });

  // Initial fetch when the page loads
  fetchRecommendedPeople('cse210team1@mastodon.social');
});
