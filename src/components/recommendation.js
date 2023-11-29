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


function createList(items, containerId) {
  // Find the container element
  const container = document.getElementById(containerId);
  if (!container) {
    console.error("Container not found");
    return;
  }

  // Create a list element
  const list = document.createElement("ul");

  // Iterate over the items and add them to the list
  items.forEach((item) => {
    const listItem = document.createElement("li");
    listItem.textContent = item;
    list.appendChild(listItem);
  });

  // Append the list to the container
  container.appendChild(list);
}


const items = ["Apple", "Banana", "Cherry"];


document.addEventListener("DOMContentLoaded", function () {
  createList(items, "listContainer1");
  createList(items, "listContainer2");
  createList(items, "listContainer3");
});



async function editProfile(){
  const smallWindow = document.getElementById("container-profile");
  smallWindow.style.display = 'block';
}

async function closeProfile(){
  const smallWindow = document.getElementById('container-profile');
  smallWindow.style.display = 'none';
}



function createInterestsButtons(){
  const container = document.getElementById("interestsButtons");

  // fetch from the database

  var line=0;
  
  for(line; line<category; ++line){
      var container1 = document.createElement("div");
      container1.setAttribute('class', 'interestsContainerLine')
      // container1.className = "interestsContainer";

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

}

createInterestsButtons()