import { useEffect, useRef } from 'react';

// Deliberately simplified, decorative coastlines; coordinates are lon/lat.
const land = [
  [[-168,65],[-148,70],[-132,60],[-124,50],[-124,40],[-115,30],[-105,22],[-98,16],[-87,20],[-81,10],[-77,8],[-84,23],[-81,26],[-81,31],[-70,43],[-58,48],[-63,57],[-82,63],[-95,72],[-120,73],[-145,72]],
  [[-80,11],[-68,10],[-58,5],[-48,-1],[-35,-7],[-40,-20],[-50,-28],[-57,-38],[-68,-55],[-74,-48],[-72,-32],[-78,-9]],
  [[-53,60],[-42,62],[-20,75],[-28,83],[-52,82],[-65,75]],
  [[-17,35],[-1,37],[13,33],[33,31],[43,12],[51,11],[42,-7],[35,-22],[19,-35],[11,-25],[9,-3],[-3,5],[-15,10]],
  [[-10,36],[-10,44],[-2,49],[8,54],[5,60],[20,71],[31,70],[33,60],[45,65],[62,70],[92,77],[130,70],[178,66],[168,52],[144,47],[133,36],[123,25],[113,21],[109,10],[103,1],[97,8],[91,23],[82,21],[77,8],[71,21],[61,27],[50,28],[43,14],[35,29],[29,41],[19,39],[13,45],[5,43]],
  [[112,-11],[130,-12],[137,-16],[145,-13],[154,-26],[148,-39],[132,-33],[116,-35],[113,-24]],
  [[47,-13],[51,-17],[47,-26],[44,-24]], [[130,31],[142,46],[145,42],[137,33]],
  [[96,5],[108,-6],[117,-8],[115,1],[108,7]], [[119,5],[124,0],[128,-5],[137,-5],[141,-9],[128,-9]],
  [[166,-34],[179,-39],[172,-47],[165,-45]], [[-8,50],[2,51],[0,58],[-5,59]],
];
const radians = Math.PI / 180;
function inside(x, y, polygon) {
  let hit = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i], [xj, yj] = polygon[j];
    if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) hit = !hit;
  }
  return hit;
}
const points = [];
for (let lat = -57; lat < 83; lat += 2.4) for (let lon = -178; lon < 180; lon += 2.4 / Math.max(.3, Math.cos(lat * radians))) {
  if (land.some(polygon => inside(lon, lat, polygon))) points.push([lon, lat]);
}
const cities = [[-74,41],[-122,38],[-46,-24],[-.1,51],[13,52],[31,30],[73,19],[77,29],[104,1],[139,36],[151,-34],[18,-34]];
function vector(lon, lat) { const a = lon * radians, b = lat * radians; return [Math.cos(b)*Math.sin(a), Math.sin(b), Math.cos(b)*Math.cos(a)]; }

export default function EarthVisualization({ paused }) {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const mobile = matchMedia('(pointer: coarse)').matches;
    let visible = false, frame = 0, previous = 0, rotation = -.48, size = 440;
    let disposed = false;
    const project = (v, scale = 1) => {
      const x = v[0] * Math.cos(rotation) + v[2] * Math.sin(rotation);
      const z = -v[0] * Math.sin(rotation) + v[2] * Math.cos(rotation);
      const tilt = -.13, y = v[1] * Math.cos(tilt) - z * Math.sin(tilt);
      const depth = v[1] * Math.sin(tilt) + z * Math.cos(tilt);
      return [size/2 + x * size*.315*scale, size/2 - y * size*.315*scale, depth];
    };
    const draw = () => {
      if (disposed) return;
      ctx.clearRect(0,0,size,size);
      const c = size/2, r = size*.315;
      const halo = ctx.createRadialGradient(c,c,r*.8,c,c,r*1.35);
      halo.addColorStop(0,'#80ce2110'); halo.addColorStop(.65,'#76d5410d'); halo.addColorStop(1,'#70a50000');
      ctx.fillStyle=halo; ctx.fillRect(0,0,size,size);
      // Three restrained orbital bands, kept separate from the sphere rotation.
      [-.5,.7,1.45].forEach((angle,i) => {
        ctx.beginPath(); ctx.ellipse(c,c,r*1.32,r*.37,angle,0,Math.PI*2);ctx.strokeStyle=i===0?'#b6df6670':'#91bd3e40';ctx.lineWidth=.65;ctx.stroke();
        const t=rotation*.55+i*2.1, ex=Math.cos(t)*r*1.32, ey=Math.sin(t)*r*.37;
        const nx=c+ex*Math.cos(angle)-ey*Math.sin(angle), ny=c+ex*Math.sin(angle)+ey*Math.cos(angle);
        ctx.beginPath();ctx.arc(nx,ny,1.8,0,Math.PI*2);ctx.fillStyle='#d1f6a1';ctx.shadowColor='#b6ff00';ctx.shadowBlur=8;ctx.fill();ctx.shadowBlur=0;
      });
      const sphere=ctx.createRadialGradient(c+r*.55,c-r*.5,0,c,c,r);
      sphere.addColorStop(0,'#1b3927');sphere.addColorStop(.45,'#0b1e14');sphere.addColorStop(.85,'#040e09');sphere.addColorStop(1,'#112719');
      ctx.beginPath();ctx.arc(c,c,r,0,Math.PI*2);ctx.fillStyle=sphere;ctx.fill();ctx.strokeStyle='#a5de6970';ctx.lineWidth=1;ctx.stroke();
      // Project latitude/longitude lines, omitting the hidden hemisphere.
      ctx.lineWidth=.45;ctx.strokeStyle='#a0d77917';
      for(let lat=-60;lat<=60;lat+=30){ctx.beginPath();let pen=false;for(let lon=-180;lon<=180;lon+=3){const p=project(vector(lon,lat));if(p[2]>0){if(pen)ctx.lineTo(p[0],p[1]);else ctx.moveTo(p[0],p[1]);pen=true;}else pen=false;}ctx.stroke();}
      for(let lon=-180;lon<180;lon+=30){ctx.beginPath();let pen=false;for(let lat=-90;lat<=90;lat+=3){const p=project(vector(lon,lat));if(p[2]>0){if(pen)ctx.lineTo(p[0],p[1]);else ctx.moveTo(p[0],p[1]);pen=true;}else pen=false;}ctx.stroke();}
      points.forEach(([lon,lat])=>{const p=project(vector(lon,lat));if(p[2]<=0)return;const light=.23+p[2]*.42;ctx.fillStyle=`rgba(160,193,102,${light})`;ctx.beginPath();ctx.ellipse(p[0],p[1],Math.max(.35,size*.0025*p[2]),size*.0021,0,0,Math.PI*2);ctx.fill();});
      // Great-circle-like lifted network arcs between a handful of nodes.
      [[0,3],[3,6],[6,8],[8,9],[3,5],[5,11],[8,10],[0,2]].forEach(([a,b])=>{
        const va=vector(...cities[a]),vb=vector(...cities[b]);ctx.beginPath();let pen=false;
        for(let i=0;i<=28;i++){const t=i/28,v=va.map((n,k)=>n*(1-t)+vb[k]*t),norm=Math.hypot(...v);const p=project(v.map(n=>n/norm),1+Math.sin(t*Math.PI)*.08);if(p[2]>.03){if(pen)ctx.lineTo(p[0],p[1]);else ctx.moveTo(p[0],p[1]);pen=true;}else pen=false;}
        ctx.strokeStyle='#b5ea6560';ctx.lineWidth=.6;ctx.stroke();
      });
      cities.forEach(city=>{const p=project(vector(...city),1.003);if(p[2]<=0)return;ctx.beginPath();ctx.arc(p[0],p[1],1.7,0,Math.PI*2);ctx.fillStyle='#d6ff8e';ctx.shadowColor='#b6ff00';ctx.shadowBlur=8;ctx.fill();ctx.shadowBlur=0;});
      const shade=ctx.createLinearGradient(c-r,c+r*.3,c+r,c-r*.3);shade.addColorStop(0,'#00000099');shade.addColorStop(.6,'#00000005');shade.addColorStop(1,'#a6e06b12');ctx.beginPath();ctx.arc(c,c,r,0,Math.PI*2);ctx.fillStyle=shade;ctx.fill();
      ctx.beginPath();ctx.arc(c,c,r,-1.35,.5);ctx.strokeStyle='#c3ef8b8a';ctx.lineWidth=1.1;ctx.stroke();
    };
    const animate = now => {
      frame = 0;
      if (!visible || document.hidden || paused || reduced.matches || disposed) return;
      if (!previous || now-previous >= (mobile ? 70 : 40)) { if(previous) rotation += Math.min(now-previous,100)*.000045;previous=now;draw(); }
      frame=requestAnimationFrame(animate);
    };
    const sync = () => { cancelAnimationFrame(frame);frame=0;previous=0;if(visible){draw();if(!document.hidden&&!paused&&!reduced.matches)frame=requestAnimationFrame(animate);} };
    const resize = () => { size=Math.max(1,canvas.clientWidth);const dpr=Math.min(devicePixelRatio,mobile?1.25:1.5);canvas.width=Math.round(size*dpr);canvas.height=Math.round(size*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);draw(); };
    const observer = new IntersectionObserver(([entry]) => {visible=entry.isIntersecting;sync();});observer.observe(canvas);
    const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(canvas);
    reduced.addEventListener('change',sync);document.addEventListener('visibilitychange',sync);resize();
    return () => {disposed=true;cancelAnimationFrame(frame);observer.disconnect();resizeObserver.disconnect();reduced.removeEventListener('change',sync);document.removeEventListener('visibilitychange',sync);};
  }, [paused]);
  return <canvas ref={ref} className="earth-canvas" aria-hidden="true" />;
}
