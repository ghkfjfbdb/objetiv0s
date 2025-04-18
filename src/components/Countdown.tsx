
import React, { useState, useEffect } from "react";

const Countdown = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // Data alvo: 31 de dezembro do ano atual
    const now = new Date();
    const targetDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59);

    const updateCountdown = () => {
      const currentTime = new Date();
      const difference = targetDate.getTime() - currentTime.getTime();

      if (difference <= 0) {
        // Se já passou do prazo, configura para o ano seguinte
        const nextYear = new Date(now.getFullYear() + 1, 11, 31, 23, 59, 59);
        const newDifference = nextYear.getTime() - currentTime.getTime();

        const days = Math.floor(newDifference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (newDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (newDifference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((newDifference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      }
    };

    // Atualiza o countdown imediatamente
    updateCountdown();

    // Atualiza o countdown a cada segundo
    const timer = setInterval(updateCountdown, 1000);

    // Limpa o intervalo quando o componente é desmontado
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="grid grid-cols-4 gap-4 text-center">
        <div className="flex flex-col">
          <div className="text-4xl font-bold text-primary">{timeLeft.days}</div>
          <div className="text-gray-600">Dias</div>
        </div>
        <div className="flex flex-col">
          <div className="text-4xl font-bold text-primary">{timeLeft.hours}</div>
          <div className="text-gray-600">Horas</div>
        </div>
        <div className="flex flex-col">
          <div className="text-4xl font-bold text-primary">
            {timeLeft.minutes}
          </div>
          <div className="text-gray-600">Minutos</div>
        </div>
        <div className="flex flex-col">
          <div className="text-4xl font-bold text-primary">
            {timeLeft.seconds}
          </div>
          <div className="text-gray-600">Segundos</div>
        </div>
      </div>
    </div>
  );
};

export default Countdown;
