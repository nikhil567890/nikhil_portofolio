/**
 * NIKHIL // DIGITAL LAB v3 — SPATIAL TIMELINE, MILESTONE BEACON & 10-STAR CONSTELLATION
 * Procedural 3D representations for Education, Experience & Interests.
 */

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

export class SpatialData {
  constructor(scene, educationData, experienceData, interestsData, onSelectInterest) {
    this.scene = scene;
    this.educationData = educationData;
    this.experienceData = experienceData;
    this.interestsData = interestsData;
    this.onSelectInterest = onSelectInterest;

    this.group = new THREE.Group();
    this.eduNodes = [];
    this.starNodes = [];
    this.constellationLines = null;
    this.constellationGeo = null;
    this.beaconGroup = null;

    this.initEducation();
    this.initExperienceBeacon();
    this.initInterestsConstellation();

    this.scene.add(this.group);
  }

  // 1. Education Luminous Bezier Curve & Milestones
  initEducation() {
    const eduGroup = new THREE.Group();
    eduGroup.position.set(0, 0, -115); // Timeline zone

    // 3 Key points along a smooth 3D bezier curve
    const p0 = new THREE.Vector3(-4.5, -2.0, 6.0);  // 2022 School
    const p1 = new THREE.Vector3(0.0, 0.5, 0.0);    // 2025 Diploma
    const p2 = new THREE.Vector3(4.5, 3.0, -6.0);   // 2028 B.Tech

    const curve = new THREE.CatmullRomCurve3([p0, p1, p2]);
    const points = curve.getPoints(50);
    const curveGeo = new THREE.BufferGeometry().setFromPoints(points);
    const curveMat = new THREE.LineBasicMaterial({
      color: 0x22d3ee,
      transparent: true,
      opacity: 0.7,
      linewidth: 2
    });
    eduGroup.add(new THREE.Line(curveGeo, curveMat));

    const nodePositions = [p0, p1, p2];
    this.educationData.forEach((edu, i) => {
      const pos = nodePositions[i] || new THREE.Vector3();
      const nGroup = new THREE.Group();
      nGroup.position.copy(pos);

      // Outer wireframe ring
      const ringGeo = new THREE.TorusGeometry(0.65, 0.04, 12, 32);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0x8b5cf6, wireframe: true });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      nGroup.add(ring);

      // Core glowing sphere
      const sphereGeo = new THREE.SphereGeometry(0.35, 16, 16);
      const sphereMat = new THREE.MeshBasicMaterial({ color: 0x22d3ee });
      const sphere = new THREE.Mesh(sphereGeo, sphereMat);
      nGroup.add(sphere);

      eduGroup.add(nGroup);
      this.eduNodes.push({ group: nGroup, ring, sphere, edu });
    });

    this.group.add(eduGroup);
  }

  // 2. Experience Radiant Milestone Beacon
  initExperienceBeacon() {
    this.beaconGroup = new THREE.Group();
    this.beaconGroup.position.set(-3.5, 0, -135); // Experience zone

    // Central Pillar Beam
    const beamGeo = new THREE.CylinderGeometry(0.12, 0.8, 8.0, 16, 1, true);
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0x22d3ee,
      transparent: true,
      opacity: 0.4,
      side: THREE.DoubleSide
    });
    const beam = new THREE.Mesh(beamGeo, beamMat);
    this.beaconGroup.add(beam);

    // Radiant Floating Crystal Core
    const crystalGeo = new THREE.OctahedronGeometry(1.2, 0);
    const crystalMat = new THREE.MeshBasicMaterial({
      color: 0x8b5cf6,
      wireframe: true
    });
    this.crystal = new THREE.Mesh(crystalGeo, crystalMat);
    this.beaconGroup.add(this.crystal);

    // Radar Scanning Rings
    this.radarRings = [];
    for (let i = 0; i < 3; i++) {
      const rGeo = new THREE.RingGeometry(0.8 + i * 0.9, 0.9 + i * 0.9, 32);
      const rMat = new THREE.MeshBasicMaterial({
        color: 0x22d3ee,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.5
      });
      const rMesh = new THREE.Mesh(rGeo, rMat);
      rMesh.rotation.x = Math.PI / 2;
      rMesh.position.y = -1.5 + i * 1.2;
      this.beaconGroup.add(rMesh);
      this.radarRings.push(rMesh);
    }

    this.group.add(this.beaconGroup);
  }

  // 3. 10-Star Interests Constellation
  initInterestsConstellation() {
    const constGroup = new THREE.Group();
    constGroup.position.set(0, 0, -155); // Constellation zone

    const starCount = this.interestsData.length;
    const positions = new Float32Array(starCount * 3);

    const starGeo = new THREE.SphereGeometry(0.22, 12, 12);

    this.interestsData.forEach((interest, i) => {
      const basePos = new THREE.Vector3(...interest.starPos);
      positions[i * 3] = basePos.x;
      positions[i * 3 + 1] = basePos.y;
      positions[i * 3 + 2] = basePos.z;

      const starMat = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0x22d3ee : 0x8b5cf6
      });
      const starMesh = new THREE.Mesh(starGeo, starMat);
      starMesh.position.copy(basePos);
      starMesh.userData = { interest, basePos, index: i };

      const haloGeo = new THREE.RingGeometry(0.3, 0.38, 16);
      const haloMat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide, transparent: true, opacity: 0.6 });
      const halo = new THREE.Mesh(haloGeo, haloMat);
      starMesh.add(halo);

      constGroup.add(starMesh);
      this.starNodes.push({ mesh: starMesh, halo, interest, basePos });
    });

    // Interconnecting Constellation Lines
    const lineIndices = [];
    for (let i = 0; i < starCount; i++) {
      for (let j = i + 1; j < starCount; j++) {
        const d = this.starNodes[i].basePos.distanceTo(this.starNodes[j].basePos);
        if (d < 3.8) {
          lineIndices.push(i, j);
        }
      }
    }

    const linePoints = [];
    lineIndices.forEach(idx => {
      linePoints.push(this.starNodes[idx].basePos);
    });

    this.constellationGeo = new THREE.BufferGeometry().setFromPoints(linePoints);
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x22d3ee,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending
    });
    this.constellationLines = new THREE.LineSegments(this.constellationGeo, lineMat);
    constGroup.add(this.constellationLines);

    this.constGroup = constGroup;
    this.group.add(constGroup);
  }

  update(time, cursor3D) {
    // Animate Education Nodes
    this.eduNodes.forEach((node, i) => {
      node.ring.rotation.x = time * 0.8 + i;
      node.ring.rotation.y = time * 0.5 + i;
      const s = 1.0 + Math.sin(time * 3.0 + i) * 0.15;
      node.sphere.scale.setScalar(s);
    });

    // Animate Experience Beacon
    if (this.crystal) {
      this.crystal.rotation.y = time * 0.4;
      this.crystal.rotation.x = time * 0.2;
      this.crystal.position.y = Math.sin(time * 2.0) * 0.3;
    }
    this.radarRings.forEach((ring, i) => {
      ring.rotation.z = time * (0.3 + i * 0.2);
      const pulse = Math.sin(time * 3.0 + i) * 0.15 + 1.0;
      ring.scale.setScalar(pulse);
    });

    // Animate Interests Constellation with Cursor bending
    if (this.constGroup) {
      this.constGroup.rotation.y = Math.sin(time * 0.2) * 0.1;

      this.starNodes.forEach((star, i) => {
        // Star pulse
        const s = 1.0 + Math.sin(time * 4.0 + i) * 0.2;
        star.mesh.scale.setScalar(s);
        star.halo.rotation.z = time * 1.5 + i;

        // Subtle cursor attraction
        if (cursor3D) {
          const worldPos = new THREE.Vector3();
          star.mesh.getWorldPosition(worldPos);
          const dist = worldPos.distanceTo(cursor3D);
          if (dist < 8.0) {
            const pull = (1.0 - dist / 8.0) * 0.6;
            star.mesh.position.x = star.basePos.x + (cursor3D.x - worldPos.x) * pull * 0.1;
            star.mesh.position.y = star.basePos.y + (cursor3D.y - worldPos.y) * pull * 0.1;
          }
        }
      });
    }
  }

  handleRaycast(raycaster) {
    const starMeshes = this.starNodes.map(s => s.mesh);
    const intersects = raycaster.intersectObjects(starMeshes, false);

    if (intersects.length > 0) {
      const hit = intersects[0].object;
      return hit.userData.interest;
    }
    return null;
  }

  handleClick(raycaster) {
    const interest = this.handleRaycast(raycaster);
    if (interest && this.onSelectInterest) {
      this.onSelectInterest(interest);
      return true;
    }
    return false;
  }
}
