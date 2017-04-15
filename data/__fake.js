var datatypes = require('eis-thinking/lib/datatypes');
var { handleOrder } = require('eis-thinking/lib/handle-order');
var { OrderStatus, ProductStatus } = datatypes;

// faking

let products = [
    createFakeProduct(1, ProductStatus.Initialized, 63),
    createFakeProduct(2, ProductStatus.Initialized, 63),
];

let orders = [
    createFakeOrder(63, OrderStatus.ProcessStarted, products.slice(0,2)),

    createFakeOrder(23, OrderStatus.DeliveryStarted, products.slice()),
    createFakeOrder(25, OrderStatus.DeliveryStarted, products.slice()),
    createFakeOrder(28, OrderStatus.ProcessFinished, products.slice()),
    createFakeOrder(32, OrderStatus.DeliveryStarted, products.slice()),
    createFakeOrder(35, OrderStatus.DeliveryStarted, products.slice()),
    createFakeOrder(38, OrderStatus.ProcessFinished, products.slice()),
    createFakeOrder(46, OrderStatus.ProcessFinished, products.slice()),
    createFakeOrder(47, OrderStatus.ProcessFinished, products.slice()),
    createFakeOrder(49, OrderStatus.ProcessFinished, products.slice()),
    createFakeOrder(50, OrderStatus.ProcessFinished, products.slice()),
    createFakeOrder(51, OrderStatus.DeliveryStarted, products.slice()),
    createFakeOrder(53, OrderStatus.ProcessFinished, products.slice()),
    createFakeOrder(55, OrderStatus.DeliveryStarted, products.slice()),
];

exports.products = products;
exports.orders = orders;




/** @returns {datatypes.IOrder} */
function createFakeOrder(id, status, products) {
    let orderProto = {
        id: id,
        ctime: Date.now(),
        mtime: Date.now(),
        status: status,
        customer: {
            id: 22,
        },
        products: products || [],
        arriveTime: undefined,
        address: 'Somewhere'
    };

    return orderProto;
}



function createFakeProduct(id, status, oid) {
    return {
        id: id,
        serialNumber: undefined,
        status: status,
        modelId: 0,
        oid: oid,
        accessories: [
            {
                id: 1,
                modelName: 'Kingston 8G',
                supplierId: 12, // Kingston
                type: 'Memory',
                purchasePrice: 120.0,
                quantity: 99
            }
        ]
    }
}

