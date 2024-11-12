import React, { useState, useCallback, useRef, useEffect } from 'react';
import { CSVUploader } from './components/CSVUploader';
import { VideoPlayer } from './components/VideoPlayer';
import { ProgressBar } from './components/ProgressBar';

interface VideoReview {
  path: string;
  decision?: 'yes' | 'no';
}

export default function App() {
  const [videos, setVideos] = useState<VideoReview[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const prefetchVideos = useCallback(() => {
    const prefetchCount = 5;
    for (let i = currentIndex; i < Math.min(currentIndex + prefetchCount, videos.length); i++) {
      if (videoRefs.current[i]) {
        videoRefs.current[i]?.load();
      }
    }
  }, [currentIndex, videos.length]);

  useEffect(() => {
    prefetchVideos();
  }, [prefetchVideos, currentIndex]);

  const handleDecision = useCallback((decision: 'yes' | 'no') => {
    setVideos((prev) => {
      const updated = [...prev];
      updated[currentIndex] = { ...updated[currentIndex], decision };
      return updated;
    });
    if (currentIndex < videos.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  }, [currentIndex, videos.length]);

  const downloadCSV = () => {
    const csvContent = videos.map((video) => [video.path, video.decision || '']).join('\n');
    const blob = new Blob(['path,decision\n' + csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'video-reviews.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'ArrowUp') handleDecision('yes');
    if (e.key === 'ArrowDown') handleDecision('no');
  }, [handleDecision]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <CSVUploader onVideosLoad={(videos) => {
            setVideos(videos);
            setCurrentIndex(0);
          }} />
        </div>

        {videos.length > 0 && currentIndex < videos.length && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold mb-4">
              Video {currentIndex + 1} of {videos.length}
            </h2>
            
            <VideoPlayer
              videoPath={videos[currentIndex].path}
              onDecision={handleDecision}
              videoRef={(el) => {
                videoRefs.current[currentIndex] = el;
                if (el) el.load();
              }}
            />

            <ProgressBar
              current={videos.filter(v => v.decision).length}
              total={videos.length}
              onDownload={downloadCSV}
            />
          </div>
        )}
      </div>
    </div>
  );
}