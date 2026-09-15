import { DRStage, QualityRating, AnalysisStatus } from '../types';

export function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export function formatDateTime(dateString: string): string {
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateString;
  }
}

export function getStageColor(stage: DRStage): {
  badge: string;
  dot: string;
  border: string;
  bg: string;
  text: string;
} {
  switch (stage) {
    case 'No DR':
      return {
        badge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        dot: 'bg-emerald-600',
        border: 'border-emerald-300',
        bg: 'bg-emerald-50/60',
        text: 'text-emerald-800',
      };
    case 'Mild NPDR':
      return {
        badge: 'bg-amber-50 text-amber-800 border-amber-200',
        dot: 'bg-amber-500',
        border: 'border-amber-300',
        bg: 'bg-amber-50/60',
        text: 'text-amber-800',
      };
    case 'Moderate NPDR':
      return {
        badge: 'bg-orange-50 text-orange-800 border-orange-200',
        dot: 'bg-orange-600',
        border: 'border-orange-300',
        bg: 'bg-orange-50/60',
        text: 'text-orange-800',
      };
    case 'Severe NPDR':
      return {
        badge: 'bg-rose-50 text-rose-800 border-rose-200',
        dot: 'bg-rose-600',
        border: 'border-rose-300',
        bg: 'bg-rose-50/60',
        text: 'text-rose-800',
      };
    case 'PDR':
      return {
        badge: 'bg-red-100 text-red-900 border-red-300 font-semibold',
        dot: 'bg-red-700',
        border: 'border-red-400',
        bg: 'bg-red-50/80',
        text: 'text-red-900',
      };
  }
}

export function getQualityBadgeColor(rating: QualityRating): {
  badge: string;
  dot: string;
} {
  switch (rating) {
    case 'Good':
      return {
        badge: 'bg-slate-100 text-slate-800 border-slate-200',
        dot: 'bg-emerald-600',
      };
    case 'Acceptable':
      return {
        badge: 'bg-amber-50 text-amber-800 border-amber-200',
        dot: 'bg-amber-500',
      };
    case 'Needs Review':
      return {
        badge: 'bg-rose-50 text-rose-800 border-rose-200',
        dot: 'bg-rose-500',
      };
  }
}

export function getStatusBadgeColor(status: AnalysisStatus): {
  badge: string;
} {
  switch (status) {
    case 'Completed':
      return { badge: 'bg-slate-100 text-slate-700 border-slate-200' };
    case 'Reviewed':
      return { badge: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
    case 'Review':
      return { badge: 'bg-amber-50 text-amber-800 border-amber-300 font-medium' };
  }
}
