import{j as Se,k as ae,m as B,r as re}from"./chunk-6DTBS2I7.js";var He=9e6,Ue=12e4,_={grid:0,hex:1,spiral:2,scatter:3},Xe=Math.PI*(3-Math.sqrt(5)),Ye=`#version 300 es
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
}`,$e=`#version 300 es
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
}`,v=(o,i,s)=>Math.min(s,Math.max(i,o)),Fe=o=>{let i=String(o||"").trim(),s=/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(i);if(s){let l=s[1].length===3?s[1].replace(/./g,c=>c+c):s[1];return[0,2,4].map(c=>parseInt(l.slice(c,c+2),16)/255)}let t=/^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/i.exec(i);return t?[t[1],t[2],t[3]].map(l=>v(parseFloat(l)/255,0,1)):null},Ze=o=>o<=.04045?o/12.92:Math.pow((o+.055)/1.055,2.4),Pe=o=>{let[i,s,t]=o.map(Ze),l=Math.cbrt(.4122214708*i+.5363325363*s+.0514459929*t),c=Math.cbrt(.2119034982*i+.6806995451*s+.1073969566*t),d=Math.cbrt(.0883024619*i+.2817188376*s+.6299787005*t);return[.2104542553*l+.793617785*c-.0040720468*d,1.9779984951*l-2.428592205*c+.4505937099*d,.0259040371*l+.7827717662*c-.808675766*d]},se=(o,i,s)=>{let t=Pe(Fe(o)||i);if(!s)return t;let l=Math.atan2(t[2],t[1])*180/Math.PI,c=v(1-Math.abs(l-85)/40,0,1),d=.6+.16*c*c*(3-2*c);if(t[0]<=d)return t;let x=1+(t[0]-d)*1.6;return[d,t[1]*x,t[2]*x]},Ke=o=>{let i=Pe(Fe(o)||[1,1,1]);return Math.hypot(i[1],i[2])},k=(o,i,s)=>{let t=Math.imul(o,374761393)+Math.imul(i,668265263)+Math.imul(s,1274126177)|0;return t=Math.imul(t^t>>>13,1274126177),t^=t>>>16,(t>>>0)/4294967296},Je=(o,i,s)=>{let t=0;for(let l=1;l<48;l++){let c=l/48,d=(1-c*c)**3,x=c*o,I=1+i*d,F=s*d;t=Math.max(t,Math.hypot(x*(I*Math.cos(F)-1),x*I*Math.sin(F)))}return t},Qe=(o,i,s,t,l)=>{let c=o/2,d=i/2,x=-l,I=o+l,F=-l,U=i+l,W=[],O=(g,b,E,h)=>{g>=x&&g<=I&&b>=F&&b<=U&&W.push(g,b,E,h)};if(t===_.spiral){let g=s/Math.sqrt(Math.PI),b=Math.hypot(o/2+l,i/2+l),E=Math.ceil((b/g)**2);for(let h=0;h<E;h++){let w=g*Math.sqrt(h+.5),P=h*Xe;O(c+w*Math.cos(P),d+w*Math.sin(P),k(h,0,3),k(h,0,4))}}else{let g=t===_.hex?s*Math.sqrt(3)/2:s,b=Math.ceil((o/2+l)/s)+1,E=Math.ceil((i/2+l)/g)+1;for(let h=-E;h<=E;h++)for(let w=-b;w<=b;w++){let P=c+w*s+(t===_.hex&&h&1?s/2:0),S=d+h*g;t===_.scatter&&(P+=(k(w,h,1)-.5)*s*.8,S+=(k(w,h,2)-.5)*s*.8),O(P,S,k(w,h,3),k(w,h,4))}}return new Float32Array(W)},ze=(o,i,s)=>{let t=o.createShader(i);return t?(o.shaderSource(t,s),o.compileShader(t),o.getShaderParameter(t,o.COMPILE_STATUS)?t:(console.error(o.getShaderInfoLog(t)),o.deleteShader(t),null)):null},je=o=>{let i=ze(o,o.VERTEX_SHADER,Ye),s=ze(o,o.FRAGMENT_SHADER,$e),t=i&&s?o.createProgram():null;if(!i||!s||!t)return i&&o.deleteShader(i),s&&o.deleteShader(s),null;if(o.attachShader(t,i),o.attachShader(t,s),o.linkProgram(t),o.deleteShader(i),o.deleteShader(s),!o.getProgramParameter(t,o.LINK_STATUS))return console.error(o.getProgramInfoLog(t)),o.deleteProgram(t),null;let l={},c=o.getProgramParameter(t,o.ACTIVE_UNIFORMS);for(let d=0;d<c;d++){let x=o.getActiveUniform(t,d);x&&(l[x.name]=o.getUniformLocation(t,x.name))}return{program:t,uniforms:l}},et=({dotRadius:o=1.5,dotSpacing:i=14,pattern:s="grid",gradientFrom:t="#5227FF",gradientTo:l="#FF9FFC",gradientAngle:c=135,cursorRadius:d=240,bulgeStrength:x=.6,twist:I=0,glowColor:F="#ffffff",glowRadius:U=160,glowIntensity:W=.8,baseOpacity:O=.55,waveAmplitude:g=0,sparkle:b=!1,speed:E=1,interactive:h=!0,holdToZoom:w=!0,intro:P=!0,lightMode:S=!1,opacity:Te=1,maxDevicePixelRatio:Ce=2,className:ie="",style:Ie})=>{let le=B(null),ce=B(null),X=B(null),[ue,ke]=Se(0),fe=v(o,.25,12),_e=fe*2+v(i,1,200),de=c*Math.PI/180,he={radius:fe,step:_e,pattern:_[s]??_.grid,from:se(t,[.32,.15,1],S),to:se(l,[1,.62,.99],S),glowColor:se(F,[1,1,1],S),glowWeight:S?v((Ke(F)-.02)/.06,0,1):1,direction:[Math.sin(de),-Math.cos(de)],lensRadius:v(d,20,2e3),strength:v(x,-1,1),twist:v(I,-360,360)*Math.PI/180,glowRadius:Math.max(0,U),glowIntensity:v(W,0,2),base:v(O,0,1),wave:v(g,0,60),sparkle:b?1:0,speed:Math.max(0,E),interactive:h,holdToZoom:w,intro:P,light:S,opacity:v(Te,0,1),maxRatio:v(Ce,.5,3)},D=B(he);return D.current=he,ae(()=>{X.current?.()}),ae(()=>{let G=le.current,y=ce.current;if(!G||!y)return;let n=y.getContext("webgl2",{alpha:!0,premultipliedAlpha:!0,antialias:!1,depth:!1,stencil:!1,powerPreference:"high-performance"}),N=n?je(n):null;if(!n||!N)return;let Y=window.matchMedia("(prefers-reduced-motion: reduce)").matches,$=n.createVertexArray(),Z=n.createBuffer();n.bindVertexArray($),n.bindBuffer(n.ARRAY_BUFFER,Z),n.enableVertexAttribArray(0),n.vertexAttribPointer(0,4,n.FLOAT,!1,16,0),n.vertexAttribDivisor(0,1),n.bindVertexArray(null);let p={width:1,height:1,ratio:1},u={x:0,y:0,inside:!1,down:!1},a={x:0,y:0,vx:0,vy:0,presence:0,zoom:0,ready:!1},me="",K=0,ve=Math.random()*100,R=D.current.intro&&!Y&&ue===0?0:1,T=0,V=0,J=!0,Q=document.visibilityState!=="hidden",j=!1,pe=(r,e)=>{let f=r.strength>=0?r.strength*1.2:r.strength*.7;return v(f*(1+e*.6),-.85,1.45)},De=()=>{let r=D.current,e=Je(r.lensRadius,pe(r,r.holdToZoom?1:0),r.twist*(r.holdToZoom?1.6:1)),f=Math.ceil(e+r.wave+r.step*2),M=(p.width+f*2)*(p.height+f*2),z=Math.max(r.step,Math.sqrt(M/Ue)),A=`${p.width}|${p.height}|${z}|${r.pattern}|${f}`;if(A===me)return;me=A;let C=Qe(p.width,p.height,z,r.pattern,f);K=C.length/4,n.bindBuffer(n.ARRAY_BUFFER,Z),n.bufferData(n.ARRAY_BUFFER,C,n.STATIC_DRAW)},ee=()=>{let r=D.current,e=G.getBoundingClientRect(),f=Math.max(1,e.width),M=Math.max(1,e.height),z=Math.min(window.devicePixelRatio||1,r.maxRatio,Math.sqrt(He/(f*M))),A=Math.max(1,Math.round(f*z)),C=Math.max(1,Math.round(M*z));(y.width!==A||y.height!==C)&&(y.width=A,y.height=C),p.width=f,p.height=M,p.ratio=A/f,De()},xe=r=>{if(T=0,j)return;let e=D.current,f=v((r-V)/1e3||0,0,.05);V=Math.max(V,r),Y||(ve+=f*e.speed),R<1&&(R=Math.min(1,R+f/1.8));let M=e.interactive&&u.inside;if(M&&(!a.ready||a.presence<.01)&&(a.x=u.x,a.y=u.y,a.vx=0,a.vy=0,a.ready=!0),a.ready){let te=1+2*f*18,oe=f*324,ne=f*oe,H=1/(te+ne),Ve=(te*a.x+f*a.vx+ne*u.x)*H,qe=(te*a.y+f*a.vy+ne*u.y)*H;a.vx=(a.vx+oe*(u.x-a.x))*H,a.vy=(a.vy+oe*(u.y-a.y))*H,a.x=Ve,a.y=qe}let z=M?1:0;a.presence+=(z-a.presence)*(1-Math.exp(-f/(M?.18:.4)));let A=M&&u.down&&e.holdToZoom?1:0;a.zoom+=(A-a.zoom)*(1-Math.exp(-f/.14));let C=R<.5?4*R*R*R:1-Math.pow(-2*R+2,3)/2,Ge=a.presence*a.presence*(3-2*a.presence),Be=Math.abs(p.width*e.direction[0])+Math.abs(p.height*e.direction[1]);n.viewport(0,0,y.width,y.height),n.clearColor(0,0,0,0),n.clear(n.COLOR_BUFFER_BIT),n.enable(n.BLEND),n.blendFunc(n.ONE,n.ONE_MINUS_SRC_ALPHA),n.useProgram(N.program),n.bindVertexArray($);let m=N.uniforms;n.uniform2f(m.uSize,p.width,p.height),n.uniform1f(m.uPixel,p.ratio),n.uniform1f(m.uRadius,e.radius),n.uniform1f(m.uCell,e.step),n.uniform4f(m.uLens,a.x,a.y,e.lensRadius*(1+a.zoom*.12),Ge),n.uniform2f(m.uWarp,pe(e,a.zoom),e.twist*(1+a.zoom*.6)),n.uniform3f(m.uGlow,e.glowRadius*(1+a.zoom*.1),e.glowIntensity*(1+a.zoom*.25),e.light?0:1),n.uniform3f(m.uFrom,e.from[0],e.from[1],e.from[2]),n.uniform3f(m.uTo,e.to[0],e.to[1],e.to[2]),n.uniform4f(m.uGlowColor,e.glowColor[0],e.glowColor[1],e.glowColor[2],e.glowWeight),n.uniform3f(m.uGradient,e.direction[0],e.direction[1],Math.max(Be,1)),n.uniform1f(m.uTime,ve),n.uniform1f(m.uWave,e.wave),n.uniform1f(m.uSparkle,e.sparkle),n.uniform1f(m.uFocus,C),n.uniform1f(m.uBase,e.light?Math.min(1,e.base*1.3):e.base),n.uniform1f(m.uLight,e.light?1:0),n.uniform1f(m.uOpacity,e.opacity),K&&n.drawArraysInstanced(n.TRIANGLE_STRIP,0,4,K);let We=Math.abs(u.x-a.x)+Math.abs(u.y-a.y)>.05||Math.hypot(a.vx,a.vy)>.5,Oe=Math.abs(z-a.presence)>.002||Math.abs(A-a.zoom)>.002||a.presence>.002&&We,Ne=!Y&&e.speed>0&&(e.wave>0||e.sparkle>0);(R<1||Oe||Ne)&&J&&Q&&(T=requestAnimationFrame(xe))},L=()=>{T||j||!J||!Q||(V=performance.now(),T=requestAnimationFrame(xe))};X.current=()=>{ee(),L()};let we=r=>{let e=G.getBoundingClientRect();return{x:r.clientX-e.left,y:r.clientY-e.top,inside:r.clientX>=e.left&&r.clientX<=e.right&&r.clientY>=e.top&&r.clientY<=e.bottom}},ye=r=>{let e=we(r);u.x=e.x,u.y=e.y,u.inside=e.inside,L()},ge=r=>{let e=we(r);u.x=e.x,u.y=e.y,u.inside=e.inside,u.down=e.inside,L()},be=()=>{u.inside=!1,u.down=!1,L()},q=r=>{u.down=!1,r.pointerType!=="mouse"&&(u.inside=!1),L()};window.addEventListener("pointermove",ye,{passive:!0}),window.addEventListener("pointerdown",ge,{passive:!0}),window.addEventListener("pointerup",q,{passive:!0}),window.addEventListener("pointercancel",q,{passive:!0}),document.documentElement.addEventListener("pointerleave",be);let Me=r=>{r.preventDefault(),j=!0,cancelAnimationFrame(T),T=0},Re=()=>ke(r=>r+1);y.addEventListener("webglcontextlost",Me),y.addEventListener("webglcontextrestored",Re);let Le=new ResizeObserver(()=>{ee(),L()});Le.observe(G);let Ae=new IntersectionObserver(r=>{J=r.some(e=>e.isIntersecting),L()});Ae.observe(G);let Ee=()=>{Q=document.visibilityState!=="hidden",L()};return document.addEventListener("visibilitychange",Ee),ee(),L(),()=>{cancelAnimationFrame(T),X.current=null,Le.disconnect(),Ae.disconnect(),window.removeEventListener("pointermove",ye),window.removeEventListener("pointerdown",ge),window.removeEventListener("pointerup",q),window.removeEventListener("pointercancel",q),document.documentElement.removeEventListener("pointerleave",be),document.removeEventListener("visibilitychange",Ee),y.removeEventListener("webglcontextlost",Me),y.removeEventListener("webglcontextrestored",Re),n.isContextLost()||(n.deleteBuffer(Z),n.deleteVertexArray($),n.deleteProgram(N.program))}},[ue]),re("div",{ref:le,className:`dot-field${ie?` ${ie}`:""}`,style:Ie,children:re("canvas",{ref:ce,className:"dot-field__canvas","aria-hidden":"true"})})},lt=et;export{lt as a};
