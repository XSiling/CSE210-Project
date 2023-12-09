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

export function renderRecommendationPost(recommendAccount) {
  const card = document.createElement("article");
  card.className = "post-card";

  const header_section = document.createElement("div");
  header_section.className = "post-card-header";

  const user_info = document.createElement("div");
  user_info.className = "post-card-user-info";

  const name_section = document.createElement("span");
  name_section.className = "post-card-name";

  const username = document.createElement("span");
  username.textContent = recommendAccount?.account?.username;
  username.className = "post-card-username";

  const email = document.createElement("span");
  email.textContent = recommendAccount?.account?.acct;
  email.className = "post-card-email";

  user_info.appendChild(username);
  user_info.appendChild(email);

  const avatar = document.createElement("img");
  fetchImageDataUrl(recommendAccount?.account?.avatar, function(dataUrl) {
    if (dataUrl) {
      avatar.src = dataUrl;
    } else {
      avatar.src = '../images/default.png';
    }
  });
  avatar.alt = "Avatar";
  avatar.className = "post-card-avatar";

  const time = document.createElement("p");
  if (recommendAccount?.created_at) {
    const date = new Date(recommendAccount.created_at);
    time.textContent = date.toLocaleDateString("en-US");
  }
  time.className = "post-card-timestamp";

  header_section.appendChild(avatar);
  header_section.appendChild(user_info);
  header_section.appendChild(time);

  const content_section = document.createElement("section");
  content_section.className = "post-card-content-section";

  const content = document.createElement("p");
  content.innerHTML = recommendAccount.content;
  content.className = "post-card-content";

  content_section.appendChild(content);

  if (recommendAccount?.media_attachments[0]?.url) {
    const content_attach = document.createElement("img");
    fetchImageDataUrl(recommendAccount.media_attachments[0]?.url, function(dataUrl) {
      if (dataUrl) {
        content_attach.src = dataUrl;
      } else {
        content_attach.src = '';
        content_attach.style.display = 'none';
      }
    });
    content_attach.alt = "content attachment";
    content_attach.className = "post-card-content-attach";
    content_section.appendChild(content_attach);
  }

  const content_info_section = document.createElement("span");
  content_info_section.className = "post-card-content-info-section";

  const viewed_num = document.createElement("p");
  viewed_num.textContent = `Viewed: ${recommendAccount.account.statuses_count} |`;
  viewed_num.className = "post-card-viewed";

  const visibility = document.createElement("p");
  visibility.textContent = `Visibility: ${recommendAccount.visibility}`;
  visibility.className = "post-card-visibility";

  content_info_section.appendChild(viewed_num);
  content_info_section.appendChild(visibility);
  content_section.appendChild(content_info_section);

  // const url = document.createElement('p');
  // url.textContent = recommendAccount.account.uri;

  const tagsContainer = document.createElement("div");
  tagsContainer.className = "post-card-tags-container";

  if (
    recommendAccount.tags &&
    Array.isArray(recommendAccount.tags) &&
    recommendAccount.tags.length > 0
  ) {
    recommendAccount.tags.forEach((tag) => {
      const tagButton = document.createElement("a");
      tagButton.href = tag.url;
      tagButton.textContent = `#${tag.name} `;
      tagButton.className = "tag-button";
      tagButton.target = "_blank";
      tagButton.rel = "noopener noreferrer";
      tagsContainer.appendChild(tagButton);
    });
  } else {
    tagsContainer.style.display = "none";
  }

  card.appendChild(header_section);
  card.appendChild(content_section);
  if (tagsContainer.hasChildNodes()) {
    card.appendChild(tagsContainer);
  }
  return card;
}