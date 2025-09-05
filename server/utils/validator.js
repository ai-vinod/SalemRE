const { body, validationResult } = require('express-validator');

/**
 * Process validation errors and return them in a standardized format
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Boolean|Object} - False if no errors, otherwise response with errors
 */
const processValidationErrors = (req, res) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return false;
  }

  return res.status(400).json({
    success: false,
    errors: errors.array().map(err => ({
      field: err.param,
      message: err.msg
    }))
  });
};

/**
 * Validation rules for user registration
 */
const registerValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
];

/**
 * Validation rules for user login
 */
const loginValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
];

/**
 * Validation rules for property creation/update
 */
const propertyValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 5, max: 100 })
    .withMessage('Title must be between 5 and 100 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 20 })
    .withMessage('Description must be at least 20 characters'),
  body('type')
    .trim()
    .notEmpty()
    .withMessage('Property type is required'),
  body('status')
    .trim()
    .notEmpty()
    .withMessage('Property status is required'),
  body('location')
    .trim()
    .notEmpty()
    .withMessage('Location is required'),
  body('price')
    .notEmpty()
    .withMessage('Price is required')
    .isNumeric()
    .withMessage('Price must be a number')
];

/**
 * Validation rules for blog post creation/update
 */
const blogPostValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be between 5 and 200 characters'),
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Content is required')
    .isLength({ min: 50 })
    .withMessage('Content must be at least 50 characters'),
  body('status')
    .trim()
    .notEmpty()
    .withMessage('Status is required')
];

/**
 * Validation rules for inquiry creation
 */
const inquiryValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address'),
  body('message')
    .trim()
    .notEmpty()
    .withMessage('Message is required')
    .isLength({ min: 10 })
    .withMessage('Message must be at least 10 characters')
];

module.exports = {
  processValidationErrors,
  registerValidation,
  loginValidation,
  propertyValidation,
  blogPostValidation,
  inquiryValidation
};