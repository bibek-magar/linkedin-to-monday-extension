const mongoose = require('mongoose');

const UserSchema = mongoose.Schema;

const userSchema = new UserSchema({
  name: String,
  url: String,
  company: String,
  email: String,
});

const UserModel = mongoose.model('LinkedInData', userSchema);

module.exports = UserModel;
