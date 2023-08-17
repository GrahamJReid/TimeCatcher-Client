import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

const firebaseCredentials = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
};

const clientCredentials = {
  ...firebaseCredentials,
  databaseURL: process.env.NEXT_PUBLIC_DATABASE_URL,
};
const awsCredentials = {
  awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
  awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  awsRegion: process.env.AWS_REGION,
};

if (!firebase.apps.length) {
  firebase?.initializeApp(firebaseCredentials);
}

export { firebase, clientCredentials, awsCredentials };
