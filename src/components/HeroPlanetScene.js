import {
  AdditiveBlending, AmbientLight, BufferGeometry, Color,
  DirectionalLight, Float32BufferAttribute, Group, LineBasicMaterial,
  LineLoop, Mesh, MeshStandardMaterial,
  PerspectiveCamera, Points, PointsMaterial, Scene, ShaderMaterial,
  SphereGeometry, SRGBColorSpace, TextureLoader, Vector3, WebGLRenderer,
  CanvasTexture,
} from 'three';

// Procedural circular glow texture for particles (zero external network dependency)
function createParticleTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
  gradient.addColorStop(0.2, 'rgba(96, 165, 250, 0.9)');
  gradient.addColorStop(0.5, 'rgba(59, 130, 246, 0.4)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}

// Fresnel atmosphere vertex shader
const atmosphereVertexShader = `
  varying vec3 vNormal;
  varying vec3 vWorldPosition;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Fresnel atmosphere fragment shader with glowing green tech rim
const atmosphereFragmentShader = `
  varying vec3 vNormal;
  varying vec3 vWorldPosition;
  uniform vec3 glowColor;
  uniform float rimPower;
  void main() {
    vec3 viewDir = normalize(cameraPosition - vWorldPosition);
    float rim = 1.0 - max(dot(vNormal, viewDir), 0.0);
    rim = pow(rim, rimPower);
    gl_FragColor = vec4(glowColor, rim * 0.75);
  }
`;

export function createHeroPlanetScene(canvas, { mobile = false, onReady } = {}) {
  const context = canvas.getContext('webgl2', { alpha: true, antialias: !mobile, powerPreference: 'high-performance' })
    || canvas.getContext('webgl', { alpha: true, antialias: !mobile });
  if (!context) return null;

  const renderer = new WebGLRenderer({ canvas, context, alpha: true, antialias: !mobile });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.25 : 1.5));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = SRGBColorSpace;

  const scene = new Scene();
  const camera = new PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 0.2, 5.8);

  // Lighting
  const ambientLight = new AmbientLight(0x172f50, 0.85);
  scene.add(ambientLight);

  const mainLight = new DirectionalLight(0xdbeafe, 2.2);
  mainLight.position.set(-4, 3, 4);
  scene.add(mainLight);

  const fillLight = new DirectionalLight(0x3b82f6, 1.0);
  fillLight.position.set(4, -2, -3);
  scene.add(fillLight);

  // Master celestial group for mouse parallax
  const celestialGroup = new Group();
  // Elevated center-right positioning placing the planet gracefully in the starry sky
  celestialGroup.position.set(mobile ? 0.1 : 1.38, mobile ? 0.55 : 0.35, 0);
  scene.add(celestialGroup);

  // Textures load in the background; the scene renders immediately with
  // plain materials and the Earth textures pop onto it once fetched, so
  // there is never a static 2D placeholder blocking the live 3D view.
  const textures = new Set();
  let disposed = false;

  const textureLoader = new TextureLoader();
  const applyTextureAsync = (path, apply) => {
    textureLoader.load(
      path,
      (tex) => {
        if (disposed) {
          tex.dispose();
          return;
        }
        tex.colorSpace = SRGBColorSpace;
        textures.add(tex);
        apply(tex);
      },
      undefined,
      (err) => console.warn('Hero texture failed to load:', path, err)
    );
  };

  const particleTex = createParticleTexture();
  textures.add(particleTex);

  // 1. Central Planet
  const planetRadius = mobile ? 0.95 : 1.18;
  const planetGeo = new SphereGeometry(planetRadius, mobile ? 48 : 64, mobile ? 48 : 64);
  const planetMat = new MeshStandardMaterial({
    color: new Color(0xbfdbfe),
    roughness: 0.68,
    metalness: 0.14,
    emissive: new Color(0x3b82f6),
    emissiveIntensity: 1.35,
  });
  applyTextureAsync('/textures/earth-daymap.jpg', (tex) => {
    planetMat.map = tex;
    planetMat.needsUpdate = true;
  });
  applyTextureAsync('/textures/earth-nightmap.jpg', (tex) => {
    planetMat.emissiveMap = tex;
    planetMat.needsUpdate = true;
  });
  const planetMesh = new Mesh(planetGeo, planetMat);
  // Axial tilt (Earth-like 23.5 degrees)
  planetMesh.rotation.z = 0.41;
  celestialGroup.add(planetMesh);

  // Atmospheric cloud layer
  const cloudsGeo = new SphereGeometry(planetRadius * 1.018, mobile ? 36 : 48, mobile ? 36 : 48);
  const cloudsMat = new MeshStandardMaterial({
    transparent: true,
    opacity: 0.38,
    color: new Color(0xdbeafe),
    blending: AdditiveBlending,
    depthWrite: false,
  });
  applyTextureAsync('/textures/earth-clouds.jpg', (tex) => {
    cloudsMat.alphaMap = tex;
    cloudsMat.needsUpdate = true;
  });
  const cloudsMesh = new Mesh(cloudsGeo, cloudsMat);
  planetMesh.add(cloudsMesh);

  // Atmospheric Fresnel Rim Glow
  const atmosphereGeo = new SphereGeometry(planetRadius * 1.045, mobile ? 36 : 48, mobile ? 36 : 48);
  const atmosphereMat = new ShaderMaterial({
    vertexShader: atmosphereVertexShader,
    fragmentShader: atmosphereFragmentShader,
    uniforms: {
      glowColor: { value: new Color(0x60a5fa) },
      rimPower: { value: 3.5 },
    },
    transparent: true,
    blending: AdditiveBlending,
    side: 0, // FrontSide for clean, smooth atmospheric rim glow
    depthWrite: false,
  });
  const atmosphereMesh = new Mesh(atmosphereGeo, atmosphereMat);
  planetMesh.add(atmosphereMesh);

  // 2. Orbiting Particle Rings (Tilted horizontally in 3D space)
  const ringGroup = new Group();
  // Tilt the ring plane for classic horizontal 3D orbital perspective
  ringGroup.rotation.x = Math.PI * 0.36;
  ringGroup.rotation.y = -0.14;
  celestialGroup.add(ringGroup);

  // Generate 3 concentric particle rings with additive blending
  const ringsData = [
    { inner: planetRadius * 1.45, outer: planetRadius * 1.95, count: mobile ? 450 : 750, speed: 0.28, color: 0x60a5fa },
    { inner: planetRadius * 2.05, outer: planetRadius * 2.55, count: mobile ? 380 : 650, speed: -0.17, color: 0x3b82f6 },
    { inner: planetRadius * 2.65, outer: planetRadius * 3.15, count: mobile ? 280 : 500, speed: 0.12, color: 0x22d3ee },
  ];

  const ringMeshes = ringsData.map(({ inner, outer, count, speed, color }) => {
    const geo = new BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const baseColor = new Color(color);

    for (let i = 0; i < count; i++) {
      const radius = inner + Math.random() * (outer - inner);
      const angle = Math.random() * Math.PI * 2;
      const heightSpread = (Math.random() - 0.5) * 0.08;

      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = Math.sin(angle) * radius;
      positions[i * 3 + 2] = heightSpread;

      // Color variation
      const col = baseColor.clone().offsetHSL((Math.random() - 0.5) * 0.08, 0, (Math.random() - 0.5) * 0.18);
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }

    geo.setAttribute('position', new Float32BufferAttribute(positions, 3));
    geo.setAttribute('color', new Float32BufferAttribute(colors, 3));

    const mat = new PointsMaterial({
      size: mobile ? 0.04 : 0.05,
      map: particleTex,
      transparent: true,
      opacity: 0.85,
      vertexColors: true,
      blending: AdditiveBlending,
      depthWrite: false,
    });

    const points = new Points(geo, mat);
    ringGroup.add(points);
    return { points, speed };
  });

  // Glowing orbit lines
  const createOrbitTrack = (radius, color = 0x60a5fa, opacity = 0.22) => {
    const points = [];
    const segments = 96;
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      points.push(new Vector3(Math.cos(theta) * radius, Math.sin(theta) * radius, 0));
    }
    const geo = new BufferGeometry().setFromPoints(points);
    const mat = new LineBasicMaterial({ color, transparent: true, opacity, blending: AdditiveBlending });
    const loop = new LineLoop(geo, mat);
    ringGroup.add(loop);
    return loop;
  };

  createOrbitTrack(planetRadius * 1.75, 0x60a5fa, 0.24);
  createOrbitTrack(planetRadius * 2.3, 0x3b82f6, 0.20);
  createOrbitTrack(planetRadius * 2.95, 0x22d3ee, 0.16);

  // 3. Orbiting Celestial Elements (Moons & Cyber Data Beacons)
  const celestialBodies = [
    // Companion Moon: Cratered rocky satellite
    {
      radius: planetRadius * 2.3,
      speed: 0.28,
      phase: 0.2,
      inclination: 0.08,
      size: 0.09,
      mesh: new Mesh(
        new SphereGeometry(0.09, 24, 24),
        new MeshStandardMaterial({
          color: new Color(0x94a3b8),
          roughness: 0.72,
          emissive: new Color(0x132e1b),
          emissiveIntensity: 0.25,
        })
      ),
    },
    // Cyber Data Beacon: Glowing blue relay node
    {
      radius: planetRadius * 1.75,
      speed: -0.44,
      phase: Math.PI * 0.8,
      inclination: -0.10,
      size: 0.055,
      mesh: new Mesh(
        new SphereGeometry(0.055, 20, 20),
        new MeshStandardMaterial({
          color: new Color(0x93c5fd),
          emissive: new Color(0x3b82f6),
          emissiveIntensity: 2.2,
          roughness: 0.2,
        })
      ),
    },
    // Outer Reconnaissance Probe: Titanium node
    {
      radius: planetRadius * 2.95,
      speed: 0.14,
      phase: Math.PI * 1.45,
      inclination: 0.14,
      size: 0.07,
      mesh: new Mesh(
        new SphereGeometry(0.07, 24, 24),
        new MeshStandardMaterial({
          color: new Color(0x64748b),
          roughness: 0.4,
          metalness: 0.8,
          emissive: new Color(0x2563eb),
          emissiveIntensity: 0.5,
        })
      ),
    },
  ];

  celestialBodies.forEach(body => {
    ringGroup.add(body.mesh);
  });

  // Background deep space starfield
  const starCount = mobile ? 450 : 900;
  const starGeo = new BufferGeometry();
  const starPositions = new Float32Array(starCount * 3);
  const starColors = new Float32Array(starCount * 3);

  for (let i = 0; i < starCount; i++) {
    starPositions[i * 3] = (Math.random() - 0.5) * 35;
    starPositions[i * 3 + 1] = (Math.random() - 0.5) * 25;
    starPositions[i * 3 + 2] = -10 - Math.random() * 18;

    const c = new Color().setHSL(0.59 + (Math.random() - 0.5) * 0.08, 0.7, 0.8 + Math.random() * 0.2);
    starColors[i * 3] = c.r;
    starColors[i * 3 + 1] = c.g;
    starColors[i * 3 + 2] = c.b;
  }
  starGeo.setAttribute('position', new Float32BufferAttribute(starPositions, 3));
  starGeo.setAttribute('color', new Float32BufferAttribute(starColors, 3));
  const starMat = new PointsMaterial({
    size: 0.045,
    vertexColors: true,
    transparent: true,
    opacity: 0.75,
    map: particleTex,
    blending: AdditiveBlending,
    depthWrite: false,
  });
  const starfield = new Points(starGeo, starMat);
  scene.add(starfield);

  // Parallax tracking
  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;

  const onPointerMove = (e) => {
    const x = (e.clientX / window.innerWidth) - 0.5;
    const y = (e.clientY / window.innerHeight) - 0.5;
    targetX = x * 0.45;
    targetY = -y * 0.35;
  };
  window.addEventListener('pointermove', onPointerMove, { passive: true });

  // Animation advance
  let time = 0;
  const advance = (delta) => {
    time += delta;

    // 1. Central Planet smooth horizontal rotation
    planetMesh.rotation.y += delta * 0.18;
    cloudsMesh.rotation.y += delta * 0.22;

    // 2. Orbiting Particle Rings rotation
    ringMeshes.forEach(({ points, speed }) => {
      points.rotation.z += delta * speed * 0.35;
    });

    // 3. Celestial Bodies continuous 3D horizontal orbit
    celestialBodies.forEach(body => {
      const angle = body.phase + time * body.speed;
      const x = Math.cos(angle) * body.radius;
      const y = Math.sin(angle) * body.radius;
      const z = Math.sin(angle * 2) * body.radius * body.inclination;
      body.mesh.position.set(x, y, z);
      // Subtle body self-spin
      body.mesh.rotation.y += delta * 0.4;
    });

    // 4. Parallax easing
    currentX += (targetX - currentX) * 0.05;
    currentY += (targetY - currentY) * 0.05;
    celestialGroup.rotation.y = currentX * 0.4;
    celestialGroup.rotation.x = currentY * 0.3;
  };

  const render = () => {
    renderer.render(scene, camera);
  };

  const resize = (width, height) => {
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
    // Responsive camera position
    if (width < 768) {
      camera.position.set(0, 0.35, 6.2);
      celestialGroup.position.set(0.1, 0.52, 0);
    } else if (width < 1200) {
      camera.position.set(0, 0.2, 5.8);
      celestialGroup.position.set(1.15, 0.32, 0);
    } else {
      camera.position.set(0, 0.2, 5.8);
      celestialGroup.position.set(width > 1500 ? 1.5 : 1.38, 0.35, 0);
    }
  };

  const dispose = () => {
    disposed = true;
    window.removeEventListener('pointermove', onPointerMove);
    textures.forEach(t => t.dispose());
    scene.traverse(obj => {
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
        else obj.material.dispose();
      }
    });
    renderer.dispose();
  };

  // Deferred to a microtask so the caller finishes assigning its scene
  // reference before onReady fires — the scene is fully constructed and
  // renderable synchronously; only the Earth textures arrive later.
  queueMicrotask(() => {
    if (!disposed) onReady?.();
  });

  return { advance, render, resize, dispose };
}
