/**
 * Smart Information Scanner & Privacy Shield
 * Uses RegEx and pattern matching to detect and mask sensitive information (PII).
 * Operates locally without modifying the original document in the database.
 */
class InformationScanner {
  /**
   * Scan text for structured entities
   * @param {string} text 
   * @returns {Object} Detected entities
   */
  scan(text) {
    if (!text || typeof text !== 'string') {
      return {
        emails: [],
        phones: [],
        urls: [],
        dates: [],
        amounts: [],
        ids: [],
        names: [],
        addresses: []
      };
    }

    const emails = this.extractRegexMatches(
      text,
      /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi
    );

    const phones = this.extractRegexMatches(
      text,
      /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\b[6-9]\d{9}\b/g
    );

    const urls = this.extractRegexMatches(
      text,
      /https?:\/\/[^\s<>"']+|www\.[^\s<>"']+|\b[a-zA-Z0-9.-]+\.(?:com|org|edu|in|gov|biz|net|info|co)\b[^\s<>"']*/gi
    );

    const dates = this.extractRegexMatches(
      text,
      /\b(?:\d{1,2}[-/\s]?(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*[-/\s]?\d{2,4}|\d{1,2}[-/\s]\d{1,2}[-/\s]\d{2,4}|\d{4}[-/]\d{2}[-/]\d{2})\b/gi
    );

    const amounts = this.extractRegexMatches(
      text,
      /(?:₹|Rs\.?|INR|\$)\s*[\d,]+(?:\.\d{2})?\b/gi
    );

    const ids = this.extractRegexMatches(
      text,
      /\b(?:REF|SCH|DOC|ID|NO|CIRCULAR|AADHAR|PAN|PASSPORT)[-:\s\/]?[A-Z0-9\/-]{3,20}\b/gi
    );

    const names = this.extractRegexMatches(
      text,
      /\b(?:Mr\.|Mrs\.|Ms\.|Dr\.|Prof\.|To:|Name:)\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?\b/g
    );

    const addresses = this.extractRegexMatches(
      text,
      /\b(?:Flat|House|Plot|Street|Road|Nagar|Colony|Sector|Pin\s*Code)\s+[^,\n.]{3,30}(?:,\s*[^,\n.]{3,30}){1,3}/gi
    );

    return {
      emails,
      phones,
      urls,
      dates,
      amounts,
      ids,
      names,
      addresses
    };
  }

  /**
   * Mask single email string: chhavi@gmail.com -> c*****@gmail.com
   */
  maskEmail(email) {
    if (!email || typeof email !== 'string') return email;
    const parts = email.split('@');
    if (parts.length !== 2) return email;
    const name = parts[0];
    const domain = parts[1];
    if (name.length <= 1) {
      return `*@${domain}`;
    }
    return `${name[0]}*****@${domain}`;
  }

  /**
   * Mask single phone string: 9876543210 -> ******3210
   */
  maskPhone(phone) {
    if (!phone || typeof phone !== 'string') return phone;
    const clean = phone.replace(/\s+/g, '');
    if (clean.length < 4) return '******';
    return '*'.repeat(clean.length - 4) + clean.slice(-4);
  }

  /**
   * Mask ID pattern: DOC-1234567 -> DOC-******7
   */
  maskID(idStr) {
    if (!idStr || typeof idStr !== 'string') return idStr;
    if (idStr.length <= 4) return '****';
    return idStr.slice(0, 4) + '*'.repeat(Math.max(3, idStr.length - 5)) + idStr.slice(-1);
  }

  /**
   * Mask Name string: Mr. Rahul Sharma -> Mr. R**** S*****
   */
  maskName(nameStr) {
    if (!nameStr || typeof nameStr !== 'string') return nameStr;
    return nameStr.split(/\s+/).map(word => {
      if (['Mr.', 'Mrs.', 'Ms.', 'Dr.', 'Prof.', 'To:', 'Name:'].includes(word)) {
        return word;
      }
      if (word.length <= 2) return word[0] + '*';
      return word[0] + '*'.repeat(word.length - 1);
    }).join(' ');
  }

  /**
   * Mask Privacy Shield details for /api/privacy/scan/:documentId endpoint
   * @param {string} text 
   * @returns {Object} { detected, count, items }
   */
  scanPrivacy(text) {
    const scanned = this.scan(text);
    const items = [];

    scanned.emails.forEach(email => {
      items.push({
        type: 'email',
        original: email,
        value: this.maskEmail(email)
      });
    });

    scanned.phones.forEach(phone => {
      items.push({
        type: 'phone',
        original: phone,
        value: this.maskPhone(phone)
      });
    });

    scanned.ids.forEach(idVal => {
      items.push({
        type: 'id',
        original: idVal,
        value: this.maskID(idVal)
      });
    });

    scanned.names.forEach(nameVal => {
      items.push({
        type: 'name',
        original: nameVal,
        value: this.maskName(nameVal)
      });
    });

    scanned.addresses.forEach(addrVal => {
      items.push({
        type: 'address',
        original: addrVal,
        value: '[ADDRESS MASKED]'
      });
    });

    return {
      detected: items.length > 0,
      count: items.length,
      items
    };
  }

  /**
   * Return masked entities object
   */
  maskEntities(entities) {
    return {
      emails: (entities.emails || []).map(e => this.maskEmail(e)),
      phones: (entities.phones || []).map(p => this.maskPhone(p)),
      urls: entities.urls || [],
      dates: entities.dates || [],
      amounts: entities.amounts || [],
      ids: (entities.ids || []).map(idVal => this.maskID(idVal)),
      names: (entities.names || []).map(n => this.maskName(n)),
      addresses: (entities.addresses || []).map(() => '[ADDRESS MASKED]')
    };
  }

  /**
   * Mask sensitive PII directly in full text without modifying original document in DB
   */
  maskText(text) {
    if (!text) return text;
    let masked = text;

    const scanned = this.scan(text);

    scanned.emails.forEach(email => {
      masked = masked.replace(new RegExp(this.escapeRegExp(email), 'g'), this.maskEmail(email));
    });

    scanned.phones.forEach(phone => {
      masked = masked.replace(new RegExp(this.escapeRegExp(phone), 'g'), this.maskPhone(phone));
    });

    scanned.ids.forEach(idVal => {
      masked = masked.replace(new RegExp(this.escapeRegExp(idVal), 'g'), this.maskID(idVal));
    });

    scanned.names.forEach(nameVal => {
      masked = masked.replace(new RegExp(this.escapeRegExp(nameVal), 'g'), this.maskName(nameVal));
    });

    scanned.addresses.forEach(addrVal => {
      masked = masked.replace(new RegExp(this.escapeRegExp(addrVal), 'g'), '[ADDRESS MASKED]');
    });

    return masked;
  }

  extractRegexMatches(text, regex) {
    const matches = text.match(regex);
    if (!matches) return [];
    return Array.from(new Set(matches.map(m => m.trim())));
  }

  escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}

module.exports = new InformationScanner();
