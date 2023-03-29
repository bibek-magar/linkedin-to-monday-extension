
const graphqlURL = 'http://localhost:3000/graphql';

loadButton();


// Add the modal to the page
const modal = getModal();
document.body.appendChild(modal);


//Component part
function loadButton() {
  const parentElement = document.body.querySelector(
    '.pv-text-details__left-panel > div > h1'
  );

  const saveButton = getButton();
  let myTimeout;

  if (parentElement != null) {
    parentElement.insertAdjacentHTML('afterend', saveButton.outerHTML);
    clearTimeout(myTimeout);
  } else {
    myTimeout = setTimeout(loadButton, 500);
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


function getModal() {
  // Create the modal HTML
  const modal = document.createElement('div');
  modal.id = 'myModal';
  modal.classList.add('modal');
  const modalContent = document.createElement('div');
  modalContent.classList.add('modal-content');

  const closeBtn = document.createElement('span');
  closeBtn.id = 'close-modal-button';
  closeBtn.classList.add('close');
  closeBtn.innerHTML = '&times;';
  closeBtn.addEventListener('click', closeModal);

  const form = document.createElement('form');

  const nameLabel = document.createElement('label');
  nameLabel.for = 'name';
  nameLabel.innerHTML = 'Name:';
  form.appendChild(nameLabel);

  const nameInput = document.createElement('input');
  nameInput.type = 'text';
  nameInput.id = 'name';
  nameInput.name = 'name';
  nameInput.value = getUserName();

  form.appendChild(nameInput);

  const emailLabel = document.createElement('label');
  emailLabel.for = 'email';
  emailLabel.innerHTML = 'Email:';
  form.appendChild(emailLabel);

  const emailInput = document.createElement('input');
  emailInput.type = 'email';
  emailInput.id = 'email';
  emailInput.name = 'email';
  form.appendChild(emailInput);

  const companyLabel = document.createElement('label');
  companyLabel.for = 'company';
  companyLabel.innerHTML = 'Company:';
  form.appendChild(companyLabel);

  const companyInput = document.createElement('input');
  companyInput.type = 'text';
  companyInput.id = 'company';
  companyInput.name = 'company';
  form.appendChild(companyInput);

  const urlLabel = document.createElement('label');
  urlLabel.for = 'url';
  urlLabel.innerHTML = 'URL:';
  form.appendChild(urlLabel);

  const urlInput = document.createElement('input');
  urlInput.type = 'url';
  urlInput.id = 'url';
  urlInput.name = 'url';
  urlInput.value = window.location.href;

  form.appendChild(urlInput);

  const saveBtn = document.createElement('button');
  saveBtn.style.marginTop = '20px';
  saveBtn.className =
    'save-button artdeco-dropdown__trigger artdeco-dropdown__trigger--placement-bottom ember-view artdeco-button artdeco-button--2 artdeco-button--primary';
  saveBtn.type = 'button';
  saveBtn.innerHTML = 'Save';
  saveBtn.addEventListener('click', saveForm);

  form.appendChild(saveBtn);
  modalContent.appendChild(closeBtn);
  modalContent.appendChild(form);
  modal.appendChild(modalContent);

  // Apply styles to the modal
  modal.style.display = 'none';
  modal.style.position = 'fixed';
  modal.style.zIndex = '999';
  modal.style.left = '0';
  modal.style.top = '0';
  modal.style.width = '100%';
  modal.style.height = '100%';
  modal.style.overflow = 'auto';
  modal.style.backgroundColor = 'rgba(0,0,0,0.4)';

  modalContent.style.backgroundColor = '#fefefe';
  modalContent.style.margin = 'auto';
  modalContent.style.padding = '20px';
  modalContent.style.border = '1px solid #888';
  modalContent.style.width = '80%';
  modalContent.style.position = 'relative';

  closeBtn.style.float = 'right';
  closeBtn.style.fontSize = '28px';
  closeBtn.style.fontWeight = 'bold';
  closeBtn.style.cursor = 'pointer';
  closeBtn.style.position = 'absolute';
  closeBtn.style.right = '10px';
  closeBtn.style.top = '10px';

  return modal;
}

function openModal() {
  modal.style.display = 'block';
}

function closeModal() {
  modal.style.display = 'none';
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




// Function to handle saving the form data
function saveForm(e) {
  console.log(e);
  const form = document.querySelector('form');
  const formData = new FormData(form);
  const name = formData.get('name');
  const email = formData.get('email');
  const company = formData.get('company');
  const url = formData.get('url');
  console.log(name, email, company, url);
  addItem({ name, url, company, email });
}

//Functional part
function getVanityName() {
  const pathName = window.location.pathname;
  const regex = /\/in\/(.*)\//;
  const match = pathName.match(regex);
  const vanityName = match ? match[1] : null;
  return vanityName;
}

function getUserName() {
  const userName = document.querySelector(
    '.pv-text-details__left-panel > div > h1'
  );
  return userName.innerText;
}

document.addEventListener('click', (e) => {
  if (e.target.id == 'save-button') {
    const vanityName = getVanityName();
    // getUserName(vanityName);
    openModal();
  }

  if (e.target.id == 'close-modal-button') {
    closeModal();
  }
});


//API part
const addItem = ({ name, url, company, email }) => {
  fetch(graphqlURL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `
        mutation {
          createItem(
            name: "${name}",
            url: "${url}",
            company: "${company}",
            email: "${email}"
          ) {
            id
            name
            url
            company
            email
          }
        }
      `,
    }),
  }).then((_) => {
    showSnackBar();
    closeModal();
  });
};



console.log('Extension is working');



// function getUserName(vanityName) {
//   const accessToken =
//     'AQVSes_h2vKQPgUbDExmRAQxA6MYFbVMIUfx0VYkDgV8SPYnDiNgOLzKcG6rUJOfSKIDyyqc67hdWmS9icL1NlD7ju3_01WsUtSyamsSSobWEd8FAtMeeJWKOq7CHKdOjdHWRm7EGD90GaSrmG-P8Wg2pdlPqYJzGJ-6eDOur3qt-UdTtPOiLBk8_RUNfp5zVPJU8Uv47Ms84fx61fi02Rh12Jm62o1wexJxWgQVrQWvScWeq1HJ9pBp85JAl6gjQa3dNoNTx9lAaUxiDogscUFFVqlbN26yChVZAgdPsanOhH7oZdf5maTNtvgkEyig5uER7RzqJd9C4azHB1v1LpEO91jaEA';

//   // Construct the API request URL with the appropriate query parameters
//   const apiUrl = `https://api.linkedin.com/v2/search?q=vanityName:${vanityName}&facetNetwork=%5B%22F%22%5D&facetConnectionOf=%5B%22viewer%22%5D&origin=OTHER&count=1&projection=(id,firstName,lastName,profilePicture(displayImage~:playableStreams))`;

//   // Make a request to the API endpoint using an access token
//   fetch(apiUrl, {
//     headers: {
//       Authorization: `Bearer ${accessToken}`,
//       'Content-Type': 'application/json',
//     },
//   })
//     .then((response) => response.json())
//     .then((data) => {
//       // Get the user information from the API response
//       const user = data.elements[0];

//       // Log the user information to the console
//       console.log(user.id);
//       console.log(user.firstName);
//       console.log(user.lastName);
//       console.log(
//         user.profilePicture['displayImage~'].elements[0].identifiers[0]
//           .identifier
//       );
//     })
//     .catch((error) => {
//       // Log any errors to the console
//       console.error(error);
//     });
// }