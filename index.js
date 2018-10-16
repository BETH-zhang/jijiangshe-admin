const path = require('path');
const fs = require('fs');
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const Router = require('koa-router');
const compress = require('koa-compress');
const statics = require('koa-static-cache');

const app = new Koa();
const router = new Router();

const ROOT_DIR = path.resolve();

router.get('/healthCheck', async ctx => {
  ctx.toJSON({ code: 200 });
  ctx.response.body = '<h1>200</h1>';
});

router.get('*', async ctx => {
  console.log(ctx.originalUrl);
  ctx.body = await fs.readFile(path.resolve(__dirname, './dist/index.html'), 'utf8');
});

app.use(bodyParser({ formLimit: '2mb' }));
// app.use(require('koa-static')(`${ROOT_DIR}/dist`));
// app.use(cors({ credentials: true }));
app.use(
  statics(`${ROOT_DIR}/dist`, {
    maxAge: 360,
  })
);
const options = { threshold: 2048 };
app.use(compress(options));

app.use(router.routes());
app.listen(7002);

console.log('请访问: 7002');
