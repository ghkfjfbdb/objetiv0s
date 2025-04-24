
import { useCallback, useRef, useState, useEffect } from 'react';

export const useAudio = (audioUrl: string) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Create the audio element on mount
    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    
    // Set up event listeners
    audio.addEventListener('canplaythrough', () => setIsLoaded(true));
    audio.addEventListener('error', (e) => {
      console.error('Audio load error:', e);
      setError(`Failed to load audio: ${audioUrl}`);
    });
    
    // Preload the audio
    audio.load();
    
    return () => {
      // Clean up
      audio.pause();
      audio.removeEventListener('canplaythrough', () => setIsLoaded(true));
      audio.removeEventListener('error', () => setError(`Failed to load audio: ${audioUrl}`));
    };
  }, [audioUrl]);

  const playSound = useCallback(() => {
    console.log("Attempting to play audio:", audioUrl);
    
    if (audioRef.current) {
      // Reset the audio to start
      audioRef.current.currentTime = 0;
      
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log("Audio playback started successfully");
          })
          .catch(error => {
            console.error('Playback error:', error);
            // Common issue: browsers require user interaction before allowing audio to play
            if (error.name === 'NotAllowedError') {
              console.warn('Audio playback was not allowed. This often requires user interaction first.');
            }
          });
      }
    } else {
      console.error('Audio element is not initialized');
    }
  }, [audioUrl]);

  return { 
    playSound,
    isLoaded,
    error
  };
};
