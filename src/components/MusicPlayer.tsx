
import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, Pause, SkipBack, SkipForward, Volume2, Volume1, VolumeX,
  Search, Link, Music2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import YouTubePlayer from './YouTubePlayer';
import { extractVideoId, searchYouTubeVideos, getVideoDetails, VideoResult } from '@/services/youtubeService';
import { cn } from '@/lib/utils';

const formatTime = (seconds: number): string => {
  if (isNaN(seconds)) return '0:00';
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const MusicPlayer: React.FC = () => {
  // State
  const [videoId, setVideoId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<VideoResult[]>([]);
  const [currentTrack, setCurrentTrack] = useState<VideoResult | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUrlInputOpen, setIsUrlInputOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Refs
  const playerRef = useRef<any>(null);
  const progressRef = useRef<HTMLInputElement>(null);
  
  const { toast } = useToast();
  
  // Reset progress bar when changing videos
  useEffect(() => {
    setCurrentTime(0);
    setDuration(0);
  }, [videoId]);
  
  // Handle player ready
  const handlePlayerReady = () => {
    if (playerRef.current) {
      playerRef.current.setVolume(volume);
      if (isPlaying) {
        playerRef.current.playVideo();
      }
    }
  };
  
  // Handle player state changes
  const handlePlayerStateChange = (state: number) => {
    // YT.PlayerState.PLAYING = 1
    setIsPlaying(state === 1);
  };
  
  // Handle time updates
  const handleTimeChange = (currentTime: number, duration: number) => {
    setCurrentTime(currentTime);
    setDuration(duration);
  };
  
  // Play/pause toggle
  const togglePlayPause = () => {
    if (!playerRef.current) return;
    
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  };
  
  // Skip forward/backward
  const skipForward = () => {
    if (!playerRef.current) return;
    playerRef.current.seekTo(Math.min(currentTime + 10, duration));
  };
  
  const skipBackward = () => {
    if (!playerRef.current) return;
    playerRef.current.seekTo(Math.max(currentTime - 10, 0));
  };
  
  // Seek to specific time
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (playerRef.current) {
      playerRef.current.seekTo(newTime);
    }
  };
  
  // Volume control
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    if (playerRef.current) {
      playerRef.current.setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  };
  
  // Toggle mute
  const toggleMute = () => {
    if (playerRef.current) {
      if (isMuted) {
        playerRef.current.unMute();
        playerRef.current.setVolume(volume);
      } else {
        playerRef.current.mute();
      }
      setIsMuted(!isMuted);
    }
  };
  
  // Load video from URL
  const loadVideoFromUrl = () => {
    if (!videoUrl.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid YouTube URL",
        variant: "destructive"
      });
      return;
    }
    
    const id = extractVideoId(videoUrl);
    if (id) {
      setIsLoading(true);
      getVideoDetails(id)
        .then(details => {
          if (details) {
            setVideoId(id);
            setCurrentTrack(details);
            setIsPlaying(true);
            setIsUrlInputOpen(false);
            setVideoUrl('');
            toast({
              title: "Success",
              description: "Video loaded successfully"
            });
          }
        })
        .catch(error => {
          console.error("Error loading video:", error);
          toast({
            title: "Error",
            description: "Failed to load video",
            variant: "destructive"
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      toast({
        title: "Error",
        description: "Invalid YouTube URL",
        variant: "destructive"
      });
    }
  };
  
  // Search for videos
  const searchVideos = async () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Error",
        description: "Please enter a search query",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    try {
      const results = await searchYouTubeVideos(searchQuery);
      setSearchResults(results);
      toast({
        title: "Search Completed",
        description: `Found ${results.length} results`
      });
    } catch (error) {
      console.error("Error searching videos:", error);
      toast({
        title: "Error",
        description: "Failed to search videos",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Play a video from search results
  const playVideo = (video: VideoResult) => {
    setVideoId(video.id);
    setCurrentTrack(video);
    setIsPlaying(true);
    setIsSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
  };
  
  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto h-full p-4">
      {/* YouTube Player (hidden) */}
      {videoId && (
        <YouTubePlayer
          videoId={videoId}
          onReady={handlePlayerReady}
          onStateChange={handlePlayerStateChange}
          onTimeChange={handleTimeChange}
          playerRef={playerRef}
        />
      )}
      
      {/* Music Player Interface */}
      <Card className="w-full bg-spotify-gray border-none shadow-xl overflow-hidden animate-fade-in">
        <CardContent className="p-0">
          {/* Player Header */}
          <div className="bg-spotify-lightgray p-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Music2 size={28} className="text-spotify" />
              <h2 className="text-2xl font-semibold text-white">MelodyTube</h2>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-spotify-text hover:text-spotify transition-colors"
                onClick={() => {
                  setIsSearchOpen(true);
                  setIsUrlInputOpen(false);
                }}
              >
                <Search size={20} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-spotify-text hover:text-spotify transition-colors"
                onClick={() => {
                  setIsUrlInputOpen(true);
                  setIsSearchOpen(false);
                }}
              >
                <Link size={20} />
              </Button>
            </div>
          </div>
          
          {/* Now Playing */}
          <div className="p-6 bg-gradient-to-b from-spotify-lightgray to-spotify-gray">
            {currentTrack ? (
              <div className="flex items-center space-x-4">
                <div className="w-24 h-24 rounded-md overflow-hidden flex-shrink-0 shadow-lg">
                  <img 
                    src={currentTrack.thumbnail} 
                    alt={currentTrack.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-medium text-white mb-1 truncate">{currentTrack.title}</h3>
                  <p className="text-spotify-text text-sm">YouTube</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-spotify-text">
                <Music2 size={48} className="mb-4 text-spotify opacity-50" />
                <p className="text-center">No track playing. Search or enter a YouTube URL to begin.</p>
              </div>
            )}
          </div>
          
          {/* URL Input */}
          {isUrlInputOpen && (
            <div className="p-6 bg-spotify-gray border-t border-spotify-lightgray animate-slide-left">
              <div className="flex space-x-2">
                <Input
                  type="text"
                  placeholder="Enter YouTube URL..."
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="flex-1 bg-spotify-lightgray border-none text-white placeholder-spotify-text"
                />
                <Button 
                  onClick={loadVideoFromUrl} 
                  disabled={isLoading}
                  className="bg-spotify hover:bg-spotify/90 text-white"
                >
                  {isLoading ? "Loading..." : "Load"}
                </Button>
              </div>
            </div>
          )}
          
          {/* Search */}
          {isSearchOpen && (
            <div className="p-6 bg-spotify-gray border-t border-spotify-lightgray animate-slide-right">
              <div className="flex space-x-2 mb-4">
                <Input
                  type="text"
                  placeholder="Search YouTube..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') searchVideos();
                  }}
                  className="flex-1 bg-spotify-lightgray border-none text-white placeholder-spotify-text"
                />
                <Button 
                  onClick={searchVideos} 
                  disabled={isLoading}
                  className="bg-spotify hover:bg-spotify/90 text-white"
                >
                  {isLoading ? "Searching..." : "Search"}
                </Button>
              </div>
              
              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="space-y-2 max-h-56 overflow-y-auto pr-2">
                  {searchResults.map((video) => (
                    <div 
                      key={video.id}
                      className="flex items-center p-2 hover:bg-spotify-lightgray rounded-md cursor-pointer transition-colors"
                      onClick={() => playVideo(video)}
                    >
                      <img 
                        src={video.thumbnail} 
                        alt={video.title}
                        className="w-12 h-12 object-cover rounded-sm mr-3 flex-shrink-0"
                      />
                      <span className="text-white text-sm truncate">{video.title}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {/* Player Controls */}
          <div className="p-6 bg-spotify-gray border-t border-spotify-lightgray">
            {/* Progress Bar */}
            <div className="progress-container mb-2 w-full">
              <div className="flex justify-between text-xs text-spotify-text mb-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
              <input
                ref={progressRef}
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="progress-bar w-full"
              />
            </div>
            
            {/* Control Buttons */}
            <div className="flex justify-center items-center space-x-6 my-4">
              <Button
                variant="ghost"
                size="icon"
                className="text-spotify-light hover:text-spotify transition-colors"
                onClick={skipBackward}
              >
                <SkipBack size={24} />
              </Button>
              
              <Button
                variant="outline"
                size="icon"
                className={cn(
                  "rounded-full w-12 h-12 flex items-center justify-center border-2",
                  isPlaying 
                    ? "border-spotify text-spotify hover:bg-spotify/10" 
                    : "border-white text-white hover:bg-white/10"
                )}
                onClick={togglePlayPause}
              >
                {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="text-spotify-light hover:text-spotify transition-colors"
                onClick={skipForward}
              >
                <SkipForward size={24} />
              </Button>
            </div>
            
            {/* Volume Control */}
            <div className="flex items-center justify-end space-x-2">
              <Button variant="ghost" size="icon" onClick={toggleMute} className="text-spotify-text">
                {isMuted ? <VolumeX size={18} /> : volume <= 50 ? <Volume1 size={18} /> : <Volume2 size={18} />}
              </Button>
              
              <input
                type="range"
                min={0}
                max={100}
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="volume-slider w-28"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MusicPlayer;
