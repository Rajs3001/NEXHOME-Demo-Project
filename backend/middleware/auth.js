const jwt = require('jsonwebtoken');
const { getDb } = require('../database/db');

const JWT_SECRET = process.env.JWT_SECRET || 'nexhome_secret_key_change_in_production';

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
};

const requireSeller = (req, res, next) => {
    if (req.user.user_type !== 'seller') {
        return res.status(403).json({ error: 'Seller access required' });
    }
    next();
};

const requireBuyer = (req, res, next) => {
    if (req.user.user_type !== 'buyer') {
        return res.status(403).json({ error: 'Buyer access required' });
    }
    next();
};

module.exports = { authenticateToken, requireSeller, requireBuyer, JWT_SECRET };

