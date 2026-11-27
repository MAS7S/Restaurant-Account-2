# Restaurant Accounts

The owner grants manager access by verified email. Each manager has one
restaurant and can grant or revoke worker access for that restaurant. Workers
share that restaurant's ledger.

## Connect Firebase

1. The app and Firebase CLI target `restaurant-3be9c`. Create the default
   Firestore database in that project if needed.
2. Enable Google and Email/Password in Firebase Authentication and add the app's
   hostname to its Authorized Domains.
3. Sign in with the verified Firebase Authentication account whose UID matches
   `ownerUid` in `firebase-config.js` and the `owner()` rule in `firestore.rules`.
4. Deploy the rules with
   `firebase deploy --only firestore:rules --project restaurant-3be9c`.
5. Serve the static files over HTTPS. For local development, run
   `python3 -m http.server 8000` from this directory.

Share the app URL with invitees so they can sign in and verify the approved
email address. An owner or manager with an empty ledger can explicitly import
older browser-local accounts from the same browser and origin.

## Local emulators

Run `firebase emulators:start --only auth,firestore --project demo-restaurant-accounts`
with the Firebase CLI. Start the static server in a second terminal and open
`http://localhost:8000/?emulator=1`. To test owner access, seed a verified
Auth emulator user with the UID in `firebase-config.js` using the Firebase Admin
SDK connected to the Auth emulator. Use a test-only email and password.

## Firebase Hosting

Pushes to `main` deploy the static app to
[restaurant-account-2.web.app](https://restaurant-account-2.web.app). The
workflow can also be run manually from `main`.

Before the first deployment, confirm the Hosting site `restaurant-account-2`
exists in `restaurant-3be9c` and set the repository's
`FIREBASE_SERVICE_ACCOUNT` Actions secret to the JSON key of a service account
with Firebase Hosting Admin access in that project. Add
`restaurant-account-2.web.app` to Firebase Authentication's Authorized Domains.
Deploy the Firestore rules separately using the command above.

## Require invitations before Firebase Authentication registration

Upgrade Firebase Authentication to Identity Platform and enable the Blaze plan
for Cloud Functions deployment. Confirm that the owner can sign in with the
existing UID in `firebase-config.js` and that the current invitation records in
`access/{email}` are ready. Give the functions' runtime service account the
Firestore read permissions needed to look up these records (Cloud Datastore
Viewer in this project).

From the repository root, deploy both blocking functions:

```sh
npx --yes firebase-tools@15.37.0 deploy --only functions --project restaurant-3be9c
```

The Hosting workflow deploys the website. Deploy the blocking functions
separately with Firebase project credentials. Verify that the existing owner
can sign in, a pending invitation can be claimed, and a new, uninvited email
is rejected before it appears in Authentication → Users. Existing Auth records
are retained. Reinviting a revoked user allows the approved email to sign in
and claim the new invitation.
