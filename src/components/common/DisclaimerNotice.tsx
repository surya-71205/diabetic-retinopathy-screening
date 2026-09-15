import React from 'react';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

interface DisclaimerNoticeProps {
  variant?: 'banner' | 'inline' | 'compact';
  className?: string;
}

export const DisclaimerNotice: React.FC<DisclaimerNoticeProps> = ({ 
  variant = 'inline',
  className = '' 
}) => {
  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-1.5 text-xs text-clinical-500 ${className}`}>
        <ShieldCheck className="w-3.5 h-3.5 text-clinical-400 shrink-0" />
        <span>AI-assisted screening tool. Results should be reviewed by a qualified healthcare professional.</span>
      </div>
    );
  }

  if (variant === 'banner') {
    return (
      <div className={`bg-amber-50/70 border-y border-amber-200/80 px-4 py-2 text-xs text-amber-900 flex items-center justify-between gap-3 ${className}`}>
        <div className="flex items-center gap-2 max-w-5xl mx-auto w-full">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <p className="leading-normal">
            <strong className="font-medium">Clinical Decision Support Notice:</strong> DR-SCAN is an AI-assisted screening decision-support application. It does not provide a definitive medical diagnosis and does not replace examination by an ophthalmologist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-clinical-50 border border-clinical-200 rounded-lg p-3 text-xs text-clinical-600 flex items-start gap-2.5 ${className}`}>
      <ShieldCheck className="w-4 h-4 text-clinical-400 mt-0.5 shrink-0" />
      <div>
        <span className="font-semibold text-clinical-800">Clinical Screening Disclaimer:</span>{' '}
        This AI-assisted analysis is designed to support clinical triage and screening workflows. All findings and predicted stages should be correlated with comprehensive dilated clinical examination by a qualified eye care professional.
      </div>
    </div>
  );
};
