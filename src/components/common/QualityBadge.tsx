import React, { useState } from 'react';
import { ImageQualityCheck } from '../../types';
import { getQualityBadgeColor } from '../../utils/formatters';
import { CheckCircle2, Info, X } from 'lucide-react';

interface QualityBadgeProps {
  quality: ImageQualityCheck;
  showDetails?: boolean;
}

export const QualityBadge: React.FC<QualityBadgeProps> = ({ quality, showDetails = false }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const colors = getQualityBadgeColor(quality.overallRating);

  return (
    <div className="relative inline-flex items-center gap-1.5">
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-medium border ${colors.badge}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
        <span>{quality.overallRating}</span>
      </span>

      {showDetails && (
        <button
          type="button"
          onClick={() => setModalOpen(!modalOpen)}
          className="text-clinical-400 hover:text-clinical-600 transition-colors p-0.5 rounded hover:bg-clinical-100"
          title="View Image Quality Checks"
          aria-label="View Image Quality Checks"
        >
          <Info className="w-3.5 h-3.5" />
        </button>
      )}

      {/* Quality Details Popover Modal */}
      {modalOpen && (
        <div className="absolute top-full left-0 mt-2 z-40 w-64 p-3 bg-white border border-clinical-200 rounded-lg shadow-lg text-xs text-clinical-700">
          <div className="flex items-center justify-between pb-2 border-b border-clinical-100 mb-2">
            <span className="font-semibold text-clinical-900">Image Quality Checks</span>
            <button 
              type="button" 
              onClick={() => setModalOpen(false)}
              className="text-clinical-400 hover:text-clinical-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-clinical-600">Retina visible:</span>
              <span className="inline-flex items-center gap-1 font-medium text-emerald-700">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                {quality.retinaVisible ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-clinical-600">Adequate illumination:</span>
              <span className="inline-flex items-center gap-1 font-medium text-emerald-700">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                {quality.adequateIllumination ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-clinical-600">Resolution acceptable:</span>
              <span className="inline-flex items-center gap-1 font-medium text-emerald-700">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                {quality.resolutionAcceptable ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-clinical-600">Field of view:</span>
              <span className="inline-flex items-center gap-1 font-medium text-emerald-700">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                {quality.fieldOfViewAcceptable ? 'Acceptable' : 'Deficient'}
              </span>
            </div>
          </div>

          {quality.notes && (
            <p className="mt-2 pt-2 border-t border-clinical-100 text-clinical-500 text-[11px] leading-relaxed">
              {quality.notes}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
