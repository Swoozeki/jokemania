var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

//setup mongoose connection
var mongoose = require('mongoose');
var mongodb = process.env.MONGODB_URI || 'mongodb://swoozeki:TargetLocked1@ds237855.mlab.com:37855/jokemania';
mongoose.connect(mongodb);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error!'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret:'work hard',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));
app.use(function(req, res, next){ //custom middleware that automatically populates request with the currently logged in user
  const User = require('./models/user');
  if(req.session && req.session.userId){
    User.findOne({_id: req.session.userId}, 'username', function(err, user){
      if(err){return next(err);}
      req.user = user;
      return next();
    });
  }
  else return next();
});
app.use('/', index);
app.use('/users', users);

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
