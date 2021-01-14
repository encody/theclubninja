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

// https://github.com/firebase/functions-samples/blob/master/authorized-https-endpoint/functions/index.js
app.use(async (ctx, next) => {
  console.log('Check if request is authorized with Firebase ID token');

  if (
    (!ctx.req.headers.authorization ||
      !ctx.req.headers.authorization.startsWith('Bearer ')) &&
    !(ctx.cookies && ctx.cookies.get('__session'))
  ) {
    console.error('No session cookie or authorization header found');
    ctx.status = 403;
    ctx.response.body = 'Unauthorized';
    return;
  }

  let idToken;
  if (
    ctx.req.headers.authorization &&
    ctx.req.headers.authorization.startsWith('Bearer ')
  ) {
    console.log('Found "Authorization" header');
    // Read the ID Token from the Authorization header.
    idToken = ctx.req.headers.authorization.split('Bearer ')[1];
  } else if (ctx.cookies) {
    console.log('Found "__session" cookie');
    // Read the ID Token from cookie.
    idToken = ctx.cookies.get('__session')!;
  } else {
    // No cookie
    ctx.response.status = 403;
    ctx.response.body = 'Unauthorized';
    return;
  }

  try {
    const decodedIdToken = await admin.auth().verifyIdToken(idToken);
    ctx.state.user = decodedIdToken;
    return await next();
  } catch (error) {
    console.error('Error while verifying Firebase ID token:', error);
    ctx.response.status = 403;
    ctx.response.body = 'Unauthorized';
    return;
  }
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
  })
  .get('/profile', async (ctx, next) => {
    ctx.response.body = (
      await firestore
        .collection('users')
        .doc((ctx.state.user as admin.auth.DecodedIdToken).uid)
        .get()
    ).data();
    await next();
  })
  .post('/members', async (ctx, next) => {
    try {
      const members = (ctx.req as any).body;
      const b = firestore.batch();
      for (const id of Object.keys(members)) {
        b.set(firestore.collection('members').doc(id), members[id]);
      }
      b.commit();
      ctx.response.body = { success: true };
      ctx.response.status = 200;
      await next();
    } catch (e) {
      console.error(e);
      ctx.response.body = { success: false };
      ctx.response.status = 500;
      await next();
    }
  });

app.use(router.routes()).use(router.allowedMethods());

export const api = functions.https.onRequest(app.callback());
