import"./island-chunks/chunk-SXAG5OYS.js";import{e as se,h as q,j as A,n as _}from"./island-chunks/chunk-OS2XOP7G.js";import"./island-chunks/chunk-SSQABL5H.js";var Pe=`#version 300 es
in vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`,Se=`#version 300 es
precision highp float;
uniform vec2 uView;
uniform vec2 uScale;
uniform float uZoom;
uniform float uTime;
uniform float uTwist;
uniform float uWave;
uniform float uSharpness;
uniform vec2 uOrbit;
uniform float uDither;
out vec4 outColor;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

void main() {
  vec2 c = (gl_FragCoord.xy * uScale - 0.5 * uView) / uZoom;
  vec3 rd = normalize(vec3(c, uView.y));
  vec3 ro = vec3(0.0, 0.0, -4.0);
  float cy = cos(uOrbit.x);
  float sy = sin(uOrbit.x);
  float cx = cos(uOrbit.y);
  float sx = sin(uOrbit.y);
  mat3 orbit = mat3(cy, 0.0, -sy, 0.0, 1.0, 0.0, sy, 0.0, cy) * mat3(1.0, 0.0, 0.0, 0.0, cx, sx, 0.0, -sx, cx);
  ro = orbit * ro;
  rd = orbit * rd;
  float z = 0.0;
  float density = 0.0;
  float band = 0.0;
  for (int i = 0; i < 60; i++) {
    vec3 p = ro + rd * z;
    vec3 s = p;
    float d = p.y - uTime;
    p.x += uWave * (1.0 + p.y) * sin(d + p.x * 0.1) * cos(0.34 * d + p.x * 0.05);
    vec2 q = p.xz *= mat2(cos(p.y * uTwist + vec4(0.0, 11.0, 33.0, 0.0) - uTime));
    float shell = abs(sqrt(length(q * q)) - 0.25 * (5.0 + s.y)) / 3.0;
    float stepLength = shell + 0.0008;
    z += stepLength;
    float phase = s.y + p.z * 0.5 + s.z - length(s - p);
    float weight = (1.0 + sin(phase + 8.0)) * exp(-shell * uSharpness) * stepLength;
    density += weight;
    band += weight * (0.5 + 0.5 * sin(phase * 0.5 + 1.0));
  }
  vec2 encoded = sqrt(vec2(density, band) / (1.0 + vec2(density, band)));
  encoded += (vec2(hash(gl_FragCoord.xy), hash(gl_FragCoord.yx + 17.0)) - 0.5) * uDither;
  outColor = vec4(encoded, 0.0, 1.0);
}`,Le=`#version 300 es
precision highp float;
uniform sampler2D uVolume;
uniform vec2 uResolution;
uniform vec3 uColor;
uniform vec3 uHighlight;
uniform vec3 uInk;
uniform float uGain;
uniform float uShine;
uniform float uPresence;
uniform float uGrain;
uniform float uFade;
uniform float uOpacity;
uniform float uTime;
uniform float uLightMode;
uniform vec3 uHeat;
out vec4 outColor;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float smootherstep(float edge, float x) {
  float t = clamp(x / max(edge, 0.0001), 0.0, 1.0);
  return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  vec2 encoded = clamp(texture(uVolume, uv).rg, 0.0, 0.9995);
  encoded *= encoded;
  vec2 volume = encoded / (1.0 - encoded);
  vec2 offset = (gl_FragCoord.xy - uHeat.xy) / uResolution.y;
  float heat = uHeat.z * exp(-dot(offset, offset) / 0.05);
  float density = volume.r * uGain * uPresence * (1.0 + heat * 0.35);
  float band = clamp(volume.g / max(volume.r, 0.00001), 0.0, 1.0);
  vec3 tint = mix(uColor, uHighlight, band * 0.35);
  vec3 hdr = tint * density + uHighlight * density * density * uShine;
  float peak = max(hdr.r, max(hdr.g, hdr.b));
  float level = 1.0 - exp(-peak);
  float hot = smoothstep(1.0, 3.0, peak);
  float edge = uFade * 0.5;
  float mask = smootherstep(edge, uv.x) * smootherstep(edge, 1.0 - uv.x) * smootherstep(edge, uv.y) * smootherstep(edge, 1.0 - uv.y);
  mask *= uOpacity;
  float grain = (hash(gl_FragCoord.xy + fract(uTime * 7.31) * 113.0) - 0.5) * uGrain;
  if (uLightMode > 0.5) {
    vec3 color = mix(uInk, vec3(1.0), hot * 0.75);
    float alpha = clamp(pow(level, 0.8) * 0.9 * (1.0 + grain), 0.0, 1.0) * mask;
    outColor = vec4(color * alpha, alpha);
  } else {
    vec3 hue = hdr / max(peak, 0.0001);
    vec3 color = mix(hue * level, vec3(level), hot * 0.6);
    color = pow(color, vec3(1.0 / 2.2));
    color = clamp(color + grain * level, 0.0, 1.0) * mask;
    outColor = vec4(color, max(color.r, max(color.g, color.b)));
  }
}`,Ce=1.6,ce=16e5,V=(n,h,p)=>Math.min(p,Math.max(h,n)),ue=(n,h,p)=>{let m=n.createShader(h);return m?(n.shaderSource(m,p),n.compileShader(m),n.getShaderParameter(m,n.COMPILE_STATUS)?m:(n.deleteShader(m),null)):null},le=(n,h)=>{let p=ue(n,n.VERTEX_SHADER,Pe),m=ue(n,n.FRAGMENT_SHADER,h),l=n.createProgram();if(!p||!m||!l)return null;if(n.attachShader(l,p),n.attachShader(l,m),n.bindAttribLocation(l,0,"aPosition"),n.linkProgram(l),n.deleteShader(p),n.deleteShader(m),!n.getProgramParameter(l,n.LINK_STATUS))return n.deleteProgram(l),null;let F={},D=n.getProgramParameter(l,n.ACTIVE_UNIFORMS);for(let R=0;R<D;R++){let M=n.getActiveUniform(l,R);M&&(F[M.name]=n.getUniformLocation(l,M.name))}return{program:l,uniforms:F}},Ue=({color:n="#a6a3b8",speed:h=1,direction:p="forward",scale:m=1,twist:l=1,wave:F=1,softness:D=.5,shine:R=1,brightness:M=1,grain:he=.04,quality:de=.75,mouseInteractive:pe=!0,intro:ve=!0,fade:ge=0,opacity:xe=1,lightMode:ye=!1,paused:Ee=!1,dpr:we,className:z="",...Te})=>{let W=A(null),Y=A(null),I=A(null),Z={color:String(n),speed:h,direction:p,scale:Math.max(.1,m),twist:l,wave:Math.max(0,F),softness:V(D,0,1),shine:Math.max(0,R),brightness:Math.max(0,M),grain:Math.max(0,he),quality:V(de,.25,1),mouseInteractive:pe,intro:ve,fade:V(ge,0,1),opacity:V(xe,0,1),lightMode:ye,paused:Ee,dpr:we},g=A(Z);return g.current=Z,q(()=>{let E=W.current,d=Y.current,e=d?.getContext("webgl2",{alpha:!0,premultipliedAlpha:!0,antialias:!1,depth:!1,stencil:!1,powerPreference:"high-performance"});if(!E||!d||!e)return;let Q=!!e.getExtension("EXT_color_buffer_float"),$=le(e,Se),K=le(e,Le);if(!$||!K)return;let P={volume:$,composite:K},J=e.createBuffer(),O=e.createVertexArray();e.bindVertexArray(O),e.bindBuffer(e.ARRAY_BUFFER,J),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),e.STATIC_DRAW),e.enableVertexAttribArray(0),e.vertexAttribPointer(0,2,e.FLOAT,!1,0,0);let S=e.createTexture(),X=e.createFramebuffer(),x={width:0,height:0},be=(t,r)=>{x.width===t&&x.height===r||(x.width=t,x.height=r,e.bindTexture(e.TEXTURE_2D,S),Q?e.texImage2D(e.TEXTURE_2D,0,e.RGBA16F,t,r,0,e.RGBA,e.HALF_FLOAT,null):e.texImage2D(e.TEXTURE_2D,0,e.RGBA,t,r,0,e.RGBA,e.UNSIGNED_BYTE,null),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.bindFramebuffer(e.FRAMEBUFFER,X),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,S,0))},w=document.createElement("canvas").getContext("2d",{willReadFrequently:!0}),L=window.matchMedia?.("(prefers-reduced-motion: reduce)").matches??!1,k=new Map,Re=t=>{if(k.has(t))return k.get(t);let r=[1,1,1];if(w){w.clearRect(0,0,1,1),w.fillStyle="#ffffff",w.fillStyle=t,w.fillRect(0,0,1,1);let[a,i,s]=w.getImageData(0,0,1,1).data;r=[a,i,s].map(c=>Math.pow(c/255,2.2))}return k.set(t,r),r},u={width:1,height:1,volumeWidth:1,volumeHeight:1},f={x:0,y:0,inside:!1},o={clock:0,intro:g.current.intro&&!L?0:1,yaw:0,pitch:0,yawVelocity:0,pitchVelocity:0,heat:0,heatX:0,heatY:0},y=0,T=0,C=!0,Me=t=>{let r=o.clock*.4;if(t.direction==="reverse")return-r;if(t.direction!=="pingpong")return r;let a=10,i=o.clock%a/a,s=i*i*(3-2*i);return(Math.floor(o.clock/a)%2===0?s:1-s)*a*.4},G=()=>{let t=g.current,r=o.intro*o.intro*(3-2*o.intro);e.bindVertexArray(O),be(u.volumeWidth,u.volumeHeight);let a=P.volume,i=a.uniforms;e.bindFramebuffer(e.FRAMEBUFFER,X),e.viewport(0,0,x.width,x.height),e.useProgram(a.program),e.uniform2f(i.uView,u.width,u.height),e.uniform2f(i.uScale,u.width/x.width,u.height/x.height),e.uniform1f(i.uZoom,t.scale),e.uniform1f(i.uTime,Me(t)+(1-r)*1.4),e.uniform1f(i.uTwist,t.twist),e.uniform1f(i.uWave,.4*t.wave),e.uniform1f(i.uSharpness,100-t.softness*90),e.uniform2f(i.uOrbit,o.yaw,o.pitch),e.uniform1f(i.uDither,Q?0:1/255),e.drawArrays(e.TRIANGLES,0,3);let s=P.composite,c=s.uniforms,v=Re(t.color),H=v.map(U=>U+(1-U)*.85),Ae=.2126*v[0]+.7152*v[1]+.0722*v[2],_e=Math.min(1,.16/Math.max(Ae,.001)),Fe=v.map(U=>Math.pow(Math.min(1,U*_e),1/2.2));e.bindFramebuffer(e.FRAMEBUFFER,null),e.viewport(0,0,d.width,d.height),e.useProgram(s.program),e.uniform2f(c.uResolution,d.width,d.height),e.uniform3fv(c.uColor,v),e.uniform3fv(c.uHighlight,H),e.uniform3fv(c.uInk,Fe),e.uniform1f(c.uGain,4.8*t.brightness),e.uniform1f(c.uShine,.025*t.shine),e.uniform1f(c.uPresence,r),e.uniform1f(c.uGrain,t.grain),e.uniform1f(c.uFade,t.fade),e.uniform1f(c.uOpacity,t.opacity),e.uniform1f(c.uTime,o.clock%1e3),e.uniform1f(c.uLightMode,t.lightMode?1:0),e.uniform3f(c.uHeat,o.heatX*d.width/u.width,(u.height-o.heatY)*d.height/u.height,o.heat),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,S),e.uniform1i(c.uVolume,0),e.drawArrays(e.TRIANGLES,0,3)},j=t=>{if(y=0,!C||document.hidden)return;let r=g.current,a=T?Math.min(.05,(t-T)/1e3):1/60;T=t;let i=!r.paused&&!L;i&&(o.clock+=a*r.speed),!r.intro||L?o.intro=1:o.intro<1&&(o.intro=Math.min(1,o.intro+a/Ce));let s=r.mouseInteractive&&f.inside&&!L,c=s?(f.x/u.width-.5)*.9:0,v=s?(f.y/u.height-.5)*.18:0;o.yawVelocity+=(40*(c-o.yaw)-11*o.yawVelocity)*a,o.pitchVelocity+=(40*(v-o.pitch)-11*o.pitchVelocity)*a,o.yaw+=o.yawVelocity*a,o.pitch+=o.pitchVelocity*a,o.heat+=((s?1:0)-o.heat)*(1-Math.exp(-a*(s?4:2))),o.heatX+=(f.x-o.heatX)*(1-Math.exp(-a*8)),o.heatY+=(f.y-o.heatY)*(1-Math.exp(-a*8)),G();let H=o.intro<1||Math.abs(c-o.yaw)>5e-4||Math.abs(o.yawVelocity)>5e-4||Math.abs(v-o.pitch)>5e-4||Math.abs(o.pitchVelocity)>5e-4||Math.abs((s?1:0)-o.heat)>.002;i||H?y=requestAnimationFrame(j):T=0},b=()=>{!y&&C&&!document.hidden&&(y=requestAnimationFrame(j))},B=()=>{let t=g.current,r=Math.max(1,E.clientWidth),a=Math.max(1,E.clientHeight),i=Math.min(t.dpr||window.devicePixelRatio||1,2);u.width=r,u.height=a,d.width=Math.max(1,Math.round(r*i)),d.height=Math.max(1,Math.round(a*i));let s=t.quality;r*a*s*s>ce&&(s=Math.sqrt(ce/(r*a))),u.volumeWidth=Math.max(1,Math.round(r*s)),u.volumeHeight=Math.max(1,Math.round(a*s)),y||G(),b()},ee=t=>{let r=E.getBoundingClientRect();f.x=t.clientX-r.left,f.y=t.clientY-r.top,f.inside=f.x>=0&&f.y>=0&&f.x<=r.width&&f.y<=r.height,b()},te=()=>{f.inside=!1,b()},oe=()=>{T=0,b()},re=new ResizeObserver(B);re.observe(E);let ne=new IntersectionObserver(t=>{C=t.some(r=>r.isIntersecting),C&&(T=0,b())});ne.observe(E),window.addEventListener("pointermove",ee,{passive:!0}),document.documentElement.addEventListener("pointerleave",te),document.addEventListener("visibilitychange",oe),B();let ae=g.current.quality,ie=g.current.dpr;return I.current=()=>{let t=g.current;if(t.quality!==ae||t.dpr!==ie){ae=t.quality,ie=t.dpr,B();return}y||G(),b()},()=>{cancelAnimationFrame(y),I.current=null,re.disconnect(),ne.disconnect(),window.removeEventListener("pointermove",ee),document.documentElement.removeEventListener("pointerleave",te),document.removeEventListener("visibilitychange",oe),e.deleteTexture(S),e.deleteFramebuffer(X),e.deleteProgram(P.volume.program),e.deleteProgram(P.composite.program),e.deleteBuffer(J),e.deleteVertexArray(O),e.getExtension("WEBGL_lose_context")?.loseContext()}},[]),q(()=>{I.current?.()}),_("div",{ref:W,className:`plasma-container${z?` ${z}`:""}`,...Te,children:_("canvas",{ref:Y,className:"plasma-canvas","aria-hidden":"true"})})},fe=Ue;var N=document.getElementById("plasma-mount"),Ve=()=>{try{let h=document.createElement("canvas").getContext("webgl2");return h?(h.getExtension("WEBGL_lose_context")?.loseContext(),!0):!1}catch{return!1}},me=window.matchMedia("(max-width: 860px)").matches;N&&!window.matchMedia("(prefers-reduced-motion: reduce)").matches&&Ve()&&(se(_(fe,{color:"#ffd400",speed:.42,direction:"forward",scale:1.1,twist:1.2,wave:.85,softness:.52,shine:1.05,brightness:.82,grain:.03,quality:me?.4:.58,mouseInteractive:!0,intro:!0,fade:.3,opacity:.58,lightMode:!1,dpr:me?1.25:1.6}),N),N.dataset.mounted="true");
