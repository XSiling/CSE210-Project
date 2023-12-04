export function renderFollowerRecommendation(recommendationData) {
  const card = document.createElement('section');
  card.className = 'follower-card';

  const upperContainer = document.createElement('section');
  const middleContainer = document.createElement('section');
  const lowerContainer = document.createElement('section');
  upperContainer.className = 'follower-card-upper-section';
  middleContainer.className = 'follower-card-middle-section';
  lowerContainer.className = 'follower-card-lower-section';
  
  const imgContainer = document.createElement('section');
  const infoContainer = document.createElement('section');
  imgContainer.className = 'follower-card-img-section';
  infoContainer.className = 'follower-card-info-section';

  const avatar = document.createElement('img');
  avatar.src = recommendationData.avatar;
  avatar.alt = 'Avatar';
  avatar.className = 'follower-card-avatar';

  const nameUsernameContainer = document.createElement('section');
  const followersFollowingContainer = document.createElement('section');
  nameUsernameContainer.className = 'follower-card-name-username-container';
  followersFollowingContainer.className = 'follower-card-followers-following-container';

  const name = document.createElement('p');
  name.textContent = recommendationData.display_name;
  name.className = 'follower-card-name';

  const username = document.createElement('p');
  username.textContent = `(${recommendationData.username})`;
  username.className = 'follower-card-username';

  const followers = document.createElement('p');
  followers.textContent = `Followers: ${recommendationData.followers_count}|`;
  followers.className = 'follower-card-followers';

  const following = document.createElement('p');
  following.textContent = `Following: ${recommendationData.following_count}`;
  followers.className = 'follower-card-following';

  const bio = document.createElement('p');
  bio.innerHTML = recommendationData.note;
  bio.className = 'follower-card-bio';

  const profileLink = document.createElement('a');
  profileLink.href = recommendationData.url;
  profileLink.textContent = 'View Profile';
  profileLink.className = 'follower-card-profile-link';
  profileLink.target = '_blank';
  profileLink.rel = 'noopener noreferrer';

  imgContainer.appendChild(avatar);
  nameUsernameContainer.appendChild(name);
  nameUsernameContainer.appendChild(username);
  followersFollowingContainer.appendChild(followers);
  followersFollowingContainer.appendChild(following);
  infoContainer.appendChild(nameUsernameContainer);
  infoContainer.appendChild(followersFollowingContainer);
  middleContainer.appendChild(bio);
  lowerContainer.appendChild(profileLink);
  upperContainer.appendChild(imgContainer);
  upperContainer.appendChild(infoContainer);
  card.appendChild(upperContainer);
  card.appendChild(middleContainer);
  card.appendChild(lowerContainer);

  return card;
}