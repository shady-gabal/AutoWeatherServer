/**
 * Created by shadygabal on 12/3/16.
 */

module.exports = function(){
    var WeatherAtZipcode = require('app/db/WeatherAtZipcode.js');
    var Globals = require('app/helpers/Globals');


    var utcTime = Globals.currentUTCNotificationTime();
    console.log("updating weathers for " + utcTime + "...");

    //WeatherAtZipcode.find({update_time_utc : utcTime}).exec(function(err, weathers){
    WeatherAtZipcode.find({}).exec(function(err, weathers){

        if (err){
           console.log(err);
       }
        else{
            if (weathers.length == 0){
                console.log("no weathers retrieved");
            }
            else{
                console.log("fetched " + weathers.length + " weathers");
            }

           var i = -1;
           var next = function(){
               i++;

               if (i < weathers.length){
                   var weather = weathers[i];

                   weather.updateWeather(function(err2){
                       if (err2){
                           console.log(err2);
                       }
                       else{
                           console.log("successfully updated zipcode " + weather.zipcode);
                       }
                       next();
                   });
               }
           };

           next();
       }
    });
};