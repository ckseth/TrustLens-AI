const fs = require('fs');
const Document = require('../models/Document');
const Analysis = require('../models/Analysis');

class DocumentService {
  /**
   * Delete document and its corresponding file and analysis
   */
  async deleteDocument(documentId, userId) {
    const document = await Document.findOne({ _id: documentId, userId });

    if (!document) {
      return null;
    }

    // Delete physical file from uploads folder if it exists
    if (fs.existsSync(document.filePath)) {
      try {
        await fs.promises.unlink(document.filePath);
      } catch (err) {
        console.error(`Failed to delete physical file ${document.filePath}:`, err.message);
      }
    }

    // Delete associated analysis records
    await Analysis.deleteMany({ documentId });

    // Delete document document from DB
    await Document.deleteOne({ _id: documentId });

    return true;
  }
}

module.exports = new DocumentService();
