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
  avatar.src = recommendationData.avatar;
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