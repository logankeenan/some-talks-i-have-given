import http from 'http';
import {renderHtmlWrapper} from "./html-wrapper";
import {nonProductionIncompleteInefficientWayToGetRouteInfo} from "./helpers/server-helpers";
import Model from "./models/Model";
import RedirectResponse from "./models/Redirect-Response";

http.createServer(async (req, res) => {

    const routeInfo = nonProductionIncompleteInefficientWayToGetRouteInfo(req.url);

    if (routeInfo) {
        req.params = routeInfo.params;
        req.query = routeInfo.query;

        const controller = await import(`./controllers${routeInfo.filePath}`);
        const view = await import(`./views${routeInfo.filePath}`);

        const model = await controller[req.method.toLowerCase()](req, res);

        if (model instanceof Model) {
            const content = view.default(model);
            const markup = renderHtmlWrapper(content);
            res.write(markup);
        }

        if (model instanceof RedirectResponse) {
            res.writeHead(302, {
                'Location': model.location
            });
        }

    }


    res.end()
}).listen(8080);