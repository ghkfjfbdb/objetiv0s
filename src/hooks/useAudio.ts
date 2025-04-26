
import { useCallback, useRef, useState, useEffect } from 'react';
import { checkAudioFileExists, suggestAudioPaths } from '@/utils/audioChecker';

export const useAudio = (audioUrl: string) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [fileExists, setFileExists] = useState<boolean | null>(null);
  const [triedPaths, setTriedPaths] = useState<string[]>([]);
  const [currentPathIndex, setCurrentPathIndex] = useState(0);
  
  // Generate possible paths on first render
  const [possiblePaths] = useState(() => {
    // Extract base name without extension
    const parts = audioUrl.split('.');
    const ext = parts.pop() || 'mp3';
    const baseName = parts.join('.');
    
    // If url already has extension, use as is plus alternatives
    if (audioUrl.endsWith(`.${ext}`)) {
      return [audioUrl, ...suggestAudioPaths(`${baseName}.${ext}`)];
    }
    
    // If no extension, add it
    return suggestAudioPaths(`${baseName}.${ext}`);
  });
  
  const currentPath = possiblePaths[currentPathIndex];

  // Check if the file exists
  useEffect(() => {
    const checkFile = async () => {
      if (!currentPath) {
        setFileExists(false);
        setError('No more paths to try');
        return;
      }

      console.log(`Attempting path ${currentPathIndex + 1}/${possiblePaths.length}: ${currentPath}`);
      const exists = await checkAudioFileExists(currentPath);
      
      if (exists) {
        console.log(`Found audio at path: ${currentPath}`);
        setFileExists(true);
        setError(null);
      } else {
        setTriedPaths(prev => [...prev, currentPath]);
        
        // If we have more paths to try, try the next one
        if (currentPathIndex < possiblePaths.length - 1) {
          console.log(`Path failed, trying next path...`);
          setCurrentPathIndex(prev => prev + 1);
        } else {
          // We've tried all paths
          console.error('Audio file not found in any of the tried locations:', triedPaths);
          setFileExists(false);
          setError(`Audio file not found. Tried paths: ${triedPaths.join(', ')}`);
        }
      }
    };
    
    checkFile();
  }, [currentPath, currentPathIndex, possiblePaths, retryCount]);

  // Initialize the audio element outside of useEffect to ensure it's available
  useEffect(() => {
    if (fileExists === false) {
      return; // Don't try to load if file doesn't exist
    }
    
    if (!currentPath) {
      return; // No path to try
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
      console.log("Audio loaded successfully:", currentPath);
      setIsLoaded(true);
      setError(null);
    };
    
    const handleError = () => {
      // Get the specific error if available
      const errorMessage = audio.error 
        ? `Error code: ${audio.error.code}, message: ${audio.error.message}` 
        : 'Unknown error';
      console.error('Audio load error:', errorMessage);
      
      // Try next path if available
      if (currentPathIndex < possiblePaths.length - 1) {
        setCurrentPathIndex(prev => prev + 1);
      } else {
        setError(`Failed to load audio from path: ${currentPath}`);
      }
      setIsLoaded(false);
    };
    
    // Add event listeners
    audio.addEventListener('canplaythrough', handleCanPlay);
    audio.addEventListener('error', handleError);
    
    // Set source with correct path
    audio.src = currentPath;
    
    // Try to preload the audio
    try {
      console.log("Attempting to load audio from:", currentPath);
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
  }, [currentPath, retryCount, fileExists, currentPathIndex, possiblePaths]);

  const retryLoading = useCallback(() => {
    console.log("Retrying audio load...");
    // Reset to first path
    setCurrentPathIndex(0);
    setTriedPaths([]);
    setRetryCount(prevCount => prevCount + 1);
  }, []);

  const playSound = useCallback(() => {
    console.log("Attempting to play audio:", currentPath);
    
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
  }, [currentPath, isLoaded, error, retryLoading]);

  return { 
    playSound,
    isLoaded,
    isPlaying,
    error,
    retryLoading,
    fileExists,
    currentPath,
    triedPaths
  };
};
