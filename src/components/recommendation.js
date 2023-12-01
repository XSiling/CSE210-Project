import { renderRecommendation } from "./card.js";
import { renderRecommendationPost } from "./post.js";
// import { apiKey } from './apiKey.js';

async function fetchRecommendations(interests) {
  fetch("http://localhost:5000/get_recommendations")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json(); // Parses the JSON from the response
    })
    .then((data) => {
    //   console.log(data);
      const container = document.getElementById("postContainer");
      container.innerHTML = "";
      if (Array.isArray(interests)) {
        interests.forEach((interest) => {
          if(data.hasOwnProperty(interest)) {
            const recommendData = data[interest];
            const top2Posts = recommendData.top2Posts;
            top2Posts.forEach((post) => {
                let return_post = renderRecommendationPost(post);
                container.appendChild(return_post);
            })
          } else {
            console.log('No data found for:', interest);
          }
        });
      } else {
        console.error("Interests is not an array:", interests);
      }
    })
    .catch((error) => {
      console.error(
        "There has been a problem with your fetch operation:",
        error
      );
    });
}

// Fetch recommendation list (5) from flask backend
async function fetchRecommendedPeople(userMastodonURL) {
  const url = `http://localhost:5000/get_recommendedpeople?userMastodonURL=${encodeURIComponent(
    userMastodonURL
  )}`;

  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log(data); // For debugging
      const container = document.getElementById("recommendationContainer");
      container.innerHTML = "";
      data.forEach((userData) => {
        // Changed from dataArray to data
        const card = renderRecommendation(userData); // Ensure createCard is defined and correct
        container.appendChild(card);
      });
    })
    .catch((error) => {
      console.error("Fetch error:", error);
    });
}

document.addEventListener("DOMContentLoaded", () => {



  const refreshButton = document.getElementById("refreshButton");
  refreshButton.addEventListener("click", () => {
    //   fetchRecommendedPeople('cse210team1@mastodon.social');
  });

  const logOutButton = document.getElementById("logOutButton");
  logOutButton.addEventListener("click", ()=>{
    logOut();
  })

  // dummy variable
  let acc = "cse210team1@mastodon.social";
  let interests = ["Pop", "Domestic"];

  console.log(interests);
  

  // Initial fetch when the page loads
  fetchRecommendations(interests);
  fetchRecommendedPeople('cse210team1@mastodon.social');

});

