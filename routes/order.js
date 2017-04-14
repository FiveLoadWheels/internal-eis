var express = require('express');
var router = express.Router();
var datatypes = require('eis-thinking/lib/datatypes');
var { handleOrder } = require('eis-thinking/lib/handle-order');
var { OrderStatus } = datatypes;

// faking
let orders = {
    '23': createFakeOrder('23', OrderStatus.DeliveryStarted),
    '25': createFakeOrder('25', OrderStatus.DeliveryStarted),
    '28': createFakeOrder('28', OrderStatus.ProcessFinished)
}


router.get('/view/:id', (req, res) => {
    let order = orders[req.params.id];
    res.render('order', {
        orderPage: {
            objectives: Object.values(orders).map(o => getOrderState(o)),
            order: getOrderState(order),
            currentObj: req.params.id,
            OrderStatus
        }
    });
});

router.post('/handle/:id', (req, res) => {
    console.log(req.body);
    // get order
    let order = orders[req.params.id];
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

/** @returns {datatypes.IOrder} */
function createFakeOrder(id, status) {
    let orderProto = {
        id: id,
        ctime: Date.now(),
        mtime: Date.now(),
        type: 1,
        status: status,
        customer: {
            id: 'uid',
        },
        products: [
            {
                id: 'pid',
                serial_number: '0x000fffabcde',
                status: 1
            }
        ],
        requirement: [],
        logistics: {
            id: 'lid',
            mtime: Date.now(),
            ctime: Date.now(),
            fromLoc: '',
            toLoc: '',
            arriveTime: undefined
        }
    };

    return orderProto;
}

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