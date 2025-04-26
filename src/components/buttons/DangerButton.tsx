
import { FC } from 'react';

interface DangerButtonProps {
  onClick: () => void;
}

const DangerButton: FC<DangerButtonProps> = ({ onClick }) => {
  return (
    <div className="w-full flex justify-center pt-8">
      <button
        className="bg-destructive text-destructive-foreground px-6 py-3 rounded-lg shadow-lg text-lg font-bold hover:bg-destructive/90 transition-all animate-bounce"
        onClick={onClick}
      >
        não clique
      </button>
    </div>
  );
};

export default DangerButton;
