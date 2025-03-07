
/**
 * Service for handling YouTube video search and extraction
 */

export interface VideoResult {
  id: string;
  title: string;
  thumbnail: string;
}

// Mock popular music data for demo purposes since direct YouTube scraping is blocked by CORS
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

// Function to search for YouTube videos with mock data
export const searchYouTubeVideos = async (searchQuery: string): Promise<VideoResult[]> => {
  try {
    console.log(`Searching for: ${searchQuery}`);
    
    // In a real app, you would make an API call to a backend service that handles YouTube search
    // For this demo, we'll filter mock data based on the search query
    if (!searchQuery.trim()) {
      return popularMusic;
    }
    
    const searchLower = searchQuery.toLowerCase();
    const filteredResults = popularMusic.filter(video => 
      video.title.toLowerCase().includes(searchLower)
    );
    
    // If no results, return all popular music
    return filteredResults.length > 0 ? filteredResults : popularMusic;
  } catch (error) {
    console.error("Error searching YouTube videos:", error);
    return popularMusic; // Fallback to popular music if search fails
  }
};

// Function to extract video ID from YouTube URL
export const extractVideoId = (url: string): string | null => {
  // Handle both youtube.com and youtu.be URLs
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  
  return (match && match[2].length === 11) ? match[2] : null;
};

// Get video details (mocked for demo)
export const getVideoDetails = async (videoId: string): Promise<VideoResult | null> => {
  try {
    // First check if it's in our popular music list
    const existingVideo = popularMusic.find(video => video.id === videoId);
    if (existingVideo) {
      return existingVideo;
    }
    
    // If not in our list, return generic details
    return {
      id: videoId,
      title: `YouTube Video (${videoId})`,
      thumbnail: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
    };
  } catch (error) {
    console.error("Error getting video details:", error);
    return null;
  }
};
