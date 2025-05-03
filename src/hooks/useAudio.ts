
import { useState, useEffect, useCallback } from 'react';

export const useAudio = (audioFileName: string) => {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Simplify - just use one consistent path format
  const audioPath = `/lovable-uploads/${audioFileName}`;
  
  useEffect(() => {
    // Create audio element
    const audioElement = new Audio();
    setAudio(audioElement);
    
    // Set up event handlers
    const handleCanPlay = () => {
      console.log("✅ Áudio carregado com sucesso:", audioPath);
      setIsLoaded(true);
      setError(null);
    };
    
    const handleError = () => {
      console.error("❌ Erro ao carregar áudio:", audioPath);
      setError("Não foi possível carregar o áudio. Por favor, verifique o caminho do arquivo.");
      setIsLoaded(false);
    };
    
    const handleEnded = () => {
      setIsPlaying(false);
    };
    
    // Add event listeners
    audioElement.addEventListener('canplaythrough', handleCanPlay);
    audioElement.addEventListener('error', handleError);
    audioElement.addEventListener('ended', handleEnded);
    
    // Set source and load
    audioElement.src = audioPath;
    audioElement.load();
    
    // Cleanup
    return () => {
      audioElement.pause();
      audioElement.removeEventListener('canplaythrough', handleCanPlay);
      audioElement.removeEventListener('error', handleError);
      audioElement.removeEventListener('ended', handleEnded);
    };
  }, [audioPath]);
  
  // Play sound function
  const playSound = useCallback(() => {
    if (!audio) {
      console.error("❌ Áudio não inicializado");
      return;
    }
    
    if (!isLoaded) {
      console.log("🔄 Áudio não carregado, tentando novamente...");
      audio.load();
      setError("Áudio ainda está carregando. Tente novamente em alguns instantes.");
      return;
    }
    
    // Reset audio position and play
    audio.currentTime = 0;
    setIsPlaying(true);
    
    audio.play().catch(err => {
      console.error("❌ Erro ao reproduzir áudio:", err);
      setError(`Erro ao reproduzir áudio: ${err.message}`);
      setIsPlaying(false);
    });
  }, [audio, isLoaded]);
  
  // Retry loading
  const retryLoading = useCallback(() => {
    if (!audio) return;
    
    console.log("🔄 Tentando carregar áudio novamente...");
    setError(null);
    setIsLoaded(false);
    
    audio.src = audioPath;
    audio.load();
  }, [audio, audioPath]);
  
  return {
    playSound,
    isLoaded,
    isPlaying,
    error,
    retryLoading,
    audioPath
  };
};
