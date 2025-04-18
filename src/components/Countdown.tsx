
import { useEffect, useState } from "react";
import { Card } from "./ui/card";

const Countdown = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 365,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.days === 0 && prev.hours === 0 && prev.minutes === 0 && prev.seconds === 0) {
          clearInterval(timer);
          return prev;
        }

        let newSeconds = prev.seconds - 1;
        let newMinutes = prev.minutes;
        let newHours = prev.hours;
        let newDays = prev.days;

        if (newSeconds < 0) {
          newSeconds = 59;
          newMinutes--;
        }
        if (newMinutes < 0) {
          newMinutes = 59;
          newHours--;
        }
        if (newHours < 0) {
          newHours = 23;
          newDays--;
        }

        return {
          days: newDays,
          hours: newHours,
          minutes: newMinutes,
          seconds: newSeconds,
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <Card className="p-6 bg-white shadow-lg">
      <div className="grid grid-cols-4 gap-4 text-center">
        <div className="flex flex-col">
          <span className="text-4xl font-bold text-primary">{timeLeft.days}</span>
          <span className="text-sm text-gray-600">Dias</span>
        </div>
        <div className="flex flex-col">
          <span className="text-4xl font-bold text-primary">{timeLeft.hours}</span>
          <span className="text-sm text-gray-600">Horas</span>
        </div>
        <div className="flex flex-col">
          <span className="text-4xl font-bold text-primary">{timeLeft.minutes}</span>
          <span className="text-sm text-gray-600">Minutos</span>
        </div>
        <div className="flex flex-col">
          <span className="text-4xl font-bold text-primary">{timeLeft.seconds}</span>
          <span className="text-sm text-gray-600">Segundos</span>
        </div>
      </div>
    </Card>
  );
};

export default Countdown;
