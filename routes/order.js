/// <reference path="../node_modules/eis-thinking/index.d.ts" />
var express = require('express');
var router = express.Router();
var { handleOrder, datatypes } = require('eis-thinking');
var { OrderStatus, PersonnelRole } = datatypes;
var { checkRole, isLogin } = require('./personnel');

var orders = require('../data/__fake').orders;

var orderRole = checkRole(hasActableRole);
// 屏蔽角色权限
orderRole = checkRole(val => true);

router.get('/view/:id', isLogin, (req, res) => {
    let order = orders.find(o => o.id === Number(req.params.id));
    res.render('order', {
        title: 'Order #' + order.id,
        orderPage: {
            objectives: req.query.filter ?
                [getOrderState(order)] :
                orders.map(o => getOrderState(o)).filter(o => hasReadableRole(o, req.session.user.role)),
            order: getOrderState(order),
            OrderStatus,
        },
        _query: req.query
    });
});

router.post('/handle/:id',
    (req, res, next) => { req.roleTarget = orders.find(o => o.id === Number(req.params.id)); next() },
    orderRole,
    (req, res) => {
    console.log(req.body);
    // get order
    let order = req.roleTarget;
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
 * @param {EIS.Datatypes.IOrder} order 
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
            { id: 'START_DELIVERY', viewName: 'Start Delivery' }
        ];
    case OrderStatus.DeliveryStarted:
        return [
            { id: 'END_DELIVERY', viewName: 'End Delivery' }
        ];
    case OrderStatus.DeliveryFinished:
        return [];
    case OrderStatus.Closed:
        return [];
    default:
        return [];
    }
}

// 列表查看权 - 检查具有 role 身份的用户是否具有在左侧列表显示该记录的权限
function hasReadableRole(o, role) {
    switch (role) {
    // Production具有: 支付已经结束，且生产没有完成的订单的查看权
    case PersonnelRole.Production:
        return o.status >= OrderStatus.CustomerAcknowledged && o.status <= OrderStatus.ProcessStarted;
    // Logisitics具有: 生产已经结束，且没有完成配送的订单的查看权
    case PersonnelRole.Logistics:
        return o.status >= OrderStatus.ProcessFinished && o.status <= OrderStatus.DeliveryStarted;
    // 不作限制
    case PersonnelRole.HumanResource:
    case PersonnelRole.Finance:
    case PersonnelRole.CustomerService:
        return true;
    default:
        return false;
    }
}

// 动作执行权 - 检查具有 role 身份的用户是否有对该记录执行修改动作的权限
function hasActableRole(o, role) {
    switch (role) {
    // Production具有: 支付已经结束，且生产没有完成的订单的动作执行权
    case PersonnelRole.Production:
        return o.status >= OrderStatus.CustomerAcknowledged && o.status < OrderStatus.ProcessFinished;
    // Logisitics具有: 生产已经结束，且没有完成配送的订单的动作执行权
    case PersonnelRole.Logistics:
        return o.status >= OrderStatus.ProcessFinished && o.status < OrderStatus.DeliveryFinished;
    // CustomerService具有: 已经完成创建，且用户没有完成支付的订单的动作执行权（特指修改权）
    case PersonnelRole.CustomerService:
        return o.status >= OrderStatus.Created && o.status < OrderStatus.CustomerAcknowledged;
    // 不能操作
    case PersonnelRole.HumanResource:
    case PersonnelRole.Finance:
        return false;
    default:
        return false;
    }
}