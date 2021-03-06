var express = require('express');
var router = express.Router();
var { sha1, RequestError } = require('../utils');
var { Users } = require('../storage/models');
// var users = require('../storage/__fake').users;

function getUser(req, res, next) {
  return Users.findOne({
    where: { account: Number(req.body.id), password: sha1(req.body.password) }
  }).then((user) => {
    req.user = user;
    next();
  }).catch(err => next(new RequestError('Failed to find user', 503, err)));
}

/* GET users listing. */
router.get('/login', function(req, res, next) {
  res.render('login');
});

router.post('/login', getUser, (req, res) => {
  let user = req.user.toJSON();
  if (!user) return res.render('login', { err: 'Bad id or password' });
  req.session.regenerate((err) => {
    if (err) return res.render('login', { err: err });
    Object.assign(req.session, { user: user });
    req.session.save(() => res.redirect('/'));
  });
});

router.get('/logout', (req, res) => {
  req.session.regenerate(() => {
    res.redirect(302, '/user/login');
  });
});

router.checkRole = function buildCheckRole(matchRole) {

  return function checkRole(req, res, next) {
    if (req.session.user && req.session.user.id) {
      let role = req.session.user.role;
      console.log('req.roleTarget', req.roleTarget, role);
      if (matchRole(req.roleTarget, role)) {
        return next();
      }
    }
    
    throw new RequestError('Permission is not granted.', 403, null);
  }
};

router.isLogin = function isLogin(req, res, next) {
    let loggedIn = Boolean(req.session.user);
    if (loggedIn) next();
    else res.redirect(302, '/user/login');
}

router.checkPasswordConfirm = function checkPasswordConfirm(req, res, next) {
  // get password form json formatted body
  console.log('req.body', req.body);
  console.log('passwordConfirm', req.body.passwordConfirm);
  let password = req.body.passwordConfirm;
  if (password && sha1(password) === req.session.user.password) {
    delete req.body.passwordConfirm;
    next();
  }
  else {
    next(new RequestError('Incorrect password', 400, null));
  }
}

module.exports = router;