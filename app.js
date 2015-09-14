var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieSession = require('express-session');
var cookieParser = require('cookie-parser');
var methodOverride = require('method-override');
var bodyParser = require('body-parser');
var pg = require('pg');
var query = require('pg-query');


var routes = require('./routes/index');
var signin = require('./routes/signin');
var signup = require('./routes/signup');
var home = require('./routes/home');
var admin = require('./routes/admin');
var employee = require('./routes/employee');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride());
app.use(cookieParser());
app.use(cookieSession({ 
  secret: 'b1u2c3ke4t5b6o7x',
  resave: true,
  saveUninitialized : false
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/signin', signin);
app.use('/signup', signup);
app.use('/home', home);
app.use('/admin', admin);
app.use('/employee', employee);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// For db queries
global.query = query;

if(app.get('env') === 'development'){
  console.log("running on development");
  query.connectionParameters = {
    "user": "ccjsmmdhfspinl",
    "password": "KWUPW9JHoz0UORiKUpNIMLVdJD",
    "database": "d1sebsoa5t03pk",
    "host": "ec2-54-204-3-200.compute-1.amazonaws.com",
    "port": "5432",
    "ssl": true
  };
  
} else {
  console.log("running on production");
  query.connectionParameters = "postgres://ccjsmmdhfspinl:KWUPW9JHoz0UORiKUpNIMLVdJD@ec2-54-204-3-200.compute-1.amazonaws.com:5432/d1sebsoa5t03pk" || {
    "user": "ccjsmmdhfspinl",
    "password": "KWUPW9JHoz0UORiKUpNIMLVdJD",
    "database": "d1sebsoa5t03pk",
    "host": "ec2-54-204-3-200.compute-1.amazonaws.com",
    "port": "5432",
    "ssl": true
  }
}

// production error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: err
  });
});

// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});



module.exports = app;
