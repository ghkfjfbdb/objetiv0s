
import { useCallback, useRef, useState, useEffect } from 'react';

interface AudioState {
  isLoaded: boolean;
  isPlaying: boolean;
  error: string | null;
}

export const useAudio = (audioFileName: string) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [state, setState] = useState<AudioState>({
    isLoaded: false,
    isPlaying: false,
    error: null,
  });
  
  // Ensure the path starts with a forward slash
  const audioPath = audioFileName.startsWith('/') 
    ? audioFileName 
    : `/${audioFileName}`;

  // Additional paths to try if main path fails
  const alternativePaths = [
    audioPath,
    audioPath.replace('/lovable-uploads/', '/'),
    `/public${audioPath}`,
    audioPath.startsWith('/') ? audioPath.substring(1) : audioPath,
    audioPath.startsWith('/') ? `/public${audioPath}` : `/public/${audioPath}`,
    '/lula-feijao-puro.mp3',  // Try root path as last resort
  ];
  
  const handleLoad = useCallback(() => {
    setState(prev => ({
      ...prev,
      isLoaded: true,
      error: null,
    }));
    console.log("Audio successfully loaded:", audioRef.current?.src);
  }, []);
  
  const handleError = useCallback((event: Event) => {
    const audio = audioRef.current;
    const errorMessage = audio?.error 
      ? `Error loading audio: ${audio.error.message}`
      : 'Unknown audio loading error';
    
    console.error("Audio loading error:", errorMessage, "for path:", audio?.src);
    
    setState(prev => ({
      ...prev,
      error: errorMessage,
      isLoaded: false,
    }));
  }, []);
  
  const handleEnd = useCallback(() => {
    setState(prev => ({
      ...prev,
      isPlaying: false,
    }));
  }, []);

  // Function to try loading audio from different paths
  const tryLoadingFromPaths = useCallback((pathsToTry: string[], currentIndex: number = 0) => {
    if (currentIndex >= pathsToTry.length) {
      console.error("All audio paths failed");
      setState(prev => ({
        ...prev,
        error: "Failed to load audio from all available paths",
        isLoaded: false,
      }));
      return;
    }

    // Clean up any existing audio element
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.removeEventListener('canplaythrough', handleLoad);
      audioRef.current.removeEventListener('error', handleError);
      audioRef.current.removeEventListener('ended', handleEnd);
    }

    try {
      const path = pathsToTry[currentIndex];
      console.log(`Attempting to load audio from path (${currentIndex + 1}/${pathsToTry.length}):`, path);
      
      const audio = new Audio(path);
      audioRef.current = audio;
      
      // Set timeout to detect loading stuck issues
      const timeoutId = setTimeout(() => {
        console.log(`Loading timed out for path: ${path}`);
        tryLoadingFromPaths(pathsToTry, currentIndex + 1);
      }, 3000);
      
      // Use one-time event listener to try the next path if this one fails
      const errorHandler = () => {
        console.log(`Path failed: ${path}, trying next path...`);
        clearTimeout(timeoutId);
        audio.removeEventListener('error', errorHandler);
        audio.removeEventListener('canplaythrough', successHandler);
        tryLoadingFromPaths(pathsToTry, currentIndex + 1);
      };
      
      // Success handler
      const successHandler = () => {
        clearTimeout(timeoutId);
        audio.removeEventListener('error', errorHandler);
        handleLoad();
      };

      audio.addEventListener('canplaythrough', successHandler);
      audio.addEventListener('error', errorHandler);
      audio.addEventListener('ended', handleEnd);
      
      audio.load();
    } catch (err) {
      console.error("Error creating audio element:", err);
      tryLoadingFromPaths(pathsToTry, currentIndex + 1);
    }
  }, [handleLoad, handleError, handleEnd]);

  useEffect(() => {
    tryLoadingFromPaths(alternativePaths);
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener('canplaythrough', handleLoad);
        audioRef.current.removeEventListener('error', handleError);
        audioRef.current.removeEventListener('ended', handleEnd);
      }
    };
  }, [audioPath, handleLoad, handleError, handleEnd, tryLoadingFromPaths, alternativePaths]);
  
  const playSound = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) {
      console.error("Cannot play sound: Audio element not initialized");
      return;
    }
    
    audio.currentTime = 0;
    setState(prev => ({ ...prev, isPlaying: true }));
    
    console.log("Attempting to play audio:", audio.src);
    
    audio.play().catch(err => {
      console.error("Error playing audio:", err);
      setState(prev => ({
        ...prev,
        error: `Error playing audio: ${err.message}`,
        isPlaying: false,
      }));
    });
  }, []);
  
  const retryLoading = useCallback(() => {
    console.log("Retrying audio loading...");
    setState(prev => ({
      ...prev,
      error: null,
      isLoaded: false,
    }));
    
    tryLoadingFromPaths(alternativePaths);
  }, [tryLoadingFromPaths, alternativePaths]);
  
  return {
    playSound,
    isLoaded: state.isLoaded,
    isPlaying: state.isPlaying,
    error: state.error,
    retryLoading,
    audioPath,
  };
};
