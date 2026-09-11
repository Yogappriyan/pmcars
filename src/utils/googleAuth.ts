/**
 * Google Identity Services & Account Helper
 */
import { firebaseConfig } from '../firebase/config';

export interface DecodedGoogleToken {
  iss?: string;
  sub: string;
  email: string;
  email_verified?: boolean;
  name: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
}

export interface GoogleProfile {
  email: string;
  name: string;
  photoURL?: string;
  uid: string;
  verified?: boolean;
}

export function parseJwt(token: string): DecodedGoogleToken | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload) as DecodedGoogleToken;
  } catch (e) {
    console.error('Failed to parse Google JWT:', e);
    return null;
  }
}

/**
 * Initialize Google Identity Services (One Tap & ID token)
 */
export function initializeGoogleIdentity(
  onSuccess: (user: GoogleProfile) => void
): boolean {
  if (typeof window === 'undefined') return false;

  const clientId = firebaseConfig.oAuthClientId;
  if (!clientId) {
    console.warn('Google OAuth Client ID not specified in configuration');
    return false;
  }

  const google = (window as any).google;
  if (!google || !google.accounts || !google.accounts.id) {
    return false;
  }

  try {
    google.accounts.id.initialize({
      client_id: clientId,
      callback: (response: any) => {
        if (response?.credential) {
          const decoded = parseJwt(response.credential);
          if (decoded && decoded.email) {
            onSuccess({
              email: decoded.email,
              name: decoded.name || decoded.email.split('@')[0],
              photoURL: decoded.picture,
              uid: decoded.sub || `google-${Date.now()}`,
              verified: true
            });
          }
        }
      },
      auto_select: false,
      cancel_on_tap_outside: true
    });
    return true;
  } catch (e) {
    console.warn('Error initializing Google Identity Services:', e);
    return false;
  }
}

/**
 * Trigger Real-time Google OAuth 2.0 Token Client popup.
 * Opens Google's native account chooser and fetches verified profile.
 */
export async function triggerGoogleOAuth(
  onSuccess: (user: GoogleProfile) => void
): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  const clientId = firebaseConfig.oAuthClientId;
  const google = (window as any).google;

  if (!google || !google.accounts || !google.accounts.oauth2 || !clientId) {
    return false;
  }

  return new Promise((resolve) => {
    try {
      const client = google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: 'email profile openid',
        callback: async (tokenResponse: any) => {
          if (tokenResponse?.error) {
            console.warn('Google OAuth token error:', tokenResponse.error);
            resolve(false);
            return;
          }

          if (tokenResponse?.access_token) {
            try {
              const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
              });
              const profile = await res.json();
              if (profile?.email) {
                onSuccess({
                  email: profile.email,
                  name: profile.name || profile.email.split('@')[0],
                  photoURL: profile.picture,
                  uid: profile.sub || `google-${Date.now()}`,
                  verified: true
                });
                resolve(true);
                return;
              }
            } catch (err) {
              console.warn('Failed to fetch Google userinfo:', err);
            }
          }
          resolve(false);
        },
        error_callback: (err: any) => {
          console.warn('Google OAuth prompt error:', err);
          resolve(false);
        }
      });

      client.requestAccessToken({ prompt: 'select_account' });
    } catch (err) {
      console.warn('Failed to launch Google Token Client:', err);
      resolve(false);
    }
  });
}

