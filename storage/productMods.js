var { ProductModel, ProductModelAccMap, Accessory } = require('./models');

exports.create = function create(mod) {
    let accessoryIds = mod.accessoryIds;
    delete mod.accessoryIds;
    let productModel;

    return ProductModel.create(mod).then((_productModel) => {
        productModel = _productModel
        return Promise.all(
            accessoryIds.map(accId => ProductModelAccMap.create({ aid: accId, modelId: productModel.id }))
        );
    }).then(() => productModel.id);
}

exports.save = function save(productModel) {
    let prevAccIds = productModel.prevAccIds;
    delete productModel.prevAccIds;
    let nextAccIds = productModel.accessoryIds;
    delete productModel.accessoryIds;

    let addedAcc = nextAccIds
        .filter(accId => prevAccIds.indexOf(accId) < 0)
        .map(accId => ProductModelAccMap.create({ aid: accId, modelId: productModel.id }));
    console.log('addedAcc', addedAcc, nextAccIds);
    let deledAcc = prevAccIds
        .filter(accId => nextAccIds.indexOf(accId) < 0)
        .map(accId => ProductModelAccMap.destroy({
            where: { aid: accId, modelId: productModel.id }
        }));
    console.log('deledAcc', deledAcc);
    return Promise.all(addedAcc.concat(deledAcc)).then(() => {
        return productModel.save();
    });
}

exports.get = function get(id) {
    let productModel;

    return ProductModel.findById(id).then(_productModel => {
        productModel = _productModel;
        return ProductModelAccMap.findAll({
            where: { modelId: productModel.id }
        });
    }).then(maps => {
        // productModel.accessories = accessories;
        productModel.accessoryIds = productModel.prevAccIds = maps.map(m => m.aid);
        return productModel;
    });
}

exports.getList = function getList(options) {
    return ProductModel.findAll(options);
}