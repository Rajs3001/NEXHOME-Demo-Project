const express = require('express');
const router = express.Router();
const PropertyController = require('../controllers/propertyController');
const { authenticateToken } = require('../middleware/auth');
const { upload } = require('../config/upload');
const Property = require('../models/Property');
const { getDb } = require('../config/database');

/**
 * Admin Routes
 * Developer/admin endpoints for property management
 */

// Middleware to check admin access (for now, any authenticated user can access admin)
// In production, add proper admin role check
const requireAdmin = (req, res, next) => {
    // For now, allow any authenticated user
    // TODO: Add proper admin role check
    next();
};

// Get all properties (including inactive) - Admin view
router.get('/properties', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const properties = await Property.findAll({ status: req.query.status });
        res.json({ properties });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch properties' });
    }
});

// Create property as admin (can assign to any seller)
router.post('/properties', authenticateToken, requireAdmin, upload.array('images', 10), async (req, res) => {
    try {
        const propertyData = {
            seller_id: req.body.seller_id || req.user.id,
            title: req.body.title,
            description: req.body.description,
            property_type: req.body.property_type,
            listing_type: req.body.listing_type,
            price: parseFloat(req.body.price),
            address: req.body.address,
            city: req.body.city,
            state: req.body.state,
            zip_code: req.body.zip_code,
            bedrooms: req.body.bedrooms ? parseInt(req.body.bedrooms) : null,
            bathrooms: req.body.bathrooms ? parseInt(req.body.bathrooms) : null,
            area_sqft: req.body.area_sqft ? parseInt(req.body.area_sqft) : null,
            year_built: req.body.year_built ? parseInt(req.body.year_built) : null,
            parking: req.body.parking ? parseInt(req.body.parking) : 0,
            latitude: req.body.latitude ? parseFloat(req.body.latitude) : null,
            longitude: req.body.longitude ? parseFloat(req.body.longitude) : null
        };

        if (req.files && req.files.length > 0) {
            propertyData.images = req.files.map(file => file.filename);
        }

        const propertyId = await Property.create(propertyData);
        res.status(201).json({
            message: 'Property created successfully',
            property_id: propertyId
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create property' });
    }
});

// Update any property (admin)
router.put('/properties/:id', authenticateToken, requireAdmin, upload.array('images', 10), async (req, res) => {
    try {
        const updates = { ...req.body };
        if (req.files && req.files.length > 0) {
            updates.images = req.files.map(file => file.filename);
        }
        const updated = await Property.update(req.params.id, updates);
        if (updated) {
            res.json({ message: 'Property updated successfully' });
        } else {
            res.status(400).json({ error: 'Failed to update property' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to update property' });
    }
});

// Delete property (admin - hard delete)
router.delete('/properties/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const db = getDb();
        db.run('DELETE FROM properties WHERE id = ?', [req.params.id], function(err) {
            if (err) {
                return res.status(500).json({ error: 'Failed to delete property' });
            }
            if (this.changes === 0) {
                return res.status(404).json({ error: 'Property not found' });
            }
            res.json({ message: 'Property deleted successfully' });
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete property' });
    }
});

// Get database stats
router.get('/stats', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const db = getDb();
        const stats = {};

        // Get counts
        db.get('SELECT COUNT(*) as count FROM users', (err, row) => {
            if (err) throw err;
            stats.users = row.count;

            db.get('SELECT COUNT(*) as count FROM properties', (err, row) => {
                if (err) throw err;
                stats.properties = row.count;

                db.get('SELECT COUNT(*) as count FROM properties WHERE status = ?', ['active'], (err, row) => {
                    if (err) throw err;
                    stats.activeProperties = row.count;

                    db.get('SELECT COUNT(*) as count FROM favorites', (err, row) => {
                        if (err) throw err;
                        stats.favorites = row.count;

                        db.get('SELECT COUNT(*) as count FROM inquiries', (err, row) => {
                            if (err) throw err;
                            stats.inquiries = row.count;
                            res.json({ stats });
                        });
                    });
                });
            });
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
});

module.exports = router;

