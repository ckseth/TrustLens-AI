const Document = require('../models/Document');
const informationScanner = require('../services/informationScanner');
const textExtractionService = require('../services/textExtractionService');

/**
 * @desc    Scan document for sensitive information before AI processing (Privacy Shield)
 * @route   POST /api/privacy/scan/:documentId
 * @access  Private
 */
const scanPrivacyShield = async (req, res, next) => {
  try {
    const document = await Document.findOne({
      _id: req.params.documentId,
      userId: req.user._id
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found or unauthorized'
      });
    }

    let text = document.extractedText;
    if (!text || text.trim() === '') {
      text = await textExtractionService.extractText(document.filePath, document.fileType);
      document.extractedText = text;
      await document.save();
    }

    // Run Privacy Scanner without modifying DB document
    const privacyReport = informationScanner.scanPrivacy(text);

    return res.status(200).json({
      success: true,
      documentId: document._id,
      documentName: document.originalName,
      detected: privacyReport.detected,
      count: privacyReport.count,
      items: privacyReport.items
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  scanPrivacyShield
};
