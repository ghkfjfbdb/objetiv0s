
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
  
  // Use full public path to ensure proper loading
  const audioPath = audioFileName.startsWith('/') 
    ? audioFileName 
    : `/${audioFileName}`;
  
  const handleLoad = useCallback(() => {
    setState(prev => ({
      ...prev,
      isLoaded: true,
      error: null,
    }));
    console.log("Audio successfully loaded:", audioPath);
  }, [audioPath]);
  
  const handleError = useCallback(() => {
    const audio = audioRef.current;
    const errorMessage = audio?.error 
      ? `Error loading audio: ${audio.error.message}`
      : 'Unknown audio loading error';
      
    console.error("Audio loading error:", errorMessage, "for path:", audioPath);
    
    setState(prev => ({
      ...prev,
      error: errorMessage,
      isLoaded: false,
    }));
  }, [audioPath]);
  
  const handleEnd = useCallback(() => {
    setState(prev => ({
      ...prev,
      isPlaying: false,
    }));
  }, []);

  useEffect(() => {
    // Make sure we clean up any previous audio instance
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    
    console.log("Attempting to load audio from path:", audioPath);
    
    try {
      const audio = new Audio(audioPath);
      audioRef.current = audio;
      
      audio.addEventListener('canplaythrough', handleLoad);
      audio.addEventListener('error', handleError);
      audio.addEventListener('ended', handleEnd);
      
      // Attempt to preload
      audio.load();
      
      return () => {
        audio.removeEventListener('canplaythrough', handleLoad);
        audio.removeEventListener('error', handleError);
        audio.removeEventListener('ended', handleEnd);
        audio.pause();
      };
    } catch (err) {
      console.error("Error creating audio element:", err);
      setState(prev => ({
        ...prev,
        error: `Error creating audio element: ${err instanceof Error ? err.message : String(err)}`,
        isLoaded: false,
      }));
    }
  }, [audioPath, handleLoad, handleError, handleEnd]);
  
  const playSound = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) {
      console.error("Cannot play sound: Audio element not initialized");
      return;
    }
    
    audio.currentTime = 0;
    setState(prev => ({ ...prev, isPlaying: true }));
    
    console.log("Attempting to play audio:", audioPath);
    
    audio.play().catch(err => {
      console.error("Error playing audio:", err);
      setState(prev => ({
        ...prev,
        error: `Error playing audio: ${err.message}`,
        isPlaying: false,
      }));
    });
  }, [audioPath]);
  
  const retryLoading = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) {
      console.log("Recreating audio element for retry");
      const newAudio = new Audio(audioPath);
      audioRef.current = newAudio;
      
      newAudio.addEventListener('canplaythrough', handleLoad);
      newAudio.addEventListener('error', handleError);
      newAudio.addEventListener('ended', handleEnd);
    }
    
    console.log("Retrying audio load from path:", audioPath);
    
    setState(prev => ({
      ...prev,
      error: null,
      isLoaded: false,
    }));
    
    if (audioRef.current) {
      audioRef.current.load();
    }
  }, [audioPath, handleLoad, handleError, handleEnd]);
  
  return {
    playSound,
    isLoaded: state.isLoaded,
    isPlaying: state.isPlaying,
    error: state.error,
    retryLoading,
    audioPath,
  };
};
