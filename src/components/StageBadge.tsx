import React from 'react';
import { ReadingStage } from '../types';
import { STAGE_CONFIG } from '../lib/storage';

interface StageBadgeProps {
  stage: ReadingStage;
  size?: 'sm' | 'md' | 'lg';
  showGroup?: boolean;
}

export const StageBadge: React.FC<StageBadgeProps> = ({
  stage,
  size = 'md',
  showGroup = false,
}) => {
  const config = STAGE_CONFIG[stage] || {
    label: stage,
    group: 'iqra-intervensi',
    colorClass: 'bg-slate-200 text-slate-800',
    bgStyle: '#e2e8f0',
    textStyle: '#0f172a',
  };

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3.5 py-1.5 font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded font-mono font-medium tracking-tight whitespace-nowrap shadow-xs transition-all ${sizeClasses[size]}`}
      style={{
        backgroundColor: config.bgStyle,
        color: config.textStyle,
        border: '1px solid rgba(0,0,0,0.08)',
      }}
    >
      <span>{config.label}</span>
      {showGroup && (
        <span className="text-[10px] opacity-75 font-sans">
          {config.group === 'iqra-intervensi' && '· Intervensi'}
          {config.group === 'iqra-perkembangan' && '· Perkembangan'}
          {config.group === 'quran-awal' && '· Al-Quran'}
          {config.group === 'quran-menengah' && '· Al-Quran'}
          {config.group === 'khatam' && '· Syabas!'}
        </span>
      )}
    </span>
  );
};
