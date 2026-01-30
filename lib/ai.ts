import { calculateScore } from './scoring';

interface AIMove {
  action: 'roll_all' | 'roll_single' | 'end_turn';
  diceIndices?: number[];
}

export class AIPlayer {
  private difficulty: 'easy' | 'medium' | 'hard';
  private currentScore: number = 0;

  constructor(difficulty: 'easy' | 'medium' | 'hard' = 'medium') {
    this.difficulty = difficulty;
  }

  /**
   * Decides the next move based on current game state
   */
  decideMoveRaw(
    currentDice: number[],
    playerScore: number,
    leaderScore: number,
    turnsLeft: number
  ): 'roll_all' | 'roll_single' | 'end_turn' {
    const result = calculateScore(currentDice);
    const scoreGap = leaderScore - playerScore;

    if (this.difficulty === 'easy') {
      return Math.random() > 0.5 ? 'roll_all' : 'end_turn';
    }

    if (this.difficulty === 'medium') {
      if (result.score > 20) {
        return Math.random() > 0.7 ? 'end_turn' : 'roll_all';
      }
      return Math.random() > 0.4 ? 'roll_all' : 'end_turn';
    }

    // Hard difficulty
    if (scoreGap > 50 && turnsLeft > 3) {
      return Math.random() > 0.3 ? 'roll_all' : 'end_turn';
    }

    if (result.score > 25) {
      return 'end_turn';
    }

    if (result.score > 15) {
      return Math.random() > 0.4 ? 'end_turn' : 'roll_all';
    }

    return 'roll_all';
  }

  /**
   * Simulates an AI turn with delay
   */
  async makeMove(
    currentDice: number[],
    playerScore: number,
    leaderScore: number,
    turnsLeft: number
  ): Promise<AIMove> {
    // Add human-like delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    const move = this.decideMoveRaw(currentDice, playerScore, leaderScore, turnsLeft);

    return {
      action: move,
      diceIndices: move === 'roll_single' ? [Math.floor(Math.random() * 6)] : undefined,
    };
  }

  /**
   * AI decides which dice to reroll (for future enhancement)
   */
  selectDiceToReroll(currentDice: number[], minValue: number = 3): number[] {
    return currentDice
      .map((value, idx) => ({ value, idx }))
      .filter(d => d.value < minValue)
      .map(d => d.idx);
  }
}
