var express = require('express');
var router = express.Router();

var WeatherAtZipcode = require('app/db/WeatherAtZipcode');
var User = require('app/db/User');
var DailyForecast = require('app/db/DailyForecast');
var HourlyForecast = require('app/db/HourlyForecast');
var moment = require('moment');
var Globals = require('app/helpers/Globals');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/new', function(req, res){
  User.createUser(req.body, function(err, secret_key, user){
    if(err){
      console.log(err);
      res.json({"error" : "Error"});
    }
    else{
      res.json({"secret_key" : secret_key});
    }
  });
});

router.post('/update', function(req, res){
  if (!req.user){
    return res.redirect('/users/new');
  }

  req.user.updateWithData(req.body, function(err){
    console.log(err);
    if (err){
      res.json({"error" : err});
    }
    else res.json({});
  });

});

router.post('/updatePushNotification', function(req, res){
  if (!req.user){
    return res.json({error: "No user found"});
  }

  req.user.updateWithData(req.body, function(err){
    console.log(err);
    if (err){
      res.json({"error" : err});
    }
    else res.json({});
  });
});

router.get('/clear', function(req, res){
  User.remove({}).exec();
  WeatherAtZipcode.remove({}).exec();
  DailyForecast.remove({}).exec();
  HourlyForecast.remove({}).exec();
  res.send("OK");
});

router.get('/all', function(req, res){
  User.find({}).exec(function(err, users){
    if (err){
      res.json(err);
    }
    else{
      res.json(users);
    }
  });
});

router.get('/updateWeather', function(req, res){
  var zipcodes = ['11369', '10036', '12345', '90210', '16754'];

  zipcodes.forEach(function(zipcode){
    WeatherAtZipcode.findOrCreateForZipcode(zipcode, function(err, weather){
      console.log("created " + weather + " with err " + err);
    });
  });

  res.send("OK");
});

router.get('/testPushNotifications', function(req, res){
  User.find({}).exec(function(err, users){
    if (err){
      console.log(err);
    }
    else {
      User.sendPushNotifications(users, "Hi!", "Hey.");
    }
  });

  res.send("OK");
});

module.exports = router;
