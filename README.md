# DR-SCAN — AI-Assisted Diabetic Retinopathy Screening

[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Clinical UI](https://img.shields.io/badge/Clinical_UI-Medical_Grade-0f766e)](https://github.com/surya-71205/diabetic-retinopathy-screening)

> **DR-SCAN** is a production-quality, responsive clinical decision-support web application for AI-assisted Diabetic Retinopathy (DR) screening from retinal fundus photographs. Engineered with a restrained, trustworthy medical aesthetic, it allows ophthalmologists, optometrists, and endocrinology screening personnel to triage cases, inspect Explainable AI (XAI) attention heatmaps, and track longitudinal patient progression.

---

> [!IMPORTANT]
> **Clinical Decision Support Notice:**
> DR-SCAN is an AI-assisted screening decision-support application. It does not provide an autonomous definitive diagnosis and does not replace examination by an ophthalmologist. All findings and predicted stages should be correlated with comprehensive dilated clinical examination.

---

## Table of Contents

- [Key Features](#key-features)
- [Design Philosophy](#design-philosophy)
- [Clinical Terminology & Ethics](#clinical-terminology--ethics)
- [Interactive Retinal & XAI Viewer](#interactive-retinal--xai-viewer)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Application Routes](#application-routes)
- [Mock API & State Layer](#mock-api--state-layer)
- [Future Backend Integration (FastAPI / PyTorch)](#future-backend-integration-fastapi--pytorch)
- [License & Disclaimer](#license--disclaimer)

---

## Key Features

1. **Clinical Authentication & Screener Profiles**
   - Secure login portal pre-configured for clinical screeners (e.g. *Dr. Ananya Krishnan, MD*).
   - "Remember credentials" support and rapid demo account access.

2. **Dashboard Overview**
   - Compact clinical metric cards: *Total Analyses*, *DR Detected*, *High-Priority Reviews*, and *Analyses This Month*.
   - Recharts-powered **DR Severity Distribution** (*No DR*, *Mild NPDR*, *Moderate NPDR*, *Severe NPDR*, *PDR*).
   - Recent analyses feed with instant status indicators and quick access.

3. **4-Step Screening Workflow (`/new-analysis`)**
   - **Step 1: Patient Information:** Capture Patient ID, Age, Biological Sex, Diabetes Type (Type 1, Type 2, Other/Unknown), Diabetes Duration, and Eye Laterality (OD / OS), with instant lookup of registered patients.
   - **Step 2: Clinical Context:** Capture systemic biomarkers (HbA1c %, Fasting Glucose, Systolic/Diastolic BP, Lipids: Total Cholesterol, LDL, HDL, Triglycerides, and BMI).
   - **Step 3: Retinal Image Upload:** Drag-and-drop fundus photograph upload (PNG/JPG), automated mock image quality checks (retina visibility, illumination symmetry, resolution, field of view), and one-click sample fundus selectors for instant demonstration.
   - **Step 4: AI Inference Pipeline:** Real-time multi-stage pipeline status displaying feature extraction, lesion assessment, and Grad-CAM saliency generation.

4. **Analysis Result & Clinical Explainability (`/analysis/:id`)**
   - Prominent, restrained clinical result banner (*Predicted Stage*, *Model Confidence %*, *Image Quality Score*).
   - **RetinalViewer**: Dual side-by-side view, Grad-CAM attention heatmap overlay with interactive opacity slider ($0\% - 100\%$), zoom ($70\% - 300\%$), pan, and fullscreen mode.
   - **Detected Retinal Findings Table**: Granular detection state, lesion count, and clinical description for *Microaneurysms*, *Hemorrhages*, *Hard Exudates*, *Cotton-Wool Spots*, *Neovascularization*, and *Macular Edema Indicators*.
   - **Clinical Context Summary**: Side-by-side view of metabolic parameters at screening time.
   - **Longitudinal History Timeline**: Previous screenings for the patient to monitor disease progression.
   - **Clinician Review & Sign-Off**: Form for entering referral notes and officially recording sign-off.
   - **Printable Clinical Summary Report**: Clean, print-ready document formatted for clinical charting (`window.print()`).

5. **Longitudinal Patient Registry (`/patients` & `/patients/:id`)**
   - Searchable directory of diabetic patients with type filters and demographic metrics.
   - Dedicated patient profiles showing baseline cardiovascular/metabolic data and an audit trail of all previous retinal screenings.

6. **Screening History (`/history`)**
   - Filter by DR stage, date range (Today, 7 days, 30 days), and review status.
   - Multi-field search (Patient ID, Analysis Ref ID, clinician notes) and sorting by date or confidence score.

7. **Clinical Analytics (`/analytics`)**
   - Visualizing observational associations between biomarkers and DR stages:
     - *DR Severity Distribution*
     - *HbA1c vs. DR Severity*
     - *Diabetes Duration vs. DR Severity*
     - *Blood Pressure Profile (Systolic & Diastolic) vs. DR Severity*
     - *Age Profile vs. DR Severity*
     - *LDL Cholesterol vs. DR Severity*

8. **Settings & Governance (`/settings`)**
   - Toggle clinical unit standards (e.g., mg/dL vs. mmol/L, % vs. mmol/mol).
   - Automated high-priority triage flags for Severe NPDR and PDR cases.
   - AI Model Lineage (DR-Net v2.4.1 ResNet-BiFPN specs) and privacy policies.

---

## Design Philosophy

The user interface is intentionally crafted to feel like **serious, trustworthy medical software used in real hospital clinics**, deliberately avoiding common "AI slop" tropes:

* ❌ No excessive purple/blue gradients or glowing neon borders
* ❌ No glassmorphism overload or floating decorative blobs
* ❌ No exaggerated 3D elements or marketing hero banners
* ❌ No meaningless statistics or fake percentage tickers
* ✔️ Calm, high-contrast slate neutrals (`#f8fafc` to `#0f172a`)
* ✔️ Restrained clinical teal medical accent (`#0f766e`)
* ✔️ Accessible clinical severity badges with shape and text cues
* ✔️ Responsive-first design for Desktop, Tablet, and Mobile phones

---

## Clinical Terminology & Ethics

DR-SCAN adheres to strict medical software standards:
* Uses neutral, clinician-facing language: `"AI Screening Result"`, `"Model Confidence"`, `"AI-Assisted Analysis"`, and `"Regions Influencing Prediction"`.
* Strictly avoids misleading hype: `"Guaranteed Diagnosis"`, `"100% Accurate"`, or `"AI Doctor"`.
* All analytics charts are explicitly labeled as **observational associations/correlations** (never claiming direct causality).

---

## Interactive Retinal & XAI Viewer

The custom [`RetinalViewer`](src/components/common/RetinalViewer.tsx) provides a specialized diagnostic interface:

| Mode | Capability |
|---|---|
| **Dual View** | Side-by-side comparison of true-color fundus photography and Grad-CAM saliency map (stacks on mobile). |
| **Overlay Blend** | Composites the attention heatmap directly on top of retinal vessels with a live opacity slider ($0\% - 100\%$). |
| **Fundus / Heatmap Only** | Isolate either channel for detailed optical inspection. |
| **Interactive Zoom** | Optical zoom ($0.7\times$ to $3.0\times$) with instantaneous reset. |
| **Fullscreen Mode** | Expands the examination canvas to full screen for clinical presentations and desktop rounds. |

---

## Tech Stack

* **Framework:** [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
* **Build Tool:** [Vite 5](https://vitejs.dev/)
* **Styling:** [Tailwind CSS 3](https://tailwindcss.com/) with custom clinical tokens
* **Icons:** [Lucide React](https://lucide.dev/)
* **Charts:** [Recharts](https://recharts.org/)
* **Routing:** [React Router DOM v6](https://reactrouter.com/)
* **State / Persistence:** Typed mock service layer backed by browser `localStorage`
* **Procedural Graphics:** Built-in vector SVG fundus generator (100% offline, zero broken assets)

---

## Project Structure

```
├── index.html                   # HTML entry point with medical favicon & meta
├── package.json                 # Project dependencies & build scripts
├── postcss.config.js            # PostCSS configuration
├── tailwind.config.js           # Custom clinical color palette & font tokens
├── tsconfig.json                # TypeScript compiler configuration
├── vite.config.ts               # Vite configuration with path aliases
└── src/
    ├── main.tsx                 # React application root
    ├── App.tsx                  # React Router configuration & route tree
    ├── index.css                # Tailwind base styles & print media queries
    ├── types/
    │   └── index.ts             # Strict TypeScript models (Patient, Analysis, Finding, etc.)
    ├── data/
    │   └── mockData.ts          # Seed clinical dataset & demo screeners
    ├── services/
    │   └── api.ts               # Mock service layer with localStorage persistence
    ├── utils/
    │   ├── formatters.ts        # Clinical dates, numbers, and stage badge colors
    │   └── retinalImageGenerator.ts # Procedural SVG retinal fundus & Grad-CAM generator
    ├── layouts/
    │   └── AppLayout.tsx        # Responsive desktop sidebar + mobile drawer layout
    ├── pages/
    │   ├── LoginPage.tsx        # Screener authentication portal
    │   ├── DashboardPage.tsx    # Clinical overview, metrics, and severity chart
    │   ├── NewAnalysisPage.tsx  # 4-step multi-step screening workflow
    │   ├── AnalysisResultPage.tsx # Core screening result, XAI viewer, and sign-off
    │   ├── PatientsPage.tsx     # Patient registry directory
    │   ├── PatientDetailPage.tsx# Patient demographics & longitudinal timeline
    │   ├── HistoryPage.tsx      # Comprehensive screening audit log with filters
    │   ├── AnalyticsPage.tsx    # Biomarker epidemiological correlation charts
    │   └── SettingsPage.tsx     # Units, triage rules, model specs, data reset
    └── components/
        └── common/
            ├── DisclaimerNotice.tsx # Standardized clinical disclaimer banners
            ├── PrintableReport.tsx  # Print/PDF clinical summary sheet
            ├── QualityBadge.tsx     # Retinal image quality indicator & breakdown
            ├── RetinalViewer.tsx    # Interactive dual/overlay fundus & XAI viewer
            └── StatusBadge.tsx      # Clinical DR stage color badges
```

---

## Getting Started

### Prerequisites

* [Node.js](https://nodejs.org/) (version 18 or higher recommended)
* `npm` (bundled with Node.js)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/surya-71205/diabetic-retinopathy-screening.git
   cd diabetic-retinopathy-screening
   ```

2. **Install dependencies:**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173/](http://localhost:5173/) in your web browser.

4. **Build for production:**
   ```bash
   npm run build
   ```
   Outputs the compiled, optimized bundle to `dist/`.

---

## Application Routes

| Path | Screen | Description |
|---|---|---|
| `/login` | **Login Portal** | Screener sign-in with demo quick-fill credentials. |
| `/dashboard` | **Dashboard** | Metric cards, severity distribution, quick screening CTA, and recent cases. |
| `/new-analysis` | **New Analysis** | 4-step screening wizard for patient demographics, biomarkers, fundus upload, and inference. |
| `/analysis/:id` | **Analysis Result** | Stage prediction, confidence, RetinalViewer (Grad-CAM), lesion findings, and sign-off. |
| `/patients` | **Patients** | Patient directory with diabetes type filter and search. |
| `/patients/:id` | **Patient Profile** | Comprehensive demographic record, metabolic baseline, and past scan timeline. |
| `/history` | **History** | Searchable audit log with stage, date, and status filters. |
| `/analytics` | **Analytics** | Epidemiological correlation charts across biomarkers and DR stages. |
| `/settings` | **Settings** | Clinical unit standards, AI model specifications, and demo reset. |

---

## Mock API & State Layer

All data operations are encapsulated inside [`src/services/api.ts`](src/services/api.ts):

* **Persistence:** Uses `localStorage` with versioned keys (`dr_scan_patients_v2`, `dr_scan_analyses_v2`, `dr_scan_user_v2`).
* **Asynchronous Simulation:** Simulates realistic network and inference latency (`delay(ms)`).
* **Reset Facility:** The Settings page includes a **"Reset Demo Data"** action that restores the baseline clinical dataset at any time.

---

## Future Backend Integration (FastAPI / PyTorch)

The frontend service layer is structured to be swapped with a real Python/FastAPI backend:

```
+-------------------+                 +------------------------+
|                   |  POST /analyze  |                        |
|  DR-SCAN Frontend | --------------> |  FastAPI Backend       |
|  (React + TS)     | <-------------- |  (ResNet50 / BiFPN)    |
|                   |  Result JSON    |  (Grad-CAM Generator)  |
+-------------------+                 +------------------------+
```

### Proposed Endpoint Contract

```http
POST /api/v1/analyze
Content-Type: multipart/form-data
```

**Request Payload:**
* `image`: Binary fundus photograph file
* `patient_id`: string
* `eye`: `'OD'` | `'OS'`
* `clinical_context`: JSON string (HbA1c, glucose, blood pressure, etc.)

**Response Payload:**
```json
{
  "analysis_id": "A-2026-0045",
  "dr_stage": "Moderate NPDR",
  "confidence": 94.2,
  "image_quality": {
    "overall": "Good",
    "retina_visible": true,
    "adequate_illumination": true,
    "resolution_acceptable": true,
    "field_of_view_acceptable": true,
    "score": 96
  },
  "findings": [
    { "name": "Microaneurysms", "detected": true, "count": "12-15 detected", "severity": "Moderate" },
    { "name": "Hemorrhages", "detected": true, "count": "6 dot/blot lesions", "severity": "Moderate" },
    { "name": "Hard Exudates", "detected": true, "count": "Circinate cluster", "severity": "Low" },
    { "name": "Cotton-Wool Spots", "detected": false, "severity": "None" },
    { "name": "Neovascularization", "detected": false, "severity": "None" },
    { "name": "Macular Edema Indicators", "detected": true, "count": "Suspected exudate proximity", "severity": "Low" }
  ],
  "xai_heatmap_url": "/static/heatmaps/A-2026-0045_gradcam.png",
  "model_version": "DR-Net v2.4.1 (ResNet50-BiFPN / Grad-CAM+)"
}
```

---

## License & Disclaimer

This project is developed for screening and clinical decision support research. Not certified as a standalone diagnostic medical device. Distributed under the **MIT License**.
