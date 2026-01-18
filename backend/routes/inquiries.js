const express = require('express');
const { getDb } = require('../database/db');
const { authenticateToken, requireBuyer } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Create inquiry (buyer contacts seller)
router.post('/', authenticateToken, requireBuyer, [
    body('property_id').isInt(),
    body('message').trim().notEmpty()
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const db = getDb();
    const { property_id, message } = req.body;

    // Get property and seller info
    db.get('SELECT seller_id FROM properties WHERE id = ? AND status = ?', 
        [property_id, 'active'], 
        (err, property) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            if (!property) {
                return res.status(404).json({ error: 'Property not found' });
            }

            db.run(`INSERT INTO inquiries (property_id, buyer_id, seller_id, message)
                    VALUES (?, ?, ?, ?)`,
                [property_id, req.user.id, property.seller_id, message],
                function(err) {
                    if (err) {
                        return res.status(500).json({ error: 'Failed to send inquiry' });
                    }
                    res.status(201).json({
                        message: 'Inquiry sent successfully',
                        inquiry_id: this.lastID
                    });
                }
            );
        }
    );
});

// Get inquiries for seller
router.get('/seller', authenticateToken, (req, res) => {
    const db = getDb();
    db.all(`SELECT i.*, p.title as property_title, p.address, u.name as buyer_name, u.email as buyer_email, u.phone as buyer_phone
            FROM inquiries i
            JOIN properties p ON i.property_id = p.id
            JOIN users u ON i.buyer_id = u.id
            WHERE i.seller_id = ?
            ORDER BY i.created_at DESC`,
        [req.user.id],
        (err, inquiries) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            res.json({ inquiries });
        }
    );
});

// Get buyer's inquiries
router.get('/buyer', authenticateToken, (req, res) => {
    const db = getDb();
    db.all(`SELECT i.*, p.title as property_title, p.address, p.price, u.name as seller_name
            FROM inquiries i
            JOIN properties p ON i.property_id = p.id
            JOIN users u ON i.seller_id = u.id
            WHERE i.buyer_id = ?
            ORDER BY i.created_at DESC`,
        [req.user.id],
        (err, inquiries) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            res.json({ inquiries });
        }
    );
});

module.exports = router;

