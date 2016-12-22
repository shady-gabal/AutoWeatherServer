var express = require('express');
var router = express.Router();
//var updateWeatherAtZipcode = require('../jobs/updateWeatherAtZipcode.js');
//var sendPushNotifications = require('../jobs/sendPushNotifications.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//router.get('/callbacks/sendPushNotifications', function(req, res){
//  sendPushNotifications();
//  res.send("OK");
//});
//
//router.get('/callbacks/updateWeatherAtZipcode', function(req, res){
//  updateWeatherAtZipcode();
//  res.send("OK");
//});

router.get('/callbacks/keepAlive', function(req, res){
  res.send("OK");
});

module.exports = router;
