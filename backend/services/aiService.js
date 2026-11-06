const https = require('https');
const informationScanner = require('./informationScanner');

/**
 * AI Service Module
 * Handles AI-assisted document summarization, risk evaluation, claim scanning, and Q&A using Google Gemini API.
 * Communicates with Gemini securely backend-only without exposing API keys to frontend.
 */
class AIService {
  constructor() {
    this.maxTextLength = 15000; // Limit document text to prevent overflow
  }

  /**
   * Get Gemini API Key from process.env
   * @returns {string}
   */
  getApiKey() {
    const key = process.env.GEMINI_API_KEY || process.env.AI_API_KEY || '';
    if (!key || key.includes('your_gemini_api_key_here') || key.includes('your_ai_api_key_here')) {
      return '';
    }
    return key;
  }

  /**
   * Safely truncate text to limit token usage and avoid payload errors
   * @param {string} text 
   * @returns {string}
   */
  truncateText(text) {
    if (!text || typeof text !== 'string') return '';
    if (text.length <= this.maxTextLength) return text;
    return text.slice(0, this.maxTextLength) + '\n\n[Note: Document text truncated safely for processing limits.]';
  }

  /**
   * PHASE 8: Ask Your Document (Q&A on document text using Gemini API)
   * 
   * @param {string} text - Extracted document text
   * @param {string} question - User question
   * @returns {Promise<string>} Answer string
   */
  async askDocumentQuestion(text, question) {
    const safeText = this.truncateText(text);

    if (!safeText || safeText.trim() === '') {
      return 'I could not find this information in the uploaded document.';
    }

    if (!question || typeof question !== 'string' || question.trim() === '') {
      return 'Please provide a valid question.';
    }

    const apiKey = this.getApiKey();

    if (!apiKey) {
      console.warn('GEMINI_API_KEY not configured. Using rule-based Q&A fallback.');
      return this.generateFallbackQA(text, question);
    }

    const prompt = `You are an expert Q&A assistant for document analysis. Answer the user's question accurately using ONLY the provided document text.

CRITICAL INSTRUCTIONS:
- Answer ONLY using facts directly stated in the supplied document text.
- If the answer to the user's question cannot be found or deduced directly from the text, reply EXACTLY with:
  "I could not find this information in the uploaded document."
- Do NOT invent facts, extrapolate, or use outside knowledge.
- Keep the answer simple, clear, and direct.

USER QUESTION:
${question}

DOCUMENT TEXT:
${safeText}`;

    try {
      const responseText = await this.callGeminiAPI(prompt, apiKey, null);
      if (responseText && responseText.trim()) {
        return responseText.trim();
      } else {
        return this.generateFallbackQA(text, question);
      }
    } catch (error) {
      console.error('AI Service Q&A Error (Gemini API):', error.message);
      return this.generateFallbackQA(text, question);
    }
  }

  /**
   * Rule-based Fallback QA Engine
   */
  generateFallbackQA(text, question) {
    if (!text || !question) {
      return 'I could not find this information in the uploaded document.';
    }

    const lowerQ = question.toLowerCase();
    const sentences = text.split(/(?<=[.!?\n])\s+/).map(s => s.trim()).filter(Boolean);

    const stopWords = new Set([
      'what', 'is', 'the', 'how', 'much', 'are', 'there', 'any', 'in', 'of', 'for', 'to', 'this', 'a', 'an', 'on', 'can', 'explain', 'tell', 'me', 'please', 'does', 'it', 'about', 'refund', 'policy', 'which', 'where', 'when', 'who', 'why'
    ]);
    
    // Extract main subject words (stemming simple 's' / 'ies')
    const rawWords = lowerQ.replace(/[^\w\s]/g, '').split(/\s+/).filter(w => !stopWords.has(w) && w.length > 2);

    if (rawWords.length === 0) {
      return 'I could not find this information in the uploaded document.';
    }

    const matchedSentences = sentences.filter(sentence => {
      const lowerS = sentence.toLowerCase();
      return rawWords.some(w => {
        const stem = w.endsWith('ies') ? w.slice(0, -3) : (w.endsWith('s') ? w.slice(0, -1) : w);
        return lowerS.includes(stem);
      });
    });

    if (matchedSentences.length > 0) {
      return matchedSentences.slice(0, 3).join(' ');
    }

    return 'I could not find this information in the uploaded document.';
  }

  /**
   * PHASE 6: Summarize document text using Gemini API
   */
  async summarizeDocument(text) {
    const safeText = this.truncateText(text);

    if (!safeText || safeText.trim() === '') {
      return {
        summary: 'No readable text was found in the document.',
        keyPoints: ['Empty or non-text document'],
        importantDates: [],
        importantAmounts: []
      };
    }

    const apiKey = this.getApiKey();

    if (!apiKey) {
      console.warn('GEMINI_API_KEY not configured. Falling back to local pattern summarizer.');
      return this.generateFallbackSummary(text);
    }

    const prompt = `You are an expert AI document summarizer.
Summarize the provided document text accurately using simple, clear language.

CRITICAL INSTRUCTIONS:
- Summarize accurately and concisely.
- Do NOT invent facts or extrapolate beyond the provided text.
- Use ONLY information directly present in the supplied document.
- Preserve all important dates and monetary amounts accurately.
- Do NOT use markdown codeblock wrappers in your output. Return RAW JSON ONLY.

JSON Schema required:
{
  "summary": "A clear, simple, and accurate summary of the document.",
  "keyPoints": ["Key point 1", "Key point 2"],
  "importantDates": ["Date 1", "Date 2"],
  "importantAmounts": ["Amount 1", "Amount 2"]
}

DOCUMENT TEXT:
${safeText}`;

    try {
      const responseText = await this.callGeminiAPI(prompt, apiKey, 'application/json');
      const parsedJSON = this.parseJSONResponse(responseText);

      if (parsedJSON && parsedJSON.summary) {
        const meta = this.extractDocumentMetadata(text);
        return {
          summary: parsedJSON.summary || 'Summary unavailable.',
          keyPoints: Array.isArray(parsedJSON.keyPoints) && parsedJSON.keyPoints.length > 0 ? parsedJSON.keyPoints : this.generateFallbackSummary(text).keyPoints,
          documentType: meta.documentType,
          issuer: meta.issuer,
          referenceNo: meta.referenceNo,
          deadline: meta.deadline,
          subject: meta.subject,
          importantDates: Array.isArray(parsedJSON.importantDates) && parsedJSON.importantDates.length > 0 ? parsedJSON.importantDates : meta.dates,
          importantAmounts: Array.isArray(parsedJSON.importantAmounts) && parsedJSON.importantAmounts.length > 0 ? parsedJSON.importantAmounts : meta.amounts
        };
      } else {
        console.warn('Gemini API response parsing failed. Using fallback summarizer.');
        return this.generateFallbackSummary(text);
      }
    } catch (error) {
      console.error('AI Service Error (Gemini API):', error.message);
      return this.generateFallbackSummary(text, error.message);
    }
  }

  /**
   * PHASE 7: Risk Analysis using Gemini API / Rule Engine
   */
  async analyzeRisk(text) {
    const safeText = this.truncateText(text);

    if (!safeText || safeText.trim() === '') {
      return {
        riskScore: 0,
        riskLevel: 'Low',
        suspiciousPoints: ['Document is empty or contains no readable text.'],
        explanation: ['Unable to evaluate risk on empty content.'],
        recommendation: 'Provide a valid document containing readable text.'
      };
    }

    const apiKey = this.getApiKey();

    if (!apiKey) {
      console.warn('GEMINI_API_KEY not configured. Using rule-based Risk Analysis fallback.');
      return this.generateFallbackRiskAnalysis(text);
    }

    const prompt = `You are an AI document risk evaluation system. Analyze the provided document text for potential risk indicators.

EVALUATION CRITERIA:
- Suspicious or unusual wording for an official notice/document
- Urgency or high-pressure tactics (e.g. "immediate action required within 24 hours", "pay now")
- Threatening language (e.g. "legal action will be taken immediately")
- Misleading or deceptive claims
- Unusual financial requests or upfront fee demands
- Suspicious contact requests (e.g. non-official email domains, personal bank/UPI transfers)
- Missing official source details or authorization signatures
- Potentially risky clauses

CRITICAL INSTRUCTIONS:
- riskScore must be an integer between 0 and 100.
- riskLevel must be EXACTLY one of: "Low" (0-39), "Medium" (40-69), "High" (70-100).
- NEVER declare "This document is fake" or "This document is fraudulent". Always use objective phrasing like "Potential risk indicators detected".
- Return RAW JSON ONLY without markdown backticks.

JSON Schema required:
{
  "riskScore": 45,
  "riskLevel": "Medium",
  "suspiciousPoints": ["High-pressure deadline imposed", "Non-official email contact domain listed"],
  "explanation": ["The document demands immediate action within 24 hours which is a common risk indicator", "Contact email uses generic public domain instead of official portal"],
  "recommendation": "Cross-reference flagged details with the official issuing body before making payments or sharing credentials."
}

DOCUMENT TEXT:
${safeText}`;

    try {
      const responseText = await this.callGeminiAPI(prompt, apiKey, 'application/json');
      const parsedJSON = this.parseJSONResponse(responseText);

      if (parsedJSON && typeof parsedJSON.riskScore === 'number') {
        const score = Math.max(0, Math.min(100, Math.round(parsedJSON.riskScore)));
        let level = parsedJSON.riskLevel;
        if (!['Low', 'Medium', 'High'].includes(level)) {
          if (score >= 70) level = 'High';
          else if (score >= 40) level = 'Medium';
          else level = 'Low';
        }

        return {
          riskScore: score,
          riskLevel: level,
          suspiciousPoints: Array.isArray(parsedJSON.suspiciousPoints) ? parsedJSON.suspiciousPoints : [],
          explanation: Array.isArray(parsedJSON.explanation) ? parsedJSON.explanation : [],
          recommendation: parsedJSON.recommendation || 'Verify document details with official issuing authority.'
        };
      } else {
        console.warn('Gemini API risk analysis JSON invalid. Using rule-based fallback.');
        return this.generateFallbackRiskAnalysis(text);
      }
    } catch (error) {
      console.error('AI Service Risk Analysis Error:', error.message);
      return this.generateFallbackRiskAnalysis(text, error.message);
    }
  }

  /**
   * PHASE 7: Claim Scanner using Gemini API / Pattern Engine
   */
  async scanClaims(text) {
    const safeText = this.truncateText(text);

    if (!safeText || safeText.trim() === '') {
      return { claims: [] };
    }

    const apiKey = this.getApiKey();

    if (!apiKey) {
      console.warn('GEMINI_API_KEY not configured. Using rule-based Claim Scanner fallback.');
      return this.generateFallbackClaims(text);
    }

    const prompt = `You are an AI claim extraction and verification assistant. Identify individual factual claims and key assertions made in the supplied document text.

INSTRUCTIONS:
- Extract clear, distinct factual claims (e.g. monetary grants, government promises, deadline declarations, administrative rules).
- For each claim, assign a verification status from EXACTLY one of:
  "Verified", "Unverified", "Requires Verification", "Potentially Misleading"
- CRITICAL RULE: Never mark a claim as "Verified" unless it represents an indisputable, officially verified statement. Default to "Requires Verification" or "Unverified" when in doubt.
- Return RAW JSON ONLY without markdown backticks.

JSON Schema required:
{
  "claims": [
    {
      "claim": "Government is providing ₹50,000 to every student.",
      "status": "Requires Verification"
    },
    {
      "claim": "Applications must be submitted before 30 October 2026.",
      "status": "Requires Verification"
    }
  ]
}

DOCUMENT TEXT:
${safeText}`;

    try {
      const responseText = await this.callGeminiAPI(prompt, apiKey, 'application/json');
      const parsedJSON = this.parseJSONResponse(responseText);

      if (parsedJSON && Array.isArray(parsedJSON.claims)) {
        const allowedStatuses = ['Verified', 'Unverified', 'Requires Verification', 'Potentially Misleading'];
        const validatedClaims = parsedJSON.claims.map(c => {
          const claimText = typeof c === 'string' ? c : (c.claim || '');
          let status = typeof c === 'object' && c.status ? c.status : 'Requires Verification';
          if (!allowedStatuses.includes(status)) {
            status = 'Requires Verification';
          }
          return {
            claim: claimText,
            status
          };
        }).filter(c => c.claim.trim().length > 0);

        return { claims: validatedClaims };
      } else {
        console.warn('Gemini API claim scanner JSON invalid. Using fallback claim extractor.');
        return this.generateFallbackClaims(text);
      }
    } catch (error) {
      console.error('AI Service Claim Scanner Error:', error.message);
      return this.generateFallbackClaims(text, error.message);
    }
  }

  /**
   * Send REST HTTP Request to Google Gemini API
   * @param {string} prompt 
   * @param {string} apiKey 
   * @param {string|null} mimeType
   * @returns {Promise<string>} Text generated by Gemini
   */
  async callGeminiAPI(prompt, apiKey, mimeType = 'application/json') {
    const candidateModels = ['gemini-2.5-flash', 'gemini-3.8-flash', 'gemini-flash-latest', 'gemini-2.0-flash'];
    let lastError = null;

    for (const model of candidateModels) {
      try {
        const text = await this.executeGeminiRequest(prompt, apiKey, model, mimeType);
        if (text && text.trim()) {
          return text.trim();
        }
      } catch (err) {
        lastError = err;
        console.warn(`Model ${model} request failed: ${err.message}. Retrying next model candidate...`);
      }
    }

    throw lastError || new Error('All Gemini API model candidates failed.');
  }

  executeGeminiRequest(prompt, apiKey, modelName, mimeType) {
    return new Promise((resolve, reject) => {
      const generationConfig = {
        temperature: 0.1,
        maxOutputTokens: 1024
      };

      if (mimeType) {
        generationConfig.responseMimeType = mimeType;
      }

      const payload = JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ],
        generationConfig
      });

      const options = {
        hostname: 'generativelanguage.googleapis.com',
        path: `/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload)
        },
        timeout: 5000
      };

      const req = https.request(options, (res) => {
        let body = '';
        res.on('data', (chunk) => { body += chunk; });
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            try {
              const responseData = JSON.parse(body);
              const textContent = responseData?.candidates?.[0]?.content?.parts?.[0]?.text || '';
              resolve(textContent);
            } catch (err) {
              reject(new Error(`Failed to parse Gemini API response wrapper: ${err.message}`));
            }
          } else {
            reject(new Error(`Gemini API [${modelName}] status ${res.statusCode}: ${body}`));
          }
        });
      });

      req.on('error', (err) => reject(err));
      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Gemini API request timed out after 5 seconds.'));
      });

      req.write(payload);
      req.end();
    });
  }

  /**
   * Parse JSON safely from AI output string (stripping codeblock tags if present)
   */
  parseJSONResponse(text) {
    if (!text || typeof text !== 'string') return null;
    let cleanText = text.trim();
    if (cleanText.startsWith('```json')) {
      cleanText = cleanText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleanText.startsWith('```')) {
      cleanText = cleanText.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }
    try {
      return JSON.parse(cleanText);
    } catch (e) {
      console.error('JSON parse error on AI response string:', e.message);
      return null;
    }
  }

  /**
   * Extract comprehensive structured metadata from document text
   */
  extractDocumentMetadata(text) {
    const raw = text || '';
    const lines = raw.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    const lower = raw.toLowerCase();

    // 1. Reference Number
    let referenceNo = '';
    const refMatch = raw.match(/(?:NOTICE\s*REF|Ref(?:\.|\s*No)?|Reference|Order\s*No|Circular\s*No)[:\s-]*([A-Z0-9\/\-_.]+)/i);
    if (refMatch) referenceNo = refMatch[1].trim();

    // 2. Issuing Authority
    let issuer = '';
    const orgPatterns = [
      /(?:Chandigarh\s+University(?:\s*-\s*[A-Za-z\s]+)?)/i,
      /(?:Department\s+of\s+[A-Za-z\s]+)/i,
      /(?:Ministry\s+of\s+[A-Za-z\s]+)/i,
      /(?:State\s+Technical\s+[A-Za-z\s]+(?:Scheme|Board)?)/i,
      /(?:National\s+[A-Za-z\s]+Board)/i,
      /(?:University\s+Grants\s+Commission)/i,
      /([A-Z][A-Za-z\s&]{3,40}(?:University|College|Institute|Department|Commission|Authority|Directorate|Council))/i
    ];
    for (const pat of orgPatterns) {
      const m = raw.match(pat);
      if (m) {
        issuer = m[0].trim();
        break;
      }
    }
    if (!issuer && lines.length > 0) {
      if (lines[0].toUpperCase() === lines[0] && lines[0].length < 60) {
        issuer = lines[0];
      }
    }

    // 3. Subject / Directive
    let subject = '';
    const subjMatch = raw.match(/(?:Subject|Sub|Regarding|Topic|Re)[:\s-]+([^\n.]+)/i);
    if (subjMatch) {
      subject = subjMatch[1].trim();
    } else {
      const notifyMatch = raw.match(/(?:regarding|about|pertaining to)\s+([^\n.]+)/i);
      if (notifyMatch) {
        subject = notifyMatch[1].trim();
      } else if (lower.includes('scholarship')) {
        subject = 'State Technical Scholarship Application & Guidelines';
      } else if (lower.includes('project synopsis') || lower.includes('major project')) {
        subject = 'Submission of Major Project Synopsis';
      }
    }

    // 4. Document Type
    let documentType = 'Official Notice';
    if (lower.includes('scholarship')) documentType = 'Scholarship Circular';
    else if (lower.includes('synopsis') || lower.includes('project') || lower.includes('curriculum')) documentType = 'Academic Directive / Circular';
    else if (lower.includes('invoice') || lower.includes('payment due') || lower.includes('receipt')) documentType = 'Financial Invoice / Demand';
    else if (lower.includes('offer letter') || lower.includes('employment') || lower.includes('recruitment')) documentType = 'Employment Offer Letter';
    else if (lower.includes('agreement') || lower.includes('contract')) documentType = 'Legal Agreement / Contract';
    else if (lower.includes('blocked') || lower.includes('suspended') || lower.includes('lottery') || lower.includes('prize')) documentType = 'Suspicious Security Alert / Scam Advisory';

    // 5. Target Audience
    let audience = 'All Concerned Recipients';
    const audMatch = raw.match(/(?:notify|instruct|inform|eligible candidates|students|employees)\s+(?:all\s+)?([A-Za-z0-9\s&,-]{5,50}?)(?=\s+(?:regarding|to|must|are|before|for|\.|\n))/i);
    if (audMatch) {
      audience = audMatch[1].trim();
    } else if (lower.includes('post-graduate students') || lower.includes('students')) {
      audience = 'Registered Post-Graduate Students';
    }

    // 6. Dates & Deadlines
    const dateMatches = raw.match(/(?:\d{1,2}(?:st|nd|rd|th)?\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*[\s,]+\d{4}|\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{1,2},?\s+\d{4}|\b\d{1,2}[-\/.]\d{1,2}[-\/.]\d{2,4})/gi) || [];
    let deadline = '';
    const deadlineMatch = raw.match(/(?:deadline(?: of)?|before|last date|due date|submit by|on or before)[\s:]*([^\n.,]+(?:\d{4}|\d{2}))/i);
    if (deadlineMatch) {
      deadline = deadlineMatch[1].trim();
    } else if (dateMatches.length > 0) {
      deadline = dateMatches[dateMatches.length - 1];
    }

    // 7. Monetary Amounts
    const amountMatches = raw.match(/(?:(?:₹|Rs\.?|INR|\$|USD)\s*[\d,]+(?:\.\d{2})?|(?:fee|amount|deposit|charge)s?\s*(?:of|is|:)?\s*(?:₹|Rs\.?|INR|\$|USD)?\s*[\d,]+)/gi) || [];

    // 8. Communication channels
    const emailMatches = raw.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || [];
    const urlMatches = raw.match(/(?:https?:\/\/|www\.)[^\s<>"'{}|\\^`]+|[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\/[^\s<>"']+/g) || [];

    return {
      referenceNo,
      issuer: issuer || 'Institutional Authority',
      subject: subject || 'General Official Notification',
      documentType,
      audience,
      deadline: deadline || (dateMatches.length > 0 ? dateMatches[0] : 'As per official schedule'),
      dates: dateMatches,
      amounts: amountMatches,
      emails: emailMatches,
      urls: urlMatches
    };
  }

  /**
   * Advanced NLP Document Intelligence Summarizer
   */
  generateFallbackSummary(text, errorMessage = '') {
    const meta = this.extractDocumentMetadata(text);
    const scanned = informationScanner.scan(text);

    const importantDates = meta.dates.length > 0 ? meta.dates : (scanned.dates || []);
    const importantAmounts = meta.amounts.length > 0 ? meta.amounts : (scanned.amounts || []);

    // Cohesive, professional Executive Summary
    let summary = `This ${meta.documentType} issued by ${meta.issuer} details instructions regarding "${meta.subject}". `;
    if (meta.audience && meta.audience !== 'All Concerned Recipients') {
      summary += `It addresses ${meta.audience} with mandatory compliance guidelines. `;
    }
    if (meta.deadline && meta.deadline !== 'As per official schedule') {
      summary += `Submissions must be finalized on or before ${meta.deadline}. `;
    }
    if (importantAmounts.length > 0) {
      summary += `A financial fee requirement of ${importantAmounts.join(', ')} is stated. `;
    }
    if (meta.emails.length > 0 || meta.urls.length > 0) {
      const channel = meta.emails[0] || meta.urls[0];
      summary += `Designated application/contact channel is indicated as ${channel}.`;
    }

    const keyPoints = [
      `Document Category: ${meta.documentType}`,
      `Issuing Organization: ${meta.issuer}`,
      `Subject & Purpose: ${meta.subject}`,
      `Action Deadline: ${meta.deadline}`,
      `Financial Requirement: ${importantAmounts.length > 0 ? importantAmounts.join(', ') + ' requested' : 'No fee transaction specified'}`,
      `Communication Channel: ${meta.emails[0] || meta.urls[0] || 'Official institutional portal'}`
    ];

    if (meta.referenceNo) {
      keyPoints.unshift(`Document Ref ID: ${meta.referenceNo}`);
    }

    return {
      summary: summary.trim(),
      keyPoints,
      documentType: meta.documentType,
      issuer: meta.issuer,
      referenceNo: meta.referenceNo,
      deadline: meta.deadline,
      subject: meta.subject,
      importantDates,
      importantAmounts
    };
  }

  /**
   * Comprehensive Rule-based Risk Analysis Engine
   */
  generateFallbackRiskAnalysis(text, errorMessage = '') {
    const scanned = informationScanner.scan(text);
    const meta = this.extractDocumentMetadata(text);
    const suspiciousPoints = [];
    const explanation = [];
    let riskScore = 15;

    const lowerText = (text || '').toLowerCase();

    // 1. Upfront Fee in Scholarship / Grant Context
    if ((lowerText.includes('scholarship') || lowerText.includes('grant') || lowerText.includes('award')) && 
        (meta.amounts.length > 0 || lowerText.includes('fee') || lowerText.includes('deposited'))) {
      suspiciousPoints.push('Advance-Fee Fraud Indicator: Upfront registration fee requested for a scholarship scheme.');
      explanation.push('Legitimate scholarship programs do not demand high upfront registration or processing fees.');
      riskScore += 45;
    }

    // 2. Free Webmail Domain for Institutional Notification
    if (meta.emails.some(e => e.includes('@gmail.') || e.includes('@yahoo.') || e.includes('@hotmail.') || e.includes('@outlook.'))) {
      suspiciousPoints.push('Unofficial Contact Email: Public free webmail address used instead of institutional domain.');
      explanation.push('Official government or educational bodies communicate via accredited domains (.gov, .edu, .ac.in).');
      riskScore += 25;
    }

    // 3. Third-party unverified URL redirect
    if (scanned.urls && scanned.urls.some(url => !url.includes('.gov') && !url.includes('.edu') && !url.includes('.ac.in'))) {
      suspiciousPoints.push('External Unverified Payment / Portal Link: Document redirects to third-party domain.');
      explanation.push('Redirection to non-official external links poses phishing and financial exposure risks.');
      riskScore += 20;
    }

    // 4. Urgent High-Pressure Timing
    if (lowerText.includes('urgent') || lowerText.includes('immediately') || lowerText.includes('within 24 hours') || lowerText.includes('before the deadline')) {
      suspiciousPoints.push('Urgency Pressure: Strict deadline phrasing creating psychological rush.');
      explanation.push('Scam operations frequently leverage compressed timelines to bypass scrutiny.');
      riskScore += 15;
    }

    // 5. Account Suspension Threats
    if (lowerText.includes('permanently blocked') || lowerText.includes('account blocked') || lowerText.includes('transfer money') || lowerText.includes('personal account')) {
      suspiciousPoints.push('High Threat Level: Account suspension and coercive transfer ultimatum.');
      explanation.push('Unauthorized threat demanding financial transfers to prevent account closure.');
      riskScore += 60;
    }

    riskScore = Math.min(100, Math.max(0, riskScore));
    let riskLevel = 'Low';
    if (riskScore >= 70) riskLevel = 'High';
    else if (riskScore >= 40) riskLevel = 'Medium';

    return {
      riskScore,
      riskLevel,
      suspiciousPoints: suspiciousPoints.length > 0 ? suspiciousPoints : ['No high-risk threat indicators detected.'],
      explanation: explanation.length > 0 ? explanation : ['Document text follows standard informational layout.'],
      recommendation: riskScore >= 70
        ? 'CRITICAL WARNING: Do not transfer funds or submit confidential data. Cross-verify this notice directly through verified institutional channels.'
        : (riskScore >= 40
            ? 'CAUTION: Exercise vigilance regarding listed payment links and verify contact addresses with the official administration.'
            : 'Verified consistent with standard institutional communications. No significant threats detected.')
    };
  }

  /**
   * Rule-based Fallback Claim Extractor
   */
  generateFallbackClaims(text, errorMessage = '') {
    const cleanText = (text || '').replace(/Rs\./gi, 'Rs').replace(/Ref\./gi, 'Ref').replace(/No\./gi, 'No');
    const sentences = cleanText
      .split(/(?<=[.!?\n])\s+/)
      .map(s => s.trim())
      .filter(s => s.length >= 10);

    const scanned = informationScanner.scan(text);
    const claims = [];

    sentences.forEach(sentence => {
      const lower = sentence.toLowerCase();
      if (
        lower.includes('close') ||
        lower.includes('deadline') ||
        lower.includes('fee') ||
        lower.includes('application') ||
        lower.includes('online') ||
        lower.includes('must') ||
        lower.includes('required') ||
        lower.includes('will') ||
        lower.includes('shall') ||
        scanned.amounts.some(a => sentence.includes(a)) ||
        scanned.dates.some(d => sentence.includes(d))
      ) {
        let status = 'Requires Verification';
        if (lower.includes('free') || lower.includes('urgent') || lower.includes('guaranteed') || lower.includes('win')) {
          status = 'Potentially Misleading';
        }
        claims.push({
          claim: sentence,
          status
        });
      }
    });

    if (claims.length === 0 && sentences.length > 0) {
      claims.push({
        claim: sentences[0],
        status: 'Requires Verification'
      });
    }

    return { claims: claims.slice(0, 8) };
  }

  /**
   * Existing analyzeDocument method for general analysis compatibility
   */
  async analyzeDocument(text, scannedInfo = {}) {
    const apiKey = this.getApiKey();
    if (apiKey) {
      try {
        const summaryRes = await this.summarizeDocument(text);
        const riskRes = await this.analyzeRisk(text);
        const claimRes = await this.scanClaims(text);
        return {
          summary: summaryRes.summary,
          importantPoints: summaryRes.keyPoints,
          suspiciousPoints: riskRes.suspiciousPoints,
          explanation: riskRes.explanation,
          claims: claimRes.claims,
          riskScore: riskRes.riskScore,
          riskLevel: riskRes.riskLevel,
          recommendation: riskRes.recommendation
        };
      } catch (err) {
        console.error('Analysis error:', err.message);
      }
    }
    return this.generateFallbackAnalysis(text, scannedInfo);
  }

  generateFallbackAnalysis(text, scannedInfo) {
    const risk = this.generateFallbackRiskAnalysis(text);
    const claimsRes = this.generateFallbackClaims(text);

    return {
      summary: 'Document parsed successfully.',
      importantPoints: ['Document contains standard text notices.'],
      suspiciousPoints: risk.suspiciousPoints,
      explanation: risk.explanation,
      claims: claimsRes.claims,
      riskScore: risk.riskScore,
      riskLevel: risk.riskLevel,
      recommendation: risk.recommendation
    };
  }
}

module.exports = new AIService();
