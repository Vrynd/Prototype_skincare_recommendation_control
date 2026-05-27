import React from 'react';
import { Plus, X } from 'lucide-react';

interface ContextualCTAProps {
  title: string;
  description: string;
  primaryButtonText: string;
  secondaryButtonText?: string;
  onPrimaryClick: () => void;
  onSecondaryClick: () => void;
  isLoading?: boolean;
}

export const ContextualCTA: React.FC<ContextualCTAProps> = ({
  title,
  description,
  primaryButtonText,
  secondaryButtonText = 'Batal & Kembali',
  onPrimaryClick,
  onSecondaryClick,
  isLoading = false,
}) => {
  if (isLoading) return null;

  return (
    <div className="glass-card rounded-3xl p-5 border border-white/5 shadow-2xl flex flex-col sm:flex-row justify-between items-center gap-4 bg-linear-to-r from-white/2 to-white/0 backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="space-y-1 text-center sm:text-left select-none">
        <h4 className="font-semibold text-xs text-white leading-none">{title}</h4>
        <p className="text-[10px] text-gray-400 max-w-lg leading-relaxed font-medium mt-0.5">
          {description}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onSecondaryClick}
          className="flex items-center gap-1.5 px-4 py-2.5 text-[10px] font-bold text-gray-400 hover:text-white bg-white/3 border border-white/5 rounded-xl hover:bg-white/10 hover:border-white/10 transition-all duration-300 cursor-pointer shadow-lg shadow-black/10"
        >
          <X size={12} />
          <span>{secondaryButtonText}</span>
        </button>
        <button
          onClick={onPrimaryClick}
          className="flex items-center gap-1.5 px-5 py-2.5 text-[10px] font-bold text-brand-bg bg-brand-accent rounded-xl hover:bg-white hover:shadow-brand-accent/25 transition-all duration-300 shadow-lg shadow-brand-accent/20 cursor-pointer"
        >
          <Plus size={12} />
          <span>{primaryButtonText}</span>
        </button>
      </div>
    </div>
  );
};
export default ContextualCTA;
