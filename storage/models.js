const Sequelize = require('sequelize');

let sequelize = new Sequelize('eis', '', '', {
    dialect: 'sqlite',
    storage: __dirname + '/../test.db'
});

exports.Customer = sequelize.define('customer', {
    id: ID(),
    // name: Sequelize.STRING
}, commonOps('customers'));

exports.Order = sequelize.define('order', {
    id: ID(),
    address: Sequelize.STRING,
    cid: Sequelize.INTEGER,
    // customer
    arriveTime: Sequelize.INTEGER,
    status: Sequelize.INTEGER,
    ctime: Sequelize.INTEGER,
    mtime: Sequelize.INTEGER
    // products
}, commonOps('orders'));

exports.Product = sequelize.define('product', {
    id: ID(),
    serialNumber: Sequelize.STRING,
    oid: Sequelize.INTEGER,
    modelId: Sequelize.INTEGER,
    // productModel: ProductModel,
    status: Sequelize.INTEGER,
    // accessories: Accessory[],
    ctime: Sequelize.INTEGER,
    mtime: Sequelize.INTEGER
}, commonOps('products'));

exports.Operation = sequelize.define('operation', {
    id: ID(),
    uid: Sequelize.INTEGER,
    ctime: Sequelize.INTEGER,
    action: Sequelize.STRING,
    targetType: Sequelize.INTEGER,
    targetId: Sequelize.INTEGER
}, commonOps('operations'));

exports.Accessory = sequelize.define('accesory', {
    id: ID(),
    modelName: Sequelize.STRING,
    purchasePrice: Sequelize.INTEGER,
    quantity: Sequelize.INTEGER,
    type: Sequelize.STRING,
    supplierId: Sequelize.INTEGER
}, commonOps('accessories'));

exports.ProductAccMap = sequelize.define('pro_consist_acc', {
    aid: { type: Sequelize.INTEGER, primaryKey: true },
    pid: { type: Sequelize.INTEGER, primaryKey: true }
}, commonOps('pro_consist_acc'));

exports.ProductModel = sequelize.define('product_model', {
    id: ID(),
    modelName: Sequelize.STRING,
    primaryPrice: Sequelize.INTEGER,
    screenSize: Sequelize.INTEGER
}, commonOps('product_models'));

exports.FinanceRecords = sequelize.define('finance_record', {
    id: ID(),
    type: Sequelize.STRING,
    amount: Sequelize.INTEGER,
    description: Sequelize.STRING
}, commonOps('finance_records'));

exports.Users = sequelize.define('user', {
    id: ID(),
    account: {
        type: Sequelize.INTEGER,
        uniqueKey: true
    },
    password: Sequelize.STRING,
    firstname: Sequelize.STRING,
    lastname: Sequelize.STRING,
    role: Sequelize.INTEGER,
    salary: Sequelize.INTEGER,
    telephone: Sequelize.INTEGER
}, commonOps('users'));

exports.ProductModelAccMap = sequelize.define('mod_consist_acc', {
    modelId: { type: Sequelize.INTEGER, primaryKey: true },
    aid: { type: Sequelize.INTEGER, primaryKey: true }
}, commonOps('mod_consist_acc'));

function ID() {
    return { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true };
}

function commonOps(tableName) {
    return { tableName: tableName, createdAt: false, updatedAt: false };
}