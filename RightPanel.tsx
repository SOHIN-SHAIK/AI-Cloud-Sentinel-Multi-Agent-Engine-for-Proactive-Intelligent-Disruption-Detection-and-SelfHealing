import Expander from './Expander';
import { Agent } from '../types';
import { Activity, Wifi, AlertTriangle, Heart } from 'lucide-react';

interface RightPanelProps {
  agents: Agent[];
  isCloudConnected: boolean;
  systemHealth: number;
}

export default function RightPanel({ agents, isCloudConnected, systemHealth }: RightPanelProps) {
  const getStatusColor = (status: string) => {
    const colors = {
      Normal: 'text-green-400',
      Active: 'text-green-400',
      Running: 'text-blue-400',
      Healing: 'text-yellow-400',
      Stable: 'text-green-400',
      Stopped: 'text-gray-400',
    };
    return colors[status as keyof typeof colors] || 'text-gray-400';
  };

  const getHealthColor = (health: number) => {
    if (health >= 90) return 'from-green-500 to-emerald-500';
    if (health >= 70) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-rose-500';
  };

  return (
    <div className="h-screen overflow-y-auto custom-scrollbar bg-gray-950/50 p-4 border-l-2 border-cyan-500/40 shadow-[-4px_0_12px_rgba(0,188,212,0.15)]">
      <h2 className="text-xl font-bold text-cyan-400 mb-6 flex items-center gap-2">
        <Activity className="w-5 h-5" />
        System Monitor
      </h2>

      <Expander title="🧠 Agent Insight Viewer" defaultExpanded={true}>
        <div className="space-y-3">
          {agents.map((agent) => (
            <div key={agent.id} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
              <span className="text-sm text-gray-300">{agent.name}</span>
              <span className={`text-sm font-medium ${getStatusColor(agent.status)}`}>{agent.status}</span>
            </div>
          ))}
        </div>
      </Expander>

      <Expander title="📡 Cloud Link Status" defaultExpanded={true}>
        <div
          className={`flex items-center gap-3 p-3 rounded-lg border ${
            isCloudConnected
              ? 'bg-green-500/10 border-green-500/50 text-green-400'
              : 'bg-red-500/10 border-red-500/50 text-red-400'
          }`}
        >
          <Wifi className={`w-5 h-5 ${isCloudConnected ? 'animate-pulse' : ''}`} />
          <div>
            <div className="font-medium text-sm">
              {isCloudConnected ? 'Connected to cloud environment' : 'Disconnected from cloud'}
            </div>
            <div className="text-xs opacity-80">{isCloudConnected ? '✅ Active' : '❌ Inactive'}</div>
          </div>
        </div>
      </Expander>

      <Expander title="⚠ Active Alerts" defaultExpanded={true}>
        <div className="space-y-2">
          <div className="flex items-start gap-2 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded">
            <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-yellow-400">Minor latency detected in EU region</div>
          </div>
          {systemHealth < 80 && (
            <div className="flex items-start gap-2 p-3 bg-orange-500/10 border border-orange-500/30 rounded">
              <AlertTriangle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-orange-400">System health below optimal threshold</div>
            </div>
          )}
          {agents.some((a) => a.status === 'Stopped') && (
            <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded">
              <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-red-400">Some agents are stopped</div>
            </div>
          )}
        </div>
      </Expander>

      <Expander title="🩺 System Health Gauge" defaultExpanded={true}>
        <div className="space-y-3">
          <div className="relative">
            <div className="h-4 bg-gray-800 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${getHealthColor(systemHealth)} transition-all duration-500`}
                style={{ width: `${systemHealth}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>0%</span>
              <span>100%</span>
            </div>
          </div>
          <div className="text-center">
            <div className={`text-3xl font-bold ${systemHealth >= 80 ? 'text-green-400' : 'text-yellow-400'}`}>
              {systemHealth}%
            </div>
            <div className="text-sm text-gray-400">Overall System Health</div>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-gray-800">
            {agents.slice(0, 4).map((agent) => (
              <div key={agent.id} className="text-center p-2 bg-gray-900/50 rounded">
                <div className="text-xs text-gray-400 mb-1">{agent.name.split(' ')[0]}</div>
                <div className="text-sm font-semibold text-cyan-400">{agent.load}%</div>
              </div>
            ))}
          </div>
        </div>
      </Expander>

      <Expander title="💬 AI Summary" defaultExpanded={true}>
        <div className="space-y-3">
          <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded text-sm text-blue-300">
            RemediationAgent automatically scaled pods to stabilize latency and restore performance.
          </div>
          <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded text-sm text-purple-300">
            AnalysisAgent identified correlation between increased traffic and memory usage.
          </div>
          <div className="p-3 bg-green-500/10 border border-green-500/30 rounded text-sm text-green-300">
            MonitoringAgent detected and prevented potential cascade failure.
          </div>
        </div>
      </Expander>

      <Expander title="📊 Performance Metrics" defaultExpanded={false}>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">Response Time</span>
            <span className="text-sm font-medium text-cyan-400">127ms</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">Uptime</span>
            <span className="text-sm font-medium text-green-400">99.98%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">Incidents Resolved</span>
            <span className="text-sm font-medium text-cyan-400">24</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">Active Monitors</span>
            <span className="text-sm font-medium text-blue-400">{agents.filter((a) => a.status === 'Active').length}</span>
          </div>
        </div>
      </Expander>
    </div>
  );
}
