import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, UserPlus, ChevronRight, Filter } from 'lucide-react';
import { api } from '../services/api';
import { Patient } from '../types';

export const PatientsPage: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getPatients().then((list) => {
      setPatients(list);
      setLoading(false);
    });
  }, []);

  const filteredPatients = patients.filter((p) => {
    const matchesSearch =
      !search.trim() ||
      p.id.toLowerCase().includes(search.toLowerCase()) ||
      p.name.toLowerCase().includes(search.toLowerCase());

    const matchesType = typeFilter === 'ALL' || p.diabetesType === typeFilter;

    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-clinical-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-clinical-950 tracking-tight">
            Patient Registry
          </h1>
          <p className="text-xs sm:text-sm text-clinical-500 mt-0.5">
            Directory of registered diabetic patients screened at this facility.
          </p>
        </div>

        <Link
          to="/new-analysis"
          className="inline-flex items-center gap-2 px-4 py-2 bg-brand-700 hover:bg-brand-800 text-white rounded text-xs font-semibold shadow-xs transition-colors shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>Register / New Scan</span>
        </Link>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white border border-clinical-200 rounded-lg p-3 sm:p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:max-w-xs">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-clinical-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Patient ID or Name..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-clinical-300 rounded-md bg-white placeholder-clinical-400 text-clinical-900 focus:outline-none focus:ring-1 focus:ring-brand-700"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-clinical-400 shrink-0" />
          <span className="text-xs text-clinical-500 font-medium shrink-0">Filter:</span>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="text-xs border border-clinical-300 rounded px-2.5 py-1.5 bg-white text-clinical-800 focus:outline-none focus:ring-1 focus:ring-brand-700 w-full sm:w-auto"
          >
            <option value="ALL">All Diabetes Types</option>
            <option value="Type 1">Type 1</option>
            <option value="Type 2">Type 2</option>
            <option value="Other / Unknown">Other / Unknown</option>
          </select>
        </div>
      </div>

      {/* Patient Table (Desktop) */}
      <div className="bg-white border border-clinical-200 rounded-lg shadow-xs overflow-hidden">
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-clinical-50 text-clinical-600 font-semibold border-b border-clinical-200">
              <tr>
                <th className="py-3 px-4">Patient ID</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Age / Sex</th>
                <th className="py-3 px-4">Diabetes Profile</th>
                <th className="py-3 px-4">HbA1c</th>
                <th className="py-3 px-4">Blood Pressure</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-clinical-100 text-clinical-800">
              {filteredPatients.map((p) => (
                <tr key={p.id} className="hover:bg-clinical-50/60 transition-colors">
                  <td className="py-3 px-4 font-mono font-medium text-clinical-950">
                    <Link to={`/patients/${p.id}`} className="hover:text-brand-700 hover:underline">
                      {p.id}
                    </Link>
                  </td>
                  <td className="py-3 px-4 font-medium text-clinical-900">
                    {p.name}
                  </td>
                  <td className="py-3 px-4 text-clinical-600">
                    {p.age} yrs • {p.sex}
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-block px-2 py-0.5 rounded bg-clinical-100 text-clinical-700 border border-clinical-200 text-[11px]">
                      {p.diabetesType} ({p.diabetesDuration}y)
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono">
                    {p.hba1c ? `${p.hba1c}%` : '—'}
                  </td>
                  <td className="py-3 px-4 font-mono text-clinical-600">
                    {p.systolicBP && p.diastolicBP ? `${p.systolicBP}/${p.diastolicBP}` : '—'}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Link
                      to={`/patients/${p.id}`}
                      className="inline-flex items-center gap-1 text-xs font-medium text-brand-700 hover:text-brand-800 px-2.5 py-1 rounded hover:bg-brand-50"
                    >
                      <span>View Profile</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Responsive Cards */}
        <div className="md:hidden divide-y divide-clinical-100">
          {filteredPatients.map((p) => (
            <div key={p.id} className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-sm text-clinical-950">
                  {p.id}
                </span>
                <span className="text-xs text-clinical-600 font-medium">
                  {p.age} yrs • {p.sex}
                </span>
              </div>

              <div className="text-sm font-semibold text-clinical-900">
                {p.name}
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs text-clinical-600">
                <span className="px-2 py-0.5 rounded bg-clinical-100 border border-clinical-200 text-[11px]">
                  {p.diabetesType} ({p.diabetesDuration}y duration)
                </span>
                {p.hba1c && (
                  <span className="font-mono text-clinical-700 font-medium">
                    HbA1c: {p.hba1c}%
                  </span>
                )}
              </div>

              <div className="pt-2 flex justify-end">
                <Link
                  to={`/patients/${p.id}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-brand-700 hover:text-brand-800"
                >
                  <span>View Clinical Record</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filteredPatients.length === 0 && !loading && (
          <div className="p-8 text-center text-xs text-clinical-400">
            No patient records match the selected criteria.
          </div>
        )}
      </div>
    </div>
  );
};
