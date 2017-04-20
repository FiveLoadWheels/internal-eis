/// <reference path="../node_modules/eis-thinking/index.d.ts" />
var express = require('express');
var router = express.Router();
var { handleOrder, datatypes } = require('eis-thinking');
var { OrderStatus, ProductStatus, PersonnelRole, OperationTarget } = datatypes;
var { checkRole, isLogin, checkPasswordConfirm } = require('./user');

var stor = require('../storage');
var { Operation, FinanceRecords } = require('../storage/models');
// var { operations } = require('../storage/__fake');

var orderRole = checkRole(hasActableRole);
// 屏蔽角色权限
// orderRole = checkRole(val => true);

function getOrder(req, res, next) {
    let oid = Number(req.params.id);
    if (oid === 0) {
        req.order = null;
        return next();
    }
    stor.orders.get(oid).then(order => {
        req.order = req.roleTarget = order;
        next();
    }).catch(err => {
        next(err);
    });
}

function getOrderList(req, res, next) {
    stor.orders.getList({
        where: getListViewCond(req.session.user.role)
    }).then(orders => {
        req.orders = orders;
        next();
    }).catch(err => {
        next(err);
    })
}

router.get('/view/:id', isLogin, getOrder, getOrderList, (req, res) => {
    let order = req.order;
    let orders = req.orders;
    let user = req.session.user;
    let orderState = order ? getOrderState(order, user) : null;
    res.render('order', {
        title: order ? 'Order #' + order.id : 'Orders',
        orderPage: {
            objectives: req.query.filter ?
                [orderState] :
                orders.map(o => getOrderState(o, user)),
            order: orderState,
            OrderStatus,
            ProductStatus
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
        Operation.create({
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

// ipc job
router.get('/ack/:id', getOrder, (req, res, next) => {
    handleOrder(req.order, {
        type: 'CUSTOMER_ACK',
        payload: {
            resolved: true
        }
    });

    FinanceRecords.create({
        type: 'Sales',
        amount: req.order.price,
        description: 'Sales of Order #' + req.params.id,
        ctime: Date.now()
    });

    stor.orders.save(req.order)
        .then(() => res.json({ err: null }))
        .catch(err => {
            console.error(err);
            res.json({ err: err })
        });
})

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
            { id: '', viewName: 'Start Process' , disabled: '(Perform automatically when product process starts)'}
        ];
    case OrderStatus.ProcessStarted:
        return [
            { id: '', viewName: 'End Process' , disabled: '(Perform automatically when product process all finished)'}
        ];
    case OrderStatus.ProcessFinished:
        return [
            { id: 'START_DELIVERY', viewName: 'Start Delivery', disabled: whenNotPermitted(order, user.role) }
        ];
    case OrderStatus.DeliveryStarted:
        return [
            { id: 'END_DELIVERY', viewName: 'End Delivery', disabled: whenNotPermitted(order, user.role) }
        ];
    case OrderStatus.DeliveryFinished:
        return [];
    case OrderStatus.Closed:
        return [];
    default:
        return [];
    }
}

function whenNotPermitted(order, role) {
    return !hasActableRole(order, role) ? 'Permission Denied' : null;
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
    case PersonnelRole.Sales:
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
        return { status: { $gte: OrderStatus.Created, $lt: OrderStatus.ProcessFinished } };
    // Logisitics具有: 生产已经结束，且没有完成配送的订单的查看权
    case PersonnelRole.Logistics:
        return { status: { $gte: OrderStatus.ProcessFinished , $lt: OrderStatus.DeliveryFinished } };
    // 不作限制
    case PersonnelRole.HumanResource:
    case PersonnelRole.Finance:
    case PersonnelRole.Sales:
        return {};
    default:
        return { status: -1 };
    }
}

router.getRoleScope = getListViewCond;

// 动作执行权 - 检查具有 role 身份的用户是否有对该记录执行修改动作的权限
function hasActableRole(o, role) {
    switch (role) {
    // Production具有: 支付已经结束，且生产没有完成的订单的动作执行权
    case PersonnelRole.Production:
        return o.status >= OrderStatus.CustomerAcknowledged && o.status < OrderStatus.ProcessFinished;
    // Logisitics具有: 生产已经结束，且没有完成配送的订单的动作执行权
    case PersonnelRole.Logistics:
        return o.status >= OrderStatus.ProcessFinished && o.status < OrderStatus.DeliveryFinished;
    // Sales具有: 已经完成创建，且用户没有完成支付的订单的动作执行权（特指修改权）
    case PersonnelRole.Sales:
        return o.status >= OrderStatus.Created && o.status < OrderStatus.CustomerAcknowledged;
    // 不能操作
    case PersonnelRole.HumanResource:
    case PersonnelRole.Finance:
        return false;
    default:
        return false;
    }
}