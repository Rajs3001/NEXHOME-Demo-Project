const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve frontend
app.use(express.static('public'));

// API Routes
app.use('/api/auth', require('./backend/routes/auth'));
app.use('/api/properties', require('./backend/routes/propertyRoutes'));
app.use('/api/search', require('./backend/routes/search'));
app.use('/api/favorites', require('./backend/routes/favorites'));
app.use('/api/ai', require('./backend/routes/ai'));
app.use('/api/valuation', require('./backend/routes/valuation'));
app.use('/api/inquiries', require('./backend/routes/inquiries'));
app.use('/api/admin', require('./backend/routes/adminRoutes'));

// Serve frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Initialize database
const { initDatabase } = require('./backend/config/database');
const { createTables } = require('./backend/database/init');
const fs = require('fs');
const path = require('path');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads', 'properties');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('Created uploads directory');
}

initDatabase()
    .then(() => createTables())
    .then(() => {
        console.log('Database initialized successfully');
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
            console.log(`Admin panel: http://localhost:${PORT}/admin.html`);
        });
    })
    .catch(err => {
        console.error('Database initialization failed:', err);
    });
