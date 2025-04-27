
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
  
  // Create a more flexible audio path that can handle various formats
  const audioPath = audioFileName.startsWith('/') 
    ? audioFileName 
    : `/${audioFileName}`;
    
  // Try alternative path if the first one fails
  const fallbackPath = audioFileName.startsWith('/') 
    ? audioFileName.substring(1) 
    : audioFileName;
  
  const handleLoad = useCallback(() => {
    setState(prev => ({
      ...prev,
      isLoaded: true,
      error: null,
    }));
    console.log("Audio successfully loaded:", audioPath);
  }, [audioPath]);
  
  const handleError = useCallback((event: ErrorEvent) => {
    const audio = audioRef.current;
    const errorMessage = audio?.error 
      ? `Error loading audio: ${audio.error.message}`
      : 'Unknown audio loading error';
      
    console.error("Audio loading error:", errorMessage, "for path:", audioPath);
    
    // Try with the fallback path
    if (audioRef.current && audioPath !== fallbackPath) {
      console.log("Trying fallback path:", fallbackPath);
      audioRef.current.src = fallbackPath;
      audioRef.current.load();
      return;
    }
    
    setState(prev => ({
      ...prev,
      error: errorMessage,
      isLoaded: false,
    }));
  }, [audioPath, fallbackPath]);
  
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
      // Try to directly create an audio element with the file
      const audio = new Audio(audioPath);
      audioRef.current = audio;
      
      audio.addEventListener('canplaythrough', handleLoad);
      audio.addEventListener('error', handleError as EventListener);
      audio.addEventListener('ended', handleEnd);
      
      // Attempt to preload
      audio.load();
      
      return () => {
        audio.removeEventListener('canplaythrough', handleLoad);
        audio.removeEventListener('error', handleError as EventListener);
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
      // Try with both paths
      const paths = [audioPath, fallbackPath];
      
      for (let i = 0; i < paths.length; i++) {
        try {
          const newAudio = new Audio(paths[i]);
          audioRef.current = newAudio;
          
          newAudio.addEventListener('canplaythrough', handleLoad);
          newAudio.addEventListener('error', handleError as EventListener);
          newAudio.addEventListener('ended', handleEnd);
          
          console.log("Trying path:", paths[i]);
          newAudio.load();
          break; // Stop if we successfully create an audio element
        } catch (err) {
          console.error(`Failed with path ${paths[i]}:`, err);
          // Continue to next path
        }
      }
    } else {
      // If we already have an audio element, just try to reload it
      console.log("Retrying audio load from path:", audioPath);
      audio.load();
    }
    
    setState(prev => ({
      ...prev,
      error: null,
      isLoaded: false,
    }));
  }, [audioPath, fallbackPath, handleLoad, handleError, handleEnd]);
  
  return {
    playSound,
    isLoaded: state.isLoaded,
    isPlaying: state.isPlaying,
    error: state.error,
    retryLoading,
    audioPath,
  };
};
