'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeCanvasProps {
  className?: string;
}

export function ThreeCanvas({ className = '' }: ThreeCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check WebGL availability
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return;

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    // Atmospheric fog matching #081919 (Black Stallion)
    scene.fog = new THREE.FogExp2(0x081919, 0.0018);

    const camera = new THREE.PerspectiveCamera(55, width / height, 1, 1000);
    camera.position.z = 240;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // ── Particle Lattice ───────────────────────────────────────────
    const particleCount = 110;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const velocities: { x: number; y: number; z: number }[] = [];

    // Colors: #CE1A1E (Thunder Red), #65060E (Blood God), #837F78 (Chain Link), #223330 (Concealed Green)
    const colorPalette = [
      new THREE.Color(0xce1a1e),
      new THREE.Color(0x65060e),
      new THREE.Color(0x837f78),
      new THREE.Color(0xce1a1e),
      new THREE.Color(0x223330),
    ];

    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3;
      positions[idx] = (Math.random() - 0.5) * 360;
      positions[idx + 1] = (Math.random() - 0.5) * 260;
      positions[idx + 2] = (Math.random() - 0.5) * 220;

      const chosenColor = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colors[idx] = chosenColor.r;
      colors[idx + 1] = chosenColor.g;
      colors[idx + 2] = chosenColor.b;

      velocities.push({
        x: (Math.random() - 0.5) * 0.18,
        y: (Math.random() - 0.5) * 0.18,
        z: (Math.random() - 0.5) * 0.12,
      });
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Particle texture - clean cryptographic star spark
    const particleCanvas = document.createElement('canvas');
    particleCanvas.width = 32;
    particleCanvas.height = 32;
    const ctx = particleCanvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(0.3, 'rgba(206, 26, 30, 0.85)');
      grad.addColorStop(0.7, 'rgba(101, 6, 14, 0.35)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 32, 32);
    }
    const particleTexture = new THREE.CanvasTexture(particleCanvas);

    const particleMaterial = new THREE.PointsMaterial({
      size: 6.5,
      map: particleTexture,
      transparent: true,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);

    // ── Interconnected cryptographic link lines ───────────────────
    const maxConnections = 120;
    const linePositions = new Float32Array(maxConnections * 2 * 3);
    const lineColors = new Float32Array(maxConnections * 2 * 3);

    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    lineGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));

    const lineMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const lineSystem = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lineSystem);

    // ── Mouse & Scroll Parallax ───────────────────────────────────
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });

    // ── Animation Loop ────────────────────────────────────────────
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const posAttr = particleGeometry.attributes.position as THREE.BufferAttribute;
      const posArray = posAttr.array as Float32Array;

      // Update particle drift
      for (let i = 0; i < particleCount; i++) {
        const idx = i * 3;
        posArray[idx] += velocities[i].x;
        posArray[idx + 1] += velocities[i].y;
        posArray[idx + 2] += velocities[i].z;

        // Soft bounce boundaries
        if (posArray[idx] < -180 || posArray[idx] > 180) velocities[i].x *= -1;
        if (posArray[idx + 1] < -130 || posArray[idx + 1] > 130) velocities[i].y *= -1;
        if (posArray[idx + 2] < -110 || posArray[idx + 2] > 110) velocities[i].z *= -1;
      }
      posAttr.needsUpdate = true;

      // Build peer connection lines
      let connectionCount = 0;
      const connectionDist = 42;

      for (let i = 0; i < particleCount && connectionCount < maxConnections; i++) {
        for (let j = i + 1; j < particleCount && connectionCount < maxConnections; j++) {
          const dx = posArray[i * 3] - posArray[j * 3];
          const dy = posArray[i * 3 + 1] - posArray[j * 3 + 1];
          const dz = posArray[i * 3 + 2] - posArray[j * 3 + 2];
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist < connectionDist) {
            const lineIdx = connectionCount * 6;
            linePositions[lineIdx] = posArray[i * 3];
            linePositions[lineIdx + 1] = posArray[i * 3 + 1];
            linePositions[lineIdx + 2] = posArray[i * 3 + 2];

            linePositions[lineIdx + 3] = posArray[j * 3];
            linePositions[lineIdx + 4] = posArray[j * 3 + 1];
            linePositions[lineIdx + 5] = posArray[j * 3 + 2];

            const alpha = 1.0 - dist / connectionDist;
            lineColors[lineIdx] = 0.8 * alpha; // red
            lineColors[lineIdx + 1] = 0.1 * alpha;
            lineColors[lineIdx + 2] = 0.12 * alpha;

            lineColors[lineIdx + 3] = 0.5 * alpha;
            lineColors[lineIdx + 4] = 0.52 * alpha;
            lineColors[lineIdx + 5] = 0.48 * alpha;

            connectionCount++;
          }
        }
      }

      lineGeometry.setDrawRange(0, connectionCount * 2);
      (lineGeometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
      (lineGeometry.attributes.color as THREE.BufferAttribute).needsUpdate = true;

      // Smooth camera interpolation
      targetX += (mouseX * 24 - targetX) * 0.04;
      targetY += (mouseY * 18 - targetY) * 0.04;

      camera.position.x = targetX;
      camera.position.y = targetY;
      camera.lookAt(0, 0, 0);

      // Subtle scene rotation
      scene.rotation.y += 0.0006;
      scene.rotation.x += 0.0003;

      renderer.render(scene, camera);
    };

    animate();

    // ── Resize handler ────────────────────────────────────────────
    const onResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animationFrameId);

      particleGeometry.dispose();
      particleMaterial.dispose();
      particleTexture.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      renderer.dispose();

      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
      aria-hidden="true"
    />
  );
}
