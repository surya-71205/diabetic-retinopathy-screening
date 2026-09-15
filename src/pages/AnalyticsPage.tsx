import React, { useState, useEffect } from 'react';
import { Info } from 'lucide-react';
import { api } from '../services/api';
import { AnalyticsData } from '../types';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend, 
  Cell 
} from 'recharts';

export const AnalyticsPage: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAnalytics().then((res) => {
      setData(res);
      setLoading(false);
    });
  }, []);

  const STAGE_BAR_COLORS: Record<string, string> = {
    'No DR': '#10b981',
    'Mild NPDR': '#f59e0b',
    'Moderate NPDR': '#f97316',
    'Severe NPDR': '#e11d48',
    'PDR': '#be123c',
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-xs text-clinical-500">
        <span className="w-5 h-5 border-2 border-brand-700 border-t-transparent rounded-full animate-spin mr-2" />
        Aggregating epidemiological cohort analytics...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8 text-center text-xs text-clinical-500">
        Insufficient data for meaningful analysis.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="pb-2 border-b border-clinical-200">
        <h1 className="text-xl sm:text-2xl font-bold text-clinical-950 tracking-tight">
          Clinical Screening Analytics & Associations
        </h1>
        <p className="text-xs sm:text-sm text-clinical-500 mt-0.5">
          Epidemiological correlations between clinical biomarkers and AI-screened Diabetic Retinopathy stages.
        </p>
      </div>

      {/* Clinical Guidance Notice */}
      <div className="bg-clinical-100/80 border border-clinical-200 rounded-lg p-3 text-xs text-clinical-700 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-clinical-500 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-clinical-900">Biostatistical Association Notice:</span>
          {' '}Data charts display statistical associations within the local screening cohort. These represent observational correlations and do not demonstrate causal inference.
        </div>
      </div>

      {/* 2x3 Grid of Clinical Correlation Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: DR Severity Distribution */}
        <div className="bg-white border border-clinical-200 rounded-lg p-5 shadow-xs space-y-3">
          <div className="border-b border-clinical-100 pb-2">
            <h2 className="text-sm font-bold text-clinical-950">
              DR Severity Distribution
            </h2>
            <p className="text-xs text-clinical-500">
              Prevalence of screening classifications across cohort.
            </p>
          </div>

          <div className="h-64 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.severityDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
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
                          <p className="font-bold">{d.stage}</p>
                          <p className="text-slate-300">Cohort Count: <strong className="text-white">{d.count}</strong></p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {data.severityDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={STAGE_BAR_COLORS[entry.stage] || '#0f766e'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Association Between HbA1c and DR Severity */}
        <div className="bg-white border border-clinical-200 rounded-lg p-5 shadow-xs space-y-3">
          <div className="border-b border-clinical-100 pb-2">
            <h2 className="text-sm font-bold text-clinical-950">
              Association Between HbA1c and DR Severity
            </h2>
            <p className="text-xs text-clinical-500">
              Mean glycated hemoglobin (%) across screening classifications.
            </p>
          </div>

          <div className="h-64 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.hba1cVsSeverity} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="stage" 
                  tick={{ fontSize: 11, fill: '#64748b' }} 
                  axisLine={{ stroke: '#e2e8f0' }}
                  tickLine={false}
                />
                <YAxis 
                  domain={[4, 12]}
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
                          <p className="font-bold">{d.stage}</p>
                          <p className="text-slate-300">Mean HbA1c: <strong className="text-emerald-400">{d.avgHba1c}%</strong></p>
                          <p className="text-slate-400 text-[10px]">Patients: {d.count}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="avgHba1c" fill="#0f766e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Association Between Diabetes Duration and DR Severity */}
        <div className="bg-white border border-clinical-200 rounded-lg p-5 shadow-xs space-y-3">
          <div className="border-b border-clinical-100 pb-2">
            <h2 className="text-sm font-bold text-clinical-950">
              Diabetes Duration and DR Severity
            </h2>
            <p className="text-xs text-clinical-500">
              Mean disease duration in years stratified by DR stage.
            </p>
          </div>

          <div className="h-64 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.durationVsSeverity} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="stage" 
                  tick={{ fontSize: 11, fill: '#64748b' }} 
                  axisLine={{ stroke: '#e2e8f0' }}
                  tickLine={false}
                />
                <YAxis 
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
                          <p className="font-bold">{d.stage}</p>
                          <p className="text-slate-300">Mean Duration: <strong className="text-teal-400">{d.avgDurationYears} years</strong></p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="avgDurationYears" fill="#0284c7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Blood Pressure Profile vs DR Severity */}
        <div className="bg-white border border-clinical-200 rounded-lg p-5 shadow-xs space-y-3">
          <div className="border-b border-clinical-100 pb-2">
            <h2 className="text-sm font-bold text-clinical-950">
              Blood Pressure Profile vs DR Severity
            </h2>
            <p className="text-xs text-clinical-500">
              Mean Systolic and Diastolic blood pressures (mmHg) by stage.
            </p>
          </div>

          <div className="h-64 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.bpVsSeverity} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="stage" 
                  tick={{ fontSize: 11, fill: '#64748b' }} 
                  axisLine={{ stroke: '#e2e8f0' }}
                  tickLine={false}
                />
                <YAxis 
                  domain={[60, 180]}
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
                          <p className="font-bold">{d.stage}</p>
                          <p className="text-slate-300">Mean Systolic: <strong className="text-amber-400">{d.avgSystolic} mmHg</strong></p>
                          <p className="text-slate-300">Mean Diastolic: <strong className="text-sky-400">{d.avgDiastolic} mmHg</strong></p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar name="Systolic (mmHg)" dataKey="avgSystolic" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar name="Diastolic (mmHg)" dataKey="avgDiastolic" fill="#64748b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 5: Age Distribution Across DR Stages */}
        <div className="bg-white border border-clinical-200 rounded-lg p-5 shadow-xs space-y-3">
          <div className="border-b border-clinical-100 pb-2">
            <h2 className="text-sm font-bold text-clinical-950">
              Age Profile vs DR Severity
            </h2>
            <p className="text-xs text-clinical-500">
              Average patient age in years per screening category.
            </p>
          </div>

          <div className="h-64 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.ageVsSeverity} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="stage" 
                  tick={{ fontSize: 11, fill: '#64748b' }} 
                  axisLine={{ stroke: '#e2e8f0' }}
                  tickLine={false}
                />
                <YAxis 
                  domain={[30, 80]}
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
                          <p className="font-bold">{d.stage}</p>
                          <p className="text-slate-300">Mean Age: <strong className="text-white">{d.avgAge} yrs</strong></p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="avgAge" fill="#475569" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 6: LDL Cholesterol Association */}
        <div className="bg-white border border-clinical-200 rounded-lg p-5 shadow-xs space-y-3">
          <div className="border-b border-clinical-100 pb-2">
            <h2 className="text-sm font-bold text-clinical-950">
              LDL Cholesterol and DR Severity
            </h2>
            <p className="text-xs text-clinical-500">
              Average low-density lipoprotein (mg/dL) by DR stage.
            </p>
          </div>

          <div className="h-64 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.ldlVsSeverity} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="stage" 
                  tick={{ fontSize: 11, fill: '#64748b' }} 
                  axisLine={{ stroke: '#e2e8f0' }}
                  tickLine={false}
                />
                <YAxis 
                  domain={[60, 200]}
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
                          <p className="font-bold">{d.stage}</p>
                          <p className="text-slate-300">Mean LDL: <strong className="text-white">{d.avgLdl} mg/dL</strong></p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="avgLdl" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
