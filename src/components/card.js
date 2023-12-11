import { flaskApikey, nodeApikey } from "../api/api.js";

function fetchImageDataUrl(imageUrl, callback) {
  const requestUrl = `${nodeApikey}/convert-to-data-url?imageUrl=${encodeURIComponent(imageUrl)}`;
  // console.log('Requesting data URL from:', requestUrl);
  fetch(requestUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.text();
    })
    .then(dataUrl => {
      // console.log('Received data URL:', dataUrl);
      callback(dataUrl);
    })
    .catch(error => {
      console.error('Error fetching Data URL:', error);
      callback(null);
    });
}

export function renderPeopleRecommendation(recommendationData) {
  const card = document.createElement('section');
  card.className = 'people-card';

  const upperContainer = document.createElement('section');
  const middleContainer = document.createElement('section');
  const lowerContainer = document.createElement('section');
  upperContainer.className = 'people-card-upper-section';
  middleContainer.className = 'people-card-middle-section';
  lowerContainer.className = 'people-card-lower-section';
  
  const imgContainer = document.createElement('section');
  const infoContainer = document.createElement('section');
  imgContainer.className = 'people-card-img-section';
  infoContainer.className = 'people-card-info-section';

  const avatar = document.createElement('img');
  fetchImageDataUrl(recommendationData.avatar, function(dataUrl) {
    if (dataUrl) {
      avatar.src = dataUrl;
    } else {
      avatar.src = '../images/default.png';
    }
  });
  avatar.alt = 'Avatar';
  avatar.className = 'people-card-avatar';

  const nameUsernameContainer = document.createElement('section');
  const followersFollowingContainer = document.createElement('section');
  nameUsernameContainer.className = 'people-card-name-username-container';
  followersFollowingContainer.className = 'people-card-followers-following-container';

  const name = document.createElement('p');
  name.textContent = recommendationData.display_name;
  name.className = 'people-card-name';

  const username = document.createElement('p');
  username.textContent = `(${recommendationData.username})`;
  username.className = 'people-card-username';

  const followers = document.createElement('p');
  followers.textContent = `Followers: ${recommendationData.followers_count}|`;
  followers.className = 'people-card-followers';

  const following = document.createElement('p');
  following.textContent = `Following: ${recommendationData.following_count}`;
  followers.className = 'people-card-following';

  const bio = document.createElement('p');
  bio.innerHTML = recommendationData.note;
  bio.className = 'people-card-bio';

  const profileLink = document.createElement('a');
  profileLink.href = recommendationData.url;
  profileLink.textContent = 'View Profile';
  profileLink.className = 'people-card-profile-link';
  profileLink.target = '_blank';
  profileLink.rel = 'noopener noreferrer';

  const follow_btn = document.createElement('a');
  follow_btn.textContent = 'Follow';
  follow_btn.className = 'people-card-follow-button';
  follow_btn.title = 'Follow him/her';

  follow_btn.addEventListener("click", async function () {
    follow_btn.innerHTML = `<img class="loading-image" src='../images/loading-1.svg' alt='loading' height='50px' width='auto'/>`;
    let user;
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
      user = data?.users[userIndex];
    } catch (error) {
      console.error("Error fetching data:", error);
    }

    const connected = document.getElementById("crediential-status").textContent;
    if (connected === "False") {
      return;
    }

    try {
      const username = user.username;
      const following = recommendationData?.acct;
      const userMastodonURL = user?.mastodonAccount;
      const followUserURL = recommendationData?.acct;

      const response = await fetch(`${nodeApikey}/follow`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          following,
        }),
      });

      const data = await response.json();
      if (!data.success) {
        alert(data.message);
        return;
      } else {
        // add that to following!
        const followingContainer = document.getElementById(
          "followingSectionContent"
        );
        let followAccount = document.createElement("div");
        followAccount.innerHTML = following;
        followAccount.innerText = following;
        followingContainer.appendChild(followAccount);
      }

      const followURL = `${flaskApikey}/follow_People?userMastodonURL=${encodeURIComponent(
        userMastodonURL
      )}&followUserURL=${encodeURIComponent(followUserURL)}`;

      fetch(followURL)
        .then((response) => response.text())
        .then((result) => {
          console.log("Follow action result:", result);
          follow_btn.textContent = "Follow";
          follow_btn.style.display = "none";
          unfollow_btn.style.display = "block";
        })
        .catch((error) => {
          console.error("Error following user:", error);
        });
    } catch (error) {
      console.error("Something weird happened:", error);
    }
  });

  const unfollow_btn = document.createElement("a");
  unfollow_btn.textContent = "Unfollow";
  unfollow_btn.className = "people-card-unfollow-button";
  unfollow_btn.style.display = 'none';
  unfollow_btn.title = 'Unfollow him/her';

  unfollow_btn.addEventListener("click", async function () {
    unfollow_btn.innerHTML = `<img class="loading-image" src='../images/loading-1.svg' alt='loading' height='50px' width='auto'/>`;
    let user;
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
      user = data?.users[userIndex];
    } catch (error) {
      console.error("Error fetching data:", error);
    }

    const connected = document.getElementById("crediential-status").textContent;
    if (connected === "False") {
      return;
    }

    try {
      const username = user.username;
      const following = recommendationData?.acct;
      const userMastodonURL = user?.mastodonAccount;
      const followUserURL = recommendationData?.acct;

      const response = await fetch(`${nodeApikey}/unfollow`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          following,
        }),
      });

      const data = await response.json();
      if (!data.success) {
        alert(data.message);
        return;
      } else {
        // remove that from the followings!
        const followingContainer = document.getElementById(
          "followingSectionContent"
        );
        followingContainer.childNodes.forEach((node) => {
          if (node.innerHTML === following) {
            followingContainer.removeChild(node);
          }
        });
      }

      const followURL = `${flaskApikey}/unfollow_People?userMastodonURL=${encodeURIComponent(
        userMastodonURL
      )}&unfollowUserURL=${encodeURIComponent(followUserURL)}`;

      fetch(followURL)
        .then((response) => response.text())
        .then((result) => {
          console.log("unFollow action result:", result);
          follow_btn.style.display = "block";
          unfollow_btn.style.display = "none";
          unfollow_btn.textContent = "Unfollow";
        })
        .catch((error) => {
          console.error("Error following user:", error);
        });
    } catch (error) {
      console.error("Something weird happened:", error);
    }
  });

  imgContainer.appendChild(avatar);
  nameUsernameContainer.appendChild(name);
  nameUsernameContainer.appendChild(username);
  followersFollowingContainer.appendChild(followers);
  followersFollowingContainer.appendChild(following);
  infoContainer.appendChild(nameUsernameContainer);
  infoContainer.appendChild(followersFollowingContainer);
  middleContainer.appendChild(bio);
  lowerContainer.appendChild(profileLink);
  lowerContainer.appendChild(follow_btn);
  lowerContainer.appendChild(unfollow_btn);
  upperContainer.appendChild(imgContainer);
  upperContainer.appendChild(infoContainer);
  card.appendChild(upperContainer);
  card.appendChild(middleContainer);
  card.appendChild(lowerContainer);

  return card;
}