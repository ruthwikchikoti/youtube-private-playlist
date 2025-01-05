const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { AppError } = require('../utils/errors');

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new AppError('No token provided', 401);
        }

        const token = authHeader.split(' ')[1];
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const user = await User.findById(decoded.id).select('-otp -otpExpires');
        if (!user) {
            throw new AppError('User not found', 401);
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid or expired token'
            });
        }
        
        return res.status(error.statusCode || 401).json({
            status: 'error',
            message: error.message
        });
    }
};

module.exports = authMiddleware;