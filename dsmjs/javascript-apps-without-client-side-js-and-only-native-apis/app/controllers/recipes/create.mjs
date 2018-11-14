import {createModelFromRequest} from "../../factories/request-factory";
import {insert} from "../../repository/recipe-repository";
import Model from "../../models/Model";
import RedirectResponse from "../../models/Redirect-Response";
import {createModelFromQueryString} from "../../factories/model-factory";
import RecipeModel from "../../models/Recipe-Model";

export const get = (req, res) => {

    if (req.query) {
        const model = createModelFromQueryString(req.query);

        if (model.add) {
            model.ingredients.push({
                name: ''
            });
        }

        if (model.remove) {
            model.ingredients = model.ingredients.filter((_, index) => index.toString() !== model.remove);
        }

        return new Model(model);
    }

    return new Model({
        name: '',
        ingredients: [
            {
                name: ''
            }
        ]
    })
};

export const post = async (req, res) => {
    const model = new RecipeModel(await createModelFromRequest(req));

    if (model.isValid()) {
        const savedModel = insert(model);

        return new RedirectResponse(`/recipes/${savedModel.id}`);
    }

    return model;


};