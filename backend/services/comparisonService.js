const informationScanner = require('./informationScanner');

/**
 * Comparison Service Module
 * Handles text diff, entity comparison, added/removed clause detection without calling external AI.
 */
class ComparisonService {
  /**
   * Compare two document texts and extract structured differences.
   * @param {string} textA - Text of Document A (Version 1)
   * @param {string} textB - Text of Document B (Version 2)
   * @returns {Object} { changes: [...], summary: "..." }
   */
  compareDocuments(textA = '', textB = '') {
    const changes = [];

    // 1. Scan entities (amounts, dates, emails, phones, urls) using Information Scanner
    const entitiesA = informationScanner.scan(textA);
    const entitiesB = informationScanner.scan(textB);

    // Compare Monetary Amounts
    this.compareLists(entitiesA.amounts, entitiesB.amounts, 'amount', changes);

    // Compare Dates
    this.compareLists(entitiesA.dates, entitiesB.dates, 'date', changes);

    // Compare Contact Details (Emails, Phones, URLs)
    this.compareLists(entitiesA.emails, entitiesB.emails, 'email', changes);
    this.compareLists(entitiesA.phones, entitiesB.phones, 'phone', changes);
    this.compareLists(entitiesA.urls, entitiesB.urls, 'url', changes);

    // 2. Sentence & Clause Level Diff for Added/Removed Text & Clause changes
    const sentencesA = this.getSentences(textA);
    const sentencesB = this.getSentences(textB);

    const setA = new Set(sentencesA);
    const setB = new Set(sentencesB);

    const removedSentences = sentencesA.filter(s => !setB.has(s));
    const addedSentences = sentencesB.filter(s => !setA.has(s));

    // Match modified clauses (sentences with partial overlap)
    const pairedClauseChanges = [];
    const unmatchedRemoved = [];
    const unmatchedAdded = new Set(addedSentences);

    removedSentences.forEach(sA => {
      let bestMatch = null;
      let highestSimilarity = 0;

      for (const sB of unmatchedAdded) {
        const similarity = this.calculateSimilarity(sA, sB);
        if (similarity > 0.35 && similarity > highestSimilarity) {
          highestSimilarity = similarity;
          bestMatch = sB;
        }
      }

      if (bestMatch) {
        pairedClauseChanges.push({ sA, sB: bestMatch });
        unmatchedAdded.delete(bestMatch);
      } else {
        unmatchedRemoved.push(sA);
      }
    });

    // Record paired clause modifications
    pairedClauseChanges.forEach(({ sA, sB }) => {
      changes.push({
        type: 'changed',
        field: 'clause',
        oldValue: sA,
        newValue: sB,
        explanation: 'Clause wording or terms modified between document versions.'
      });
    });

    // Record purely removed text
    unmatchedRemoved.slice(0, 5).forEach(s => {
      changes.push({
        type: 'removed',
        field: 'text',
        oldValue: s,
        newValue: '',
        explanation: 'Text/clause removed in Version B.'
      });
    });

    // Record purely added text
    Array.from(unmatchedAdded).slice(0, 5).forEach(s => {
      changes.push({
        type: 'added',
        field: 'text',
        oldValue: '',
        newValue: s,
        explanation: 'New text/clause added in Version B.'
      });
    });

    // Generate readable summary
    const summary = this.generateSummary(changes);

    return {
      changes,
      summary
    };
  }

  /**
   * Helper to compare entity lists (amounts, dates, contact details)
   */
  compareLists(listA = [], listB = [], fieldName, changes) {
    const setA = new Set(listA);
    const setB = new Set(listB);

    const removed = listA.filter(item => !setB.has(item));
    const added = listB.filter(item => !setA.has(item));

    const maxPairs = Math.min(removed.length, added.length);

    for (let i = 0; i < maxPairs; i++) {
      changes.push({
        type: 'changed',
        field: fieldName,
        oldValue: removed[i],
        newValue: added[i],
        explanation: `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} modified from "${removed[i]}" to "${added[i]}".`
      });
    }

    for (let i = maxPairs; i < removed.length; i++) {
      changes.push({
        type: 'removed',
        field: fieldName,
        oldValue: removed[i],
        newValue: '',
        explanation: `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} "${removed[i]}" removed.`
      });
    }

    for (let i = maxPairs; i < added.length; i++) {
      changes.push({
        type: 'added',
        field: fieldName,
        oldValue: '',
        newValue: added[i],
        explanation: `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} "${added[i]}" added.`
      });
    }
  }

  getSentences(text) {
    if (!text) return [];
    // Protect common abbreviations from splitting sentences prematurely
    const clean = text
      .replace(/Rs\./gi, 'Rs')
      .replace(/Ref\./gi, 'Ref')
      .replace(/No\./gi, 'No')
      .replace(/Mr\./gi, 'Mr')
      .replace(/Dr\./gi, 'Dr');

    return clean
      .split(/(?<=[.!?\n])\s+/)
      .map(s => s.trim())
      .filter(s => s.length >= 6);
  }

  calculateSimilarity(str1, str2) {
    const words1 = new Set(str1.toLowerCase().split(/\W+/).filter(Boolean));
    const words2 = new Set(str2.toLowerCase().split(/\W+/).filter(Boolean));

    if (words1.size === 0 || words2.size === 0) return 0;

    let intersection = 0;
    words1.forEach(w => {
      if (words2.has(w)) intersection++;
    });

    return (2 * intersection) / (words1.size + words2.size);
  }

  generateSummary(changes) {
    if (changes.length === 0) {
      return 'No significant differences detected between the two documents.';
    }

    const changedCount = changes.filter(c => c.type === 'changed').length;
    const addedCount = changes.filter(c => c.type === 'added').length;
    const removedCount = changes.filter(c => c.type === 'removed').length;

    return `Document comparison complete: ${changedCount} modified item(s)/clause(s), ${addedCount} addition(s), and ${removedCount} removal(s) detected.`;
  }
}

module.exports = new ComparisonService();
