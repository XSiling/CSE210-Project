
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
}

function fetchMastodon(){
    console.log("fetch mastodon from url");
    const url = window.location.href;
    const mastodonAccount = url.split("&mastodonAccount=")[1];
    document.getElementById("mastodonInput").setAttribute("value", mastodonAccount);
    console.log("here!!!!");
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

function checkCurrentInterests(){
    const url = window.location.href;
    const interests = url.split('&mastodonAccount=')[0].split('&Interests=').splice(1);
    let radiosData = [];
    for (var i=0; i< interestsData.length; ++i){
        radiosData = radiosData.concat(interestsData[i]);
    }

    Array.from(interests).forEach(interest=>{
        document.getElementById(interest).checked=true;
    });

}


// Call when the interests page is loaded
if (window.location.href.includes('interests.html')) {
    createInterestsButtons();
    fetchUsername();
}

if (window.location.href.includes("recommendations.html")){
    createInterestsButtons();
    fetchUsername();
    fetchMastodon();
    checkCurrentInterests();
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