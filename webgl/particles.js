/**
 * NIKHIL // DIGITAL LAB v3 — GPU PARTICLE FIELD & TEXT MORPH ENGINE
 * Generates 5k+ particles with curl-noise flow, cursor repulsion & "A.NIKHIL" text target morphing.
 */

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { ParticleShaders } from './shaders.js';

export class ParticleUniverse {
  constructor(scene, tier = 'HIGH') {
    this.scene = scene;
    this.tier = tier;
    this.particleCount = tier === 'HIGH' ? 5200 : tier === 'MEDIUM' ? 2400 : 1000;
    this.points = null;
    this.geometry = null;
    this.material = null;
    this.textTargetCoords = [];

    this.init();
  }

  generateTextTargets(text = "A.NIKHIL") {
    // Render text to offscreen 2D canvas and sample non-transparent pixels
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const width = 800;
    const height = 240;
    canvas.width = width;
    canvas.height = height;

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 96px "Space Grotesk", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, width / 2, height / 2);

    const imgData = ctx.getImageData(0, 0, width, height).data;
    const sampledPoints = [];
    const step = 4; // Sample density

    for (let y = 0; y < height; y += step) {
      for (let x = 0; x < width; x += step) {
        const idx = (y * width + x) * 4;
        if (imgData[idx] > 128) {
          // Normalize to 3D world space coordinates centered near hero core
          const worldX = ((x - width / 2) / width) * 26.0;
          const worldY = -((y - height / 2) / height) * 8.0 + 0.5;
          const worldZ = (Math.random() - 0.5) * 1.5; // Slight depth jitter
          sampledPoints.push(new THREE.Vector3(worldX, worldY, worldZ));
        }
      }
    }

    this.textTargetCoords = sampledPoints;
  }

  init() {
    this.generateTextTargets("A.NIKHIL");

    this.geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(this.particleCount * 3);
    const targetPositions = new Float32Array(this.particleCount * 3);
    const randomSeeds = new Float32Array(this.particleCount);
    const sizes = new Float32Array(this.particleCount);

    const targetsLen = this.textTargetCoords.length;

    for (let i = 0; i < this.particleCount; i++) {
      const i3 = i * 3;

      // Base free flow cloud across the spatial journey
      positions[i3] = (Math.random() - 0.5) * 55;
      positions[i3 + 1] = (Math.random() - 0.5) * 40;
      positions[i3 + 2] = (Math.random() - 0.5) * 120 - 20;

      // Assign corresponding text target or wrap around
      if (targetsLen > 0) {
        const target = this.textTargetCoords[i % targetsLen];
        targetPositions[i3] = target.x + (Math.random() - 0.5) * 0.15;
        targetPositions[i3 + 1] = target.y + (Math.random() - 0.5) * 0.15;
        targetPositions[i3 + 2] = target.z;
      } else {
        targetPositions[i3] = positions[i3];
        targetPositions[i3 + 1] = positions[i3 + 1];
        targetPositions[i3 + 2] = positions[i3 + 2];
      }

      randomSeeds[i] = Math.random();
      sizes[i] = 14.0 + Math.random() * 22.0;
    }

    this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.geometry.setAttribute('aTargetPos', new THREE.BufferAttribute(targetPositions, 3));
    this.geometry.setAttribute('aRandomSeed', new THREE.BufferAttribute(randomSeeds, 1));
    this.geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));

    this.material = new THREE.ShaderMaterial({
      vertexShader: ParticleShaders.vertexShader,
      fragmentShader: ParticleShaders.fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uMorphProgress: { value: 0.0 },
        uCursor3D: { value: new THREE.Vector3(999, 999, 999) },
        uRepulsionRadius: { value: 5.5 },
        uRepulsionStrength: { value: 4.2 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2.0) }
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    this.points = new THREE.Points(this.geometry, this.material);
    this.scene.add(this.points);
  }

  update(time, scrollProgress, cursor3D) {
    if (!this.material) return;

    this.material.uniforms.uTime.value = time;

    if (cursor3D) {
      this.material.uniforms.uCursor3D.value.copy(cursor3D);
    }

    // Morph at scroll ~8% (Hero transition) and ~98% (Final Shutdown/Mantra)
    let morphVal = 0.0;
    if (scrollProgress >= 0.04 && scrollProgress <= 0.14) {
      // Assemble into "A.NIKHIL"
      if (scrollProgress < 0.08) {
        morphVal = (scrollProgress - 0.04) / 0.04;
      } else if (scrollProgress <= 0.11) {
        morphVal = 1.0; // Hold peak shape
      } else {
        morphVal = 1.0 - (scrollProgress - 0.11) / 0.03; // Dissolve back
      }
    } else if (scrollProgress >= 0.94) {
      // Final convergence
      morphVal = (scrollProgress - 0.94) / 0.06;
    }

    this.material.uniforms.uMorphProgress.value = THREE.MathUtils.clamp(morphVal, 0.0, 1.0);
  }

  setTier(tier) {
    this.tier = tier;
    // Adapt pixel ratio in uniform
    if (this.material) {
      const dprCap = tier === 'HIGH' ? 2.0 : tier === 'MEDIUM' ? 1.5 : 1.0;
      this.material.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, dprCap);
    }
  }

  dispose() {
    if (this.points) {
      this.scene.remove(this.points);
      this.geometry.dispose();
      this.material.dispose();
    }
  }
}
