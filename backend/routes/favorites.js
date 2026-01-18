const express = require('express');
const { getDb } = require('../database/db');
const { authenticateToken, requireBuyer } = require('../middleware/auth');

const router = express.Router();

// Get user's favorites
router.get('/', authenticateToken, (req, res) => {
    const db = getDb();
    db.all(`SELECT p.*, u.name as seller_name
            FROM favorites f
            JOIN properties p ON f.property_id = p.id
            JOIN users u ON p.seller_id = u.id
            WHERE f.user_id = ? AND p.status = 'active'
            ORDER BY f.created_at DESC`,
        [req.user.id],
        (err, properties) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            res.json({ properties });
        }
    );
});

// Add to favorites
router.post('/:propertyId', authenticateToken, (req, res) => {
    const db = getDb();
    const { propertyId } = req.params;

    // Check if property exists
    db.get('SELECT id FROM properties WHERE id = ? AND status = ?', [propertyId, 'active'], (err, property) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        if (!property) {
            return res.status(404).json({ error: 'Property not found' });
        }

        db.run('INSERT OR IGNORE INTO favorites (user_id, property_id) VALUES (?, ?)',
            [req.user.id, propertyId],
            function(err) {
                if (err) {
                    return res.status(500).json({ error: 'Failed to add to favorites' });
                }
                if (this.changes === 0) {
                    return res.status(400).json({ error: 'Already in favorites' });
                }
                res.json({ message: 'Added to favorites' });
            }
        );
    });
});

// Remove from favorites
router.delete('/:propertyId', authenticateToken, (req, res) => {
    const db = getDb();
    db.run('DELETE FROM favorites WHERE user_id = ? AND property_id = ?',
        [req.user.id, req.params.propertyId],
        function(err) {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            if (this.changes === 0) {
                return res.status(404).json({ error: 'Favorite not found' });
            }
            res.json({ message: 'Removed from favorites' });
        }
    );
});

// Check if property is favorited
router.get('/check/:propertyId', authenticateToken, (req, res) => {
    const db = getDb();
    db.get('SELECT id FROM favorites WHERE user_id = ? AND property_id = ?',
        [req.user.id, req.params.propertyId],
        (err, favorite) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            res.json({ isFavorited: !!favorite });
        }
    );
});

module.exports = router;

