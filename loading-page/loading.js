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

function checkAuthStatus() {
    // In a real app, you would check Firebase auth state here
    const isAuthenticated = false; // Replace with actual check
    
    if (isAuthenticated) {
        window.location.href = 'dashboard.html';
    } else {
        window.location.href = 'login.html';
    }
}

// Optional: Add this if you want to skip loading when testing
document.addEventListener('keypress', (e) => {
    if (e.key === 's') { // Press 's' to skip
        window.location.href = 'login.html';
    }
});