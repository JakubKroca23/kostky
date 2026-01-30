'use client';

import { useState, useEffect } from 'react';

interface DiceProps {
  value: number;
  isRolling: boolean;
  onClick?: () => void;
}

export function Dice({ value, isRolling, onClick }: DiceProps) {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    if (!isRolling) {
      setDisplayValue(value);
      return;
    }

    const interval = setInterval(() => {
      setDisplayValue(Math.floor(Math.random() * 6) + 1);
    }, 100);

    return () => clearInterval(interval);
  }, [isRolling, value]);

  return (
    <button
      onClick={onClick}
      className={`dice transition-all ${
        isRolling ? 'animate-roll scale-110' : 'hover:scale-110 hover:shadow-lg'
      }`}
    >
      {displayValue}
    </button>
  );
}
