const Koa = require('koa');
const app = new Koa();
const bodyParser = require('koa-bodyparser');
const serve = require('koa-static');
const path = require('path');
const rootRouter = require('./src/routes/index');
const config = require('./config.json');

app.use(bodyParser()).use(rootRouter.routes())
	.use(serve(path.resolve(config.staticPath)));

app.listen(3000);
