const express = require('express');
const OpenAI = require('openai');
const { getDb } = require('../database/db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Initialize OpenAI (use environment variable or fallback)
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || 'sk-placeholder-key'
});

// AI Assistant endpoint
router.post('/chat', authenticateToken, async (req, res) => {
    try {
        const { message, property_id } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        let context = 'You are a helpful real estate assistant for NexHome, a direct buyer-seller marketplace (no brokers). ';
        
        if (property_id) {
            const db = getDb();
            db.get('SELECT * FROM properties WHERE id = ?', [property_id], (err, property) => {
                if (!err && property) {
                    context += `The user is asking about property: ${property.title} at ${property.address}, ${property.city}, ${property.state}. `;
                    context += `Details: ${property.bedrooms} beds, ${property.bathrooms} baths, ${property.area_sqft} sqft, Price: $${property.price.toLocaleString()}. `;
                    context += `Description: ${property.description || 'No description available'}. `;
                }
                sendAIResponse(context, message, res);
            });
        } else {
            sendAIResponse(context, message, res);
        }
    } catch (error) {
        console.error('AI Error:', error);
        res.status(500).json({ error: 'AI service unavailable' });
    }
});

async function sendAIResponse(context, message, res) {
    try {
        // If OpenAI key is not set, return a mock response
        if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'sk-placeholder-key') {
            return res.json({
                response: getMockAIResponse(message),
                source: 'mock'
            });
        }

        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: context + 'Provide helpful, accurate information about properties, buying, selling, and renting. Be concise and friendly.' },
                { role: 'user', content: message }
            ],
            max_tokens: 300,
            temperature: 0.7
        });

        res.json({
            response: completion.choices[0].message.content,
            source: 'openai'
        });
    } catch (error) {
        console.error('OpenAI API Error:', error);
        res.json({
            response: getMockAIResponse(message),
            source: 'fallback'
        });
    }
}

function getMockAIResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
        return 'Property prices vary based on location, size, and condition. Use our property valuation tool for accurate estimates.';
    } else if (lowerMessage.includes('loan') || lowerMessage.includes('mortgage')) {
        return 'Our loan estimation tool can help you calculate monthly payments. Generally, aim for a down payment of 20% and consider your credit score.';
    } else if (lowerMessage.includes('buy') || lowerMessage.includes('purchase')) {
        return 'To buy a property, create a buyer account, search for properties, and contact sellers directly through our platform. No brokers needed!';
    } else if (lowerMessage.includes('sell') || lowerMessage.includes('list')) {
        return 'To sell your property, create a seller account, list your property with photos and details, and connect directly with interested buyers.';
    } else if (lowerMessage.includes('rent')) {
        return 'Browse rental properties, filter by your preferences, and contact landlords directly. All rentals are verified and broker-free.';
    } else {
        return 'I can help you with property searches, pricing information, loan estimates, and general real estate questions. What would you like to know?';
    }
}

module.exports = router;

