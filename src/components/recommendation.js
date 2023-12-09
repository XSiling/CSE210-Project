import { renderPeopleRecommendation } from "./card.js";
import { renderRecommendationPost } from "./post.js";
import { renderFollowerRecommendation } from "./account.js";
import { flaskApikey, nodeApikey } from '../api/api.js';

// TODO
// 1) Merge fetchFollower and fetchPost into one promise

function showLoadingGif(containerId) {
  const container = document.getElementById(containerId);
  const loadingGif = document.createElement('img');
  loadingGif.setAttribute('src', "../images/loading.gif");
  loadingGif.setAttribute('id', 'loadingGif');
  container.innerHTML = '';
  container.appendChild(loadingGif);
}

function hideLoadingGif(containerId) {
  const container = document.getElementById(containerId);
  const loadingGif = document.getElementById('loadingGif');
  if (loadingGif) {
    container.removeChild(loadingGif);
  }
}

async function fetchFollowerRecommendations(interests) {
  fetch(`${flaskApikey}/get_recommendations`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json(); // Parses the JSON from the response
    })
    .then((data) => {
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
      return response.json();
    })
    .then((data) => {
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
      const container = document.getElementById("recommendationContainer");
      container.innerHTML = "";
      const header = document.createElement('h3');
      header.textContent = "People You Might Know";
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

// Fetch interest and user account infos
async function fetchUserData() {
  // Show loading GIFs
  showLoadingGif('accountContainer');
  showLoadingGif('postContainer');
  showLoadingGif('recommendationContainer');
  try {
      const response = await fetch(`${nodeApikey}/users`);
      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      const username = window.location.href.split('=')[1].split('&')[0];

      let i = -1;
      for(let index=0; index<data.users.length; ++index){
        if (data.users[index].username === username){
            i = index;
            break;
        }
      }

      if (data.users[i].interests && Array.isArray(data.users[i].interests) && data.users[i].interests.length > 0) {
        console.log("render follower and post");
        const interest = data.users[i].interests;
        await fetchFollowerRecommendations(interest);
        await fetchPostRecommendations(interest);
      }
      if (data.users[i].mastodonAccount?.trim()) {
        console.log("render people");
        const userMastodonURL = data.users[i].mastodonAccount;
        await fetchPeopleRecommended(userMastodonURL);
      }
      console.log("render finish");
  } catch (error) {
      console.error('Error fetching user data:', error);
  } finally {
    hideLoadingGif('accountContainer');
    hideLoadingGif('postContainer');
    hideLoadingGif('recommendationContainer');
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById('logOutButton').addEventListener('click', () => {
    fetch('http://localhost:3000/logout')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                window.location.href = 'register.html' // Reload the page after logout
            }
        });
  });

  fetchUserData();
});

document.addEventListener("DOMContentLoaded", ()=>{
  const openProfileButton = document.getElementById("openProfileButton");
  const url = window.location.href;
  const username = url.split('=')[1].split('&')[0];
  openProfileButton.setAttribute("src", "profile.html?username=" + username);
  console.log(openProfileButton);
  openProfileButton.addEventListener("click", ()=>{
    const profileWindow = document.getElementById("profileEdittion");
    profileWindow.style.display = 'block';
  })
})

async function getStatusSpan() {
  console.log("False");
}

async function getCredential() {
  console.log("credential button clicked");
  let mastodonAccount;
  try {
    const response = await fetch(`${nodeApikey}/users`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    mastodonAccount = data?.users[0]?.mastodonAccount;
    console.log(mastodonAccount);
    if (mastodonAccount) {
      try {
        const response = await fetch(`${flaskApikey}/check_User_Isloggedin?userMastodonURL=${encodeURIComponent(mastodonAccount)}`)
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.text();
        console.log(data);
        if (data === "True") {
          console.log("Credential Found");
          alert("Already Credentialed");
        } else {
          try {
            const response = await fetch(`${flaskApikey}/get_Auth_URL?userMastodonURL=${encodeURIComponent(mastodonAccount)}`)
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.text();
            window.open(data, '_blank');
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    } else {
      console.log("Not Found");
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
  try {
    const response = await fetch(`${flaskApikey}/check_User_Isloggedin?userMastodonURL=${encodeURIComponent(mastodonAccount)}`)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.text();
    const status_span = document.getElementById('user_status_span');
    if (data === "True") {
      status_span.textContent = "True";
    } else {
      status_span.textContent = "False";
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const credentialButton = document.getElementById('get-credential-btn');
  if (credentialButton) {
      credentialButton.addEventListener('click', getCredential);
  }
  const status_span = document.getElementById('user_status_span');
  status_span.textContent = 'None';
});