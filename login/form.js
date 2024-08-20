// Import necessary Firebase modules (as before)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getFirestore, setDoc, doc, getDoc, query, where, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-storage.js";

// Firebase configuration (as before)
const firebaseConfig = {
    apiKey: "AIzaSyAT2yL3CxUBzvqcKW8g5nBqzFyvTVhheu0",
    authDomain: "story-writing-8549e.firebaseapp.com",
    projectId: "story-writing-8549e",
    storageBucket: "story-writing-8549e.appspot.com",
    messagingSenderId: "497629109391",
    appId: "1:497629109391:web:dc9c2abac2e4f0cf5424fa",
    measurementId: "G-Q49T2CN7MH"
};

// Initialize Firebase (as before)
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();
const storage = getStorage();

// Reference to the form
const form = document.getElementById('submissionForm');

// Function to populate form with user data
const populateForm = async (user) => {
    try {
        if (user) {
            const userNameField = document.getElementById('userName');
            const userEmailField = document.getElementById('userEmail');

            // Populate the fields with user data
            userNameField.value = user.displayName || '';
            userEmailField.value = user.email || '';

        } else {
            console.log("No user is currently signed in");
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
};

// Function to check if a submission already exists for the form type
const checkSubmission = async (userId, formType) => {
    try {
        const submissionsRef = collection(db, "submissions");
        const q = query(submissionsRef, where("uid", "==", userId), where("formType", "==", formType));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const submission = querySnapshot.docs[0].data();
            return submission;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error checking submission:', error);
        return null;
    }
};

// Event listener for form submission
form.addEventListener('submit', async (event) => {
    event.preventDefault();
    console.log('Form submission triggered');

    const textContent = document.getElementById('textContent').value;
    const fileInput = document.getElementById('fileInput').files[0];

    // Extracting form type from the hidden input field
    const formType = document.getElementById('formType').value;

    console.log('Extracted form type:', formType); // Debugging line

    // Determine the amount based on the form type
    let amount = 0; // Amount in paise (smallest currency unit)
    if (formType === "hindiPoem" || formType === "maithiliPoem") {
        amount = 50 * 100; // 50 rupees in paise
    } else if (formType === "hindiStory" || formType === "maithiliStory") {
        amount = 100 * 100; // 100 rupees in paise
    }

    console.log('Calculated amount in paise:', amount); // Debugging line

    if (amount === 0) {
        alert('Invalid form type or amount. Please try again.');
        return;
    }

    onAuthStateChanged(auth, async (user) => {
        if (user) {
            const loggedInUserId = user.uid;

            // Check if the user has already submitted this form
            const previousSubmission = await checkSubmission(loggedInUserId, formType);
            if (previousSubmission) {
                alert('You have already submitted a form for this category.');

                // Display the previous submission (as before)
                document.getElementById('textContent').value = previousSubmission.textContent;

                if (previousSubmission.fileName) {
                    const fileRef = ref(storage, `submissions/${loggedInUserId}/${previousSubmission.fileName}`);
                    const fileUrl = await getDownloadURL(fileRef);
                    const link = document.createElement('a');
                    link.href = fileUrl;
                    link.textContent = `Download your previously uploaded file (${previousSubmission.fileName})`;
                    document.body.appendChild(link);
                }

                return;
            }

            // Initialize Razorpay payment
            const options = {
                key: 'rzp_live_E7VDJCHTk61aI1',
                amount: amount,
                currency: 'INR',
                name: 'Fame writer',
                description: 'Payment for submitting form',
                image: 'https://i.ibb.co/znCmXhS/logo-1.png',
                handler: async function (response) {
                    try {
                        // Payment successful, proceed to submit the form
                        const userData = {
                            uid: loggedInUserId,
                            formType,
                            textContent,
                            fileName: fileInput ? fileInput.name : null,
                            timestamp: new Date(),
                            paymentId: response.razorpay_payment_id
                        };

                        await setDoc(doc(db, "submissions", `${loggedInUserId}_${formType}`), userData);
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
                },
                prefill: {
                    name: user.displayName || '',
                    email: user.email || '',
                },
                theme: {
                    color: '#F37254'
                }
            };

            const rzp = new Razorpay(options);
            rzp.open();
        } else {
            alert('No user is signed in');
        }
    });
});

// Populate form with user data on page load
onAuthStateChanged(auth, (user) => {
    if (user) {
        populateForm(user);
    }
});
