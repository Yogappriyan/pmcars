/**
 * PM Cars Ariyalur - Firebase Configuration
 * 
 * Instructions:
 * Replace the placeholder values below with your actual Firebase Web App credentials
 * obtained from the Firebase Console (Project Settings > General > Your apps > Web).
 * Alternatively, specify them in your environment variables (.env file):
 * - VITE_FIREBASE_API_KEY
 * - VITE_FIREBASE_AUTH_DOMAIN
 * - VITE_FIREBASE_PROJECT_ID
 * - VITE_FIREBASE_STORAGE_BUCKET
 * - VITE_FIREBASE_MESSAGING_SENDER_ID
 * - VITE_FIREBASE_APP_ID
 */

const metaEnv = (import.meta as any).env || {};

export const firebaseConfig = {
  projectId: metaEnv.VITE_FIREBASE_PROJECT_ID || "gen-lang-client-0070649792",
  appId: metaEnv.VITE_FIREBASE_APP_ID || "1:599589591780:web:290728b78428dcfee1eaf1",
  apiKey: metaEnv.VITE_FIREBASE_API_KEY || "AIzaSyAoGsZwe1qzzA4SyhL79yOpkNULzGVHVtA",
  authDomain: metaEnv.VITE_FIREBASE_AUTH_DOMAIN || "gen-lang-client-0070649792.firebaseapp.com",
  firestoreDatabaseId: metaEnv.VITE_FIRESTORE_DATABASE_ID || "ai-studio-pmcarsariyalur-68d330af-0e2e-4e41-a9a2-b99ed06c715e",
  storageBucket: metaEnv.VITE_FIREBASE_STORAGE_BUCKET || "gen-lang-client-0070649792.firebasestorage.app",
  messagingSenderId: metaEnv.VITE_FIREBASE_MESSAGING_SENDER_ID || "599589591780",
  oAuthClientId: metaEnv.VITE_GOOGLE_OAUTH_CLIENT_ID || "599589591780-ssoq3hnen1cpi8tv1a7j4qlkeop6nv3m.apps.googleusercontent.com"
};

const PLACEHOLDER_PROJECT_IDS = [
  "YOUR_PROJECT_ID",
  "YOUR_PROJECT",
  "your-project-id"
];

/**
 * Returns true if valid, real Firebase configuration credentials have been set.
 */
export function isFirebaseConfigured(): boolean {
  const projectId = (firebaseConfig.projectId || "").trim();
  const apiKey = (firebaseConfig.apiKey || "").trim();

  return (
    Boolean(apiKey) &&
    apiKey !== "YOUR_API_KEY" &&
    Boolean(projectId) &&
    !PLACEHOLDER_PROJECT_IDS.includes(projectId.toLowerCase())
  );
}

