const mongoose = require('mongoose');

const User = mongoose.model('User', {
  uid: String,
  first_name: String,
  last_name: String,
  photo: String,
  photo_rec: String,
  hash: String,
  black: String
});

const Invite = mongoose.model('Invite', {
  url: String,
  name: String,
  description: String,
  time: String,
  place: String,
  place_gmap: String,
  price: String,
  owner: String,
  position: Number,
  subscribe: [String],
  unsubscribe: [String],
  archive: [String]
});

module.exports = {
  User,
  Invite
};
