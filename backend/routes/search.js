const express = require('express');
const { getDb } = require('../database/db');

const router = express.Router();

// Advanced search
router.get('/', (req, res) => {
    const db = getDb();
    const {
        q, // search query
        listing_type,
        city,
        state,
        min_price,
        max_price,
        bedrooms,
        bathrooms,
        property_type,
        min_area,
        max_area
    } = req.query;

    let query = `SELECT p.*, u.name as seller_name, u.email as seller_email
                 FROM properties p
                 JOIN users u ON p.seller_id = u.id
                 WHERE p.status = 'active'`;
    const params = [];

    if (q) {
        query += ` AND (p.title LIKE ? OR p.description LIKE ? OR p.address LIKE ? OR p.city LIKE ?)`;
        const searchTerm = `%${q}%`;
        params.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    if (listing_type) {
        query += ' AND p.listing_type = ?';
        params.push(listing_type);
    }

    if (city) {
        query += ' AND p.city LIKE ?';
        params.push(`%${city}%`);
    }

    if (state) {
        query += ' AND p.state = ?';
        params.push(state);
    }

    if (min_price) {
        query += ' AND p.price >= ?';
        params.push(parseFloat(min_price));
    }

    if (max_price) {
        query += ' AND p.price <= ?';
        params.push(parseFloat(max_price));
    }

    if (bedrooms) {
        query += ' AND p.bedrooms >= ?';
        params.push(parseInt(bedrooms));
    }

    if (bathrooms) {
        query += ' AND p.bathrooms >= ?';
        params.push(parseInt(bathrooms));
    }

    if (property_type) {
        query += ' AND p.property_type = ?';
        params.push(property_type);
    }

    if (min_area) {
        query += ' AND p.area_sqft >= ?';
        params.push(parseInt(min_area));
    }

    if (max_area) {
        query += ' AND p.area_sqft <= ?';
        params.push(parseInt(max_area));
    }

    query += ' ORDER BY p.created_at DESC LIMIT 100';

    db.all(query, params, (err, properties) => {
        if (err) {
            return res.status(500).json({ error: 'Database error', details: err.message });
        }
        res.json({
            count: properties.length,
            properties
        });
    });
});

module.exports = router;

