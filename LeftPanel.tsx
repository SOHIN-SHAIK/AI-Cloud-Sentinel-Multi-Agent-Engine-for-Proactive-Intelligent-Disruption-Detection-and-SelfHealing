import { useState } from 'react';
import Expander from './Expander';
import Toggle from './Toggle';
import { FeatureFlag, Model, Agent, LogEntry } from '../types';
import { Plus, Trash2, PlayCircle, StopCircle } from 'lucide-react';

interface LeftPanelProps {
  featureFlags: FeatureFlag[];
  models: Model[];
  agents: Agent[];
  onFeatureFlagToggle: (id: string, enabled: boolean) => void;
  onAddModel: (model: string) => void;
  onDeleteModel: (id: string) => void;
  onAgentAction: (agentId: string, action: string) => void;
  onSimulateError: () => void;
  onTriggerHeal: () => void;
  isHealing: boolean;
  onLoadSample: (sampleType: string) => void;
}

export default function LeftPanel({
  featureFlags,
  models,
  agents,
  onFeatureFlagToggle,
  onAddModel,
  onDeleteModel,
  onAgentAction,
  onSimulateError,
  onTriggerHeal,
  isHealing,
  onLoadSample,
}: LeftPanelProps) {
  const [showAddModel, setShowAddModel] = useState(false);
  const [showDeleteModel, setShowDeleteModel] = useState(false);
  const [showLoadSample, setShowLoadSample] = useState(false);
  const [selectedModel, setSelectedModel] = useState('');
  const [configText, setConfigText] = useState(
    'log_ingestion:\n  enabled: true\n  sources:\n    - agent_logs\nmonitoring:\n  active: true'
  );

  const availableModels = ['Mistral 7B', 'Gemma 2B', 'Phi-3 Mini', 'LLaVA Vision'];
  const sampleTypes = ['E-commerce Logs', 'Banking System', 'Healthcare API', 'IoT Sensors'];

  return (
    <div className="h-screen overflow-y-auto custom-scrollbar bg-gray-950/50 p-4 border-r-2 border-cyan-500/40 shadow-[4px_0_12px_rgba(0,188,212,0.15)]">
      <h2 className="text-xl font-bold text-cyan-400 mb-6 flex items-center gap-2">
        <span className="text-2xl">🧩</span>
        Configuration & Controls
      </h2>

      <Expander title="⚙ Feature Flags" defaultExpanded={true}>
        <div className="space-y-1">
          {featureFlags.map((flag) => (
            <Toggle
              key={flag.id}
              label={flag.label}
              enabled={flag.enabled}
              onChange={(enabled) => onFeatureFlagToggle(flag.id, enabled)}
            />
          ))}
        </div>
      </Expander>

      <Expander title="📦 Model Registry" defaultExpanded={true}>
        <div className="space-y-2 mb-3">
          {models
            .filter((m) => m.status === 'registered')
            .map((model) => (
              <div key={model.id} className="text-sm text-green-400">
                ✅ {model.name} ({model.provider}) — registered
              </div>
            ))}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowAddModel(!showAddModel)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-transparent border border-cyan-500 text-cyan-400 rounded-md hover:bg-cyan-500 hover:text-black transition-all text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Model
          </button>
          <button
            onClick={() => setShowDeleteModel(!showDeleteModel)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-transparent border border-red-500 text-red-400 rounded-md hover:bg-red-500 hover:text-black transition-all text-sm"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>

        {showAddModel && (
          <div className="mt-3 p-3 bg-gray-800/50 rounded border border-cyan-500/30">
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full px-3 py-2 bg-gray-900 border border-cyan-500/50 text-white rounded text-sm mb-2 focus:outline-none focus:border-cyan-400"
            >
              <option value="">Select a model...</option>
              {availableModels.map((model) => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}
            </select>
            <button
              onClick={() => {
                if (selectedModel) {
                  onAddModel(selectedModel);
                  setShowAddModel(false);
                  setSelectedModel('');
                }
              }}
              className="w-full px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition-colors"
            >
              ✅ Confirm Add
            </button>
          </div>
        )}

        {showDeleteModel && (
          <div className="mt-3 p-3 bg-gray-800/50 rounded border border-red-500/30">
            <div className="space-y-2">
              {models
                .filter((m) => m.status === 'registered')
                .map((model) => (
                  <button
                    key={model.id}
                    onClick={() => {
                      onDeleteModel(model.id);
                      setShowDeleteModel(false);
                    }}
                    className="w-full px-3 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded text-sm transition-colors text-left"
                  >
                    🗑 {model.name}
                  </button>
                ))}
            </div>
          </div>
        )}
      </Expander>

      <Expander title="🤖 Agents" defaultExpanded={true}>
        <div className="space-y-2">
          {agents.map((agent) => (
            <button
              key={agent.id}
              onClick={() => onAgentAction(agent.id, 'trigger')}
              className="w-full px-3 py-2 bg-transparent border border-cyan-500/50 text-cyan-400 rounded hover:bg-cyan-500 hover:text-black transition-all text-sm text-left"
            >
              {agent.name}
            </button>
          ))}
        </div>
      </Expander>

      <Expander title="🧾 Configuration Editor" defaultExpanded={false}>
        <textarea
          value={configText}
          onChange={(e) => setConfigText(e.target.value)}
          className="w-full h-32 px-3 py-2 bg-gray-900 border border-cyan-500/50 text-white text-xs font-mono rounded focus:outline-none focus:border-cyan-400 resize-none"
        />
        <div className="flex gap-2 mt-3">
          <button className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition-colors">
            ✅ Apply
          </button>
          <button
            onClick={() => setShowLoadSample(!showLoadSample)}
            className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
          >
            📂 Load Sample
          </button>
        </div>

        {showLoadSample && (
          <div className="mt-3 p-3 bg-gray-800/50 rounded border border-cyan-500/30">
            <select
              onChange={(e) => {
                if (e.target.value) {
                  onLoadSample(e.target.value);
                  setShowLoadSample(false);
                }
              }}
              className="w-full px-3 py-2 bg-gray-900 border border-cyan-500/50 text-white rounded text-sm focus:outline-none focus:border-cyan-400"
            >
              <option value="">Select sample data...</option>
              {sampleTypes.map((sample) => (
                <option key={sample} value={sample}>
                  {sample}
                </option>
              ))}
            </select>
          </div>
        )}
      </Expander>

      <Expander title="💊 Self-Heal Controls" defaultExpanded={true}>
        <div className="flex gap-2">
          <button
            onClick={onSimulateError}
            className="flex-1 px-3 py-2 bg-transparent border border-yellow-500 text-yellow-400 rounded hover:bg-yellow-500 hover:text-black transition-all text-sm"
          >
            ⚠ Simulate Error
          </button>
          <button
            onClick={onTriggerHeal}
            className="flex-1 px-3 py-2 bg-transparent border border-green-500 text-green-400 rounded hover:bg-green-500 hover:text-black transition-all text-sm"
          >
            🧠 Trigger Heal
          </button>
        </div>
        <div
          className={`mt-3 px-3 py-2 rounded text-center text-sm font-medium ${
            isHealing
              ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500'
              : 'bg-green-500/20 text-green-400 border border-green-500'
          }`}
        >
          {isHealing ? '⚠ System Recovering...' : '✅ System Stable'}
        </div>
      </Expander>
    </div>
  );
}
