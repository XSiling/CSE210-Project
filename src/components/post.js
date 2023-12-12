import { flaskApikey, nodeApikey } from "../api/api.js";

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
  avatar.crossOrigin = "anonymous";
  const originalUrl = recommendAccount?.account?.avatar;
  const proxyUrl = `${nodeApikey}/proxy?url=${encodeURIComponent(originalUrl)}`;
  avatar.src = proxyUrl;
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

  function getVideoMimeType(src) {
    if (src.endsWith('.mp4')) {
      return 'video/mp4';
    } else if (src.endsWith('.webm')) {
      return 'video/webm';
    } else if (src.endsWith('.ogv')) {
      return 'video/ogg';
    }
    return '';
  }

  if (recommendAccount?.media_attachments[0]?.url) {
    let src = recommendAccount?.media_attachments[0]?.url;
    if (src.endsWith('.mp4') || src.endsWith('.webm') || src.endsWith('.ogv')) {
      const content_attach = document.createElement("video");
      content_attach.setAttribute('controls', '');
      content_attach.crossOrigin = "anonymous";
      const proxyUrl = `${nodeApikey}/proxy?url=${encodeURIComponent(src)}`;
      const sourceElement = document.createElement('source');
      sourceElement.src = proxyUrl;
      sourceElement.alt = "content attachment";
      sourceElement.type = getVideoMimeType(src);
      content_attach.className = "post-card-content-attach";
      content_attach.appendChild(sourceElement);
      content_section.appendChild(content_attach);
    } else if (src.endsWith('.jpg') || src.endsWith('.png') || src.endsWith('.gif')) {
      const content_attach = document.createElement("img");
      content_attach.crossOrigin = "anonymous";
      const proxyUrl = `${nodeApikey}/proxy?url=${encodeURIComponent(src)}`;
      content_attach.src = proxyUrl;
      content_attach.alt = "content attachment";
      content_attach.className = "post-card-content-attach";
      content_section.appendChild(content_attach);
    }
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