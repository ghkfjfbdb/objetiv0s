
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

  // Simplified list of paths to try - focus on the most likely to work paths
  const alternativePaths = [
    audioPath,
    `./lula-feijao-puro.mp3`,
    `lula-feijao-puro.mp3`,
    `${window.location.origin}/lula-feijao-puro.mp3`,
    `${window.location.origin}${audioPath}`,
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

  // Function to try loading audio - simplified approach
  const tryLoadingFromPaths = useCallback((pathsToTry: string[], currentIndex: number = 0) => {
    if (currentIndex >= pathsToTry.length) {
      console.error("All audio paths failed");
      setState(prev => ({
        ...prev,
        error: "Falha ao carregar áudio. Por favor, tente novamente.",
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
      console.log(`Tentando carregar áudio do caminho (${currentIndex + 1}/${pathsToTry.length}):`, path);
      
      const audio = new Audio();
      audio.preload = "auto";
      
      // Add event listeners first
      audio.addEventListener('canplaythrough', () => {
        console.log(`Áudio carregado com sucesso de: ${path}`);
        handleLoad();
      }, { once: true });
      
      audio.addEventListener('error', () => {
        console.log(`Falha no caminho: ${path}, tentando próximo...`);
        tryLoadingFromPaths(pathsToTry, currentIndex + 1);
      }, { once: true });
      
      audio.addEventListener('ended', handleEnd);
      
      // Set source and load after listeners are attached
      audio.src = path;
      audioRef.current = audio;
      audio.load();
      
      // Set a timeout to catch stalled loading
      setTimeout(() => {
        if (!state.isLoaded && audioRef.current === audio) {
          console.log(`Carregamento expirou para o caminho: ${path}`);
          tryLoadingFromPaths(pathsToTry, currentIndex + 1);
        }
      }, 3000);
      
    } catch (err) {
      console.error("Erro ao criar elemento de áudio:", err);
      tryLoadingFromPaths(pathsToTry, currentIndex + 1);
    }
  }, [handleLoad, handleError, handleEnd, state.isLoaded]);

  useEffect(() => {
    // Try to load audio when component mounts
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
      console.error("Não é possível reproduzir o som: Elemento de áudio não inicializado");
      return;
    }
    
    audio.currentTime = 0;
    setState(prev => ({ ...prev, isPlaying: true }));
    
    console.log("Tentando reproduzir áudio:", audio.src);
    
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(err => {
        console.error("Erro ao reproduzir áudio:", err);
        setState(prev => ({
          ...prev,
          error: `Erro ao reproduzir áudio: ${err.message}`,
          isPlaying: false,
        }));
      });
    }
  }, []);
  
  const retryLoading = useCallback(() => {
    console.log("Tentando carregar áudio novamente...");
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
