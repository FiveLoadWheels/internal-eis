const { Order, Product } = require('./models');
const createProduct = require('./product').create;
const saveProduct = require('./product').save;

exports.create = function create(o) {
    let products = o.products;
    delete o.products;

    return Order.create(o).then(order => {
        products.forEach(product => product.oid = order.id);
        return Promise.all(o.products.map(createProduct));
    }).then(savedProducts => {
        order.products = savedProducts;
        return order;
    });
}

exports.save = function save(order) {
    let products = order.products;
    delete products;
    return Promise.all(products.map(saveProduct)).then(() => {
        return order.save();
    });
}

exports.findById = function findById(id) {
    let order;
    return Order.findById(id).then((_order) => {
        order = _order;
        return populateProducts(order);
    });
}

exports.populateProducts = function populateProducts(order) {
    return Product.findAll({
        where: { 'oid': order.id }
    }).then(products => {
        order.products = products;
        return order;
    });
}