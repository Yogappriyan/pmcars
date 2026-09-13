import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle2, AlertCircle, Shield } from 'lucide-react';
import { 
  AUTHORIZED_ADMIN_EMAILS,
  signInWithFirebaseGoogle,
  subscribeToAdminAuth
} from '../../firebase/service';
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
  const [statusNotice, setStatusNotice] = useState('');

  // Real-time auth listener: If already authenticated via Firebase as registered owner, open Admin Dashboard
  useEffect(() => {
    const unsubscribe = subscribeToAdminAuth((admin) => {
      if (admin && admin.email === AUTHORIZED_ADMIN_EMAILS[0]) {
        onLoginSuccess();
      }
    });
    return () => unsubscribe();
  }, [onLoginSuccess]);

  const handleContinueWithGoogle = async () => {
    setLoading(true);
    setErrorMessage('');
    setStatusNotice('Authenticating with Google in real-time...');

    try {
      const res = await signInWithFirebaseGoogle();

      if (res.success) {
        setStatusNotice(`Authenticated as Dealership Administrator (${res.email || AUTHORIZED_ADMIN_EMAILS[0]}). Opening Admin Dashboard...`);
        setTimeout(() => {
          onLoginSuccess();
        }, 500);
      } else if (res.isUnauthorizedAdmin) {
        setStatusNotice(`Signed in as Customer (${res.email}). Redirecting to your Customer History of Purchases & Bookings...`);
        setTimeout(() => {
          if (onNavigateToCustomerPortal) {
            onNavigateToCustomerPortal();
          } else {
            onBackToWebsite();
          }
        }, 800);
      } else {
        setErrorMessage(res.error || 'Google authentication failed.');
        setStatusNotice('');
        setLoading(false);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Google sign-in error occurred.');
      setStatusNotice('');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 sm:p-6 text-slate-900 relative">
      {/* Return to Public Showroom */}
      <button
        onClick={onBackToWebsite}
        id="return-showroom-btn"
        className="absolute top-6 left-6 flex items-center gap-2 text-xs font-mono font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3.5 py-2 rounded-lg transition cursor-pointer shadow-xs"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Return to Public Showroom</span>
      </button>

      {/* Login Card */}
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        {/* Dealership Branding */}
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
        </div>

        {/* Real-time Status Notice */}
        {statusNotice && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-start gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="font-medium">{statusNotice}</div>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-start gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div className="font-medium">{errorMessage}</div>
          </div>
        )}

        {/* 1. SIGN IN WITH GOOGLE SECTION ONLY */}
        <div className="pt-2 space-y-3">
          <div className="text-left">
            <h3 className="text-xs font-black tracking-wider text-slate-800 uppercase">
              1. SIGN IN WITH GOOGLE
            </h3>
          </div>

          <button
            type="button"
            onClick={handleContinueWithGoogle}
            disabled={loading}
            id="continue-with-google-btn"
            className="w-full py-3.5 px-6 bg-white hover:bg-slate-50 border border-slate-300 hover:border-slate-400 rounded-2xl flex items-center justify-center gap-3 transition shadow-xs text-slate-800 font-bold text-sm sm:text-base cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed group active:scale-[0.99]"
          >
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>{loading ? 'Connecting with Google...' : 'Continue with Google'}</span>
          </button>

          <p className="text-xs text-slate-500 text-center pt-1 leading-relaxed">
            Our system checks your Google email automatically in real-time.
          </p>
        </div>
      </div>
    </div>
  );
};
