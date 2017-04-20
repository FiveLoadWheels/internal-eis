var express = require('express');
var router = express.Router();
var { isLogin, checkRole, checkPasswordConfirm } = require('./user');
var { FinanceRecords } = require('../storage/models');

var records = require('../storage/__fake').records;

function allRecs(req, res, next) {
    FinanceRecords.findAll().then( (allRecords) => {
        req.allRecords = allRecords;
        next();
    }).catch(err => next(err));
}

function findID(req, res, next) {
    if (req.query.id) {
        FinanceRecords.findById(req.query.id)
        .then( (allRecords) => {
            req.allRecords = allRecords;
            next();
        }).catch(err => next(err));
    } else {
        return next();
    }
}

function findMore(req, res, next) {
    if (!req.query.id) {
        FinanceRecords.findAll({
            where: {
                amount: req.query.StartAmount && req.query.EndAmount==99999999999999?
                    {$not: null}:
                    {$gte: req.query.StartAmount, $lte: req.query.EndAmount},
                ctime: req.query.StartTime=='' && req.query.EndTime==''?
                    {$not: null}:
                    {$gte: req.query.StartTime, $lte: req.query.EndTime},
                type: req.query.type? req.query.type:{$not: req.query.type}
            }
        }).then( (allRecords) => {
            req.allRecords = allRecords;
            next();
        }).catch(err => next(err));
    } else {
        return next();
    }
}

router.get('/', isLogin, allRecs, function(req, res, next) {
    let { allRecords } = req;
    res.render('finance', {
        title: 'Finance Records',
        financePage: {
            records: allRecords
        }
    });
});

router.get('/search', isLogin, findID, findMore, function(req, res, next) {
    let { allRecords } = req;
    res.render('finance', {
        title: 'Finance Records',
        financePage: {
            records: allRecords
        }
    });
});

router.post('/handle/:id', checkPasswordConfirm, (req, res) => {
    let action = req.body;
    switch (action.type) {
    case 'MODIFY_RECORD':
        // action.payload = {
        //     // uid: req.session.user,
        //     id: req.body.id,
        //     type: req.body.type,
        //     amount: req.body.amount,
        //     description: req.body.description,
        // };
        FinanceRecords.findById(Number(action.payload.id)).then( (record) => {
            record.type = action.payload.type;
            record.amount = action.payload.amount;
            record.description = action.payload.description;
            record.mtime = Date.now();
            return record.save();
        }).then(() => res.json({ err: null })).catch(err => res.json({ err: err }));
    break;

    case 'ADD_RECORD':
        // action.payload = {
        //     // uid: req.session.user,
        //     type: req.body.type,
        //     amount: req.body.amount,
        //     description: req.body.description,
        //     ctime: Date.now(),
        // };
        FinanceRecords
            .create(Object.assign(action.payload, { ctime: Date.now() }))
            .then(() => res.json({ err: null })).catch(err => res.json({ err: err }));
    break;
    }
});

module.exports = router;