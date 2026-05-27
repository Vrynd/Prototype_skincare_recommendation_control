import React from 'react';
import { Cpu, Database, HardDrive, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

export const StatusIndicator: React.FC = () => {
  const nodes = [
    {
      id: 'api',
      name: 'Skynet API Gateway Gateway',
      status: 'Operational',
      uptime: '99.99%',
      latency: '24ms',
      load: '14%',
      icon: Cpu,
    },
    {
      id: 'db',
      name: 'Cyberdyne DB Cluster',
      status: 'Operational',
      uptime: '100.00%',
      latency: '8ms',
      load: '42%',
      icon: Database,
    },
    {
      id: 'storage',
      name: 'Object Storage Node-AP',
      status: 'Operational',
      uptime: '99.95%',
      latency: '112ms',
      load: '67%',
      icon: HardDrive,
    },
    {
      id: 'backup',
      name: 'Disaster Recovery Core',
      status: 'Degraded',
      uptime: '98.42%',
      latency: '420ms',
      load: '92%',
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {nodes.map((node) => {
          const Icon = node.icon;
          const isOperational = node.status === 'Operational';
          
          return (
            <div key={node.id} className="glass-card glass-card-hover p-6 rounded-2xl relative overflow-hidden flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl border ${isOperational ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-amber-400 bg-amber-500/10 border-amber-500/20'}`}>
                    <Icon size={18} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-xs text-white truncate max-w-[140px]">{node.name}</h4>
                    <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block mt-0.5">{node.id} cluster</span>
                  </div>
                </div>
                
                {/* Glowing LED Status Indicator */}
                <span className="flex h-2.5 w-2.5 relative">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isOperational ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                  <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isOperational ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                </span>
              </div>

              <div className="mt-6 space-y-2 border-t border-white/5 pt-4">
                <div className="flex justify-between text-[11px]">
                  <span className="text-gray-400">Status</span>
                  <span className={`font-semibold ${isOperational ? 'text-emerald-400' : 'text-amber-400'}`}>{node.status}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-gray-400">Uptime</span>
                  <span className="text-white font-medium">{node.uptime}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-gray-400">Latency</span>
                  <span className="text-white font-medium">{node.latency}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-gray-400">Load</span>
                  <span className="text-white font-medium">{node.load}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail Metrics Logs */}
      <div className="glass-card p-6 rounded-2xl">
        <h3 className="font-display font-bold text-base text-white mb-4">System Incidents & Maintenance Logs</h3>
        <div className="space-y-4">
          <div className="flex gap-4 p-4 rounded-xl bg-white/2 border border-white/5">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 h-10 w-10 flex items-center justify-center flex-shrink-0">
              <AlertTriangle size={18} />
            </div>
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <h4 className="text-xs font-semibold text-white">Disaster Recovery Core Latency Warning</h4>
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold uppercase w-fit">Active</span>
              </div>
              <p className="text-[11px] text-gray-400 mt-1">High latency reported during backup synchronization process. Automated fallback routing successfully engaged. No data loss reported.</p>
              <span className="text-[9px] text-gray-500 font-medium mt-2 block">May 26, 2026 - 06:12 UTC</span>
            </div>
          </div>

          <div className="flex gap-4 p-4 rounded-xl bg-white/2 border border-white/5">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 h-10 w-10 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 size={18} />
            </div>
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <h4 className="text-xs font-semibold text-white">Scheduled Maintenance: Database Sharding Phase 2</h4>
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold uppercase w-fit">Resolved</span>
              </div>
              <p className="text-[11px] text-gray-400 mt-1">Database clustering, indexing, and sharding process concluded with 0 downtime. Performance optimized by 14.2%.</p>
              <span className="text-[9px] text-gray-500 font-medium mt-2 block">May 25, 2026 - 22:00 UTC</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
