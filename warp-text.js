import{a as Se,b as Re,c as Le,d as Ee,f as Ae}from"./island-chunks/chunk-KYGVHNJJ.js";import"./island-chunks/chunk-SXAG5OYS.js";import{e as be,g as ke,h as X,j as Y,n as z}from"./island-chunks/chunk-OS2XOP7G.js";import"./island-chunks/chunk-SSQABL5H.js";var Te={bulge:0,pinch:1,swirl:2},Ie=1600,Be=1.6,_e=4,Ne=`#version 300 es
in vec2 position;
in vec2 uv;
out vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`,ze=`#version 300 es
precision highp float;

uniform sampler2D uTextTexture;
uniform vec2 uResolution;
uniform vec2 uPointer;
uniform float uPointerActive;
uniform float uTime;
uniform float uWarpStrength;
uniform float uWarpScale;
uniform float uSpeed;
uniform float uPointerInfluence;
uniform float uPointerStrength;
uniform float uRefraction;
uniform float uChromatic;
uniform float uRipple;
uniform float uMotion;
uniform float uLens;
uniform float uIntro;
uniform float uReveal;
uniform float uBackdrop;
uniform vec4 uClicks[4];

in vec2 vUv;
out vec4 fragColor;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);

  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));

  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 4; i++) {
    value += amplitude * noise(p);
    p *= 2.02;
    amplitude *= 0.5;
  }
  return value;
}

vec4 sampleText(vec2 uv) {
  if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
    return vec4(0.0);
  }
  return texture(uTextTexture, uv);
}

void main() {
  vec2 uv = vUv;
  float aspect = uResolution.x / max(uResolution.y, 1.0);
  float time = uTime * uSpeed;
  float scale = max(uWarpScale, 0.001);

  vec2 drift = vec2(time * 0.055, -time * 0.045);
  float n1 = fbm(uv * scale * 3.1 + drift);
  float n2 = fbm((uv + 19.17) * scale * 3.4 - drift.yx);
  vec2 ambient = (vec2(n1, n2) - 0.5) * (uWarpStrength * 0.045 * uMotion + uIntro * 0.18);

  vec2 pointerDelta = uv - uPointer;
  vec2 aspectDelta = vec2(pointerDelta.x * aspect, pointerDelta.y);
  float dist = length(aspectDelta);
  float radius = max(uPointerInfluence, 0.001);
  float t = clamp(dist / radius, 0.0, 1.0);
  float lens = smoothstep(radius, 0.0, dist) * uPointerActive;
  float bulge = t * (1.0 - t) * (1.0 - t) * 6.75 * uPointerActive;
  vec2 dir = dist > 0.0001 ? vec2(aspectDelta.x / aspect, aspectDelta.y) / dist : vec2(0.0);

  float rippleWave = sin(dist * 28.0 - time * 4.2) * 0.5 + 0.5;
  float rippleRing = (rippleWave - 0.5) * uRipple;
  vec2 pointerWarp = dir * rippleRing * bulge * uPointerStrength * 0.016;

  if (uLens > 1.5) {
    float twist = (1.0 - t) * (1.0 - t) * uPointerActive * uPointerStrength * 2.4;
    float s = sin(twist);
    float c = cos(twist);
    vec2 turned = vec2(aspectDelta.x * c - aspectDelta.y * s, aspectDelta.x * s + aspectDelta.y * c);
    pointerWarp += vec2(turned.x / aspect, turned.y) - pointerDelta;
  } else {
    float side = uLens > 0.5 ? -1.0 : 1.0;
    pointerWarp -= dir * side * bulge * uPointerStrength * 0.045;
  }

  vec2 shock = vec2(0.0);
  float shockLight = 0.0;
  for (int i = 0; i < 4; i++) {
    vec4 click = uClicks[i];
    if (click.w <= 0.0) continue;
    vec2 clickDelta = uv - click.xy;
    vec2 clickAspect = vec2(clickDelta.x * aspect, clickDelta.y);
    float clickDist = length(clickAspect);
    float age = click.z;
    float offset = (clickDist - age * 0.9) / (0.06 + age * 0.06);
    float fade = 1.0 - smoothstep(0.0, 1.6, age);
    float energy = exp(-offset * offset) * fade * smoothstep(0.0, 0.08, age) * click.w;
    vec2 clickDir = clickDist > 0.0001 ? vec2(clickAspect.x / aspect, clickAspect.y) / clickDist : vec2(0.0);
    shock -= clickDir * offset * energy * 0.09;
    shockLight += energy;
  }

  vec2 bend = pointerWarp + shock;
  vec2 rest = uv + ambient;
  vec2 splitDir = ambient + bend;
  float splitLen = length(splitDir);
  splitDir = splitLen > 0.00001 ? splitDir / splitLen : vec2(0.7071, 0.7071);
  vec2 split = splitDir * uRefraction * 0.16 * (0.35 + lens * 1.65 + uIntro * 3.0);
  float dispersion = uChromatic * 0.5;

  vec3 ink = vec3(0.0);
  vec3 cover = vec3(0.0);
  vec3 weight = vec3(0.0);
  for (int i = 0; i < 7; i++) {
    float k = 1.0 - float(i) / 3.0;
    vec4 tap = sampleText(rest + bend * (1.0 + dispersion * k) + split * k);
    vec3 band = vec3(max(k, 0.0), 1.0 - abs(k), max(-k, 0.0));
    ink += tap.rgb * band;
    cover += tap.a * band;
    weight += band;
  }
  ink /= weight;
  cover /= weight;
  float a = max(max(cover.r, cover.g), cover.b);
  vec3 color = ink + (a - cover) * uBackdrop;
  color = min(color + (lens + shockLight * 0.5) * cover.g * 0.055, vec3(a));
  fragColor = vec4(color, a) * uReveal;
}
`,Q=i=>typeof i=="number"?`${i}px`:i,Oe=i=>i*i*(3-2*i),He=i=>{let e=document.createElement("canvas");e.width=1,e.height=1;let t=e.getContext("2d",{willReadFrequently:!0});if(!t)return 1;t.fillStyle=i,t.fillRect(0,0,1,1);let[v,r,f]=t.getImageData(0,0,1,1).data;return(.2126*v+.7152*r+.0722*f)/255},Pe=(i,e,t)=>{let v=Array.from(e);return v.reduce((f,a)=>f+i.measureText(a).width,0)+Math.max(0,v.length-1)*t},Ue=(i,e,t,v,r)=>{let f=Array.from(e),a=t-Pe(i,e,r)/2;f.forEach((h,p)=>{i.fillText(h,a,v),a+=i.measureText(h).width+(p===f.length-1?0:r)})},qe=({container:i,width:e,height:t,dpr:v,props:r})=>{let f=document.createElement("canvas");f.width=Math.max(1,Math.floor(e*v)),f.height=Math.max(1,Math.floor(t*v));let a=f.getContext("2d");if(!a)return{canvas:f,ink:r.color};let h=document.createElement("span");h.textContent=r.text,Object.assign(h.style,{position:"absolute",visibility:"hidden",pointerEvents:"none",whiteSpace:"pre",inset:"0 auto auto 0",color:r.color,fontFamily:r.fontFamily,fontSize:Q(r.fontSize),fontWeight:String(r.fontWeight),letterSpacing:Q(r.letterSpacing),lineHeight:typeof r.lineHeight=="number"?String(r.lineHeight):r.lineHeight}),i.appendChild(h);let p=window.getComputedStyle(h),R=parseFloat(p.fontSize)||96,T=p.color||r.color,F=p.fontFamily||"sans-serif",I=p.fontWeight||String(r.fontWeight),L=p.letterSpacing==="normal"?0:parseFloat(p.letterSpacing)||0,g=parseFloat(p.lineHeight);Number.isFinite(g)||(g=R*(typeof r.lineHeight=="number"?r.lineHeight:.92)),h.remove(),a.setTransform(v,0,0,v,0,0),a.clearRect(0,0,e,t),a.textAlign="left",a.textBaseline="middle",a.fillStyle=T,a.imageSmoothingEnabled=!0,a.imageSmoothingQuality="high";let y=String(r.text||"").split(`
`),k=()=>{a.font=`${I} ${R}px ${F}`};k();let E=e*.86,A=t*.78,K=Math.max(...y.map(b=>Pe(a,b,L)),1),j=Math.max(g*y.length,1),M=Math.min(1,E/K,A/j);M<1&&(R*=M,L*=M,g*=M,k());let l=t/2-g*(y.length-1)/2;return y.forEach((b,J)=>Ue(a,b,e/2,l+J*g,L)),{canvas:f,ink:T}},Me=(i,e)=>{let t=i.uniforms;t.uWarpStrength.value=e.warpStrength,t.uWarpScale.value=e.warpScale,t.uSpeed.value=e.speed,t.uPointerInfluence.value=e.pointerInfluence,t.uPointerStrength.value=e.pointerStrength,t.uRefraction.value=e.refraction,t.uChromatic.value=e.chromatic,t.uRipple.value=e.ripple?1:0,t.uLens.value=Te[e.lens]??0},Ge=({text:i="Bend the moment",color:e="currentColor",warpStrength:t=.08,warpScale:v=1.7,speed:r=.55,pointerInfluence:f=.42,pointerStrength:a=.38,refraction:h=.018,chromatic:p=0,ripple:R=!0,clickRipple:T=!0,idleDrift:F=.2,lens:I="bulge",intro:L=!0,fontSize:g="clamp(3rem, 10vw, 9rem)",fontWeight:y=800,fontFamily:k="inherit",letterSpacing:E="-0.06em",lineHeight:A=.9,className:K="",style:j})=>{let M=Y(null),l=Y({text:i,color:e,fontSize:g,fontWeight:y,fontFamily:k,letterSpacing:E,lineHeight:A,warpStrength:t,warpScale:v,speed:r,pointerInfluence:f,pointerStrength:a,refraction:h,chromatic:p,ripple:R,clickRipple:T,idleDrift:F,lens:I,intro:L}),b=Y(null),[J,ce]=ke(!1);return X(()=>{l.current={text:i,color:e,fontSize:g,fontWeight:y,fontFamily:k,letterSpacing:E,lineHeight:A,warpStrength:t,warpScale:v,speed:r,pointerInfluence:f,pointerStrength:a,refraction:h,chromatic:p,ripple:R,clickRipple:T,idleDrift:F,lens:I,intro:L},b.current&&Me(b.current.program,l.current)},[i,e,g,y,k,E,A,t,v,r,f,a,h,p,R,T,F,I,L]),X(()=>{b.current?.rasterize()},[i,e,g,y,k,E,A]),X(()=>{let x=M.current;if(!x||typeof window>"u")return;let B,d,m,Z,le,P,ee,te,s=0,_=!1,D=!1,O=!0,H=!document.hidden,S=window.matchMedia?.("(prefers-reduced-motion: reduce)").matches??!1,se=0,U=!1,C=l.current.intro&&!S?0:1,ne=0,ue=0,fe="",u={x:.5,y:.5,tx:.5,ty:.5,active:0,activeTarget:0},q=Array.from({length:_e},()=>[.5,.5,0,0]),ie=0,Ce=performance.now();try{B=new Re({webgl:2,alpha:!0,premultipliedAlpha:!0,antialias:!0,dpr:Math.min(window.devicePixelRatio||1,2)}),d=B.gl}catch(n){console.warn("WarpText: WebGL could not be initialized.",n),ce(!0);return}d.clearColor(0,0,0,0);let c=d.canvas;c.style.position="absolute",c.style.inset="0",c.style.width="100%",c.style.height="100%",c.style.display="block",c.setAttribute("aria-hidden","true"),x.appendChild(c),P=new Ee(d,{generateMipmaps:!1,premultiplyAlpha:!0,minFilter:d.LINEAR,magFilter:d.LINEAR,wrapS:d.CLAMP_TO_EDGE,wrapT:d.CLAMP_TO_EDGE}),Z=new Ae(d),m=new Se(d,{vertex:Ne,fragment:ze,transparent:!0,depthTest:!1,depthWrite:!1,uniforms:{uTextTexture:{value:P},uResolution:{value:new Float32Array([1,1])},uPointer:{value:new Float32Array([.5,.5])},uPointerActive:{value:0},uTime:{value:0},uWarpStrength:{value:l.current.warpStrength},uWarpScale:{value:l.current.warpScale},uSpeed:{value:l.current.speed},uPointerInfluence:{value:l.current.pointerInfluence},uPointerStrength:{value:l.current.pointerStrength},uRefraction:{value:l.current.refraction},uChromatic:{value:l.current.chromatic},uRipple:{value:l.current.ripple?1:0},uMotion:{value:S?0:1},uLens:{value:Te[l.current.lens]??0},uIntro:{value:0},uReveal:{value:0},uBackdrop:{value:0},uClicks:{value:q}}}),le=new Le(d,{geometry:Z,program:m});let re=()=>{_||D||B.render({scene:le})},oe=async()=>{let n=++se;if(document.fonts?.ready)try{await document.fonts.ready}catch(N){}if(_||D||n!==se)return;let o=x.getBoundingClientRect();if(o.width<=0||o.height<=0)return;let w=Math.min(window.devicePixelRatio||1,2);fe=window.getComputedStyle(x).color;let W=qe({container:x,width:o.width,height:o.height,dpr:w,props:l.current});P.image=W.canvas,P.needsUpdate=!0,m.uniforms.uBackdrop.value=He(W.ink)<.5?1:0,U=!0,re()},ve=()=>{if(_||D)return;let n=x.getBoundingClientRect();n.width<=0||n.height<=0||(B.dpr=Math.min(window.devicePixelRatio||1,2),B.setSize(n.width,n.height),m.uniforms.uResolution.value[0]=d.drawingBufferWidth,m.uniforms.uResolution.value[1]=d.drawingBufferHeight,oe())},de=n=>{if(n.pointerType==="touch")return;let o=c.getBoundingClientRect();o.width<=0||o.height<=0||(u.tx=(n.clientX-o.left)/o.width,u.ty=1-(n.clientY-o.top)/o.height,u.activeTarget=1)},me=()=>{u.activeTarget=0},pe=n=>{if(!l.current.clickRipple)return;let o=c.getBoundingClientRect();if(o.width<=0||o.height<=0)return;let w=q[ie];ie=(ie+1)%q.length,w[0]=(n.clientX-o.left)/o.width,w[1]=1-(n.clientY-o.top)/o.height,w[2]=0,w[3]=S?.35:1},he=n=>{n.preventDefault(),D=!0,s&&cancelAnimationFrame(s),s=0,ce(!0)},ge=()=>{H=!document.hidden,H&&O&&!s&&(s=requestAnimationFrame(G)),!H&&s&&(cancelAnimationFrame(s),s=0)},xe=window.matchMedia?.("(prefers-reduced-motion: reduce)"),we=n=>{S=n.matches,S&&(C=1),m.uniforms.uMotion.value=S?0:1,re()},G=n=>{if(_||D)return;let o=(n-Ce)*.001,w=ne?Math.min(n-ne,50):16;ne=n,ue+=1,U&&C<1&&(C=Math.min(1,C+w/Ie));let W=1-C;U&&ue%15===0&&window.getComputedStyle(x).color!==fe&&oe();let N=Math.min(Math.max(l.current.idleDrift,0),1),$=u.activeTarget>0,We=.5+Math.sin(o*.33)*(.08+N*.2),Fe=.5+Math.cos(o*.27)*(.06+N*.2),ye=1-Math.exp(-w/($?130:470));u.x+=(($?u.tx:We)-u.x)*ye,u.y+=(($?u.ty:Fe)-u.y)*ye,u.active+=(($?1:N)-u.active)*(1-Math.exp(-w/270)),q.forEach(V=>{V[3]<=0||(V[2]+=w/1e3,V[2]>Be&&(V[3]=0))}),m.uniforms.uPointer.value[0]=u.x,m.uniforms.uPointer.value[1]=u.y,m.uniforms.uPointerActive.value=S?u.active*.35:u.active,m.uniforms.uTime.value=S?0:o,m.uniforms.uIntro.value=W*W*W,m.uniforms.uReveal.value=U?Oe(Math.min(1,C/.45)):0,re(),s=requestAnimationFrame(G)};return ee=new ResizeObserver(ve),ee.observe(x),te=new IntersectionObserver(([n])=>{O=n.isIntersecting,O&&H&&!s&&(s=requestAnimationFrame(G)),!O&&s&&(cancelAnimationFrame(s),s=0)},{threshold:0}),te.observe(x),c.addEventListener("pointermove",de),c.addEventListener("pointerleave",me),c.addEventListener("pointerdown",pe),c.addEventListener("webglcontextlost",he,!1),document.addEventListener("visibilitychange",ge),xe?.addEventListener("change",we),Me(m,l.current),b.current={program:m,rasterize:oe},ve(),s=requestAnimationFrame(G),()=>{if(_=!0,b.current=null,s&&cancelAnimationFrame(s),ee?.disconnect(),te?.disconnect(),c.removeEventListener("pointermove",de),c.removeEventListener("pointerleave",me),c.removeEventListener("pointerdown",pe),c.removeEventListener("webglcontextlost",he),document.removeEventListener("visibilitychange",ge),xe?.removeEventListener("change",we),!D)try{P?.texture&&d.deleteTexture(P.texture),Z?.remove?.(),m?.remove?.(),d.getExtension("WEBGL_lose_context")?.loseContext()}catch(n){}c.parentNode===x&&x.removeChild(c)}},[]),z("div",{ref:M,className:`warp-text ${K}`.trim(),style:j,role:"img","aria-label":i,children:J&&z("span",{className:"warp-text__fallback","aria-hidden":"true",style:{color:e,fontFamily:k,fontWeight:y,fontSize:Q(g),letterSpacing:Q(E),lineHeight:A},children:i})})},De=Ge;var ae=document.getElementById("warp-text-root");ae&&(ae.dataset.mounted="true",be(z(De,{text:`LEARNING IN
THE FAST LANE`,warpStrength:.08,warpScale:1.7,speed:.5,lens:"bulge",pointerInfluence:.42,pointerStrength:.38,refraction:.018,chromatic:.32,idleDrift:.2,ripple:!0,clickRipple:!0,intro:!0,color:"#f7f5f0",fontSize:"clamp(2.6rem, 8vw, 6.8rem)",fontWeight:900,fontFamily:"'Barlow Condensed', 'Arial Narrow', sans-serif",letterSpacing:"-0.03em",lineHeight:.88,style:{height:"100%"}}),ae));
