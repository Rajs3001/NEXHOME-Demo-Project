/**
 * Property Controller Tests
 * Run with: npm test
 */

const Property = require('../../backend/models/Property');
const PropertyController = require('../../backend/controllers/propertyController');

describe('Property Model', () => {
    test('should find all properties', async () => {
        const properties = await Property.findAll({ status: 'active' });
        expect(Array.isArray(properties)).toBe(true);
    });

    test('should find property by id', async () => {
        const property = await Property.findById(1);
        expect(property).toBeDefined();
    });

    test('should create property', async () => {
        const propertyData = {
            seller_id: 1,
            title: 'Test Property',
            property_type: 'House',
            listing_type: 'sale',
            price: 100000,
            address: '123 Test St',
            city: 'Test City',
            state: 'TS'
        };
        const id = await Property.create(propertyData);
        expect(id).toBeGreaterThan(0);
    });
});

describe('Property Controller', () => {
    test('should get all properties', async () => {
        const req = { query: {} };
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };
        await PropertyController.getAll(req, res);
        expect(res.json).toHaveBeenCalled();
    });
});

module.exports = {};

