/**
 * NIKHIL // DIGITAL LAB v3 — SKILLS GALAXY ORCHESTRATION
 * 7 Orbiting skill nodes with billboard sprites, dynamic laser lines & interactive raycasting.
 */

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

export class SkillsGalaxy {
  constructor(scene, skillsData, onSelectSkill) {
    this.scene = scene;
    this.skillsData = skillsData;
    this.onSelectSkill = onSelectSkill;
    this.group = new THREE.Group();
    this.nodes = [];
    this.lineSegments = null;
    this.lineGeo = null;
    this.hoveredNode = null;

    this.init();
  }

  createBadgeTexture(skill) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 256;
    canvas.height = 128;

    // Glowing pill background
    ctx.fillStyle = 'rgba(5, 6, 10, 0.85)';
    ctx.strokeStyle = skill.color || '#22d3ee';
    ctx.lineWidth = 4;
    
    // Rounded rect
    const r = 24;
    ctx.beginPath();
    ctx.roundRect(8, 8, 240, 112, r);
    ctx.fill();
    ctx.stroke();

    // Skill Icon and Name
    ctx.font = 'bold 36px "Space Grotesk", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${skill.name}`, 128, 52);

    ctx.font = '600 16px "JetBrains Mono", monospace';
    ctx.fillStyle = skill.color || '#22d3ee';
    ctx.fillText(`[${skill.category.toUpperCase()}]`, 128, 92);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    return texture;
  }

  init() {
    this.group.position.set(0, 0, -22); // Positioned in the "Scan Technology" sector
    const count = this.skillsData.length;
    const radius = 6.2;

    const linePositions = new Float32Array(count * 2 * 3);
    const lineColors = new Float32Array(count * 2 * 3);

    this.skillsData.forEach((skill, i) => {
      const angle = (i / count) * Math.PI * 2;
      const heightOffset = Math.sin(i * 1.5) * 1.8;

      const nodeGroup = new THREE.Group();
      nodeGroup.userData = { skill, index: i, baseScale: 1.0, currentScale: 1.0, angle, radius, heightOffset };

      // 3D Glowing Core Sphere
      const sphereGeo = new THREE.SphereGeometry(0.45, 24, 24);
      const sphereMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(skill.color || '#22d3ee'),
        wireframe: true
      });
      const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
      nodeGroup.add(sphereMesh);

      // Inner intense core
      const innerGeo = new THREE.SphereGeometry(0.25, 16, 16);
      const innerMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      nodeGroup.add(new THREE.Mesh(innerGeo, innerMat));

      // Billboard Sprite Badge
      const texture = this.createBadgeTexture(skill);
      const spriteMat = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        depthTest: false
      });
      const sprite = new THREE.Sprite(spriteMat);
      sprite.scale.set(2.6, 1.3, 1);
      sprite.position.set(0, 0.9, 0);
      nodeGroup.add(sprite);

      this.group.add(nodeGroup);
      this.nodes.push({ group: nodeGroup, sphereMat, sphereMesh, sprite, skill });
    });

    // Dynamic Live Connecting Lines
    this.lineGeo = new THREE.BufferGeometry();
    this.lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    this.lineGeo.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));

    const lineMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    });

    this.lineSegments = new THREE.LineSegments(this.lineGeo, lineMat);
    this.group.add(this.lineSegments);

    this.scene.add(this.group);
  }

  update(time) {
    if (!this.group.visible) return;

    const linePos = this.lineGeo.attributes.position.array;
    const lineCol = this.lineGeo.attributes.color.array;
    const center = new THREE.Vector3(0, 0, 0);

    this.nodes.forEach((nodeObj, i) => {
      const u = nodeObj.group.userData;
      // Orbit around center
      const currentAngle = u.angle + time * 0.25;
      const x = Math.cos(currentAngle) * u.radius;
      const z = Math.sin(currentAngle) * (u.radius * 0.75);
      const y = u.heightOffset + Math.sin(time * 1.5 + i) * 0.4;

      nodeObj.group.position.set(x, y, z);

      // Lerp scale on hover
      const targetScale = this.hoveredNode === nodeObj ? 1.35 : 1.0;
      u.currentScale += (targetScale - u.currentScale) * 0.12;
      nodeObj.group.scale.setScalar(u.currentScale);

      // Pulse rotation
      nodeObj.sphereMesh.rotation.y += 0.02;
      nodeObj.sphereMesh.rotation.x += 0.01;

      // Update connecting line geometry from center to node
      const i6 = i * 6;
      // Start: Center
      linePos[i6] = center.x;
      linePos[i6 + 1] = center.y;
      linePos[i6 + 2] = center.z;
      // End: Node position
      linePos[i6 + 3] = x;
      linePos[i6 + 4] = y;
      linePos[i6 + 5] = z;

      // Color intensity
      const isHovered = this.hoveredNode === nodeObj;
      const col = new THREE.Color(nodeObj.skill.color || '#22d3ee');
      const brightness = isHovered ? 1.5 : (0.4 + Math.sin(time * 3.0 + i) * 0.2);

      lineCol[i6] = col.r * 0.2;
      lineCol[i6 + 1] = col.g * 0.2;
      lineCol[i6 + 2] = col.b * 0.2;
      lineCol[i6 + 3] = col.r * brightness;
      lineCol[i6 + 4] = col.g * brightness;
      lineCol[i6 + 5] = col.b * brightness;
    });

    this.lineGeo.attributes.position.needsUpdate = true;
    this.lineGeo.attributes.color.needsUpdate = true;
  }

  handleRaycast(raycaster) {
    const interactables = this.nodes.map(n => n.sphereMesh);
    const intersects = raycaster.intersectObjects(interactables, false);

    if (intersects.length > 0) {
      const hit = intersects[0].object;
      const hitNode = this.nodes.find(n => n.sphereMesh === hit);
      this.hoveredNode = hitNode;
      return hitNode ? hitNode.skill : null;
    } else {
      this.hoveredNode = null;
      return null;
    }
  }

  handleClick(raycaster) {
    const skill = this.handleRaycast(raycaster);
    if (skill && this.onSelectSkill) {
      this.onSelectSkill(skill);
      return true;
    }
    return false;
  }
}
