
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

  // Caminhos possíveis para tentar carregar o áudio
  const audioPath = `/lovable-uploads/${audioFileName}`;
  
  const handleLoad = useCallback(() => {
    console.log("🎵 Áudio carregado com sucesso:", audioRef.current?.src);
    setState(prev => ({
      ...prev,
      isLoaded: true,
      error: null,
    }));
  }, []);
  
  const handleError = useCallback(() => {
    console.error("❌ Erro ao carregar áudio:", audioRef.current?.src);
    setState(prev => ({
      ...prev,
      error: "Não foi possível carregar o áudio. Por favor, tente novamente.",
      isLoaded: false,
    }));
  }, []);
  
  const handleEnd = useCallback(() => {
    setState(prev => ({
      ...prev,
      isPlaying: false,
    }));
  }, []);

  // Inicializar o áudio quando o componente montar
  useEffect(() => {
    try {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener('canplaythrough', handleLoad);
        audioRef.current.removeEventListener('error', handleError);
        audioRef.current.removeEventListener('ended', handleEnd);
      }

      console.log("🔄 Tentando carregar áudio de:", audioPath);
      const audio = new Audio(audioPath);
      audio.preload = "auto";
      
      audio.addEventListener('canplaythrough', handleLoad, { once: true });
      audio.addEventListener('error', handleError, { once: true });
      audio.addEventListener('ended', handleEnd);
      
      audioRef.current = audio;
      audio.load();
      
    } catch (err) {
      console.error("❌ Erro ao criar elemento de áudio:", err);
      setState(prev => ({
        ...prev,
        error: "Erro ao inicializar o reprodutor de áudio",
        isLoaded: false,
      }));
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener('canplaythrough', handleLoad);
        audioRef.current.removeEventListener('error', handleError);
        audioRef.current.removeEventListener('ended', handleEnd);
      }
    };
  }, [audioPath, handleLoad, handleError, handleEnd]);
  
  const playSound = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) {
      console.error("❌ Não é possível reproduzir o som: Elemento de áudio não inicializado");
      return;
    }
    
    audio.currentTime = 0;
    setState(prev => ({ ...prev, isPlaying: true }));
    
    console.log("▶️ Tentando reproduzir áudio:", audio.src);
    
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(err => {
        console.error("❌ Erro ao reproduzir áudio:", err);
        setState(prev => ({
          ...prev,
          error: `Erro ao reproduzir áudio: ${err.message}`,
          isPlaying: false,
        }));
      });
    }
  }, []);
  
  const retryLoading = useCallback(() => {
    console.log("🔄 Tentando carregar áudio novamente...");
    setState(prev => ({
      ...prev,
      error: null,
      isLoaded: false,
    }));
    
    try {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener('canplaythrough', handleLoad);
        audioRef.current.removeEventListener('error', handleError);
        audioRef.current.removeEventListener('ended', handleEnd);
      }

      console.log("🔄 Tentando carregar áudio de:", audioPath);
      const audio = new Audio(audioPath);
      audio.preload = "auto";
      
      audio.addEventListener('canplaythrough', handleLoad, { once: true });
      audio.addEventListener('error', handleError, { once: true });
      audio.addEventListener('ended', handleEnd);
      
      audioRef.current = audio;
      audio.load();
      
    } catch (err) {
      console.error("❌ Erro ao criar elemento de áudio:", err);
      setState(prev => ({
        ...prev,
        error: "Erro ao inicializar o reprodutor de áudio",
        isLoaded: false,
      }));
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
