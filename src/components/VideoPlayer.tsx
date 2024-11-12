import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface VideoPlayerProps {
  videoPath: string;
  onDecision: (decision: 'yes' | 'no') => void;
  videoRef: (el: HTMLVideoElement | null) => void;
}

export function VideoPlayer({ videoPath, onDecision, videoRef }: VideoPlayerProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="aspect-video bg-black rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          src={videoPath}
          controls
          className="w-full h-full"
          autoPlay
        />
      </div>
      
      <div className="flex justify-center gap-4 mt-6">
        <button
          onClick={() => onDecision('yes')}
          className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg transition"
        >
          <ArrowUp size={20} />
          Yes (↑)
        </button>
        <button
          onClick={() => onDecision('no')}
          className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg transition"
        >
          <ArrowDown size={20} />
          No (↓)
        </button>
      </div>
    </div>
  );
}