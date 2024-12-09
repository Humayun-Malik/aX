// src/js/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyA2TedVAeMH2gw5rx9PzwqspMmP4qV1wlM",
    authDomain: "arenax-d47f8.firebaseapp.com",
    projectId: "arenax-d47f8",
    storageBucket: "arenax-d47f8.firebasestorage.app",
    messagingSenderId: "777685360506",
    appId: "1:777685360506:web:f68addea89ffabf79380c3",
    measurementId: "G-J9LNKX3GKJ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
