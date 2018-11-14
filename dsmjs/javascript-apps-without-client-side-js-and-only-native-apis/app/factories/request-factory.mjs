import querystring from "querystring";
import {createObjectModelFromQueryStringObject} from "./model-factory.mjs";

export async function createModelFromRequest(request) {
    return new Promise((resolve) => {
        let body = [];
        request.on('data', (chunk) => {
            body.push(chunk);
        }).on('end', () => {
            body = Buffer.concat(body).toString();
            const bodyParsed = querystring.parse(body);

            resolve(createObjectModelFromQueryStringObject(bodyParsed));
        });
    })
}