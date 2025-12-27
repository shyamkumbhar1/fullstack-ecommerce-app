const AppError = require('../utils/AppError');
const fs = require('fs');
const path = require('path');

// Helper function to write debug logs
const writeDebugLog = (logData) => {
  const logPath = path.join(__dirname, '../../.cursor/debug.log');
  const logLine = JSON.stringify(logData) + '\n';
  try {
    fs.appendFileSync(logPath, logLine, 'utf8');
  } catch (err) {
    // Silently fail if file can't be written
  }
  if (typeof fetch !== 'undefined') {
    fetch('http://127.0.0.1:7242/ingest/7773c587-bb6e-4643-a407-7c91a4020279',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(logData)}).catch(()=>{});
  }
};

const errorHandler = (err, req, res, next) => {
  // #region agent log
  writeDebugLog({location:'errorHandler.js:4',message:'Error handler entry',data:{errorName:err.name,errorMessage:err.message?.substring(0,100),errorCode:err.code,path:req.path,method:req.method},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'});
  // #endregion
  let error = { ...err };
  error.message = err.message;

  // Filter out SSL/TLS errors from being exposed to frontend
  if (err.message && (
    err.message.includes('SSL') || 
    err.message.includes('TLS') || 
    err.message.includes('ssl3_read_bytes') ||
    err.message.includes('tlsv1 alert') ||
    err.message.includes('ECONNREFUSED') ||
    err.code === 'ECONNREFUSED'
  )) {
    // #region agent log
    writeDebugLog({location:'errorHandler.js:16',message:'SSL error detected and filtered',data:{errorName:err.name,errorMessage:err.message,errorCode:err.code,path:req.path,stack:err.stack?.substring(0,300)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'});
    // #endregion
    // Log the actual error for debugging
    console.error('❌ [ERROR] SSL/Connection Error (filtered from client):', {
      name: err.name,
      message: err.message,
      code: err.code,
      path: req.path
    });
    // Return a user-friendly error message
    error.message = 'Connection error. Please check your network connection and try again.';
    error.statusCode = 503; // Service Unavailable
  } else {
    // #region agent log
    writeDebugLog({location:'errorHandler.js:28',message:'Non-SSL error',data:{errorName:err.name,errorMessage:err.message?.substring(0,100)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'});
    // #endregion
    // Log error for debugging
    console.error('Error Details:', {
      name: err.name,
      message: err.message,
      stack: err.stack,
      code: err.code
    });
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = new AppError(message, 404);
  }

  // Mongoose duplicate key (email already exists)
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || 'field';
    const message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
    error = new AppError(message, 400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = new AppError(message, 400);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    error = new AppError(message, 401);
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    error = new AppError(message, 401);
  }

  // AppError (operational errors - custom messages)
  if (err.isOperational) {
    error.statusCode = err.statusCode;
    error.message = err.message;
  } else {
    // Unexpected errors (database, network, etc.)
    // Don't leak error details in production
    error.statusCode = error.statusCode || 500;
    error.message = process.env.NODE_ENV === 'production' 
      ? 'Something went wrong!' 
      : err.message;
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { 
      stack: err.stack,
      error: err 
    })
  });
};

module.exports = errorHandler;

