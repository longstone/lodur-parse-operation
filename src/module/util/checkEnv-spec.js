/**
 * Created by lag on 06.02.2017.
 */
const assert = require("assert");
const CheckEnv = require('./checkEnv');


describe('ensure environment',  ()  => {
    it('should return empty array if matching all cases',  () =>  {
        let process = { user : 'foo', url : 'bar'};
        const checkEnv = new CheckEnv(process);
        checkEnv.setVariableNames(['user', 'url']);
        const expected = [];
        const actual = checkEnv.check();
        assert.deepEqual(actual, expected);
    });

   it('should return empty array if matching all cases and ignore additional entries',  () =>  {
        let process = { user : 'foo', url : 'bar', elementary: 'watson'};
        const checkEnv = new CheckEnv(process);
        checkEnv.setVariableNames(['user', 'url']);
        const expected = [];
        const actual = checkEnv.check();
        assert.deepEqual(actual, expected);
    });

   it('should return the names of missing properties',  () =>  {
        const process = { user : 'foo', url : 'bar', elementary: 'watson'};
        const checkEnv = new CheckEnv(process);
        checkEnv.setVariableNames(['user', 'somewhat']);
        const expected = ['somewhat'];
        const actual = checkEnv.check();
        assert.deepEqual(actual, expected);
    });


});