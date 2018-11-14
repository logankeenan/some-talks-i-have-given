import {getById} from "../../repository/recipe-repository";
import Model from "../../models/Model";

export const get = (req, res) => {
    return new Model(getById(req.params.id));
};
