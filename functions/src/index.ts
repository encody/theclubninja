import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

const firestore = admin.firestore();

export const getTerms = functions.https.onRequest(async (request, response) => {
  response.send(
    (await firestore.collection('terms').get()).docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
    })),
  );
});
