const Joi = require('joi');

// User validation schemas
const userSchemas = {
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
  
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    .required()
    .messages({
      'string.min': 'Password must be at least 8 characters long',
      'string.pattern.base': 'Password must include uppercase, lowercase, number and special character',
      'any.required': 'Password is required'
    })
};

// Auth validation schemas
const authSchemas = {
  sendOTP: Joi.object({
    email: userSchemas.email
  }),

  verifyOTP: Joi.object({
    email: userSchemas.email,
    otp: Joi.string()
      .length(6)
      .pattern(/^[0-9]+$/)
      .required()
      .messages({
        'string.length': 'OTP must be 6 digits',
        'string.pattern.base': 'OTP must contain only numbers',
        'any.required': 'OTP is required'
      })
  })
};

// Layout validation schemas
const layoutSchemas = {
  saveLayout: Joi.object({
    layout: Joi.array()
      .items(Joi.string().required())
      .min(1)
      .required()
      .messages({
        'array.base': 'Layout must be an array',
        'array.min': 'Layout must contain at least one item',
        'any.required': 'Layout is required'
      })
  })
};

// YouTube validation schemas
const youtubeSchemas = {
  playlistId: Joi.string()
    .required()
    .messages({
      'any.required': 'Playlist ID is required'
    })
};

const validateSchema = (schema, data) => {
  return schema.validate(data, {
    abortEarly: false,
    stripUnknown: true
  });
};

module.exports = {
  authSchemas,
  layoutSchemas,
  youtubeSchemas,
  validateSchema
};