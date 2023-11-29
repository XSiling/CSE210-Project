
function addInterest(){
    const interest = document.getElementById("interestsText").value;
    const radiosData = ["Star","Fun","Emotion","Beauty","Movie","Sociaty","TV","Food","International","Finance","Book","Photography","Car","Sport","Digital","Fashion","Military","Home","Pet","Technology","Comic","Travel","History","Art","Law","Design","Music","Game","School","Childcare","Education","Dance","Relationship","Charity"];
    const idx = radiosData.indexOf(interest);
    if (idx==-1){
        alert("No such existed interests.");
    }else{
        const checkboxItem = document.getElementById(interest);
        checkboxItem.checked=true;
    }

}


function createInterestsButtons(){
    const container = document.getElementById("interestsButtons");

    // fetch from the database



    // if not, predefined.
    const radiosData = ["Star","Fun","Emotion","Beauty","Movie","Sociaty","TV","Food","International","Finance","Book","Photography","Car","Sport","Digital","Fashion","Military","Home","Pet","Technology","Comic","Travel","History","Art","Law","Design","Music","Game","School","Childcare","Education","Dance","Relationship","Charity"];
    const lineNumber = 5;
    const eachLineNumber = radiosData.length/6;
    
    var line=0;
    
    for(line; line<lineNumber; ++line){
        var container1 = document.createElement("div");
        container1.setAttribute('class', 'interestsContainerLine')
        // container1.className = "interestsContainer";

        radiosData.slice(line*eachLineNumber,(line+1)*eachLineNumber).forEach(radioText=>{
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


// Call when the interests page is loaded
if (window.location.href.includes('interests.html')) {
    createInterestsButtons();
}

