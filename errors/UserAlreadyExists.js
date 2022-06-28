class UserAlreadyExists extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
    this.name = 'UserAlreadyExistsError';
  }
}

module.exports = {
  UserAlreadyExists,
};
