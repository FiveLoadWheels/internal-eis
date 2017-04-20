var express = require('express');
var router = express.Router();

var { isLogin, checkRole, checkPasswordConfirm } = require('./user');
var { datatypes } = require('eis-thinking');
var { PersonnelRole, OperationTarget } = datatypes;
var { Operation, Users } = require('../storage/models');

var users = require('../storage/__fake').users;

function findUsers(req, res, next) {
    Users.findAll({}).then( (allUsers) => {
        req.allUsers = allUsers;
        next();
    }).catch(err => next(err));
}

function findUser(req, res, next) {
    Users.findById(Number(req.params.id)).then( (user) => {
        req.user = user;
        next();
    }).catch(err => next(err));
}

router.get('/', isLogin, findUsers, (req, res) => {
    let { allUsers } = req;
    console.log(allUsers);
    res.render('personnel', {
        title: 'HR',
        personnelPage: {
            users: allUsers
        }
    });
});

router.get('/view/:id', isLogin, findUser, findUsers, (req, res) => {
    res.render('personnel', {
        title: 'User #' + req.user.id,
        personnelPage: {
            users: req.query.filter ? [req.user] : req.allUsers,
            user: req.user
        }
    })
});

router.post('/handle/:id', checkPasswordConfirm, (req, res) => {
    let user = Users.findById(req.params.id);
    let action = req.body;
    switch (action.type) {
    case 'MODIFY_USER':
        Users.findById(Number(action.payload.id)).then( (u) => {
            u.password = action.payload.password;
            u.firstName = action.payload.firstName;
            u.role = action.payload.role
            u.salary = action.payload.salary;
            u.tel = action.payload.tel;
            return u.save();
        })
            .then( () => {res.json({ err:null })})
            .catch((err) => {
                res.json({ err: String(err) });
            });
    break;

    case 'DELETE_USER':
        Users.findById(Number(req.params.id)).then( (u) => {
            return u.destroy();
        })
            .then( () => {
                res.redirect(302, '/personnel/view/1');
            })
            .catch((err) => {
                res.json({ err: String(err) });
            });
    break;

    case 'ADD_USER':
        Users
            .create(Object.assign(action.payload, { ctime: Date.now() }))
            .then(() => res.json({ err: null })).catch(err => res.json({ err: err }));
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