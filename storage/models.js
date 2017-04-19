const Sequelize = require('sequelize');

// let sequelize = new Sequelize('eis', '', '', {
    // dialect: 'sqlite',
    // storage: __dirname + '/../test.db'
// });

let sequelize = new Sequelize('eis_internal', 'root', 'godtoknow', {
    host: '158.182.109.232',
    dialect: 'mysql'
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
    mtime: Sequelize.INTEGER,
    price: Sequelize.DOUBLE
    // products
}, commonOps('Order'));

exports.Product = sequelize.define('product', {
    id: ID('eid'),
    serialNumber: { type: Sequelize.STRING, field: 'serial_number' },
    oid: { type: Sequelize.INTEGER, field: 'oid' },
    modelId: { type: Sequelize.INTEGER, field: 'pid' },
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
    targetType: { type: Sequelize.INTEGER, field: 'target_type' },
    targetId: { type: Sequelize.INTEGER, field: 'target_id' }
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
}, commonOps('Product'));

exports.FinanceRecords = sequelize.define('finance_record', {
    id: ID(),
    type: Sequelize.STRING,
    amount: Sequelize.INTEGER,
    description: Sequelize.STRING,
    description: Sequelize.STRING,
    ctime: Sequelize.INTEGER,
    mtime:Sequelize.INTEGER,
}, commonOps('finance_record'));

exports.Users = sequelize.define('user', {
    id: ID(),
    account: {
        type: Sequelize.INTEGER,
        uniqueKey: true
    },
    password: Sequelize.STRING,
    firstName: { type: Sequelize.STRING, field: 'first_name' },
    lastName: { type: Sequelize.STRING, field: 'last_name' },
    role: Sequelize.INTEGER,
    salary: Sequelize.INTEGER,
    tel: Sequelize.INTEGER,
    ctime: Sequelize.INTEGER
}, commonOps('user'));

exports.ProductModelAccMap = sequelize.define('mod_consist_acc', {
    modelId: { type: Sequelize.INTEGER, primaryKey: true, field: 'pid' },
    aid: { type: Sequelize.INTEGER, primaryKey: true }
}, commonOps('pro_consist_acc'));

exports.Supplier = sequelize.define('supplier', {
    id: ID('supplier_id'),
    name: Sequelize.STRING,
    email: Sequelize.STRING,
    tele: Sequelize.STRING,
    address: Sequelize.STRING
}, commonOps('Supplier'));



function ID(fname) {
    return { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, field: fname };
}

function commonOps(tableName) {
    return { tableName: tableName, createdAt: false, updatedAt: false };
}