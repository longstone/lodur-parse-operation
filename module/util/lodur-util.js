'use stric';
/**
 * Created by longstone on 15/05/16.
 */

var getLastEntry = function getLastEntryF(list, cache) {
    if (list.length > 0) {
        return list.slice(-1).pop();
    }
    return cache;
};

var getSendArray = function getSendArrayF(json, _lastEntryCache) {
    var sendArr = [];
    if (json.length > 0) {
        json.reverse();
    }
    json.some(function (item) {
        if (item.number > _lastEntryCache.number) {
            sendArr.push(item);
            return false;
        }
        return true;
    });

    return sendArr.reverse();
};

module.exports = {
    getLastEntry: getLastEntry,
    getSendArray: getSendArray
};
