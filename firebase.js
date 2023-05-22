const admin = require('firebase-admin');

// Initialize Firebase Admin SDK with service account credentials
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const sendNotification = ( registrationToken, title, body) => {
 
  const message = {
    notification: {
      title: title,
      body: body
    },
    token: registrationToken
  };
  console.log(registrationToken, 'token')
  
  // Send a message to the device corresponding to the provided
  // registration token.
  admin.messaging()
    .send(message)
    .then((response) => {
      // Response is a message ID string.
      console.log("Successfully sent message:", response);
    })
    .catch((error) => {
      console.log("Error sending message:", error);
    });
};
module.exports = { admin, sendNotification };