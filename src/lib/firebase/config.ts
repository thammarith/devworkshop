import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: 'AIzaSyCxXucNZtp_Earack_w5KQhTzDD40oMtGY',
    authDomain: 'devshop-bkk.firebaseapp.com',
    projectId: 'devshop-bkk',
    storageBucket: 'devshop-bkk.firebasestorage.app',
    messagingSenderId: '954584871862',
    appId: '1:954584871862:web:4124531fc982061ff78717',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);
