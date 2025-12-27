const { validationResult } = require('express-validator');
const authService = require('../services/authService');
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

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const user = await authService.registerUser(req.body);

    res.status(201).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  // #region agent log
  writeDebugLog({location:'authController.js:32',message:'Login controller entry',data:{email:req.body.email,hasPassword:!!req.body.password},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'});
  // #endregion
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // #region agent log
      writeDebugLog({location:'authController.js:36',message:'Validation errors',data:{errors:errors.array()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'});
      // #endregion
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { email, password } = req.body;
    // #region agent log
    writeDebugLog({location:'authController.js:45',message:'Before authService.loginUser',data:{email},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'});
    // #endregion

    const user = await authService.loginUser(email, password);
    // #region agent log
    writeDebugLog({location:'authController.js:47',message:'After authService.loginUser success',data:{userId:user._id?.toString(),email:user.email},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'});
    // #endregion

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    // #region agent log
    writeDebugLog({location:'authController.js:52',message:'Login controller catch',data:{errorName:error.name,errorMessage:error.message?.substring(0,200),errorCode:error.code,isSSL:error.message?.includes('SSL')||error.message?.includes('TLS'),stack:error.stack?.substring(0,300)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'});
    // #endregion
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await authService.getUserById(req.user._id);

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

