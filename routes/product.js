var express = require('express');
var router = express.Router();
var { handleOrder, handleProduct, datatypes } = require('eis-thinking');
var { OrderStatus, ProductStatus } = datatypes;

var orders = require('../storage/__fake').orders;
var products = require('../storage/__fake').products;

router.get('/view/:id', (req, res) => {
    let product = products.find(p => p.id === Number(req.params.id));
    res.render('product', {
        title: 'Product #' + product.id,
        productPage: {
            objectives: req.query.filter ?
                [getProductState(product)] :
                products.map(o => getProductState(o)).filter(o => o.status >= ProductStatus.Initialized),
            product: getProductState(product),
            ProductStatus,
        },
        _query: req.query
    });
});

router.post('/handle/:id', (req, res) => {
    console.log(req.body);
    // get order
    let product = products.find(p => p.id === Number(req.params.id));
    Promise.resolve(handleProduct(product, req.body))
    .then(() => {
        // save product and get order
        console.log(`Order #${product.oid} of product #${product.id}`, orders.find(o => o.id === product.oid));
        return orders.find(o => o.id === product.oid);
    })
    .then((order) => {
        // peer handle
        return handleOrder(order, { type: 'UPDATE_PRODUCT_PROCESS', payload: null });
        // then save order;
    })
    .then(() => {
        res.json({ error: null });
    })
    .catch((err) => {
        res.json({ error: err });
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
function getProductState(product) {
    return Object.assign({
        statusName: ProductStatus[product.status],
        availableActions: getAvailableActions(product.status)
    }, product);
}

function getAvailableActions(status) {
    switch (status) {
    
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

function matchRole(o, role) {
    switch (role) {
    case 'Production':
        return true;
    default:
        return false;
    }
}