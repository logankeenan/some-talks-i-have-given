import fs from 'fs';

function orderRouteRegexesByMostSpecific(regexFromDirectoryPathRoutes) {
    return Object.keys(regexFromDirectoryPathRoutes).sort((string) => string.length).reverse();
}

export function nonProductionIncompleteInefficientWayToGetRouteInfo(url) {
    let pathname = url;
    let query;

    if (url.indexOf('?') > -1) {
        const urlParts = url.split('?');

        pathname = urlParts[0];
        query = urlParts[1];
    }

    const routesFromDirectory = getDirectoryPathRoutes();
    const routeRegexesMap = createRegexMapFromDirectoryPathRoutes(routesFromDirectory);
    const routeRegexes = orderRouteRegexesByMostSpecific(routeRegexesMap);

    const matchedRegexRoute = routeRegexes.find((routeRegex) => {
        const routeAsActualRegex = new RegExp(routeRegex, 'g');

        return routeAsActualRegex.test(pathname);
    });

    if (matchedRegexRoute) {
        return {
            filePath: routeRegexesMap[matchedRegexRoute].filePath,
            params: routeRegexesMap[matchedRegexRoute].params.reduce((paramsMap, param, index) => {
                const routeAsActualRegex = new RegExp(matchedRegexRoute, 'g');

                const results = routeAsActualRegex.exec(pathname);

                return {
                    ...paramsMap,
                    [param]: results[index + 1]
                }
            }, {}),
            query
        }
    }
}

function getParameterNamesFromRoute(directorPathRoute) {
    const routeParamRegex = new RegExp('{(.*)}\\/|{(.*)}', 'g');
    let regexResults;

    const routerParameterNames = [];
    while ((regexResults = routeParamRegex.exec(directorPathRoute)) !== null) {
        if (regexResults[1]) {
            routerParameterNames.push(regexResults[1]);
        } else if (regexResults[2]) {
            routerParameterNames.push(regexResults[2]);
        }
    }
    return routerParameterNames;
}

function createRegexMapFromDirectoryPathRoutes(directoryPathRoutes) {
    return directoryPathRoutes.reduce((routeRegexMap, directorPathRoute) => {
        const parametersFromRoute = getParameterNamesFromRoute(directorPathRoute);
        const routeAsRegex = parametersFromRoute.reduce((routeAsRegex, parameterFromRoute) => {
            return routeAsRegex.replace(`{${parameterFromRoute}}`, '(.*)')
        }, directorPathRoute).replace(new RegExp('/', 'g'), '\\/');

        return {
            ...routeRegexMap,
            [`^${routeAsRegex}$`]: {
                params: parametersFromRoute,
                filePath: directorPathRoute
            },
        }

    }, {});
}


function getDirectoryPathRoutes(path = './controllers', startingFileSystemPath = './controllers') {
    const directoryContents = fs.readdirSync(path, {withFileTypes: true});

    return directoryContents.reduce((paths, directoryItem) => {
        if (directoryItem.isDirectory()) {
            paths = [...paths, ...getDirectoryPathRoutes(`${path}/${directoryItem.name}`, startingFileSystemPath)];
        } else {
            const route = `${path}/${directoryItem.name}`.replace(startingFileSystemPath, '').replace('.mjs', '');
            paths.push(route)
        }

        return paths;
    }, []);
}

