import {getAll} from '../repository/recipe-repository';
import Model from '../models/Model';

export function get(req, res) {
    return new Model({
        recipes: getAll()
    })
}