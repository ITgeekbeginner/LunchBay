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
const db = firebase.firestore();

// Logout
const auth = firebase.auth();
document.getElementById('logout-btn').addEventListener('click', () => {
  auth.signOut()
  .then(() => {
    window.location.href = '/index.html';
  })
  .catch((error) => {
    console.error('Logout error:', error);
  });
});

async function loadDashboardData(userId) {
  try {
    // Loads charity-specific data
    const userDoc = await db.collection('users').doc(userId).get();
    const userData = userDoc.data();
    
    document.title = `${userData.name} Dashboard`;
    
    // Loads available donations
    const donationsSnapshot = await db.collection('donations')
      .where('status', '==', 'available')
      .orderBy('pickupDate')
      .get();
    
    const donationsList = document.querySelector('#requests .donations-list') || 
      document.createElement('div');
    donationsList.className = 'donations-list';
    
    donationsSnapshot.forEach(doc => {
      const donation = doc.data();
      const donationElement = document.createElement('div');
      donationElement.className = 'donation-card';
      donationElement.innerHTML = `
        <h3>${donation.foodType}</h3>
        <p>Quantity: ${donation.quantity}</p>
        <p>Pickup by: ${new Date(donation.pickupDate).toLocaleString()}</p>
        <button class="accept-btn" data-id="${doc.id}">Accept Donation</button>
      `;
      donationsList.appendChild(donationElement);
    });
    
    document.getElementById('requests').appendChild(donationsList);
    
    // Loads scheduled pickups
    const pickupsSnapshot = await db.collection('donations')
      .where('charityId', '==', userId)
      .where('status', '==', 'scheduled')
      .orderBy('pickupDate')
      .get();
    
    const pickupsList = document.querySelector('#schedule .pickups-list') || 
      document.createElement('div');
    pickupsList.className = 'pickups-list';
    
    pickupsSnapshot.forEach(doc => {
      const pickup = doc.data();
      const pickupElement = document.createElement('div');
      pickupElement.className = 'pickup-card';
      pickupElement.innerHTML = `
        <h3>${pickup.foodType}</h3>
        <p>From: ${pickup.restaurantName}</p>
        <p>Pickup at: ${new Date(pickup.pickupDate).toLocaleString()}</p>
        <p>Address: ${pickup.restaurantAddress}</p>
      `;
      pickupsList.appendChild(pickupElement);
    });
    
    document.getElementById('schedule').appendChild(pickupsList);
    
    // event listeners for accept buttons
    document.querySelectorAll('.accept-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const donationId = e.target.getAttribute('data-id');
        try {
          await db.collection('donations').doc(donationId).update({
            status: 'scheduled',
            charityId: userId,
            charityName: userData.name
          });
          alert('Donation accepted!');
          loadDashboardData(userId); // Refresh data
        } catch (error) {
          console.error('Error accepting donation:', error);
          alert('Failed to accept donation');
        }
      });
    });
    
  } catch (error) {
    console.error('Error loading dashboard data:', error);
    alert('Error loading dashboard data');
  }
}