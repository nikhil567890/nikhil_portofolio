/**
 * NIKHIL // DIGITAL LAB v3 — MASTER WEBGL SCENE ORCHESTRATOR
 * Single persistent canvas, procedural core, spline camera travel, GPU particles,
 * and unified spatial worlds.
 */

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { CoreShaders } from './shaders.js';
import { ParticleUniverse } from './particles.js';
import { SkillsGalaxy } from './skills-galaxy.js';
import { ProjectUniverse } from './project-worlds.js';
import { SpatialData } from './timeline-beacon.js';

export class WebGLScene {
  constructor(canvas, data, options = {}) {
    this.canvas = canvas;
    this.data = data;
    this.options = options;

    this.tier = this.detectDeviceTier();
    this.clock = new THREE.Clock();
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0, clientX: 0, clientY: 0 };
    this.cursor3D = new THREE.Vector3(0, 0, 0);
    this.scrollProgress = 0;
    this.targetScrollProgress = 0;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.raycaster = new THREE.Raycaster();
    this.planeRaycast = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);

    // Systems
    this.heroCore = null;
    this.heroRings = [];
    this.heroShell = null;
    this.contactCore = null;
    this.particles = null;
    this.skillsGalaxy = null;
    this.projectUniverse = null;
    this.spatialData = null;

    this.isInitialized = false;
    this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.init();
  }

  detectDeviceTier() {
    try {
      const gl = document.createElement('canvas').getContext('webgl');
      if (!gl) return 'FALLBACK';
      const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const cores = navigator.hardwareConcurrency || 4;
      if (isMobile || cores <= 4) return 'MEDIUM';
      return 'HIGH';
    } catch (e) {
      return 'MEDIUM';
    }
  }

  init() {
    try {
      // 1. Scene & Atmosphere
      this.scene = new THREE.Scene();
      this.scene.fog = new THREE.FogExp2(0x05060a, 0.012);

      // 2. Camera
      const aspect = window.innerWidth / window.innerHeight;
      this.camera = new THREE.PerspectiveCamera(50, aspect, 0.1, 400);
      this.camera.position.set(0, 0, 12);

      // 3. Renderer
      const dprCap = this.tier === 'HIGH' ? 2.0 : this.tier === 'MEDIUM' ? 1.5 : 1.0;
      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        antialias: this.tier !== 'LOW',
        alpha: true,
        powerPreference: 'high-performance'
      });
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, dprCap));
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = 1.2;

      // 4. Lights
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
      this.scene.add(ambientLight);

      this.cursorLight = new THREE.PointLight(0x22d3ee, 3.5, 25);
      this.cursorLight.position.set(0, 0, 5);
      this.scene.add(this.cursorLight);

      // 5. Initialize Subsystems
      this.initHeroCore();
      this.initContactCore();

      this.particles = new ParticleUniverse(this.scene, this.tier);
      
      this.skillsGalaxy = new SkillsGalaxy(
        this.scene,
        this.data.skills,
        (skill) => this.options.onSkillClick && this.options.onSkillClick(skill)
      );

      this.projectUniverse = new ProjectUniverse(this.scene, this.data.projects);

      this.spatialData = new SpatialData(
        this.scene,
        this.data.education,
        this.data.experience,
        this.data.interests,
        (interest) => this.options.onInterestClick && this.options.onInterestClick(interest)
      );

      // 6. Event Listeners
      window.addEventListener('resize', this.onResize.bind(this));
      window.addEventListener('mousemove', this.onMouseMove.bind(this), { passive: true });
      window.addEventListener('click', this.onClick.bind(this));

      this.isInitialized = true;
      this.animate();
    } catch (err) {
      console.error("WebGL Scene Init Error:", err);
      if (this.options.onFallback) {
        this.options.onFallback();
      }
    }
  }

  initHeroCore() {
    const heroGroup = new THREE.Group();
    heroGroup.position.set(0, 0, 0);

    // Custom Simplex Noise Morphing Core
    const coreGeo = new THREE.IcosahedronGeometry(2.2, 4);
    this.coreMaterial = new THREE.ShaderMaterial({
      vertexShader: CoreShaders.vertexShader,
      fragmentShader: CoreShaders.fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uDisplacement: { value: 0.38 },
        uColorCyan: { value: new THREE.Color(0x22d3ee) },
        uColorViolet: { value: new THREE.Color(0x8b5cf6) },
        uColorCore: { value: new THREE.Color(0x0a1128) },
        uCameraPos: { value: this.camera.position }
      },
      transparent: true
    });
    this.heroCore = new THREE.Mesh(coreGeo, this.coreMaterial);
    heroGroup.add(this.heroCore);

    // Faint Outer Wireframe Shell
    const shellGeo = new THREE.IcosahedronGeometry(3.0, 1);
    const shellMat = new THREE.MeshBasicMaterial({
      color: 0x8b5cf6,
      wireframe: true,
      transparent: true,
      opacity: 0.2
    });
    this.heroShell = new THREE.Mesh(shellGeo, shellMat);
    heroGroup.add(this.heroShell);

    // 3 Tilted Orbital Rings with Traveling Beads
    const ringConfigs = [
      { radius: 3.8, tube: 0.025, rotX: Math.PI / 4, rotY: 0, speed: 0.8 },
      { radius: 4.6, tube: 0.02, rotX: -Math.PI / 3, rotY: Math.PI / 6, speed: -0.6 },
      { radius: 5.4, tube: 0.018, rotX: Math.PI / 6, rotY: -Math.PI / 4, speed: 1.1 }
    ];

    ringConfigs.forEach((cfg) => {
      const rGroup = new THREE.Group();
      rGroup.rotation.set(cfg.rotX, cfg.rotY, 0);

      const rGeo = new THREE.TorusGeometry(cfg.radius, cfg.tube, 16, 64);
      const rMat = new THREE.MeshBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0.4 });
      const rMesh = new THREE.Mesh(rGeo, rMat);
      rGroup.add(rMesh);

      // Glowing Bead
      const beadGeo = new THREE.SphereGeometry(0.12, 12, 12);
      const beadMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const bead = new THREE.Mesh(beadGeo, beadMat);
      rGroup.add(bead);

      heroGroup.add(rGroup);
      this.heroRings.push({ group: rGroup, bead, radius: cfg.radius, speed: cfg.speed });
    });

    this.scene.add(heroGroup);
    this.heroGroup = heroGroup;
  }

  initContactCore() {
    const contactGroup = new THREE.Group();
    contactGroup.position.set(0, 0, -180); // Final contact core zone

    const coreGeo = new THREE.IcosahedronGeometry(4.5, 3);
    const coreMat = new THREE.ShaderMaterial({
      vertexShader: CoreShaders.vertexShader,
      fragmentShader: CoreShaders.fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uDisplacement: { value: 0.45 },
        uColorCyan: { value: new THREE.Color(0x22d3ee) },
        uColorViolet: { value: new THREE.Color(0x8b5cf6) },
        uColorCore: { value: new THREE.Color(0x05060a) },
        uCameraPos: { value: this.camera.position }
      },
      transparent: true
    });
    this.contactCore = new THREE.Mesh(coreGeo, coreMat);
    contactGroup.add(this.contactCore);

    // Large ambient outer pulse torus
    const ringGeo = new THREE.TorusGeometry(7.5, 0.06, 16, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0.35 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    contactGroup.add(ring);
    this.contactRing = ring;

    this.scene.add(contactGroup);
    this.contactGroup = contactGroup;
  }

  onResize() {
    if (!this.renderer || !this.camera) return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
    const dprCap = this.tier === 'HIGH' ? 2.0 : this.tier === 'MEDIUM' ? 1.5 : 1.0;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, dprCap));
  }

  onMouseMove(e) {
    this.mouse.clientX = e.clientX;
    this.mouse.clientY = e.clientY;
    this.mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
    this.mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
  }

  onClick(e) {
    if (!this.camera || !this.isInitialized) return;
    this.raycaster.setFromCamera(new THREE.Vector2(this.mouse.targetX, this.mouse.targetY), this.camera);

    let handled = false;
    if (this.skillsGalaxy) {
      handled = this.skillsGalaxy.handleClick(this.raycaster);
    }
    if (!handled && this.spatialData) {
      this.spatialData.handleClick(this.raycaster);
    }
  }

  setScrollProgress(progress) {
    this.targetScrollProgress = THREE.MathUtils.clamp(progress, 0, 1);
  }

  // Camera Spline Path Calculation
  getCameraSplinePoint(p) {
    // 8 Keyframed checkpoints along the continuous descent
    // 0.00: Hero far approach -> (0, 0, 11)
    // 0.12: Hero core dive -> (0, 0.5, 3.5)
    // 0.25: Scan Technology / Skills Galaxy -> (0, 0, -14)
    // 0.45: Project Universe start -> (2.0, -0.5, -45)
    // 0.60: Project Universe deep -> (-2.0, 0.5, -78)
    // 0.72: Education Bezier Timeline -> (1.5, -0.8, -110)
    // 0.82: Experience Radiant Beacon -> (-2.5, 0.8, -130)
    // 0.90: Interests 10-Star Constellation -> (0.0, 0.0, -148)
    // 1.00: Contact Core & Shutdown -> (0.0, 0.0, -170)

    const waypoints = [
      { p: 0.00, pos: new THREE.Vector3(0, 0, 11.5), target: new THREE.Vector3(0, 0, 0) },
      { p: 0.10, pos: new THREE.Vector3(0, 0.4, 4.0), target: new THREE.Vector3(0, 0, 0) },
      { p: 0.25, pos: new THREE.Vector3(0, 0, -14.0), target: new THREE.Vector3(0, 0, -22.0) },
      { p: 0.42, pos: new THREE.Vector3(2.4, -0.4, -36.0), target: new THREE.Vector3(3.5, 0, -40.0) },
      { p: 0.52, pos: new THREE.Vector3(-2.2, 0.3, -50.0), target: new THREE.Vector3(-3.5, 0, -54.0) },
      { p: 0.64, pos: new THREE.Vector3(2.2, -0.3, -64.0), target: new THREE.Vector3(3.5, 0, -68.0) },
      { p: 0.74, pos: new THREE.Vector3(1.8, -0.6, -108.0), target: new THREE.Vector3(0, 0, -115.0) },
      { p: 0.84, pos: new THREE.Vector3(-1.8, 0.6, -128.0), target: new THREE.Vector3(-3.5, 0, -135.0) },
      { p: 0.92, pos: new THREE.Vector3(0.0, 0.0, -146.0), target: new THREE.Vector3(0, 0, -155.0) },
      { p: 1.00, pos: new THREE.Vector3(0.0, 0.0, -168.0), target: new THREE.Vector3(0, 0, -180.0) }
    ];

    // Find bounding pair
    let i = 0;
    for (i = 0; i < waypoints.length - 1; i++) {
      if (p >= waypoints[i].p && p <= waypoints[i + 1].p) {
        break;
      }
    }

    const w1 = waypoints[i];
    const w2 = waypoints[i + 1] || waypoints[waypoints.length - 1];
    const segT = (p - w1.p) / (w2.p - w1.p || 1);
    const smoothT = THREE.MathUtils.smoothstep(segT, 0, 1);

    const pos = new THREE.Vector3().lerpVectors(w1.pos, w2.pos, smoothT);
    const lookAt = new THREE.Vector3().lerpVectors(w1.target, w2.target, smoothT);

    return { pos, lookAt };
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));

    const time = this.clock.getElapsedTime();

    // Smooth lerp mouse parallax (±2 units max)
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.06;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.06;

    // Smooth lerp scroll progress
    this.scrollProgress += (this.targetScrollProgress - this.scrollProgress) * 0.08;

    // Update Camera via Spline + Mouse Parallax
    const { pos, lookAt } = this.getCameraSplinePoint(this.scrollProgress);

    const parallaxX = this.isReducedMotion ? 0 : this.mouse.x * 1.8;
    const parallaxY = this.isReducedMotion ? 0 : this.mouse.y * 1.4;

    this.camera.position.set(pos.x + parallaxX, pos.y + parallaxY, pos.z);
    this.camera.lookAt(lookAt.x, lookAt.y, lookAt.z);

    // Update 3D Cursor Raycast coordinates for particle deflection & flashlight
    this.raycaster.setFromCamera(new THREE.Vector2(this.mouse.targetX, this.mouse.targetY), this.camera);
    this.planeRaycast.constant = this.camera.position.z - 8.0;
    this.raycaster.ray.intersectPlane(this.planeRaycast, this.cursor3D);

    if (this.cursorLight) {
      this.cursorLight.position.set(
        this.camera.position.x + this.mouse.x * 4.0,
        this.camera.position.y + this.mouse.y * 3.0,
        this.camera.position.z - 3.0
      );
    }

    // Animate Hero Core
    if (this.coreMaterial) {
      this.coreMaterial.uniforms.uTime.value = time;
      this.coreMaterial.uniforms.uCameraPos.value.copy(this.camera.position);
    }
    if (this.heroCore) {
      this.heroCore.rotation.y = time * 0.15;
      this.heroCore.rotation.x = time * 0.08;
    }
    if (this.heroShell) {
      this.heroShell.rotation.y = -time * 0.1;
      this.heroShell.rotation.z = time * 0.05;
    }
    this.heroRings.forEach(ring => {
      ring.group.rotation.z = time * ring.speed;
      const beadAngle = time * ring.speed * 2.0;
      ring.bead.position.set(Math.cos(beadAngle) * ring.radius, Math.sin(beadAngle) * ring.radius, 0);
    });

    // Animate Contact Core
    if (this.contactCore && this.contactCore.material.uniforms) {
      this.contactCore.material.uniforms.uTime.value = time;
      this.contactCore.material.uniforms.uCameraPos.value.copy(this.camera.position);
      this.contactCore.rotation.y = time * 0.18;
      this.contactCore.rotation.z = time * 0.1;
    }
    if (this.contactRing) {
      this.contactRing.rotation.x = Math.PI / 2 + Math.sin(time) * 0.2;
      this.contactRing.rotation.y = time * 0.3;
    }

    // Update Subsystems
    if (this.particles) {
      this.particles.update(time, this.scrollProgress, this.cursor3D);
    }
    if (this.skillsGalaxy) {
      this.skillsGalaxy.update(time);
      const hoveredSkill = this.skillsGalaxy.handleRaycast(this.raycaster);
      if (this.options.onSkillHover) {
        this.options.onSkillHover(hoveredSkill);
      }
    }
    if (this.projectUniverse) {
      this.projectUniverse.update(time);
    }
    if (this.spatialData) {
      this.spatialData.update(time, this.cursor3D);
    }

    // Render Scene
    this.renderer.render(this.scene, this.camera);
  }
}
