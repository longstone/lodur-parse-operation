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

    const sendArr = [];

    if (json && json.length > 0) {
        const entries = json.slice();
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

const containsDuplicatedID = function (array) {
    if (!array) {
        return false;
    }
    const set = new Set();
    array.map(item => set.add(item.number));
    const invalid = !(array.length === set.size);
    if (invalid) {
        let a = [];
        array.map(e => a.push(e.number))
        let success = false;
        for (var key of set.keys()) {
            success = false
            for (var i = 0; i < a.length; i++) {
                if (a[i] === key && !success) {
                    a[i] = null;
                    success = true;
                }
            }
        }
        let duplicate = a.filter(element => element != null);
        const winston = require('winston');
        winston.log({
            level: 'error',
            message: 'duplicated element found, number: ' + duplicate
        });
    }
    return invalid;
};
const getServerPort = () => {
    return process.env.NODE_PORT || process.env.PORT || 8080
};
const getServerIp = () => {
    return process.env.NODE_IP || 'localhost'
};
module.exports = {
    getLastEntry,
    getSendArray,
    isOrderingForwards,
    sortArrayByNumber,
    containsDuplicatedID,
    getServerIp,
    getServerPort
};
