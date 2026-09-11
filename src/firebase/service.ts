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
import { Vehicle, SellRequest, AdminUser, NormalUser, AppUser, BusinessSettings } from '../types';
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
const LS_VEHICLES_KEY = 'pmcars_vehicles_ecommerce_v2';
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
  if (db && isConfigured) {
    try {
      const q = query(collection(db, 'vehicles'), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const list: Vehicle[] = [];
          snapshot.forEach((docSnap) => {
            list.push({ id: docSnap.id, ...(docSnap.data() as Omit<Vehicle, 'id'>) });
          });
          callback(list.length > 0 ? list : getLocalVehicles());
        },
        (error) => {
          console.warn("Firestore onSnapshot error, falling back to local data:", error);
          callback(getLocalVehicles());
        }
      );
      return unsubscribe;
    } catch (err) {
      console.warn("Error setting up Firestore vehicle subscription:", err);
    }
  }

  // Fallback / Initial local store
  callback(getLocalVehicles());
  const handler = () => callback(getLocalVehicles());
  window.addEventListener('pmcars-vehicles-updated', handler);
  return () => window.removeEventListener('pmcars-vehicles-updated', handler);
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

import { triggerGoogleOAuth } from '../utils/googleAuth';

/**
 * Sign in with Google using Realtime Google OAuth / Identity Services & Firebase Auth.
 * If user is man695223@gmail.com -> Admin Dashboard access.
 * If user is any other Gmail -> Signed in as Normal User, strictly rejected from Admin Dashboard.
 */
export async function signInWithGoogleAdmin(): Promise<{ 
  success: boolean; 
  user?: User | any; 
  error?: string; 
  isUnauthorizedAdmin?: boolean;
  email?: string;
  requiresAccountPrompt?: boolean;
}> {
  // 1. Try real-time Google OAuth Token Client (via Google Identity Services)
  try {
    let oauthUser: any = null;
    const oauthSuccess = await triggerGoogleOAuth((user) => {
      oauthUser = user;
    });

    if (oauthSuccess && oauthUser && oauthUser.email) {
      const email = oauthUser.email.toLowerCase();
      const isEmailAllowed = isAuthorizedAdminEmail(email);

      if (!isEmailAllowed) {
        await authenticateWithGoogleAccount({
          email,
          name: oauthUser.name || email.split('@')[0],
          photoURL: oauthUser.photoURL,
          uid: oauthUser.uid
        });

        return {
          success: false,
          isUnauthorizedAdmin: true,
          email,
          error: `Access Denied: The Google account (${email}) is a normal user account. The PM Cars Admin Dashboard is restricted strictly to the registered dealership administrator (man695223@gmail.com).`
        };
      }

      // Authorized Admin!
      await authenticateWithGoogleAccount({
        email,
        name: oauthUser.name || 'PM Cars Dealership Owner',
        photoURL: oauthUser.photoURL,
        uid: oauthUser.uid
      });

      return { success: true, user: oauthUser, email };
    }
  } catch (oauthErr) {
    console.warn("Google OAuth token client note:", oauthErr);
  }

  // 2. Try Firebase Auth popup if configured
  if (auth && isConfigured) {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const email = user.email?.toLowerCase() || '';

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
          error: `Access Denied: The Google account (${user.email}) is a normal user account. The PM Cars Admin Dashboard is restricted strictly to the registered dealership administrator (man695223@gmail.com).`
        };
      }

      // Is authorized Admin!
      await authenticateWithGoogleAccount({
        email,
        name: user.displayName || 'PM Cars Dealership Owner',
        photoURL: user.photoURL || undefined,
        uid: user.uid
      });

      return { success: true, user, email };
    } catch (error: any) {
      console.warn("Google Sign in popup note:", error.code, error.message);

      // In Cloud Run / iframe environments, popups can be blocked or domain unauthorized
      if (
        error.code === 'auth/unauthorized-domain' || 
        error?.message?.includes('auth/unauthorized-domain') ||
        error.code === 'auth/popup-blocked' ||
        error.code === 'auth/cancelled-popup-request'
      ) {
        return {
          success: false,
          requiresAccountPrompt: true
        };
      }

      let msg = error.message || "Google authentication failed.";
      if (error.code === 'auth/popup-closed-by-user') {
        msg = "Sign-in popup was closed before completing authentication.";
      }

      return {
        success: false,
        requiresAccountPrompt: true,
        error: msg
      };
    }
  }

  // 3. Fallback when popup cannot open
  return {
    success: false,
    requiresAccountPrompt: true
  };
}

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

  if (db && isConfigured) {
    try {
      await setDoc(doc(db, 'vehicles', newId), newVehicle);
      return newId;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `vehicles/${newId}`, auth || undefined);
    }
  }

  // Local fallback
  const existing = getLocalVehicles();
  saveLocalVehicles([newVehicle, ...existing]);
  return newId;
}

export async function updateVehicle(id: string, updates: Partial<Vehicle>): Promise<void> {
  const now = new Date().toISOString();
  const sanitized = { ...updates, updatedAt: now };

  if (db && isConfigured) {
    try {
      await updateDoc(doc(db, 'vehicles', id), sanitized);
      return;
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `vehicles/${id}`, auth || undefined);
    }
  }

  // Local fallback
  const existing = getLocalVehicles();
  const updated = existing.map((v) => (v.id === id ? { ...v, ...sanitized } : v));
  saveLocalVehicles(updated);
}

export async function deleteVehicle(id: string): Promise<void> {
  if (db && isConfigured) {
    try {
      await deleteDoc(doc(db, 'vehicles', id));
      return;
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `vehicles/${id}`, auth || undefined);
    }
  }

  // Local fallback
  const existing = getLocalVehicles();
  const filtered = existing.filter((v) => v.id !== id);
  saveLocalVehicles(filtered);
}

export async function setVehicleStatus(id: string, status: Vehicle['status']): Promise<void> {
  await updateVehicle(id, { status });
}

export async function toggleVehicleFeatured(id: string, featured: boolean): Promise<void> {
  await updateVehicle(id, { featured });
}

export async function updateSellRequestStatus(id: string, status: SellRequest['status']): Promise<void> {
  if (db && isConfigured) {
    try {
      await updateDoc(doc(db, 'sellRequests', id), { status });
      return;
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `sellRequests/${id}`, auth || undefined);
    }
  }

  const existing = getLocalSellRequests();
  const updated = existing.map((sr) => (sr.id === id ? { ...sr, status } : sr));
  saveLocalSellRequests(updated);
}

export async function saveBusinessSettings(settings: BusinessSettings): Promise<void> {
  if (db && isConfigured) {
    try {
      await setDoc(doc(db, 'settings', 'business'), settings);
      return;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'settings/business', auth || undefined);
    }
  }

  saveLocalSettings(settings);
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
  if (db && isConfigured) {
    try {
      const snapshot = await getDocs(collection(db, 'vehicles'));
      const list: Vehicle[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...(docSnap.data() as Omit<Vehicle, 'id'>) });
      });
      if (list.length > 0) return list;
    } catch (e) {
      console.warn("Could not fetch remote vehicles, using local store:", e);
    }
  }
  return getLocalVehicles();
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
