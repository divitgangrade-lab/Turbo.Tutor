import"./island-chunks/chunk-RRE72WVH.js";import{f as _e,h as De,i as le,k as W,o as N}from"./island-chunks/chunk-XJDH345I.js";import"./island-chunks/chunk-SSQABL5H.js";var ce=8,Fe=4,at=`#version 300 es
in vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`,it=`#version 300 es
precision highp float;
uniform vec2 uView;
uniform float uZoom;
uniform float uPhase;
uniform float uTwinkleClock;
uniform float uRings;
uniform vec3 uColors[8];
uniform int uColorCount;
uniform int uStreakCount;
uniform int uColumns;
uniform float uWidth;
uniform float uTail;
uniform float uTwinkle;
uniform float uHead;
uniform float uDepth;
uniform vec4 uMouse;
uniform vec3 uLens;
uniform float uLightMode;
uniform float uEncode;
out vec4 outColor;

const vec3 CAMERA = vec3(0.0, -0.8888889, -0.2222222);
const float TAU = 6.28318530718;
const float SPACING = 0.005;
const float REACH = 0.32;

uint scramble(uint x) {
  x ^= x >> 16;
  x *= 0x7feb352du;
  x ^= x >> 15;
  x *= 0x846ca68bu;
  x ^= x >> 16;
  return x;
}

float unit(uint x) {
  return float(x & 0xffffu) / 65535.0;
}

float stroke(float d, float w) {
  float s = max(0.75 * w, 0.55);
  return 0.75 * w / s * exp(-0.5 * d * d / (s * s));
}

float orb(float d, float r) {
  float s = max(0.6 * r, 0.7);
  float e = 0.6 * r / s;
  return e * e * exp(-0.5 * d * d / (s * s));
}

void main() {
  vec2 frag = gl_FragCoord.xy;
  vec2 screen = (2.0 * frag - uView) / uView.x;
  vec2 p = screen;
  mat2 warp = mat2(1.0);
  if (uLens.z > 0.0) {
    vec2 o = p - uLens.xy;
    float e = uLens.z * exp(-dot(o, o) / (REACH * REACH));
    p -= o * e;
    warp = mat2(1.0 - e) + outerProduct(o, o) * (2.0 * e / (REACH * REACH));
  }

  vec3 dir = vec3(p, uZoom);
  vec3 exits = (1.0 - CAMERA * sign(dir)) / max(abs(dir), vec3(1e-6));
  float u = min(exits.x, min(exits.y, exits.z));
  for (int i = 0; i < 5; i++) {
    vec3 h = CAMERA + u * dir;
    vec3 h2 = h * h;
    u -= (dot(h2, h2) - 1.0) / (4.0 * dot(dir, h2 * h));
  }
  vec3 hit = CAMERA + u * dir;
  vec3 normal = hit * hit * hit;
  float facing = dot(normal, dir);
  vec3 stepX = u * (vec3(1.0, 0.0, 0.0) - dir * (normal.x / facing));
  vec3 stepY = u * (vec3(0.0, 1.0, 0.0) - dir * (normal.y / facing));
  float ring = hit.y * hit.y + hit.z * hit.z;
  float theta = atan(hit.z, hit.y);
  mat2 jacobian = mat2(
    stepX.x,
    (hit.y * stepX.z - hit.z * stepX.y) / ring,
    stepY.x,
    (hit.y * stepY.z - hit.z * stepY.y) / ring
  ) * warp * (2.0 / uView.x);

  vec2 gradX = vec2(jacobian[0][0], jacobian[1][0]);
  vec2 gradTheta = vec2(jacobian[0][1], jacobian[1][1]);
  float scale = max(length(gradX), 1e-8);
  float det = max(abs(gradX.x * gradTheta.y - gradX.y * gradTheta.x), 1e-12);
  float along = scale / det;
  float skew = dot(gradX, gradTheta) / det;
  float spacing = SPACING / scale;
  float detail = smoothstep(1.6, 3.2, spacing);
  if (detail <= 0.0) {
    outColor = vec4(0.0, 0.0, 0.0, 1.0);
    return;
  }
  float halfWidth = min(uWidth / scale, 0.2 * spacing);
  float headRadius = min(2.0 * uWidth / scale, 0.35 * spacing);
  float headReach = 4.0 * max(0.6 * headRadius, 0.7);
  float edge = uColumns > 1 ? 1.0 : 0.5;
  float period = TAU / uRings;
  float fog = exp(-max(u * length(dir) - 0.6, 0.0) * 1.6 * uDepth);

  float boost = 1.0;
  if (uMouse.z > 0.0) {
    vec2 m = screen - uMouse.xy;
    boost += 2.0 * uMouse.z * exp(-dot(m, m) / max(uMouse.w * uMouse.w, 1e-4));
  }

  int count = max(uColorCount, 1);
  vec3 total = vec3(0.0);
  for (int layer = 0; layer < 16; layer++) {
    if (layer >= uStreakCount) break;
    float x = hit.x + float(layer) * SPACING / 8.0;
    float nearest = floor(x / SPACING + 0.5);
    float side = x >= nearest * SPACING ? 1.0 : -1.0;
    for (int k = 0; k < 2; k++) {
      if (k >= uColumns) break;
      float column = nearest + side * float(k);
      float across = (x - column * SPACING) / scale;
      uint seed = scramble(uint(int(column) + 65536) + uint(layer) * 0x9e3779b9u);
      uint next = scramble(seed);
      float hue = unit(seed >> 16);
      float delta = theta - uPhase * (1.0 + floor(unit(seed) * 16.0) / 16.0) - unit(next) * period;
      delta -= period * floor(delta / period + 0.5);
      float ahead = delta * along - across * skew;
      if (abs(ahead) > headReach && (delta > 0.0 || -delta * uTail > 3.2)) continue;
      float behind = max(-delta, 0.0);
      float fall = exp(-uTail * behind) * (1.0 - smoothstep(0.5, 0.95, behind / (0.5 * period)));
      fall *= 1.0 - smoothstep(1.2, 3.2, uTail * behind);
      float reach = length(vec2(across, ahead));
      float trail = stroke(ahead > 0.0 ? reach : abs(across), halfWidth * mix(0.4, 1.0, fall)) * fall;
      float glint = orb(reach, headRadius) * mix(3.0, 1.8, uLightMode);
      float weight = mix(1.5, 1.0 + sin(uTwinkleClock + 7.0 * hue + 4.0), uTwinkle);
      weight *= 1.0 - smoothstep(0.72 * edge, edge, abs(across) / spacing);
      vec3 color = uColors[min(int(hue * float(count)), count - 1)];
      vec3 hot = mix(color, vec3(1.0), uHead * (1.0 - uLightMode));
      total += (trail * color + glint * hot) * weight;
    }
  }

  outColor = vec4(total * fog * boost * detail * uEncode, 1.0);
}`,ut=`#version 300 es
precision highp float;
uniform sampler2D uSource;
uniform vec2 uTarget;
uniform vec2 uTexel;
uniform float uLimit;
out vec4 outColor;

void main() {
  vec2 uv = gl_FragCoord.xy / uTarget;
  vec3 color = texture(uSource, uv - uTexel).rgb;
  color += texture(uSource, uv + uTexel).rgb;
  color += texture(uSource, uv + vec2(uTexel.x, -uTexel.y)).rgb;
  color += texture(uSource, uv + vec2(-uTexel.x, uTexel.y)).rgb;
  outColor = vec4(min(color * 0.25, vec3(uLimit)), 1.0);
}`,st=`#version 300 es
precision highp float;
uniform sampler2D uSource;
uniform vec2 uTarget;
uniform vec2 uStep;
out vec4 outColor;

void main() {
  vec2 uv = gl_FragCoord.xy / uTarget;
  vec3 color = texture(uSource, uv).rgb * 0.181862;
  color += (texture(uSource, uv + uStep * 1.423135).rgb + texture(uSource, uv - uStep * 1.423135).rgb) * 0.284316;
  color += (texture(uSource, uv + uStep * 3.326702).rgb + texture(uSource, uv - uStep * 3.326702).rgb) * 0.106598;
  color += (texture(uSource, uv + uStep * 5.242989).rgb + texture(uSource, uv - uStep * 5.242989).rgb) * 0.018156;
  outColor = vec4(color, 1.0);
}`,lt=`#version 300 es
precision highp float;
uniform sampler2D uScene;
uniform sampler2D uBloom0;
uniform sampler2D uBloom1;
uniform sampler2D uBloom2;
uniform sampler2D uBloom3;
uniform vec2 uView;
uniform float uDecode;
uniform float uGlow;
uniform float uBloom;
uniform float uPresence;
uniform float uOpacity;
uniform float uFade;
uniform float uLightMode;
uniform vec3 uTopColor;
uniform float uTopGlow;
out vec4 outColor;

float smootherstep01(float t) {
  t = clamp(t, 0.0, 1.0);
  return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uView;
  vec3 light = texelFetch(uScene, ivec2(gl_FragCoord.xy), 0).rgb;
  if (uBloom > 0.0) {
    vec3 halo = texture(uBloom0, uv).rgb * 0.42;
    halo += texture(uBloom1, uv).rgb * 0.3;
    halo += texture(uBloom2, uv).rgb * 0.18;
    halo += texture(uBloom3, uv).rgb * 0.1;
    light += halo * uBloom * (uLightMode > 0.5 ? 0.2 : 1.0);
  }
  light *= uDecode * uGlow * uPresence;

  if (uLightMode < 0.5 && uTopGlow > 0.0) {
    float aspect = uView.x / uView.y;
    vec2 q = vec2((uv.x - 0.5) * aspect, 1.04 - uv.y);
    float spread = 0.34 * max(aspect, 0.75);
    float core = exp(-q.x * q.x / (spread * spread) - q.y * q.y / 0.06);
    float halo = exp(-q.x * q.x / (3.6 * spread * spread) - q.y * q.y / 0.18);
    light += uTopColor * uTopGlow * (core * 0.85 + halo * 0.3) * uPresence;
  }

  vec3 lit = max(light, 0.0);
  vec3 mapped = sqrt(1.0 - exp(-1.3 * lit * lit / (lit + 0.025)));
  float peak = max(mapped.r, max(mapped.g, mapped.b));

  float mask = uOpacity;
  float edge = uFade * 0.5;
  if (edge > 0.0) {
    mask *= smootherstep01(uv.x / edge) * smootherstep01((1.0 - uv.x) / edge);
    mask *= smootherstep01(uv.y / edge) * smootherstep01((1.0 - uv.y) / edge);
  }
  float grain = (fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(0.06711056, 0.00583715)))) - 0.5) / 255.0;

  if (uLightMode > 0.5) {
    float coverage = clamp(smoothstep(0.0, 0.5, peak) * mask * 0.94 + grain, 0.0, 1.0);
    vec3 chroma = sqrt(clamp(lit / max(max(lit.r, max(lit.g, lit.b)), 1e-6), 0.0, 1.0));
    chroma = pow(chroma, vec3(1.35));
    chroma /= max(max(chroma.r, max(chroma.g, chroma.b)), 1e-4);
    float saturation = 1.0 - min(chroma.r, min(chroma.g, chroma.b));
    chroma = mix(vec3(0.3), chroma, smoothstep(0.08, 0.35, saturation));
    outColor = vec4(chroma * coverage, coverage);
  } else {
    vec3 color = clamp(mapped + grain, 0.0, 1.0) * mask;
    outColor = vec4(color, max(color.r, max(color.g, color.b)));
  }
}`,ct=2.6,ft=9,fe=Math.PI*2,k=(n,p,g)=>Math.min(g,Math.max(p,n)),Xe=(n,p,g)=>{let d=n.createShader(p);return d?(n.shaderSource(d,g),n.compileShader(d),n.getShaderParameter(d,n.COMPILE_STATUS)?d:(n.deleteShader(d),null)):null},j=(n,p)=>{let g=Xe(n,n.VERTEX_SHADER,at),d=Xe(n,n.FRAGMENT_SHADER,p),c=n.createProgram();if(!g||!d||!c)return null;if(n.attachShader(c,g),n.attachShader(c,d),n.bindAttribLocation(c,0,"aPosition"),n.linkProgram(c),n.deleteShader(g),n.deleteShader(d),!n.getProgramParameter(c,n.LINK_STATUS))return n.deleteProgram(c),null;let O={},Z=n.getProgramParameter(c,n.ACTIVE_UNIFORMS);for(let _=0;_<Z;_++){let D=n.getActiveUniform(c,_);D&&(O[D.name.replace(/\[0\]$/,"")]=n.getUniformLocation(c,D.name))}return{program:c,uniforms:O}},mt=({colors:n=["#ffffff"],backgroundColor:p="#94a3b8",speed:g=.3,streakCount:d=2,streakWidth:c=.8,streakLength:O=1,glow:Z=1,density:_=.6,twinkle:D=.3,zoom:Ie=3,backgroundGlow:Be=.1,headGlow:Ue=.6,depth:We=.5,bloom:Ne=.35,opacity:Oe=1,mouseInteraction:Ve=!0,mouseStrength:Ye=.4,mouseRadius:ze=.45,mouseDampening:He=.15,lens:qe=.5,holdToWarp:$e=!0,intro:je=!0,fade:Ze=0,lightMode:Ke=!1,mixBlendMode:de,paused:Je=!1,dpr:Qe,className:he="",style:et})=>{let pe=W(null),xe=W(null),K=W(null),E=W(null),[tt,ot]=De(0);return E.current={colors:(Array.isArray(n)&&n.length?n:["#ffffff"]).slice(0,ce).map(String),backgroundColor:String(p),speed:g,streakCount:Math.round(k(d,1,16)),streakWidth:Math.max(.05,c),streakLength:Math.max(.05,O),glow:Math.max(0,Z),density:_,twinkle:k(D,0,1),zoom:Math.max(.1,Ie),backgroundGlow:Math.max(0,Be),headGlow:k(Ue,0,1),depth:Math.max(0,We),bloom:Math.max(0,Ne),opacity:k(Oe,0,1),mouseInteraction:Ve,mouseStrength:Math.max(0,Ye),mouseRadius:Math.max(.01,ze),mouseDampening:Math.max(0,He),lens:k(qe,0,1),holdToWarp:$e,intro:je,fade:k(Ze,0,1),lightMode:Ke,paused:Je,dpr:Qe},le(()=>{let x=pe.current,f=xe.current,e=f?.getContext("webgl2",{alpha:!0,premultipliedAlpha:!0,antialias:!1,depth:!1,stencil:!1,powerPreference:"high-performance"});if(!x||!f||!e)return;let ge=!!e.getExtension("EXT_color_buffer_float"),J=j(e,it),Q=j(e,ut),V=j(e,st),ee=j(e,lt);if(!J||!Q||!V||!ee)return;let ve=t=>{t.preventDefault()},we=()=>ot(t=>t+1);f.addEventListener("webglcontextlost",ve),f.addEventListener("webglcontextrestored",we);let Ee=e.createBuffer(),te=e.createVertexArray();e.bindVertexArray(te),e.bindBuffer(e.ARRAY_BUFFER,Ee),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),e.STATIC_DRAW),e.enableVertexAttribArray(0),e.vertexAttribPointer(0,2,e.FLOAT,!1,0,0);let rt=ge?e.RGBA16F:e.RGBA8,oe=ge?1:.25,re=()=>({texture:null,framebuffer:e.createFramebuffer(),width:0,height:0}),F=re(),Y=Array.from({length:Fe},()=>[re(),re()]),ne=(t,o,a)=>{t.texture&&t.width===o&&t.height===a||(t.texture&&e.deleteTexture(t.texture),t.texture=e.createTexture(),t.width=o,t.height=a,e.bindTexture(e.TEXTURE_2D,t.texture),e.texStorage2D(e.TEXTURE_2D,1,rt,o,a),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.bindFramebuffer(e.FRAMEBUFFER,t.framebuffer),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,t.texture,0))},X=(t,o)=>(e.bindFramebuffer(e.FRAMEBUFFER,t?t.framebuffer:null),e.viewport(0,0,t?t.width:f.width,t?t.height:f.height),e.useProgram(o.program),o.uniforms),A=(t,o)=>{e.activeTexture(e.TEXTURE0+t),e.bindTexture(e.TEXTURE_2D,o)},S=document.createElement("canvas").getContext("2d",{willReadFrequently:!0}),ae=new Map,nt=t=>{if(ae.has(t))return ae.get(t);let o=[1,1,1];if(S){S.clearRect(0,0,1,1),S.fillStyle="#ffffff",S.fillStyle=t,S.fillRect(0,0,1,1);let[a,m,I]=S.getImageData(0,0,1,1).data;o=[a/255,m/255,I/255]}return ae.set(t,o),o},be=t=>nt(t).map(o=>o*o),G=window.matchMedia?.("(prefers-reduced-motion: reduce)").matches??!1,ie=new Float32Array(ce*3),l={x:0,y:0,inside:!1,held:!1},r={travel:0,intro:E.current.intro&&!G?0:1,mouseX:0,mouseY:0,lensX:0,lensY:0,touch:0,warp:0},b=0,C=0,z=!0,ue=()=>{let t=E.current,o=f.width,a=f.height,m=Math.max(1,x.clientWidth),I=Math.max(1,x.clientHeight);e.bindVertexArray(te),ne(F,o,a),Y.forEach((i,s)=>{let w=Math.max(1,Math.round(m/2**(s+1))),M=Math.max(1,Math.round(I/2**(s+1)));ne(i[0],w,M),ne(i[1],w,M)});let B=r.intro,q=Math.min(1,B*2.2),y=1+5*Math.pow(1-B,2)+2.5*r.warp,T=Math.max(1,Math.floor(fe*Math.max(t.density,.05)+.5)),L=fe/T,U=9+r.travel,P=t.colors.map(be);ie.fill(0);for(let i=0;i<ce;i++)ie.set(P[Math.min(i,P.length-1)],i*3);let $=i=>(2*i-o)/o,ke=i=>(2*i-a)/o,u=X(F,J);if(e.uniform2f(u.uView,o,a),e.uniform1f(u.uZoom,t.zoom),e.uniform1f(u.uPhase,U%(16*L)),e.uniform1f(u.uTwinkleClock,U%fe),e.uniform1f(u.uRings,T),e.uniform3fv(u.uColors,ie),e.uniform1i(u.uColorCount,P.length),e.uniform1i(u.uStreakCount,t.streakCount),e.uniform1i(u.uColumns,t.streakWidth>1?2:1),e.uniform1f(u.uWidth,5e-4*t.streakWidth),e.uniform1f(u.uTail,19/(t.streakLength*y)),e.uniform1f(u.uTwinkle,t.twinkle),e.uniform1f(u.uHead,t.headGlow),e.uniform1f(u.uDepth,t.depth),e.uniform4f(u.uMouse,$(r.mouseX),ke(r.mouseY),t.mouseInteraction?t.mouseStrength*r.touch:0,t.mouseRadius),e.uniform3f(u.uLens,$(r.lensX),ke(r.lensY),t.mouseInteraction?.5*t.lens*r.touch:0),e.uniform1f(u.uLightMode,t.lightMode?1:0),e.uniform1f(u.uEncode,oe),e.drawArrays(e.TRIANGLES,0,3),t.bloom>0){let i=F;Y.forEach(([s,w])=>{let M=X(s,Q);A(0,i.texture),e.uniform1i(M.uSource,0),e.uniform2f(M.uTarget,s.width,s.height),e.uniform2f(M.uTexel,1/i.width,1/i.height),e.uniform1f(M.uLimit,4*oe),e.drawArrays(e.TRIANGLES,0,3);let R=X(w,V);A(0,s.texture),e.uniform1i(R.uSource,0),e.uniform2f(R.uTarget,w.width,w.height),e.uniform2f(R.uStep,1/s.width,0),e.drawArrays(e.TRIANGLES,0,3),R=X(s,V),A(0,w.texture),e.uniform1i(R.uSource,0),e.uniform2f(R.uTarget,s.width,s.height),e.uniform2f(R.uStep,0,1/w.height),e.drawArrays(e.TRIANGLES,0,3),i=s})}let h=X(null,ee);A(0,F.texture),e.uniform1i(h.uScene,0),Y.forEach(([i],s)=>{A(s+1,i.texture),e.uniform1i(h[`uBloom${s}`],s+1)}),e.uniform2f(h.uView,o,a),e.uniform1f(h.uDecode,1/oe),e.uniform1f(h.uGlow,t.glow),e.uniform1f(h.uBloom,t.bloom),e.uniform1f(h.uPresence,q),e.uniform1f(h.uOpacity,t.opacity),e.uniform1f(h.uFade,t.fade),e.uniform1f(h.uLightMode,t.lightMode?1:0),e.uniform3fv(h.uTopColor,be(t.backgroundColor)),e.uniform1f(h.uTopGlow,t.backgroundGlow),e.drawArrays(e.TRIANGLES,0,3);for(let i=Fe;i>=0;i--)A(i,null)},Te=t=>{if(b=0,!z||document.hidden)return;let o=E.current,a=C?Math.min(.05,(t-C)/1e3):1/60;C=t,!o.intro||G?r.intro=1:r.intro<1&&(r.intro=Math.min(1,r.intro+a/ct));let m=o.holdToWarp&&l.held&&l.inside&&!G;r.warp+=((m?1:0)-r.warp)*(1-Math.exp(-a*(m?2.2:1.6)));let I=ft*Math.pow(1-r.intro,2)+6*r.warp,B=!o.paused&&!G;B&&(r.travel+=a*.1*o.speed*(1+I));let q=f.width/Math.max(1,x.clientWidth),y=l.x*q,T=(x.clientHeight-l.y)*q,L=o.mouseInteraction&&l.inside&&!G;L&&r.touch<.01&&(r.mouseX=y,r.mouseY=T,r.lensX=y,r.lensY=T);let U=o.mouseDampening>0?1-Math.exp(-a/o.mouseDampening):1;r.mouseX+=(y-r.mouseX)*U,r.mouseY+=(T-r.mouseY)*U;let P=1-Math.exp(-a*6);r.lensX+=(y-r.lensX)*P,r.lensY+=(T-r.lensY)*P,r.touch+=((L?1:0)-r.touch)*(1-Math.exp(-a*(L?4:2))),ue();let $=r.intro<1||r.warp>.001||Math.abs((L?1:0)-r.touch)>.002;B&&o.speed!==0||$?b=requestAnimationFrame(Te):C=0},v=()=>{!b&&z&&!document.hidden&&(b=requestAnimationFrame(Te))},se=()=>{let t=E.current,o=Math.max(1,x.clientWidth),a=Math.max(1,x.clientHeight),m=Math.min(t.dpr||window.devicePixelRatio||1,2);f.width=Math.max(1,Math.round(o*m)),f.height=Math.max(1,Math.round(a*m)),b||ue(),v()},Me=t=>{let o=x.getBoundingClientRect(),a=t.clientX-o.left,m=t.clientY-o.top;return{x:a,y:m,inside:a>=0&&m>=0&&a<=o.width&&m<=o.height}},Re=t=>{let o=Me(t);l.x=o.x,l.y=o.y,l.inside=o.inside,v()},Ae=t=>{let o=Me(t);o.inside&&(l.x=o.x,l.y=o.y,l.inside=!0,l.held=!0,v())},H=()=>{l.held=!1,v()},Se=()=>{l.inside=!1,l.held=!1,v()},Ce=()=>{C=0,v()},ye=new ResizeObserver(se);ye.observe(x);let Le=new IntersectionObserver(t=>{z=t.some(o=>o.isIntersecting),z&&(C=0,v())});Le.observe(x),window.addEventListener("pointermove",Re,{passive:!0}),window.addEventListener("pointerdown",Ae,{passive:!0}),window.addEventListener("pointerup",H,{passive:!0}),window.addEventListener("pointercancel",H,{passive:!0}),document.documentElement.addEventListener("pointerleave",Se),document.addEventListener("visibilitychange",Ce),se();let Pe=E.current.dpr;return K.current=()=>{let t=E.current;if(t.dpr!==Pe){Pe=t.dpr,se();return}b||ue(),v()},()=>{cancelAnimationFrame(b),K.current=null,f.removeEventListener("webglcontextlost",ve),f.removeEventListener("webglcontextrestored",we),ye.disconnect(),Le.disconnect(),window.removeEventListener("pointermove",Re),window.removeEventListener("pointerdown",Ae),window.removeEventListener("pointerup",H),window.removeEventListener("pointercancel",H),document.documentElement.removeEventListener("pointerleave",Se),document.removeEventListener("visibilitychange",Ce),[F,...Y.flat()].forEach(t=>{t.texture&&e.deleteTexture(t.texture),e.deleteFramebuffer(t.framebuffer)}),[J,Q,V,ee].forEach(t=>e.deleteProgram(t.program)),e.deleteBuffer(Ee),e.deleteVertexArray(te),e.isContextLost()||e.getExtension("WEBGL_lose_context")?.loseContext()}},[tt]),le(()=>{K.current?.()}),N("div",{ref:pe,className:`lightfall-container${he?` ${he}`:""}`,style:{...de?{mixBlendMode:de}:null,...et},children:N("canvas",{ref:xe,className:"lightfall-canvas","aria-hidden":"true"})})},Ge=mt;var me=document.getElementById("lightfall-mount"),dt=()=>{try{let p=document.createElement("canvas").getContext("webgl2");return p?(p.getExtension("WEBGL_lose_context")?.loseContext(),!0):!1}catch{return!1}},ht=window.matchMedia("(max-width: 860px)").matches;me&&!window.matchMedia("(prefers-reduced-motion: reduce)").matches&&dt()&&(_e(N(Ge,{colors:["#ff4b2f","#ffd400","#ff8a1f","#fff0d0"],backgroundColor:"#ff2b1a",speed:.34,streakCount:3,streakWidth:.65,streakLength:1.3,density:.42,twinkle:.22,zoom:3.1,backgroundGlow:.16,headGlow:.82,depth:.55,bloom:.4,glow:1,opacity:.72,mouseInteraction:!0,mouseStrength:.8,mouseRadius:.55,mouseDampening:.08,lens:.95,holdToWarp:!1,intro:!0,fade:.28,lightMode:!1,dpr:ht?1.25:1.75}),me),me.dataset.mounted="true");
