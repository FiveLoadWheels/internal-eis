var datatypes = require('eis-thinking/lib/datatypes');
var { handleOrder, handleProduct } = require('eis-thinking');
var { OrderStatus, ProductStatus, PersonnelRole } = datatypes;
var { sha1 } = require('../utils');

// faking

let products = [
    createFakeProduct(1, ProductStatus.Initialized, 63),
    createFakeProduct(2, ProductStatus.Initialized, 63),
];

let orders = [
    createFakeOrder(63, OrderStatus.ProcessStarted, [
        createFakeProduct(1, ProductStatus.ComponentEnsured, 63),
        createFakeProduct(2, ProductStatus.Initialized, 63),
    ]),
    createFakeOrder(23, OrderStatus.DeliveryStarted, [
        createFakeProduct(1, ProductStatus.Ready, 63),
        createFakeProduct(2, ProductStatus.Ready, 63),
    ]),
];

let users = [
    createUser(400132, '1008611', 'Kai-shek', 'Chiang', PersonnelRole.Logistics),
    createUser(400135, '1008611', 'Nick', 'Ng', PersonnelRole.Production)
];

<<<<<<< HEAD
let records = [
    createFinanceRec(666666, 'salary', 666666, '1234567890'),
    createFinanceRec(888888, 'salary', 888888, '1234567890'),
    createFinanceRec(888888, 'sales', 888888, '1234567890'),
];

exports.products = products;
exports.orders = orders;
=======
// exports.products = products;
// exports.orders = orders;
>>>>>>> 610804898f94410dcbb74103b8e38051c7bf8863
exports.users = users;
exports.records = records;  
exports.operations = [];
exports.createFakeOrder = createFakeOrder;
exports.createFakeProduct = createFakeProduct;


/** @returns {datatypes.IOrder} */
function createFakeOrder(id, status, products) {
    let orderProto = {
        // id: id,
        ctime: Date.now(),
        mtime: Date.now(),
        status: status,
        cid: 22,
        products: products || [],
        arriveTime: undefined,
        address: 'Somewhere'
    };

    return orderProto;
}



function createFakeProduct(id, status, oid) {
    return {
        // id: id,
        serialNumber: 'seri' + (+new Date) + Math.random(),
        status: status,
        modelId: 1,
        // oid: oid,
        accessoryIds: [
            1, 2
        ],
        ctime: Date.now(),
        mtime: Date.now(),
    }
}

function createUser(id, password, firstName, lastName, role) {
    return {
        id: id,
        firstName: firstName,
        lastName: lastName,
        lastLogin: Date.now(),
        ctime: Date.now(),
        mtime: Date.now(),
        retireTime: null,
        tel: '000-0000000',
        password: sha1(password),
        salary: 1234567890,
        role: role
    };
}

function createFinanceRec(id, type, amount, description) {
    return {
        id: id,
        type: type,
        ctime: Date.now(),
        mtime: Date.now(),
        amount: amount,
        description: description,
    };
}