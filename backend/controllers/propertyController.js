const Property = require('../models/Property');
const ImageService = require('../services/imageService');

/**
 * Property Controller
 * Handles HTTP requests for property operations
 */
class PropertyController {
    /**
     * Get all properties
     */
    static async getAll(req, res) {
        try {
            const filters = {
                status: req.query.status || 'active',
                listing_type: req.query.listing_type,
                city: req.query.city,
                min_price: req.query.min_price,
                max_price: req.query.max_price,
                bedrooms: req.query.bedrooms,
                property_type: req.query.property_type,
                limit: req.query.limit
            };

            const properties = await Property.findAll(filters);
            res.json({ properties });
        } catch (error) {
            console.error('Error fetching properties:', error);
            res.status(500).json({ error: 'Failed to fetch properties' });
        }
    }

    /**
     * Get single property
     */
    static async getById(req, res) {
        try {
            const property = await Property.findById(req.params.id);
            if (!property) {
                return res.status(404).json({ error: 'Property not found' });
            }
            res.json({ property });
        } catch (error) {
            console.error('Error fetching property:', error);
            res.status(500).json({ error: 'Failed to fetch property' });
        }
    }

    /**
     * Create new property
     */
    static async create(req, res) {
        try {
            const propertyData = {
                seller_id: req.user.id,
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

            // Handle uploaded images
            if (req.files && req.files.length > 0) {
                propertyData.images = req.files.map(file => file.filename);
            } else if (req.body.images) {
                // Handle image URLs if provided as string/array
                propertyData.images = Array.isArray(req.body.images) 
                    ? req.body.images 
                    : req.body.images.split(',').map(img => img.trim());
            }

            const propertyId = await Property.create(propertyData);
            res.status(201).json({
                message: 'Property created successfully',
                property_id: propertyId
            });
        } catch (error) {
            console.error('Error creating property:', error);
            res.status(500).json({ error: 'Failed to create property' });
        }
    }

    /**
     * Update property
     */
    static async update(req, res) {
        try {
            // Check ownership
            const property = await Property.findById(req.params.id);
            if (!property) {
                return res.status(404).json({ error: 'Property not found' });
            }
            if (property.seller_id !== req.user.id && req.user.user_type !== 'admin') {
                return res.status(403).json({ error: 'Not authorized to update this property' });
            }

            const updates = { ...req.body };

            // Handle uploaded images
            if (req.files && req.files.length > 0) {
                updates.images = req.files.map(file => file.filename);
            } else if (req.body.images) {
                updates.images = Array.isArray(req.body.images) 
                    ? req.body.images 
                    : req.body.images.split(',').map(img => img.trim());
            }

            const updated = await Property.update(req.params.id, updates);
            if (updated) {
                res.json({ message: 'Property updated successfully' });
            } else {
                res.status(400).json({ error: 'No valid fields to update' });
            }
        } catch (error) {
            console.error('Error updating property:', error);
            res.status(500).json({ error: 'Failed to update property' });
        }
    }

    /**
     * Delete property
     */
    static async delete(req, res) {
        try {
            const property = await Property.findById(req.params.id);
            if (!property) {
                return res.status(404).json({ error: 'Property not found' });
            }
            if (property.seller_id !== req.user.id && req.user.user_type !== 'admin') {
                return res.status(403).json({ error: 'Not authorized to delete this property' });
            }

            await Property.delete(req.params.id);
            res.json({ message: 'Property deleted successfully' });
        } catch (error) {
            console.error('Error deleting property:', error);
            res.status(500).json({ error: 'Failed to delete property' });
        }
    }

    /**
     * Get seller's properties
     */
    static async getMyProperties(req, res) {
        try {
            const properties = await Property.findBySeller(req.user.id);
            res.json({ properties });
        } catch (error) {
            console.error('Error fetching properties:', error);
            res.status(500).json({ error: 'Failed to fetch properties' });
        }
    }
}

module.exports = PropertyController;

