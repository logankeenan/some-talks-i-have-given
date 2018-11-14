import {loop} from "../../helpers/view-helpers";

export default (model) => {
    return `
    <h1>${model.name}</h1>
    <ul>
    ${loop(model.ingredients, (ingredients) => `<li>${ingredients.name}</li>`)}
</ul>
    `
}