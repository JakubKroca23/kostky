import React from 'react';
import './Die2D.css';

interface Die2DProps {
    value: number;
    rolling: boolean;
    color?: string;
}

export function Die2D({ value, rolling, color = '#cc0000' }: Die2DProps) {
    const dots = (num: number) => {
        switch (num) {
            case 1: return <div className="dot center"></div>;
            case 2: return (
                <>
                    <div className="dot top-right"></div>
                    <div className="dot bottom-left"></div>
                </>
            );
            case 3: return (
                <>
                    <div className="dot top-right"></div>
                    <div className="dot center"></div>
                    <div className="dot bottom-left"></div>
                </>
            );
            case 4: return (
                <>
                    <div className="dot top-left"></div>
                    <div className="dot top-right"></div>
                    <div className="dot bottom-left"></div>
                    <div className="dot bottom-right"></div>
                </>
            );
            case 5: return (
                <>
                    <div className="dot top-left"></div>
                    <div className="dot top-right"></div>
                    <div className="dot center"></div>
                    <div className="dot bottom-left"></div>
                    <div className="dot bottom-right"></div>
                </>
            );
            case 6: return (
                <>
                    <div className="dot top-left"></div>
                    <div className="dot top-right"></div>
                    <div className="dot middle-left"></div>
                    <div className="dot middle-right"></div>
                    <div className="dot bottom-left"></div>
                    <div className="dot bottom-right"></div>
                </>
            );
            default: return null;
        }
    };

    return (
        <div 
            className={`die-container ${rolling ? 'rolling' : ''}`}
            style={{ '--die-color': color } as React.CSSProperties}
        >
            <div className="die-shadow"></div>
            <div className="die-face">
                {dots(value)}
            </div>
        </div>
    );
}
