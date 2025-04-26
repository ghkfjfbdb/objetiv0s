
import { useCallback, useRef, useState, useEffect } from 'react';

export const useAudio = (audioFileName: string) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Simplificamos para usar diretamente da pasta public
  const audioPath = `/${audioFileName}`;
  
  useEffect(() => {
    // Criar o elemento de áudio apenas uma vez
    if (!audioRef.current) {
      audioRef.current = new Audio(audioPath);
    }
    
    const audio = audioRef.current;
    
    const handleCanPlay = () => {
      console.log("Audio loaded successfully:", audioPath);
      setIsLoaded(true);
      setError(null);
    };
    
    const handleError = () => {
      const errorMessage = audio.error 
        ? `Erro de áudio: ${audio.error.code}, ${audio.error.message}` 
        : 'Erro desconhecido ao carregar áudio';
      
      console.error(errorMessage);
      setError(errorMessage);
      setIsLoaded(false);
    };
    
    const handleEnded = () => {
      setIsPlaying(false);
    };
    
    // Adicionar event listeners
    audio.addEventListener('canplaythrough', handleCanPlay);
    audio.addEventListener('error', handleError);
    audio.addEventListener('ended', handleEnded);
    
    // Tentar carregar o áudio
    audio.src = audioPath;
    audio.load();
    
    return () => {
      // Limpar event listeners
      audio.removeEventListener('canplaythrough', handleCanPlay);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [audioPath]);

  const playSound = useCallback(() => {
    if (!audioRef.current) {
      console.error('Elemento de áudio não foi criado');
      setError('Elemento de áudio não foi criado corretamente');
      return;
    }
    
    const audio = audioRef.current;
    
    // Reiniciar o áudio
    audio.currentTime = 0;
    setIsPlaying(true);
    
    audio.play()
      .then(() => {
        console.log("Reprodução de áudio iniciada com sucesso");
      })
      .catch(playError => {
        console.error('Erro na reprodução:', playError);
        setIsPlaying(false);
        setError(`Erro ao reproduzir áudio: ${playError.message}`);
      });
  }, []);

  const retryLoading = useCallback(() => {
    if (!audioRef.current) return;
    
    console.log("Tentando carregar o áudio novamente...");
    const audio = audioRef.current;
    audio.load();
  }, []);

  return { 
    playSound,
    isLoaded,
    isPlaying,
    error,
    retryLoading,
    audioPath
  };
};
