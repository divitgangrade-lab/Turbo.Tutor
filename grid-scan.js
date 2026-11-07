import"./island-chunks/chunk-F7TZUDVZ.js";import{e as je,g as le,h as K,j as V,n as z}from"./island-chunks/chunk-OS2XOP7G.js";var se=4,We=2.4,mt=2.2,ue=1.25,vt="https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/dist/face-api.min.js",pt="https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@0.22.2/weights",xt={solid:0,dashed:1,dotted:2},gt=`#version 300 es
out vec2 vUv;
void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  vUv = p;
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`,yt=`#version 300 es
precision highp float;
precision highp int;
uniform float uAspect;
uniform float uPixel;
uniform vec3 uEye;
uniform float uDepth;
uniform vec3 uCell;
uniform float uThick;
uniform float uDot;
uniform int uStyle;
uniform vec3 uLineColor;
uniform vec3 uScanColor;
uniform vec3 uCoreColor;
uniform float uFade;
uniform float uScanZ;
uniform float uScanDir;
uniform float uScanAlpha;
uniform float uScanWidth;
uniform float uTrail;
uniform float uReveal;
uniform float uPoints;
uniform float uReflect;
uniform float uHaze;
uniform float uShade;
uniform float uLight;
uniform vec4 uPing[4];
uniform float uPingAlpha[4];
uniform vec4 uHover;
uniform float uTime;
in vec2 vUv;
layout(location = 0) out vec4 outColor;
layout(location = 1) out vec4 outGlow;

struct Light {
  float grid;
  float fade;
  float core;
  float trail;
  float spill;
  float ping;
  float wake;
  float reveal;
};

float hash(vec2 p) {
  vec3 q = fract(vec3(p.xyx) * 0.1031);
  q += dot(q, q.yzx + 33.33);
  return fract((q.x + q.y) * q.z);
}

vec2 hash2(vec2 p) {
  vec3 q = fract(vec3(p.xyx) * vec3(0.1031, 0.103, 0.0973));
  q += dot(q, q.yzx + 33.33);
  return fract((q.xx + q.yz) * q.zy);
}

float lines(float across, float along, float period, float dash, float fa, float fb) {
  float u = across / period;
  float du = fa / period;
  float d = abs(fract(u + 0.5) - 0.5) / max(du, 1e-5);
  float dense = smoothstep(0.1, 0.4, du);
  if (uStyle == 2) {
    float c = along / dash * 5.0;
    float dc = fb / dash * 5.0;
    float e = abs(fract(c + 0.5) - 0.5) / max(dc, 1e-5);
    float cov = clamp(uThick + 1.0 - length(vec2(d, e)), 0.0, 1.0);
    float mean = min(1.0, 3.1416 * (uThick + 0.5) * (uThick + 0.5) * du * dc);
    return mix(cov, mean, max(dense, smoothstep(0.1, 0.4, dc)));
  }
  float cov = clamp(uThick + 0.5 - d, 0.0, 1.0);
  float mean = min(1.0, 2.0 * uThick * du);
  if (uStyle == 1) {
    float c = along / dash * 4.0;
    float dc = fb / dash * 4.0;
    float e = abs(fract(c + 0.5) - 0.5);
    float m = clamp((0.25 - e) / max(dc, 1e-5) + 0.5, 0.0, 1.0);
    cov *= mix(m, 0.5, smoothstep(0.1, 0.4, dc));
    mean *= 0.5;
  }
  return mix(cov, mean, dense);
}

float depthFade(float z) {
  float n = clamp(z / uDepth, 0.0, 1.0);
  return mix(1.0, (exp(-3.0 * n) - 0.0497871) / 0.9502129, uFade);
}

vec3 project(vec3 eye, vec3 o, int face, float plane) {
  vec3 d = o - eye;
  float t = face == 0 ? (plane - o.x) / d.x : (face == 1 ? (plane - o.y) / d.y : (plane - o.z) / d.z);
  return o + d * t;
}

void trace(vec3 o, vec3 d, out int face, out float plane, out vec3 h) {
  float sx = d.x > 0.0 ? 0.5 * uAspect : -0.5 * uAspect;
  float sy = d.y > 0.0 ? 0.5 : -0.5;
  float tx = abs(d.x) > 1e-6 ? (sx - o.x) / d.x : 1e9;
  float ty = abs(d.y) > 1e-6 ? (sy - o.y) / d.y : 1e9;
  float t = (uDepth - o.z) / d.z;
  face = 2;
  plane = uDepth;
  if (tx < t) {
    face = 0;
    plane = sx;
    t = tx;
  }
  if (ty < t) {
    face = 1;
    plane = sy;
    t = ty;
  }
  h = o + d * t;
}

vec2 faceUv(vec3 h, int face) {
  if (face == 0) return vec2(h.z, h.y + 0.5);
  if (face == 1) return vec2(h.x + 0.5 * uAspect, h.z);
  return vec2(h.x + 0.5 * uAspect, h.y + 0.5);
}

Light illuminate(vec3 h, int face, vec2 uv, vec2 foot, float blur) {
  Light l;
  vec2 cell = face == 0 ? uCell.zy : (face == 1 ? uCell.xz : uCell.xy);
  vec2 f = foot * blur;
  float minor = max(lines(uv.x, uv.y, cell.x, cell.y, f.x, f.y), lines(uv.y, uv.x, cell.y, cell.x, f.y, f.x));
  float major = max(
    lines(uv.x, uv.y, cell.x * 4.0, cell.y, f.x, f.y),
    lines(uv.y, uv.x, cell.y * 4.0, cell.x, f.y, f.x)
  );
  l.grid = max(minor * 0.75, major) / blur;
  float z = h.z;
  l.fade = depthFade(z);
  l.reveal = smoothstep(uReveal, uReveal - 0.2, z);
  float zFoot = face == 0 ? f.x : (face == 1 ? f.y : 0.0);
  float width = max(uScanWidth, zFoot * 1.1);
  float dz = z - uScanZ;
  l.core = exp(-dz * dz / (width * width)) * (face == 2 ? 0.45 : 1.0) * uScanAlpha;
  float behind = -dz * uScanDir;
  l.trail = exp(-max(behind, 0.0) / uTrail) * smoothstep(-width, width * 0.5, behind) * uScanAlpha;
  l.spill = exp(-dz * dz / 0.05) * uScanAlpha;
  l.ping = 0.0;
  l.wake = 0.0;
  for (int i = 0; i < 4; i++) {
    float alpha = uPingAlpha[i];
    if (alpha <= 0.0) continue;
    float dist = length(h - uPing[i].xyz) - uPing[i].w;
    l.ping += exp(-dist * dist / 0.0012) * alpha;
    l.wake += exp(min(dist, 0.0) / 0.22) * smoothstep(0.03, -0.03, dist) * alpha;
  }
  return l;
}

void over(inout vec4 acc, vec3 color, float alpha) {
  alpha = clamp(alpha, 0.0, 1.0);
  acc = vec4(color * alpha, alpha) + acc * (1.0 - alpha);
}

void paint(inout vec4 color, inout float energy, Light l, float gain, float lift, float hover) {
  float base = l.grid * l.fade * l.reveal * lift;
  float far = l.fade * l.reveal * gain;
  float lit = l.grid * (l.core * 1.2 + l.trail * 0.75 + l.ping * 1.4 + l.wake * 0.5 + hover * 0.5) * far;
  float sheen = (l.core * 0.14 + l.spill * 0.05 + l.trail * 0.03 + l.ping * 0.2 + l.wake * 0.04) * far;
  float laser = (l.core + l.ping * 0.35) * far;
  over(color, uLineColor, base);
  over(color, uScanColor, sheen);
  over(color, uScanColor, lit);
  over(color, uCoreColor, laser * 0.9);
  energy += laser * 0.9 + lit * 0.5;
}

void main() {
  vec3 p = vec3((vUv.x - 0.5) * uAspect, vUv.y - 0.5, 0.0);
  vec3 d = p - uEye;
  int face;
  float plane;
  vec3 h;
  trace(p, d, face, plane, h);
  vec3 hx = project(uEye, p + vec3(uPixel, 0.0, 0.0), face, plane);
  vec3 hy = project(uEye, p + vec3(0.0, uPixel, 0.0), face, plane);
  vec2 uv = faceUv(h, face);
  vec2 ux = faceUv(hx, face) - uv;
  vec2 uy = faceUv(hy, face) - uv;
  vec2 foot = vec2(length(vec2(ux.x, uy.x)), length(vec2(ux.y, uy.y)));
  Light l = illuminate(h, face, uv, foot, 1.0);

  vec4 color = vec4(0.0);
  float energy = 0.0;

  if (uShade > 0.0) {
    vec2 gaps = face == 0
      ? vec2(0.5 - abs(h.y), uDepth - h.z)
      : (face == 1 ? vec2(0.5 * uAspect - abs(h.x), uDepth - h.z) : vec2(0.5 * uAspect - abs(h.x), 0.5 - abs(h.y)));
    vec2 crease = 1.0 - exp(-max(gaps, 0.0) / 0.16);
    float occlusion = crease.x * crease.y;
    float lamp = 1.0 / (1.0 + h.z * h.z * 0.9);
    float tilt = face == 1 ? (plane < 0.0 ? 1.1 : 0.85) : (face == 2 ? 0.8 : 1.0);
    float glowSpill = (l.spill * 0.5 + l.trail * 0.12) * l.reveal * l.fade;
    if (uLight > 0.5) {
      float shadow = (1.0 - lamp * tilt) * 0.09 + (1.0 - occlusion) * 0.2;
      over(color, vec3(0.0), shadow * uShade * l.reveal * l.fade);
    } else {
      over(color, vec3(1.0), lamp * tilt * occlusion * 0.11 * uShade * l.reveal * l.fade);
    }
    over(color, uScanColor, glowSpill * uShade * occlusion * 0.35);
  }

  if (face == 1 && plane < 0.0 && uReflect > 0.0) {
    vec3 mirror = vec3(uEye.x, -1.0 - uEye.y, uEye.z);
    vec3 r = h - mirror;
    int face2;
    float plane2;
    vec3 h2;
    trace(h, r, face2, plane2, h2);
    vec2 uv2 = faceUv(h2, face2);
    vec2 ux2 = faceUv(project(mirror, hx, face2, plane2), face2) - uv2;
    vec2 uy2 = faceUv(project(mirror, hy, face2, plane2), face2) - uv2;
    vec2 foot2 = vec2(length(vec2(ux2.x, uy2.x)), length(vec2(ux2.y, uy2.y)));
    float travel = length(h2 - h);
    Light m = illuminate(h2, face2, uv2, foot2, 1.0 + travel * 4.0);
    m.reveal *= l.reveal;
    float grazing = 1.0 - normalize(r).y;
    float gain = (0.3 + 0.7 * grazing * grazing * grazing * grazing) * uReflect * exp(-travel * 1.1) * (uLight > 0.5 ? 0.6 : 1.0);
    float reflected = 0.0;
    paint(color, reflected, m, gain, 0.0, 0.0);
    energy += reflected * 0.6;
  }

  vec3 near = h - uHover.xyz;
  float hover = exp(-dot(near, near) / 0.08) * uHover.w;
  paint(color, energy, l, 1.0, 1.0, hover);

  if (uPoints > 0.5) {
    vec2 cell = face == 0 ? uCell.zy : (face == 1 ? uCell.xz : uCell.xy);
    vec2 spacing = cell / 2.5;
    vec2 q = uv / spacing;
    vec2 id = floor(q);
    vec2 seed = id + vec2(float(face) * 13.7 + plane * 5.3, float(face) * 3.1);
    vec2 delta = (q - id - (0.2 + 0.6 * hash2(seed))) * spacing;
    float det = ux.x * uy.y - ux.y * uy.x;
    vec2 s = vec2(delta.x * uy.y - delta.y * uy.x, ux.x * delta.y - ux.y * delta.x) / det;
    float radius = uDot * mix(1.0, 0.55, clamp(h.z / uDepth, 0.0, 1.0));
    float spot = clamp(radius + 0.5 - length(s), 0.0, 1.0);
    float gap = min(spacing.x / foot.x, spacing.y / foot.y);
    float r = hash(seed + 7.7);
    float flicker = 0.75 + 0.25 * sin(uTime * (3.0 + r * 5.0) + r * 40.0);
    float dots = spot * smoothstep(5.0, 10.0, gap) * smoothstep(0.25, 0.6, r) * (0.3 + 0.7 * r * r) * flicker;
    float hot = l.core * 2.5 + l.ping * 1.6;
    float warm = l.trail * l.trail * 1.3 + l.wake * 0.6 + hover * 1.3;
    float spark = dots * (hot + warm) * l.fade * l.reveal;
    over(color, mix(uScanColor, uCoreColor, clamp(hot / max(hot + warm, 1e-4), 0.0, 1.0)), spark);
    energy += spark * 0.9;
  }

  if (uHaze > 0.0 && uScanAlpha > 0.0 && uScanZ > 0.0 && h.z > uScanZ) {
    vec3 c = p + d * (uScanZ / d.z);
    float grain = hash(floor(c.xy * 180.0) + floor(uTime * 24.0) * 7.0);
    float edge = min(0.5 * uAspect - abs(c.x), 0.5 - abs(c.y));
    float rim = exp(-edge / 0.06);
    float veil = uHaze * uScanAlpha * (0.45 + 0.9 * grain) * (0.55 + rim * 1.6);
    over(color, uScanColor, veil * depthFade(uScanZ) * l.reveal);
  }

  energy = clamp(energy, 0.0, 1.0);
  outColor = color;
  outGlow = vec4(uScanColor * energy, energy);
}`,Et=`#version 300 es
precision highp float;
uniform sampler2D uSource;
uniform vec2 uTexel;
in vec2 vUv;
out vec4 outColor;
void main() {
  vec2 o = uTexel;
  outColor = 0.25 * (
    texture(uSource, vUv + vec2(-o.x, -o.y)) +
    texture(uSource, vUv + vec2(o.x, -o.y)) +
    texture(uSource, vUv + vec2(-o.x, o.y)) +
    texture(uSource, vUv + vec2(o.x, o.y))
  );
}`,wt=`#version 300 es
precision highp float;
uniform sampler2D uSource;
uniform vec2 uStep;
in vec2 vUv;
out vec4 outColor;
void main() {
  vec4 sum = texture(uSource, vUv) * 0.1964825501511404;
  sum += (texture(uSource, vUv + uStep * 1.411764705882353) + texture(uSource, vUv - uStep * 1.411764705882353)) * 0.2969069646728344;
  sum += (texture(uSource, vUv + uStep * 3.2941176470588234) + texture(uSource, vUv - uStep * 3.2941176470588234)) * 0.09447039785044732;
  sum += (texture(uSource, vUv + uStep * 5.176470588235294) + texture(uSource, vUv - uStep * 5.176470588235294)) * 0.010381362401148057;
  outColor = sum;
}`,bt=`#version 300 es
precision highp float;
uniform sampler2D uScene;
uniform sampler2D uBloom;
uniform float uGlow;
in vec2 vUv;
out vec4 outColor;
float hash(vec2 p) {
  vec3 q = fract(vec3(p.xyx) * 0.1031);
  q += dot(q, q.yzx + 33.33);
  return fract((q.x + q.y) * q.z);
}
void main() {
  vec4 scene = texture(uScene, vUv);
  vec4 bloom = texture(uBloom, vUv) * uGlow;
  bloom.a = min(bloom.a, 1.0);
  bloom.rgb = min(bloom.rgb, vec3(bloom.a));
  vec4 color = scene + bloom * (1.0 - scene.a);
  float noise = (hash(gl_FragCoord.xy) - 0.5) / 255.0;
  color.a = clamp(color.a + noise, 0.0, 1.0);
  color.rgb = clamp(color.rgb + noise, vec3(0.0), vec3(color.a));
  outColor = color;
}`,g=(a,s,h)=>Math.min(h,Math.max(s,a)),Ve=(a,s,h)=>{let m=a.createShader(s);return m?(a.shaderSource(m,h),a.compileShader(m),a.getShaderParameter(m,a.COMPILE_STATUS)?m:(a.deleteShader(m),null)):null},fe=(a,s)=>{let h=Ve(a,a.VERTEX_SHADER,gt),m=Ve(a,a.FRAGMENT_SHADER,s),T=a.createProgram();if(!h||!m||!T)return null;if(a.attachShader(T,h),a.attachShader(T,m),a.linkProgram(T),a.deleteShader(h),a.deleteShader(m),!a.getProgramParameter(T,a.LINK_STATUS))return a.deleteProgram(T),null;let ae={},ve=a.getProgramParameter(T,a.ACTIVE_UNIFORMS);for(let J=0;J<ve;J++){let oe=a.getActiveUniform(T,J);if(!oe)continue;let re=oe.name.replace(/\[0\]$/,"");ae[re]=a.getUniformLocation(T,re)}return{program:T,uniforms:ae}},de=a=>{let s=a.createTexture();return a.bindTexture(a.TEXTURE_2D,s),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_MIN_FILTER,a.LINEAR),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_MAG_FILTER,a.LINEAR),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_WRAP_S,a.CLAMP_TO_EDGE),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_WRAP_T,a.CLAMP_TO_EDGE),{texture:s,width:0,height:0}},he=(a,s,h,m)=>{s.width===h&&s.height===m||(s.width=h,s.height=m,a.bindTexture(a.TEXTURE_2D,s.texture),a.texImage2D(a.TEXTURE_2D,0,a.RGBA8,h,m,0,a.RGBA,a.UNSIGNED_BYTE,null))},me=null,Tt=()=>window.faceapi?Promise.resolve(window.faceapi):(me||(me=new Promise((a,s)=>{let h=document.createElement("script");h.src=vt,h.async=!0,h.onload=()=>window.faceapi?a(window.faceapi):s(new Error("face-api.js")),h.onerror=()=>{me=null,s(new Error("face-api.js"))},document.head.appendChild(h)})),me),St={loading:"Loading face tracking",searching:"Looking for a face",tracking:"Tracking",blocked:"Camera unavailable"},Rt=({linesColor:a,scanColor:s,cells:h=8,lineThickness:m=1,lineStyle:T="solid",depth:ae=3,depthFade:ve=.6,parallax:J=1,points:oe=!0,reflection:re=.35,shading:Ye=.7,scanDirection:$e="forward",scanDuration:Ke=2.4,scanDelay:Je=1.6,scanWidth:Qe=1,trail:et=.5,glow:tt=.6,autoScan:at=!0,interactive:ot=!0,clickEffect:rt="ping",enableWebcam:pe=!1,showPreview:Te=!1,modelsPath:Se=pt,enableGyro:nt=!1,intro:it=!0,lightMode:xe=!1,dpr:ct,className:Re="",style:lt,...st})=>{let Ae=V(null),Me=V(null),Fe=V(null),ge=V(null),_=V(null),[ut,Q]=le("loading"),Ue={linesColor:a??(xe?"#d4d4d8":"#4d4757"),scanColor:s??(xe?"#0284c7":"#7dd3fc"),cells:g(h,2,40),thickness:g(m,.5,4),style:xt[T]??0,depth:g(ae,.5,12),depthFade:g(ve,0,1),parallax:g(J,0,3),points:oe,reflection:g(re,0,1),shading:g(Ye,0,1),direction:$e,duration:g(Ke,.3,20),delay:g(Je,0,30),scanWidth:g(Qe,.2,5),trail:g(et,0,1),glow:g(tt,0,1.5),autoScan:at,interactive:ot,clickEffect:rt,enableGyro:nt,intro:it,lightMode:xe,dpr:ct},F=V(Ue);return F.current=Ue,K(()=>{let E=Ae.current,d=Me.current,e=d?.getContext("webgl2",{alpha:!0,premultipliedAlpha:!0,antialias:!1,depth:!1,stencil:!1});if(!E||!d||!e)return;let q=fe(e,yt),P=fe(e,Et),v=fe(e,wt),X=fe(e,bt);if(!q||!P||!v||!X)return;let U=e.createVertexArray(),O=de(e),D=de(e),x=de(e),S=de(e),k=e.createFramebuffer(),G=e.createFramebuffer(),ee=e.createFramebuffer(),B=document.createElement("canvas").getContext("2d",{willReadFrequently:!0}),ne=new Map,ie=t=>{let r=String(t),o=ne.get(r);if(o)return o;let l=[1,1,1];if(B){B.clearRect(0,0,1,1),B.fillStyle="#000000",B.fillStyle=r,B.fillRect(0,0,1,1);let[u,b,M]=B.getImageData(0,0,1,1).data;l=[u/255,b/255,M/255]}return ne.set(r,l),l},y=window.matchMedia?.("(prefers-reduced-motion: reduce)").matches??!1,w={width:1,height:1,ratio:1},i={x:0,y:0,vx:0,vy:0,tx:0,ty:0,f:ue,vf:0,tf:ue},I={x:0,y:0,inside:!1},A={x:0,y:0,held:!1},Z={gamma:0,beta:0,ready:!1,asked:!1},p={x:0,y:0,z:0,strength:0,ready:!1},c={z:0,dir:1,alpha:0,start:0,sweeps:0,waiting:!1},L=[],Ce=new Float32Array(se*4),ye=new Float32Array(se),C=0,N=F.current.intro&&!y?0:1,te=0,Y=0,ce=!0,$=0,Ee=()=>{let t=F.current,r=w.width/w.height,o=1/Math.round(t.cells),l=r/Math.max(1,Math.round(r/o)),u=Math.max(o,Math.round(t.depth/o)*o);return{aspect:r,cx:l,cy:o,roomDepth:u}},ze=(t,r)=>{let{aspect:o,roomDepth:l}=Ee(),u=(t-.5)*o,b=r-.5,M=u-i.x,f=b-i.y,n=i.f,H=M>0?.5*o:-.5*o,j=f>0?.5:-.5,W=l/n;return Math.abs(M)>1e-6&&(W=Math.min(W,(H-u)/M)),Math.abs(f)>1e-6&&(W=Math.min(W,(j-b)/f)),{x:u+M*W,y:b+f*W,z:n*W}},De=t=>{c.dir=t.direction==="backward"||t.direction==="pingpong"&&c.sweeps%2===1?-1:1,c.start=C,c.waiting=!1,c.sweeps+=1},ft=(t,r)=>{if(N<1){let u=N;c.dir=1,c.z=u*(r+.4)-.2,c.alpha=Math.min(1,u*6)*(1-Math.max(0,u-.85)/.15);return}if(c.sweeps===0&&!c.waiting&&(c.waiting=!0,c.start=C,c.alpha=0),c.waiting){c.alpha=0,t.autoScan&&!y&&C-c.start>=t.delay&&De(t);return}let o=(C-c.start)/t.duration;if(o>=1){c.waiting=!0,c.start=C,c.alpha=0;return}let l=o*(r+.3)-.15;c.z=c.dir>0?l:r-l,c.alpha=Math.min(1,o/.12)*Math.min(1,(1-o)/.12)},dt=t=>{let r=Math.max(1,Math.ceil(t/.008333333333333333)),o=t/r;for(let l=0;l<r;l++)i.vx+=((i.tx-i.x)*42-i.vx*11)*o,i.vy+=((i.ty-i.y)*42-i.vy*11)*o,i.vf+=((i.tf-i.f)*42-i.vf*11)*o,i.x+=i.vx*o,i.y+=i.vy*o,i.f+=i.vf*o},we=(t,r,o)=>{A.x=g(t,-1,1),A.y=g(r,-1,1),A.held=o},ht=t=>{let r=w.width/w.height,o=y?0:1,l=A.held?A.x:(Math.sin(C*.21)*.2+Math.sin(C*.083+1.3)*.12)*o,u=A.held?A.y:Math.sin(C*.17+2.1)*.16*o;i.tx=l*t.parallax*.22*r,i.ty=u*t.parallax*.22},ke=()=>{let t=F.current;w.width=Math.max(1,E.clientWidth),w.height=Math.max(1,E.clientHeight),w.ratio=Math.min(t.dpr||window.devicePixelRatio||1,2),d.width=Math.max(1,Math.round(w.width*w.ratio)),d.height=Math.max(1,Math.round(w.height*w.ratio)),he(e,O,d.width,d.height),he(e,D,d.width,d.height),e.bindFramebuffer(e.FRAMEBUFFER,k),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,O.texture,0),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT1,e.TEXTURE_2D,D.texture,0);let r=Math.max(1,Math.round(d.width/4)),o=Math.max(1,Math.round(d.height/4));he(e,x,r,o),he(e,S,r,o),e.bindFramebuffer(e.FRAMEBUFFER,G),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,x.texture,0),e.bindFramebuffer(e.FRAMEBUFFER,ee),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,S.texture,0),e.bindFramebuffer(e.FRAMEBUFFER,null),Le(),R()},Le=()=>{let t=F.current,{aspect:r,cx:o,cy:l,roomDepth:u}=Ee(),b=ie(t.linesColor),M=ie(t.scanColor),f=t.lightMode?M:M.map(j=>j+(1-j)*.65),n=q.uniforms;e.bindVertexArray(U),e.disable(e.BLEND),e.bindFramebuffer(e.FRAMEBUFFER,k),e.drawBuffers([e.COLOR_ATTACHMENT0,e.COLOR_ATTACHMENT1]),e.viewport(0,0,d.width,d.height),e.useProgram(q.program),e.uniform1f(n.uAspect,r),e.uniform1f(n.uPixel,1/d.height),e.uniform3f(n.uEye,i.x,i.y,-i.f),e.uniform1f(n.uDepth,u),e.uniform3f(n.uCell,o,l,l),e.uniform1f(n.uThick,t.thickness*w.ratio*.5),e.uniform1f(n.uDot,1.8*w.ratio),e.uniform1i(n.uStyle,t.style),e.uniform3fv(n.uLineColor,b),e.uniform3fv(n.uScanColor,M),e.uniform3fv(n.uCoreColor,f),e.uniform1f(n.uFade,t.depthFade),e.uniform1f(n.uScanZ,c.z),e.uniform1f(n.uScanDir,c.dir),e.uniform1f(n.uScanAlpha,c.alpha),e.uniform1f(n.uScanWidth,.006*t.scanWidth),e.uniform1f(n.uTrail,.04+t.trail*1.1),e.uniform1f(n.uReveal,N<1?c.z+.05:1e4),e.uniform1f(n.uPoints,t.points?1:0),e.uniform1f(n.uReflect,t.reflection),e.uniform1f(n.uHaze,t.lightMode?.03:.05),e.uniform1f(n.uShade,t.shading),e.uniform1f(n.uLight,t.lightMode?1:0),e.uniform4fv(n.uPing,Ce),e.uniform1fv(n.uPingAlpha,ye),e.uniform4f(n.uHover,p.x,p.y,p.z,p.strength),e.uniform1f(n.uTime,C),e.drawArrays(e.TRIANGLES,0,3);let H=t.glow>0;if(H){e.bindFramebuffer(e.FRAMEBUFFER,G),e.viewport(0,0,x.width,x.height),e.useProgram(P.program),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,D.texture),e.uniform1i(P.uniforms.uSource,0),e.uniform2f(P.uniforms.uTexel,1/D.width,1/D.height),e.drawArrays(e.TRIANGLES,0,3);let j=2.2*w.ratio/2;e.useProgram(v.program),e.uniform1i(v.uniforms.uSource,0),e.bindFramebuffer(e.FRAMEBUFFER,ee),e.bindTexture(e.TEXTURE_2D,x.texture),e.uniform2f(v.uniforms.uStep,j/x.width,0),e.drawArrays(e.TRIANGLES,0,3),e.bindFramebuffer(e.FRAMEBUFFER,G),e.bindTexture(e.TEXTURE_2D,S.texture),e.uniform2f(v.uniforms.uStep,0,j/x.height),e.drawArrays(e.TRIANGLES,0,3)}e.bindFramebuffer(e.FRAMEBUFFER,null),e.viewport(0,0,d.width,d.height),e.useProgram(X.program),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,O.texture),e.uniform1i(X.uniforms.uScene,0),e.activeTexture(e.TEXTURE1),e.bindTexture(e.TEXTURE_2D,x.texture),e.uniform1i(X.uniforms.uBloom,1),e.uniform1f(X.uniforms.uGlow,H?t.glow*(t.lightMode?.8:1.6):0),e.drawArrays(e.TRIANGLES,0,3),e.activeTexture(e.TEXTURE0)},_e=t=>{if(te=0,!ce||document.hidden)return;let r=F.current,o=Y?g((t-Y)/1e3,.001,.05):1/60;Y=t,C+=o,N<1&&(N=Math.min(1,N+o/mt));let{roomDepth:l}=Ee();ft(r,l),ht(r),dt(o);let u=r.interactive&&I.inside&&!y?1:0;if(u){let f=ze(I.x,I.y);p.ready||Object.assign(p,f,{ready:!0});let n=1-Math.exp(-o/.08);p.x+=(f.x-p.x)*n,p.y+=(f.y-p.y)*n,p.z+=(f.z-p.z)*n}p.strength+=(u-p.strength)*(1-Math.exp(-o/.25)),!u&&p.strength<.01&&(p.ready=!1);for(let f=L.length-1;f>=0;f--)L[f].age+=o,L[f].age>We&&L.splice(f,1);for(let f=0;f<se;f++){let n=L[f];if(!n){ye[f]=0;continue}let H=n.age/We;Ce.set([n.x,n.y,n.z,n.age*1.15],f*4),ye[f]=Math.min(1,n.age/.05)*(1-H)*(1-H)}Le();let b=Math.abs(i.tx-i.x)+Math.abs(i.ty-i.y)+Math.abs(i.tf-i.f)>1e-4||Math.abs(i.vx)+Math.abs(i.vy)+Math.abs(i.vf)>1e-4;N<1||!y&&r.autoScan||!c.waiting||L.length>0||b||p.strength>.002||!y&&r.parallax>0&&!A.held||r.points&&!y&&c.alpha>0?te=requestAnimationFrame(_e):Y=0},R=()=>{!te&&ce&&!document.hidden&&(te=requestAnimationFrame(_e))},Pe=t=>{let r=E.getBoundingClientRect(),o=(t.clientX-r.left)/Math.max(1,r.width),l=1-(t.clientY-r.top)/Math.max(1,r.height);return{u:o,v:l,inside:o>=0&&o<=1&&l>=0&&l<=1}},Oe=t=>{let r=F.current,{u:o,v:l,inside:u}=Pe(t);I.x=o,I.y=l;let b=I.inside;I.inside=u,u?(window.clearTimeout($),$=0,!_.current?.active&&r.interactive&&!y&&we(o*2-1,l*2-1,!0),R()):b&&!$&&($=window.setTimeout(()=>{$=0,_.current?.active||(A.held=!1),R()},220),R())},Be=t=>{let r=F.current,{u:o,v:l,inside:u}=Pe(t);if(!(!u||y||r.clickEffect==="none")){if(r.clickEffect==="scan")N>=1&&De(r);else{let b=ze(o,l);L.unshift({...b,age:0}),L.length>se&&L.pop()}R()}},Ie=()=>{I.inside=!1,_.current?.active||(A.held=!1),R()},Ne=t=>{!F.current.enableGyro||_.current?.active||y||t.gamma===null||t.beta===null||(Z.ready||Object.assign(Z,{gamma:t.gamma,beta:t.beta,ready:!0}),we((t.gamma-Z.gamma)/25,(t.beta-Z.beta)/-25,!0),R())},qe=()=>{let t=F.current,r=window.DeviceOrientationEvent?.requestPermission;!t.enableGyro||Z.asked||typeof r!="function"||(Z.asked=!0,r.call(window.DeviceOrientationEvent).catch(()=>{}))},Xe=()=>{Y=0,R()},Ge=new ResizeObserver(ke);Ge.observe(E);let He=new IntersectionObserver(t=>{ce=t.some(r=>r.isIntersecting),ce&&(Y=0,R())});return He.observe(E),window.addEventListener("pointermove",Oe,{passive:!0}),window.addEventListener("pointerdown",Be,{passive:!0}),window.addEventListener("deviceorientation",Ne),window.addEventListener("click",qe),document.documentElement.addEventListener("pointerleave",Ie),document.addEventListener("visibilitychange",Xe),_.current={active:!1,move:(t,r,o)=>{y||(we(t*1.3,r*1.3,!0),i.tf=ue*g(o,.6,1.6),R())},release:()=>{i.tf=ue,A.held=!1,R()}},ke(),ge.current=R,()=>{cancelAnimationFrame(te),window.clearTimeout($),ge.current=null,_.current=null,Ge.disconnect(),He.disconnect(),window.removeEventListener("pointermove",Oe),window.removeEventListener("pointerdown",Be),window.removeEventListener("deviceorientation",Ne),window.removeEventListener("click",qe),document.documentElement.removeEventListener("pointerleave",Ie),document.removeEventListener("visibilitychange",Xe),[O,D,x,S].forEach(t=>e.deleteTexture(t.texture)),[k,G,ee].forEach(t=>e.deleteFramebuffer(t)),e.deleteVertexArray(U),[q,P,v,X].forEach(t=>e.deleteProgram(t.program)),e.getExtension("WEBGL_lose_context")?.loseContext()}},[]),K(()=>{ge.current?.()}),K(()=>{if(!pe)return;let E=Fe.current;if(!E)return;let d=!1,e=null,q=0,P=0,v={x:0,y:0,near:1,ready:!1};return Q("loading"),(async()=>{try{let U=await Tt();if(await U.nets.tinyFaceDetector.loadFromUri(Se),d)return;if(e=await navigator.mediaDevices.getUserMedia({video:{facingMode:"user",width:{ideal:640},height:{ideal:480}},audio:!1}),d){e.getTracks().forEach(x=>x.stop());return}E.srcObject=e,await E.play(),Q("searching");let O=new U.TinyFaceDetectorOptions({inputSize:224,scoreThreshold:.45}),D=async()=>{if(d)return;let x=null;try{x=await U.detectSingleFace(E,O)}catch{x=null}if(d)return;let S=_.current;if(x&&S){let k=x.box,G=E.videoWidth||1,ee=E.videoHeight||1,B=-((k.x+k.width/2)/G-.5)*2,ne=-((k.y+k.height/2)/ee-.5)*2,ie=.32/Math.max(.08,k.width/G),y=v.ready?.45:1;v.x+=(B-v.x)*y,v.y+=(ne-v.y)*y,v.near+=(ie-v.near)*y,v.ready=!0,P=0,S.active=!0,S.move(v.x,v.y,v.near),Q("tracking")}else S&&++P>12&&S.active&&(S.active=!1,v.ready=!1,S.release(),Q("searching"));q=window.setTimeout(D,40)};D()}catch{d||Q("blocked")}})(),()=>{d=!0,window.clearTimeout(q),e?.getTracks().forEach(O=>O.stop()),E.srcObject=null;let U=_.current;U?.active&&(U.active=!1,U.release())}},[pe,Se]),z("div",{ref:Ae,className:`grid-scan${Re?` ${Re}`:""}`,style:lt,...st,children:[z("canvas",{ref:Me,className:"grid-scan-canvas","aria-hidden":"true"}),pe&&z("div",{className:Te?"grid-scan-preview":"grid-scan-hidden",children:[z("video",{ref:Fe,className:"grid-scan-video",muted:!0,playsInline:!0}),Te&&z("span",{className:"grid-scan-status",children:St[ut]})]})]})},Ze=Rt;var be=document.getElementById("grid-scan-mount"),At=()=>{try{let s=document.createElement("canvas").getContext("webgl2");return s?(s.getExtension("WEBGL_lose_context")?.loseContext(),!0):!1}catch{return!1}};function Mt(){let[a,s]=le(document.documentElement.dataset.theme==="dark"),h=window.matchMedia("(max-width: 860px)").matches;return K(()=>{let m=new MutationObserver(()=>{s(document.documentElement.dataset.theme==="dark")});return m.observe(document.documentElement,{attributes:!0,attributeFilter:["data-theme"]}),()=>m.disconnect()},[]),z(Ze,{linesColor:a?"#8d7960":"#b9ad96",scanColor:a?"#ffd400":"#c21b12",cells:8,lineThickness:.8,lineStyle:"solid",depth:2.8,depthFade:.7,parallax:.7,points:!0,reflection:a?.28:.18,shading:a?.6:.4,scanDirection:"forward",scanDuration:4.8,scanDelay:2.2,scanWidth:.8,trail:.35,glow:a?.7:.4,autoScan:!0,interactive:!0,clickEffect:"ping",intro:!0,lightMode:!a,dpr:h?1.2:1.5})}be&&!window.matchMedia("(prefers-reduced-motion: reduce)").matches&&At()&&(je(z(Mt,{}),be),be.dataset.mounted="true");
