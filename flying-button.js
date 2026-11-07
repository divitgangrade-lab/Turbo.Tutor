import"./island-chunks/chunk-XKFHMPKF.js";import{g as ct,j as Fe,l as pe,p as W}from"./island-chunks/chunk-CANNF34S.js";var q=1100,pt=380,mt=10,Y=q/(2*pt),yt=5,J=4,it=.55,Ge=q*.75,Ke=.42,Pe={small:{h:36,px:16,fs:13,k:.82},medium:{h:44,px:22,fs:14,k:1},large:{h:52,px:26,fs:16,k:1.18},"extra-large":{h:60,px:30,fs:18,k:1.36}},M=(t,x,R)=>Math.min(R,Math.max(x,t)),ne=(t,x)=>Number.isFinite(Number(t))&&t!==null&&t!==""?Number(t):x,me=t=>{let x=M(t,0,1);return x*x*(3-2*x)},lt=t=>{let x=M(t,0,1);return x*x*x*(10+x*(6*x-15))},ut=t=>{let x=M(t,0,1);return 30*x*x*(1-x)*(1-x)},bt=t=>{let x=M(t,0,1);return 60*x*(1-x)*(1-2*x)},Be=(t,x)=>Math.sin(t*1.31+x)*.5+Math.sin(t*2.73+x*1.7)*.3+Math.sin(t*5.19+x*2.3)*.2,gt=(t,x)=>Math.cos(t*1.31+x)*.655+Math.cos(t*2.73+x*1.7)*.819+Math.cos(t*5.19+x*2.3)*1.038,ft=t=>{let x=String(t||"").replace("#",""),R=x.length===3?x.replace(/(.)/g,"$1$1"):x.padEnd(6,"0").slice(0,6),H=parseInt(R,16);return Number.isFinite(H)?[(H>>16&255)/255,(H>>8&255)/255,(H&255)/255]:[1,1,1]},wt=`#version 300 es
out vec2 vUv;
void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  vUv = p;
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`,oe=`#version 300 es
precision highp float;
precision highp sampler2D;
in vec2 vUv;
out vec4 outColor;
`,Oe=`
uniform vec4 uJetA[${J}];
uniform vec4 uJetB[${J}];
uniform float uJetBend[${J}];
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
`,kt=`${oe}
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
}`,Tt=`${oe}
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
  for (int i = 0; i < ${J}; i++) {
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
  for (int i = 0; i < ${J}; i++) {
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
}`,Mt=`${oe}
uniform sampler2D uVelocity;
uniform vec2 uTexel;
void main() {
  float L = textureLod(uVelocity, vUv - vec2(uTexel.x, 0.0), 0.0).y;
  float R = textureLod(uVelocity, vUv + vec2(uTexel.x, 0.0), 0.0).y;
  float B = textureLod(uVelocity, vUv - vec2(0.0, uTexel.y), 0.0).x;
  float T = textureLod(uVelocity, vUv + vec2(0.0, uTexel.y), 0.0).x;
  outColor = vec4(0.5 * (R - L - T + B), 0.0, 0.0, 1.0);
}`,Ct=`${oe}
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
}`,Lt=`${oe}
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
}`,ht=`
float pressureAt(sampler2D tex, vec2 uv, vec2 texel, float c, int side) {
  if (side == 0 && uv.x - texel.x < 0.0) return 0.0;
  if (side == 1 && uv.x + texel.x > 1.0) return 0.0;
  if (side == 2 && uv.y - texel.y < 0.0) return c;
  if (side == 3 && uv.y + texel.y > 1.0) return 0.0;
  vec2 o = side == 0 ? vec2(-texel.x, 0.0) : side == 1 ? vec2(texel.x, 0.0) : side == 2 ? vec2(0.0, -texel.y) : vec2(0.0, texel.y);
  return textureLod(tex, uv + o, 0.0).x;
}
`,Et=`${oe}
uniform sampler2D uPressure;
uniform sampler2D uDivergence;
uniform vec2 uTexel;
${ht}
void main() {
  float C = textureLod(uPressure, vUv, 0.0).x;
  float L = pressureAt(uPressure, vUv, uTexel, C, 0);
  float R = pressureAt(uPressure, vUv, uTexel, C, 1);
  float B = pressureAt(uPressure, vUv, uTexel, C, 2);
  float T = pressureAt(uPressure, vUv, uTexel, C, 3);
  float div = textureLod(uDivergence, vUv, 0.0).x;
  float pr = (L + R + B + T - div) * 0.25;
  outColor = vec4(abs(pr) < 1e6 ? pr : 0.0, 0.0, 0.0, 1.0);
}`,Dt=`${oe}
uniform sampler2D uPressure;
uniform sampler2D uVelocity;
uniform vec2 uTexel;
${ht}
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
}`,St=`${oe}
uniform sampler2D uSource;
uniform vec2 uStep;
void main() {
  vec2 c = textureLod(uSource, vUv, 0.0).xy * 0.2270270;
  c += textureLod(uSource, vUv + uStep * 1.3846154, 0.0).xy * 0.3162162;
  c += textureLod(uSource, vUv - uStep * 1.3846154, 0.0).xy * 0.3162162;
  c += textureLod(uSource, vUv + uStep * 3.2307692, 0.0).xy * 0.0702703;
  c += textureLod(uSource, vUv - uStep * 3.2307692, 0.0).xy * 0.0702703;
  outColor = vec4(c, 0.0, 1.0);
}`,Rt=`${oe}
uniform sampler2D uSource;
uniform float uScale;
void main() {
  outColor = textureLod(uSource, vUv, 0.0) * uScale;
}`,_t=`${oe}
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
uniform float uJetX[${J}];
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
    for (int k = 0; k < ${J}; k++) {
      if (float(k) >= uJetN) break;
      nearest = min(nearest, abs(lq.x - uJetX[k]));
      outer = max(outer, abs(uJetX[k]));
    }
    float wx = uGap.x > 1.0 ? smoothstep(uGap.x * 0.22, uGap.x * 0.4, nearest) * (1.0 - smoothstep(outer - uGap.x * 0.1, outer, abs(lq.x))) : 0.0;
    val.x *= exp(-uGap.y * wx * wy * uDt);
  }
  val.x = max(val.x - uFloor * uDt, 0.0);
  vec2 p = vUv * uWorld;
  for (int i = 0; i < ${J}; i++) {
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
}`,Ut=`${oe}
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
  for (int i = 0; i < ${J}; i++) {
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
  for (int i = 0; i < ${J}; i++) {
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
}`,ze={colSpread:.1,colR:3.6,colD:1.25,colU:420,splash:400,friction:5,disperse:.6,dispV:60,gap:10,wind:8,turb:350,turbScale:34,jetLight:.3,threshold:.035,blur:3,emit:0,exposure:1.3,tone:1,gamma:.6,kickNear:45,kickW:18,kickH:14,vort:6,spread:.1,floor:.02,keepD:.3,keepIdle:.45,keepH:1.6,rateN:0,rateH:6,rateK:20,rateC:3,buoy:330,lift:22,damp:.55,radius:6,speed:380,reach:.9,forceMax:240,alphaK:4,relief:9,shadow:.026,alphaLod:0,ambient:.58,key:.82,wrap:.35,ao:.35,normalE:3,normalLod:-.8,fine:.35,broad:.9,iters:20};function jt({root:t,canvas:x,button:R,cursor:H,ramp:N,props:L}){let re=x.getContext("webgl2",{alpha:!0,premultipliedAlpha:!0,antialias:!1,depth:!1,stencil:!1,powerPreference:"high-performance"}),ce=typeof window<"u"&&window.matchMedia?window.matchMedia("(prefers-reduced-motion: reduce)"):null,e={W:0,H:0,dpr:1,bw:0,bh:0,x:0,vx:0,y:-Y,vy:0,th:0,w:0,fvx:0,fvy:0,thrust:[0,0,0,0],delay:[0,0,0,0],phase:"rest",pt:0,clock:0,seed:Math.random()*100,wind:1,alt:160,climbT:1.6,y0:0,vrPrev:0,hold:2.4,xRef:0,landX:0,boost:!1,contact:!0,placed:!1,track:null,back:null,flip:null,rampKey:"",rampGeo:null,strip:null,u:0,v:0,target:{x:0,y:0},pointer:{in:!1,x:0,y:0,type:"mouse"},off:{x:0,y:0},attached:!1,hover:!1,armed:!0,carry:!1,pressed:!1,press:null,drag:null,suppress:!1,lastC:null,lastTh:0,quiet:0,running:!1,last:0,raf:0,simTime:0,activity:0},z=null;if(re&&(re.getExtension("EXT_color_buffer_float")||re.getExtension("EXT_color_buffer_half_float")))try{z=At(re)}catch{z=null}let f=()=>!!(ce&&ce.matches),X=()=>(Pe[L.current.size]||Pe.medium).k,I=()=>yt*X(),ke=()=>M(Math.round(ne(L.current.jets,2)),1,J),Q=()=>{let o=ke();if(o===1)return[0];let a=e.bw*(o===2?.3:.34);return Array.from({length:o},(r,n)=>a*(2*n/(o-1)-1))},Te=()=>{let o=Q();return o.length>1?[o[0],o[o.length-1]]:[-.3*e.bw,.3*e.bw]},$=()=>e.thrust[0]+e.thrust[1]+e.thrust[2]+e.thrust[3],Se=()=>e.phase==="ignite"||e.phase==="climb"||e.phase==="hover"||e.phase==="descend"||e.phase==="drag",Me=()=>e.phase==="drive"||e.phase==="loop"||e.phase==="flip"||e.phase==="return",se=()=>[e.bw/2+4,Math.max(e.bw/2+4,e.W-e.bw/2-4)],Z=()=>!!L.current.ramp,y=()=>{let o=I()+e.bh/2,a=`${e.W}|${e.H}|${e.bw}|${o}`;if(e.rampKey===a&&e.rampGeo)return e.rampGeo;let r=Math.max(e.H*.24,I()+e.bh+40),n=1/r,u=r*.4,l=r*Math.PI/2-u,d=(D,S)=>{let P=[[u,0,n],[l,n,n],[u,n,0],[D,0,0],[u,0,n],[l,n,n],[u,n,0],[S,0,0]],U={ss:[0],xs:[0],ys:[0],ps:[0],ks:[0]},V=0,G=0,K=0,le=0;return P.forEach(([ue,ge,Ce])=>{let ve=Math.max(1,Math.round(ue/1.5)),fe=ue/ve;for(let xe=0;xe<ve;xe+=1){let Le=ge+(Ce-ge)*((xe+.5)/ve),Ee=K+Le*fe/2;V+=Math.cos(Ee)*fe,G+=Math.sin(Ee)*fe,K+=Le*fe,le+=fe,U.ss.push(le),U.xs.push(V),U.ys.push(G),U.ps.push(K),U.ks.push(ge+(Ce-ge)*((xe+1)/ve))}}),U},k=d(0,0),m=Math.max(0,e.H*.66-Math.max(...k.ys)),C=d(m,Math.max(48,e.W*.16)),w=M(r*.12,8,16),E=e.W-Math.max(18,e.W*.05)-w-Math.max(...C.xs),_=C.xs.map(D=>D+E),B=C.ss.length-1,v=C.ys.findIndex(D=>D>3),i=v<0?_[B]:_[v],T={...C,xs:_,r,T:w,x0:E,foot:i,S:C.ss[B],clear:Math.min(i,_[B])-12,ok:Math.max(...C.ys)+w<e.H-8};return e.rampKey=a,e.rampGeo=T,T},h=()=>{let[o,a]=se();if(!Z())return M(e.W/2,o,a);let r=y();return M(Math.min(r.foot*.5,r.x0-90,r.clear-e.bw/2-40),o,a)},s=()=>({x:e.x,y:I()+e.bh/2+e.y+Y}),p=()=>{let o=s(),a=Math.cos(e.th),r=Math.sin(e.th),n=L.current.thrusters?-(e.bh/2+I())+1:-(e.bh/2)+2;return Q().map(u=>({x:o.x+u*a-n*r,y:o.y+u*r+n*a,dx:r,dy:-a}))},b=()=>{let o=s();return{x:o.x,y:e.H-o.y}},F=(o,a,r,n,u,l,d)=>{let k=u[0]-l[0],m=d[0]-l[0],C=n[0]-u[0]+l[0]-d[0],w=u[1]-l[1],E=d[1]-l[1],_=n[1]-u[1]+l[1]-d[1],B=k*E-m*w||1e-6,v=(C*E-m*_)/B,i=(k*_-C*w)/B,T=u[0]-n[0]+v*u[0],D=d[0]-n[0]+i*d[0],S=u[1]-n[1]+v*u[1],P=d[1]-n[1]+i*d[1],U=n[0]-T*o/a,V=n[1]-S*o/a;return Math.abs(v)<1e-7&&Math.abs(i)<1e-7?`matrix(${[T/a,S/a,D/r,P/r,U,V].map(K=>K.toFixed(6)).join(",")})`:`matrix3d(${[T/a,S/a,0,v/a,D/r,P/r,0,i/r,0,0,1,0,U,V,0,1-v*o/a].map(K=>K.toFixed(6)).join(",")})`},j=()=>{e.strip&&(e.strip.wrap.remove(),e.strip.ink.remove(),e.strip=null,R.style.visibility="")},O=()=>{j();let o=e.track;if(!o)return;let a=o.geo,r=I()+e.bh/2,n=[0];for(let v=1;v<a.ss.length;v+=1){let i=(a.ks[v]+a.ks[v-1])/2;n.push(n[v-1]+(a.ss[v]-a.ss[v-1])*Math.max(1-i*r,.2))}let u=M(Math.round(e.bw/8),8,32),l=document.createElement("div");l.setAttribute("aria-hidden","true"),l.style.cssText="position:absolute;inset:0;z-index:1;pointer-events:none";let d=document.createElement("div");d.setAttribute("aria-hidden","true"),d.style.cssText="position:absolute;inset:0;z-index:2;pointer-events:none;will-change:transform";let k=Array.from(R.children),m=k[1],C=k.slice(2).map(v=>{let i=v.cloneNode(!0);return i.style.left="0px",i.style.top="0px",i.style.transformOrigin="0 0",l.appendChild(i),{el:i,x:v.offsetLeft,y:v.offsetTop+v.offsetHeight/2,k:1}}),w=[];for(let v=0;v<u;v+=1){let i=R.cloneNode(!0);i.removeAttribute("data-hover"),i.removeAttribute("data-pressed"),i.setAttribute("tabindex","-1"),i.setAttribute("inert",""),Array.from(i.children).slice(1).forEach(S=>{S.style.visibility="hidden"});let T=e.bw*v/u-(v?.75:2),D=e.bw*(v+1)/u+(v<u-1?.75:2);i.style.visibility="visible",i.style.transformOrigin="0 0",i.style.clipPath=`polygon(${T}px -2px, ${D}px -2px, ${D}px ${e.bh+2}px, ${T}px ${e.bh+2}px)`,l.appendChild(i),w.push(i)}let E=[],_=m&&m.textContent||"",B=document.createElement("canvas").getContext("2d");if(m&&B&&_.trim()&&!m.children.length){let v=getComputedStyle(m),i=`${v.fontStyle} ${v.fontWeight} ${v.fontSize} ${v.fontFamily}`;B.font=i;let T=Array.from(_),D=U=>B.measureText(T.slice(0,U).join("")).width,S=D(T.length)||1,P=m.offsetTop+m.offsetHeight/2;T.forEach((U,V)=>{let G=document.createElement("span");G.textContent=U,G.style.cssText=`position:absolute;left:0;top:0;white-space:pre;line-height:1;transform-origin:0 0;font:${i};color:${v.color}`,d.appendChild(G),E.push({el:G,x:m.offsetLeft+(D(V)+D(V+1))/2*(m.offsetWidth/S),y:P,k:.5})})}else if(m){let v=m.cloneNode(!0);v.style.position="absolute",v.style.left="0px",v.style.top="0px",v.style.transformOrigin="0 0",d.appendChild(v),E.push({el:v,x:m.offsetLeft+m.offsetWidth/2,y:m.offsetTop+m.offsetHeight/2,k:0})}t.appendChild(l),t.appendChild(d),R.style.visibility="hidden",e.strip={wrap:l,ink:d,parts:w,n:u,sn:n,pods:C,items:E}},he=()=>{let o=e.strip,a=e.track;if(!o||!a)return;let r=a.geo,n=r.ss[r.ss.length-1],u=o.sn[o.sn.length-1],l=(i,T,D)=>{let S=0,P=i.length-1;for(;P-S>1;){let U=S+P>>1;i[U]<=D?S=U:P=U}return T[S]+(T[P]-T[S])*((D-i[S])/(i[P]-i[S]))},d=i=>i<=0?i:i>=n?u+i-n:l(r.ss,o.sn,i),k=i=>i<=0?i:i>=u?n+i-u:l(o.sn,r.ss,i),m=d(e.u),C=I(),w=(i,T)=>{let[D,S,P]=Ue(r,k(m+i-e.bw/2)),U=C+e.bh-T;return[D-Math.sin(P)*U,e.H-S-Math.cos(P)*U,P]},E=(i,T,D,S)=>{i.style.transform=`translate(${T.toFixed(2)}px, ${D.toFixed(2)}px) rotate(${(-S).toFixed(4)}rad) translate(-50%, -50%)`},_=e.bw/o.n,B=[],v=[];for(let i=0;i<=o.n;i+=1)B.push(w(i*_,0)),v.push(w(i*_,e.bh));o.parts.forEach((i,T)=>{i.style.transform=F(T*_,_,e.bh,B[T],B[T+1],v[T+1],v[T])}),o.pods.forEach(i=>{let[T,D,S]=w(i.x,i.y);E(i.el,T,D,S)}),o.items.forEach(i=>{let[T,D,S]=w(i.x,i.y),[P,U,V]=w(e.bw/2,i.y),G=i.x-e.bw/2,K=P+Math.cos(V)*G,le=U-Math.sin(V)*G;E(i.el,K+(T-K)*i.k,le+(D-le)*i.k,V+(S-V)*i.k)})},ie=()=>{e.strip&&he();let o=s(),a=o.x-e.bw/2,r=e.H-o.y-e.bh/2;R.style.transform=`translate3d(${a.toFixed(2)}px, ${r.toFixed(2)}px, 0) rotate(${(-e.th).toFixed(5)}rad)`,t.style.setProperty("--fly-thrust",M($()*.9,0,1.2).toFixed(3))},Re=()=>{if(!N)return;let o=y(),a=N.querySelectorAll("path"),r=a[0],n=a[1],u=d=>d.toFixed(1),l=d=>{let k=[];for(let C=0;C<o.ss.length;C+=2){let w=o.ps[C];k.push(`${u(o.xs[C]+Math.sin(w)*d)} ${u(e.H-o.ys[C]+Math.cos(w)*d)}`)}let m=o.ps[o.ss.length-1];return k.push(`${u(o.xs[o.ss.length-1]+Math.sin(m)*d)} ${u(e.H-o.ys[o.ss.length-1]+Math.cos(m)*d)}`),`M ${k.join(" L ")}`};N.setAttribute("viewBox",`0 0 ${u(e.W)} ${u(e.H)}`),N.style.visibility=o.ok?"":"hidden",r&&(r.setAttribute("d",l(o.T/2)),r.setAttribute("stroke-width",u(o.T))),n&&n.setAttribute("d",l(.75))},Ve=o=>{let a=new Float32Array(J*4),r=new Float32Array(J*4),n=[0,0,0,0],u=o.length,l=ze,d=X();return o.forEach((k,m)=>{let C=M(e.thrust[m]*u,0,2),w=k.dy<-.2?k.y/-k.dy:l.forceMax;a.set([k.x,k.y,k.dx,k.dy],m*4),r.set([l.speed*Math.sqrt(C),l.radius*d,Math.min(l.forceMax,w*l.reach),C>.004?C:0],m*4);let E=e.fvx*-k.dy+e.fvy*k.dx;n[m]=M(-E*.22,-.55*w,.55*w)}),{a,b:r,bend:n}},ye=o=>{if(!z)return;let a=L.current,r=p(),n=Ve(r),u=s(),l=Q(),d=X(),k=[u.x,u.y,e.bw/2,e.bh/2],m=[e.vx,e.vy,e.th,e.w],C=(1-me((Math.abs(e.fvx)-40)/100))*(1-me((Math.abs(e.th)-.1)/.2))*(Me()?0:1);o>0&&(e.simTime+=o,z.step(o,{jets:n,craft:k,motion:m,calm:C,scale:d,activity:e.activity,jetX:[0,1,2,3].map(E=>E<l.length?l[E]:0),jetN:l.length,spacing:l.length>1?l[1]-l[0]:0,wind:e.wind*ze.wind,time:e.simTime,smoke:M(ne(a.smoke,1),0,3),turbulence:M(ne(a.turbulence,1),0,3)}));let w=ft(a.smokeColor);z.render(x.width,x.height,{jets:n,craft:k,motion:m,scale:d,activity:e.activity,time:e.simTime,light:a.theme==="light",smokeColor:w,shadeColor:w.map((E,_)=>E*.74+[0,.012,.045][_]),thrustColor:ft(a.thrustColor)})},be=()=>{let o=t.getBoundingClientRect(),a=e.W;if(e.W=Math.max(1,o.width),e.H=Math.max(1,o.height),e.bw=R.offsetWidth,e.bh=R.offsetHeight,e.placed?a>0&&a!==e.W&&(e.x*=e.W/a):(e.x=h(),e.placed=!0),!Me()){let[u,l]=se();e.x=M(e.x,u,l)}e.dpr=Math.min(window.devicePixelRatio||1,1);let r=Math.round(e.W*e.dpr),n=Math.round(e.H*e.dpr);(x.width!==r||x.height!==n)&&(x.width=r,x.height=n),z&&z.resize(e.W,e.H),Re(),t.dataset.ready="",ie(),e.running||ye(0)},_e=(o,a,r=0)=>{let n=b(),u=e.th,l=o-n.x,d=a-n.y,k=l*Math.cos(u)-d*Math.sin(u),m=l*Math.sin(u)+d*Math.cos(u);return Math.abs(k)<=e.bw/2+2+r&&m>=-e.bh/2-2-r&&m<=e.bh/2+I()+r},ae=()=>{e.pt=0,e.armed=!1,e.seed=Math.random()*100,e.wind=Math.random()<.5?-1-Math.random():1+Math.random(),e.vrPrev=0,e.quiet=0,e.boost=!1},de=()=>{if(e.phase!=="rest"||f())return!1;let o=L.current;ae(),e.phase="ignite",e.delay=e.delay.map(()=>Math.random()*.07);let a=e.H-e.bh-I()-30-Y;return e.alt=M(e.y+ne(o.altitude,170),e.y+24,Math.max(e.y+24,a)),e.climbT=1.15+(e.alt-e.y)/420,e.hold=Math.max(0,ne(o.hoverTime,2.4)),e.xRef=e.x,qe(),!0},Ue=(o,a)=>{if(a<=0)return[o.x0+a,0,0,0];let r=0,n=o.ss.length-1;if(a>=o.ss[n]){let l=o.ps[n];return[o.xs[n]+Math.cos(l)*(a-o.ss[n]),o.ys[n]+Math.sin(l)*(a-o.ss[n]),l,0]}for(;n-r>1;){let l=r+n>>1;o.ss[l]<=a?r=l:n=l}let u=(a-o.ss[r])/(o.ss[n]-o.ss[r]);return[o.xs,o.ys,o.ps,o.ks].map(l=>l[r]+(l[n]-l[r])*u)},ee=(o,a)=>{let[r,n,u,l]=Ue(o.geo,a);return{x:r-Math.sin(u)*o.base,cy:n+Math.cos(u)*o.base,th:u,bend:l*o.base}},je=()=>{if(e.phase!=="rest"||f()||!Z())return!1;let o=y(),a=o.x0-e.x;if(a<60||!o.ok)return de();ae();let r=I()+e.bh/2,n=Math.max(...o.ys)-2*r,u=Math.sqrt(2*Ge*n+2.2*Ge*(o.r-r));return e.track={geo:o,base:r,v0:u,acc:u*u/(2*a)},e.phase="drive",e.u=-a,e.v=0,e.thrust=[0,0,0,0],O(),qe(),!0},Ze=o=>{let[a,r]=se(),n=e.x+o;Z()&&(n=Math.min(n,y().clear-e.bw/2)),e.landX=M(n,a,r)},dt=o=>{let a=L.current,r=M(ne(a.wobble,1),0,3);if(e.pt+=o,e.clock+=o,e.phase==="return"){let c=e.back,g=Math.min(e.pt/c.time,1);e.x=c.from+(c.to-c.from)*lt(g),e.vx=(c.to-c.from)*ut(g)/c.time,e.y=-Y,e.vy=0,e.th=0,e.w=0,g>=1&&(e.phase="rest",e.pt=0,e.vx=0);return}if(e.phase==="drive"||e.phase==="loop"){let c=e.track,g=ee(c,e.u);e.phase==="drive"?e.v=Math.min(c.v0,e.v+c.acc*o):e.v=Math.sqrt(Math.max(c.v0*c.v0-2*Ge*(g.cy-c.base),.2*c.v0*c.v0)),e.u+=e.v*o/Math.max(1-g.bend,.25),e.phase==="drive"&&e.u>=0&&(e.phase="loop");let A=ee(c,e.u);e.vx=(A.x-g.x)/o,e.vy=(A.cy-g.cy)/o,e.w=(A.th-g.th)/o,e.x=A.x,e.y=A.cy-I()-e.bh/2-Y,e.th=A.th,e.thrust=e.thrust.map(te=>te*Math.exp(-o/.1)),e.phase==="loop"&&e.u>=c.geo.S&&(j(),e.phase="flip",e.pt=0,e.flip={th:e.th,w:e.w});return}let n=(e.bw*e.bw+e.bh*e.bh)/12,u=Math.max(Math.cos(e.th),.5),l=0,d=!1,k=e.xRef,m=3,C=3.6,w=null;if(e.phase==="flip"){let c=Math.min(e.pt/Ke,1),g=e.flip,A=Math.PI*2;w={th:(2*c*c*c-3*c*c+1)*g.th+(c*c*c-2*c*c+c)*Ke*g.w+(3*c*c-2*c*c*c)*A,w:(6*c*c-6*c)*(g.th-A)/Ke+(3*c*c-4*c+1)*g.w},l=2.4*me((Math.cos(w.th)-.8)/.15);let te=e.y+Y<e.bh*.6;(c>=1||te)&&(w=null,e.th-=Math.PI*2*Math.round(e.th/(Math.PI*2)),e.phase="descend",e.pt=0,e.boost=!0,e.vrPrev=e.vy,Ze(e.vx*Math.abs(e.vx)/700))}if(e.phase==="ignite"&&(l=.9*me(e.pt/.5),e.pt>=.5&&(e.phase="climb",e.pt=0,e.y0=e.y)),e.phase==="climb"){let c=e.pt/e.climbT,g=e.alt-e.y0,A=e.y0+g*lt(c),te=g*ut(c)/e.climbT,we=g*bt(c)/(e.climbT*e.climbT);l=(q+we+30*(A-e.y)+8*(te-e.vy))/(q*u),d=!0,c>=1&&(e.phase="hover",e.pt=0)}else if(e.phase==="hover"){let c=e.clock*.8,g=e.alt+3.5*r*Be(c,e.seed),A=3.5*r*.8*gt(c,e.seed);l=(q+30*(g-e.y)+8*(A-e.vy))/(q*u),d=!0,e.pt>=e.hold&&(e.phase="descend",e.pt=0,e.vrPrev=0,Ze(0))}else if(e.phase==="drag"){let c=e.target.y-I()-e.bh/2-Y;l=(q+34*(c-e.y)-10*e.vy)/(q*u),d=!0}else if(e.phase==="descend"){k=e.landX,m=e.boost?5:4,C=e.boost?4.6:4.2;let c=170,g=32,A=e.boost?me((Math.abs(e.landX-e.x)-20)/40):me((Math.abs(e.landX-e.x)-3)/23),te=Math.max(e.y+Y,0),we=(g+(c-g)*(1-Math.exp(-te/52)))*(1-(e.boost?.45:.88)*A),Xe=e.boost?c*3:c*me(e.pt/.9)+1,De=-Math.min(we,Xe),$e=M((De-e.vrPrev)/Math.max(o,1e-4),-600,600);e.vrPrev=De,l=(q+$e+(e.boost?9:7)*(De-e.vy))/(q*u),d=!0,e.contact&&e.pt>.3&&(e.phase="landed",e.pt=0,e.boost=!1)}else if(e.phase==="landed"&&(l=0,e.pt>.6&&$()<.03)){let c=Z()&&e.track?h():e.x;e.phase=Math.abs(c-e.x)>6?"return":"rest",e.pt=0,e.thrust=[0,0,0,0],e.vy=0,e.w=0,e.vx=0,e.track=null,e.back={from:e.x,to:c,time:M(Math.abs(c-e.x)/200,.7,1.8)}}l=Number.isFinite(l)?M(l,0,e.boost||e.phase==="flip"?2.6:1.9):1;let E=Q(),_=E.length,B=E.reduce((c,g)=>c+g*g,0),v=e.phase==="drag"?M(100*(e.target.x-e.x)-17*e.vx,-2400,2400):0,i=0;if(d){let c=.8*r*Be(e.clock*1.7,e.seed+3),g=e.phase==="drag"?v*.75:m*(k-e.x)-C*e.vx,A=e.boost?.45:.32,te=M(-Math.atan2(g,q),-A,A);i=-81*(e.th-te)-14*e.w-c}let T=(e.boost||e.phase==="flip"?2.6:2.4)/_,D=(c,g)=>c+(g-c)*(1-Math.exp(-o/(g>c?.08:.17))),S=B>1?i*n/(q*B):0,P=Math.abs(S)*Math.max(0,...E.map(Math.abs)),U=Math.min(l/_,Math.max(T-P,T*.5)),V=0;for(let c=0;c<J;c+=1){let g=0;c<_&&(g=M(U+S*E[c],0,T),e.phase==="ignite"&&e.pt<e.delay[c]&&(g=0)),e.thrust[c]=D(e.thrust[c],g),c<_&&(V+=e.thrust[c]*E[c])}let G=$()*q,K=e.phase==="drag"?v:-G*Math.sin(e.th)-.8*e.vx,le=G*Math.cos(e.th)-q-.3*e.vy,ue=e.phase==="flip"?0:V*q/n-1.2*e.w;d&&(e.phase!=="drag"&&(K+=12*r*Be(e.clock*.7,e.seed+7)),ue+=.9*r*Be(e.clock*2.3,e.seed+11),B<1&&(ue+=i),Math.abs(e.th)>.35&&(ue-=(e.th-Math.sign(e.th)*.35)*160));let ge=s(),Ce=Math.cos(e.th),ve=Math.sin(e.th),fe=-(e.bh/2+I()),xe=!1;e.phase!=="flip"&&Te().forEach(c=>{let g=c*Ce-fe*ve,A=c*ve+fe*Ce,te=ge.y+A,we=Y-te;if(we>0){xe=!0;let Xe=e.vy+e.w*g,De=e.vx-e.w*A,$e=Math.max(0,pt*we-mt*Xe),nt=-10*De;le+=$e,K+=nt,ue+=(g*$e-A*nt)/n}}),e.contact=xe,e.vx=M(e.vx+K*o,-1500,1500),e.vy=M(e.vy+le*o,-1500,1500),e.w=M(e.w+ue*o,-14,14),e.x+=e.vx*o,e.y+=e.vy*o,e.th+=e.w*o,w&&(e.th=w.th,e.w=w.w),e.phase!=="flip"&&Math.abs(e.th)>it&&(e.th=Math.sign(e.th)*it,e.w*e.th>0&&(e.w=0));let[Le,Ee]=se();(e.x<Le||e.x>Ee)&&(e.x=M(e.x,Le,Ee),e.vx=0),e.y+Y<-40&&(e.y=-Y,e.vy=0),Number.isFinite(e.y+e.x+e.th+e.vy+e.vx+e.w+$())||(Object.assign(e,{x:e.W/2,vx:0,y:-Y,vy:0,th:0,w:0,thrust:[0,0,0,0],phase:"rest"}),e.drag=null)},We=o=>{let a=L.current,r=e.pointer,n=b();if(e.attached&&!e.drag&&e.lastC){let m=r.x+e.off.x,C=r.y+e.off.y,w=-(e.th-e.lastTh),E=m-e.lastC.x,_=C-e.lastC.y,B=n.x+E*Math.cos(w)-_*Math.sin(w),v=n.y+E*Math.sin(w)+_*Math.cos(w);e.off.x+=B-m,e.off.y+=v-C}e.lastC=n,e.lastTh=e.th;let u=r.x+e.off.x,l=r.y+e.off.y,d=r.in&&_e(u,l,e.attached||e.drag?10:0);if(d!==e.hover&&(e.hover=d,d?R.dataset.hover="":delete R.dataset.hover),!d&&!e.drag&&(e.attached=!1,e.phase==="rest"&&(e.armed=!0)),d&&e.armed&&e.phase==="rest"&&r.type==="mouse"&&a.trigger!=="click"&&!Z()&&de()&&(e.attached=!!a.carryCursor),e.phase==="rest"&&Math.abs(e.off.x)+Math.abs(e.off.y)<12){let m=Math.exp(-o*6);e.off.x*=m,e.off.y*=m}Math.abs(e.off.x)+Math.abs(e.off.y)<.3&&(!e.attached||e.phase==="rest")&&(e.off.x=0,e.off.y=0,e.phase==="rest"&&(e.attached=!1));let k=!!a.carryCursor&&r.in&&r.type==="mouse"&&(e.attached||!!e.drag||e.off.x!==0||e.off.y!==0);k!==e.carry&&(e.carry=k,k?t.dataset.carry="":delete t.dataset.carry),k&&H&&(H.style.transform=`translate3d(${(u-1.8).toFixed(2)}px, ${(l-1.75).toFixed(2)}px, 0)`)},et=o=>{e.raf=0;let a=e.last?M((o-e.last)/1e3,0,1/30):1/60;if(e.last=o,a>0){if(e.phase!=="rest")for(let d=0;d<6;d+=1)dt(a/6);let r=1-Math.exp(-a/.12);e.fvx+=(e.vx-e.fvx)*r,e.fvy+=(e.vy-e.fvy)*r,We(a),ie(),ye(a);let n=$();e.quiet=n>.01||e.phase!=="rest"?0:e.quiet+a;let u=n>.05?1:0;e.activity+=(u-e.activity)*(1-Math.exp(-a/(u?.25:1.6)))}e.phase!=="rest"||e.quiet<7||e.carry?e.raf=requestAnimationFrame(et):(e.running=!1,e.last=0,z&&z.clear(),ye(0))},qe=()=>{e.raf||(e.running=!0,e.raf=requestAnimationFrame(et))},tt=o=>{let a=t.getBoundingClientRect();return{x:o.clientX-a.left,y:o.clientY-a.top}},Je=()=>{let o=e.pointer,a=o.type==="mouse";return{x:o.x+(a?e.off.x:0),y:o.y+(a?e.off.y:0)}},ot=()=>{if(!e.drag)return;let o=Je(),[a,r]=se(),n=I()+e.bh/2;e.target.x=M(o.x-e.drag.gx,a,r),e.target.y=M(e.H-(o.y-e.drag.gy),n,Math.max(n,e.H-e.bh/2-6))},vt=o=>{let a=Je(),r=b();e.drag={gx:a.x-r.x,gy:a.y-r.y},e.phase="drag",e.pt=0,e.attached=!1,e.pressed=!1,e.suppress=!0,e.boost=!1,delete R.dataset.pressed,t.dataset.dragging="";try{t.setPointerCapture(o.pointerId)}catch{}ot()},xt=o=>{e.drag=null,e.press=null,delete t.dataset.dragging;try{t.releasePointerCapture(o.pointerId)}catch{}e.phase="hover",e.pt=0,e.alt=e.y;let[a,r]=se();e.xRef=M(e.x+e.vx*.3,a,r),e.hold=Math.min(Math.max(0,ne(L.current.hoverTime,2.4)),.9)},Ae=o=>{let a=tt(o),r=e.pointer;if(r.in&&!e.attached&&!e.drag&&(e.off.x||e.off.y)){let n=Math.exp(-Math.hypot(a.x-r.x,a.y-r.y)/110);e.off.x*=n,e.off.y*=n}r.x=a.x,r.y=a.y,r.in=!0,r.type=o.pointerType||"mouse",e.press&&!e.drag&&Se()&&Math.hypot(a.x-e.press.x,a.y-e.press.y)>4&&vt(o),e.drag&&ot(),We(0),(e.carry||e.phase!=="rest")&&qe()},at=()=>{e.drag||(e.pointer.in=!1,e.attached=!1,e.off.x=0,e.off.y=0,We(0))},rt=o=>{let a=tt(o),r=e.pointer;r.x=a.x,r.y=a.y,r.in=!0,r.type=o.pointerType||"mouse",e.suppress=!1;let n=Je();_e(n.x,n.y,e.attached?10:0)&&(r.type!=="mouse"&&e.phase==="rest"&&L.current.trigger!=="click"&&!Z()&&de(),e.press={x:a.x,y:a.y},e.carry&&r.type==="mouse"&&(e.pressed=!0,R.dataset.pressed=""))},Ne=o=>{if(e.drag){xt(o);return}e.press=null,e.pressed&&(e.pressed=!1,delete R.dataset.pressed,e.carry&&e.hover&&(e.phase==="rest"&&Z()?je():L.current.trigger==="click"&&de()&&(e.attached=!!L.current.carryCursor),L.current.onClick&&L.current.onClick(o)))},st=o=>{if(e.suppress){e.suppress=!1,o.stopPropagation(),o.preventDefault();return}if(e.phase==="rest"){if(Z()){je();return}de()&&e.pointer.type==="mouse"&&e.pointer.in&&e.hover&&(e.attached=!!L.current.carryCursor)}};t.addEventListener("pointermove",Ae),t.addEventListener("pointerenter",Ae),t.addEventListener("pointerleave",at),t.addEventListener("pointerdown",rt),t.addEventListener("pointerup",Ne),t.addEventListener("pointercancel",Ne),R.addEventListener("click",st);let He=new ResizeObserver(be);return He.observe(t),He.observe(R),be(),{refresh:be,rehome(){be(),e.phase==="rest"&&(e.x=h(),ie(),e.running||ye(0))},destroy(){He.disconnect(),j(),e.raf&&cancelAnimationFrame(e.raf),t.removeEventListener("pointermove",Ae),t.removeEventListener("pointerenter",Ae),t.removeEventListener("pointerleave",at),t.removeEventListener("pointerdown",rt),t.removeEventListener("pointerup",Ne),t.removeEventListener("pointercancel",Ne),R.removeEventListener("click",st),z&&z.dispose()}}}function At(t){let x=(y,h)=>{let s=t.createShader(y);if(t.shaderSource(s,h),t.compileShader(s),!t.getShaderParameter(s,t.COMPILE_STATUS)){let p=t.getShaderInfoLog(s);throw t.deleteShader(s),new Error(p)}return s},R=x(t.VERTEX_SHADER,wt),H=[],N=y=>{let h=x(t.FRAGMENT_SHADER,y),s=t.createProgram();if(t.attachShader(s,R),t.attachShader(s,h),t.linkProgram(s),!t.getProgramParameter(s,t.LINK_STATUS))throw new Error(t.getProgramInfoLog(s));t.deleteShader(h);let p={},b=t.getProgramParameter(s,t.ACTIVE_UNIFORMS);for(let j=0;j<b;j+=1){let O=t.getActiveUniform(s,j);p[O.name.replace(/\[0\]$/,"")]=t.getUniformLocation(s,O.name)}let F={p:s,u:p};return H.push(F),F},L={advect:N(kt),force:N(Tt),curl:N(Mt),vorticity:N(Ct),divergence:N(Lt),pressure:N(Et),gradient:N(Dt),scale:N(Rt),blur:N(St),dye:N(_t),render:N(Ut)},re=t.createVertexArray(),ce=[],e=(y,h,s,p)=>{let b=t.createTexture();t.bindTexture(t.TEXTURE_2D,b);let F=p?Math.floor(Math.log2(Math.max(y,h)))+1:1;t.texStorage2D(t.TEXTURE_2D,F,s,y,h),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,p?t.LINEAR_MIPMAP_LINEAR:t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE);let j=t.createFramebuffer();t.bindFramebuffer(t.FRAMEBUFFER,j),t.framebufferTexture2D(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,b,0),t.viewport(0,0,y,h),t.clearColor(0,0,0,0),t.clear(t.COLOR_BUFFER_BIT);let O={tex:b,fbo:j,w:y,h,mips:p};return ce.push(O),O},z=(y,h,s,p)=>{let b={read:e(y,h,s,p),write:e(y,h,s,p)};return b.swap=()=>{let F=b.read;b.read=b.write,b.write=F},b},f=null,X=[1,1],I=()=>{ce.forEach(y=>{t.deleteTexture(y.tex),t.deleteFramebuffer(y.fbo)}),ce.length=0},ke=(y,h)=>{let s=Math.max(2,y/520,h/300),p=Math.max(16,Math.round(y/s)),b=Math.max(16,Math.round(h/s)),F=Math.max(16,Math.round(y/(s/2))),j=Math.max(16,Math.round(h/(s/2)));X=[y,h],!(f&&f.vw===p&&f.vh===b&&f.dw===F&&f.dh===j)&&(I(),f={vw:p,vh:b,dw:F,dh:j,velocity:z(p,b,t.RG16F,!1),pressure:z(p,b,t.R16F,!1),divergence:e(p,b,t.R16F,!1),curl:e(p,b,t.R16F,!1),dye:z(F,j,t.RG16F,!1),soft:e(F,j,t.RG16F,!0),temp:e(F,j,t.RG16F,!1)})},Q=0,Te=(y,h)=>{t.useProgram(y.p),Q=0,Object.entries(h).forEach(([s,p])=>{let b=y.u[s];b!=null&&(typeof p=="number"?t.uniform1f(b,p):p.f1?t.uniform1fv(b,p.f1):p.tex?(t.activeTexture(t.TEXTURE0+Q),t.bindTexture(t.TEXTURE_2D,p.tex),t.uniform1i(b,Q),Q+=1):p.length===2?t.uniform2fv(b,p):p.length===3?t.uniform3fv(b,p):t.uniform4fv(b,p))})},$=(y,h,s)=>{Te(y,h),s&&(t.bindFramebuffer(t.FRAMEBUFFER,s.fbo),t.viewport(0,0,s.w,s.h)),t.bindVertexArray(re),t.drawArrays(t.TRIANGLES,0,3)};return{step:(y,h)=>{if(!f)return;let s=ze;t.disable(t.BLEND);let p=[1/f.vw,1/f.vh];$(L.advect,{uVelocity:f.velocity.read,uSource:f.velocity.read,uWorld:X,uDt:y,uKeep:1},f.velocity.write),f.velocity.swap(),$(L.force,{uVelocity:f.velocity.read,uDye:f.soft,uWorld:X,uDt:y,uBuoyancy:s.buoy,uLift:s.lift,uDamping:s.damp,uSpread:s.spread,uSplash:s.splash,uFriction:s.friction,uWind:h.wind,uTurb:[s.turb*(.35+.65*h.activity),s.turbScale],uTime:h.time,uObstacle:h.calm,uKick:[s.kickNear*h.scale,s.kickW*h.scale,s.kickH*h.scale],uCraft:h.craft,uCraftMotion:h.motion,uJetA:h.jets.a,uJetB:h.jets.b,uJetBend:{f1:h.jets.bend}},f.velocity.write),f.velocity.swap(),$(L.curl,{uVelocity:f.velocity.read,uTexel:p},f.curl),$(L.vorticity,{uVelocity:f.velocity.read,uCurl:f.curl,uTexel:p,uStrength:s.vort*h.turbulence*(.4+.6*h.activity),uDt:y},f.velocity.write),f.velocity.swap(),$(L.divergence,{uVelocity:f.velocity.read,uTexel:p},f.divergence),$(L.scale,{uSource:f.pressure.read,uScale:.8},f.pressure.write),f.pressure.swap();for(let F=0;F<s.iters;F+=1)$(L.pressure,{uPressure:f.pressure.read,uDivergence:f.divergence,uTexel:p},f.pressure.write),f.pressure.swap();$(L.gradient,{uPressure:f.pressure.read,uVelocity:f.velocity.read,uTexel:p},f.velocity.write),f.velocity.swap(),$(L.dye,{uVelocity:f.velocity.read,uSource:f.dye.read,uWorld:X,uDt:y,uKeep:[Math.exp(-(s.keepD+s.keepIdle*(1-h.activity))*y),Math.exp(-s.keepH*y)],uRate:[s.rateN*h.smoke,s.rateH,s.rateK*h.smoke,s.rateC*h.smoke],uSpread:s.spread,uCol:[s.colSpread,s.colR*h.scale,s.colD,s.colU],uKick:[s.kickNear*h.scale,s.kickW*h.scale,s.kickH*h.scale],uDisperse:s.disperse,uDispV:s.dispV,uCraft:h.craft,uCraftMotion:h.motion,uGap:[h.spacing,s.gap*h.calm],uJetX:{f1:h.jetX},uJetN:h.jetN,uFloor:s.floor,uTime:h.time,uJetA:h.jets.a,uJetB:h.jets.b,uJetBend:{f1:h.jets.bend}},f.dye.write),f.dye.swap();let b=s.blur/2;$(L.blur,{uSource:f.dye.read,uStep:[b/f.dw,0]},f.temp),$(L.blur,{uSource:f.temp,uStep:[0,b/f.dh]},f.soft),t.bindTexture(t.TEXTURE_2D,f.soft.tex),t.generateMipmap(t.TEXTURE_2D)},render:(y,h,s)=>{if(!f)return;let p=ze;t.bindFramebuffer(t.FRAMEBUFFER,null),t.viewport(0,0,y,h),t.disable(t.BLEND),$(L.render,{uDye:f.soft,uWorld:X,uDyeSize:[f.dw,f.dh],uTime:s.time,uLightTheme:s.light?1:0,uSmoke:s.smokeColor,uShade:s.shadeColor,uThrust:s.thrustColor,uLook:[p.alphaK*(.6+.4*s.activity),p.relief,p.shadow,p.alphaLod],uLook2:[p.ambient,p.key,p.wrap,p.ao],uLook3:[p.normalE,p.normalLod,p.fine,p.broad],uCol:[p.colSpread,p.colR*s.scale,p.colD,p.colU],uScale:s.scale,uGamma:p.gamma,uTone:p.tone,uLight2:[p.jetLight,p.emit,p.exposure],uThreshold:p.threshold*(.3+.7*s.activity),uCraft:s.craft,uCraftMotion:s.motion,uJetA:s.jets.a,uJetB:s.jets.b,uJetBend:{f1:s.jets.bend}})},resize:ke,clear:()=>{f&&([f.velocity.read,f.velocity.write,f.pressure.read,f.pressure.write,f.dye.read,f.dye.write,f.soft,f.temp].forEach(y=>{t.bindFramebuffer(t.FRAMEBUFFER,y.fbo),t.clearColor(0,0,0,0),t.clear(t.COLOR_BUFFER_BIT)}),t.bindTexture(t.TEXTURE_2D,f.soft.tex),t.generateMipmap(t.TEXTURE_2D))},dispose:()=>{I(),H.forEach(y=>t.deleteProgram(y.p)),t.deleteShader(R),t.deleteVertexArray(re)}}}function Qe({children:t="Take off",onClick:x,theme:R="dark",size:H="medium",radius:N,altitude:L=170,hoverTime:re=2.4,jets:ce=2,thrusters:e=!0,trigger:z="hover",carryCursor:f=!0,ramp:X=!1,rampColor:I,smoke:ke=1,turbulence:Q=1,wobble:Te=1,thrustColor:$,smokeColor:Se,buttonColor:Me,textColor:se,className:Z="",style:y}){let h=pe(null),s=pe(null),p=pe(null),b=pe(null),F=pe(null),j=pe(null),O=pe({}),he=R==="light",ie=Pe[H]||Pe.medium,Re=$||(he?"#4f8cff":"#8ec5ff"),Ve=Se||(he?"#e9ebf0":"#eef1f6"),ye=Me||(he?"#18181b":"#27272a"),be=se||(he?"#fafafa":"#f5f5f5"),_e=I||(he?"#ececf0":"#25222b"),ae=M(Math.round(ne(ce,2)),1,J),de=ae===1?0:ae===2?.3:.34,Ue=e?Array.from({length:ae},(ee,je)=>ae===1?50:50+de*100*(2*je/(ae-1)-1)):[];return O.current={size:H,altitude:L,hoverTime:re,jets:ae,thrusters:!!e,trigger:z,carryCursor:f,ramp:!!X,smoke:ke,turbulence:Q,wobble:Te,thrustColor:Re,smokeColor:Ve,theme:R,onClick:x},Fe(()=>{let ee=jt({root:h.current,canvas:s.current,button:p.current,cursor:b.current,ramp:F.current,props:O});return j.current=ee,()=>{j.current=null,ee.destroy()}},[]),Fe(()=>{j.current&&j.current.refresh()},[H,ae,e,N]),Fe(()=>{j.current&&j.current.rehome()},[X]),W("div",{ref:h,className:`flying-button ${Z}`.trim(),"data-theme":R,"data-trigger":X?"click":z,style:{"--fly-bg":ye,"--fly-ink":be,"--fly-glow":Re,"--fly-ramp":_e,"--fly-h":`${ie.h}px`,"--fly-px":`${ie.px}px`,"--fly-fs":`${ie.fs}px`,"--fly-scale":ie.k,...N!=null?{"--fly-radius":`${ne(N,0)}px`}:{},...y},children:[W("svg",{ref:F,className:"flying-button__ramp",style:X?void 0:{display:"none"},"aria-hidden":"true",children:[W("path",{className:"flying-button__ramp-body"}),W("path",{className:"flying-button__ramp-edge"})]}),W("canvas",{ref:s,className:"flying-button__smoke","aria-hidden":"true"}),W("button",{ref:p,type:"button",className:"flying-button__craft",onClick:ee=>O.current.onClick&&O.current.onClick(ee),children:[W("span",{className:"flying-button__face","aria-hidden":"true"}),W("span",{className:"flying-button__label",children:t}),Ue.map(ee=>W("span",{className:"flying-button__pod",style:{left:`${ee}%`},"aria-hidden":"true"},ee))]}),W("svg",{ref:b,className:"flying-button__cursor",viewBox:"0 0 24 34","aria-hidden":"true",children:W("path",{d:"M2.2 2.1v24.6l6.1-5.9 4.1 9.6 4.4-1.9-4.1-9.4h8.6z",fill:"#0a0a0c",stroke:"#fff",strokeWidth:"1.9",strokeLinejoin:"round"})})]})}var Ie=document.getElementById("flying-button-root");Ie&&(Ie.dataset.mounted="true",Ie.querySelector(".launch-fallback")?.remove(),ct(W(Qe,{theme:"dark",size:"large",altitude:170,hoverTime:2.4,jets:2,thrusters:!0,trigger:"hover",carryCursor:!0,smoke:1,turbulence:1,wobble:1,ramp:!1,thrustColor:"#8ec5ff",smokeColor:"#eef1f6",onClick:()=>document.getElementById("launch-cta")?.click(),children:"Take off"}),Ie));
