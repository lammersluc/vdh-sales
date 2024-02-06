import admin from 'firebase-admin';
const serviceAccount = require('./serviceAccountKey.json');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}

const auth = admin.auth();
const db = admin.firestore();

export { auth, db }