import"./island-chunks/chunk-XKFHMPKF.js";import{g as ct,j as $e,l as de,p as J}from"./island-chunks/chunk-CANNF34S.js";var H=1100,dt=380,mt=10,Y=H/(2*dt),yt=5,X=4,it=.55,Ge=H*.75,Ke=.42,ze={small:{h:36,px:16,fs:13,k:.82},medium:{h:44,px:22,fs:14,k:1},large:{h:52,px:26,fs:16,k:1.18},"extra-large":{h:60,px:30,fs:18,k:1.36}},M=(t,h,L)=>Math.min(L,Math.max(h,t)),ce=(t,h)=>Number.isFinite(Number(t))&&t!==null&&t!==""?Number(t):h,me=t=>{let h=M(t,0,1);return h*h*(3-2*h)},lt=t=>{let h=M(t,0,1);return h*h*h*(10+h*(6*h-15))},ut=t=>{let h=M(t,0,1);return 30*h*h*(1-h)*(1-h)},bt=t=>{let h=M(t,0,1);return 60*h*(1-h)*(1-2*h)},Pe=(t,h)=>Math.sin(t*1.31+h)*.5+Math.sin(t*2.73+h*1.7)*.3+Math.sin(t*5.19+h*2.3)*.2,gt=(t,h)=>Math.cos(t*1.31+h)*.655+Math.cos(t*2.73+h*1.7)*.819+Math.cos(t*5.19+h*2.3)*1.038,ft=t=>{let h=String(t||"").replace("#",""),L=h.length===3?h.replace(/(.)/g,"$1$1"):h.padEnd(6,"0").slice(0,6),V=parseInt(L,16);return Number.isFinite(V)?[(V>>16&255)/255,(V>>8&255)/255,(V&255)/255]:[1,1,1]},wt=`#version 300 es
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
`,Oe=`
uniform vec4 uJetA[${X}];
uniform vec4 uJetB[${X}];
uniform float uJetBend[${X}];
float jetWeight(vec2 p, vec4 a, vec4 b, out float along) {
  vec2 rel = p - a.xy;
  along = dot(rel, a.zw);
  vec2 off = rel - a.zw * clamp(along, 0.0, b.z);
  return exp(-dot(off, off) / (b.y * b.y)) * smoothstep(-b.y, 0.0, along);
}
`,Ye=`
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
`,kt=`${ae}
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
}`,Tt=`${ae}
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
${Oe}
${Ye}
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
  for (int i = 0; i < ${X}; i++) {
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
  for (int i = 0; i < ${X}; i++) {
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
}`,Mt=`${ae}
uniform sampler2D uVelocity;
uniform vec2 uTexel;
void main() {
  float L = textureLod(uVelocity, vUv - vec2(uTexel.x, 0.0), 0.0).y;
  float R = textureLod(uVelocity, vUv + vec2(uTexel.x, 0.0), 0.0).y;
  float B = textureLod(uVelocity, vUv - vec2(0.0, uTexel.y), 0.0).x;
  float T = textureLod(uVelocity, vUv + vec2(0.0, uTexel.y), 0.0).x;
  outColor = vec4(0.5 * (R - L - T + B), 0.0, 0.0, 1.0);
}`,Ct=`${ae}
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
}`,pt=`
float pressureAt(sampler2D tex, vec2 uv, vec2 texel, float c, int side) {
  if (side == 0 && uv.x - texel.x < 0.0) return 0.0;
  if (side == 1 && uv.x + texel.x > 1.0) return 0.0;
  if (side == 2 && uv.y - texel.y < 0.0) return c;
  if (side == 3 && uv.y + texel.y > 1.0) return 0.0;
  vec2 o = side == 0 ? vec2(-texel.x, 0.0) : side == 1 ? vec2(texel.x, 0.0) : side == 2 ? vec2(0.0, -texel.y) : vec2(0.0, texel.y);
  return textureLod(tex, uv + o, 0.0).x;
}
`,Lt=`${ae}
uniform sampler2D uPressure;
uniform sampler2D uDivergence;
uniform vec2 uTexel;
${pt}
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
${pt}
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
}`,St=`${ae}
uniform sampler2D uSource;
uniform vec2 uStep;
void main() {
  vec2 c = textureLod(uSource, vUv, 0.0).xy * 0.2270270;
  c += textureLod(uSource, vUv + uStep * 1.3846154, 0.0).xy * 0.3162162;
  c += textureLod(uSource, vUv - uStep * 1.3846154, 0.0).xy * 0.3162162;
  c += textureLod(uSource, vUv + uStep * 3.2307692, 0.0).xy * 0.0702703;
  c += textureLod(uSource, vUv - uStep * 3.2307692, 0.0).xy * 0.0702703;
  outColor = vec4(c, 0.0, 1.0);
}`,Rt=`${ae}
uniform sampler2D uSource;
uniform float uScale;
void main() {
  outColor = textureLod(uSource, vUv, 0.0) * uScale;
}`,_t=`${ae}
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
uniform float uJetX[${X}];
uniform float uJetN;
uniform float uFloor;
uniform float uTime;
${Oe}
${Ye}
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
    for (int k = 0; k < ${X}; k++) {
      if (float(k) >= uJetN) break;
      nearest = min(nearest, abs(lq.x - uJetX[k]));
      outer = max(outer, abs(uJetX[k]));
    }
    float wx = uGap.x > 1.0 ? smoothstep(uGap.x * 0.22, uGap.x * 0.4, nearest) * (1.0 - smoothstep(outer - uGap.x * 0.1, outer, abs(lq.x))) : 0.0;
    val.x *= exp(-uGap.y * wx * wy * uDt);
  }
  val.x = max(val.x - uFloor * uDt, 0.0);
  vec2 p = vUv * uWorld;
  for (int i = 0; i < ${X}; i++) {
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
}`,Ut=`${ae}
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
${Oe}
${Ye}
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
  for (int i = 0; i < ${X}; i++) {
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
  for (int i = 0; i < ${X}; i++) {
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
}`,Ie={colSpread:.1,colR:3.6,colD:1.25,colU:420,splash:400,friction:5,disperse:.6,dispV:60,gap:10,wind:8,turb:350,turbScale:34,jetLight:.3,threshold:.035,blur:3,emit:0,exposure:1.3,tone:1,gamma:.6,kickNear:45,kickW:18,kickH:14,vort:6,spread:.1,floor:.02,keepD:.3,keepIdle:.45,keepH:1.6,rateN:0,rateH:6,rateK:20,rateC:3,buoy:330,lift:22,damp:.55,radius:6,speed:380,reach:.9,forceMax:240,alphaK:4,relief:9,shadow:.026,alphaLod:0,ambient:.58,key:.82,wrap:.35,ao:.35,normalE:3,normalLod:-.8,fine:.35,broad:.9,iters:20};function At({root:t,canvas:h,button:L,cursor:V,ramp:_,props:C}){let Q=h.getContext("webgl2",{alpha:!0,premultipliedAlpha:!0,antialias:!1,depth:!1,stencil:!1,powerPreference:"high-performance"}),re=typeof window<"u"&&window.matchMedia?window.matchMedia("(prefers-reduced-motion: reduce)"):null,e={W:0,H:0,dpr:1,bw:0,bh:0,x:0,vx:0,y:-Y,vy:0,th:0,w:0,fvx:0,fvy:0,thrust:[0,0,0,0],delay:[0,0,0,0],phase:"rest",pt:0,clock:0,seed:Math.random()*100,wind:1,alt:160,climbT:1.6,y0:0,vrPrev:0,hold:2.4,xRef:0,landX:0,boost:!1,contact:!0,placed:!1,track:null,back:null,flip:null,rampKey:"",rampGeo:null,strip:null,u:0,v:0,target:{x:0,y:0},pointer:{in:!1,x:0,y:0,type:"mouse"},off:{x:0,y:0},attached:!1,hover:!1,armed:!0,carry:!1,pressed:!1,press:null,drag:null,suppress:!1,lastC:null,lastTh:0,quiet:0,running:!1,last:0,raf:0,simTime:0,activity:0},B=null;if(Q&&(Q.getExtension("EXT_color_buffer_float")||Q.getExtension("EXT_color_buffer_half_float")))try{B=jt(Q)}catch{B=null}let l=()=>!!(re&&re.matches),W=()=>(ze[C.current.size]||ze.medium).k,I=()=>yt*W(),Te=()=>M(Math.round(ce(C.current.jets,2)),1,X),Z=()=>{let o=Te();if(o===1)return[0];let a=e.bw*(o===2?.3:.34);return Array.from({length:o},(r,n)=>a*(2*n/(o-1)-1))},Me=()=>{let o=Z();return o.length>1?[o[0],o[o.length-1]]:[-.3*e.bw,.3*e.bw]},F=()=>e.thrust[0]+e.thrust[1]+e.thrust[2]+e.thrust[3],Re=()=>e.phase==="ignite"||e.phase==="climb"||e.phase==="hover"||e.phase==="descend"||e.phase==="drag",Ce=()=>e.phase==="drive"||e.phase==="loop"||e.phase==="flip"||e.phase==="return",ne=()=>[e.bw/2+4,Math.max(e.bw/2+4,e.W-e.bw/2-4)],ee=()=>!!C.current.ramp,y=()=>{let o=I()+e.bh/2,a=`${e.W}|${e.H}|${e.bw}|${o}`;if(e.rampKey===a&&e.rampGeo)return e.rampGeo;let r=Math.max(e.H*.24,I()+e.bh+40),n=1/r,f=r*.4,u=r*Math.PI/2-f,v=(S,R)=>{let z=[[f,0,n],[u,n,n],[f,n,0],[S,0,0],[f,0,n],[u,n,n],[f,n,0],[R,0,0]],A={ss:[0],xs:[0],ys:[0],ps:[0],ks:[0]},q=0,G=0,K=0,le=0;return z.forEach(([ue,we,Ee])=>{let ve=Math.max(1,Math.round(ue/1.5)),fe=ue/ve;for(let xe=0;xe<ve;xe+=1){let Le=we+(Ee-we)*((xe+.5)/ve),De=K+Le*fe/2;q+=Math.cos(De)*fe,G+=Math.sin(De)*fe,K+=Le*fe,le+=fe,A.ss.push(le),A.xs.push(q),A.ys.push(G),A.ps.push(K),A.ks.push(we+(Ee-we)*((xe+1)/ve))}}),A},k=v(0,0),m=Math.max(0,e.H*.66-Math.max(...k.ys)),E=v(m,Math.max(48,e.W*.16)),w=M(r*.12,8,16),D=e.W-Math.max(18,e.W*.05)-w-Math.max(...E.xs),U=E.xs.map(S=>S+D),P=E.ss.length-1,x=E.ys.findIndex(S=>S>3),i=x<0?U[P]:U[x],T={...E,xs:U,r,T:w,x0:D,foot:i,S:E.ss[P],clear:Math.min(i,U[P])-12,ok:Math.max(...E.ys)+w<e.H-8};return e.rampKey=a,e.rampGeo=T,T},p=()=>{let[o,a]=ne();if(!ee())return M(e.W/2,o,a);let r=y();return M(Math.min(r.foot*.5,r.x0-90,r.clear-e.bw/2-40),o,a)},s=()=>({x:e.x,y:I()+e.bh/2+e.y+Y}),d=()=>{let o=s(),a=Math.cos(e.th),r=Math.sin(e.th),n=C.current.thrusters?-(e.bh/2+I())+1:-(e.bh/2)+2;return Z().map(f=>({x:o.x+f*a-n*r,y:o.y+f*r+n*a,dx:r,dy:-a}))},b=()=>{let o=s();return{x:o.x,y:e.H-o.y}},$=(o,a,r,n,f,u,v)=>{let k=f[0]-u[0],m=v[0]-u[0],E=n[0]-f[0]+u[0]-v[0],w=f[1]-u[1],D=v[1]-u[1],U=n[1]-f[1]+u[1]-v[1],P=k*D-m*w||1e-6,x=(E*D-m*U)/P,i=(k*U-E*w)/P,T=f[0]-n[0]+x*f[0],S=v[0]-n[0]+i*v[0],R=f[1]-n[1]+x*f[1],z=v[1]-n[1]+i*v[1],A=n[0]-T*o/a,q=n[1]-R*o/a;return Math.abs(x)<1e-7&&Math.abs(i)<1e-7?`matrix(${[T/a,R/a,S/r,z/r,A,q].map(K=>K.toFixed(6)).join(",")})`:`matrix3d(${[T/a,R/a,0,x/a,S/r,z/r,0,i/r,0,0,1,0,A,q,0,1-x*o/a].map(K=>K.toFixed(6)).join(",")})`},j=()=>{e.strip&&(e.strip.wrap.remove(),e.strip.ink.remove(),e.strip=null,L.style.visibility="")},O=()=>{j();let o=e.track;if(!o)return;let a=o.geo,r=I()+e.bh/2,n=[0];for(let x=1;x<a.ss.length;x+=1){let i=(a.ks[x]+a.ks[x-1])/2;n.push(n[x-1]+(a.ss[x]-a.ss[x-1])*Math.max(1-i*r,.2))}let f=M(Math.round(e.bw/8),8,32),u=document.createElement("div");u.setAttribute("aria-hidden","true"),u.style.cssText="position:absolute;inset:0;z-index:1;pointer-events:none";let v=document.createElement("div");v.setAttribute("aria-hidden","true"),v.style.cssText="position:absolute;inset:0;z-index:2;pointer-events:none;will-change:transform";let k=Array.from(L.children),m=k[1],E=k.slice(2).map(x=>{let i=x.cloneNode(!0);return i.style.left="0px",i.style.top="0px",i.style.transformOrigin="0 0",u.appendChild(i),{el:i,x:x.offsetLeft,y:x.offsetTop+x.offsetHeight/2,k:1}}),w=[];for(let x=0;x<f;x+=1){let i=L.cloneNode(!0);i.removeAttribute("data-hover"),i.removeAttribute("data-pressed"),i.setAttribute("tabindex","-1"),i.setAttribute("inert",""),Array.from(i.children).slice(1).forEach(R=>{R.style.visibility="hidden"});let T=e.bw*x/f-(x?.75:2),S=e.bw*(x+1)/f+(x<f-1?.75:2);i.style.visibility="visible",i.style.transformOrigin="0 0",i.style.clipPath=`polygon(${T}px -2px, ${S}px -2px, ${S}px ${e.bh+2}px, ${T}px ${e.bh+2}px)`,u.appendChild(i),w.push(i)}let D=[],U=m&&m.textContent||"",P=document.createElement("canvas").getContext("2d");if(m&&P&&U.trim()&&!m.children.length){let x=getComputedStyle(m),i=`${x.fontStyle} ${x.fontWeight} ${x.fontSize} ${x.fontFamily}`;P.font=i;let T=Array.from(U),S=A=>P.measureText(T.slice(0,A).join("")).width,R=S(T.length)||1,z=m.offsetTop+m.offsetHeight/2;T.forEach((A,q)=>{let G=document.createElement("span");G.textContent=A,G.style.cssText=`position:absolute;left:0;top:0;white-space:pre;line-height:1;transform-origin:0 0;font:${i};color:${x.color}`,v.appendChild(G),D.push({el:G,x:m.offsetLeft+(S(q)+S(q+1))/2*(m.offsetWidth/R),y:z,k:.5})})}else if(m){let x=m.cloneNode(!0);x.style.position="absolute",x.style.left="0px",x.style.top="0px",x.style.transformOrigin="0 0",v.appendChild(x),D.push({el:x,x:m.offsetLeft+m.offsetWidth/2,y:m.offsetTop+m.offsetHeight/2,k:0})}t.appendChild(u),t.appendChild(v),L.style.visibility="hidden",e.strip={wrap:u,ink:v,parts:w,n:f,sn:n,pods:E,items:D}},pe=()=>{let o=e.strip,a=e.track;if(!o||!a)return;let r=a.geo,n=r.ss[r.ss.length-1],f=o.sn[o.sn.length-1],u=(i,T,S)=>{let R=0,z=i.length-1;for(;z-R>1;){let A=R+z>>1;i[A]<=S?R=A:z=A}return T[R]+(T[z]-T[R])*((S-i[R])/(i[z]-i[R]))},v=i=>i<=0?i:i>=n?f+i-n:u(r.ss,o.sn,i),k=i=>i<=0?i:i>=f?n+i-f:u(o.sn,r.ss,i),m=v(e.u),E=I(),w=(i,T)=>{let[S,R,z]=Ae(r,k(m+i-e.bw/2)),A=E+e.bh-T;return[S-Math.sin(z)*A,e.H-R-Math.cos(z)*A,z]},D=(i,T,S,R)=>{i.style.transform=`translate(${T.toFixed(2)}px, ${S.toFixed(2)}px) rotate(${(-R).toFixed(4)}rad) translate(-50%, -50%)`},U=e.bw/o.n,P=[],x=[];for(let i=0;i<=o.n;i+=1)P.push(w(i*U,0)),x.push(w(i*U,e.bh));o.parts.forEach((i,T)=>{i.style.transform=$(T*U,U,e.bh,P[T],P[T+1],x[T+1],x[T])}),o.pods.forEach(i=>{let[T,S,R]=w(i.x,i.y);D(i.el,T,S,R)}),o.items.forEach(i=>{let[T,S,R]=w(i.x,i.y),[z,A,q]=w(e.bw/2,i.y),G=i.x-e.bw/2,K=z+Math.cos(q)*G,le=A-Math.sin(q)*G;D(i.el,K+(T-K)*i.k,le+(S-le)*i.k,q+(R-q)*i.k)})},ie=()=>{e.strip&&pe();let o=s(),a=o.x-e.bw/2,r=e.H-o.y-e.bh/2;L.style.transform=`translate3d(${a.toFixed(2)}px, ${r.toFixed(2)}px, 0) rotate(${(-e.th).toFixed(5)}rad)`,t.style.setProperty("--fly-thrust",M(F()*.9,0,1.2).toFixed(3))},_e=()=>{if(!_)return;let o=y(),a=_.querySelectorAll("path"),r=a[0],n=a[1],f=v=>v.toFixed(1),u=v=>{let k=[];for(let E=0;E<o.ss.length;E+=2){let w=o.ps[E];k.push(`${f(o.xs[E]+Math.sin(w)*v)} ${f(e.H-o.ys[E]+Math.cos(w)*v)}`)}let m=o.ps[o.ss.length-1];return k.push(`${f(o.xs[o.ss.length-1]+Math.sin(m)*v)} ${f(e.H-o.ys[o.ss.length-1]+Math.cos(m)*v)}`),`M ${k.join(" L ")}`};_.setAttribute("viewBox",`0 0 ${f(e.W)} ${f(e.H)}`),_.style.visibility=o.ok?"":"hidden",r&&(r.setAttribute("d",u(o.T/2)),r.setAttribute("stroke-width",f(o.T))),n&&n.setAttribute("d",u(.75))},Ve=o=>{let a=new Float32Array(X*4),r=new Float32Array(X*4),n=[0,0,0,0],f=o.length,u=Ie,v=W();return o.forEach((k,m)=>{let E=M(e.thrust[m]*f,0,2),w=k.dy<-.2?k.y/-k.dy:u.forceMax;a.set([k.x,k.y,k.dx,k.dy],m*4),r.set([u.speed*Math.sqrt(E),u.radius*v,Math.min(u.forceMax,w*u.reach),E>.004?E:0],m*4);let D=e.fvx*-k.dy+e.fvy*k.dx;n[m]=M(-D*.22,-.55*w,.55*w)}),{a,b:r,bend:n}},be=o=>{if(!B)return;let a=C.current,r=d(),n=Ve(r),f=s(),u=Z(),v=W(),k=[f.x,f.y,e.bw/2,e.bh/2],m=[e.vx,e.vy,e.th,e.w],E=(1-me((Math.abs(e.fvx)-40)/100))*(1-me((Math.abs(e.th)-.1)/.2))*(Ce()?0:1);o>0&&(e.simTime+=o,B.step(o,{jets:n,craft:k,motion:m,calm:E,scale:v,activity:e.activity,jetX:[0,1,2,3].map(D=>D<u.length?u[D]:0),jetN:u.length,spacing:u.length>1?u[1]-u[0]:0,wind:e.wind*Ie.wind,time:e.simTime,smoke:M(ce(a.smoke,1),0,3),turbulence:M(ce(a.turbulence,1),0,3)}));let w=ft(a.smokeColor);B.render(h.width,h.height,{jets:n,craft:k,motion:m,scale:v,activity:e.activity,time:e.simTime,light:a.theme==="light",smokeColor:w,shadeColor:w.map((D,U)=>D*.74+[0,.012,.045][U]),thrustColor:ft(a.thrustColor)})},ge=()=>{let o=t.getBoundingClientRect(),a=e.W;if(e.W=Math.max(1,o.width),e.H=Math.max(1,o.height),e.bw=L.offsetWidth,e.bh=L.offsetHeight,e.placed?a>0&&a!==e.W&&(e.x*=e.W/a):(e.x=p(),e.placed=!0),!Ce()){let[f,u]=ne();e.x=M(e.x,f,u)}e.dpr=Math.min(window.devicePixelRatio||1,1);let r=Math.round(e.W*e.dpr),n=Math.round(e.H*e.dpr);(h.width!==r||h.height!==n)&&(h.width=r,h.height=n),B&&B.resize(e.W,e.H),_e(),t.dataset.ready="",ie(),e.running||be(0)},Ue=(o,a,r=0)=>{let n=b(),f=e.th,u=o-n.x,v=a-n.y,k=u*Math.cos(f)-v*Math.sin(f),m=u*Math.sin(f)+v*Math.cos(f);return Math.abs(k)<=e.bw/2+2+r&&m>=-e.bh/2-2-r&&m<=e.bh/2+I()+r},se=()=>{e.pt=0,e.armed=!1,e.seed=Math.random()*100,e.wind=Math.random()<.5?-1-Math.random():1+Math.random(),e.vrPrev=0,e.quiet=0,e.boost=!1},he=()=>{if(e.phase!=="rest"||l())return!1;let o=C.current;se(),e.phase="ignite",e.delay=e.delay.map(()=>Math.random()*.07);let a=e.H-e.bh-I()-30-Y;return e.alt=M(e.y+ce(o.altitude,170),e.y+24,Math.max(e.y+24,a)),e.climbT=1.15+(e.alt-e.y)/420,e.hold=Math.max(0,ce(o.hoverTime,2.4)),e.xRef=e.x,qe(),!0},Ae=(o,a)=>{if(a<=0)return[o.x0+a,0,0,0];let r=0,n=o.ss.length-1;if(a>=o.ss[n]){let u=o.ps[n];return[o.xs[n]+Math.cos(u)*(a-o.ss[n]),o.ys[n]+Math.sin(u)*(a-o.ss[n]),u,0]}for(;n-r>1;){let u=r+n>>1;o.ss[u]<=a?r=u:n=u}let f=(a-o.ss[r])/(o.ss[n]-o.ss[r]);return[o.xs,o.ys,o.ps,o.ks].map(u=>u[r]+(u[n]-u[r])*f)},te=(o,a)=>{let[r,n,f,u]=Ae(o.geo,a);return{x:r-Math.sin(f)*o.base,cy:n+Math.cos(f)*o.base,th:f,bend:u*o.base}},je=()=>{if(e.phase!=="rest"||l()||!ee())return!1;let o=y(),a=o.x0-e.x;if(a<60||!o.ok)return he();se();let r=I()+e.bh/2,n=Math.max(...o.ys)-2*r,f=Math.sqrt(2*Ge*n+2.2*Ge*(o.r-r));return e.track={geo:o,base:r,v0:f,acc:f*f/(2*a)},e.phase="drive",e.u=-a,e.v=0,e.thrust=[0,0,0,0],O(),qe(),!0},Ze=o=>{let[a,r]=ne(),n=e.x+o;ee()&&(n=Math.min(n,y().clear-e.bw/2)),e.landX=M(n,a,r)},ht=o=>{let a=C.current,r=M(ce(a.wobble,1),0,3);if(e.pt+=o,e.clock+=o,e.phase==="return"){let c=e.back,g=Math.min(e.pt/c.time,1);e.x=c.from+(c.to-c.from)*lt(g),e.vx=(c.to-c.from)*ut(g)/c.time,e.y=-Y,e.vy=0,e.th=0,e.w=0,g>=1&&(e.phase="rest",e.pt=0,e.vx=0);return}if(e.phase==="drive"||e.phase==="loop"){let c=e.track,g=te(c,e.u);e.phase==="drive"?e.v=Math.min(c.v0,e.v+c.acc*o):e.v=Math.sqrt(Math.max(c.v0*c.v0-2*Ge*(g.cy-c.base),.2*c.v0*c.v0)),e.u+=e.v*o/Math.max(1-g.bend,.25),e.phase==="drive"&&e.u>=0&&(e.phase="loop");let N=te(c,e.u);e.vx=(N.x-g.x)/o,e.vy=(N.cy-g.cy)/o,e.w=(N.th-g.th)/o,e.x=N.x,e.y=N.cy-I()-e.bh/2-Y,e.th=N.th,e.thrust=e.thrust.map(oe=>oe*Math.exp(-o/.1)),e.phase==="loop"&&e.u>=c.geo.S&&(j(),e.phase="flip",e.pt=0,e.flip={th:e.th,w:e.w});return}let n=(e.bw*e.bw+e.bh*e.bh)/12,f=Math.max(Math.cos(e.th),.5),u=0,v=!1,k=e.xRef,m=3,E=3.6,w=null;if(e.phase==="flip"){let c=Math.min(e.pt/Ke,1),g=e.flip,N=Math.PI*2;w={th:(2*c*c*c-3*c*c+1)*g.th+(c*c*c-2*c*c+c)*Ke*g.w+(3*c*c-2*c*c*c)*N,w:(6*c*c-6*c)*(g.th-N)/Ke+(3*c*c-4*c+1)*g.w},u=2.4*me((Math.cos(w.th)-.8)/.15);let oe=e.y+Y<e.bh*.6;(c>=1||oe)&&(w=null,e.th-=Math.PI*2*Math.round(e.th/(Math.PI*2)),e.phase="descend",e.pt=0,e.boost=!0,e.vrPrev=e.vy,Ze(e.vx*Math.abs(e.vx)/700))}if(e.phase==="ignite"&&(u=.9*me(e.pt/.5),e.pt>=.5&&(e.phase="climb",e.pt=0,e.y0=e.y)),e.phase==="climb"){let c=e.pt/e.climbT,g=e.alt-e.y0,N=e.y0+g*lt(c),oe=g*ut(c)/e.climbT,ke=g*bt(c)/(e.climbT*e.climbT);u=(H+ke+30*(N-e.y)+8*(oe-e.vy))/(H*f),v=!0,c>=1&&(e.phase="hover",e.pt=0)}else if(e.phase==="hover"){let c=e.clock*.8,g=e.alt+3.5*r*Pe(c,e.seed),N=3.5*r*.8*gt(c,e.seed);u=(H+30*(g-e.y)+8*(N-e.vy))/(H*f),v=!0,e.pt>=e.hold&&(e.phase="descend",e.pt=0,e.vrPrev=0,Ze(0))}else if(e.phase==="drag"){let c=e.target.y-I()-e.bh/2-Y;u=(H+34*(c-e.y)-10*e.vy)/(H*f),v=!0}else if(e.phase==="descend"){k=e.landX,m=e.boost?5:4,E=e.boost?4.6:4.2;let c=170,g=32,N=e.boost?me((Math.abs(e.landX-e.x)-20)/40):me((Math.abs(e.landX-e.x)-3)/23),oe=Math.max(e.y+Y,0),ke=(g+(c-g)*(1-Math.exp(-oe/52)))*(1-(e.boost?.45:.88)*N),Xe=e.boost?c*3:c*me(e.pt/.9)+1,Se=-Math.min(ke,Xe),Fe=M((Se-e.vrPrev)/Math.max(o,1e-4),-600,600);e.vrPrev=Se,u=(H+Fe+(e.boost?9:7)*(Se-e.vy))/(H*f),v=!0,e.contact&&e.pt>.3&&(e.phase="landed",e.pt=0,e.boost=!1)}else if(e.phase==="landed"&&(u=0,e.pt>.6&&F()<.03)){let c=ee()&&e.track?p():e.x;e.phase=Math.abs(c-e.x)>6?"return":"rest",e.pt=0,e.thrust=[0,0,0,0],e.vy=0,e.w=0,e.vx=0,e.track=null,e.back={from:e.x,to:c,time:M(Math.abs(c-e.x)/200,.7,1.8)}}u=Number.isFinite(u)?M(u,0,e.boost||e.phase==="flip"?2.6:1.9):1;let D=Z(),U=D.length,P=D.reduce((c,g)=>c+g*g,0),x=e.phase==="drag"?M(100*(e.target.x-e.x)-17*e.vx,-2400,2400):0,i=0;if(v){let c=.8*r*Pe(e.clock*1.7,e.seed+3),g=e.phase==="drag"?x*.75:m*(k-e.x)-E*e.vx,N=e.boost?.45:.32,oe=M(-Math.atan2(g,H),-N,N);i=-81*(e.th-oe)-14*e.w-c}let T=(e.boost||e.phase==="flip"?2.6:2.4)/U,S=(c,g)=>c+(g-c)*(1-Math.exp(-o/(g>c?.08:.17))),R=P>1?i*n/(H*P):0,z=Math.abs(R)*Math.max(0,...D.map(Math.abs)),A=Math.min(u/U,Math.max(T-z,T*.5)),q=0;for(let c=0;c<X;c+=1){let g=0;c<U&&(g=M(A+R*D[c],0,T),e.phase==="ignite"&&e.pt<e.delay[c]&&(g=0)),e.thrust[c]=S(e.thrust[c],g),c<U&&(q+=e.thrust[c]*D[c])}let G=F()*H,K=e.phase==="drag"?x:-G*Math.sin(e.th)-.8*e.vx,le=G*Math.cos(e.th)-H-.3*e.vy,ue=e.phase==="flip"?0:q*H/n-1.2*e.w;v&&(e.phase!=="drag"&&(K+=12*r*Pe(e.clock*.7,e.seed+7)),ue+=.9*r*Pe(e.clock*2.3,e.seed+11),P<1&&(ue+=i),Math.abs(e.th)>.35&&(ue-=(e.th-Math.sign(e.th)*.35)*160));let we=s(),Ee=Math.cos(e.th),ve=Math.sin(e.th),fe=-(e.bh/2+I()),xe=!1;e.phase!=="flip"&&Me().forEach(c=>{let g=c*Ee-fe*ve,N=c*ve+fe*Ee,oe=we.y+N,ke=Y-oe;if(ke>0){xe=!0;let Xe=e.vy+e.w*g,Se=e.vx-e.w*N,Fe=Math.max(0,dt*ke-mt*Xe),nt=-10*Se;le+=Fe,K+=nt,ue+=(g*Fe-N*nt)/n}}),e.contact=xe,e.vx=M(e.vx+K*o,-1500,1500),e.vy=M(e.vy+le*o,-1500,1500),e.w=M(e.w+ue*o,-14,14),e.x+=e.vx*o,e.y+=e.vy*o,e.th+=e.w*o,w&&(e.th=w.th,e.w=w.w),e.phase!=="flip"&&Math.abs(e.th)>it&&(e.th=Math.sign(e.th)*it,e.w*e.th>0&&(e.w=0));let[Le,De]=ne();(e.x<Le||e.x>De)&&(e.x=M(e.x,Le,De),e.vx=0),e.y+Y<-40&&(e.y=-Y,e.vy=0),Number.isFinite(e.y+e.x+e.th+e.vy+e.vx+e.w+F())||(Object.assign(e,{x:e.W/2,vx:0,y:-Y,vy:0,th:0,w:0,thrust:[0,0,0,0],phase:"rest"}),e.drag=null)},We=o=>{let a=C.current,r=e.pointer,n=b();if(e.attached&&!e.drag&&e.lastC){let m=r.x+e.off.x,E=r.y+e.off.y,w=-(e.th-e.lastTh),D=m-e.lastC.x,U=E-e.lastC.y,P=n.x+D*Math.cos(w)-U*Math.sin(w),x=n.y+D*Math.sin(w)+U*Math.cos(w);e.off.x+=P-m,e.off.y+=x-E}e.lastC=n,e.lastTh=e.th;let f=r.x+e.off.x,u=r.y+e.off.y,v=r.in&&Ue(f,u,e.attached||e.drag?10:0);if(v!==e.hover&&(e.hover=v,v?L.dataset.hover="":delete L.dataset.hover),!v&&!e.drag&&(e.attached=!1,e.phase==="rest"&&(e.armed=!0)),v&&e.armed&&e.phase==="rest"&&r.type==="mouse"&&a.trigger!=="click"&&!ee()&&he()&&(e.attached=!!a.carryCursor),e.phase==="rest"&&Math.abs(e.off.x)+Math.abs(e.off.y)<12){let m=Math.exp(-o*6);e.off.x*=m,e.off.y*=m}Math.abs(e.off.x)+Math.abs(e.off.y)<.3&&(!e.attached||e.phase==="rest")&&(e.off.x=0,e.off.y=0,e.phase==="rest"&&(e.attached=!1));let k=!!a.carryCursor&&r.in&&r.type==="mouse"&&(e.attached||!!e.drag||e.off.x!==0||e.off.y!==0);k!==e.carry&&(e.carry=k,k?t.dataset.carry="":delete t.dataset.carry),k&&V&&(V.style.transform=`translate3d(${(f-1.8).toFixed(2)}px, ${(u-1.75).toFixed(2)}px, 0)`)},et=o=>{e.raf=0;let a=e.last?M((o-e.last)/1e3,0,1/30):1/60;if(e.last=o,a>0){if(e.phase!=="rest")for(let v=0;v<6;v+=1)ht(a/6);let r=1-Math.exp(-a/.12);e.fvx+=(e.vx-e.fvx)*r,e.fvy+=(e.vy-e.fvy)*r,We(a),ie(),be(a);let n=F();e.quiet=n>.01||e.phase!=="rest"?0:e.quiet+a;let f=n>.05?1:0;e.activity+=(f-e.activity)*(1-Math.exp(-a/(f?.25:1.6)))}e.phase!=="rest"||e.quiet<7||e.carry?e.raf=requestAnimationFrame(et):(e.running=!1,e.last=0,B&&B.clear(),be(0))},qe=()=>{e.raf||(e.running=!0,e.raf=requestAnimationFrame(et))},tt=o=>{let a=t.getBoundingClientRect();return{x:o.clientX-a.left,y:o.clientY-a.top}},Je=()=>{let o=e.pointer,a=o.type==="mouse";return{x:o.x+(a?e.off.x:0),y:o.y+(a?e.off.y:0)}},ot=()=>{if(!e.drag)return;let o=Je(),[a,r]=ne(),n=I()+e.bh/2;e.target.x=M(o.x-e.drag.gx,a,r),e.target.y=M(e.H-(o.y-e.drag.gy),n,Math.max(n,e.H-e.bh/2-6))},vt=o=>{let a=Je(),r=b();e.drag={gx:a.x-r.x,gy:a.y-r.y},e.phase="drag",e.pt=0,e.attached=!1,e.pressed=!1,e.suppress=!0,e.boost=!1,delete L.dataset.pressed,t.dataset.dragging="";try{t.setPointerCapture(o.pointerId)}catch{}ot()},xt=o=>{e.drag=null,e.press=null,delete t.dataset.dragging;try{t.releasePointerCapture(o.pointerId)}catch{}e.phase="hover",e.pt=0,e.alt=e.y;let[a,r]=ne();e.xRef=M(e.x+e.vx*.3,a,r),e.hold=Math.min(Math.max(0,ce(C.current.hoverTime,2.4)),.9)},Ne=o=>{let a=tt(o),r=e.pointer;if(r.in&&!e.attached&&!e.drag&&(e.off.x||e.off.y)){let n=Math.exp(-Math.hypot(a.x-r.x,a.y-r.y)/110);e.off.x*=n,e.off.y*=n}r.x=a.x,r.y=a.y,r.in=!0,r.type=o.pointerType||"mouse",e.press&&!e.drag&&Re()&&Math.hypot(a.x-e.press.x,a.y-e.press.y)>4&&vt(o),e.drag&&ot(),We(0),(e.carry||e.phase!=="rest")&&qe()},at=()=>{e.drag||(e.pointer.in=!1,e.attached=!1,e.off.x=0,e.off.y=0,We(0))},rt=o=>{let a=tt(o),r=e.pointer;r.x=a.x,r.y=a.y,r.in=!0,r.type=o.pointerType||"mouse",e.suppress=!1;let n=Je();Ue(n.x,n.y,e.attached?10:0)&&(r.type!=="mouse"&&e.phase==="rest"&&C.current.trigger!=="click"&&!ee()&&he(),e.press={x:a.x,y:a.y},e.carry&&r.type==="mouse"&&(e.pressed=!0,L.dataset.pressed=""))},Be=o=>{if(e.drag){xt(o);return}e.press=null,e.pressed&&(e.pressed=!1,delete L.dataset.pressed,e.carry&&e.hover&&(e.phase==="rest"&&ee()?je():C.current.trigger==="click"&&he()&&(e.attached=!!C.current.carryCursor),C.current.onClick&&C.current.onClick(o)))},st=o=>{if(e.suppress){e.suppress=!1,o.stopPropagation(),o.preventDefault();return}if(e.phase==="rest"){if(ee()){je();return}he()&&e.pointer.type==="mouse"&&e.pointer.in&&e.hover&&(e.attached=!!C.current.carryCursor)}};t.addEventListener("pointermove",Ne),t.addEventListener("pointerenter",Ne),t.addEventListener("pointerleave",at),t.addEventListener("pointerdown",rt),t.addEventListener("pointerup",Be),t.addEventListener("pointercancel",Be),L.addEventListener("click",st);let He=new ResizeObserver(ge);return He.observe(t),He.observe(L),ge(),{refresh:ge,rehome(){ge(),e.phase==="rest"&&(e.x=p(),ie(),e.running||be(0))},destroy(){He.disconnect(),j(),e.raf&&cancelAnimationFrame(e.raf),t.removeEventListener("pointermove",Ne),t.removeEventListener("pointerenter",Ne),t.removeEventListener("pointerleave",at),t.removeEventListener("pointerdown",rt),t.removeEventListener("pointerup",Be),t.removeEventListener("pointercancel",Be),L.removeEventListener("click",st),B&&B.dispose()}}}function jt(t){let h=(y,p)=>{let s=t.createShader(y);if(t.shaderSource(s,p),t.compileShader(s),!t.getShaderParameter(s,t.COMPILE_STATUS)){let d=t.getShaderInfoLog(s);throw t.deleteShader(s),new Error(d)}return s},L=h(t.VERTEX_SHADER,wt),V=[],_=y=>{let p=h(t.FRAGMENT_SHADER,y),s=t.createProgram();if(t.attachShader(s,L),t.attachShader(s,p),t.linkProgram(s),!t.getProgramParameter(s,t.LINK_STATUS))throw new Error(t.getProgramInfoLog(s));t.deleteShader(p);let d={},b=t.getProgramParameter(s,t.ACTIVE_UNIFORMS);for(let j=0;j<b;j+=1){let O=t.getActiveUniform(s,j);d[O.name.replace(/\[0\]$/,"")]=t.getUniformLocation(s,O.name)}let $={p:s,u:d};return V.push($),$},C={advect:_(kt),force:_(Tt),curl:_(Mt),vorticity:_(Ct),divergence:_(Et),pressure:_(Lt),gradient:_(Dt),scale:_(Rt),blur:_(St),dye:_(_t),render:_(Ut)},Q=t.createVertexArray(),re=[],e=(y,p,s,d)=>{let b=t.createTexture();t.bindTexture(t.TEXTURE_2D,b);let $=d?Math.floor(Math.log2(Math.max(y,p)))+1:1;t.texStorage2D(t.TEXTURE_2D,$,s,y,p),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,d?t.LINEAR_MIPMAP_LINEAR:t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE);let j=t.createFramebuffer();t.bindFramebuffer(t.FRAMEBUFFER,j),t.framebufferTexture2D(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,b,0),t.viewport(0,0,y,p),t.clearColor(0,0,0,0),t.clear(t.COLOR_BUFFER_BIT);let O={tex:b,fbo:j,w:y,h:p,mips:d};return re.push(O),O},B=(y,p,s,d)=>{let b={read:e(y,p,s,d),write:e(y,p,s,d)};return b.swap=()=>{let $=b.read;b.read=b.write,b.write=$},b},l=null,W=[1,1],I=()=>{re.forEach(y=>{t.deleteTexture(y.tex),t.deleteFramebuffer(y.fbo)}),re.length=0},Te=(y,p)=>{let s=Math.max(2,y/520,p/300),d=Math.max(16,Math.round(y/s)),b=Math.max(16,Math.round(p/s)),$=Math.max(16,Math.round(y/(s/2))),j=Math.max(16,Math.round(p/(s/2)));W=[y,p],!(l&&l.vw===d&&l.vh===b&&l.dw===$&&l.dh===j)&&(I(),l={vw:d,vh:b,dw:$,dh:j,velocity:B(d,b,t.RG16F,!1),pressure:B(d,b,t.R16F,!1),divergence:e(d,b,t.R16F,!1),curl:e(d,b,t.R16F,!1),dye:B($,j,t.RG16F,!1),soft:e($,j,t.RG16F,!0),temp:e($,j,t.RG16F,!1)})},Z=0,Me=(y,p)=>{t.useProgram(y.p),Z=0,Object.entries(p).forEach(([s,d])=>{let b=y.u[s];b!=null&&(typeof d=="number"?t.uniform1f(b,d):d.f1?t.uniform1fv(b,d.f1):d.tex?(t.activeTexture(t.TEXTURE0+Z),t.bindTexture(t.TEXTURE_2D,d.tex),t.uniform1i(b,Z),Z+=1):d.length===2?t.uniform2fv(b,d):d.length===3?t.uniform3fv(b,d):t.uniform4fv(b,d))})},F=(y,p,s)=>{Me(y,p),s&&(t.bindFramebuffer(t.FRAMEBUFFER,s.fbo),t.viewport(0,0,s.w,s.h)),t.bindVertexArray(Q),t.drawArrays(t.TRIANGLES,0,3)};return{step:(y,p)=>{if(!l)return;let s=Ie;t.disable(t.BLEND);let d=[1/l.vw,1/l.vh];F(C.advect,{uVelocity:l.velocity.read,uSource:l.velocity.read,uWorld:W,uDt:y,uKeep:1},l.velocity.write),l.velocity.swap(),F(C.force,{uVelocity:l.velocity.read,uDye:l.soft,uWorld:W,uDt:y,uBuoyancy:s.buoy,uLift:s.lift,uDamping:s.damp,uSpread:s.spread,uSplash:s.splash,uFriction:s.friction,uWind:p.wind,uTurb:[s.turb*(.35+.65*p.activity),s.turbScale],uTime:p.time,uObstacle:p.calm,uKick:[s.kickNear*p.scale,s.kickW*p.scale,s.kickH*p.scale],uCraft:p.craft,uCraftMotion:p.motion,uJetA:p.jets.a,uJetB:p.jets.b,uJetBend:{f1:p.jets.bend}},l.velocity.write),l.velocity.swap(),F(C.curl,{uVelocity:l.velocity.read,uTexel:d},l.curl),F(C.vorticity,{uVelocity:l.velocity.read,uCurl:l.curl,uTexel:d,uStrength:s.vort*p.turbulence*(.4+.6*p.activity),uDt:y},l.velocity.write),l.velocity.swap(),F(C.divergence,{uVelocity:l.velocity.read,uTexel:d},l.divergence),F(C.scale,{uSource:l.pressure.read,uScale:.8},l.pressure.write),l.pressure.swap();for(let $=0;$<s.iters;$+=1)F(C.pressure,{uPressure:l.pressure.read,uDivergence:l.divergence,uTexel:d},l.pressure.write),l.pressure.swap();F(C.gradient,{uPressure:l.pressure.read,uVelocity:l.velocity.read,uTexel:d},l.velocity.write),l.velocity.swap(),F(C.dye,{uVelocity:l.velocity.read,uSource:l.dye.read,uWorld:W,uDt:y,uKeep:[Math.exp(-(s.keepD+s.keepIdle*(1-p.activity))*y),Math.exp(-s.keepH*y)],uRate:[s.rateN*p.smoke,s.rateH,s.rateK*p.smoke,s.rateC*p.smoke],uSpread:s.spread,uCol:[s.colSpread,s.colR*p.scale,s.colD,s.colU],uKick:[s.kickNear*p.scale,s.kickW*p.scale,s.kickH*p.scale],uDisperse:s.disperse,uDispV:s.dispV,uCraft:p.craft,uCraftMotion:p.motion,uGap:[p.spacing,s.gap*p.calm],uJetX:{f1:p.jetX},uJetN:p.jetN,uFloor:s.floor,uTime:p.time,uJetA:p.jets.a,uJetB:p.jets.b,uJetBend:{f1:p.jets.bend}},l.dye.write),l.dye.swap();let b=s.blur/2;F(C.blur,{uSource:l.dye.read,uStep:[b/l.dw,0]},l.temp),F(C.blur,{uSource:l.temp,uStep:[0,b/l.dh]},l.soft),t.bindTexture(t.TEXTURE_2D,l.soft.tex),t.generateMipmap(t.TEXTURE_2D)},render:(y,p,s)=>{if(!l)return;let d=Ie;t.bindFramebuffer(t.FRAMEBUFFER,null),t.viewport(0,0,y,p),t.disable(t.BLEND),F(C.render,{uDye:l.soft,uWorld:W,uDyeSize:[l.dw,l.dh],uTime:s.time,uLightTheme:s.light?1:0,uSmoke:s.smokeColor,uShade:s.shadeColor,uThrust:s.thrustColor,uLook:[d.alphaK*(.6+.4*s.activity),d.relief,d.shadow,d.alphaLod],uLook2:[d.ambient,d.key,d.wrap,d.ao],uLook3:[d.normalE,d.normalLod,d.fine,d.broad],uCol:[d.colSpread,d.colR*s.scale,d.colD,d.colU],uScale:s.scale,uGamma:d.gamma,uTone:d.tone,uLight2:[d.jetLight,d.emit,d.exposure],uThreshold:d.threshold*(.3+.7*s.activity),uCraft:s.craft,uCraftMotion:s.motion,uJetA:s.jets.a,uJetB:s.jets.b,uJetBend:{f1:s.jets.bend}})},resize:Te,clear:()=>{l&&([l.velocity.read,l.velocity.write,l.pressure.read,l.pressure.write,l.dye.read,l.dye.write,l.soft,l.temp].forEach(y=>{t.bindFramebuffer(t.FRAMEBUFFER,y.fbo),t.clearColor(0,0,0,0),t.clear(t.COLOR_BUFFER_BIT)}),t.bindTexture(t.TEXTURE_2D,l.soft.tex),t.generateMipmap(t.TEXTURE_2D))},dispose:()=>{I(),V.forEach(y=>t.deleteProgram(y.p)),t.deleteShader(L),t.deleteVertexArray(Q)}}}function Qe({children:t="Take off",onClick:h,theme:L="dark",size:V="medium",radius:_,altitude:C=170,hoverTime:Q=2.4,jets:re=2,thrusters:e=!0,trigger:B="hover",carryCursor:l=!0,ramp:W=!1,rampColor:I,smoke:Te=1,turbulence:Z=1,wobble:Me=1,thrustColor:F,smokeColor:Re,buttonColor:Ce,textColor:ne,className:ee="",style:y}){let p=de(null),s=de(null),d=de(null),b=de(null),$=de(null),j=de(null),O=de({}),pe=L==="light",ie=ze[V]||ze.medium,_e=F||(pe?"#4f8cff":"#8ec5ff"),Ve=Re||(pe?"#e9ebf0":"#eef1f6"),be=Ce||(pe?"#18181b":"#27272a"),ge=ne||(pe?"#fafafa":"#f5f5f5"),Ue=I||(pe?"#ececf0":"#25222b"),se=M(Math.round(ce(re,2)),1,X),he=se===1?0:se===2?.3:.34,Ae=e?Array.from({length:se},(te,je)=>se===1?50:50+he*100*(2*je/(se-1)-1)):[];return O.current={size:V,altitude:C,hoverTime:Q,jets:se,thrusters:!!e,trigger:B,carryCursor:l,ramp:!!W,smoke:Te,turbulence:Z,wobble:Me,thrustColor:_e,smokeColor:Ve,theme:L,onClick:h},$e(()=>{let te=At({root:p.current,canvas:s.current,button:d.current,cursor:b.current,ramp:$.current,props:O});return j.current=te,()=>{j.current=null,te.destroy()}},[]),$e(()=>{j.current&&j.current.refresh()},[V,se,e,_]),$e(()=>{j.current&&j.current.rehome()},[W]),J("div",{ref:p,className:`flying-button ${ee}`.trim(),"data-theme":L,"data-trigger":W?"click":B,style:{"--fly-bg":be,"--fly-ink":ge,"--fly-glow":_e,"--fly-ramp":Ue,"--fly-h":`${ie.h}px`,"--fly-px":`${ie.px}px`,"--fly-fs":`${ie.fs}px`,"--fly-scale":ie.k,..._!=null?{"--fly-radius":`${ce(_,0)}px`}:{},...y},children:[J("svg",{ref:$,className:"flying-button__ramp",style:W?void 0:{display:"none"},"aria-hidden":"true",children:[J("path",{className:"flying-button__ramp-body"}),J("path",{className:"flying-button__ramp-edge"})]}),J("canvas",{ref:s,className:"flying-button__smoke","aria-hidden":"true"}),J("button",{ref:d,type:"button",className:"flying-button__craft",onClick:te=>O.current.onClick&&O.current.onClick(te),children:[J("span",{className:"flying-button__face","aria-hidden":"true"}),J("span",{className:"flying-button__label",children:t}),Ae.map(te=>J("span",{className:"flying-button__pod",style:{left:`${te}%`},"aria-hidden":"true"},te))]}),J("svg",{ref:b,className:"flying-button__cursor",viewBox:"0 0 24 34","aria-hidden":"true",children:J("path",{d:"M2.2 2.1v24.6l6.1-5.9 4.1 9.6 4.4-1.9-4.1-9.4h8.6z",fill:"#0a0a0c",stroke:"#fff",strokeWidth:"1.9",strokeLinejoin:"round"})})]})}var ye=document.getElementById("flying-button-root"),Nt=()=>!!(window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches),Bt=(t,h=2e3)=>{let L=window.scrollY,V=t-L;if(Nt()||Math.abs(V)<4)return window.scrollTo(0,t),Promise.resolve();let _=document.documentElement,C=_.style.scrollBehavior;_.style.scrollBehavior="auto";let Q=performance.now();return new Promise(re=>{let e=B=>{let l=Math.min(1,(B-Q)/h),W=l<.5?4*l**3:1-(-2*l+2)**3/2;if(window.scrollTo(0,Math.round(L+V*W)),l<1){requestAnimationFrame(e);return}_.style.scrollBehavior=C,re()};requestAnimationFrame(e)})},Ft=()=>{let t=document.getElementById("plans");if(!t||!ye)return;let h=Math.max(0,t.getBoundingClientRect().top+window.scrollY-92);ye.setAttribute("data-launching",""),Bt(h).then(()=>ye.removeAttribute("data-launching"))};ye&&(ye.dataset.mounted="true",ye.querySelector(".launch-fallback")?.remove(),ct(J(Qe,{theme:"light",size:"large",radius:18,altitude:170,hoverTime:2.4,jets:2,thrusters:!0,trigger:"hover",carryCursor:!0,smoke:1,turbulence:1,wobble:1,ramp:!1,buttonColor:"#e10600",textColor:"#ffffff",thrustColor:"#ffd400",smokeColor:"#f4ead6",onClick:Ft,children:"Build your lap plan"}),ye));
