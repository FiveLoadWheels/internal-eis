var express = require('express');
var router = express.Router();

var { isLogin, checkRole, checkPasswordConfirm } = require('./user');
var { datatypes } = require('eis-thinking');
var { PersonnelRole, OperationTarget } = datatypes;
var { Operation, Users } = require('../storage/models');
var { sha1 } = require('../utils');

// var users = require('../storage/__fake').users;
var hrOnly = checkRole((target, role) => role === PersonnelRole.HumanResource);

function findUsers(req, res, next) {
    Users.findAll({}).then( (allUsers) => {
        req.allUsers = allUsers;
        next();
    }).catch(err => next(err));
}

function findUser(req, res, next) {
    if (req.params.id) {
        Users.findById(Number(req.params.id)).then( (user) => {
            req.user = user;
            next();
        }).catch(err => next(err));
    } else {
        req.user = 0;
        next();
    }
}

router.get('/', isLogin, hrOnly, findUser, findUsers, (req, res) => {
    res.render('personnel', {
        title: 'HR',
        personnelPage: {
            users: req.allUsers,
            user: req.user
        }
    });
});

router.get('/view/:id', isLogin, hrOnly, findUser, findUsers, (req, res) => {
    res.render('personnel', {
        title: 'User #' + req.user.id,
        personnelPage: {
            users: req.query.filter ? [req.user] : req.allUsers,
            user: req.user
        }
    })
});

router.post('/handle/:id', hrOnly, checkPasswordConfirm, (req, res) => {
    let user = Users.findById(req.params.id);
    let action = req.body;
    switch (action.type) {
    case 'MODIFY_USER':
        Users.findById(Number(action.payload.id)).then( (u) => {
            u.password = sha1(action.payload.password);
            u.firstName = action.payload.firstName;
            u.role = action.payload.role;
            u.salary = action.payload.salary;
            u.tel = action.payload.tel;
            return u.save();
        })
            .then( () => {res.json({ err:null })})
            .catch((err) => {
                res.json(   { err: String(err) });
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
            .create(Object.assign(action.payload, { ctime: Date.now(), password: sha1(action.payload.password) }))
            .then(() => res.json({ err: null })).catch(err => res.json({ err: err }));
    break;
    }
});

function getOpList(req, res, next) {
    Operation.findAll().then(ops => {
        req.operations = ops.map(op => op.toJSON());
        console.log('ops', req.operations);
        Promise.all(req.operations.map(op => Users.findOne({ where: { account: op.uid } }))).then(users => {
            users.forEach((u, i) => req.operations[i].user = u ? u.toJSON() : null);
            req.operations = req.operations.filter(op => op.user);
            next();
        }).catch(err => {
            next(err); console.error(err);
        });
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

router.get('/global', isLogin, hrOnly, getOpList, (req, res, next) => {
    res.render('global-status', {
        title: 'Global Status',
        globalStatusPage: {
            operations: req.operations.map(viewOp)
        }
    });
});

module.exports = router;