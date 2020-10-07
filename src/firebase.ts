import * as firebase from 'firebase/app';
import 'firebase/analytics';
import { firebaseConfig } from './firebase.config';

if (process.env.NODE_ENV === 'production') {
  firebase.initializeApp(firebaseConfig);
}

export const analytics =
  process.env.NODE_ENV === 'production'
    ? firebase.analytics()
    : { logEvent: () => {} };
