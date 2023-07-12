import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

export const firebaseConfig = {
    apiKey: "AIzaSyBqYgg0rbYzimz5sI6j_AxXOm6JXQH4YMY",
    authDomain: "uteqapp-1d231.firebaseapp.com",
    projectId: "uteqapp-1d231",
    storageBucket: "uteqapp-1d231.appspot.com",
    messagingSenderId: "601009367914",
    appId: "1:601009367914:web:1137666cb33161b0331313",
    measurementId: "G-XZSR0FRJZS"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default auth;