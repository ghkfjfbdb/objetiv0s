
import Countdown from "@/components/Countdown";

const Index = () => {
  const objetivos = [
    "Aprender Unity e C# para desenvolvimento de jogos",
    "Criar 3 protótipos de jogos simples",
    "Desenvolver habilidades em design de jogos",
    "Participar de uma game jam",
    "Publicar meu primeiro jogo na Steam"
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
              <li
                key={index}
                className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span className="h-8 w-8 flex items-center justify-center bg-primary text-white rounded-full mr-3">
                  {index + 1}
                </span>
                <span className="text-gray-800">{objetivo}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Index;
