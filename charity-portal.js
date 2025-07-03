// Initialize Firebase 
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

// DOM elements
const donationsList = document.getElementById('donations');
const pickupsList = document.getElementById('pickups');
const foodTypeFilter = document.getElementById('food-type-filter');
const refreshBtn = document.getElementById('refresh-btn');

// Loads data
function loadDonations() {
  let query = db.collection('foodItems')
    .where('status', '==', 'available');
  
  if (foodTypeFilter.value !== 'all') {
    query = query.where('type', '==', foodTypeFilter.value);
  }
  
  query.onSnapshot(snapshot => {
    donationsList.innerHTML = '';
    
    snapshot.forEach(doc => {
      const data = doc.data();
      const li = document.createElement('li');
      li.className = 'donation-item';
      li.innerHTML = `
        <div>
          <h3>${data.name}</h3>
          <p>${data.quantity} ${data.unit} | ${data.type} | Expires: ${data.expiry}</p>
          <p>From: Restaurant ${doc.id.substring(0, 5)}</p>
        </div>
        <button class="claim-btn" data-id="${doc.id}">Claim Donation</button>
      `;
      donationsList.appendChild(li);
    });
    
    // event listeners
    document.querySelectorAll('.claim-btn').forEach(btn => {
      btn.addEventListener('click', claimDonation);
    });
  });
}

function loadScheduledPickups() {
  db.collection('foodItems')
    .where('status', '==', 'claimed')
    .where('claimedBy', '==', auth) 
    .onSnapshot(snapshot => {
      pickupsList.innerHTML = '';
      
      snapshot.forEach(doc => {
        const data = doc.data();
        const li = document.createElement('li');
        li.className = 'pickup-item';
        li.innerHTML = `
          <div>
            <h3>${data.name}</h3>
            <p>Scheduled for: ${data.pickupTime || 'ASAP'}</p>
            <p>Location: ${data.restaurantAddress || 'To be confirmed'}</p>
          </div>
          <button class="complete-btn" data-id="${doc.id}">Mark as Collected</button>
        `;
        pickupsList.appendChild(li);
      });
      
      document.querySelectorAll('.complete-btn').forEach(btn => {
        btn.addEventListener('click', completePickup);
      });
    });
}

function claimDonation(e) {
  const donationId = e.target.getAttribute('data-id');
  
  db.collection('foodItems').doc(donationId).update({
    status: 'claimed',
    claimedBy: auth, 
    claimedAt: firebase.firestore.FieldValue.serverTimestamp()
  }).then(() => {
    alert('Donation claimed successfully!');
  });
}

function completePickup(e) {
  const donationId = e.target.getAttribute('data-id');
  
  db.collection('foodItems').doc(donationId).update({
    status: 'collected',
    collectedAt: firebase.firestore.FieldValue.serverTimestamp()
  }).then(() => {
    alert('Pickup marked as completed!');
  });
}

// Event listeners
refreshBtn.addEventListener('click', loadDonations);
foodTypeFilter.addEventListener('change', loadDonations);

// Initialize
loadDonations();
loadScheduledPickups();