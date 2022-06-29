class UserNotFound extends Error {
  constructor(message) {
    super(message);
    this.name = 'UserNotFoundError';
    this.statusCode = 401;
  }
}

module.exports = {
  UserNotFound,
};
