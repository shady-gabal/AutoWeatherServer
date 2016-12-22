/**
 * Created by shadygabal on 12/3/16.
 */

module.exports = function(){
    var Globals = require('app/helpers/Globals.js');
    var User = require('app/db/User');
    var WeatherPushNotification = require('app/db/WeatherPushNotification');

    var currUTCTime = Globals.currentUTCNotificationTime();

    console.log("sending push notifs to " + currUTCTime);

    User.find({notification_time_utc : currUTCTime}).exec(function(err, users){
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