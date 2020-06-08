/**
 * Created by longstone on 15/11/14.
 */
import logger from 'winston';

import Entry from './entry';
import dateParser from'./parser-14util/dateparser';
import parseTimeFromLine from './parser-14util/parseTimeFromLine';
import parseGroups from './parser-14util/parseGroups';
import parseDescription from './parser-14util/parseDescription';
import parseNumber from './parser-14util/parseNumber';

const newLine = '\n';

const getTimestamp = (lines) => {
    const dateValues = {};
    dateValues.date = lines[2];
    dateValues.time = parseTimeFromLine(lines[3]);
    return dateParser(dateValues);
};
module.exports = (text) => {
    try{
        const lines = text.split(newLine);
        const values = {
            group: parseGroups(lines[3]),
            timestamp: getTimestamp(lines, values),
            description: parseDescription(lines[3]),
            number: parseNumber(lines[3])

        };
        return new Entry(values);
    } catch (ex) {
        logger.log('error: pageloader parse',ex);
        logger.log('info: ' + text);
    }
    return new Entry({});
};
