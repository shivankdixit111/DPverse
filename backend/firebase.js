const dotenv = require('dotenv')
dotenv.config()

let admin = require("firebase-admin");

let serviceAccount = JSON.parse(process.env.GOOGLE_CREDENTIALS); //parse the path to your servce account key file

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;