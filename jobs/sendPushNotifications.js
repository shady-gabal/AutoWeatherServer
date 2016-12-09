/**
 * Created by shadygabal on 12/3/16.
 */

module.exports = function(){
    var Globals = require('app/helpers/Globals.js');
    var moment = require('moment');
    var User = require('app/db/User');
    var WeatherPushNotification = require('app/db/WeatherPushNotification');

    var date = new Date();

    if (date.getMinutes() % 15 != 0){
        var remainder = date.getMinutes() % 15;
        if (remainder <= 5){
            remainder = remainder + 15; //if within 5 minutes, reset to lower bound
        }
        else if (date.getMinutes() > 45){
            date.setHours(date.getHours() + 1);
        }
        date.setMinutes(date.getMinutes() + (15 - remainder));
    };

    var currTime = moment.utc(date).format("hh:mm A").toLowerCase();

    console.log("sending push notifs to " + currTime);

    User.find({notification_time : currTime}).exec(function(err, users){

        if (err){
            console.log(err);
        }
        else{
            WeatherPushNotification.sendWeatherPushNotifications(users);
        }
    });

};