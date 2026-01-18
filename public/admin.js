// Admin Panel JavaScript

const API_BASE = window.location.origin + '/api';
let currentUser = null;
let selectedImages = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    setupImagePreview();
    loadProperties();
});

// Authentication
function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/';
        return;
    }

    fetch(`${API_BASE}/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
        if (data.user) {
            currentUser = data.user;
        } else {
            window.location.href = '/';
        }
    })
    .catch(() => {
        window.location.href = '/';
    });
}

function logout() {
    localStorage.removeItem('token');
    window.location.href = '/';
}

// Navigation
function showSection(section) {
    document.querySelectorAll('.admin-section').forEach(sec => sec.classList.add('hidden'));
    document.querySelectorAll('.nav-tab').forEach(tab => tab.classList.remove('active'));
    
    document.getElementById(`section-${section}`).classList.remove('hidden');
    event.target.classList.add('active');
}

// Load Properties
function loadProperties() {
    const status = document.getElementById('filter-status').value;
    const token = localStorage.getItem('token');
    
    let url = `${API_BASE}/admin/properties`;
    if (status) {
        url += `?status=${status}`;
    }

    fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
        displayProperties(data.properties || []);
    })
    .catch(err => {
        showToast('Failed to load properties', 'error');
    });
}

function displayProperties(properties) {
    const container = document.getElementById('properties-list');
    
    if (properties.length === 0) {
        container.innerHTML = '<p style="text-align: center; padding: 40px; color: var(--text-secondary);">No properties found</p>';
        return;
    }

    container.innerHTML = properties.map(prop => {
        const mainImage = prop.images && prop.images.length > 0 ? prop.images[0] : 'https://placehold.co/400x300/e0e0e0/999?text=No+Image';
        return `
            <div class="property-admin-card">
                <img src="${mainImage}" alt="${prop.title}">
                <h3>${prop.title}</h3>
                <div class="property-info">
                    <span><strong>Price:</strong> $${formatPrice(prop.price)}</span>
                    <span><strong>Type:</strong> ${prop.property_type}</span>
                    <span><strong>Location:</strong> ${prop.city}, ${prop.state}</span>
                    <span><strong>Status:</strong> <span class="property-status ${prop.status}">${prop.status}</span></span>
                </div>
                <div class="property-actions">
                    <button class="btn-secondary" onclick="editProperty(${prop.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn-secondary" onclick="deleteProperty(${prop.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Add Property
function setupImagePreview() {
    const fileInput = document.getElementById('prop-images');
    fileInput.addEventListener('change', (e) => {
        selectedImages = Array.from(e.target.files);
        displayImagePreview();
    });
}

function displayImagePreview() {
    const preview = document.getElementById('image-preview');
    preview.innerHTML = '';

    selectedImages.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const div = document.createElement('div');
            div.className = 'image-preview-item';
            div.innerHTML = `
                <img src="${e.target.result}" alt="Preview">
                <button type="button" class="remove-image" onclick="removeImage(${index})">
                    <i class="fas fa-times"></i>
                </button>
            `;
            preview.appendChild(div);
        };
        reader.readAsDataURL(file);
    });
}

function removeImage(index) {
    selectedImages.splice(index, 1);
    const fileInput = document.getElementById('prop-images');
    const dt = new DataTransfer();
    selectedImages.forEach(file => dt.items.add(file));
    fileInput.files = dt.files;
    displayImagePreview();
}

function handleAddProperty(e) {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    const formData = new FormData();
    formData.append('title', document.getElementById('prop-title').value);
    formData.append('description', document.getElementById('prop-description').value);
    formData.append('property_type', document.getElementById('prop-type').value);
    formData.append('listing_type', document.getElementById('prop-listing-type').value);
    formData.append('price', document.getElementById('prop-price').value);
    formData.append('address', document.getElementById('prop-address').value);
    formData.append('city', document.getElementById('prop-city').value);
    formData.append('state', document.getElementById('prop-state').value);
    formData.append('zip_code', document.getElementById('prop-zip').value);
    formData.append('bedrooms', document.getElementById('prop-bedrooms').value);
    formData.append('bathrooms', document.getElementById('prop-bathrooms').value);
    formData.append('area_sqft', document.getElementById('prop-area').value);
    formData.append('year_built', document.getElementById('prop-year').value);
    formData.append('parking', document.getElementById('prop-parking').value);

    // Add images
    selectedImages.forEach((file, index) => {
        formData.append('images', file);
    });

    fetch(`${API_BASE}/admin/properties`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        if (data.property_id) {
            showToast('Property created successfully!');
            document.getElementById('add-property-form').reset();
            selectedImages = [];
            document.getElementById('image-preview').innerHTML = '';
            showSection('properties');
            loadProperties();
        } else {
            showToast(data.error || 'Failed to create property', 'error');
        }
    })
    .catch(err => {
        showToast('Failed to create property', 'error');
    });
}

// Edit Property
function editProperty(id) {
    // Load property data and populate form
    const token = localStorage.getItem('token');
    fetch(`${API_BASE}/properties/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
        const prop = data.property;
        // Populate form fields
        document.getElementById('prop-title').value = prop.title;
        document.getElementById('prop-description').value = prop.description || '';
        document.getElementById('prop-type').value = prop.property_type;
        document.getElementById('prop-listing-type').value = prop.listing_type;
        document.getElementById('prop-price').value = prop.price;
        document.getElementById('prop-address').value = prop.address;
        document.getElementById('prop-city').value = prop.city;
        document.getElementById('prop-state').value = prop.state;
        document.getElementById('prop-zip').value = prop.zip_code || '';
        document.getElementById('prop-bedrooms').value = prop.bedrooms || '';
        document.getElementById('prop-bathrooms').value = prop.bathrooms || '';
        document.getElementById('prop-area').value = prop.area_sqft || '';
        document.getElementById('prop-year').value = prop.year_built || '';
        document.getElementById('prop-parking').value = prop.parking || 0;
        
        showSection('add-property');
        showToast('Property loaded. Update and save changes.');
    });
}

// Delete Property
function deleteProperty(id) {
    if (!confirm('Are you sure you want to delete this property?')) {
        return;
    }

    const token = localStorage.getItem('token');
    fetch(`${API_BASE}/admin/properties/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
        showToast('Property deleted successfully');
        loadProperties();
    })
    .catch(err => {
        showToast('Failed to delete property', 'error');
    });
}

// Load Stats
function loadStats() {
    const token = localStorage.getItem('token');
    fetch(`${API_BASE}/admin/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
        displayStats(data.stats);
    })
    .catch(err => {
        showToast('Failed to load statistics', 'error');
    });
}

function displayStats(stats) {
    const container = document.getElementById('stats-content');
    container.innerHTML = `
        <div class="stat-card">
            <h3>Total Users</h3>
            <div class="stat-value">${stats.users || 0}</div>
        </div>
        <div class="stat-card">
            <h3>Total Properties</h3>
            <div class="stat-value">${stats.properties || 0}</div>
        </div>
        <div class="stat-card">
            <h3>Active Properties</h3>
            <div class="stat-value">${stats.activeProperties || 0}</div>
        </div>
        <div class="stat-card">
            <h3>Favorites</h3>
            <div class="stat-value">${stats.favorites || 0}</div>
        </div>
        <div class="stat-card">
            <h3>Inquiries</h3>
            <div class="stat-value">${stats.inquiries || 0}</div>
        </div>
    `;
}

// Show stats when section is shown
document.addEventListener('DOMContentLoaded', () => {
    const statsTab = document.querySelector('.nav-tab[onclick*="stats"]');
    if (statsTab) {
        statsTab.addEventListener('click', () => {
            setTimeout(loadStats, 100);
        });
    }
});

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

