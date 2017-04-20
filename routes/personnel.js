var express = require('express');
var router = express.Router();

var { datatypes } = require('eis-thinking');
var { PersonnelRole, OperationTarget } = datatypes;
var { Operation, Users } = require('../storage/models');

var users = require('../storage/__fake').users;

// function getUser(req, res, next) {
//     User.findAll({}).then()
// }

router.get('/', (req, res) => {
    res.render('personnel', {
        title: 'HR',
        personnelPage: {
            users: users
        }
    });
});

router.get('/view/:id', (req, res) => {
    let user = users.find(u => u.id === Number(req.params.id));
    res.render('personnel', {
        title: 'User #' + user.id,
        personnelPage: {
            users: req.query.filter ? [user] : users,
            user: user
        }
    })
});

router.post('/handle/:id', (req, res) => {
    let user = users.find(u => u.id === Number(req.params.id));
    let action = req.body;
    switch (action.type) {
    case 'MODIFY_USER':

    break;

    case 'DELETE_USER':

    break;

    case 'ADD_USER':

    break;
    }
});

function getOpList(req, res, next) {
    Operation.findAll().then(ops => {
        req.operations = ops.map(op => op.toJSON());
        console.log('ops', req.operations);
        req.operations.forEach(op => {
            op.user = users.find(u => u.id === op.uid);
        });
        next();
    }).catch(err => {
        next(err);
    });
}

function viewOp(op) {
  return Object.assign({
    actionName: actionTypeToStat(JSON.parse(op.action).type),
    targetTypeName: OperationTarget[op.targetType],
    targetUrl: `/${OperationTarget[op.targetType].toLowerCase()}/view/${op.targetId}`
  }, op);
}

function actionTypeToStat(actionType) {
  return actionType.split('_').map(n => n.toLowerCase()).join(' ');
}

router.get('/global', getOpList, (req, res, next) => {
    res.render('global-status', {
        title: 'Global Status',
        globalStatusPage: {
            operations: req.operations.map(viewOp)
        }
    });
});

module.exports = router;