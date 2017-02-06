/**
 * Created by longstone on 15/11/14.
 */
var Entry = require('./entry');
var newLine = '\n';
var dateParser = require('./parser-14util/dateparser'), parseTimeFromLine = require('./parser-14util/parseTimeFromLine'),
    parseGroups = require('./parser-14util/parseGroups'), parseDescription = require('./parser-14util/parseDescription'),
    parseNumber = require('./parser-14util/parseNumber');


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
        description: parseDescription(lines[3]),
        number: parseNumber(lines[3])

    };
    return new Entry(values);
};