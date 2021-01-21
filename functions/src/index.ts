import * as Router from '@koa/router';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as Koa from 'koa';
import { v4 } from 'uuid';
import { ICharge } from '../../website/src/model/Charge';
import { IdCollection } from '../../website/src/model/IdRecord';
import { IInvoice, ISendInvoiceRequest } from '../../website/src/model/Invoice';
import { IPayment, PaymentType } from '../../website/src/model/Payment';
import { IUserProfile } from '../../website/src/model/UserProfile';
import { CollectionManager } from './CollectionManager';

admin.initializeApp();

const firestore = admin.firestore();

const cm = new CollectionManager(firestore);
let cachedProfiles: IdCollection<IUserProfile> = {};
let lastProfilesCachingTime = 0;

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
    ctx.response.body = { success: false, error: 'Unauthorized' };
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
    ctx.response.body = { success: false, error: 'Unauthorized' };
    return;
  }

  try {
    const decodedIdToken = await admin.auth().verifyIdToken(idToken);
    ctx.state.user = decodedIdToken;
    if (Date.now() - lastProfilesCachingTime > 1000 * 60 * 10) {
      // if the user profiles have not been updated in the last ten minutes
      cachedProfiles = await cm.get('users');
      lastProfilesCachingTime = Date.now();
    }
    ctx.state.profile = cachedProfiles[decodedIdToken.uid];
    if (!ctx.state.profile) {
      ctx.response.status = 403;
      ctx.response.body = { success: false, error: 'Forbidden' };
      return;
    } else {
      return await next();
    }
  } catch (error) {
    console.error('Error while verifying Firebase ID token:', error);
    ctx.response.status = 401;
    ctx.response.body = { success: false, error: 'Unauthorized' };
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
        ctx.response.body = { success: false, error: 'Internal Server Error' };
        ctx.response.status = 500;
        await next();
      }
    } else {
      ctx.response.status = 403;
      ctx.response.body = { success: false, error: 'Forbidden' };
      return;
    }
  });
});

router
  .get('/charges', async (ctx, next) => {
    if ((ctx.state.profile as IUserProfile).permissions.charges.read) {
      const charges: IdCollection<ICharge> = await cm.get('charges');
      const invoiceIds: string[] = [];
      Object.values(charges).forEach(charge => {
        const onlinePayments = charge.payments.filter(
          payment =>
            payment.type === PaymentType.Online &&
            payment.reference !== undefined,
        );
        invoiceIds.push(...onlinePayments.map(p => p.reference!));
      });

      if (invoiceIds.length > 0) {
        const invoices = await firestore
          .collection('invoices')
          .where(admin.firestore.FieldPath.documentId(), 'in', invoiceIds)
          .get();
        invoices.docs.forEach(invoiceDoc => {
          const invoice = invoiceDoc.data() as IInvoice;
          const charge = charges[invoice.chargeId];
          const payment = charge.payments.find(
            p => p.reference === invoice.id,
          )!;
          payment.reference = invoice.stripeInvoiceRecord;
          payment.status = invoice.stripeInvoiceStatus;
        });
      }

      ctx.response.status = 200;
      ctx.response.body = charges;
    } else {
      ctx.response.status = 403;
      ctx.response.body = { success: false, error: 'Forbidden' };
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

router.post('/sendInvoice', async (ctx, next) => {
  const sendInvoiceReq = (ctx.req as any).body as
    | ISendInvoiceRequest
    | undefined;
  if (sendInvoiceReq) {
    const { amount, chargeId, email, description } = sendInvoiceReq;

    if (amount && chargeId && email && description) {
      const paymentId = v4();

      const invoice: IInvoice = {
        id: v4(),
        chargeId,
        paymentId,
        email,
        items: [
          {
            description,
            amount,
            quantity: 1,
            currency: 'usd',
          },
        ],
      };

      const payment: IPayment = {
        id: paymentId,
        chargeId,
        timestamp: Date.now(),
        type: PaymentType.Online,
        value: amount,
        reference: invoice.id,
      };

      try {
        await firestore.runTransaction(async t => {
          const charge = (
            await t.get(firestore.collection('charges').doc(chargeId))
          ).data() as ICharge | undefined;
          if (charge) {
            charge.payments.push(payment);
            t.set(firestore.collection('charges').doc(chargeId), charge);
            t.set(firestore.collection('invoices').doc(invoice.id), invoice);
          }
        });

        ctx.response.status = 200;
        ctx.response.body = { success: true };
        return next();
      } catch (e) {
        ctx.response.status = 500;
        ctx.response.body = { success: false, error: 'Internal Server Error' };
      }
    }
  }

  ctx.response.status = 400;
  ctx.response.body = { success: false, error: 'Bad Request' };
});

app.use(router.routes());
app.use(router.allowedMethods());

export const api = functions.https.onRequest(app.callback());
