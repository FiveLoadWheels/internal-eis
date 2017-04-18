var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var ejs = require('ejs');
var fs = require('fs');
const { R_OK } = fs.constants;

var index = require('./routes/index');
var users = require('./routes/users');
var order = require('./routes/order');
var product = require('./routes/product');
var finance = require('./routes/finance');
var personnel = require('./routes/personnel');

var app = express();

// view engine setup
let viewDir = path.join(__dirname, 'views');
app.set('views', viewDir);
app.engine('ejs', (filePath, options, callback) => {
  fs.access(viewDir + '/layout.ejs', R_OK, (err) => {
    if (err) {
      ejs.renderFile(filePath, options, callback);
    }
    else {
      ejs.renderFile(filePath, options, (err, content) => {
        if (err) return callback(err);
        ejs.renderFile(viewDir + '/layout.ejs',
          Object.assign({ body: content }, options), callback)
      });
    }

  });
})
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: 'eis 123456 78',
  resave: true, 
  saveUninitialized: true
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// bootstrap and jquery
app.use('/bootstrap', express.static(path.join(__dirname, 'node_modules/bootstrap')));
app.use('/jquery', express.static(path.join(__dirname, 'node_modules/jquery')));

// TODO: Dirty patch!!!!
let PersonnelRole = require('eis-thinking').datatypes.PersonnelRole;
app.use((req, res, next) => {
  let render = res.render;
  res.render = function newRender(filePath, options, callback) {
    render.call(res, filePath, Object.assign({}, options, {
      req,
      PersonnelRole
    }), callback);
  };

  next();
});

app.get('/debug', (req, res) => {
  res.type('application/json');
  res.send(JSON.stringify(require('./data/__fake'), null, 4));
})

app.use('/', index);
app.use('/users', users);
app.use('/order', order);
app.use('/product', product);
app.use('/finance', finance);
app.use('/personnel', personnel);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
