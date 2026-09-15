import { 
  Patient, 
  Analysis, 
  User, 
  DashboardStats, 
  AnalyticsData, 
  AnalysisFilter, 
  DRStage, 
  ImageQualityCheck, 
  Finding,
  AnalysisStatus,
  EyeLaterality
} from '../types';
import { INITIAL_PATIENTS, INITIAL_ANALYSES, CURRENT_USER } from '../data/mockData';
import { generateRetinalFundusSvg, generateXaiHeatmapSvg } from '../utils/retinalImageGenerator';

const STORAGE_KEYS = {
  PATIENTS: 'dr_scan_patients_v2',
  ANALYSES: 'dr_scan_analyses_v2',
  USER: 'dr_scan_user_v2',
};

// Helper: initialize storage with seed data if empty
function initializeStorage() {
  if (typeof window === 'undefined') return;
  
  // Clean up legacy v1 cached keys if present
  try {
    localStorage.removeItem('dr_scan_patients_v1');
    localStorage.removeItem('dr_scan_analyses_v1');
    localStorage.removeItem('dr_scan_user_v1');
  } catch (e) {
    // ignore
  }

  if (!localStorage.getItem(STORAGE_KEYS.PATIENTS)) {
    localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(INITIAL_PATIENTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ANALYSES)) {
    localStorage.setItem(STORAGE_KEYS.ANALYSES, JSON.stringify(INITIAL_ANALYSES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.USER)) {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(CURRENT_USER));
  }
}

// Simulates network latency
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function getStoredPatients(): Patient[] {
  initializeStorage();
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PATIENTS);
    return data ? JSON.parse(data) : INITIAL_PATIENTS;
  } catch {
    return INITIAL_PATIENTS;
  }
}

function saveStoredPatients(patients: Patient[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients));
  } catch (err) {
    console.warn('Failed to persist patients to localStorage', err);
  }
}

function getStoredAnalyses(): Analysis[] {
  initializeStorage();
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ANALYSES);
    return data ? JSON.parse(data) : INITIAL_ANALYSES;
  } catch {
    return INITIAL_ANALYSES;
  }
}

function saveStoredAnalyses(analyses: Analysis[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.ANALYSES, JSON.stringify(analyses));
  } catch (err) {
    console.warn('Failed to persist analyses to localStorage', err);
  }
}

export interface CreateAnalysisInput {
  patientId: string;
  patientData?: Partial<Patient>;
  eye: EyeLaterality;
  retinalImageDataUrl: string;
  simulatedStage?: DRStage; // Allows testing specific clinical outcomes in demo
}

export const api = {
  // Authentication
  async login(email: string, password: string, rememberMe: boolean = true): Promise<User> {
    await delay(400);
    // Clinical demo credential validation
    if (!email || !password) {
      throw new Error('Please enter both clinical ID/email and password.');
    }
    const user: User = {
      ...CURRENT_USER,
      email: email.includes('@') ? email : `${email}@retinaclinic.org`,
    };
    if (rememberMe && typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    }
    return user;
  },

  async getCurrentUser(): Promise<User | null> {
    initializeStorage();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER);
      return data ? JSON.parse(data) : CURRENT_USER;
    } catch {
      return CURRENT_USER;
    }
  },

  async logout(): Promise<void> {
    await delay(150);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  },

  // Dashboard Overview Statistics
  async getDashboardStats(): Promise<DashboardStats> {
    await delay(250);
    const analyses = getStoredAnalyses();
    const totalAnalyses = analyses.length;
    const drDetected = analyses.filter((a) => a.drStage !== 'No DR').length;
    const highPriorityReviews = analyses.filter(
      (a) => a.drStage === 'Severe NPDR' || a.drStage === 'PDR' || a.status === 'Review'
    ).length;

    // Filter for current month
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const analysesThisMonth = analyses.filter((a) => {
      const d = new Date(a.createdAt);
      return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
    }).length || analyses.length;

    // Severity distribution
    const stages: DRStage[] = ['No DR', 'Mild NPDR', 'Moderate NPDR', 'Severe NPDR', 'PDR'];
    const severityDistribution = stages.map((stage) => {
      const count = analyses.filter((a) => a.drStage === stage).length;
      return {
        stage,
        count,
        percentage: totalAnalyses > 0 ? Math.round((count / totalAnalyses) * 100) : 0,
      };
    });

    return {
      totalAnalyses,
      drDetected,
      highPriorityReviews,
      analysesThisMonth,
      severityDistribution,
    };
  },

  // Recent analyses
  async getRecentAnalyses(limit: number = 6): Promise<Analysis[]> {
    await delay(200);
    const analyses = getStoredAnalyses();
    return [...analyses]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  },

  // Patients Directory
  async getPatients(search?: string): Promise<Patient[]> {
    await delay(200);
    const patients = getStoredPatients();
    if (!search || !search.trim()) return patients;
    const q = search.toLowerCase();
    return patients.filter(
      (p) =>
        p.id.toLowerCase().includes(q) ||
        p.name.toLowerCase().includes(q) ||
        p.diabetesType.toLowerCase().includes(q)
    );
  },

  async getPatient(id: string): Promise<{ patient: Patient; analyses: Analysis[] } | null> {
    await delay(200);
    const patients = getStoredPatients();
    const patient = patients.find((p) => p.id === id);
    if (!patient) return null;

    const analyses = getStoredAnalyses()
      .filter((a) => a.patientId === id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return { patient, analyses };
  },

  async upsertPatient(patientData: Patient): Promise<Patient> {
    await delay(200);
    const patients = getStoredPatients();
    const existingIndex = patients.findIndex((p) => p.id === patientData.id);
    if (existingIndex >= 0) {
      patients[existingIndex] = { ...patients[existingIndex], ...patientData };
    } else {
      patients.unshift(patientData);
    }
    saveStoredPatients(patients);
    return patientData;
  },

  // Single Analysis Record
  async getAnalysis(id: string): Promise<{ analysis: Analysis; patient?: Patient } | null> {
    await delay(250);
    const analyses = getStoredAnalyses();
    const analysis = analyses.find((a) => a.id === id);
    if (!analysis) return null;

    const patients = getStoredPatients();
    const patient = patients.find((p) => p.id === analysis.patientId);

    return { analysis, patient };
  },

  // Update Analysis Clinician Review Status
  async updateAnalysisStatus(
    id: string,
    status: AnalysisStatus,
    reviewerNotes?: string,
    reviewedBy?: string
  ): Promise<Analysis> {
    await delay(250);
    const analyses = getStoredAnalyses();
    const index = analyses.findIndex((a) => a.id === id);
    if (index === -1) {
      throw new Error(`Analysis ${id} not found`);
    }

    analyses[index] = {
      ...analyses[index],
      status,
      reviewerNotes: reviewerNotes ?? analyses[index].reviewerNotes,
      reviewedBy: reviewedBy || 'Dr. Ananya Krishnan, MD',
      reviewedAt: new Date().toISOString(),
    };

    saveStoredAnalyses(analyses);
    return analyses[index];
  },

  // Create new analysis (simulates AI inference pipeline)
  async createAnalysis(input: CreateAnalysisInput): Promise<Analysis> {
    await delay(400);

    const patients = getStoredPatients();
    let patient = patients.find((p) => p.id === input.patientId);

    // If new patient or updated info was passed
    if (input.patientData) {
      if (patient) {
        patient = { ...patient, ...input.patientData };
        const idx = patients.findIndex((p) => p.id === input.patientId);
        patients[idx] = patient;
      } else {
        patient = {
          id: input.patientId,
          name: input.patientData.name || `Patient ${input.patientId}`,
          age: input.patientData.age || 50,
          sex: input.patientData.sex || 'Female',
          diabetesType: input.patientData.diabetesType || 'Type 2',
          diabetesDuration: input.patientData.diabetesDuration || 5,
          registeredAt: new Date().toISOString(),
          ...input.patientData,
        };
        patients.unshift(patient);
      }
      saveStoredPatients(patients);
    }

    if (!patient) {
      patient = {
        id: input.patientId,
        name: `Patient ${input.patientId}`,
        age: 55,
        sex: 'Female',
        diabetesType: 'Type 2',
        diabetesDuration: 8,
        registeredAt: new Date().toISOString(),
      };
      patients.unshift(patient);
      saveStoredPatients(patients);
    }

    // Determine predicted stage (uses simulatedStage if provided, or infers clinical correlation)
    let predictedStage: DRStage = input.simulatedStage || 'Moderate NPDR';
    if (!input.simulatedStage) {
      const hba1c = patient.hba1c || 7.5;
      const duration = patient.diabetesDuration || 8;
      if (hba1c > 9.2 || duration > 16) {
        predictedStage = Math.random() > 0.4 ? 'Severe NPDR' : 'PDR';
      } else if (hba1c > 8.0 || duration > 10) {
        predictedStage = 'Moderate NPDR';
      } else if (hba1c > 7.0 || duration > 5) {
        predictedStage = 'Mild NPDR';
      } else {
        predictedStage = 'No DR';
      }
    }

    // Confidence: realistic clinical distribution 88% - 98%
    const confidences: Record<DRStage, number> = {
      'No DR': 97,
      'Mild NPDR': 91,
      'Moderate NPDR': 94,
      'Severe NPDR': 92,
      'PDR': 96,
    };
    const confidence = confidences[predictedStage] || 93;

    // Image quality check
    const imageQuality: ImageQualityCheck = {
      overallRating: 'Good',
      retinaVisible: true,
      adequateIllumination: true,
      resolutionAcceptable: true,
      fieldOfViewAcceptable: true,
      score: 95,
      notes: 'Optimal retinal illumination and clear vascular arcade visualization.',
    };

    // Findings mapped to predicted stage
    const findings: Finding[] = generateFindingsForStage(predictedStage);

    // Generate matching XAI heatmap
    const eyeCode = input.eye.includes('Right') ? 'OD' : 'OS';
    const xaiImageUrl = generateXaiHeatmapSvg(predictedStage, eyeCode);

    // If no custom image dataUrl provided, use the procedural SVG fundus image
    const retinalImageUrl = input.retinalImageDataUrl.startsWith('data:') 
      ? input.retinalImageDataUrl 
      : generateRetinalFundusSvg(predictedStage, eyeCode);

    const newId = `A-${new Date().getFullYear()}-${String(Math.floor(1000 + Math.random() * 9000))}`;
    
    const newAnalysis: Analysis = {
      id: newId,
      patientId: patient.id,
      createdAt: new Date().toISOString(),
      eye: input.eye,
      drStage: predictedStage,
      confidence,
      imageQuality,
      retinalImageUrl,
      xaiImageUrl,
      findings,
      status: predictedStage === 'Severe NPDR' || predictedStage === 'PDR' ? 'Review' : 'Completed',
      clinicalSnapshot: {
        age: patient.age,
        sex: patient.sex,
        diabetesType: patient.diabetesType,
        diabetesDuration: patient.diabetesDuration,
        hba1c: patient.hba1c,
        glucose: patient.glucose,
        systolicBP: patient.systolicBP,
        diastolicBP: patient.diastolicBP,
        totalCholesterol: patient.totalCholesterol,
        ldl: patient.ldl,
        hdl: patient.hdl,
        triglycerides: patient.triglycerides,
        bmi: patient.bmi,
      },
      reviewerNotes: predictedStage === 'No DR' 
        ? 'No diabetic retinopathy detected. Next annual screening recommended.' 
        : 'AI screening detected microvascular abnormalities. Clinician verification pending.',
      modelVersion: 'DR-Net v2.4.1 (ResNet50-BiFPN / Grad-CAM+)',
    };

    const currentAnalyses = getStoredAnalyses();
    currentAnalyses.unshift(newAnalysis);
    saveStoredAnalyses(currentAnalyses);

    return newAnalysis;
  },

  // Analysis History with comprehensive search & filtering
  async getAnalysisHistory(filter: AnalysisFilter = {}): Promise<Analysis[]> {
    await delay(200);
    let list = getStoredAnalyses();

    // Search filter (patient ID, analysis ID, or notes)
    if (filter.search && filter.search.trim()) {
      const q = filter.search.toLowerCase().trim();
      list = list.filter(
        (a) =>
          a.patientId.toLowerCase().includes(q) ||
          a.id.toLowerCase().includes(q) ||
          (a.reviewerNotes && a.reviewerNotes.toLowerCase().includes(q))
      );
    }

    // DR Stage filter
    if (filter.drStage && filter.drStage !== 'ALL') {
      list = list.filter((a) => a.drStage === filter.drStage);
    }

    // Status filter
    if (filter.status && filter.status !== 'ALL') {
      list = list.filter((a) => a.status === filter.status);
    }

    // Date range filter
    if (filter.dateRange && filter.dateRange !== 'ALL') {
      const now = new Date().getTime();
      list = list.filter((a) => {
        const itemTime = new Date(a.createdAt).getTime();
        const diffDays = (now - itemTime) / (1000 * 3600 * 24);
        if (filter.dateRange === 'TODAY') return diffDays <= 1;
        if (filter.dateRange === 'WEEK') return diffDays <= 7;
        if (filter.dateRange === 'MONTH') return diffDays <= 30;
        return true;
      });
    }

    // Sort order
    if (filter.sortBy === 'date_asc') {
      list.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else if (filter.sortBy === 'confidence_desc') {
      list.sort((a, b) => b.confidence - a.confidence);
    } else if (filter.sortBy === 'confidence_asc') {
      list.sort((a, b) => a.confidence - b.confidence);
    } else {
      // Default: date_desc
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return list;
  },

  // Analytics
  async getAnalytics(): Promise<AnalyticsData> {
    await delay(300);
    const analyses = getStoredAnalyses();
    const stages: DRStage[] = ['No DR', 'Mild NPDR', 'Moderate NPDR', 'Severe NPDR', 'PDR'];

    const severityDistribution = stages.map((stage) => ({
      stage,
      count: analyses.filter((a) => a.drStage === stage).length,
    }));

    const hba1cVsSeverity = stages.map((stage) => {
      const matches = analyses.filter((a) => a.drStage === stage && a.clinicalSnapshot.hba1c);
      const avgHba1c = matches.length
        ? Math.round((matches.reduce((acc, m) => acc + (m.clinicalSnapshot.hba1c || 0), 0) / matches.length) * 10) / 10
        : 0;
      return { stage, avgHba1c, count: matches.length };
    });

    const durationVsSeverity = stages.map((stage) => {
      const matches = analyses.filter((a) => a.drStage === stage && a.clinicalSnapshot.diabetesDuration);
      const avgDurationYears = matches.length
        ? Math.round((matches.reduce((acc, m) => acc + (m.clinicalSnapshot.diabetesDuration || 0), 0) / matches.length) * 10) / 10
        : 0;
      return { stage, avgDurationYears, count: matches.length };
    });

    const bpVsSeverity = stages.map((stage) => {
      const matches = analyses.filter(
        (a) => a.drStage === stage && a.clinicalSnapshot.systolicBP && a.clinicalSnapshot.diastolicBP
      );
      const avgSystolic = matches.length
        ? Math.round(matches.reduce((acc, m) => acc + (m.clinicalSnapshot.systolicBP || 0), 0) / matches.length)
        : 0;
      const avgDiastolic = matches.length
        ? Math.round(matches.reduce((acc, m) => acc + (m.clinicalSnapshot.diastolicBP || 0), 0) / matches.length)
        : 0;
      return { stage, avgSystolic, avgDiastolic };
    });

    const ageVsSeverity = stages.map((stage) => {
      const matches = analyses.filter((a) => a.drStage === stage && a.clinicalSnapshot.age);
      const avgAge = matches.length
        ? Math.round(matches.reduce((acc, m) => acc + m.clinicalSnapshot.age, 0) / matches.length)
        : 0;
      return { stage, avgAge };
    });

    const ldlVsSeverity = stages.map((stage) => {
      const matches = analyses.filter((a) => a.drStage === stage && a.clinicalSnapshot.ldl);
      const avgLdl = matches.length
        ? Math.round(matches.reduce((acc, m) => acc + (m.clinicalSnapshot.ldl || 0), 0) / matches.length)
        : 0;
      return { stage, avgLdl };
    });

    return {
      severityDistribution,
      hba1cVsSeverity,
      durationVsSeverity,
      bpVsSeverity,
      ageVsSeverity,
      ldlVsSeverity,
    };
  },

  // Reset demo storage to defaults
  resetToDefaults() {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(INITIAL_PATIENTS));
      localStorage.setItem(STORAGE_KEYS.ANALYSES, JSON.stringify(INITIAL_ANALYSES));
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(CURRENT_USER));
    }
  }
};

function generateFindingsForStage(stage: DRStage): Finding[] {
  switch (stage) {
    case 'No DR':
      return [
        { name: 'Microaneurysms', detected: false, severity: 'None', description: 'No microaneurysms detected.' },
        { name: 'Hemorrhages', detected: false, severity: 'None', description: 'Retinal vessels normal.' },
        { name: 'Hard Exudates', detected: false, severity: 'None', description: 'Clear foveal avascular zone.' },
        { name: 'Cotton-Wool Spots', detected: false, severity: 'None', description: 'No ischemic nerve fiber patches.' },
        { name: 'Neovascularization', detected: false, severity: 'None', description: 'Normal optic disc margins.' },
        { name: 'Macular Edema Indicators', detected: false, severity: 'None', description: 'No parafoveal thickening.' },
      ];
    case 'Mild NPDR':
      return [
        { name: 'Microaneurysms', detected: true, count: '3-5 detected', severity: 'Low', description: 'Small isolated punctate microaneurysms.' },
        { name: 'Hemorrhages', detected: false, severity: 'None', description: 'No definite blot hemorrhages.' },
        { name: 'Hard Exudates', detected: false, severity: 'None', description: 'No significant lipid accumulation.' },
        { name: 'Cotton-Wool Spots', detected: false, severity: 'None', description: 'Absent.' },
        { name: 'Neovascularization', detected: false, severity: 'None', description: 'Absent.' },
        { name: 'Macular Edema Indicators', detected: false, severity: 'None', description: 'Fovea unaffected.' },
      ];
    case 'Moderate NPDR':
      return [
        { name: 'Microaneurysms', detected: true, count: '10-15 detected', severity: 'Moderate', description: 'Parafoveal and arcade microaneurysms.' },
        { name: 'Hemorrhages', detected: true, count: '4-7 dot/blot lesions', severity: 'Moderate', description: 'Intraretinal dot/blot hemorrhages in 1-2 quadrants.' },
        { name: 'Hard Exudates', detected: true, count: 'Circinate cluster', severity: 'Low', description: 'Small yellowish lipid rings.' },
        { name: 'Cotton-Wool Spots', detected: false, severity: 'None', description: 'No definite cotton-wool spots.' },
        { name: 'Neovascularization', detected: false, severity: 'None', description: 'No neovascular fronds.' },
        { name: 'Macular Edema Indicators', detected: true, count: 'Subtle ring', severity: 'Low', description: 'Exudates within 1.5 disc diameters.' },
      ];
    case 'Severe NPDR':
      return [
        { name: 'Microaneurysms', detected: true, count: '>30 detected', severity: 'High', description: 'Microaneurysms present in all 4 quadrants.' },
        { name: 'Hemorrhages', detected: true, count: 'Severe blot hemorrhages (4 quadrants)', severity: 'High', description: 'Meets 4-2-1 international clinical staging criteria.' },
        { name: 'Hard Exudates', detected: true, count: 'Extensive clusters', severity: 'Moderate', description: 'Multiple parafoveal lipid deposits.' },
        { name: 'Cotton-Wool Spots', detected: true, count: '3-5 spots', severity: 'Moderate', description: 'Soft exudates indicating localized ischemia.' },
        { name: 'Neovascularization', detected: false, severity: 'None', description: 'No neovascularization seen yet.' },
        { name: 'Macular Edema Indicators', detected: true, count: 'High DME risk', severity: 'High', description: 'Exudates approaching foveal avascular zone.' },
      ];
    case 'PDR':
      return [
        { name: 'Microaneurysms', detected: true, count: 'Widespread', severity: 'High', description: 'Extensive microaneurysms.' },
        { name: 'Hemorrhages', detected: true, count: 'Preretinal & vitreal', severity: 'High', description: 'Severe intraretinal and preretinal hemorrhage.' },
        { name: 'Hard Exudates', detected: true, count: 'Confluent sheets', severity: 'High', description: 'Prominent lipid exudation.' },
        { name: 'Cotton-Wool Spots', detected: true, count: 'Multiple', severity: 'High', description: 'Widespread nerve fiber layer infarcts.' },
        { name: 'Neovascularization', detected: true, count: 'NVD / NVE confirmed', severity: 'High', description: 'Active fragile vessels proliferating at disc and arcades.' },
        { name: 'Macular Edema Indicators', detected: true, count: 'Clinically Significant Macular Edema', severity: 'High', description: 'Urgent ophthalmology referral required.' },
      ];
  }
}
