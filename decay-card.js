import"./island-chunks/chunk-F7TZUDVZ.js";import{e as oe,g as ae,h as I,j as h,n as f}from"./island-chunks/chunk-OS2XOP7G.js";var _e=["window","card"],be=1.24,Se=`#version 300 es
in vec2 position;
out vec2 vUv;
void main() {
  vUv = vec2(position.x * 0.5 + 0.5, 0.5 - position.y * 0.5);
  gl_Position = vec4(position, 0.0, 1.0);
}`,ze=`#version 300 es
precision highp float;
uniform sampler2D uImage;
uniform vec2 uSize;
uniform vec2 uImageSize;
uniform float uUnit;
uniform float uScale;
uniform float uIdle;
uniform float uFrequency;
uniform int uOctaves;
uniform float uSeed;
uniform float uRadius;
uniform float uTime;
uniform float uFlow;
uniform float uChroma;
uniform float uGray;
uniform float uReady;
in vec2 vUv;
out vec4 fragColor;

vec4 permute(vec4 x) {
  return mod(((x * 34.0) + 1.0) * x, 289.0);
}

vec4 taylorInvSqrt(vec4 r) {
  return 1.79284291400159 - 0.85373472095314 * r;
}

float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod(i, 289.0);
  vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n = 1.0 / 7.0;
  vec3 ns = n * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}

float turbulence(vec2 p, float z) {
  float sum = 0.0;
  float amp = 1.0;
  for (int i = 0; i < 8; i++) {
    if (i >= uOctaves) break;
    sum += abs(snoise(vec3(p, z))) * amp;
    p = p * 2.0 + 19.19;
    amp *= 0.5;
  }
  return clamp(sum * 0.45 + 0.231, 0.0, 1.0);
}

float roundedBox(vec2 p, vec2 extent, float r) {
  vec2 q = abs(p) - extent + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

vec3 sampleImage(vec2 view) {
  vec2 uv = view / vec2(600.0, 750.0);
  float card = 600.0 / 750.0;
  float image = uImageSize.x / max(1.0, uImageSize.y);
  vec2 scale = card > image ? vec2(1.0, image / card) : vec2(card / image, 1.0);
  return texture(uImage, (uv - 0.5) * scale + 0.5).rgb;
}

void main() {
  vec2 view = vec2(300.0, 375.0) + (vUv * uSize - uSize * 0.5) / uUnit;
  float inside = min(min(view.x, 600.0 - view.x), min(view.y, 750.0 - view.y));
  float rim = 1.0 - smoothstep(0.0, 160.0, inside);
  float drift = snoise(vec3(view * 0.004 + uSeed * 0.37, uTime * 0.12)) * 0.5 + 0.5;
  float idle = uIdle * mix(smoothstep(0.55, 0.95, drift) * 0.5, 0.25 + 0.75 * smoothstep(0.3, 0.8, drift), rim);
  float scale = uScale * mix(0.2, 1.0, rim) + idle * 120.0;
  vec2 offset = vec2(0.0);
  if (scale > 0.01) {
    vec2 p = view * uFrequency + vec2(uSeed * 17.31, uSeed * 9.17);
    float z = uTime * (uFlow * 0.35 + uIdle * 0.5) + uSeed * 3.1;
    float red = turbulence(p, z);
    float blue = turbulence(p + vec2(31.7, 47.3), z + 5.3);
    offset = scale * (vec2(red, blue) - 0.5);
  }
  vec2 source = view + offset;
  float edge = roundedBox(source - vec2(300.0, 375.0), vec2(300.0, 375.0), uRadius);
  float alpha = (1.0 - smoothstep(-0.75 / uUnit, 0.75 / uUnit, edge)) * uReady;
  vec3 color = sampleImage(source);
  if (uChroma > 0.0) {
    vec2 split = offset * uChroma * 0.08 + vec2(uChroma * min(scale, 200.0) * 0.012, 0.0);
    color.r = sampleImage(source + split).r;
    color.b = sampleImage(source - split).b;
  }
  color = mix(color, vec3(dot(color, vec3(0.2126, 0.7152, 0.0722))), uGray);
  fragColor = vec4(color * alpha, alpha);
}`,l=(a,c,x)=>Math.min(x,Math.max(c,a)),ie=(a,c)=>a>c?c+(a-c)*.2:a<-c?-c+(a+c)*.2:a,ne=(a,c,x)=>{let d=a.createShader(c);return d?(a.shaderSource(d,x),a.compileShader(d),a.getShaderParameter(d,a.COMPILE_STATUS)?d:(a.deleteShader(d),null)):null},Ie=({image:a="https://images.unsplash.com/photo-1762846818262-33c197852fa8?w=900&q=80&auto=format&fit=crop",width:c=300,height:x=400,intensity:d=.5,sensitivity:ue=.5,hoverDecay:de=.05,recovery:me=.6,grain:fe=.25,detail:ve=5,pattern:he=4,idle:xe=.35,flow:pe=0,chroma:ye=0,travel:ge=50,tilt:we=10,scope:F="window",radius:B=0,grayscale:G=!1,children:Y,className:N="",style:Ee})=>{let q=h(null),O=h(null),M=h(null),A=h(null),[Re,p]=ae(!1),W={intensity:l(d,0,2),sensitivity:l(ue,0,1),hoverDecay:l(de,0,1),recovery:Math.max(.05,me),frequency:.003+l(fe,0,1)*.047,octaves:l(Math.round(ve),1,8),seed:Math.round(he),idle:l(xe,0,1),flow:l(pe,0,2),chroma:l(ye,0,2),travel:Math.max(0,ge),tilt:l(we,0,45),scope:_e.includes(F)?F:"window",radius:Math.max(0,B),grayscale:G},U=h(W);return U.current=W,I(()=>{let m=q.current,u=O.current;if(!m||!u)return;let v=window.matchMedia?.("(prefers-reduced-motion: reduce)").matches??!1,e=u.getContext("webgl2",{alpha:!0,premultipliedAlpha:!0,antialias:!1}),s=null,y=null,D=null,i={};if(e){let o=ne(e,e.VERTEX_SHADER,Se),r=ne(e,e.FRAGMENT_SHADER,ze);if(o&&r&&(s=e.createProgram(),e.attachShader(s,o),e.attachShader(s,r),e.bindAttribLocation(s,0,"position"),e.linkProgram(s),e.deleteShader(o),e.deleteShader(r),e.getProgramParameter(s,e.LINK_STATUS)||(e.deleteProgram(s),s=null)),s){D=e.createBuffer(),e.bindBuffer(e.ARRAY_BUFFER,D),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),e.STATIC_DRAW),e.enableVertexAttribArray(0),e.vertexAttribPointer(0,2,e.FLOAT,!1,0,0),y=e.createTexture(),e.bindTexture(e.TEXTURE_2D,y),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR_MIPMAP_LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,1,1,0,e.RGBA,e.UNSIGNED_BYTE,new Uint8Array([0,0,0,0]));for(let n of["uImage","uSize","uImageSize","uUnit","uScale","uIdle","uFrequency","uOctaves","uSeed","uRadius","uTime","uFlow","uChroma","uGray","uReady"])i[n]=e.getUniformLocation(s,n)}}s||p(!0);let t={x:0,y:0,rotate:0,level:0,time:0,cursorX:window.innerWidth/2,cursorY:window.innerHeight/2,lastX:window.innerWidth/2,lastY:window.innerHeight/2,seen:!1,hovered:!1,visible:!0,ready:!1,imageWidth:1,imageHeight:1},g=0,X=performance.now(),w=!0,_=0,L=0,b=()=>{if(!e||!s)return;let o=U.current,r=u.width,n=u.height;if(!r||!n)return;let R=Math.max(r/720,n/900)/be;e.viewport(0,0,r,n),e.clearColor(0,0,0,0),e.clear(e.COLOR_BUFFER_BIT),e.useProgram(s),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,y),e.uniform1i(i.uImage,0),e.uniform2f(i.uSize,r,n),e.uniform2f(i.uImageSize,t.imageWidth,t.imageHeight),e.uniform1f(i.uUnit,R),e.uniform1f(i.uScale,t.level*o.intensity*440),e.uniform1f(i.uIdle,o.idle),e.uniform1f(i.uFrequency,o.frequency),e.uniform1i(i.uOctaves,o.octaves),e.uniform1f(i.uSeed,o.seed),e.uniform1f(i.uRadius,Math.min(300,o.radius*(r/Math.max(1,u.clientWidth))/R)),e.uniform1f(i.uTime,t.time),e.uniform1f(i.uFlow,v?0:o.flow),e.uniform1f(i.uChroma,o.chroma),e.uniform1f(i.uGray,o.grayscale?1:0),e.uniform1f(i.uReady,t.ready?1:0),e.drawArrays(e.TRIANGLES,0,3)},H=o=>{if(g=0,!w)return;let r=U.current,n=Math.min(.05,Math.max(.001,(o-X)/1e3));X=o,t.time+=n;let R=Math.hypot(t.cursorX-t.lastX,t.cursorY-t.lastY)/n;t.lastX=t.cursorX,t.lastY=t.cursorY;let S=0,P=0;if(r.scope==="card"){if(t.hovered){let z=m.getBoundingClientRect();S=l((t.cursorX-z.left)/Math.max(1,z.width)*2-1,-1,1),P=l((t.cursorY-z.top)/Math.max(1,z.height)*2-1,-1,1)}}else t.seen&&(S=l(t.cursorX/Math.max(1,window.innerWidth)*2-1,-1,1),P=l(t.cursorY/Math.max(1,window.innerHeight)*2-1,-1,1));let C=1-Math.exp(-n/.16),Q=v?0:ie(S*120,r.travel),Z=v?0:ie(P*120,r.travel),ee=v?0:S*r.tilt;t.x+=(Q-t.x)*C,t.y+=(Z-t.y)*C,t.rotate+=(ee-t.rotate)*C;let T=r.scope==="window"||t.hovered?l(R/(2400-2100*r.sensitivity),0,1)**2:0;t.hovered&&(T=Math.max(T,r.hoverDecay));let Te=T>t.level?.08:r.recovery;t.level+=(T-t.level)*(1-Math.exp(-n/Te)),m.style.transform=`translate3d(${t.x.toFixed(2)}px, ${t.y.toFixed(2)}px, 0) rotate(${t.rotate.toFixed(3)}deg)`;let te=Math.abs(Q-t.x)+Math.abs(Z-t.y)+Math.abs(ee-t.rotate)>.05||Math.abs(T-t.level)>.002||t.level>.002&&r.flow>0&&!v||R>1,re=r.idle>0&&!v;L=(L+1)%2,(te||!re||L===0)&&b(),_=te?0:_+n,t.visible&&(_<.25||re)&&(g=requestAnimationFrame(H))},E=()=>{g||!w||!t.visible||(_=0,X=performance.now(),g=requestAnimationFrame(H))};A.current=E;let k=()=>{let o=Math.min(window.devicePixelRatio||1,2),r=Math.max(1,Math.round(u.clientWidth*o)),n=Math.max(1,Math.round(u.clientHeight*o));(u.width!==r||u.height!==n)&&(u.width=r,u.height=n),b()};M.current=o=>{if(t.ready=!1,b(),!o)return;let r=new Image;r.crossOrigin="anonymous",r.decoding="async",r.onload=()=>{if(w){if(!e||!s){p(!0);return}try{e.bindTexture(e.TEXTURE_2D,y),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!1),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,e.RGBA,e.UNSIGNED_BYTE,r),e.generateMipmap(e.TEXTURE_2D),t.imageWidth=r.naturalWidth||1,t.imageHeight=r.naturalHeight||1,t.ready=!0,p(!1),b()}catch{p(!0)}}},r.onerror=()=>{w&&p(!0)},r.src=o};let $=o=>{t.cursorX=o.clientX,t.cursorY=o.clientY,t.seen||(t.seen=!0,t.lastX=o.clientX,t.lastY=o.clientY),E()},K=()=>{t.hovered=!0,E()},V=()=>{t.hovered=!1,E()},j=new ResizeObserver(k);j.observe(u);let J=new IntersectionObserver(o=>{t.visible=o.some(r=>r.isIntersecting),t.visible&&E()});return J.observe(m),window.addEventListener("pointermove",$,{passive:!0}),m.addEventListener("pointerenter",K),m.addEventListener("pointerleave",V),k(),()=>{w=!1,cancelAnimationFrame(g),A.current=null,M.current=null,j.disconnect(),J.disconnect(),window.removeEventListener("pointermove",$),m.removeEventListener("pointerenter",K),m.removeEventListener("pointerleave",V),e&&(e.deleteTexture(y),e.deleteBuffer(D),e.deleteProgram(s))}},[]),I(()=>{M.current?.(a)},[a]),I(()=>{A.current?.()}),f("div",{ref:q,className:`decay-card${N?` ${N}`:""}`,style:{width:c,height:x,...Ee},children:[f("canvas",{ref:O,className:"decay-card__canvas","aria-hidden":"true"}),Re&&a&&f("img",{className:"decay-card__fallback",src:a,alt:"",style:{borderRadius:B,filter:G?"grayscale(1)":void 0}}),Y&&f("div",{className:"decay-card__content",children:Y})]})},ce=Ie;var se=document.getElementById("decay-root"),le=document.getElementById("decay-mount"),Me=()=>{try{let c=document.createElement("canvas").getContext("webgl2");return c?(c.getExtension("WEBGL_lose_context")?.loseContext(),!0):!1}catch{return!1}};se&&le&&!window.matchMedia("(prefers-reduced-motion: reduce)").matches&&Me()&&(oe(f(ce,{image:"f1-helmet.webp",width:360,height:450,intensity:.6,sensitivity:.5,hoverDecay:.1,recovery:.9,grain:.26,detail:4,pattern:4,idle:.26,flow:.12,chroma:.14,travel:24,tilt:7,scope:"card",radius:0,grayscale:!1,style:{width:"100%",height:"100%"}}),le),se.dataset.mounted="true");
