import"./island-chunks/chunk-F7TZUDVZ.js";import{e as ve,g as ge,h as C,j as P,n as M}from"./island-chunks/chunk-OS2XOP7G.js";import"./island-chunks/chunk-SSQABL5H.js";var Ne=`#version 300 es
in vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`,Re=`
uniform vec2 uView;
uniform float uScale;
uniform float uRotation;
uniform float uTime;
uniform float uWave;
uniform float uRipple;
uniform float uFold;
uniform vec2 uShift;
uniform vec4 uPointer;
uniform vec2 uDrag;
uniform vec4 uWaves[4];

const float e = 2.71828182845904523536;

float noise(vec2 texCoord) {
  float G = e;
  vec2 r = (G * sin(G * texCoord));
  return fract(r.x * r.y * (1.0 + texCoord.x));
}

vec2 rotateUvs(vec2 uv, float angle) {
  float c = cos(angle);
  float s = sin(angle);
  mat2 rot = mat2(c, -s, s, c);
  return rot * uv;
}

vec2 bend(vec2 uv) {
  vec2 aspect = vec2(uView.x / uView.y, 1.0);
  vec2 offset = (uv - uPointer.xy) * aspect;
  float touch = uPointer.z * exp(-dot(offset, offset) / (uPointer.w * uPointer.w));
  uv -= uDrag * touch;
  for (int i = 0; i < 4; i++) {
    vec4 wave = uWaves[i];
    if (wave.w <= 0.0) continue;
    vec2 q = (uv - wave.xy) * aspect;
    float dist = length(q);
    float front = dist - wave.z;
    float ring = exp(-front * front * 60.0) * wave.w;
    uv += q / max(dist, 0.0001) / aspect * ring * 0.034 * sin(front * 34.0);
  }
  return uv;
}

float silk(vec2 vUv) {
  vec2 uv = rotateUvs(vUv * uScale, uRotation);
  vec2 tex = uv * uScale + uShift;
  float tOffset = uTime;
  tex.y += 0.03 * uWave * sin(8.0 * tex.x - tOffset);
  return 0.6 + 0.4 * uFold * sin(5.0 * (tex.x + tex.y + cos(3.0 * tex.x + 5.0 * tex.y) + 0.02 * tOffset) + uRipple * sin(20.0 * (tex.x + tex.y - 0.1 * tOffset)));
}
`,Oe=`#version 300 es
precision highp float;
${Re}
out vec4 outColor;

void main() {
  vec2 vUv = gl_FragCoord.xy / uView;
  float pattern = silk(bend(vUv));
  float n = clamp((pattern - 0.2) / 0.8, 0.0, 1.0);
  outColor = vec4(pow(n, 6.0), 0.0, 0.0, 1.0);
}`,Ye=`#version 300 es
precision highp float;
${Re}
uniform sampler2D uBloom;
uniform vec3 uColor;
uniform vec3 uSheenColor;
uniform float uNoiseIntensity;
uniform float uDepth;
uniform float uSheen;
uniform float uGlow;
uniform float uLightMode;
uniform vec3 uLight;
uniform vec2 uStep;
uniform float uPresence;
uniform float uFade;
out vec4 outColor;

float smootherstep01(float t) {
  t = clamp(t, 0.0, 1.0);
  return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}

vec3 softClip(vec3 c) {
  vec3 over = max(c - 0.75, 0.0);
  return min(c, 0.75) + 0.25 * (1.0 - exp(-over * 4.0));
}

void main() {
  vec2 vUv = gl_FragCoord.xy / uView;
  vec2 coord = bend(vUv);
  float pattern = silk(coord);
  float rnd = noise(gl_FragCoord.xy);
  float n = clamp((pattern - 0.2) / 0.8, 0.0, 1.0);

  float gx = silk(coord + vec2(uStep.x, 0.0)) - pattern;
  float gy = silk(coord + vec2(0.0, uStep.y)) - pattern;
  vec3 normal = normalize(vec3(-gx * 26.0, -gy * 26.0, 1.0));
  vec3 toLight = normalize(vec3(uLight.xy, 0.85));
  float relief = 1.0 + (dot(normal, toLight) - toLight.z) * 1.8 * uDepth;
  vec3 halfway = normalize(toLight + vec3(0.0, 0.0, 1.0));
  float gloss = pow(max(dot(normal, halfway), 0.0), 48.0) * smoothstep(0.25, 0.85, n);
  float crest = pow(n, 5.0);
  float shine = (gloss * 0.85 + crest * 0.4) * uSheen * (1.0 + uLight.z * 0.6);

  float bloom = 0.0;
  if (uGlow > 0.0) {
    bloom += textureLod(uBloom, vUv, 1.0).r * 0.35;
    bloom += textureLod(uBloom, vUv, 2.0).r * 0.3;
    bloom += textureLod(uBloom, vUv, 3.0).r * 0.2;
    bloom += textureLod(uBloom, vUv, 4.0).r * 0.15;
  }

  vec3 result;
  if (uLightMode > 0.5) {
    float fold = smoothstep(0.28, 0.9, pattern);
    float specular = smoothstep(0.72, 0.98, pattern);
    vec3 shadowColor = uColor * (0.72 - 0.12 * uDepth);
    vec3 bodyColor = min(uColor * 1.18, vec3(1.0));
    vec3 lightBase = mix(shadowColor, bodyColor, fold) * mix(1.0, relief, 0.6);
    lightBase = mix(lightBase, vec3(1.0), clamp(specular * 0.92 + shine * 0.22 + bloom * uGlow * 0.2, 0.0, 1.0));
    float fineNoise = noise(gl_FragCoord.xy * 0.63 + vec2(17.0, 41.0));
    float grainSignal = (rnd + fineNoise - 1.0);
    float grainStrength = clamp(uNoiseIntensity * 0.038, 0.0, 0.16);
    result = clamp(lightBase + grainSignal * grainStrength, 0.0, 1.0);
  } else {
    float grain = rnd / 15.0 * uNoiseIntensity;
    float floorValue = mix(0.2, 0.03, uDepth);
    float curve = uDepth > 0.0 ? pow(n, 1.0 + 1.4 * uDepth) : n;
    float shade = uDepth > 0.0 ? floorValue + (1.0 - floorValue) * curve : pattern;
    vec3 tone = mix(uColor, pow(uColor, vec3(1.45)), (1.0 - n) * uDepth);
    vec3 lit = tone * shade * relief - vec3(grain);
    vec3 tint = mix(uColor, uSheenColor, 0.8);
    vec3 extra = tint * (shine + bloom * uGlow * 0.55);
    float blend = clamp((uSheen + uGlow) * 4.0, 0.0, 1.0);
    result = mix(clamp(lit, 0.0, 1.0), clamp(softClip(lit + extra), 0.0, 1.0), blend);
  }

  float edge = uFade * 0.5;
  float mask = 1.0;
  if (edge > 0.0) {
    mask = smootherstep01(vUv.x / edge) * smootherstep01((1.0 - vUv.x) / edge);
    mask *= smootherstep01(vUv.y / edge) * smootherstep01((1.0 - vUv.y) / edge);
  }
  float alpha = uPresence * mask;
  outColor = vec4(result * alpha, alpha);
}`,Ve=2.2,We=1.6,pe=1.6,S=[-.55,.7],xe=Math.hypot(S[0],S[1]),G=(r,l,h)=>Math.min(h,Math.max(l,r)),ze=r=>r*r*r*(r*(r*6-15)+10),He=r=>{let l=Number(r)||0;if(!l)return[0,0];let h=s=>{let c=Math.sin(l*12.9898+s*78.233)*43758.5453;return c-Math.floor(c)-.5};return[h(1)*6,h(2)*6]},we=(r,l,h)=>{let s=r.createShader(l);return s?(r.shaderSource(s,h),r.compileShader(s),r.getShaderParameter(s,r.COMPILE_STATUS)?s:(r.deleteShader(s),null)):null},Ee=(r,l)=>{let h=we(r,r.VERTEX_SHADER,Ne),s=we(r,r.FRAGMENT_SHADER,l),c=r.createProgram();if(!h||!s||!c)return null;if(r.attachShader(c,h),r.attachShader(c,s),r.bindAttribLocation(c,0,"aPosition"),r.linkProgram(c),r.deleteShader(h),r.deleteShader(s),!r.getProgramParameter(c,r.LINK_STATUS))return r.deleteProgram(c),null;let U={},N=r.getProgramParameter(c,r.ACTIVE_UNIFORMS);for(let A=0;A<N;A++){let L=r.getActiveUniform(c,A);L&&(U[L.name.replace(/\[0\]$/,"")]=r.getUniformLocation(c,L.name))}return{program:c,uniforms:U}},qe=({speed:r=5,scale:l=1,color:h="#7B7481",sheenColor:s="#ffffff",noiseIntensity:c=1.5,rotation:U=0,sheen:N=.5,depth:A=.5,glow:L=.3,ripple:ye=1,wave:be=1,variation:Me=0,mouseInteraction:Se=!0,interactionStrength:Ae=1,clickRipple:Le=!0,intro:_e=!0,fade:Fe=0,lightMode:Ce=!1,paused:Pe=!1,dpr:Ue,className:Q="",style:De})=>{let Z=P(null),j=P(null),O=P(null),g=P(null);return g.current={speed:r,scale:l,color:String(h),sheenColor:String(s),noiseIntensity:Math.max(0,c),rotation:U,sheen:Math.max(0,N),depth:G(A,0,1),glow:Math.max(0,L),ripple:Math.max(0,ye),wave:Math.max(0,be),variation:Me,mouseInteraction:Se,interactionStrength:Math.max(0,Ae),clickRipple:Le,intro:_e,fade:G(Fe,0,1),lightMode:Ce,paused:Pe,dpr:Ue},C(()=>{let R=Z.current,m=j.current,e=m?.getContext("webgl2",{alpha:!0,premultipliedAlpha:!0,antialias:!1,depth:!1,stencil:!1,powerPreference:"high-performance"});if(!R||!m||!e)return;let D=Ee(e,Oe),I=Ee(e,Ye);if(!D||!I)return;let ee=e.createBuffer(),Y=e.createVertexArray();e.bindVertexArray(Y),e.bindBuffer(e.ARRAY_BUFFER,ee),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),e.STATIC_DRAW),e.enableVertexAttribArray(0),e.vertexAttribPointer(0,2,e.FLOAT,!1,0,0);let _=e.createTexture(),V=e.createFramebuffer(),p={width:0,height:0},Ie=(t,n)=>{p.width===t&&p.height===n||(p.width=t,p.height=n,e.bindTexture(e.TEXTURE_2D,_),e.texImage2D(e.TEXTURE_2D,0,e.RGBA8,t,n,0,e.RGBA,e.UNSIGNED_BYTE,null),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR_MIPMAP_LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.bindFramebuffer(e.FRAMEBUFFER,V),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,_,0))},T=document.createElement("canvas").getContext("2d",{willReadFrequently:!0}),W=new Map,te=t=>{if(W.has(t))return W.get(t);let n=[1,1,1];if(T){T.clearRect(0,0,1,1),T.fillStyle="#ffffff",T.fillStyle=t,T.fillRect(0,0,1,1);let[a,i,f]=T.getImageData(0,0,1,1).data;n=[a/255,i/255,f/255]}return W.set(t,n),n},F=window.matchMedia?.("(prefers-reduced-motion: reduce)").matches??!1,u={width:1,height:1,ratio:1},d={x:0,y:0,inside:!1},v=[],z=new Float32Array(16),o={flow:0,intro:g.current.intro&&!F?0:1,touch:0,x:0,y:0,dragX:0,dragY:0,lightX:S[0],lightY:S[1]},w=0,y=0,X=!0,oe=(t,n,a,i,f)=>{let[b,$]=He(i.variation);e.uniform2f(t.uView,n,a),e.uniform1f(t.uScale,i.scale),e.uniform1f(t.uRotation,i.rotation),e.uniform1f(t.uTime,o.flow-We*(1-f)),e.uniform1f(t.uWave,i.wave),e.uniform1f(t.uRipple,i.ripple),e.uniform1f(t.uFold,.25+.75*f),e.uniform2f(t.uShift,b,$),e.uniform4f(t.uPointer,o.x/u.width,1-o.y/u.height,o.touch*i.interactionStrength,.32),e.uniform2f(t.uDrag,o.dragX,o.dragY),e.uniform4fv(t.uWaves,z)},H=()=>{let t=g.current,n=ze(o.intro),a=1-Math.pow(1-o.intro,3);e.bindVertexArray(Y),z.fill(0),v.slice(-4).forEach((f,b)=>{z.set([f.x,f.y,f.age*.6,Math.exp(-f.age/(pe*.45))],b*4)}),t.glow>0&&(Ie(Math.max(1,Math.round(m.width/4)),Math.max(1,Math.round(m.height/4))),e.bindFramebuffer(e.FRAMEBUFFER,V),e.viewport(0,0,p.width,p.height),e.useProgram(D.program),oe(D.uniforms,p.width,p.height,t,n),e.drawArrays(e.TRIANGLES,0,3),e.bindTexture(e.TEXTURE_2D,_),e.generateMipmap(e.TEXTURE_2D));let i=I.uniforms;e.bindFramebuffer(e.FRAMEBUFFER,null),e.viewport(0,0,m.width,m.height),e.useProgram(I.program),oe(i,m.width,m.height,t,n),e.uniform3fv(i.uColor,te(t.color)),e.uniform3fv(i.uSheenColor,te(t.sheenColor)),e.uniform1f(i.uNoiseIntensity,t.noiseIntensity),e.uniform1f(i.uDepth,t.depth),e.uniform1f(i.uSheen,t.sheen),e.uniform1f(i.uGlow,t.glow),e.uniform1f(i.uLightMode,t.lightMode?1:0),e.uniform3f(i.uLight,o.lightX,o.lightY,o.touch*t.interactionStrength),e.uniform2f(i.uStep,u.ratio/m.width,u.ratio/m.height),e.uniform1f(i.uPresence,a),e.uniform1f(i.uFade,t.fade),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,_),e.uniform1i(i.uBloom,0),e.drawArrays(e.TRIANGLES,0,3)},re=t=>{if(w=0,!X||document.hidden)return;let n=g.current,a=y?Math.min(.05,(t-y)/1e3):1/60;y=t;let i=!n.paused&&!F&&n.speed!==0;i&&(o.flow+=a*.1*n.speed),!n.intro||F?o.intro=1:o.intro<1&&(o.intro=Math.min(1,o.intro+a/Ve));let f=n.mouseInteraction&&d.inside&&!F;f&&o.touch<.01&&(o.x=d.x,o.y=d.y);let b=1-Math.exp(-a*10),$=o.x,Xe=o.y;o.x+=(d.x-o.x)*b,o.y+=(d.y-o.y)*b;let ke=(o.x-$)/Math.max(a,.001)/u.height,Be=(o.y-Xe)/Math.max(a,.001)/u.height,he=1-Math.exp(-a*4);o.dragX+=(G(ke*.03,-.06,.06)-o.dragX)*he,o.dragY+=(G(-Be*.03,-.06,.06)-o.dragY)*he,o.touch+=((f?1:0)-o.touch)*(1-Math.exp(-a*(f?3.5:1.4)));let k=S[0],B=S[1];if(f){let x=(d.x/u.width-.5)*(u.width/u.height),me=.5-d.y/u.height,K=Math.hypot(x,me);K>.04?(k=x/K*xe,B=me/K*xe):(k=o.lightX,B=o.lightY)}let de=1-Math.exp(-a*3);o.lightX+=(k-o.lightX)*de,o.lightY+=(B-o.lightY)*de;for(let x=v.length-1;x>=0;x--)v[x].age+=a,v[x].age>pe*2.5&&v.splice(x,1);H();let Ge=o.intro<1||v.length>0||Math.abs((f?1:0)-o.touch)>.002||Math.abs(o.dragX)+Math.abs(o.dragY)>2e-4||Math.abs(d.x-o.x)+Math.abs(d.y-o.y)>.3||Math.abs(k-o.lightX)+Math.abs(B-o.lightY)>.001;i||Ge?w=requestAnimationFrame(re):y=0},E=()=>{!w&&X&&!document.hidden&&(w=requestAnimationFrame(re))},q=()=>{let t=g.current,n=Math.max(1,R.clientWidth),a=Math.max(1,R.clientHeight),i=Math.min(t.dpr||window.devicePixelRatio||1,2);u.width=n,u.height=a,u.ratio=i,m.width=Math.max(1,Math.round(n*i)),m.height=Math.max(1,Math.round(a*i)),w||H(),E()},ne=t=>{let n=R.getBoundingClientRect(),a=t.clientX-n.left,i=t.clientY-n.top;return{x:a,y:i,inside:a>=0&&i>=0&&a<=n.width&&i<=n.height}},ie=t=>{let n=ne(t);d.x=n.x,d.y=n.y,d.inside=n.inside,E()},ae=t=>{if(!g.current.clickRipple||F)return;let a=ne(t);a.inside&&(v.push({x:a.x/u.width,y:1-a.y/u.height,age:0}),v.length>4&&v.shift(),E())},se=()=>{d.inside=!1,E()},ce=()=>{y=0,E()},le=new ResizeObserver(q);le.observe(R);let ue=new IntersectionObserver(t=>{X=t.some(n=>n.isIntersecting),X&&(y=0,E())});ue.observe(R),window.addEventListener("pointermove",ie,{passive:!0}),window.addEventListener("pointerdown",ae,{passive:!0}),document.documentElement.addEventListener("pointerleave",se),document.addEventListener("visibilitychange",ce),q();let fe=g.current.dpr;return O.current=()=>{let t=g.current;if(t.dpr!==fe){fe=t.dpr,q();return}w||H(),E()},()=>{cancelAnimationFrame(w),O.current=null,le.disconnect(),ue.disconnect(),window.removeEventListener("pointermove",ie),window.removeEventListener("pointerdown",ae),document.documentElement.removeEventListener("pointerleave",se),document.removeEventListener("visibilitychange",ce),e.deleteTexture(_),e.deleteFramebuffer(V),e.deleteProgram(D.program),e.deleteProgram(I.program),e.deleteBuffer(ee),e.deleteVertexArray(Y),e.getExtension("WEBGL_lose_context")?.loseContext()}},[]),C(()=>{O.current?.()}),M("div",{ref:Z,className:`silk-container${Q?` ${Q}`:""}`,style:De,children:M("canvas",{ref:j,className:"silk-canvas","aria-hidden":"true"})})},Te=qe;var J=document.getElementById("silk-mount"),$e=()=>{try{let l=document.createElement("canvas").getContext("webgl2");return l?(l.getExtension("WEBGL_lose_context")?.loseContext(),!0):!1}catch{return!1}};function Ke(){let[r,l]=ge(document.documentElement.dataset.theme==="dark"),h=window.matchMedia("(max-width: 860px)").matches;return C(()=>{let s=new MutationObserver(()=>{l(document.documentElement.dataset.theme==="dark")});return s.observe(document.documentElement,{attributes:!0,attributeFilter:["data-theme"]}),()=>s.disconnect()},[]),M(Te,{color:r?"#2b2020":"#cfc7b7",sheenColor:r?"#ffd400":"#ffffff",speed:3.6,scale:1.05,rotation:.35,sheen:r?.6:.48,depth:.55,glow:r?.4:.24,noiseIntensity:1.1,ripple:.8,wave:.9,mouseInteraction:!0,interactionStrength:.75,clickRipple:!1,intro:!0,fade:.32,lightMode:!r,dpr:h?1.25:1.75})}J&&!window.matchMedia("(prefers-reduced-motion: reduce)").matches&&$e()&&(ve(M(Ke,{}),J),J.dataset.mounted="true");
