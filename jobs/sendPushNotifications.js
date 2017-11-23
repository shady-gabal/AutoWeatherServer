/**
 * Created by shadygabal on 12/3/16.
 */

module.exports = function(){
    var Globals = require('app/helpers/Globals.js');
    var User = require('app/db/User');
    var WeatherPushNotification = require('app/db/WeatherPushNotification');
    var moment = require('moment');

    var currUTCTime = Globals.currentUTCNotificationTime();

    console.log("sending push notifs to " + currUTCTime);

    User.find({notification_time_utc : currUTCTime, "$or": [{ last_notification_date: {"$lte" : (moment().subtract('12', 'hours').toDate())} }, { last_notification_date: null }] }).exec(function(err, users){
    //User.find({}).exec(function(err, users){
        if (err){
            console.log(err);
        }
        else if (!users || users.length == 0){
        }
        else{
            WeatherPushNotification.sendWeatherPushNotificationsToUsers(users);
        }
    });
};

    // var currUTCTime = Globals.currentUTCNotificationTime();

    // User.find({notification_time_utc : currUTCTime, "$or": [{ last_notification_date: {"$lte" : (moment().subtract('12', 'hours').toDate())} }, { last_notification_date: null }] }).exec(function(err, users){
    //     console.log(err);
    //     console.log(users.length);
    // });