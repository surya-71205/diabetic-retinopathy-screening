import React, { useState, useRef } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Maximize2, 
  Minimize2, 
  Layers, 
  Columns, 
  Sliders, 
  Eye, 
  Info,
  Sparkles
} from 'lucide-react';
import { DRStage, EyeLaterality } from '../../types';

interface RetinalViewerProps {
  fundusImageUrl: string;
  xaiHeatmapUrl: string;
  stage: DRStage;
  eye?: EyeLaterality;
  confidence?: number;
}

type ViewMode = 'side-by-side' | 'blend-overlay' | 'fundus-only' | 'xai-only';

export const RetinalViewer: React.FC<RetinalViewerProps> = ({
  fundusImageUrl,
  xaiHeatmapUrl,
  stage,
  eye = 'Right Eye (OD)',
  confidence,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('side-by-side');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [heatmapOpacity, setHeatmapOpacity] = useState<number>(65); // 0 - 100%
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showLesionGuide, setShowLesionGuide] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.3, 3.0));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.3, 0.7));
  const handleResetZoom = () => setZoomLevel(1);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div 
      ref={containerRef}
      className={`bg-slate-900 text-slate-100 rounded-lg border border-slate-800 flex flex-col overflow-hidden transition-all duration-200 ${
        isFullscreen 
          ? 'fixed inset-0 z-50 rounded-none w-screen h-screen' 
          : 'relative w-full'
      }`}
    >
      {/* Viewer Header / Toolbar */}
      <div className="bg-slate-950/80 border-b border-slate-800/80 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 select-none">
        <div className="flex items-center gap-2.5 text-xs text-slate-300">
          <span className="font-semibold text-white tracking-wide">{eye}</span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-400">Predicted Stage:</span>
          <span className="font-medium text-amber-400">{stage}</span>
          {confidence !== undefined && (
            <>
              <span className="text-slate-500">|</span>
              <span className="text-slate-400">Confidence:</span>
              <span className="font-medium text-emerald-400">{confidence}%</span>
            </>
          )}
        </div>

        {/* View Mode Controls */}
        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded p-0.5 text-xs">
          <button
            type="button"
            onClick={() => setViewMode('side-by-side')}
            className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1.5 ${
              viewMode === 'side-by-side'
                ? 'bg-slate-800 text-white font-medium shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Side-by-side comparison"
          >
            <Columns className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Dual View</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('blend-overlay')}
            className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1.5 ${
              viewMode === 'blend-overlay'
                ? 'bg-slate-800 text-white font-medium shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Blend heatmap over fundus"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Overlay Blend</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('fundus-only')}
            className={`px-2 py-1 rounded transition-colors ${
              viewMode === 'fundus-only'
                ? 'bg-slate-800 text-white font-medium'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Original Retinal Image only"
          >
            Fundus
          </button>

          <button
            type="button"
            onClick={() => setViewMode('xai-only')}
            className={`px-2 py-1 rounded transition-colors ${
              viewMode === 'xai-only'
                ? 'bg-slate-800 text-white font-medium'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="AI Attention Heatmap only"
          >
            Heatmap
          </button>
        </div>

        {/* Zoom & Utility Actions */}
        <div className="flex items-center gap-1">
          {/* Opacity Slider for Overlay Blend Mode */}
          {viewMode === 'blend-overlay' && (
            <div className="flex items-center gap-2 px-2 py-1 bg-slate-900 border border-slate-800 rounded mr-2 text-xs">
              <Sliders className="w-3 h-3 text-slate-400" />
              <span className="text-slate-400 text-[11px]">Heatmap:</span>
              <input
                type="range"
                min="0"
                max="100"
                value={heatmapOpacity}
                onChange={(e) => setHeatmapOpacity(Number(e.target.value))}
                className="w-16 h-1.5 accent-teal-500 bg-slate-700 rounded cursor-pointer"
                title={`Heatmap opacity: ${heatmapOpacity}%`}
              />
              <span className="text-slate-300 w-7 text-right font-mono text-[10px]">
                {heatmapOpacity}%
              </span>
            </div>
          )}

          <div className="flex items-center bg-slate-900 border border-slate-800 rounded text-slate-300">
            <button
              type="button"
              onClick={handleZoomOut}
              disabled={zoomLevel <= 0.7}
              className="p-1.5 hover:text-white disabled:opacity-30 transition-colors"
              title="Zoom Out"
              aria-label="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-[11px] font-mono px-1.5 text-slate-400 min-w-10 text-center">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              type="button"
              onClick={handleZoomIn}
              disabled={zoomLevel >= 3.0}
              className="p-1.5 hover:text-white disabled:opacity-30 transition-colors"
              title="Zoom In"
              aria-label="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleResetZoom}
              className="p-1.5 hover:text-white border-l border-slate-800 transition-colors"
              title="Reset Zoom"
              aria-label="Reset Zoom"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowLesionGuide(!showLesionGuide)}
            className={`p-1.5 rounded border transition-colors ${
              showLesionGuide 
                ? 'bg-teal-900/60 border-teal-600 text-teal-300' 
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
            title="Show Colormap Legend & Guidance"
            aria-label="Toggle Guidance Legend"
          >
            <Info className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-1.5 bg-slate-900 border border-slate-800 rounded text-slate-300 hover:text-white transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Inspection'}
            aria-label={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Inspection'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Guidance Legend Drawer */}
      {showLesionGuide && (
        <div className="bg-slate-950/90 border-b border-slate-800/80 px-4 py-2 text-xs text-slate-300 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-medium text-slate-200">XAI Saliency Colormap:</span>
            <div className="flex items-center gap-1.5 font-mono text-[10px]">
              <span className="text-sky-400">Low</span>
              <div className="w-24 h-2 rounded-full bg-gradient-to-r from-blue-600 via-amber-400 to-red-600" />
              <span className="text-red-400">High Influence</span>
            </div>
          </div>
          <div className="text-[11px] text-slate-400">
            Highlighted regions reflect convolutional feature map activations influencing the predicted stage. Not a lesion segmentation map.
          </div>
        </div>
      )}

      {/* Image Canvas Container */}
      <div 
        className={`relative flex-1 bg-black overflow-auto p-4 flex items-center justify-center min-h-[360px] ${
          isFullscreen ? 'h-full' : 'max-h-[560px]'
        }`}
      >
        {/* MODE: SIDE-BY-SIDE */}
        {viewMode === 'side-by-side' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full h-full max-w-5xl items-center">
            {/* Left: Original Fundus */}
            <div className="flex flex-col items-center">
              <div className="w-full flex items-center justify-between pb-1.5 px-1 text-xs text-slate-400">
                <span className="font-medium text-slate-300">Original Retinal Fundus</span>
                <span className="text-[11px] text-slate-500">True-color fundus photography</span>
              </div>
              <div className="relative w-full aspect-square max-w-[420px] bg-slate-950 rounded border border-slate-800 overflow-hidden flex items-center justify-center">
                <img
                  src={fundusImageUrl}
                  alt="Retinal Fundus Photography"
                  className="w-full h-full object-contain transition-transform duration-100 ease-out select-none"
                  style={{ transform: `scale(${zoomLevel})` }}
                  draggable={false}
                />
              </div>
            </div>

            {/* Right: AI Explainability (XAI Heatmap) */}
            <div className="flex flex-col items-center">
              <div className="w-full flex items-center justify-between pb-1.5 px-1 text-xs text-slate-400">
                <span className="font-medium text-teal-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                  AI Attention / Heatmap
                </span>
                <span className="text-[11px] text-slate-500">Grad-CAM Activation</span>
              </div>
              <div className="relative w-full aspect-square max-w-[420px] bg-slate-950 rounded border border-slate-800 overflow-hidden flex items-center justify-center">
                <img
                  src={xaiHeatmapUrl}
                  alt="AI Explainability Grad-CAM Heatmap"
                  className="w-full h-full object-contain transition-transform duration-100 ease-out select-none"
                  style={{ transform: `scale(${zoomLevel})` }}
                  draggable={false}
                />
              </div>
            </div>
          </div>
        )}

        {/* MODE: BLEND OVERLAY */}
        {viewMode === 'blend-overlay' && (
          <div className="flex flex-col items-center w-full">
            <div className="relative w-full aspect-square max-w-[460px] bg-slate-950 rounded border border-slate-800 overflow-hidden flex items-center justify-center">
              {/* Base Fundus */}
              <img
                src={fundusImageUrl}
                alt="Retinal Fundus"
                className="absolute inset-0 w-full h-full object-contain transition-transform duration-100 ease-out select-none"
                style={{ transform: `scale(${zoomLevel})` }}
                draggable={false}
              />
              {/* Heatmap Overlay with Opacity */}
              <img
                src={xaiHeatmapUrl}
                alt="Heatmap Overlay"
                className="absolute inset-0 w-full h-full object-contain mix-blend-screen transition-transform duration-100 ease-out select-none pointer-events-none"
                style={{ 
                  transform: `scale(${zoomLevel})`,
                  opacity: heatmapOpacity / 100 
                }}
                draggable={false}
              />
            </div>
            <p className="text-xs text-slate-400 mt-2 text-center">
              Heatmap blended over fundus photo at {heatmapOpacity}% opacity.
            </p>
          </div>
        )}

        {/* MODE: FUNDUS ONLY */}
        {viewMode === 'fundus-only' && (
          <div className="relative w-full aspect-square max-w-[480px] bg-slate-950 rounded border border-slate-800 overflow-hidden flex items-center justify-center">
            <img
              src={fundusImageUrl}
              alt="Retinal Fundus Photography"
              className="w-full h-full object-contain transition-transform duration-100 ease-out select-none"
              style={{ transform: `scale(${zoomLevel})` }}
              draggable={false}
            />
          </div>
        )}

        {/* MODE: XAI ONLY */}
        {viewMode === 'xai-only' && (
          <div className="relative w-full aspect-square max-w-[480px] bg-slate-950 rounded border border-slate-800 overflow-hidden flex items-center justify-center">
            <img
              src={xaiHeatmapUrl}
              alt="AI Grad-CAM Activation Heatmap"
              className="w-full h-full object-contain transition-transform duration-100 ease-out select-none"
              style={{ transform: `scale(${zoomLevel})` }}
              draggable={false}
            />
          </div>
        )}
      </div>

      {/* Viewer Footer Note */}
      <div className="bg-slate-950 px-4 py-2 border-t border-slate-800/80 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <Eye className="w-3.5 h-3.5 text-slate-500" />
          <span>Highlighted regions indicate areas influencing the neural network prediction.</span>
        </div>
        <div className="text-slate-500">
          Scroll or use toolbar buttons to zoom & compare.
        </div>
      </div>
    </div>
  );
};
