import Countdown from "@/components/Countdown";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Copyright } from "lucide-react";

const Index = () => {
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
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
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
      </div>
    </div>
  );
};

export default Index;
