import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/analytics';
import 'firebase/functions';

// if (process.env.NODE_ENV === 'production') {
firebase.initializeApp({
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: 'ordsky-41e2e.firebaseapp.com',
  databaseURL: 'https://ordsky-41e2e.firebaseio.com',
  projectId: 'ordsky-41e2e',
  storageBucket: 'ordsky-41e2e.appspot.com',
  messagingSenderId: '815660490211',
  appId: '1:815660490211:web:91e29edbb14f52e29d54d6',
  measurementId: 'G-TC27H6R5BX',
});
// }

export const analytics =
  process.env.NODE_ENV === 'production'
    ? firebase.analytics()
    : { logEvent: () => {} };
