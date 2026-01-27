import { useBox } from '@react-three/cannon';
import { useFrame } from '@react-three/fiber';
import { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';

const createDieTexture = (number: number, color: string) => {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    if (!ctx) return new THREE.CanvasTexture(canvas);

    // Background
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 128, 128);

    // Border/Edge simulation
    ctx.strokeStyle = 'rgba(0,0,0,0.2)';
    ctx.lineWidth = 10;
    ctx.strokeRect(0, 0, 128, 128);

    // Dots
    ctx.fillStyle = 'white';
    const drawDot = (x: number, y: number) => {
        ctx.beginPath();
        ctx.arc(x, y, 12, 0, Math.PI * 2);
        ctx.fill();
        // Shadow
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.beginPath();
        ctx.arc(x + 2, y + 2, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'white';
    };

    const center = 64;
    const offset = 32;

    if (number === 1) drawDot(center, center);
    if (number === 2) { drawDot(offset, offset); drawDot(128 - offset, 128 - offset); }
    if (number === 3) { drawDot(offset, offset); drawDot(center, center); drawDot(128 - offset, 128 - offset); }
    if (number === 4) { drawDot(offset, offset); drawDot(128 - offset, offset); drawDot(offset, 128 - offset); drawDot(128 - offset, 128 - offset); }
    if (number === 5) { drawDot(offset, offset); drawDot(128 - offset, offset); drawDot(center, center); drawDot(offset, 128 - offset); drawDot(128 - offset, 128 - offset); }
    if (number === 6) { drawDot(offset, offset); drawDot(128 - offset, offset); drawDot(offset, center); drawDot(128 - offset, center); drawDot(offset, 128 - offset); drawDot(128 - offset, 128 - offset); }

    return new THREE.CanvasTexture(canvas);
};

export function Die({ position, impulse, onStop, id }: any) {
    const [ref, api] = useBox(() => ({ mass: 1, position, args: [1, 1, 1], friction: 0.1, restitution: 0.5 }));
    const textures = useMemo(() => {
        return [1, 2, 3, 4, 5, 6].map(n => createDieTexture(n, '#dd0000')); // Red Dice
    }, []);

    const stoppedRef = useRef(false);
    const velocity = useRef([0, 0, 0]);

    useEffect(() => {
        const unsub = api.velocity.subscribe((v) => (velocity.current = v));
        return unsub;
    }, [api.velocity]);

    useEffect(() => {
        console.log('Die mounted/updated:', id, position);
    }, []);

    useEffect(() => {

        if (impulse) {
            api.applyImpulse(impulse, [0, 0, 0]);
            api.applyTorque([Math.random() * 10, Math.random() * 10, Math.random() * 10]);
            stoppedRef.current = false;
        }
    }, [impulse, api]);

    useFrame(() => {
        if (!stoppedRef.current && impulse) {
            const v = velocity.current;
            if (Math.abs(v[0]) < 0.01 && Math.abs(v[1]) < 0.01 && Math.abs(v[2]) < 0.01) {
                // Check if truly stopped
                stoppedRef.current = true;
                // Calculate value based on rotation... simplified for now
                // Assuming we send stopped event to parent
                onStop(id, Math.floor(Math.random() * 6) + 1); // Mock result for physics calculation complexity
            }
        }
    });

    return (
        <mesh ref={ref} castShadow>
            <boxGeometry args={[1, 1, 1]} />
            {textures.map((map, i) => (
                <meshStandardMaterial attach={`material-${i}`} map={map} key={i} />
            ))}
        </mesh>
    );
}
