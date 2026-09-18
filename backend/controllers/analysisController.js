const path = require('path');
const Document = require('../models/Document');
const Analysis = require('../models/Analysis');
const AIChatHistory = require('../models/AIChatHistory');
const informationScanner = require('../services/informationScanner');
const aiService = require('../services/aiService');
const textExtractionService = require('../services/textExtractionService');
const mlSpamDetector = require('../services/mlSpamDetector');

/**
 * Helper to check if Privacy Masking before AI analysis is requested
 */
const getProcessedText = (text, req) => {
  const shouldMask = req.body?.maskPrivacy === true ||
                     req.query?.maskPrivacy === 'true' ||
                     req.body?.maskSensitive === true;
  return shouldMask ? informationScanner.maskText(text) : text;
};

/**
 * @desc    Ask questions about an uploaded document (Phase 8 & Privacy Shield)
 * @route   POST /api/analysis/ask/:documentId
 * @access  Private
 */
const askQuestionController = async (req, res, next) => {
  try {
    const { question } = req.body;

    if (!question || typeof question !== 'string' || question.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid question'
      });
    }

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

    // Apply Privacy Shield masking if requested (original document text in DB remains untouched)
    const targetText = getProcessedText(text, req);

    const answer = await aiService.askDocumentQuestion(targetText, question);

    await AIChatHistory.create({
      userId: req.user._id,
      documentId: document._id,
      question: question.trim(),
      answer
    });

    return res.status(200).json({
      answer
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Summarize document text using AI Service (Gemini API & Privacy Shield)
 * @route   POST /api/analysis/summarize/:documentId
 * @access  Private
 */
const summarizeDocumentController = async (req, res, next) => {
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

    const targetText = getProcessedText(text, req);

    const summaryResult = await aiService.summarizeDocument(targetText);

    let analysis = await Analysis.findOne({ documentId: document._id });
    if (analysis) {
      analysis.summary = summaryResult.summary;
      analysis.importantPoints = summaryResult.keyPoints;
      await analysis.save();
    } else {
      analysis = await Analysis.create({
        documentId: document._id,
        userId: req.user._id,
        summary: summaryResult.summary,
        importantPoints: summaryResult.keyPoints
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Document summarized successfully',
      documentId: document._id,
      documentName: document.originalName,
      summaryResult
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Perform Risk Analysis on document text (Phase 7 & Privacy Shield)
 * @route   POST /api/analysis/risk/:documentId
 * @access  Private
 */
const analyzeRiskController = async (req, res, next) => {
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

    const targetText = getProcessedText(text, req);

    const riskResult = await aiService.analyzeRisk(targetText);

    let analysis = await Analysis.findOne({ documentId: document._id });

    if (analysis) {
      analysis.riskScore = riskResult.riskScore;
      analysis.riskLevel = riskResult.riskLevel;
      analysis.suspiciousPoints = riskResult.suspiciousPoints;
      analysis.explanation = riskResult.explanation;
      analysis.recommendation = riskResult.recommendation;
      await analysis.save();
    } else {
      analysis = await Analysis.create({
        documentId: document._id,
        userId: req.user._id,
        riskScore: riskResult.riskScore,
        riskLevel: riskResult.riskLevel,
        suspiciousPoints: riskResult.suspiciousPoints,
        explanation: riskResult.explanation,
        recommendation: riskResult.recommendation
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Risk analysis completed successfully',
      documentId: document._id,
      documentName: document.originalName,
      riskAnalysis: {
        riskScore: riskResult.riskScore,
        riskLevel: riskResult.riskLevel,
        suspiciousPoints: riskResult.suspiciousPoints,
        explanation: riskResult.explanation,
        recommendation: riskResult.recommendation
      },
      analysis
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Scan document for individual factual claims (Phase 7 & Privacy Shield)
 * @route   POST /api/analysis/claims/:documentId
 * @access  Private
 */
const scanClaimsController = async (req, res, next) => {
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

    const targetText = getProcessedText(text, req);

    const claimResult = await aiService.scanClaims(targetText);

    let analysis = await Analysis.findOne({ documentId: document._id });

    if (analysis) {
      analysis.claims = claimResult.claims;
      await analysis.save();
    } else {
      analysis = await Analysis.create({
        documentId: document._id,
        userId: req.user._id,
        claims: claimResult.claims
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Claim scanning completed successfully',
      documentId: document._id,
      documentName: document.originalName,
      claims: claimResult.claims,
      analysis
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Analyze document text using pattern scanner & AI Service
 * @route   POST /api/analysis/:documentId
 * @access  Private
 */
const analyzeDocument = async (req, res, next) => {
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

    const targetText = getProcessedText(text, req);

    const scannedEntities = informationScanner.scan(text); // Scan raw entities
    const aiResult = await aiService.analyzeDocument(targetText, scannedEntities);

    let analysis = await Analysis.findOne({ documentId: document._id });

    const analysisPayload = {
      documentId: document._id,
      userId: req.user._id,
      summary: aiResult.summary,
      riskScore: aiResult.riskScore,
      riskLevel: aiResult.riskLevel,
      detectedInformation: scannedEntities,
      suspiciousPoints: aiResult.suspiciousPoints,
      explanation: aiResult.explanation || [],
      claims: aiResult.claims || [],
      importantPoints: aiResult.importantPoints,
      recommendation: aiResult.recommendation
    };

    if (analysis) {
      analysis = await Analysis.findByIdAndUpdate(analysis._id, analysisPayload, { new: true });
    } else {
      analysis = await Analysis.create(analysisPayload);
    }

    return res.status(200).json({
      success: true,
      message: 'Document analysis generated successfully',
      analysis
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get analysis result for a document
 * @route   GET /api/analysis/:documentId
 * @access  Private
 */
const getAnalysisByDocumentId = async (req, res, next) => {
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

    const analysis = await Analysis.findOne({ documentId: document._id });

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: 'No analysis found for this document. Run analysis first.'
      });
    }

    return res.json({
      success: true,
      analysis
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Run pattern-based Smart Information Scanner (No AI call)
 * @route   POST /api/analysis/scan/:documentId
 * @access  Private
 */
const scanDocumentInformation = async (req, res, next) => {
  try {
    const document = await Document.findOne({
      _id: req.params.documentId,
      userId: req.user._id
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found or access denied'
      });
    }

    let text = document.extractedText;
    if (!text || text.trim() === '') {
      text = await textExtractionService.extractText(document.filePath, document.fileType);
      document.extractedText = text;
      await document.save();
    }

    const detectedInformation = informationScanner.scan(text);
    const maskedInformation = informationScanner.maskEntities(detectedInformation);
    const maskedText = informationScanner.maskText(text);

    return res.status(200).json({
      success: true,
      message: 'Information scan completed successfully',
      documentId: document._id,
      documentName: document.originalName,
      detectedInformation,
      maskedInformation,
      maskedText
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Direct Live AI Text Analysis & Fake Detection (No pre-saved document required)
 * @route   POST /api/analysis/direct
 * @access  Public
 */
const analyzeDirectText = async (req, res, next) => {
  try {
    const { text, maskPrivacy } = req.body;

    if (!text || typeof text !== 'string' || text.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Please provide valid text for document analysis'
      });
    }

    const cleanText = text.trim();
    const targetText = maskPrivacy ? informationScanner.maskText(cleanText) : cleanText;

    const scannedEntities = informationScanner.scan(cleanText);
    const privacyReport = informationScanner.scanPrivacy(cleanText);
    const mlSpamReport = mlSpamDetector.classify(cleanText);
    const summaryRes = await aiService.summarizeDocument(targetText);
    const riskRes = await aiService.analyzeRisk(targetText);
    const claimRes = await aiService.scanClaims(targetText);

    return res.status(200).json({
      success: true,
      message: 'Direct AI text analysis completed successfully',
      rawText: cleanText,
      maskedText: informationScanner.maskText(cleanText),
      privacy: privacyReport,
      entities: scannedEntities,
      mlSpam: mlSpamReport,
      summary: summaryRes,
      risk: riskRes,
      claims: claimRes.claims || []
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Direct Upload & Analyze File (PDF, TXT, Image, DOC)
 * @route   POST /api/analysis/upload-direct
 * @access  Public
 */
const uploadDirectFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please select a file to upload for live analysis'
      });
    }

    const filePath = req.file.path;
    const fileType = path.extname(req.file.originalname).replace('.', '').toLowerCase();

    // Extract text from uploaded PDF/Image/TXT
    const extractedText = await textExtractionService.extractText(filePath, fileType);
    const cleanText = (extractedText && extractedText.trim()) ? extractedText.trim() : `[Extracted Document File: ${req.file.originalname}]`;

    const scannedEntities = informationScanner.scan(cleanText);
    const privacyReport = informationScanner.scanPrivacy(cleanText);
    const mlSpamReport = mlSpamDetector.classify(cleanText);
    const summaryRes = await aiService.summarizeDocument(cleanText);
    const riskRes = await aiService.analyzeRisk(cleanText);
    const claimRes = await aiService.scanClaims(cleanText);

    return res.status(200).json({
      success: true,
      message: 'File upload and live AI analysis completed successfully',
      fileName: req.file.originalname,
      fileSize: req.file.size,
      rawText: cleanText,
      maskedText: informationScanner.maskText(cleanText),
      privacy: privacyReport,
      entities: scannedEntities,
      mlSpam: mlSpamReport,
      summary: summaryRes,
      risk: riskRes,
      claims: claimRes.claims || []
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  askQuestionController,
  summarizeDocumentController,
  analyzeRiskController,
  scanClaimsController,
  analyzeDocument,
  getAnalysisByDocumentId,
  scanDocumentInformation,
  analyzeDirectText,
  uploadDirectFile
};
