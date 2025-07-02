// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyD8tptUGIUsijsdKNjJ-IiJao_xVpyczzY",
    authDomain: "lunchbay-b864e.firebaseapp.com",
    projectId: "lunchbay-b864e",
    storageBucket: "lunchbay-b864e.firebasestorage.app",
    messagingSenderId: "83931299741",
    appId: "1:83931299741:web:c653e27331cb7f3d14b974",
    measurementID: "G-Q55HMTQ3VP"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

document.addEventListener('DOMContentLoaded', () => {
    // Simulate loading process
    const loadingDuration = 7000; // 3 seconds
    
    // 1. Check authentication status (simulated)
    setTimeout(() => {
        checkAuthStatus();
    }, loadingDuration);
    
    // 2. Animated percentage counter (optional)
    const progressText = document.createElement('div');
    progressText.className = 'progress-text';
    document.querySelector('.progress-bar').after(progressText);
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 10;
        if (progress > 100) progress = 100;
        progressText.textContent = `${Math.round(progress)}%`;
        
        if (progress >= 100) {
            clearInterval(interval);
        }
    }, loadingDuration / 10);
});

// At the end of your loading.js file, update the redirect path:
function checkAuthStatus() {
    // For Firebase version:
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            firebase.firestore().collection('users').doc(user.uid).get()
                .then(doc => {
                    window.location.href = doc.data().type === 'restaurant' 
                        ? '../index.html'          // Goes back to root
                        : '../login/login.html'; // Goes back to root
                });
        } else {
            window.location.href = 'login/login.html'; // Points to login folder
        }
    });

    // For non-Firebase version:
    // window.location.href = 'login/login.html';
}