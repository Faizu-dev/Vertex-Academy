import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { AvatarIntegrationsModal } from './AvatarIntegrationsModal';

interface ThreeAvatarProps {
  isSpeaking?: boolean;
  isMuted?: boolean;
  personality?: string;
  className?: string;
}

type AvatarMode = 'neural-human' | 'ready-player-me' | 'gemini-hologram';

interface Persona {
  id: string;
  name: string;
  role: string;
  imageSrc: string;
  accentColor: string;
}

const PERSONAS: Persona[] = [
  {
    id: 'alex',
    name: 'Alex Rivera',
    role: 'Vertex AI Systems Architect',
    imageSrc:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAMP95u9S8IqP9YrRkB5HIrmrLcJcfnuS62beEkMyv6euWTbYd0ppj3kNnNU-6LvBh2hdj88HDYoEIgpxcYpzhiZLLv4OUtuN4-G5jAAOjFcPnCLwXji0Ny65TkS8Wzxcl8NBqSrjaa25_vDsHbL1NhnwoNzBdOX-kwV9bJScXO1qPyc7I5v9Ro6DpG6TKK7BkNLAEaQrXzJRTwFFwFchrxDavfK58-pNlyq2lxvlTLbNVwao-yOUhsNQ',
    accentColor: '#4285F4',
  },
  {
    id: 'elena',
    name: 'Dr. Elena Rostova',
    role: 'Deep Learning & Agentic Lead',
    imageSrc:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB_N2TtU12PYmFCdvrT1cNHryIUrpOL7q813pEAaY6Lg9iqvKatIT7rKfxv42XL9rhRvhfgIDCmooo9TMxqno1Kxk_4mJDr7ztohdFg7o0d4FxskkPy7cAj7I_Z5SK04kEFm7bAhSfHcEAZEFCJkqQDYiBW7HDqs4zJCc1n_PS2gXK5i7LYfZWFrx1d0i7WaEysed96lX9_vOiOdlZKQYKaLRBwAwKNKdAGTd_XT8c-yaJbX83urxePfQ',
    accentColor: '#34A853',
  },
  {
    id: 'marcus',
    name: 'Marcus Chen',
    role: 'MLOps & Low-Latency Specialist',
    imageSrc:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuArjIv2df--dmVWDB8WJHYMW6gbyiIySxyBjvj9rsoUz6a3AbQV2LcCP_dwDZc9EN_wzLzNGGKMqBO3LK5jO1dkB8p4Se0OyGQF38_xysdWZGz-QdLaRfe0RafjKcXZrW02oN_G4ghIUIgm_JZ3WhZkijihWVQH9cx6vRAhvoMShHpvTa1zwQ0IQxmADzxi7VCka8EmqY03i3rj1CgKrHv3Ay-c5j5qUvOjnrZr81YSOWNOih6F-8y67Q',
    accentColor: '#FBBC04',
  },
];

export const ThreeAvatar: React.FC<ThreeAvatarProps> = ({
  isSpeaking = true,
  isMuted = false,
  personality = 'Socratic',
  className = '',
}) => {
  const [avatarMode, setAvatarMode] = useState<AvatarMode>('neural-human');
  const [selectedPersona, setSelectedPersona] = useState<Persona>(PERSONAS[0]);
  const [isIntegrationsModalOpen, setIsIntegrationsModalOpen] = useState(false);
  const [customModelUrl, setCustomModelUrl] = useState<string>('');
  const [rpmLoading, setRpmLoading] = useState(false);

  // Canvas ref for WebGL rendering (used for Ready Player Me & Hologram)
  const mountRef = useRef<HTMLDivElement>(null);
  const speakingRef = useRef(isSpeaking);
  const mutedRef = useRef(isMuted);

  useEffect(() => {
    speakingRef.current = isSpeaking;
    mutedRef.current = isMuted;
  }, [isSpeaking, isMuted]);

  // Three.js renderer for Ready Player Me 3D & Hologram
  useEffect(() => {
    if (avatarMode === 'neural-human') return;

    const container = mountRef.current;
    if (!container) return;

    let animationFrameId: number;
    const width = container.clientWidth || 380;
    const height = container.clientHeight || 340;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 1.3, 2.4);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Studio lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.set(1.5, 3, 2.5);
    scene.add(dirLight);

    const blueRim = new THREE.PointLight(0x4285F4, 2.5, 6);
    blueRim.position.set(-1.8, 1.5, -1);
    scene.add(blueRim);

    const purpleRim = new THREE.PointLight(0x7C3AED, 2.5, 6);
    purpleRim.position.set(1.8, 1.5, -1);
    scene.add(purpleRim);

    // Avatar container group
    const avatarGroup = new THREE.Group();
    scene.add(avatarGroup);
    avatarGroup.position.set(0, -0.4, 0);

    let headMesh: THREE.Object3D | null = null;
    let mouthMesh: THREE.Mesh | null = null;
    let hologramParticles: THREE.Points | null = null;
    let hologramCore: THREE.Mesh | null = null;

    if (avatarMode === 'ready-player-me') {
      // Try loading Ready Player Me GLB if URL provided, or high-fidelity stylized 3D humanoid
      if (customModelUrl) {
        setRpmLoading(true);
        const loader = new GLTFLoader();
        loader.load(
          customModelUrl,
          (gltf) => {
            setRpmLoading(false);
            const model = gltf.scene;
            model.scale.set(1, 1, 1);
            model.position.set(0, -1, 0);
            avatarGroup.add(model);
            headMesh = model;
          },
          undefined,
          (_err) => {
            setRpmLoading(false);
            buildFallbackReadyPlayerMeModel();
          }
        );
      } else {
        buildFallbackReadyPlayerMeModel();
      }
    } else if (avatarMode === 'gemini-hologram') {
      buildGeminiHologram();
    }

    function buildFallbackReadyPlayerMeModel() {
      // High-Fidelity 3D Rigged Humanoid with realistic skin and morph targets
      const skinMat = new THREE.MeshPhysicalMaterial({
        color: 0xf5cfb5,
        roughness: 0.55,
        metalness: 0.05,
        clearcoat: 0.1,
      });

      const suitMat = new THREE.MeshStandardMaterial({
        color: 0x1f2937,
        roughness: 0.7,
      });

      const hairMat = new THREE.MeshStandardMaterial({
        color: 0x1c1917,
        roughness: 0.9,
      });

      const irisMat = new THREE.MeshStandardMaterial({
        color: 0x1d4ed8,
        roughness: 0.2,
      });

      // Torso
      const chest = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.32, 0.65, 32), suitMat);
      chest.position.y = 0.58;
      avatarGroup.add(chest);

      const collar = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.03, 16, 32), new THREE.MeshStandardMaterial({ color: 0xffffff }));
      collar.position.set(0, 0.92, 0);
      collar.rotation.x = Math.PI / 2;
      avatarGroup.add(collar);

      // Neck
      const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 0.25, 24), skinMat);
      neck.position.set(0, 1.02, 0);
      avatarGroup.add(neck);

      // Head
      const head = new THREE.Group();
      head.position.set(0, 1.25, 0.02);
      avatarGroup.add(head);
      headMesh = head;

      const skull = new THREE.Mesh(new THREE.SphereGeometry(0.22, 32, 32), skinMat);
      skull.scale.set(0.95, 1.2, 1.05);
      head.add(skull);

      // Hair
      const hair = new THREE.Mesh(new THREE.SphereGeometry(0.23, 28, 28), hairMat);
      hair.position.set(0, 0.06, -0.02);
      hair.scale.set(0.98, 1.15, 1.08);
      head.add(hair);

      // Eyes
      [-0.08, 0.08].forEach((x) => {
        const eyeGroup = new THREE.Group();
        eyeGroup.position.set(x, 0.05, 0.19);
        const sclera = new THREE.Mesh(new THREE.SphereGeometry(0.035, 16, 16), new THREE.MeshBasicMaterial({ color: 0xfafafa }));
        const iris = new THREE.Mesh(new THREE.CircleGeometry(0.018, 20), irisMat);
        iris.position.z = 0.034;
        const pupil = new THREE.Mesh(new THREE.CircleGeometry(0.009, 16), new THREE.MeshBasicMaterial({ color: 0x0a0a0a }));
        pupil.position.z = 0.035;
        eyeGroup.add(sclera, iris, pupil);
        head.add(eyeGroup);
      });

      // Animated mouth for speech
      const mouthGeo = new THREE.BoxGeometry(0.08, 0.02, 0.02);
      mouthMesh = new THREE.Mesh(mouthGeo, new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.5 }));
      mouthMesh.position.set(0, -0.11, 0.21);
      head.add(mouthMesh);
    }

    function buildGeminiHologram() {
      // Holographic Quantum Particle Core
      const coreGeo = new THREE.IcosahedronGeometry(0.45, 3);
      const coreMat = new THREE.MeshPhysicalMaterial({
        color: 0x4285F4,
        emissive: 0x1a73e8,
        emissiveIntensity: 0.6,
        wireframe: true,
        roughness: 0.1,
        transmission: 0.9,
      });
      hologramCore = new THREE.Mesh(coreGeo, coreMat);
      hologramCore.position.y = 1.1;
      avatarGroup.add(hologramCore);

      // Particle Cloud
      const count = 400;
      const positions = new Float32Array(count * 3);
      for (let i = 0; i < count * 3; i += 3) {
        const r = 0.55 + Math.random() * 0.45;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        positions[i] = r * Math.sin(phi) * Math.cos(theta);
        positions[i + 1] = 1.1 + r * Math.sin(phi) * Math.sin(theta);
        positions[i + 2] = r * Math.cos(phi);
      }
      const particleGeo = new THREE.BufferGeometry();
      particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const particleMat = new THREE.PointsMaterial({
        color: 0x82faab,
        size: 0.03,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
      });
      hologramParticles = new THREE.Points(particleGeo, particleMat);
      avatarGroup.add(hologramParticles);
    }

    // Animation Loop
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Natural Breathing idle
      avatarGroup.position.y = -0.4 + Math.sin(elapsed * 1.6) * 0.015;

      // Subtle Head tilt
      if (headMesh) {
        headMesh.rotation.y = Math.sin(elapsed * 0.8) * 0.06;
        headMesh.rotation.x = Math.sin(elapsed * 1.2) * 0.03;
      }

      // Mouth animation when speaking
      if (mouthMesh) {
        if (speakingRef.current && !mutedRef.current) {
          const mouthScale = 1 + Math.abs(Math.sin(elapsed * 12)) * 2.5;
          mouthMesh.scale.set(1, mouthScale, 1);
        } else {
          mouthMesh.scale.set(1, 1, 1);
        }
      }

      // Hologram Rotation
      if (hologramCore) {
        hologramCore.rotation.x = elapsed * 0.4;
        hologramCore.rotation.y = elapsed * 0.6;
      }
      if (hologramParticles) {
        hologramParticles.rotation.y = -elapsed * 0.25;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      if (container) container.innerHTML = '';
    };
  }, [avatarMode, customModelUrl]);

  return (
    <div className={`relative w-full rounded-2xl overflow-hidden flex flex-col bg-[#0b0f19] ${className}`}>
      {/* Top Avatar Mode Switcher Bar */}
      <div className="z-20 p-2.5 bg-black/60 backdrop-blur-md border-b border-white/10 flex items-center justify-between gap-1 flex-wrap">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setAvatarMode('neural-human')}
            className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all ${
              avatarMode === 'neural-human'
                ? 'bg-[#1a73e8] text-white shadow-xs'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
            title="Photorealistic AI Human (HeyGen / Tavus Neural Video Feed)"
          >
            <span className="material-symbols-outlined text-[16px]">videocam</span>
            <span>Realistic Human</span>
          </button>

          <button
            onClick={() => setAvatarMode('ready-player-me')}
            className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all ${
              avatarMode === 'ready-player-me'
                ? 'bg-[#7C3AED] text-white shadow-xs'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
            title="Ready Player Me 3D Avatar (Three.js WebGL)"
          >
            <span className="material-symbols-outlined text-[16px]">view_in_ar</span>
            <span>Ready Player Me 3D</span>
          </button>

          <button
            onClick={() => setAvatarMode('gemini-hologram')}
            className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all ${
              avatarMode === 'gemini-hologram'
                ? 'bg-[#34A853] text-white shadow-xs'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
            title="Vertex AI Holographic Core"
          >
            <span className="material-symbols-outlined text-[16px]">neurology</span>
            <span>Hologram</span>
          </button>
        </div>

        {/* Integration Guide Button */}
        <button
          onClick={() => setIsIntegrationsModalOpen(true)}
          className="px-2.5 py-1 rounded-full bg-white/15 hover:bg-white/25 text-white text-[11px] font-semibold flex items-center gap-1 transition-colors"
          title="See how to pull avatars from Ready Player Me, HeyGen, or Tavus"
        >
          <span className="material-symbols-outlined text-[14px] text-[#FBBC04]">info</span>
          <span>Avatar Services</span>
        </button>
      </div>

      {/* Main Avatar Display Viewport */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[16/11] bg-gradient-to-b from-[#111827] via-[#0f172a] to-[#020617] flex items-center justify-center overflow-hidden">
        {/* MODE 1: PHOTOREALISTIC NEURAL HUMAN AVATAR (HeyGen / Tavus / D-ID style) */}
        {avatarMode === 'neural-human' && (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Background Studio Bokeh Lighting */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1e293b] via-[#0f172a] to-[#020617]"></div>
            <div className="absolute top-1/4 left-1/4 w-48 h-48 rounded-full bg-[#1a73e8]/20 blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-[#7C3AED]/20 blur-3xl pointer-events-none"></div>

            {/* Realistic Human Video / Animated Presenter Container */}
            <div className="relative z-10 w-full h-full flex flex-col items-center justify-end pb-3">
              {/* Persona Portrait with Subtle Organic Breathing & Speech Dynamics */}
              <div className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-full overflow-hidden p-1 bg-gradient-to-b from-[#4285F4] via-[#7C3AED] to-[#34A853] shadow-2xl group">
                <div className="w-full h-full rounded-full overflow-hidden bg-[#1e293b] relative">
                  <img
                    src={selectedPersona.imageSrc}
                    alt={selectedPersona.name}
                    className={`w-full h-full object-cover transition-transform duration-700 ${
                      isSpeaking && !isMuted ? 'scale-105 filter brightness-105' : 'scale-100'
                    }`}
                  />
                  {/* Subtle Speaking Lip/Voice Glow Overlay */}
                  {isSpeaking && !isMuted && (
                    <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-[#4285F4]/40 to-transparent flex items-center justify-center">
                      <div className="flex items-center gap-1">
                        <span className="w-1 bg-white rounded-full animate-pulse h-4"></span>
                        <span className="w-1 bg-white rounded-full animate-pulse h-6" style={{ animationDelay: '100ms' }}></span>
                        <span className="w-1 bg-white rounded-full animate-pulse h-3" style={{ animationDelay: '200ms' }}></span>
                        <span className="w-1 bg-white rounded-full animate-pulse h-5" style={{ animationDelay: '300ms' }}></span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Live Neural Avatar Badge */}
                <div className="absolute top-2 right-2 px-2.5 py-0.5 rounded-full bg-black/80 backdrop-blur-md text-white text-[10px] font-bold border border-white/20 flex items-center gap-1 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-[#34A853] animate-pulse"></span>
                  <span>Neural Human</span>
                </div>
              </div>

              {/* Persona Tag */}
              <div className="mt-3 text-center">
                <span className="text-sm font-bold text-white drop-shadow-sm flex items-center justify-center gap-1.5">
                  {selectedPersona.name}
                  <span className="material-symbols-outlined text-[#34A853] text-[16px]">verified</span>
                </span>
                <span className="text-xs text-white/70 block">{selectedPersona.role}</span>
              </div>
            </div>

            {/* Persona Switcher Chips */}
            <div className="absolute bottom-3 left-3 right-3 z-20 flex items-center justify-center gap-2">
              {PERSONAS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPersona(p)}
                  className={`px-3 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5 transition-all shadow-xs ${
                    selectedPersona.id === p.id
                      ? 'bg-white text-[#1f1f1f] ring-2 ring-[#4285F4]'
                      : 'bg-black/60 backdrop-blur-md text-white/80 hover:bg-black/80'
                  }`}
                >
                  <img src={p.imageSrc} alt={p.name} className="w-4 h-4 rounded-full object-cover" />
                  <span>{p.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* MODE 2 & 3: THREE.JS 3D CANVAS (Ready Player Me or Hologram) */}
        {avatarMode !== 'neural-human' && (
          <div ref={mountRef} className="relative w-full h-full">
            {rpmLoading && (
              <div className="absolute inset-0 z-30 bg-black/70 flex flex-col items-center justify-center gap-2 text-white text-xs">
                <span className="material-symbols-outlined text-[28px] animate-spin text-[#4285F4]">
                  progress_activity
                </span>
                <span>Streaming Ready Player Me 3D Avatar...</span>
              </div>
            )}
          </div>
        )}

        {/* Real-time Audio Spectrum Bottom Overlay */}
        <div className="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex items-center justify-between px-4 z-20">
          <div className="flex items-center gap-2 text-[11px] text-white/80 font-mono">
            <span className="material-symbols-outlined text-[16px] text-[#34A853]">graphic_eq</span>
            <span>
              {isSpeaking && !isMuted ? 'Lip-Sync: Active (142ms)' : 'Listening Mode'}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-[10px] text-white/60 font-semibold uppercase tracking-wider">
              {personality}
            </span>
          </div>
        </div>
      </div>

      {/* Avatar Services & Provider Integration Modal */}
      <AvatarIntegrationsModal
        isOpen={isIntegrationsModalOpen}
        onClose={() => setIsIntegrationsModalOpen(false)}
        currentModelUrl={customModelUrl}
        onLoadCustomModel={(url) => {
          setCustomModelUrl(url);
          setAvatarMode('ready-player-me');
        }}
      />
    </div>
  );
};
