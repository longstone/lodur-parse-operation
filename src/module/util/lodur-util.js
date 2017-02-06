const getLastEntry = function getLastEntryF(list, cache) {
    if (list.length > 0) {
        return list.slice(-1).pop();
    }
    return cache;
};

const isOrderingForwards = function orderingForwardsF(arr) {
    return arr.length > 0 && arr[0].number < getLastEntry(arr).number;
};

const sortArrayByNumber = function sortArrayByNumberF(arr) {
    arr.sort(function (a, b) {
        return a.number - b.number;
    });
    return arr;
};

const getSendArray = function getSendArrayF(json, _lastEntryCache) {

    let sendArr = [];

    if (json && json.length > 0) {
        let entries = json.slice();
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

const containsDuplicatedID = function(array) {
    if (!array) {
        return false;
    }
    const set = new Set();
    array.map(item => set.add(item.number));
    return !(array.length === set.size);
};
module.exports = {
    getLastEntry,
    getSendArray,
    isOrderingForwards,
    sortArrayByNumber,
    containsDuplicatedID
};