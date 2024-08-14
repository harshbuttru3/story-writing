document.addEventListener('DOMContentLoaded', function() {
    const signUpButton = document.getElementById('signUpButton');
    const signInButton = document.getElementById('signInButton');
    const signInForm = document.getElementById('signIn');
    const signUpForm = document.getElementById('signup');
    const phoneButton = document.getElementById('phone');
    const phoneForm = document.getElementById('phoneForm');
    const backButton = document.getElementById('back');

    // Hide signup and phone forms by default
    signUpForm.style.display = "none";
    // phoneForm.style.display = "none";

    signUpButton.addEventListener('click', function() {
        signInForm.style.display = "none";
        signUpForm.style.display = "block";
    });

    signInButton.addEventListener('click', function() {
        signInForm.style.display = "block";
        signUpForm.style.display = "none";
    });

    phoneButton.addEventListener('click', function() {
        signInForm.style.display = "none";
        phoneForm.style.display = "block";
    });

    // backButton.addEventListener('click', function() {
    //     phoneForm.style.display = 'none';
    //     signInForm.style.display = "block";
    // });
});
