
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
  
  const audioPath = `/${audioFileName}`;
  
  const handleLoad = useCallback(() => {
    setState(prev => ({
      ...prev,
      isLoaded: true,
      error: null,
    }));
  }, []);
  
  const handleError = useCallback(() => {
    const audio = audioRef.current;
    const errorMessage = audio?.error 
      ? `Error loading audio: ${audio.error.message}`
      : 'Unknown audio loading error';
      
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

  useEffect(() => {
    const audio = new Audio(audioPath);
    audioRef.current = audio;
    
    audio.addEventListener('canplaythrough', handleLoad);
    audio.addEventListener('error', handleError);
    audio.addEventListener('ended', handleEnd);
    
    return () => {
      audio.removeEventListener('canplaythrough', handleLoad);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('ended', handleEnd);
      audio.pause();
    };
  }, [audioPath, handleLoad, handleError, handleEnd]);
  
  const playSound = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    audio.currentTime = 0;
    setState(prev => ({ ...prev, isPlaying: true }));
    
    audio.play().catch(err => {
      setState(prev => ({
        ...prev,
        error: `Error playing audio: ${err.message}`,
        isPlaying: false,
      }));
    });
  }, []);
  
  const retryLoading = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    setState(prev => ({
      ...prev,
      error: null,
      isLoaded: false,
    }));
    audio.load();
  }, []);
  
  return {
    playSound,
    isLoaded: state.isLoaded,
    isPlaying: state.isPlaying,
    error: state.error,
    retryLoading,
    audioPath,
  };
};
