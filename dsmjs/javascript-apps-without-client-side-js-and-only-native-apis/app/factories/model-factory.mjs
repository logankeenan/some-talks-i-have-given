import querystring from "querystring";

export function createObjectModelFromQueryStringObject(body) {

    return Object.keys(body).reduce((acc, keyInParsedBody) => {
        const isKyeValuePairForNestArray = keyInParsedBody.indexOf('_') > -1;

        if (isKyeValuePairForNestArray) {
            const keyParts = keyInParsedBody.split('_');
            const propertyNameOfArrayOnModel = keyParts[0];
            const indexOfItem = keyParts[1];
            const propertyNameOfItemInArray = keyParts[2];
            const valueOfPropertyInArrayItem = body[keyInParsedBody];

            if (!acc[propertyNameOfArrayOnModel]) {
                acc[propertyNameOfArrayOnModel] = [];
            }

            acc[propertyNameOfArrayOnModel][indexOfItem] = {
                ...acc[propertyNameOfArrayOnModel[indexOfItem]],
                [propertyNameOfItemInArray]: valueOfPropertyInArrayItem
            };

            return acc;
        }

        return {
            ...acc,
            [keyInParsedBody]: body[keyInParsedBody]
        }
    }, {})
}

export function createModelFromQueryString(query) {
    const queryParsed = querystring.parse(query);

    return createObjectModelFromQueryStringObject(queryParsed);
}
