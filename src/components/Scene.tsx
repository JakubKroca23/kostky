import { Canvas } from '@react-three/fiber';
import { Physics, usePlane } from '@react-three/cannon';
import { Die } from './Die';
import { OrbitControls, Environment, Stars } from '@react-three/drei';
import { useEffect } from 'react';

function Floor() {
    const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0], position: [0, -2, 0] }));
    return (
        <mesh ref={ref} receiveShadow>
            <planeGeometry args={[100, 100]} />
            <meshStandardMaterial color="#333" roughness={0.4} metalness={0.2} />
        </mesh>
    );
}

export function Scene({ rollForces, onDiceResult }: any) {
    useEffect(() => {
        console.log('Scene mounted, physics ready?');
    }, []);
    return (
        <Canvas shadows camera={{ position: [0, 10, 10], fov: 50 }}>
            {/* Lighting */}
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 20, 10]} angle={0.3} penumbra={1} castShadow intensity={2} />
            <pointLight position={[-10, 10, -10]} intensity={1} />

            {/* Environment */}
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
            <Environment preset="night" />

            <Physics gravity={[0, -9.8, 0]}>
                <Floor />
                {/* 6 Dice */}
                {[0, 1, 2, 3, 4, 5].map((i) => (
                    <Die
                        key={i}
                        id={i}
                        position={[(i % 3) * 2 - 2, 5 + i * 2, (Math.floor(i / 3)) * 2]}
                        impulse={rollForces ? rollForces[i] : null}
                        onStop={(id: number, val: number) => onDiceResult(id, val)}
                    />
                ))}
            </Physics>

            <OrbitControls />
        </Canvas>
    );
}
