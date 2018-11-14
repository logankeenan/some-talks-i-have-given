export default class Model {
    constructor(properties) {
        Object.keys(properties).forEach((property) => {
           this[property] = properties[property]
        });
    }
}