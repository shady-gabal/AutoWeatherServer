/**
 * Created by shadygabal on 12/3/16.
 */

module.exports = function(){
    var Globals = require('app/helpers/Globals.js');
    var moment = require('moment');
    var User = require('app/db/User');
    var WeatherPushNotification = require('app/db/WeatherPushNotification');

    var date = moment().utc().toDate();

    var interval = Globals.INTERVAL;

    if (date.getMinutes() % interval != 0){
        var remainder = date.getMinutes() % interval;
        if (remainder <= interval / 2){
            remainder = remainder + interval; //if within 5 minutes, reset to lower bound
        }
        date.setMinutes(date.getMinutes() + (interval - remainder));
    };

    var currTime = Globals.notificationTimeFromDate(date, true);

    currTime = "12:30 pm";

    console.log("sending push notifs to " + currTime);

    User.find({notification_time : currTime}).exec(function(err, users){

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