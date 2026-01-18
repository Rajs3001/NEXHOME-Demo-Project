const express = require('express');
const { getDb } = require('../database/db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Property Valuation Model (Simplified ML-based estimation)
function estimatePropertyValue(property) {
    // Base price per sqft by property type
    const basePricePerSqft = {
        'House': 200,
        'Condo': 250,
        'Apartment': 180,
        'Townhouse': 220
    };

    let basePrice = (property.area_sqft || 1000) * (basePricePerSqft[property.property_type] || 200);

    // Adjustments
    if (property.bedrooms) basePrice += property.bedrooms * 50000;
    if (property.bathrooms) basePrice += property.bathrooms * 30000;
    if (property.parking) basePrice += property.parking * 20000;
    
    // Year built adjustment (newer = higher value)
    if (property.year_built) {
        const age = new Date().getFullYear() - property.year_built;
        const ageAdjustment = Math.max(0, (30 - age) / 30) * 0.1; // Up to 10% bonus for newer homes
        basePrice *= (1 + ageAdjustment);
    }

    // Location multiplier (simplified - in production, use real location data)
    const locationMultipliers = {
        'Manhattan': 1.8,
        'Brooklyn': 1.3,
        'Queens': 1.0,
        'Bronx': 0.8
    };
    const locationMultiplier = locationMultipliers[property.city] || 1.0;
    basePrice *= locationMultiplier;

    return Math.round(basePrice);
}

// Loan Estimation Model
function estimateLoan(propertyPrice, downPaymentPercent = 20, interestRate = 6.5, loanTermYears = 30) {
    const downPayment = propertyPrice * (downPaymentPercent / 100);
    const loanAmount = propertyPrice - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const numPayments = loanTermYears * 12;

    // Monthly payment calculation (M = P * [r(1+r)^n] / [(1+r)^n - 1])
    const monthlyPayment = loanAmount * 
        (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
        (Math.pow(1 + monthlyRate, numPayments) - 1);

    const totalInterest = (monthlyPayment * numPayments) - loanAmount;
    const totalPayment = monthlyPayment * numPayments;

    return {
        propertyPrice,
        downPayment,
        downPaymentPercent,
        loanAmount,
        monthlyPayment: Math.round(monthlyPayment),
        totalInterest: Math.round(totalInterest),
        totalPayment: Math.round(totalPayment),
        interestRate,
        loanTermYears
    };
}

// Property Valuation endpoint
router.post('/property', authenticateToken, (req, res) => {
    try {
        const { property_id, area_sqft, bedrooms, bathrooms, property_type, city, year_built, parking } = req.body;

        let propertyData = {};

        if (property_id) {
            const db = getDb();
            db.get('SELECT * FROM properties WHERE id = ?', [property_id], (err, property) => {
                if (err) {
                    return res.status(500).json({ error: 'Database error' });
                }
                if (!property) {
                    return res.status(404).json({ error: 'Property not found' });
                }
                const estimatedValue = estimatePropertyValue(property);
                res.json({
                    property_id: property.id,
                    current_price: property.price,
                    estimated_value: estimatedValue,
                    difference: estimatedValue - property.price,
                    difference_percent: ((estimatedValue - property.price) / property.price * 100).toFixed(2),
                    confidence: 'High',
                    factors: {
                        location: property.city,
                        size: property.area_sqft,
                        bedrooms: property.bedrooms,
                        bathrooms: property.bathrooms,
                        property_type: property.property_type
                    }
                });
            });
        } else {
            propertyData = {
                area_sqft: parseInt(area_sqft) || 1000,
                bedrooms: parseInt(bedrooms) || 2,
                bathrooms: parseInt(bathrooms) || 2,
                property_type: property_type || 'House',
                city: city || 'Queens',
                year_built: parseInt(year_built) || 2000,
                parking: parseInt(parking) || 1
            };

            const estimatedValue = estimatePropertyValue(propertyData);
            res.json({
                estimated_value: estimatedValue,
                confidence: 'Medium',
                factors: propertyData
            });
        }
    } catch (error) {
        res.status(500).json({ error: 'Valuation error' });
    }
});

// Loan Estimation endpoint
router.post('/loan', authenticateToken, (req, res) => {
    try {
        const { property_price, down_payment_percent = 20, interest_rate = 6.5, loan_term_years = 30 } = req.body;

        if (!property_price || property_price <= 0) {
            return res.status(400).json({ error: 'Valid property price is required' });
        }

        const loanEstimate = estimateLoan(
            parseFloat(property_price),
            parseFloat(down_payment_percent),
            parseFloat(interest_rate),
            parseFloat(loan_term_years)
        );

        res.json({
            ...loanEstimate,
            affordability_tips: [
                `Monthly payment should not exceed 28% of your gross monthly income`,
                `Total debt payments (including mortgage) should not exceed 36% of gross income`,
                `Consider a larger down payment to reduce monthly payments`,
                `Shop around for the best interest rates`
            ]
        });
    } catch (error) {
        res.status(500).json({ error: 'Loan estimation error' });
    }
});

module.exports = router;

