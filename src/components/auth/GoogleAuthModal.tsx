import React, { useState, useEffect } from 'react';
import { Shield, User as UserIcon, X, AlertCircle, CheckCircle2, Lock, ArrowRight, Mail } from 'lucide-react';
import { 
  authenticateWithGoogleAccount, 
  signInWithGoogleAdmin, 
  AUTHORIZED_ADMIN_EMAILS,
  isAuthorizedAdminEmail
} from '../../firebase/service';
import { AppUser } from '../../types';
import { initializeGoogleIdentity } from '../../utils/googleAuth';

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: AppUser, isAdmin: boolean) => void;
  initialMode?: 'general' | 'admin' | 'user';
}

export const GoogleAuthModal: React.FC<GoogleAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialMode = 'general'
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [customGmail, setCustomGmail] = useState('');
  const [customerName, setCustomerName] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setError(null);
      setInfoMessage(null);
      return;
    }

    // Try initializing Google Identity Services if loaded
    initializeGoogleIdentity(async (googleUser) => {
      setLoading(true);
      setError(null);
      try {
        const authResult = await authenticateWithGoogleAccount(googleUser);
        setInfoMessage(authResult.message);
        setTimeout(() => {
          onSuccess(authResult.user, authResult.isAdmin);
          onClose();
        }, 800);
      } catch (err: any) {
        setError(err.message || 'Google verification failed.');
      } finally {
        setLoading(false);
      }
    });
  }, [isOpen, onSuccess, onClose]);

  if (!isOpen) return null;

  const handleFirebaseGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    setInfoMessage(null);

    try {
      const result = await signInWithGoogleAdmin();
      if (result.success) {
        // Admin verified
        setInfoMessage('Google Administrator account verified (man695223@gmail.com).');
        setTimeout(() => {
          onSuccess(
            {
              uid: 'admin-man695223',
              email: 'man695223@gmail.com',
              name: 'PM Cars Dealership Owner',
              role: 'admin',
              active: true
            },
            true
          );
          onClose();
        }, 800);
      } else if (result.isUnauthorizedAdmin) {
        // Logged in as normal user!
        setInfoMessage(result.error || 'Logged in as normal user.');
        setTimeout(() => {
          onSuccess(
            {
              uid: `user-${(result.email || 'customer').replace(/[^a-zA-Z0-9]/g, '-')}`,
              email: result.email || 'customer@gmail.com',
              name: (result.email || 'customer').split('@')[0],
              role: 'user',
              active: true
            },
            false
          );
          onClose();
        }, 1200);
      } else if (result.requiresAccountPrompt) {
        setInfoMessage('Select your Google account below to proceed.');
      } else if (result.error) {
        setError(result.error);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication error.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAccountSelect = async (email: string, name?: string) => {
    setLoading(true);
    setError(null);
    setInfoMessage(null);

    try {
      const authResult = await authenticateWithGoogleAccount({
        email,
        name: name || email.split('@')[0]
      });

      setInfoMessage(authResult.message);
      setTimeout(() => {
        onSuccess(authResult.user, authResult.isAdmin);
        onClose();
      }, 700);
    } catch (err: any) {
      setError(err.message || 'Sign in failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customGmail.trim()) return;
    handleQuickAccountSelect(customGmail.trim(), customerName.trim() || undefined);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        id="google-auth-modal-card"
        className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-xs">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Google Account Sign-In</h3>
              <p className="text-xs text-slate-300">PM Cars Ariyalur Dealership & Customer Portal</p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Real-time status / notification */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
              <div>{error}</div>
            </div>
          )}

          {infoMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
              <div>{infoMessage}</div>
            </div>
          )}

          {/* Primary Action: Direct Google Sign-In */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              1. Sign in with Google
            </label>
            <button
              onClick={handleFirebaseGoogleSignIn}
              disabled={loading}
              id="google-signin-popup-btn"
              className="w-full py-3 px-4 bg-white hover:bg-slate-50 text-slate-800 font-bold rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-3 border border-slate-300 shadow-xs transition active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{loading ? 'Authenticating...' : 'Continue with Google'}</span>
            </button>
            <p className="text-[11px] text-slate-500 text-center">
              Our system checks your Google email automatically in real-time.
            </p>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider relative">
              Or Choose Account Mode
            </span>
          </div>

          {/* Role Choice Cards */}
          <div className="grid grid-cols-1 gap-2.5">
            {/* Dealership Admin Option */}
            <button
              type="button"
              id="select-admin-account-btn"
              onClick={() => handleQuickAccountSelect(AUTHORIZED_ADMIN_EMAILS[0], 'PM Cars Dealership Owner')}
              disabled={loading}
              className="p-3 rounded-2xl border-2 border-amber-300 bg-amber-50/50 hover:bg-amber-100/70 text-left transition flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-slate-900">Registered Admin Gmail</span>
                    <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 bg-amber-200 text-amber-900 rounded">
                      Dealership Owner
                    </span>
                  </div>
                  <p className="font-mono text-[11px] text-amber-800 font-bold">
                    {AUTHORIZED_ADMIN_EMAILS[0]}
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-amber-700 group-hover:translate-x-0.5 transition" />
            </button>

            {/* Normal User Custom Input */}
            <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <UserIcon className="w-3.5 h-3.5 text-slate-600" />
                <span>Customer / Normal User Login (Any Other Gmail)</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-snug">
                Normal users get access to the Customer Portal. They cannot access or modify dealership inventory.
              </p>

              <form onSubmit={handleCustomSubmit} className="space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Your Name (Optional)"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-500"
                  />
                  <input
                    type="email"
                    required
                    placeholder="yourname@gmail.com"
                    value={customGmail}
                    onChange={(e) => setCustomGmail(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-500"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickAccountSelect('customer@gmail.com', 'Sample Customer')}
                    className="text-[10px] text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-2 py-1 rounded-lg font-medium cursor-pointer"
                  >
                    Use sample: customer@gmail.com
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !customGmail.trim()}
                    className="ml-auto px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Sign In as Customer</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Access Policy Summary */}
          <div className="p-3 bg-slate-100 rounded-xl text-[11px] text-slate-600 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <Lock className="w-3 h-3 text-slate-500" />
              <span>Security & Access Rules:</span>
            </div>
            <ul className="list-disc list-inside space-y-0.5 text-[10.5px]">
              <li><strong className="text-amber-800">man695223@gmail.com</strong>: Full Dealership Admin access (vehicles, pricing, requests).</li>
              <li><strong className="text-slate-800">All other Gmails</strong>: Normal User access only (Customer Portal). Admin dashboard is blocked.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
