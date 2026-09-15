import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Lock, Mail, ShieldAlert, ArrowRight, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('a.krishnan@retinaclinic.org');
  const [password, setPassword] = useState('Screening2026!');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await api.login(email, password, rememberMe);
      navigate('/dashboard');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Authentication failed. Please verify credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = () => {
    setEmail('a.krishnan@retinaclinic.org');
    setPassword('Screening2026!');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-clinical-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 px-4 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Medical Brand Header */}
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-lg bg-brand-700 text-white flex items-center justify-center shadow-sm">
            <Eye className="w-7 h-7" />
          </div>
        </div>

        <h1 className="mt-4 text-center text-2xl font-bold tracking-tight text-clinical-950">
          DR-SCAN
        </h1>
        <p className="mt-1 text-center text-xs font-medium text-clinical-600 uppercase tracking-wider">
          AI-Assisted Diabetic Retinopathy Screening
        </p>
        <p className="mt-1 text-center text-xs text-clinical-500">
          Clinical Decision Support Portal
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 border border-clinical-200 rounded-lg shadow-xs">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-md text-xs text-rose-800 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label 
                htmlFor="email" 
                className="block text-xs font-semibold text-clinical-700 uppercase tracking-wider"
              >
                Clinical ID / Email Address
              </label>
              <div className="mt-1.5 relative rounded-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-clinical-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@retinaclinic.org"
                  className="block w-full pl-9 pr-3 py-2 text-sm border border-clinical-300 rounded-md bg-white placeholder-clinical-400 focus:outline-none focus:ring-1 focus:ring-brand-700 focus:border-brand-700 text-clinical-900"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label 
                  htmlFor="password" 
                  className="block text-xs font-semibold text-clinical-700 uppercase tracking-wider"
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => alert('For clinical MVP demo, use credentials: a.krishnan@retinaclinic.org / Screening2026!')}
                  className="text-xs text-brand-700 hover:text-brand-800"
                >
                  Forgot password?
                </button>
              </div>
              <div className="mt-1.5 relative rounded-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-clinical-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2 text-sm border border-clinical-300 rounded-md bg-white placeholder-clinical-400 focus:outline-none focus:ring-1 focus:ring-brand-700 focus:border-brand-700 text-clinical-900"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-clinical-300 text-brand-700 focus:ring-brand-700"
                />
                <span className="text-xs text-clinical-600">Remember credentials on this terminal</span>
              </label>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-brand-700 hover:bg-brand-800 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-brand-700 shadow-xs transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Authenticating...
                  </span>
                ) : (
                  <>
                    <span>Sign In to Clinical Workspace</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick Demo Pre-fill */}
          <div className="mt-6 pt-5 border-t border-clinical-100">
            <div className="bg-clinical-50 border border-clinical-200 rounded p-3 text-xs text-clinical-600">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-semibold text-clinical-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-700" />
                  Pre-configured Clinician Account
                </span>
                <button
                  type="button"
                  onClick={fillDemoAccount}
                  className="text-brand-700 hover:text-brand-800 font-medium underline text-[11px]"
                >
                  Quick Fill
                </button>
              </div>
              <p className="text-[11px] text-clinical-500">
                User: Dr. Ananya Krishnan, MD (Screener)
              </p>
            </div>
          </div>
        </div>

        {/* Clinical Disclaimer */}
        <p className="mt-6 text-center text-xs text-clinical-500 leading-relaxed max-w-sm mx-auto">
          AI-assisted screening decision-support tool. Intended for authorized clinical and healthcare personnel only.
        </p>
      </div>
    </div>
  );
};
