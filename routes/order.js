/// <reference path="../node_modules/eis-thinking/index.d.ts" />
var express = require('express');
var router = express.Router();
var { handleOrder, datatypes } = require('eis-thinking');
var { OrderStatus, PersonnelRole, OperationTarget } = datatypes;
var { checkRole, isLogin, checkPasswordConfirm } = require('./user');

var stor = require('../storage');
var { Operation } = require('../storage/models');
var { operations } = require('../storage/__fake');

var orderRole = checkRole(hasActableRole);
// 屏蔽角色权限
// orderRole = checkRole(val => true);

function getOrder(req, res, next) {
    stor.orders.get(Number(req.params.id)).then(order => {
        req.order = req.roleTarget = order;
        next();
    });
}

function getOrderList(req, res, next) {
    stor.orders.getList({
        where: getListViewCond(req.session.user.role)
    }).then(orders => {
        req.orders = orders;
        next();
    })
}

router.get('/view/:id', isLogin, getOrder, getOrderList, (req, res) => {
    let order = req.order;
    let orders = req.orders;
    let user = req.session.user;
    res.render('order', {
        title: 'Order #' + order.id,
        orderPage: {
            objectives: req.query.filter ?
                [getOrderState(order, user)] :
                orders.map(o => getOrderState(o, user)),
            order: getOrderState(order, user),
            OrderStatus,
        },
        _query: req.query
    });
});

router.post('/handle/:id', getOrder, orderRole, checkPasswordConfirm, (req, res) => {
    console.log(req.body);
    // get order
    let order = req.order;
    Promise.resolve(handleOrder(order, req.body))
    .then(() => {
        operations.push({
            uid: req.session.user.id,
            targetId: order.id,
            targetType: OperationTarget.Order,
            action: JSON.stringify(req.body),
            ctime: Date.now()
        });
        // save order
        return stor.orders.save(order);
    })
    .then(() => res.json({ err: null }))
    .catch((err) => {
        res.json({ err: String(err) });
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
function getOrderState(order, user) {
    return Object.assign({
        statusName: OrderStatus[order.status],
        availableActions: getAvailableActions(order, user)
    },
    order.toJSON(),
    { products: order.products },
    { customer: order.customer });
}

function getAvailableActions(order, user) {
    switch (order.status) {
    
    case OrderStatus.Created:
        return [];
    case OrderStatus.CustomerAcknowledged:
        return [
            { id: '', viewName: 'Start Process (Perform automatically when product process starts)' , disabled: true}
        ];
    case OrderStatus.ProcessStarted:
        return [
            { id: '', viewName: 'End Process (Perform automatically when product process all finish)' , disabled: true}
        ];
    case OrderStatus.ProcessFinished:
        return [
            { id: 'START_DELIVERY', viewName: 'Start Delivery', disabled: !hasActableRole(order, user.role) }
        ];
    case OrderStatus.DeliveryStarted:
        return [
            { id: 'END_DELIVERY', viewName: 'End Delivery', disabled: !hasActableRole(order, user.role) }
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

// 列表查看权(Cond) - 检查具有 role 身份的用户是否具有在左侧列表显示该记录的权限
function getListViewCond(role) {
    switch (role) {
    // Production具有: 支付已经结束，且生产没有完成的订单的查看权
    case PersonnelRole.Production:
        return { status: { $gte: OrderStatus.CustomerAcknowledged, $lt: OrderStatus.ProcessFinished } };
    // Logisitics具有: 生产已经结束，且没有完成配送的订单的查看权
    case PersonnelRole.Logistics:
        return { status: { $gte: OrderStatus.ProcessFinished , $lt: OrderStatus.DeliveryFinished } };
    // 不作限制
    case PersonnelRole.HumanResource:
    case PersonnelRole.Finance:
    case PersonnelRole.CustomerService:
        return {};
    default:
        return { status: -1 };
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