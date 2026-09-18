/**
 * ML Spam & Fraud Classifier Module
 * Evaluates document text, mobile messages, notices, and contact numbers against machine learning spam dataset patterns.
 */
class MLSpamDetector {
  constructor() {
    // Machine Learning Spam Dataset Vocabulary & Weighted Feature Tokens
    this.spamWeights = {
      // Urgent action & pressure keywords
      'urgent': 3.5,
      'immediately': 3.0,
      'within 24 hours': 4.0,
      'act now': 3.8,
      'expire': 2.8,
      'final notice': 3.5,
      'account suspended': 4.5,
      'immediate action': 3.5,

      // Financial & fee scam triggers
      'fee payable': 2.5,
      'upfront deposit': 4.5,
      'processing fee': 3.2,
      'registration fee': 3.0,
      'claim grant': 4.0,
      'lottery': 5.0,
      'prize won': 5.0,
      'cash reward': 4.5,
      'upi transfer': 3.8,
      'send money': 4.0,
      'crypto': 3.5,
      'bitcoin': 3.5,
      'refund claim': 3.2,

      // SMS / Mobile scam patterns
      'otp': 2.5,
      'share otp': 5.0,
      'click link': 3.8,
      'verify account': 3.2,
      'whatsapp group': 3.0,
      'telegram channel': 3.5,
      'guaranteed income': 4.8,
      'work from home': 3.0,
      'part time job': 2.8,

      // Public email / unverified domain triggers
      'gmail.com': 2.5,
      'yahoo.com': 2.5,
      'hotmail.com': 2.5,
      'outlook.com': 2.0
    };

    // Spam Phone Prefix Patterns (Unverified telemarketers / virtual number blocks)
    this.suspiciousPhonePrefixes = ['+91140', '+91160', '+9192', '+9170'];
  }

  /**
   * Predict whether content (message, notice, document) is SPAM or LEGITIMATE using Naive Bayes-style feature weighting.
   * @param {string} text 
   * @returns {Object} { isSpam, spamProbability, spamScore, flaggedTokens, verdict, recommendations }
   */
  classify(text) {
    if (!text || typeof text !== 'string' || text.trim() === '') {
      return {
        isSpam: false,
        spamProbability: 0,
        spamScore: 0,
        flaggedTokens: [],
        verdict: 'LEGITIMATE',
        confidence: 'High',
        recommendations: 'No text provided for evaluation.'
      };
    }

    const lowerText = text.toLowerCase();
    let score = 0;
    const flaggedTokens = [];

    // Calculate Feature Scores
    for (const [token, weight] of Object.entries(this.spamWeights)) {
      if (lowerText.includes(token)) {
        score += weight;
        flaggedTokens.push({ token, weight });
      }
    }

    // Check Mobile / Phone Scam Patterns
    const phoneMatches = text.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\b[6-9]\d{9}\b/g) || [];
    let phoneSpamFound = false;

    phoneMatches.forEach(phone => {
      const cleanPhone = phone.replace(/[\s-()]/g, '');
      if (this.suspiciousPhonePrefixes.some(prefix => cleanPhone.startsWith(prefix))) {
        score += 4.5;
        phoneSpamFound = true;
        flaggedTokens.push({ token: `Suspicious Mobile Prefix: ${phone}`, weight: 4.5 });
      }
    });

    // Normalize Probability (0.0 to 1.0 using Sigmoid-like scaling)
    const maxScoreThreshold = 12.0;
    const spamProbability = Math.min(0.99, Math.max(0.01, parseFloat((score / maxScoreThreshold).toFixed(2))));
    const isSpam = spamProbability >= 0.45;

    let verdict = 'LEGITIMATE';
    if (spamProbability >= 0.70) {
      verdict = 'HIGH PROBABILITY SPAM / FRAUD';
    } else if (spamProbability >= 0.45) {
      verdict = 'POTENTIAL SPAM / UNVERIFIED NOTICE';
    } else {
      verdict = 'LIKELY LEGITIMATE';
    }

    return {
      isSpam,
      spamProbability,
      spamScore: Math.round(score * 10),
      flaggedTokens,
      verdict,
      confidence: flaggedTokens.length > 2 ? 'High' : 'Moderate',
      phoneSpamFound,
      recommendations: isSpam
        ? 'Do not transfer funds, share OTPs, or click unverified links listed in this notice/message.'
        : 'Text appears consistent with standard communication. Verify sender credentials if unsure.'
    };
  }
}

module.exports = new MLSpamDetector();
