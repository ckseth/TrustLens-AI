const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { protect } = require('../middleware/authMiddleware');
const {
  uploadDocument,
  getUserDocuments,
  getDocumentById,
  deleteDocument
} = require('../controllers/documentController');

router.post('/upload', protect, upload.single('file'), uploadDocument);
router.get('/', protect, getUserDocuments);
router.get('/:id', protect, getDocumentById);
router.delete('/:id', protect, deleteDocument);

module.exports = router;
