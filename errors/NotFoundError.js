class NotFoundError extends Error {
  constructor(message, name) {
    super(message);
    this.name = name;
    this.statusCode = 404;
  }
}

module.exports = {
  NotFoundError,
};
