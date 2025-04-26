
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const objectives = [
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

const ObjectivesList = () => {
  return (
    <div className="bg-card shadow rounded-lg p-6">
      <h2 className="text-2xl font-semibold text-foreground mb-4">
        Objetivos a Conquistar
      </h2>
      <ul className="space-y-4">
        {objectives.map((objetivo, index) => (
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
  );
};

export default ObjectivesList;
