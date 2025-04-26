
import { useCallback, useRef, useState, useEffect } from 'react';
import { checkAudioFileExists } from '@/utils/audioChecker';

export const useAudio = (audioUrl: string) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [fileExists, setFileExists] = useState<boolean | null>(null);

  // Check if the file exists
  useEffect(() => {
    const checkFile = async () => {
      console.log("Checking if audio file exists:", audioUrl);
      const exists = await checkAudioFileExists(audioUrl);
      console.log("Audio file exists:", exists);
      setFileExists(exists);
      
      if (!exists) {
        setError(`Audio file not found: ${audioUrl}`);
        setIsLoaded(false);
      }
    };
    
    checkFile();
  }, [audioUrl, retryCount]);

  // Initialize the audio element outside of useEffect to ensure it's available
  useEffect(() => {
    if (fileExists === false) {
      return; // Don't try to load if file doesn't exist
    }

    // Create audio element
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    
    const audio = audioRef.current;
    
    // Clear previous errors on new URL
    setError(null);
    
    // Set up event listeners
    const handleCanPlay = () => {
      console.log("Audio loaded successfully:", audioUrl);
      setIsLoaded(true);
      setError(null);
    };
    
    const handleError = () => {
      // Get the specific error if available
      const errorMessage = audio.error 
        ? `Error code: ${audio.error.code}, message: ${audio.error.message}` 
        : 'Unknown error';
      console.error('Audio load error:', errorMessage);
      setError(`Failed to load audio: ${audioUrl}`);
      setIsLoaded(false);
    };
    
    // Add event listeners
    audio.addEventListener('canplaythrough', handleCanPlay);
    audio.addEventListener('error', handleError);
    
    // Set source with correct path
    audio.src = audioUrl;
    
    // Try to preload the audio
    try {
      console.log("Attempting to load audio from:", audioUrl);
      audio.load();
    } catch (loadError) {
      console.error("Error during audio load:", loadError);
      setError(`Failed to load audio: ${loadError}`);
    }
    
    return () => {
      // Clean up
      if (audio) {
        audio.pause();
        audio.removeEventListener('canplaythrough', handleCanPlay);
        audio.removeEventListener('error', handleError);
      }
    };
  }, [audioUrl, retryCount, fileExists]);

  const retryLoading = useCallback(() => {
    console.log("Retrying audio load...");
    setRetryCount(prevCount => prevCount + 1);
  }, []);

  const playSound = useCallback(() => {
    console.log("Attempting to play audio:", audioUrl);
    
    if (!audioRef.current) {
      console.error('Audio element is null');
      setError('Audio element was not created properly');
      return;
    }
    
    const audio = audioRef.current;
    
    // If we have an error or audio isn't loaded, try to reload
    if (error || !isLoaded) {
      console.log('Audio had errors or not loaded, retrying...');
      retryLoading();
      return;
    }
    
    // Reset the audio to start
    audio.currentTime = 0;
    setIsPlaying(true);
    
    try {
      const playPromise = audio.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log("Audio playback started successfully");
          })
          .catch(playError => {
            console.error('Playback error:', playError);
            setIsPlaying(false);
            
            // Handle common errors
            if (playError.name === 'NotAllowedError') {
              console.warn('Audio playback was not allowed. This often requires user interaction first.');
              setError('Audio playback requires user interaction first. Try clicking the button again.');
            } else {
              setError(`Failed to play audio: ${playError.message}`);
            }
          });
      }
    } catch (e) {
      console.error('Exception during play attempt:', e);
      setIsPlaying(false);
      setError(`Exception during playback: ${e}`);
    }
  }, [audioUrl, isLoaded, error, retryLoading]);

  return { 
    playSound,
    isLoaded,
    isPlaying,
    error,
    retryLoading,
    fileExists
  };
};
