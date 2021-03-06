/**
 * Created by lag on 06.02.2017.
 */
class CheckEnv {
    /**
     *
     * @param envVar process.env
     */
    constructor(envVar) {
        this.process = envVar;
    }

    /**
     * pass an array containing the variable names
     * @param array
     */
    setVariableNames(array) {
        this.names = array.slice();
    }

    check() {
        return this.names.filter(name => this.process[name]=== undefined);
    }
}
module.exports = CheckEnv;