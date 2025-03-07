
/**
 * Service for handling YouTube video search and extraction
 */

export interface VideoResult {
  id: string;
  title: string;
  thumbnail: string;
}

// Mock popular music data as fallback when API fails
const popularMusic = [
  {
    id: "JGwWNGJdvx8",
    title: "Ed Sheeran - Shape of You",
    thumbnail: "https://img.youtube.com/vi/JGwWNGJdvx8/mqdefault.jpg"
  },
  {
    id: "kJQP7kiw5Fk",
    title: "Luis Fonsi - Despacito ft. Daddy Yankee",
    thumbnail: "https://img.youtube.com/vi/kJQP7kiw5Fk/mqdefault.jpg"
  },
  {
    id: "RgKAFK5djSk",
    title: "Wiz Khalifa - See You Again ft. Charlie Puth",
    thumbnail: "https://img.youtube.com/vi/RgKAFK5djSk/mqdefault.jpg"
  },
  {
    id: "YQHsXMglC9A",
    title: "Adele - Hello",
    thumbnail: "https://img.youtube.com/vi/YQHsXMglC9A/mqdefault.jpg"
  },
  {
    id: "pRpeEdMmmQ0",
    title: "Shakira - Hips Don't Lie ft. Wyclef Jean",
    thumbnail: "https://img.youtube.com/vi/pRpeEdMmmQ0/mqdefault.jpg"
  }
];

// This API key is for demo purposes only - in a production app, you would use environment variables
// This is a publishable key that can be included in frontend code
const YOUTUBE_API_KEY = 'AIzaSyC9JvUJ7aXUSC0iKH3hWZpN4LFoIdGGEqY';

// Function to search for YouTube videos using the YouTube Data API
export const searchYouTubeVideos = async (searchQuery: string): Promise<VideoResult[]> => {
  try {
    console.log(`Searching for: ${searchQuery}`);
    
    if (!searchQuery.trim()) {
      return popularMusic;
    }
    
    // Use the YouTube Data API v3 search endpoint
    const apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q=${encodeURIComponent(searchQuery)}&type=video&key=${YOUTUBE_API_KEY}`;
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error("YouTube API error:", errorData);
      throw new Error(`YouTube API error: ${errorData.error?.message || 'Unknown error'}`);
    }
    
    const data = await response.json();
    
    // Map the API response to our VideoResult interface
    return data.items.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.medium.url
    }));
  } catch (error) {
    console.error("Error searching YouTube videos:", error);
    // Fallback to mock data if the API call fails
    return popularMusic;
  }
};

// Function to extract video ID from YouTube URL
export const extractVideoId = (url: string): string | null => {
  // Handle both youtube.com and youtu.be URLs
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  
  return (match && match[2].length === 11) ? match[2] : null;
};

// Get video details using the YouTube Data API
export const getVideoDetails = async (videoId: string): Promise<VideoResult | null> => {
  try {
    // First check if it's in our popular music list for quick retrieval
    const existingVideo = popularMusic.find(video => video.id === videoId);
    if (existingVideo) {
      return existingVideo;
    }
    
    // Use the YouTube Data API to get video details
    const apiUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${YOUTUBE_API_KEY}`;
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error("YouTube API error:", errorData);
      throw new Error(`YouTube API error: ${errorData.error?.message || 'Unknown error'}`);
    }
    
    const data = await response.json();
    
    if (data.items && data.items.length > 0) {
      const videoItem = data.items[0];
      return {
        id: videoId,
        title: videoItem.snippet.title,
        thumbnail: videoItem.snippet.thumbnails.medium.url
      };
    }
    
    throw new Error("Video not found");
  } catch (error) {
    console.error("Error getting video details:", error);
    
    // As a last resort, return generic details based on the video ID
    return {
      id: videoId,
      title: `YouTube Video (${videoId})`,
      thumbnail: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
    };
  }
};
