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

function addInterest(){
    const interest = document.getElementById("interestsText").value;

    let radiosData = [];
    for (var i=0; i< interestsData.length; ++i){
        radiosData = radiosData.concat(interestsData[i]);
    }
    const idx = radiosData.indexOf(interest);
    if (idx==-1){
        alert("No such existed interests.");
    }else{
        const checkboxItem = document.getElementById(interest);
        checkboxItem.checked=true;
        checkRadio(checkboxItem);
    }
}

function fetchUsername(){
    const url = window.location.href;
    const username = url.split('=')[1].split('&')[0];
    
    document.getElementById("username").setAttribute("value", username);
    document.getElementById("userProfileUsername").innerHTML = username;
    
    return username;
}

async function fetchMastodon(){
    console.log("fetch mastodon account from server...");
    try {
        const response = await fetch('http://localhost:3000/users',{
            method: 'GET',
            headers:{
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();

        if (data.success){
            // set the mastodon content into some UI
            const username = fetchUsername();
            var mastodonAccount = '';
            for(var i=0; i<data.users.length; ++i){
                if (data.users[i].username === username){
                    mastodonAccount = data.users[i].mastodonAccount;
                }
            }
            // const mastodonAccount = data.users.username.mastodonAccount;
            document.getElementById("mastodonInput").setAttribute("value", mastodonAccount);
        }else{
            alert("fetching mastodon account failure");
        }
    }catch(error){
        console.error('Error during fetching Mastodon Accocunt');
    }


}

function expand(){
    var elements = document.getElementsByClassName("interestsContainerLine");
    for(var i=5; i<category;++i){
        elements[i].style.display = 'block';
    }
    document.getElementById("expandButton").style.display = 'none';
    document.getElementById("closeButton").style.display = 'block';
}

function close(){
    console.log("close");
    var elements = document.getElementsByClassName("interestsContainerLine");
    for(var i=5;i<category;++i){
        elements[i].style.display = 'none';
    }
    document.getElementById("expandButton").style.display = 'block';
    document.getElementById("closeButton").style.display = 'none';
    console.log("close!");
}


function createInterestsButtons(){
    const container = document.getElementById("interestsButtons");

    // fetch from the database



    // if not, predefined.
    var line=0;
    
    for(line; line<category; ++line){

        //expand button
        if(line==5){
            var expandButton = document.createElement("button");
            expandButton.setAttribute("onclick", "expand()");
            expandButton.setAttribute("type", "button");
            expandButton.setAttribute("id", "expandButton");
            expandButton.innerHTML="EXPAND";
            container.appendChild(expandButton);
        }

        var container1 = document.createElement("div");
        container1.setAttribute('class', 'interestsContainerLine')
        // container1.className = "interestsContainer";

        var containerLabel = document.createElement("div");
        containerLabel.setAttribute("class", "interestsContainerLabel");
        containerLabel.innerHTML = interestsCategory[line] + "<hr>";
        container1.appendChild(containerLabel);

        interestsData[line].forEach(radioText=>{
            var container2 = document.createElement("div");
            container2.setAttribute("class", "interestsContainer");

            var radioLabel = document.createElement("label");
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
    var closeButton = document.createElement("button");
    closeButton.setAttribute("onclick", "close()");
    closeButton.setAttribute("type", "button");
    closeButton.setAttribute("id", "closeButton");
    closeButton.innerHTML = "CLOSE";
    container.appendChild(closeButton);

    console.log("here");
    close();


    document.onclick = function(event) {
        var el = event.target;
        
        if (el.id == "expandButton") {
            expand();
        }

        if (el.id == "closeButton"){
            close();
        }

        if (el.className == "interestsRadio"){
            console.log("?")
            checkRadio(el);
        }
    };

}


function checkRadio(el){
    const maxRadio = 5;
    var radioNumber = 0;
    var radios = document.getElementsByClassName("interestsRadio");
    Array.from(radios).forEach((element)=>{
        if (element.checked){
            radioNumber += 1;
        }
    })

    if (radioNumber > 5){
        window.alert("You can only choose up to 5 interests!");
        el.checked = false;
    }

}

async function fetchCurrentInterests(){

    console.log("fetch interests from server...");
    try {
        const response = await fetch('http://localhost:3000/users',{
            method: 'GET',
            headers:{
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();

        if (data.success){
            // set the mastodon content into some UI
            const username = fetchUsername();
            const profile_img = data.users[0].profile_img;
            var html = "";
            var interests = [];
            for(var i=0; i<data.users.length; ++i){
                if (data.users[i].username === username){
                    interests = data.users[i].interests;
                }
            }
            let radiosData = [];
            for (var i=0; i< interestsData.length; ++i){
                radiosData = radiosData.concat(interestsData[i]);
            }
            Array.from(interests).forEach(interest=>{
                document.getElementById(interest).checked=true;
                html += '<li class="interestsLi">' + interest + "</li>";
            });

            document.getElementById("userProfileInterests").innerHTML = "<ul>" + html + "</ul>";

            // TODO:
            const container = document.getElementById("userProfileImage");
            let profile_image = document.createElement("img");
            profile_image.src = profile_img;
            let smt = profile_image.src;
            const image_url = smt.replace('/view', '/images/user-image');
            profile_image.src = image_url+'.jpg';
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

// Call when the interests page is loaded
if (window.location.href.includes('interests.html')) {
    createInterestsButtons();
    fetchUsername();
}

if (window.location.href.includes("recommendations.html")){
    createInterestsButtons();

    // //update the website situations
    fetchUsername();
    fetchMastodon();
    fetchCurrentInterests();
    document.getElementById("openProfileButton").onclick = editProfile;
    document.getElementById("interestsTextButton").onclick = closeProfile;
    function editProfile(){
        const smallWindow = document.getElementById("container-profile");
        smallWindow.style.display = 'block';
    }

    function closeProfile(){
        const smallWindow = document.getElementById('container-profile');
        smallWindow.style.display = 'none';
        //update the interests
        updateInterests();
    }
}