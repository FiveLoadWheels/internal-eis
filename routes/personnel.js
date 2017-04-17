/// <reference path="../node_modules/eis-thinking/index.d.ts" />
var express = require('express');
var router = express.Router();
var { sha1 } = require('../utils');

var personnel = require('../data/__fake').personnel;

/* GET users listing. */
router.get('/login', function(req, res, next) {
  res.render('login');
});

router.post('/login', (req, res) => {
  let user = personnel.find(u => u.id === Number(req.body.id) &&
    u.password === sha1(req.body.password));
  if (!user) return res.render('login', { err: 'Bad id or password' });
  req.session.regenerate((err) => {
    if (err) return res.render('login', { err: err });
    Object.assign(req.session, { user: user });
    req.session.save(() => res.redirect('/'));
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
    
    return res.json({ err: 'Permisson Denied' });
  }
};

router.isLogin = function isLogin(req, res, next) {
    let loggedIn = Boolean(req.session.user);
    if (loggedIn) next();
    else res.redirect(302, '/personnel/login');
}

module.exports = router;