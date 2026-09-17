import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, Building2, UserCheck, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { User } from '../types';

interface LoginViewProps {
  users: User[];
  onLogin: (user: User) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ users, onLogin }) => {
  const [selectedUserId, setSelectedUserId] = useState<number>(users[1]?.id || users[0].id); // Default to Dr. Zanele Buthelezi
  const [emailInput, setEmailInput] = useState<string>('z.buthelezi@dsac.gov.za');
  const [passwordInput, setPasswordInput] = useState<string>('••••••••••••');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);

  const handleSelectUser = (user: User) => {
    setSelectedUserId(user.id);
    setEmailInput(user.email);
    setErrorMessage('');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setErrorMessage('');

    setTimeout(() => {
      const user = users.find(u => u.id === selectedUserId) || users.find(u => u.email.toLowerCase() === emailInput.toLowerCase()) || users[0];
      setIsAuthenticating(false);
      onLogin(user);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* South Africa National Colours Top Stripe */}
      <div className="h-1.5 w-full bg-gradient-to-r from-emerald-600 via-amber-400 via-red-600 to-blue-700"></div>

      {/* Top Header Bar */}
      <header className="px-6 py-3 bg-emerald-950/80 border-b border-emerald-900/60 backdrop-blur flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-amber-500 text-emerald-950 flex items-center justify-center font-black text-xs shadow-md">
            DSAC
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-widest text-emerald-300 font-semibold">
              Republic of South Africa
            </div>
            <div className="text-xs font-bold text-white tracking-tight">
              Department of Sport, Arts and Culture
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-900/60 border border-emerald-700/60 text-[11px] text-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Official Government Intranet
          </span>
          <span className="text-[11px] font-mono text-emerald-400/80">
            PFMA Act 1 of 1999
          </span>
        </div>
      </header>

      {/* Main Login Card */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-auto">
        <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
          {/* Left Panel: Departmental Notice & Credentials */}
          <div className="lg:col-span-5 bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 p-6 sm:p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/70 border border-emerald-700/80 text-emerald-200 text-xs font-semibold mb-4">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                Statutory Compliance Portal
              </div>

              <h1 className="text-2xl font-bold text-white tracking-tight leading-tight">
                Public Entities Reporting System
              </h1>
              <p className="text-xs text-emerald-300/80 mt-2 font-mono">
                PERS Enterprise Version 1.0
              </p>

              <p className="text-xs text-slate-300 mt-4 leading-relaxed">
                Centralised statutory compliance monitoring, quarterly performance assessments, grant transfer oversight, and Auditor-General audit tracking for all 26 public entities and 6 funded non-profit organisations.
              </p>

              <div className="mt-6 space-y-3 pt-6 border-t border-emerald-900/60 text-xs">
                <div className="flex items-start gap-2 text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>PFMA Section 53 & Treasury Regulation 16A reporting cycle</span>
                </div>
                <div className="flex items-start gap-2 text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Quarterly verification of R4.20 Billion statutory allocations</span>
                </div>
                <div className="flex items-start gap-2 text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>SHA-256 cryptographic document versioning & non-destructive audit</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-800/80 text-[11px] text-slate-500">
              Department of Sport, Arts and Culture • National Government
            </div>
          </div>

          {/* Right Panel: Official Authentication Form */}
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between bg-slate-900/90">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white tracking-tight">
                  Official Statutory Sign-In
                </h2>
                <span className="text-[11px] text-slate-400 font-mono">
                  Cycle: 2025/26 Q3
                </span>
              </div>

              {errorMessage && (
                <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Authorized Government Profiles Selector for Quick Role Entry */}
              <div className="mb-5">
                <label className="block text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-2">
                  Select Authorized Statutory Official
                </label>
                <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                  {users.map(u => {
                    const isSelected = u.id === selectedUserId;
                    return (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => handleSelectUser(u)}
                        className={`w-full text-left p-2.5 rounded-lg border transition-all flex items-center justify-between text-xs ${
                          isSelected
                            ? 'bg-emerald-900/60 border-emerald-600 text-white shadow-sm'
                            : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800/80 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className={`w-6 h-6 rounded flex items-center justify-center font-bold text-[11px] shrink-0 ${
                            isSelected ? 'bg-amber-400 text-emerald-950' : 'bg-slate-800 text-slate-300'
                          }`}>
                            {u.avatarInitials}
                          </div>
                          <div className="truncate">
                            <div className="font-semibold truncate">{u.fullName}</div>
                            <div className="text-[10px] text-slate-400 truncate">
                              {u.roleTitle} {u.entityName ? `• ${u.entityName}` : ''}
                            </div>
                          </div>
                        </div>

                        <span className={`text-[9px] px-2 py-0.5 rounded font-mono shrink-0 ml-2 ${
                          isSelected ? 'bg-emerald-800 text-emerald-200 border border-emerald-600' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {u.role.replace('DSAC', 'DSAC ').replace('Entity', 'Entity ')}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Login Form */}
              <form onSubmit={handleFormSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Government Email / User ID
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="email"
                      value={emailInput}
                      onChange={e => setEmailInput(e.target.value)}
                      required
                      placeholder="e.g. z.buthelezi@dsac.gov.za"
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Security Passcode
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="password"
                      value={passwordInput}
                      onChange={e => setPasswordInput(e.target.value)}
                      required
                      placeholder="••••••••••••"
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isAuthenticating}
                    className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-50"
                  >
                    {isAuthenticating ? (
                      <span>Verifying Security Clearance...</span>
                    ) : (
                      <>
                        <span>Access Reporting Portal</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Statutory Legal Disclaimer */}
            <div className="mt-6 pt-4 border-t border-slate-800 text-[10px] text-slate-500 leading-normal">
              <span className="font-bold text-slate-400">LEGAL WARNING:</span> This computer system is the property of the Republic of South Africa and the Department of Sport, Arts and Culture. Unauthorized access or transmission of sensitive state audit records is an offense under the Cybercrimes Act No. 19 of 2020 and the Protection of Personal Information Act (POPIA).
            </div>
          </div>
        </div>
      </main>

      {/* Official RSA Footer */}
      <footer className="px-6 py-3 bg-slate-950 border-t border-slate-800/80 text-center text-[11px] text-slate-500">
        © 2026 Department of Sport, Arts and Culture • Republic of South Africa • Official Public Entities Reporting System
      </footer>
    </div>
  );
};
