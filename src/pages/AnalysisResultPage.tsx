import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Printer, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Calendar, 
  ChevronRight,
  UserCheck
} from 'lucide-react';
import { api } from '../services/api';
import { Analysis, Patient } from '../types';
import { StatusBadge } from '../components/common/StatusBadge';
import { QualityBadge } from '../components/common/QualityBadge';
import { RetinalViewer } from '../components/common/RetinalViewer';
import { PrintableReport } from '../components/common/PrintableReport';
import { DisclaimerNotice } from '../components/common/DisclaimerNotice';
import { formatDate, formatDateTime } from '../utils/formatters';

export const AnalysisResultPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [patientPastAnalyses, setPatientPastAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSigningOff, setIsSigningOff] = useState(false);
  const [reviewNotes, setReviewNotes] = useState('');
  const [signOffSuccess, setSignOffSuccess] = useState(false);

  useEffect(() => {
    async function loadAnalysis() {
      if (!id) return;
      setLoading(true);
      try {
        const result = await api.getAnalysis(id);
        if (result && result.analysis) {
          setAnalysis(result.analysis);
          setReviewNotes(result.analysis.reviewerNotes || '');

          // Load patient details & longitudinal history
          const patientData = await api.getPatient(result.analysis.patientId);
          if (patientData) {
            setPatient(patientData.patient);
            setPatientPastAnalyses(patientData.analyses.filter((a) => a.id !== id));
          }
        }
      } catch (err) {
        console.error('Failed to load analysis record', err);
      } finally {
        setLoading(false);
      }
    }
    loadAnalysis();
  }, [id]);

  const handleSignOff = async () => {
    if (!analysis) return;
    setIsSigningOff(true);
    try {
      const updated = await api.updateAnalysisStatus(
        analysis.id,
        'Reviewed',
        reviewNotes,
        'Dr. Ananya Krishnan, MD'
      );
      setAnalysis(updated);
      setSignOffSuccess(true);
      setTimeout(() => setSignOffSuccess(false), 3000);
    } catch (err) {
      console.error('Sign-off error', err);
    } finally {
      setIsSigningOff(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-xs text-clinical-500">
        <span className="w-5 h-5 border-2 border-brand-700 border-t-transparent rounded-full animate-spin mr-2" />
        Loading analysis record {id}...
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="bg-white border border-clinical-200 rounded-lg p-8 text-center space-y-4 max-w-md mx-auto my-12">
        <AlertTriangle className="w-8 h-8 text-amber-600 mx-auto" />
        <h2 className="text-base font-bold text-clinical-950">Analysis Record Not Found</h2>
        <p className="text-xs text-clinical-500">
          The requested screening analysis reference <code className="text-clinical-800 font-mono">{id}</code> does not exist or has been removed.
        </p>
        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="px-4 py-2 bg-brand-700 text-white text-xs font-medium rounded hover:bg-brand-800"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hidden printable report view for browser printing */}
      <PrintableReport analysis={analysis} patient={patient || undefined} />

      {/* Top Header & Breadcrumbs (Screen Only) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-clinical-200 no-print">
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
              <span className="text-xs font-mono font-bold text-clinical-500 uppercase tracking-wide">
                Analysis Reference: {analysis.id}
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-clinical-600">
                {formatDateTime(analysis.createdAt)}
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-clinical-950 tracking-tight flex items-center gap-2">
              <span>Patient:</span>
              <Link 
                to={`/patients/${analysis.patientId}`} 
                className="text-brand-700 hover:text-brand-800 underline underline-offset-2"
              >
                {analysis.patientId} {patient?.name ? `(${patient.name})` : ''}
              </Link>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-clinical-300 text-clinical-700 hover:bg-clinical-50 text-xs font-medium rounded-md shadow-xs transition-colors"
            title="Print Clinical Summary Report"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>

          <Link
            to="/new-analysis"
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-brand-700 hover:bg-brand-800 text-white text-xs font-medium rounded-md shadow-xs transition-colors"
          >
            <span>New Scan</span>
          </Link>
        </div>
      </div>

      {/* CORE CLINICAL RESULT BANNER */}
      <div className="bg-white border border-clinical-200 rounded-lg p-5 shadow-xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 no-print">
        {/* Item 1: DR Stage */}
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-clinical-500">
            AI Screening Result
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl font-bold text-clinical-950">
              {analysis.drStage}
            </span>
          </div>
          <p className="text-[11px] text-clinical-500">
            Decision support classification
          </p>
        </div>

        {/* Item 2: Model Confidence */}
        <div className="space-y-1 sm:border-l sm:border-clinical-100 sm:pl-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-clinical-500">
            Model Confidence
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-xl sm:text-2xl font-bold text-clinical-900 font-mono">
              {analysis.confidence}%
            </span>
          </div>
          <p className="text-[11px] text-clinical-500">
            Calibrated neural probability
          </p>
        </div>

        {/* Item 3: Image Quality */}
        <div className="space-y-1 lg:border-l lg:border-clinical-100 lg:pl-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-clinical-500">
            Image Quality
          </span>
          <div className="pt-0.5">
            <QualityBadge quality={analysis.imageQuality} showDetails={true} />
          </div>
          <p className="text-[11px] text-clinical-500">
            Quality score: {analysis.imageQuality.score}/100
          </p>
        </div>

        {/* Item 4: Review Status */}
        <div className="space-y-1 lg:border-l lg:border-clinical-100 lg:pl-4 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-clinical-500">
              Clinical Review Status
            </span>
            <div className="pt-0.5">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-semibold uppercase tracking-wider border ${
                analysis.status === 'Reviewed' 
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
                  : 'bg-amber-50 text-amber-800 border-amber-300'
              }`}>
                {analysis.status === 'Reviewed' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                {analysis.status}
              </span>
            </div>
          </div>
          {analysis.reviewedBy && (
            <p className="text-[11px] text-clinical-500">
              By {analysis.reviewedBy}
            </p>
          )}
        </div>
      </div>

      {/* RETINAL VIEWER SECTION */}
      <div className="space-y-2 no-print">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
          <div>
            <h2 className="text-sm font-bold text-clinical-950 uppercase tracking-wider">
              AI Explainability & Retinal Fundus Inspection
            </h2>
            <p className="text-xs text-clinical-500">
              Highlighted regions indicate areas that influenced the model's prediction.
            </p>
          </div>
          <span className="text-[11px] text-clinical-500 font-mono">
            {analysis.eye} • Single-field 45°
          </span>
        </div>

        <RetinalViewer
          fundusImageUrl={analysis.retinalImageUrl}
          xaiHeatmapUrl={analysis.xaiImageUrl}
          stage={analysis.drStage}
          eye={analysis.eye}
          confidence={analysis.confidence}
        />
      </div>

      {/* DETECTED FINDINGS + CLINICAL CONTEXT TWO-COLUMN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 no-print">
        {/* Left 2 Cols: Detected Retinal Findings */}
        <div className="lg:col-span-2 bg-white border border-clinical-200 rounded-lg p-5 shadow-xs space-y-4">
          <div className="border-b border-clinical-100 pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-clinical-950">
                Detected Retinal Findings
              </h2>
              <p className="text-xs text-clinical-500">
                AI lesion detector assessment for {analysis.eye}.
              </p>
            </div>
            <span className="text-[10px] text-clinical-500 font-medium px-2 py-0.5 rounded bg-clinical-100">
              {analysis.findings.filter((f) => f.detected).length} Detected
            </span>
          </div>

          <div className="divide-y divide-clinical-100">
            {analysis.findings.map((finding, idx) => (
              <div key={idx} className="py-2.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs">
                <div className="space-y-0.5">
                  <span className="font-semibold text-clinical-900 text-sm">
                    {finding.name}
                  </span>
                  {finding.description && (
                    <p className="text-clinical-500 text-[11px]">
                      {finding.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {finding.count && (
                    <span className="text-clinical-500 font-mono text-[11px]">
                      {finding.count}
                    </span>
                  )}
                  <span
                    className={`px-2.5 py-0.5 rounded text-xs font-medium border ${
                      finding.detected
                        ? 'bg-amber-50 text-amber-900 border-amber-200'
                        : 'bg-clinical-50 text-clinical-600 border-clinical-200'
                    }`}
                  >
                    {finding.detected ? 'Detected' : 'Not detected'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-clinical-100 text-[11px] text-clinical-400">
            Findings derived from localized feature map activations. Correlate with stereoscopic slit-lamp biomicroscopy or optical coherence tomography (OCT).
          </div>
        </div>

        {/* Right 1 Col: Clinical Context Variables */}
        <div className="bg-white border border-clinical-200 rounded-lg p-5 shadow-xs space-y-4">
          <div className="border-b border-clinical-100 pb-3">
            <h2 className="text-sm font-bold text-clinical-950">
              Clinical Context
            </h2>
            <p className="text-xs text-clinical-500">
              Patient parameters at screening time.
            </p>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between py-1 border-b border-clinical-50">
              <span className="text-clinical-500">Age:</span>
              <span className="font-semibold text-clinical-900">{analysis.clinicalSnapshot.age} years</span>
            </div>
            <div className="flex justify-between py-1 border-b border-clinical-50">
              <span className="text-clinical-500">Diabetes:</span>
              <span className="font-semibold text-clinical-900">{analysis.clinicalSnapshot.diabetesType}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-clinical-50">
              <span className="text-clinical-500">Duration:</span>
              <span className="font-semibold text-clinical-900">{analysis.clinicalSnapshot.diabetesDuration} years</span>
            </div>
            <div className="flex justify-between py-1 border-b border-clinical-50">
              <span className="text-clinical-500">HbA1c:</span>
              <span className="font-semibold text-clinical-900 font-mono">
                {analysis.clinicalSnapshot.hba1c ? `${analysis.clinicalSnapshot.hba1c}%` : '—'}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-clinical-50">
              <span className="text-clinical-500">Blood Glucose:</span>
              <span className="font-semibold text-clinical-900 font-mono">
                {analysis.clinicalSnapshot.glucose ? `${analysis.clinicalSnapshot.glucose} mg/dL` : '—'}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-clinical-50">
              <span className="text-clinical-500">Blood Pressure:</span>
              <span className="font-semibold text-clinical-900 font-mono">
                {analysis.clinicalSnapshot.systolicBP && analysis.clinicalSnapshot.diastolicBP
                  ? `${analysis.clinicalSnapshot.systolicBP}/${analysis.clinicalSnapshot.diastolicBP} mmHg`
                  : '—'}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-clinical-50">
              <span className="text-clinical-500">LDL Cholesterol:</span>
              <span className="font-semibold text-clinical-900 font-mono">
                {analysis.clinicalSnapshot.ldl ? `${analysis.clinicalSnapshot.ldl} mg/dL` : '—'}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-clinical-50">
              <span className="text-clinical-500">HDL Cholesterol:</span>
              <span className="font-semibold text-clinical-900 font-mono">
                {analysis.clinicalSnapshot.hdl ? `${analysis.clinicalSnapshot.hdl} mg/dL` : '—'}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-clinical-50">
              <span className="text-clinical-500">Triglycerides:</span>
              <span className="font-semibold text-clinical-900 font-mono">
                {analysis.clinicalSnapshot.triglycerides ? `${analysis.clinicalSnapshot.triglycerides} mg/dL` : '—'}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-clinical-500">BMI:</span>
              <span className="font-semibold text-clinical-900 font-mono">
                {analysis.clinicalSnapshot.bmi || '—'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* LONGITUDINAL PATIENT HISTORY WIDGET */}
      {patientPastAnalyses.length > 0 && (
        <div className="bg-white border border-clinical-200 rounded-lg p-5 shadow-xs space-y-3 no-print">
          <div className="flex items-center justify-between border-b border-clinical-100 pb-2">
            <div>
              <h2 className="text-sm font-bold text-clinical-950">
                Previous Screening Encounters for {analysis.patientId}
              </h2>
              <p className="text-xs text-clinical-500">
                Longitudinal progression of retinal screening results.
              </p>
            </div>
            <Link
              to={`/patients/${analysis.patientId}`}
              className="text-xs text-brand-700 hover:text-brand-800 font-medium inline-flex items-center gap-1"
            >
              <span>Full Patient Profile</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
            {patientPastAnalyses.map((past) => (
              <Link
                key={past.id}
                to={`/analysis/${past.id}`}
                className="p-3 border border-clinical-200 rounded-md hover:border-brand-300 hover:bg-clinical-50/50 transition-colors flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="w-3.5 h-3.5 text-clinical-400" />
                    <span className="text-xs font-semibold text-clinical-900">
                      {formatDate(past.createdAt)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge stage={past.drStage} size="sm" />
                    <span className="text-[11px] text-clinical-500">
                      {past.confidence}% conf.
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-clinical-400" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* CLINICIAN DISPOSITION & SIGN-OFF FORM */}
      <div className="bg-white border border-clinical-200 rounded-lg p-5 shadow-xs space-y-4 no-print">
        <div className="border-b border-clinical-100 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-brand-700" />
            <h2 className="text-sm font-bold text-clinical-950">
              Clinician Review & Verification Sign-Off
            </h2>
          </div>
          {signOffSuccess && (
            <span className="text-xs font-medium text-emerald-700 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Sign-off recorded successfully
            </span>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-clinical-700 uppercase tracking-wider mb-1.5">
            Clinician Notes / Referral Recommendation
          </label>
          <textarea
            rows={3}
            value={reviewNotes}
            onChange={(e) => setReviewNotes(e.target.value)}
            placeholder="Document screening concurrence, referral urgency, or additional clinical notes..."
            className="w-full text-xs sm:text-sm border border-clinical-300 rounded-md p-3 text-clinical-900 placeholder-clinical-400 focus:outline-none focus:ring-1 focus:ring-brand-700"
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
          <div className="text-[11px] text-clinical-500">
            Sign-off by <strong>Dr. Ananya Krishnan, MD</strong> updates status to <code>REVIEWED</code> in the clinical registry.
          </div>
          <button
            type="button"
            disabled={isSigningOff}
            onClick={handleSignOff}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-brand-700 hover:bg-brand-800 disabled:opacity-50 text-white rounded text-xs font-semibold transition-colors shadow-xs"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{analysis.status === 'Reviewed' ? 'Update Sign-off' : 'Confirm & Sign-off'}</span>
          </button>
        </div>
      </div>

      {/* Mandatory Clinical Disclaimer */}
      <DisclaimerNotice variant="inline" className="no-print" />
    </div>
  );
};
