const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../errors/UnauthorizedError');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  const unauthorizedError = new UnauthorizedError('Необходима авторизация');
  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(unauthorizedError);
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    next(unauthorizedError);
  }
  req.user = payload;
  next();
};
