// Dashboard page functionality

document.addEventListener('DOMContentLoaded', function() {
    checkAuthentication();
    loadUserBookings();
    loadUserProfile();
    setupDashboardInteractions();
});

function checkAuthentication() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        // Redirect to login if not authenticated
        window.location.href = 'login.html';
        return;
    }
}

function loadUserProfile() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

    // Update profile display
    const profileElements = document.querySelectorAll('[data-user-name]');
    profileElements.forEach(el => {
        el.textContent = `${currentUser.firstName} ${currentUser.lastName}`;
    });

    // Update any profile images if needed
    const profileName = document.querySelector('#profile-menu-btn span');
    if (profileName) {
        profileName.textContent = `${currentUser.firstName} ${currentUser.lastName}`;
    }
}

function loadUserBookings() {
    const bookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
    const upcomingBookings = bookings.filter(booking => {
        const bookingDate = new Date(booking.date);
        const today = new Date();
        return bookingDate >= today && booking.status === 'confirmed';
    });

    // Update stats
    updateBookingStats(bookings, upcomingBookings);

    // Display upcoming appointments (we'll use dummy data for demo)
    displayUpcomingAppointments();
}

function updateBookingStats(allBookings, upcomingBookings) {
    const stats = {
        upcoming: upcomingBookings.length,
        completed: allBookings.filter(b => b.status === 'completed').length,
        thisWeek: getThisWeekBookings(upcomingBookings).length,
        avgRating: 4.8 // Dummy average rating
    };

    // Update stat displays
    const statElements = {
        upcoming: document.querySelector('[data-stat="upcoming"]'),
        completed: document.querySelector('[data-stat="completed"]'),
        thisWeek: document.querySelector('[data-stat="this-week"]'),
        avgRating: document.querySelector('[data-stat="avg-rating"]')
    };

    Object.keys(statElements).forEach(key => {
        if (statElements[key]) {
            statElements[key].textContent = stats[key];
        }
    });
}

function getThisWeekBookings(bookings) {
    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    const endOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6));

    return bookings.filter(booking => {
        const bookingDate = new Date(booking.date);
        return bookingDate >= startOfWeek && bookingDate <= endOfWeek;
    });
}

function displayUpcomingAppointments() {
    // For demo purposes, we'll show some sample appointments
    const sampleAppointments = [
        {
            expert: {
                name: "Dr. Sarah Johnson",
                title: "Mathematics Professor",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face"
            },
            date: "2025-07-25",
            time: "14:00",
            type: "video",
            status: "confirmed"
        },
        {
            expert: {
                name: "Michael Chen",
                title: "Financial Advisor",
                image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=60&h=60&fit=crop&crop=face"
            },
            date: "2025-07-27",
            time: "10:00",
            type: "phone",
            status: "confirmed"
        },
        {
            expert: {
                name: "Emma Rodriguez",
                title: "Business Consultant",
                image: "https://images.unsplash.com/photo-1494790108755-2616b612b3d9?w=60&h=60&fit=crop&crop=face"
            },
            date: "2025-07-30",
            time: "15:30",
            type: "in-person",
            status: "confirmed"
        }
    ];

    // Check if user has actual bookings
    const userBookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
    const appointmentsToShow = userBookings.length > 0 ?
        userBookings.slice(0, 3).map(booking => ({
            expert: {
                name: booking.expert || "Expert",
                title: "Professional",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face"
            },
            date: booking.date,
            time: booking.time,
            type: booking.sessionType,
            status: booking.status
        })) : sampleAppointments;

    const appointmentsContainer = document.querySelector('#upcoming-appointments');
    if (appointmentsContainer) {
        appointmentsContainer.innerHTML = appointmentsToShow.map(appointment =>
            createAppointmentCard(appointment)
        ).join('');
    }
}

function createAppointmentCard(appointment) {
    const date = new Date(appointment.date);
    const isToday = date.toDateString() === new Date().toDateString();
    const isTomorrow = date.toDateString() === new Date(Date.now() + 86400000).toDateString();

    let dateDisplay;
    if (isToday) {
        dateDisplay = "Today";
    } else if (isTomorrow) {
        dateDisplay = "Tomorrow";
    } else {
        dateDisplay = date.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    }

    const timeDisplay = formatTime(appointment.time);
    const typeIcons = {
        video: 'fas fa-video',
        phone: 'fas fa-phone',
        'in-person': 'fas fa-map-marker-alt'
    };

    const typeLabels = {
        video: 'Video Call',
        phone: 'Phone Call',
        'in-person': 'In-person'
    };

    return `
        <div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
            <div class="flex items-start justify-between">
                <div class="flex items-start space-x-4">
                    <img src="${appointment.expert.image}" alt="${appointment.expert.name}" 
                         class="w-12 h-12 rounded-full object-cover">
                    <div>
                        <h3 class="font-semibold text-gray-900">${appointment.expert.name}</h3>
                        <p class="text-gray-600 text-sm">${appointment.expert.title}</p>
                        <div class="flex items-center mt-2 text-sm text-gray-500">
                            <i class="fas fa-calendar mr-2"></i>
                            <span>${dateDisplay}</span>
                        </div>
                        <div class="flex items-center mt-1 text-sm text-gray-500">
                            <i class="fas fa-clock mr-2"></i>
                            <span>${timeDisplay}</span>
                        </div>
                        <div class="flex items-center mt-1 text-sm text-gray-500">
                            <i class="${typeIcons[appointment.type]} mr-2"></i>
                            <span>${typeLabels[appointment.type]}</span>
                        </div>
                    </div>
                </div>
                <div class="flex flex-col space-y-2">
                    ${isToday || isTomorrow ? 
                        `<button class="bg-primary text-white px-4 py-2 rounded-lg text-sm hover:bg-secondary transition">
                            Join Call
                        </button>` :
                        `<span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs">
                            ${getDaysFromNow(date)} days
                        </span>`
                    }
                    <button class="text-gray-600 hover:text-gray-800 text-sm" onclick="showAppointmentOptions()">
                        <i class="fas fa-ellipsis-h"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

function formatTime(timeStr) {
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
}

function getDaysFromNow(date) {
    const today = new Date();
    const diffTime = date - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

function setupDashboardInteractions() {
    // Quick action buttons
    const bookNewBtn = document.querySelector('[href="browse.html"]');
    if (bookNewBtn) {
        bookNewBtn.addEventListener('click', function(e) {
            // Could add analytics tracking here
        });
    }

    // Setup logout functionality
    const logoutLinks = document.querySelectorAll('a[href="login.html"]');
    logoutLinks.forEach(link => {
        if (link.textContent.toLowerCase().includes('sign out')) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                logout();
            });
        }
    });
}

function showAppointmentOptions() {
    // In a real app, this would show a dropdown with options like:
    // - Reschedule
    // - Cancel
    // - Contact Expert
    // - Add to Calendar
    alert('Appointment options: Reschedule, Cancel, Contact Expert, Add to Calendar');
}

function logout() {
    localStorage.removeItem('currentUser');
    utils.showNotification('You have been logged out successfully', 'success');
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 1000);
}
