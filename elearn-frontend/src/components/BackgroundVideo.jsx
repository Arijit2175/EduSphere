import { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';

/**
 * Optimized Background Video Component
 * - Preloads video for faster loading
 * - Handles caching efficiently
 * - Shows placeholder until loaded
 */
export default function BackgroundVideo({ src, blur = '2px', brightness = 1, overlay = 0.08 }) {
  const videoRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Preload video
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => {
      setIsLoaded(true);
    };

    const handleError = (e) => {
      console.error('Video loading error:', e);
      setHasError(true);
    };

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('error', handleError);

    // Force load
    video.load();

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('error', handleError);
    };
  }, [src]);

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#1a1a2e',
        zIndex: -10,
        pointerEvents: 'none',
      }}
    >
      {/* Show placeholder while loading */}
      {!isLoaded && !hasError && (
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            animation: 'pulse 2s ease-in-out infinite',
            '@keyframes pulse': {
              '0%, 100%': { opacity: 0.6 },
              '50%': { opacity: 0.8 },
            },
          }}
        />
      )}

      {/* Video element */}
      {!hasError && (
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            filter: `blur(${blur}) brightness(${brightness})`,
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.5s ease-in-out',
          }}
        >
          <source src={src} type="video/mp4" />
        </video>
      )}

      {/* Dark Overlay */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: `rgba(0, 0, 0, ${overlay})`,
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />
    </Box>
  );
}
