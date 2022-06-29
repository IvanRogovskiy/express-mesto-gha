class UserAlreadyExists extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 409;
    this.name = 'UserAlreadyExistsError';
  }
}

module.exports = {
  UserAlreadyExists,
};
