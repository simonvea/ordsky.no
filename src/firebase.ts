import * as firebase from 'firebase/app';
import 'firebase/analytics';
import { firebaseConfig } from './firebase.config';

firebase.initializeApp(firebaseConfig);

export const analytics = firebase.analytics();
