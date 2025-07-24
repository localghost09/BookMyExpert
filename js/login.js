// Login page functionality

document.addEventListener('DOMContentLoaded', function() {
    setupLoginForm();
    setupPasswordToggle();
});

function setupLoginForm() {
    const loginForm = document.getElementById('login-form');
    if (!loginForm) return;

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        // Basic validation
        if (!email || !password) {
            utils.showNotification('Please fill in all fields', 'error');
            return;
        }

        if (!utils.validateEmail(email)) {
            utils.showNotification('Please enter a valid email address', 'error');
            return;
        }

        // Simulate login process
        simulateLogin(email, password);
    });
}

function setupPasswordToggle() {
    const toggleBtn = document.getElementById('toggle-password');
    const passwordInput = document.getElementById('password');

    if (toggleBtn && passwordInput) {
        toggleBtn.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);

            const icon = this.querySelector('i');
            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');
        });
    }
}

function simulateLogin(email, password) {
    // Show loading state
    const submitBtn = document.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Signing in...';
    submitBtn.disabled = true;

    // Simulate API call delay
    setTimeout(() => {
        // Check if user exists in localStorage (from registration)
        const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        const user = users.find(u => u.email === email);

        if (user && user.password === password) {
            // Successful login
            localStorage.setItem('currentUser', JSON.stringify({
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                loginTime: new Date().toISOString()
            }));

            utils.showNotification('Login successful! Redirecting...', 'success');

            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
        } else {
            // Login failed
            utils.showNotification('Invalid email or password', 'error');
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }, 1000);
}
