import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getFirestore, setDoc, doc, getDoc, query, where, collection } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-storage.js";

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

const form = document.getElementById('submissionForm');

const populateForm = async (userId) => {
    try {
        const userDocRef = doc(db, "users", userId);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            document.getElementById('userName').value = userData.firstName;
            document.getElementById('userEmail').value = userData.email;
        } else {
            console.log("No user data found");
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
};

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

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    console.log('Form submission triggered');

    const textContent = document.getElementById('textContent').value;
    const fileInput = document.getElementById('fileInput').files[0];

    const formPage = window.location.pathname.split('/').pop();
    const type = formPage.split('_')[1].replace('.html', '');

    onAuthStateChanged(auth, async (user) => {
        if (user) {
            const loggedInUserId = user.uid;
            
            // Check if the user has already submitted this form
            const alreadySubmitted = await checkSubmission(loggedInUserId, type);
            if (alreadySubmitted) {
                alert('You have already submitted a form for this category.');
                return;
            }

            const userData = {
                uid: loggedInUserId,
                type,
                textContent,
                timestamp: new Date()
            };

            try {
                await setDoc(doc(db, "submissions", `${loggedInUserId}_${type}_${Date.now()}`), userData);
                console.log('Data saved to Firestore');

                if (fileInput) {
                    const fileRef = ref(storage, `submissions/${loggedInUserId}/${fileInput.name}`);
                    await uploadBytes(fileRef, fileInput);
                    console.log('File uploaded to Firebase Storage');
                }

                alert('Submission successful!');
                window.location.href = 'homepage.html';
            } catch (error) {
                console.error('Error saving data or uploading file:', error);
            }
        } else {
            alert('No user is signed in');
        }
    });
});

// Populate form with user data on page load
onAuthStateChanged(auth, (user) => {
    if (user) {
        const loggedInUserId = user.uid;
        populateForm(loggedInUserId);
    } else {
        console.log("No user is currently signed in");
    }
});
