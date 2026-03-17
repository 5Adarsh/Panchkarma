// middleware/authMiddleware.js

const authMiddleware = (req, res, next) => {
  if (req.session && req.session.user) {
    req.user = req.session.user;
    return next();
  }

  return res.redirect('/auth/login');
};

module.exports = authMiddleware;
