class AccessError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
}

module.exports = AccessError;
