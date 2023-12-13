
import { nodeApikey } from "../api/api.js";

const interestsData = [
    ["Star", "Fun", "Movie", "TV", "Photography", "Music", "Pop", "Comic"],
    ["Beauty", "Food", "Fashion", "Travel", "Art", "Dance", "Wellness", "Recreation"],
    ["Customs", "International", "History", "Law", "Tradition", "Culture", "Community", "Heritage"],
    ["Digital","Data", "Innovation","Gadgets","Software", "Internet", "Cybersecurity", "Programming"],
    ["Finance", "Business", "Investment", "Banking", "Markets", "Stocks", "Wealth", "Budgeting"],
    ["Home", "Pet", "Family", "Domestic", "Decor", "Garden", "Housing", "Comfort"],
    ["Book", "School", "Library", "Learning", "Knowledge", "Study", "Research", "Literature"],
    ["Sport", "Athletics", "Exercise", "Fitness", "Competition", "Games", "Outdoor", "Adventure"],
    ["Emotion", "Relationship", "Charity", "Love", "Empathy", "Advocacy", "Philanthropy", "Volunteer"],
]
const interestsCategory = [
    'Media', 'Leisure', 'Society', 'Technology', 'Economy', 'Living', 'Education', 'Recreation', 'Relationship'
]

const interestsCategoryDescriptions = [
    "Information and entertainment communication",
    "Free time relaxation and enjoyment",
    "Human community and interactions",
    "Advancements in tools and systems",
    "Financial systems and resources",
    "Daily life and existence",
    "Learning and knowledge acquisition",
    "Leisure activities for enjoyment",
    "Interpersonal connections and bonds"
]
const category = 9;

/**
 * Select the interest button according to text input;
 */
function addInterest(){
    /**
     * The interest input content;
     * @type {string}
     */
    const interest = document.getElementById("interestsText").value;

    /**
     * The predefined interests list;
     * @type {list[string]}
     */
    let radiosData = [];
    for (let i=0; i< interestsData.length; ++i){
        radiosData = radiosData.concat(interestsData[i]);
    }

    /**
     * The index of selected interest;
     * @type {int}
     */
    const idx = radiosData.indexOf(interest);
    if (idx==-1){
        alert("Enter one of the available interests");
    }else{
        const checkboxItem = document.getElementById(interest);
        checkboxItem.checked=true;
        checkRadio(checkboxItem);
    }
}

/**
 * fetch the user name from the url.
 * @returns the user name string
 */
function fetchUsername(){
    /**
     * The username
     * @type {string}
     */
    const url = window.location.href;
    let username;
    if (url.indexOf('=')!=-1){
        username = window.location.href.split('=')[1].split('&')[0];
    }
    else{
        username = parent.window.location.href.split('=')[1].split('&')[0];
    }

    document.getElementById("username").setAttribute("value", username);
    if (document.getElementById("userProfileUsername")){
        document.getElementById("userProfileUsername").innerHTML = username;
    }
    return username;
}


/**
 * Expand the compressed section of interests buttons
 * @exports
 */
export function expand(){
    var elements = document.getElementsByClassName("interestsContainerLine");
    for(var i=5; i<category;++i){
        elements[i].style.display = 'block';
    }
    document.getElementById("expandButton").style.display = 'none';
    document.getElementById("closeButton").style.display = 'inline-block';
}


/**
 * Close the expanded section of interests buttons
 * @exports
 */
export function close(){
    var elements = document.getElementsByClassName("interestsContainerLine");
    for(var i=5;i<category;++i){
        elements[i].style.display = 'none';
    }

    document.getElementById("expandButton").style.display = 'inline-block';
    document.getElementById("closeButton").style.display = 'none';
    fetchUserData();
}

/**
 * Expand or collapse a single line of interests.
 * @param {button} element 
 */
function expandLine(element){
    const line = element.parentNode.parentNode;
    if (element.name =="expand"){
        element.className = 'triangle-left';
        line.style.display = 'block';
        line.childNodes.forEach((node)=>{
            if (node.className == "interestsContainerLabel"){
                element.name = "close"
            }
            if (node.className == "interestsContainer"){
                node.style.display = "inline-block";
            }
        })
    }else{
        element.className = 'triangle-right';
        line.style.display = 'inline-block';
        line.childNodes.forEach((node)=>{
            if (node.className == "interestsContainerLabel"){
                element.name="expand";
            }
            if (node.className == "interestsContainer"){
                node.style.display = "none";
            }
        })
    }
}


/**
 * Create the interests buttons according to predefined interests lists;
 * @exports
 */
export function createInterestsButtons(){
    const container = document.getElementById("interestsButtons");
    const datalistContainer = document.getElementById("interestsTextList");
    let line=0;

    for(line; line<category; ++line){
        let container1 = document.createElement("div");
        container1.setAttribute('class', 'interestsContainerLine')

        let containerLabel = document.createElement("div");
        containerLabel.setAttribute("class", "interestsContainerLabel");
        containerLabel.innerHTML = '<h3 class="inlineText">' + interestsCategory[line] + ': ' + interestsCategoryDescriptions[line] + '</h3><button type="button" class="triangle-right" name="expand"></button>';
        container1.appendChild(containerLabel);

        interestsData[line].forEach(radioText=>{
            let container2 = document.createElement("div");
            container2.setAttribute("class", "interestsContainer");

            let radioLabel = document.createElement("label");
            radioLabel.setAttribute("for", radioText);
            radioLabel.setAttribute("class", "interestsLabel");
            radioLabel.innerHTML = "<input id=" + radioText + ' type="checkbox" value="' + radioText +
            '" name="interests" class="interestsRadio"><i>' + radioText + '</i>';
            container2.appendChild(radioLabel);
            container1.appendChild(container2);

            let datalistOption = document.createElement("option");
            datalistOption.setAttribute("value", radioText);
            datalistOption.innerHTML = radioText;
            datalistContainer.appendChild(datalistOption);
        })

        container.appendChild(container1);

    }

    expandLine(container.childNodes[0].childNodes[0].childNodes[1]);
    close();




    document.onclick = function(event) {
        let el = event.target;

        if (el.id == "expandButton") {
            expand();
        }

        if (el.id == "closeButton"){
            close();
        }

        if (el.className == "triangle-right" || el.className=='triangle-left'){
            expandLine(el);
        }

        if (el.className == "interestsRadio"){
            checkRadio(el);
        }
    };

}

/**
 * Check the current selected interests buttons number exceed 5 or not.
 * @param {element} Theclickedtarget
 * @exports
 */
export function checkRadio(el){
    const maxRadio = 5;
    let radioNumber = 0;
    let radios = document.getElementsByClassName("interestsRadio");
    Array.from(radios).forEach((element)=>{
        if (element.checked){
            radioNumber += 1;
        }
    })

    if (radioNumber > maxRadio){
        alert("You can only choose up to 5 interests!");
        el.checked = false;
    }

}



/**
 * Fetch the user data from server
 * @async
 */
async function fetchUserData() {
    try {
        const response = await fetch(`${nodeApikey}/users`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        const username = fetchUsername();
        let index = -1;
        for(let i=0; i<data.users.length;++i){
            if(data.users[i].username === username){
                index = i;
            }
        }
        const img = data?.users[index]?.profile_img;
        const selected_avatar = document.getElementById(img);
        selected_avatar?.classList?.add('selected-img');
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
}


/**
 * configuration step 1 - let the users select interests by datalist or checkboxes.
 */
function loadStepInterests(){
    const interestsStep = document.getElementById("form-interests");
    const profileimgStep = document.getElementById("form-profile-img");
    const accountStep = document.getElementById("form-account");
    interestsStep.style.display = 'block';
    profileimgStep.style.display = 'none';
    accountStep.style.display = 'none';
    document.getElementById("previousPageButton").style.display = 'none';
    document.getElementById("nextPageButton").onclick = loadStepProfileImg;
}

/**
 * configuration step 2 - let the users choose the profile img.
 */
function loadStepProfileImg(){
    const interestsStep = document.getElementById("form-interests");
    const profileimgStep = document.getElementById("form-profile-img");
    const accountStep = document.getElementById("form-account");
    interestsStep.style.display = 'none';
    profileimgStep.style.display = 'block';
    accountStep.style.display = 'none';
    document.getElementById("previousPageButton").style.display = 'block';
    document.getElementById("previousPageButton").onclick=loadStepInterests;
    document.getElementById("nextPageButton").onclick = loadStepMastodonAccount;
}

/**
 * configuration step 3 - let the users input the mastodon account
 */
function loadStepMastodonAccount(){
    const interestsStep = document.getElementById("form-interests");
    const profileimgStep = document.getElementById("form-profile-img");
    const accountStep = document.getElementById("form-account");
    interestsStep.style.display = 'none';
    profileimgStep.style.display = 'none';
    accountStep.style.display = 'block';
    document.getElementById("previousPageButton").onclick = loadStepProfileImg;
    document.getElementById('nextPageButton').onclick = updateInterests;
}

/**
 * initialize the interests page structure and functions
 * Call when the interests page is loaded
 */
document.addEventListener("DOMContentLoaded", ()=>{
    if (window.location.href.includes('interests.html')) {
        createInterestsButtons();
        fetchUsername();

        document.getElementById("interestsTextButton").onclick = addInterest;
        loadStepInterests();
    }
})

/**
 * Check sessions
 */
window.onload = function () {
    if (sessionStorage.getItem('registerSuccess') === 'true') {
      sessionStorage.removeItem('registerSuccess');
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer);
          toast.addEventListener('mouseleave', Swal.resumeTimer);
        }
      });
  
      Toast.fire({
        icon: 'success',
        title: 'Register successfully'
      });
    }
  }