import {
  AdditiveBlending, AmbientLight, BackSide, BufferGeometry, Color,
  DirectionalLight, Group, LineBasicMaterial, LineLoop, LoadingManager,
  Mesh, MeshBasicMaterial, MeshPhongMaterial, PerspectiveCamera, Scene,
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

const surfaceShader = `
  uniform sampler2D dayMap;
  uniform sampler2D nightMap;
  uniform vec3 sunlight;
  varying vec2 vUv;
  varying vec3 vWorldNormal;
  varying vec3 vWorldPosition;
  void main() {
    vec3 normal = normalize(vWorldNormal);
    vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
    float light = dot(normal, sunlight);
    float day = smoothstep(-0.16, 0.2, light);
    vec3 albedo = texture2D(dayMap, vUv).rgb;
    vec3 cities = texture2D(nightMap, vUv).rgb;
    vec3 color = albedo * (0.055 + 1.45 * pow(max(light, 0.0), 0.64));
    color += cities * (1.0 - smoothstep(-0.2, 0.18, light)) * 1.6;
    // Water reflects the sun softly; land remains matte.
    float ocean = smoothstep(0.025, 0.16, albedo.b - albedo.r);
    float specular = pow(max(dot(normal, normalize(sunlight + viewDirection)), 0.0), 55.0);
    color += vec3(0.45, 0.65, 0.75) * specular * ocean * day * 0.45;
    float edge = pow(1.0 - max(dot(normal, viewDirection), 0.0), 3.5);
    color += vec3(0.08, 0.30, 0.50) * edge * (0.13 + day * 0.72);
    gl_FragColor = vec4(color, 1.0);
    #include <colorspace_fragment>
  }
`;

const atmosphereShader = `
  uniform vec3 sunlight;
  varying vec3 vWorldNormal;
  varying vec3 vWorldPosition;
  void main() {
    vec3 normal = normalize(vWorldNormal);
    vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
    float rim = pow(max(0.0, 1.0 + dot(normal, viewDirection)), 4.5);
    float lit = smoothstep(-0.45, 0.75, dot(normal, sunlight));
    gl_FragColor = vec4(vec3(0.13, 0.48, 0.78), rim * (0.08 + lit * 0.28));
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
  const sunlight = new Vector3(-3.6, 2.4, 2.5).normalize();
  const sun = new DirectionalLight(0xffffff, 2.1);
  sun.position.copy(sunlight).multiplyScalar(5);
  scene.add(new AmbientLight(0x7894b0, .35), sun);
  const textures = new Set();
  let disposed = false, failed = false;
  const manager = new LoadingManager();
  manager.onLoad = () => { if (!disposed && !failed) onReady(); };
  manager.onError = () => { failed = true; if (!disposed) onError(); };
  const loader = new TextureLoader(manager);
  const load = (name, color = false) => {
    const texture = loader.load(`/textures/earth-${name}.jpg`, loadedTexture => {
      if (disposed) loadedTexture.dispose();
    });
    if (color) texture.colorSpace = SRGBColorSpace;
    texture.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
    textures.add(texture);
    return texture;
  };
  const dayMap = load('daymap', true);
  const nightMap = load('nightmap', true);
  const cloudMap = load('clouds');

  const axis = new Group();
  axis.rotation.z = .12;
  scene.add(axis);
  const earth = new Group();
  earth.rotation.y = -2;
  axis.add(earth);
  const sphereGeometry = new SphereGeometry(1, mobile ? 48 : 72, mobile ? 32 : 48);
  earth.add(new Mesh(sphereGeometry, new ShaderMaterial({
    vertexShader, fragmentShader: surfaceShader,
    uniforms: { dayMap: { value: dayMap }, nightMap: { value: nightMap }, sunlight: { value: sunlight } },
  })));
  const clouds = new Mesh(sphereGeometry, new MeshPhongMaterial({
    color: 0xf5f8ff, alphaMap: cloudMap, transparent: true, opacity: .64,
    depthWrite: false, shininess: 2,
  }));
  clouds.scale.setScalar(1.012);
  earth.add(clouds);
  const atmosphere = new Mesh(sphereGeometry, new ShaderMaterial({
    vertexShader, fragmentShader: atmosphereShader,
    uniforms: { sunlight: { value: sunlight } },
    side: BackSide, transparent: true, blending: AdditiveBlending, depthWrite: false,
  }));
  atmosphere.scale.setScalar(1.045);
  axis.add(atmosphere);

  const nodeGeometry = new SphereGeometry(.008, 8, 6);
  const nodeMaterial = new MeshBasicMaterial({ color: new Color('#d7fbaa'), transparent: true, opacity: .8 });
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
      color: 0xb1d571, transparent: true, opacity: index ? .2 : .34, depthWrite: false,
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
      clouds.rotation.y = elapsed * .006;
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
