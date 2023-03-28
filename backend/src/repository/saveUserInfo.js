const { UserModel } = require('../models');

function saveUserInfo(data) {
  const { name, url, company, email } = data;
  const newData = new UserModel({ name, url, company, email });
  newData
    .save()
    .then(() => {
      console.log('Document saved successfully');
    })
    .catch((error) => {
      console.log(`Error saving document: ${error}`);
    });
}

module.exports = { saveUserInfo };
