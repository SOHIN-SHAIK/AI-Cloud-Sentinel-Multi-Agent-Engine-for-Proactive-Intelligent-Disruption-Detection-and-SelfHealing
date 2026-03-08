export interface LogEntry {
  time: string;
  level: 'DEBUG' | 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS';
  logger: string;
  message: string;
}

export interface Agent {
  id: string;
  name: string;
  status: 'Active' | 'Stopped' | 'Running' | 'Healing' | 'Stable' | 'Normal';
  load: number;
}

export interface Model {
  id: string;
  name: string;
  provider: string;
  status: 'registered' | 'unregistered';
}

export interface FeatureFlag {
  id: string;
  label: string;
  enabled: boolean;
}

export interface ConnectionState {
  connected: boolean;
  url: string;
}

export interface SystemHealth {
  overall: number;
  agents: Record<string, number>;
}
