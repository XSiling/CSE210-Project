document.addEventListener("DOMContentLoaded", (event) => {
  const usernameInput = document.getElementById("username");
  const usernameLabel = document.querySelector(".label-username");
  const passwordInput = document.getElementById("password");
  const passwordLabel = document.querySelector(".label-password");

  function handleUsernameInput() {
    if (usernameInput.value) {
      usernameLabel.style.opacity = 1;
      usernameLabel.style.maxHeight = "30px";
    } else {
      usernameLabel.style.opacity = 0;
      usernameLabel.style.maxHeight = "0";
    }
  }

  function handlePasswordInput() {
    if (passwordInput.value) {
      passwordLabel.style.opacity = 1;
      passwordLabel.style.maxHeight = "30px";
    } else {
      passwordLabel.style.opacity = 0;
      passwordLabel.style.maxHeight = "0";
    }
  }

  usernameInput.addEventListener("input", handleUsernameInput);
  passwordInput.addEventListener("input", handlePasswordInput);
});
