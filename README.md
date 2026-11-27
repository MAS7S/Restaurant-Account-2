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
