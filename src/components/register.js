document.addEventListener("DOMContentLoaded", (event) => {
  const usernameInput = document.getElementById("newUsername");
  const usernameLabel = document.querySelector(".label-username");
  const passwordInput = document.getElementById("newPassword");
  const passwordLabel = document.querySelector(".label-password");
  const comfirmPasswordInput = document.getElementById("confirmPassword");
  const comfirmPasswordLabel = document.querySelector(
    ".label-comfirm-password"
  );
  const emailInput = document.getElementById("email");
  const emailLabel = document.querySelector(".label-email");

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

  function handleComfirmPasswordInput() {
    if (comfirmPasswordInput.value) {
      comfirmPasswordLabel.style.opacity = 1;
      comfirmPasswordLabel.style.maxHeight = "30px";
    } else {
      comfirmPasswordLabel.style.opacity = 0;
      comfirmPasswordLabel.style.maxHeight = "0";
    }
  }

  function handleEmailInput() {
    if (emailInput.value) {
      emailLabel.style.opacity = 1;
      emailLabel.style.maxHeight = "30px";
    } else {
      emailLabel.style.opacity = 0;
      emailLabel.style.maxHeight = "0";
    }
  }

  usernameInput.addEventListener("input", handleUsernameInput);
  passwordInput.addEventListener("input", handlePasswordInput);
  comfirmPasswordInput.addEventListener("input", handleComfirmPasswordInput);
  emailInput.addEventListener("input", handleEmailInput);
});
