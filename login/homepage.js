import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getFirestore, query, where, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

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
        const q = query(submissionsRef, where("uid", "==", userId), where("formType", "==", type));
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

        const categories = [
            { id: "hindi_story", type: "hindiStory" },
            { id: "hindi_poem", type: "hindiPoem" },
            { id: "maithili_story", type: "maithiliStory" },
            { id: "maithili_poem", type: "maithiliPoem" }
        ];

        for (const { id, type } of categories) {
            const hasSubmitted = await checkSubmission(loggedInUserId, type);
            const div = document.getElementById(id);
            if (hasSubmitted) {
                div.innerText = `view your submission for ${div.innerText}`;
                // div.style.cursor = 'pointer'
                div.style.setProperty('color', '#5c4cf0', 'important'); 
                div.onclick = () => window.location.href = `viewsubmission.html?formType=${type}`;
            } else {
                div.onclick = () => window.location.href = `form_${type}.html`;
                div.style.cursor = 'pointer';
            }
        }
        
        document.getElementById('welcomeUser').innerText += user.displayName || "User";
        document.getElementById('userEmail').innerText = user.email;
    } else {
        console.log("No user is currently signed in");
        window.location.href = "login.html"; // Redirect if not signed in
    }
});

// Logout function
document.getElementById('logout').addEventListener('click', () => {
    auth.signOut().then(() => {
        window.location.href = "login.html"; // Redirect after logout
    }).catch((error) => {
        console.error("Error logging out:", error);
    });
});
