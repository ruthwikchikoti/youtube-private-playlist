const jwt = require('jsonwebtoken');
const { AppError } = require('../utils/errors');
const PalcodeUser = require('../models/user.model');

exports.protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
            throw new AppError('No token provided', 401);
        }

        const token = authHeader.split(' ')[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await PalcodeUser.findById(decoded.id);
        if (!user) {
            throw new AppError('User not found', 401);
        }

        req.user = {
            id: user._id,
            email: user.email
        };

        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            next(new AppError('Invalid token', 401));
        } else {
            next(error);
        }
    }
};
