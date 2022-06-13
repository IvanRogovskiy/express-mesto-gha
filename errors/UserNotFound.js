class UserNotFound extends Error {
  constructor(message) {
    super(message);
    this.name = 'UserNotFoundError';
    this.statusCode = 404;
  }
}

module.exports = {
  UserNotFound,
};
