// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, updateProfile } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAT2yL3CxUBzvqcKW8g5nBqzFyvTVhheu0",
    authDomain: "story-writing-8549e.firebaseapp.com",
    projectId: "story-writing-8549e",
    storageBucket: "story-writing-8549e.appspot.com",
    messagingSenderId: "497629109391",
    appId: "1:497629109391:web:dc9c2abac2e4f0cf5424fa",
    measurementId: "G-Q49T2CN7MH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


function showMessage(message, divId) {
    const messageDiv = document.getElementById(divId);
    messageDiv.style.display = "block";
    messageDiv.innerHTML = message;
    messageDiv.style.opacity = 1;
    setTimeout(() => {
        messageDiv.style.opacity = 0;
    }, 5000);
}

const signUp = document.getElementById('submitSignUp');
signUp.addEventListener('click', async (event) => {
    event.preventDefault();
    const email = document.getElementById('rEmail').value;
    const password = document.getElementById('rPassword').value;
    const firstName = document.getElementById('fName').value;
    const lastName = document.getElementById('lName').value;

    const auth = getAuth();
    const db = getFirestore();

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Update display name
        await updateProfile(user, {
            displayName: `${firstName} ${lastName}`
        });

        const userData = {
            email: email,
            firstName: firstName,
            lastName: lastName,
            displayName: user.displayName
        };

        // Send email verification
        await sendEmailVerification(user);
        showMessage('Verification Email Sent! Please check your inbox.', 'signUpMessage');

        await setDoc(doc(db, "users", user.uid), userData);
        showMessage('Account Created Successfully', 'signUpMessage');
        
        window.location.href = 'verify-email.html'; // Redirect to verification page
    } catch (error) {
        const errorCode = error.code;
        if (errorCode === 'auth/email-already-in-use') {
            showMessage('Email Address Already Exists !!!', 'signUpMessage');
        } else {
            showMessage('Unable to create User', 'signUpMessage');
        }
    }
});

const signIn = document.getElementById('submitSignIn');
signIn.addEventListener('click', async (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const auth = getAuth();

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        if (user.emailVerified) {
            showMessage('Login is successful', 'signInMessage');
            localStorage.setItem('loggedInUserId', user.uid);
            window.location.href = 'homepage.html';
        } else {
            showMessage('Please verify your email to proceed', 'signInMessage');
            window.location.href = 'verify-email.html'; // Redirect to verification page
        }
    } catch (error) {
        const errorCode = error.code;
        if (errorCode === 'auth/wrong-password') {
            showMessage('Incorrect Email or Password', 'signInMessage');
        } else if (errorCode === 'auth/user-not-found') {
            showMessage('Account does not Exist', 'signInMessage');
        } else {
            showMessage('Error logging in', 'signInMessage');
        }
    }
});


