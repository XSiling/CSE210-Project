import { flaskApikey, nodeApikey } from '../api/api.js';

const PREDEFINED_IMAGE_URL = "/src/images/user-image/";

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
 * Fetch the mastodon account of the user from server.
 * @async
*/
async function fetchMastodon(){
    console.log("fetch mastodon account from server...");
    try {
        const response = await fetch(`${nodeApikey}/users`,{
            method: 'GET',
            headers:{
                'Content-Type': 'application/json',
            },
        });
        /**
         * All the user information including username, interest, mastodonaccount
         * @type {list}
         */
        const data = await response.json();

        if (data.success){
            // set the mastodon content into some UI
            /**
             * The username
             * @type {string}
             */
            const username = fetchUsername();
            /**
             * The mastodon account
             * @type {string}
             */
            let mastodonAccount = '';
            for(let i=0; i<data.users.length; ++i){
                if (data.users[i].username === username){
                    mastodonAccount = data.users[i].mastodonAccount;
                }
            }
            // const mastodonAccount = data.users.username.mastodonAccount;
            document.getElementById("mastodonInput").setAttribute("value", mastodonAccount);
            document.getElementById("userProfileMastodonAccount").innerHTML = "<div>" + mastodonAccount +  "</div>"
        }else{
            alert("fetching mastodon account failure");
        }
    }catch(error){
        console.error('Error during fetching Mastodon Account');
    }


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
    document.getElementById("closeButton").style.display = 'block';
}


/**
 * Close the expanded section of interests buttons
 * @exports
 */

export function close(){
    console.log("close");
    var elements = document.getElementsByClassName("interestsContainerLine");
    for(var i=5;i<category;++i){
        elements[i].style.display = 'none';
    }
    document.getElementById("expandButton").style.display = 'block';
    document.getElementById("closeButton").style.display = 'none';
    console.log("close!");
    fetchUserData();
}


/**
 * Create the interests buttons according to predefined interests lists;
 * @exports
 */
export function createInterestsButtons(){
    const container = document.getElementById("interestsButtons");

    // fetch from the database
    // if not, predefined.
    let line=0;

    for(line; line<category; ++line){
        //expand button
        if(line==5){
            let expandButton = document.createElement("button");
            // expandButton.setAttribute("onclick", "expand()");
            expandButton.setAttribute("type", "button");
            expandButton.setAttribute("id", "expandButton");
            expandButton.innerHTML="EXPAND";
            container.appendChild(expandButton);
        }

        let container1 = document.createElement("div");
        container1.setAttribute('class', 'interestsContainerLine')
        // container1.className = "interestsContainer";

        let containerLabel = document.createElement("div");
        containerLabel.setAttribute("class", "interestsContainerLabel");
        containerLabel.innerHTML = interestsCategory[line] + "<hr>";
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
        })

        container.appendChild(container1);
    }

    // close button
    let closeButton = document.createElement("button");
    // closeButton.setAttribute("onclick", "close()");
    closeButton.setAttribute("type", "button");
    closeButton.setAttribute("id", "closeButton");
    closeButton.innerHTML = "CLOSE";
    container.appendChild(closeButton);

    console.log("here");
    close();


    document.onclick = function(event) {
        let el = event.target;

        if (el.id == "expandButton") {
            expand();
        }

        if (el.id == "closeButton"){
            close();
        }

        if (el.className == "interestsRadio"){
            console.log(el.value, "clicked");
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
        window.alert("You can only choose up to 5 interests!");
        el.checked = false;
    }

}

/**
 * Set the current interests buttons status with the server user status
 * @async
 */
async function fetchCurrentInterests(){

    console.log("fetch interests from server...");
    try {
        const response = await fetch(`${nodeApikey}/users`,{
            method: 'GET',
            headers:{
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();

        if (data.success){
            // set the mastodon content into some UI
            const username = fetchUsername();
            var profile_img = undefined;
            var html = "";
            var interests = [];
            for(var i=0; i<data.users.length; ++i){
                if (data.users[i].username === username){
                    interests = data.users[i].interests;
                    profile_img = data.users[i].profile_img;
                    break;
                }
            }
            let radiosData = [];
            for (let i=0; i< interestsData.length; ++i){
                radiosData = radiosData.concat(interestsData[i]);
            }
            Array.from(interests).forEach(interest=>{
                document.getElementById(interest).checked=true;
                // html += '<li class="interestsLi">' + interest + "</li>";
                html += '<div class=interestsLi>' + interest + '</div>';
            });

            document.getElementById("userProfileInterests").innerHTML =  html ;

            // TODO:
            const container = document.getElementById("userProfileImage");
            let profile_image = document.createElement("img");
            profile_image.src = profile_img;
            let smt = profile_image.src;
            const image_url = smt.replace('/view', '/images/user-image');
            profile_image.src = image_url+'.png';
            profile_image.alt = "profile image";
            profile_image.className = "profile-image";
            container.appendChild(profile_image);

        }else{
            alert("fetching user interests failure");
        }
    }catch(error){
        console.error('Error during fetching user interests');
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
        const img = data.users[index].profile_img;
        const selected_avatar = document.getElementById(img);
        selected_avatar?.classList?.add('selected-img');
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
  }

// Call when the interests page is loaded
if (window.location.href.includes('interests.html')) {
    createInterestsButtons();
    fetchUsername();
    document.getElementById("interestsTextButton").onclick=addInterest;
}

if (window.location.href.includes("recommendations.html")){
    createInterestsButtons();

    // //update the website situations
    fetchUsername();
    fetchMastodon();
    fetchCurrentInterests();
    // document.getElementById("openProfileButton").onclick = editProfile;
    document.getElementById("interestsTextButton").onclick = closeProfile;
    function editProfile(){
        const smallWindow = document.getElementById("container-profile");
        smallWindow.style.display = 'block';
    }

    function closeProfile(){
        const smallWindow = document.getElementById('container-profile');
        smallWindow.style.display = 'none';
        //update the interests
        updateInterestsRecommendations();
    }
}
