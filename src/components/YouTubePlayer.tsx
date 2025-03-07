
import React, { useRef, useEffect } from 'react';

interface YouTubePlayerProps {
  videoId: string | null;
  onReady: () => void;
  onStateChange: (state: number) => void;
  onTimeChange: (currentTime: number, duration: number) => void;
  playerRef: React.MutableRefObject<any>;
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

const YouTubePlayer: React.FC<YouTubePlayerProps> = ({ 
  videoId, 
  onReady, 
  onStateChange, 
  onTimeChange,
  playerRef
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Load the IFrame Player API code asynchronously
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    
    // Create YouTube player when API is ready
    window.onYouTubeIframeAPIReady = initPlayer;
    
    return () => {
      // Clean up
      window.onYouTubeIframeAPIReady = () => {};
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, []);
  
  // Initialize or update player when videoId changes
  useEffect(() => {
    if (window.YT && window.YT.Player && videoId && containerRef.current) {
      if (playerRef.current) {
        if (videoId) {
          playerRef.current.loadVideoById(videoId);
        }
      } else {
        initPlayer();
      }
    }
  }, [videoId]);
  
  // Set up time update interval
  useEffect(() => {
    const interval = setInterval(() => {
      if (playerRef.current && playerRef.current.getCurrentTime) {
        const currentTime = playerRef.current.getCurrentTime();
        const duration = playerRef.current.getDuration();
        onTimeChange(currentTime, duration);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [onTimeChange]);
  
  const initPlayer = () => {
    if (!containerRef.current || !videoId) return;
    
    playerRef.current = new window.YT.Player(containerRef.current, {
      height: '0',
      width: '0',
      videoId: videoId,
      playerVars: {
        autoplay: 1,
        controls: 0,
        disablekb: 1,
        fs: 0,
        iv_load_policy: 3,
        modestbranding: 1,
        playsinline: 1,
        rel: 0
      },
      events: {
        onReady: () => onReady(),
        onStateChange: (event: any) => onStateChange(event.data)
      }
    });
  };
  
  return <div ref={containerRef} className="absolute top-0 left-0 opacity-0 pointer-events-none" />;
};

export default YouTubePlayer;
