import React from 'react';
import { 
  LayoutDashboard, 
  Building2, 
  HeartHandshake, 
  Target, 
  FileCheck2, 
  FolderGit2, 
  CheckSquare, 
  Coins, 
  ClipboardCheck, 
  BarChart3, 
  Bot, 
  History,
  Database,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { UserRole } from '../types';

export type NavTab = 
  | 'dashboard'
  | 'problems'
  | 'entities'
  | 'kpis'
  | 'documents'
  | 'financials'
  | 'audits'
  | 'ai'
  | 'auditlog';

interface SidebarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  userRole: UserRole;
  pendingDocsCount: number;
  atRiskKpisCount: number;
  openAuditsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  userRole,
  pendingDocsCount,
  atRiskKpisCount,
  openAuditsCount
}) => {
  const isEntityUser = userRole === 'EntityAdministrator' || userRole === 'EntityStaff';

  const operationalNav = [
    {
      id: 'dashboard' as NavTab,
      label: isEntityUser ? 'Entity Workspace' : 'Executive Dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'problems' as NavTab,
      label: 'Problem Statement Focus',
      icon: ShieldAlert,
      badge: '7 Directives',
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30'
    },
    {
      id: 'entities' as NavTab,
      label: 'Entities & NPOs (32)',
      icon: Building2,
      badge: '32 Orgs'
    },
    {
      id: 'kpis' as NavTab,
      label: 'KPI Performance Targets',
      icon: Target,
      badge: atRiskKpisCount > 0 ? `${atRiskKpisCount} at risk` : null,
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30'
    },
    {
      id: 'documents' as NavTab,
      label: 'Submissions & Evidence (PoE)',
      icon: FolderGit2,
      badge: pendingDocsCount > 0 ? `${pendingDocsCount} review` : null,
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30'
    },
    {
      id: 'financials' as NavTab,
      label: 'Financials & Grants',
      icon: Coins,
      badge: 'R4.2B'
    },
    {
      id: 'audits' as NavTab,
      label: 'AGSA Audit Findings',
      icon: ClipboardCheck,
      badge: openAuditsCount > 0 ? `${openAuditsCount} open` : null,
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30'
    }
  ];

  const systemNav = [
    {
      id: 'ai' as NavTab,
      label: 'Statutory Copilot',
      icon: Bot,
      badge: 'PFMA/NT',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
    },
    {
      id: 'auditlog' as NavTab,
      label: 'Compliance Audit Trail',
      icon: History,
      badge: null
    }
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 min-h-[calc(100vh-69px)]">
      <div className="p-3 text-[11px] font-semibold tracking-wider text-slate-400 uppercase border-b border-slate-800 flex items-center justify-between">
        <span>Statutory Portal</span>
        <span className="text-[10px] text-emerald-400 font-mono">PERS v1.0</span>
      </div>

      <nav className="flex-1 px-2 py-3 space-y-4 overflow-y-auto">
        {/* Operational Section */}
        <div>
          <div className="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Operational Workflows
          </div>
          <div className="space-y-1">
            {operationalNav.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group ${
                    isActive
                      ? 'bg-emerald-800 text-white shadow-md'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-amber-300' : 'text-slate-400 group-hover:text-slate-200'
                    }`} />
                    <span>{item.label}</span>
                  </div>

                  <div className="flex items-center space-x-1">
                    {item.badge && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono border ${
                        item.badgeColor || 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                    {isActive && <ChevronRight className="w-3.5 h-3.5 text-amber-300" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Governance & Architecture Section */}
        <div>
          <div className="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Governance & Architecture
          </div>
          <div className="space-y-1">
            {systemNav.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group ${
                    isActive
                      ? 'bg-emerald-800 text-white shadow-md'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-amber-300' : 'text-slate-400 group-hover:text-slate-200'
                    }`} />
                    <span>{item.label}</span>
                  </div>

                  <div className="flex items-center space-x-1">
                    {item.badge && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono border ${
                        item.badgeColor || 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                    {isActive && <ChevronRight className="w-3.5 h-3.5 text-amber-300" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Production Infrastructure Stamp */}
      <div className="p-3 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-400">
        <div className="text-[10px] font-mono text-emerald-400 font-semibold mb-1 flex items-center gap-1">
          <ShieldAlert className="w-3 h-3 text-emerald-400" />
          STATUTORY SECURE NODE
        </div>
        <p className="text-[10px] text-slate-400 leading-tight">
          C# • ASP.NET MVC 5 • Web API 2 • EF6 • SQL Server
        </p>
        <div className="mt-1.5 text-[10px] text-slate-400">
          Department of Sport, Arts and Culture © 2026
        </div>
      </div>
    </aside>
  );
};
