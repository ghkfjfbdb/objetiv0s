
import { useState, useEffect } from "react";
import Countdown from "@/components/Countdown";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Copyright, Moon, Sun, Volume2, VolumeX } from "lucide-react";
import { useAudio } from "@/hooks/useAudio";
import { Toggle } from "@/components/ui/toggle";
import { useTheme } from "next-themes";
import { toast } from "@/components/ui/use-toast";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

const LulaImage = () => (
  <div className="flex justify-center py-4 animate-fade-in">
    <img 
      src="/lovable-uploads/7c820656-05d9-44a6-9e6f-30eb9d1d0dfb.png" 
      alt="Lula não andando de skate"
      className="max-w-[300px] rounded-lg shadow-lg"
    />
  </div>
);

const PixelBolsonaro = () => (
  <div className="flex justify-center py-4 animate-fade-in">
    {/* Pixel art do Bolsonaro */}
    <svg
      width="120"
      height="120"
      viewBox="0 0 30 30"
      style={{ imageRendering: "pixelated" }}
      className="border border-gray-400 rounded bg-gray-100 shadow-lg"
    >
      {/* Cabelo (grisalho) */}
      <rect x="9" y="2" width="12" height="3" fill="#C0C0C0" />
      {/* Rosto (tom de pele) */}
      <rect x="10" y="5" width="10" height="7" fill="#F5D5A0" />
      {/* Camisa (verde militar) */}
      <rect x="8" y="12" width="14" height="4" fill="#2E8B57" />
      {/* Militar */}
      <rect x="11" y="16" width="3" height="4" fill="#2E8B57" />
      <rect x="16" y="16" width="3" height="4" fill="#2E8B57" />
      {/* Olhos (pequenos) */}
      <rect x="12" y="7" width="1" height="1" fill="#000" />
      <rect x="17" y="7" width="1" height="1" fill="#000" />
      {/* Bigode (estereótipo) */}
      <rect x="12" y="10" width="6" height="1" fill="#505050" />
      {/* Detalhe na camisa */}
      <rect x="12" y="14" width="6" height="1" fill="#1E4D2B" />
    </svg>
  </div>
);

const Index = () => {
  const [showModal, setShowModal] = useState(false);
  const { 
    playSound, 
    isLoaded, 
    error, 
    retryLoading, 
    audioPath 
  } = useAudio('lula-feijao-puro.mp3');
  
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

  const objetivos = [
    {
      titulo: "Aprender Unity e C# para desenvolvimento de jogos",
      descricao: "Dominar as ferramentas básicas do Unity e a linguagem C# para criar jogos interativos e funcionais."
    },
    {
      titulo: "Criar 3 protótipos de jogos simples",
      descricao: "Desenvolver três jogos pequenos para praticar e aperfeiçoar as habilidades de programação e game design."
    },
    {
      titulo: "Desenvolver habilidades em design de jogos",
      descricao: "Estudar princípios de game design, mecânicas de jogo e experiência do usuário para criar jogos mais envolventes."
    },
    {
      titulo: "Participar de uma game jam",
      descricao: "Participar de um evento de criação de jogos em tempo limitado para ganhar experiência e networking na comunidade."
    },
    {
      titulo: "Publicar meu primeiro jogo na Steam",
      descricao: "Finalizar e publicar um jogo completo na plataforma Steam, aprendendo sobre o processo de distribuição."
    }
  ];

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
        {/* Exibir status do áudio */}
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

        <div className="bg-card shadow rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            Objetivos a Conquistar
          </h2>
          <ul className="space-y-4">
            {objetivos.map((objetivo, index) => (
              <Popover key={index}>
                <PopoverTrigger asChild>
                  <li className="flex items-center p-3 bg-muted rounded-lg hover:bg-accent transition-colors cursor-pointer">
                    <span className="h-8 w-8 flex items-center justify-center bg-primary text-primary-foreground rounded-full mr-3">
                      {index + 1}
                    </span>
                    <span className="text-foreground">{objetivo.titulo}</span>
                  </li>
                </PopoverTrigger>
                <PopoverContent className="w-72">
                  <p className="text-sm text-muted-foreground">{objetivo.descricao}</p>
                </PopoverContent>
              </Popover>
            ))}
          </ul>
        </div>

        {/* Seção de Créditos */}
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

        {/* Botão "não clique" */}
        <div className="w-full flex justify-center pt-8">
          <button
            className="bg-destructive text-destructive-foreground px-6 py-3 rounded-lg shadow-lg text-lg font-bold hover:bg-destructive/90 transition-all animate-bounce"
            onClick={handleButtonClick}
          >
            não clique
          </button>
        </div>
      </div>

      {/* Modal Lula */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-card rounded-lg shadow-lg max-w-sm mx-auto p-6 text-center relative flex flex-col items-center">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 bg-muted hover:bg-muted/90 rounded-full px-2 py-1 text-sm font-bold text-muted-foreground"
            >
              X
            </button>
            <h3 className="font-bold text-xl mb-2 text-foreground animate-fade-in">LULA NO SKATE</h3>
            <LulaImage />
            <span className="mt-2 text-sm text-muted-foreground">😱 Você clicou!</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
