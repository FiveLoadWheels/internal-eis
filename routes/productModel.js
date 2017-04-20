var express = require('express');
var router = express.Router();
var { isLogin, checkRole } = require('./user');
var { datatypes } = require('eis-thinking');
var { PersonnelRole } = datatypes;
var stor = require('../storage');
var { Accessory } = require('../storage/models');

function getOne(req, res, next) {
    let id = Number(req.params.id);
    if (id === 0) return next(); // blank page
    stor.productModels.get(id).then(productModel => {
        req.productModel = req.roleTarget = productModel;
        next();
    }).catch(err => next(err));
}

function getList(req, res, next) {
    stor.productModels.getList().then(productModels => {
        req.productModels = productModels;
        next();
    }).catch(err => next(err));
}

function hasActableRole(mod, role) {
    return role === 1; // PersonnelRole.Sales;
}

function allAcc(req, res, next) {
    Accessory.findAll().then(allAccessories => {
        req.allAccessories = allAccessories;
        next();
    }).catch(err => next(err));
}

function getViewState(mod, user) {
    return Object.assign({}, mod.toJSON(), { accessoryIds: mod.accessoryIds });
}

let salesOnly = checkRole(hasActableRole);

router.get('/view/:id', isLogin, getOne, getList, allAcc, (req, res) => {
    let { productModel, productModels, allAccessories, user } = req;
    let productModelState = productModel ? getViewState(productModel, user) : null;
    res.render('productModel', {
        title: productModel ? 'Model: ' + productModel.modelName : 'Models',
        productModelPage: {
            productModel: productModelState,
            productModels: productModels.map(mod => getViewState(mod, user)),
            allAccessories: allAccessories
        }
    });
});

router.post('/update/:id', isLogin, getOne, (req, res, next) => {
    let { productModel, user } = req;
    let modelId = productModel.id;
    let newAccIds = Object.entries(req.body).filter(e => /acc-/.test(e[0]) && e[1] === 'on').map(e => {
        return Number(e[0].split('-')[1]);
    });
    // console.log('newAccs', newAccs);
    productModel.primaryPrice = Number(req.body.primaryPrice);
    productModel.modelName = req.body.modelName;
    productModel.accessoryIds = newAccIds;
    productModel.imageUrl = req.body.imageUrl;
    stor.productModels.save(productModel).then(() => {
        res.redirect(302, '/productModel/view/' + modelId);
    }).catch(err => {
        console.error(err);
        next(err);
    });
});

router.get('/create', isLogin, allAcc, (req, res, next) => {
    res.render('productModel-create', {
        title: 'Create New Model',
        productModelCreatePage: {
            allAccessories: req.allAccessories
        }
    })
});

router.post('/create', isLogin, (req, res, next) => {
    let productModel = {};

    let newAccIds = Object.entries(req.body).filter(e => /acc-/.test(e[0]) && e[1] === 'on').map(e => {
        return Number(e[0].split('-')[1]);
    });
    // console.log('newAccs', newAccs);
    productModel.primaryPrice = Number(req.body.primaryPrice);
    productModel.modelName = req.body.modelName;
    productModel.imageUrl = req.body.imageUrl;
    productModel.accessoryIds = newAccIds;
    productModel.screenSize = 25;

    stor.productModels.create(productModel).then((modelId) => {
        res.redirect(302, '/productModel/view/' + modelId);
    }).catch(err => {
        console.error(err);
        next(err)
    });
});

module.exports = router;