/**
 * NIKHIL // DIGITAL LAB v3 — GLSL SHADER LIBRARY
 * Custom Vertex & Fragment shaders for procedural 3D elements.
 */

// 3D Simplex Noise implementation in GLSL
export const SIMPLEX_NOISE_GLSL = `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  i = mod289(i);
  vec4 p = permute(permute(permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0));

  float n_ = 0.142857142857;
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);

  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;

  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}
`;

// Digital Core Shaders
export const CoreShaders = {
  vertexShader: `
    ${SIMPLEX_NOISE_GLSL}

    uniform float uTime;
    uniform float uDisplacement;
    uniform float uPulseFreq;
    uniform vec3 uHoverIntensity;

    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec3 vWorldPosition;
    varying float vNoise;

    void main() {
      vNormal = normalize(normalMatrix * normal);
      vec3 pos = position;

      // Heartbeat pulse calculation (~0.8Hz rhythm)
      float pulse = sin(uTime * 5.0) * 0.5 + 0.5;
      float heartbeat = pow(pulse, 4.0) * 0.18;

      // Layered 2-octave 3D Simplex Noise
      float slowDrift = snoise(pos * 1.4 + vec3(uTime * 0.35));
      float fastShimmer = snoise(pos * 3.2 - vec3(uTime * 0.8)) * 0.45;
      float combinedNoise = (slowDrift + fastShimmer) * (uDisplacement + heartbeat);
      
      vNoise = combinedNoise;

      // Displace along normal
      vec3 newPosition = pos + normal * combinedNoise;
      vPosition = newPosition;

      vec4 worldPos = modelMatrix * vec4(newPosition, 1.0);
      vWorldPosition = worldPos.xyz;

      gl_Position = projectionMatrix * viewMatrix * worldPos;
    }
  `,

  fragmentShader: `
    uniform float uTime;
    uniform vec3 uColorCyan;
    uniform vec3 uColorViolet;
    uniform vec3 uColorCore;
    uniform vec3 uCameraPos;

    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec3 vWorldPosition;
    varying float vNoise;

    void main() {
      vec3 viewDir = normalize(uCameraPos - vWorldPosition);
      vec3 normal = normalize(vNormal);

      // Fresnel rim factor
      float fresnel = pow(1.0 - max(dot(viewDir, normal), 0.0), 2.2);

      // Core plasma gradient
      float plasma = sin(vNoise * 6.0 + uTime * 2.0) * 0.5 + 0.5;
      vec3 baseColor = mix(uColorCore, uColorCyan, smoothstep(-0.2, 0.4, vNoise));
      vec3 rimColor = mix(uColorCyan, uColorViolet, fresnel);

      // Heartbeat emissive burst
      float pulseBurst = pow(sin(uTime * 5.0) * 0.5 + 0.5, 3.0) * 0.35;
      vec3 finalColor = mix(baseColor, rimColor, fresnel * 1.4) + uColorCyan * pulseBurst;

      // Add high-frequency energy grid
      float energyGrid = step(0.92, sin(vPosition.x * 20.0 + uTime) * sin(vPosition.y * 20.0 + uTime) * sin(vPosition.z * 20.0 + uTime));
      finalColor += uColorCyan * energyGrid * 0.6;

      gl_FragColor = vec4(finalColor, 0.88 + fresnel * 0.12);
    }
  `
};

// Particle Flow & Morphing Shaders
export const ParticleShaders = {
  vertexShader: `
    ${SIMPLEX_NOISE_GLSL}

    uniform float uTime;
    uniform float uMorphProgress;
    uniform vec3 uCursor3D;
    uniform float uRepulsionRadius;
    uniform float uRepulsionStrength;
    uniform float uPixelRatio;

    attribute vec3 aTargetPos;
    attribute float aRandomSeed;
    attribute float aSize;

    varying vec3 vColor;
    varying float vAlpha;

    void main() {
      // Base curl flow field position
      vec3 basePos = position;
      float noiseFactor = snoise(basePos * 0.2 + vec3(uTime * 0.15, aRandomSeed, 0.0));
      vec3 flowOffset = vec3(
        snoise(basePos * 0.15 + vec3(0.0, uTime * 0.2, aRandomSeed)),
        snoise(basePos * 0.15 + vec3(aRandomSeed, 0.0, uTime * 0.2)),
        snoise(basePos * 0.15 + vec3(uTime * 0.2, aRandomSeed, 0.0))
      ) * 1.2;

      vec3 freePos = basePos + flowOffset;

      // Staggered morph interpolation towards text target
      float delayedProgress = clamp((uMorphProgress - aRandomSeed * 0.25) / 0.75, 0.0, 1.0);
      float smoothMorph = smoothstep(0.0, 1.0, delayedProgress);

      vec3 currentPos = mix(freePos, aTargetPos, smoothMorph);

      // Cursor flashlight repulsion field
      vec3 toCursor = currentPos - uCursor3D;
      float distToCursor = length(toCursor);
      if (distToCursor < uRepulsionRadius && distToCursor > 0.001) {
        float force = (1.0 - (distToCursor / uRepulsionRadius)) * uRepulsionStrength;
        currentPos += normalize(toCursor) * force;
      }

      vec4 mvPosition = modelViewMatrix * vec4(currentPos, 1.0);
      gl_Position = projectionMatrix * mvPosition;

      // Size attenuation
      float pSize = mix(aSize, aSize * 1.4, smoothMorph);
      gl_PointSize = pSize * (350.0 / -mvPosition.z) * uPixelRatio;
      gl_PointSize = clamp(gl_PointSize, 1.0, 48.0);

      // Dual-tone color selection (Electric Cyan to Violet)
      vec3 colorCyan = vec3(0.133, 0.827, 0.933);
      vec3 colorViolet = vec3(0.545, 0.361, 0.965);
      vec3 colorWhite = vec3(0.9, 0.98, 1.0);

      vec3 particleCol = mix(colorCyan, colorViolet, aRandomSeed);
      if (smoothMorph > 0.6) {
        particleCol = mix(particleCol, colorWhite, (smoothMorph - 0.6) * 1.8);
      }

      vColor = particleCol;
      vAlpha = mix(0.4 + aRandomSeed * 0.5, 0.95, smoothMorph);
    }
  `,

  fragmentShader: `
    varying vec3 vColor;
    varying float vAlpha;

    void main() {
      // Render soft glowing circular point sprite
      vec2 centerCoord = gl_PointCoord - vec2(0.5);
      float dist = length(centerCoord);

      if (dist > 0.5) {
        discard;
      }

      float intensity = pow(1.0 - (dist * 2.0), 1.8);
      vec3 finalCol = vColor + vec3(0.2) * (1.0 - dist * 2.0);

      gl_FragColor = vec4(finalCol, intensity * vAlpha);
    }
  `
};

// Hologram / Glow Line Shaders
export const LinePulseShaders = {
  vertexShader: `
    uniform float uTime;
    varying vec2 vUv;
    varying vec3 vPosition;

    void main() {
      vUv = uv;
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,

  fragmentShader: `
    uniform float uTime;
    uniform vec3 uColor;
    uniform float uPulseSpeed;

    varying vec2 vUv;
    varying vec3 vPosition;

    void main() {
      float pulse = mod(vUv.x * 6.0 - uTime * uPulseSpeed, 1.0);
      float beam = smoothstep(0.0, 0.1, pulse) * smoothstep(0.4, 0.1, pulse);
      
      vec3 col = uColor + vec3(0.6) * beam;
      float alpha = 0.3 + beam * 0.7;

      gl_FragColor = vec4(col, alpha);
    }
  `
};
