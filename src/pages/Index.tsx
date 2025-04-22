import { useState } from "react";
import Countdown from "@/components/Countdown";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Copyright } from "lucide-react";

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

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Meus Objetivos para o Ano
          </h1>
          <p className="text-xl text-gray-600">
            Tempo restante para alcançar minhas metas
          </p>
        </div>

        <Countdown />

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Objetivos a Conquistar
          </h2>
          <ul className="space-y-4">
            {objetivos.map((objetivo, index) => (
              <Popover key={index}>
                <PopoverTrigger asChild>
                  <li className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                    <span className="h-8 w-8 flex items-center justify-center bg-primary text-white rounded-full mr-3">
                      {index + 1}
                    </span>
                    <span className="text-gray-800">{objetivo.titulo}</span>
                  </li>
                </PopoverTrigger>
                <PopoverContent className="w-72">
                  <p className="text-sm text-gray-600">{objetivo.descricao}</p>
                </PopoverContent>
              </Popover>
            ))}
          </ul>
        </div>

        {/* Credits Section */}
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Créditos
          </h2>
          <div className="flex flex-col items-center space-y-4">
            <div className="flex items-center space-x-2 text-gray-700">
              <Copyright size={20} />
              <span>Dedicado ao MESTRE R</span>
            </div>
            <p className="text-sm text-gray-600">
              Homenagem ao melhor aluno do Buiu 🏆
            </p>
            <div className="text-xs text-gray-500 mt-2">
              © {new Date().getFullYear()} Objetivos Project
            </div>
          </div>
        </div>

        {/* Botão "não clique" */}
        <div className="w-full flex justify-center pt-8">
          <button
            className="bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg text-lg font-bold hover:bg-red-700 transition-all animate-bounce"
            onClick={() => setShowModal(true)}
          >
            não clique
          </button>
        </div>
      </div>

      {/* Modal Pixel Bolsonaro */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 animate-fade-in">
          <div className="bg-white rounded-lg shadow-lg max-w-sm mx-auto p-6 text-center relative flex flex-col items-center">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 bg-gray-200 hover:bg-gray-300 rounded-full px-2 py-1 text-sm font-bold text-gray-600"
            >
              X
            </button>
            <h3 className="font-bold text-xl mb-2 text-gray-700 animate-fade-in">BOLSONARO PIXEL ART</h3>
            <PixelBolsonaro />
            <span className="mt-2 text-sm text-gray-600">😱 Você clicou!</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
