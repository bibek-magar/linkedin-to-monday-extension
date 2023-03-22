window.onload = function () {
  loadButton();
};

document.addEventListener('click', (e) => {
  if (e.target.id == 'save-button') {
    const vanityName = getVanityName();
    console.log('Save button clicked with value', vanityName);
    showSnackBar();
  }
});

function getVanityName() {
  const pathName = window.location.pathname;
  const regex = /\/in\/(.*)\//;
  const match = pathName.match(regex);
  const vanityName = match ? match[1] : null;
  return vanityName;
}

function loadButton() {
  const parentElement = document.body.querySelector(
    '.pv-text-details__left-panel > div > h1'
  );

  const saveButton = getButton();

  if (parentElement != null) {
    parentElement.insertAdjacentHTML('afterend', saveButton.outerHTML);
  }
}

function getButton() {
  const saveButton = document.createElement('button');
  saveButton.onclick = function () {
    console.log('HEllo');
  };

  saveButton.id = 'save-button';
  saveButton.className =
    'save-button artdeco-dropdown__trigger artdeco-dropdown__trigger--placement-bottom ember-view artdeco-button artdeco-button--2 artdeco-button--primary m0';
  saveButton.textContent = 'Save';

  return saveButton;
}

function showSnackBar() {
  const snackbar = document.createElement('div');

  // Set the properties of the snackbar element
  snackbar.innerText = 'Successfully saved to Monday';
  snackbar.style.visibility = 'hidden';
  snackbar.style.minWidth = '250px';
  snackbar.style.backgroundColor = '#333';
  snackbar.style.color = '#fff';
  snackbar.style.textAlign = 'center';
  snackbar.style.borderRadius = '2px';
  snackbar.style.padding = '16px';
  snackbar.style.position = 'fixed';
  snackbar.style.zIndex = '1';
  snackbar.style.right = '10px';
  snackbar.style.top = '10px';

  // Add the snackbar element to the document
  document.body.appendChild(snackbar);

  // Show the snackbar
  snackbar.style.visibility = 'visible';

  // Hide the snackbar after a delay
  setTimeout(() => {
    snackbar.style.visibility = 'hidden';
  }, 2500);
}
