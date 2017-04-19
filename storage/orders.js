const { Order, Product, Customer } = require('./models');
const productStorage = require('./products');

exports.create = function create(o) {
    let products = o.products;
    let order;
    delete o.products;

    return Order.create(o).then(_order => {
        order = _order;
        products.forEach(product => product.oid = order.id);
        return Promise.all(products.map(productStorage.create));
    }).then(savedProductIds => {
        return order.id;
    });
}

exports.save = function save(order) {
    // let products = order.products;
    delete order.products;
    delete order.customer;
    // return Promise.all(products.map(productStorage.save)).then(() => {
        return order.save();
    // });
}

exports.get = function get(id) {
    let order;
    return Order.findById(id).then((_order) => {
        order = _order;
        return Promise.all([
            populateProducts(order),
            populateCustomer(order)
        ]);
    }).then(() => {
        return order;
    });
}

exports.getList = function getList(options) {
    return Order.findAll(options);
}

function populateProducts(order) {
    return productStorage.getList({
        where: { 'oid': order.id }
    }).then(products => {
        // populate products (item: rw, list: ro)
        order.products = products;
        return order;
    });
}

function populateCustomer(order) {
    Customer.findById(order.cid).then(customer => {
        // populated customer (ro)
        order.customer = customer;
    });
}