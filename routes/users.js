var express = require('express');
var router = express.Router();

var WeatherAtZipcode = require('app/db/WeatherAtZipcode');
var User = require('app/db/User');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.put('/', function(req, res){
  var uuid = req.body.uuid;
  var zipcode = req.body.zipcode;

  if(uuid && zipcode){
    User.createUser(uuid, zipcode, function(err, user){
      if(err){
        res.status(418).json({});
      }
      else{
        res.json({"secret_key" : user.secret_key});
      }
    });
  }
  else{
    res.status(418).json({});
  }
});

router.post('/changeZipcode', function(req, res){

});



module.exports = router;
