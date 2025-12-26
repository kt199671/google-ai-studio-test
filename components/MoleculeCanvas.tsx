
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Text, Float } from '@react-three/drei';
import * as THREE from 'three';
import { Molecule, CPK_COLORS, ATOM_RADII } from '../types';

interface AtomProps {
  element: string;
  position: [number, number, number];
  name: string;
}

const Atom: React.FC<AtomProps> = ({ element, position, name }) => {
  const color = CPK_COLORS[element] || CPK_COLORS['DEFAULT'];
  const radius = ATOM_RADII[element] || ATOM_RADII['DEFAULT'];
  
  return (
    <group position={position}>
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[radius, 32, 32]} />
        <meshStandardMaterial 
          color={color} 
          roughness={0.3} 
          metalness={0.2} 
          emissive={color} 
          emissiveIntensity={0.1}
        />
      </mesh>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <Text
          position={[0, radius + 0.2, 0]}
          fontSize={0.2}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {element}
        </Text>
      </Float>
    </group>
  );
};

interface BondProps {
  start: [number, number, number];
  end: [number, number, number];
  order?: number;
}

const Bond: React.FC<BondProps> = ({ start, end, order = 1 }) => {
  const startVec = new THREE.Vector3(...start);
  const endVec = new THREE.Vector3(...end);
  const direction = new THREE.Vector3().subVectors(endVec, startVec);
  const length = direction.length();
  const midpoint = new THREE.Vector3().addVectors(startVec, endVec).multiplyScalar(0.5);
  
  // Calculate orientation
  const quaternion = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    direction.clone().normalize()
  );

  return (
    <mesh position={midpoint} quaternion={quaternion}>
      <cylinderGeometry args={[0.08, 0.08, length, 12]} />
      <meshStandardMaterial color="#888888" roughness={0.5} />
    </mesh>
  );
};

interface MoleculeSceneProps {
  molecule: Molecule;
  autoRotate: boolean;
}

const MoleculeScene: React.FC<MoleculeSceneProps> = ({ molecule, autoRotate }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += 0.005;
    }
  });

  return (
    <group ref={groupRef}>
      {molecule.atoms.map((atom) => (
        <Atom 
          key={atom.id} 
          element={atom.element} 
          position={atom.position} 
          name={atom.id}
        />
      ))}
      {molecule.bonds.map((bond, idx) => {
        const startAtom = molecule.atoms.find(a => a.id === bond.start);
        const endAtom = molecule.atoms.find(a => a.id === bond.end);
        if (!startAtom || !endAtom) return null;
        return (
          <Bond 
            key={`${molecule.id}-bond-${idx}`} 
            start={startAtom.position} 
            end={endAtom.position} 
            order={bond.order}
          />
        );
      })}
    </group>
  );
};

export const MoleculeCanvas: React.FC<MoleculeSceneProps> = (props) => {
  return (
    <div className="w-full h-full bg-slate-900">
      <Canvas shadows camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1.5} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4444ff" />
        <spotLight position={[0, 10, 0]} angle={0.15} penumbra={1} intensity={1} castShadow />
        
        <MoleculeScene {...props} />
        
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <OrbitControls makeDefault enableDamping dampingFactor={0.05} />
      </Canvas>
    </div>
  );
};
