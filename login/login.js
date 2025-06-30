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

const app = firebase.initializeApp(firebaseConfig);

// Get Firestore instance with error handling
let db;
try {
    db = firebase.firestore();
    console.log("Firestore initialized successfully");
    
} catch (error) {
    console.error("Firestore initialization error:", error);
    throw error;
}
//const db = firebase.firestore();
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

// Registration Function
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const name = document.getElementById('register-name').value;
    const accountType = document.getElementById('register-type').value;
    
      try {
        console.log("Creating auth user...")
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const uid = userCredential.user.uid;
        console.log("Auth user created with UID:", uid);
        
          // 2. Prepare user data
        const userData = {
            name: name,
            email: email,
            type: accountType,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            emailVerified: false,
            uid: uid // Add UID to document for easier queries
        };

            // Use transaction to ensure both operations succeed
        await db.runTransaction(async (transaction) => {
            const userRef = db.collection('users').doc(uid);
            transaction.set(userRef, userData);
        });

        
        // 5. Send verification email
        console.log("Sending verification email...");
        await userCredential.user.sendEmailVerification();
        
        alert('Registration successful! Please check your email for verification.');
        registerSection.classList.add('hidden');
        loginSection.classList.remove('hidden');

    } catch (error) {
        console.error("Full registration error:", error);
        
        // Clean up auth user if Firestore failed
       if (auth.currentUser) {
          console.log("Cleaning up auth user due to failure...");
        try {
          await auth.currentUser.delete();
        } catch (deleteError){
          console.error("Failed to delete auth user:", deleteError);
        }
       }
        showError(registerForm, "Registration failed: " + error.message);
    } finally {
        if (submitBtn){
            submitBtn.disable = false;
            submitBtn.textContent = originalBtnText;
        }
    }
});

// Login Function
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
      try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
          console.log("Auth successful, getting user doc...");

        const userDoc = await db.collection('users').doc(userCredential.user.uid).get();
        console.log("User doc retrieved:", userDoc.exists);

        if (!userDoc.exists) {
            console.error("User document not found for UID:", userCredential.user.uid);
              await auth.signOut();
              throw new Error('User data not found in database');
        }
      // Rest of the login flow...
    } catch (error) {
        console.error("Login error:", error);
        showError(loginForm, error.message);
    }
});
     

       /* // Redirect based on user type
        const userData = userDoc.data();
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
 
// test code
// Add to login.js for testing
window.testFirestoreWrite = async () => {
    try {
        console.log("Testing Firestore write...");
        const testRef = db.collection('test_writes').doc('test_doc');
        await testRef.set({
            message: "This is a test document",
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        // Verify
        const doc = await testRef.get();
        if (doc.exists) {
            console.log("Firestore test successful!", doc.data());
            return true;
        } else {
            console.error("Test document not found after write");
            return false;
        }
    } catch (error) {
        console.error("Firestore test failed:", error);
        return false;
    }
};