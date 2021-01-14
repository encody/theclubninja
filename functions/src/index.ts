import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as Koa from 'koa';
import * as Router from '@koa/router';

admin.initializeApp();

const firestore = admin.firestore();

const app = new Koa();
const router = new Router({
  prefix: '/api',
});

app.use(async (ctx, next) => {
  console.log(ctx.request.originalUrl, ctx.origin);
  if (/https?:\/\/localhost(:\d+)?/.test(ctx.origin)) {
    ctx.set('Access-Control-Allow-Origin', ctx.origin);
    ctx.set('Vary', 'Origin');
  }
  await next();
});

router
  .get('/terms', async (ctx, next) => {
    ctx.response.body = (await firestore.collection('terms').get()).docs.reduce(
      (acc, doc) => ({ ...acc, [doc.id]: doc.data() }),
      {},
    );
    await next();
  })
  .get('/members', async (ctx, next) => {
    ctx.response.body = (
      await firestore.collection('members').get()
    ).docs.reduce((acc, doc) => ({ ...acc, [doc.id]: doc.data() }), {});
    await next();
  })
  .get('/creditTypes', async (ctx, next) => {
    ctx.response.body = (
      await firestore.collection('creditTypes').get()
    ).docs.reduce((acc, doc) => ({ ...acc, [doc.id]: doc.data() }), {});
    await next();
  });

app.use(router.routes()).use(router.allowedMethods());

export const api = functions.https.onRequest(app.callback());
