class DuplicateEmailError extends Error {
  constructor(message) {
    super(message);
    this.name = "InvalidEmailError";
    this.statusCode = 409;
  }
}

module.exports = DuplicateEmailError;
