const express = require('express');
const router = express.Router();
const PropertyController = require('../controllers/propertyController');
const { authenticateToken, requireSeller } = require('../middleware/auth');
const { upload } = require('../config/upload');

/**
 * Property Routes
 * All property-related endpoints
 */

// Public routes
router.get('/', PropertyController.getAll);
router.get('/:id', PropertyController.getById);

// Protected routes (seller only)
router.post('/', authenticateToken, requireSeller, upload.array('images', 10), PropertyController.create);
router.put('/:id', authenticateToken, requireSeller, upload.array('images', 10), PropertyController.update);
router.delete('/:id', authenticateToken, requireSeller, PropertyController.delete);
router.get('/seller/my-properties', authenticateToken, requireSeller, PropertyController.getMyProperties);

module.exports = router;

