
import { useCallback } from 'react';

export const useAudio = (audioUrl: string) => {
  const playSound = useCallback(() => {
    const audio = new Audio(audioUrl);
    audio.play().catch(error => {
      console.error('Error playing audio:', error);
    });
  }, [audioUrl]);

  return { playSound };
};
