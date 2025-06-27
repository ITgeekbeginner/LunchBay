// Auth state management
auth.onAuthStateChanged(async user => {
    if (!user) {
    window.location.href = 'login.html';
  } else {
    try {
      const userDoc = await db.collection('users').doc(user.uid).get();
      
      if (!userDoc.exists) {
        await auth.signOut();
        window.location.href = 'login.html';
        return;
      }

      if (!user.emailVerified) {
        window.location.href = 'verify-email.html';
        return;
      }

      loadDashboardData(user.uid);
    } catch (error) {
      console.error('Error checking user:', error);
      window.location.href = 'login.html';
    }
  }
});
  /*if (!user) {
    window.location.href = 'index.html';
  } else if (!user.emailVerified) {
    window.location.href = 'verify-email.html';
  } else {
    loadDashboardData(user.uid);
  }
});*/

// Logout
document.getElementById('logout-btn').addEventListener('click', () => {
  auth.signOut();
});

async function loadDashboardData(userId) {
  // Load restaurant-specific data
  const userDoc = await db.collection('users').doc(userId).get();
  const userData = userDoc.data();
  
  document.title = `${userData.name} Dashboard`;
  
  // Example: Load inventory
  const inventorySnapshot = await db.collection('inventory')
    .where('restaurantId', '==', userId)
    .orderBy('expiryDate')
    .get();
    
  // Example: Load donations
  const donationsSnapshot = await db.collection('donations')
    .where('restaurantId', '==', userId)
    .orderBy('pickupDate')
    .get();
}