import { renderPeopleRecommendation } from "./card.js";
import { renderRecommendationPost } from "./post.js";
import { renderFollowerRecommendation } from "./account.js";
import { flaskApikey, nodeApikey } from "../api/api.js";

function showLoadingGif(containerId) {
  const container = document.getElementById(containerId);
  const loadingGif = document.createElement("img");
  loadingGif.setAttribute("src", "../images/loading.gif");
  loadingGif.setAttribute("id", "loadingGif");
  container.innerHTML = "";
  container.appendChild(loadingGif);
}

function hideLoadingGif(containerId) {
  const container = document.getElementById(containerId);
  const loadingGif = document.getElementById("loadingGif");
  if (loadingGif) {
    container.removeChild(loadingGif);
  }
}

function fetchBasicInformation(user){
  const username = user.username;
  const interests = user.interests;
  const mastodonAccount = user.mastodonAccount;
  const profile_img = user.profile_img;
  let html = "<br/><h4> Get the recommendations for: ";

  // set username
  document.getElementById("username").setAttribute("value", username);
  if (document.getElementById("userProfileUsername")) {
    document.getElementById("userProfileUsername").innerHTML = username;
  }

  // set mastodon Account
  document.getElementById("userProfileMastodonAccount").innerHTML =
    "<div>" + mastodonAccount + "</div>";

  // set interests text
  Array.from(interests).forEach((interest) => {
    html += interest + " ";
  });

  html += "</h4>"

  if (interests.length == 0){
    html = '<br/><h4> Oops, you did not select any interests! Get some by editting the profile. </h4>';
  }

  document.getElementById("userProfileInterests").innerHTML = html;

  // set image
  const container = document.getElementById("userProfileImage");
  let profile_image = document.createElement("img");
  profile_image.src = profile_img;
  let smt = profile_image.src;
  const image_url = smt.replace('/view', '/images/user-image');
  profile_image.src = image_url+'.png';
  profile_image.alt = "profile image";
  profile_image.className = "profile-image";
  container.appendChild(profile_image);  

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
      const header = document.createElement("h3");
      header.textContent = "Top Recommended Followers";
      container.appendChild(header);
      if (Array.isArray(interests)) {
        interests.forEach((interest) => {
          if (data.hasOwnProperty(interest)) {
            const recommendData = data[interest];
            const top2Account = recommendData.top2FollowedAccounts;
            top2Account.forEach((account) => {
              let return_account = renderFollowerRecommendation(account);
              container.appendChild(return_account);
            });
          } else {
            console.log("No data found for:", interest);
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
      const header = document.createElement("h3");
      header.textContent = "Top Recommended Post";
      container.appendChild(header);
      if (Array.isArray(interests)) {
        interests.forEach((interest) => {
          if (data.hasOwnProperty(interest)) {
            const recommendData = data[interest];
            const top2Posts = recommendData.top2Posts;
            top2Posts.forEach((post) => {
              let return_post = renderRecommendationPost(post);
              container.appendChild(return_post);
            });
          } else {
            console.log("No data found for:", interest);
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
      const header = document.createElement("h3");
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
  showLoadingGif("accountContainer");
  showLoadingGif("postContainer");
  showLoadingGif("recommendationContainer");
  try {
    const response = await fetch(`${nodeApikey}/users`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    const username = window.location.href.split("=")[1].split("&")[0];

    let i = -1;
    for (let index = 0; index < data.users.length; ++index) {
      if (data.users[index].username === username) {
        i = index;
        break;
      }
    }


    // set the basic information on the page
    fetchBasicInformation(data.users[i]);

    if (
      data.users[i].interests &&
      Array.isArray(data.users[i].interests) &&
      data.users[i].interests.length > 0
    ) {
      const interest = data.users[i].interests;
      await fetchFollowerRecommendations(interest);
      await fetchPostRecommendations(interest);
    }
    if (data.users[i].mastodonAccount?.trim()) {
      const userMastodonURL = data.users[i].mastodonAccount;
      await fetchPeopleRecommended(userMastodonURL);
    }
    console.log("render finish");
  } catch (error) {
    console.error("Error fetching user data:", error);
  } finally {
    hideLoadingGif("accountContainer");
    hideLoadingGif("postContainer");
    hideLoadingGif("recommendationContainer");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("logOutButton").addEventListener("click", () => {
    fetch(`${nodeApikey}/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          window.location.href = "register.html"; // Reload the page after logout
        }
      });
  });
  fetchUserData();
  getCredential();
});

window.onload = function () {
  if (sessionStorage.getItem('loginSuccess') === 'true') {
    sessionStorage.removeItem('loginSuccess');
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      }
    });

    Toast.fire({
      icon: 'success',
      title: 'Signed in successfully'
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const openProfileButton = document.getElementById("openProfileButton");
  const url = window.location.href;
  const username = url.split("=")[1].split("&")[0];
  openProfileButton.setAttribute("src", "profile.html?username=" + username);
  console.log(openProfileButton);
  openProfileButton.addEventListener("click", () => {
    const profileWindow = document.getElementById("profileEdittion");
    profileWindow.style.display = "block";
  });
});

async function getCredential() {
  // fetch user data
  let mastodonAccount;
  try {
    const response = await fetch(`${nodeApikey}/users`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    mastodonAccount = data?.users[0]?.mastodonAccount;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
  // check user is authorize to mastodon or not (refresh case)
  try {
    const response = await fetch(
      `${flaskApikey}/check_User_Isloggedin?userMastodonURL=${encodeURIComponent(
        mastodonAccount
      )}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.text();
    if (data === "True") {
      // console.log("already");
      const btn = document.getElementById("get-credential-btn");
      btn.textContent = 'Mastodon Credentialed';
      return;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
  // get auth
  try {
    const response = await fetch(
      `${flaskApikey}/get_Auth_URL?userMastodonURL=${encodeURIComponent(
        mastodonAccount
      )}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const authUrl = await response.text();
    const authWindow = window.open(authUrl, "_blank");
    const checkAuthWindow = setInterval(async () => {
      if (authWindow.closed) {
          clearInterval(checkAuthWindow);
          try {
            const response = await fetch(
              `${flaskApikey}/check_User_Isloggedin?userMastodonURL=${encodeURIComponent(
                mastodonAccount
              )}`
            );
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.text();
            if (data === "True") {
              const btn = document.getElementById("get-credential-btn");
              btn.textContent = 'Mastodon Credentialed';
            } else {
              const btn = document.getElementById("get-credential-btn");
              btn.textContent = 'Link to Mastodon';
            }
          } catch (error) {
            console.error("Error fetching data:", error);
          }
        }
    }, 500);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
