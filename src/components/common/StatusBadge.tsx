import React from 'react';
import { DRStage } from '../../types';
import { getStageColor } from '../../utils/formatters';

interface StatusBadgeProps {
  stage: DRStage;
  size?: 'sm' | 'md' | 'lg';
  showDot?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  stage, 
  size = 'md', 
  showDot = true 
}) => {
  const colors = getStageColor(stage);
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs sm:text-sm px-2.5 py-1',
    lg: 'text-sm sm:text-base px-3 py-1.5 font-medium',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded border ${colors.badge} ${sizeClasses[size]}`}
    >
      {showDot && (
        <span
          className={`h-2 w-2 rounded-full ${colors.dot} shrink-0`}
          aria-hidden="true"
        />
      )}
      <span>{stage}</span>
    </span>
  );
};
