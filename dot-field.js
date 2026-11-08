import"./island-chunks/chunk-32GSOU5I.js";import{g as ze,j as Y,k as W,m as O,r as I}from"./island-chunks/chunk-6DTBS2I7.js";import"./island-chunks/chunk-SSQABL5H.js";var Ye=9e6,$e=12e4,_={grid:0,hex:1,spiral:2,scatter:3},Ze=Math.PI*(3-Math.sqrt(5)),Ke=`#version 300 es
precision highp float;
layout(location = 0) in vec4 aDot;
uniform vec2 uSize;
uniform float uPixel;
uniform float uRadius;
uniform float uCell;
uniform vec4 uLens;
uniform vec2 uWarp;
uniform vec3 uGlow;
uniform vec3 uFrom;
uniform vec3 uTo;
uniform vec4 uGlowColor;
uniform vec3 uGradient;
uniform float uTime;
uniform float uWave;
uniform float uSparkle;
uniform float uFocus;
uniform float uBase;
uniform float uLight;
out vec2 vLocal;
out float vRadius;
out float vBlur;
out float vHalo;
out float vHaloWidth;
out vec3 vColor;
out float vAlpha;

vec3 toRgb(vec3 lab) {
  float l = lab.x + 0.3963377774 * lab.y + 0.2158037573 * lab.z;
  float m = lab.x - 0.1055613458 * lab.y - 0.0638541728 * lab.z;
  float s = lab.x - 0.0894841775 * lab.y - 1.291485548 * lab.z;
  vec3 lms = vec3(l * l * l, m * m * m, s * s * s);
  vec3 lin = clamp(vec3(
    4.0767416621 * lms.x - 3.3077115913 * lms.y + 0.2309699292 * lms.z,
    -1.2684380046 * lms.x + 2.6097574011 * lms.y - 0.3413193965 * lms.z,
    -0.0041960863 * lms.x - 0.7034186147 * lms.y + 1.707614701 * lms.z
  ), 0.0, 1.0);
  return mix(lin * 12.92, 1.055 * pow(lin, vec3(1.0 / 2.4)) - 0.055, step(0.0031308, lin));
}

vec3 blend(vec3 a, vec3 b, float t) {
  vec2 ab = mix(a.yz, b.yz, t);
  float chroma = mix(length(a.yz), length(b.yz), t);
  float len = length(ab);
  return vec3(mix(a.x, b.x, t), len > 1e-5 ? ab * (chroma / len) : ab);
}

vec3 wave(vec2 p, float t) {
  float ay = p.x * 0.018 + t + 1.1 * sin(p.y * 0.016 - t * 0.4);
  float ax = p.y * 0.021 + t * 0.7 + 1.3 * sin(p.x * 0.013 + t * 0.3);
  float spread = cos(ay) * 0.0176 * cos(p.y * 0.016 - t * 0.4) + 0.5 * cos(ax) * 0.0169 * cos(p.x * 0.013 + t * 0.3);
  return uWave * vec3(0.5 * sin(ax), sin(ay), spread);
}

void main() {
  vec2 corner = vec2(float(gl_VertexID & 1), float(gl_VertexID >> 1)) * 2.0 - 1.0;
  vec2 center = uSize * 0.5;
  vec3 swell = wave(aDot.xy, uTime);
  vec2 source = center + (aDot.xy - center) * mix(1.12, 1.0, uFocus) + swell.xy;

  vec2 rel = source - uLens.xy;
  float x = length(rel) / uLens.z;
  float y = clamp(1.0 - x * x, 0.0, 1.0);
  float w = y * y * y;
  float k = uWarp.x * uLens.w;
  float grow = 1.0 + k * w;
  float spread = 1.0 + k * (w - 6.0 * x * x * y * y);
  float theta = uWarp.y * uLens.w * w;
  vec2 turn = vec2(cos(theta), sin(theta));
  vec2 display = uLens.xy + vec2(turn.x * rel.x - turn.y * rel.y, turn.y * rel.x + turn.x * rel.y) * grow;
  float scale = sqrt(max(grow * spread, 0.02));

  float spark = 0.0;
  if (uSparkle > 0.0) {
    float phase = 0.5 + 0.5 * sin(uTime * (0.55 + aDot.w * 0.9) + aDot.z * 6.2831853);
    spark = pow(phase, 48.0) * step(0.72, fract(aDot.z * 7.31 + aDot.w * 3.17)) * uSparkle;
  }

  float pool = 0.0;
  if (uGlow.x > 0.0) {
    float g = length(display - uLens.xy) / uGlow.x;
    float q = clamp(1.0 - g * g, 0.0, 1.0);
    pool = q * q * uGlow.y * uLens.w;
  }

  float radius = uRadius * (1.0 + 0.7 * spark);
  float device = radius * scale * uPixel;
  float fade = 1.0;
  if (device < 0.75) {
    fade = device * device / 0.5625;
    radius = 0.75 / (scale * uPixel);
  }
  float blur = (1.0 - uFocus) * uCell * 0.42;
  float energy = pow(radius / (radius + blur), 1.15);
  float halo = pool * uGlow.z;
  float haloWidth = 2.0 + radius * 1.5;
  float pad = radius + blur * 1.2 + 1.5 / (scale * uPixel) + (halo > 0.0 ? haloWidth * 2.5 : 0.0);

  float t = clamp(dot(aDot.xy - center, uGradient.xy) / uGradient.z + 0.5, 0.0, 1.0);
  vec3 tone = blend(uFrom, uTo, t);
  vec3 deep = vec3(tone.x * 0.72, tone.yz * 1.3);
  vec3 base = toRgb(tone);
  vec3 lit = toRgb(mix(deep, uGlowColor.xyz, uGlowColor.w));
  vec3 color = mix(base, lit, clamp(pool, 0.0, 1.0) * 0.8);
  color = mix(color, uLight > 0.5 ? color * 0.6 : vec3(1.0), spark * 0.55);

  vLocal = corner * pad;
  vRadius = radius + blur;
  vBlur = blur * 0.7;
  vHalo = halo;
  vHaloWidth = haloWidth;
  vColor = color;
  float shade = clamp(1.0 - swell.z * 2.5, 0.4, 1.6);
  vAlpha = mix(min(uBase * shade, 1.0), 1.0, clamp(max(pool, spark), 0.0, 1.0)) * fade * energy * smoothstep(0.0, 0.25, uFocus + 0.08);
  vec2 point = display + corner * pad * scale;
  gl_Position = vec4(point.x / uSize.x * 2.0 - 1.0, 1.0 - point.y / uSize.y * 2.0, 0.0, 1.0);
}`,Je=`#version 300 es
precision highp float;
uniform float uOpacity;
in vec2 vLocal;
in float vRadius;
in float vBlur;
in float vHalo;
in float vHaloWidth;
in vec3 vColor;
in float vAlpha;
out vec4 fragColor;

void main() {
  float dist = length(vLocal);
  float d = dist - vRadius;
  float edge = max(fwidth(dist), 1e-4) + vBlur;
  float cover = 1.0 - smoothstep(-0.5 * edge, 0.5 * edge, d);
  float glow = vHalo * exp(-max(d, 0.0) / vHaloWidth) * 0.5;
  float alpha = min(cover + glow, 1.0) * vAlpha * uOpacity;
  if (alpha < 0.002) discard;
  fragColor = vec4(vColor * alpha, alpha);
}`,v=(t,r,s)=>Math.min(s,Math.max(r,t)),Te=t=>{let r=String(t||"").trim(),s=/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(r);if(s){let c=s[1].length===3?s[1].replace(/./g,l=>l+l):s[1];return[0,2,4].map(l=>parseInt(c.slice(l,l+2),16)/255)}let o=/^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/i.exec(r);return o?[o[1],o[2],o[3]].map(c=>v(parseFloat(c)/255,0,1)):null},Qe=t=>t<=.04045?t/12.92:Math.pow((t+.055)/1.055,2.4),ke=t=>{let[r,s,o]=t.map(Qe),c=Math.cbrt(.4122214708*r+.5363325363*s+.0514459929*o),l=Math.cbrt(.2119034982*r+.6806995451*s+.1073969566*o),f=Math.cbrt(.0883024619*r+.2817188376*s+.6299787005*o);return[.2104542553*c+.793617785*l-.0040720468*f,1.9779984951*c-2.428592205*l+.4505937099*f,.0259040371*c+.7827717662*l-.808675766*f]},ie=(t,r,s)=>{let o=ke(Te(t)||r);if(!s)return o;let c=Math.atan2(o[2],o[1])*180/Math.PI,l=v(1-Math.abs(c-85)/40,0,1),f=.6+.16*l*l*(3-2*l);if(o[0]<=f)return o;let x=1+(o[0]-f)*1.6;return[f,o[1]*x,o[2]*x]},je=t=>{let r=ke(Te(t)||[1,1,1]);return Math.hypot(r[1],r[2])},D=(t,r,s)=>{let o=Math.imul(t,374761393)+Math.imul(r,668265263)+Math.imul(s,1274126177)|0;return o=Math.imul(o^o>>>13,1274126177),o^=o>>>16,(o>>>0)/4294967296},et=(t,r,s)=>{let o=0;for(let c=1;c<48;c++){let l=c/48,f=(1-l*l)**3,x=l*t,C=1+r*f,z=s*f;o=Math.max(o,Math.hypot(x*(C*Math.cos(z)-1),x*C*Math.sin(z)))}return o},tt=(t,r,s,o,c)=>{let l=t/2,f=r/2,x=-c,C=t+c,z=-c,$=r+c,N=[],V=(y,b,A,m)=>{y>=x&&y<=C&&b>=z&&b<=$&&N.push(y,b,A,m)};if(o===_.spiral){let y=s/Math.sqrt(Math.PI),b=Math.hypot(t/2+c,r/2+c),A=Math.ceil((b/y)**2);for(let m=0;m<A;m++){let w=y*Math.sqrt(m+.5),P=m*Ze;V(l+w*Math.cos(P),f+w*Math.sin(P),D(m,0,3),D(m,0,4))}}else{let y=o===_.hex?s*Math.sqrt(3)/2:s,b=Math.ceil((t/2+c)/s)+1,A=Math.ceil((r/2+c)/y)+1;for(let m=-A;m<=A;m++)for(let w=-b;w<=b;w++){let P=l+w*s+(o===_.hex&&m&1?s/2:0),S=f+m*y;o===_.scatter&&(P+=(D(w,m,1)-.5)*s*.8,S+=(D(w,m,2)-.5)*s*.8),V(P,S,D(w,m,3),D(w,m,4))}}return new Float32Array(N)},Pe=(t,r,s)=>{let o=t.createShader(r);return o?(t.shaderSource(o,s),t.compileShader(o),t.getShaderParameter(o,t.COMPILE_STATUS)?o:(console.error(t.getShaderInfoLog(o)),t.deleteShader(o),null)):null},ot=t=>{let r=Pe(t,t.VERTEX_SHADER,Ke),s=Pe(t,t.FRAGMENT_SHADER,Je),o=r&&s?t.createProgram():null;if(!r||!s||!o)return r&&t.deleteShader(r),s&&t.deleteShader(s),null;if(t.attachShader(o,r),t.attachShader(o,s),t.linkProgram(o),t.deleteShader(r),t.deleteShader(s),!t.getProgramParameter(o,t.LINK_STATUS))return console.error(t.getProgramInfoLog(o)),t.deleteProgram(o),null;let c={},l=t.getProgramParameter(o,t.ACTIVE_UNIFORMS);for(let f=0;f<l;f++){let x=t.getActiveUniform(o,f);x&&(c[x.name]=t.getUniformLocation(o,x.name))}return{program:o,uniforms:c}},nt=({dotRadius:t=1.5,dotSpacing:r=14,pattern:s="grid",gradientFrom:o="#5227FF",gradientTo:c="#FF9FFC",gradientAngle:l=135,cursorRadius:f=240,bulgeStrength:x=.6,twist:C=0,glowColor:z="#ffffff",glowRadius:$=160,glowIntensity:N=.8,baseOpacity:V=.55,waveAmplitude:y=0,sparkle:b=!1,speed:A=1,interactive:m=!0,holdToZoom:w=!0,intro:P=!0,lightMode:S=!1,opacity:Ie=1,maxDevicePixelRatio:De=2,className:le="",style:_e})=>{let ue=O(null),de=O(null),Z=O(null),[fe,Be]=Y(0),me=v(t,.25,12),Ge=me*2+v(r,1,200),he=l*Math.PI/180,ve={radius:me,step:Ge,pattern:_[s]??_.grid,from:ie(o,[.32,.15,1],S),to:ie(c,[1,.62,.99],S),glowColor:ie(z,[1,1,1],S),glowWeight:S?v((je(z)-.02)/.06,0,1):1,direction:[Math.sin(he),-Math.cos(he)],lensRadius:v(f,20,2e3),strength:v(x,-1,1),twist:v(C,-360,360)*Math.PI/180,glowRadius:Math.max(0,$),glowIntensity:v(N,0,2),base:v(V,0,1),wave:v(y,0,60),sparkle:b?1:0,speed:Math.max(0,A),interactive:m,holdToZoom:w,intro:P,light:S,opacity:v(Ie,0,1),maxRatio:v(De,.5,3)},B=O(ve);return B.current=ve,W(()=>{Z.current?.()}),W(()=>{let G=ue.current,g=de.current;if(!G||!g)return;let n=g.getContext("webgl2",{alpha:!0,premultipliedAlpha:!0,antialias:!1,depth:!1,stencil:!1,powerPreference:"high-performance"}),q=n?ot(n):null;if(!n||!q)return;let K=window.matchMedia("(prefers-reduced-motion: reduce)").matches,J=n.createVertexArray(),Q=n.createBuffer();n.bindVertexArray(J),n.bindBuffer(n.ARRAY_BUFFER,Q),n.enableVertexAttribArray(0),n.vertexAttribPointer(0,4,n.FLOAT,!1,16,0),n.vertexAttribDivisor(0,1),n.bindVertexArray(null);let p={width:1,height:1,ratio:1},u={x:0,y:0,inside:!1,down:!1},a={x:0,y:0,vx:0,vy:0,presence:0,zoom:0,ready:!1},pe="",j=0,xe=Math.random()*100,R=B.current.intro&&!K&&fe===0?0:1,T=0,H=0,ee=!0,te=document.visibilityState!=="hidden",oe=!1,we=(i,e)=>{let d=i.strength>=0?i.strength*1.2:i.strength*.7;return v(d*(1+e*.6),-.85,1.45)},We=()=>{let i=B.current,e=et(i.lensRadius,we(i,i.holdToZoom?1:0),i.twist*(i.holdToZoom?1.6:1)),d=Math.ceil(e+i.wave+i.step*2),M=(p.width+d*2)*(p.height+d*2),F=Math.max(i.step,Math.sqrt(M/$e)),L=`${p.width}|${p.height}|${F}|${i.pattern}|${d}`;if(L===pe)return;pe=L;let k=tt(p.width,p.height,F,i.pattern,d);j=k.length/4,n.bindBuffer(n.ARRAY_BUFFER,Q),n.bufferData(n.ARRAY_BUFFER,k,n.STATIC_DRAW)},ne=()=>{let i=B.current,e=G.getBoundingClientRect(),d=Math.max(1,e.width),M=Math.max(1,e.height),F=Math.min(window.devicePixelRatio||1,i.maxRatio,Math.sqrt(Ye/(d*M))),L=Math.max(1,Math.round(d*F)),k=Math.max(1,Math.round(M*F));(g.width!==L||g.height!==k)&&(g.width=L,g.height=k),p.width=d,p.height=M,p.ratio=L/d,We()},ge=i=>{if(T=0,oe)return;let e=B.current,d=v((i-H)/1e3||0,0,.05);H=Math.max(H,i),K||(xe+=d*e.speed),R<1&&(R=Math.min(1,R+d/1.8));let M=e.interactive&&u.inside;if(M&&(!a.ready||a.presence<.01)&&(a.x=u.x,a.y=u.y,a.vx=0,a.vy=0,a.ready=!0),a.ready){let ae=1+2*d*18,re=d*324,se=d*re,X=1/(ae+se),Ue=(ae*a.x+d*a.vx+se*u.x)*X,Xe=(ae*a.y+d*a.vy+se*u.y)*X;a.vx=(a.vx+re*(u.x-a.x))*X,a.vy=(a.vy+re*(u.y-a.y))*X,a.x=Ue,a.y=Xe}let F=M?1:0;a.presence+=(F-a.presence)*(1-Math.exp(-d/(M?.18:.4)));let L=M&&u.down&&e.holdToZoom?1:0;a.zoom+=(L-a.zoom)*(1-Math.exp(-d/.14));let k=R<.5?4*R*R*R:1-Math.pow(-2*R+2,3)/2,Oe=a.presence*a.presence*(3-2*a.presence),Ne=Math.abs(p.width*e.direction[0])+Math.abs(p.height*e.direction[1]);n.viewport(0,0,g.width,g.height),n.clearColor(0,0,0,0),n.clear(n.COLOR_BUFFER_BIT),n.enable(n.BLEND),n.blendFunc(n.ONE,n.ONE_MINUS_SRC_ALPHA),n.useProgram(q.program),n.bindVertexArray(J);let h=q.uniforms;n.uniform2f(h.uSize,p.width,p.height),n.uniform1f(h.uPixel,p.ratio),n.uniform1f(h.uRadius,e.radius),n.uniform1f(h.uCell,e.step),n.uniform4f(h.uLens,a.x,a.y,e.lensRadius*(1+a.zoom*.12),Oe),n.uniform2f(h.uWarp,we(e,a.zoom),e.twist*(1+a.zoom*.6)),n.uniform3f(h.uGlow,e.glowRadius*(1+a.zoom*.1),e.glowIntensity*(1+a.zoom*.25),e.light?0:1),n.uniform3f(h.uFrom,e.from[0],e.from[1],e.from[2]),n.uniform3f(h.uTo,e.to[0],e.to[1],e.to[2]),n.uniform4f(h.uGlowColor,e.glowColor[0],e.glowColor[1],e.glowColor[2],e.glowWeight),n.uniform3f(h.uGradient,e.direction[0],e.direction[1],Math.max(Ne,1)),n.uniform1f(h.uTime,xe),n.uniform1f(h.uWave,e.wave),n.uniform1f(h.uSparkle,e.sparkle),n.uniform1f(h.uFocus,k),n.uniform1f(h.uBase,e.light?Math.min(1,e.base*1.3):e.base),n.uniform1f(h.uLight,e.light?1:0),n.uniform1f(h.uOpacity,e.opacity),j&&n.drawArraysInstanced(n.TRIANGLE_STRIP,0,4,j);let Ve=Math.abs(u.x-a.x)+Math.abs(u.y-a.y)>.05||Math.hypot(a.vx,a.vy)>.5,qe=Math.abs(F-a.presence)>.002||Math.abs(L-a.zoom)>.002||a.presence>.002&&Ve,He=!K&&e.speed>0&&(e.wave>0||e.sparkle>0);(R<1||qe||He)&&ee&&te&&(T=requestAnimationFrame(ge))},E=()=>{T||oe||!ee||!te||(H=performance.now(),T=requestAnimationFrame(ge))};Z.current=()=>{ne(),E()};let ye=i=>{let e=G.getBoundingClientRect();return{x:i.clientX-e.left,y:i.clientY-e.top,inside:i.clientX>=e.left&&i.clientX<=e.right&&i.clientY>=e.top&&i.clientY<=e.bottom}},be=i=>{let e=ye(i);u.x=e.x,u.y=e.y,u.inside=e.inside,E()},Me=i=>{let e=ye(i);u.x=e.x,u.y=e.y,u.inside=e.inside,u.down=e.inside,E()},Re=()=>{u.inside=!1,u.down=!1,E()},U=i=>{u.down=!1,i.pointerType!=="mouse"&&(u.inside=!1),E()};window.addEventListener("pointermove",be,{passive:!0}),window.addEventListener("pointerdown",Me,{passive:!0}),window.addEventListener("pointerup",U,{passive:!0}),window.addEventListener("pointercancel",U,{passive:!0}),document.documentElement.addEventListener("pointerleave",Re);let Ee=i=>{i.preventDefault(),oe=!0,cancelAnimationFrame(T),T=0},Le=()=>Be(i=>i+1);g.addEventListener("webglcontextlost",Ee),g.addEventListener("webglcontextrestored",Le);let Ae=new ResizeObserver(()=>{ne(),E()});Ae.observe(G);let Se=new IntersectionObserver(i=>{ee=i.some(e=>e.isIntersecting),E()});Se.observe(G);let Fe=()=>{te=document.visibilityState!=="hidden",E()};return document.addEventListener("visibilitychange",Fe),ne(),E(),()=>{cancelAnimationFrame(T),Z.current=null,Ae.disconnect(),Se.disconnect(),window.removeEventListener("pointermove",be),window.removeEventListener("pointerdown",Me),window.removeEventListener("pointerup",U),window.removeEventListener("pointercancel",U),document.documentElement.removeEventListener("pointerleave",Re),document.removeEventListener("visibilitychange",Fe),g.removeEventListener("webglcontextlost",Ee),g.removeEventListener("webglcontextrestored",Le),n.isContextLost()||(n.deleteBuffer(Q),n.deleteVertexArray(J),n.deleteProgram(q.program))}},[fe]),I("div",{ref:ue,className:`dot-field${le?` ${le}`:""}`,style:_e,children:I("canvas",{ref:de,className:"dot-field__canvas","aria-hidden":"true"})})},Ce=nt;var ce=document.getElementById("dot-field-mount"),at=()=>{try{let r=document.createElement("canvas").getContext("webgl2");return r?(r.getExtension("WEBGL_lose_context")?.loseContext(),!0):!1}catch{return!1}};function rt(){let[t,r]=Y(document.documentElement.dataset.theme==="dark"),s=window.matchMedia("(max-width: 860px)").matches;return W(()=>{let o=new MutationObserver(()=>{r(document.documentElement.dataset.theme==="dark")});return o.observe(document.documentElement,{attributes:!0,attributeFilter:["data-theme"]}),()=>o.disconnect()},[]),I(Ce,{dotRadius:1.35,dotSpacing:15,pattern:"grid",gradientFrom:"#e10600",gradientTo:"#ffd400",gradientAngle:135,cursorRadius:220,bulgeStrength:.38,twist:8,glowColor:"#ffd400",glowRadius:150,glowIntensity:t?.7:.45,baseOpacity:t?.48:.3,waveAmplitude:5,sparkle:!0,speed:.55,interactive:!0,holdToZoom:!1,intro:!0,lightMode:!t,opacity:.62,maxDevicePixelRatio:s?1.2:1.5})}ce&&!window.matchMedia("(prefers-reduced-motion: reduce)").matches&&at()&&(ze(I(rt,{}),ce),ce.dataset.mounted="true");
