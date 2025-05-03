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

  // Use a fixed path directly to the audio file
  const audioPath = `/lovable-uploads/${audioFileName}`;
  
  // Handle successful audio loading
  const handleLoad = useCallback(() => {
    console.log("🎵 Áudio carregado com sucesso:", audioPath);
    setState(prev => ({
      ...prev,
      isLoaded: true,
      error: null,
    }));
  }, [audioPath]);
  
  // Handle audio loading errors
  const handleError = useCallback(() => {
    console.error("❌ Erro ao carregar áudio:", audioPath);
    setState(prev => ({
      ...prev,
      error: "Não foi possível carregar o áudio. Por favor, tente novamente.",
      isLoaded: false,
    }));
  }, [audioPath]);
  
  // Handle audio playback end
  const handleEnd = useCallback(() => {
    setState(prev => ({
      ...prev,
      isPlaying: false,
    }));
  }, []);

  // Initialize audio when component mounts - IMPORTANT: Keep this as a regular useEffect
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
      const audio = new Audio(audioPath);
      audio.preload = "auto";
      
      audio.addEventListener('canplaythrough', handleLoad);
      audio.addEventListener('error', handleError);
      audio.addEventListener('ended', handleEnd);
      
      audioRef.current = audio;
      
      // Attempt to load the audio
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
    
    // Reset audio position
    audio.currentTime = 0;
    setState(prev => ({ ...prev, isPlaying: true }));
    
    console.log("▶️ Tentando reproduzir áudio:", audioPath);
    
    // Play the audio
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
  }, [audioPath]);
  
  // Function to retry loading the audio
  const retryLoading = useCallback(() => {
    console.log("🔄 Tentando carregar áudio novamente...");
    setState(prev => ({
      ...prev,
      error: null,
      isLoaded: false,
    }));
    
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.removeEventListener('canplaythrough', handleLoad);
      audioRef.current.removeEventListener('error', handleError);
      audioRef.current.removeEventListener('ended', handleEnd);
    }

    try {
      const audio = new Audio(audioPath);
      audio.preload = "auto";
      
      audio.addEventListener('canplaythrough', handleLoad);
      audio.addEventListener('error', handleError);
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
