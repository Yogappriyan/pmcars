import React, { useState, useEffect } from 'react';
import { Shield, User as UserIcon, X, AlertCircle, CheckCircle2, Lock, ArrowRight, Mail, Sparkles, Check } from 'lucide-react';
import { 
  authenticateWithGoogleAccount, 
  AUTHORIZED_ADMIN_EMAILS,
  isAuthorizedAdminEmail
} from '../../firebase/service';
import { AppUser } from '../../types';

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
      setCustomGmail('');
      setCustomerName('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAccountSelect = async (email: string, name?: string) => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) return;

    setLoading(true);
    setError(null);
    setInfoMessage(null);

    try {
      const authResult = await authenticateWithGoogleAccount({
        email: cleanEmail,
        name: name || cleanEmail.split('@')[0]
      });

      if (authResult.isAdmin) {
        setInfoMessage(`Signed in as Dealership Administrator (${cleanEmail}). Opening Admin Dashboard...`);
      } else {
        setInfoMessage(`Signed in as Customer (${cleanEmail}). Opening your History of Purchases & Bookings...`);
      }

      setTimeout(() => {
        onSuccess(authResult.user, authResult.isAdmin);
        onClose();
      }, 700);
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed. Please try again.');
      setLoading(false);
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customGmail.trim()) return;
    handleAccountSelect(customGmail.trim(), customerName.trim() || undefined);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
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
            <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shadow-xs">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Sign in with Google</h3>
              <p className="text-xs text-slate-300">Choose an account to continue to PM Cars</p>
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

          {/* Role access rule notice */}
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed space-y-1">
            <span className="font-bold text-slate-900 block flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-amber-600" />
              <span>Access & Redirection Policy:</span>
            </span>
            <p>
              • <strong>man695223@gmail.com:</strong> Opens the Dealership Admin Dashboard.
            </p>
            <p>
              • <strong>Every other Gmail:</strong> Signs in as Customer and opens your <strong>History of Purchases & Bookings</strong>.
            </p>
          </div>

          {/* Quick Account Chooser List */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Select an account
            </label>

            {/* Account 1: Dealership Administrator */}
            <button
              type="button"
              id="google-account-admin"
              onClick={() => handleAccountSelect(AUTHORIZED_ADMIN_EMAILS[0], 'PM Cars Dealership Owner')}
              disabled={loading}
              className="w-full p-3.5 rounded-2xl border-2 border-amber-300 bg-amber-50/60 hover:bg-amber-100/80 text-left transition flex items-center justify-between group cursor-pointer shadow-2xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-sm">
                  M
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-slate-900">PM Cars Dealership Owner</span>
                    <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 bg-amber-200 text-amber-900 rounded">
                      Admin Panel
                    </span>
                  </div>
                  <p className="font-mono text-xs text-amber-900 font-bold">
                    {AUTHORIZED_ADMIN_EMAILS[0]}
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-amber-700 group-hover:translate-x-1 transition" />
            </button>

            {/* Account 2: Customer Account (vkalvaro1005@gmail.com) */}
            <button
              type="button"
              id="google-account-vkalvaro"
              onClick={() => handleAccountSelect('vkalvaro1005@gmail.com', 'Alvaro V')}
              disabled={loading}
              className="w-full p-3.5 rounded-2xl border border-blue-200 bg-blue-50/60 hover:bg-blue-100/70 text-left transition flex items-center justify-between group cursor-pointer shadow-2xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-sm">
                  A
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-slate-900">Alvaro V</span>
                    <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 bg-blue-200 text-blue-900 rounded">
                      Customer
                    </span>
                  </div>
                  <p className="font-mono text-xs text-blue-900 font-bold">
                    vkalvaro1005@gmail.com
                  </p>
                  <p className="text-[10px] text-blue-700 mt-0.5">
                    Opens Customer's History of Purchases
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-blue-700 group-hover:translate-x-1 transition" />
            </button>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider relative">
              Or Sign In with Any Other Gmail
            </span>
          </div>

          {/* Enter Any Gmail Form */}
          <form onSubmit={handleCustomSubmit} className="space-y-3">
            <div className="space-y-2">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Customer Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Gmail Address (Any Google Account)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. yourname@gmail.com"
                    value={customGmail}
                    onChange={(e) => setCustomGmail(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-500"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !customGmail.trim()}
              id="google-custom-submit-btn"
              className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition disabled:opacity-50 cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>{loading ? 'Signing in...' : 'Sign in with this Gmail'}</span>
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};
