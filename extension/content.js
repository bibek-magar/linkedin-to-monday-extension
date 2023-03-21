
//Create a button element
var saveButton = document.createElement("button");
saveButton.id = "save-button"
saveButton.className = "save-button artdeco-dropdown__trigger artdeco-dropdown__trigger--placement-bottom ember-view artdeco-button artdeco-button--2 artdeco-button--primary m0"
saveButton.textContent = "Save";

saveButton.onclick = function() {
    // handle button click event
};


// Search for a parent node to inject.
let parentElement = document.querySelector(".pv-text-details__left-panel > div > h1");


//Injecting button into parent element
parentElement.insertAdjacentHTML("afterend", saveButton.outerHTML);




console.log("Hello new update")