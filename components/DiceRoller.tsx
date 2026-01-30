'use client';

import { useState, useEffect } from 'react';
import { Dice } from '@/components/Dice';
import { calculateScore } from '@/lib/scoring';

export function DiceRoller() {
  const [dice, setDice] = useState<number[]>([1, 1, 1, 1, 1, 1]);
  const [isRolling, setIsRolling] = useState(false);
  const [score, setScore] = useState(0);
  const [combination, setCombination] = useState('');
  const [rollHistory, setRollHistory] = useState<Array<{ dice: number[]; score: number; combination: string }>>([]);

  const rollAllDice = async () => {
    setIsRolling(true);
    
    // Simulate rolling animation
    await new Promise(resolve => setTimeout(resolve, 600));

    const newDice = Array.from({ length: 6 }, () => Math.floor(Math.random() * 6) + 1);
    setDice(newDice);
    
    const result = calculateScore(newDice);
    setScore(result.score);
    setCombination(result.combination);

    setRollHistory([
      ...rollHistory,
      { dice: newDice, score: result.score, combination: result.combination }
    ]);

    setIsRolling(false);
  };

  const rollSingleDie = (index: number) => {
    if (isRolling) return;

    setIsRolling(true);
    const newDice = [...dice];
    
    // Animate this specific die
    let rolls = 0;
    const interval = setInterval(() => {
      newDice[index] = Math.floor(Math.random() * 6) + 1;
      setDice([...newDice]);
      rolls++;
      
      if (rolls >= 6) {
        clearInterval(interval);
        newDice[index] = Math.floor(Math.random() * 6) + 1;
        setDice([...newDice]);
        
        const result = calculateScore(newDice);
        setScore(result.score);
        setCombination(result.combination);
        
        setRollHistory([
          ...rollHistory,
          { dice: newDice, score: result.score, combination: result.combination }
        ]);
        
        setIsRolling(false);
      }
    }, 100);
  };

  return (
    <div className="card space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Vaš hod</h2>
        <div className="flex gap-4 justify-center mb-6 flex-wrap">
          {dice.map((value, idx) => (
            <Dice
              key={idx}
              value={value}
              isRolling={isRolling}
              onClick={() => rollSingleDie(idx)}
            />
          ))}
        </div>
      </div>

      <button
        onClick={rollAllDice}
        disabled={isRolling}
        className="btn-primary w-full py-3 disabled:opacity-50 transition-all hover:shadow-lg"
      >
        {isRolling ? 'Vrhám kostky...' : 'Vrhnout všechny kostky'}
      </button>

      {score > 0 && (
        <div className="bg-[#0f1419] p-4 rounded-lg border border-accent-green animate-pulse-glow">
          <p className="text-muted text-sm">Kombinace</p>
          <p className="text-2xl font-bold text-accent-green">{combination}</p>
          <p className="text-muted text-sm mt-1">Bodů: <span className="text-accent-green font-bold">{score}</span></p>
        </div>
      )}

      {rollHistory.length > 0 && (
        <div className="border-t border-[#374151] pt-4">
          <h3 className="font-bold mb-3">Historie hodů</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {rollHistory.map((roll, idx) => (
              <div key={idx} className="flex items-center justify-between bg-[#0f1419] p-3 rounded-lg text-sm animate-slide-in-up">
                <span className="text-muted">
                  Hod {idx + 1}: {roll.combination}
                </span>
                <span className="text-accent-green font-bold">{roll.score} b.</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
