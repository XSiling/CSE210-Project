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
  const url = `http://localhost:3000/get_recommendedpeople?userMastodonURL=${encodeURIComponent(userMastodonURL)}`;

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

document.addEventListener('DOMContentLoaded', () => {
  const refreshButton = document.getElementById('refreshButton');
  refreshButton.addEventListener('click', () => {
      fetchRecommendedPeople('cse210team1@mastodon.social');
  });

  // Initial fetch when the page loads
  fetchRecommendedPeople('cse210team1@mastodon.social');
});