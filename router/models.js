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
  Invite,
  addInvite
};

function addInvite(invite, user) {
  const newInvite = new Invite(invite);
  newInvite.save();

  const newUser = new User(user);
  newUser.save();

  // {
  //   url: 'table_tennis',
  //   name: 'настольный теннис',
  //   description: 'Телефон администратора (+380664358333). Когда-то тут играл с прикольным дедушкой. Лучше брать напарника с собой, на месте можно не найти.',
  //   time: '#Время: надо звонить, могут не быть на месте',
  //   place: '#Место: бульвар Маршала Конєва, 2',
  //   place_gmap: 'https://goo.gl/maps/2xcLYiBGUGF2',
  //   price: '#Цена: 50-60грн. за стол',
  //   owner: "314236613",
  //   position: 5,
  //   subscribe: [],
  //   unsubscribe: [],
  //   archive: []
  // }

  // {
  //   uid: "314236613",
  //   first_name: 'Виктор',
  //   photo_rec: "https://pp.userapi.com/c627221/v627221613/1ab48/Jef9P48vVf8.jpg"
  // }

  // Invite.update({owner: "12949688"}, { place_gmap: "https://goo.gl/maps/DuAD1AJwWEE2" }, { multi: true }, function (err, raw) {
  //   console.log('The raw response from Mongo was ', raw);
  // });
  // Invite.update({}, { position: 1 }, function (err, raw) {
  //   console.log('The raw response from Mongo was ', raw);
  // });
}
