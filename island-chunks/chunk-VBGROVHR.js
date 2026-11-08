import{j as Et,k as je,m as ge,r as Ke}from"./chunk-6DTBS2I7.js";var Kt=.32,yt=9,le=.05,Be=160,Ee=1.7,ye=.45,Wt=2.8,Ie=4,wt=4,Fe=256,Ne=48,We=2e5,Yt=[-.81,.58,-.02],Ft={forward:[0,1],backward:[0,-1],left:[-1,0],right:[1,0]},Qt=["lift","trace","light"],Jt={plus:0,dots:1},eo=1.25,Oe=`
precision highp float;
precision highp int;

uniform float uFrequency;
uniform vec2 uMorph;
uniform sampler2D uSculpt;
uniform float uSculptOn;
uniform vec4 uPulses[${Ie}];
uniform vec3 uEye;
uniform vec3 uForward;
uniform vec3 uNear;

uint lattice(ivec2 p) {
  uvec2 q = uvec2(p + 1073741824);
  uint h = q.x * 2654435761u + q.y * 2246822519u;
  h = (h ^ (h >> 15u)) * 739982445u;
  h = (h ^ (h >> 12u)) * 695872825u;
  return h ^ (h >> 15u);
}

float corner(ivec2 c, vec2 f) {
  uint h = lattice(c);
  vec2 g = vec2(float(h & 65535u), float(h >> 16u)) / 32767.5 - 1.0;
  return dot(g, f);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = p - i;
  ivec2 c = ivec2(i);
  vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  float a = corner(c, f);
  float b = corner(c + ivec2(1, 0), f - vec2(1.0, 0.0));
  float d = corner(c + ivec2(0, 1), f - vec2(0.0, 1.0));
  float e = corner(c + ivec2(1, 1), f - vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(d, e, u.x), u.y);
}

vec2 octave(vec2 p, vec2 shift) {
  return vec2(1.6 * p.x - 1.2 * p.y, 1.2 * p.x + 1.6 * p.y) + shift;
}

float relief(vec2 t) {
  vec2 p = t * uFrequency;
  vec2 w = vec2(noise(p * 0.42 + uMorph), noise(p * 0.42 - uMorph.yx + vec2(5.2, 1.3)));
  p += w * 0.8;
  float n = noise(p) * 0.55;
  p = octave(p, vec2(7.1, 3.7));
  n += noise(p) * 0.15;
  p = octave(p, vec2(1.9, 8.3));
  n += noise(p) * 0.04;
  float s = log(1.0 + exp(7.0 * (3.0 * n + 0.05))) / 7.0;
  return s * s * 1.4 + 0.1 * n;
}

float swell(vec2 t) {
  float lift = 0.0;
  for (int i = 0; i < ${Ie}; i++) {
    vec4 p = uPulses[i];
    if (p.w <= 0.0) continue;
    float x = (length(t - p.xy) - p.z) / (0.28 + p.z * 0.05);
    lift += exp(-x * x) * p.w;
  }
  return lift;
}

vec4 sculpted(vec2 t) {
  return uSculptOn > 0.5 ? textureLod(uSculpt, t / ${Ne}.0, 0.0) : vec4(0.0);
}

float settle(vec2 world) {
  float depth = dot(vec3(world.x, 0.0, world.y) - uEye, uForward);
  float x = clamp((depth - uNear.x) / max(uNear.y - uNear.x, 1e-3), 0.0, 1.0);
  return mix(uNear.z, 1.0, x * x * x * (x * (x * 6.0 - 15.0) + 10.0));
}
`,to=`#version 300 es
${Oe}
uniform ivec2 uBase;
uniform float uCell;
uniform float uDetail;
layout(location = 0) out vec4 outField;
layout(location = 1) out vec4 outHeight;

void main() {
  vec2 t = vec2(uBase + ivec2(gl_FragCoord.xy)) * uCell;
  vec4 carved = sculpted(t);
  float ring = swell(t);
  float ground = relief(t) + carved.r + ring * 0.14;
  vec2 dp = t * uFrequency * 5.0 + vec2(13.1, 4.7);
  float fine = noise(dp) * 0.6 + noise(octave(dp, vec2(2.3, 6.1))) * 0.3;
  outField = vec4(carved.g, ring, ground, carved.r);
  outHeight = vec4(ground + uDetail * 0.1 * fine, 0.0, 0.0, 1.0);
}`,oo=n=>`#version 300 es
#define BAKED ${n?1:0}
${Oe}
uniform sampler2D uField;
uniform ivec2 uOrigin;
uniform ivec2 uCamCell;
uniform vec2 uCamFrac;
uniform float uCell;
uniform int uStride;
uniform float uHeight;
uniform mat4 uViewProj;
out vec2 vTexel;
out vec2 vTerrain;
out float vDepth;
out float vLift;
out vec3 vNormal;

float ground(vec2 t) {
  return relief(t) + swell(t) * 0.14;
}

void main() {
  ivec2 step = ivec2(gl_VertexID >> 1, gl_InstanceID + (gl_VertexID & 1)) * uStride;
  ivec2 local = uOrigin + step;
  vec2 terrain = vec2(local + uCamCell) * uCell;
  vec2 world = vec2(local) * uCell - uCamFrac;
  float k = settle(world);
#if BAKED
  ivec2 texel = step + 2;
  vec4 c = texelFetch(uField, texel, 0);
  vec4 l = texelFetch(uField, texel - ivec2(1, 0), 0);
  vec4 r = texelFetch(uField, texel + ivec2(1, 0), 0);
  vec4 d = texelFetch(uField, texel - ivec2(0, 1), 0);
  vec4 u = texelFetch(uField, texel + ivec2(0, 1), 0);
  float h = (c.b - c.a) * k + c.a;
  float dx = (l.b - l.a - r.b + r.a) * k + l.a - r.a;
  float dz = (d.b - d.a - u.b + u.a) * k + d.a - u.a;
  vNormal = vec3(dx * uHeight / (2.0 * uCell), 1.0, dz * uHeight / (2.0 * uCell));
  vTexel = vec2(texel) + 0.5;
#else
  float h = ground(terrain) * k;
  float hx = ground(terrain + vec2(0.04, 0.0)) * k;
  float hz = ground(terrain + vec2(0.0, 0.04)) * k;
  vNormal = vec3((h - hx) * uHeight / 0.04, 1.0, (h - hz) * uHeight / 0.04);
  vTexel = vec2(0.0);
#endif
  vec4 clip = uViewProj * vec4(world.x, h * uHeight, world.y, 1.0);
  gl_Position = clip;
  vTerrain = terrain;
  vDepth = clip.w;
  vLift = h * uHeight;
}`,ro=n=>`#version 300 es
#define BAKED ${n?1:0}
${Oe}
uniform sampler2D uField;
uniform highp sampler2D uHeightField;
uniform float uDetail;
uniform float uLines;
uniform float uLineWidth;
uniform float uMajor;
uniform vec3 uColor;
uniform float uBrightness;
uniform vec2 uFade;
uniform vec3 uFocus;
uniform vec4 uHeat;
uniform vec4 uLamp;
uniform vec4 uTrace;
uniform vec3 uSun;
uniform float uRefDepth;
uniform float uReveal;
uniform float uLightMode;
uniform float uOpacity;
uniform vec4 uGlitch[3];
uniform float uGlitchSeed;
uniform float uPixel;
in vec2 vTexel;
in vec2 vTerrain;
in float vDepth;
in float vLift;
in vec3 vNormal;
out vec4 outColor;

float smoother(float x) {
  x = clamp(x, 0.0, 1.0);
  return x * x * x * (x * (x * 6.0 - 15.0) + 10.0);
}

float stroke(float dist, float width, float soft, float density, float crowd) {
  float cover = max(0.0, min(min(width, soft), 0.5 * (width + soft) - dist)) / soft;
  return mix(cover, min(width * density, 1.0) * 0.6, crowd);
}

float sampleHeight(vec2 coord, out vec2 slope) {
  vec2 u = coord - 0.5;
  vec2 i = floor(u + 0.5);
  vec2 f = u - i;
  vec3 wx = vec3(0.5 * (0.5 - f.x) * (0.5 - f.x), 0.75 - f.x * f.x, 0.5 * (0.5 + f.x) * (0.5 + f.x));
  vec3 wy = vec3(0.5 * (0.5 - f.y) * (0.5 - f.y), 0.75 - f.y * f.y, 0.5 * (0.5 + f.y) * (0.5 + f.y));
  vec3 dx = vec3(f.x - 0.5, -2.0 * f.x, 0.5 + f.x);
  vec3 dy = vec3(f.y - 0.5, -2.0 * f.y, 0.5 + f.y);
  ivec2 base = ivec2(i) - 1;
  float total = 0.0;
  slope = vec2(0.0);
  for (int y = 0; y < 3; y++) {
    float a = texelFetch(uHeightField, base + ivec2(0, y), 0).r;
    float b = texelFetch(uHeightField, base + ivec2(1, y), 0).r;
    float c = texelFetch(uHeightField, base + ivec2(2, y), 0).r;
    float row = a * wx.x + b * wx.y + c * wx.z;
    total += row * wy[y];
    slope += vec2((a * dx.x + b * dx.y + c * dx.z) * wy[y], row * dy[y]);
  }
  return total;
}

void main() {
  float py = gl_FragCoord.y / uPixel;
  float shift = 0.0;
  float split = 0.0;
  for (int i = 0; i < 3; i++) {
    if (py >= uGlitch[i].x && py < uGlitch[i].y) {
      shift = uGlitch[i].z * uPixel;
      split = uGlitch[i].w * uPixel;
    }
  }
  vec2 spot = vTerrain - dFdx(vTerrain) * shift;
#if BAKED
  vec2 ex = dFdx(vTexel);
  vec2 ey = dFdy(vTexel);
  vec2 coord = vTexel - ex * shift;
  vec2 slope;
  float h = sampleHeight(coord, slope);
  vec4 field = texture(uField, coord / vec2(textureSize(uField, 0)));
  float trail = field.r;
  float ring = field.g;
  float gx = dot(slope, ex) * uLines;
  float gy = dot(slope, ey) * uLines;
#else
  vec2 dp = spot * uFrequency * 5.0 + vec2(13.1, 4.7);
  float ring = swell(spot);
  float h = relief(spot) + ring * 0.14 + uDetail * 0.1 * (noise(dp) * 0.6 + noise(octave(dp, vec2(2.3, 6.1))) * 0.3);
  float trail = 0.0;
  float gx = dFdx(h) * uLines;
  float gy = dFdy(h) * uLines;
#endif

  float lc = h * uLines + 0.5;
  float density = max(sqrt(gx * gx + gy * gy), 1e-5);
  float dist = abs(fract(lc + 0.5) - 0.5) / density;
  float major = uMajor * (1.0 - step(0.5, mod(floor(lc + 0.5), 5.0)));

  vec2 hd = spot - uHeat.xy;
  float heat = exp(-dot(hd, hd) / (uHeat.z * uHeat.z)) * uHeat.w + trail * 0.6;
  float energy = heat + ring;

  float depth = max(vDepth, 0.01);
  float persp = clamp(sqrt(uRefDepth / depth), 0.6, 1.6);
  float width = uLineWidth * persp * (1.0 + 0.6 * major) * (1.0 + 0.45 * min(energy, 1.5));
  float soft = 1.0 + min(uFocus.y * abs(1.0 - uFocus.x / depth), uFocus.z);
  float crowd = smoothstep(0.3, 0.75, density * max(width, soft));
  float cover = stroke(dist, width, soft, density, crowd);
  vec3 cover3 = vec3(cover);
  if (split > 0.0) {
    float offset = split * density;
    cover3.r = stroke(abs(fract(lc + offset + 0.5) - 0.5) / density, width, soft, density, crowd);
    cover3.b = stroke(abs(fract(lc - offset + 0.5) - 0.5) / density, width, soft, density, crowd);
    vec2 block = floor(vec2(gl_FragCoord.x / (uPixel * 26.0), py / 5.0)) + uGlitchSeed * 71.0;
    float drop = fract(sin(dot(block, vec2(12.9898, 78.233))) * 43758.5453);
    cover3 *= drop > 0.82 ? 0.1 : 1.2;
  }

  vec3 normal = normalize(vNormal);
  float sun = clamp(dot(normal, uSun), 0.0, 1.0);
  vec3 toLamp = uLamp.xyz - vec3(vTerrain.x, vLift, vTerrain.y);
  float lampDistance = length(toLamp);
  float lamp = clamp(dot(normal, toLamp / max(lampDistance, 1e-3)), 0.0, 1.0) * uLamp.w / (1.0 + lampDistance * lampDistance * 0.9);
  float level = mix(0.45, 1.05, smoothstep(0.0, 1.1, h)) * mix(0.35, 1.25, sun * sun) * (1.0 + 0.6 * major);
  level += heat * 1.4 + ring * 3.0 + lamp * 1.2;

  float fade = 1.0 - smoother((depth - uFade.x) / max(uFade.y - uFade.x, 1e-3));
  vec3 light = cover3 * level;

  if (uTrace.y > 0.0) {
    float traceWidth = uLineWidth * persp * 1.8;
    float trace = stroke(abs(h - uTrace.x) * uLines / density, traceWidth, soft, density, crowd);
    vec2 td = spot - uTrace.zw;
    light += trace * uTrace.y * mix(0.35, 1.0, exp(-dot(td, td) / 20.0)) * 2.6;
  }
  light *= fade * uBrightness * uReveal;

  if (uLightMode > 0.5) {
    float ink = (1.0 - exp(-max(max(light.r, light.g), light.b) * 1.8)) * 0.92 * uOpacity;
    outColor = vec4(uColor * ink, ink);
    return;
  }

  vec3 color = 1.0 - exp(-uColor * light * 1.8);
  float top = max(max(color.r, color.g), color.b);
  float dither = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) - 0.5;
  color = max(color + dither / 255.0 * step(0.002, top), 0.0);
  outColor = vec4(color, max(max(color.r, color.g), color.b)) * uOpacity;
}`,io=`#version 300 es
${Oe}
uniform ivec2 uOrigin;
uniform ivec2 uCamCell;
uniform vec2 uCamFrac;
uniform float uSpacing;
uniform int uColumns;
uniform float uHeight;
uniform mat4 uViewProj;
uniform vec2 uView;
uniform float uSize;
uniform float uRefDepth;
uniform vec4 uHeat;
uniform float uTime;
uniform vec4 uGlitch[3];
uniform float uPixel;
out vec2 vCorner;
out float vSize;
out float vGlow;
out float vFrame;
out float vDepth;

void main() {
  ivec2 local = uOrigin + ivec2(gl_InstanceID % uColumns, gl_InstanceID / uColumns);
  ivec2 id = local + uCamCell;
  vec2 terrain = vec2(id) * uSpacing;
  vec2 world = vec2(local) * uSpacing - uCamFrac;
  float ring = swell(terrain);
  float h = (relief(terrain) + ring * 0.14) * settle(world) + sculpted(terrain).r;
  vec4 clip = uViewProj * vec4(world.x, h * uHeight + 0.05, world.y, 1.0);
  uint seed = lattice(id + ivec2(911, 377));
  float a = float(seed & 1023u) / 1023.0;
  float b = float((seed >> 10u) & 1023u) / 1023.0;
  vec2 hd = terrain - uHeat.xy;
  float heat = exp(-dot(hd, hd) / (uHeat.z * uHeat.z)) * uHeat.w;
  float blink = step(0.92, a) * (0.5 + 0.5 * sin(uTime * (1.4 + b * 2.2) + b * 40.0));
  float size = uSize * clamp(sqrt(uRefDepth / max(clip.w, 0.01)), 0.6, 1.3) * (1.0 + 0.4 * heat + 0.35 * blink);
  float frame = max(smoothstep(0.55, 0.95, blink), smoothstep(0.3, 0.8, heat));
  vec2 corner = vec2(float(gl_VertexID & 1), float(gl_VertexID >> 1)) * 2.0 - 1.0;
  vec2 offset = corner * (size * (frame > 0.001 ? 2.6 : 1.0) + 1.5);
  float py = (clip.y / clip.w * 0.5 + 0.5) * uView.y / uPixel;
  float shift = 0.0;
  for (int i = 0; i < 3; i++) {
    if (py >= uGlitch[i].x && py < uGlitch[i].y) shift = uGlitch[i].z;
  }
  clip.xy += (offset + vec2(shift * uPixel, 0.0)) / uView * 2.0 * clip.w;
  gl_Position = clip;
  vCorner = offset;
  vSize = size;
  vFrame = frame;
  vGlow = 0.5 + 0.4 * b + blink * 0.9 + heat * 1.8 + ring * 3.0;
  vDepth = clip.w;
}`,no=`#version 300 es
precision highp float;
uniform vec3 uColor;
uniform vec2 uFade;
uniform float uReveal;
uniform float uBrightness;
uniform float uLightMode;
uniform float uOpacity;
uniform float uStyle;
uniform float uPixel;
in vec2 vCorner;
in float vSize;
in float vGlow;
in float vFrame;
in float vDepth;
out vec4 outColor;

float smoother(float x) {
  x = clamp(x, 0.0, 1.0);
  return x * x * x * (x * (x * 6.0 - 15.0) + 10.0);
}

void main() {
  vec2 a = abs(vCorner);
  float cover;
  if (uStyle < 0.5) {
    float thick = max(0.6 * uPixel, 0.5);
    float across = clamp(vSize - a.x + 0.5, 0.0, 1.0) * clamp(thick - a.y + 0.5, 0.0, 1.0);
    float down = clamp(vSize - a.y + 0.5, 0.0, 1.0) * clamp(thick - a.x + 0.5, 0.0, 1.0);
    cover = max(across, down);
  } else {
    cover = clamp(vSize * 0.42 - length(vCorner) + 0.5, 0.0, 1.0);
  }
  if (vFrame > 0.001) {
    float edge = vSize * 2.3;
    float reach = edge * 0.45;
    float line = max(0.5 * uPixel, 0.5);
    float sides = clamp(line - abs(a.x - edge) + 0.5, 0.0, 1.0) * clamp(a.y - edge + reach + 0.5, 0.0, 1.0) * clamp(edge + line - a.y + 0.5, 0.0, 1.0);
    float caps = clamp(line - abs(a.y - edge) + 0.5, 0.0, 1.0) * clamp(a.x - edge + reach + 0.5, 0.0, 1.0) * clamp(edge + line - a.x + 0.5, 0.0, 1.0);
    cover = max(cover, max(sides, caps) * vFrame * 0.8);
  }
  float fade = 1.0 - smoother((vDepth - uFade.x) / max(uFade.y - uFade.x, 1e-3));
  float light = cover * vGlow * fade * fade * uReveal * uBrightness;
  if (uLightMode > 0.5) {
    float ink = (1.0 - exp(-light * 1.8)) * 0.92 * uOpacity;
    outColor = vec4(uColor * ink, ink);
    return;
  }
  vec3 color = 1.0 - exp(-uColor * light * 1.8);
  outColor = vec4(color, max(max(color.r, color.g), color.b)) * uOpacity;
}`,we=`#version 300 es
void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`,ao=`#version 300 es
precision highp float;
uniform sampler2D uPrevious;
uniform vec4 uSegment;
uniform vec4 uBrush;
uniform vec4 uBurst;
uniform vec2 uDecay;
out vec4 outColor;

vec2 wrapped(vec2 d) {
  return d - ${Ne}.0 * floor(d / ${Ne}.0 + 0.5);
}

void main() {
  vec4 previous = texelFetch(uPrevious, ivec2(gl_FragCoord.xy), 0);
  vec2 t = gl_FragCoord.xy / ${Fe}.0 * ${Ne}.0;
  vec2 a = wrapped(t - uSegment.xy);
  vec2 ab = uSegment.zw - uSegment.xy;
  float k = clamp(dot(a, ab) / max(dot(ab, ab), 1e-6), 0.0, 1.0);
  vec2 d = a - ab * k;
  float g = exp(-dot(d, d) / (uBrush.x * uBrush.x)) * uBrush.w;
  float height = previous.r * uDecay.x;
  height += (uBrush.y - height) * g * uBrush.z;
  float heat = previous.g * uDecay.y;
  heat += (1.0 - heat) * g * uBrush.z;
  vec2 b = wrapped(t - uBurst.xy);
  height += uBurst.w * exp(-dot(b, b) / (uBurst.z * uBurst.z));
  outColor = vec4(height, heat, 0.0, 1.0);
}`,uo=`#version 300 es
precision highp float;
uniform sampler2D uSource;
uniform vec2 uTarget;
uniform vec2 uTexel;
out vec4 outColor;

void main() {
  vec2 uv = gl_FragCoord.xy / uTarget;
  vec4 color = texture(uSource, uv - uTexel);
  color += texture(uSource, uv + uTexel);
  color += texture(uSource, uv + vec2(uTexel.x, -uTexel.y));
  color += texture(uSource, uv + vec2(-uTexel.x, uTexel.y));
  outColor = min(color * 0.25, vec4(1.0));
}`,co=`#version 300 es
precision highp float;
uniform sampler2D uSource;
uniform vec2 uTarget;
uniform vec2 uStep;
out vec4 outColor;

void main() {
  vec2 uv = gl_FragCoord.xy / uTarget;
  vec4 color = texture(uSource, uv) * 0.181862;
  color += (texture(uSource, uv + uStep * 1.423135) + texture(uSource, uv - uStep * 1.423135)) * 0.284316;
  color += (texture(uSource, uv + uStep * 3.326702) + texture(uSource, uv - uStep * 3.326702)) * 0.106598;
  color += (texture(uSource, uv + uStep * 5.242989) + texture(uSource, uv - uStep * 5.242989)) * 0.018156;
  outColor = color;
}`,lo=`#version 300 es
precision highp float;
uniform sampler2D uBloom0;
uniform sampler2D uBloom1;
uniform sampler2D uBloom2;
uniform sampler2D uBloom3;
uniform vec2 uView;
uniform float uGlow;
uniform float uLightMode;
out vec4 outColor;

void main() {
  vec2 uv = gl_FragCoord.xy / uView;
  vec4 halo = texture(uBloom0, uv) * 0.4;
  halo += texture(uBloom1, uv) * 0.3;
  halo += texture(uBloom2, uv) * 0.2;
  halo += texture(uBloom3, uv) * 0.1;
  if (uLightMode > 0.5) {
    outColor = halo * uGlow * 0.35;
    return;
  }
  vec3 color = halo.rgb * uGlow * 1.6;
  color = color / (1.0 + color);
  outColor = vec4(color, max(max(color.r, color.g), color.b));
}`,S=(n,s,u)=>Math.min(u,Math.max(s,n)),J=n=>{let s=S(n,0,1);return s*s*s*(s*(s*6-15)+10)},fo=(n,s)=>{let u=Math.imul(n+1073741824,2654435761)+Math.imul(s+1073741824,2246822519)>>>0;return u=Math.imul(u^u>>>15,739982445)>>>0,u=Math.imul(u^u>>>12,695872825)>>>0,(u^u>>>15)>>>0},Pe=(n,s,u,c)=>{let h=fo(n,s);return((h&65535)/32767.5-1)*u+((h>>>16)/32767.5-1)*c},te=(n,s)=>{let u=Math.floor(n),c=Math.floor(s),h=n-u,d=s-c,C=h*h*h*(h*(h*6-15)+10),V=d*d*d*(d*(d*6-15)+10),I=Pe(u,c,h,d),_=Pe(u+1,c,h-1,d),B=Pe(u,c+1,h,d-1),O=Pe(u+1,c+1,h-1,d-1),Z=I+(_-I)*C;return Z+(B+(O-B)*C-Z)*V},Tt=(n,s,u,c,h)=>{let d=n*u,C=s*u,V=te(d*.42+c,C*.42+h),I=te(d*.42-h+5.2,C*.42-c+1.3);d+=V*.8,C+=I*.8;let _=te(d,C)*.55,B=1.6*d-1.2*C+7.1,O=1.2*d+1.6*C+3.7;_+=te(B,O)*.15,_+=te(1.6*B-1.2*O+1.9,1.2*B+1.6*O+8.3)*.04;let Z=Math.log(1+Math.exp(7*(3*_+.05)))/7;return Z*Z*1.4+.1*_},so=(n,s,u)=>{let c=n*u*5+13.1,h=s*u*5+4.7;return te(c,h)*.6+te(1.6*c-1.2*h+2.3,1.2*c+1.6*h+6.1)*.3},Mt=(n,s,u)=>{let c=n.createShader(s);return c?(n.shaderSource(c,u),n.compileShader(c),n.getShaderParameter(c,n.COMPILE_STATUS)?c:(n.deleteShader(c),null)):null},ee=(n,s,u)=>{let c=Mt(n,n.VERTEX_SHADER,s),h=Mt(n,n.FRAGMENT_SHADER,u),d=n.createProgram();if(!c||!h||!d)return null;if(n.attachShader(d,c),n.attachShader(d,h),n.linkProgram(d),n.deleteShader(c),n.deleteShader(h),!n.getProgramParameter(d,n.LINK_STATUS))return n.deleteProgram(d),null;let C={},V=n.getProgramParameter(d,n.ACTIVE_UNIFORMS);for(let I=0;I<V;I++){let _=n.getActiveUniform(d,I);_&&(C[_.name.replace(/\[0\]$/,"")]=n.getUniformLocation(d,_.name))}return{program:d,uniforms:C}},ho=n=>{let s=String(n||"#ffffff").replace("#","").trim();(s.length===3||s.length===4)&&(s=s.slice(0,3).split("").map(c=>c+c).join(""));let u=parseInt(s.slice(0,6),16);return Number.isNaN(u)?[1,1,1]:[(u>>16&255)/255,(u>>8&255)/255,(u&255)/255]},mo=(n,s)=>{let u=Math.cos(s),c=[Math.sin(n)*u,-Math.sin(s),Math.cos(n)*u],h=[Math.cos(n),0,-Math.sin(n)],d=[c[1]*h[2]-c[2]*h[1],c[2]*h[0]-c[0]*h[2],c[0]*h[1]-c[1]*h[0]];return{f:c,r:h,u:d}},Ye=n=>S(.4877/n,Kt,.6),vo=({eye:n,f:s,r:u,u:c},h,d)=>{let C=1/Ye(h),V=1/(le-Be),I=[u[0],c[0],-s[0],0,u[1],c[1],-s[1],0,u[2],c[2],-s[2],0,-(u[0]*n[0]+u[1]*n[1]+u[2]*n[2]),-(c[0]*n[0]+c[1]*n[1]+c[2]*n[2]),s[0]*n[0]+s[1]*n[1]+s[2]*n[2],1],_=[C/h,0,0,0,0,C,0,0,0,0,(Be+le)*V,-1,0,0,2*Be*le*V,0];for(let B=0;B<4;B++)for(let O=0;O<4;O++){let Z=0;for(let oe=0;oe<4;oe++)Z+=_[oe*4+O]*I[B*4+oe];d[B*4+O]=Z}return d},po=({color:n="#4f7cff",lineCount:s=22,lineWidth:u=1.2,majorLines:c=!0,elevation:h=1,foreground:d=.2,scale:C=1,detail:V=.35,tilt:I=32,speed:_=.25,direction:B="forward",morph:O=.2,glow:Z=.6,depthOfField:oe=.4,fog:bt=.35,brightness:Rt=1,opacity:St=1,mouseInteraction:Ct=!0,hoverEffect:Qe="lift",mouseRadius:Lt=1,mouseStrength:Dt=.6,trail:At=.3,parallax:_t=.5,clickEffect:Pt="pulse",markers:Bt="none",glitch:Nt=0,intro:It=!0,lightMode:Ot=!1,dpr:zt,className:kt="",style:Ut})=>{let Je=ge(null),et=ge(null),ze=ge(null),[Ht,Xt]=Et(0),tt={color:n,lineCount:S(s,2,80),lineWidth:Math.max(.2,u),majorLines:c,elevation:S(h,0,3),foreground:S(d,0,1),scale:S(C,.2,5),detail:S(V,0,1),tilt:S(I,12,90),speed:_,direction:Ft[B]??Ft.forward,morph:Math.max(0,O),glow:Math.max(0,Z),depthOfField:S(oe,0,1),fog:S(bt,0,1),brightness:Math.max(0,Rt),opacity:S(St,0,1),mouseInteraction:Ct,hoverEffect:Qt.includes(Qe)?Qe:"lift",mouseRadius:Math.max(.1,Lt),mouseStrength:Math.max(0,Dt),trail:S(At,0,1),parallax:S(_t,0,1),clickEffect:Pt,markers:Jt[Bt]??-1,glitch:S(Nt,0,1),intro:It,lightMode:Ot,dpr:zt},H=ge(tt);return H.current=tt,je(()=>{let re=Je.current,P=et.current,Gt=Math.min(H.current.dpr||window.devicePixelRatio||1,2),e=P?.getContext("webgl2",{alpha:!0,premultipliedAlpha:!0,antialias:Gt<1.5,depth:!0,stencil:!1,powerPreference:"high-performance"});if(!re||!P||!e)return;let fe=!!e.getExtension("EXT_color_buffer_float"),Te=ee(e,oo(fe),ro(fe)),ie=fe?ee(e,we,to):null,se=fe?ee(e,we,ao):null,ne=ee(e,we,uo),Y=ee(e,we,co),Me=ee(e,we,lo),be=ee(e,io,no);if(!Te||!ne||!Y||!Me||!be)return;let ot=t=>t.preventDefault(),rt=()=>Xt(t=>t+1);P.addEventListener("webglcontextlost",ot),P.addEventListener("webglcontextrestored",rt);let it=e.createVertexArray(),Vt=fe?e.RGBA16F:e.RGBA8,he=(t,r,i,l)=>{let a=e.createTexture();return e.bindTexture(e.TEXTURE_2D,a),e.texStorage2D(e.TEXTURE_2D,1,i,t,r),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,l),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,l),a},ke=()=>({texture:null,framebuffer:e.createFramebuffer(),depth:null,width:0,height:0}),Ue=(t,r,i,l)=>{t.texture&&t.width===r&&t.height===i||(t.texture&&e.deleteTexture(t.texture),t.texture=he(r,i,Vt,e.CLAMP_TO_EDGE),t.width=r,t.height=i,e.bindFramebuffer(e.FRAMEBUFFER,t.framebuffer),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,t.texture,0),l&&(t.depth||(t.depth=e.createRenderbuffer()),e.bindRenderbuffer(e.RENDERBUFFER,t.depth),e.renderbufferStorage(e.RENDERBUFFER,e.DEPTH_COMPONENT24,r,i),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.DEPTH_ATTACHMENT,e.RENDERBUFFER,t.depth)))},Re=ke(),Se=Array.from({length:wt},()=>[ke(),ke()]),X=se?[0,1].map(()=>{let t=he(Fe,Fe,e.RG16F,e.REPEAT),r=e.createFramebuffer();return e.bindFramebuffer(e.FRAMEBUFFER,r),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,t,0),e.clearColor(0,0,0,0),e.clear(e.COLOR_BUFFER_BIT),{texture:t,framebuffer:r}}):null,me=he(1,1,e.RGBA8,e.REPEAT),E={texture:null,heights:null,framebuffer:e.createFramebuffer(),width:0,height:0},ae=0,Zt=(t,r)=>{E.texture&&t<=E.width&&r<=E.height||(E.texture&&e.deleteTexture(E.texture),E.heights&&e.deleteTexture(E.heights),E.width=Math.max(t,Math.ceil(E.width*1.25),64),E.height=Math.max(r,Math.ceil(E.height*1.25),64),E.texture=he(E.width,E.height,e.RGBA16F,e.CLAMP_TO_EDGE),E.heights=he(E.width,E.height,e.R32F,e.CLAMP_TO_EDGE),e.bindTexture(e.TEXTURE_2D,E.heights),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST),e.bindFramebuffer(e.FRAMEBUFFER,E.framebuffer),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,E.texture,0),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT1,e.TEXTURE_2D,E.heights,0),e.drawBuffers([e.COLOR_ATTACHMENT0,e.COLOR_ATTACHMENT1]))},$=(t,r)=>{e.activeTexture(e.TEXTURE0+t),e.bindTexture(e.TEXTURE_2D,r)},K=window.matchMedia?.("(prefers-reduced-motion: reduce)").matches??!1,He=new Float32Array(16),de=new Float32Array(Ie*4),ue=new Float32Array(12),N={until:0,next:1.5,roll:0,seed:0},Xe=7919,q=()=>(Xe=Xe*16807%2147483647,(Xe-1)/2147483646),j=[],z={x:0,y:0,inside:!1},m={width:1,height:1,ratio:1,cell:.05,cellKey:""},o={intro:H.current.intro&&!K?0:1,rise:1,travelX:0,travelZ:0,morph:0,yaw:0,pitch:0,yawVelocity:0,pitchVelocity:0,presence:0,focus:yt,hit:null,brushFrom:null,sculptLife:0,burst:null,level:0,trace:0,clock:0,tilt:H.current.tilt,elevation:H.current.elevation,scale:H.current.scale};o.rise=J(o.intro);let ve=0,Ce=0,Le=!0,De=0,Ge=()=>{let t=Math.min(o.tilt*Math.PI/180+o.pitch,Math.PI/2-1e-4),r=mo(o.yaw,t),i=o.elevation*Ee*o.rise*.18,l=o.elevation*Ee*o.rise*1.3+.9,a=Math.max(yt,(l-i)/Math.sin(t));return{...r,distance:a,eye:[-r.f[0]*a,i-r.f[1]*a,-r.f[2]*a]}},Ve=(t,r,i)=>{let l=m.width/m.height,a=Ye(l),p=[0,1,2].map(v=>t.f[v]+t.r[v]*r*a*l+t.u[v]*i*a),b=Math.hypot(p[0],p[1],p[2]);return p.map(v=>v/b)},Ze=(t,r)=>r[0]*t.f[0]+r[1]*t.f[1]+r[2]*t.f[2],$e=(t,r)=>{let i=Ve(t,0,r);return i[1]>-.001?1/0:t.eye[1]/-i[1]*Ze(t,i)},nt=(t,r)=>[$e(t,-1)*.9,t.distance,r.foreground],$t=(t,r,i,l)=>{let a=(i-t.eye[0])*t.f[0]-t.eye[1]*t.f[1]+(l-t.eye[2])*t.f[2];return r[2]+(1-r[2])*J((a-r[0])/Math.max(r[1]-r[0],.001))},at=(t,r,i,l)=>{let a=Ve(t,i,l),p=o.elevation*Ee*o.rise,b=ye/o.scale,v=nt(t,r),w=g=>{let k=t.eye[0]+a[0]*g,M=t.eye[2]+a[2]*g,Q=Tt(o.travelX+k,o.travelZ+M,b,o.morph*.37,o.morph*.23);return t.eye[1]+a[1]*g-Q*p*$t(t,v,k,M)},T=le,D=w(T);for(let g=0;g<200&&T<Be*.5;g++){let k=T+Math.max(.02,D*.4),M=w(k);if(M<0){let Q=T,U=k;for(let pe=0;pe<10;pe++){let R=(Q+U)*.5;w(R)<0?U=R:Q=R}return{x:o.travelX+t.eye[0]+a[0]*U,y:t.eye[1]+a[1]*U,z:o.travelZ+t.eye[2]+a[2]*U,depth:U*Ze(t,a)}}T=k,D=M}return null},qt=(t,r,i)=>{let l=o.elevation*Ee*o.rise*1.7+.2+r.mouseStrength,a={minX:1/0,maxX:-1/0,minZ:1/0,maxZ:-1/0,near:1/0},p=(b,v)=>{let w=t.eye[0]+b[0]*v,T=t.eye[2]+b[2]*v;a.minX=Math.min(a.minX,w),a.maxX=Math.max(a.maxX,w),a.minZ=Math.min(a.minZ,T),a.maxZ=Math.max(a.maxZ,T)};for(let b of[-1.08,0,1.08])for(let v of[-1.08,1.08]){let w=Ve(t,b,v),T=Math.max(Ze(t,w),.001),D=le,g=i*1.05/T;w[1]<-1e-4&&(D=Math.max(le,(t.eye[1]-l)/-w[1]),g=Math.min(g,t.eye[1]/-w[1])),D=Math.min(D,g),p(w,D),p(w,g),a.near=Math.min(a.near,D*T)}return a},ut=(t,r)=>{let i=Math.floor(o.travelX/r),l=Math.floor(o.travelZ/r),a=o.travelX-i*r,p=o.travelZ-l*r,b=Math.floor((t.minX+a)/r)-2,v=Math.floor((t.minZ+p)/r)-2,w=S(Math.ceil((t.maxX+a)/r)+2-b,1,4e3),T=S(Math.ceil((t.maxZ+p)/r)+2-v,1,Math.floor(We*1.5/w));return{cell:r,camX:i,camZ:l,fracX:a,fracZ:p,k0:b,m0:v,columns:w,rows:T}},ct=()=>{let t=H.current,r=Ge();vo(r,m.width/m.height,He);let i=$e(r,-1),l=Math.min($e(r,1),r.distance*3.2),a=Math.max(l,i*1.6,r.distance*1.4),p=a+(i*1.8-a)*t.fog,b=p*.7+(i*.7-p*.7)*t.fog,v=qt(r,t,p),w=`${m.width}x${m.height}@${m.ratio}|${Math.round(o.tilt/4)}|${Math.round(o.elevation*5)}|${t.fog}`;if(w!==m.cellKey){m.cellKey=w;let y=m.height*m.ratio*.5/Ye(m.width/m.height),L=S(14*Math.max(v.near,.5)/y,.02,.4),F=(v.maxX-v.minX)*(v.maxZ-v.minZ)/(L*L);F>We&&(L*=Math.sqrt(F/We)),m.cell=L}let T=ho(t.color),D=o.elevation*Ee*o.rise,g=ut(v,m.cell),k=nt(r,t),M=t.markers>=0?ut(v,eo):null,U=(o.hit&&t.mouseInteraction?o.presence:0)*(.35+.5*t.mouseStrength),pe=t.depthOfField*m.height*.016,R=J(o.intro/.35),G=o.hit?o.hit.x:0,ce=o.hit?o.hit.z:0;if(de.fill(0),j.forEach((y,L)=>{de.set([y.x,y.z,y.age*4.2,Math.exp(-y.age*1.1)*J(y.age/.08)],L*4)}),e.bindVertexArray(it),ie){let y=g.columns+7,L=g.rows+7;Zt(y,L),e.bindFramebuffer(e.FRAMEBUFFER,E.framebuffer),e.viewport(0,0,y,L),e.useProgram(ie.program);let F=ie.uniforms;$(0,X?X[ae].texture:me),e.uniform1i(F.uSculpt,0),e.uniform1f(F.uSculptOn,X?1:0),e.uniform1f(F.uFrequency,ye/o.scale),e.uniform2f(F.uMorph,o.morph*.37,o.morph*.23),e.uniform4fv(F.uPulses,de),e.uniform2i(F.uBase,g.k0-2+g.camX,g.m0-2+g.camZ),e.uniform1f(F.uCell,g.cell),e.uniform1f(F.uDetail,t.detail),e.disable(e.DEPTH_TEST),e.disable(e.BLEND),e.drawArrays(e.TRIANGLES,0,3)}let xe=(y,L,F,A)=>{e.viewport(0,0,L,F),e.useProgram(Te.program);let f=Te.uniforms;if($(0,ie?E.texture:me),e.uniform1i(f.uField,0),$(1,ie?E.heights:me),e.uniform1i(f.uHeightField,1),e.uniform1f(f.uFrequency,ye/o.scale),e.uniform2f(f.uMorph,o.morph*.37,o.morph*.23),e.uniform4fv(f.uPulses,de),e.uniform2i(f.uOrigin,g.k0,g.m0),e.uniform2i(f.uCamCell,g.camX,g.camZ),e.uniform2f(f.uCamFrac,g.fracX,g.fracZ),e.uniform1f(f.uCell,g.cell),e.uniform1i(f.uStride,A),e.uniform1f(f.uHeight,D),e.uniform3fv(f.uEye,r.eye),e.uniform3fv(f.uForward,r.f),e.uniform3fv(f.uNear,k),e.uniform1f(f.uRefDepth,r.distance),e.uniformMatrix4fv(f.uViewProj,!1,He),e.uniform1f(f.uDetail,t.detail),e.uniform1f(f.uLines,t.lineCount),e.uniform1f(f.uLineWidth,t.lineWidth*y),e.uniform1f(f.uMajor,t.majorLines?1:0),e.uniform3fv(f.uColor,T),e.uniform1f(f.uBrightness,t.brightness),e.uniform2f(f.uFade,b,p),e.uniform3f(f.uFocus,o.focus,pe*y,m.height*.03*y),e.uniform4f(f.uHeat,G,ce,.9*t.mouseRadius,U),e.uniform4f(f.uLamp,G,o.hit?o.hit.y+1.4:0,ce,U),e.uniform4f(f.uTrace,o.level,o.trace,G,ce),e.uniform3fv(f.uSun,Yt),e.uniform1f(f.uReveal,R),e.uniform1f(f.uLightMode,t.lightMode?1:0),e.uniform1f(f.uOpacity,t.opacity),e.uniform4fv(f.uGlitch,ue),e.uniform1f(f.uGlitchSeed,N.seed),e.uniform1f(f.uPixel,y),e.enable(e.DEPTH_TEST),e.depthFunc(e.LESS),e.disable(e.BLEND),e.clearColor(0,0,0,0),e.clearDepth(1),e.clear(e.COLOR_BUFFER_BIT|e.DEPTH_BUFFER_BIT),e.drawArraysInstanced(e.TRIANGLE_STRIP,0,2*(Math.ceil(g.columns/A)+1),Math.ceil(g.rows/A)),M){e.useProgram(be.program);let x=be.uniforms;$(2,X?X[ae].texture:me),e.uniform1i(x.uSculpt,2),e.uniform1f(x.uSculptOn,X?1:0),e.uniform1f(x.uFrequency,ye/o.scale),e.uniform2f(x.uMorph,o.morph*.37,o.morph*.23),e.uniform4fv(x.uPulses,de),e.uniform3fv(x.uEye,r.eye),e.uniform3fv(x.uForward,r.f),e.uniform3fv(x.uNear,k),e.uniform2i(x.uOrigin,M.k0,M.m0),e.uniform2i(x.uCamCell,M.camX,M.camZ),e.uniform2f(x.uCamFrac,M.fracX,M.fracZ),e.uniform1f(x.uSpacing,M.cell),e.uniform1i(x.uColumns,M.columns+1),e.uniform1f(x.uHeight,D),e.uniformMatrix4fv(x.uViewProj,!1,He),e.uniform2f(x.uView,L,F),e.uniform1f(x.uSize,4*y),e.uniform1f(x.uRefDepth,r.distance),e.uniform4f(x.uHeat,G,ce,1.2*t.mouseRadius,U),e.uniform1f(x.uTime,o.clock),e.uniform4fv(x.uGlitch,ue),e.uniform1f(x.uPixel,y),e.uniform3fv(x.uColor,T),e.uniform2f(x.uFade,b,p),e.uniform1f(x.uReveal,R),e.uniform1f(x.uBrightness,t.brightness),e.uniform1f(x.uLightMode,t.lightMode?1:0),e.uniform1f(x.uOpacity,t.opacity),e.uniform1f(x.uStyle,t.markers),e.depthFunc(e.LEQUAL),e.depthMask(!1),e.enable(e.BLEND),e.blendFunc(e.ONE,e.ONE_MINUS_SRC_ALPHA),e.drawArraysInstanced(e.TRIANGLE_STRIP,0,4,(M.columns+1)*(M.rows+1)),e.disable(e.BLEND),e.depthMask(!0)}e.disable(e.DEPTH_TEST)},_e=t.glow>.001;if(_e){let y=Math.max(1,Math.round(m.width/2)),L=Math.max(1,Math.round(m.height/2));Ue(Re,y,L,!0),Se.forEach((A,f)=>{let x=Math.max(1,Math.round(m.width/2**(f+2))),gt=Math.max(1,Math.round(m.height/2**(f+2)));Ue(A[0],x,gt,!1),Ue(A[1],x,gt,!1)}),e.bindFramebuffer(e.FRAMEBUFFER,Re.framebuffer),xe(.5,y,L,2);let F=Re;Se.forEach(([A,f])=>{e.bindFramebuffer(e.FRAMEBUFFER,A.framebuffer),e.viewport(0,0,A.width,A.height),e.useProgram(ne.program),$(0,F.texture),e.uniform1i(ne.uniforms.uSource,0),e.uniform2f(ne.uniforms.uTarget,A.width,A.height),e.uniform2f(ne.uniforms.uTexel,1/F.width,1/F.height),e.drawArrays(e.TRIANGLES,0,3),e.useProgram(Y.program),e.uniform1i(Y.uniforms.uSource,0),e.uniform2f(Y.uniforms.uTarget,f.width,f.height),e.bindFramebuffer(e.FRAMEBUFFER,f.framebuffer),$(0,A.texture),e.uniform2f(Y.uniforms.uStep,1/A.width,0),e.drawArrays(e.TRIANGLES,0,3),e.bindFramebuffer(e.FRAMEBUFFER,A.framebuffer),$(0,f.texture),e.uniform2f(Y.uniforms.uStep,0,1/f.height),e.drawArrays(e.TRIANGLES,0,3),F=A})}if(e.bindFramebuffer(e.FRAMEBUFFER,null),xe(m.ratio,P.width,P.height,1),_e){e.viewport(0,0,P.width,P.height),e.useProgram(Me.program);let y=Me.uniforms;Se.forEach(([L],F)=>{$(F,L.texture),e.uniform1i(y[`uBloom${F}`],F)}),e.uniform2f(y.uView,P.width,P.height),e.uniform1f(y.uGlow,t.glow*R),e.uniform1f(y.uLightMode,t.lightMode?1:0),e.enable(e.BLEND),t.lightMode?e.blendFunc(e.ONE,e.ONE_MINUS_SRC_ALPHA):e.blendFunc(e.ONE,e.ONE),e.drawArrays(e.TRIANGLES,0,3),e.disable(e.BLEND)}for(let y=wt;y>=0;y--)$(y,null)},jt=(t,r)=>{if(!X||!se)return!1;let i=t.mouseInteraction&&t.hoverEffect==="lift"&&o.presence>.001?o.hit:null,l=o.burst;if(!i&&!l&&o.sculptLife<=0)return!1;let a=o.brushFrom||i,p=X[ae],b=X[1-ae];e.bindFramebuffer(e.FRAMEBUFFER,b.framebuffer),e.viewport(0,0,Fe,Fe),e.useProgram(se.program);let v=se.uniforms;if($(0,p.texture),e.uniform1i(v.uPrevious,0),i&&a?e.uniform4f(v.uSegment,a.x,a.z,i.x,i.z):e.uniform4f(v.uSegment,0,0,0,0),e.uniform4f(v.uBrush,1.1*t.mouseRadius,.9*t.mouseStrength,1-Math.exp(-r*7),i?o.presence:0),l){let T=J(l.age/.7);l.age+=r;let D=(J(l.age/.7)-T)*.9*Math.max(t.mouseStrength,.3);e.uniform4f(v.uBurst,l.x,l.z,1.6*t.mouseRadius,D),l.age>=.7&&(o.burst=null)}else e.uniform4f(v.uBurst,0,0,1,0);let w=.25+3*t.trail*t.trail;return e.uniform2f(v.uDecay,Math.exp(-r/w),Math.exp(-r/.7)),e.disable(e.BLEND),e.drawArrays(e.TRIANGLES,0,3),ae=1-ae,o.brushFrom=i?{x:i.x,z:i.z}:null,i||l?o.sculptLife=w*6:o.sculptLife-=r,!0},lt=H.current.dpr,qe=()=>{let t=H.current;lt=t.dpr,m.width=Math.max(1,re.clientWidth),m.height=Math.max(1,re.clientHeight),m.ratio=Math.min(t.dpr||window.devicePixelRatio||1,2),P.width=Math.max(1,Math.round(m.width*m.ratio)),P.height=Math.max(1,Math.round(m.height*m.ratio)),ct(),W()},ft=t=>{if(ve=0,!Le||document.hidden)return;let r=H.current;r.dpr!==lt&&qe();let i=Ce?S((t-Ce)/1e3,0,1/20):1/60;Ce=t,!r.intro||K?o.intro=1:o.intro<1&&(o.intro=Math.min(1,o.intro+i/Wt)),o.rise=J(o.intro);let l=K?1:1-Math.exp(-i/.4);o.tilt+=(r.tilt-o.tilt)*l,o.elevation+=(r.elevation-o.elevation)*l,o.scale=r.scale,o.clock+=i;let a=K?0:r.glitch;if(a>0)if(o.clock>=N.next&&o.clock>=N.until&&(N.until=o.clock+.1+q()*.22*(.5+a),N.next=N.until+(9-7.4*a)*(.45+q()*1.1),N.roll=0),o.clock<N.until){if(o.clock>=N.roll){ue.fill(0);let R=1+Math.floor(q()*3);for(let G=0;G<R;G++){let ce=3+q()*q()*m.height*.14,xe=q()*m.height,_e=(q()-.5)*2*(10+46*a);ue.set([xe,xe+ce,_e,1+q()*3*a],G*4)}N.seed=q(),N.roll=o.clock+.04+q()*.05}}else ue.fill(0);else ue.fill(0);K||(o.travelX+=r.direction[0]*r.speed*.8*i,o.travelZ+=r.direction[1]*r.speed*.8*i,o.morph+=r.morph*.12*i);let p=z.inside&&r.mouseInteraction;o.presence+=((p?1:0)-o.presence)*(1-Math.exp(-i/(p?.18:.45)));let b=z.x/m.width*2-1,v=1-z.y/m.height*2,w=K||!p?0:r.parallax,T=b*w*.09,D=-v*w*.045;o.yawVelocity+=(38*(T-o.yaw)-11*o.yawVelocity)*i,o.pitchVelocity+=(38*(D-o.pitch)-11*o.pitchVelocity)*i,o.yaw+=o.yawVelocity*i,o.pitch+=o.pitchVelocity*i;let g=Ge();p?(o.hit=at(g,r,b,v),o.hit&&o.brushFrom&&Math.hypot(o.hit.x-o.brushFrom.x,o.hit.z-o.brushFrom.z)>3*r.mouseRadius&&(o.brushFrom=null)):o.presence<.002&&(o.hit=null,o.brushFrom=null);let k=o.hit&&r.mouseInteraction&&r.hoverEffect==="trace"?o.presence:0;if(o.hit){let R=ye/o.scale,G=Tt(o.hit.x,o.hit.z,R,o.morph*.37,o.morph*.23)+r.detail*.1*so(o.hit.x,o.hit.z,R);o.level=o.trace<.01?G:o.level+(G-o.level)*(1-Math.exp(-i/.09))}o.trace+=(k-o.trace)*(1-Math.exp(-i/.2));let M=o.hit&&r.depthOfField>0?o.hit.depth:g.distance;o.focus+=(M-o.focus)*(1-Math.exp(-i/.35));for(let R=j.length-1;R>=0;R--)j[R].age+=i,j[R].age>4&&j.splice(R,1);let Q=jt(r,i);ct();let U=Math.abs(r.tilt-o.tilt)>.01||Math.abs(r.elevation-o.elevation)>1e-4||Math.abs(o.yaw-T)>1e-4||Math.abs(o.pitch-D)>1e-4||Math.abs(o.yawVelocity)>1e-4||Math.abs(o.pitchVelocity)>1e-4||Math.abs(M-o.focus)>.001||Math.abs(k-o.trace)>.001;De=!K&&(r.speed!==0||r.morph!==0||r.glitch>0||r.markers>=0)||o.intro<1||j.length>0||Q||U||o.presence>.001&&o.presence<.999?0:De+i,De<.5&&(ve=requestAnimationFrame(ft))};function W(){De=0,!ve&&Le&&!document.hidden&&(Ce=0,ve=requestAnimationFrame(ft))}let st=t=>{let r=re.getBoundingClientRect(),i=t.clientX-r.left,l=t.clientY-r.top;return{x:i,y:l,inside:i>=0&&l>=0&&i<=r.width&&l<=r.height}},ht=t=>{let{x:r,y:i,inside:l}=st(t),a=z.inside;z.inside=l,l&&(z.x=r,z.y=i),(l||a)&&W()},mt=t=>{let r=H.current,{x:i,y:l,inside:a}=st(t);if(!a||(z.x=i,z.y=l,z.inside=!0,W(),r.glitch>0&&!K&&(N.until=o.clock+.16,N.roll=0),!r.mouseInteraction||r.clickEffect!=="pulse"&&r.clickEffect!=="peak"))return;let p=at(Ge(),r,i/m.width*2-1,1-l/m.height*2);p&&(r.clickEffect==="peak"&&X?o.burst={x:p.x,z:p.z,age:0}:r.clickEffect==="pulse"&&(j.length>=Ie&&j.shift(),j.push({x:p.x,z:p.z,age:0})))},Ae=t=>{t.pointerType==="touch"&&(z.inside=!1,W())},dt=()=>{z.inside=!1,W()},vt=()=>W(),pt=new ResizeObserver(qe);pt.observe(re);let xt=new IntersectionObserver(t=>{Le=t.some(r=>r.isIntersecting),Le&&W()});return xt.observe(re),window.addEventListener("pointermove",ht,{passive:!0}),window.addEventListener("pointerdown",mt,{passive:!0}),window.addEventListener("pointerup",Ae,{passive:!0}),window.addEventListener("pointercancel",Ae,{passive:!0}),document.documentElement.addEventListener("pointerleave",dt),document.addEventListener("visibilitychange",vt),qe(),ze.current=W,()=>{cancelAnimationFrame(ve),ze.current=null,pt.disconnect(),xt.disconnect(),window.removeEventListener("pointermove",ht),window.removeEventListener("pointerdown",mt),window.removeEventListener("pointerup",Ae),window.removeEventListener("pointercancel",Ae),document.documentElement.removeEventListener("pointerleave",dt),document.removeEventListener("visibilitychange",vt),P.removeEventListener("webglcontextlost",ot),P.removeEventListener("webglcontextrestored",rt),[Re,...Se.flat()].forEach(t=>{t.texture&&e.deleteTexture(t.texture),t.depth&&e.deleteRenderbuffer(t.depth),e.deleteFramebuffer(t.framebuffer)}),X?.forEach(t=>{e.deleteTexture(t.texture),e.deleteFramebuffer(t.framebuffer)}),e.deleteTexture(me),e.deleteVertexArray(it),E.texture&&e.deleteTexture(E.texture),E.heights&&e.deleteTexture(E.heights),e.deleteFramebuffer(E.framebuffer),[Te,ie,se,ne,Y,Me,be].forEach(t=>t&&e.deleteProgram(t.program)),e.getExtension("WEBGL_lose_context")?.loseContext()}},[Ht]),je(()=>{ze.current?.()}),Ke("div",{ref:Je,className:`topography-container ${kt}`.trim(),style:Ut,children:Ke("canvas",{ref:et,className:"topography-canvas","aria-hidden":"true"})})},wo=po;export{wo as a};
