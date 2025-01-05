// src/utils/errors.js
class AppError extends Error {
    constructor(message, statusCode = 400, data = null) {
        super(message);
        this.statusCode = statusCode;
        this.status = statusCode >= 400 && statusCode < 500 ? 'error' : 'fail';
        this.data = data;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = { AppError };