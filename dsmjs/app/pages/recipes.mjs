import {loop} from '../helpers/view-helpers';

export default function (model) {
    return `
        <ul>
        ${loop(model.recipes,(recipe) => `<li><a href="/recipes/${recipe.id}">${recipe.name}</a></li>`)}
        </ul>
    `
}