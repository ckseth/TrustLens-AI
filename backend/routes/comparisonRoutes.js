const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  compareDocuments,
  getComparisonById,
  compareDirectTexts
} = require('../controllers/comparisonController');

router.post('/direct', compareDirectTexts);
router.post('/', protect, compareDocuments);
router.get('/:id', protect, getComparisonById);

module.exports = router;
