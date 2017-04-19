var express = require('express');
var router = express.Router();
var { handleOrder, handleProduct, datatypes } = require('eis-thinking');
var { OrderStatus, ProductStatus, PersonnelRole, OperationTarget } = datatypes;
var { checkRole, isLogin, checkPasswordConfirm } = require('./user');

var stor = require('../storage');
var { operations } = require('../storage/__fake');

var productActableRole = checkRole(hasActableRole);

function getProduct(req, res, next) {
    stor.products.get(Number(req.params.id)).then(product => {
        req.product = req.roleTarget = product;
        next();
    });
}

function getProductList(req, res, next) {
    stor.products.getList({
        where: { status: { gt: 1 } }
    }).then(products => {
        req.products = products;
        next();
    })
}

router.get('/view/:id', isLogin, getProduct, getProductList, (req, res) => {
    let product = req.product;
    let products = req.products;
    let user = req.session.user;
    res.render('product', {
        title: 'Product #' + product.id,
        productPage: {
            objectives: req.query.filter ?
                [getProductState(product, user)] :
                products.map(o => getProductState(o, user)),
            product: getProductState(product, user),
            ProductStatus,
        },
        _query: req.query
    });
});

router.post('/handle/:id', getProduct, productActableRole, checkPasswordConfirm, (req, res) => {
    console.log(req.body);
    // get order
    let product = req.product;
    Promise.resolve(handleProduct(product, req.body))
    .then(() => {
        // save operation record
        operations.push({
            uid: req.session.user.id,
            targetId: product.id,
            targetType: OperationTarget.Product,
            action: JSON.stringify(req.body),
            ctime: Date.now()
        });
        // save product and get order
        // console.log(`Order #${product.oid} of product #${product.id}`, orders.find(o => o.id === product.oid));
        return stor.products.save(product).then(() => stor.orders.get(product.oid));
    })
    .then((order) => {
        // peer handle
        handleOrder(order, { type: 'UPDATE_PRODUCT_PROCESS', payload: null });
        return stor.orders.save(order);
        // then save order;
    })
    .then(() => {
        res.json({ err: null });
    })
    .catch((err) => {
        console.error(err);
        res.json({ err: String(err) });
    });
});

router.get('/debug', (req, res) => {
    res.type('text/plain');
    res.send(JSON.stringify(products, null, 4));
});

module.exports = router;


/** 
 * @param {datatypes.IOrder} order 
 */
function getProductState(product, user) {
    return Object.assign({
        statusName: ProductStatus[product.status],
        availableActions: getAvailableActions(product, user)
    },
    product.toJSON(),
    { accessories: product.accessories },
    { productModel: product.productModel });
}

function getAvailableActions(product, user) {
    switch (product.status) {
    
    case ProductStatus.Initialized:
        return [ { id: 'UPDATE_ACCESSORY', viewName: 'Update Accessory Status' } ];
    case ProductStatus.ComponentEnsured:
        return [ { id: 'COMPLETE_ASSEMBLY', viewName: 'Complete Assembly' } ];
    case ProductStatus.AssemblyCompleted:
        return [ { id: 'PASS_CHECKING', viewName: 'Pass Checking' } ];
    case ProductStatus.Ready:
        return [];
    default:
        return [];
    }
}

function hasActableRole(o, role) {
    switch (role) {
    case PersonnelRole.Production:
        return true;
    default:
        return false;
    }
}