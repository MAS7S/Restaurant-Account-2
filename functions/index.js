const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { HttpsError } = require('firebase-functions/v2/https');
const { beforeUserCreated, beforeUserSignedIn } = require('firebase-functions/v2/identity');

initializeApp();
const db = getFirestore();
const ownerUid = 'MgrAoVZTREPEFHl9pgsspz89a9E2';

function denyInvitation() {
  throw new HttpsError('permission-denied', 'RESTAURANT_INVITATION_REQUIRED');
}

async function requireInvitation({ data: user }) {
  if (user?.uid === ownerUid) return;

  const email = user?.email?.toLowerCase();
  if (!email || email.length > 254 || !/^[^@/ ]+@[^@/ ]+\.[^@/ ]+$/.test(email)) {
    denyInvitation();
  }

  const grants = db.collection('access');
  const grant = (await grants.doc(email).get()).data();
  const pending = grant?.role === 'manager' && grant.state === 'pending' && grant.uid === '';
  const active = grant?.state === 'active' && grant.uid === user.uid;
  if (!pending && !active) denyInvitation();

  if (grant.role === 'manager' && grant.restaurant === email) return;
  if (grant.role === 'worker' && grant.restaurant !== email
    && typeof grant.restaurant === 'string'
    && /^[^@/ ]+@[^@/ ]+\.[^@/ ]+$/.test(grant.restaurant)) {
    const manager = (await grants.doc(grant.restaurant).get()).data();
    if (manager?.role === 'manager' && manager.state === 'active') return;
  }
  denyInvitation();
}

exports.requireInvitationOnCreate = beforeUserCreated(requireInvitation);
exports.requireInvitationOnSignIn = beforeUserSignedIn(requireInvitation);
