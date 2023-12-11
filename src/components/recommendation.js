import { renderPeopleRecommendation } from "./card.js";
import { renderRecommendationPost } from "./post.js";
import { renderFollowerRecommendation } from "./account.js";
import { flaskApikey, nodeApikey } from "../api/api.js";

/**
 * Description
 * @param {any} containerId
 * @returns {any}
 */
export function showLoadingGif(containerId) {
  const container = document.getElementById(containerId);
  const loadingGif = document.createElement("img");
  loadingGif.setAttribute("src", "../images/loading.gif");
  loadingGif.setAttribute("id", "loadingGif");
  container.innerHTML = "";
  container.appendChild(loadingGif);
}

/**
 * Description
 * @param {any} containerId
 * @returns {any}
 */
export function hideLoadingGif(containerId) {
  const container = document.getElementById(containerId);
  const loadingGif = document.getElementById("loadingGif");
  if (loadingGif && container.contains(loadingGif)) {
    container.removeChild(loadingGif);
  }
}

/**
 * Description
 * @param {any} user
 * @returns {any}
 */
export async function fetchBasicInformation(user) {
  const username = user.username;
  const interests = user.interests;
  const mastodonAccount = user.mastodonAccount;
  const profile_img = user.profile_img;
  const following = user.following;
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

  html += "</h4>";

  if (interests.length == 0) {
    html =
      "<br/><h4> Oops, you did not select any interests! Get some by editting the profile. </h4>";
  }

  document.getElementById("userProfileInterests").innerHTML = html;

  // set image
  const container = document.getElementById("userProfileImage");
  let profile_image = document.createElement("img");
  profile_image.src = profile_img;
  let smt = profile_image.src;
  const image_url = smt.replace("/view", "/images/user-image");
  profile_image.src = image_url + ".png";
  profile_image.alt = "profile image";
  profile_image.className = "profile-image";
  container.appendChild(profile_image);

  // set following

  const followingContainer = document.getElementById("followingSectionContent");
  Array.from(following).forEach((account) => {
    let followAccount = document.createElement("div");
    followAccount.innerHTML = account;
    followAccount.innerText = account;
    followingContainer.appendChild(followAccount);
  })

}

/**
 * Description
 * @param {any} interests
 * @returns {any}
 */
async function fetchFollowerRecommendations(interests) {
  return fetch(`${flaskApikey}/get_recommendations`)
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

/**
 * Description
 * @param {any} interests
 * @returns {any}
 */
async function fetchPostRecommendations(interests) {
  return fetch(`${flaskApikey}/get_recommendations`)
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
/**
 * Description
 * @param {any} userMastodonURL
 * @returns {any}
 */
async function fetchPeopleRecommended(userMastodonURL) {
  const url = `${flaskApikey}/get_recommendedpeople?userMastodonURL=${encodeURIComponent(
    userMastodonURL
  )}`;

  return fetch(url)
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

/**
 * Open the following small section on the screen or close it
 */
function openFollowing(){
  //fetch user data first
  const container = document.getElementById("followingSectionContent");
  container.style.display = container.style.display === 'flex'? 'none':'flex';

}

// Fetch interest and user account infos
/**
 * Description
 * @returns {any}
 */
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
    await fetchBasicInformation(data.users[i]);
    console.log(data.users[i]);
    if (
      data.users[i].interests &&
      Array.isArray(data.users[i].interests) &&
      data.users[i].interests.length > 0
    ) {
      const interest = data.users[i].interests;
      await fetchFollowerRecommendations(interest);
      hideLoadingGif("accountContainer");
      await fetchPostRecommendations(interest);
      hideLoadingGif("postContainer");
    }
    if (data.users[i].mastodonAccount?.trim()) {
      const userMastodonURL = data.users[i].mastodonAccount;
      await fetchPeopleRecommended(userMastodonURL);
      hideLoadingGif("recommendationContainer");
    }
    console.log("render finish");
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("logOutButton").addEventListener("click", () => {
    fetch(`${nodeApikey}/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
  if (sessionStorage.getItem("loginSuccess") === "true") {
    sessionStorage.removeItem("loginSuccess");
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
    });

    Toast.fire({
      icon: "success",
      title: "Signed in successfully",
    });
  }
};

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

  const openFollowingButton = document.getElementById("followingButton");
  openFollowingButton.onclick = openFollowing;
});

function showMastodonToast() {
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });

  Toast.fire({
    icon: "error",
    title: "Please Connect to Mastodon!",
  });
}

function followBtnFunction () {
  fetch(`${nodeApikey}/users`)
    .then((response) => response.json())
    .then((data) => {
      const users = data.users;
      const userToFollow = users[0];

      const userMastodonURL = userToFollow?.mastodonAccount;
      const followUserURL = recommendationData?.acct;

      const followURL = `${flaskApikey}/follow_People?userMastodonURL=${encodeURIComponent(
        userMastodonURL
      )}&followUserURL=${encodeURIComponent(followUserURL)}`;

      fetch(followURL)
        .then((response) => response.text())
        .then((result) => {
          console.log("Follow action result:", result);
          follow_btn.style.display = 'none';
          unfollow_btn.style.display = 'block';
        })
        .catch((error) => {
          console.error("Error following user:", error);
        });
    })
    .catch((error) => {
      console.error("Error fetching users:", error);
    });
}

function unfollowBtnFunction () {
  fetch(`${nodeApikey}/users`)
    .then((response) => response.json())
    .then((data) => {
      const users = data.users;
      const userToFollow = users[0];

      const userMastodonURL = userToFollow?.mastodonAccount;
      const followUserURL = recommendationData?.acct;

      const followURL = `${flaskApikey}/unfollow_People?userMastodonURL=${encodeURIComponent(
        userMastodonURL
      )}&unfollowUserURL=${encodeURIComponent(followUserURL)}`;

      fetch(followURL)
        .then((response) => response.text())
        .then((result) => {
          console.log("unFollow action result:", result);
          follow_btn.style.display = 'block';
          unfollow_btn.style.display = 'none';
        })
        .catch((error) => {
          console.error("Error following user:", error);
        });
    })
    .catch((error) => {
      console.error("Error fetching users:", error);
    });
}

/**
 * Description
 * @returns {any}
 */
async function getCredential() {
  // fetch user data
  let mastodonAccount;
  try {
    const response = await fetch(`${nodeApikey}/users`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get("username");
    const userIndex = data.users.findIndex(
      (user) => user.username === username
    );
    mastodonAccount = data?.users[userIndex]?.mastodonAccount;
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
      btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-mastodon" viewBox="0 0 16 16">
      <path d="M11.19 12.195c2.016-.24 3.77-1.475 3.99-2.603.348-1.778.32-4.339.32-4.339 0-3.47-2.286-4.488-2.286-4.488C12.062.238 10.083.017 8.027 0h-.05C5.92.017 3.942.238 2.79.765c0 0-2.285 1.017-2.285 4.488l-.002.662c-.004.64-.007 1.35.011 2.091.083 3.394.626 6.74 3.78 7.57 1.454.383 2.703.463 3.709.408 1.823-.1 2.847-.647 2.847-.647l-.06-1.317s-1.303.41-2.767.36c-1.45-.05-2.98-.156-3.215-1.928a3.614 3.614 0 0 1-.033-.496s1.424.346 3.228.428c1.103.05 2.137-.064 3.188-.189zm1.613-2.47H11.13v-4.08c0-.859-.364-1.295-1.091-1.295-.804 0-1.207.517-1.207 1.541v2.233H7.168V5.89c0-1.024-.403-1.541-1.207-1.541-.727 0-1.091.436-1.091 1.296v4.079H3.197V5.522c0-.859.22-1.541.66-2.046.456-.505 1.052-.764 1.793-.764.856 0 1.504.328 1.933.983L8 4.39l.417-.695c.429-.655 1.077-.983 1.934-.983.74 0 1.336.259 1.791.764.442.505.661 1.187.661 2.046v4.203z"/>
    </svg>Linked`;
      const followBtns1 = document.getElementsByClassName(
        "follower-card-follow-button"
      );
      Array.from(followBtns1).forEach((followBtn) => {
        followBtn.removeEventListener("click", showMastodonToast);
      });
      const followBtns2 = document.getElementsByClassName(
        "people-card-follow-button"
      );
      Array.from(followBtns2).forEach((followBtn) => {
        followBtn.removeEventListener("click", showMastodonToast);
      });
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
            btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-mastodon" viewBox="0 0 16 16">
              <path d="M11.19 12.195c2.016-.24 3.77-1.475 3.99-2.603.348-1.778.32-4.339.32-4.339 0-3.47-2.286-4.488-2.286-4.488C12.062.238 10.083.017 8.027 0h-.05C5.92.017 3.942.238 2.79.765c0 0-2.285 1.017-2.285 4.488l-.002.662c-.004.64-.007 1.35.011 2.091.083 3.394.626 6.74 3.78 7.57 1.454.383 2.703.463 3.709.408 1.823-.1 2.847-.647 2.847-.647l-.06-1.317s-1.303.41-2.767.36c-1.45-.05-2.98-.156-3.215-1.928a3.614 3.614 0 0 1-.033-.496s1.424.346 3.228.428c1.103.05 2.137-.064 3.188-.189zm1.613-2.47H11.13v-4.08c0-.859-.364-1.295-1.091-1.295-.804 0-1.207.517-1.207 1.541v2.233H7.168V5.89c0-1.024-.403-1.541-1.207-1.541-.727 0-1.091.436-1.091 1.296v4.079H3.197V5.522c0-.859.22-1.541.66-2.046.456-.505 1.052-.764 1.793-.764.856 0 1.504.328 1.933.983L8 4.39l.417-.695c.429-.655 1.077-.983 1.934-.983.74 0 1.336.259 1.791.764.442.505.661 1.187.661 2.046v4.203z"/>
            </svg>Linked`;
            const followBtns1 = document.getElementsByClassName(
              "follower-card-follow-button"
            );
            Array.from(followBtns1).forEach((followBtn) => {
              followBtn.removeEventListener("click", showMastodonToast);
            });
            const followBtns2 = document.getElementsByClassName(
              "people-card-follow-button"
            );
            Array.from(followBtns2).forEach((followBtn) => {
              followBtn.removeEventListener("click", showMastodonToast);
            });
          } else {
            const btn = document.getElementById("get-credential-btn");
            btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-mastodon" viewBox="0 0 16 16">
              <path d="M11.19 12.195c2.016-.24 3.77-1.475 3.99-2.603.348-1.778.32-4.339.32-4.339 0-3.47-2.286-4.488-2.286-4.488C12.062.238 10.083.017 8.027 0h-.05C5.92.017 3.942.238 2.79.765c0 0-2.285 1.017-2.285 4.488l-.002.662c-.004.64-.007 1.35.011 2.091.083 3.394.626 6.74 3.78 7.57 1.454.383 2.703.463 3.709.408 1.823-.1 2.847-.647 2.847-.647l-.06-1.317s-1.303.41-2.767.36c-1.45-.05-2.98-.156-3.215-1.928a3.614 3.614 0 0 1-.033-.496s1.424.346 3.228.428c1.103.05 2.137-.064 3.188-.189zm1.613-2.47H11.13v-4.08c0-.859-.364-1.295-1.091-1.295-.804 0-1.207.517-1.207 1.541v2.233H7.168V5.89c0-1.024-.403-1.541-1.207-1.541-.727 0-1.091.436-1.091 1.296v4.079H3.197V5.522c0-.859.22-1.541.66-2.046.456-.505 1.052-.764 1.793-.764.856 0 1.504.328 1.933.983L8 4.39l.417-.695c.429-.655 1.077-.983 1.934-.983.74 0 1.336.259 1.791.764.442.505.661 1.187.661 2.046v4.203z"/>
            </svg> Click here to link Mastodon`;
            btn.addEventListener("click", getCredential);
            const followBtns1 = document.getElementsByClassName(
              "follower-card-follow-button"
            );
            Array.from(followBtns1).forEach((followBtn) => {
              followBtn.addEventListener("click", showMastodonToast);
            });
            const followBtns2 = document.getElementsByClassName(
              "people-card-follow-button"
            );
            Array.from(followBtns2).forEach((followBtn) => {
              followBtn.addEventListener("click", showMastodonToast);
            });
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