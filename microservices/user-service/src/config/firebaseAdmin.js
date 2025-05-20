const admin = require('firebase-admin');

// Path to your Firebase service account key JSON file
const serviceAccount = require('../../path/to/firebase-service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
