var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var ejs = require('ejs');
var debug = require('debug')('App');
var fs = require('fs');
const { R_OK } = fs.constants;

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
// static npm packages
let frontEnds = [ 'bootstrap', 'jquery', 'set-dom', 'toprogress' ]
frontEnds.forEach(f => {
  app.use(`/${f}`, express.static(path.join(__dirname, `node_modules/${f}`)));
});

// TODO: Dirty patch!!!!
let PersonnelRole = require('eis-order-handling').datatypes.PersonnelRole;
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

// view helpers
app.use((req, res, next) => {
  Object.assign(res.locals, require('./views/helpers'));
  next();
});

debug('Routes:');
const routesDir = path.join(__dirname, '/routes');
fs.readdirSync(routesDir).forEach(p => {
  if (path.extname(p) !== '.js') {
    debug('%s is not a js file, skipped', p);
    return;
  }
  let routeName = path.basename(p, '.js');
  // special index route
  if (routeName === 'index') routeName = '';
  try {
    let route = require(path.join(routesDir, p));
    let isRouter = typeof route === 'function';
    isRouter = isRouter || (route.get && route.post && route.all);
    if (isRouter) {
      debug('Using route: %s as /%s', p, routeName);
      app.use('/' + routeName, route);
    }
    else {
      debug('%s seems not a router module, skipped');
    }
  } catch (e) {
    debug('failed to require %s, skipped');
  }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

function wantsJSON(req) {
  return (req.get('Accept') && req.get('Accept').indexOf('json') >= 0);
}

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.status = err.status || 500;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  if (wantsJSON(req)) {
    res.json({ err: err.message });
  }
  else {
    res.render('error');
  }
});

module.exports = app;
