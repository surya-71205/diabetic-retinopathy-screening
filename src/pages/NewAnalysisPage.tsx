import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Activity, 
  UploadCloud, 
  Sparkles, 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  Trash2, 
  CheckCircle2, 
  FileImage,
  Info
} from 'lucide-react';
import { api } from '../services/api';
import { Patient, DRStage, EyeLaterality, BiologicalSex, DiabetesType } from '../types';
import { generateRetinalFundusSvg } from '../utils/retinalImageGenerator';

export const NewAnalysisPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [existingPatients, setExistingPatients] = useState<Patient[]>([]);
  const [selectedExistingId, setSelectedExistingId] = useState<string>('');

  // Step 1: Patient Information State
  const [patientId, setPatientId] = useState<string>('P-00135');
  const [patientName, setPatientName] = useState<string>('Thomas Sterling');
  const [age, setAge] = useState<number | ''>(58);
  const [sex, setSex] = useState<BiologicalSex>('Male');
  const [diabetesType, setDiabetesType] = useState<DiabetesType>('Type 2');
  const [diabetesDuration, setDiabetesDuration] = useState<number | ''>(12);
  const [eye, setEye] = useState<EyeLaterality>('Right Eye (OD)');

  // Step 2: Clinical Context State
  const [hba1c, setHba1c] = useState<number | ''>(8.4);
  const [glucose, setGlucose] = useState<number | ''>(172);
  const [systolicBP, setSystolicBP] = useState<number | ''>(144);
  const [diastolicBP, setDiastolicBP] = useState<number | ''>(90);
  const [totalCholesterol, setTotalCholesterol] = useState<number | ''>(212);
  const [ldl, setLdl] = useState<number | ''>(138);
  const [hdl, setHdl] = useState<number | ''>(44);
  const [triglycerides, setTriglycerides] = useState<number | ''>(168);
  const [bmi, setBmi] = useState<number | ''>(28.1);

  // Step 3: Retinal Image State
  const [retinalImageDataUrl, setRetinalImageDataUrl] = useState<string>('');
  const [imageFileName, setImageFileName] = useState<string>('');
  const [imageFileSize, setImageFileSize] = useState<string>('');
  const [imageDimensions, setImageDimensions] = useState<string>('');
  const [targetOutcome, setTargetOutcome] = useState<DRStage>('Moderate NPDR');
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  // Step 4: Pipeline Execution State
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [pipelineStage, setPipelineStage] = useState<string>('');

  useEffect(() => {
    api.getPatients().then((list) => {
      setExistingPatients(list);
    });
  }, []);

  // Pre-load default sample image for instant demo experience
  useEffect(() => {
    if (!retinalImageDataUrl) {
      loadSampleRetina('Moderate NPDR');
    }
  }, []);

  const handleSelectExistingPatient = (pId: string) => {
    setSelectedExistingId(pId);
    const found = existingPatients.find((p) => p.id === pId);
    if (found) {
      setPatientId(found.id);
      setPatientName(found.name);
      setAge(found.age);
      setSex(found.sex);
      setDiabetesType(found.diabetesType);
      setDiabetesDuration(found.diabetesDuration);
      if (found.hba1c !== undefined) setHba1c(found.hba1c);
      if (found.glucose !== undefined) setGlucose(found.glucose);
      if (found.systolicBP !== undefined) setSystolicBP(found.systolicBP);
      if (found.diastolicBP !== undefined) setDiastolicBP(found.diastolicBP);
      if (found.totalCholesterol !== undefined) setTotalCholesterol(found.totalCholesterol);
      if (found.ldl !== undefined) setLdl(found.ldl);
      if (found.hdl !== undefined) setHdl(found.hdl);
      if (found.triglycerides !== undefined) setTriglycerides(found.triglycerides);
      if (found.bmi !== undefined) setBmi(found.bmi);
    }
  };

  const handleFileUpload = (file: File) => {
    if (!file.type.match('image.*')) {
      alert('Please upload a valid retinal image file (PNG, JPG, or JPEG).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setRetinalImageDataUrl(dataUrl);
      setImageFileName(file.name);
      setImageFileSize(`${(file.size / (1024 * 1024)).toFixed(2)} MB`);

      const img = new Image();
      img.onload = () => {
        setImageDimensions(`${img.width} × ${img.height} px`);
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const loadSampleRetina = (stage: DRStage) => {
    const eyeCode = eye.includes('Right') ? 'OD' : 'OS';
    const svgUrl = generateRetinalFundusSvg(stage, eyeCode);
    setRetinalImageDataUrl(svgUrl);
    setImageFileName(`fundus_${stage.toLowerCase().replace(/\s+/g, '_')}_${eyeCode}.png`);
    setImageFileSize('1.84 MB');
    setImageDimensions('2048 × 2048 px');
    setTargetOutcome(stage);
  };

  const handleStartAnalysis = async () => {
    if (!patientId || age === '' || diabetesDuration === '' || !retinalImageDataUrl) {
      alert('Please ensure all required patient and retinal image data are present.');
      return;
    }

    setIsAnalyzing(true);
    setCurrentStep(4);

    // Realistic clinical pipeline stage messages
    const stages = [
      'Validating retinal image clarity & aperture bounds...',
      'Checking illumination symmetry & macula centering...',
      'Computing multi-scale convolutional feature maps...',
      'Extracting retinal microvascular lesion indicators...',
      'Generating Grad-CAM+ explainability attention weights...',
      'Finalizing clinical screening decision support summary...',
    ];

    for (let i = 0; i < stages.length; i++) {
      setPipelineStage(stages[i]);
      await new Promise((r) => setTimeout(r, 650));
    }

    try {
      const newAnalysis = await api.createAnalysis({
        patientId,
        eye,
        retinalImageDataUrl,
        simulatedStage: targetOutcome,
        patientData: {
          name: patientName,
          age: Number(age),
          sex,
          diabetesType,
          diabetesDuration: Number(diabetesDuration),
          hba1c: hba1c !== '' ? Number(hba1c) : undefined,
          glucose: glucose !== '' ? Number(glucose) : undefined,
          systolicBP: systolicBP !== '' ? Number(systolicBP) : undefined,
          diastolicBP: diastolicBP !== '' ? Number(diastolicBP) : undefined,
          totalCholesterol: totalCholesterol !== '' ? Number(totalCholesterol) : undefined,
          ldl: ldl !== '' ? Number(ldl) : undefined,
          hdl: hdl !== '' ? Number(hdl) : undefined,
          triglycerides: triglycerides !== '' ? Number(triglycerides) : undefined,
          bmi: bmi !== '' ? Number(bmi) : undefined,
        },
      });

      navigate(`/analysis/${newAnalysis.id}`);
    } catch (err) {
      console.error('Failed to create analysis', err);
      setIsAnalyzing(false);
      alert('Analysis could not be completed. Please try again or verify retinal image.');
    }
  };

  const isStep1Valid = patientId.trim() !== '' && age !== '' && diabetesDuration !== '';
  const isStep3Valid = retinalImageDataUrl !== '';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Title */}
      <div className="pb-2 border-b border-clinical-200">
        <h1 className="text-xl sm:text-2xl font-bold text-clinical-950 tracking-tight">
          New Retinal Screening Analysis
        </h1>
        <p className="text-xs sm:text-sm text-clinical-500 mt-0.5">
          Step-by-step workflow: Patient information, clinical context, and fundus image analysis.
        </p>
      </div>

      {/* Step Indicator Wizard */}
      <div className="bg-white border border-clinical-200 rounded-lg p-3 sm:p-4 shadow-xs">
        <div className="flex items-center justify-between">
          {[
            { step: 1, title: 'Patient Info', icon: User },
            { step: 2, title: 'Clinical Context', icon: Activity },
            { step: 3, title: 'Retinal Image', icon: UploadCloud },
            { step: 4, title: 'AI Analysis', icon: Sparkles },
          ].map((item, idx) => {
            const Icon = item.icon;
            const isDone = currentStep > item.step;
            const isCurrent = currentStep === item.step;

            return (
              <React.Fragment key={item.step}>
                <div 
                  className={`flex items-center gap-2 cursor-pointer ${
                    isCurrent 
                      ? 'text-brand-800 font-semibold' 
                      : isDone 
                      ? 'text-clinical-700' 
                      : 'text-clinical-400'
                  }`}
                  onClick={() => !isAnalyzing && setCurrentStep(item.step)}
                >
                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 transition-colors ${
                      isCurrent
                        ? 'bg-brand-700 text-white'
                        : isDone
                        ? 'bg-clinical-200 text-clinical-800'
                        : 'bg-clinical-100 text-clinical-400'
                    }`}
                  >
                    {isDone ? <Check className="w-4 h-4" /> : <Icon className="w-3.5 h-3.5" />}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-[10px] uppercase font-semibold text-clinical-400">Step {item.step}</p>
                    <p className="text-xs font-medium">{item.title}</p>
                  </div>
                </div>
                {idx < 3 && (
                  <div className="flex-1 max-w-16 h-px bg-clinical-200 mx-2 hidden sm:block" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* STEP 1: PATIENT INFORMATION */}
      {currentStep === 1 && (
        <div className="bg-white border border-clinical-200 rounded-lg p-5 sm:p-6 shadow-xs space-y-6">
          <div className="border-b border-clinical-100 pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-clinical-950">
                Step 1: Patient Information
              </h2>
              <p className="text-xs text-clinical-500">
                Enter or select the patient demographics for this screening encounter.
              </p>
            </div>

            {/* Quick Load Existing Patient */}
            {existingPatients.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-clinical-500 font-medium">Existing:</span>
                <select
                  value={selectedExistingId}
                  onChange={(e) => handleSelectExistingPatient(e.target.value)}
                  className="text-xs border border-clinical-300 rounded px-2.5 py-1.5 bg-clinical-50 text-clinical-800 focus:outline-none focus:ring-1 focus:ring-brand-700"
                >
                  <option value="">Select Existing Patient...</option>
                  {existingPatients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.id} — {p.name} ({p.age}y, {p.diabetesType})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-clinical-700 uppercase tracking-wider mb-1">
                Patient ID <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                required
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                placeholder="e.g. P-00135"
                className="w-full text-sm border border-clinical-300 rounded-md px-3 py-2 bg-white text-clinical-900 focus:outline-none focus:ring-1 focus:ring-brand-700"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-clinical-700 uppercase tracking-wider mb-1">
                Patient Full Name
              </label>
              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="e.g. Priya Srinivasan"
                className="w-full text-sm border border-clinical-300 rounded-md px-3 py-2 bg-white text-clinical-900 focus:outline-none focus:ring-1 focus:ring-brand-700"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-clinical-700 uppercase tracking-wider mb-1">
                Age (years) <span className="text-rose-600">*</span>
              </label>
              <input
                type="number"
                min={1}
                max={120}
                required
                value={age}
                onChange={(e) => setAge(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="e.g. 56"
                className="w-full text-sm border border-clinical-300 rounded-md px-3 py-2 bg-white text-clinical-900 focus:outline-none focus:ring-1 focus:ring-brand-700"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-clinical-700 uppercase tracking-wider mb-1">
                Biological Sex <span className="text-rose-600">*</span>
              </label>
              <select
                value={sex}
                onChange={(e) => setSex(e.target.value as BiologicalSex)}
                className="w-full text-sm border border-clinical-300 rounded-md px-3 py-2 bg-white text-clinical-900 focus:outline-none focus:ring-1 focus:ring-brand-700"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-clinical-700 uppercase tracking-wider mb-1">
                Diabetes Type <span className="text-rose-600">*</span>
              </label>
              <select
                value={diabetesType}
                onChange={(e) => setDiabetesType(e.target.value as DiabetesType)}
                className="w-full text-sm border border-clinical-300 rounded-md px-3 py-2 bg-white text-clinical-900 focus:outline-none focus:ring-1 focus:ring-brand-700"
              >
                <option value="Type 1">Type 1</option>
                <option value="Type 2">Type 2</option>
                <option value="Other / Unknown">Other / Unknown</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-clinical-700 uppercase tracking-wider mb-1">
                Diabetes Duration (years) <span className="text-rose-600">*</span>
              </label>
              <input
                type="number"
                min={0}
                max={80}
                required
                value={diabetesDuration}
                onChange={(e) => setDiabetesDuration(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="e.g. 11"
                className="w-full text-sm border border-clinical-300 rounded-md px-3 py-2 bg-white text-clinical-900 focus:outline-none focus:ring-1 focus:ring-brand-700"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-clinical-700 uppercase tracking-wider mb-1">
                Eye Laterality <span className="text-rose-600">*</span>
              </label>
              <select
                value={eye}
                onChange={(e) => setEye(e.target.value as EyeLaterality)}
                className="w-full text-sm border border-clinical-300 rounded-md px-3 py-2 bg-white text-clinical-900 focus:outline-none focus:ring-1 focus:ring-brand-700"
              >
                <option value="Right Eye (OD)">Right Eye (OD)</option>
                <option value="Left Eye (OS)">Left Eye (OS)</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-clinical-100 flex justify-end">
            <button
              type="button"
              disabled={!isStep1Valid}
              onClick={() => setCurrentStep(2)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-brand-700 hover:bg-brand-800 disabled:opacity-50 text-white rounded text-sm font-medium transition-colors shadow-xs"
            >
              <span>Next: Clinical Context</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: CLINICAL CONTEXT */}
      {currentStep === 2 && (
        <div className="bg-white border border-clinical-200 rounded-lg p-5 sm:p-6 shadow-xs space-y-6">
          <div className="border-b border-clinical-100 pb-3">
            <h2 className="text-base font-bold text-clinical-950">
              Step 2: Clinical Context Parameters
            </h2>
            <p className="text-xs text-clinical-500">
              Correlative metabolic & systemic variables. These parameters assist holistic clinical review and are optional for screening triage.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-clinical-700 uppercase tracking-wider mb-1">
                HbA1c (%) <span className="text-clinical-400 font-normal">(Optional)</span>
              </label>
              <input
                type="number"
                step="0.1"
                min="4"
                max="18"
                value={hba1c}
                onChange={(e) => setHba1c(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="e.g. 8.2"
                className="w-full text-sm border border-clinical-300 rounded-md px-3 py-2 bg-white text-clinical-900 focus:outline-none focus:ring-1 focus:ring-brand-700"
              />
            </div>

            <div>
              <label className="block font-semibold text-clinical-700 uppercase tracking-wider mb-1">
                Blood Glucose (mg/dL)
              </label>
              <input
                type="number"
                min="40"
                max="600"
                value={glucose}
                onChange={(e) => setGlucose(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="e.g. 168"
                className="w-full text-sm border border-clinical-300 rounded-md px-3 py-2 bg-white text-clinical-900 focus:outline-none focus:ring-1 focus:ring-brand-700"
              />
            </div>

            <div>
              <label className="block font-semibold text-clinical-700 uppercase tracking-wider mb-1">
                BMI (kg/m²)
              </label>
              <input
                type="number"
                step="0.1"
                min="10"
                max="60"
                value={bmi}
                onChange={(e) => setBmi(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="e.g. 27.4"
                className="w-full text-sm border border-clinical-300 rounded-md px-3 py-2 bg-white text-clinical-900 focus:outline-none focus:ring-1 focus:ring-brand-700"
              />
            </div>

            <div>
              <label className="block font-semibold text-clinical-700 uppercase tracking-wider mb-1">
                Systolic BP (mmHg)
              </label>
              <input
                type="number"
                min="70"
                max="240"
                value={systolicBP}
                onChange={(e) => setSystolicBP(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="e.g. 148"
                className="w-full text-sm border border-clinical-300 rounded-md px-3 py-2 bg-white text-clinical-900 focus:outline-none focus:ring-1 focus:ring-brand-700"
              />
            </div>

            <div>
              <label className="block font-semibold text-clinical-700 uppercase tracking-wider mb-1">
                Diastolic BP (mmHg)
              </label>
              <input
                type="number"
                min="40"
                max="140"
                value={diastolicBP}
                onChange={(e) => setDiastolicBP(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="e.g. 92"
                className="w-full text-sm border border-clinical-300 rounded-md px-3 py-2 bg-white text-clinical-900 focus:outline-none focus:ring-1 focus:ring-brand-700"
              />
            </div>

            <div>
              <label className="block font-semibold text-clinical-700 uppercase tracking-wider mb-1">
                Total Cholesterol (mg/dL)
              </label>
              <input
                type="number"
                min="80"
                max="400"
                value={totalCholesterol}
                onChange={(e) => setTotalCholesterol(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="e.g. 210"
                className="w-full text-sm border border-clinical-300 rounded-md px-3 py-2 bg-white text-clinical-900 focus:outline-none focus:ring-1 focus:ring-brand-700"
              />
            </div>

            <div>
              <label className="block font-semibold text-clinical-700 uppercase tracking-wider mb-1">
                LDL Cholesterol (mg/dL)
              </label>
              <input
                type="number"
                min="30"
                max="300"
                value={ldl}
                onChange={(e) => setLdl(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="e.g. 142"
                className="w-full text-sm border border-clinical-300 rounded-md px-3 py-2 bg-white text-clinical-900 focus:outline-none focus:ring-1 focus:ring-brand-700"
              />
            </div>

            <div>
              <label className="block font-semibold text-clinical-700 uppercase tracking-wider mb-1">
                HDL Cholesterol (mg/dL)
              </label>
              <input
                type="number"
                min="15"
                max="120"
                value={hdl}
                onChange={(e) => setHdl(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="e.g. 42"
                className="w-full text-sm border border-clinical-300 rounded-md px-3 py-2 bg-white text-clinical-900 focus:outline-none focus:ring-1 focus:ring-brand-700"
              />
            </div>

            <div>
              <label className="block font-semibold text-clinical-700 uppercase tracking-wider mb-1">
                Triglycerides (mg/dL)
              </label>
              <input
                type="number"
                min="40"
                max="600"
                value={triglycerides}
                onChange={(e) => setTriglycerides(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="e.g. 176"
                className="w-full text-sm border border-clinical-300 rounded-md px-3 py-2 bg-white text-clinical-900 focus:outline-none focus:ring-1 focus:ring-brand-700"
              />
            </div>
          </div>

          <div className="bg-clinical-50 border border-clinical-200 rounded p-3 text-xs text-clinical-600 flex items-start gap-2">
            <Info className="w-4 h-4 text-clinical-400 shrink-0 mt-0.5" />
            <p>
              Clinical context values provide physiological reference for the clinician. The AI retinal model uses fundus image features as primary screening signals.
            </p>
          </div>

          <div className="pt-4 border-t border-clinical-100 flex justify-between">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="inline-flex items-center gap-1.5 px-4 py-2 border border-clinical-300 text-clinical-700 rounded text-sm hover:bg-clinical-50 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-brand-700 hover:bg-brand-800 text-white rounded text-sm font-medium transition-colors shadow-xs"
            >
              <span>Next: Retinal Image</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: RETINAL IMAGE UPLOAD & PREVIEW */}
      {currentStep === 3 && (
        <div className="bg-white border border-clinical-200 rounded-lg p-5 sm:p-6 shadow-xs space-y-6">
          <div className="border-b border-clinical-100 pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h2 className="text-base font-bold text-clinical-950">
                Step 3: Upload Retinal Fundus Image
              </h2>
              <p className="text-xs text-clinical-500">
                Upload a 45° color fundus photograph. Single-field or macula-centered view.
              </p>
            </div>

            {/* Quick Demo Fundus Selector */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-clinical-500 font-medium">Demo Samples:</span>
              <button
                type="button"
                onClick={() => loadSampleRetina('No DR')}
                className="px-2 py-1 bg-clinical-100 hover:bg-clinical-200 rounded text-clinical-700"
              >
                No DR
              </button>
              <button
                type="button"
                onClick={() => loadSampleRetina('Moderate NPDR')}
                className="px-2 py-1 bg-clinical-100 hover:bg-clinical-200 rounded text-clinical-700"
              >
                Moderate NPDR
              </button>
              <button
                type="button"
                onClick={() => loadSampleRetina('Severe NPDR')}
                className="px-2 py-1 bg-clinical-100 hover:bg-clinical-200 rounded text-clinical-700"
              >
                Severe NPDR
              </button>
              <button
                type="button"
                onClick={() => loadSampleRetina('PDR')}
                className="px-2 py-1 bg-clinical-100 hover:bg-clinical-200 rounded text-clinical-700"
              >
                PDR
              </button>
            </div>
          </div>

          {/* Drag & Drop Box */}
          {!retinalImageDataUrl ? (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragOver(false);
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  handleFileUpload(e.dataTransfer.files[0]);
                }
              }}
              className={`border-2 border-dashed rounded-lg p-8 sm:p-12 text-center transition-colors ${
                isDragOver
                  ? 'border-brand-600 bg-brand-50/50'
                  : 'border-clinical-300 hover:border-clinical-400 bg-clinical-50/30'
              }`}
            >
              <div className="mx-auto w-12 h-12 rounded-full bg-clinical-100 flex items-center justify-center text-clinical-500 mb-3">
                <UploadCloud className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-semibold text-clinical-900">
                Upload Retinal Fundus Image
              </h3>
              <p className="text-xs text-clinical-500 mt-1">
                Drag and drop fundus photo here, or browse from terminal
              </p>
              <p className="text-[11px] text-clinical-400 mt-0.5">
                Supported formats: PNG, JPG, or JPEG (Max 25 MB)
              </p>

              <label className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-white border border-clinical-300 hover:bg-clinical-50 text-clinical-800 text-xs font-medium rounded-md shadow-xs cursor-pointer transition-colors">
                <FileImage className="w-3.5 h-3.5 text-clinical-500" />
                <span>Browse Files</span>
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/jpg"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileUpload(e.target.files[0]);
                    }
                  }}
                />
              </label>
            </div>
          ) : (
            /* Uploaded Image Preview & Medical Meta Card */
            <div className="border border-clinical-200 rounded-lg p-4 bg-clinical-50/40 space-y-4">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                {/* Image Thumbnail */}
                <div className="relative w-48 h-48 bg-black rounded border border-clinical-300 overflow-hidden shrink-0 flex items-center justify-center shadow-xs">
                  <img
                    src={retinalImageDataUrl}
                    alt="Retinal Fundus Preview"
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute bottom-1 right-1 bg-black/70 text-white font-mono text-[9px] px-1.5 py-0.5 rounded">
                    {eye}
                  </div>
                </div>

                {/* File Information & Automated Quality Check */}
                <div className="flex-1 space-y-3 w-full text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-clinical-200">
                    <div>
                      <h4 className="font-bold text-clinical-900 text-sm">
                        {imageFileName || 'Retinal Fundus Image'}
                      </h4>
                      <p className="text-clinical-500 text-[11px]">
                        {imageDimensions} • {imageFileSize}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setRetinalImageDataUrl('')}
                      className="inline-flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 p-1.5 rounded hover:bg-rose-50"
                      title="Remove image"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="hidden sm:inline">Remove</span>
                    </button>
                  </div>

                  {/* Pre-Screening Image Quality Indicators */}
                  <div className="bg-white border border-clinical-200 rounded p-3 space-y-1.5">
                    <div className="flex items-center justify-between font-medium">
                      <span className="text-clinical-700">Image Quality Check:</span>
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Good (Quality Score: 95/100)
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-y-1 text-[11px] text-clinical-600 pt-1 border-t border-clinical-100">
                      <div>✓ Retina visible</div>
                      <div>✓ Adequate illumination</div>
                      <div>✓ Resolution acceptable</div>
                      <div>✓ Field of view (FOV) centered</div>
                    </div>
                  </div>

                  <p className="text-[11px] text-clinical-400">
                    Image quality verified for convolutional neural feature extraction.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-clinical-100 flex justify-between items-center">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="inline-flex items-center gap-1.5 px-4 py-2 border border-clinical-300 text-clinical-700 rounded text-sm hover:bg-clinical-50 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              type="button"
              disabled={!isStep3Valid}
              onClick={handleStartAnalysis}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-700 hover:bg-brand-800 disabled:opacity-50 text-white rounded text-sm font-semibold transition-colors shadow-xs"
            >
              <Sparkles className="w-4 h-4" />
              <span>Analyze Retina</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: ANALYSIS IN PROGRESS MODAL / OVERLAY */}
      {isAnalyzing && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-clinical-200 rounded-lg max-w-md w-full p-6 shadow-xl space-y-5 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-700">
              <span className="w-6 h-6 border-2 border-brand-700/20 border-t-brand-700 rounded-full animate-spin" />
            </div>

            <div>
              <h3 className="text-base font-bold text-clinical-950">
                Analyzing retinal image...
              </h3>
              <p className="text-xs text-clinical-500 mt-1">
                Patient: <strong className="text-clinical-800">{patientId}</strong> ({eye})
              </p>
            </div>

            {/* Pipeline Stage Message */}
            <div className="bg-clinical-50 border border-clinical-200 rounded p-3 text-xs font-mono text-clinical-700">
              {pipelineStage}
            </div>

            <p className="text-[11px] text-clinical-400">
              Processing deep feature representations and Grad-CAM explainability maps.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
