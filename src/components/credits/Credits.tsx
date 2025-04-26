
import { Copyright } from 'lucide-react';

const Credits = () => {
  return (
    <div className="bg-card shadow rounded-lg p-6 text-center">
      <h2 className="text-2xl font-semibold text-foreground mb-4">
        Créditos
      </h2>
      <div className="flex flex-col items-center space-y-4">
        <div className="flex items-center space-x-2 text-muted-foreground">
          <Copyright size={20} />
          <span>Dedicado ao MESTRE R</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Homenagem ao melhor aluno do Buiu 🏆
        </p>
        <div className="text-xs text-muted-foreground mt-2">
          © {new Date().getFullYear()} Objetivos Project
        </div>
      </div>
    </div>
  );
};

export default Credits;
