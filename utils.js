var crypto = require('crypto');

exports.sha1 = function sha1(str) {
  let hash = crypto.createHash('sha1');
  hash.update(str);
  return hash.digest('hex');
}

exports.RequestError = class RequestError extends Error {
  constructor(msg, status, prev) {
    super(msg);
    this.status = status || 503;
    this.prev = prev;
  }

  toString() {
    return this.stack + '\nPrevious: ' + (this.prev? this.prev.stack : '(None)');
  }
}