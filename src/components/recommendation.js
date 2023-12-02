import { renderPeopleRecommendation } from "./card.js";
import { renderRecommendationPost } from "./post.js";
import { renderFollowerRecommendation } from "./account.js";
import { flaskApikey, nodeApikey } from '../api/api.js';

// TODO
// 1) fetch interest and userAccount info // Still have bug
// 2) Merge fetchFollower and fetchPost into one promise
// 3) add backToTop button
// 4) add user img to the profile

async function fetchFollowerRecommendations(interests) {
  fetch(`${flaskApikey}/get_recommendations`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json(); // Parses the JSON from the response
    })
    .then((data) => {
    //   console.log(data);
      const container = document.getElementById("accountContainer");
      container.innerHTML = "";
      const header = document.createElement('h3');
      header.textContent = "Top Recommended Followers";
      container.appendChild(header);
      if (Array.isArray(interests)) {
        interests.forEach((interest) => {
          if(data.hasOwnProperty(interest)) {
            const recommendData = data[interest];
            const top2Account = recommendData.top2FollowedAccounts;
            top2Account.forEach((account) => {
                let return_account = renderFollowerRecommendation(account);
                container.appendChild(return_account);
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

async function fetchPostRecommendations(interests) {
  fetch(`${flaskApikey}/get_recommendations`)
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
      const header = document.createElement('h3');
      header.textContent = "Top Recommended Post";
      container.appendChild(header);
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
async function fetchPeopleRecommended(userMastodonURL) {
  const url = `${flaskApikey}/get_recommendedpeople?userMastodonURL=${encodeURIComponent(
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
      const header = document.createElement('h3');
      header.textContent = "People U Might Know";
      container.appendChild(header);
      data.forEach((userData) => {
        const card = renderPeopleRecommendation(userData);
        container.appendChild(card);
      });
    })
    .catch((error) => {
      console.error("Fetch error:", error);
    });
}

// TODO: Have Bugs cannot fetch user info cuz we dont know user info...
// Fetch interest and user account infos
async function fetchUserData() {
  try {
      const response = await fetch(`http://localhost:3000/users`);
      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log('User data:', data);
  } catch (error) {
      console.error('Error fetching user data:', error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const logOutButton = document.getElementById("logOutButton");
  logOutButton.addEventListener("click", ()=>{
    logOut();
  })

  // BUG: No user info return
  // fetchUserData()

  // dummy variable
  let acc = "cse210team1@mastodon.social";
  let interests = ["Pop", "Domestic"];
  
  // // Initial fetch when the page loads
  fetchFollowerRecommendations(interests);
  fetchPostRecommendations(interests);
  fetchPeopleRecommended('cse210team1@mastodon.social');
});

