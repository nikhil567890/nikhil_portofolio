/**
 * NIKHIL // DIGITAL LAB v3 — PROJECT UNIVERSE PROCEDURAL 3D MINI-WORLDS
 * 5 distinct procedural spatial worlds along the project corridor:
 * 1. KSP Sahayak: Secure lattice grid + defense shield + orbital communication nodes
 * 2. FINAURA: Rising/falling data columns + real-time financial telemetry streams
 * 3. Smart Reminder: Clock-like orbital torus rings + periodic pulse bursts
 * 4. Community / Village Grievance System: Branching decision-tree network with authority nodes
 * 5. Vinodh Sir Math Classes: Wireframe globe ecosystem + educational distribution arcs
 */

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

export class ProjectUniverse {
  constructor(scene, projectsData) {
    this.scene = scene;
    this.projectsData = projectsData;
    this.group = new THREE.Group();
    this.worlds = [];
    this.activeWorldIndex = 0;

    this.init();
  }

  init() {
    this.group.position.set(0, 0, 0);

    // World spacing along spatial corridor
    const corridorStartsZ = -40;
    const spacingZ = -14;

    this.projectsData.forEach((project, index) => {
      const worldGroup = new THREE.Group();
      const zPos = corridorStartsZ + index * spacingZ;
      const xOffset = index % 2 === 0 ? 3.5 : -3.5; // Alternating offset for breathing composition

      worldGroup.position.set(xOffset, 0, zPos);
      worldGroup.userData = { project, index, basePos: new THREE.Vector3(xOffset, 0, zPos) };

      let miniWorld = null;
      switch (project.worldType) {
        case 'globe':
          miniWorld = this.createGlobeWorld(project);
          break;
        case 'dataColumns':
          miniWorld = this.createDataColumnsWorld(project);
          break;
        case 'decisionTree':
          miniWorld = this.createDecisionTreeWorld(project);
          break;
        case 'clockTorus':
          miniWorld = this.createClockTorusWorld(project);
          break;
        case 'securityLattice':
          miniWorld = this.createSecurityLatticeWorld(project);
          break;
        default:
          miniWorld = this.createGlobeWorld(project);
      }

      worldGroup.add(miniWorld.meshGroup);
      this.group.add(worldGroup);

      this.worlds.push({
        group: worldGroup,
        project,
        miniWorld,
        update: miniWorld.update
      });
    });

    this.scene.add(this.group);
  }

  // 5. Vinodh Sir Math Classes: Wireframe globe + educational distribution arcs
  createGlobeWorld(project) {
    const meshGroup = new THREE.Group();
    const radius = 2.4;

    // Wireframe Globe
    const globeGeo = new THREE.SphereGeometry(radius, 24, 24);
    const globeMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(project.accent || '#22d3ee'),
      wireframe: true,
      transparent: true,
      opacity: 0.45
    });
    const globe = new THREE.Mesh(globeGeo, globeMat);
    meshGroup.add(globe);

    // Inner glowing core
    const coreGeo = new THREE.SphereGeometry(radius * 0.7, 16, 16);
    const coreMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(project.accent || '#22d3ee'),
      transparent: true,
      opacity: 0.15
    });
    meshGroup.add(new THREE.Mesh(coreGeo, coreMat));

    // Route Arcs
    const arcsGroup = new THREE.Group();
    const arcCount = 5;
    for (let i = 0; i < arcCount; i++) {
      const v1 = new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2
      ).normalize().multiplyScalar(radius);

      const v2 = new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2
      ).normalize().multiplyScalar(radius);

      const mid = v1.clone().add(v2).multiplyScalar(0.5).normalize().multiplyScalar(radius * 1.45);

      const curve = new THREE.QuadraticBezierCurve3(v1, mid, v2);
      const points = curve.getPoints(30);
      const arcGeo = new THREE.BufferGeometry().setFromPoints(points);
      const arcMat = new THREE.LineBasicMaterial({
        color: i % 2 === 0 ? 0x22d3ee : 0x8b5cf6,
        transparent: true,
        opacity: 0.8
      });
      arcsGroup.add(new THREE.Line(arcGeo, arcMat));
    }
    meshGroup.add(arcsGroup);

    // Drifting atmospheric particles
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(150 * 3);
    for (let i = 0; i < 150; i++) {
      const v = new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2
      ).normalize().multiplyScalar(radius * (1.1 + Math.random() * 0.4));
      pPos[i * 3] = v.x;
      pPos[i * 3 + 1] = v.y;
      pPos[i * 3 + 2] = v.z;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.08,
      transparent: true,
      opacity: 0.7
    });
    const particles = new THREE.Points(pGeo, pMat);
    meshGroup.add(particles);

    return {
      meshGroup,
      update: (time) => {
        globe.rotation.y = time * 0.2;
        globe.rotation.x = time * 0.05;
        arcsGroup.rotation.y = time * 0.2;
        arcsGroup.rotation.x = time * 0.05;
        particles.rotation.y = -time * 0.15;
      }
    };
  }

  // 2. FINAURA: Rising/falling data columns + real-time financial telemetry streams
  createDataColumnsWorld(project) {
    const meshGroup = new THREE.Group();
    const colsGroup = new THREE.Group();
    const columns = [];
    const gridSize = 5;
    const spacing = 0.9;

    const barGeo = new THREE.BoxGeometry(0.45, 1, 0.45);

    for (let x = 0; x < gridSize; x++) {
      for (let z = 0; z < gridSize; z++) {
        const barMat = new THREE.MeshStandardMaterial({
          color: new THREE.Color(project.accent || '#818cf8'),
          roughness: 0.2,
          metalness: 0.8,
          wireframe: false
        });
        const bar = new THREE.Mesh(barGeo, barMat);
        const posX = (x - (gridSize - 1) / 2) * spacing;
        const posZ = (z - (gridSize - 1) / 2) * spacing;
        bar.position.set(posX, 0, posZ);
        colsGroup.add(bar);
        columns.push({ mesh: bar, seed: x * 0.5 + z * 0.8 });
      }
    }
    meshGroup.add(colsGroup);

    // Glowing wireframe base plate
    const baseGeo = new THREE.PlaneGeometry(5.5, 5.5, 8, 8);
    const baseMat = new THREE.MeshBasicMaterial({
      color: 0x8b5cf6,
      wireframe: true,
      transparent: true,
      opacity: 0.3
    });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.rotation.x = -Math.PI / 2;
    baseMesh.position.y = -1.2;
    meshGroup.add(baseMesh);

    return {
      meshGroup,
      update: (time) => {
        colsGroup.rotation.y = time * 0.15;
        columns.forEach(col => {
          const height = Math.sin(time * 2.5 + col.seed) * 1.6 + 2.2;
          col.mesh.scale.set(1, height, 1);
          col.mesh.position.y = height / 2 - 1.2;
        });
      }
    };
  }

  // 4. Community / Village Grievance System: Branching decision-tree network with authority nodes
  createDecisionTreeWorld(project) {
    const meshGroup = new THREE.Group();
    const nodes = [];
    const linesGroup = new THREE.Group();

    // Node layers: Root (1) -> Middle (3) -> Leaf (6)
    const layers = [
      [{ x: 0, y: 2.2, z: 0 }],
      [{ x: -1.6, y: 0.6, z: -0.6 }, { x: 0, y: 0.6, z: 0.8 }, { x: 1.6, y: 0.6, z: -0.6 }],
      [
        { x: -2.4, y: -1.4, z: -1.0 }, { x: -1.0, y: -1.4, z: -0.2 },
        { x: -0.4, y: -1.4, z: 1.2 }, { x: 0.6, y: -1.4, z: 1.0 },
        { x: 1.2, y: -1.4, z: -0.4 }, { x: 2.4, y: -1.4, z: -1.0 }
      ]
    ];

    const nodeGeo = new THREE.OctahedronGeometry(0.32, 0);
    const nodeMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(project.accent || '#a78bfa'),
      wireframe: true
    });

    layers.forEach((layer, lIdx) => {
      layer.forEach((pos, nIdx) => {
        const mesh = new THREE.Mesh(nodeGeo, nodeMat);
        mesh.position.set(pos.x, pos.y, pos.z);
        meshGroup.add(mesh);
        nodes.push({ mesh, layer: lIdx, index: nIdx, basePos: pos });
      });
    });

    // Connecting lines between layers
    // Layer 0 to 1
    layers[0].forEach(p0 => {
      layers[1].forEach(p1 => {
        const lineGeo = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(p0.x, p0.y, p0.z),
          new THREE.Vector3(p1.x, p1.y, p1.z)
        ]);
        const lineMat = new THREE.LineBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0.6 });
        linesGroup.add(new THREE.Line(lineGeo, lineMat));
      });
    });

    // Layer 1 to 2
    layers[1].forEach((p1, idx) => {
      const targetIndices = [idx * 2, idx * 2 + 1];
      targetIndices.forEach(tIdx => {
        if (layers[2][tIdx]) {
          const p2 = layers[2][tIdx];
          const lineGeo = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(p1.x, p1.y, p1.z),
            new THREE.Vector3(p2.x, p2.y, p2.z)
          ]);
          const lineMat = new THREE.LineBasicMaterial({ color: 0x8b5cf6, transparent: true, opacity: 0.5 });
          linesGroup.add(new THREE.Line(lineGeo, lineMat));
        }
      });
    });

    meshGroup.add(linesGroup);

    return {
      meshGroup,
      update: (time) => {
        meshGroup.rotation.y = time * 0.2;
        nodes.forEach((n, i) => {
          const s = 1.0 + Math.sin(time * 4.0 + i) * 0.25;
          n.mesh.scale.setScalar(s);
          n.mesh.rotation.y = time * 1.5 + i;
        });
      }
    };
  }

  // 4. Smart Reminder: Clock-like orbital torus + periodic pulse bursts
  createClockTorusWorld(project) {
    const meshGroup = new THREE.Group();

    // Central Torus Ring
    const torusGeo = new THREE.TorusGeometry(2.2, 0.08, 16, 64);
    const torusMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(project.accent || '#2dd4bf'),
      wireframe: true
    });
    const torus = new THREE.Mesh(torusGeo, torusMat);
    meshGroup.add(torus);

    // Second Tilted Ring
    const ringGeo2 = new THREE.TorusGeometry(1.6, 0.04, 16, 48);
    const ringMat2 = new THREE.MeshBasicMaterial({ color: 0x8b5cf6, wireframe: true });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.x = Math.PI / 3;
    meshGroup.add(ring2);

    // Orbiting Time Markers
    const markers = [];
    const markerCount = 6;
    for (let i = 0; i < markerCount; i++) {
      const mGeo = new THREE.SphereGeometry(0.18, 12, 12);
      const mMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const mMesh = new THREE.Mesh(mGeo, mMat);
      meshGroup.add(mMesh);
      markers.push({ mesh: mMesh, angleOffset: (i / markerCount) * Math.PI * 2 });
    }

    // Glowing Pulse Wave Disc
    const waveGeo = new THREE.RingGeometry(0.2, 2.5, 32);
    const waveMat = new THREE.MeshBasicMaterial({
      color: 0x2dd4bf,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.25
    });
    const wave = new THREE.Mesh(waveGeo, waveMat);
    meshGroup.add(wave);

    return {
      meshGroup,
      update: (time) => {
        torus.rotation.z = time * 0.3;
        ring2.rotation.y = time * 0.4;
        ring2.rotation.x = Math.PI / 3 + Math.sin(time) * 0.2;

        markers.forEach(m => {
          const angle = time * 0.8 + m.angleOffset;
          m.mesh.position.set(Math.cos(angle) * 2.2, Math.sin(angle) * 2.2, 0);
        });

        // Expanding radial pulse
        const pulseCycle = (time * 1.2) % 2.0;
        wave.scale.setScalar(0.2 + pulseCycle * 1.1);
        waveMat.opacity = Math.max(0, 0.6 * (1.0 - pulseCycle / 2.0));
      }
    };
  }

  // 5. KSP Sahayak: Secure lattice grid + traveling pulse lines
  createSecurityLatticeWorld(project) {
    const meshGroup = new THREE.Group();

    // Hexagonal / Icosahedral Security Shield
    const shieldGeo = new THREE.IcosahedronGeometry(2.4, 1);
    const shieldMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(project.accent || '#38bdf8'),
      wireframe: true,
      transparent: true,
      opacity: 0.6
    });
    const shield = new THREE.Mesh(shieldGeo, shieldMat);
    meshGroup.add(shield);

    // Inner Radiant Star
    const starGeo = new THREE.DodecahedronGeometry(1.1, 0);
    const starMat = new THREE.MeshBasicMaterial({
      color: 0x22d3ee,
      wireframe: false,
      transparent: true,
      opacity: 0.4
    });
    const innerStar = new THREE.Mesh(starGeo, starMat);
    meshGroup.add(innerStar);

    // Communication Orbiters
    const orbiters = [];
    for (let i = 0; i < 4; i++) {
      const oGeo = new THREE.OctahedronGeometry(0.2, 0);
      const oMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const oMesh = new THREE.Mesh(oGeo, oMat);
      meshGroup.add(oMesh);
      orbiters.push({ mesh: oMesh, speed: 1.2 + i * 0.3, radius: 2.8 + i * 0.3, plane: i });
    }

    return {
      meshGroup,
      update: (time) => {
        shield.rotation.y = time * 0.25;
        shield.rotation.z = time * 0.15;
        innerStar.rotation.y = -time * 0.5;
        innerStar.rotation.x = time * 0.3;

        orbiters.forEach((orb, i) => {
          const a = time * orb.speed;
          if (orb.plane % 2 === 0) {
            orb.mesh.position.set(Math.cos(a) * orb.radius, Math.sin(a) * orb.radius * 0.6, Math.sin(a) * orb.radius * 0.8);
          } else {
            orb.mesh.position.set(Math.sin(a) * orb.radius * 0.7, Math.cos(a) * orb.radius, Math.cos(a) * orb.radius * 0.7);
          }
        });
      }
    };
  }

  update(time, activeIndex = 0) {
    this.activeWorldIndex = activeIndex;
    this.worlds.forEach((w, i) => {
      if (w.update) {
        w.update(time);
      }
      // Floating bobbing motion
      w.group.position.y = Math.sin(time * 1.4 + i) * 0.35;
    });
  }
}
