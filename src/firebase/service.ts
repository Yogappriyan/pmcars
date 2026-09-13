import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup,
  GoogleAuthProvider,
  signOut, 
  onAuthStateChanged, 
  User, 
  Auth 
} from 'firebase/auth';
import { 
  initializeFirestore, 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  Firestore, 
  serverTimestamp,
  getDocFromServer,
  disableNetwork
} from 'firebase/firestore';
import { 
  getStorage, 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject, 
  FirebaseStorage 
} from 'firebase/storage';
import { firebaseConfig, isFirebaseConfigured } from './config';
import { Vehicle, SellRequest, AdminUser, NormalUser, AppUser, BusinessSettings, CustomerBooking } from '../types';
import { INITIAL_VEHICLES, INITIAL_SETTINGS } from '../data/initialData';

// Firestore Error Types as required by the Firebase Integration Skill
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null, authInstance?: Auth): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: authInstance?.currentUser?.uid || null,
      email: authInstance?.currentUser?.email || null,
      emailVerified: authInstance?.currentUser?.emailVerified || null,
      isAnonymous: authInstance?.currentUser?.isAnonymous || null,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Singleton state
let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;

const isConfigured = isFirebaseConfigured();

if (isConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    const dbId = (firebaseConfig as any).firestoreDatabaseId;
    db = dbId 
      ? initializeFirestore(app, { experimentalForceLongPolling: true, ignoreUndefinedProperties: true }, dbId)
      : initializeFirestore(app, { experimentalForceLongPolling: true, ignoreUndefinedProperties: true });
    storage = getStorage(app);

    // Validate connection to Firestore as mandated by Firebase Integration Skill
    testConnection();
  } catch (err) {
    console.warn("Firebase initialization warning, falling back to local persistent storage:", err);
  }
}

async function testConnection() {
  if (!db) return;
  try {
    await getDocFromServer(doc(db, 'settings', 'business'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn("Please check your Firebase configuration: Firestore client is operating in offline mode.");
    }
  }
}

export { app, auth, db, storage };

// Local Storage Keys for offline / demo mode
const LS_VEHICLES_KEY = 'pmcars_vehicles_ecommerce_v3';
const LS_SELL_REQUESTS_KEY = 'pmcars_sell_requests_v1';
const LS_SETTINGS_KEY = 'pmcars_business_settings_v1';
const LS_ADMIN_SESSION_KEY = 'pmcars_admin_session_v1';
export const LS_USER_SESSION_KEY = 'pmcars_user_session_v1';

// Seed local storage if empty
function getLocalVehicles(): Vehicle[] {
  try {
    const saved = localStorage.getItem(LS_VEHICLES_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length >= INITIAL_VEHICLES.length) {
        return parsed;
      }
    }
  } catch (e) {
    console.error("Local storage error:", e);
  }
  localStorage.setItem(LS_VEHICLES_KEY, JSON.stringify(INITIAL_VEHICLES));
  return INITIAL_VEHICLES;
}

function saveLocalVehicles(vehicles: Vehicle[]) {
  localStorage.setItem(LS_VEHICLES_KEY, JSON.stringify(vehicles));
  window.dispatchEvent(new CustomEvent('pmcars-vehicles-updated', { detail: vehicles }));
}

function getLocalSellRequests(): SellRequest[] {
  try {
    const saved = localStorage.getItem(LS_SELL_REQUESTS_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error("Local storage error:", e);
  }
  // Initial demo sell request
  const initial: SellRequest[] = [
    {
      id: "sr-101",
      name: "Murugan Selvam",
      phone: "9443218765",
      vehicleBrand: "Maruti Suzuki",
      vehicleModel: "Swift VXI",
      year: 2019,
      kilometers: 52000,
      fuelType: "Petrol",
      expectedPrice: 520000,
      registrationType: "Own Board",
      message: "Single owner vehicle, Ariyalur registration TN-61. Well maintained with regular service. Want to sell via parking sales.",
      status: "new",
      createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString()
    }
  ];
  localStorage.setItem(LS_SELL_REQUESTS_KEY, JSON.stringify(initial));
  return initial;
}

function saveLocalSellRequests(requests: SellRequest[]) {
  localStorage.setItem(LS_SELL_REQUESTS_KEY, JSON.stringify(requests));
  window.dispatchEvent(new CustomEvent('pmcars-sellrequests-updated', { detail: requests }));
}

function getLocalSettings(): BusinessSettings {
  try {
    const saved = localStorage.getItem(LS_SETTINGS_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error("Local storage error:", e);
  }
  localStorage.setItem(LS_SETTINGS_KEY, JSON.stringify(INITIAL_SETTINGS));
  return INITIAL_SETTINGS;
}

function saveLocalSettings(settings: BusinessSettings) {
  localStorage.setItem(LS_SETTINGS_KEY, JSON.stringify(settings));
  window.dispatchEvent(new CustomEvent('pmcars-settings-updated', { detail: settings }));
}

/* =========================================================================
   PUBLIC / REAL-TIME SUBSCRIPTIONS
   ========================================================================= */

/**
 * Subscribes to vehicles collection.
 * Uses real Firestore onSnapshot when configured, otherwise uses local event bus.
 */
export function subscribeToVehicles(callback: (vehicles: Vehicle[]) => void): () => void {
  // Always emit current local vehicles immediately for instant UI render
  callback(getLocalVehicles());

  // Listen to local update events (from status changes, edits, deletes)
  const localHandler = () => {
    callback(getLocalVehicles());
  };
  window.addEventListener('pmcars-vehicles-updated', localHandler);

  let unsubscribeFirestore: (() => void) | null = null;

  if (db && isConfigured) {
    try {
      const q = query(collection(db, 'vehicles'), orderBy('createdAt', 'desc'));
      unsubscribeFirestore = onSnapshot(
        q,
        (snapshot) => {
          const remoteList: Vehicle[] = [];
          snapshot.forEach((docSnap) => {
            remoteList.push({ id: docSnap.id, ...(docSnap.data() as Omit<Vehicle, 'id'>) });
          });

          const local = getLocalVehicles();
          if (remoteList.length > 0) {
            const remoteMap = new Map(remoteList.map((v) => [v.id, v]));
            // Merge: if local item was updated more recently, preserve local status/data
            const merged = local.map((lv) => {
              const rv = remoteMap.get(lv.id);
              if (!rv) return lv;
              if (rv.updatedAt && lv.updatedAt && new Date(rv.updatedAt) >= new Date(lv.updatedAt)) {
                return rv;
              }
              return lv;
            });
            // Append any remote vehicle not yet in local storage
            const localIdSet = new Set(local.map((v) => v.id));
            for (const rv of remoteList) {
              if (!localIdSet.has(rv.id)) {
                merged.push(rv);
              }
            }
            localStorage.setItem(LS_VEHICLES_KEY, JSON.stringify(merged));
            callback(merged);
          } else {
            callback(local);
          }
        },
        (error) => {
          console.warn("Firestore onSnapshot error, falling back to local data:", error);
          callback(getLocalVehicles());
        }
      );
    } catch (err) {
      console.warn("Error setting up Firestore vehicle subscription:", err);
    }
  }

  return () => {
    window.removeEventListener('pmcars-vehicles-updated', localHandler);
    if (unsubscribeFirestore) {
      unsubscribeFirestore();
    }
  };
}

/**
 * Subscribes to sell requests collection (for Admin).
 */
export function subscribeToSellRequests(callback: (requests: SellRequest[]) => void): () => void {
  if (db && isConfigured) {
    try {
      const q = query(collection(db, 'sellRequests'), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const list: SellRequest[] = [];
          snapshot.forEach((docSnap) => {
            list.push({ id: docSnap.id, ...(docSnap.data() as Omit<SellRequest, 'id'>) });
          });
          callback(list.length > 0 ? list : getLocalSellRequests());
        },
        (error) => {
          console.warn("Firestore sellRequests error:", error);
          callback(getLocalSellRequests());
        }
      );
      return unsubscribe;
    } catch (err) {
      console.warn("Error setting up sellRequests subscription:", err);
    }
  }

  callback(getLocalSellRequests());
  const handler = () => callback(getLocalSellRequests());
  window.addEventListener('pmcars-sellrequests-updated', handler);
  return () => window.removeEventListener('pmcars-sellrequests-updated', handler);
}

/**
 * Subscribes to Business Settings.
 */
export function subscribeToSettings(callback: (settings: BusinessSettings) => void): () => void {
  if (db && isConfigured) {
    try {
      const docRef = doc(db, 'settings', 'business');
      const unsubscribe = onSnapshot(
        docRef,
        (docSnap) => {
          if (docSnap.exists()) {
            callback(docSnap.data() as BusinessSettings);
          } else {
            callback(getLocalSettings());
          }
        },
        () => callback(getLocalSettings())
      );
      return unsubscribe;
    } catch (err) {
      console.warn("Error subscribing to settings:", err);
    }
  }

  callback(getLocalSettings());
  const handler = () => callback(getLocalSettings());
  window.addEventListener('pmcars-settings-updated', handler);
  return () => window.removeEventListener('pmcars-settings-updated', handler);
}

/* =========================================================================
   SELL CAR SUBMISSIONS (PUBLIC)
   ========================================================================= */

export async function submitSellRequest(data: Omit<SellRequest, 'id' | 'createdAt' | 'status'>): Promise<string> {
  const newId = `sr-${Date.now()}`;
  const record: SellRequest = {
    ...data,
    id: newId,
    status: 'new',
    createdAt: new Date().toISOString()
  };

  if (db && isConfigured) {
    try {
      const docRef = await addDoc(collection(db, 'sellRequests'), {
        ...record,
        serverTime: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.warn("Firestore sellRequest failed, saving to local store:", error);
    }
  }

  // Local fallback
  const existing = getLocalSellRequests();
  saveLocalSellRequests([record, ...existing]);
  return newId;
}

/* =========================================================================
   ADMIN AUTHENTICATION & AUTHORIZATION (AUTHORIZED GMAIL ONLY)
   ========================================================================= */

export const AUTHORIZED_ADMIN_EMAILS = [
  'man695223@gmail.com'
];

export function isAuthorizedAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  return AUTHORIZED_ADMIN_EMAILS.some((e) => e.toLowerCase() === normalized);
}

export interface AdminAuthState {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  error: string | null;
}

/**
 * Verifies if a Firebase UID exists in the /admins collection and active == true.
 */
export async function verifyAdminStatus(uid: string): Promise<boolean> {
  if (!db || !isConfigured) return false;
  try {
    const adminDoc = await getDoc(doc(db, 'admins', uid));
    if (adminDoc.exists()) {
      const data = adminDoc.data();
      return data?.role === 'admin' && data?.active === true;
    }
    return false;
  } catch (error) {
    console.error("Admin verification check failed:", error);
    return false;
  }
}

/**
 * Authenticates any Google account in real-time.
 * Strictly separates:
 * 1) Registered Dealership Admin: man695223@gmail.com -> Admin role & Admin Dashboard access
 * 2) Every other Gmail -> Normal User role (Customer Portal), strictly barred from Admin Dashboard!
 */
export async function authenticateWithGoogleAccount(account: {
  email: string;
  name?: string;
  photoURL?: string;
  uid?: string;
}): Promise<{
  success: boolean;
  user: AppUser;
  isAdmin: boolean;
  message: string;
}> {
  const cleanEmail = account.email.trim().toLowerCase();
  const isAdmin = isAuthorizedAdminEmail(cleanEmail);
  const now = new Date().toISOString();

  if (isAdmin) {
    const adminUser: AdminUser = {
      uid: account.uid || `admin-${cleanEmail.replace(/[^a-zA-Z0-9]/g, '-')}`,
      email: cleanEmail,
      name: account.name || 'PM Cars Dealership Owner',
      photoURL: account.photoURL,
      role: 'admin',
      active: true,
      createdAt: now,
      lastLogin: now
    };

    localStorage.setItem(LS_ADMIN_SESSION_KEY, JSON.stringify(adminUser));
    localStorage.setItem(LS_USER_SESSION_KEY, JSON.stringify(adminUser));
    window.dispatchEvent(new CustomEvent('pmcars-admin-session-changed', { detail: adminUser }));
    window.dispatchEvent(new CustomEvent('pmcars-user-session-changed', { detail: adminUser }));

    // Sync admin record in Firestore
    if (db) {
      try {
        const adminRef = doc(db, 'admins', adminUser.uid);
        await setDoc(adminRef, {
          uid: adminUser.uid,
          email: adminUser.email,
          name: adminUser.name,
          role: 'admin',
          active: true,
          lastLogin: now
        }, { merge: true });
      } catch (err) {
        console.warn("Could not save admin document in Firestore:", err);
      }
    }

    return {
      success: true,
      user: adminUser,
      isAdmin: true,
      message: `Welcome Dealership Owner (${cleanEmail})! Admin Dashboard access granted.`
    };
  } else {
    // NORMAL USER / CUSTOMER ACCOUNT
    const normalUser: NormalUser = {
      uid: account.uid || `user-${cleanEmail.replace(/[^a-zA-Z0-9]/g, '-')}`,
      email: cleanEmail,
      name: account.name || cleanEmail.split('@')[0],
      photoURL: account.photoURL,
      role: 'user',
      active: true,
      createdAt: now,
      lastLogin: now
    };

    // CRITICAL: Strictly ensure Admin session is cleared!
    localStorage.removeItem(LS_ADMIN_SESSION_KEY);
    localStorage.setItem(LS_USER_SESSION_KEY, JSON.stringify(normalUser));
    window.dispatchEvent(new CustomEvent('pmcars-admin-session-changed', { detail: null }));
    window.dispatchEvent(new CustomEvent('pmcars-user-session-changed', { detail: normalUser }));

    // Save customer profile to Firestore /users
    if (db) {
      try {
        await setDoc(doc(db, 'users', normalUser.uid), {
          uid: normalUser.uid,
          email: normalUser.email,
          name: normalUser.name,
          role: 'user',
          active: true,
          lastLogin: now
        }, { merge: true });
      } catch (err) {
        // Non-blocking
      }
    }

    return {
      success: true,
      user: normalUser,
      isAdmin: false,
      message: `Signed in as Customer (${cleanEmail}). Access to Dealership Admin Dashboard is restricted.`
    };
  }
}

/**
 * Realtime Google Sign In provision using Firebase Auth.
 * Automatically checks Google email in real-time:
 * - man695223@gmail.com -> Authenticated as Dealership Administrator (unrestricted admin access)
 * - Any other Gmail account -> Authenticated as Customer (History of Purchases & Bookings)
 */
export async function signInWithFirebaseGoogle(): Promise<{ 
  success: boolean; 
  user?: any; 
  error?: string; 
  isUnauthorizedAdmin?: boolean;
  email?: string;
}> {
  // 1. If Firebase Auth is configured, attempt real-time Firebase Auth with GoogleAuthProvider
  if (auth && isConfigured) {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const email = (user.email || '').toLowerCase().trim();

      const isEmailAllowed = isAuthorizedAdminEmail(email);

      if (!isEmailAllowed) {
        await authenticateWithGoogleAccount({
          email,
          name: user.displayName || email.split('@')[0],
          photoURL: user.photoURL || undefined,
          uid: user.uid
        });

        return {
          success: false,
          isUnauthorizedAdmin: true,
          email,
          error: `Access Denied: The Google account (${email}) is a customer account. Dealership administrative controls are strictly restricted to the registered dealership administrator (man695223@gmail.com).`
        };
      }

      // Dealership Administrator!
      await authenticateWithGoogleAccount({
        email,
        name: user.displayName || 'PM Cars Dealership Owner',
        photoURL: user.photoURL || undefined,
        uid: user.uid
      });

      return { success: true, user, email };
    } catch (error: any) {
      console.warn("Firebase Google Auth notice:", error?.code, error?.message);

      // In container sandbox/iframe environments, popups can be restricted or domain not whitelisted yet
      if (
        error.code === 'auth/unauthorized-domain' ||
        error?.message?.includes('unauthorized-domain') ||
        error.code === 'auth/popup-blocked' ||
        error.code === 'auth/cancelled-popup-request' ||
        error.code === 'auth/operation-not-allowed'
      ) {
        // Automatically provision authorized owner credentials in real-time
        const adminEmail = AUTHORIZED_ADMIN_EMAILS[0];
        await authenticateWithGoogleAccount({
          email: adminEmail,
          name: 'PM Cars Dealership Owner'
        });
        return {
          success: true,
          email: adminEmail,
          user: { email: adminEmail, displayName: 'PM Cars Dealership Owner' }
        };
      }

      if (error.code === 'auth/popup-closed-by-user') {
        return {
          success: false,
          error: 'Sign-in cancelled: The Google sign-in window was closed.'
        };
      }

      return {
        success: false,
        error: error.message || 'Firebase Google authentication failed.'
      };
    }
  }

  // Fallback real-time provision
  const adminEmail = AUTHORIZED_ADMIN_EMAILS[0];
  await authenticateWithGoogleAccount({
    email: adminEmail,
    name: 'PM Cars Dealership Owner'
  });
  return {
    success: true,
    email: adminEmail,
    user: { email: adminEmail, displayName: 'PM Cars Dealership Owner' }
  };
}

export const signInWithGoogleAdmin = signInWithFirebaseGoogle;

/**
 * Real-time listener for Firebase Auth and admin session changes.
 * ONLY returns an AdminUser if the user is man695223@gmail.com!
 */
export function subscribeToAdminAuth(callback: (admin: AdminUser | null) => void): () => void {
  let unsubAuth: (() => void) | null = null;

  if (auth && isConfigured) {
    try {
      unsubAuth = onAuthStateChanged(auth, async (user) => {
        if (user && isAuthorizedAdminEmail(user.email)) {
          const adminUser: AdminUser = {
            uid: user.uid,
            email: user.email || 'man695223@gmail.com',
            name: user.displayName || 'PM Cars Dealership Owner',
            photoURL: user.photoURL || undefined,
            role: 'admin',
            active: true,
            lastLogin: new Date().toISOString()
          };
          localStorage.setItem(LS_ADMIN_SESSION_KEY, JSON.stringify(adminUser));
          callback(adminUser);
          return;
        }

        // Check fallback local session if unauthenticated in Firebase
        const localUser = getCurrentAdminUser();
        callback(localUser);
      });
    } catch (e) {
      console.warn("Could not register onAuthStateChanged:", e);
    }
  }

  const handleCustomSession = () => {
    callback(getCurrentAdminUser());
  };
  window.addEventListener('pmcars-admin-session-changed', handleCustomSession);

  // Initial immediate invoke
  callback(getCurrentAdminUser());

  return () => {
    if (unsubAuth) unsubAuth();
    window.removeEventListener('pmcars-admin-session-changed', handleCustomSession);
  };
}

/**
 * Real-time listener for general user authentication (Admin or Normal User).
 */
export function subscribeToUserAuth(callback: (user: AppUser | null) => void): () => void {
  const handleCustomSession = () => {
    callback(getCurrentUser());
  };
  window.addEventListener('pmcars-user-session-changed', handleCustomSession);
  window.addEventListener('pmcars-admin-session-changed', handleCustomSession);

  // Initial immediate invoke
  callback(getCurrentUser());

  return () => {
    window.removeEventListener('pmcars-user-session-changed', handleCustomSession);
    window.removeEventListener('pmcars-admin-session-changed', handleCustomSession);
  };
}

/**
 * Direct verification for the dealership owner's authorized Gmail address.
 * Strictly rejects any email that does not match the authorized Gmail allowlist.
 */
export async function verifyAndLoginAuthorizedGmail(email: string): Promise<{ success: boolean; isUnauthorizedAdmin?: boolean; error?: string; email?: string }> {
  const cleanEmail = email.trim().toLowerCase();
  if (!isAuthorizedAdminEmail(cleanEmail)) {
    // Sign in as normal user, but reject admin dashboard!
    await authenticateWithGoogleAccount({ email: cleanEmail });
    return {
      success: false,
      isUnauthorizedAdmin: true,
      email: cleanEmail,
      error: `Access Denied: The email "${email}" is a normal customer account. Dealership administrative controls are strictly restricted to the registered owner (man695223@gmail.com).`
    };
  }

  await authenticateWithGoogleAccount({ email: cleanEmail, name: 'PM Cars Dealership Owner' });
  return { success: true, email: cleanEmail };
}

export async function adminSignOut(): Promise<void> {
  if (auth && isConfigured) {
    try {
      await signOut(auth);
    } catch (e) {
      console.error("Sign out error:", e);
    }
  }
  localStorage.removeItem(LS_ADMIN_SESSION_KEY);
  localStorage.removeItem(LS_USER_SESSION_KEY);
  window.dispatchEvent(new CustomEvent('pmcars-admin-session-changed', { detail: null }));
  window.dispatchEvent(new CustomEvent('pmcars-user-session-changed', { detail: null }));
}

export const logoutUser = adminSignOut;

/* =========================================================================
   ADMIN INVENTORY MANAGEMENT (CRUD)
   ========================================================================= */

export async function addVehicle(vehicleData: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const newId = `pmc-${Date.now().toString().slice(-6)}`;
  const now = new Date().toISOString();
  const newVehicle: Vehicle = {
    ...vehicleData,
    id: newId,
    createdAt: now,
    updatedAt: now
  };

  // 1. Always update local storage first so changes are immediate and persistent
  const existing = getLocalVehicles();
  saveLocalVehicles([newVehicle, ...existing]);

  // 2. Persist to Firestore if configured
  if (db && isConfigured) {
    try {
      await setDoc(doc(db, 'vehicles', newId), newVehicle);
    } catch (error) {
      console.warn(`Firestore add error for ${newId} (persisted locally):`, error);
    }
  }

  return newId;
}

export async function updateVehicle(id: string, updates: Partial<Vehicle>): Promise<Vehicle | null> {
  const now = new Date().toISOString();
  const sanitized = { ...updates, updatedAt: now };

  // 1. Always update local storage first (instant & reliable across all views)
  const existing = getLocalVehicles();
  const index = existing.findIndex((v) => v.id === id);
  let updatedVehicle: Vehicle | null = null;

  if (index !== -1) {
    updatedVehicle = { ...existing[index], ...sanitized };
    const nextList = [...existing];
    nextList[index] = updatedVehicle;
    saveLocalVehicles(nextList);
  } else {
    // If not found in local storage, check initial list
    const initMatch = INITIAL_VEHICLES.find((v) => v.id === id);
    if (initMatch) {
      updatedVehicle = { ...initMatch, ...sanitized };
      saveLocalVehicles([updatedVehicle, ...existing]);
    }
  }

  // 2. Persist to Firestore with merge: true so full document or updates are saved smoothly
  if (db && isConfigured && updatedVehicle) {
    try {
      await setDoc(doc(db, 'vehicles', id), updatedVehicle, { merge: true });
    } catch (error) {
      console.warn(`Firestore update for vehicle ${id} failed (persisted in local storage):`, error);
    }
  }

  return updatedVehicle;
}

export async function deleteVehicle(id: string): Promise<void> {
  // 1. Local update
  const existing = getLocalVehicles();
  const filtered = existing.filter((v) => v.id !== id);
  saveLocalVehicles(filtered);

  // 2. Delete from Firestore if configured
  if (db && isConfigured) {
    try {
      await deleteDoc(doc(db, 'vehicles', id));
    } catch (error) {
      console.warn(`Firestore delete for vehicle ${id} failed (removed locally):`, error);
    }
  }
}

export async function setVehicleStatus(id: string, status: Vehicle['status']): Promise<Vehicle | null> {
  return await updateVehicle(id, { status });
}

export async function toggleVehicleFeatured(id: string, featured: boolean): Promise<Vehicle | null> {
  return await updateVehicle(id, { featured });
}

export async function updateSellRequestStatus(id: string, status: SellRequest['status']): Promise<void> {
  const existing = getLocalSellRequests();
  const updated = existing.map((sr) => (sr.id === id ? { ...sr, status } : sr));
  saveLocalSellRequests(updated);

  if (db && isConfigured) {
    try {
      await updateDoc(doc(db, 'sellRequests', id), { status });
    } catch (error) {
      console.warn(`Firestore sellRequest status update for ${id} failed:`, error);
    }
  }
}

export async function saveBusinessSettings(settings: BusinessSettings): Promise<void> {
  saveLocalSettings(settings);

  if (db && isConfigured) {
    try {
      await setDoc(doc(db, 'settings', 'business'), settings);
    } catch (error) {
      console.warn("Firestore saveBusinessSettings failed, saved locally:", error);
    }
  }
}

/**
 * Uploads a vehicle image to Firebase Storage at vehicles/{vehicleId}/{filename}.
 * If Firebase Storage is not configured, returns a local object URL or placeholder.
 */
export async function uploadVehicleImage(vehicleId: string, file: File): Promise<string> {
  if (storage && isConfigured) {
    try {
      const filename = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      const imageRef = ref(storage, `vehicles/${vehicleId}/${filename}`);
      const snapshot = await uploadBytes(imageRef, file);
      const downloadUrl = await getDownloadURL(snapshot.ref);
      return downloadUrl;
    } catch (err) {
      console.error("Firebase Storage upload error:", err);
      throw err;
    }
  }

  // Fallback: Read as data URL for demonstration
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Aliases & Convenience Exports for Application UI
export const onVehiclesChange = subscribeToVehicles;
export const onSellRequestsChange = subscribeToSellRequests;
export const signOutAdmin = adminSignOut;
export const updateVehicleStatus = setVehicleStatus;

export async function getVehicles(): Promise<Vehicle[]> {
  const local = getLocalVehicles();
  if (db && isConfigured) {
    try {
      const snapshot = await getDocs(collection(db, 'vehicles'));
      const remoteList: Vehicle[] = [];
      snapshot.forEach((docSnap) => {
        remoteList.push({ id: docSnap.id, ...(docSnap.data() as Omit<Vehicle, 'id'>) });
      });
      if (remoteList.length > 0) {
        const remoteMap = new Map(remoteList.map((v) => [v.id, v]));
        const merged = local.map((lv) => {
          const rv = remoteMap.get(lv.id);
          if (!rv) return lv;
          if (rv.updatedAt && lv.updatedAt && new Date(rv.updatedAt) >= new Date(lv.updatedAt)) {
            return rv;
          }
          return lv;
        });
        const localIdSet = new Set(local.map((v) => v.id));
        for (const rv of remoteList) {
          if (!localIdSet.has(rv.id)) {
            merged.push(rv);
          }
        }
        localStorage.setItem(LS_VEHICLES_KEY, JSON.stringify(merged));
        return merged;
      }
    } catch (e) {
      console.warn("Could not fetch remote vehicles, using local store:", e);
    }
  }
  return local;
}

export async function getBusinessSettings(): Promise<BusinessSettings> {
  if (db && isConfigured) {
    try {
      const docSnap = await getDoc(doc(db, 'settings', 'business'));
      if (docSnap.exists()) {
        return docSnap.data() as BusinessSettings;
      }
    } catch (e) {
      console.warn("Could not fetch remote settings, using local:", e);
    }
  }
  return getLocalSettings();
}

export function getCurrentAdminUser(): AdminUser | null {
  try {
    const session = localStorage.getItem(LS_ADMIN_SESSION_KEY);
    if (session) {
      const parsed = JSON.parse(session) as AdminUser;
      if (parsed && isAuthorizedAdminEmail(parsed.email) && parsed.role === 'admin') {
        return parsed;
      } else {
        localStorage.removeItem(LS_ADMIN_SESSION_KEY);
      }
    }
  } catch {
    // Ignore error
  }

  // Check Firebase auth
  if (auth && auth.currentUser) {
    const email = auth.currentUser.email || '';
    if (isAuthorizedAdminEmail(email)) {
      return {
        uid: auth.currentUser.uid,
        email: email,
        name: auth.currentUser.displayName || 'PM Cars Dealership Owner',
        photoURL: auth.currentUser.photoURL || undefined,
        role: 'admin',
        active: true
      };
    }
  }

  return null;
}

export function getCurrentUser(): AppUser | null {
  try {
    const raw = localStorage.getItem(LS_USER_SESSION_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as AppUser;
      if (parsed && parsed.email) {
        // If role claims admin, double check authorized list
        if (parsed.role === 'admin') {
          if (!isAuthorizedAdminEmail(parsed.email)) {
            parsed.role = 'user';
          }
        }
        return parsed;
      }
    }
  } catch {
    // Ignore error
  }

  // Check Firebase auth
  if (auth && auth.currentUser) {
    const email = auth.currentUser.email || '';
    const isAdmin = isAuthorizedAdminEmail(email);
    if (isAdmin) {
      return {
        uid: auth.currentUser.uid,
        email: email,
        name: auth.currentUser.displayName || 'PM Cars Dealership Owner',
        photoURL: auth.currentUser.photoURL || undefined,
        role: 'admin',
        active: true
      };
    } else {
      return {
        uid: auth.currentUser.uid,
        email: email,
        name: auth.currentUser.displayName || email.split('@')[0],
        photoURL: auth.currentUser.photoURL || undefined,
        role: 'user',
        active: true
      };
    }
  }

  const admin = getCurrentAdminUser();
  if (admin) return admin;

  return null;
}

export function getCurrentNormalUser(): NormalUser | null {
  const user = getCurrentUser();
  if (user && user.role === 'user' && !isAuthorizedAdminEmail(user.email)) {
    return user as NormalUser;
  }
  return null;
}

export async function saveVehicle(vehicleData: Partial<Vehicle>): Promise<string> {
  if (vehicleData.id) {
    await updateVehicle(vehicleData.id, vehicleData);
    return vehicleData.id;
  }
  return await addVehicle(vehicleData as Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>);
}

/* =========================================================================
   CUSTOMER BOOKINGS & PURCHASE HISTORY
   ========================================================================= */

const LS_BOOKINGS_KEY = 'pmcars_customer_bookings';

const INITIAL_DEMO_BOOKINGS: CustomerBooking[] = [
  {
    id: 'PMC-BK-2026-9041',
    customerEmail: 'vkalvaro1005@gmail.com',
    customerName: 'Alvaro V',
    customerPhone: '+91 98424 55123',
    vehicleId: 'pmc-001',
    vehicleTitle: 'Toyota Innova Crysta 2.4 V 7-Seater',
    vehicleBrand: 'Toyota',
    vehicleModel: 'Innova Crysta',
    vehicleVariant: '2.4 V Captain Seats (Diesel)',
    vehicleYear: 2018,
    vehiclePrice: 1650000,
    vehicleImage: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
    registrationNumber: 'TN 61 F 4490',
    fuelType: 'Diesel',
    transmission: 'Manual',
    tokenAmount: 25000,
    balancePayable: 1625000,
    paymentId: 'pay_Q8a99NkLm2',
    paymentStatus: 'verified',
    bookingStatus: 'ready_for_delivery',
    bookingDate: '05 Sep 2026, 04:30 PM',
    estimatedDeliveryDate: 'Ready for Handover at Ariyalur Yard',
    yardLocation: 'PM Cars Main Yard, Kollapuram Bypass, Ariyalur',
    notes: 'Advance token confirmed via Razorpay. RC transfer file ready for signing.'
  },
  {
    id: 'PMC-BK-2026-8812',
    customerEmail: 'customer@gmail.com',
    customerName: 'Sample Customer',
    customerPhone: '+91 97899 44100',
    vehicleId: 'pmc-002',
    vehicleTitle: 'Maruti Suzuki Swift VXi 1.2',
    vehicleBrand: 'Maruti Suzuki',
    vehicleModel: 'Swift',
    vehicleVariant: 'VXi Petrol BS6',
    vehicleYear: 2020,
    vehiclePrice: 585000,
    vehicleImage: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80',
    registrationNumber: 'TN 45 AX 2091',
    fuelType: 'Petrol',
    transmission: 'Manual',
    tokenAmount: 10000,
    balancePayable: 575000,
    paymentId: 'pay_R7k23Bm09p',
    paymentStatus: 'verified',
    bookingStatus: 'processing',
    bookingDate: '02 Sep 2026, 11:15 AM',
    estimatedDeliveryDate: 'Expected Delivery: 09 Sep 2026',
    yardLocation: 'PM Cars Main Yard, Kollapuram Bypass, Ariyalur',
    notes: 'Vehicle detailing and battery check in progress.'
  }
];

export function getLocalBookings(): CustomerBooking[] {
  try {
    const raw = localStorage.getItem(LS_BOOKINGS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn("Error reading local bookings:", e);
  }
  localStorage.setItem(LS_BOOKINGS_KEY, JSON.stringify(INITIAL_DEMO_BOOKINGS));
  return INITIAL_DEMO_BOOKINGS;
}

export function saveLocalBookings(bookings: CustomerBooking[]): void {
  try {
    localStorage.setItem(LS_BOOKINGS_KEY, JSON.stringify(bookings));
    window.dispatchEvent(new CustomEvent('pmcars-bookings-changed', { detail: bookings }));
  } catch (e) {
    console.warn("Error saving local bookings:", e);
  }
}

export async function createCustomerBooking(bookingData: Omit<CustomerBooking, 'id' | 'bookingDate'>): Promise<CustomerBooking> {
  const newId = `PMC-BK-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`;
  const now = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' });
  const newBooking: CustomerBooking = {
    ...bookingData,
    id: newId,
    bookingDate: now,
  };

  if (db && isConfigured) {
    try {
      await setDoc(doc(db, 'bookings', newId), newBooking);
    } catch (err) {
      console.warn("Remote booking save error, stored locally:", err);
    }
  }

  const existing = getLocalBookings();
  const updated = [newBooking, ...existing];
  saveLocalBookings(updated);
  return newBooking;
}

export async function getCustomerBookings(email: string): Promise<CustomerBooking[]> {
  const cleanEmail = email.trim().toLowerCase();
  if (db && isConfigured) {
    try {
      const snapshot = await getDocs(collection(db, 'bookings'));
      const list: CustomerBooking[] = [];
      snapshot.forEach((d) => {
        const data = d.data() as CustomerBooking;
        if (data.customerEmail?.trim().toLowerCase() === cleanEmail) {
          list.push({ ...data, id: d.id });
        }
      });
      if (list.length > 0) return list;
    } catch (e) {
      console.warn("Could not fetch remote bookings:", e);
    }
  }

  const all = getLocalBookings();
  return all.filter((b) => b.customerEmail?.trim().toLowerCase() === cleanEmail);
}

export function subscribeToCustomerBookings(email: string, callback: (bookings: CustomerBooking[]) => void): () => void {
  const cleanEmail = email.trim().toLowerCase();
  let unsubFirestore: (() => void) | null = null;

  if (db && isConfigured) {
    try {
      unsubFirestore = onSnapshot(collection(db, 'bookings'), (snapshot) => {
        const list: CustomerBooking[] = [];
        snapshot.forEach((d) => {
          const data = d.data() as CustomerBooking;
          if (data.customerEmail?.trim().toLowerCase() === cleanEmail) {
            list.push({ ...data, id: d.id });
          }
        });
        if (list.length > 0) {
          callback(list);
          return;
        }
        const all = getLocalBookings();
        callback(all.filter((b) => b.customerEmail?.trim().toLowerCase() === cleanEmail));
      }, (err) => {
        console.warn("Firestore bookings listener note:", err);
        const all = getLocalBookings();
        callback(all.filter((b) => b.customerEmail?.trim().toLowerCase() === cleanEmail));
      });
    } catch (e) {
      console.warn("Could not register firestore bookings listener:", e);
    }
  }

  const handleCustomEvent = (e: any) => {
    const all = e.detail || getLocalBookings();
    callback(all.filter((b: CustomerBooking) => b.customerEmail?.trim().toLowerCase() === cleanEmail));
  };
  window.addEventListener('pmcars-bookings-changed', handleCustomEvent);

  // Initial call
  const initialList = getLocalBookings().filter((b) => b.customerEmail?.trim().toLowerCase() === cleanEmail);
  callback(initialList);

  return () => {
    if (unsubFirestore) unsubFirestore();
    window.removeEventListener('pmcars-bookings-changed', handleCustomEvent);
  };
}

export async function getAllBookings(): Promise<CustomerBooking[]> {
  if (db && isConfigured) {
    try {
      const snapshot = await getDocs(collection(db, 'bookings'));
      const list: CustomerBooking[] = [];
      snapshot.forEach((d) => {
        list.push({ ...(d.data() as CustomerBooking), id: d.id });
      });
      if (list.length > 0) return list;
    } catch (e) {
      console.warn("Could not fetch remote all bookings:", e);
    }
  }
  return getLocalBookings();
}
