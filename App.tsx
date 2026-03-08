import { useState, useEffect } from 'react';
import LeftPanel from './components/LeftPanel';
import CenterPanel from './components/CenterPanel';
import RightPanel from './components/RightPanel';
import Notification from './components/Notification';
import { FeatureFlag, Model, Agent, LogEntry } from './types';

interface NotificationData {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

function App() {
  const [featureFlags, setFeatureFlags] = useState<FeatureFlag[]>([
    { id: 'auto-heal', label: 'Enable Auto-Healing', enabled: true },
    { id: 'predictive', label: 'Enable Predictive Monitoring', enabled: true },
    { id: 'anomaly', label: 'Enable Anomaly Detection', enabled: true },
    { id: 'cloud-sync', label: 'Enable Cloud Sync', enabled: true },
  ]);

  const [models, setModels] = useState<Model[]>([
    { id: '1', name: 'llama3.17b', provider: 'ollama', status: 'registered' },
    { id: '2', name: 'llama3.8b', provider: 'ollama', status: 'registered' },
    { id: '3', name: 'codellama13b', provider: 'ollama', status: 'registered' },
  ]);

  const [agents, setAgents] = useState<Agent[]>([
    { id: '1', name: 'Triage Agent', status: 'Active', load: 45 },
    { id: '2', name: 'Analysis Agent', status: 'Active', load: 62 },
    { id: '3', name: 'Remediation Agent', status: 'Active', load: 38 },
    { id: '4', name: 'Monitoring Agent', status: 'Active', load: 71 },
  ]);

  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isHealing, setIsHealing] = useState(false);
  const [connectionUrl, setConnectionUrl] = useState('ws://localhost:9000');
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [systemHealth, setSystemHealth] = useState(95);

  useEffect(() => {
    const interval = setInterval(() => {
      setAgents((prevAgents) =>
        prevAgents.map((agent) => ({
          ...agent,
          load: Math.max(20, Math.min(95, agent.load + (Math.random() - 0.5) * 10)),
        }))
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const activeAgents = agents.filter((a) => a.status === 'Active' || a.status === 'Running').length;
    const avgLoad = agents.reduce((sum, a) => sum + a.load, 0) / agents.length;
    const health = Math.round((activeAgents / agents.length) * 50 + (100 - avgLoad) * 0.5);
    setSystemHealth(Math.max(60, Math.min(100, health)));
  }, [agents]);

  const addNotification = (message: string, type: 'success' | 'error' | 'info' | 'warning') => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);
  };

  const removeNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const addLog = (level: LogEntry['level'], logger: string, message: string) => {
    const time = new Date().toLocaleTimeString('en-US', { hour12: false });
    setLogs((prev) => [...prev, { time, level, logger, message }]);
  };

  const handleFeatureFlagToggle = (id: string, enabled: boolean) => {
    setFeatureFlags((prev) => prev.map((flag) => (flag.id === id ? { ...flag, enabled } : flag)));
    addNotification(`Feature flag ${enabled ? 'enabled' : 'disabled'}`, 'info');
  };

  const handleAddModel = (modelName: string) => {
    const newModel: Model = {
      id: Date.now().toString(),
      name: modelName,
      provider: 'ollama',
      status: 'registered',
    };
    setModels((prev) => [...prev, newModel]);
    addNotification(`Model ${modelName} added successfully`, 'success');
    addLog('SUCCESS', 'Model Registry', `Added model ${modelName}`);
  };

  const handleDeleteModel = (id: string) => {
    const model = models.find((m) => m.id === id);
    setModels((prev) => prev.filter((m) => m.id !== id));
    addNotification(`Model ${model?.name} deleted`, 'warning');
    addLog('WARNING', 'Model Registry', `Deleted model ${model?.name}`);
  };

  const handleAgentAction = (agentId: string, action: string) => {
    const agent = agents.find((a) => a.id === agentId);
    if (!agent) return;

    const messages = [
      'diagnostic routine executed.',
      'processed workload successfully.',
      'latency spike detected.',
      'endpoint timeout occurred.',
      'auto-heal operation completed.',
    ];
    const levels: LogEntry['level'][] = ['DEBUG', 'INFO', 'WARNING', 'ERROR', 'SUCCESS'];
    const level = levels[Math.floor(Math.random() * levels.length)];
    const message = messages[Math.floor(Math.random() * messages.length)];

    addLog(level, agent.name, `${agent.name} ${message}`);
    addNotification(`${agent.name} triggered`, 'info');
  };

  const handleSimulateError = () => {
    setIsHealing(true);
    addLog('ERROR', 'System', 'Error burst simulated - multiple failures detected');
    addNotification('Error burst simulated', 'error');

    setAgents((prev) =>
      prev.map((agent) => ({
        ...agent,
        status: 'Healing',
        load: Math.min(95, agent.load + 20),
      }))
    );
  };

  const handleTriggerHeal = () => {
    setIsHealing(false);
    addLog('SUCCESS', 'Self-Heal Engine', 'Self-Healing successful — System Recovered.');
    addNotification('Self-Healing completed successfully', 'success');

    setAgents((prev) =>
      prev.map((agent) => ({
        ...agent,
        status: 'Active',
        load: Math.max(30, agent.load - 15),
      }))
    );
  };

  const handleConnect = () => {
    if (!isConnected) {
      setIsConnected(true);
      addNotification('Connected to cloud environment', 'success');
      addLog('SUCCESS', 'Cloud Connection', `Connected to ${connectionUrl}`);
    }
  };

  const handleDisconnect = () => {
    if (isConnected) {
      setIsConnected(false);
      addNotification('Disconnected from cloud environment', 'warning');
      addLog('WARNING', 'Cloud Connection', 'Disconnected from cloud');
    }
  };

  const handleCopyLog = () => {
    const sampleLog = `[2024-12-13 15:30:45] INFO: System initialized successfully
[2024-12-13 15:30:46] DEBUG: Loading configuration from config.yaml
[2024-12-13 15:30:47] SUCCESS: All agents started`;

    navigator.clipboard.writeText(sampleLog);
    addNotification('Sample log copied to clipboard', 'success');
  };

  const handleStartAgent = (agentId: string) => {
    const agent = agents.find((a) => a.id === agentId);
    if (!agent) return;

    setAgents((prev) =>
      prev.map((a) => (a.id === agentId ? { ...a, status: 'Active' as const } : a))
    );
    addLog('INFO', agent.name, `${agent.name} started successfully.`);
    addNotification(`${agent.name} started`, 'success');
  };

  const handleStopAgent = (agentId: string) => {
    const agent = agents.find((a) => a.id === agentId);
    if (!agent) return;

    setAgents((prev) =>
      prev.map((a) => (a.id === agentId ? { ...a, status: 'Stopped' as const } : a))
    );
    addLog('WARNING', agent.name, `${agent.name} stopped by user.`);
    addNotification(`${agent.name} stopped`, 'warning');
  };

  const handleLoadSample = (sampleType: string) => {
    addNotification(`Loaded ${sampleType} sample data`, 'success');
    addLog('INFO', 'Configuration Editor', `Loaded sample configuration for ${sampleType}`);
  };

  return (
    <div className="h-screen overflow-hidden bg-gray-950">
      <div className="flex h-full">
        <div className="w-[23%]">
          <LeftPanel
            featureFlags={featureFlags}
            models={models}
            agents={agents}
            onFeatureFlagToggle={handleFeatureFlagToggle}
            onAddModel={handleAddModel}
            onDeleteModel={handleDeleteModel}
            onAgentAction={handleAgentAction}
            onSimulateError={handleSimulateError}
            onTriggerHeal={handleTriggerHeal}
            isHealing={isHealing}
            onLoadSample={handleLoadSample}
          />
        </div>

        <div className="flex-1">
          <CenterPanel
            logs={logs}
            agents={agents}
            connectionUrl={connectionUrl}
            isConnected={isConnected}
            onConnect={handleConnect}
            onDisconnect={handleDisconnect}
            onCopyLog={handleCopyLog}
            onUrlChange={setConnectionUrl}
            onStartAgent={handleStartAgent}
            onStopAgent={handleStopAgent}
          />
        </div>

        <div className="w-[23%]">
          <RightPanel
            agents={agents}
            isCloudConnected={isConnected}
            systemHealth={systemHealth}
          />
        </div>
      </div>

      <div className="fixed top-0 right-0 z-50 space-y-2 p-4">
        {notifications.map((notification) => (
          <Notification
            key={notification.id}
            message={notification.message}
            type={notification.type}
            onClose={() => removeNotification(notification.id)}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
