import React, { useState } from 'react';
import { 
  INITIAL_USERS, 
  PUBLIC_ENTITIES, 
  NPOS, 
  INITIAL_KPIS, 
  INITIAL_DOCUMENTS, 
  INITIAL_FINANCIALS, 
  INITIAL_AUDIT_FINDINGS, 
  INITIAL_AUDIT_LOGS,
  INITIAL_NOTIFICATIONS,
  REPORTING_PERIODS
} from './data/seedData';
import { STATEMENT_PROBLEMS } from './data/problemStatementData';
import { 
  User, 
  UserRole, 
  PublicEntity, 
  NPO, 
  KPI, 
  StatutoryDocument, 
  FinancialRecord, 
  AuditFinding, 
  AuditLogEntry, 
  ReportingPeriod, 
  NotificationItem,
  DocumentVersion,
  StatementProblem
} from './types';

import { LoginView } from './components/LoginView';
import { Header } from './components/Header';
import { Sidebar, NavTab } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { ProblemStatementView } from './components/ProblemStatementView';
import { EntitiesView } from './components/EntitiesView';
import { KpiView } from './components/KpiView';
import { DocumentsView } from './components/DocumentsView';
import { FinancialsView } from './components/FinancialsView';
import { AuditView } from './components/AuditView';
import { AnalyticsView } from './components/AnalyticsView';
import { AiAssistantView } from './components/AiAssistantView';
import { AuditLogView } from './components/AuditLogView';

export default function App() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  // Application Data States
  const [users] = useState<User[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USERS[1]); // Default: Dr. Zanele Buthelezi (DSAC Chief Director)
  const [entities, setEntities] = useState<PublicEntity[]>(PUBLIC_ENTITIES);
  const [npos] = useState<NPO[]>(NPOS);
  const [kpis, setKpis] = useState<KPI[]>(INITIAL_KPIS);
  const [documents, setDocuments] = useState<StatutoryDocument[]>(INITIAL_DOCUMENTS);
  const [financials] = useState<FinancialRecord[]>(INITIAL_FINANCIALS);
  const [audits, setAudits] = useState<AuditFinding[]>(INITIAL_AUDIT_FINDINGS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [reportingPeriods] = useState<ReportingPeriod[]>(REPORTING_PERIODS);
  const [problems, setProblems] = useState<StatementProblem[]>(STATEMENT_PROBLEMS);
  const currentPeriod = reportingPeriods[0];

  // Navigation and Selection States
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [selectedEntityId, setSelectedEntityId] = useState<number | null>(null);

  // User Role Switcher
  const handleSwitchUser = (user: User) => {
    setCurrentUser(user);
    if (user.role === 'EntityAdministrator' || user.role === 'EntityStaff') {
      setSelectedEntityId(user.entityId || 1); // Set to their entity
    }
  };

  const handleMarkNotificationRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  // Add system audit log entry
  const logAction = (action: string, details: string, targetRecord: string = 'General', entityName: string = 'System') => {
    const newLog: AuditLogEntry = {
      id: Date.now(),
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      userName: currentUser.fullName,
      userRole: currentUser.role,
      action,
      entityName,
      targetRecord,
      details,
      ipAddress: '10.240.12.84'
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // KPI Update Handler
  const handleUpdateKpi = (updatedKpi: KPI) => {
    setKpis(prev => prev.map(k => k.id === updatedKpi.id ? updatedKpi : k));

    // Update entity compliance rate & risk if needed
    setEntities(prev => prev.map(entity => {
      if (entity.id === updatedKpi.entityId) {
        const entityKpis = kpis.map(k => k.id === updatedKpi.id ? updatedKpi : k).filter(k => k.entityId === entity.id);
        const avgPct = Math.round(entityKpis.reduce((acc, k) => acc + k.percentageAchieved, 0) / (entityKpis.length || 1));
        const hasLag = entityKpis.some(k => k.percentageAchieved < 60);
        return {
          ...entity,
          complianceRate: avgPct,
          riskLevel: hasLag ? 'High' : avgPct >= 80 ? 'Low' : 'Medium'
        };
      }
      return entity;
    }));

    logAction(
      'KPIUpdated',
      `Updated KPI #${updatedKpi.id} actual to ${updatedKpi.actualResult} (${updatedKpi.percentageAchieved}% achieved).`,
      `KPI #${updatedKpi.id}`,
      updatedKpi.entityName
    );
  };

  // Register New Strategic KPI
  const handleCreateKpi = (newKpiData: Omit<KPI, 'id'>) => {
    const newKpi: KPI = {
      ...newKpiData,
      id: Date.now()
    };
    setKpis(prev => [newKpi, ...prev]);
    logAction(
      'KPICreated',
      `Registered strategic performance indicator: "${newKpi.name}" for ${newKpi.entityName}`,
      newKpi.name,
      newKpi.entityName
    );
  };

  // Upload New Document Version
  const handleUploadNewVersion = (docId: number, changeDescription: string, fileName: string, fileSize: string = '4.1 MB') => {
    setDocuments(prev => prev.map(doc => {
      if (doc.id === docId) {
        const nextVer = doc.currentVersion + 1;
        const newVersionObj: DocumentVersion = {
          id: doc.versions.length + 300 + Math.floor(Math.random() * 100),
          documentId: docId,
          versionNumber: nextVer,
          fileName,
          fileSize,
          uploadedAt: new Date().toISOString().slice(0, 10),
          uploadedBy: currentUser.fullName,
          changeDescription,
          sha256Hash: `a7f92b${Math.floor(Math.random() * 899999 + 100000)}e84c987213d2f93`,
          comments: []
        };

        return {
          ...doc,
          currentVersion: nextVer,
          status: 'Submitted',
          versions: [...doc.versions, newVersionObj]
        };
      }
      return doc;
    }));

    logAction(
      'DocumentUploaded',
      `Uploaded statutory revision for Document #${docId}: ${fileName} (${changeDescription})`,
      fileName,
      'National Arts Council of South Africa'
    );
  };

  // Add Reviewer Comment
  const handleAddComment = (versionId: number, commentText: string) => {
    setDocuments(prev => prev.map(doc => {
      const updatedVersions = doc.versions.map(v => {
        if (v.id === versionId) {
          return {
            ...v,
            comments: [
              ...v.comments,
              {
                id: Date.now(),
                documentVersionId: versionId,
                userId: currentUser.id,
                userName: currentUser.fullName,
                userRole: currentUser.role,
                commentText,
                createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
                isActionRequired: true
              }
            ]
          };
        }
        return v;
      });
      return { ...doc, versions: updatedVersions };
    }));

    logAction('CommentAdded', `Comment posted: "${commentText}"`, `Version #${versionId}`, 'National Arts Council of South Africa');
  };

  // Approve Document
  const handleApproveDocument = (docId: number) => {
    setDocuments(prev => prev.map(doc => {
      if (doc.id === docId) {
        return {
          ...doc,
          status: 'Approved',
          reviewedBy: currentUser.fullName,
          reviewDate: new Date().toISOString().slice(0, 10)
        };
      }
      return doc;
    }));

    // Update entity compliance to reflect resolution
    setEntities(prev => prev.map(e => {
      if (e.id === 1) {
        return {
          ...e,
          riskLevel: 'Low',
          complianceRate: 85,
          riskReason: 'Q3 statutory report approved with verified bank reconciliation addendum.'
        };
      }
      return e;
    }));

    logAction(
      'DocumentApproved',
      `Statutory compliance sign-off approved by ${currentUser.fullName}. Version committed to permanent archive.`,
      `Document #${docId}`,
      'National Arts Council of South Africa'
    );
  };

  // Request Changes on Document
  const handleRequestChanges = (docId: number, comment: string) => {
    setDocuments(prev => prev.map(doc => {
      if (doc.id === docId) {
        return {
          ...doc,
          status: 'Changes Required'
        };
      }
      return doc;
    }));

    const doc = documents.find(d => d.id === docId);
    if (doc && doc.versions.length > 0) {
      handleAddComment(doc.versions[doc.versions.length - 1].id, comment);
    }

    logAction(
      'ChangesRequested',
      `Reviewer flagged submission: "${comment}"`,
      `Document #${docId}`,
      'National Arts Council of South Africa'
    );
  };

  // Log AGSA Finding
  const handleCreateAudit = (newAuditData: Omit<AuditFinding, 'id'>) => {
    const newAudit: AuditFinding = {
      ...newAuditData,
      id: Date.now()
    };
    setAudits(prev => [newAudit, ...prev]);
    logAction(
      'AuditFindingLogged',
      `Logged AGSA finding [${newAudit.findingReference}] (${newAudit.severity}) for ${newAudit.entityName}`,
      newAudit.findingReference,
      newAudit.entityName
    );
  };

  // Update Audit Finding Status
  const handleUpdateAuditStatus = (id: number, status: AuditFinding['status']) => {
    setAudits(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    const found = audits.find(a => a.id === id);
    if (found) {
      logAction(
        'AuditRemediationUpdated',
        `AGSA Finding ${found.findingReference} status updated to ${status}`,
        found.findingReference,
        found.entityName
      );
    }
  };

  // Update Statement Problem
  const handleUpdateProblem = (updatedProblem: StatementProblem) => {
    setProblems(prev => prev.map(p => p.id === updatedProblem.id ? updatedProblem : p));
  };

  // If signed out, display official Government Login Gateway
  if (!isAuthenticated) {
    return (
      <LoginView
        users={users}
        onLogin={user => {
          setCurrentUser(user);
          setIsAuthenticated(true);
        }}
      />
    );
  }

  const pendingDocsCount = documents.filter(d => d.status === 'Submitted' || d.status === 'Changes Required').length;
  const atRiskKpisCount = kpis.filter(k => k.status === 'At Risk').length;
  const openAuditsCount = audits.filter(a => a.status === 'Open').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Official Government Header with RBAC User Delegation & Sign Out */}
      <Header
        currentUser={currentUser}
        allUsers={users}
        onSwitchUser={handleSwitchUser}
        notifications={notifications}
        onMarkNotificationRead={handleMarkNotificationRead}
        onSignOut={() => setIsAuthenticated(false)}
      />

      {/* Main Body with Sidebar Navigation */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          activeTab={activeTab}
          onSelectTab={tab => {
            setActiveTab(tab);
            if (tab !== 'entities') {
              setSelectedEntityId(null);
            }
          }}
          userRole={currentUser.role}
          pendingDocsCount={pendingDocsCount}
          atRiskKpisCount={atRiskKpisCount}
          openAuditsCount={openAuditsCount}
        />

        {/* Dynamic View Canvas */}
        <main className="flex-1 overflow-y-auto bg-slate-950 p-2 sm:p-4">
          {activeTab === 'dashboard' && (
            <DashboardView
              entities={entities}
              npos={npos}
              kpis={kpis}
              documents={documents}
              problems={problems}
              currentPeriod={currentPeriod}
              onSelectEntity={id => {
                setSelectedEntityId(id);
                setActiveTab('entities');
              }}
              onNavigateTab={tab => setActiveTab(tab)}
            />
          )}

          {activeTab === 'problems' && (
            <ProblemStatementView
              problems={problems}
              entities={entities}
              currentUser={currentUser}
              onUpdateProblem={handleUpdateProblem}
              onSelectEntity={id => {
                setSelectedEntityId(id);
                setActiveTab('entities');
              }}
              onNavigateTab={tab => setActiveTab(tab)}
              onLogAction={logAction}
            />
          )}

          {activeTab === 'entities' && (
            <EntitiesView
              entities={entities}
              npos={npos}
              kpis={kpis}
              documents={documents}
              audits={audits}
              financials={financials}
              selectedEntityId={selectedEntityId}
              onSelectEntity={setSelectedEntityId}
              onNavigateTab={tab => setActiveTab(tab)}
            />
          )}

          {activeTab === 'npos' && (
            <EntitiesView
              entities={entities}
              npos={npos}
              kpis={kpis}
              documents={documents}
              audits={audits}
              financials={financials}
              selectedEntityId={null}
              onSelectEntity={setSelectedEntityId}
              onNavigateTab={tab => setActiveTab(tab)}
            />
          )}

          {activeTab === 'kpis' && (
            <KpiView
              kpis={kpis}
              onUpdateKpi={handleUpdateKpi}
              onCreateKpi={handleCreateKpi}
              userRole={currentUser.role}
            />
          )}

          {(activeTab === 'reports' || activeTab === 'documents') && (
            <DocumentsView
              documents={documents}
              currentUser={currentUser}
              onUploadNewVersion={handleUploadNewVersion}
              onAddComment={handleAddComment}
              onApproveDocument={handleApproveDocument}
              onRequestChanges={handleRequestChanges}
            />
          )}

          {activeTab === 'tasks' && (
            <div className="p-6 space-y-4">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                <h2 className="text-lg font-bold text-white mb-1">
                  Statutory Reporting Tasks & Approaching Deadlines
                </h2>
                <p className="text-xs text-slate-400">
                  Automated notifications, deadline countdowns, and escalation alerts
                </p>
                <div className="mt-4 space-y-2 text-xs">
                  <div className="bg-slate-950 p-3 rounded-lg border border-amber-500/40 flex justify-between items-center">
                    <div>
                      <span className="font-bold text-white">Q3 Quarterly Performance Report Submission</span>
                      <div className="text-slate-400 mt-0.5">Applies to: All 26 Public Entities & 6 Funded NPOs</div>
                    </div>
                    <span className="bg-amber-500/20 text-amber-300 font-bold px-3 py-1 rounded font-mono">
                      10 Days Left (31 Jan 2026)
                    </span>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex justify-between items-center">
                    <div>
                      <span className="font-bold text-white">Quarterly Financial Reconciliation & Bank Statements</span>
                      <div className="text-slate-400 mt-0.5">PFMA Section 53 compliance verification</div>
                    </div>
                    <span className="bg-sky-500/20 text-sky-300 font-bold px-3 py-1 rounded font-mono">
                      10 Days Left (31 Jan 2026)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'financials' && (
            <FinancialsView
              financials={financials}
              entities={entities}
              onSelectEntity={id => {
                setSelectedEntityId(id);
                setActiveTab('entities');
              }}
            />
          )}

          {activeTab === 'audits' && (
            <AuditView
              audits={audits}
              onSelectEntity={id => {
                setSelectedEntityId(id);
                setActiveTab('entities');
              }}
              onCreateAudit={handleCreateAudit}
              onUpdateAuditStatus={handleUpdateAuditStatus}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsView entities={entities} />
          )}

          {activeTab === 'ai' && (
            <AiAssistantView
              entities={entities}
              kpis={kpis}
              documents={documents}
              audits={audits}
              onSelectEntity={id => {
                setSelectedEntityId(id);
                setActiveTab('entities');
              }}
            />
          )}

          {activeTab === 'auditlog' && (
            <AuditLogView logs={auditLogs} />
          )}
        </main>
      </div>
    </div>
  );
}
