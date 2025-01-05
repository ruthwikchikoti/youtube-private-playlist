const { AppError } = require('../utils/errors');
const PalcodeUser = require('../models/user.model');
const emailService = require('../utils/email');
const jwt = require('jsonwebtoken');

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const authController = {
    async sendOTP(req, res, next) {
        try {
            const { email } = req.body;
            if (!email) {
                throw new AppError('Email is required', 400);
            }

            const otp = generateOTP();
            const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

            let user = await PalcodeUser.findOne({ email });
            if (!user) {
                user = new PalcodeUser({ email });
            }

            user.auth = { otp, otpExpires };
            await user.save();

            if (process.env.NODE_ENV === 'development') {
                console.log('Development OTP:', otp);
            } else {
                await emailService.sendOTP(email, otp);
            }

            res.status(200).json({
                status: 'success',
                message: 'OTP sent successfully',
                data: {
                    email,
                    expiresIn: '10 minutes'
                },
                ...(process.env.NODE_ENV === 'development' && { debug: { otp } })
            });
        } catch (error) {
            next(error);
        }
    },

    async verifyOTP(req, res, next) {
        try {
            const { email, otp } = req.body;
            
            if (!email || !otp) {
                throw new AppError('Email and OTP are required', 400);
            }

            const user = await PalcodeUser.findOne({ 
                email,
                'auth.otp': otp,
                'auth.otpExpires': { $gt: new Date() }
            });

            if (!user) {
                throw new AppError('Invalid or expired OTP', 401);
            }

            user.auth = {
                otp: null,
                otpExpires: null
            };
            await user.save();

            const token = jwt.sign(
                { id: user._id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            );

            res.json({
                status: 'success',
                data: {
                    token,
                    user: {
                        id: user._id,
                        email: user.email
                    }
                }
            });
        } catch (error) {
            next(error);
        }
    },

    async verifyToken(req, res, next) {
        try {
            const user = await PalcodeUser.findById(req.user.id)
                .select('-auth -youtube.credentials'); 

            if (!user) {
                throw new AppError('User not found', 404);
            }

            res.json({
                status: 'success',
                user: {
                    id: user._id,
                    email: user.email,
                    youtube: {
                        connected: Boolean(user.youtube?.connected),
                        lastConnected: user.youtube?.lastConnected || null
                    }
                }
            });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = authController;