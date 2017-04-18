var express = require('express');
var router = express.Router();

var { isLogin } = require('./user');
var { orders, products, operations } = require('../storage/__fake');
var { datatypes } = require('eis-thinking');
var { PersonnelRole, OperationTarget } = datatypes;

/* GET home page. */
router.get('/', isLogin, function(req, res, next) {
  res.render('index', {
    title: 'Welcome',
    indexPage: {
      dept: PersonnelRole[req.session.user.role].toLowerCase() + ' department',
      orderCount: 88,
      operations: operations.filter(op => op.uid === req.session.user.id).map(viewOp)
    }
  });
});

function viewOp(op) {
  return Object.assign({
    actionName: actionTypeToStat(JSON.parse(op.action).type),
    targetTypeName: OperationTarget[op.targetType]
  }, op);
}

function actionTypeToStat(actionType) {
  return actionType.split('_').map(n => n.toLowerCase()).join(' ');
}

module.exports = router;
