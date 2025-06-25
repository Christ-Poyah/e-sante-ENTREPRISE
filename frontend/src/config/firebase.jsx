// src/config/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyANEps1T14kt_vz0g0g3VTpECAfVYTEllM",
  authDomain: "e-sante-47908.firebaseapp.com",
  projectId: "e-sante-47908",
  storageBucket: "e-sante-47908.firebasestorage.app",
  messagingSenderId: "359632128263",
  appId: "1:359632128263:web:bb824750218650cfea1da2",
  measurementId: "G-1T487PQ8BL"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);