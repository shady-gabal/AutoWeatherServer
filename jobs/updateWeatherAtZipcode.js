/**
 * Created by shadygabal on 12/3/16.
 */

module.exports = function(){
    var WeatherAtZipcode = require('app/db/WeatherAtZipcode.js');

    console.log("updating weathers...");

    WeatherAtZipcode.find({}).exec(function(err, weathers){
       if (err){
           console.log(err);
       }
        else{
           console.log("fetched " + weathers.length + " weathers");

           var i = 0;
           var next = function(){

               if (i < weathers.length){
                   var weather = weathers[i];

                   weather.updateWeather(function(err2){
                       if (err2){
                           console.log(err2);
                       }
                       else{
                           console.log("successfully updated zipcode " + weather.zipcode);
                       }
                       i++;
                       next();
                   });
               }

           };
           next();

       }
    });
};