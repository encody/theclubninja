import * as Router from '@koa/router';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as Koa from 'koa';
import { IUserProfile } from '../../website/src/model/UserProfile';
import { CollectionManager } from './CollectionManager';

admin.initializeApp();

const firestore = admin.firestore();

const cm = new CollectionManager(firestore);

const app = new Koa();
const router = new Router({
  prefix: '/api',
});

// TODO: Cache model & serve that instead of calling back to firestore every time to save on quota

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
    ctx.status = 401;
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
    ctx.response.status = 401;
    ctx.response.body = 'Unauthorized';
    return;
  }

  try {
    const decodedIdToken = await admin.auth().verifyIdToken(idToken);
    ctx.state.user = decodedIdToken;
    ctx.state.profile = (await cm.get('users'))[decodedIdToken.uid];
    if (!ctx.state.profile) {
      ctx.response.status = 403;
      ctx.response.body = 'Forbidden';
      return;
    } else {
      return await next();
    }
  } catch (error) {
    console.error('Error while verifying Firebase ID token:', error);
    ctx.response.status = 401;
    ctx.response.body = 'Unauthorized';
    return;
  }
});

[
  'terms',
  'creditTypes',
  'chargeTypes',
  'memberTypes',
  'memberships',
  'members',
].forEach(key => {
  console.log('Creating route for GET /' + key + '...');
  router.get('/' + key, async (ctx, next) => {
    ctx.response.body = await cm.get(key);
    await next();
  });
});

([
  'members',
  'terms',
  'charges',
] as (keyof IUserProfile['permissions'])[]).forEach(key => {
  router.post('/' + key, async (ctx, next) => {
    if ((ctx.state.profile as IUserProfile).permissions[key].write) {
      try {
        const update = (ctx.req as any).body;
        await cm.set(key, update);
        ctx.response.body = { success: true };
        ctx.response.status = 200;
        await next();
      } catch (e) {
        console.error(e);
        ctx.response.body = { success: false };
        ctx.response.status = 500;
        await next();
      }
    } else {
      ctx.response.status = 403;
      ctx.response.body = 'Forbidden';
      return;
    }
  });
});

router
  .get('/charges', async (ctx, next) => {
    if ((ctx.state.profile as IUserProfile).permissions.ledger.read) {
      ctx.response.body = await cm.get('charges');
    } else {
      ctx.response.status = 403;
      ctx.response.body = 'Forbidden';
      return;
    }
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
  });

app.use(router.routes());
app.use(router.allowedMethods());

export const api = functions.https.onRequest(app.callback());
