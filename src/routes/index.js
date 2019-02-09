const Router = require('koa-router');
const image = require('../util/captcha');
const router = module.exports = new Router();

router.post('/recognition',async ctx => {
	const { captcha } = ctx.request.body;
	const folderPath = image.processed(captcha);
	
	ctx.body = await image.recognition(folderPath);
});
