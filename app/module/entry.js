/**
 * Created by longstone on 15/11/14.
 */
"use strict";
var Entry = function EntryF(that) {
    if (!that) {
        that = {};
    }
    this.timestamp = that.timestamp || '';
    this.group = that.group || '';
    this.description = that.description || '';
};

Entry.prototype.getTimestamp = function getTimestampF() {
    return this.timestamp;
};
Entry.prototype.getGroup = function getGroupF() {
    return this.group;
};
Entry.prototype.getDescription = function getDescriptionF() {
    return this.description;
};

module.exports = Entry;