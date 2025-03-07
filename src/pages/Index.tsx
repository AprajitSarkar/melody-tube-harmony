
import React from 'react';
import MusicPlayer from '@/components/MusicPlayer';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-black to-spotify-gray p-4">
      <div className="w-full max-w-4xl mx-auto">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-white mb-2 text-shadow">MelodyTube</h1>
          <p className="text-spotify-text">Enjoy YouTube music with a premium player experience</p>
        </div>
        
        <MusicPlayer />
        
        <div className="mt-8 text-center text-xs text-spotify-text animate-fade-in">
          <p>Search for music or enter YouTube URLs to play audio</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
