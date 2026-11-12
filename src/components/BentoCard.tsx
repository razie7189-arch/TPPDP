import React from 'react';

interface BentoCardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  badge?: React.ReactNode;
  action?: React.ReactNode;
  noPadding?: boolean;
}

export const BentoCard: React.FC<BentoCardProps> = ({
  children,
  className = '',
  title,
  subtitle,
  badge,
  action,
  noPadding = false,
}) => {
  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] transition-all hover:border-slate-300 ${className}`}
    >
      {(title || subtitle || badge || action) && (
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-slate-100">
          <div>
            {subtitle && (
              <p className="text-[11px] font-medium tracking-wide uppercase text-slate-400">
                {subtitle}
              </p>
            )}
            <div className="flex items-center gap-2 mt-0.5">
              {title && (
                <h3 className="text-base font-semibold text-slate-900 tracking-tight">
                  {title}
                </h3>
              )}
              {badge}
            </div>
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      <div className={noPadding ? '' : 'p-5'}>{children}</div>
    </div>
  );
};
