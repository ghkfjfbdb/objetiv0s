
import { useState, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { useTheme } from "next-themes";
import { toast } from "@/components/ui/use-toast";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { Moon, Sun } from "lucide-react";
import { useAudio } from "@/hooks/useAudio";
import Countdown from "@/components/Countdown";
import ObjectivesList from "@/components/objectives/ObjectivesList";
import Credits from "@/components/credits/Credits";
import DangerButton from "@/components/buttons/DangerButton";
import LulaModal from "@/components/modals/LulaModal";

const Index = () => {
  const [showModal, setShowModal] = useState(false);
  // Use the correct path to the audio file in the public folder
  const { playSound, isLoaded, error, retryLoading, audioPath } = useAudio('/lovable-uploads/lula-feijao-puro.mp3');
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (error) {
      console.log("Error de áudio detectado:", error);
      toast({
        title: "Erro de áudio",
        description: error,
        variant: "destructive",
        action: (
          <button 
            onClick={retryLoading} 
            className="bg-primary text-primary-foreground px-2 py-1 rounded text-xs"
          >
            Tentar novamente
          </button>
        ),
      });
    }
  }, [error, retryLoading]);

  const handleButtonClick = () => {
    console.log("Botão clicado, tentando reproduzir áudio...");
    
    if (!isLoaded && error) {
      console.log("Áudio não carregado, tentando recarregar primeiro");
      retryLoading();
      setTimeout(() => {
        playSound();
      }, 500);
    } else {
      playSound();
    }
    
    setShowModal(true);
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute top-4 right-4">
        <Toggle
          aria-label="Toggle theme"
          pressed={theme === "dark"}
          onPressedChange={toggleTheme}
        >
          {mounted && (theme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          ))}
        </Toggle>
      </div>

      <div className="max-w-3xl mx-auto space-y-8">
        {error && (
          <Alert variant="destructive" className="animate-fadeIn">
            <AlertTitle className="flex items-center">
              <VolumeX className="mr-2" /> Problema com áudio
            </AlertTitle>
            <AlertDescription>
              {error}
              <div className="mt-2">
                <Button size="sm" onClick={retryLoading} variant="outline">
                  Tentar novamente
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}
        
        {isLoaded && !error && (
          <Alert className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800">
            <AlertTitle className="flex items-center text-green-800 dark:text-green-300">
              <Volume2 className="mr-2" /> Áudio carregado
            </AlertTitle>
            <AlertDescription className="text-green-700 dark:text-green-400">
              Áudio está pronto para tocar do caminho: {audioPath}
            </AlertDescription>
          </Alert>
        )}

        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Meus Objetivos para o Ano
          </h1>
          <p className="text-xl text-muted-foreground">
            Tempo restante para alcançar minhas metas
          </p>
        </div>

        <Countdown />
        <ObjectivesList />
        <Credits />
        <DangerButton onClick={handleButtonClick} />
      </div>

      <LulaModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
};

export default Index;
