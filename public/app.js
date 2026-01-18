// API Base URL
const API_BASE = window.location.origin + '/api';

// Global State
let currentUser = null;
let currentSearchType = 'buy';
let favorites = [];

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    checkAuthStatus();
    loadFeaturedProperties();
    setupEventListeners();
});

// Authentication
function checkAuthStatus() {
    const token = localStorage.getItem('token');
    if (token) {
        fetch(`${API_BASE}/auth/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => {
            if (data.user) {
                currentUser = data.user;
                updateUIForLoggedIn();
            }
        })
        .catch(() => {
            localStorage.removeItem('token');
        });
    } else {
        updateUIForLoggedOut();
    }
}

function updateUIForLoggedIn() {
    document.getElementById('user-menu').classList.add('hidden');
    document.getElementById('logged-in-menu').classList.remove('hidden');
    document.getElementById('user-name').textContent = currentUser.name;
    loadFavoritesCount();
}

function updateUIForLoggedOut() {
    document.getElementById('user-menu').classList.remove('hidden');
    document.getElementById('logged-in-menu').classList.add('hidden');
}

function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })
    .then(res => res.json())
    .then(data => {
        if (data.token) {
            localStorage.setItem('token', data.token);
            currentUser = data.user;
            updateUIForLoggedIn();
            closeLoginModal();
            showToast('Login successful!');
            loadFeaturedProperties();
        } else {
            showToast(data.error || 'Login failed', 'error');
        }
    })
    .catch(err => showToast('Login failed. Please try again.', 'error'));
}

function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const phone = document.getElementById('register-phone').value;
    const password = document.getElementById('register-password').value;
    const user_type = document.getElementById('register-user-type').value;

    fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password, user_type })
    })
    .then(res => res.json())
    .then(data => {
        if (data.token) {
            localStorage.setItem('token', data.token);
            currentUser = data.user;
            updateUIForLoggedIn();
            closeRegisterModal();
            showToast('Account created successfully!');
            loadFeaturedProperties();
        } else {
            showToast(data.error || 'Registration failed', 'error');
        }
    })
    .catch(err => showToast('Registration failed. Please try again.', 'error'));
}

function logout() {
    localStorage.removeItem('token');
    currentUser = null;
    updateUIForLoggedOut();
    showToast('Logged out successfully');
    showHome();
}

// Modals
function showLoginModal() {
    document.getElementById('login-modal').classList.remove('hidden');
}

function closeLoginModal() {
    document.getElementById('login-modal').classList.add('hidden');
    document.getElementById('login-form').reset();
}

function showRegisterModal() {
    document.getElementById('register-modal').classList.remove('hidden');
}

function closeRegisterModal() {
    document.getElementById('register-modal').classList.add('hidden');
    document.getElementById('register-form').reset();
}

function showAIAssistant() {
    document.getElementById('ai-modal').classList.remove('hidden');
}

function closeAIModal() {
    document.getElementById('ai-modal').classList.add('hidden');
}

function showValuationTool() {
    if (!currentUser) {
        showToast('Please login to use this tool', 'error');
        showLoginModal();
        return;
    }
    document.getElementById('valuation-modal').classList.remove('hidden');
}

function closeValuationModal() {
    document.getElementById('valuation-modal').classList.add('hidden');
    document.getElementById('valuation-result').classList.add('hidden');
}

function showLoanTool() {
    if (!currentUser) {
        showToast('Please login to use this tool', 'error');
        showLoginModal();
        return;
    }
    document.getElementById('loan-modal').classList.remove('hidden');
}

function closeLoanModal() {
    document.getElementById('loan-modal').classList.add('hidden');
    document.getElementById('loan-result').classList.add('hidden');
}

// Navigation
function showHome() {
    hideAllPages();
    document.getElementById('page-home').classList.remove('hidden');
    loadFeaturedProperties();
}

function showBuyProperties() {
    currentSearchType = 'buy';
    performSearch('sale');
}

function showRentProperties() {
    currentSearchType = 'rent';
    performSearch('rent');
}

function showSellPage() {
    if (!currentUser) {
        showToast('Please login as a seller to list properties', 'error');
        showLoginModal();
        return;
    }
    if (currentUser.user_type !== 'seller') {
        showToast('You need a seller account to list properties', 'error');
        return;
    }
    hideAllPages();
    document.getElementById('page-sell').classList.remove('hidden');
}

function showTools() {
    showHome();
    setTimeout(() => {
        document.querySelector('.tools-section').scrollIntoView({ behavior: 'smooth' });
    }, 100);
}

function hideAllPages() {
    document.querySelectorAll('.page').forEach(page => page.classList.add('hidden'));
}

function setSearchType(type) {
    currentSearchType = type;
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
}

// Properties
function loadFeaturedProperties() {
    fetch(`${API_BASE}/properties?status=active&limit=6`)
        .then(res => res.json())
        .then(data => {
            displayProperties(data.properties || [], 'featured-properties');
        })
        .catch(err => console.error('Error loading properties:', err));
}

function performSearch(listingType = null) {
    const query = document.getElementById('hero-search').value;
    const city = document.getElementById('filter-city').value;
    const propertyType = document.getElementById('filter-type').value;
    const bedrooms = document.getElementById('filter-bedrooms').value;
    const minPrice = document.getElementById('filter-price-min').value;
    const maxPrice = document.getElementById('filter-price-max').value;

    let url = `${API_BASE}/search?`;
    if (listingType) url += `listing_type=${listingType}&`;
    if (query) url += `q=${encodeURIComponent(query)}&`;
    if (city) url += `city=${encodeURIComponent(city)}&`;
    if (propertyType) url += `property_type=${propertyType}&`;
    if (bedrooms) url += `bedrooms=${bedrooms}&`;
    if (minPrice) url += `min_price=${minPrice}&`;
    if (maxPrice) url += `max_price=${maxPrice}&`;

    fetch(url)
        .then(res => res.json())
        .then(data => {
            hideAllPages();
            document.getElementById('page-search').classList.remove('hidden');
            document.getElementById('search-results-title').textContent = 
                `Found ${data.count || 0} Properties`;
            displayProperties(data.properties || [], 'search-results');
        })
        .catch(err => {
            showToast('Search failed. Please try again.', 'error');
        });
}

function displayProperties(properties, containerId) {
    const container = document.getElementById(containerId);
    if (!properties.length) {
        container.innerHTML = '<p style="text-align: center; padding: 40px; color: var(--text-secondary);">No properties found</p>';
        return;
    }

    container.innerHTML = properties.map(prop => `
        <div class="property-card" onclick="showPropertyDetails(${prop.id})">
            <div style="position: relative;">
                <img src="${prop.images || 'https://placehold.co/400x300/e0e0e0/999?text=No+Image'}" 
                     alt="${prop.title}" class="property-image">
                <span class="property-badge">${prop.listing_type === 'sale' ? 'For Sale' : 'For Rent'}</span>
                <button class="property-favorite ${isFavorited(prop.id) ? 'active' : ''}" 
                        onclick="event.stopPropagation(); toggleFavorite(${prop.id})">
                    <i class="${isFavorited(prop.id) ? 'fas' : 'far'} fa-heart"></i>
                </button>
            </div>
            <div class="property-card-body">
                <div class="property-price">$${formatPrice(prop.price)}</div>
                <div class="property-specs">
                    ${prop.bedrooms || 'N/A'} beds | ${prop.bathrooms || 'N/A'} baths | ${prop.area_sqft ? prop.area_sqft.toLocaleString() + ' sqft' : 'N/A'}
                </div>
                <div class="property-address">${prop.address}, ${prop.city}, ${prop.state}</div>
                <span class="property-type-badge">${prop.property_type}</span>
            </div>
        </div>
    `).join('');
}

function showPropertyDetails(id) {
    fetch(`${API_BASE}/properties/${id}`)
        .then(res => res.json())
        .then(data => {
            const prop = data.property;
            hideAllPages();
            document.getElementById('page-details').classList.remove('hidden');
            
            const isFav = isFavorited(id);
            document.getElementById('property-details-content').innerHTML = `
                <div class="content-section">
                    <div class="property-details-header">
                        <div>
                            <h1 style="font-size: 36px; margin-bottom: 10px;">$${formatPrice(prop.price)}</h1>
                            <p style="font-size: 18px; color: var(--text-secondary); margin-bottom: 5px;">
                                ${prop.bedrooms || 'N/A'} beds | ${prop.bathrooms || 'N/A'} baths | ${prop.area_sqft ? prop.area_sqft.toLocaleString() + ' sqft' : 'N/A'}
                            </p>
                            <p style="color: var(--text-light);">${prop.address}, ${prop.city}, ${prop.state} ${prop.zip_code || ''}</p>
                        </div>
                        <button class="btn-primary" onclick="toggleFavorite(${prop.id})">
                            <i class="${isFav ? 'fas' : 'far'} fa-heart"></i> ${isFav ? 'Saved' : 'Save'}
                        </button>
                    </div>
                    
                    <div class="property-details-gallery">
                        <img src="${prop.images || 'https://placehold.co/800x600/e0e0e0/999?text=No+Image'}" alt="${prop.title}">
                    </div>
                    
                    <div class="property-details-info">
                        <h2 style="margin-bottom: 20px;">${prop.title}</h2>
                        <p style="line-height: 1.8; margin-bottom: 30px; color: var(--text-secondary);">
                            ${prop.description || 'No description available.'}
                        </p>
                        
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px;">
                            <div>
                                <div style="color: var(--text-secondary); font-size: 14px; margin-bottom: 5px;">Property Type</div>
                                <div style="font-weight: 600;">${prop.property_type}</div>
                            </div>
                            ${prop.year_built ? `
                            <div>
                                <div style="color: var(--text-secondary); font-size: 14px; margin-bottom: 5px;">Year Built</div>
                                <div style="font-weight: 600;">${prop.year_built}</div>
                            </div>
                            ` : ''}
                            ${prop.parking ? `
                            <div>
                                <div style="color: var(--text-secondary); font-size: 14px; margin-bottom: 5px;">Parking</div>
                                <div style="font-weight: 600;">${prop.parking} spaces</div>
                            </div>
                            ` : ''}
                        </div>
                        
                        ${currentUser && currentUser.user_type === 'buyer' ? `
                        <div class="contact-seller-form">
                            <h3 style="margin-bottom: 20px;">Contact Seller</h3>
                            <form onsubmit="handleInquiry(event, ${prop.id})">
                                <div class="form-group">
                                    <textarea id="inquiry-message" rows="4" placeholder="Your message to the seller..." required></textarea>
                                </div>
                                <button type="submit" class="btn-primary btn-block">Send Message</button>
                            </form>
                            <p style="margin-top: 15px; font-size: 14px; color: var(--text-secondary);">
                                Seller: ${prop.seller_name} | ${prop.seller_email}
                            </p>
                        </div>
                        ` : ''}
                        
                        <div style="margin-top: 30px;">
                            <button class="btn-secondary" onclick="showValuationTool()">Estimate Value</button>
                            <button class="btn-secondary" onclick="showLoanTool()">Calculate Loan</button>
                        </div>
                    </div>
                </div>
            `;
        })
        .catch(err => {
            showToast('Failed to load property details', 'error');
        });
}

// Favorites
function loadFavoritesCount() {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    fetch(`${API_BASE}/favorites`, {
        headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
        favorites = data.properties || [];
        document.getElementById('favorites-count').textContent = favorites.length;
    })
    .catch(() => {});
}

function isFavorited(propertyId) {
    return favorites.some(fav => fav.id === propertyId);
}

function toggleFavorite(propertyId) {
    if (!currentUser) {
        showToast('Please login to save favorites', 'error');
        showLoginModal();
        return;
    }

    const token = localStorage.getItem('token');
    const isFav = isFavorited(propertyId);
    
    fetch(`${API_BASE}/favorites/${propertyId}`, {
        method: isFav ? 'DELETE' : 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
        if (isFav) {
            favorites = favorites.filter(fav => fav.id !== propertyId);
            showToast('Removed from favorites');
        } else {
            favorites.push({ id: propertyId });
            showToast('Added to favorites');
        }
        document.getElementById('favorites-count').textContent = favorites.length;
        loadFeaturedProperties();
        if (!document.getElementById('page-details').classList.contains('hidden')) {
            showPropertyDetails(propertyId);
        }
    })
    .catch(err => showToast('Failed to update favorites', 'error'));
}

function showFavorites() {
    if (!currentUser) {
        showToast('Please login to view favorites', 'error');
        showLoginModal();
        return;
    }
    
    const token = localStorage.getItem('token');
    fetch(`${API_BASE}/favorites`, {
        headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
        hideAllPages();
        document.getElementById('page-search').classList.remove('hidden');
        document.getElementById('search-results-title').textContent = 'My Favorites';
        displayProperties(data.properties || [], 'search-results');
    });
}

// List Property
function handleListProperty(e) {
    e.preventDefault();
    if (!currentUser || currentUser.user_type !== 'seller') {
        showToast('Seller account required', 'error');
        return;
    }

    const token = localStorage.getItem('token');
    const propertyData = {
        title: document.getElementById('prop-title').value,
        description: document.getElementById('prop-description').value,
        property_type: document.getElementById('prop-type').value,
        listing_type: document.getElementById('prop-listing-type').value,
        price: parseFloat(document.getElementById('prop-price').value),
        address: document.getElementById('prop-address').value,
        city: document.getElementById('prop-city').value,
        state: document.getElementById('prop-state').value,
        zip_code: document.getElementById('prop-zip').value,
        bedrooms: parseInt(document.getElementById('prop-bedrooms').value) || null,
        bathrooms: parseInt(document.getElementById('prop-bathrooms').value) || null,
        area_sqft: parseInt(document.getElementById('prop-area').value) || null,
        year_built: parseInt(document.getElementById('prop-year').value) || null,
        parking: parseInt(document.getElementById('prop-parking').value) || 0,
        images: document.getElementById('prop-image').value || null
    };

    fetch(`${API_BASE}/properties`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(propertyData)
    })
    .then(res => res.json())
    .then(data => {
        if (data.property_id) {
            showToast('Property listed successfully!');
            document.getElementById('list-property-form').reset();
            showMyProperties();
        } else {
            showToast(data.error || 'Failed to list property', 'error');
        }
    })
    .catch(err => showToast('Failed to list property', 'error'));
}

function showMyProperties() {
    if (!currentUser || currentUser.user_type !== 'seller') {
        showToast('Seller account required', 'error');
        return;
    }
    
    const token = localStorage.getItem('token');
    fetch(`${API_BASE}/properties/seller/my-properties`, {
        headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
        hideAllPages();
        document.getElementById('page-search').classList.remove('hidden');
        document.getElementById('search-results-title').textContent = 'My Properties';
        displayProperties(data.properties || [], 'search-results');
    });
}

// AI Assistant
function sendAIMessage() {
    const input = document.getElementById('ai-input');
    const message = input.value.trim();
    if (!message) return;

    const chat = document.getElementById('ai-chat');
    chat.innerHTML += `
        <div style="text-align: right; margin-bottom: 20px;">
            <p style="background: var(--primary); color: white; padding: 15px; border-radius: 8px; display: inline-block; max-width: 80%;">
                ${message}
            </p>
        </div>
    `;

    input.value = '';
    chat.scrollTop = chat.scrollHeight;

    const token = localStorage.getItem('token');
    fetch(`${API_BASE}/ai/chat`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token || ''}`
        },
        body: JSON.stringify({ message })
    })
    .then(res => res.json())
    .then(data => {
        chat.innerHTML += `
            <div class="ai-message">
                <i class="fas fa-robot"></i>
                <p>${data.response}</p>
            </div>
        `;
        chat.scrollTop = chat.scrollHeight;
    })
    .catch(err => {
        chat.innerHTML += `
            <div class="ai-message">
                <i class="fas fa-robot"></i>
                <p>Sorry, I'm having trouble right now. Please try again later.</p>
            </div>
        `;
    });
}

// Valuation
function handleValuation(e) {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const data = {
        area_sqft: parseInt(document.getElementById('val-area').value),
        bedrooms: parseInt(document.getElementById('val-bedrooms').value) || 0,
        bathrooms: parseInt(document.getElementById('val-bathrooms').value) || 0,
        property_type: document.getElementById('val-type').value,
        city: document.getElementById('val-city').value,
        year_built: parseInt(document.getElementById('val-year').value) || 2000,
        parking: parseInt(document.getElementById('val-parking').value) || 0
    };

    fetch(`${API_BASE}/valuation/property`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(data => {
        const result = document.getElementById('valuation-result');
        result.classList.remove('hidden');
        result.innerHTML = `
            <h3 style="margin-bottom: 20px;">Estimated Value</h3>
            <div class="result-item">
                <span class="result-label">Estimated Market Value</span>
                <span class="result-value">$${formatPrice(data.estimated_value)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Confidence</span>
                <span class="result-value">${data.confidence}</span>
            </div>
        `;
    })
    .catch(err => showToast('Valuation failed', 'error'));
}

// Loan Calculator
function handleLoanCalculation(e) {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const data = {
        property_price: parseFloat(document.getElementById('loan-price').value),
        down_payment_percent: parseFloat(document.getElementById('loan-down').value),
        interest_rate: parseFloat(document.getElementById('loan-rate').value),
        loan_term_years: parseInt(document.getElementById('loan-term').value)
    };

    fetch(`${API_BASE}/valuation/loan`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(data => {
        const result = document.getElementById('loan-result');
        result.classList.remove('hidden');
        result.innerHTML = `
            <h3 style="margin-bottom: 20px;">Loan Estimate</h3>
            <div class="result-item">
                <span class="result-label">Down Payment</span>
                <span class="result-value">$${formatPrice(data.downPayment)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Loan Amount</span>
                <span class="result-value">$${formatPrice(data.loanAmount)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Monthly Payment</span>
                <span class="result-value">$${formatPrice(data.monthlyPayment)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Total Interest</span>
                <span class="result-value">$${formatPrice(data.totalInterest)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Total Payment</span>
                <span class="result-value">$${formatPrice(data.totalPayment)}</span>
            </div>
        `;
    })
    .catch(err => showToast('Loan calculation failed', 'error'));
}

// Inquiries
function handleInquiry(e, propertyId) {
    e.preventDefault();
    if (!currentUser || currentUser.user_type !== 'buyer') {
        showToast('Buyer account required', 'error');
        return;
    }

    const token = localStorage.getItem('token');
    const message = document.getElementById('inquiry-message').value;

    fetch(`${API_BASE}/inquiries`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ property_id: propertyId, message })
    })
    .then(res => res.json())
    .then(data => {
        if (data.inquiry_id) {
            showToast('Message sent to seller!');
            document.getElementById('inquiry-message').value = '';
        } else {
            showToast(data.error || 'Failed to send message', 'error');
        }
    })
    .catch(err => showToast('Failed to send message', 'error'));
}

// Utilities
function formatPrice(price) {
    return new Intl.NumberFormat('en-US').format(Math.round(price));
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), 3000);
}

function toggleUserDropdown() {
    document.getElementById('user-dropdown-menu').classList.toggle('hidden');
}

function setupEventListeners() {
    // Close modals on outside click
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.add('hidden');
            }
        });
    });

    // Close dropdown on outside click
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.user-dropdown')) {
            document.getElementById('user-dropdown-menu').classList.add('hidden');
        }
    });
}

function showAllProperties() {
    performSearch();
}

function showDashboard() {
    if (!currentUser) {
        showToast('Please login', 'error');
        showLoginModal();
        return;
    }
    hideAllPages();
    document.getElementById('page-dashboard').classList.remove('hidden');
    document.getElementById('dashboard-content').innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;">
            <div style="background: white; padding: 30px; border-radius: 12px; box-shadow: var(--shadow);">
                <h3 style="margin-bottom: 10px;">Account Type</h3>
                <p style="font-size: 24px; font-weight: 700; color: var(--primary);">${currentUser.user_type.toUpperCase()}</p>
            </div>
            <div style="background: white; padding: 30px; border-radius: 12px; box-shadow: var(--shadow);">
                <h3 style="margin-bottom: 10px;">Favorites</h3>
                <p style="font-size: 24px; font-weight: 700; color: var(--primary);">${favorites.length}</p>
            </div>
        </div>
        ${currentUser.user_type === 'seller' ? `
        <div style="margin-top: 30px;">
            <button class="btn-primary" onclick="showSellPage()">List New Property</button>
            <button class="btn-secondary" onclick="showMyProperties()" style="margin-left: 10px;">View My Properties</button>
        </div>
        ` : ''}
    `;
}

function showInquiries() {
    if (!currentUser) return;
    const token = localStorage.getItem('token');
    const endpoint = currentUser.user_type === 'seller' ? 'seller' : 'buyer';
    
    fetch(`${API_BASE}/inquiries/${endpoint}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
        hideAllPages();
        document.getElementById('page-details').classList.remove('hidden');
        document.getElementById('property-details-content').innerHTML = `
            <div class="content-section">
                <h2>${currentUser.user_type === 'seller' ? 'Inquiries Received' : 'My Inquiries'}</h2>
                <div style="margin-top: 20px;">
                    ${data.inquiries && data.inquiries.length ? data.inquiries.map(inq => `
                        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 15px; box-shadow: var(--shadow);">
                            <h3>${inq.property_title}</h3>
                            <p style="color: var(--text-secondary); margin: 10px 0;">${inq.address}</p>
                            <p style="margin: 15px 0;">${inq.message}</p>
                            <p style="font-size: 14px; color: var(--text-light);">${new Date(inq.created_at).toLocaleDateString()}</p>
                            ${currentUser.user_type === 'seller' ? `<p><strong>From:</strong> ${inq.buyer_name} (${inq.buyer_email})</p>` : ''}
                        </div>
                    `).join('') : '<p>No inquiries yet.</p>'}
                </div>
            </div>
        `;
    });
}

