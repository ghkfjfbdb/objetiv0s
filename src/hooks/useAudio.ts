
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

  // Tenta diferentes caminhos para o áudio
  const paths = [
    `/lovable-uploads/${audioFileName}`,
    `/${audioFileName}`,
    `/public/lovable-uploads/${audioFileName}`,
    `/public/${audioFileName}`,
  ];
  
  // Armazena o caminho atual
  const [currentPathIndex, setCurrentPathIndex] = useState(0);
  const audioPath = paths[currentPathIndex];
  
  // Handle successful audio loading
  const handleLoad = useCallback(() => {
    console.log("✅ Áudio carregado com sucesso:", audioPath);
    setState(prev => ({
      ...prev,
      isLoaded: true,
      error: null,
    }));
  }, [audioPath]);
  
  // Handle audio loading errors
  const handleError = useCallback(() => {
    console.error(`❌ Erro ao carregar áudio do caminho ${currentPathIndex + 1}/${paths.length}:`, audioPath);
    
    // Tenta o próximo caminho se disponível
    if (currentPathIndex < paths.length - 1) {
      console.log("🔄 Tentando próximo caminho...");
      setCurrentPathIndex(prev => prev + 1);
    } else {
      setState(prev => ({
        ...prev,
        error: "Não foi possível carregar o áudio. Por favor, tente novamente.",
        isLoaded: false,
      }));
    }
  }, [audioPath, currentPathIndex, paths.length]);
  
  // Handle audio playback end
  const handleEnd = useCallback(() => {
    setState(prev => ({
      ...prev,
      isPlaying: false,
    }));
  }, []);

  // Initialize audio when component mounts or path changes
  useEffect(() => {
    // Cleanup previous audio instance
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.removeEventListener('canplaythrough', handleLoad);
      audioRef.current.removeEventListener('error', handleError);
      audioRef.current.removeEventListener('ended', handleEnd);
    }

    try {
      console.log("🔄 Tentando carregar áudio de:", audioPath);
      const audio = new Audio();
      audio.preload = "auto";
      
      // Configurar eventos antes de definir a fonte
      audio.addEventListener('canplaythrough', handleLoad);
      audio.addEventListener('error', handleError);
      audio.addEventListener('ended', handleEnd);
      
      audioRef.current = audio;
      
      // Definir a fonte DEPOIS de configurar os eventos
      audio.src = audioPath;
      
      // Iniciar carregamento explicitamente
      audio.load();
    } catch (err) {
      console.error("❌ Erro ao criar elemento de áudio:", err);
      setState(prev => ({
        ...prev,
        error: "Erro ao inicializar o reprodutor de áudio",
        isLoaded: false,
      }));
    }
    
    // Cleanup function
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener('canplaythrough', handleLoad);
        audioRef.current.removeEventListener('error', handleError);
        audioRef.current.removeEventListener('ended', handleEnd);
      }
    };
  }, [audioPath, handleLoad, handleError, handleEnd]);
  
  // Function to play the audio
  const playSound = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) {
      console.error("❌ Não é possível reproduzir o som: Elemento de áudio não inicializado");
      return;
    }
    
    // Se o áudio não estiver carregado, tentamos novamente
    if (!state.isLoaded) {
      console.log("🔄 Áudio não carregado, tentando novamente...");
      audio.load();
      
      // Adiciona um ouvinte temporário para reproduzir após o carregamento
      const onceLoadHandler = () => {
        audio.play().catch(err => {
          console.error("❌ Erro ao reproduzir áudio após carregamento:", err);
          setState(prev => ({
            ...prev,
            error: `Erro ao reproduzir áudio: ${err.message}`,
            isPlaying: false,
          }));
        });
        audio.removeEventListener('canplaythrough', onceLoadHandler);
      };
      audio.addEventListener('canplaythrough', onceLoadHandler);
      return;
    }
    
    // Reset audio position
    audio.currentTime = 0;
    setState(prev => ({ ...prev, isPlaying: true }));
    
    console.log("▶️ Tentando reproduzir áudio:", audioPath);
    
    // Play the audio with proper error handling
    audio.play().catch(err => {
      console.error("❌ Erro ao reproduzir áudio:", err);
      setState(prev => ({
        ...prev,
        error: `Erro ao reproduzir áudio: ${err.message}`,
        isPlaying: false,
      }));
    });
  }, [audioPath, state.isLoaded]);
  
  // Function to retry loading the audio
  const retryLoading = useCallback(() => {
    console.log("🔄 Tentando carregar áudio novamente...");
    setState(prev => ({
      ...prev,
      error: null,
      isLoaded: false,
    }));
    
    // Reiniciar o índice do caminho
    setCurrentPathIndex(0);
    
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.removeEventListener('canplaythrough', handleLoad);
      audioRef.current.removeEventListener('error', handleError);
      audioRef.current.removeEventListener('ended', handleEnd);
      
      // Definir nova fonte e tentar carregar
      audioRef.current.src = paths[0];
      audioRef.current.load();
    }
  }, [handleLoad, handleError, handleEnd, paths]);
  
  return {
    playSound,
    isLoaded: state.isLoaded,
    isPlaying: state.isPlaying,
    error: state.error,
    retryLoading,
    audioPath,
  };
};
