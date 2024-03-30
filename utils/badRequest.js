module.exports = class BadRequest extends Error {
  constructor(message) {
    super(message);
    this.status = 401;
    this.name = "BadRequest";
  }
};
