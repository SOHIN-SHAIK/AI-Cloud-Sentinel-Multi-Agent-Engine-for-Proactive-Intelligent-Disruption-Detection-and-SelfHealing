interface ToggleProps {
  label: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

export default function Toggle({ label, enabled, onChange }: ToggleProps) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-gray-300">{label}</span>
      <button
        onClick={() => onChange(!enabled)}
        className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
          enabled ? 'bg-cyan-500' : 'bg-gray-600'
        }`}
      >
        <div
          className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform duration-300 ${
            enabled ? 'transform translate-x-6' : ''
          }`}
        />
      </button>
    </div>
  );
}
