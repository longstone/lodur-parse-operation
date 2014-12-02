/**
 * Created by longstone on 15/11/14.
 */
"use strict";
var request = require('request')
    , cheerio = require('cheerio'), parser14 = require("./parser-14");
module.exports = function pageLoaderF(url){
var array,url;
    array = [];
       url = 'http://www.lodur-zh.ch/duebendorf/index.php?modul=6';

    request(url, function(err, resp, body){
        var $ = cheerio.load(body);
        $('div .content table').each(function(position,element){
                var entry = $(element);
            // returns something like:
            /**
             *19.11.2014
             164 - 22:32 Uhr / BAG N1 / Rauch/gelöschter Brand: Hörnlistrasse, Dübendorf
             */
           var payload = entry.text();
            console.log('--begin');
                console.log(payload);
            parser14()
            array.push(payload);
            console.log('--end');

        });
        return array;
//        $(links).each(function(i, link){
  ///          console.log($(link).text() + ':\n  ' + $(link).attr('href'));
     //   });
    });


}