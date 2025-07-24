// Booking page functionality

let selectedDate = null;
let selectedTime = null;

document.addEventListener('DOMContentLoaded', function() {
    loadExpertInfo();
    generateCalendar();
    setupFormHandlers();
});

function loadExpertInfo() {
    const expertData = localStorage.getItem('selectedExpert');
    if (expertData) {
        const expert = JSON.parse(expertData);
        updateExpertDisplay(expert);
    } else {
        // Default expert if none selected
        const defaultExpert = {
            id: 1,
            name: "Dr. Sarah Johnson",
            title: "Mathematics Professor",
            price: 75,
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
            specialties: ["Calculus", "Algebra", "Statistics"]
        };
        updateExpertDisplay(defaultExpert);
    }
}

function updateExpertDisplay(expert) {
    const elements = {
        photo: document.getElementById('expert-photo'),
        name: document.getElementById('expert-name'),
        title: document.getElementById('expert-title'),
        summaryExpert: document.getElementById('summary-expert')
    };

    if (elements.photo) elements.photo.src = expert.image;
    if (elements.name) elements.name.textContent = expert.name;
    if (elements.title) elements.title.textContent = expert.title;
    if (elements.summaryExpert) elements.summaryExpert.textContent = expert.name;
}

function generateCalendar() {
    const calendarGrid = document.getElementById('calendar-grid');
    if (!calendarGrid) return;

    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    // Generate next 14 days
    const dates = [];
    for (let i = 0; i < 14; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        dates.push(date);
    }

    calendarGrid.innerHTML = dates.map(date => {
        const isToday = date.toDateString() === today.toDateString();
        const dateStr = date.toISOString().split('T')[0];

        return `
            <button type="button" 
                    class="calendar-date p-3 text-center border rounded-lg hover:bg-blue-50 transition ${
                        isToday ? 'border-primary bg-blue-50' : 'border-gray-300'
                    }" 
                    data-date="${dateStr}"
                    onclick="selectDate('${dateStr}')">
                <div class="text-xs text-gray-600">${date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                <div class="text-lg font-semibold">${date.getDate()}</div>
                <div class="text-xs text-gray-600">${date.toLocaleDateString('en-US', { month: 'short' })}</div>
            </button>
        `;
    }).join('');
}

function selectDate(dateStr) {
    selectedDate = dateStr;

    // Update UI
    document.querySelectorAll('.calendar-date').forEach(btn => {
        btn.classList.remove('bg-primary', 'text-white');
        btn.classList.add('border-gray-300');
    });

    const selectedBtn = document.querySelector(`[data-date="${dateStr}"]`);
    if (selectedBtn) {
        selectedBtn.classList.add('bg-primary', 'text-white');
        selectedBtn.classList.remove('border-gray-300');
    }

    // Update summary
    const summaryDate = document.getElementById('summary-date');
    if (summaryDate) {
        const date = new Date(dateStr);
        summaryDate.textContent = date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    // Generate time slots for selected date
    generateTimeSlots();
    checkFormValidity();
}

function generateTimeSlots() {
    const timeSlotsGrid = document.getElementById('time-slots');
    if (!timeSlotsGrid) return;

    // Generate time slots from 9 AM to 6 PM
    const timeSlots = [];
    for (let hour = 9; hour < 18; hour++) {
        timeSlots.push(`${hour.toString().padStart(2, '0')}:00`);
        if (hour < 17) { // Don't add 6:30 PM
            timeSlots.push(`${hour.toString().padStart(2, '0')}:30`);
        }
    }

    // Randomly mark some slots as unavailable
    const unavailableSlots = timeSlots.filter(() => Math.random() < 0.3);

    timeSlotsGrid.innerHTML = timeSlots.map(time => {
        const isUnavailable = unavailableSlots.includes(time);
        const displayTime = formatTime(time);

        return `
            <button type="button" 
                    class="time-slot p-2 text-sm border rounded-lg transition ${
                        isUnavailable 
                            ? 'border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50' 
                            : 'border-gray-300 hover:bg-blue-50 hover:border-primary'
                    }" 
                    data-time="${time}"
                    ${isUnavailable ? 'disabled' : `onclick="selectTime('${time}')"`}>
                ${displayTime}
            </button>
        `;
    }).join('');
}

function formatTime(time) {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
}

function selectTime(time) {
    selectedTime = time;

    // Update UI
    document.querySelectorAll('.time-slot:not([disabled])').forEach(btn => {
        btn.classList.remove('bg-primary', 'text-white');
        btn.classList.add('border-gray-300');
    });

    const selectedBtn = document.querySelector(`[data-time="${time}"]`);
    if (selectedBtn) {
        selectedBtn.classList.add('bg-primary', 'text-white');
        selectedBtn.classList.remove('border-gray-300');
    }

    // Update summary
    const summaryTime = document.getElementById('summary-time');
    if (summaryTime) {
        summaryTime.textContent = formatTime(time);
    }

    checkFormValidity();
}

function setupFormHandlers() {
    // Session type change handler
    const sessionTypeInputs = document.querySelectorAll('input[name="session_type"]');
    sessionTypeInputs.forEach(input => {
        input.addEventListener('change', function() {
            const summaryType = document.getElementById('summary-type');
            if (summaryType) {
                const typeLabels = {
                    'video': 'Video Call',
                    'in-person': 'In-Person',
                    'phone': 'Phone Call'
                };
                summaryType.textContent = typeLabels[this.value];
            }
        });
    });

    // Form validation
    const requiredFields = ['full-name', 'email', 'phone', 'terms'];
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('input', checkFormValidity);
            field.addEventListener('change', checkFormValidity);
        }
    });

    // Form submission
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', handleBookingSubmission);
    }
}

function checkFormValidity() {
    const bookBtn = document.getElementById('book-btn');
    if (!bookBtn) return;

    const fullName = document.getElementById('full-name')?.value.trim();
    const email = document.getElementById('email')?.value.trim();
    const phone = document.getElementById('phone')?.value.trim();
    const terms = document.getElementById('terms')?.checked;

    const isValid = selectedDate && selectedTime && fullName && email && phone && terms &&
                   utils.validateEmail(email) && utils.validatePhone(phone);

    if (isValid) {
        bookBtn.disabled = false;
        bookBtn.classList.remove('bg-gray-400');
        bookBtn.classList.add('bg-primary', 'hover:bg-secondary');
        bookBtn.textContent = 'Complete Booking';
    } else {
        bookBtn.disabled = true;
        bookBtn.classList.add('bg-gray-400');
        bookBtn.classList.remove('bg-primary', 'hover:bg-secondary');
        bookBtn.textContent = 'Complete Booking';
    }
}

function handleBookingSubmission(e) {
    e.preventDefault();

    const formData = {
        expert: document.getElementById('summary-expert')?.textContent,
        date: selectedDate,
        time: selectedTime,
        sessionType: document.querySelector('input[name="session_type"]:checked')?.value,
        topic: document.getElementById('session-topic')?.value,
        fullName: document.getElementById('full-name')?.value,
        email: document.getElementById('email')?.value,
        phone: document.getElementById('phone')?.value
    };

    // Save booking to localStorage (simulating backend)
    const existingBookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
    const newBooking = {
        id: Date.now(),
        ...formData,
        status: 'confirmed',
        createdAt: new Date().toISOString()
    };
    existingBookings.push(newBooking);
    localStorage.setItem('userBookings', JSON.stringify(existingBookings));

    // Show success modal
    showSuccessModal();
}

function showSuccessModal() {
    const modal = document.getElementById('success-modal');
    if (modal) {
        modal.classList.remove('hidden');
    }
}

function closeModal() {
    const modal = document.getElementById('success-modal');
    if (modal) {
        modal.classList.add('hidden');
    }
}
