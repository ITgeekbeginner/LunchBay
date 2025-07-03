# LunchBay 🍽️♻️

A web application that helps restaurants track and donate surplus food to local charities, reducing waste while supporting communities in need.

![App Screenshot](/images/App%20Homepage.png)

## Features ✨

- **Food Inventory Management**:
  - Track leftover food items with expiry dates
  - Categorize by food type (cooked, raw, dairy, etc.)
  - Real-time quantity monitoring

- **Donation System**:
  - Find nearby food banks and charities
  - Schedule pickup times
  - Track donation history

- **Analytics Dashboard**:
  - Visualize food waste reduction
  - Generate tax-deductible receipts
  - View community impact metrics

## Tech Stack 🛠️

**Frontend**:
- HTML5, CSS3, JavaScript
- Firebase (Authentication, Firestore)
- Google Maps API

**Backend**:
- Firebase Cloud Firestore (NoSQL database)
- Firebase Authentication

## Installation & Setup 🚀

1. **Clone the repository**:
   ```bash
   git clone https://github.com/git-username/lunchbay.git
   cd lunchBay
Set up Firebase:

Create a project at Firebase Console

Enable Authentication (Email/Password) and Firestore

Add your config to js/firebase-config.js:

javascript
const firebaseConfig = {
  apiKey: "API_KEY",
  authDomain: "PROJECT.firebaseapp.com",
  projectId: "PROJECT",
  storageBucket: "PROJECT.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID"
};
Set up Google Maps:

Get an API key from Google Cloud Console

Enable "Maps JavaScript API" and "Places API"

Add to index.html:

html
<script src="https://maps.googleapis.com/maps/api/js?key=API_KEY&libraries=places"></script>
Run the app:

bash
# Using Python (default port 8000)
python -m http.server

# Or with Live Server in VS Code
Project Structure 📂
text
LUNCHBAY/
|-- loading-page/       # Landing/Home page
|   |-- loading.css
|   |-- loading.html
|   |-- loading.js
|   |-- logo.png
├── index.html          # Main application entry point/ inventory page
├── charity-portal.html # Charity organization portal
├── login/
│   ├── login.html      # Login page
│   └── register.html   # Registration page
|   .......             # other related pages
|
│── style.css       # Main stylesheet
│        
|
│--script.js          # Main application logic
│── no de_modules/       # node dependencies
│── firebase-config.js # Firebase configuration
│── charity-portal.js # Charity portal logic
├── images/             # All static images
└── README.md           # This file
Usage Guide 📖
For Restaurants:
Register/Sign in

Add leftover food items

Schedule donations with nearby charities

Track your impact through analytics

For Charities:
Register/Sign in

View available donations

Schedule pickups

Manage received food items

Contributing 🤝
We welcome contributions! Please follow these steps:

Fork the project

Create your feature branch (git checkout -b feature/AmazingFeature)

Commit your changes (git commit -m 'Add some amazing feature')

Push to the branch (git push origin feature/AmazingFeature)

Open a Pull Request

License 📜
This project is licensed under the MIT License - see the LICENSE file for details.

Contact 📧
For questions or support, contact: kokeletsomolefe97@gmail.com
