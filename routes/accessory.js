const express = require('express');
const router = express.Router();
const { checkPasswordConfirm, checkRole, isLogin } = require('./user');
const { PersonnelRole, OperationTarget } = require('eis-order-handling').datatypes;
const { Accessory, Supplier, Operation } = require('../storage/models');

const productionOnly = checkRole((acc, role) => role === PersonnelRole.Production);

function getAcc(req, res, next) {
    let aid = Number(req.params.id);
    
    Accessory.findById(aid).then(acc => {
        req.accessory = acc;
        return Supplier.findById(acc.supplierId);
    }).then(supplier => {
        req.accessory.supplier = supplier;
        next();
    }).catch(err => next(err));
}

function getViewState(acc) {
    return Object.assign(acc.toJSON(), { supplier: acc.supplier.toJSON() });
}

router.get('/view/:id', isLogin, getAcc, (req, res, next) => {
    let accessory = req.accessory;
    res.render('accessory', {
        title: 'Accessory: ' + accessory.modelName,
        accessoryPage: {
            accessory: getViewState(accessory)
        }
    });
});

router.post('/edit/:id', productionOnly, checkPasswordConfirm, getAcc, (req, res, next) => {
    let accessory = req.accessory;
    accessory.quantity = Number(req.body.quantity);
    accessory.save().then(() => {
        res.redirect('/accessory/view/' + accessory.id);
    }).catch(err => next(err));
    Operation.create({
        uid: req.session.user.id,
        ctime: Date.now(),
        action: JSON.stringify({ type: 'ADD_ACCESSORY_INVENTORY', payload: { quantity: accessory.quantity } }),
        targetType: OperationTarget.Accessory,
        targetId: accessory.id
    });
});

module.exports = router;