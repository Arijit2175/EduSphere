import React, { useState, useEffect, useRef } from 'react';
import { Box, CircularProgress } from '@mui/material';

/**
 * VideoOptimizer Component
 * Handles lazy loading, buffering, and poster images for background/inline videos
 * 
 * @param {string} src - Video source URL
 * @param {string} poster - Poster image URL to show before video loads
 * @param {object} sx - MUI sx prop for styling
 * @param {boolean} autoPlay - Auto play video
 * @param {boolean} loop - Loop video
 * @param {boolean} muted - Mute video
 * @param {boolean} priority - Load immediately without lazy loading
 * @param {boolean} preload - Preload metadata/none
 */
export const VideoOptimizer = ({
  src,
  poster = null,
  sx = {},
  autoPlay = true,
  loop = true,
  muted = true,
  priority = false,
  preload = 'metadata',
  onLoad = () => {},
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(priority);
  const videoRef = useRef(null);

  // Lazy loading with Intersection Observer
  useEffect(() => {
    if (priority) {
      setShouldLoad(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldLoad(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '100px' } // Start loading 100px before visible
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, [priority]);

  const handleCanPlay = () => {
    setIsLoaded(true);
    setIsBuffering(false);
    onLoad();
  };

  const handleWaiting = () => {
    setIsBuffering(true);
  };

  const handlePlaying = () => {
    setIsBuffering(false);
  };

  return (
    <Box
      ref={videoRef}
      component="video"
      src={shouldLoad ? src : undefined}
      poster={poster}
      autoPlay={autoPlay}
      loop={loop}
      muted={muted}
      preload={preload}
      playsInline
      onCanPlay={handleCanPlay}
      onWaiting={handleWaiting}
      onPlaying={handlePlaying}
      sx={{
        ...sx,
        opacity: isLoaded ? 1 : 0.6,
        transition: 'opacity 0.3s ease-in-out',
        backgroundColor: '#000',
        position: 'relative',
      }}
      {...props}
    >
      {shouldLoad && (
        <source src={src} type="video/mp4" />
      )}
      Your browser does not support the video tag.
      
      {/* Loading indicator */}
      {isBuffering && (
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 10,
            opacity: 0.7,
          }}
        >
          <CircularProgress size={40} sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
        </Box>
      )}
    </Box>
  );
};

export default VideoOptimizer;
