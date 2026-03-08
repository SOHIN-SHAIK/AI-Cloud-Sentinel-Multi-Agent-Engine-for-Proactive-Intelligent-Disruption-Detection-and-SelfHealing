import { useState } from 'react';
import { LogEntry, Agent } from '../types';
import { Upload, Link2, Unlink, Copy } from 'lucide-react';

interface CenterPanelProps {
  logs: LogEntry[];
  agents: Agent[];
  connectionUrl: string;
  isConnected: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
  onCopyLog: () => void;
  onUrlChange: (url: string) => void;
  onStartAgent: (agentId: string) => void;
  onStopAgent: (agentId: string) => void;
}

export default function CenterPanel({
  logs,
  agents,
  connectionUrl,
  isConnected,
  onConnect,
  onDisconnect,
  onCopyLog,
  onUrlChange,
  onStartAgent,
  onStopAgent,
}: CenterPanelProps) {
  const [pastedLogs, setPastedLogs] = useState('');

  const getLevelColor = (level: string) => {
    const colors = {
      DEBUG: 'text-gray-400 bg-gray-500/10',
      INFO: 'text-blue-400 bg-blue-500/10',
      WARNING: 'text-yellow-400 bg-yellow-500/10',
      ERROR: 'text-red-400 bg-red-500/10',
      SUCCESS: 'text-green-400 bg-green-500/10',
    };
    return colors[level as keyof typeof colors] || 'text-gray-400';
  };

  return (
    <div className="h-screen overflow-y-auto custom-scrollbar bg-gray-950/30 p-6 border-x-2 border-cyan-500/40 shadow-[inset_0_0_10px_rgba(0,188,212,0.08)]">
      <h1 className="text-3xl font-bold text-cyan-400 mb-2">🧠 Gemini Cloud SRE Multi-Agent Dashboard</h1>
      <p className="text-sm text-gray-400 mb-6">
        Autonomous triage → analysis → remediation → validation → stable recovery flow
      </p>

      <div className="mb-6">
        <h2 className="text-lg font-semibold text-cyan-400 mb-3">☁ Cloud Connection</h2>
        <input
          type="text"
          value={connectionUrl}
          onChange={(e) => onUrlChange(e.target.value)}
          className="w-full px-4 py-2 bg-gray-900 border border-cyan-500/50 text-white rounded focus:outline-none focus:border-cyan-400 mb-3"
          placeholder="ws://localhost:9000"
        />
        <div className="flex gap-3">
          <button
            onClick={onConnect}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded transition-all ${
              isConnected
                ? 'bg-cyan-500 text-black border-2 border-cyan-300 shadow-[0_0_15px_rgba(0,188,212,0.5)]'
                : 'bg-transparent border border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-black'
            }`}
          >
            <Link2 className="w-4 h-4" />
            {isConnected ? 'Connected' : 'Connect WS'}
          </button>
          <button
            onClick={onDisconnect}
            disabled={!isConnected}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-transparent border border-red-500 text-red-400 rounded hover:bg-red-500 hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Unlink className="w-4 h-4" />
            Disconnect WS
          </button>
          <button
            onClick={onCopyLog}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-transparent border border-cyan-500 text-cyan-400 rounded hover:bg-cyan-500 hover:text-black transition-all"
          >
            <Copy className="w-4 h-4" />
            Copy Sample Log
          </button>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent mb-6" />

      <div className="mb-6">
        <h2 className="text-lg font-semibold text-cyan-400 mb-3">📂 Upload or Paste Logs</h2>
        <label className="flex items-center justify-center w-full px-4 py-8 border-2 border-dashed border-cyan-500/50 rounded-lg hover:border-cyan-500 transition-colors cursor-pointer mb-3 bg-gray-900/30">
          <div className="text-center">
            <Upload className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
            <span className="text-sm text-gray-400">Choose a log file (txt, log)</span>
          </div>
          <input type="file" accept=".txt,.log" className="hidden" />
        </label>
        <textarea
          value={pastedLogs}
          onChange={(e) => setPastedLogs(e.target.value)}
          placeholder="Paste logs here..."
          className="w-full h-24 px-4 py-2 bg-gray-900 border border-cyan-500/50 text-white rounded focus:outline-none focus:border-cyan-400 resize-none text-sm font-mono"
        />
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent mb-6" />

      <div className="mb-6">
        <h2 className="text-lg font-semibold text-cyan-400 mb-3">
          🧠 Interactive Log Explorer (Logs: {logs.length})
        </h2>
        {logs.length > 0 ? (
          <div className="bg-gray-900/50 border border-cyan-500/30 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-cyan-500/10 border-b border-cyan-500/30">
                  <tr>
                    <th className="px-4 py-2 text-left text-cyan-400 font-semibold">Time</th>
                    <th className="px-4 py-2 text-left text-cyan-400 font-semibold">Level</th>
                    <th className="px-4 py-2 text-left text-cyan-400 font-semibold">Logger</th>
                    <th className="px-4 py-2 text-left text-cyan-400 font-semibold">Message</th>
                  </tr>
                </thead>
                <tbody>
                  {logs
                    .slice(-25)
                    .reverse()
                    .map((log, idx) => (
                      <tr key={idx} className="border-b border-gray-800 hover:bg-cyan-500/5 transition-colors">
                        <td className="px-4 py-2 text-gray-400">{log.time}</td>
                        <td className="px-4 py-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getLevelColor(log.level)}`}>
                            {log.level}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-gray-300">{log.logger}</td>
                        <td className="px-4 py-2 text-gray-300">{log.message}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg px-4 py-8 text-center text-cyan-400">
            No logs yet — trigger agents to populate logs.
          </div>
        )}
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent mb-6" />

      <div className="mb-6">
        <h2 className="text-lg font-semibold text-cyan-400 mb-3">😎 Agent Mission Control</h2>
        <div className="space-y-3">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className="flex items-center justify-between p-3 bg-gray-900/50 border border-cyan-500/30 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-2 h-2 rounded-full ${
                    agent.status === 'Active' || agent.status === 'Running'
                      ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.7)]'
                      : 'bg-gray-500'
                  }`}
                />
                <span className="text-white font-medium">{agent.name}</span>
                <span className="text-xs text-gray-400">— {agent.status}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onStartAgent(agent.id)}
                  className="px-3 py-1 bg-transparent border border-green-500 text-green-400 rounded hover:bg-green-500 hover:text-black transition-all text-sm"
                >
                  ▶ Start
                </button>
                <button
                  onClick={() => onStopAgent(agent.id)}
                  className="px-3 py-1 bg-transparent border border-red-500 text-red-400 rounded hover:bg-red-500 hover:text-black transition-all text-sm"
                >
                  ⏹ Stop
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent mb-6" />

      <div className="mb-6">
        <h2 className="text-lg font-semibold text-cyan-400 mb-3">📈 Agent Load Heatmap</h2>
        <div className="space-y-3">
          {agents.map((agent) => (
            <div key={agent.id}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-300">{agent.name}</span>
                <span className="text-cyan-400 font-medium">{agent.load}% load</span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
                  style={{ width: `${agent.load}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent mb-6" />

      <div className="mb-6">
        <h2 className="text-lg font-semibold text-cyan-400 mb-3">💬 AI Insight Feed</h2>
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-blue-300 text-sm">
          AnalysisAgent correlated recent latency spikes with deployment D-274.
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold text-cyan-400 mb-3">🕒 Event Timeline</h2>
        <div className="bg-gray-900/50 border border-cyan-500/30 rounded-lg p-4 space-y-2 text-sm">
          <div className="flex items-center gap-3">
            <span className="text-cyan-400 font-mono">03:15</span>
            <span className="text-gray-300">— Disruption simulated</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-cyan-400 font-mono">03:16</span>
            <span className="text-gray-300">— Anomaly detected by TriageAgent</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-cyan-400 font-mono">03:17</span>
            <span className="text-gray-300">— Root cause identified</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-cyan-400 font-mono">03:18</span>
            <span className="text-gray-300">— Patch deployed</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-cyan-400 font-mono">03:19</span>
            <span className="text-gray-300">— System stable</span>
          </div>
        </div>
      </div>
    </div>
  );
}
