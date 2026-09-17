import React, { useState } from 'react';
import { User, NotificationItem } from '../types';
import { 
  Bell, 
  ChevronDown, 
  ShieldCheck, 
  Building2, 
  CheckCircle2,
  AlertTriangle,
  FileText,
  Calendar,
  LogOut,
  UserCheck
} from 'lucide-react';

interface HeaderProps {
  currentUser: User;
  allUsers: User[];
  onSwitchUser: (user: User) => void;
  notifications: NotificationItem[];
  onMarkNotificationRead: (id: number) => void;
  onSignOut: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  allUsers,
  onSwitchUser,
  notifications,
  onMarkNotificationRead,
  onSignOut,
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <header className="bg-emerald-950 text-white border-b border-emerald-800 shadow-md sticky top-0 z-40">
      {/* Top Republic of South Africa Official Branding Bar */}
      <div className="bg-emerald-900/90 px-4 py-1.5 flex flex-wrap items-center justify-between text-xs border-b border-emerald-800/60">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
          <span className="font-semibold tracking-wider uppercase text-emerald-200">
            Republic of South Africa
          </span>
          <span className="text-emerald-400/60 hidden sm:inline">|</span>
          <span className="text-emerald-100 hidden sm:inline">
            Department of Sport, Arts and Culture (DSAC)
          </span>
        </div>
        <div className="flex items-center space-x-3 text-emerald-200/90">
          <span className="bg-emerald-800/70 text-emerald-200 px-2.5 py-0.5 rounded border border-emerald-700/80 font-medium text-[11px] flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Official Government Intranet
          </span>
          <span className="hidden md:inline text-[11px] text-emerald-300/80 font-medium">
            PFMA Act 1 of 1999 • Treasury Regulation 16A Compliant
          </span>
        </div>
      </div>

      {/* Main App Navigation Bar */}
      <div className="px-4 py-2.5 flex items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-br from-amber-400 to-amber-600 px-2.5 py-2 rounded-lg text-emerald-950 shadow-inner flex items-center justify-center font-black tracking-tight text-base select-none">
            DSAC
          </div>
          <div>
            <h1 className="font-bold text-sm sm:text-base tracking-tight text-white flex items-center gap-2">
              Public Entities Reporting System
              <span className="bg-emerald-800/80 text-emerald-200 text-[10px] uppercase font-semibold px-2 py-0.5 rounded border border-emerald-700">
                26 Entities • 6 NPOs
              </span>
            </h1>
            <p className="text-[11px] text-emerald-300/80 hidden sm:block">
              Centralised Statutory Compliance, Financial Oversight & Performance Governance
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Active Reporting Period Indicator */}
          <div className="hidden lg:flex items-center gap-1.5 bg-emerald-900/60 border border-emerald-800 px-2.5 py-1.5 rounded-lg text-xs text-emerald-200">
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[11px] font-medium">Reporting Cycle: <strong className="text-white font-semibold">2025/2026 Q3 (Oct - Dec)</strong></span>
          </div>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifMenu(!showNotifMenu)}
              className="p-2 text-emerald-200 hover:text-white hover:bg-emerald-900 rounded-lg relative transition-colors"
              aria-label="Statutory Notifications"
              title="Statutory Notifications and Compliance Alerts"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifMenu && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl z-50 overflow-hidden">
                <div className="bg-slate-800/90 px-3 py-2 border-b border-slate-700 flex justify-between items-center text-xs font-semibold text-slate-200">
                  <span className="flex items-center gap-1.5">
                    <Bell className="w-3.5 h-3.5 text-amber-400" />
                    Statutory Alerts & Workflow Reminders
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {unreadCount} unread
                  </span>
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-slate-800">
                  {notifications.map(notif => (
                    <div
                      key={notif.id}
                      onClick={() => onMarkNotificationRead(notif.id)}
                      className={`p-3 text-xs cursor-pointer transition-colors ${
                        notif.isRead ? 'bg-slate-900/80 text-slate-400' : 'bg-slate-800/40 text-slate-200 hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {notif.type === 'DeadlineWarning' && (
                          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        )}
                        {notif.type === 'RiskAlert' && (
                          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                        )}
                        {notif.type === 'ReviewRequired' && (
                          <FileText className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                        )}
                        {notif.type === 'ChangesRequested' && (
                          <AlertTriangle className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                        )}
                        {notif.type === 'Approved' && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <p className="font-semibold text-[11px] text-slate-100">{notif.title}</p>
                          <p className="text-[11px] text-slate-300 mt-0.5 line-clamp-2">{notif.message}</p>
                          <span className="text-[10px] text-slate-500 mt-1 block">{notif.timestamp}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile & Session Controls */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 bg-emerald-900/90 hover:bg-emerald-800 border border-emerald-700/80 px-2.5 py-1.5 rounded-lg text-xs transition-colors"
            >
              <div className="w-6 h-6 rounded bg-amber-500 text-emerald-950 font-bold flex items-center justify-center text-xs">
                {currentUser.avatarInitials}
              </div>
              <div className="text-left hidden md:block">
                <div className="font-semibold text-white leading-tight">{currentUser.fullName}</div>
                <div className="text-[10px] text-emerald-300">{currentUser.roleTitle}</div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-emerald-300" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl z-50 overflow-hidden text-xs">
                <div className="p-3 bg-slate-800/90 border-b border-slate-700">
                  <div className="font-bold text-slate-100">{currentUser.fullName}</div>
                  <div className="text-slate-400 text-[11px]">{currentUser.email}</div>
                  <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-mono">
                    <ShieldCheck className="w-3 h-3" />
                    Role: {currentUser.role}
                  </div>
                  {currentUser.entityName && (
                    <div className="text-[11px] text-amber-300/90 mt-1 flex items-center gap-1">
                      <Building2 className="w-3 h-3" />
                      {currentUser.entityName}
                    </div>
                  )}
                </div>

                <div className="p-2 border-b border-slate-800">
                  <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold px-2 py-1 flex items-center justify-between">
                    <span>Authorized Officials</span>
                    <UserCheck className="w-3 h-3 text-emerald-400" />
                  </div>
                  {allUsers.map(user => (
                    <button
                      key={user.id}
                      onClick={() => {
                        onSwitchUser(user);
                        setShowUserMenu(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded flex items-center justify-between text-xs transition-colors ${
                        user.id === currentUser.id
                          ? 'bg-emerald-900/60 text-emerald-200 font-semibold'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <div>
                        <div className="font-medium">{user.fullName}</div>
                        <div className="text-[10px] text-slate-400">{user.roleTitle}</div>
                      </div>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                        {user.role.replace('DSAC', '').replace('Entity', '')}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Sign Out Button */}
                <div className="p-2">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onSignOut();
                    }}
                    className="w-full py-1.5 px-3 bg-slate-800/80 hover:bg-rose-950 hover:text-rose-300 text-slate-300 rounded flex items-center justify-center gap-2 font-semibold text-xs transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out of PERS
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
