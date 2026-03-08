import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState, ReactNode } from 'react';

interface ExpanderProps {
  title: string;
  children: ReactNode;
  defaultExpanded?: boolean;
}

export default function Expander({ title, children, defaultExpanded = false }: ExpanderProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="mb-4 border border-cyan-500/30 rounded-lg overflow-hidden bg-gray-900/50">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 hover:bg-cyan-500/10 transition-colors"
      >
        <span className="text-sm font-semibold text-cyan-400">{title}</span>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-cyan-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-cyan-400" />
        )}
      </button>
      {isExpanded && <div className="p-3 border-t border-cyan-500/20">{children}</div>}
    </div>
  );
}
