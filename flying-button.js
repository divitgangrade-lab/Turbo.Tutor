import"./island-chunks/chunk-TICLYF2Q.js";import{g as ct,i as ut,j as je,l as le,p as k}from"./island-chunks/chunk-AA5OBDBZ.js";import"./island-chunks/chunk-SSQABL5H.js";var J=1100,xt=380,bt=10,Q=J/(2*xt),gt=5,G=4,ft=.55,Qe=J*.75,Ze=.42,He={small:{h:36,px:16,fs:13,k:.82},medium:{h:44,px:22,fs:14,k:1},large:{h:52,px:26,fs:16,k:1.18},"extra-large":{h:60,px:30,fs:18,k:1.36}},We=["Copy that. The lap plan is holding together.","More downforce. Less doubt.","Telemetry says the student is ready.","We have a green flag. Repeat, green flag.","All systems nominal. Bring the practice.","The fractions are stowed and secured.","Pit wall to tutor: the plan has cleared the tower.","No cold checkout detected. Keep climbing.","Engineers confirm the wing is for cornering.","That is a clean launch. Send the next lap."],C=(t,h,E)=>Math.min(E,Math.max(h,t)),ue=(t,h)=>Number.isFinite(Number(t))&&t!==null&&t!==""?Number(t):h,ve=t=>{let h=C(t,0,1);return h*h*(3-2*h)},pt=t=>{let h=C(t,0,1);return h*h*h*(10+h*(6*h-15))},dt=t=>{let h=C(t,0,1);return 30*h*h*(1-h)*(1-h)},wt=t=>{let h=C(t,0,1);return 60*h*(1-h)*(1-2*h)},Xe=(t,h)=>Math.sin(t*1.31+h)*.5+Math.sin(t*2.73+h*1.7)*.3+Math.sin(t*5.19+h*2.3)*.2,_t=(t,h)=>Math.cos(t*1.31+h)*.655+Math.cos(t*2.73+h*1.7)*.819+Math.cos(t*5.19+h*2.3)*1.038,ht=t=>{let h=String(t||"").replace("#",""),E=h.length===3?h.replace(/(.)/g,"$1$1"):h.padEnd(6,"0").slice(0,6),W=parseInt(E,16);return Number.isFinite(W)?[(W>>16&255)/255,(W>>8&255)/255,(W&255)/255]:[1,1,1]},kt=`#version 300 es
out vec2 vUv;
void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  vUv = p;
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`,ae=`#version 300 es
precision highp float;
precision highp sampler2D;
in vec2 vUv;
out vec4 outColor;
`,et=`
uniform vec4 uJetA[${G}];
uniform vec4 uJetB[${G}];
uniform float uJetBend[${G}];
float jetWeight(vec2 p, vec4 a, vec4 b, out float along) {
  vec2 rel = p - a.xy;
  along = dot(rel, a.zw);
  vec2 off = rel - a.zw * clamp(along, 0.0, b.z);
  return exp(-dot(off, off) / (b.y * b.y)) * smoothstep(-b.y, 0.0, along);
}
`,tt=`
float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}
`,Tt=`${ae}
uniform sampler2D uVelocity;
uniform sampler2D uSource;
uniform vec2 uWorld;
uniform float uDt;
uniform float uKeep;
void main() {
  vec2 v = textureLod(uVelocity, vUv, 0.0).xy;
  if (!(abs(v.x) < 4000.0 && abs(v.y) < 4000.0)) v = vec2(0.0);
  vec4 c = textureLod(uSource, vUv - uDt * v / uWorld, 0.0) * uKeep;
  outColor = all(lessThan(abs(c), vec4(1e4))) ? c : vec4(0.0);
}`,Mt=`${ae}
uniform sampler2D uVelocity;
uniform sampler2D uDye;
uniform vec2 uWorld;
uniform float uDt;
uniform float uBuoyancy;
uniform float uLift;
uniform float uDamping;
uniform float uSpread;
uniform float uSplash;
uniform float uFriction;
uniform float uWind;
uniform vec3 uKick;
uniform vec4 uCraft;
uniform vec4 uCraftMotion;
uniform vec2 uTurb;
uniform float uTime;
uniform float uObstacle;
${et}
${tt}
vec2 curlNoise(vec2 p) {
  float e = 0.35;
  float a = noise(p + vec2(0.0, e));
  float b = noise(p - vec2(0.0, e));
  float c = noise(p + vec2(e, 0.0));
  float d = noise(p - vec2(e, 0.0));
  return vec2(a - b, d - c) / (2.0 * e);
}
void main() {
  vec2 p = vUv * uWorld;
  vec2 v = textureLod(uVelocity, vUv, 0.0).xy;
  vec2 d = textureLod(uDye, vUv, 1.0).xy;
  float smokeHere = smoothstep(0.02, 0.4, d.x + d.y);
  vec2 tq = p / uTurb.y;
  vec2 turb = curlNoise(tq + vec2(uTime * 0.21, -uTime * 0.37)) + 0.5 * curlNoise(tq * 2.3 + vec2(-uTime * 0.53, uTime * 0.29) + 7.0);
  v += turb * uTurb.x * smokeHere * uDt;
  v.y += (uBuoyancy * d.y + uLift * d.x) * uDt;
  v /= 1.0 + uDamping * uDt;
  v.x /= 1.0 + uFriction * exp(-p.y / 18.0) * uDt;
  v.x += (uWind - v.x) * (1.0 - exp(-0.35 * uDt)) * smoothstep(0.0, 60.0, p.y);
  for (int i = 0; i < ${G}; i++) {
    vec4 b = uJetB[i];
    if (b.w <= 0.0) continue;
    vec4 a = uJetA[i];
    vec2 rel = p - a.xy;
    float along = dot(rel, a.zw);
    float across = dot(rel, vec2(-a.w, a.z));
    float reach = a.w < -0.2 ? a.y / -a.w : max(b.z, 1.0);
    float bn = clamp(along / max(reach, 1.0), 0.0, 1.0);
    across -= uJetBend[i] * bn * bn;
    vec2 dir = normalize(a.zw + vec2(-a.w, a.z) * (2.0 * uJetBend[i] * bn / max(reach, 1.0)));
    float sN = clamp(along / max(b.z, 1.0), 0.0, 1.0);
    float R = b.y + uSpread * clamp(along, 0.0, b.z);
    float wr = exp(-across * across / (R * R));
    float wa = smoothstep(-b.y, 0.0, along) * (1.0 - smoothstep(0.55, 1.0, sN));
    float rate = mix(46.0, 7.0, sN);
    float w = (1.0 - exp(-uDt * rate)) * wr * wa * clamp(b.w * 3.0, 0.0, 1.0);
    float U = b.x * sqrt(b.y / R);
    v = mix(v, dir * U, w);
  }
  for (int i = 0; i < ${G}; i++) {
    vec4 b = uJetB[i];
    if (b.w <= 0.0) continue;
    vec4 a = uJetA[i];
    if (a.w > -0.2) continue;
    float reach = a.y / -a.w;
    float gx = a.x + a.z * reach - a.w * uJetBend[i];
    float near = exp(-reach / uKick.x);
    float sx = uKick.y + reach * 0.25;
    float kx = (p.x - gx) / (sx * 1.6);
    float ky = p.y / (uKick.z * 1.5);
    float k = exp(-kx * kx - ky * ky);
    float side = clamp((p.x - gx) / sx, -1.0, 1.0);
    v += uDt * uSplash * b.w * near * k * vec2(side * 0.7, 0.9);
  }
  vec2 q = p - uCraft.xy;
  float c = cos(uCraftMotion.z);
  float s = sin(uCraftMotion.z);
  vec2 lq = vec2(c * q.x + s * q.y, -s * q.x + c * q.y);
  vec2 e = abs(lq) - uCraft.zw + uCraft.w;
  float sd = length(max(e, 0.0)) + min(max(e.x, e.y), 0.0) - uCraft.w;
  float inside = smoothstep(2.0, -2.0, sd) * uObstacle;
  vec2 cv = uCraftMotion.xy + uCraftMotion.w * vec2(-q.y, q.x);
  v = mix(v, cv, inside);
  float speed = length(v);
  if (!(speed < 1e5)) v = vec2(0.0);
  else if (speed > 2600.0) v *= 2600.0 / speed;
  outColor = vec4(v, 0.0, 1.0);
}`,Ct=`${ae}
uniform sampler2D uVelocity;
uniform vec2 uTexel;
void main() {
  float L = textureLod(uVelocity, vUv - vec2(uTexel.x, 0.0), 0.0).y;
  float R = textureLod(uVelocity, vUv + vec2(uTexel.x, 0.0), 0.0).y;
  float B = textureLod(uVelocity, vUv - vec2(0.0, uTexel.y), 0.0).x;
  float T = textureLod(uVelocity, vUv + vec2(0.0, uTexel.y), 0.0).x;
  outColor = vec4(0.5 * (R - L - T + B), 0.0, 0.0, 1.0);
}`,Lt=`${ae}
uniform sampler2D uVelocity;
uniform sampler2D uCurl;
uniform vec2 uTexel;
uniform float uStrength;
uniform float uDt;
void main() {
  float L = textureLod(uCurl, vUv - vec2(uTexel.x, 0.0), 0.0).x;
  float R = textureLod(uCurl, vUv + vec2(uTexel.x, 0.0), 0.0).x;
  float B = textureLod(uCurl, vUv - vec2(0.0, uTexel.y), 0.0).x;
  float T = textureLod(uCurl, vUv + vec2(0.0, uTexel.y), 0.0).x;
  float C = textureLod(uCurl, vUv, 0.0).x;
  vec2 f = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
  f /= length(f) + 1e-4;
  f *= uStrength * C;
  f.y *= -1.0;
  vec2 v = textureLod(uVelocity, vUv, 0.0).xy + f * uDt;
  if (!(abs(v.x) < 4000.0 && abs(v.y) < 4000.0)) v = vec2(0.0);
  outColor = vec4(v, 0.0, 1.0);
}`,Et=`${ae}
uniform sampler2D uVelocity;
uniform vec2 uTexel;
void main() {
  vec2 C = textureLod(uVelocity, vUv, 0.0).xy;
  float L = textureLod(uVelocity, vUv - vec2(uTexel.x, 0.0), 0.0).x;
  float R = textureLod(uVelocity, vUv + vec2(uTexel.x, 0.0), 0.0).x;
  float B = textureLod(uVelocity, vUv - vec2(0.0, uTexel.y), 0.0).y;
  float T = textureLod(uVelocity, vUv + vec2(0.0, uTexel.y), 0.0).y;
  if (vUv.y - uTexel.y < 0.0) B = -C.y;
  outColor = vec4(0.5 * (R - L + T - B), 0.0, 0.0, 1.0);
}`,mt=`
float pressureAt(sampler2D tex, vec2 uv, vec2 texel, float c, int side) {
  if (side == 0 && uv.x - texel.x < 0.0) return 0.0;
  if (side == 1 && uv.x + texel.x > 1.0) return 0.0;
  if (side == 2 && uv.y - texel.y < 0.0) return c;
  if (side == 3 && uv.y + texel.y > 1.0) return 0.0;
  vec2 o = side == 0 ? vec2(-texel.x, 0.0) : side == 1 ? vec2(texel.x, 0.0) : side == 2 ? vec2(0.0, -texel.y) : vec2(0.0, texel.y);
  return textureLod(tex, uv + o, 0.0).x;
}
`,St=`${ae}
uniform sampler2D uPressure;
uniform sampler2D uDivergence;
uniform vec2 uTexel;
${mt}
void main() {
  float C = textureLod(uPressure, vUv, 0.0).x;
  float L = pressureAt(uPressure, vUv, uTexel, C, 0);
  float R = pressureAt(uPressure, vUv, uTexel, C, 1);
  float B = pressureAt(uPressure, vUv, uTexel, C, 2);
  float T = pressureAt(uPressure, vUv, uTexel, C, 3);
  float div = textureLod(uDivergence, vUv, 0.0).x;
  float pr = (L + R + B + T - div) * 0.25;
  outColor = vec4(abs(pr) < 1e6 ? pr : 0.0, 0.0, 0.0, 1.0);
}`,Dt=`${ae}
uniform sampler2D uPressure;
uniform sampler2D uVelocity;
uniform vec2 uTexel;
${mt}
void main() {
  float C = textureLod(uPressure, vUv, 0.0).x;
  float L = pressureAt(uPressure, vUv, uTexel, C, 0);
  float R = pressureAt(uPressure, vUv, uTexel, C, 1);
  float B = pressureAt(uPressure, vUv, uTexel, C, 2);
  float T = pressureAt(uPressure, vUv, uTexel, C, 3);
  vec2 v = textureLod(uVelocity, vUv, 0.0).xy - 0.5 * vec2(R - L, T - B);
  if (vUv.y - uTexel.y < 0.0) v.y = max(v.y, 0.0);
  if (!(abs(v.x) < 4000.0 && abs(v.y) < 4000.0)) v = vec2(0.0);
  outColor = vec4(v, 0.0, 1.0);
}`,Rt=`${ae}
uniform sampler2D uSource;
uniform vec2 uStep;
void main() {
  vec2 c = textureLod(uSource, vUv, 0.0).xy * 0.2270270;
  c += textureLod(uSource, vUv + uStep * 1.3846154, 0.0).xy * 0.3162162;
  c += textureLod(uSource, vUv - uStep * 1.3846154, 0.0).xy * 0.3162162;
  c += textureLod(uSource, vUv + uStep * 3.2307692, 0.0).xy * 0.0702703;
  c += textureLod(uSource, vUv - uStep * 3.2307692, 0.0).xy * 0.0702703;
  outColor = vec4(c, 0.0, 1.0);
}`,Nt=`${ae}
uniform sampler2D uSource;
uniform float uScale;
void main() {
  outColor = textureLod(uSource, vUv, 0.0) * uScale;
}`,Ut=`${ae}
uniform sampler2D uVelocity;
uniform sampler2D uSource;
uniform vec2 uWorld;
uniform float uDt;
uniform vec2 uKeep;
uniform vec4 uRate;
uniform vec4 uCol;
uniform vec3 uKick;
uniform float uDisperse;
uniform float uDispV;
uniform vec4 uCraft;
uniform vec4 uCraftMotion;
uniform vec2 uGap;
uniform float uJetX[${G}];
uniform float uJetN;
uniform float uFloor;
uniform float uTime;
${et}
${tt}
void main() {
  vec2 v = textureLod(uVelocity, vUv, 0.0).xy;
  vec2 val = textureLod(uSource, vUv - uDt * v / uWorld, 0.0).xy * uKeep;
  val.x *= exp(-uDisperse * max(length(v) - uDispV, 0.0) * 0.01 * uDt);
  {
    vec2 q = vUv * uWorld - uCraft.xy;
    float c = cos(uCraftMotion.z);
    float sn = sin(uCraftMotion.z);
    vec2 lq = vec2(c * q.x + sn * q.y, -sn * q.x + c * q.y);
    float belly = uCraft.y - uCraft.w - 7.0;
    float depth = 0.68 * belly * smoothstep(40.0, 110.0, belly);
    float below = -lq.y - uCraft.w;
    float wy = smoothstep(-4.0, 6.0, below) * (1.0 - smoothstep(depth * 0.7, depth, below));
    float nearest = 1e4;
    float outer = 0.0;
    for (int k = 0; k < ${G}; k++) {
      if (float(k) >= uJetN) break;
      nearest = min(nearest, abs(lq.x - uJetX[k]));
      outer = max(outer, abs(uJetX[k]));
    }
    float wx = uGap.x > 1.0 ? smoothstep(uGap.x * 0.22, uGap.x * 0.4, nearest) * (1.0 - smoothstep(outer - uGap.x * 0.1, outer, abs(lq.x))) : 0.0;
    val.x *= exp(-uGap.y * wx * wy * uDt);
  }
  val.x = max(val.x - uFloor * uDt, 0.0);
  vec2 p = vUv * uWorld;
  for (int i = 0; i < ${G}; i++) {
    vec4 jb = uJetB[i];
    if (jb.w <= 0.0) continue;
    vec4 ja = uJetA[i];
    vec2 rel = p - ja.xy;
    float along = dot(rel, ja.zw);
    float across = dot(rel, vec2(-ja.w, ja.z));
    vec2 off = rel - ja.zw * clamp(along, 0.0, 6.0);
    float wn = exp(-dot(off, off) / (jb.y * jb.y)) * smoothstep(-jb.y, 0.0, along);
    float pulse = 0.6 + 0.8 * noise(vec2(uTime * 6.0 + float(i) * 13.1, along * 0.06 + float(i)));
    val.x += uRate.x * jb.w * wn * pulse * uDt;
    val.y += uRate.y * jb.w * wn * uDt;
    float reach = ja.w < -0.2 ? ja.y / -ja.w : 1e4;
    float sN = clamp(along / max(reach, 1.0), 0.0, 1.0);
    across -= uJetBend[i] * sN * sN;
    float R = uCol.y + uCol.x * clamp(along, 0.0, reach);
    float wc = exp(-across * across / (R * R)) * smoothstep(0.45, 0.8, sN) * (1.0 - step(reach + 2.0, along));
    float grain = 0.45 + 1.1 * noise(vec2(across * 0.12 + float(i) * 3.0, along * 0.05 - uTime * 9.0));
    val.x += uRate.w * jb.w * wc * grain * uDt;
    val.y += uRate.y * 0.25 * jb.w * wc * uDt;
    if (reach < 1e3) {
      float gx = ja.x + ja.z * reach - ja.w * uJetBend[i];
      float near = exp(-reach / uKick.x);
      float spread = uKick.y + reach * 0.25;
      float kx = (p.x - gx) / spread;
      float ky = p.y / uKick.z;
      float k = exp(-kx * kx - ky * ky);
      float g2 = 0.5 + noise(vec2(p.x * 0.08, uTime * 4.0 + float(i) * 9.0));
      val.x += uRate.z * jb.w * near * k * g2 * uDt;
      val.y += uRate.y * 0.4 * jb.w * near * k * uDt;
    }
  }
  if (!(val.x < 1e3 && val.y < 1e3 && val.x >= 0.0 && val.y >= 0.0)) val = vec2(0.0);
  outColor = vec4(val, 0.0, 1.0);
}`,At=`${ae}
uniform sampler2D uDye;
uniform vec2 uWorld;
uniform vec2 uDyeSize;
uniform float uTime;
uniform float uLightTheme;
uniform vec3 uSmoke;
uniform vec3 uShade;
uniform vec3 uThrust;
uniform vec4 uLook;
uniform vec4 uLook2;
uniform vec4 uLook3;
uniform vec4 uCol;
uniform float uGamma;
uniform float uTone;
uniform vec3 uLight2;
uniform float uThreshold;
uniform float uScale;
uniform vec4 uCraft;
uniform vec4 uCraftMotion;
${et}
${tt}
float dens(vec2 p, float lod) {
  return textureLod(uDye, p / uWorld, lod).x;
}
float hash1(float n) {
  return fract(sin(n * 127.1) * 43758.5453);
}
float fbm2(vec2 p) {
  return noise(p) * 0.65 + noise(p * 2.13 + 17.0) * 0.35;
}
float flowNoise(float q, float xn, float t, float id, float rate) {
  float c = t / 0.7;
  float f1 = fract(c);
  float f2 = fract(c + 0.5);
  float k1 = floor(c);
  float k2 = floor(c + 0.5);
  float n1 = fbm2(vec2(q - f1 * 0.7 * rate + hash1(k1 + id * 7.0) * 41.0, xn * 1.15 + id * 3.7));
  float n2 = fbm2(vec2(q - f2 * 0.7 * rate + hash1(k2 + id * 7.0 + 0.5) * 41.0, xn * 1.15 + id * 3.7 + 11.0));
  float w1 = 1.0 - abs(2.0 * f1 - 1.0);
  float w2 = 1.0 - w1;
  return 0.5 + (n1 * w1 + n2 * w2 - 0.5) / sqrt(w1 * w1 + w2 * w2);
}
float column(vec2 p, vec4 a, float str, float id, float t, float bend, out float xn, out float s) {
  vec2 rel = p - a.xy;
  s = dot(rel, a.zw);
  float x = dot(rel, vec2(-a.w, a.z));
  float S = a.w < -0.2 ? a.y / -a.w : 1e4;
  float bn = clamp(s / max(S, 1.0), 0.0, 1.0);
  x -= bend * bn * bn;
  xn = 0.0;
  if (s < -4.0 || s > S + 6.0) return 0.0;
  float sc = clamp(s, 0.0, S);
  float R = uCol.y + uCol.x * sc;
  float flare = smoothstep(S - 32.0 * uScale, S + 2.0, sc);
  R *= 1.0 + 1.3 * flare * flare;
  xn = x / R;
  if (abs(xn) > 3.2) return 0.0;
  float q = log(1.0 + 0.22 * sc / (9.0 * uScale)) / 0.22;
  float lam = 9.0 * uScale + 0.22 * sc;
  float U = uCol.w * sqrt(str) * sqrt(uCol.y / R);
  float n = flowNoise(q, xn, t, id, U / lam);
  float amp = 0.12 + 0.5 * smoothstep(4.0, 70.0, sc);
  float u = abs(xn) * (1.0 - amp * (n - 0.5) * 1.8);
  float prof = exp(-u * u * 1.7);
  float dil = pow(uCol.y / R, 0.5);
  float onset = smoothstep(2.0 * uScale, 16.0 * uScale, s);
  float tail = 1.0 - smoothstep(S - 2.0, S + 6.0, s);
  return uCol.z * str * prof * dil * onset * tail * (0.7 + 0.6 * n);
}
float shape(vec2 p, float lod) {
  return log(1.0 + 3.0 * dens(p, lod));
}
void main() {
  vec2 p = vUv * uWorld;
  float texel = uWorld.x / uDyeSize.x;
  float D = textureLod(uDye, vUv, uLook.w).x;
  float heat = textureLod(uDye, vUv, 0.5).y;

  float e = uLook3.x;
  float lodN = max(log2(e / texel), 0.0) + uLook3.y;
  vec2 g = vec2(shape(p + vec2(e, 0.0), lodN) - shape(p - vec2(e, 0.0), lodN), shape(p + vec2(0.0, e), lodN) - shape(p - vec2(0.0, e), lodN)) / (2.0 * e);
  float e2 = e * 3.0;
  float lodB = lodN + 1.6;
  vec2 g2 = vec2(shape(p + vec2(e2, 0.0), lodB) - shape(p - vec2(e2, 0.0), lodB), shape(p + vec2(0.0, e2), lodB) - shape(p - vec2(0.0, e2), lodB)) / (2.0 * e2);
  vec3 nS = normalize(vec3(-(g * uLook3.z + g2 * uLook3.w) * uLook.y, 1.0));

  float colD = 0.0;
  vec2 colN = vec2(0.0);
  float colHot = 0.0;
  float colNear = 0.0;
  for (int i = 0; i < ${G}; i++) {
    vec4 jb = uJetB[i];
    if (jb.w <= 0.0) continue;
    vec4 ja = uJetA[i];
    float xn;
    float sa;
    float cd = column(p, ja, min(jb.w, 1.6), float(i), uTime, uJetBend[i], xn, sa);
    colD += cd;
    colN += vec2(-ja.w, ja.z) * clamp(xn, -1.6, 1.6) * cd;
    colHot += cd * exp(-max(sa, 0.0) / 45.0);
    colNear += cd * exp(-max(sa, 0.0) / 16.0);
  }
  float Dt = D + colD;
  float alpha = 1.0 - exp(-uLook.x * pow(max(D - uThreshold, 0.0) + colD, uGamma));
  vec2 cn = colD > 1e-5 ? colN / colD : vec2(0.0);
  vec3 nC = normalize(vec3(cn * 0.85, sqrt(max(1.0 - dot(cn, cn) * 0.72, 0.08))));
  float wC = colD / max(Dt, 1e-5);
  vec3 n = normalize(mix(nS, nC, wC));
  vec3 L = normalize(vec3(-0.38, 0.6, 0.72));
  float diff = clamp((dot(n, L) + uLook2.z) / (1.0 + uLook2.z), 0.0, 1.0);

  vec2 ld = normalize(L.xy);
  float tau = 0.0;
  float dist = 2.0;
  float stepLen = 3.0;
  for (int i = 0; i < 9; i++) {
    float lod = max(log2(stepLen / texel), 0.0);
    tau += dens(p + ld * dist, lod) * stepLen;
    dist += stepLen;
    stepLen *= 1.4;
  }
  float sun = mix(exp(-uLook.z * tau), 1.0, wC * 0.6);
  float ao = mix(exp(-uLook2.w * dens(p, 4.5)), 1.0, wC);

  vec3 amb = vec3(0.84, 0.88, 1.0) * uLook2.x;
  vec3 key = vec3(1.0, 0.985, 0.96) * uLook2.y;
  vec3 lit = amb * ao + key * sun * diff;

  vec3 jl = vec3(0.0);
  vec3 core = vec3(0.0);
  for (int i = 0; i < ${G}; i++) {
    vec4 jb = uJetB[i];
    if (jb.w <= 0.0) continue;
    vec4 ja = uJetA[i];
    vec2 rel = p - ja.xy;
    float along = dot(rel, ja.zw);
    float across = dot(rel, vec2(-ja.w, ja.z));
    float str = min(jb.w, 1.6);
    float flick = 0.9 + 0.2 * noise(vec2(uTime * 38.0, float(i) * 5.0));
    float len = (8.0 + 12.0 * str) * flick * uScale;
    float sN = along / len;
    float wid = 3.2 * uScale * (0.9 - 0.5 * clamp(sN, 0.0, 1.0)) + 0.3;
    float radial = exp(-across * across / (wid * wid));
    float axial = smoothstep(-0.12, 0.04, sN) * pow(clamp(1.0 - sN, 0.0, 1.0), 1.5);
    float c = radial * axial * str;
    core += mix(uThrust, vec3(1.0), smoothstep(0.25, 0.9, c)) * c * 1.3;
    float d = length(rel - ja.zw * clamp(along, 0.0, len));
    core += uThrust * str * (0.22 * exp(-d / (5.0 * uScale)) + 0.06 * exp(-d / (18.0 * uScale)));
    jl += uThrust * str * uLight2.x * (exp(-d / (30.0 * uScale)) + 0.45 * exp(-d / (100.0 * uScale)));
  }

  vec3 jlNear = jl * 0.35 + uThrust * colNear / max(Dt, 1e-4) * 0.9;
  jl += uThrust * colHot / max(Dt, 1e-4) * 0.9;
  if (uLightTheme > 0.5) {
    float shade = dot(lit + jl * 0.8, vec3(0.3333)) * uLight2.z;
    vec3 ink = mix(uShade, uSmoke, smoothstep(0.15, 1.2, shade));
    alpha = 1.0 - pow(1.0 - alpha, 1.25);
    ink = mix(ink, uThrust, clamp(dot(jlNear, vec3(0.3333)) * 0.5, 0.0, 0.3));
    float ca = clamp(max(core.r, max(core.g, core.b)) * 0.85, 0.0, 1.0);
    vec3 coreInk = mix(uThrust, vec3(1.0), 0.35 * smoothstep(0.7, 1.0, ca));
    vec3 lc = ink * alpha * (1.0 - ca) + coreInk * ca;
    float la = alpha + ca * (1.0 - alpha);
    outColor = vec4(lc, la);
    return;
  }
  vec3 smoke = uSmoke * (lit + jl) * uLight2.z;
  smoke = mix(smoke / (1.0 + 0.35 * max(smoke - 0.8, 0.0)), 1.0 - exp(-smoke * 1.35), uTone);
  vec3 emit = mix(uThrust, vec3(1.0), 0.5) * heat * heat * uLight2.y;
  vec3 col = (smoke + emit) * alpha + core;
  float a = clamp(max(alpha, max(col.r, max(col.g, col.b))), 0.0, 1.0);
  col = min(col, vec3(a));
  col += (hash(gl_FragCoord.xy + fract(uTime) * 61.0) - 0.5) / 255.0 * a;
  outColor = vec4(max(col, 0.0), a);
}`,Je={colSpread:.1,colR:3.6,colD:1.25,colU:420,splash:400,friction:5,disperse:.6,dispV:60,gap:10,wind:8,turb:350,turbScale:34,jetLight:.3,threshold:.035,blur:3,emit:0,exposure:1.3,tone:1,gamma:.6,kickNear:45,kickW:18,kickH:14,vort:6,spread:.1,floor:.02,keepD:.3,keepIdle:.45,keepH:1.6,rateN:0,rateH:6,rateK:20,rateC:3,buoy:330,lift:22,damp:.55,radius:6,speed:380,reach:.9,forceMax:240,alphaK:4,relief:9,shadow:.026,alphaLod:0,ambient:.58,key:.82,wrap:.35,ao:.35,normalE:3,normalLod:-.8,fine:.35,broad:.9,iters:20};function jt({root:t,canvas:h,button:E,cursor:W,ramp:N,props:M}){let Z=h.getContext("webgl2",{alpha:!0,premultipliedAlpha:!0,antialias:!1,depth:!1,stencil:!1,powerPreference:"high-performance"}),ne=typeof window<"u"&&window.matchMedia?window.matchMedia("(prefers-reduced-motion: reduce)"):null,e={W:0,H:0,dpr:1,bw:0,bh:0,x:0,vx:0,y:-Q,vy:0,th:0,w:0,fvx:0,fvy:0,thrust:[0,0,0,0],delay:[0,0,0,0],phase:"rest",pt:0,clock:0,seed:Math.random()*100,wind:1,alt:160,climbT:1.6,y0:0,vrPrev:0,hold:2.4,xRef:0,landX:0,boost:!1,contact:!0,placed:!1,track:null,back:null,flip:null,rampKey:"",rampGeo:null,strip:null,u:0,v:0,target:{x:0,y:0},pointer:{in:!1,x:0,y:0,type:"mouse"},off:{x:0,y:0},attached:!1,hover:!1,armed:!0,carry:!1,pressed:!1,press:null,drag:null,suppress:!1,lastC:null,lastTh:0,quiet:0,running:!1,last:0,raf:0,simTime:0,activity:0},B=null;if(Z&&(Z.getExtension("EXT_color_buffer_float")||Z.getExtension("EXT_color_buffer_half_float")))try{B=zt(Z)}catch{B=null}let c=()=>!!(ne&&ne.matches),X=()=>(He[M.current.size]||He.medium).k,I=()=>gt*X(),Te=()=>C(Math.round(ue(M.current.jets,2)),1,G),ee=()=>{let o=Te();if(o===1)return[0];let a=e.bw*(o===2?.3:.34);return Array.from({length:o},(n,s)=>a*(2*s/(o-1)-1))},Me=()=>{let o=ee();return o.length>1?[o[0],o[o.length-1]]:[-.3*e.bw,.3*e.bw]},F=()=>e.thrust[0]+e.thrust[1]+e.thrust[2]+e.thrust[3],ze=()=>e.phase==="ignite"||e.phase==="climb"||e.phase==="hover"||e.phase==="descend"||e.phase==="drag",Ce=()=>e.phase==="drive"||e.phase==="loop"||e.phase==="flip"||e.phase==="return",ce=()=>[e.bw/2+4,Math.max(e.bw/2+4,e.W-e.bw/2-4)],te=()=>!!M.current.ramp,v=()=>{let o=I()+e.bh/2,a=`${e.W}|${e.H}|${e.bw}|${o}`;if(e.rampKey===a&&e.rampGeo)return e.rampGeo;let n=Math.max(e.H*.24,I()+e.bh+40),s=1/n,f=n*.4,u=n*Math.PI/2-f,x=(D,R)=>{let q=[[f,0,s],[u,s,s],[f,s,0],[D,0,0],[f,0,s],[u,s,s],[f,s,0],[R,0,0]],A={ss:[0],xs:[0],ys:[0],ps:[0],ks:[0]},H=0,K=0,O=0,fe=0;return q.forEach(([pe,_e,Re])=>{let me=Math.max(1,Math.round(pe/1.5)),de=pe/me;for(let ye=0;ye<me;ye+=1){let Ne=_e+(Re-_e)*((ye+.5)/me),Ue=O+Ne*de/2;H+=Math.cos(Ue)*de,K+=Math.sin(Ue)*de,O+=Ne*de,fe+=de,A.ss.push(fe),A.xs.push(H),A.ys.push(K),A.ps.push(O),A.ks.push(_e+(Re-_e)*((ye+1)/me))}}),A},_=x(0,0),y=Math.max(0,e.H*.66-Math.max(..._.ys)),L=x(y,Math.max(48,e.W*.16)),w=C(n*.12,8,16),S=e.W-Math.max(18,e.W*.05)-w-Math.max(...L.xs),U=L.xs.map(D=>D+S),$=L.ss.length-1,m=L.ys.findIndex(D=>D>3),l=m<0?U[$]:U[m],T={...L,xs:U,r:n,T:w,x0:S,foot:l,S:L.ss[$],clear:Math.min(l,U[$])-12,ok:Math.max(...L.ys)+w<e.H-8};return e.rampKey=a,e.rampGeo=T,T},d=()=>{let[o,a]=ce();if(!te())return C(e.W/2,o,a);let n=v();return C(Math.min(n.foot*.5,n.x0-90,n.clear-e.bw/2-40),o,a)},r=()=>({x:e.x,y:I()+e.bh/2+e.y+Q}),p=()=>{let o=r(),a=Math.cos(e.th),n=Math.sin(e.th),s=M.current.thrusters?-(e.bh/2+I())+1:-(e.bh/2)+2;return ee().map(f=>({x:o.x+f*a-s*n,y:o.y+f*n+s*a,dx:n,dy:-a}))},b=()=>{let o=r();return{x:o.x,y:e.H-o.y}},P=(o,a,n,s,f,u,x)=>{let _=f[0]-u[0],y=x[0]-u[0],L=s[0]-f[0]+u[0]-x[0],w=f[1]-u[1],S=x[1]-u[1],U=s[1]-f[1]+u[1]-x[1],$=_*S-y*w||1e-6,m=(L*S-y*U)/$,l=(_*U-L*w)/$,T=f[0]-s[0]+m*f[0],D=x[0]-s[0]+l*x[0],R=f[1]-s[1]+m*f[1],q=x[1]-s[1]+l*x[1],A=s[0]-T*o/a,H=s[1]-R*o/a;return Math.abs(m)<1e-7&&Math.abs(l)<1e-7?`matrix(${[T/a,R/a,D/n,q/n,A,H].map(O=>O.toFixed(6)).join(",")})`:`matrix3d(${[T/a,R/a,0,m/a,D/n,q/n,0,l/n,0,0,1,0,A,H,0,1-m*o/a].map(O=>O.toFixed(6)).join(",")})`},j=()=>{e.strip&&(e.strip.wrap.remove(),e.strip.ink.remove(),e.strip=null,E.style.visibility="")},Y=()=>{j();let o=e.track;if(!o)return;let a=o.geo,n=I()+e.bh/2,s=[0];for(let m=1;m<a.ss.length;m+=1){let l=(a.ks[m]+a.ks[m-1])/2;s.push(s[m-1]+(a.ss[m]-a.ss[m-1])*Math.max(1-l*n,.2))}let f=C(Math.round(e.bw/8),8,32),u=document.createElement("div");u.setAttribute("aria-hidden","true"),u.style.cssText="position:absolute;inset:0;z-index:1;pointer-events:none";let x=document.createElement("div");x.setAttribute("aria-hidden","true"),x.style.cssText="position:absolute;inset:0;z-index:2;pointer-events:none;will-change:transform";let _=Array.from(E.children),y=_[1],L=_.slice(2).map(m=>{let l=m.cloneNode(!0);return l.style.left="0px",l.style.top="0px",l.style.transformOrigin="0 0",u.appendChild(l),{el:l,x:m.offsetLeft,y:m.offsetTop+m.offsetHeight/2,k:1}}),w=[];for(let m=0;m<f;m+=1){let l=E.cloneNode(!0);l.removeAttribute("data-hover"),l.removeAttribute("data-pressed"),l.setAttribute("tabindex","-1"),l.setAttribute("inert",""),Array.from(l.children).slice(1).forEach(R=>{R.style.visibility="hidden"});let T=e.bw*m/f-(m?.75:2),D=e.bw*(m+1)/f+(m<f-1?.75:2);l.style.visibility="visible",l.style.transformOrigin="0 0",l.style.clipPath=`polygon(${T}px -2px, ${D}px -2px, ${D}px ${e.bh+2}px, ${T}px ${e.bh+2}px)`,u.appendChild(l),w.push(l)}let S=[],U=y&&y.textContent||"",$=document.createElement("canvas").getContext("2d");if(y&&$&&U.trim()&&!y.children.length){let m=getComputedStyle(y),l=`${m.fontStyle} ${m.fontWeight} ${m.fontSize} ${m.fontFamily}`;$.font=l;let T=Array.from(U),D=A=>$.measureText(T.slice(0,A).join("")).width,R=D(T.length)||1,q=y.offsetTop+y.offsetHeight/2;T.forEach((A,H)=>{let K=document.createElement("span");K.textContent=A,K.style.cssText=`position:absolute;left:0;top:0;white-space:pre;line-height:1;transform-origin:0 0;font:${l};color:${m.color}`,x.appendChild(K),S.push({el:K,x:y.offsetLeft+(D(H)+D(H+1))/2*(y.offsetWidth/R),y:q,k:.5})})}else if(y){let m=y.cloneNode(!0);m.style.position="absolute",m.style.left="0px",m.style.top="0px",m.style.transformOrigin="0 0",x.appendChild(m),S.push({el:m,x:y.offsetLeft+y.offsetWidth/2,y:y.offsetTop+y.offsetHeight/2,k:0})}t.appendChild(u),t.appendChild(x),E.style.visibility="hidden",e.strip={wrap:u,ink:x,parts:w,n:f,sn:s,pods:L,items:S}},Le=()=>{let o=e.strip,a=e.track;if(!o||!a)return;let n=a.geo,s=n.ss[n.ss.length-1],f=o.sn[o.sn.length-1],u=(l,T,D)=>{let R=0,q=l.length-1;for(;q-R>1;){let A=R+q>>1;l[A]<=D?R=A:q=A}return T[R]+(T[q]-T[R])*((D-l[R])/(l[q]-l[R]))},x=l=>l<=0?l:l>=s?f+l-s:u(n.ss,o.sn,l),_=l=>l<=0?l:l>=f?s+l-f:u(o.sn,n.ss,l),y=x(e.u),L=I(),w=(l,T)=>{let[D,R,q]=Fe(n,_(y+l-e.bw/2)),A=L+e.bh-T;return[D-Math.sin(q)*A,e.H-R-Math.cos(q)*A,q]},S=(l,T,D,R)=>{l.style.transform=`translate(${T.toFixed(2)}px, ${D.toFixed(2)}px) rotate(${(-R).toFixed(4)}rad) translate(-50%, -50%)`},U=e.bw/o.n,$=[],m=[];for(let l=0;l<=o.n;l+=1)$.push(w(l*U,0)),m.push(w(l*U,e.bh));o.parts.forEach((l,T)=>{l.style.transform=P(T*U,U,e.bh,$[T],$[T+1],m[T+1],m[T])}),o.pods.forEach(l=>{let[T,D,R]=w(l.x,l.y);S(l.el,T,D,R)}),o.items.forEach(l=>{let[T,D,R]=w(l.x,l.y),[q,A,H]=w(e.bw/2,l.y),K=l.x-e.bw/2,O=q+Math.cos(H)*K,fe=A-Math.sin(H)*K;S(l.el,O+(T-O)*l.k,fe+(D-fe)*l.k,H+(R-H)*l.k)})},ge=()=>{e.strip&&Le();let o=r(),a=o.x-e.bw/2,n=e.H-o.y-e.bh/2;E.style.transform=`translate3d(${a.toFixed(2)}px, ${n.toFixed(2)}px, 0) rotate(${(-e.th).toFixed(5)}rad)`,t.style.setProperty("--fly-thrust",C(F()*.9,0,1.2).toFixed(3))},Ee=()=>{if(!N)return;let o=v(),a=N.querySelectorAll("path"),n=a[0],s=a[1],f=x=>x.toFixed(1),u=x=>{let _=[];for(let L=0;L<o.ss.length;L+=2){let w=o.ps[L];_.push(`${f(o.xs[L]+Math.sin(w)*x)} ${f(e.H-o.ys[L]+Math.cos(w)*x)}`)}let y=o.ps[o.ss.length-1];return _.push(`${f(o.xs[o.ss.length-1]+Math.sin(y)*x)} ${f(e.H-o.ys[o.ss.length-1]+Math.cos(y)*x)}`),`M ${_.join(" L ")}`};N.setAttribute("viewBox",`0 0 ${f(e.W)} ${f(e.H)}`),N.style.visibility=o.ok?"":"hidden",n&&(n.setAttribute("d",u(o.T/2)),n.setAttribute("stroke-width",f(o.T))),s&&s.setAttribute("d",u(.75))},Be=o=>{let a=new Float32Array(G*4),n=new Float32Array(G*4),s=[0,0,0,0],f=o.length,u=Je,x=X();return o.forEach((_,y)=>{let L=C(e.thrust[y]*f,0,2),w=_.dy<-.2?_.y/-_.dy:u.forceMax;a.set([_.x,_.y,_.dx,_.dy],y*4),n.set([u.speed*Math.sqrt(L),u.radius*x,Math.min(u.forceMax,w*u.reach),L>.004?L:0],y*4);let S=e.fvx*-_.dy+e.fvy*_.dx;s[y]=C(-S*.22,-.55*w,.55*w)}),{a,b:n,bend:s}},re=o=>{if(!B)return;let a=M.current,n=p(),s=Be(n),f=r(),u=ee(),x=X(),_=[f.x,f.y,e.bw/2,e.bh/2],y=[e.vx,e.vy,e.th,e.w],L=(1-ve((Math.abs(e.fvx)-40)/100))*(1-ve((Math.abs(e.th)-.1)/.2))*(Ce()?0:1);o>0&&(e.simTime+=o,B.step(o,{jets:s,craft:_,motion:y,calm:L,scale:x,activity:e.activity,jetX:[0,1,2,3].map(S=>S<u.length?u[S]:0),jetN:u.length,spacing:u.length>1?u[1]-u[0]:0,wind:e.wind*Je.wind,time:e.simTime,smoke:C(ue(a.smoke,1),0,3),turbulence:C(ue(a.turbulence,1),0,3)}));let w=ht(a.smokeColor);B.render(h.width,h.height,{jets:s,craft:_,motion:y,scale:x,activity:e.activity,time:e.simTime,light:a.theme==="light",smokeColor:w,shadeColor:w.map((S,U)=>S*.74+[0,.012,.045][U]),thrustColor:ht(a.thrustColor)})},we=()=>{let o=t.getBoundingClientRect(),a=e.W;if(e.W=Math.max(1,o.width),e.H=Math.max(1,o.height),e.bw=E.offsetWidth,e.bh=E.offsetHeight,e.placed?a>0&&a!==e.W&&(e.x*=e.W/a):(e.x=d(),e.placed=!0),!Ce()){let[f,u]=ce();e.x=C(e.x,f,u)}e.dpr=Math.min(window.devicePixelRatio||1,1);let n=Math.round(e.W*e.dpr),s=Math.round(e.H*e.dpr);(h.width!==n||h.height!==s)&&(h.width=n,h.height=s),B&&B.resize(e.W,e.H),Ee(),t.dataset.ready="",ge(),e.running||re(0)},he=(o,a,n=0)=>{let s=b(),f=e.th,u=o-s.x,x=a-s.y,_=u*Math.cos(f)-x*Math.sin(f),y=u*Math.sin(f)+x*Math.cos(f);return Math.abs(_)<=e.bw/2+2+n&&y>=-e.bh/2-2-n&&y<=e.bh/2+I()+n},Se=()=>{e.pt=0,e.armed=!1,e.seed=Math.random()*100,e.wind=Math.random()<.5?-1-Math.random():1+Math.random(),e.vrPrev=0,e.quiet=0,e.boost=!1},xe=()=>{if(e.phase!=="rest"||c())return!1;let o=M.current;Se(),e.phase="ignite",e.delay=e.delay.map(()=>Math.random()*.07);let a=e.H-e.bh-I()-30-Q;return e.alt=C(e.y+ue(o.altitude,170),e.y+24,Math.max(e.y+24,a)),e.climbT=1.15+(e.alt-e.y)/420,e.hold=Math.max(0,ue(o.hoverTime,2.4)),e.xRef=e.x,M.current.onLaunch?.(),ie(),!0},Fe=(o,a)=>{if(a<=0)return[o.x0+a,0,0,0];let n=0,s=o.ss.length-1;if(a>=o.ss[s]){let u=o.ps[s];return[o.xs[s]+Math.cos(u)*(a-o.ss[s]),o.ys[s]+Math.sin(u)*(a-o.ss[s]),u,0]}for(;s-n>1;){let u=n+s>>1;o.ss[u]<=a?n=u:s=u}let f=(a-o.ss[n])/(o.ss[s]-o.ss[n]);return[o.xs,o.ys,o.ps,o.ks].map(u=>u[n]+(u[s]-u[n])*f)},Pe=(o,a)=>{let[n,s,f,u]=Fe(o.geo,a);return{x:n-Math.sin(f)*o.base,cy:s+Math.cos(f)*o.base,th:f,bend:u*o.base}},$e=()=>{if(e.phase!=="rest"||c()||!te())return!1;let o=v(),a=o.x0-e.x;if(a<60||!o.ok)return xe();Se();let n=I()+e.bh/2,s=Math.max(...o.ys)-2*n,f=Math.sqrt(2*Qe*s+2.2*Qe*(o.r-n));return e.track={geo:o,base:n,v0:f,acc:f*f/(2*a)},e.phase="drive",e.u=-a,e.v=0,e.thrust=[0,0,0,0],Y(),ie(),!0},se=o=>{let[a,n]=ce(),s=e.x+o;te()&&(s=Math.min(s,v().clear-e.bw/2)),e.landX=C(s,a,n)},Ge=o=>{let a=M.current,n=C(ue(a.wobble,1),0,3);if(e.pt+=o,e.clock+=o,e.phase==="return"){let i=e.back,g=Math.min(e.pt/i.time,1);e.x=i.from+(i.to-i.from)*pt(g),e.vx=(i.to-i.from)*dt(g)/i.time,e.y=-Q,e.vy=0,e.th=0,e.w=0,g>=1&&(e.phase="rest",e.pt=0,e.vx=0);return}if(e.phase==="drive"||e.phase==="loop"){let i=e.track,g=Pe(i,e.u);e.phase==="drive"?e.v=Math.min(i.v0,e.v+i.acc*o):e.v=Math.sqrt(Math.max(i.v0*i.v0-2*Qe*(g.cy-i.base),.2*i.v0*i.v0)),e.u+=e.v*o/Math.max(1-g.bend,.25),e.phase==="drive"&&e.u>=0&&(e.phase="loop");let z=Pe(i,e.u);e.vx=(z.x-g.x)/o,e.vy=(z.cy-g.cy)/o,e.w=(z.th-g.th)/o,e.x=z.x,e.y=z.cy-I()-e.bh/2-Q,e.th=z.th,e.thrust=e.thrust.map(oe=>oe*Math.exp(-o/.1)),e.phase==="loop"&&e.u>=i.geo.S&&(j(),e.phase="flip",e.pt=0,e.flip={th:e.th,w:e.w});return}let s=(e.bw*e.bw+e.bh*e.bh)/12,f=Math.max(Math.cos(e.th),.5),u=0,x=!1,_=e.xRef,y=3,L=3.6,w=null;if(e.phase==="flip"){let i=Math.min(e.pt/Ze,1),g=e.flip,z=Math.PI*2;w={th:(2*i*i*i-3*i*i+1)*g.th+(i*i*i-2*i*i+i)*Ze*g.w+(3*i*i-2*i*i*i)*z,w:(6*i*i-6*i)*(g.th-z)/Ze+(3*i*i-4*i+1)*g.w},u=2.4*ve((Math.cos(w.th)-.8)/.15);let oe=e.y+Q<e.bh*.6;(i>=1||oe)&&(w=null,e.th-=Math.PI*2*Math.round(e.th/(Math.PI*2)),e.phase="descend",e.pt=0,e.boost=!0,e.vrPrev=e.vy,se(e.vx*Math.abs(e.vx)/700))}if(e.phase==="ignite"&&(u=.9*ve(e.pt/.5),e.pt>=.5&&(e.phase="climb",e.pt=0,e.y0=e.y)),e.phase==="climb"){let i=e.pt/e.climbT,g=e.alt-e.y0,z=e.y0+g*pt(i),oe=g*dt(i)/e.climbT,ke=g*wt(i)/(e.climbT*e.climbT);u=(J+ke+30*(z-e.y)+8*(oe-e.vy))/(J*f),x=!0,i>=1&&(e.phase="hover",e.pt=0)}else if(e.phase==="hover"){let i=e.clock*.8,g=e.alt+3.5*n*Xe(i,e.seed),z=3.5*n*.8*_t(i,e.seed);u=(J+30*(g-e.y)+8*(z-e.vy))/(J*f),x=!0,e.pt>=e.hold&&(e.phase="descend",e.pt=0,e.vrPrev=0,se(0))}else if(e.phase==="drag"){let i=e.target.y-I()-e.bh/2-Q;u=(J+34*(i-e.y)-10*e.vy)/(J*f),x=!0}else if(e.phase==="descend"){_=e.landX,y=e.boost?5:4,L=e.boost?4.6:4.2;let i=170,g=32,z=e.boost?ve((Math.abs(e.landX-e.x)-20)/40):ve((Math.abs(e.landX-e.x)-3)/23),oe=Math.max(e.y+Q,0),ke=(g+(i-g)*(1-Math.exp(-oe/52)))*(1-(e.boost?.45:.88)*z),Ye=e.boost?i*3:i*ve(e.pt/.9)+1,Ae=-Math.min(ke,Ye),Ve=C((Ae-e.vrPrev)/Math.max(o,1e-4),-600,600);e.vrPrev=Ae,u=(J+Ve+(e.boost?9:7)*(Ae-e.vy))/(J*f),x=!0,e.contact&&e.pt>.3&&(e.phase="landed",e.pt=0,e.boost=!1)}else if(e.phase==="landed"&&(u=0,e.pt>.6&&F()<.03)){let i=te()&&e.track?d():e.x;e.phase=Math.abs(i-e.x)>6?"return":"rest",e.pt=0,e.thrust=[0,0,0,0],e.vy=0,e.w=0,e.vx=0,e.track=null,e.back={from:e.x,to:i,time:C(Math.abs(i-e.x)/200,.7,1.8)}}u=Number.isFinite(u)?C(u,0,e.boost||e.phase==="flip"?2.6:1.9):1;let S=ee(),U=S.length,$=S.reduce((i,g)=>i+g*g,0),m=e.phase==="drag"?C(100*(e.target.x-e.x)-17*e.vx,-2400,2400):0,l=0;if(x){let i=.8*n*Xe(e.clock*1.7,e.seed+3),g=e.phase==="drag"?m*.75:y*(_-e.x)-L*e.vx,z=e.boost?.45:.32,oe=C(-Math.atan2(g,J),-z,z);l=-81*(e.th-oe)-14*e.w-i}let T=(e.boost||e.phase==="flip"?2.6:2.4)/U,D=(i,g)=>i+(g-i)*(1-Math.exp(-o/(g>i?.08:.17))),R=$>1?l*s/(J*$):0,q=Math.abs(R)*Math.max(0,...S.map(Math.abs)),A=Math.min(u/U,Math.max(T-q,T*.5)),H=0;for(let i=0;i<G;i+=1){let g=0;i<U&&(g=C(A+R*S[i],0,T),e.phase==="ignite"&&e.pt<e.delay[i]&&(g=0)),e.thrust[i]=D(e.thrust[i],g),i<U&&(H+=e.thrust[i]*S[i])}let K=F()*J,O=e.phase==="drag"?m:-K*Math.sin(e.th)-.8*e.vx,fe=K*Math.cos(e.th)-J-.3*e.vy,pe=e.phase==="flip"?0:H*J/s-1.2*e.w;x&&(e.phase!=="drag"&&(O+=12*n*Xe(e.clock*.7,e.seed+7)),pe+=.9*n*Xe(e.clock*2.3,e.seed+11),$<1&&(pe+=l),Math.abs(e.th)>.35&&(pe-=(e.th-Math.sign(e.th)*.35)*160));let _e=r(),Re=Math.cos(e.th),me=Math.sin(e.th),de=-(e.bh/2+I()),ye=!1;e.phase!=="flip"&&Me().forEach(i=>{let g=i*Re-de*me,z=i*me+de*Re,oe=_e.y+z,ke=Q-oe;if(ke>0){ye=!0;let Ye=e.vy+e.w*g,Ae=e.vx-e.w*z,Ve=Math.max(0,xt*ke-bt*Ye),lt=-10*Ae;fe+=Ve,O+=lt,pe+=(g*Ve-z*lt)/s}}),e.contact=ye,e.vx=C(e.vx+O*o,-1500,1500),e.vy=C(e.vy+fe*o,-1500,1500),e.w=C(e.w+pe*o,-14,14),e.x+=e.vx*o,e.y+=e.vy*o,e.th+=e.w*o,w&&(e.th=w.th,e.w=w.w),e.phase!=="flip"&&Math.abs(e.th)>ft&&(e.th=Math.sign(e.th)*ft,e.w*e.th>0&&(e.w=0));let[Ne,Ue]=ce();(e.x<Ne||e.x>Ue)&&(e.x=C(e.x,Ne,Ue),e.vx=0),e.y+Q<-40&&(e.y=-Q,e.vy=0),Number.isFinite(e.y+e.x+e.th+e.vy+e.vx+e.w+F())||(Object.assign(e,{x:e.W/2,vx:0,y:-Q,vy:0,th:0,w:0,thrust:[0,0,0,0],phase:"rest"}),e.drag=null)},De=o=>{let a=M.current,n=e.pointer,s=b();if(e.attached&&!e.drag&&e.lastC){let y=n.x+e.off.x,L=n.y+e.off.y,w=-(e.th-e.lastTh),S=y-e.lastC.x,U=L-e.lastC.y,$=s.x+S*Math.cos(w)-U*Math.sin(w),m=s.y+S*Math.sin(w)+U*Math.cos(w);e.off.x+=$-y,e.off.y+=m-L}e.lastC=s,e.lastTh=e.th;let f=n.x+e.off.x,u=n.y+e.off.y,x=n.in&&he(f,u,e.attached||e.drag?10:0);if(x!==e.hover&&(e.hover=x,x?E.dataset.hover="":delete E.dataset.hover),!x&&!e.drag&&(e.attached=!1,e.phase==="rest"&&(e.armed=!0)),x&&e.armed&&e.phase==="rest"&&n.type==="mouse"&&a.trigger!=="click"&&!te()&&xe()&&(e.attached=!!a.carryCursor),e.phase==="rest"&&Math.abs(e.off.x)+Math.abs(e.off.y)<12){let y=Math.exp(-o*6);e.off.x*=y,e.off.y*=y}Math.abs(e.off.x)+Math.abs(e.off.y)<.3&&(!e.attached||e.phase==="rest")&&(e.off.x=0,e.off.y=0,e.phase==="rest"&&(e.attached=!1));let _=!!a.carryCursor&&n.in&&n.type==="mouse"&&(e.attached||!!e.drag||e.off.x!==0||e.off.y!==0);_!==e.carry&&(e.carry=_,_?t.dataset.carry="":delete t.dataset.carry),_&&W&&(W.style.transform=`translate3d(${(f-1.8).toFixed(2)}px, ${(u-1.75).toFixed(2)}px, 0)`)},V=o=>{e.raf=0;let a=e.last?C((o-e.last)/1e3,0,1/30):1/60;if(e.last=o,a>0){if(e.phase!=="rest")for(let x=0;x<6;x+=1)Ge(a/6);let n=1-Math.exp(-a/.12);e.fvx+=(e.vx-e.fvx)*n,e.fvy+=(e.vy-e.fvy)*n,De(a),ge(),re(a);let s=F();e.quiet=s>.01||e.phase!=="rest"?0:e.quiet+a;let f=s>.05?1:0;e.activity+=(f-e.activity)*(1-Math.exp(-a/(f?.25:1.6)))}e.phase!=="rest"||e.quiet<7||e.carry?e.raf=requestAnimationFrame(V):(e.running=!1,e.last=0,B&&B.clear(),re(0))},ie=()=>{e.raf||(e.running=!0,e.raf=requestAnimationFrame(V))},at=o=>{let a=t.getBoundingClientRect();return{x:o.clientX-a.left,y:o.clientY-a.top}},Ke=()=>{let o=e.pointer,a=o.type==="mouse";return{x:o.x+(a?e.off.x:0),y:o.y+(a?e.off.y:0)}},nt=()=>{if(!e.drag)return;let o=Ke(),[a,n]=ce(),s=I()+e.bh/2;e.target.x=C(o.x-e.drag.gx,a,n),e.target.y=C(e.H-(o.y-e.drag.gy),s,Math.max(s,e.H-e.bh/2-6))},yt=o=>{let a=Ke(),n=b();e.drag={gx:a.x-n.x,gy:a.y-n.y},e.phase="drag",e.pt=0,e.attached=!1,e.pressed=!1,e.suppress=!0,e.boost=!1,delete E.dataset.pressed,t.dataset.dragging="";try{t.setPointerCapture(o.pointerId)}catch{}nt()},vt=o=>{e.drag=null,e.press=null,delete t.dataset.dragging;try{t.releasePointerCapture(o.pointerId)}catch{}e.phase="hover",e.pt=0,e.alt=e.y;let[a,n]=ce();e.xRef=C(e.x+e.vx*.3,a,n),e.hold=Math.min(Math.max(0,ue(M.current.hoverTime,2.4)),.9)},qe=o=>{let a=at(o),n=e.pointer;if(n.in&&!e.attached&&!e.drag&&(e.off.x||e.off.y)){let s=Math.exp(-Math.hypot(a.x-n.x,a.y-n.y)/110);e.off.x*=s,e.off.y*=s}n.x=a.x,n.y=a.y,n.in=!0,n.type=o.pointerType||"mouse",e.press&&!e.drag&&ze()&&Math.hypot(a.x-e.press.x,a.y-e.press.y)>4&&yt(o),e.drag&&nt(),De(0),(e.carry||e.phase!=="rest")&&ie()},rt=()=>{e.drag||(e.pointer.in=!1,e.attached=!1,e.off.x=0,e.off.y=0,De(0))},st=o=>{let a=at(o),n=e.pointer;n.x=a.x,n.y=a.y,n.in=!0,n.type=o.pointerType||"mouse",e.suppress=!1;let s=Ke();he(s.x,s.y,e.attached?10:0)&&(n.type!=="mouse"&&e.phase==="rest"&&M.current.trigger!=="click"&&!te()&&xe(),e.press={x:a.x,y:a.y},e.carry&&n.type==="mouse"&&(e.pressed=!0,E.dataset.pressed=""))},Ie=o=>{if(e.drag){vt(o);return}e.press=null,e.pressed&&(e.pressed=!1,delete E.dataset.pressed,e.carry&&e.hover&&(e.phase==="rest"&&te()?$e():M.current.trigger==="click"&&xe()&&(e.attached=!!M.current.carryCursor),M.current.onClick&&M.current.onClick(o)))},it=o=>{if(e.suppress){e.suppress=!1,o.stopPropagation(),o.preventDefault();return}if(e.phase==="rest"){if(te()){$e();return}xe()&&e.pointer.type==="mouse"&&e.pointer.in&&e.hover&&(e.attached=!!M.current.carryCursor)}};t.addEventListener("pointermove",qe),t.addEventListener("pointerenter",qe),t.addEventListener("pointerleave",rt),t.addEventListener("pointerdown",st),t.addEventListener("pointerup",Ie),t.addEventListener("pointercancel",Ie),E.addEventListener("click",it);let Oe=new ResizeObserver(we);return Oe.observe(t),Oe.observe(E),we(),{refresh:we,rehome(){we(),e.phase==="rest"&&(e.x=d(),ge(),e.running||re(0))},destroy(){Oe.disconnect(),j(),e.raf&&cancelAnimationFrame(e.raf),t.removeEventListener("pointermove",qe),t.removeEventListener("pointerenter",qe),t.removeEventListener("pointerleave",rt),t.removeEventListener("pointerdown",st),t.removeEventListener("pointerup",Ie),t.removeEventListener("pointercancel",Ie),E.removeEventListener("click",it),B&&B.dispose()}}}function zt(t){let h=(v,d)=>{let r=t.createShader(v);if(t.shaderSource(r,d),t.compileShader(r),!t.getShaderParameter(r,t.COMPILE_STATUS)){let p=t.getShaderInfoLog(r);throw t.deleteShader(r),new Error(p)}return r},E=h(t.VERTEX_SHADER,kt),W=[],N=v=>{let d=h(t.FRAGMENT_SHADER,v),r=t.createProgram();if(t.attachShader(r,E),t.attachShader(r,d),t.linkProgram(r),!t.getProgramParameter(r,t.LINK_STATUS))throw new Error(t.getProgramInfoLog(r));t.deleteShader(d);let p={},b=t.getProgramParameter(r,t.ACTIVE_UNIFORMS);for(let j=0;j<b;j+=1){let Y=t.getActiveUniform(r,j);p[Y.name.replace(/\[0\]$/,"")]=t.getUniformLocation(r,Y.name)}let P={p:r,u:p};return W.push(P),P},M={advect:N(Tt),force:N(Mt),curl:N(Ct),vorticity:N(Lt),divergence:N(Et),pressure:N(St),gradient:N(Dt),scale:N(Nt),blur:N(Rt),dye:N(Ut),render:N(At)},Z=t.createVertexArray(),ne=[],e=(v,d,r,p)=>{let b=t.createTexture();t.bindTexture(t.TEXTURE_2D,b);let P=p?Math.floor(Math.log2(Math.max(v,d)))+1:1;t.texStorage2D(t.TEXTURE_2D,P,r,v,d),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,p?t.LINEAR_MIPMAP_LINEAR:t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE);let j=t.createFramebuffer();t.bindFramebuffer(t.FRAMEBUFFER,j),t.framebufferTexture2D(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,b,0),t.viewport(0,0,v,d),t.clearColor(0,0,0,0),t.clear(t.COLOR_BUFFER_BIT);let Y={tex:b,fbo:j,w:v,h:d,mips:p};return ne.push(Y),Y},B=(v,d,r,p)=>{let b={read:e(v,d,r,p),write:e(v,d,r,p)};return b.swap=()=>{let P=b.read;b.read=b.write,b.write=P},b},c=null,X=[1,1],I=()=>{ne.forEach(v=>{t.deleteTexture(v.tex),t.deleteFramebuffer(v.fbo)}),ne.length=0},Te=(v,d)=>{let r=Math.max(2,v/520,d/300),p=Math.max(16,Math.round(v/r)),b=Math.max(16,Math.round(d/r)),P=Math.max(16,Math.round(v/(r/2))),j=Math.max(16,Math.round(d/(r/2)));X=[v,d],!(c&&c.vw===p&&c.vh===b&&c.dw===P&&c.dh===j)&&(I(),c={vw:p,vh:b,dw:P,dh:j,velocity:B(p,b,t.RG16F,!1),pressure:B(p,b,t.R16F,!1),divergence:e(p,b,t.R16F,!1),curl:e(p,b,t.R16F,!1),dye:B(P,j,t.RG16F,!1),soft:e(P,j,t.RG16F,!0),temp:e(P,j,t.RG16F,!1)})},ee=0,Me=(v,d)=>{t.useProgram(v.p),ee=0,Object.entries(d).forEach(([r,p])=>{let b=v.u[r];b!=null&&(typeof p=="number"?t.uniform1f(b,p):p.f1?t.uniform1fv(b,p.f1):p.tex?(t.activeTexture(t.TEXTURE0+ee),t.bindTexture(t.TEXTURE_2D,p.tex),t.uniform1i(b,ee),ee+=1):p.length===2?t.uniform2fv(b,p):p.length===3?t.uniform3fv(b,p):t.uniform4fv(b,p))})},F=(v,d,r)=>{Me(v,d),r&&(t.bindFramebuffer(t.FRAMEBUFFER,r.fbo),t.viewport(0,0,r.w,r.h)),t.bindVertexArray(Z),t.drawArrays(t.TRIANGLES,0,3)};return{step:(v,d)=>{if(!c)return;let r=Je;t.disable(t.BLEND);let p=[1/c.vw,1/c.vh];F(M.advect,{uVelocity:c.velocity.read,uSource:c.velocity.read,uWorld:X,uDt:v,uKeep:1},c.velocity.write),c.velocity.swap(),F(M.force,{uVelocity:c.velocity.read,uDye:c.soft,uWorld:X,uDt:v,uBuoyancy:r.buoy,uLift:r.lift,uDamping:r.damp,uSpread:r.spread,uSplash:r.splash,uFriction:r.friction,uWind:d.wind,uTurb:[r.turb*(.35+.65*d.activity),r.turbScale],uTime:d.time,uObstacle:d.calm,uKick:[r.kickNear*d.scale,r.kickW*d.scale,r.kickH*d.scale],uCraft:d.craft,uCraftMotion:d.motion,uJetA:d.jets.a,uJetB:d.jets.b,uJetBend:{f1:d.jets.bend}},c.velocity.write),c.velocity.swap(),F(M.curl,{uVelocity:c.velocity.read,uTexel:p},c.curl),F(M.vorticity,{uVelocity:c.velocity.read,uCurl:c.curl,uTexel:p,uStrength:r.vort*d.turbulence*(.4+.6*d.activity),uDt:v},c.velocity.write),c.velocity.swap(),F(M.divergence,{uVelocity:c.velocity.read,uTexel:p},c.divergence),F(M.scale,{uSource:c.pressure.read,uScale:.8},c.pressure.write),c.pressure.swap();for(let P=0;P<r.iters;P+=1)F(M.pressure,{uPressure:c.pressure.read,uDivergence:c.divergence,uTexel:p},c.pressure.write),c.pressure.swap();F(M.gradient,{uPressure:c.pressure.read,uVelocity:c.velocity.read,uTexel:p},c.velocity.write),c.velocity.swap(),F(M.dye,{uVelocity:c.velocity.read,uSource:c.dye.read,uWorld:X,uDt:v,uKeep:[Math.exp(-(r.keepD+r.keepIdle*(1-d.activity))*v),Math.exp(-r.keepH*v)],uRate:[r.rateN*d.smoke,r.rateH,r.rateK*d.smoke,r.rateC*d.smoke],uSpread:r.spread,uCol:[r.colSpread,r.colR*d.scale,r.colD,r.colU],uKick:[r.kickNear*d.scale,r.kickW*d.scale,r.kickH*d.scale],uDisperse:r.disperse,uDispV:r.dispV,uCraft:d.craft,uCraftMotion:d.motion,uGap:[d.spacing,r.gap*d.calm],uJetX:{f1:d.jetX},uJetN:d.jetN,uFloor:r.floor,uTime:d.time,uJetA:d.jets.a,uJetB:d.jets.b,uJetBend:{f1:d.jets.bend}},c.dye.write),c.dye.swap();let b=r.blur/2;F(M.blur,{uSource:c.dye.read,uStep:[b/c.dw,0]},c.temp),F(M.blur,{uSource:c.temp,uStep:[0,b/c.dh]},c.soft),t.bindTexture(t.TEXTURE_2D,c.soft.tex),t.generateMipmap(t.TEXTURE_2D)},render:(v,d,r)=>{if(!c)return;let p=Je;t.bindFramebuffer(t.FRAMEBUFFER,null),t.viewport(0,0,v,d),t.disable(t.BLEND),F(M.render,{uDye:c.soft,uWorld:X,uDyeSize:[c.dw,c.dh],uTime:r.time,uLightTheme:r.light?1:0,uSmoke:r.smokeColor,uShade:r.shadeColor,uThrust:r.thrustColor,uLook:[p.alphaK*(.6+.4*r.activity),p.relief,p.shadow,p.alphaLod],uLook2:[p.ambient,p.key,p.wrap,p.ao],uLook3:[p.normalE,p.normalLod,p.fine,p.broad],uCol:[p.colSpread,p.colR*r.scale,p.colD,p.colU],uScale:r.scale,uGamma:p.gamma,uTone:p.tone,uLight2:[p.jetLight,p.emit,p.exposure],uThreshold:p.threshold*(.3+.7*r.activity),uCraft:r.craft,uCraftMotion:r.motion,uJetA:r.jets.a,uJetB:r.jets.b,uJetBend:{f1:r.jets.bend}})},resize:Te,clear:()=>{c&&([c.velocity.read,c.velocity.write,c.pressure.read,c.pressure.write,c.dye.read,c.dye.write,c.soft,c.temp].forEach(v=>{t.bindFramebuffer(t.FRAMEBUFFER,v.fbo),t.clearColor(0,0,0,0),t.clear(t.COLOR_BUFFER_BIT)}),t.bindTexture(t.TEXTURE_2D,c.soft.tex),t.generateMipmap(t.TEXTURE_2D))},dispose:()=>{I(),W.forEach(v=>t.deleteProgram(v.p)),t.deleteShader(E),t.deleteVertexArray(Z)}}}function ot({children:t="Take off",onClick:h,theme:E="dark",size:W="medium",radius:N,altitude:M=170,hoverTime:Z=2.4,jets:ne=2,thrusters:e=!0,trigger:B="hover",carryCursor:c=!0,ramp:X=!1,rampColor:I,smoke:Te=1,turbulence:ee=1,wobble:Me=1,thrustColor:F,smokeColor:ze,buttonColor:Ce,textColor:ce,className:te="",style:v}){let d=le(null),r=le(null),p=le(null),b=le(null),P=le(null),j=le(null),Y=le({}),Le=le(0),ge=le(""),[Ee,Be]=ut({text:"",id:0}),re=E==="light",we=()=>{let V=We[Math.floor(Math.random()*We.length)];for(let ie=0;ie<8&&V===ge.current;ie+=1)V=We[Math.floor(Math.random()*We.length)];ge.current=V,Be({text:V,id:Date.now()}),clearTimeout(Le.current),Le.current=window.setTimeout(()=>{Be(ie=>({...ie,text:""}))},5200)};je(()=>()=>clearTimeout(Le.current),[]);let he=He[W]||He.medium,Se=F||(re?"#4f8cff":"#8ec5ff"),xe=ze||(re?"#e9ebf0":"#eef1f6"),Fe=Ce||(re?"#18181b":"#27272a"),Pe=ce||(re?"#fafafa":"#f5f5f5"),$e=I||(re?"#ececf0":"#25222b"),se=C(Math.round(ue(ne,2)),1,G),Ge=se===1?0:se===2?.3:.34,De=e?Array.from({length:se},(V,ie)=>se===1?50:50+Ge*100*(2*ie/(se-1)-1)):[];return Y.current={size:W,altitude:M,hoverTime:Z,jets:se,thrusters:!!e,trigger:B,carryCursor:c,ramp:!!X,smoke:Te,turbulence:ee,wobble:Me,thrustColor:Se,smokeColor:xe,theme:E,onClick:h,onLaunch:we},je(()=>{let V=jt({root:d.current,canvas:r.current,button:p.current,cursor:b.current,ramp:P.current,props:Y});return j.current=V,()=>{j.current=null,V.destroy()}},[]),je(()=>{j.current&&j.current.refresh()},[W,se,e,N]),je(()=>{j.current&&j.current.rehome()},[X]),k("div",{ref:d,className:`flying-button ${te}`.trim(),"data-theme":E,"data-trigger":X?"click":B,style:{"--fly-bg":Fe,"--fly-ink":Pe,"--fly-glow":Se,"--fly-ramp":$e,"--fly-h":`${he.h}px`,"--fly-px":`${he.px}px`,"--fly-fs":`${he.fs}px`,"--fly-scale":he.k,...N!=null?{"--fly-radius":`${ue(N,0)}px`}:{},...v},children:[k("svg",{ref:P,className:"flying-button__ramp",style:X?void 0:{display:"none"},"aria-hidden":"true",children:[k("path",{className:"flying-button__ramp-body"}),k("path",{className:"flying-button__ramp-edge"})]}),k("canvas",{ref:r,className:"flying-button__smoke","aria-hidden":"true"}),k("div",{className:"flying-button__scene","aria-hidden":"true",children:[k("div",{className:"flying-button__chalkboard",children:[k("span",{className:"flying-button__chalk-title",children:"Lap plan // TT-07"}),k("span",{className:"flying-button__chalk-line",children:"T-24 secure"}),k("span",{className:"flying-button__chalk-line",children:"Thrust 100%"}),k("span",{className:"flying-button__chalk-line",children:"Fractions stowed"}),k("span",{className:"flying-button__chalk-note",children:"Tutor ready"})]}),k("div",{className:"flying-button__engineers flying-button__engineers--left",children:k("span",{className:"flying-button__engineer",children:[k("i",{className:"flying-button__engineer-arm"}),k("i",{className:"flying-button__engineer-body"}),k("i",{className:"flying-button__engineer-head"})]})}),k("div",{className:"flying-button__engineers flying-button__engineers--right",children:[0,1,2].map(V=>k("span",{className:"flying-button__engineer",children:[k("i",{className:"flying-button__engineer-arm"}),k("i",{className:"flying-button__engineer-body"}),k("i",{className:"flying-button__engineer-head"})]},V))})]}),k("button",{ref:p,type:"button",className:"flying-button__craft",onClick:V=>Y.current.onClick&&Y.current.onClick(V),children:[k("span",{className:"flying-button__face","aria-hidden":"true",children:k("img",{src:"f1-car.webp",alt:"",width:"1200",height:"500",decoding:"async"})}),k("span",{className:"flying-button__label",children:t}),De.map(V=>k("span",{className:"flying-button__pod",style:{left:`${V}%`},"aria-hidden":"true"},V))]}),k("div",{className:"flying-button__quote","data-show":Ee.text?"true":"false","aria-live":"polite",children:[k("span",{className:"flying-button__quote-label",children:"Pit wall"}),k("span",{className:"flying-button__quote-text",children:Ee.text},Ee.id)]}),k("svg",{ref:b,className:"flying-button__cursor",viewBox:"0 0 24 34","aria-hidden":"true",children:k("path",{d:"M2.2 2.1v24.6l6.1-5.9 4.1 9.6 4.4-1.9-4.1-9.4h8.6z",fill:"#0a0a0c",stroke:"#fff",strokeWidth:"1.9",strokeLinejoin:"round"})})]})}var be=document.getElementById("flying-button-root"),Bt=()=>!!(window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches),Ft=(t,h=2e3)=>{let E=window.scrollY,W=t-E;if(Bt()||Math.abs(W)<4)return window.scrollTo(0,t),Promise.resolve();let N=document.documentElement,M=N.style.scrollBehavior;N.style.scrollBehavior="auto";let Z=performance.now();return new Promise(ne=>{let e=B=>{let c=Math.min(1,(B-Z)/h),X=c<.5?4*c**3:1-(-2*c+2)**3/2;if(window.scrollTo(0,Math.round(E+W*X)),c<1){requestAnimationFrame(e);return}N.style.scrollBehavior=M,ne()};requestAnimationFrame(e)})},Pt=()=>{let t=document.getElementById("plans");if(!t||!be)return;let h=Math.max(0,t.getBoundingClientRect().top+window.scrollY-92);be.setAttribute("data-launching",""),Ft(h).then(()=>be.removeAttribute("data-launching"))};be&&(be.dataset.mounted="true",be.querySelector(".launch-fallback")?.remove(),ct(k(ot,{theme:"light",size:"large",radius:18,altitude:165,hoverTime:3.4,jets:2,thrusters:!0,trigger:"hover",carryCursor:!0,smoke:1,turbulence:1,wobble:1,ramp:!1,buttonColor:"#e10600",textColor:"#ffffff",thrustColor:"#ffd400",smokeColor:"#f4ead6",onClick:Pt,className:"launch-car",style:{"--fly-h":"114px","--fly-px":"0px"},children:"Build your lap plan"}),be));
