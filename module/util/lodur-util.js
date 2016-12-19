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

var isOrderingForwards = function orderingForwardsF(arr) {
    return arr.length > 0 && arr[0].number < getLastEntry(arr).number;
};

var sortArrayByNumber = function sortArrayByNumberF(arr) {
    arr.sort(function (a, b) {
        return a.number - b.number;
    });
    return arr;
};

var getSendArray = function getSendArrayF(json, _lastEntryCache) {

    var sendArr = [];

    if (json && json.length > 0) {
        var entries = json.slice();
        sortArrayByNumber(entries);
        entries.reverse().every(function (item) {

            if (item.number > _lastEntryCache.number) {
                sendArr.push(item);
                return true;
            } else {
                //we want to break
                return false;
            }
        });
    }
    return sendArr.reverse();
};

module.exports = {
    getLastEntry: getLastEntry,
    getSendArray: getSendArray,
    isOrderingForwards: isOrderingForwards,
    sortArrayByNumber: sortArrayByNumber
};
