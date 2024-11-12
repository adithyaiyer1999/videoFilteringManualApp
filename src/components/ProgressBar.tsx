import React from 'react';
import { Download } from 'lucide-react';

interface ProgressBarProps {
  current: number;
  total: number;
  onDownload: () => void;
}

export function ProgressBar({ current, total, onDownload }: ProgressBarProps) {
  return (
    <div className="flex justify-between items-center">
      <div className="text-sm text-gray-400">
        Reviewed: {current} / {total}
      </div>
      <button
        onClick={onDownload}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
      >
        <Download size={20} />
        Download Results
      </button>
    </div>
  );
}