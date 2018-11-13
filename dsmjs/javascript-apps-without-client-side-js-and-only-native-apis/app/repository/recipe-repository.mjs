const recipes = [
    {
        id: 1,
        name: "Macaroni & Cheese",
        ingredients: [
            {
                name: 'milk'
            },
            {
                name: 'noodles'
            },
            {
                name: 'cheese'
            }

        ]
    },
    {
        id: 2,
        name: "PB & J",
        ingredients: [
            {
                name: 'bread'
            },
            {
                name: 'peanut butter'
            },
            {
                name: 'jelly'
            }

        ]
    }
];

export const getAll = () => recipes;

export const insert = (recipe) => {
    recipe.id = recipes.length + 1;
    recipes.push(recipe);

    return recipe;
};

export const getById = (id) => recipes.find((recipe) => recipe.id.toString() === id.toString());