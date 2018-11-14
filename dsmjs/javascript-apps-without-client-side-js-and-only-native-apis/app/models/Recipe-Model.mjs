import Model from './Model';

class RecipeModel extends Model {
    validate() {
        const errors = {};

        if (this.name.length === 0) {
            errors['name'] = "Name is required"
        }

        this.ingredients.forEach((ingredient, index) => {
            if (ingredient.name.length === 0) {
                errors[`ingredients_${index}_name`] = "Name must is required"
            }
        });

        return this.errors = errors;
    }

    isValid() {
        this.validate();

        return Object.keys(this.errors).length === 0;
    }
}

export default RecipeModel;