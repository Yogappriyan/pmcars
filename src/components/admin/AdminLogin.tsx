import React, { useState, useEffect } from 'react';
import { Shield, Car, AlertCircle, ArrowLeft, Lock, Mail, CheckCircle2, User, ArrowRight, X, Sparkles } from 'lucide-react';
import { 
  AUTHORIZED_ADMIN_EMAILS,
  authenticateWithGoogleAccount,
  subscribeToAdminAuth
} from '../../firebase/service';
import { AppUser } from '../../types';
import pmCarsLogoImg from '../../assets/images/logo pm.jpg';

interface AdminLoginProps {
  onBackToWebsite: () => void;
  onLoginSuccess: () => void;
  onNavigateToCustomerPortal?: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({
  onBackToWebsite,
  onLoginSuccess,
  onNavigateToCustomerPortal
}) => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [unauthorizedNotice, setUnauthorizedNotice] = useState(false);
  const [unauthorizedEmail, setUnauthorizedEmail] = useState('');
  const [gmailInput, setGmailInput] = useState('');
  const [showAccountPicker, setShowAccountPicker] = useState(false);
  const [successNotice, setSuccessNotice] = useState('');

  // Real-time auth listener: If already authenticated via Firebase or session as owner, advance immediately
  useEffect(() => {
    const unsubscribe = subscribeToAdminAuth((admin) => {
      if (admin && admin.email === AUTHORIZED_ADMIN_EMAILS[0]) {
        onLoginSuccess();
      }
    });
    return () => unsubscribe();
  }, [onLoginSuccess]);

  const handleGoogleAdminInstantLogin = async () => {
    setLoading(true);
    setErrorMessage('');
    setUnauthorizedNotice(false);
    setSuccessNotice('Verifying authorized Google Administrator credentials (man695223@gmail.com)...');

    try {
      await authenticateWithGoogleAccount({
        email: AUTHORIZED_ADMIN_EMAILS[0],
        name: 'PM Cars Dealership Owner'
      });

      setSuccessNotice('Authenticated as Dealership Administrator. Opening Admin Dashboard...');
      setTimeout(() => {
        onLoginSuccess();
      }, 400);
    } catch (err: any) {
      setErrorMessage(err.message || 'Verification failed.');
      setSuccessNotice('');
      setLoading(false);
    }
  };

  const handleCustomerLoginAndRedirect = async (email: string, name?: string) => {
    setLoading(true);
    setErrorMessage('');
    setUnauthorizedNotice(false);
    const cleanEmail = email.trim().toLowerCase();

    if (cleanEmail === AUTHORIZED_ADMIN_EMAILS[0]) {
      handleGoogleAdminInstantLogin();
      return;
    }

    setSuccessNotice(`Customer Account Verified (${cleanEmail}). Opening your History of Purchases & Bookings...`);

    try {
      await authenticateWithGoogleAccount({
        email: cleanEmail,
        name: name || cleanEmail.split('@')[0]
      });

      setTimeout(() => {
        if (onNavigateToCustomerPortal) {
          onNavigateToCustomerPortal();
        } else {
          onBackToWebsite();
        }
      }, 600);
    } catch (err: any) {
      setErrorMessage(err.message || 'Customer sign in failed.');
      setLoading(false);
    }
  };

  const handleAuthorizedGmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gmailInput.trim()) return;
    const cleanEmail = gmailInput.trim().toLowerCase();

    if (cleanEmail === AUTHORIZED_ADMIN_EMAILS[0]) {
      handleGoogleAdminInstantLogin();
    } else {
      handleCustomerLoginAndRedirect(cleanEmail);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 sm:p-6 text-slate-900 relative">
      {/* Back to Website CTA */}
      <button
        onClick={onBackToWebsite}
        className="absolute top-6 left-6 flex items-center gap-2 text-xs font-mono font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3.5 py-2 rounded-lg transition cursor-pointer shadow-xs"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Return to Public Showroom</span>
      </button>

      {/* Login Card */}
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2.5">
          <div className="w-16 h-16 rounded-full overflow-hidden shadow-sm border border-slate-200 bg-slate-950 mx-auto">
            <img
              src={pmCarsLogoImg}
              alt="PM CARS Logo"
              className="w-full h-full object-cover rounded-full"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/logo.png';
              }}
            />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">PM Cars Ariyalur</h2>
            <div className="inline-flex items-center gap-1.5 mt-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-medium">
              <Shield className="w-3.5 h-3.5 text-amber-600" />
              <span>Dealership Portal Sign-In</span>
            </div>
          </div>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Only <strong>man695223@gmail.com</strong> can access the Dealership Admin Panel. All other Gmail accounts will be taken to their Customer History of Purchases.
          </p>
        </div>

        {/* Real-time feedback alerts */}
        {successNotice && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-start gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>{successNotice}</div>
          </div>
        )}

        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-start gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div>{errorMessage}</div>
          </div>
        )}

        {/* Primary Dealership Admin Login */}
        <div className="bg-gradient-to-br from-amber-50/80 via-white to-orange-50/60 border-2 border-amber-300 rounded-2xl p-4 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-xs border border-amber-200">
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-amber-900 block">
                  Registered Dealership Administrator
                </span>
                <span className="text-xs font-mono font-bold text-slate-900">
                  {AUTHORIZED_ADMIN_EMAILS[0]}
                </span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[10px] font-bold border border-amber-200">
              Admin
            </span>
          </div>

          <button
            onClick={handleGoogleAdminInstantLogin}
            disabled={loading}
            id="admin-instant-google-btn"
            className="w-full py-3 px-4 bg-slate-950 hover:bg-slate-900 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition active:scale-95 disabled:opacity-60 cursor-pointer"
          >
            <Shield className="w-4 h-4 text-amber-400" />
            <span>{loading ? 'Verifying...' : 'Sign In as Dealership Owner'}</span>
          </button>
        </div>

        {/* Customer Quick Login / Account Picker */}
        <div className="space-y-3">
          <button
            onClick={() => setShowAccountPicker(true)}
            disabled={loading}
            id="admin-google-signin-btn"
            className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 text-slate-800 font-bold rounded-xl text-xs flex items-center justify-center gap-2.5 border border-slate-300 shadow-2xs transition active:scale-95 disabled:opacity-60 cursor-pointer"
          >
            <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>Choose Google Account (Admin or Customer)</span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-200 w-full" />
          <span className="bg-white px-3 text-[11px] font-medium text-slate-500 uppercase tracking-wider relative">
            Or Direct Gmail Login
          </span>
        </div>

        {/* Gmail Form: Enter Any Gmail */}
        <form onSubmit={handleAuthorizedGmailLogin} className="space-y-3">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700 block">
                Enter Any Gmail Address
              </label>
              <button
                type="button"
                onClick={() => setGmailInput('vkalvaro1005@gmail.com')}
                className="text-[11px] text-blue-700 hover:text-blue-800 font-semibold cursor-pointer underline"
              >
                Auto-fill Customer Gmail
              </button>
            </div>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={gmailInput}
                onChange={(e) => setGmailInput(e.target.value)}
                placeholder="e.g. vkalvaro1005@gmail.com"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white transition"
              />
            </div>
            <p className="text-[11px] text-slate-500">
              Entering <strong>{AUTHORIZED_ADMIN_EMAILS[0]}</strong> unlocks Admin Panel. Any other Gmail takes you straight to your Customer History of Purchases.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || !gmailInput.trim()}
            className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold rounded-xl text-xs transition active:scale-95 cursor-pointer shadow-xs flex items-center justify-center gap-2"
          >
            <Shield className="w-4 h-4 text-amber-400" />
            <span>Sign In with this Gmail</span>
          </button>
        </form>

        {/* Helper Quick Testers */}
        <div className="p-3 bg-slate-50 border border-dashed border-slate-300 rounded-xl space-y-2">
          <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
            One-Click Account Switcher:
          </span>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={handleGoogleAdminInstantLogin}
              className="px-2.5 py-1.5 bg-white border border-amber-300 text-amber-900 rounded-lg text-left hover:bg-amber-50 transition cursor-pointer shadow-2xs"
            >
              <div className="font-bold text-[11px]">Owner Login</div>
              <div className="text-[10px] text-amber-700 font-mono truncate">man695223...</div>
            </button>
            <button
              type="button"
              onClick={() => handleCustomerLoginAndRedirect('vkalvaro1005@gmail.com', 'Alvaro V')}
              className="px-2.5 py-1.5 bg-white border border-blue-300 text-blue-900 rounded-lg text-left hover:bg-blue-50 transition cursor-pointer shadow-2xs"
            >
              <div className="font-bold text-[11px]">Customer Login</div>
              <div className="text-[10px] text-blue-700 font-mono truncate">vkalvaro1005...</div>
            </button>
          </div>
        </div>

      </div>

      {/* Real-time Google Account Chooser Modal */}
      {showAccountPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span className="font-bold text-sm text-slate-900">Choose a Google Account</span>
              </div>
              <button
                onClick={() => setShowAccountPicker(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-md cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Select which Google account to sign in with:
            </p>

            <div className="space-y-2">
              {/* Option 1: Owner / Admin */}
              <button
                onClick={() => {
                  setShowAccountPicker(false);
                  handleGoogleAdminInstantLogin();
                }}
                className="w-full p-3 rounded-xl border-2 border-amber-300 bg-amber-50/60 hover:bg-amber-100/70 text-left transition flex items-center justify-between cursor-pointer"
              >
                <div>
                  <div className="text-xs font-bold text-slate-900">PM Cars Dealership Owner</div>
                  <div className="text-[11px] font-mono text-amber-900 font-bold">{AUTHORIZED_ADMIN_EMAILS[0]}</div>
                  <div className="text-[10px] text-amber-700">Opens Admin Dashboard</div>
                </div>
                <span className="px-2 py-0.5 bg-amber-200 text-amber-900 rounded-md text-[10px] font-bold">Admin</span>
              </button>

              {/* Option 2: Customer Account */}
              <button
                onClick={() => {
                  setShowAccountPicker(false);
                  handleCustomerLoginAndRedirect('vkalvaro1005@gmail.com', 'Alvaro V');
                }}
                className="w-full p-3 rounded-xl border border-blue-200 bg-blue-50/60 hover:bg-blue-100/70 text-left transition flex items-center justify-between cursor-pointer"
              >
                <div>
                  <div className="text-xs font-bold text-slate-900">Alvaro V (Customer)</div>
                  <div className="text-[11px] font-mono text-blue-900 font-bold">vkalvaro1005@gmail.com</div>
                  <div className="text-[10px] text-blue-700">Opens Customer History of Purchases</div>
                </div>
                <span className="px-2 py-0.5 bg-blue-200 text-blue-900 rounded-md text-[10px] font-bold">Customer</span>
              </button>
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  setShowAccountPicker(false);
                  setGmailInput('');
                }}
                className="w-full py-2 text-center text-xs text-slate-500 hover:text-slate-800 font-medium cursor-pointer"
              >
                Enter custom email address manually
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
