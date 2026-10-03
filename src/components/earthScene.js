import {
  AdditiveBlending, BackSide, BufferGeometry, Color,
  Group, LineBasicMaterial, LineLoop, LoadingManager,
  Mesh, MeshBasicMaterial, PerspectiveCamera, Scene,
  ShaderMaterial, SphereGeometry, SRGBColorSpace, TextureLoader, Vector3,
  WebGLRenderer,
} from 'three';

const vertexShader = `
  varying vec2 vUv;
  varying vec3 vWorldNormal;
  varying vec3 vWorldPosition;
  void main() {
    vUv = uv;
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`;

// Holographic globe: no photo-real shading — a land-mask derived from the
// day map glows against a graticule grid, rimmed with a Fresnel edge glow
// and swept by a slow scanline in the site's blue accent tones.
const surfaceShader = `
  uniform sampler2D dayMap;
  uniform vec3 glowColor;
  uniform vec3 deepColor;
  uniform float time;
  varying vec2 vUv;
  varying vec3 vWorldNormal;
  varying vec3 vWorldPosition;

  float gridLine(float coord, float count) {
    float cell = fract(coord * count);
    float dist = min(cell, 1.0 - cell);
    return 1.0 - smoothstep(0.0, 0.03, dist);
  }

  void main() {
    vec3 normal = normalize(vWorldNormal);
    vec3 viewDirection = normalize(cameraPosition - vWorldPosition);

    vec3 albedo = texture2D(dayMap, vUv).rgb;
    float luminance = dot(albedo, vec3(0.299, 0.587, 0.114));
    float landMask = smoothstep(0.16, 0.46, luminance);

    float grid = max(gridLine(vUv.x, 36.0), gridLine(vUv.y, 18.0));
    float fresnel = pow(1.0 - max(dot(normal, viewDirection), 0.0), 2.4);

    float band = fract(time * 0.07);
    float scan = smoothstep(0.05, 0.0, abs(vUv.y - band));

    vec3 color = mix(deepColor, glowColor, landMask * 0.8 + grid * 0.3);
    color += glowColor * fresnel * 0.85;
    color += glowColor * scan * 0.5;

    float alpha = 0.2 + landMask * 0.38 + grid * 0.22 + fresnel * 0.55 + scan * 0.3;
    gl_FragColor = vec4(color, clamp(alpha, 0.0, 1.0));
    #include <colorspace_fragment>
  }
`;

const atmosphereShader = `
  uniform vec3 glowColor;
  varying vec3 vWorldNormal;
  varying vec3 vWorldPosition;
  void main() {
    vec3 normal = normalize(vWorldNormal);
    vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
    float rim = pow(max(0.0, 1.0 + dot(normal, viewDirection)), 3.2);
    gl_FragColor = vec4(glowColor, rim * 0.35);
    #include <colorspace_fragment>
  }
`;

const cityCoordinates = [[-74, 41], [-.1, 51], [73, 19], [104, 1], [139, 36], [151, -34], [18, -34]];
const positionAt = (longitude, latitude, radius = 1.014) => {
  const lon = longitude * Math.PI / 180, lat = latitude * Math.PI / 180;
  return new Vector3(Math.cos(lat) * Math.cos(lon), Math.sin(lat), -Math.cos(lat) * Math.sin(lon)).multiplyScalar(radius);
};

export function createEarthScene(canvas, { mobile, onReady, onError }) {
  const context = canvas.getContext('webgl2', { alpha: true, antialias: !mobile, powerPreference: 'low-power' });
  if (!context) return null;
  const renderer = new WebGLRenderer({ canvas, context, alpha: true, antialias: !mobile });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.25 : 1.6));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = SRGBColorSpace;
  const scene = new Scene();
  const camera = new PerspectiveCamera(38, 1, .1, 20);
  camera.position.set(0, 0, 4.65);

  const textures = new Set();
  let disposed = false, failed = false;
  const manager = new LoadingManager();
  manager.onLoad = () => { if (!disposed && !failed) onReady(); };
  manager.onError = () => { failed = true; if (!disposed) onError(); };
  const loader = new TextureLoader(manager);
  const dayMap = loader.load('/textures/earth-daymap.jpg', loadedTexture => {
    if (disposed) loadedTexture.dispose();
  });
  dayMap.colorSpace = SRGBColorSpace;
  dayMap.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
  textures.add(dayMap);

  const axis = new Group();
  axis.rotation.z = .12;
  scene.add(axis);
  const earth = new Group();
  earth.rotation.y = -2;
  axis.add(earth);
  const sphereGeometry = new SphereGeometry(1, mobile ? 48 : 72, mobile ? 32 : 48);
  const surfaceMaterial = new ShaderMaterial({
    vertexShader, fragmentShader: surfaceShader,
    uniforms: {
      dayMap: { value: dayMap },
      glowColor: { value: new Color(0x60a5fa) },
      deepColor: { value: new Color(0x08172b) },
      time: { value: 0 },
    },
    transparent: true, depthWrite: false,
  });
  earth.add(new Mesh(sphereGeometry, surfaceMaterial));
  const atmosphere = new Mesh(sphereGeometry, new ShaderMaterial({
    vertexShader, fragmentShader: atmosphereShader,
    uniforms: { glowColor: { value: new Color(0x3b82f6) } },
    side: BackSide, transparent: true, blending: AdditiveBlending, depthWrite: false,
  }));
  atmosphere.scale.setScalar(1.045);
  axis.add(atmosphere);

  const nodeGeometry = new SphereGeometry(.008, 8, 6);
  const nodeMaterial = new MeshBasicMaterial({ color: new Color('#bfdbfe'), transparent: true, opacity: .8 });
  cityCoordinates.forEach(coordinates => {
    const node = new Mesh(nodeGeometry, nodeMaterial);
    node.position.copy(positionAt(...coordinates));
    earth.add(node);
  });

  // Thin physical orbits are occluded by the Earth on their far side.
  const orbits = new Group();
  const satellites = [];
  [[1.33, .58, -.38], [1.45, -.75, .7]].forEach(([radius, tilt, turn], index) => {
    const orbit = new Group();
    orbit.rotation.set(tilt, .17, turn);
    const points = Array.from({ length: 160 }, (_, i) => {
      const angle = i / 160 * Math.PI * 2;
      return new Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
    });
    orbit.add(new LineLoop(new BufferGeometry().setFromPoints(points), new LineBasicMaterial({
      color: 0x60a5fa, transparent: true, opacity: index ? .2 : .34, depthWrite: false,
    })));
    const satellite = new Mesh(new SphereGeometry(.014, 10, 8), nodeMaterial);
    const phase = index * 2.8 + .5;
    satellite.position.set(Math.cos(phase) * radius, 0, Math.sin(phase) * radius);
    satellites.push({ mesh: satellite, radius, phase });
    orbit.add(satellite);
    orbits.add(orbit);
  });
  scene.add(orbits);

  let elapsed = 0;
  return {
    render: () => {
      if (disposed) return;
      renderer.render(scene, camera);
      canvas.dataset.earthAngle = earth.rotation.y.toFixed(6);
    },
    advance: seconds => {
      elapsed += seconds;
      earth.rotation.y = -2 + elapsed * Math.PI * 2 / 52;
      surfaceMaterial.uniforms.time.value = elapsed;
      satellites.forEach(({ mesh, radius, phase }) => {
        const angle = phase + elapsed * .045;
        mesh.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
      });
    },
    resize: (width, height) => {
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    },
    dispose: () => {
      disposed = true;
      const geometries = new Set(), materials = new Set();
      scene.traverse(object => {
        if (object.geometry) geometries.add(object.geometry);
        if (object.material) materials.add(object.material);
      });
      geometries.forEach(geometry => geometry.dispose());
      materials.forEach(material => material.dispose());
      textures.forEach(texture => texture.dispose());
      renderer.dispose();
    },
  };
}
