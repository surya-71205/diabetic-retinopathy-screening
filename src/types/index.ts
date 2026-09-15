export type DRStage = 
  | 'No DR' 
  | 'Mild NPDR' 
  | 'Moderate NPDR' 
  | 'Severe NPDR' 
  | 'PDR';

export type DiabetesType = 'Type 1' | 'Type 2' | 'Other / Unknown';
export type BiologicalSex = 'Male' | 'Female' | 'Other';
export type QualityRating = 'Good' | 'Acceptable' | 'Needs Review';
export type AnalysisStatus = 'Completed' | 'Review' | 'Reviewed';
export type EyeLaterality = 'Left Eye (OS)' | 'Right Eye (OD)';

export interface ImageQualityCheck {
  overallRating: QualityRating;
  retinaVisible: boolean;
  adequateIllumination: boolean;
  resolutionAcceptable: boolean;
  fieldOfViewAcceptable: boolean;
  score: number; // 0 - 100
  notes?: string;
}

export interface LesionLocation {
  x: number; // percentage 0 - 100
  y: number; // percentage 0 - 100
  radius: number; // percentage
  type: string;
}

export interface Finding {
  name: 
    | 'Microaneurysms' 
    | 'Hemorrhages' 
    | 'Hard Exudates' 
    | 'Cotton-Wool Spots' 
    | 'Neovascularization' 
    | 'Macular Edema Indicators';
  detected: boolean;
  count?: number | string;
  severity?: 'None' | 'Low' | 'Moderate' | 'High';
  description?: string;
  locations?: LesionLocation[];
}

export interface ClinicalParameters {
  hba1c?: number; // %
  glucose?: number; // mg/dL
  systolicBP?: number; // mmHg
  diastolicBP?: number; // mmHg
  totalCholesterol?: number; // mg/dL
  ldl?: number; // mg/dL
  hdl?: number; // mg/dL
  triglycerides?: number; // mg/dL
  bmi?: number;
}

export interface Patient extends ClinicalParameters {
  id: string; // e.g. "P-00124"
  name: string;
  age: number;
  sex: BiologicalSex;
  diabetesType: DiabetesType;
  diabetesDuration: number; // in years
  registeredAt: string;
  notes?: string;
}

export interface Analysis {
  id: string; // e.g. "A-2026-0042"
  patientId: string;
  createdAt: string;
  eye: EyeLaterality;
  drStage: DRStage;
  confidence: number; // e.g. 94 (percentage)
  imageQuality: ImageQualityCheck;
  retinalImageUrl: string;
  xaiImageUrl: string;
  findings: Finding[];
  status: AnalysisStatus;
  clinicalSnapshot: {
    age: number;
    sex: BiologicalSex;
    diabetesType: DiabetesType;
    diabetesDuration: number;
    hba1c?: number;
    glucose?: number;
    systolicBP?: number;
    diastolicBP?: number;
    totalCholesterol?: number;
    ldl?: number;
    hdl?: number;
    triglycerides?: number;
    bmi?: number;
  };
  reviewerNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  modelVersion?: string;
}

export interface DashboardStats {
  totalAnalyses: number;
  drDetected: number;
  highPriorityReviews: number;
  analysesThisMonth: number;
  severityDistribution: {
    stage: DRStage;
    count: number;
    percentage: number;
  }[];
}

export interface AnalyticsData {
  severityDistribution: { stage: DRStage; count: number }[];
  hba1cVsSeverity: { stage: DRStage; avgHba1c: number; count: number }[];
  durationVsSeverity: { stage: DRStage; avgDurationYears: number; count: number }[];
  bpVsSeverity: { stage: DRStage; avgSystolic: number; avgDiastolic: number }[];
  ageVsSeverity: { stage: DRStage; avgAge: number }[];
  ldlVsSeverity: { stage: DRStage; avgLdl: number }[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  clinic: string;
  avatarUrl?: string;
}

export interface AnalysisFilter {
  search?: string;
  drStage?: DRStage | 'ALL';
  dateRange?: 'ALL' | 'TODAY' | 'WEEK' | 'MONTH';
  status?: AnalysisStatus | 'ALL';
  sortBy?: 'date_desc' | 'date_asc' | 'confidence_desc' | 'confidence_asc';
}
