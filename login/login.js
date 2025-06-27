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

// DOM Elements
const loginForm = document.getElementById('login');
const registerForm = document.getElementById('register');
const showRegister = document.getElementById('show-register');
const showLogin = document.getElementById('show-login');
const loginSection = document.getElementById('login-form');
const registerSection = document.getElementById('register-form');


// Password Reset
document.getElementById('reset-password').addEventListener('click', async (e) => {
  e.preventDefault();
  const email = prompt('Please enter your email address:');
  if (email) {
    try {
      await auth.sendPasswordResetEmail(email);
      alert('Password reset email sent! Check your inbox.');
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  }
});

// Switch between forms
showRegister.addEventListener('click', (e) => {
    e.preventDefault();
    loginSection.classList.add('hidden');
    registerSection.classList.remove('hidden');
});

showLogin.addEventListener('click', (e) => {
    e.preventDefault();
    registerSection.classList.add('hidden');
    loginSection.classList.remove('hidden');
});

// Login Function
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
      try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        const userDoc = await db.collection('users').doc(userCredential.user.uid).get();
        
        if (!userDoc.exists) {
            throw new Error('User data not found in database');
        }

        const userData = userDoc.data();
        
        // Check if user is verified
        if (!userCredential.user.emailVerified) {
            await auth.signOut();
            throw new Error('Please verify your email before logging in');
        }

        // Redirect based on user type
        if (userData.type === 'charity') {
            window.location.href = 'charity-dashboard.html';
        } else if (userData.type === 'restaurant') {
            window.location.href = 'restaurant-dashboard.html'; // Fixed typo
        } else {
            window.location.href = 'dashboard.html';
        }
    } catch (error) {
        showError(loginForm, error.message);
    }
});
    /*auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Redirect to dashboard
            return db.collection('users').doc(userCredential.user.uid).get();
        })
        .then((doc) => {
            if (doc.exists){
                const userData = doc.data();

                if (userData.type === 'charity'){
                    window.location.href = 'charity-dashboard.html';
                } else if (userData.type === 'restaurant'){
                    window.location.href = 'restaurant-dashboard.html';
                } else {
                    window.location.href = 'dashboard.html';
                }
            } else {
                showError(loginForm, 'User data not found');
            }
        })
        .catch((error) => {
            showError(loginForm, error.message);
        });
});*/

// Registration Function
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const name = document.getElementById('register-name').value;
    const accountType = document.getElementById('register-type').value;
    
      try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        
        // Add user data to Firestore
        await db.collection('users').doc(userCredential.user.uid).set({
            name: name,
            email: email,
            type: accountType,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        // Send verification email
        await userCredential.user.sendEmailVerification();
        alert('Registration successful! Please check your email for verification.');

        // Redirect after verification
        if (accountType === 'restaurant') {
            window.location.href = 'restaurant-dashboard.html'; // Fixed typo
        } else {
            window.location.href = 'charity-dashboard.html';
        }
    } catch (error) {
        showError(registerForm, error.message);
    }
});

    /*auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Add user data to Firestore
            return firebase.firestore().collection('users').doc(userCredential.user.uid).set({
                name: name,
                email: email,
                type: accountType,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        })
        .then(() => {
            // Set custom claims based on account type
            if (accountType === 'restaurant') {
                return auth.currentUser.getIdToken(true)
                    .then(() => {
                        // Custom claims will be set via Firebase Functions
                        window.location.href = 'resturant-dashboard.html';
                    });
            } else {
                window.location.href = 'charity-dashboard.html';
            }
        })
        .catch((error) => {
            showError(registerForm, error.message);
        });
});*/

// Show error message
function showError(form, message) {
    let errorDiv = form.querySelector('.error-message');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        form.appendChild(errorDiv);
    }
    errorDiv.textContent = message;
}

// Auth State Listener
auth.onAuthStateChanged(async user => {
       if (user) {
        try {
            const userDoc = await db.collection('users').doc(user.uid).get();
            
            if (!userDoc.exists) {
                await auth.signOut();
                return;
            }

            const userData = userDoc.data();
            
            // Check email verification
            if (!user.emailVerified) {
                window.location.href = 'verify-email.html';
                return;
            }

            // Redirect based on user type
            if (userData.type === 'restaurant') {
                window.location.href = 'restaurant-dashboard.html'; // Fixed typo
            } else {
                window.location.href = 'charity-dashboard.html';
            }
        } catch (error) {
            console.error('Auth state error:', error);
        }
    }
});
    /*if (user) {
        // User is logged in, redirect to appropriate dashboard
        firebase.firestore().collection('users').doc(user.uid).get()
            .then(doc => {
                if (doc.exists) {
                    const userData = doc.data();
                    if (userData.type === 'restaurant') {
                        window.location.href = 'resturant-dashboard.html';
                    } else {
                        window.location.href = 'charity-dashboard.html';
                    }
                }
            });
    }
});*/