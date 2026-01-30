import { Die2D } from './Die2D';
import './Die2D.css';

export function Scene({ results, rolling }: { results: number[] | null, rolling: boolean }) {
    // Default to 1s if no results yet
    const displayValues = results || [1, 1, 1, 1, 1, 1];

    return (
        <div className="flex items-center justify-center w-full h-full p-4">
            <div className="dice-board">
                {displayValues.map((val, i) => (
                    <Die2D
                        key={i}
                        value={val}
                        rolling={rolling}
                        color={i % 2 === 0 ? '#dd0000' : '#bb0000'}
                    />
                ))}
            </div>
        </div>
    );
}

