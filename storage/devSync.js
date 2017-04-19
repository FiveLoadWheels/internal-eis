let stor = require('.');
let models = require('./models');
var { handleOrder, handleProduct, datatypes } = require('eis-thinking');
var { OrderStatus, ProductStatus, PersonnelRole } = datatypes;
let { createFakeOrder, createFakeProduct } = require('./__fake');

let orders = [
    createFakeOrder(63, OrderStatus.CustomerAcknowledged, [
        createFakeProduct(1, ProductStatus.Initialized, 63),
        createFakeProduct(2, ProductStatus.Initialized, 63),
    ]),
    createFakeOrder(23, OrderStatus.DeliveryStarted, [
        createFakeProduct(1, ProductStatus.Ready, 63),
        createFakeProduct(2, ProductStatus.Ready, 63),
    ]),
];

module.exports = function testSync() {
    // function insertOrder(next) {
    //     return next && stor.orders.create(next).then(oid => {
    //         console.log('oid', oid);
    //         return insertOrder(orders.shift());
    //     }).catch(err => {
    //         console.error(err);
    //     });
    // }

    // function insertMisc() {
    //     let accessories = [
    //         {
    //             modelName: 'Kingston 32GB',
    //             purchasePrice: 150,
    //             quantity: 90,
    //             type: 'Memory',
    //             supplierId: 1
    //         },
    //         {
    //             modelName: 'Nivdia Geforce GTX 1080',
    //             purchasePrice: 2000,
    //             quantity: 50,
    //             type: 'VideoCard',
    //             supplierId: 2
    //         }
    //     ].map(a => models.Accessory.create(a));

    //     let productModels = [
    //         {
    //             modelName: 'Dell c8888',
    //             primaryPrice: 1100,
    //             screen: 15
    //         }
    //     ].map(m => models.ProductModel.create(m));

    //     let suppliers = [
    //         {
    //             name: 'Kingston International',
    //             email: 'supply@kingston.net',
    //             tele: '000-0000-0000',
    //             address: 'xxxxxx'
    //         },
    //         {
    //             name: 'Nvidia Corperation',
    //             email: 'sup_hk@nvidia.com',
    //             tele: '000-0000-0000',
    //             address: 'yyyyyy'
    //         }
    //     ].map(s => models.Supplier.create(s));

    //     return Promise.all(accessories.concat(productModels, suppliers));
    // }

    let force = false;

    // let { Order, Accessory, Customer, Product, ProductAccMap, ProductModel, Operation } = models;

    return Promise.all([
        // models.Order.sync({ force }),
        // models.Accessory.sync({ force }),
        // models.Customer.sync({ force }),
        // models.Product.sync({ force }),
        // models.ProductAccMap.sync({ force }),
        // models.ProductModel.sync({ force }),
        // models.ProductModelAccMap.sync({ force }),
        models.Operation.sync({ force: true }),
        models.FinanceRecords.sync({ force:true }),
        // models.Supplier.sync({ force })
    ]).then(() => {
        return [
            insertOrder(orders.shift()),
            insertMisc(),
            insertRecords(),
        ];
    }).then(() => {
        console.log('DevSync done.');
    }).catch(err => {
        console.error(err);
    });

    function insertRecords() {
        let DefineRecs = models.FinanceRecords;
        let records = [
            {
                type: 'salary',
                amount: 666666,
                description: 'Salary of 06/2017',
                ctime: Date.now(),
            },
            {
                type: 'sales',
                amount: 888888,
                description: 'Sell 10 laptops',
                ctime: Date.now(),
            },
            {
                type: 'salary',
                amount: 686868,
                description: 'Salary of 07/2017',
                ctime: Date.now(),
            },
            {
                type: 'debt',
                amount: 10000000,
                description: 'Borrow money from HSBC',
                ctime: Date.now(),
            },
            {
                type: 'expense',
                amount: -989820,
                description: 'Pay for suppliers',
                ctime: Date.now(),
            },
        ].map(r => models.FinanceRecords.create(r));
        return Promise.all(records);
    };
}






// stor.orders.get(2).then(order => {
//     console.log(order.get('status'), order.get('arriveTime'));
//     handleOrder(order, {
//         type: 'END_DELIVERY',
//         payload: {
//             arriveTime: Date.now()
//         }
//     });

//     console.log(order.get('status'), order.get('arriveTime'), order.toJSON());
//     stor.orders.save(order);
// });

// stor.products.get(2).then(product => {
//     console.log(product.get('status'));
//     handleProduct(product, {
//         type: 'UPDATE_ACCESSORY',
//         payload: null
//     });

//     console.log(product.get('status'), product.toJSON());
//     stor.products.save(product);
// });