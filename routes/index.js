var express = require('express');
var router = express.Router();

var { isLogin } = require('./user');
// var { orders, products, operations } = require('../storage/__fake');
var { datatypes } = require('eis-order-handling');
var { PersonnelRole, OperationTarget } = datatypes;
var { Operation, Order } = require('../storage/models');
var { getRoleScope } = require('./order');

function getOwnOps(req, res, next) {
  Operation.findAll({ where: { uid: req.session.user.id }, order:[['ctime', 'DESC']] }).then(ops => {
    req.operations = ops;
    next();
  }).catch(err => next(err));
}

function getOrderCount(req, res, next) {
  Order.count({ where: getRoleScope(req.session.user.role) }).then(c => {
    req.orderCount = c;
    next();
  }).catch(err => next(err));
}

/* GET home page. */
router.get('/', isLogin, getOwnOps, getOrderCount, function(req, res, next) {
  res.render('index', {
    title: 'Welcome',
    indexPage: {
      dept: PersonnelRole[req.session.user.role].toLowerCase() + ' department',
      orderCount: req.orderCount,
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
