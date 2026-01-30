export interface ScoringResult {
  score: number;
  combination: string;
}

export function calculateScore(dice: number[]): ScoringResult {
  const sorted = [...dice].sort((a, b) => a - b);
  const counts = new Map<number, number>();

  sorted.forEach(d => {
    counts.set(d, (counts.get(d) || 0) + 1);
  });

  // Poker (6 stejných)
  for (const [num, count] of counts) {
    if (count === 6) {
      return { score: 50, combination: 'Poker (6×)' };
    }
  }

  // Generál (5 stejných)
  for (const [num, count] of counts) {
    if (count === 5) {
      return { score: 40, combination: 'Generál (5×)' };
    }
  }

  // Full house (3 + 2 stejných)
  const countValues = Array.from(counts.values());
  if (countValues.includes(3) && countValues.includes(2)) {
    const sum = sorted.reduce((a, b) => a + b, 0);
    return { score: 35, combination: 'Fulhaus' };
  }

  // Velká postupka (2-3-4-5-6)
  if (JSON.stringify(sorted) === JSON.stringify([2, 3, 4, 5, 6])) {
    return { score: 30, combination: 'Velká postupka' };
  }

  // Malá postupka (1-2-3-4-5)
  if (JSON.stringify(sorted) === JSON.stringify([1, 2, 3, 4, 5])) {
    return { score: 30, combination: 'Malá postupka' };
  }

  // Čtveřice (4 stejné)
  for (const [num, count] of counts) {
    if (count === 4) {
      const sum = sorted.reduce((a, b) => a + b, 0);
      return { score: 25, combination: 'Čtveřice' };
    }
  }

  // Trojice (3 stejné)
  for (const [num, count] of counts) {
    if (count === 3) {
      const sum = sorted.reduce((a, b) => a + b, 0);
      return { score: 20, combination: 'Trojice' };
    }
  }

  // Dva páry
  const pairsCount = Array.from(counts.values()).filter(c => c === 2).length;
  if (pairsCount === 2) {
    return { score: 15, combination: 'Dva páry' };
  }

  // Jeden pár
  if (pairsCount === 1) {
    return { score: 10, combination: 'Pár' };
  }

  // Součet všech kostek
  const sum = sorted.reduce((a, b) => a + b, 0);
  return { score: sum, combination: `Součet: ${sum}` };
}
