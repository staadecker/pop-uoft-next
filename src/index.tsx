/* @refresh reload */
import { render } from 'solid-js/web'

import './index.css'
import App from './App'

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { FirebaseAppProvider } from './firebase';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCnIpYjoP9LBwfEyEcMQgq4gd0vaa6BstA",
    authDomain: "pop-uoft.firebaseapp.com",
    projectId: "pop-uoft",
    storageBucket: "pop-uoft.appspot.com",
    messagingSenderId: "448097432689",
    appId: "1:448097432689:web:1a82ae4b88d2f2e28a97d0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const root = document.getElementById('root')

render(
    () =>
        <FirebaseAppProvider app={app}>
            <App />
        </FirebaseAppProvider>,
    root!
)
