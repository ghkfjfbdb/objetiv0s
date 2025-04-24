
import { useCallback, useRef, useState, useEffect } from 'react';

export const useAudio = (audioUrl: string) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Create the audio element on mount
    const audio = new Audio();
    audioRef.current = audio;
    
    // Set up event listeners
    const handleCanPlay = () => {
      console.log("Audio can now be played:", audioUrl);
      setIsLoaded(true);
      setError(null);
    };
    
    const handleError = (e: Event) => {
      console.error('Audio load error:', e);
      setError(`Failed to load audio: ${audioUrl}`);
      setIsLoaded(false);
    };
    
    audio.addEventListener('canplaythrough', handleCanPlay);
    audio.addEventListener('error', handleError);
    
    // Set source and load the audio
    audio.src = audioUrl;
    audio.load();
    
    return () => {
      // Clean up
      audio.pause();
      audio.removeEventListener('canplaythrough', handleCanPlay);
      audio.removeEventListener('error', handleError);
      audioRef.current = null;
    };
  }, [audioUrl]);

  const playSound = useCallback(() => {
    console.log("Attempting to play audio:", audioUrl);
    
    if (audioRef.current && isLoaded) {
      // Reset the audio to start
      audioRef.current.currentTime = 0;
      setIsPlaying(true);
      
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log("Audio playback started successfully");
          })
          .catch(error => {
            console.error('Playback error:', error);
            setIsPlaying(false);
            
            // Common issue: browsers require user interaction before allowing audio to play
            if (error.name === 'NotAllowedError') {
              console.warn('Audio playback was not allowed. This often requires user interaction first.');
              setError('Audio playback requires user interaction first. Try clicking the button again.');
            }
          });
      }
    } else if (!isLoaded && !error) {
      console.log('Audio not loaded yet, trying to load and play');
      // Try to reload audio if it's not loaded yet
      if (audioRef.current) {
        audioRef.current.load();
        audioRef.current.oncanplaythrough = () => {
          if (audioRef.current) {
            audioRef.current.play()
              .then(() => setIsPlaying(true))
              .catch(err => console.error('Error playing audio after load:', err));
          }
        };
      }
    } else {
      console.error('Cannot play audio: ', error || 'Audio not initialized');
    }
  }, [audioUrl, isLoaded, error]);

  return { 
    playSound,
    isLoaded,
    isPlaying,
    error
  };
};
