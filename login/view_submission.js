import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getFirestore, query, where, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";
import { getStorage, ref, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-storage.js";

// Firebase configuration
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
const storage = getStorage();

onAuthStateChanged(auth, async (user) => {
    if (user) {
        const urlParams = new URLSearchParams(window.location.search);
        const formType = urlParams.get('formType');

        if (!formType) {
            document.getElementById('submissionDetails').textContent = 'No form type specified.';
            return;
        }

        // Query to find the submission document
        const submissionsRef = collection(db, "submissions");
        const q = query(submissionsRef, where("uid", "==", user.uid), where("formType", "==", formType));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const submissionSnap = querySnapshot.docs[0]; // Assuming only one submission per formType per user
            const submissionData = submissionSnap.data();

            document.getElementById('formType').textContent = submissionData.formType;
            document.getElementById('textContent').textContent = submissionData.textContent;

            if (submissionData.fileName) {
                const fileRef = ref(storage, `submissions/${user.uid}/${submissionData.fileName}`);
                try {
                    const fileUrl = await getDownloadURL(fileRef);
                    const fileLink = document.getElementById('fileLink');
                    fileLink.href = fileUrl;
                    fileLink.textContent = `(${submissionData.fileName})`;
                    fileLink.target = '_blank'; // Open in a new tab
                } catch (error) {
                    console.error('Error getting download URL:', error);
                    document.getElementById('fileLink').textContent = 'Failed to load file. Please try again later.';
                }
            } else {
                document.getElementById('fileLink').textContent = 'No file uploaded';
            }
        } else {
            document.getElementById('submissionDetails').textContent = 'No submission found for this form type.';
        }
    } else {
        alert('No user is signed in');
        window.location.href = 'login.html';
    }
});
