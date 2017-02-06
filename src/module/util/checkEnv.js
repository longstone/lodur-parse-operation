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
        var namesNotFound = this.names.filter(name => this.process[name]=== undefined);
        console.log(namesNotFound);
        return namesNotFound
    }
}
module.exports = CheckEnv;