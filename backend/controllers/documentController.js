const path = require('path');
const fs = require('fs');
const Document = require('../models/Document');
const textExtractionService = require('../services/textExtractionService');
const documentService = require('../services/documentService');

/**
 * @desc    Upload document file or paste raw text
 * @route   POST /api/documents/upload
 * @access  Private
 */
const uploadDocument = async (req, res, next) => {
  try {
    let fileName, originalName, fileType, filePath, fileSize;

    // Case 1: Uploaded File via Multer
    if (req.file) {
      fileName = req.file.filename;
      originalName = req.file.originalname;
      fileType = path.extname(req.file.originalname).replace('.', '').toLowerCase();
      filePath = req.file.path;
      fileSize = req.file.size;
    }
    // Case 2: Pasted Text Payload
    else if (req.body.rawText) {
      originalName = req.body.title || `Pasted_Text_${Date.now()}.txt`;
      fileName = `text-${Date.now()}.txt`;
      fileType = 'txt';
      fileSize = Buffer.byteLength(req.body.rawText, 'utf8');
      
      // Save text file to uploads folder
      filePath = path.join(__dirname, '../uploads', fileName);
      await fs.promises.writeFile(filePath, req.body.rawText.trim());
    } else {
      return res.status(400).json({
        success: false,
        message: 'Please select a file to upload or paste raw text.'
      });
    }

    // Step 1: Create Document with initial status 'uploaded'
    const document = await Document.create({
      userId: req.user._id,
      fileName,
      originalName,
      fileType,
      filePath,
      fileSize,
      status: 'uploaded',
      extractedText: ''
    });

    // Step 2: Transition status to 'processing'
    document.status = 'processing';
    await document.save();

    // Step 3: Run Text Extraction Service
    try {
      if (req.body.rawText) {
        document.extractedText = req.body.rawText.trim();
      } else {
        document.extractedText = await textExtractionService.extractText(filePath, fileType);
      }
      document.status = 'completed';
      await document.save();
    } catch (extractErr) {
      console.error(`Extraction failed for document ${document._id}:`, extractErr.message);
      document.status = 'failed';
      await document.save();

      return res.status(500).json({
        success: false,
        message: `Text extraction failed: ${extractErr.message}`,
        document: {
          _id: document._id,
          originalName: document.originalName,
          status: document.status,
          extractedText: ''
        }
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Document uploaded and text extracted successfully',
      document: {
        _id: document._id,
        originalName: document.originalName,
        fileType: document.fileType,
        fileSize: document.fileSize,
        status: document.status,
        extractedText: document.extractedText,
        createdAt: document.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all documents for authenticated user
 * @route   GET /api/documents
 * @access  Private
 */
const getUserDocuments = async (req, res, next) => {
  try {
    const documents = await Document.find({ userId: req.user._id })
      .select('-extractedText')
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: documents.length,
      documents
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single document details by ID
 * @route   GET /api/documents/:id
 * @access  Private
 */
const getDocumentById = async (req, res, next) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found or access denied'
      });
    }

    return res.json({
      success: true,
      document
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete document by ID
 * @route   DELETE /api/documents/:id
 * @access  Private
 */
const deleteDocument = async (req, res, next) => {
  try {
    const result = await documentService.deleteDocument(req.params.id, req.user._id);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Document not found or unauthorized to delete'
      });
    }

    return res.json({
      success: true,
      message: 'Document and associated analysis deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadDocument,
  getUserDocuments,
  getDocumentById,
  deleteDocument
};
