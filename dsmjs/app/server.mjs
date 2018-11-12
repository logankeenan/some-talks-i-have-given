import http from 'http';
import {renderHtmlWrapper} from './html-wrapper';
import {nonProductionIncompleteInefficientWayToGetRouteInfo} from './helpers/server-helpers';
import Model from './models/Model';
import RedirectResponse from './models/Redirect-Response';

http.createServer(async function (req, res) {

    const routeInfo = nonProductionIncompleteInefficientWayToGetRouteInfo(req.url);

    if (routeInfo) {
        req.params = routeInfo.params;
        req.query = routeInfo.query;

        const controller = await import(`./controllers${routeInfo.filePath}`);

        const model = await controller[req.method.toLowerCase()](req, res);
        const view = await import(`./pages${routeInfo.filePath}`);

        if (model instanceof Model) {
            const nestContent = view.default(model);
            res.write(renderHtmlWrapper(nestContent));
        }

        if (model instanceof RedirectResponse) {
            res.writeHead(303, {
                'Location': model.location
            });
        }


        res.end();
    }


}).listen(8080);