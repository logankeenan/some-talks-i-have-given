import {loop} from '../../helpers/view-helpers';

export default function (model) {
    return `
    <section>
    <h1>${model.name}</h1>
    ${loop(model.ingredients, (ingredients) => `<li>${ingredients.name}</li>`)}
</section>
    `
}