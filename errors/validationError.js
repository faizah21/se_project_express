class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "Validation Error";
    this.statusCode = 400;
  }
}

module.exports = ValidationError;
