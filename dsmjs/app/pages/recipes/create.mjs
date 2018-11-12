import {loop, renderError} from '../../helpers/view-helpers';

export default function (model) {
    return `
    <form action="/recipes/create" method="post">
    <label> Name: 
        <input type="text" name="name" value="${model.name}">
    </label>
    ${renderError(model.errors, 'name')}
    <br>
    <br>
    ${loop(model.ingredients, (ingredient, index) => `
    <label>
        Ingredient #${index + 1}
        <input type="text" name="ingredients_${index}_name" value="${ingredient.name}">
        ${index !== 0 ? `<button type="submit" name="remove" value="${index}" formmethod="get" >X</button>`: ''}
        ${renderError(model.errors, `ingredients_${index}_name`)}
    </label>
    <br>
    `)}
    <br>
    <button type="submit" name="add" value="true" formmethod="get" >Add Ingredient</button>
    <br>
    <br>
    <input type="submit" value="submit">
    </form>
    `
}