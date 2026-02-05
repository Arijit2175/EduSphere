import React, { useState, useEffect, useRef } from 'react';
import { Box } from '@mui/material';

/**
 * ImageOptimizer Component
 * Handles lazy loading, responsive images, and fallback rendering
 * 
 * @param {string} src - Image source URL
 * @param {string} alt - Alt text for accessibility
 * @param {object} sx - MUI sx prop for styling
 * @param {boolean} priority - Load immediately without lazy loading
 * @param {string} sizes - Responsive image sizes
 * @param {function} onLoad - Callback when image loads
 */
export const ImageOptimizer = ({
  src,
  alt,
  sx = {},
  priority = false,
  sizes = "(max-width: 768px) 100vw, 50vw",
  onLoad = () => {},
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [imageSrc, setImageSrc] = useState(priority ? src : null);
  const imgRef = useRef(null);

  // Lazy loading with Intersection Observer
  useEffect(() => {
    if (priority) {
      setImageSrc(src);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setImageSrc(src);
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '50px' } // Start loading 50px before visible
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, [src, priority]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad();
  };

  const handleError = () => {
    setError(true);
    setImageSrc(null);
  };

  return (
    <Box
      ref={imgRef}
      component="img"
      src={imageSrc}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      onLoad={handleLoad}
      onError={handleError}
      sx={{
        ...sx,
        opacity: isLoaded ? 1 : 0.7,
        transition: 'opacity 0.3s ease-in-out',
        backgroundColor: isLoaded ? 'transparent' : '#f0f0f0',
        ...(error && { display: 'none' }),
      }}
      sizes={sizes}
      {...props}
    />
  );
};

export default ImageOptimizer;
