const Sequelize = require('sequelize');

let sequelize = new Sequelize('eis', '', '', {
    dialect: 'sqlite',
    storage: __dirname + '/../test.db'
});

exports.Customer = sequelize.define('customer', {
    id: ID('cid'),
    // name: Sequelize.STRING
}, commonOps('Customer'));

exports.Order = sequelize.define('order', {
    id: ID('oid'),
    address: Sequelize.STRING,
    cid: Sequelize.INTEGER,
    // customer
    arriveTime: { type: Sequelize.INTEGER, field: 'arrive_time' },
    status: Sequelize.INTEGER,
    ctime: Sequelize.INTEGER,
    mtime: Sequelize.INTEGER
    // products
}, commonOps('Order'));

exports.Product = sequelize.define('product', {
    id: ID('eid'),
    serialNumber: { type: Sequelize.STRING, field: 'serial_number' },
    oid: { type: Sequelize.INTEGER, field: 'oid' },
    modelId: { type: Sequelize.INTEGER, filed: 'pid' },
    // productModel: ProductModel,
    status: Sequelize.INTEGER,
    // accessories: Accessory[],
    ctime: Sequelize.INTEGER,
    mtime: Sequelize.INTEGER
}, commonOps('End_Product'));

exports.Operation = sequelize.define('operation', {
    id: ID(),
    uid: Sequelize.INTEGER,
    ctime: Sequelize.INTEGER,
    action: Sequelize.STRING,
    targetType: Sequelize.INTEGER,
    targetId: Sequelize.INTEGER
}, commonOps('operation'));

exports.Accessory = sequelize.define('accesory', {
    id: ID('aid'),
    modelName: { type: Sequelize.STRING, field: 'model_name' },
    purchasePrice: { type: Sequelize.INTEGER, field: 'purchase_price' },
    quantity: Sequelize.INTEGER,
    type: Sequelize.STRING,
    supplierId: { type: Sequelize.INTEGER, field: 'supplier_id' }
}, commonOps('Accessory'));

exports.ProductAccMap = sequelize.define('pro_consist_acc', {
    aid: { type: Sequelize.INTEGER, primaryKey: true },
    pid: { type: Sequelize.INTEGER, primaryKey: true, field: 'eid' }
}, commonOps('End_consist_Acc'));

exports.ProductModel = sequelize.define('product_model', {
    id: ID('pid'),
    modelName: { type: Sequelize.STRING, field: 'model_name' },
    primaryPrice: { type: Sequelize.INTEGER, field: 'primary_price' },
    imageUrl: { type: Sequelize.STRING, field: 'image_url' },
    screenSize: { type: Sequelize.INTEGER, field: 'screen_size' }
}, commonOps('product_models'));

exports.FinanceRecords = sequelize.define('finance_record', {
    id: ID(),
    type: Sequelize.STRING,
    amount: Sequelize.INTEGER,
    description: Sequelize.STRING,
    ctime: Sequelize.INTEGER,
    mtime:Sequelize.INTEGER,
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
    telephone: Sequelize.INTEGER,
    ctime: Sequelize.DATE,
    mtime: Sequelize.DATE,
    retireTime: Sequelize.DATE,
}, commonOps('users'));

exports.ProductModelAccMap = sequelize.define('mod_consist_acc', {
    modelId: { type: Sequelize.INTEGER, primaryKey: true, filed: 'pid' },
    aid: { type: Sequelize.INTEGER, primaryKey: true }
}, commonOps('pro_consist_acc'));

exports.Supplier = sequelize.define('supplier', {
    id: ID('supplier_id'),
    email: Sequelize.STRING,
    tele: Sequelize.STRING,
    address: Sequelize.STRING
}, commonOps('Supplier'));



function ID(fname) {
    return { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, filed: fname };
}

function commonOps(tableName) {
    return { tableName: tableName, createdAt: false, updatedAt: false };
}