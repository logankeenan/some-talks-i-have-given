import {loop, renderError} from "../../helpers/view-helpers";

export default (model) => {
    return `
    <form method="post" action="/recipes/create">
    <label>
        Name: 
        <input type="text" name="name" value="${model.name}">
    </label>
    <br>
    ${renderError(model.errors, 'name')}
    <br>
    ${loop(model.ingredients, (ingredient, index) => {
        return `
        <label>
        Ingredient #${index + 1}
        <input type="text" name="ingredients_${index}_name" value="${ingredient.name}">
        ${index !== 0 ? `<button type="submit" value="${index}" name="remove" formmethod="get" >X</button>`: ''}
        <br>
        ${renderError(model.errors, `ingredients_${index}_name`)}
</label>
<br>
        
        `
    })}
    <button type="submit" value="true" name="add" formmethod="get" >Add Ingredient</button>
    <br>
    <input type="submit" value="submit">
    </form>    
    
    `
}