const nedb = require('gray-nedb');

// Create a new Datastore for the "alumni" collection
const alumniDB = new nedb({ filename: 'data/alumni.db', autoload: true });

// Create a new Datastore for the "events" collection
const eventsDB = new nedb({ filename: 'data/events.db', autoload: true });

// Export the collections
module.exports = {
  alumni: alumniDB,
  events: eventsDB,
};