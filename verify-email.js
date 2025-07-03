
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
const auth = firebase.auth();
const db = firebase.firestore();

// DOM Elements
const resendBtn = document.getElementById('resend-verification');
const logoutBtn = document.getElementById('logout');

// Resend Verification Email Functionality
resendBtn.addEventListener('click', async () => {
    try {
        const user = auth.currentUser;
        if (!user) {
            throw new Error('No user is currently signed in');
        }

        // Disable button and show loading state
        resendBtn.disabled = true;
        const originalText = resendBtn.textContent;
        resendBtn.textContent = 'Sending...';

        await user.sendEmailVerification();

        // Show success state briefly
        resendBtn.textContent = 'Email Sent!';
        setTimeout(() => {
            resendBtn.textContent = originalText;
            resendBtn.disabled = false;
        }, 2000);

    } catch (error) {
        console.error('Error resending verification email:', error);
        alert(`Error: ${error.message}`);
        
        // Reset button state on error
        resendBtn.disabled = false;
        resendBtn.textContent = 'Resend Verification Email';
    }
});

// Logout Functionality
logoutBtn.addEventListener('click', async () => {
    try {
        // Show loading state
        logoutBtn.disabled = true;
        const originalText = logoutBtn.textContent;
        logoutBtn.textContent = 'Logging out...';

        await auth.signOut();
        // No need to reset button state as page will redirect
    } catch (error) {
        console.error('Error during logout:', error);
        alert(`Logout failed: ${error.message}`);
        
        // Reset button state on error
        logoutBtn.disabled = false;
        logoutBtn.textContent = originalText;
    }
});

auth.onAuthStateChanged(async user => {
    if (!user) {
        window.location.href = 'index.html';
    } else if (user.emailVerified) {
        try {
       const userDoc = await db.collection('users').doc(user.uid).get();
            if (userDoc.exists) {
                const userData = userDoc.data();
                const dashboard = userData.type === 'restaurant' 
                    ? 'restaurant-dashboard.html' 
                    : 'charity-dashboard.html';
                window.location.href = dashboard;
            } else {
                console.error('User document not found');
                await auth.signOut();
            }
        } catch (error) {
            console.error('Error checking user type:', error);
            window.location.href = 'index.html';
        }
    }
    
});
    
