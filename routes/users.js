var express = require('express');
var router = express.Router();

var WeatherAtZipcode = require('app/db/WeatherAtZipcode');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.put('/', function(req, res){
});



module.exports = router;
