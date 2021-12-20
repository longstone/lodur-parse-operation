/**
 * Created by longstone on 20/12/21.
 */
import logger from 'winston';

import Entry from './entry';
import dateParser from './parser-21util/dateparser';
import parseTimeFromLine from './parser-21util/parseTimeFromLine';
import parseGroups from './parser-21util/parseGroups';
import parseDescription from './parser-21util/parseDescription';
import parseNumber from './parser-21util/parseNumber';

class Parser {

    constructor() {
        const primitiveSepChar = '/';
        this.getSplitChar = function () {
            return primitiveSepChar;
        }
    }

    getTimestamp(text) {
        // 07.06.2020   083 - 21:03 Uhr
        const dateValues = {};
        dateValues.date = text.substring(0, "07.06.2020".length);
        dateValues.time = parseTimeFromLine(text);
        return dateParser(dateValues);
    }

    parse(text) {
        try {
            const lines = text.replace("  ", " ").split(this.getSplitChar()).map(s => s.trim());
            let group = parseGroups(lines[1]);
            let timestamp = this.getTimestamp(lines[0]);
            let number =  parseNumber(lines[0]);
            let description = parseDescription(text);
            const values = {
                group,
                timestamp,
                description,
                number

            };
            return new Entry(values);
        } catch (ex) {
            logger.log('error: pageloader parse', ex);
            logger.log('info: ', text);
        }
        return new Entry({});
    }

}

export default Parser;
