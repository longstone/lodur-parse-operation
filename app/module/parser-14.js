/**
 * Created by longstone on 15/11/14.
 */
var Entry = require('./entry');
var newLine = '\n';
module.exports.process = function parserF(text){
    // TODO implement parse Magic
};

module.exports.getValues = function getValuesF(text){
    var lines = text.split(newLine);
    var entries = [];
    var values;
    var createEntry = function createEntryF(entry){
        console.log(entry);
        values.timestamp;
        values.group;
        values.description;
    };
    lines.forEach(createEntry)
    return entries;

}