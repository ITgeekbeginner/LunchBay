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

if (!firebase.apps.length) {
firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();
const auth = firebase.auth();

let analytics;
if (firebaseConfig.measurementId) {
  analytics = firebase.analytics();
  analytics.logEvent('notification_received');
}


// Real-time updates for food items
db.collection('foodItems')
  .orderBy('createdAt', 'desc')
  .onSnapshot(snapshot => {
    foodItems = [];
    let total = 0;
    
    snapshot.forEach(doc => {
      const data = doc.data();
      foodItems.push({
        id: doc.id,
        ...data
      });
      total += data.quantity;
    });
    
    displayFoodItems();
    totalSavedEl.textContent = `${total} ${foodItems[0]?.unit || 'lbs'}`;
  });

// Sample data
let foodItems = [];
let totalSaved = 0;

// DOM Elements
const dashboardSection = document.getElementById('dashboard');
const addFoodForm = document.getElementById('add-food-form');
const donationSection = document.getElementById('donation-section');
const addFoodBtn = document.getElementById('add-food-btn');
const cancelBtn = document.getElementById('cancel-btn');
const donateBtn = document.getElementById('donate-btn');
const backBtn = document.getElementById('back-btn');
const foodForm = document.getElementById('food-form');
const foodItemsList = document.getElementById('food-items');
const totalSavedEl = document.getElementById('total-saved');
const charitiesList = document.getElementById('charities');

// food submission handler
foodForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  try {
    await db.collection('foodItems').add({
      name: document.getElementById('food-name').value,
      quantity: parseFloat(document.getElementById('food-quantity').value),
      unit: document.getElementById('food-unit').value,
      type: document.getElementById('food-type').value,
      expiry: document.getElementById('expiry').value,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      status: 'available'
    });
    
    foodForm.reset();
    addFoodForm.classList.add('hidden');
    dashboardSection.classList.remove('hidden');
  } catch (error) {
    console.error("Error adding food: ", error);
    alert("Error saving food item");
  }
});

// Sample charities data
const charities = [
    { id: 1, name: "FoodForward", address: " | 21 Polaris Road, Lansdowne" },
    { id: 2, name: "Ladles of Love", address: " | 3 Fifth street, Wynberg" },
    { id: 3, name: "Salvation Army", address: " | Service Centers" },
    { id: 4, name: "Homeless individuals", address: " | Johannesburg CBD corners" },
    { id: 5, name: "Mamaile Kitchen", address: " | 28 Mekoa street" },
    { id: 6, name: "Forgood", address: " | Benoni" }
];

// Event Listeners
addFoodBtn.addEventListener('click', () => {
    dashboardSection.classList.add('hidden');
    addFoodForm.classList.remove('hidden');
});

cancelBtn.addEventListener('click', () => {
    addFoodForm.classList.add('hidden');
    dashboardSection.classList.remove('hidden');
});

donateBtn.addEventListener('click', () => {
    dashboardSection.classList.add('hidden');
    donationSection.classList.remove('hidden');
    displayCharities();
});

backBtn.addEventListener('click', () => {
    donationSection.classList.add('hidden');
    dashboardSection.classList.remove('hidden');
});

foodForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const foodItem = {
        id: Date.now(),
        name: document.getElementById('food-name').value,
        quantity: document.getElementById('food-quantity').value,
        unit: document.getElementById('food-unit').value,
        type: document.getElementById('food-type').value,
        expiry: document.getElementById('expiry').value,
        date: new Date().toLocaleDateString()
    };
    
    foodItems.push(foodItem);
    updateTotalSaved(foodItem.quantity);
    displayFoodItems();
    
    // Reset form
    foodForm.reset();
    addFoodForm.classList.add('hidden');
    dashboardSection.classList.remove('hidden');
});

// Functions
function displayFoodItems() {
    foodItemsList.innerHTML = '';
    
    if (foodItems.length === 0) {
        foodItemsList.innerHTML = '<li class="food-item">No food items logged yet</li>';
        return;
    }
    
    foodItems.forEach(item => {
        const li = document.createElement('li');
        li.className = 'food-item';
        li.innerHTML = `
            <div>
                <strong>${item.name}</strong>
                <span>${item.type} • Expires ${item.expiry}</span>
            </div>
            <div>
                ${item.quantity} ${item.unit}
            </div>
        `;
        foodItemsList.appendChild(li);
    });
}

function displayCharities() {
    charitiesList.innerHTML = '';
    
    charities.forEach(charity => {
        const li = document.createElement('li');
        li.className = 'charity-item';
        li.innerHTML = `
            <div>
                <strong>${charity.name}</strong>
                <span>${charity.address} away</span>
            </div>
            <button class="schedule-btn" data-id="${charity.id}">Schedule</button>
        `;
        charitiesList.appendChild(li);
    });
    
    // event listeners to schedule buttons
    document.querySelectorAll('.schedule-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const charityId = e.target.getAttribute('data-id');
            scheduleDonation(charityId);
        });
    });
}

function scheduleDonation(charityId) {
    const charity = charities.find(c => c.id == charityId);
    alert(`Donation scheduled with ${charity.name}! We'll contact you for pickup details.`);
    donationSection.classList.add('hidden');
    dashboardSection.classList.remove('hidden');
}

function updateTotalSaved(quantity) {
    totalSaved += Number(quantity);
    totalSavedEl.textContent = `${totalSaved} lbs`;
}

// Initialize
displayFoodItems();

  function initMap() {
    // map initialization 
     map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: -34.397, lng: 150.644 },
      zoom: 8,
    });
  }

  function loadGoogleMaps() {
    const script = document.createElement('script');
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }
  
  // Load Google Maps when the page is ready
  window.addEventListener('DOMContentLoaded', loadGoogleMaps);


    
