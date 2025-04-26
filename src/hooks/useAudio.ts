
import { useCallback, useRef, useState, useEffect } from 'react';

export const useAudio = (audioFileName: string) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Use public folder path
  const audioPath = `/${audioFileName}`;
  
  useEffect(() => {
    const audio = new Audio(audioPath);
    audioRef.current = audio;
    
    const handleLoad = () => {
      setIsLoaded(true);
      setError(null);
    };
    
    const handleError = () => {
      const errorMessage = audio.error 
        ? `Error loading audio: ${audio.error.message}`
        : 'Unknown audio loading error';
      setError(errorMessage);
      setIsLoaded(false);
    };
    
    const handleEnd = () => setIsPlaying(false);
    
    audio.addEventListener('canplaythrough', handleLoad);
    audio.addEventListener('error', handleError);
    audio.addEventListener('ended', handleEnd);
    
    return () => {
      audio.removeEventListener('canplaythrough', handleLoad);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('ended', handleEnd);
      audio.pause();
    };
  }, [audioPath]);
  
  const playSound = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    audio.currentTime = 0;
    setIsPlaying(true);
    
    audio.play().catch(err => {
      setError(`Error playing audio: ${err.message}`);
      setIsPlaying(false);
    });
  }, []);
  
  const retryLoading = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    audio.load();
  }, []);
  
  return {
    playSound,
    isLoaded,
    isPlaying,
    error,
    retryLoading,
    audioPath
  };
};
