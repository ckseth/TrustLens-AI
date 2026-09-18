const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { protect } = require('../middleware/authMiddleware');
const {
  askQuestionController,
  summarizeDocumentController,
  analyzeRiskController,
  scanClaimsController,
  analyzeDocument,
  getAnalysisByDocumentId,
  scanDocumentInformation,
  analyzeDirectText,
  uploadDirectFile
} = require('../controllers/analysisController');

// Direct live AI text & file upload analysis
router.post('/direct', analyzeDirectText);
router.post('/upload-direct', upload.single('file'), uploadDirectFile);

// Phase 8 Route: Ask Your Document
router.post('/ask/:documentId', protect, askQuestionController);

// Phase 6 Route: Document Summarization
router.post('/summarize/:documentId', protect, summarizeDocumentController);

// Phase 7 Routes: Risk Analysis & Claim Scanner
router.post('/risk/:documentId', protect, analyzeRiskController);
router.post('/claims/:documentId', protect, scanClaimsController);

// Phase 5 & standard analysis routes
router.post('/scan/:documentId', protect, scanDocumentInformation);
router.post('/:documentId', protect, analyzeDocument);
router.get('/:documentId', protect, getAnalysisByDocumentId);

module.exports = router;
