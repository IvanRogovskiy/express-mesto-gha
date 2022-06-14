class CardNotFound extends Error {
  constructor(message) {
    super(message);
    this.name = 'CardNotFoundError';
    this.statusCode = 404;
  }
}

module.exports = {
  CardNotFound,
};
