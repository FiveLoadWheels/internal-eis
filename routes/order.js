var express = require('express');
var router = express.Router();
var datatypes = require('eis-thinking/lib/datatypes');
var { handleOrder } = require('eis-thinking/lib/handle-order');
var { OrderStatus } = datatypes;

var orders = require('../data/__fake').orders;

router.get('/view/:id', (req, res) => {
    let order = orders.find(o => o.id === Number(req.params.id));
    res.render('order', {
        title: 'Order #' + order.id,
        orderPage: {
            objectives: req.query.filter ?
                [getOrderState(order)] :
                orders.map(o => getOrderState(o)).filter(o => matchRole(o, 'Logistics')),
            order: getOrderState(order),
            OrderStatus,
        },
        _query: req.query
    });
});

router.post('/handle/:id', (req, res) => {
    console.log(req.body);
    // get order
    let order = orders.find(o => o.id === Number(req.params.id));
    Promise.resolve(handleOrder(order, req.body))
    .then(() => {
        // save order
        res.json({ error: null });
    })
    .catch((err) => {
        res.json({ error: err });
    });
});

router.get('/debug', (req, res) => {
    res.type('text/plain');
    res.send(JSON.stringify(orders, null, 4));
});

module.exports = router;


/** 
 * @param {datatypes.IOrder} order 
 */
function getOrderState(order) {
    return Object.assign({
        statusName: OrderStatus[order.status],
        availableActions: getAvailableActions(order.status)
    }, order);
}

function getAvailableActions(status) {
    switch (status) {
    
    case OrderStatus.Created:
        return [];
    case OrderStatus.CustomerAcknowledged:
        return [];
    case OrderStatus.ProcessStarted:
        return [];
    case OrderStatus.ProcessFinished:
        return [
            { id: 'start-delivery', viewName: 'Start Delivery' }
        ];
    case OrderStatus.DeliveryStarted:
        return [
            { id: 'end-delivery', viewName: 'End Delivery' }
        ];
    case OrderStatus.DeliveryFinished:
        return [];
    case OrderStatus.Closed:
        return [];
    default:
        return [];
    }
}

function matchRole(o, role) {
    switch (role) {
    case 'Logistics':
        return o.status >= OrderStatus.ProcessFinished && o.status <= OrderStatus.DeliveryStarted;
    default:
        return false;
    }
}