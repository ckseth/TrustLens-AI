const Document = require('../models/Document');
const Comparison = require('../models/Comparison');
const comparisonService = require('../services/comparisonService');
const textExtractionService = require('../services/textExtractionService');

/**
 * @desc    Compare two documents side-by-side (Phase 9)
 * @route   POST /api/comparison
 * @access  Private
 */
const compareDocuments = async (req, res, next) => {
  try {
    const docAId = req.body.documentA || req.body.documentAId;
    const docBId = req.body.documentB || req.body.documentBId;

    if (!docAId || !docBId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both documentA and documentB IDs'
      });
    }

    // Security check: Verify BOTH documents belong to the logged-in user
    const docA = await Document.findOne({ _id: docAId, userId: req.user._id });
    const docB = await Document.findOne({ _id: docBId, userId: req.user._id });

    if (!docA || !docB) {
      return res.status(404).json({
        success: false,
        message: 'One or both documents not found or unauthorized'
      });
    }

    // Ensure extracted text is available for Document A
    if (!docA.extractedText || docA.extractedText.trim() === '') {
      docA.extractedText = await textExtractionService.extractText(docA.filePath, docA.fileType);
      await docA.save();
    }

    // Ensure extracted text is available for Document B
    if (!docB.extractedText || docB.extractedText.trim() === '') {
      docB.extractedText = await textExtractionService.extractText(docB.filePath, docB.fileType);
      await docB.save();
    }

    // Run rule-based comparison service
    const diffResult = comparisonService.compareDocuments(docA.extractedText, docB.extractedText);

    // Save comparison record in MongoDB
    const comparison = await Comparison.create({
      userId: req.user._id,
      documentA: docA._id,
      documentB: docB._id,
      changes: diffResult.changes,
      summary: diffResult.summary
    });

    return res.status(200).json({
      success: true,
      message: 'Document comparison completed successfully',
      changes: diffResult.changes,
      summary: diffResult.summary,
      comparison
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get comparison result by ID
 * @route   GET /api/comparison/:id
 * @access  Private
 */
const getComparisonById = async (req, res, next) => {
  try {
    const comparison = await Comparison.findOne({
      _id: req.params.id,
      userId: req.user._id
    })
      .populate('documentA', 'originalName fileType createdAt')
      .populate('documentB', 'originalName fileType createdAt');

    if (!comparison) {
      return res.status(404).json({
        success: false,
        message: 'Comparison record not found or unauthorized'
      });
    }

    return res.json({
      success: true,
      comparison
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Direct side-by-side comparison of two raw texts
 * @route   POST /api/comparison/direct
 * @access  Public
 */
const compareDirectTexts = async (req, res, next) => {
  try {
    const { textA, textB } = req.body;

    if (!textA || !textB) {
      return res.status(400).json({
        success: false,
        message: 'Please provide textA and textB for comparison'
      });
    }

    const diffResult = comparisonService.compareDocuments(textA.trim(), textB.trim());

    return res.status(200).json({
      success: true,
      message: 'Direct document comparison completed successfully',
      changes: diffResult.changes,
      summary: diffResult.summary
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  compareDocuments,
  getComparisonById,
  compareDirectTexts
};
