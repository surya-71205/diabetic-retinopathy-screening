import React, { useState } from 'react';
import { 
  Cpu, 
  ShieldCheck, 
  RotateCcw, 
  Check, 
  Sliders 
} from 'lucide-react';
import { api } from '../services/api';

export const SettingsPage: React.FC = () => {
  const [glucoseUnit, setGlucoseUnit] = useState<'mg/dL' | 'mmol/L'>('mg/dL');
  const [hba1cUnit, setHba1cUnit] = useState<'%' | 'mmol/mol'>('%');
  const [autoTriageFlag, setAutoTriageFlag] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleResetData = () => {
    if (confirm('Are you sure you want to reset demo patients and analyses to baseline state?')) {
      api.resetToDefaults();
      alert('Clinical demo storage reset to default dataset. Reloading...');
      window.location.reload();
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div className="pb-2 border-b border-clinical-200">
        <h1 className="text-xl sm:text-2xl font-bold text-clinical-950 tracking-tight">
          Clinical Application Settings
        </h1>
        <p className="text-xs sm:text-sm text-clinical-500 mt-0.5">
          Configure clinical display preferences, inspect AI model architecture, and manage screening session data.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-md text-xs text-emerald-800 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Clinical settings preferences saved successfully.</span>
        </div>
      )}

      {/* Clinical Units & Preferences */}
      <div className="bg-white border border-clinical-200 rounded-lg p-5 shadow-xs space-y-4">
        <div className="border-b border-clinical-100 pb-3 flex items-center gap-2">
          <Sliders className="w-4 h-4 text-brand-700" />
          <h2 className="text-sm font-bold text-clinical-950">
            Clinical Units & Measurement Standards
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-clinical-700 uppercase tracking-wider mb-1.5">
              Blood Glucose Standard
            </label>
            <select
              value={glucoseUnit}
              onChange={(e) => setGlucoseUnit(e.target.value as 'mg/dL' | 'mmol/L')}
              className="w-full text-xs border border-clinical-300 rounded px-3 py-2 bg-white text-clinical-800 focus:outline-none focus:ring-1 focus:ring-brand-700"
            >
              <option value="mg/dL">mg/dL (US Standard)</option>
              <option value="mmol/L">mmol/L (International / SI)</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-clinical-700 uppercase tracking-wider mb-1.5">
              HbA1c Reporting Unit
            </label>
            <select
              value={hba1cUnit}
              onChange={(e) => setHba1cUnit(e.target.value as '%' | 'mmol/mol')}
              className="w-full text-xs border border-clinical-300 rounded px-3 py-2 bg-white text-clinical-800 focus:outline-none focus:ring-1 focus:ring-brand-700"
            >
              <option value="%">% (NGSP Standard)</option>
              <option value="mmol/mol">mmol/mol (IFCC Standard)</option>
            </select>
          </div>
        </div>

        <div className="pt-2">
          <label className="flex items-center gap-2 text-xs text-clinical-700 cursor-pointer">
            <input
              type="checkbox"
              checked={autoTriageFlag}
              onChange={(e) => setAutoTriageFlag(e.target.checked)}
              className="rounded border-clinical-300 text-brand-700 focus:ring-brand-700"
            />
            <span>Automatically flag Severe NPDR and PDR cases as <strong>High-Priority Review</strong></span>
          </label>
        </div>

        <div className="pt-2 border-t border-clinical-100 flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 bg-brand-700 hover:bg-brand-800 text-white rounded text-xs font-semibold shadow-xs"
          >
            Save Preferences
          </button>
        </div>
      </div>

      {/* AI Model Specification & Lineage */}
      <div className="bg-white border border-clinical-200 rounded-lg p-5 shadow-xs space-y-4">
        <div className="border-b border-clinical-100 pb-3 flex items-center gap-2">
          <Cpu className="w-4 h-4 text-brand-700" />
          <h2 className="text-sm font-bold text-clinical-950">
            AI Screening Model Specifications
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-clinical-700">
          <div className="space-y-1">
            <span className="text-clinical-400 font-semibold uppercase text-[10px]">Model Release</span>
            <p className="font-mono font-medium text-clinical-900">DR-Net v2.4.1 (Clinical Edition)</p>
          </div>
          <div className="space-y-1">
            <span className="text-clinical-400 font-semibold uppercase text-[10px]">Backbone Architecture</span>
            <p className="font-mono font-medium text-clinical-900">ResNet50 with BiFPN Feature Pyramid</p>
          </div>
          <div className="space-y-1">
            <span className="text-clinical-400 font-semibold uppercase text-[10px]">Explainability Engine</span>
            <p className="font-mono font-medium text-clinical-900">Grad-CAM++ (Gradient Class Activation Mapping)</p>
          </div>
          <div className="space-y-1">
            <span className="text-clinical-400 font-semibold uppercase text-[10px]">Clinical Training Benchmark</span>
            <p className="font-mono font-medium text-clinical-900">EyePACS, Messidor-2, APTOS 2019</p>
          </div>
        </div>

        <p className="text-[11px] text-clinical-500 bg-clinical-50 p-3 rounded border border-clinical-200 leading-relaxed">
          DR-Net is optimized for single-field fundus photography to grade Diabetic Retinopathy according to the International Clinical Diabetic Retinopathy (ICDR) severity scale. Intended strictly as clinical decision support.
        </p>
      </div>

      {/* Privacy & Governance Notice */}
      <div className="bg-white border border-clinical-200 rounded-lg p-5 shadow-xs space-y-3">
        <div className="border-b border-clinical-100 pb-2 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <h2 className="text-sm font-bold text-clinical-950">
            Data Privacy & Patient Confidentiality
          </h2>
        </div>
        <p className="text-xs text-clinical-600 leading-relaxed">
          This system operates under clinical de-identification principles. All retinal imagery and patient context attributes are encrypted in transit and stored locally during the single-screener MVP lifecycle.
        </p>
      </div>

      {/* Demo Maintenance / Reset */}
      <div className="bg-white border border-clinical-200 rounded-lg p-5 shadow-xs space-y-3">
        <div className="border-b border-clinical-100 pb-2 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-clinical-950">
              Reset Demo Dataset
            </h2>
            <p className="text-xs text-clinical-500">
              Restore initial clinical demo patients and pre-configured analyses.
            </p>
          </div>
          <button
            type="button"
            onClick={handleResetData}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
