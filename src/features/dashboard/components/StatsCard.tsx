import type { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: LucideIcon;
  glowColor: string; // tailwind class e.g., 'bg-blue-500'
  iconColor: string; // tailwind class e.g., 'text-blue-400 bg-blue-500/10 border-blue-500/20'
}

export const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  change, 
  isPositive, 
  icon: Icon,
  glowColor,
  iconColor
}) => {
  return (
    <div className="glass-card glass-card-hover p-6 rounded-2xl relative overflow-hidden flex flex-col justify-between">
      {/* Background radial Glow */}
      <div className={`absolute -right-10 -top-10 w-24 h-24 rounded-full blur-3xl opacity-15 ${glowColor}`} />
      
      <div className="flex justify-between items-start">
        <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">{title}</span>
        <div className={`p-2.5 rounded-xl border ${iconColor} shadow-lg shadow-black/20`}>
          <Icon size={18} />
        </div>
      </div>
      
      <div className="mt-4">
        <h3 className="text-2xl font-bold font-display text-white tracking-tight">{value}</h3>
        <div className="flex items-center gap-1.5 mt-1 text-[11px]">
          <span className={`font-semibold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
            {change}
          </span>
          <span className="text-gray-500 font-medium">vs bulan lalu</span>
        </div>
      </div>
    </div>
  );
};
