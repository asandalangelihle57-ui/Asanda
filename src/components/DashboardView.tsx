import React, { useEffect, useRef, useState } from 'react';
import { 
  Building2, 
  HeartHandshake, 
  FileCheck, 
  AlertTriangle, 
  Clock, 
  Coins, 
  ClipboardList, 
  Briefcase, 
  TrendingUp, 
  ArrowUpRight, 
  ShieldAlert, 
  Sparkles, 
  Filter, 
  CheckCircle2, 
  Calendar,
  ChevronRight,
  FileText,
  Scale,
  Flame,
  ArrowRight
} from 'lucide-react';
import { PublicEntity, NPO, KPI, StatutoryDocument, ReportingPeriod, StatementProblem } from '../types';
import { STATEMENT_PROBLEMS } from '../data/problemStatementData';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

interface DashboardViewProps {
  entities: PublicEntity[];
  npos: NPO[];
  kpis: KPI[];
  documents: StatutoryDocument[];
  problems?: StatementProblem[];
  currentPeriod: ReportingPeriod;
  onSelectEntity: (entityId: number) => void;
  onNavigateTab: (tab: any) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  entities,
  npos,
  kpis,
  documents,
  problems = STATEMENT_PROBLEMS,
  currentPeriod,
  onSelectEntity,
  onNavigateTab
}) => {
  const [problemSeverityFilter, setProblemSeverityFilter] = useState<'All' | 'Critical' | 'High' | 'Medium'>('All');
  const kpiChartRef = useRef<HTMLCanvasElement | null>(null);
  const budgetChartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstances = useRef<{ [key: string]: Chart }>({});

  const totalEntities = entities.length;
  const totalNpos = npos.length;
  const highRiskEntities = entities.filter(e => e.riskLevel === 'High');
  const mediumRiskEntities = entities.filter(e => e.riskLevel === 'Medium');
  const lowRiskEntities = entities.filter(e => e.riskLevel === 'Low');

  const totalAllocated = entities.reduce((acc, e) => acc + e.budgetAllocated, 0);
  const totalSpent = entities.reduce((acc, e) => acc + e.budgetSpent, 0);
  const overallUtilisation = Math.round((totalSpent / totalAllocated) * 100);

  const totalJobsCreated = entities.reduce((acc, e) => acc + e.jobsCreated, 0);
  const totalJobsTarget = entities.reduce((acc, e) => acc + e.jobsTarget, 0);

  const completedKpis = 142;
  const inProgressKpis = 88;
  const atRiskKpis = 18;
  const missedKpis = 6;

  // Render Chart.js charts
  useEffect(() => {
    // Destroy previous charts
    if (chartInstances.current.kpi) {
      chartInstances.current.kpi.destroy();
    }
    if (chartInstances.current.budget) {
      chartInstances.current.budget.destroy();
    }

    if (kpiChartRef.current) {
      chartInstances.current.kpi = new Chart(kpiChartRef.current, {
        type: 'doughnut',
        data: {
          labels: ['Completed (142)', 'In Progress (88)', 'At Risk (18)', 'Missed (6)'],
          datasets: [
            {
              data: [completedKpis, inProgressKpis, atRiskKpis, missedKpis],
              backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'],
              borderWidth: 2,
              borderColor: '#0f172a'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                color: '#cbd5e1',
                boxWidth: 12,
                font: { size: 11 }
              }
            }
          },
          cutout: '68%'
        }
      });
    }

    if (budgetChartRef.current) {
      chartInstances.current.budget = new Chart(budgetChartRef.current, {
        type: 'bar',
        data: {
          labels: ['Performing Arts', 'Museums & Heritage', 'Arts Dev', 'Film & Media', 'Languages', 'Sport & Boxing'],
          datasets: [
            {
              label: 'Allocated (R Millions)',
              data: [437, 720, 185, 162, 270, 77],
              backgroundColor: '#3b82f6',
              borderRadius: 4
            },
            {
              label: 'Spent (R Millions)',
              data: [350, 560, 94, 121, 214, 59],
              backgroundColor: '#10b981',
              borderRadius: 4
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                color: '#cbd5e1',
                boxWidth: 12,
                font: { size: 11 }
              }
            }
          },
          scales: {
            x: {
              ticks: { color: '#94a3b8', font: { size: 10 } },
              grid: { color: '#334155' }
            },
            y: {
              ticks: { color: '#94a3b8', font: { size: 10 } },
              grid: { color: '#334155' }
            }
          }
        }
      });
    }

    return () => {
      if (chartInstances.current.kpi) chartInstances.current.kpi.destroy();
      if (chartInstances.current.budget) chartInstances.current.budget.destroy();
    };
  }, []);

  return (
    <div className="p-4 sm:p-6 space-y-6 animate-fadeIn">
      {/* Executive Welcome & Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 shadow-md">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white tracking-tight">
              DSAC Executive Management Dashboard
            </h2>
            <span className="bg-emerald-500/20 text-emerald-300 text-xs px-2.5 py-0.5 rounded-full border border-emerald-500/30 font-semibold">
              Live PFMA Compliance Status
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time oversight for 26 Public Entities, 6 NPOs, and Presidential Employment Stimulus (PES)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-lg text-slate-300">
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span>Cycle: <strong>Q3 2025/2026</strong></span>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-lg text-slate-300">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Scope: <strong>All Entities (32)</strong></span>
          </div>
        </div>
      </div>

      {/* Early Warning Deadline Alert Banner */}
      <div className="bg-gradient-to-r from-amber-950/80 via-slate-900 to-slate-900 border border-amber-600/40 rounded-xl p-4 shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-start space-x-3">
          <div className="p-2.5 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-lg shrink-0 mt-0.5">
            <Clock className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-amber-200 text-sm">
                EARLY WARNING SYSTEM: Statutory Reporting Deadline
              </h3>
              <span className="bg-amber-500 text-slate-950 font-black text-[10px] px-2 py-0.2 rounded-full uppercase tracking-wider">
                10 Days Remaining
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Statutory deadline for Q3 performance reports is <strong>31 January 2026</strong>. 
              <strong> 24 of 32</strong> organisations have submitted. <strong>8 submissions</strong> are currently outstanding.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onNavigateTab('documents')}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3.5 py-1.5 rounded-lg text-xs transition-colors shadow"
          >
            View Pending Submissions
          </button>
        </div>
      </div>

      {/* High-Impact Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 shadow">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-medium">Public Entities</span>
            <Building2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white">{totalEntities}</div>
          <div className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1 font-mono">
            <CheckCircle2 className="w-3 h-3" />
            100% PFMA Registered
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 shadow">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-medium">Funded NPOs</span>
            <HeartHandshake className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-black text-white">{totalNpos}</div>
          <div className="text-[10px] text-sky-400 mt-1 flex items-center gap-1 font-mono">
            R71M Total Grants
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 shadow">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-medium">Q3 Reports Due</span>
            <FileCheck className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white">32</div>
          <div className="text-[10px] text-amber-400 mt-1 font-mono">
            24 Submitted • 8 Due
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 shadow">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-medium">KPIs At Risk</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-black text-rose-400">{atRiskKpis}</div>
          <div className="text-[10px] text-rose-400/80 mt-1 font-mono">
            Requires Intervention
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 shadow">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-medium">Budget Utilised</span>
            <Coins className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white">{overallUtilisation}%</div>
          <div className="text-[10px] text-emerald-400 mt-1 font-mono">
            R3.15B of R4.2B
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 shadow">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-medium">Jobs Created</span>
            <Briefcase className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white">{totalJobsCreated.toLocaleString()}</div>
          <div className="text-[10px] text-purple-300 mt-1 font-mono">
            Target: {totalJobsTarget.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Problems Listed on Official Statement: Statutory Resolution Matrix */}
      <div className="bg-slate-900 border-2 border-rose-500/40 rounded-xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-md bg-rose-500/20 text-rose-400 border border-rose-500/30">
                <ShieldAlert className="w-4 h-4" />
              </span>
              <h3 className="text-base font-bold text-white tracking-tight">
                Problems Listed on Official DSAC Statement: Live Resolution Matrix
              </h3>
              <span className="bg-rose-950 text-rose-300 text-[10px] px-2 py-0.5 rounded-full border border-rose-800 font-mono font-semibold">
                7 Core Challenges
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Active statutory tracking of the deficiencies codified in the Department's public entities oversight statement.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5 text-xs">
              {(['All', 'Critical', 'High', 'Medium'] as const).map(sev => (
                <button
                  key={sev}
                  onClick={() => setProblemSeverityFilter(sev)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                    problemSeverityFilter === sev
                      ? 'bg-amber-500 text-slate-950 shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>

            <button
              onClick={() => onNavigateTab('problems')}
              className="bg-rose-600 hover:bg-rose-500 text-white font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-colors shadow shrink-0"
            >
              <span>Full Problem Dossier & Directives</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Problems Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {problems
            .filter(p => problemSeverityFilter === 'All' || p.severity === problemSeverityFilter)
            .map(prob => (
              <div
                key={prob.id}
                onClick={() => onNavigateTab('problems')}
                className="bg-slate-950 border border-slate-800 hover:border-amber-500/60 rounded-xl p-3.5 space-y-2.5 cursor-pointer transition-all hover:shadow-lg group flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] text-amber-400 font-bold bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      {prob.code}
                    </span>
                    <span className={`text-[10px] px-2 py-0.2 rounded-full font-bold border ${
                      prob.severity === 'Critical' ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' :
                      prob.severity === 'High' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                      'bg-sky-500/20 text-sky-300 border-sky-500/30'
                    }`}>
                      {prob.severity}
                    </span>
                  </div>

                  <h4 className="font-bold text-white text-xs group-hover:text-amber-300 transition-colors line-clamp-1">
                    {prob.title}
                  </h4>

                  <p className="text-[11px] text-slate-400 line-clamp-2 italic border-l-2 border-slate-700 pl-2">
                    "{prob.verbatimStatement}"
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800/80 space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Statutory Remediation:</span>
                    <span className="font-mono font-bold text-emerald-400">{prob.remediationProgress}%</span>
                  </div>

                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        prob.remediationProgress >= 80 ? 'bg-emerald-500' :
                        prob.remediationProgress >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${prob.remediationProgress}%` }}
                    ></div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                    <span className="truncate max-w-[170px] text-slate-300">
                      {prob.affectedEntityNames[0]}
                    </span>
                    <span className="text-amber-400 flex items-center gap-0.5 font-semibold group-hover:translate-x-0.5 transition-transform">
                      Remediate <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* AI Predictive Risk Spotlight: Statutory Anomaly Detection */}
      <div className="bg-gradient-to-br from-rose-950/40 via-slate-900 to-slate-900 border border-rose-800/60 rounded-xl p-5 shadow-xl">
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-base">
                  AI Predictive Analytics: Elevated Performance Risk Detected
                </h3>
                <span className="bg-rose-500 text-white text-[10px] font-black uppercase px-2 py-0.2 rounded-full">
                  High Risk (78/100)
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Multi-factor risk assessment model combining historical delays, KPI shortfalls, and AGSA audit observations.
              </p>
            </div>
          </div>

          <button
            onClick={() => onSelectEntity(1)}
            className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold px-3.5 py-1.5 rounded-lg text-xs transition-colors shadow"
          >
            <span>Investigate National Arts Council</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Contributing factors break-down matching prompt specifications */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-3 bg-slate-950/70 p-3.5 rounded-lg border border-slate-800 text-xs">
          <div>
            <div className="text-slate-400 text-[11px]">Entity Flagged</div>
            <div className="font-bold text-slate-100 text-sm">National Arts Council of SA (NAC)</div>
            <div className="text-slate-500 text-[10px]">PFMA Schedule 3A Public Entity</div>
          </div>

          <div>
            <div className="text-slate-400 text-[11px]">KPI Progress Trajectory</div>
            <div className="font-bold text-rose-400 text-sm">42% (Expected: 75%)</div>
            <div className="text-slate-500 text-[10px]">Community Grants & Youth quotas lagging</div>
          </div>

          <div>
            <div className="text-slate-400 text-[11px]">Historical Compliance</div>
            <div className="font-bold text-amber-400 text-sm">3 Previous Missed Deadlines</div>
            <div className="text-slate-500 text-[10px]">10 days remaining for current cycle</div>
          </div>

          <div>
            <div className="text-slate-400 text-[11px]">AI Risk Inference</div>
            <div className="text-slate-200 text-[11px] leading-snug">
              "Current KPI progress is below expected trajectory and reporting deadline is approaching."
            </div>
          </div>
        </div>
      </div>

      {/* Visual Analytics Grid (Chart.js) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* KPI Achievement Status Chart */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-xl p-4 shadow flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              Overall KPI Performance Status
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">254 KPIs Total</span>
          </div>
          <div className="h-56 relative">
            <canvas ref={kpiChartRef}></canvas>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800 grid grid-cols-2 gap-2 text-center text-xs">
            <div className="bg-slate-950 p-2 rounded border border-slate-800">
              <div className="text-emerald-400 font-bold">56% Completed</div>
              <div className="text-slate-500 text-[10px]">142 Milestone Achieved</div>
            </div>
            <div className="bg-slate-950 p-2 rounded border border-slate-800">
              <div className="text-amber-400 font-bold">9.4% At Risk</div>
              <div className="text-slate-500 text-[10px]">24 Remediation Plans</div>
            </div>
          </div>
        </div>

        {/* Budget Allocation vs Utilisation by Category */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-xl p-4 shadow flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Coins className="w-4 h-4 text-emerald-400" />
              Budget Allocation vs Expenditure by Sector (R Millions)
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">Total Budget R4.2 Billion</span>
          </div>
          <div className="h-56 relative">
            <canvas ref={budgetChartRef}></canvas>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-400">
            <span>Overall Grant Burn Rate: <strong className="text-emerald-300">75.0%</strong> on target for Q3</span>
            <button 
              onClick={() => onNavigateTab('financials')}
              className="text-amber-400 hover:underline flex items-center gap-1 font-semibold"
            >
              Detailed Financial Report &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* Entity Performance Risk Matrix Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow">
        <div className="p-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="font-bold text-sm text-white">
              Public Entities Risk & Statutory Compliance Matrix (26 Entities)
            </h3>
            <p className="text-xs text-slate-400">
              Select any entity to view its dedicated performance dashboard and uploaded documents
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Low ({lowRiskEntities.length})
            </span>
            <span className="flex items-center gap-1 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Medium ({mediumRiskEntities.length})
            </span>
            <span className="flex items-center gap-1 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> High ({highRiskEntities.length})
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-3">Entity Name</th>
                <th className="p-3">Category</th>
                <th className="p-3">Province</th>
                <th className="p-3 text-right">Budget (Allocated)</th>
                <th className="p-3 text-center">KPI Achievement</th>
                <th className="p-3 text-center">Risk Level</th>
                <th className="p-3 text-center">Open Audits</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {entities.slice(0, 8).map(entity => (
                <tr key={entity.id} className="hover:bg-slate-800/60 transition-colors">
                  <td className="p-3 font-semibold text-white">
                    <div className="flex items-center gap-2">
                      <span className="bg-slate-800 text-amber-300 px-1.5 py-0.5 rounded font-mono text-[10px]">
                        {entity.acronym}
                      </span>
                      <span>{entity.name}</span>
                    </div>
                  </td>
                  <td className="p-3 text-slate-400">{entity.category}</td>
                  <td className="p-3 text-slate-400">{entity.province}</td>
                  <td className="p-3 text-right font-mono">
                    R{(entity.budgetAllocated / 1000000).toFixed(1)}M
                  </td>
                  <td className="p-3">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-16 bg-slate-800 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            entity.complianceRate >= 80 ? 'bg-emerald-500' : entity.complianceRate >= 60 ? 'bg-amber-500' : 'bg-rose-500'
                          }`}
                          style={{ width: `${entity.complianceRate}%` }}
                        ></div>
                      </div>
                      <span className="font-mono text-[11px]">{entity.complianceRate}%</span>
                    </div>
                  </td>
                  <td className="p-3 text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      entity.riskLevel === 'Low'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : entity.riskLevel === 'Medium'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}>
                      {entity.riskLevel}
                    </span>
                  </td>
                  <td className="p-3 text-center font-mono">
                    {entity.openAuditFindings > 0 ? (
                      <span className="text-amber-400 font-bold">{entity.openAuditFindings}</span>
                    ) : (
                      <span className="text-slate-500">0</span>
                    )}
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => onSelectEntity(entity.id)}
                      className="text-amber-400 hover:text-amber-300 font-semibold hover:underline"
                    >
                      Workspace &rarr;
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-3 bg-slate-950 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
          <span>Showing 8 of 26 Public Entities</span>
          <button 
            onClick={() => onNavigateTab('entities')}
            className="text-amber-400 hover:underline font-semibold"
          >
            View Complete Directory of 26 Entities & 6 NPOs &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};
