const { ValidationError } = require('../utils/errors');

const validationMiddleware = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.context.key,
        message: detail.message
      }));
      
      return res.status(400).json({
        status: 'error',
        message: 'Validation Error',
        errors
      });
    }
    
    next();
  };
};

module.exports = validationMiddleware;