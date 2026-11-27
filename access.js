import { firebaseConfig, ownerUid } from './firebase-config.js';

const screen = document.querySelector('#sign-in');
const bar = document.querySelector('#access-bar');
const dialog = document.querySelector('#access-dialog');
const ledger = document.querySelector('#accounts-app');
const strings = {
  signIn: ['Sign in', 'تسجيل الدخول'],
  google: ['Sign in with Google', 'الدخول باستخدام Google'],
  email: ['Email', 'البريد الإلكتروني'],
  password: ['Password', 'كلمة المرور'],
  forgot: ['Forgot password', 'نسيت كلمة المرور'],
  create: ['Create account', 'إنشاء حساب'],
  setup: ['Firebase setup is required before signing in.', 'يلزم إعداد Firebase قبل تسجيل الدخول.'],
  loading: ['Connecting…', 'جارٍ الاتصال…'],
  verify: ['Verify your email, then check again.', 'أكّد بريدك الإلكتروني ثم تحقق مرة أخرى.'],
  resend: ['Resend verification email', 'إعادة إرسال رسالة التأكيد'],
  sent: ['Verification email sent.', 'تم إرسال رسالة التأكيد.'],
  reset: ['If this address has an account, a reset email will be sent.', 'ستصلك رسالة إعادة تعيين إذا كان لهذا البريد حساب.'],
  enterEmail: ['Enter your email address first.', 'أدخل بريدك الإلكتروني أولًا.'],
  check: ['Check access', 'تحقق من الصلاحية'],
  invitationRequired: ['Ask for an invitation before signing in.', 'اطلب دعوة قبل تسجيل الدخول.'],
  waiting: ['Access has not been approved for this email.', 'لم تتم الموافقة على هذا البريد الإلكتروني.'],
  grant: ['Grant access', 'منح الصلاحية'],
  users: ['Users', 'المستخدمون'],
  editName: ['Edit your name', 'عدّل اسمك'],
  displayName: ['Your name', 'اسمك'],
  restaurantName: ['Restaurant name', 'اسم المطعم'],
  editRestaurant: ['Edit restaurant name', 'تعديل اسم المطعم'],
  nameSetup: ['Choose your names', 'أدخل الأسماء'],
  saveNames: ['Save', 'حفظ'],
  invalidName: ['Enter a name of up to 80 characters.', 'أدخل اسمًا لا يزيد عن ٨٠ حرفًا.'],
  logout: ['Sign out', 'تسجيل الخروج'],
  invitee: ['Invitee’s email address', 'البريد الإلكتروني للمدعو'],
  approved: ['After approval, the invitee can sign in using their verified email address.', 'بعد الموافقة، يمكن للمدعو تسجيل الدخول ببريده الإلكتروني المؤكد.'],
  approve: ['Approve invitation', 'الموافقة على الدعوة'],
  pendingList: ['Pending invitations and previous access', 'الدعوات المعلّقة والصلاحيات السابقة'],
  verified: ['Verified users', 'المستخدمون المؤكدون'],
  confirmed: ['An account is confirmed after signing in to the app with a verified email address.', 'يتأكد الحساب بعد تسجيل الدخول ببريد إلكتروني مؤكد.'],
  active: ['Active', 'نشط'],
  pending: ['Pending', 'معلّق'],
  revoked: ['Revoked', 'ملغى'],
  activeDetail: ['Account active and verified', 'الحساب نشط ومؤكّد'],
  pendingDetail: ['Awaiting user sign-in', 'بانتظار تسجيل دخول المستخدم'],
  revoke: ['Revoke access', 'إلغاء الصلاحية'],
  close: ['Close', 'إغلاق'],
  empty: ['No users to show.', 'لا يوجد مستخدمون للعرض.'],
  failure: ['The request failed. Check your details and try again.', 'تعذر تنفيذ الطلب. تحقق من التفاصيل وحاول مرة أخرى.'],
  conflict: ['Another session saved newer accounts. Your unsaved changes were not written. Reload to continue.', 'حفظت جلسة أخرى بيانات أحدث. لم تُحفظ تعديلاتك الأخيرة. أعد تحميل الصفحة للمتابعة.'],
  saveFailed: ['Your changes could not be saved. Reconnect and retry.', 'تعذر حفظ تعديلاتك. أعد الاتصال وحاول مرة أخرى.'],
  retry: ['Retry save', 'إعادة محاولة الحفظ'],
  importLocal: ['Import accounts from this browser', 'استيراد الحسابات من هذا المتصفح'],
  confirmImport: ['Import this browser’s old accounts into your restaurant?', 'هل تريد استيراد حسابات هذا المتصفح القديمة إلى مطعمك؟']
};

const icons = {
  google: `<svg viewBox="0 0 48 48" aria-hidden="true" focusable="false">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
  </svg>`,
  grant: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 12h.01m10-6h.01m0 12h.01M9 11l6-4m-6 6 6 4M5 12a2 2 0 1 0 4 0 2 2 0 0 0-4 0Zm10-6a2 2 0 1 0 4 0 2 2 0 0 0-4 0Zm0 12a2 2 0 1 0 4 0 2 2 0 0 0-4 0Z"/></svg>`,
  users: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m20 0v-2a4 4 0 0 0-3-4m-6-6a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"/></svg>`,
  logout: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m10 17 5-5-5-5m5 5H3m13-8h5v16h-5"/></svg>`,
  language: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12h18m-9 9c5-5 5-13 0-18m0 18c-5-5-5-13 0-18m9 9a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/></svg>`,
};

let arabic = localStorage.getItem('accounts-language') === 'ar';
let authApi, dbApi, auth, db;
let user, role, restaurant, stopLedger, importLocal;
let stage = 'loading';
let generation = 0;
let message = '';
let failure = false;
let view;
let profileName = '';
const t = key => strings[key][arabic ? 1 : 0];
const $ = id => document.getElementById(id);
const toggleLabel = () => arabic ? 'English' : 'العربية';
const accessRef = key => dbApi.doc(db, 'access', key);
const profileRef = uid => dbApi.doc(db, 'profiles', uid);
const emailKey = email => email.trim().toLowerCase();
const validEmail = email => email.length <= 254 && /^[^@/ ]+@[^@/ ]+\.[^@/ ]+$/.test(email);

function signInError(error) {
  return error?.message?.includes('RESTAURANT_INVITATION_REQUIRED') ? 'invitationRequired' : 'failure';
}

function setMessage(key, error = false) {
  message = key;
  failure = error;
  const status = document.querySelector('#access-message');
  if (status) {
    status.textContent = key ? t(key) : '';
    status.toggleAttribute('data-error', error);
  }
}

function render() {
  const language = arabic ? 'ar' : 'en';
  if (document.documentElement.lang !== language) document.documentElement.lang = language;
  for (const el of [screen, bar, dialog]) el.dir = arabic ? 'rtl' : 'ltr';
  const signedIn = stage === 'ready';
  screen.hidden = signedIn;
  bar.hidden = !signedIn;
  ledger.hidden = !signedIn;
  if (signedIn) {
    bar.innerHTML = `<span class="dot" aria-hidden="true"></span><nav>
      ${role === 'owner' ? `<button class="outline" data-action="grant">${icons.grant}${t('grant')}</button>` : ''}
      ${role !== 'worker' ? `<button class="outline" data-action="users">${icons.users}${t('users')}</button>` : ''}
      <button class="outline" data-action="logout">${icons.logout}${t('logout')}</button>
      <button class="outline" data-action="language">${icons.language}${toggleLabel()}</button>
      </nav><button type="button" class="edit-profile-name" data-action="edit-name" aria-haspopup="dialog"><bdi id="signed-in-name"></bdi></button><p class="message" id="access-message" role="status"></p>
      ${importLocal ? `<button class="outline" data-action="import">${t('importLocal')}</button>` : ''}
      <button class="outline" id="retry-save" data-action="retry" hidden>${t('retry')}</button>`;
    $('signed-in-name').textContent = profileName || user.displayName || user.email;
  } else {
    screen.innerHTML = `<article><div class="spread"><strong class="brand app-brand"><img src="./icons/app-192.png" width="28" height="28" alt="">Restaurant Accounts</strong>
      <button class="outline" data-action="language">${toggleLabel()}</button></div><h1>${t('signIn')}</h1>
      ${['login', 'setup'].includes(stage) ? `<form id="login-form"><fieldset ${stage === 'setup' ? 'disabled' : ''}>
        <button type="button" class="outline" data-action="google">${icons.google}${t('google')}</button>
        <label for="login-email">${t('email')}</label>
        <input id="login-email" type="email" dir="ltr" autocomplete="email" maxlength="254" required>
        <div class="spread password-row"><label for="login-password">${t('password')}</label>
        <button type="button" class="text-button" data-action="forgot">${t('forgot')}</button></div>
        <input id="login-password" type="password" dir="ltr" autocomplete="current-password" required>
        <div class="stack"><button type="submit" class="primary">${t('signIn')}</button>
        <button type="submit" class="outline brand" value="create">${t('create')}</button></div>
      </fieldset></form>` : ''}
      ${['verify', 'waiting'].includes(stage) ? `<p>${t(stage)}</p><div class="stack">
        <button class="primary" data-action="check">${t('check')}</button>
        ${stage === 'verify' ? `<button class="outline" data-action="resend">${t('resend')}</button>` : ''}
        <button class="outline" data-action="logout">${t('logout')}</button></div>` : ''}
      <p class="message" id="access-message" role="status"></p></article>`;
  }
  setMessage(message, failure);
  if (signedIn) $('retry-save').hidden = message !== 'saveFailed';
}

function setStage(next, note = '') {
  stage = next;
  message = note;
  failure = false;
  render();
}

async function connect(current) {
  const id = ++generation;
  stopLedger?.();
  stopLedger = null;
  dialog.close();
  window.restaurantAccounts.close();
  user = current;
  profileName = '';
  role = restaurant = null;
  importLocal = null;
  if (!user) return setStage('login');
  if (!user.emailVerified || !user.email) return setStage('verify');
  setStage('loading', 'loading');
  try {
    const key = emailKey(current.email);
    let nextRole = 'owner';
    let nextRestaurant = key;
    if (current.uid !== ownerUid) {
      const ref = accessRef(key);
      const grant = (await dbApi.getDocFromServer(ref)).data();
      const canClaim = grant?.role === 'manager' && grant.state === 'pending';
      const hasGrant = grant?.state === 'active' && grant.uid === current.uid;
      if (!canClaim && !hasGrant) {
        if (id === generation) setStage('waiting');
        return;
      }
      if (canClaim) await dbApi.updateDoc(ref, { state: 'active', uid: current.uid });
      nextRole = grant.role;
      nextRestaurant = grant.restaurant;
    }
    const ref = dbApi.doc(db, 'restaurants', nextRestaurant);
    const [snapshot, profile] = await Promise.all([
      dbApi.getDocFromServer(ref),
      dbApi.getDocFromServer(profileRef(current.uid)).catch(() => null)
    ]);
    if (id !== generation) return;
    profileName = profile?.data()?.name || '';
    role = nextRole;
    restaurant = nextRestaurant;
    openLedger(ref, snapshot, id);
    setStage('ready');
    const needsName = !profileName && (profile !== null || !current.displayName);
    const needsRestaurant = role !== 'worker' && !window.restaurantAccounts.restaurantName();
    if (needsName || needsRestaurant) openNameDialog('nameSetup', needsName, needsRestaurant);
  } catch {
    if (id === generation) setStage('waiting', 'failure');
  }
}

let flushLedger;
function openLedger(ref, snapshot, id) {
  let stored = snapshot.data()?.ledger ?? null;
  let next = stored;
  let saving;
  let conflict = false;
  const saveChanges = async () => {
    try {
      while (id === generation && next !== stored) {
        const value = next;
        await dbApi.runTransaction(db, async tx => {
          const existing = (await tx.get(ref)).data()?.ledger ?? null;
          if (existing !== stored) throw new Error('ledger-changed');
          tx.set(ref, { ledger: value });
        });
        stored = value;
      }
      if (id === generation && message === 'saveFailed') {
        setMessage('');
        $('retry-save').hidden = true;
      }
      return true;
    } catch (error) {
      if (id !== generation) return false;
      conflict = error.message === 'ledger-changed';
      setMessage(conflict ? 'conflict' : 'saveFailed', true);
      $('retry-save').hidden = conflict;
      return false;
    }
  };
  flushLedger = () => {
    if (id !== generation || conflict) return false;
    saving ??= saveChanges().finally(() => { saving = null; });
    return saving;
  };
  const persist = value => {
    if (value === next) return;
    next = value;
    void flushLedger();
  };
  window.restaurantAccounts.open(stored, persist);
  if (stored === null && role !== 'worker') {
    const legacy = localStorage.getItem('rest_acc');
    if (legacy) importLocal = () => {
      if (next !== null || !window.confirm(t('confirmImport'))) return;
      importLocal = null;
      window.restaurantAccounts.open(legacy, persist);
      window.restaurantAccounts.save();
      render();
    };
  }
  const unsubscribeLedger = dbApi.onSnapshot(ref, { includeMetadataChanges: true }, update => {
    // Incorporate another session's edits only when this session has no local edits.
    if (id !== generation || update.metadata.fromCache || update.metadata.hasPendingWrites || saving || next !== stored) return;
    const value = update.data()?.ledger ?? null;
    if (value === stored) return;
    stored = next = value;
    if (importLocal) {
      importLocal = null;
      render();
    }
    window.restaurantAccounts.open(value, persist);
  }, error => {
    if (id === generation && error.code === 'permission-denied') void connect(currentUser());
  });
  const unsubscribeGrant = role === 'owner' ? null : dbApi.onSnapshot(
    accessRef(emailKey(user.email)), { includeMetadataChanges: true }, update => {
      if (id !== generation || update.metadata.fromCache || update.metadata.hasPendingWrites) return;
      const grant = update.data();
      if (grant?.state !== 'active' || grant.uid !== user.uid) void connect(currentUser());
    }
  );
  stopLedger = () => {
    unsubscribeLedger();
    unsubscribeGrant?.();
  };
}

const currentUser = () => auth.currentUser;

function openNameDialog(title, showProfile, showRestaurant) {
  dialog.innerHTML = `<h2 id="access-dialog-title">${t(title)}</h2>
    <form id="name-form" class="name-form">
      ${showProfile ? `<label for="profile-name">${t('displayName')}</label>
        <input id="profile-name" autocomplete="name" maxlength="80" required>` : ''}
      ${showRestaurant ? `<label for="restaurant-name">${t('restaurantName')}</label>
        <input id="restaurant-name" maxlength="80" required>` : ''}
      <p class="message" id="dialog-message" role="status"></p>
      <button type="submit" class="primary">${t('saveNames')}</button>
    </form>
    <footer class="dialog-footer"><button type="button" class="outline" data-action="close">${t('close')}</button></footer>`;
  if (showProfile) $('profile-name').value = (profileName || user.displayName || '').slice(0, 80);
  if (showRestaurant) $('restaurant-name').value = window.restaurantAccounts.restaurantName().slice(0, 80);
  dialog.setAttribute('aria-labelledby', 'access-dialog-title');
  if (!dialog.open) dialog.showModal();
}

async function openDialog(kind) {
  view = kind;
  const isGrant = kind === 'grant';
  dialog.innerHTML = `<h2 id="access-dialog-title">${t(kind)}</h2>
    ${isGrant ? `<form id="invite-form"><label for="invite-email"><strong>${t('invitee')}</strong></label>
    <input id="invite-email" type="email" dir="ltr" maxlength="254" required>
    <p>${t('approved')}</p><button class="primary" type="submit">${t('approve')}</button></form>` : ''}
    <h3>${t(isGrant ? 'pendingList' : 'verified')}</h3><p>${t('confirmed')}</p>
    <p class="message" id="dialog-message" role="status"></p><div id="access-list"></div>
    <footer class="dialog-footer"><button class="outline" data-action="close">${t('close')}</button></footer>`;
  dialog.setAttribute('aria-labelledby', 'access-dialog-title');
  if (!dialog.open) dialog.showModal();
  await loadUsers();
}

async function loadUsers() {
  const list = $('access-list');
  const status = $('dialog-message');
  const { collection, query, where, getDocsFromServer } = dbApi;
  const filters = [where('role', '==', role === 'owner' ? 'manager' : 'worker')];
  if (role === 'manager') filters.push(where('restaurant', '==', restaurant));
  try {
    const result = await getDocsFromServer(query(collection(db, 'access'), ...filters));
    if (!dialog.open || !list.isConnected) return;
    list.replaceChildren();
    for (const item of result.docs) {
      const state = item.data().state;
      if ((view === 'users') !== (state === 'active')) continue;
      const row = document.createElement('div');
      row.className = 'entry spread';
      const details = document.createElement('div');
      details.className = 'entry-details';
      const email = document.createElement('bdi');
      email.textContent = item.id;
      const badge = document.createElement('div');
      badge.className = 'status ' + state;
      badge.textContent = t(state);
      details.append(email, badge);
      if (state !== 'revoked') {
        const description = document.createElement('span');
        description.className = 'entry-note';
        description.textContent = t(state === 'active' ? 'activeDetail' : 'pendingDetail');
        details.append(description);
      }
      row.append(details);
      if (state !== 'revoked') {
        const button = document.createElement('button');
        button.className = 'outline';
        button.textContent = t('revoke');
        button.onclick = async () => {
          button.disabled = true;
          try {
            await dbApi.updateDoc(item.ref, { state: 'revoked', uid: '' });
            await loadUsers();
          } catch {
            status.textContent = t('failure');
            button.disabled = false;
          }
        };
        row.append(button);
      }
      list.append(row);
    }
    if (!list.children.length) list.textContent = t('empty');
  } catch {
    status.textContent = t('failure');
  }
}

document.addEventListener('submit', async event => {
  if (!['login-form', 'invite-form', 'name-form'].includes(event.target.id)) return;
  event.preventDefault();
  const button = event.submitter;
  if (button) button.disabled = true;
  try {
    if (event.target.id === 'login-form') {
      const email = $('login-email').value.trim();
      const password = $('login-password').value;
      if (button?.value === 'create') {
        const credential = await authApi.createUserWithEmailAndPassword(auth, email, password);
        await authApi.sendEmailVerification(credential.user);
        setMessage('sent');
      } else {
        await authApi.signInWithEmailAndPassword(auth, email, password);
      }
      return;
    }
    if (event.target.id === 'name-form') {
      if (stage !== 'ready') return;
      const id = generation;
      const name = $('profile-name')?.value.trim();
      const restaurantName = $('restaurant-name')?.value.trim();
      const status = $('dialog-message');
      if ([name, restaurantName].some(value => value !== undefined && (!value || value.length > 80))) {
        status.textContent = t('invalidName');
        return;
      }
      if (restaurantName) window.restaurantAccounts.setRestaurantName(restaurantName);
      if (name && name !== profileName) {
        const account = user;
        try {
          await dbApi.setDoc(profileRef(account.uid), { name });
        } catch (error) {
          // Projects with older rules can still save a personal name in Firebase Auth.
          if (error.code !== 'permission-denied' || id !== generation) throw error;
          await authApi.updateProfile(account, { displayName: name });
        }
        if (id !== generation) return;
        profileName = name;
        $('signed-in-name').textContent = name;
      }
      if (event.target.isConnected) dialog.close();
      return;
    }
    if (role !== 'owner') return;
    const field = $('invite-email');
    const key = emailKey(field.value);
    const status = $('dialog-message');
    status.textContent = '';
    if (!validEmail(key) || key === emailKey(user.email)) {
      status.textContent = t('enterEmail');
      return;
    }
    const ref = accessRef(key);
    const invite = { role: 'manager', restaurant: key, state: 'pending', uid: '' };
    await dbApi.setDoc(ref, invite);
    field.value = '';
    await loadUsers();
  } catch (error) {
    if (event.target.id !== 'login-form') {
      const status = event.target.querySelector('#dialog-message') || (event.target.isConnected && $('dialog-message'));
      if (status) status.textContent = t('failure');
    } else {
      setMessage(signInError(error), true);
    }
  } finally {
    if (button) button.disabled = false;
  }
});

document.addEventListener('click', async event => {
  const button = event.target.closest('[data-action]');
  if (!button) return;
  try {
    switch (button.dataset.action) {
      case 'language': {
        const email = $('login-email')?.value;
        arabic = !arabic;
        localStorage.setItem('accounts-language', arabic ? 'ar' : 'en');
        render();
        if (email && $('login-email')) $('login-email').value = email;
        break;
      }
      case 'google': await authApi.signInWithPopup(auth, new authApi.GoogleAuthProvider()); break;
      case 'forgot': {
        const input = $('login-email');
        if (!input.value || !input.checkValidity()) return setMessage('enterEmail', true);
        await authApi.sendPasswordResetEmail(auth, input.value.trim());
        setMessage('reset');
        break;
      }
      case 'edit-name':
        if (stage === 'ready') openNameDialog('editName', true, false);
        break;
      case 'edit-restaurant':
        if (stage === 'ready') openNameDialog('editRestaurant', false, true);
        break;
      case 'logout':
        if (stage === 'ready' && await flushLedger?.() === false) break;
        await authApi.signOut(auth);
        break;
      case 'check':
        await authApi.reload(currentUser());
        await currentUser().getIdToken(true);
        await connect(currentUser());
        break;
      case 'resend':
        await authApi.sendEmailVerification(currentUser());
        setMessage('sent');
        break;
      case 'grant':
        if (role === 'owner') await openDialog('grant');
        break;
      case 'users':
        if (role === 'owner' || role === 'manager') await openDialog(button.dataset.action);
        break;
      case 'close': dialog.close(); break;
      case 'retry': await flushLedger?.(); break;
      case 'import': importLocal?.(); break;
    }
  } catch (error) {
    setMessage(signInError(error), true);
  }
});

const emulator = ['localhost', '127.0.0.1'].includes(location.hostname)
  && new URLSearchParams(location.search).get('emulator') === '1';
if (!firebaseConfig && !emulator) {
  setStage('setup', 'setup');
} else {
  setStage('loading', 'loading');
  try {
    const sdk = 'https://www.gstatic.com/firebasejs/11.10.0/';
    const [{ initializeApp }, authentication, firestore] = await Promise.all([
      import(sdk + 'firebase-app.js'), import(sdk + 'firebase-auth.js'), import(sdk + 'firebase-firestore.js')
    ]);
    authApi = authentication;
    dbApi = firestore;
    const app = initializeApp(emulator ? { projectId: 'demo-restaurant-accounts', apiKey: 'demo-key' } : firebaseConfig);
    auth = authApi.getAuth(app);
    db = dbApi.getFirestore(app);
    if (emulator) {
      authApi.connectAuthEmulator(auth, 'http://' + location.hostname + ':9099');
      dbApi.connectFirestoreEmulator(db, location.hostname, 8080);
    }
    authApi.onAuthStateChanged(auth, connect);
  } catch {
    setStage('setup', 'failure');
  }
}
