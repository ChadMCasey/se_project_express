module.exports = class InvalidData extends Error {
  constructor(message) {
    super(message);
    this.status = 400;
    this.name = "InvalidData";
  }
};
