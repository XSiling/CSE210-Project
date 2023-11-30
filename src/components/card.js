// let recommendationData = {"acct": "ndw",
//     "avatar": "https://files.mastodon.social/accounts/avatars/000/269/556/original/a4dd5c736092e4ea.jpg",
//     "avatar_static": "https://files.mastodon.social/accounts/avatars/000/269/556/original/a4dd5c736092e4ea.jpg",
//     "bot": false,
//     "created_at": "Tue, 02 Jan 2018 00:00:00 GMT",
//     "discoverable": false,
//     "display_name": "Norm Tovey-Walsh",
//     "emojis": [],
//     "fields": [
//       {
//         "name": "Homepage",
//         "value": "<a href=\"https://norm.tovey-walsh.com/\" target=\"_blank\" rel=\"nofollow noopener noreferrer me\" translate=\"no\"><span class=\"invisible\">https://</span><span class=\"\">norm.tovey-walsh.com/</span><span class=\"invisible\"></span></a>",
//         "verified_at": "2022-12-16T17:56:03.201+00:00"
//       },
//       {
//         "name": "Location",
//         "value": "Swansea, Wales",
//         "verified_at": null
//       },
//       {
//         "name": "Search",
//         "value": "tootfinder.ch",
//         "verified_at": null
//       }
//     ],
//     "followers_count": 501,
//     "following_count": 601,
//     "group": false,
//     "header": "https://files.mastodon.social/accounts/headers/000/269/556/original/3a0b6c8ef429359e.jpg",
//     "header_static": "https://files.mastodon.social/accounts/headers/000/269/556/original/3a0b6c8ef429359e.jpg",
//     "id": 269556,
//     "last_status_at": "Tue, 28 Nov 2023 00:00:00 GMT",
//     "locked": false,
//     "noindex": false,
//     "note": "<p>By way of <a href=\"https://mastodon.social/tags/introduction\" class=\"mention hashtag\" rel=\"tag\">#<span>introduction</span></a>, I&#39;m an inveterate hacker of markup (XML, HTML, SGML, TeX, JSON, DocBook, RELAX NG, XML Schema, Schematron) and wrangler of bits (XProc, XSLT, XQuery, Java, Scala, Python, JavaScript, C#). Author. Photographer. Occasional cook. Frequent bottle washer. Employed by Saxonica. Resident of Wales. Website tinkerer, <a href=\"https://norm.tovey-walsh.com/\" target=\"_blank\" rel=\"nofollow noopener noreferrer\" translate=\"no\"><span class=\"invisible\">https://</span><span class=\"\">norm.tovey-walsh.com/</span><span class=\"invisible\"></span></a></p>",
//     "roles": [],
//     "statuses_count": 2863,
//     "uri": "https://mastodon.social/users/ndw",
//     "url": "https://mastodon.social/@ndw",
//     "username": "ndw"}

export function renderRecommendation(recommendationData) {
  const card = document.createElement('section');
  card.className = 'user-card';

  const upperContainer = document.createElement('section');
  const middleContainer = document.createElement('section');
  const lowerContainer = document.createElement('section');
  upperContainer.className = 'upper-section';
  middleContainer.className = 'middle-section';
  lowerContainer.className = 'lower-section';
  
  const imgContainer = document.createElement('div');
  const infoContainer = document.createElement('div');
  imgContainer.className = 'img-section';
  infoContainer.className = 'info-section';

  const avatar = document.createElement('img');
  avatar.src = recommendationData.avatar;
  avatar.alt = 'Avatar';

  const nameUsernameContainer = document.createElement('div');
  const followersFollowingContainer = document.createElement('div');
  nameUsernameContainer.className = 'name-username-container';
  followersFollowingContainer.className = 'followers-following-container';

  const name = document.createElement('p');
  name.textContent = recommendationData.display_name;

  const username = document.createElement('p');
  username.textContent = `(${recommendationData.username})`;

  const followers = document.createElement('p');
  followers.textContent = `Followers: ${recommendationData.followers_count} |`;

  const following = document.createElement('p');
  following.textContent = ` Following: ${recommendationData.following_count}`;

  const bio = document.createElement('p');
  bio.innerHTML = recommendationData.note;

  const profileLink = document.createElement('a');
  profileLink.href = recommendationData.url;
  profileLink.textContent = 'View Profile';

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
  upperContainer.appendChild(infoContainer)
  card.appendChild(upperContainer);
  card.appendChild(middleContainer);
  card.appendChild(lowerContainer);

  return card;
}

// renderRecommendation(); // For Debug