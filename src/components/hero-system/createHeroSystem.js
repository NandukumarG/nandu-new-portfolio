import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'

// World units: the tiled platform surface is y=0; +z faces the viewer.
// These are the only layout/motion controls. Colors are read from the site's CSS.
export const SYSTEM = {
  platform: [7.6, 0.44, 5.3],
  monitor: [-2.65, 0, -0.25],
  api: [-0.15, 0, -0.5],
  gateway: [-0.65, 0, 1.35],
  database: [1.65, 0, 1.35],
  servers: [2.75, 0, -0.85],
  cloud: [2.25, 2.85, -1.05],
  floatSeconds: 7,
  floatPixels: 5,
  pipeRadius: 0.024,
  elbowRadius: 0.12,
  sequenceSeconds: 18,
  framePadding: 1.035,
}

/** Straight runs joined by quadratic elbows, shared by pipe geometry and signals. */
export function roundedRoute(points, radius = SYSTEM.elbowRadius) {
  const vectors = points.map(p => new THREE.Vector3(...p))
  const path = new THREE.CurvePath()
  let from = vectors[0]
  for (let i = 1; i < vectors.length - 1; i++) {
    const corner = vectors[i]
    const before = vectors[i - 1]
    const after = vectors[i + 1]
    const r = Math.min(radius, before.distanceTo(corner) / 2, after.distanceTo(corner) / 2)
    const entry = corner.clone().add(before.clone().sub(corner).normalize().multiplyScalar(r))
    const leave = corner.clone().add(after.clone().sub(corner).normalize().multiplyScalar(r))
    path.add(new THREE.LineCurve3(from, entry))
    path.add(new THREE.QuadraticBezierCurve3(entry, corner, leave))
    from = leave
  }
  path.add(new THREE.LineCurve3(from, vectors.at(-1)))
  path.arcLengthDivisions = 600
  return path
}

function readPalette(host) {
  const css = getComputedStyle(host)
  const names = ['bg-dark', 'bg-dark-soft', 'bg-light', 'bg-light-soft', 'accent-lime',
    'accent-lime-pale', 'accent-lime-dim', 'text-on-dark', 'text-on-dark-muted',
    'text-on-light', 'text-on-light-muted', 'line-on-dark', 'line-on-light', 'glass']
  return Object.fromEntries(names.map(name => {
    const raw = css.getPropertyValue(`--${name}`).trim()
    if (!raw) throw new Error(`Missing hero material token: --${name}`)
    // THREE.Color does not store alpha. Keep it explicitly for overlays and dividers.
    const rgba = raw.match(/^rgba\(([^)]+)\)$/)
    const channels = rgba?.[1].split(',').map(Number)
    return [name, { css: raw, color: new THREE.Color(channels ? `rgb(${channels.slice(0, 3).join(',')})` : raw), alpha: channels?.[3] ?? 1 }]
  }))
}

export function createHeroSystem(host, { onReady, onUnavailable }) {
  const palette = readPalette(host)
  const color = name => palette[name].color.clone()
  const css = name => palette[name].css
  const mobile = host.clientWidth < 480
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' })
  renderer.setClearColor(color('bg-dark'), 0)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2))
  renderer.outputColorSpace = THREE.SRGBColorSpace
  // Preserve the site's hues instead of washing ivory and lime toward white.
  renderer.toneMapping = THREE.NeutralToneMapping
  renderer.toneMappingExposure = 1
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFShadowMap
  renderer.shadowMap.autoUpdate = false
  renderer.domElement.setAttribute('aria-hidden', 'true')
  host.appendChild(renderer.domElement)

  const scene = new THREE.Scene()
  const model = new THREE.Group()
  scene.add(model)
  const camera = new THREE.OrthographicCamera(-5, 5, 5, -5, 0.1, 80)
  camera.position.set(10, 8.7, 13)
  camera.lookAt(0, 1.5, 0)

  const resources = new Set()
  const own = resource => { resources.add(resource); return resource }
  const standard = (token, options = {}) => own(new THREE.MeshStandardMaterial({
    color: color(token), roughness: 0.62, ...options,
  }))
  const basic = (token, options = {}) => own(new THREE.MeshBasicMaterial({
    color: color(token), toneMapped: false, ...options,
  }))
  const ceramic = standard('bg-light')
  const inset = standard('bg-light-soft', { roughness: 0.72 })
  const forest = standard('bg-dark-soft', { roughness: 0.36, metalness: 0.12,
    emissive: color('bg-dark-soft'), emissiveIntensity: 0.35 })
  const recess = standard('bg-dark', { roughness: 0.5 })
  const pipeMaterial = basic('accent-lime-dim')
  const edge = basic('accent-lime-pale', { transparent: true, opacity: 0.26 })
  const divider = basic('line-on-light', { transparent: true, opacity: palette['line-on-light'].alpha })
  const darkDivider = basic('line-on-dark', { transparent: true, opacity: palette['line-on-dark'].alpha })
  const glass = own(new THREE.MeshPhysicalMaterial({
    color: color('bg-dark-soft'), attenuationColor: color('bg-dark-soft'),
    attenuationDistance: 0.65, roughness: 0.12, metalness: 0.02,
    transmission: 0.35, thickness: 0.12, ior: 1.46,
    transparent: true, opacity: 0.34, depthWrite: false,
    clearcoat: 0.7, clearcoatRoughness: 0.28, envMapIntensity: 1.3,
  }))
  const sheen = basic('glass', { transparent: true, opacity: palette.glass.alpha, depthWrite: false })

  function mesh(geometry, material, position, parent = model) {
    const object = new THREE.Mesh(own(geometry), material)
    object.position.set(...position)
    object.castShadow = !material.transparent && !material.transmission
    object.receiveShadow = !material.transmission
    parent.add(object)
    return object
  }
  function box(size, position, material = ceramic, parent = model, radius = 0.04) {
    return mesh(new RoundedBoxGeometry(...size, 3, Math.min(radius, ...size.map(n => n / 3))), material, position, parent)
  }
  function group(position) {
    const object = new THREE.Group()
    object.position.set(...position)
    model.add(object)
    return object
  }
  function cylinder(radius, height, position, material, parent = model) {
    return mesh(new THREE.CylinderGeometry(radius, radius, height, mobile ? 40 : 64), material, position, parent)
  }
  function ring(radius, tube, position, material, parent = model) {
    const object = mesh(new THREE.TorusGeometry(radius, tube, 8, mobile ? 40 : 64), material, position, parent)
    object.rotation.x = Math.PI / 2
    return object
  }
  function textureCanvas(width, height, draw) {
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    draw(canvas.getContext('2d'), width, height)
    const texture = own(new THREE.CanvasTexture(canvas))
    texture.colorSpace = THREE.SRGBColorSpace
    texture.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy())
    return texture
  }
  function label(text, width, height, position, token, parent = model, rotation = 0) {
    const map = textureCanvas(Math.round(256 * width / height), 256, (ctx, w, h) => {
      ctx.fillStyle = css(token)
      const fontSize = Math.min(h * 0.65, w / (text.length * 0.64))
      ctx.font = `500 ${fontSize}px monospace`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(text, w / 2, h / 2)
    })
    const mat = own(new THREE.MeshBasicMaterial({ map, transparent: true, depthWrite: false, toneMapped: false }))
    const object = mesh(new THREE.PlaneGeometry(width, height), mat, position, parent)
    object.rotation.y = rotation
    object.castShadow = false
    return object
  }
  function indicator(position, parent = model, radius = 0.035) {
    const material = standard('accent-lime', { emissive: color('accent-lime'), emissiveIntensity: 0.16, roughness: 0.35 })
    mesh(new THREE.SphereGeometry(radius, 12, 8), material, position, parent)
    return material
  }

  // A procedural studio reflection environment, using the same ceramic tokens.
  function createEnvironment() {
    const studio = new THREE.Scene()
    studio.background = color('bg-light-soft').multiplyScalar(0.35)
    const panelGeometry = new THREE.PlaneGeometry(8, 8)
    const panelMaterial = new THREE.MeshBasicMaterial({ color: color('bg-light').multiplyScalar(2.5), side: THREE.DoubleSide })
    for (const p of [[-5, 7, 3], [5, 3, -5], [0, 8, 0]]) {
      const panel = new THREE.Mesh(panelGeometry, panelMaterial)
      panel.position.set(...p)
      panel.lookAt(0, 0, 0)
      studio.add(panel)
    }
    const pmrem = new THREE.PMREMGenerator(renderer)
    const target = pmrem.fromScene(studio, 0.12)
    panelGeometry.dispose()
    panelMaterial.dispose()
    pmrem.dispose()
    return target
  }
  let environment = createEnvironment()
  scene.environment = environment.texture
  scene.environmentIntensity = 0.35

  scene.add(new THREE.HemisphereLight(color('bg-light'), color('bg-dark-soft'), 0.9))
  const key = new THREE.DirectionalLight(color('bg-light-soft'), 1.8)
  key.position.set(-3, 8, 6)
  key.castShadow = true
  key.shadow.mapSize.setScalar(mobile ? 1024 : 2048)
  Object.assign(key.shadow.camera, { left: -6, right: 6, top: 6, bottom: -6, near: 0.1, far: 25 })
  key.shadow.bias = -0.0003
  key.shadow.normalBias = 0.018
  key.shadow.radius = 4
  scene.add(key)
  const fill = new THREE.DirectionalLight(color('bg-light'), 0.65)
  fill.position.set(6, 3, 4)
  scene.add(fill)
  const rim = new THREE.DirectionalLight(color('accent-lime-pale'), 0.65)
  rim.position.set(1, 5, -5)
  scene.add(rim)

  // Contact occlusion is carried by the same floating group as every object.
  const aoTexture = textureCanvas(128, 128, (ctx, w, h) => {
    const gradient = ctx.createRadialGradient(w / 2, h / 2, 8, w / 2, h / 2, w / 2)
    gradient.addColorStop(0, css('text-on-light-muted'))
    gradient.addColorStop(1, 'transparent')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, w, h)
  })
  const ao = own(new THREE.MeshBasicMaterial({ map: aoTexture, transparent: true, depthWrite: false, opacity: 0.48 }))
  function contact(x, z, width, depth, y = 0.006, opacity) {
    const material = opacity === undefined ? ao : own(ao.clone())
    if (opacity !== undefined) material.opacity = opacity
    const shadow = mesh(new THREE.PlaneGeometry(width, depth), material, [x, y, z])
    shadow.rotation.x = -Math.PI / 2
    shadow.castShadow = false
    shadow.userData.excludeFromFraming = y < 0
  }
  contact(0, 0, 9, 6.8, -0.49, 0.45)
  box(SYSTEM.platform, [0, -0.22, 0], ceramic, model, 0.075)
  for (let x = -2.85; x < 3.8; x += 0.95) box([0.009, 0.003, 5.12], [x, 0.002, 0], divider, model, 0.001)
  for (let z = -1.77; z < 2.6; z += 0.88) box([7.43, 0.003, 0.009], [0, 0.002, z], divider, model, 0.001)
  label('USERS / INTERFACE', 1.95, 0.19, [-2.35, -0.23, 2.654], 'text-on-light-muted')
  label('SERVICES / API', 1.65, 0.19, [-0.1, -0.23, 2.654], 'text-on-light-muted')
  label('DATA', 0.68, 0.19, [2.1, -0.23, 2.654], 'text-on-light-muted')
  label('INFRASTRUCTURE', 1.6, 0.19, [3.805, -0.23, -0.45], 'text-on-light-muted', model, Math.PI / 2)

  // LEFT: monitor faces +x, matching the reference's upright receding screen.
  const monitor = group(SYSTEM.monitor)
  monitor.rotation.y = Math.PI / 2
  monitor.scale.x = 1.24
  contact(-2.65, -0.25, 1.3, 3.7)
  for (const x of [-0.94, 0.94]) {
    box([0.26, 0.92, 0.31], [x, 0.46, 0], inset, monitor)
    box([0.42, 0.08, 0.65], [x, 0.04, 0.05], ceramic, monitor)
  }
  box([3.05, 2.4, 0.24], [0, 2.08, 0], inset, monitor, 0.07)
  box([2.98, 2.34, 0.12], [0, 2.09, 0.12], ceramic, monitor, 0.045)
  box([2.7, 2.05, 0.035], [0, 2.1, 0.19], inset, monitor, 0.018)
  const dashboard = textureCanvas(960, 720, (ctx, w, h) => {
    ctx.fillStyle = css('bg-light'); ctx.fillRect(0, 0, w, h)
    ctx.fillStyle = css('bg-light-soft'); ctx.fillRect(0, 0, 224, h)
    ctx.fillStyle = css('text-on-light'); ctx.font = '600 28px sans-serif'; ctx.fillText('Project', 30, 63)
    const rows = ['Overview', 'Requests', 'Services', 'Settings']
    rows.forEach((text, i) => {
      if (!i) { ctx.fillStyle = css('accent-lime-pale'); ctx.fillRect(16, 110, 191, 54) }
      ctx.fillStyle = css('text-on-light-muted'); ctx.font = '21px sans-serif'
      ctx.fillText(text, 60, 145 + i * 70)
      ctx.strokeStyle = css('text-on-light-muted'); ctx.strokeRect(31, 128 + i * 70, 13, 16)
    })
    ctx.fillStyle = css('text-on-light'); ctx.font = '600 27px sans-serif'; ctx.fillText('System overview', 268, 70)
    ctx.fillStyle = css('text-on-light-muted'); ctx.font = '18px sans-serif'; ctx.fillText('Requests processed', 270, 108)
    ctx.fillStyle = css('bg-light-soft'); ctx.fillRect(268, 145, 642, 331)
    ctx.strokeStyle = css('line-on-light'); ctx.lineWidth = 1
    for (let y = 194; y < 460; y += 64) { ctx.beginPath(); ctx.moveTo(290, y); ctx.lineTo(886, y); ctx.stroke() }
    const chart = new Path2D('M 290 428 C 338 423 327 345 375 354 C 422 363 412 409 454 371 C 496 334 497 247 537 267 C 586 293 575 347 623 306 C 667 270 663 176 706 203 C 750 231 749 289 790 235 C 832 173 855 164 884 172')
    const area = new Path2D(chart); area.lineTo(884, 450); area.lineTo(290, 450); area.closePath()
    ctx.fillStyle = css('accent-lime-pale'); ctx.fill(area)
    ctx.strokeStyle = css('accent-lime'); ctx.lineWidth = 7; ctx.stroke(chart)
    for (let i = 0; i < 3; i++) { ctx.fillStyle = css('bg-light-soft'); ctx.fillRect(270 + i * 217, 505, 190, 48) }
    ctx.fillStyle = css('accent-lime'); ctx.beginPath(); ctx.roundRect(427, 598, 306, 65, 10); ctx.fill()
    ctx.fillStyle = css('text-on-light'); ctx.font = '600 22px sans-serif'; ctx.fillText('View activity', 514, 639)
  })
  const screen = mesh(new THREE.PlaneGeometry(2.65, 1.99), own(new THREE.MeshBasicMaterial({ map: dashboard, toneMapped: false })), [0, 2.1, 0.211], monitor)
  screen.castShadow = false
  const chartActivity = box([0.025, 0.79, 0.004], [-0.49, 2.22, 0.216], basic('accent-lime-pale', { transparent: true, opacity: 0.45 }), monitor)
  indicator([0, 0.96, 0.182], monitor, 0.017)

  // CENTER: ceramic pedestal, engineered API glass enclosure, exploded chamber.
  const api = group(SYSTEM.api)
  contact(-0.15, -0.5, 2.1, 1.95)
  box([1.45, 0.94, 1.35], [0, 0.47, 0], ceramic, api)
  box([1.52, 0.07, 1.43], [0, 0.965, 0], inset, api, 0.02)
  box([0.49, 0.55, 0.015], [0.735, 0.5, 0], inset, api).rotation.y = Math.PI / 2
  box([1.15, 0.045, 0.014], [0, 0.19, 0.68], divider, api)
  const apiSize = [1.4, 1.35, 1.3]
  box([1.15, 0.10, 1.08], [0, 1.11, 0], recess, api)
  box([0.67, 0.72, 0.67], [0, 1.6, 0], forest, api)
  for (let y = 1.3; y < 2.2; y += 0.32) {
    box([1.1, 0.055, 1.05], [0, y, 0], forest, api, 0.015)
    box([0.4, 0.026, 0.025], [0.31, y + 0.07, 0.55], darkDivider, api)
  }
  function enclosure(size, center, parent, open = false) {
    const [w, h, d] = size
    const [x, y, z] = center
    const t = 0.04
    // Separate thick panes leave the chamber interior visibly open.
    box([w, h, t], [x, y, z - d / 2], glass, parent, 0.009)
    box([t, h, d], [x - w / 2, y, z], glass, parent, 0.009)
    box([t, h, d], [x + w / 2, y, z], glass, parent, 0.009)
    if (!open) box([w, h, t], [x, y, z + d / 2], glass, parent, 0.009)
    box([w, t, d], [x, y - h / 2, z], glass, parent, 0.009)
    if (!open) box([w, t, d], [x, y + h / 2, z], glass, parent, 0.009)
    for (const dx of [-w / 2, w / 2]) for (const dz of [-d / 2, d / 2]) {
      box([0.018, h, 0.018], [x + dx, y, z + dz], edge, parent, 0.004)
    }
    for (const dy of [-h / 2, h / 2]) {
      for (const dz of [-d / 2, d / 2]) box([w, 0.016, 0.016], [x, y + dy, z + dz], edge, parent, 0.003)
      for (const dx of [-w / 2, w / 2]) box([0.016, 0.016, d], [x + dx, y + dy, z], edge, parent, 0.003)
    }
    box([w * 0.12, h * 0.85, 0.002], [x - w * 0.29, y, z + d / 2 + 0.024], sheen, parent, 0.001)
  }
  enclosure(apiSize, [0, 1.715, 0], api)
  label('API', 0.78, 0.43, [0, 1.76, 0.68], 'text-on-dark', api)
  label('SERVICE', 0.53, 0.10, [0, 1.48, 0.68], 'text-on-dark-muted', api)
  const apiIndicator = indicator([0.49, 1.18, 0.69], api)
  enclosure([1.4, 1.06, 1.3], [0, 3.02, 0], api, true)
  for (const x of [-0.52, 0.52]) {
    box([0.024, 0.2, 0.024], [x, 2.46, -0.5], edge, api, 0.004)
  }
  box([0.20, 0.20, 0.20], [0, 2.57, 0], glass, api)
  cylinder(0.055, 0.045, [0, 3.42, 0], forest, api)

  const gateway = group(SYSTEM.gateway)
  contact(-0.65, 1.35, 1.5, 1.25)
  box([1.13, 0.78, 0.93], [0, 0.39, 0], ceramic, gateway)
  box([0.97, 0.028, 0.80], [0, 0.79, 0], inset, gateway, 0.012)
  for (const y of [0.23, 0.48]) {
    box([0.67, 0.105, 0.014], [-0.08, y, 0.47], inset, gateway, 0.008)
    box([0.4, 0.012, 0.012], [-0.16, y + 0.018, 0.482], divider, gateway, 0.003)
  }
  const gatewayIndicator = indicator([0.41, 0.63, 0.473], gateway, 0.022)

  // FRONT RIGHT: three substantial sections with rounded rims and recessed bands.
  const database = group(SYSTEM.database)
  contact(1.65, 1.35, 1.7, 1.7)
  cylinder(0.57, 0.11, [0, 0.055, 0], inset, database)
  cylinder(0.485, 1.09, [0, 0.64, 0], recess, database)
  const databaseBody = own(new THREE.MeshPhysicalMaterial({
    color: color('bg-dark-soft'), roughness: 0.28, metalness: 0.3,
    clearcoat: 0.7, clearcoatRoughness: 0.2, envMapIntensity: 1.6,
  }))
  const databaseBand = standard('accent-lime-dim', { roughness: 0.4, emissive: color('accent-lime'), emissiveIntensity: 0 })
  for (let i = 0; i < 3; i++) {
    const y = 0.31 + i * 0.36
    cylinder(0.53, 0.285, [0, y, 0], databaseBody, database)
    ring(0.5, 0.033, [0, y + 0.142, 0], databaseBody, database)
    ring(0.505, 0.025, [0, y - 0.137, 0], databaseBody, database)
    ring(0.515, 0.009, [0, y + 0.151, 0], i === 1 ? databaseBand : pipeMaterial, database)
  }
  cylinder(0.51, 0.045, [0, 1.196, 0], glass, database)
  cylinder(0.41, 0.012, [0, 1.16, 0], forest, database)
  const databaseIndicator = indicator([0.18, 0.95, 0.504], database, 0.022)

  // FAR RIGHT: glass server trays with darker, slightly staggered inner hardware.
  const servers = group(SYSTEM.servers)
  contact(2.75, -0.85, 1.65, 1.8)
  box([1.25, 0.1, 1.27], [0, 0.05, 0], inset, servers)
  const serverIndicators = []
  for (let i = 0; i < 3; i++) {
    const y = 0.29 + i * 0.38
    const x = i === 1 ? 0.06 : 0
    box([1.04, 0.19, 1.03], [x, y, 0], forest, servers)
    box([1.2, 0.30, 1.2], [x, y + 0.025, 0], glass, servers, 0.045)
    box([0.76, 0.10, 0.021], [x - 0.06, y, 0.618], recess, servers, 0.008)
    box([0.52, 0.016, 0.025], [x - 0.14, y, 0.634], darkDivider, servers, 0.002)
    box([1.08, 0.018, 0.018], [x, y + 0.17, 0.59], edge, servers, 0.004)
    serverIndicators.push(indicator([x + 0.44, y, 0.632], servers, 0.027))
  }

  // UPPER RIGHT: one smooth beveled cloud silhouette, with a solid ceramic front.
  const cloud = group(SYSTEM.cloud)
  const shape = new THREE.Shape()
  shape.moveTo(-0.92, 0)
  shape.bezierCurveTo(-1.43, 0, -1.50, 0.77, -0.98, 0.88)
  shape.bezierCurveTo(-0.86, 1.32, -0.33, 1.43, 0, 1.13)
  shape.bezierCurveTo(0.43, 1.49, 0.95, 1.12, 0.91, 0.71)
  shape.bezierCurveTo(1.42, 0.59, 1.39, 0.02, 0.93, 0)
  shape.lineTo(-0.92, 0)
  const cloudMaterial = standard('bg-light', { roughness: 0.58, emissive: color('accent-lime-pale'), emissiveIntensity: 0 })
  mesh(new THREE.ExtrudeGeometry(shape, {
    depth: 0.31, steps: 1, bevelEnabled: true, bevelSegments: 6,
    bevelSize: 0.14, bevelThickness: 0.15, curveSegments: mobile ? 16 : 24,
  }), cloudMaterial, [0, 0, -0.17], cloud)
  label('DEPLOY', 0.85, 0.26, [0, 0.49, 0.296], 'text-on-light', cloud)

  // Ports and paths meet at mesh surfaces. Runs use clear lanes around solids.
  const routes = []
  function route(points, start, duration, response) {
    const path = roundedRoute(points)
    const length = path.getLength()
    mesh(new THREE.TubeGeometry(path, Math.ceil(length * 30), SYSTEM.pipeRadius, 8, false), pipeMaterial, [0, 0, 0])
    for (const p of [points[0], points.at(-1)]) {
      mesh(new THREE.SphereGeometry(0.053, 12, 8), forest, p)
    }
    const head = mesh(new THREE.SphereGeometry(0.04, 12, 8), basic('accent-lime-pale'), points[0])
    const trail = Array.from({ length: 10 }, (_, i) => mesh(
      new THREE.SphereGeometry(0.036 - i * 0.0018, 8, 6),
      basic('accent-lime', { transparent: true, opacity: 0.85 * (1 - i / 10), depthWrite: false }), points[0],
    ))
    routes.push({ path, length, head, trail, start, duration, response })
  }
  route([[-2.40, 1.08, 0.55], [-2.12, 1.08, 0.55], [-2.12, 0.10, 0.55], [-2.12, 0.10, 1.6], [-1.215, 0.10, 1.6], [-1.215, 0.39, 1.6]], 0, 3.2,
    a => { gatewayIndicator.emissiveIntensity = 0.16 + a * 0.7 })
  route([[-0.65, 0.81, 1.35], [-0.65, 1.25, 1.35], [-0.65, 1.25, 0.92], [-0.48, 1.25, 0.92], [-0.48, 1.25, 0.17]], 3.2, 3,
    a => { apiIndicator.emissiveIntensity = 0.16 + a * 0.85 })
  route([[0.575, 0.53, -0.28], [0.88, 0.53, -0.28], [0.88, 0.1, -0.28], [0.88, 0.1, 1.35], [1.12, 0.1, 1.35], [1.12, 0.62, 1.35]], 6.2, 3.8,
    a => { databaseBand.emissiveIntensity = a * 0.8; databaseIndicator.emissiveIntensity = 0.16 + a * 0.6 })
  route([[2.18, 0.65, 1.35], [2.47, 0.65, 1.35], [2.47, 0.1, 1.35], [3.45, 0.1, 1.35], [3.45, 0.1, -0.05], [3.45, 0.66, -0.05], [2.91, 0.66, -0.05], [2.91, 0.66, -0.22]], 10, 4,
    a => serverIndicators.forEach((m, i) => { m.emissiveIntensity = 0.16 + a * (0.6 + i * 0.1) }))
  route([[2.43, 1.25, -0.85], [2.43, 1.60, -0.85], [1.93, 1.60, -0.85], [1.93, 2.85, -0.85]], 14, 4,
    a => { cloudMaterial.emissiveIntensity = a * 0.12 })
  // Reference's elevated API-to-cloud link and chamber's central riser.
  route([[0.57, 1.94, -0.88], [1.35, 1.94, -0.88], [1.35, 1.94, -1.34], [1.35, 3.03, -1.34]], 7, 4,
    () => {})
  route([[-0.15, 2.4, -0.5], [-0.15, 3.42, -0.5]], 5.8, 3, () => {})

  model.updateMatrixWorld(true)
  const bounds = new THREE.Box3()
  model.traverse(object => {
    if (object.isMesh && !object.userData.excludeFromFraming) bounds.expandByObject(object)
  })
  function resize() {
    const width = Math.max(1, host.clientWidth)
    const height = Math.max(1, host.clientHeight)
    renderer.setSize(width, height, false)
    camera.updateMatrixWorld(true)
    const projected = new THREE.Box3()
    for (const x of [bounds.min.x, bounds.max.x]) for (const y of [bounds.min.y, bounds.max.y]) for (const z of [bounds.min.z, bounds.max.z]) {
      projected.expandByPoint(new THREE.Vector3(x, y, z).applyMatrix4(camera.matrixWorldInverse))
    }
    const center = projected.getCenter(new THREE.Vector3())
    const size = projected.getSize(new THREE.Vector3())
    const aspect = width / height
    const viewHeight = Math.max(size.y, size.x / aspect) * SYSTEM.framePadding
    const viewWidth = viewHeight * aspect
    camera.left = center.x - viewWidth / 2; camera.right = center.x + viewWidth / 2
    camera.top = center.y + viewHeight / 2; camera.bottom = center.y - viewHeight / 2
    camera.updateProjectionMatrix()
    renderer.shadowMap.needsUpdate = true
    render()
  }

  let active = false
  let reduced = false
  let lost = false
  let disposed = false
  let elapsed = 0
  let previous = 0
  let frame = 0
  let firstRender = true
  function update() {
    // Translate the complete transparent render, including its cached contact shadows.
    const offset = reduced ? 0 : Math.sin(elapsed * Math.PI * 2 / SYSTEM.floatSeconds) * SYSTEM.floatPixels
    renderer.domElement.style.transform = `translateY(${offset}px)`
    const cycle = elapsed % SYSTEM.sequenceSeconds
    routes.forEach(({ path, length, head, trail, start, duration, response }) => {
      const local = (cycle - start + SYSTEM.sequenceSeconds) % SYSTEM.sequenceSeconds
      const progress = local / duration
      head.visible = !reduced && progress <= 1
      if (head.visible) head.position.copy(path.getPointAt(Math.min(1, progress)))
      trail.forEach((dot, i) => {
        const t = progress - (i + 1) * 0.038 / length
        dot.visible = !reduced && t >= 0 && t <= 1 && local < duration + 0.5
        if (dot.visible) dot.position.copy(path.getPointAt(t))
      })
      const sinceArrival = local - duration
      const pulse = !reduced && sinceArrival >= 0 && sinceArrival < 0.8 ? Math.sin(sinceArrival / 0.8 * Math.PI) ** 2 : 0
      response(pulse)
    })
    chartActivity.visible = !reduced
    chartActivity.position.x = -0.49 + ((elapsed % 7) / 7) * 1.61
    chartActivity.material.opacity = Math.sin(((elapsed % 7) / 7) * Math.PI) * 0.32
  }
  function render() {
    if (disposed || lost) return
    update()
    renderer.render(scene, camera)
    if (firstRender) { firstRender = false; onReady() }
  }
  function tick(now) {
    frame = 0
    if (!active || reduced || lost || disposed) return
    if (previous) elapsed += Math.min((now - previous) / 1000, 0.1)
    previous = now
    render()
    frame = requestAnimationFrame(tick)
  }
  function setActivity(nextActive, nextReduced) {
    active = nextActive
    reduced = nextReduced
    cancelAnimationFrame(frame)
    frame = 0
    previous = 0
    // One completed still when reduced motion is enabled; no idle render loop.
    if (active) render()
    if (active && !reduced && !lost && !disposed) frame = requestAnimationFrame(tick)
  }
  const resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(host)
  const onLost = event => {
    event.preventDefault()
    lost = true
    cancelAnimationFrame(frame)
    onUnavailable()
  }
  const onRestored = () => {
    lost = false
    firstRender = true
    // GPU render targets lose their contents along with the context.
    environment.dispose()
    environment = createEnvironment()
    scene.environment = environment.texture
    renderer.shadowMap.needsUpdate = true
    render()
    setActivity(active, reduced)
  }
  renderer.domElement.addEventListener('webglcontextlost', onLost)
  renderer.domElement.addEventListener('webglcontextrestored', onRestored)
  resize()

  return {
    setActivity,
    dispose() {
      disposed = true
      cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      renderer.domElement.removeEventListener('webglcontextlost', onLost)
      renderer.domElement.removeEventListener('webglcontextrestored', onRestored)
      resources.forEach(resource => resource.dispose())
      environment.dispose()
      key.shadow.map?.dispose()
      renderer.dispose()
      renderer.domElement.remove()
    },
  }
}
