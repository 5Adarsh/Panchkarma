// middleware/roleMiddleware.js

const roleMiddleware = (requiredRole) => {
  return (req, res, next) => {
    if (!req.session || !req.session.user) {
      return res.redirect('/auth/login');
    }

    if (req.session.user.role !== requiredRole) {
      return res.status(403).send("Access Denied");
    }

    next();
  };
};

module.exports = roleMiddleware;
