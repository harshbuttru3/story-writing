import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getFirestore, doc, getDoc, query, where, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

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
const auth = getAuth();
const db = getFirestore();

const checkSubmission = async (userId, type) => {
    try {
        const submissionsRef = collection(db, "submissions");
        const q = query(submissionsRef, where("uid", "==", userId), where("type", "==", type));
        const querySnapshot = await getDocs(q);
        
        return !querySnapshot.empty;
    } catch (error) {
        console.error('Error checking submission:', error);
        return false;
    }
};

onAuthStateChanged(auth, async (user) => {
    if (user) {
        const loggedInUserId = user.uid;

        console.log("username: ", user);
        const categories = [
            { id: "hindi_story", type: "hindi_story" },
            { id: "hindi_poem", type: "hindi_poem" },
            { id: "maithili_story", type: "maithili_story" },
            { id: "maithili_poem", type: "maithili_poem" }
        ];

        for (const { id, type } of categories) {
            const hasSubmitted = await checkSubmission(loggedInUserId, type);
            const div = document.getElementById(id);
            if (hasSubmitted) {
                div.innerText = `You have already submitted for ${div.innerText}`;
                div.style.cursor = 'not-allowed';
                div.onclick = null;
            } else {
                div.onclick = () => window.location.href = `form_${type}.html`;
                div.style.cursor = 'pointer';
            }
        }

        document.getElementById('welcomeUser').innerText += user.displayName || "User";
        document.getElementById('userEmail').innerText = user.email;
    } else {
        console.log("No user is currently signed in");
        window.location.href = "login.html"; // <-- Added to redirect if not signed in
    }
});

// Logout function
document.getElementById('logout').addEventListener('click', () => {
    auth.signOut().then(() => {
        window.location.href = "login.html"; // <-- Added to redirect after logout
    }).catch((error) => {
        console.error("Error logging out:", error);
    });
});
