import"./island-chunks/chunk-YBWAGG6K.js";import{e as ae,h as N,j as L,n as F}from"./island-chunks/chunk-CLWQRYW2.js";var U=8,Fe=1.8,se={up:[0,1],down:[0,-1],left:[-1,0],right:[1,0]},Ce=`#version 300 es
in vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`,ke=`
float hash(vec3 p3) {
  p3 = fract(p3 * 0.1031);
  p3 += dot(p3, p3.zyx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float smin(float a, float b, float k) {
  float r = exp2(-a / k) + exp2(-b / k);
  return -k * log2(r);
}

float sinlerp(float a, float b, float w) {
  return mix(a, b, (sin(w * 3.14159265 - 3.14159265 / 2.0) + 1.0) / 2.0);
}

float vn(vec2 p, float s, float seed) {
  vec2 cellp = floor(p / s);
  vec2 relp = mod(p, s);
  float g1 = hash(vec3(cellp, seed));
  float g2 = hash(vec3(cellp.x + 1.0, cellp.y, seed));
  float g3 = hash(vec3(cellp.x + 1.0, cellp.y + 1.0, seed));
  float g4 = hash(vec3(cellp.x, cellp.y + 1.0, seed));
  float bx = sinlerp(g1, g2, relp.x / s);
  float tx = sinlerp(g4, g3, relp.x / s);
  return sinlerp(bx, tx, relp.y / s);
}

float dbn(vec2 p, float s, float seed) {
  float o = s / 2.0;
  float n0 = vn(p, s, seed);
  float n1 = vn(p + vec2(o, o), s, seed + 0.1);
  float n2 = vn(p + vec2(-o, o), s, seed + 0.2);
  float n3 = vn(p + vec2(o, -o), s, seed + 0.3);
  float n4 = vn(p + vec2(-o, -o), s, seed + 0.4);
  return (2.0 * n0 + 1.5 * n1 + 1.25 * n2 + 1.125 * n3 + n4) / 7.0;
}
`,Te=`#version 300 es
precision highp float;
precision highp int;
uniform vec2 uResolution;
uniform float uTime;
uniform vec2 uFlow;
uniform float uSpeed;
uniform float uScale;
uniform float uTurbulence;
uniform float uFluidity;
uniform float uRimWidth;
uniform float uSharpness;
uniform float uShimmer;
uniform float uGlow;
uniform float uLine;
uniform float uMaxHalf;
uniform vec3 uColors[${U}];
uniform int uColorCount;
uniform vec4 uMagnet;
uniform vec4 uSwirl;
uniform float uReveal;
uniform float uLight;
uniform float uOpaque;
uniform vec3 uBackground;
uniform float uOpacity;
out vec4 outColor;
${ke}

vec3 palette(float h) {
  float x = clamp(h, 0.0, 1.0) * float(uColorCount - 1);
  int i = int(floor(x));
  int j = min(i + 1, uColorCount - 1);
  return mix(uColors[i], uColors[j], smoothstep(0.0, 1.0, x - float(i)));
}

void main() {
  float ref = 700.0 / max(uScale, 0.05);
  vec2 frag = gl_FragCoord.xy;
  vec2 toMagnet = (frag - uMagnet.xy) / uResolution.y;
  float pull = uMagnet.z * exp(-dot(toMagnet, toMagnet) / (uMagnet.w * uMagnet.w));
  if (pull > 0.001) {
    float angle = pull * 0.55;
    float c = cos(angle);
    float s = sin(angle);
    frag = uMagnet.xy + mat2(c, s, -s, c) * (frag - uMagnet.xy);
  }
  if (uSwirl.w > 0.0) {
    vec2 d = frag - uSwirl.xy;
    float reach = uSwirl.z;
    float angle = uSwirl.w * exp(-dot(d, d) / (reach * reach));
    float c = cos(angle);
    float s = sin(angle);
    frag = uSwirl.xy + mat2(c, s, -s, c) * d;
  }
  vec2 p = frag / uResolution.y * ref;

  float spd = 200.0 * uSpeed;
  float t = uTime;
  vec2 dir = uFlow;
  vec2 perp = vec2(-dir.y, dir.x);
  float distort1 = vn(p + perp * (t * spd), 60.0, 10.0) * 50.0 * uTurbulence;
  float distort2 = vn(p - perp * (t * spd), 120.0, 15.0) * 100.0 * uTurbulence;
  float peaks = dbn(p + distort1 + dir * (t * spd * 0.5), 40.0, 1.0);
  float peaks2 = dbn(p + distort2 - dir * (t * spd * 0.5), 40.0, 0.0);
  float field = smin(peaks, peaks2, max(uFluidity, 0.001));

  float slope = length(vec2(dFdx(field), dFdy(field)));
  float gap = abs(field - 0.4);
  float pixels = gap / max(slope, 1e-6);
  float halfBand = max(uRimWidth, 0.001) * 0.5;
  float across = max(gap / halfBand, pixels / uMaxHalf);
  float band = 5.0 * uRimWidth * (1.0 - across);
  float reveal = smoothstep(0.2, 0.85, pull);
  float shimmer = vn(p + dir * (t * spd * 0.5), 60.0, 12.0) * uShimmer * (1.0 - reveal * 0.75);
  float lit = clamp(band - shimmer, 0.0, 1.0);
  float glow = pow(lit, uSharpness) * uGlow * (1.0 + reveal * 0.25);
  float core = uLine > 0.0 ? smoothstep(uLine + 0.75, uLine - 0.75, pixels) * max(smoothstep(0.08, 0.6, glow), reveal) : 0.0;
  float shine = clamp(glow, 0.0, 1.0);
  float energy = max(shine * shine, core * 0.85) * uReveal;

  float h = clamp(0.5 + (peaks - peaks2) * 0.8, 0.0, 1.0);
  vec3 tint = palette(h);

  if (uLight > 0.5) {
    float chroma = max(tint.r, max(tint.g, tint.b)) - min(tint.r, min(tint.g, tint.b));
    vec3 ink = mix(vec3(0.07, 0.07, 0.08), tint * 0.55, clamp(chroma * 1.6, 0.0, 1.0));
    float cover = energy * uOpacity;
    outColor = uOpaque > 0.5 ? vec4(mix(uBackground, ink, cover), 1.0) : vec4(ink * cover, cover);
    return;
  }

  vec3 light = tint * energy * uOpacity;
  outColor = uOpaque > 0.5 ? vec4(uBackground + light, 1.0) : vec4(light, max(light.r, max(light.g, light.b)));
}`,le=(n,c,m)=>Math.min(m,Math.max(c,n)),ue=(n,c,m)=>{let r=n.createShader(c);return r?(n.shaderSource(r,m),n.compileShader(r),n.getShaderParameter(r,n.COMPILE_STATUS)?r:(n.deleteShader(r),null)):null},Pe=n=>{let c=ue(n,n.VERTEX_SHADER,Ce),m=ue(n,n.FRAGMENT_SHADER,Te),r=n.createProgram();if(!c||!m||!r)return null;if(n.attachShader(r,c),n.attachShader(r,m),n.bindAttribLocation(r,0,"aPosition"),n.linkProgram(r),n.deleteShader(c),n.deleteShader(m),!n.getProgramParameter(r,n.LINK_STATUS))return n.deleteProgram(r),null;let C={},O=n.getProgramParameter(r,n.ACTIVE_UNIFORMS);for(let R=0;R<O;R++){let E=n.getActiveUniform(r,R);E&&(C[E.name.replace("[0]","")]=n.getUniformLocation(r,E.name))}return{program:r,uniforms:C}},Oe=({colors:n=["#ffffff","#ffffff","#ffffff"],speed:c=.5,scale:m=1.6,turbulence:r=1,fluidity:C=.1,rimWidth:O=.2,sharpness:R=2.5,shimmer:E=1.5,glow:ce=2,lineWidth:me=1,flowDirection:de="down",opacity:pe=1,mouseInteraction:he=!0,mouseStrength:ve=1,mouseRadius:ge=.35,mouseDampening:xe=.15,clickSwirl:we=!0,intro:ye=!0,lightMode:Me=!1,transparent:be=!0,backgroundColor:Se,paused:Re=!1,dpr:Ee,mixBlendMode:z,className:G="",style:H,...Ae})=>{let X=L(null),$=L(null),I=L(null),Y={colors:Array.isArray(n)&&n.length?n.slice(0,U):["#ffffff"],speed:c,scale:Math.max(.05,m),turbulence:r,fluidity:Math.max(.001,C),rimWidth:Math.max(.001,O),sharpness:Math.max(.1,R),shimmer:Math.max(0,E),glow:Math.max(0,ce),lineWidth:Math.max(0,me),flow:se[de]??se.down,opacity:le(pe,0,1),mouseInteraction:he,mouseStrength:Math.max(0,ve),mouseRadius:Math.max(.01,ge),mouseDampening:Math.max(0,xe),clickSwirl:we,intro:ye,lightMode:Me,transparent:be,backgroundColor:Se,paused:Re,dpr:Ee},p=L(Y);return p.current=Y,N(()=>{let g=X.current,f=$.current,e=f?.getContext("webgl2",{alpha:!0,premultipliedAlpha:!0,antialias:!1,depth:!1,stencil:!1});if(!g||!f||!e)return;let k=Pe(e);if(!k)return;let i=k.uniforms,K=e.createBuffer(),W=e.createVertexArray();e.bindVertexArray(W),e.bindBuffer(e.ARRAY_BUFFER,K),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),e.STATIC_DRAW),e.enableVertexAttribArray(0),e.vertexAttribPointer(0,2,e.FLOAT,!1,0,0);let x=document.createElement("canvas").getContext("2d",{willReadFrequently:!0}),D=new Map,j=(t,o)=>{if(!t)return o;let a=String(t);if(D.has(a))return D.get(a);let s=o;if(x){x.clearRect(0,0,1,1),x.fillStyle="#000000",x.fillStyle=a,x.fillRect(0,0,1,1);let[d,S,v]=x.getImageData(0,0,1,1).data;s=[d/255,S/255,v/255]}return D.set(a,s),s},J=new Float32Array(U*3),A=window.matchMedia?.("(prefers-reduced-motion: reduce)").matches??!1,l={x:0,y:0,inside:!1},u={x:0,y:0,active:0},h={x:0,y:0,age:10},Q=0,w=p.current.intro&&!A?0:1,y=0,M=0,T=!0,_=()=>{let t=p.current,o=f.width/Math.max(1,g.clientWidth);t.colors.forEach((S,v)=>J.set(j(S,[1,1,1]),v*3));let a=Math.min(1,w);e.viewport(0,0,f.width,f.height),e.useProgram(k.program),e.bindVertexArray(W),e.uniform2f(i.uResolution,f.width,f.height),e.uniform1f(i.uTime,Q),e.uniform2f(i.uFlow,t.flow[0],t.flow[1]),e.uniform1f(i.uSpeed,t.speed),e.uniform1f(i.uScale,t.scale),e.uniform1f(i.uTurbulence,t.turbulence),e.uniform1f(i.uFluidity,t.fluidity),e.uniform1f(i.uRimWidth,t.rimWidth),e.uniform1f(i.uSharpness,t.sharpness),e.uniform1f(i.uShimmer,t.shimmer),e.uniform1f(i.uGlow,t.glow),e.uniform1f(i.uLine,t.lineWidth*o*.5),e.uniform1f(i.uMaxHalf,28*o),e.uniform3fv(i.uColors,J),e.uniform1i(i.uColorCount,t.colors.length),e.uniform4f(i.uMagnet,u.x,u.y,u.active*t.mouseStrength,t.mouseRadius);let s=h.age,d=1.9*Math.min(1,s/.23)*Math.exp(-Math.max(0,s-.23)*1.1);e.uniform4f(i.uSwirl,h.x,h.y,f.height*.22*(1+s*.5),s<6?d:0),e.uniform1f(i.uReveal,a*a*(3-2*a)),e.uniform1f(i.uLight,t.lightMode?1:0),e.uniform1f(i.uOpaque,t.transparent?0:1),e.uniform3fv(i.uBackground,j(t.backgroundColor,t.lightMode?[1,1,1]:[.0706,.0588,.0902])),e.uniform1f(i.uOpacity,t.opacity),e.drawArrays(e.TRIANGLES,0,3)},Z=t=>{if(y=0,!T||document.hidden)return;let o=p.current,a=M?le((t-M)/1e3,5e-4,.05):1/60;M=t;let s=o.paused||A?0:1;Q+=a*s,h.age+=a,o.intro&&!A&&w<1?w=Math.min(1,w+a/Fe):(!o.intro||A)&&(w=1);let d=o.mouseInteraction&&l.inside,S=o.mouseDampening>0?1-Math.exp(-a/o.mouseDampening):1;d&&(u.x+=(l.x-u.x)*S,u.y+=(l.y-u.y)*S);let v=d?1:0;u.active+=(v-u.active)*(1-Math.exp(-a/.3)),Math.abs(v-u.active)<.001&&(u.active=v),_(),s>0||u.active!==v||w<1||h.age<6?y=requestAnimationFrame(Z):M=0},b=()=>{!y&&T&&!document.hidden&&(y=requestAnimationFrame(Z))},B=()=>{let t=p.current,o=Math.max(1,g.clientWidth),a=Math.max(1,g.clientHeight),s=Math.min(t.dpr||window.devicePixelRatio||1,2);f.width=Math.max(1,Math.round(o*s)),f.height=Math.max(1,Math.round(a*s)),_(),b()},Le=t=>{let o=g.getBoundingClientRect(),a=t.clientX-o.left,s=t.clientY-o.top,d=f.width/Math.max(1,o.width);l.inside=a>=0&&s>=0&&a<=o.width&&s<=o.height,l.x=a*d,l.y=(o.height-s)*d},V=t=>{let o=l.inside;Le(t),l.inside&&!o&&u.active<.05&&(u.x=l.x,u.y=l.y),b()},ee=t=>{V(t),!(!l.inside||!p.current.clickSwirl||A)&&(h.x=l.x,h.y=l.y,h.age=0,b())},P=t=>{t.pointerType!=="mouse"&&(l.inside=!1)},te=()=>{l.inside=!1},ne=()=>{M=0,b()},oe=new ResizeObserver(B);oe.observe(g);let ie=new IntersectionObserver(t=>{T=t.some(o=>o.isIntersecting),T&&(M=0,b())});ie.observe(g),window.addEventListener("pointermove",V,{passive:!0}),window.addEventListener("pointerdown",ee,{passive:!0}),window.addEventListener("pointerup",P,{passive:!0}),window.addEventListener("pointercancel",P,{passive:!0}),document.documentElement.addEventListener("pointerleave",te),document.addEventListener("visibilitychange",ne),B();let re=p.current.dpr;return I.current=()=>{let t=p.current;if(t.dpr!==re){re=t.dpr,B();return}y||_(),b()},()=>{cancelAnimationFrame(y),I.current=null,oe.disconnect(),ie.disconnect(),window.removeEventListener("pointermove",V),window.removeEventListener("pointerdown",ee),window.removeEventListener("pointerup",P),window.removeEventListener("pointercancel",P),document.documentElement.removeEventListener("pointerleave",te),document.removeEventListener("visibilitychange",ne),e.deleteProgram(k.program),e.deleteBuffer(K),e.deleteVertexArray(W),e.getExtension("WEBGL_lose_context")?.loseContext()}},[]),N(()=>{I.current?.()}),F("div",{ref:X,className:`flux-lines-container${G?` ${G}`:""}`,style:z?{...H,mixBlendMode:z}:H,...Ae,children:F("canvas",{ref:$,className:"flux-lines-canvas","aria-hidden":"true"})})},fe=Oe;var q=document.getElementById("flux-lines-root");q&&(q.dataset.mounted="true",ae(F(fe,{colors:["#ffffff","#ffd400","#f7f5f0"],speed:.45,scale:1.45,turbulence:1.05,fluidity:.12,rimWidth:.2,sharpness:2.2,shimmer:.8,glow:2.1,lineWidth:1,flowDirection:"down",mouseInteraction:!0,mouseStrength:.8,mouseRadius:.4,mouseDampening:.18,clickSwirl:!0,intro:!0,lightMode:!1,transparent:!0,opacity:.95,dpr:1.5}),q));
