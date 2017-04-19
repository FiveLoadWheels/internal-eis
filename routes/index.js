var express = require('express');
var router = express.Router();

var { isLogin } = require('./user');
var { orders, products, operations } = require('../storage/__fake');
var { datatypes } = require('eis-thinking');
var { PersonnelRole, OperationTarget } = datatypes;
var { Operation } = require('../storage/models');

function getOwnOps(req, res, next) {
  Operation.findAll({ where: { uid: req.session.user.id } }).then(ops => {
    req.operations = ops;
    next();
  }).catch(err => next(err));
}

/* GET home page. */
router.get('/', isLogin, getOwnOps, function(req, res, next) {
  res.render('index', {
    title: 'Welcome',
    indexPage: {
      dept: PersonnelRole[req.session.user.role].toLowerCase() + ' department',
      orderCount: 88,
      operations: req.operations.map(viewOp)
    }
  });
});

function viewOp(op) {
  return Object.assign({
    actionName: actionTypeToStat(JSON.parse(op.action).type),
    targetTypeName: OperationTarget[op.targetType],
    targetUrl: `/${OperationTarget[op.targetType].toLowerCase()}/view/${op.targetId}`
  }, op.toJSON());
}

function actionTypeToStat(actionType) {
  return actionType.split('_').map(n => n.toLowerCase()).join(' ');
}

module.exports = router;
