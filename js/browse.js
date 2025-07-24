// Browse experts page functionality

// Dummy data for experts
const expertsData = [
    {
        id: 1,
        name: "Dr. Sarah Johnson",
        title: "Mathematics Professor",
        category: "education",
        rating: 4.9,
        reviews: 127,
        price: 75,
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
        specialties: ["Calculus", "Algebra", "Statistics"],
        experience: "15+ years",
        description: "Experienced mathematics professor specializing in calculus and advanced algebra."
    },
    {
        id: 2,
        name: "Michael Chen",
        title: "Financial Advisor",
        category: "finance",
        rating: 4.8,
        reviews: 89,
        price: 120,
        image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop&crop=face",
        specialties: ["Investment Planning", "Retirement", "Tax Strategy"],
        experience: "12+ years",
        description: "Certified financial planner helping clients achieve their financial goals."
    },
    {
        id: 3,
        name: "Emma Rodriguez",
        title: "Business Consultant",
        category: "business",
        rating: 4.7,
        reviews: 156,
        price: 95,
        image: "https://images.unsplash.com/photo-1494790108755-2616b612b3d9?w=300&h=300&fit=crop&crop=face",
        specialties: ["Strategy", "Marketing", "Operations"],
        experience: "10+ years",
        description: "Strategic business consultant with expertise in scaling startups."
    },
    {
        id: 4,
        name: "Dr. James Wilson",
        title: "Computer Science Tutor",
        category: "education",
        rating: 4.9,
        reviews: 201,
        price: 65,
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
        specialties: ["Programming", "Algorithms", "Data Structures"],
        experience: "8+ years",
        description: "PhD in Computer Science with passion for teaching programming."
    },
    {
        id: 5,
        name: "Lisa Park",
        title: "Language Learning Expert",
        category: "skills",
        rating: 4.8,
        reviews: 93,
        price: 55,
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
        specialties: ["Spanish", "French", "ESL"],
        experience: "6+ years",
        description: "Multilingual educator specializing in conversational language learning."
    },
    {
        id: 6,
        name: "David Thompson",
        title: "Investment Specialist",
        category: "finance",
        rating: 4.6,
        reviews: 74,
        price: 110,
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
        specialties: ["Stock Market", "Crypto", "Portfolio Management"],
        experience: "9+ years",
        description: "Investment specialist with focus on modern portfolio theory."
    },
    {
        id: 7,
        name: "Maria Garcia",
        title: "Small Business Advisor",
        category: "business",
        rating: 4.7,
        reviews: 112,
        price: 80,
        image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop&crop=face",
        specialties: ["Small Business", "E-commerce", "Legal Compliance"],
        experience: "11+ years",
        description: "Helping small businesses navigate growth and compliance challenges."
    },
    {
        id: 8,
        name: "Robert Kim",
        title: "Digital Marketing Expert",
        category: "skills",
        rating: 4.8,
        reviews: 88,
        price: 90,
        image: "https://images.unsplash.com/photo-1556157382-97eda2f9e2bf?w=300&h=300&fit=crop&crop=face",
        specialties: ["SEO", "Social Media", "Content Marketing"],
        experience: "7+ years",
        description: "Digital marketing strategist with proven track record in growth."
    }
];

let filteredExperts = [...expertsData];

document.addEventListener('DOMContentLoaded', function() {
    displayExperts(expertsData);
    setupFilters();

    // Check for URL parameters first, then localStorage
    const urlParams = new URLSearchParams(window.location.search);
    const categoryFromURL = urlParams.get('category');
    const selectedCategory = categoryFromURL || localStorage.getItem('selectedCategory');

    if (selectedCategory) {
        // Set the category filter
        const categoryFilter = document.getElementById('category-filter');
        if (categoryFilter) {
            categoryFilter.value = selectedCategory;
        }
        // Apply the filter
        filterExperts();
        // Clear the stored category only if it came from localStorage
        if (!categoryFromURL) {
            localStorage.removeItem('selectedCategory');
        }
    }
});

function displayExperts(experts) {
    const grid = document.getElementById('experts-grid');
    if (!grid) return;

    grid.innerHTML = experts.map(expert => `
        <div class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 fade-in">
            <div class="p-6">
                <div class="flex items-start space-x-4 mb-4">
                    <img src="${expert.image}" alt="${expert.name}" 
                         class="w-16 h-16 rounded-full object-cover">
                    <div class="flex-1">
                        <h3 class="text-lg font-semibold text-gray-900">${expert.name}</h3>
                        <p class="text-gray-600">${expert.title}</p>
                        <div class="flex items-center mt-2">
                            <div class="flex text-yellow-400 text-sm">
                                ${generateStars(expert.rating)}
                            </div>
                            <span class="text-gray-600 text-sm ml-2">${expert.rating} (${expert.reviews} reviews)</span>
                        </div>
                    </div>
                </div>
                
                <p class="text-gray-600 text-sm mb-4">${expert.description}</p>
                
                <div class="mb-4">
                    <div class="flex flex-wrap gap-2">
                        ${expert.specialties.map(specialty => 
                            `<span class="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">${specialty}</span>`
                        ).join('')}
                    </div>
                </div>
                
                <div class="flex items-center justify-between mb-4">
                    <div class="text-sm text-gray-600">
                        <i class="fas fa-clock mr-1"></i>
                        ${expert.experience}
                    </div>
                    <div class="text-lg font-bold text-gray-900">
                        $${expert.price}/hour
                    </div>
                </div>
                
                <div class="flex space-x-2">
                    <button onclick="viewProfile(${expert.id})" 
                            class="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition">
                        View Profile
                    </button>
                    <button onclick="bookExpert(${expert.id})" 
                            class="flex-1 bg-primary text-white py-2 px-4 rounded-lg hover:bg-secondary transition">
                        Book Now
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = '';

    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }

    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }

    return stars;
}

function setupFilters() {
    const searchInput = document.getElementById('search-input');
    const categoryFilter = document.getElementById('category-filter');
    const ratingFilter = document.getElementById('rating-filter');

    if (searchInput) {
        searchInput.addEventListener('input', filterExperts);
    }

    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterExperts);
    }

    if (ratingFilter) {
        ratingFilter.addEventListener('change', filterExperts);
    }
}

function filterExperts() {
    const searchTerm = document.getElementById('search-input')?.value.toLowerCase() || '';
    const selectedCategory = document.getElementById('category-filter')?.value || '';
    const selectedRating = document.getElementById('rating-filter')?.value || '';

    filteredExperts = expertsData.filter(expert => {
        const matchesSearch = expert.name.toLowerCase().includes(searchTerm) ||
                            expert.title.toLowerCase().includes(searchTerm) ||
                            expert.specialties.some(s => s.toLowerCase().includes(searchTerm));

        const matchesCategory = !selectedCategory || expert.category === selectedCategory;

        const matchesRating = !selectedRating || expert.rating >= parseFloat(selectedRating);

        return matchesSearch && matchesCategory && matchesRating;
    });

    displayExperts(filteredExperts);
}

function viewProfile(expertId) {
    const expert = expertsData.find(e => e.id === expertId);
    if (expert) {
        // Store expert data in localStorage for the booking page
        localStorage.setItem('selectedExpert', JSON.stringify(expert));
        alert(`Viewing profile for ${expert.name}. In a real app, this would show a detailed profile page.`);
    }
}

function bookExpert(expertId) {
    const expert = expertsData.find(e => e.id === expertId);
    if (expert) {
        // Store expert data in localStorage for the booking page
        localStorage.setItem('selectedExpert', JSON.stringify(expert));
        window.location.href = 'booking.html';
    }
}
