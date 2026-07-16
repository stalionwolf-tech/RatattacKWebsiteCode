/**
 * ------------------------------------------------------------
 * RatAttacK — Mock Authentication Provider
 * ------------------------------------------------------------
 * Fully local, localStorage-backed auth. Simulates a Shopify Customer
 * Accounts style API so we can swap it for the real thing later without
 * touching any UI code.
 *
 * IMPORTANT: This is a DEVELOPMENT-ONLY provider. Passwords are stored
 * client-side with a trivial obfuscation — do NOT ship this to production
 * without replacing it with the Shopify provider.
 *
 * Public interface (matches AuthProvider contract in ./index.js):
 *   getCurrentUser(): User | null
 *   login({ email, password }): Promise<{ user }>
 *   signup({ email, password, firstName, lastName, acceptsMarketing }): Promise<{ user }>
 *   logout(): Promise<void>
 *   requestPasswordReset(email): Promise<{ token }>
 *   resetPassword({ token, newPassword }): Promise<{ user }>
 *   updateProfile(patch): Promise<{ user }>
 *   changePassword({ currentPassword, newPassword }): Promise<{ ok: true }>
 *   subscribe(listener): () => void
 */

const LS_USERS   = 'ratattack_mock_users_v1';
const LS_SESSION = 'ratattack_auth_session_v1';
const LS_TOKENS  = 'ratattack_mock_reset_tokens_v1';

// -------------- helpers ----------------------------------------------------
const hasWindow = () => typeof window !== 'undefined';
const uuid = () => (hasWindow() && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`);
const gid  = (id = uuid()) => `gid://ratattack/Customer/${id}`;
const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));
const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRx = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

// SUPER simple obfuscation. Not secure. Replaced when we swap providers.
const pwHash = (p) => (hasWindow() ? btoa(unescape(encodeURIComponent(`ratattack::${p}`))) : Buffer.from(`ratattack::${p}`).toString('base64'));

const readLS = (k, fallback) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fallback; } catch { return fallback; } };
const writeLS = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };
const removeLS = (k) => { try { localStorage.removeItem(k); } catch {} };

// Default demo/seed user so the login page works out of the box during dev.
const SEED_EMAIL = 'ratsalot@ratattack.gg';
const SEED_PASSWORD = 'Horde1234!';

function ensureSeedUser() {
  if (!hasWindow()) return;
  const users = readLS(LS_USERS, []);
  if (users.find((u) => u.email === SEED_EMAIL)) return;
  users.push({
    id: gid('seed-ratsalot'),
    email: SEED_EMAIL,
    passwordHash: pwHash(SEED_PASSWORD),
    firstName: 'Ratsalot',
    lastName:  'Verrik',
    displayName: 'Ratsalot Verrik',
    phone: null,
    avatar: null,
    acceptsMarketing: true,
    // A brand-new customer starts at zero \u2014 no fake achievements/points.
    hordeRank:  'Initiate',
    points:      0,
    nextTier:   'Cutthroat',
    nextTierAt: 500,
    createdAt:  new Date().toISOString(),
    tags: ['seed', 'demo'],
  });
  writeLS(LS_USERS, users);
}

function sanitize(u) {
  if (!u) return null;
  const { passwordHash, ...safe } = u;
  return safe;
}

// -------------- listeners --------------------------------------------------
const listeners = new Set();
function emit() {
  const u = getCurrentUser();
  for (const l of listeners) { try { l(u); } catch {} }
}
export function subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); }

// -------------- session ----------------------------------------------------
function findUserByEmail(email) {
  ensureSeedUser();
  const users = readLS(LS_USERS, []);
  return users.find((u) => u.email.toLowerCase() === String(email).toLowerCase()) || null;
}

export function getCurrentUser() {
  if (!hasWindow()) return null;
  ensureSeedUser();
  const session = readLS(LS_SESSION, null);
  if (!session?.userId) return null;
  if (session.expiresAt && Date.now() > session.expiresAt) { removeLS(LS_SESSION); return null; }
  const users = readLS(LS_USERS, []);
  const u = users.find((x) => x.id === session.userId);
  return sanitize(u);
}

function createSession(userId, remember = true) {
  const expiresAt = Date.now() + (remember ? 30 : 1) * 24 * 60 * 60 * 1000;
  const session = { userId, token: uuid(), expiresAt, createdAt: Date.now() };
  writeLS(LS_SESSION, session);
  emit();
  return session;
}

// -------------- Auth API ---------------------------------------------------
export async function login({ email, password, remember = true } = {}) {
  await delay(400);
  if (!emailRx.test(String(email || ''))) throw new Error('Please enter a valid email address.');
  if (!password) throw new Error('Password is required.');
  const u = findUserByEmail(email);
  if (!u) throw new Error('No account found for that email. Try signing up instead.');
  if (u.passwordHash !== pwHash(password)) throw new Error('Incorrect password. Try again or reset it.');
  createSession(u.id, remember);
  return { user: sanitize(u) };
}

export async function signup({ email, password, firstName, lastName, acceptsMarketing = true } = {}) {
  await delay(500);
  if (!emailRx.test(String(email || ''))) throw new Error('Please enter a valid email address.');
  if (!passwordRx.test(String(password || ''))) throw new Error('Password must be at least 8 characters and include a letter and a number.');
  if (!firstName?.trim() || !lastName?.trim()) throw new Error('First and last name are required.');
  ensureSeedUser();
  const users = readLS(LS_USERS, []);
  if (users.find((u) => u.email.toLowerCase() === String(email).toLowerCase())) {
    throw new Error('An account with this email already exists. Try signing in.');
  }
  const newUser = {
    id: gid(),
    email: String(email).toLowerCase(),
    passwordHash: pwHash(password),
    firstName: firstName.trim(),
    lastName:  lastName.trim(),
    displayName: `${firstName.trim()} ${lastName.trim()}`,
    phone: null,
    avatar: null,
    acceptsMarketing: !!acceptsMarketing,
    hordeRank:  'Initiate',
    points:      0,
    nextTier:   'Cutthroat',
    nextTierAt: 500,
    createdAt:  new Date().toISOString(),
    tags: ['newsletter', 'ratattack-site'],
  };
  users.push(newUser);
  writeLS(LS_USERS, users);
  createSession(newUser.id, true);
  return { user: sanitize(newUser) };
}

export async function logout() {
  await delay(200);
  removeLS(LS_SESSION);
  emit();
}

export async function requestPasswordReset(email) {
  await delay(400);
  if (!emailRx.test(String(email || ''))) throw new Error('Please enter a valid email address.');
  const u = findUserByEmail(email);
  // For security we don't reveal whether email exists. We DO issue a token if it does.
  if (!u) return { token: null, delivered: true };
  const tokens = readLS(LS_TOKENS, {});
  const token = uuid().replace(/-/g, '').slice(0, 24);
  tokens[token] = { userId: u.id, expiresAt: Date.now() + 60 * 60 * 1000 };
  writeLS(LS_TOKENS, tokens);
  return { token, delivered: true }; // token surfaced for dev; real provider would email it
}

export async function resetPassword({ token, newPassword } = {}) {
  await delay(400);
  if (!token) throw new Error('Reset token is required.');
  if (!passwordRx.test(String(newPassword || ''))) throw new Error('Password must be at least 8 characters and include a letter and a number.');
  const tokens = readLS(LS_TOKENS, {});
  const record = tokens[token];
  if (!record) throw new Error('Invalid or expired reset token.');
  if (Date.now() > record.expiresAt) { delete tokens[token]; writeLS(LS_TOKENS, tokens); throw new Error('This reset token has expired. Please request a new one.'); }
  const users = readLS(LS_USERS, []);
  const idx = users.findIndex((u) => u.id === record.userId);
  if (idx < 0) throw new Error('Account not found.');
  users[idx].passwordHash = pwHash(newPassword);
  writeLS(LS_USERS, users);
  delete tokens[token]; writeLS(LS_TOKENS, tokens);
  createSession(users[idx].id, true);
  return { user: sanitize(users[idx]) };
}

export async function updateProfile(patch = {}) {
  await delay(300);
  const session = readLS(LS_SESSION, null);
  if (!session?.userId) throw new Error('You must be signed in.');
  const users = readLS(LS_USERS, []);
  const idx = users.findIndex((u) => u.id === session.userId);
  if (idx < 0) throw new Error('Account not found.');
  const allowed = ['firstName','lastName','displayName','phone','avatar','acceptsMarketing','hordeRank','points','nextTier','nextTierAt'];
  for (const key of allowed) if (key in patch) users[idx][key] = patch[key];
  if (patch.firstName || patch.lastName) users[idx].displayName = `${users[idx].firstName} ${users[idx].lastName}`;
  writeLS(LS_USERS, users);
  emit();
  return { user: sanitize(users[idx]) };
}

export async function changePassword({ currentPassword, newPassword } = {}) {
  await delay(400);
  const session = readLS(LS_SESSION, null);
  if (!session?.userId) throw new Error('You must be signed in.');
  if (!passwordRx.test(String(newPassword || ''))) throw new Error('New password must be at least 8 characters and include a letter and a number.');
  const users = readLS(LS_USERS, []);
  const idx = users.findIndex((u) => u.id === session.userId);
  if (idx < 0) throw new Error('Account not found.');
  if (users[idx].passwordHash !== pwHash(currentPassword)) throw new Error('Current password is incorrect.');
  users[idx].passwordHash = pwHash(newPassword);
  writeLS(LS_USERS, users);
  return { ok: true };
}

// Marker so the UI can display a dev-only banner — removed on real provider.
export const providerMeta = {
  id: 'mock',
  label: 'Mock (localStorage)',
  seed: { email: SEED_EMAIL, password: SEED_PASSWORD },
};
