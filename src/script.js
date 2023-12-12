// script.js
const flaskApikey = "http://localhost:5000";
const nodeApikey = "http://localhost:3000";

const interestsData1 = [
  ["Star", "Fun", "Movie", "TV", "Photography", "Music", "Pop", "Comic"],
  [
    "Beauty",
    "Food",
    "Fashion",
    "Travel",
    "Art",
    "Dance",
    "Wellness",
    "Recreation",
  ],
  [
    "Customs",
    "International",
    "History",
    "Law",
    "Tradition",
    "Culture",
    "Community",
    "Heritage",
  ],
  [
    "Digital",
    "Data",
    "Innovation",
    "Gadgets",
    "Software",
    "Internet",
    "Cybersecurity",
    "Programming",
  ],
  [
    "Finance",
    "Business",
    "Investment",
    "Banking",
    "Markets",
    "Stocks",
    "Wealth",
    "Budgeting",
  ],
  [
    "Home",
    "Pet",
    "Family",
    "Domestic",
    "Decor",
    "Garden",
    "Housing",
    "Comfort",
  ],
  [
    "Book",
    "School",
    "Library",
    "Learning",
    "Knowledge",
    "Study",
    "Research",
    "Literature",
  ],
  [
    "Sport",
    "Athletics",
    "Exercise",
    "Fitness",
    "Competition",
    "Games",
    "Outdoor",
    "Adventure",
  ],
  [
    "Emotion",
    "Relationship",
    "Charity",
    "Love",
    "Empathy",
    "Advocacy",
    "Philanthropy",
    "Volunteer",
  ],
];
const interestsCategory1 = [
  "Media",
  "Leisure",
  "Society",
  "Technology",
  "Economy",
  "Living",
  "Education",
  "Recreation",
  "Relationship",
];
const category1 = 9;

/**
 * Handles the login functionality.
 * @async
 * @function
 */
async function login() {
  /**
   * Gets the username from the input field.
   * @type {string}
   */
  const username = document.getElementById("username").value;

  /**
   * Gets the password from the input field.
   * @type {string}
   */
  const password = document.getElementById("password").value;

  try {
    /**
     * Sends a login request to the server.
     * @type {Response}
     */
    const response = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    /**
     * Parses the JSON data from the response.
     * @type {Object}
     */
    const data = await response.json();

    if (data.success) {
      // Redirect to recommendations page on successful login
      sessionStorage.setItem("loginSuccess", "true");

      // After the toast, redirect to the recommendations page
      let url =
        "recommendations.html?username=" + encodeURIComponent(data.userName);
      window.location.href = url;
    } else {
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
        title: "Invalid username/password",
      });
    }
  } catch (error) {
    console.error("Error during login:", error);
  }
}

/**
 * Checks the login status and performs actions based on it.
 * @function
 */

/**
 * Automatically focus user to the "username" input field if exists
 * Loads the checkLoginStatus function on window load.
 */
window.onload = function () {
  let usernameInput = document.getElementById("username");
  let newUsernameInput = document.getElementById("newUsername");
  if (usernameInput) {
    usernameInput.focus();
  }
  if (newUsernameInput) {
    newUsernameInput.focus();
  }
  checkLoginStatus();
};

function isValidEmail(email) {
  const regex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  return regex.test(email);
}

/**
 * Handles the registration functionality.
 * @async
 * @function
 */
async function register() {
  /**
   * Gets the new username from the input field.
   * @type {string}
   */
  const username = document.getElementById("newUsername").value;

  /**
   * Gets the new password from the input field.
   * @type {string}
   */
  const password = document.getElementById("newPassword").value;

  /**
   * Gets the confirmed password from the input field.
   * @type {string}
   */
  const confirmPassword = document.getElementById("confirmPassword").value;

  /**
   * Gets the email from the input field.
   * @type {string}
   */
  const email = document.getElementById("email").value;
  if (!isValidEmail(email)) {
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
      title: "Invalid Email Address!",
    });
    return;
  }

  // make sure the password matches
  if (password !== confirmPassword) {
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
      title: "Passwords are not matched!",
    });
    return;
  }

  try {
    /**
     * Sends a registration request to the server.
     * @type {Response}
     */
    const response = await fetch("http://localhost:3000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password, confirmPassword, email }),
    });

    /**
     * Parses the JSON data from the response.
     * @type {Object}
     */
    const data = await response.json();

    if (data.success) {
      sessionStorage.setItem("registerSuccess", "true");
      let url = "../view/interests.html?username=" + data.userName;
      window.location.href = url;
    } else {
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
        title: data.message,
      });
    }
  } catch (error) {
    console.error("Error during registration:", error);
  }
}

//Handling Logout
async function logout() {
  fetch(`${nodeApikey}/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then(async (data) => {
      console.log(data);
      if (data.success) {
        await checkLoginStatus();
        window.location.href = 'login.html';
      }
    })
    .catch((error) => {
      console.error("Logout failed", error);
    });
}

// Function to update user interests
/**
 * Updates user interests.
 * @async
 * @function
 */
async function updateInterests() {
  /**
   * Gets the username from the input field.
   * @type {string}
   */
  const username = document.getElementById("username").value.split("&")[0];

  /**
   * Gets the Mastodon account from the input field.
   * @type {string}
   */
  const mastodonAccount = document.getElementById("mastodonInput").value;

  if (!mastodonAccount) {
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
      title: "Enter Mastodon Account!",
    });
    return;
  }

  try {
    const response = await fetch(
      `${flaskApikey}/check_User_Exists?userMastodonURL=${encodeURIComponent(
        mastodonAccount
      )}`
    );
    const data = await response.text();
    if (data === "False") {
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
        title: "Invalid Mastodon Account!",
      });
      return;
    }
    // console.log("User exists.");
  } catch (error) {
    console.error("Error checking user:", error);
    return;
  }

  /**
   * Gets the profile image from the selected image.
   * @type {string}
   */
  const profile_img = document.getElementsByClassName("selected-img")[0].id;

  /**
   * Gets the list of interest radio buttons.
   * @type {NodeList}
   */
  const interestsList = document.getElementsByClassName("interestsRadio");

  /**
   * Array to store selected interests.
   * @type {Array}
   */
  const interests = [];

  /**
   * Array to store interests data.
   * @type {Array}
   */
  let radiosData = [];

  // Combine interestsData1 arrays
  for (let i = 0; i < interestsData1.length; ++i) {
    radiosData = radiosData.concat(interestsData1[i]);
  }

  // Check selected interests
  for (let i = 0; i < interestsList.length; ++i) {
    if (interestsList[i].checked) {
      interests.push(radiosData[i]);
    }
  }
  console.log("!");

  try {
    /**
     * Sends a POST request to update user interests.
     * @type {Response}
     */
    const response = await fetch("http://localhost:3000/interests", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        interests,
        mastodonAccount,
        profile_img,
      }),
    });

    /**
     * Parses the JSON data from the response.
     * @type {Object}
     */
    const data = await response.json();

    if (data.success) {
      // Redirect to recommendations page on successful interests update
      let url = "recommendations.html?username=" + username;
      window.location.href = url;
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error("Error updating interests:", error);
  }
}

/**
 * @async
 * Update the interests in recommendations page
 */
async function updateInterestsRecommendations() {
  const username = document.getElementById("username").value.split("&")[0];
  // const mastodonAccount = document.getElementById('mastodonInput').value;
  // const profile_img = document.getElementsByClassName('selected-img')[0].id;
  const mastodonAccount = undefined;
  const profile_img = undefined;
  // need to modify here
  const interestsList = document.getElementsByClassName("interestsRadio");
  const interests = [];
  let radiosData = [];

  for (let i = 0; i < interestsData1.length; ++i) {
    radiosData = radiosData.concat(interestsData1[i]);
  }

  for (let i = 0; i < interestsList.length; ++i) {
    if (interestsList[i].checked) {
      interests.push(radiosData[i]);
    }
  }
  console.log("!");

  try {
    // Send a POST request to local server containing user:interests info
    const response = await fetch("http://localhost:3000/interests", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        interests,
        mastodonAccount,
        profile_img,
      }),
    });

    const data = await response.json();

    if (data.success) {
      //Redirect to recommendations page on successful interests update
      let url = "recommendations.html?username=" + username;
      window.location.href = url;
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error("Error updating interests:", error);
  }
}

/**
 * Checks the login status and performs actions based on it.
 * @function
 */

async function checkLoginStatus() {
  console.log("check login status");
  return fetch("http://localhost:3000/check-login", { credentials: "include" }) // Ensure credentials are included for session cookies
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      if (data.loggedIn) {
        window.location.href = data.redirectUrl;
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

// Call this function when the login page is loaded
// if (
//   window.location.href.includes("login") ||
//   window.location.href.includes("register")
// ) {
//   window.onload = checkLoginStatus;
// }

/**
 * Scrolls to the top of the window smoothly.
 */
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/**
 * Restrict user from login/register until all fields are filled
 */
function initializeFormValidation(
  formId,
  submitButtonId,
  inputFieldIds,
  isLogin
) {
  let form = document.getElementById(formId);
  let submitBtn = document.getElementById(submitButtonId);
  let inputFields = inputFieldIds.map((id) => document.getElementById(id));

  if (!form || !submitBtn) {
    return;
  }

  // Require password to be valid for registration button to be active
  function updateButtonState() {
    if (isLogin) {
      submitBtn.disabled = inputFields.some((field) => !field.value);
    } else {
      let new_password = document.getElementById("newPassword");
      submitBtn.disabled =
        inputFields.some((field) => !field.value) ||
        !new_password.checkValidity();
    }

    if (submitBtn.disabled) {
      submitBtn.classList.add("disabled-button");
    } else {
      submitBtn.classList.remove("disabled-button");
    }
  }

  inputFields.forEach((field) =>
    field.addEventListener("input", updateButtonState)
  );

  // Initial check in case the browser autocompletes fields
  updateButtonState();
}

/**
 * Initialize the form and password validation when the DOM is fully loaded
 */
document.addEventListener("DOMContentLoaded", function () {
  initializeFormValidation(
    "loginForm",
    "login-submit",
    ["username", "password"],
    true
  );
  initializeFormValidation(
    "registerForm",
    "register-submit",
    ["newUsername", "newPassword", "confirmPassword", "email"],
    false
  );
  initializePasswordValidation();

  // Auto-bind 'enter' key to login/register button
  document.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      document.querySelector(".login-register-button").click();
    }
  });
});

/**
 * Display reactive guidelines for password validation
 */
function initializePasswordValidation() {
  let new_password = document.getElementById("newPassword");
  let password_lowercase = document.getElementById("password-lowercase");
  let password_uppercase = document.getElementById("password-uppercase");
  let password_number = document.getElementById("password-number");
  let password_min_length = document.getElementById("password-min-length");

  // Only work if form is register and not login
  if (
    new_password &&
    password_lowercase &&
    password_uppercase &&
    password_number &&
    password_min_length
  ) {
    // Show password hint if user clicks into password box
    new_password.onfocus = function () {
      document.getElementById("password-message").style.display = "block";
    };

    // Hide password hint if user clicks out of input box
    new_password.onblur = function () {
      document.getElementById("password-message").style.display = "none";
    };

    // When the user starts to type something inside the password field
    new_password.onkeyup = function () {
      // Validate lowercase letters
      let lowerCaseLetters = /[a-z]/g;
      if (new_password.value.match(lowerCaseLetters)) {
        password_lowercase.classList.remove("invalid");
        password_lowercase.classList.add("valid");
      } else {
        password_lowercase.classList.remove("valid");
        password_lowercase.classList.add("invalid");
      }

      // Validate capital letters
      let upperCaseLetters = /[A-Z]/g;
      if (new_password.value.match(upperCaseLetters)) {
        password_uppercase.classList.remove("invalid");
        password_uppercase.classList.add("valid");
      } else {
        password_uppercase.classList.remove("valid");
        password_uppercase.classList.add("invalid");
      }

      // Validate numbers
      let numbers = /[0-9]/g;
      if (new_password.value.match(numbers)) {
        password_number.classList.remove("invalid");
        password_number.classList.add("valid");
      } else {
        password_number.classList.remove("valid");
        password_number.classList.add("invalid");
      }

      // Validate length
      if (new_password.value.length >= 8) {
        password_min_length.classList.remove("invalid");
        password_min_length.classList.add("valid");
      } else {
        password_min_length.classList.remove("valid");
        password_min_length.classList.add("invalid");
      }
    };
  }
}
