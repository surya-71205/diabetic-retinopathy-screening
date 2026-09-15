import React from 'react';
import { Analysis, Patient } from '../../types';
import { formatDate, formatDateTime } from '../../utils/formatters';

interface PrintableReportProps {
  analysis: Analysis;
  patient?: Patient;
}

export const PrintableReport: React.FC<PrintableReportProps> = ({ analysis, patient }) => {
  return (
    <div className="hidden print:block p-8 bg-white text-black font-sans max-w-4xl mx-auto leading-normal">
      {/* Clinic Header */}
      <div className="border-b-2 border-slate-900 pb-4 mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-wider text-slate-900">
            Metropolitan Eye & Endocrinology Care
          </h1>
          <p className="text-xs text-slate-600">
            Diabetic Retinopathy Tele-Screening & Clinical Decision Support Service
          </p>
        </div>
        <div className="text-right text-xs text-slate-600">
          <p className="font-semibold text-slate-900">DR-SCAN Report</p>
          <p>Analysis Ref: {analysis.id}</p>
          <p>Generated: {formatDateTime(analysis.createdAt)}</p>
        </div>
      </div>

      {/* Patient & Exam Identification */}
      <div className="grid grid-cols-2 gap-4 border border-slate-300 p-3 rounded mb-6 text-xs">
        <div>
          <h2 className="font-bold text-slate-900 uppercase text-[11px] mb-2 border-b border-slate-200 pb-1">
            Patient Demographics
          </h2>
          <div className="grid grid-cols-2 gap-y-1">
            <span className="text-slate-500">Patient ID:</span>
            <span className="font-semibold text-slate-900">{analysis.patientId}</span>

            <span className="text-slate-500">Name:</span>
            <span className="text-slate-900">{patient?.name || 'De-identified Subject'}</span>

            <span className="text-slate-500">Age / Biological Sex:</span>
            <span className="text-slate-900">{analysis.clinicalSnapshot.age} yrs / {analysis.clinicalSnapshot.sex}</span>

            <span className="text-slate-500">Diabetes Classification:</span>
            <span className="text-slate-900">{analysis.clinicalSnapshot.diabetesType} ({analysis.clinicalSnapshot.diabetesDuration} yrs duration)</span>
          </div>
        </div>

        <div>
          <h2 className="font-bold text-slate-900 uppercase text-[11px] mb-2 border-b border-slate-200 pb-1">
            Screening Examination
          </h2>
          <div className="grid grid-cols-2 gap-y-1">
            <span className="text-slate-500">Examined Laterality:</span>
            <span className="font-semibold text-slate-900">{analysis.eye}</span>

            <span className="text-slate-500">Image Quality Rating:</span>
            <span className="font-medium text-slate-900">{analysis.imageQuality.overallRating} (Score: {analysis.imageQuality.score}/100)</span>

            <span className="text-slate-500">Algorithm Version:</span>
            <span className="text-slate-700">{analysis.modelVersion || 'DR-Net v2.4.1'}</span>

            <span className="text-slate-500">Review Status:</span>
            <span className="font-semibold text-slate-900 uppercase">{analysis.status}</span>
          </div>
        </div>
      </div>

      {/* Primary AI Screening Result Banner */}
      <div className="border-2 border-slate-800 bg-slate-50 p-4 rounded mb-6 flex justify-between items-center">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block">
            AI Screening Result (Decision Support)
          </span>
          <span className="text-2xl font-black text-slate-950">
            {analysis.drStage}
          </span>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block">
            Model Confidence
          </span>
          <span className="text-2xl font-black text-slate-900">
            {analysis.confidence}%
          </span>
        </div>
      </div>

      {/* Retinal Images: Fundus and Heatmap Side-by-Side */}
      <div className="mb-6">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2 border-b border-slate-200 pb-1">
          Retinal Fundus Photography & Explainability (XAI Saliency)
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="border border-slate-300 p-2 rounded text-center">
            <p className="text-[11px] font-medium text-slate-700 mb-1">Fundus Image ({analysis.eye})</p>
            <div className="w-56 h-56 mx-auto bg-black rounded overflow-hidden">
              <img src={analysis.retinalImageUrl} alt="Fundus" className="w-full h-full object-contain" />
            </div>
          </div>
          <div className="border border-slate-300 p-2 rounded text-center">
            <p className="text-[11px] font-medium text-slate-700 mb-1">Regions Influencing Prediction (Grad-CAM)</p>
            <div className="w-56 h-56 mx-auto bg-black rounded overflow-hidden">
              <img src={analysis.xaiImageUrl} alt="Heatmap" className="w-full h-full object-contain" />
            </div>
          </div>
        </div>
      </div>

      {/* Detected Retinal Findings */}
      <div className="mb-6">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2 border-b border-slate-200 pb-1">
          Detected Retinal Findings
        </h3>
        <table className="w-full text-left text-xs border border-slate-200">
          <thead className="bg-slate-100 text-slate-700 font-semibold">
            <tr>
              <th className="p-2 border-b">Feature</th>
              <th className="p-2 border-b">Detection</th>
              <th className="p-2 border-b">Count / Severity</th>
              <th className="p-2 border-b">Clinical Notes</th>
            </tr>
          </thead>
          <tbody>
            {analysis.findings.map((f, i) => (
              <tr key={i} className="border-b border-slate-100">
                <td className="p-2 font-medium">{f.name}</td>
                <td className="p-2">
                  <span className={`font-semibold ${f.detected ? 'text-rose-700' : 'text-slate-600'}`}>
                    {f.detected ? 'Detected' : 'Not detected'}
                  </span>
                </td>
                <td className="p-2 text-slate-700">{f.count || (f.detected ? f.severity : '—')}</td>
                <td className="p-2 text-slate-600 text-[11px]">{f.description || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Clinical Context Snapshot */}
      <div className="mb-6">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2 border-b border-slate-200 pb-1">
          Clinical Context Parameters
        </h3>
        <div className="grid grid-cols-4 gap-2 text-xs">
          <div className="border border-slate-200 p-2 rounded">
            <span className="text-slate-500 block text-[10px]">HbA1c</span>
            <span className="font-semibold text-slate-900">{analysis.clinicalSnapshot.hba1c ? `${analysis.clinicalSnapshot.hba1c}%` : 'Not recorded'}</span>
          </div>
          <div className="border border-slate-200 p-2 rounded">
            <span className="text-slate-500 block text-[10px]">Blood Glucose</span>
            <span className="font-semibold text-slate-900">{analysis.clinicalSnapshot.glucose ? `${analysis.clinicalSnapshot.glucose} mg/dL` : 'Not recorded'}</span>
          </div>
          <div className="border border-slate-200 p-2 rounded">
            <span className="text-slate-500 block text-[10px]">Blood Pressure</span>
            <span className="font-semibold text-slate-900">
              {analysis.clinicalSnapshot.systolicBP && analysis.clinicalSnapshot.diastolicBP 
                ? `${analysis.clinicalSnapshot.systolicBP}/${analysis.clinicalSnapshot.diastolicBP} mmHg` 
                : 'Not recorded'}
            </span>
          </div>
          <div className="border border-slate-200 p-2 rounded">
            <span className="text-slate-500 block text-[10px]">BMI / Lipids</span>
            <span className="font-semibold text-slate-900">
              BMI: {analysis.clinicalSnapshot.bmi || '—'} | LDL: {analysis.clinicalSnapshot.ldl || '—'}
            </span>
          </div>
        </div>
      </div>

      {/* Clinician Sign-off & Notes */}
      <div className="border border-slate-300 p-3 rounded mb-8 text-xs">
        <div className="mb-4">
          <span className="font-bold text-slate-900 uppercase text-[11px] block mb-1">Clinician Review & Disposition:</span>
          <p className="text-slate-800 italic bg-slate-50 p-2 rounded border border-slate-200">
            "{analysis.reviewerNotes || 'Reviewed and concurred with AI screening triage priority.'}"
          </p>
        </div>
        <div className="grid grid-cols-2 gap-8 pt-4 border-t border-slate-200 text-xs">
          <div>
            <p className="text-slate-500">Reviewed By:</p>
            <p className="font-bold text-slate-900">{analysis.reviewedBy || 'Dr. Ananya Krishnan, MD'}</p>
            <p className="text-slate-500 text-[10px]">Medical Retina Fellow / Screener</p>
          </div>
          <div className="text-right">
            <p className="text-slate-500">Signature / Verification:</p>
            <div className="h-8 border-b border-dashed border-slate-400 w-48 ml-auto my-1" />
            <p className="text-slate-500 text-[10px]">Date: {formatDate(analysis.reviewedAt || analysis.createdAt)}</p>
          </div>
        </div>
      </div>

      {/* Disclaimer Footer */}
      <div className="text-[10px] text-slate-500 border-t border-slate-200 pt-2 leading-tight">
        <strong>CLINICAL NOTICE:</strong> AI-assisted screening tool. Results should be reviewed by a qualified healthcare professional. This software is calibrated for screening decision support and does not provide an autonomous definitive diagnosis.
      </div>
    </div>
  );
};
