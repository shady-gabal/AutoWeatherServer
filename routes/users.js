var express = require('express');
var router = express.Router();

var WeatherAtZipcode = require('app/db/WeatherAtZipcode');
var User = require('app/db/User');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/new', function(req, res){
  var uuid = req.body.uuid;
  var zipcode = req.body.zipcode;

  if(uuid && zipcode){
    User.createUser(uuid, zipcode, function(err, secret_key, user){
      if(err){
        res.status(418).json({});
      }
      else{
        res.json({"secret_key" : secret_key});
      }
    });
  }
  else{
    res.status(418).json({});
  }
});

router.post('/update', function(req, res){
  if (!req.user){
    return res.redirect('/users/new');
  }

  req.user.updateWithData(req.body, function(err){

  });

  res.json({});
});

router.get('/clear', function(req, res){
  User.remove({}).exec();
  res.send("OK");
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

module.exports = router;
