
import React from 'react';
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Music2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black to-spotify-gray p-4">
      <div className="text-center animate-fade-in">
        <Music2 size={64} className="mx-auto mb-6 text-spotify" />
        <h1 className="text-5xl font-bold mb-4 text-white">404</h1>
        <p className="text-xl text-spotify-text mb-8">This track doesn't exist</p>
        <Button asChild className="bg-spotify hover:bg-spotify/90 text-white">
          <Link to="/">Back to Player</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
