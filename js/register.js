// Registration page functionality

document.addEventListener('DOMContentLoaded', function() {
    setupRegistrationForm();
    setupPasswordToggle();
    setupPasswordStrength();
});

function setupRegistrationForm() {
    const registerForm = document.getElementById('register-form');
    if (!registerForm) return;

    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const formData = {
            firstName: document.getElementById('first-name').value.trim(),
            lastName: document.getElementById('last-name').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            password: document.getElementById('password').value,
            confirmPassword: document.getElementById('confirm-password').value,
            interests: Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value),
            terms: document.getElementById('terms').checked,
            newsletter: document.getElementById('newsletter').checked
        };

        // Validate form
        if (validateRegistrationForm(formData)) {
            simulateRegistration(formData);
        }
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

function setupPasswordStrength() {
    const passwordInput = document.getElementById('password');
    const strengthIndicator = document.getElementById('password-strength');

    if (passwordInput && strengthIndicator) {
        passwordInput.addEventListener('input', function() {
            const password = this.value;
            const strength = calculatePasswordStrength(password);
            updatePasswordStrengthUI(strengthIndicator, strength);
        });
    }
}

function calculatePasswordStrength(password) {
    let score = 0;

    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    return score;
}

function updatePasswordStrengthUI(container, strength) {
    const bars = container.querySelectorAll('div');
    const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500'];

    bars.forEach((bar, index) => {
        bar.className = 'w-6 h-1 rounded';
        if (index < strength) {
            bar.classList.add(colors[Math.min(strength - 1, 3)]);
        } else {
            bar.classList.add('bg-gray-200');
        }
    });
}

function validateRegistrationForm(data) {
    // Check required fields
    if (!data.firstName || !data.lastName || !data.email || !data.phone || !data.password) {
        utils.showNotification('Please fill in all required fields', 'error');
        return false;
    }

    // Validate email
    if (!utils.validateEmail(data.email)) {
        utils.showNotification('Please enter a valid email address', 'error');
        return false;
    }

    // Validate phone
    if (!utils.validatePhone(data.phone)) {
        utils.showNotification('Please enter a valid phone number', 'error');
        return false;
    }

    // Check password strength
    if (data.password.length < 8) {
        utils.showNotification('Password must be at least 8 characters long', 'error');
        return false;
    }

    // Check password confirmation
    if (data.password !== data.confirmPassword) {
        utils.showNotification('Passwords do not match', 'error');
        return false;
    }

    // Check terms acceptance
    if (!data.terms) {
        utils.showNotification('Please accept the Terms of Service and Privacy Policy', 'error');
        return false;
    }

    // Check if email already exists
    const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    if (existingUsers.some(user => user.email === data.email)) {
        utils.showNotification('An account with this email already exists', 'error');
        return false;
    }

    return true;
}

function simulateRegistration(formData) {
    // Show loading state
    const submitBtn = document.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Creating account...';
    submitBtn.disabled = true;

    // Simulate API call delay
    setTimeout(() => {
        try {
            // Save user to localStorage
            const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
            const newUser = {
                id: Date.now(),
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone,
                password: formData.password, // In real app, this would be hashed
                interests: formData.interests,
                newsletter: formData.newsletter,
                registeredAt: new Date().toISOString()
            };

            existingUsers.push(newUser);
            localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));

            // Auto-login the user
            localStorage.setItem('currentUser', JSON.stringify({
                email: newUser.email,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                loginTime: new Date().toISOString()
            }));

            utils.showNotification('Account created successfully! Redirecting...', 'success');

            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);

        } catch (error) {
            utils.showNotification('An error occurred. Please try again.', 'error');
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }, 1000);
}
