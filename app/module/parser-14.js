/**
 * Created by longstone on 15/11/14.
 */
var Entry = require('./entry');
var newLine = '\n';
var dateParser = require('./parser-14util/dateparser'), parseTimeFromLine = require('./parser-14util/parseTimeFromLine'),
    parseGroups = require('./parser-14util/parseGroups');


var getTimestamp = function getTimestampF(lines) {
    var dateValues = {};
    dateValues.date = lines[2];
    dateValues.time = parseTimeFromLine(lines[3]);
    return dateParser(dateValues);
};
module.exports = function createEntryForAlertF(text) {
    var lines = text.split(newLine);
    var values = {
        group: parseGroups(lines[3]),
        timestamp: getTimestamp(lines, values),
        description: lines[3].substring(lines[3].lastIndexOf('/') + 2, lines[3].length)
    };
    return new Entry(values);
};