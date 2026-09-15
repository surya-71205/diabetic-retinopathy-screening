import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronRight, RotateCcw } from 'lucide-react';
import { api } from '../services/api';
import { Analysis, DRStage, AnalysisStatus } from '../types';
import { StatusBadge } from '../components/common/StatusBadge';
import { QualityBadge } from '../components/common/QualityBadge';
import { formatDate, getStatusBadgeColor } from '../utils/formatters';

export const HistoryPage: React.FC = () => {
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('ALL');
  const [dateFilter, setDateFilter] = useState<'ALL' | 'TODAY' | 'WEEK' | 'MONTH'>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'date_desc' | 'date_asc' | 'confidence_desc' | 'confidence_asc'>('date_desc');

  const loadHistory = async () => {
    setLoading(true);
    try {
      const data = await api.getAnalysisHistory({
        search: search.trim() || undefined,
        drStage: stageFilter !== 'ALL' ? (stageFilter as DRStage) : undefined,
        dateRange: dateFilter,
        status: statusFilter !== 'ALL' ? (statusFilter as AnalysisStatus) : undefined,
        sortBy,
      });
      setAnalyses(data);
    } catch (err) {
      console.error('Failed to load history', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [search, stageFilter, dateFilter, statusFilter, sortBy]);

  const handleResetFilters = () => {
    setSearch('');
    setStageFilter('ALL');
    setDateFilter('ALL');
    setStatusFilter('ALL');
    setSortBy('date_desc');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-clinical-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-clinical-950 tracking-tight">
            Screening Analysis History
          </h1>
          <p className="text-xs sm:text-sm text-clinical-500 mt-0.5">
            Complete longitudinal audit log of all retinal AI screening encounters.
          </p>
        </div>

        <span className="text-xs text-clinical-500 font-mono self-start sm:self-auto">
          {analyses.length} Records Found
        </span>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-clinical-200 rounded-lg p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          {/* Search Box */}
          <div className="lg:col-span-2 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-clinical-400">
              <Search className="w-3.5 h-3.5" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Patient ID, Analysis Ref..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-clinical-300 rounded-md bg-white placeholder-clinical-400 text-clinical-900 focus:outline-none focus:ring-1 focus:ring-brand-700"
            />
          </div>

          {/* Stage Filter */}
          <div>
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="w-full py-2 px-2.5 text-xs border border-clinical-300 rounded-md bg-white text-clinical-800 focus:outline-none focus:ring-1 focus:ring-brand-700"
            >
              <option value="ALL">All DR Stages</option>
              <option value="No DR">No DR</option>
              <option value="Mild NPDR">Mild NPDR</option>
              <option value="Moderate NPDR">Moderate NPDR</option>
              <option value="Severe NPDR">Severe NPDR</option>
              <option value="PDR">PDR</option>
            </select>
          </div>

          {/* Date Filter */}
          <div>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value as 'ALL' | 'TODAY' | 'WEEK' | 'MONTH')}
              className="w-full py-2 px-2.5 text-xs border border-clinical-300 rounded-md bg-white text-clinical-800 focus:outline-none focus:ring-1 focus:ring-brand-700"
            >
              <option value="ALL">All Dates</option>
              <option value="TODAY">Today</option>
              <option value="WEEK">Past 7 Days</option>
              <option value="MONTH">Past 30 Days</option>
            </select>
          </div>

          {/* Sort Order */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date_desc' | 'date_asc' | 'confidence_desc' | 'confidence_asc')}
              className="w-full py-2 px-2.5 text-xs border border-clinical-300 rounded-md bg-white text-clinical-800 focus:outline-none focus:ring-1 focus:ring-brand-700"
            >
              <option value="date_desc">Newest First</option>
              <option value="date_asc">Oldest First</option>
              <option value="confidence_desc">Highest Confidence</option>
              <option value="confidence_asc">Lowest Confidence</option>
            </select>
          </div>
        </div>

        {/* Filter Status Reset Pill */}
        {(search || stageFilter !== 'ALL' || dateFilter !== 'ALL' || statusFilter !== 'ALL') && (
          <div className="pt-2 border-t border-clinical-100 flex items-center justify-between text-xs text-clinical-500">
            <span>Active filters applied</span>
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1 text-brand-700 hover:text-brand-800 font-medium"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          </div>
        )}
      </div>

      {/* Analyses Table (Desktop) */}
      <div className="bg-white border border-clinical-200 rounded-lg shadow-xs overflow-hidden">
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-clinical-50 text-clinical-600 font-semibold border-b border-clinical-200">
              <tr>
                <th className="py-3 px-4">Ref ID</th>
                <th className="py-3 px-4">Patient ID</th>
                <th className="py-3 px-4">Date & Laterality</th>
                <th className="py-3 px-4">DR Stage</th>
                <th className="py-3 px-4">Confidence</th>
                <th className="py-3 px-4">Quality</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-clinical-100 text-clinical-800">
              {analyses.map((item) => {
                const statusStyle = getStatusBadgeColor(item.status);
                return (
                  <tr key={item.id} className="hover:bg-clinical-50/60 transition-colors">
                    <td className="py-3 px-4 font-mono text-clinical-500 font-medium">
                      {item.id}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-clinical-950">
                      <Link to={`/patients/${item.patientId}`} className="hover:text-brand-700 hover:underline">
                        {item.patientId}
                      </Link>
                    </td>
                    <td className="py-3 px-4 text-clinical-600">
                      <div>{formatDate(item.createdAt)}</div>
                      <div className="text-[10px] text-clinical-400">{item.eye}</div>
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge stage={item.drStage} size="sm" />
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-clinical-900">
                      {item.confidence}%
                    </td>
                    <td className="py-3 px-4">
                      <QualityBadge quality={item.imageQuality} />
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
                        <span>Review</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Friendly Card List */}
        <div className="md:hidden divide-y divide-clinical-100">
          {analyses.map((item) => (
            <div key={item.id} className="p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-mono font-bold text-sm text-clinical-950 block">
                    {item.patientId}
                  </span>
                  <span className="font-mono text-[10px] text-clinical-400">
                    Ref: {item.id}
                  </span>
                </div>
                <span className="text-xs text-clinical-500">
                  {formatDate(item.createdAt)}
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2">
                <StatusBadge stage={item.drStage} size="sm" />
                <span className="text-xs font-mono font-semibold text-clinical-900">
                  {item.confidence}% confidence
                </span>
              </div>

              <div className="flex items-center justify-between pt-1 text-xs border-t border-clinical-50">
                <div className="flex items-center gap-2">
                  <QualityBadge quality={item.imageQuality} />
                  <span className="text-[11px] text-clinical-500 font-medium">
                    {item.eye}
                  </span>
                </div>
                <Link
                  to={`/analysis/${item.id}`}
                  className="font-medium text-brand-700 hover:text-brand-800 flex items-center gap-1"
                >
                  <span>Open Analysis</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {analyses.length === 0 && !loading && (
          <div className="p-8 text-center text-xs text-clinical-400 space-y-2">
            <p>No screening analyses match the current filter criteria.</p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-brand-700 font-medium hover:underline text-xs"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
