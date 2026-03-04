const express = require('express');
const { body } = require('express-validator');
const multer = require('multer');
const path = require('path');
const { createExpense, getExpenses, deleteExpense } = require('../controllers/expenseController');
const { protect } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validationMiddleware');

const router = express.Router();

// Setup multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../public/uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

router.use(protect);

router.post(
  '/',
  upload.single('image'),
  [
    body('amount').isFloat({ gt: 0 }),
    body('category').isIn(['Food', 'Travel', 'Study', 'Entertainment']),
    body('date').isISO8601(),
  ],
  validate,
  createExpense,
);
router.get('/', getExpenses);
router.delete('/:id', deleteExpense);

module.exports = router;
