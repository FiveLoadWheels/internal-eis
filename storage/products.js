const { Product, Order, ProductAccMap, Accessory, ProductModel } = require('./models');

exports.create = function create(p) {
    let product;
    let accessoryIds = p.accessoryIds;
    delete p.accessoryIds;

    return Product.create(p).then(_product => {
        product = _product;
        let createAccMaps = accessoryIds.map(aid => ProductAccMap.create({
            pid: product.id,
            aid: aid
        }));

        return Promise.all(createAccMaps);
    }).then(() => {
        return product.id;
    });
}

exports.save = function save(product) {
    let prevAccIds = product.prevAccIds;
    delete product.prevAccIds;
    let accessories = product.accessories;
    delete product.accessories;
    // delete readonly things
    delete product.productModel;

    let nextAccIds = accessories.map(acc => acc.id);
    let addAccIds = nextAccIds
        .filter(aid => prevAccIds.indexOf(aid) >= 0)
        .map(aid => ProductAccMap.create({
            aid: aid, pid: product.id
        }));
    let delAccIds = prevAccIds
        .filter(aid => nextAccIds.indexOf(aid) >= 0)
        .map(aid => ProductAccMap.destroy({
            where: { aid: aid, pid: product.id }
        }));
    
    return Promise.all([].concat(addAccIds, delAccIds)).then(() => {
        return Promise.all(accessories.map(acc => acc.save()));
    }).then(() => product.save());
}

exports.get = function get(id) {
    let product;
    return Product.findById(id).then(_product => {
        product = _product;

        return ProductAccMap.findAll({ where: { pid: product.id } });
    }).then(accMap => {
        product.prevAccIds = accMap.map(m => m.aid);

        return Accessory.findAll({ where: { id: product.prevAccIds } }); // WHERE IN ...
    }).then(accessories => {
        product.accessories = accessories;

        return ProductModel.findById(product.modelId);
    }).then(model => {
        product.productModel = model;
        return product;
    });
}

exports.getList = function getList(options) {
    return Product.findAll(options);
}