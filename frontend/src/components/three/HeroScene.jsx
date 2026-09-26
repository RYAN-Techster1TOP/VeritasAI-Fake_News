import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere } from '@react-three/drei';
import { useRef, useState, useEffect } from 'react';

function Orb() {
  const ref = useRef();

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.25;
    ref.current.rotation.x += delta * 0.08;
  });

  return (
    <Float speed={1.4} rotationIntensity={0.4} floatIntensity={1.2}>
      <Sphere ref={ref} args={[1.35, 64, 64]} scale={1.15}>
        <MeshDistortMaterial
          color="#4a6f9c"
          attach="material"
          distort={0.35}
          speed={2}
          roughness={0.25}
          metalness={0.45}
        />
      </Sphere>
    </Float>
  );
}

export default function HeroScene() {
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const supports = Boolean(
        window.WebGLRenderingContext &&
          (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
      );
      setHasWebGL(supports);
    } catch {
      setHasWebGL(false);
    }
  }, []);

  if (!hasWebGL) {
    return (
      <div className="absolute inset-0 -z-10 flex items-center justify-center opacity-60">
        <div className="h-72 w-72 rounded-full bg-gradient-to-tr from-ink-500 via-emerald-600 to-ink-300 blur-3xl" />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 -z-10 opacity-80">
      <Canvas
        camera={{ position: [0, 0, 4.2], fov: 45 }}
        onCreated={({ gl }) => {
          gl.setClearColor('#0f1724', 0);
        }}
      >
        <ambientLight intensity={0.55} />
        <directionalLight position={[4, 3, 2]} intensity={1.2} />
        <pointLight position={[-3, -2, -2]} intensity={0.6} color="#1f8a5b" />
        <Orb />
      </Canvas>
    </div>
  );
}
