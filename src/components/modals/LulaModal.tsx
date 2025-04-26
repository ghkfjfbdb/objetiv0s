
import { FC } from 'react';
import LulaImage from '../images/LulaImage';

interface LulaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LulaModal: FC<LulaModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-card rounded-lg shadow-lg max-w-sm mx-auto p-6 text-center relative flex flex-col items-center">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-muted hover:bg-muted/90 rounded-full px-2 py-1 text-sm font-bold text-muted-foreground"
        >
          X
        </button>
        <h3 className="font-bold text-xl mb-2 text-foreground animate-fade-in">LULA NO SKATE</h3>
        <LulaImage />
        <span className="mt-2 text-sm text-muted-foreground">😱 Você clicou!</span>
      </div>
    </div>
  );
};

export default LulaModal;
