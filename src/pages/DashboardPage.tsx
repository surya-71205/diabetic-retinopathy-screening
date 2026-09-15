import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  PlusCircle, 
  ArrowRight, 
  Eye, 
  FileText, 
  Clock, 
  AlertTriangle, 
  UploadCloud, 
  ChevronRight 
} from 'lucide-react';
import { api } from '../services/api';
import { DashboardStats, Analysis, User } from '../types';
import { StatusBadge } from '../components/common/StatusBadge';
import { QualityBadge } from '../components/common/QualityBadge';
import { formatDate, getStatusBadgeColor } from '../utils/formatters';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Cell 
} from 'recharts';

export const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentAnalyses, setRecentAnalyses] = useState<Analysis[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadData() {
      try {
        const [u, s, recents] = await Promise.all([
          api.getCurrentUser(),
          api.getDashboardStats(),
          api.getRecentAnalyses(6),
        ]);
        setUser(u);
        setStats(s);
        setRecentAnalyses(recents);
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      }
    }
    loadData();
  }, []);

  // Professional clinical stage bar chart colors
  const STAGE_BAR_COLORS: Record<string, string> = {
    'No DR': '#10b981',         // emerald-500
    'Mild NPDR': '#f59e0b',      // amber-500
    'Moderate NPDR': '#f97316',  // orange-500
    'Severe NPDR': '#e11d48',    // rose-600
    'PDR': '#be123c',            // red-700
  };

  return (
    <div className="space-y-6">
      {/* Header & Primary CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-clinical-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-clinical-950 tracking-tight">
            Good morning, {user?.name ? user.name.split(',')[0] : 'Dr. Krishnan'}
          </h1>
          <p className="text-xs sm:text-sm text-clinical-500 mt-0.5">
            Review your latest screening activity.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/new-analysis')}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-700 hover:bg-brand-800 text-white text-sm font-medium rounded-md shadow-xs transition-colors shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Analysis</span>
        </button>
      </div>

      {/* Overview Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Metric 1 */}
        <div className="bg-white border border-clinical-200 rounded-lg p-4 shadow-xs">
          <div className="flex items-center justify-between text-clinical-500 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-clinical-500">
              Total Analyses
            </span>
            <FileText className="w-4 h-4 text-clinical-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-clinical-950">
            {stats ? stats.totalAnalyses : '—'}
          </div>
          <p className="text-[11px] text-clinical-500 mt-1">
            Cumulative screening volume
          </p>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border border-clinical-200 rounded-lg p-4 shadow-xs">
          <div className="flex items-center justify-between text-clinical-500 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-clinical-500">
              DR Detected
            </span>
            <Eye className="w-4 h-4 text-brand-700" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-clinical-950">
            {stats ? stats.drDetected : '—'}
          </div>
          <p className="text-[11px] text-clinical-500 mt-1">
            Mild, Moderate, Severe, or PDR
          </p>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border border-clinical-200 rounded-lg p-4 shadow-xs">
          <div className="flex items-center justify-between text-clinical-500 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-700">
              High-Priority Reviews
            </span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-amber-950">
            {stats ? stats.highPriorityReviews : '—'}
          </div>
          <p className="text-[11px] text-clinical-500 mt-1">
            Severe NPDR / PDR / triage flag
          </p>
        </div>

        {/* Metric 4 */}
        <div className="bg-white border border-clinical-200 rounded-lg p-4 shadow-xs">
          <div className="flex items-center justify-between text-clinical-500 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-clinical-500">
              This Month
            </span>
            <Clock className="w-4 h-4 text-clinical-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-clinical-950">
            {stats ? stats.analysesThisMonth : '—'}
          </div>
          <p className="text-[11px] text-clinical-500 mt-1">
            Screening episodes logged
          </p>
        </div>
      </div>

      {/* Grid: Quick Action Panel + Severity Distribution Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Analysis CTA Panel */}
        <div className="bg-white border border-clinical-200 rounded-lg p-5 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center gap-2 text-brand-700 font-semibold text-xs uppercase tracking-wider mb-2">
              <UploadCloud className="w-4 h-4" />
              <span>Quick Screening</span>
            </div>
            <h2 className="text-lg font-bold text-clinical-950">
              New Retinal Analysis
            </h2>
            <p className="text-xs text-clinical-600 mt-1.5 leading-relaxed">
              Upload a retinal fundus image and enter patient information to begin AI-assisted screening and decision support.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-clinical-100">
            <button
              type="button"
              onClick={() => navigate('/new-analysis')}
              className="w-full flex items-center justify-between px-4 py-2.5 bg-brand-700 hover:bg-brand-800 text-white rounded text-sm font-medium transition-colors shadow-xs"
            >
              <span>Start New Analysis</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-[11px] text-clinical-400 text-center mt-2">
              Supports single-field 45° macular and disc centered images.
            </p>
          </div>
        </div>

        {/* DR Severity Distribution Chart */}
        <div className="lg:col-span-2 bg-white border border-clinical-200 rounded-lg p-5 shadow-xs flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-clinical-100 gap-1">
            <div>
              <h2 className="text-sm font-bold text-clinical-950">
                DR Severity Distribution
              </h2>
              <p className="text-xs text-clinical-500">
                Distribution of AI screening results across analyzed cases.
              </p>
            </div>
            <Link
              to="/analytics"
              className="text-xs text-brand-700 hover:text-brand-800 font-medium inline-flex items-center gap-1"
            >
              <span>Detailed Analytics</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="flex-1 mt-4 min-h-[190px]">
            {stats?.severityDistribution ? (
              <ResponsiveContainer width="100%" height={190}>
                <BarChart data={stats.severityDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis 
                    dataKey="stage" 
                    tick={{ fontSize: 11, fill: '#64748b' }} 
                    axisLine={{ stroke: '#e2e8f0' }}
                    tickLine={false}
                  />
                  <YAxis 
                    allowDecimals={false}
                    tick={{ fontSize: 11, fill: '#64748b' }} 
                    axisLine={{ stroke: '#e2e8f0' }}
                    tickLine={false}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        return (
                          <div className="bg-slate-900 text-white text-xs p-2 rounded shadow-md border border-slate-800">
                            <p className="font-semibold">{d.stage}</p>
                            <p className="text-slate-300">Cases: <strong className="text-white">{d.count}</strong></p>
                            <p className="text-slate-300">Proportion: <strong className="text-white">{d.percentage}%</strong></p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {stats.severityDistribution.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={STAGE_BAR_COLORS[entry.stage] || '#0f766e'} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-xs text-clinical-400">
                Loading severity distribution...
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Analyses Section */}
      <div className="bg-white border border-clinical-200 rounded-lg shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-clinical-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-clinical-950">
              Recent Analyses
            </h2>
            <p className="text-xs text-clinical-500">
              Latest retinal screenings completed in this clinic.
            </p>
          </div>
          <Link
            to="/history"
            className="text-xs text-brand-700 hover:text-brand-800 font-medium inline-flex items-center gap-1"
          >
            <span>View All History</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-clinical-50/80 text-clinical-600 font-semibold border-b border-clinical-200">
              <tr>
                <th className="py-3 px-4">Patient ID</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">DR Stage</th>
                <th className="py-3 px-4">Confidence</th>
                <th className="py-3 px-4">Image Quality</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-clinical-100 text-clinical-800">
              {recentAnalyses.map((item) => {
                const statusStyle = getStatusBadgeColor(item.status);
                return (
                  <tr key={item.id} className="hover:bg-clinical-50/60 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-clinical-900">
                      <Link to={`/patients/${item.patientId}`} className="hover:underline hover:text-brand-700">
                        {item.patientId}
                      </Link>
                    </td>
                    <td className="py-3 px-4 text-clinical-600">
                      {formatDate(item.createdAt)}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge stage={item.drStage} size="sm" />
                    </td>
                    <td className="py-3 px-4 font-medium text-clinical-900">
                      {item.confidence}%
                    </td>
                    <td className="py-3 px-4">
                      <QualityBadge quality={item.imageQuality} showDetails={false} />
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-0.5 rounded text-[11px] border ${statusStyle.badge}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        to={`/analysis/${item.id}`}
                        className="inline-flex items-center gap-1 text-xs font-medium text-brand-700 hover:text-brand-800 px-2.5 py-1 rounded hover:bg-brand-50"
                      >
                        <span>View</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Friendly Card List View */}
        <div className="md:hidden divide-y divide-clinical-100">
          {recentAnalyses.map((item) => (
            <div key={item.id} className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-sm text-clinical-950">
                  {item.patientId}
                </span>
                <span className="text-xs text-clinical-500">
                  {formatDate(item.createdAt)}
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <StatusBadge stage={item.drStage} size="sm" />
                <span className="text-xs font-semibold text-clinical-900">
                  Confidence: {item.confidence}%
                </span>
              </div>

              <div className="flex items-center justify-between pt-1 text-xs">
                <div className="flex items-center gap-2">
                  <QualityBadge quality={item.imageQuality} />
                  <span className="text-clinical-400">|</span>
                  <span className="text-clinical-600 text-[11px]">{item.status}</span>
                </div>
                <Link
                  to={`/analysis/${item.id}`}
                  className="font-medium text-brand-700 hover:text-brand-800 flex items-center gap-1"
                >
                  <span>Review Analysis</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
