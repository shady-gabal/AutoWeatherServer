var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var CronJob = require('cron').CronJob;

var User = require('app/db/User');
var Globals = require('app/helpers/Globals');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

var updateWeatherAtZipcode = require('./jobs/updateWeatherAtZipcode.js');
var sendPushNotifications = require('./jobs/sendPushNotifications.js');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/testPush', function(req, res){
  sendPushNotifications();
  res.send("OK");
});

app.use('/testUpdate', function(req, res){
  updateWeatherAtZipcode();
  res.send("OK");
});

var userCheckExceptionDomains = ['', '/callbacks/keepAlive', '/users/new', '/users/all', '/users/clear', '/users/updateWeather', '/users/testPushNotifications'];

var checkUser = function(req, res, next){
  if (userCheckExceptionDomains.indexOf(req.baseUrl) == -1){
    User.authenticateUser(req, res, next, function(err, user){
      if (err){
        console.log(err);
        next(err);
      }
      else{
        req.user = user;
        next();
      }
    });
  }
  else{
    next();
  }
};

app.use('*', checkUser);

app.use('/', index);
app.use('/users', users);

app.use(passport.initialize());
app.use(passport.session());

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


passport.use('uuid-secretkey', new LocalStrategy(
    {
      usernameField: 'uuid',
      passwordField : 'secret_key'
    },
    function(uuid, secret_key, done) {
      console.log("Validating user...");

      User.findOne({ "uuid" : uuid }).exec(function (err, user) {
        if (err) { return done(err); }
        else if (!user) {
          console.log("Incorrect uuid");
          return done(null, false);
        }
        else{
          user.validateSecretKey(secret_key, function(err, valid){
            if (err){
              console.log("Error validating uuid: " + err);
              return done(err);
            }
            if (!valid) {
              console.log("Incorrect secret_key");
              return done(null, false);
            }
            else{
              console.log("User validated.");
              return done(null, user);
            }
          });
        }

      });
    }
));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  User.findOne({_id : user._id}).exec(function(err, _user){
    done(err, _user);
  });
});


new CronJob('0 1,27 * * * *', function() {
//new CronJob('0,30 * * * * *', function() {
  updateWeatherAtZipcode();
}, null, true, 'America/New_York');

//new CronJob('30 * * * * *', function() {
//new CronJob('0 0-59/' + Globals.INTERVAL + ' * * * *', function() {
new CronJob('0 2,28 * * * *', function() {
  sendPushNotifications();
}, null, true, 'America/New_York');

module.exports = app;
