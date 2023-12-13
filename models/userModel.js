
const Datastore = require('nedb');

const usersDB = new Datastore({ filename: 'data/users.db', autoload: true });

module.exports = {
  usersDB,
};
