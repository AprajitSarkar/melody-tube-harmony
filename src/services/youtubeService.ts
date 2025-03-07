
/**
 * Service for handling YouTube video search and extraction
 */

export interface VideoResult {
  id: string;
  title: string;
  thumbnail: string;
}

// Function to search for YouTube videos
export const searchYouTubeVideos = async (searchQuery: string): Promise<VideoResult[]> => {
  try {
    const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`;
    const response = await fetch(searchUrl);
    const html = await response.text();

    // Extract video IDs from search results
    const videoPattern = /\/watch\?v=([\w-]{11})/g;
    const matches = html.matchAll(videoPattern);
    const uniqueIds = [...new Set([...matches].map(match => match[1]))].slice(0, 5);

    // For each video ID, create a VideoResult with placeholder title and thumbnail
    // In a real application, you'd extract this information from the search results
    return uniqueIds.map(id => ({
      id,
      title: `Video ${id}`, // Placeholder
      thumbnail: `https://img.youtube.com/vi/${id}/mqdefault.jpg`
    }));
  } catch (error) {
    console.error("Error searching YouTube videos:", error);
    return [];
  }
};

// Function to extract video ID from YouTube URL
export const extractVideoId = (url: string): string | null => {
  // Handle both youtube.com and youtu.be URLs
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  
  return (match && match[2].length === 11) ? match[2] : null;
};

// Get video details (in a real app, you would use YouTube API)
export const getVideoDetails = async (videoId: string): Promise<VideoResult | null> => {
  try {
    return {
      id: videoId,
      title: `Video ${videoId.substring(0, 6)}...`, // Placeholder
      thumbnail: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
    };
  } catch (error) {
    console.error("Error getting video details:", error);
    return null;
  }
};
