import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyA7UeX8U0_OO8e7tIJ10pzJz4pPzEa3JGc",
    authDomain: "dpverse-auth.firebaseapp.com",
    projectId: "dpverse-auth",
    storageBucket: "dpverse-auth.firebasestorage.app",
    messagingSenderId: "317819567607",
    appId: "1:317819567607:web:3716134f0592340eee82f2",
    measurementId: "G-KSMNWNPQ5N"
};

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider();