import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  PlusCircle, 
  ChevronRight 
} from 'lucide-react';
import { api } from '../services/api';
import { Patient, Analysis } from '../types';
import { StatusBadge } from '../components/common/StatusBadge';
import { QualityBadge } from '../components/common/QualityBadge';
import { formatDate } from '../utils/formatters';

export const PatientDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [patient, setPatient] = useState<Patient | null>(null);
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPatientRecord() {
      if (!id) return;
      setLoading(true);
      try {
        const result = await api.getPatient(id);
        if (result) {
          setPatient(result.patient);
          setAnalyses(result.analyses);
        }
      } catch (err) {
        console.error('Failed to load patient profile', err);
      } finally {
        setLoading(false);
      }
    }
    loadPatientRecord();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-xs text-clinical-500">
        <span className="w-5 h-5 border-2 border-brand-700 border-t-transparent rounded-full animate-spin mr-2" />
        Loading patient profile {id}...
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="bg-white border border-clinical-200 rounded-lg p-8 text-center space-y-4 max-w-md mx-auto my-12">
        <h2 className="text-base font-bold text-clinical-950">Patient Not Found</h2>
        <p className="text-xs text-clinical-500">
          No registered patient found with identifier <code className="font-mono text-clinical-800">{id}</code>.
        </p>
        <button
          type="button"
          onClick={() => navigate('/patients')}
          className="px-4 py-2 bg-brand-700 text-white text-xs font-medium rounded hover:bg-brand-800"
        >
          Return to Patient Registry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-3 border-b border-clinical-200">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="p-1.5 text-clinical-500 hover:text-clinical-800 hover:bg-clinical-100 rounded transition-colors"
            title="Go back"
            aria-label="Go back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-brand-700">
                {patient.id}
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-clinical-500">
                Registered {formatDate(patient.registeredAt)}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-clinical-950 tracking-tight">
              {patient.name}
            </h1>
          </div>
        </div>

        <Link
          to="/new-analysis"
          className="inline-flex items-center gap-2 px-4 py-2 bg-brand-700 hover:bg-brand-800 text-white rounded text-xs font-semibold shadow-xs transition-colors shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Retinal Screening</span>
        </Link>
      </div>

      {/* Grid: Patient Demographics + Clinical Context */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Demographics & Diabetes Profile */}
        <div className="bg-white border border-clinical-200 rounded-lg p-5 shadow-xs space-y-4">
          <div className="border-b border-clinical-100 pb-2.5">
            <h2 className="text-sm font-bold text-clinical-950 uppercase tracking-wider">
              Patient Overview
            </h2>
            <p className="text-xs text-clinical-500">Demographic baseline information.</p>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between py-1 border-b border-clinical-50">
              <span className="text-clinical-500">Age:</span>
              <span className="font-semibold text-clinical-900">{patient.age} years</span>
            </div>
            <div className="flex justify-between py-1 border-b border-clinical-50">
              <span className="text-clinical-500">Biological Sex:</span>
              <span className="font-semibold text-clinical-900">{patient.sex}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-clinical-50">
              <span className="text-clinical-500">Diabetes Classification:</span>
              <span className="font-semibold text-clinical-900">{patient.diabetesType}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-clinical-50">
              <span className="text-clinical-500">Diabetes Duration:</span>
              <span className="font-semibold text-clinical-900">{patient.diabetesDuration} years</span>
            </div>
            {patient.notes && (
              <div className="pt-2">
                <span className="text-clinical-500 block mb-1 font-medium">Clinical Notes:</span>
                <p className="text-clinical-700 bg-clinical-50 p-2.5 rounded border border-clinical-200 text-[11px] leading-relaxed">
                  {patient.notes}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right 2 Columns: Metabolic & Systemic Profile */}
        <div className="lg:col-span-2 bg-white border border-clinical-200 rounded-lg p-5 shadow-xs space-y-4">
          <div className="border-b border-clinical-100 pb-2.5">
            <h2 className="text-sm font-bold text-clinical-950 uppercase tracking-wider">
              Clinical Baseline Parameters
            </h2>
            <p className="text-xs text-clinical-500">
              Recorded metabolic and cardiovascular context variables.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-clinical-50/60 border border-clinical-200 rounded p-3">
              <span className="text-[10px] uppercase font-semibold text-clinical-500 block">HbA1c</span>
              <span className="text-lg font-bold text-clinical-900 font-mono">
                {patient.hba1c ? `${patient.hba1c}%` : '—'}
              </span>
              <span className="text-[10px] text-clinical-400 block mt-0.5">Glycated hemoglobin</span>
            </div>

            <div className="bg-clinical-50/60 border border-clinical-200 rounded p-3">
              <span className="text-[10px] uppercase font-semibold text-clinical-500 block">Blood Glucose</span>
              <span className="text-lg font-bold text-clinical-900 font-mono">
                {patient.glucose ? `${patient.glucose}` : '—'}
              </span>
              <span className="text-[10px] text-clinical-400 block mt-0.5">mg/dL (fasting)</span>
            </div>

            <div className="bg-clinical-50/60 border border-clinical-200 rounded p-3">
              <span className="text-[10px] uppercase font-semibold text-clinical-500 block">Blood Pressure</span>
              <span className="text-lg font-bold text-clinical-900 font-mono">
                {patient.systolicBP && patient.diastolicBP ? `${patient.systolicBP}/${patient.diastolicBP}` : '—'}
              </span>
              <span className="text-[10px] text-clinical-400 block mt-0.5">mmHg (Sys/Dia)</span>
            </div>

            <div className="bg-clinical-50/60 border border-clinical-200 rounded p-3">
              <span className="text-[10px] uppercase font-semibold text-clinical-500 block">BMI</span>
              <span className="text-lg font-bold text-clinical-900 font-mono">
                {patient.bmi || '—'}
              </span>
              <span className="text-[10px] text-clinical-400 block mt-0.5">kg/m²</span>
            </div>

            <div className="bg-clinical-50/60 border border-clinical-200 rounded p-3">
              <span className="text-[10px] uppercase font-semibold text-clinical-500 block">Total Cholesterol</span>
              <span className="text-lg font-bold text-clinical-900 font-mono">
                {patient.totalCholesterol ? `${patient.totalCholesterol}` : '—'}
              </span>
              <span className="text-[10px] text-clinical-400 block mt-0.5">mg/dL</span>
            </div>

            <div className="bg-clinical-50/60 border border-clinical-200 rounded p-3">
              <span className="text-[10px] uppercase font-semibold text-clinical-500 block">LDL</span>
              <span className="text-lg font-bold text-clinical-900 font-mono">
                {patient.ldl ? `${patient.ldl}` : '—'}
              </span>
              <span className="text-[10px] text-clinical-400 block mt-0.5">mg/dL</span>
            </div>

            <div className="bg-clinical-50/60 border border-clinical-200 rounded p-3">
              <span className="text-[10px] uppercase font-semibold text-clinical-500 block">HDL</span>
              <span className="text-lg font-bold text-clinical-900 font-mono">
                {patient.hdl ? `${patient.hdl}` : '—'}
              </span>
              <span className="text-[10px] text-clinical-400 block mt-0.5">mg/dL</span>
            </div>

            <div className="bg-clinical-50/60 border border-clinical-200 rounded p-3">
              <span className="text-[10px] uppercase font-semibold text-clinical-500 block">Triglycerides</span>
              <span className="text-lg font-bold text-clinical-900 font-mono">
                {patient.triglycerides ? `${patient.triglycerides}` : '—'}
              </span>
              <span className="text-[10px] text-clinical-400 block mt-0.5">mg/dL</span>
            </div>
          </div>
        </div>
      </div>

      {/* Longitudinal Analysis History */}
      <div className="bg-white border border-clinical-200 rounded-lg p-5 shadow-xs space-y-4">
        <div className="border-b border-clinical-100 pb-2.5 flex items-center justify-between">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-clinical-950">
              Retinal Screening History Timeline
            </h2>
            <p className="text-xs text-clinical-500">
              Longitudinal AI-assisted screening records for {patient.id}.
            </p>
          </div>
          <span className="text-xs text-clinical-500 font-mono">
            {analyses.length} Total Encounters
          </span>
        </div>

        {analyses.length > 0 ? (
          <div className="space-y-3">
            {analyses.map((item) => (
              <div
                key={item.id}
                className="border border-clinical-200 rounded-lg p-4 hover:border-brand-300 hover:bg-clinical-50/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  {/* Fundus Thumbnail */}
                  <div className="w-14 h-14 rounded bg-black border border-clinical-200 overflow-hidden shrink-0">
                    <img src={item.retinalImageUrl} alt="Fundus Thumbnail" className="w-full h-full object-contain" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-clinical-900">
                        {item.id}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs text-clinical-500">
                        {formatDate(item.createdAt)}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs text-clinical-600 font-medium">
                        {item.eye}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge stage={item.drStage} size="sm" />
                      <span className="text-xs font-semibold text-clinical-900 font-mono">
                        {item.confidence}% confidence
                      </span>
                      <QualityBadge quality={item.imageQuality} />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-clinical-100">
                  <span className={`px-2 py-0.5 rounded text-[11px] font-medium border ${
                    item.status === 'Reviewed' 
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}>
                    {item.status}
                  </span>

                  <Link
                    to={`/analysis/${item.id}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-brand-50 hover:bg-brand-100 text-brand-900 rounded text-xs font-medium transition-colors"
                  >
                    <span>View Screening</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-xs text-clinical-400">
            No previous screenings logged for this patient.
          </div>
        )}
      </div>
    </div>
  );
};
