// auth.js
const bcrypt = require('bcrypt');

exports.comparePasswords = (password, hashedPassword) => {
  return bcrypt.compareSync(password, hashedPassword);
};

exports.hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

exports.isAuthenticated = (req, res, next) => {
    if (req.session && req.session.user) {
      return next();
    } else {
      return res.redirect('/login');
    }
  };
  
  // Middleware to check if the user has admin role
  exports.isAdmin = (req, res, next) => {
    if (req.session && req.session.user && req.session.user.role === 'admin') {
      return next();
    } else {
      return res.redirect('/login');
    }
  };

  