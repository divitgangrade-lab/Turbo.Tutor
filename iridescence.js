import"./island-chunks/chunk-32GSOU5I.js";import{g as ve,k as $,m as _,r as U}from"./island-chunks/chunk-6DTBS2I7.js";import"./island-chunks/chunk-SSQABL5H.js";var We=`#version 300 es
in vec2 aPosition;
out vec2 vUv;
void main() {
  vUv = aPosition * 0.5 + 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`,Ne=`#version 300 es
precision highp float;
uniform vec2 uResolution;
uniform float uTime;
uniform vec3 uColor;
uniform vec2 uMouse;
uniform float uAmplitude;
uniform float uScale;
uniform float uRotation;
uniform int uDetail;
uniform float uWarp;
uniform float uHue;
uniform float uSaturation;
uniform float uBrightness;
uniform float uContrast;
uniform float uGrain;
uniform float uSeed;
uniform float uFade;
uniform float uOpacity;
uniform sampler2D uField;
uniform float uStir;
uniform vec3 uPointer;
uniform float uSheen;
uniform vec4 uSwirls[6];
in vec2 vUv;
out vec4 outColor;

vec3 hueRotate(vec3 c, float angle) {
  const vec3 k = vec3(0.57735027);
  float ca = cos(angle);
  return c * ca + cross(k, c) * sin(angle) + k * dot(k, c) * (1.0 - ca);
}

float smootherstep(float edge, float x) {
  float t = clamp(x / edge, 0.0, 1.0);
  return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}

float hash(vec2 p) {
  p = fract(p * vec2(443.897, 441.423));
  p += dot(p, p.yx + 19.19);
  return fract((p.x + p.y) * p.x);
}

void main() {
  float mr = min(uResolution.x, uResolution.y);
  vec2 aspect = uResolution / mr;
  vec2 st = vUv - texture(uField, vUv).rg * uStir;

  for (int k = 0; k < 6; k++) {
    vec4 swirl = uSwirls[k];
    if (swirl.w == 0.0) continue;
    vec2 delta = (st - swirl.xy) * aspect;
    float angle = swirl.w * exp(-dot(delta, delta) / (swirl.z * swirl.z));
    float ca = cos(angle);
    float sa = sin(angle);
    st = swirl.xy + vec2(ca * delta.x - sa * delta.y, sa * delta.x + ca * delta.y) / aspect;
  }

  vec2 uv = (st * 2.0 - 1.0) * aspect;
  float c = cos(uRotation);
  float s = sin(uRotation);
  uv = mat2(c, -s, s, c) * uv / uScale;
  uv += (uMouse - vec2(0.5)) * uAmplitude;

  float d = -uTime * 0.5;
  float a = 0.0;
  for (int i = 0; i < 24; i++) {
    if (i >= uDetail) break;
    float fi = float(i);
    a += cos(fi - d - a * uv.x * uWarp);
    d += sin(uv.y * fi + a);
  }
  d += uTime * 0.5;
  vec3 col = vec3(cos(uv * vec2(d, a)) * 0.6 + 0.4, cos(a + d) * 0.5 + 0.5);
  col = cos(col * cos(vec3(d, a, 2.5)) * 0.5 + 0.5) * uColor;

  vec2 toPointer = (vUv - uPointer.xy) * aspect;
  col += col * uPointer.z * uSheen * 0.8 * exp(-dot(toPointer, toPointer) / 0.09);

  col = hueRotate(col, uHue);
  float luma = dot(col, vec3(0.2126, 0.7152, 0.0722));
  col = mix(vec3(luma), col, uSaturation);
  col = (col - 0.5) * uContrast + 0.5;
  col *= uBrightness;
  col += (hash(gl_FragCoord.xy + uSeed) - 0.5) * uGrain * 0.12;
  col = clamp(col, 0.0, 1.0);

  float alpha = uOpacity;
  if (uFade > 0.0) {
    vec2 px = vUv * uResolution;
    float edge = uFade * mr * 0.5;
    alpha *= smootherstep(edge, px.x) * smootherstep(edge, uResolution.x - px.x);
    alpha *= smootherstep(edge, px.y) * smootherstep(edge, uResolution.y - px.y);
  }
  outColor = vec4(col * alpha, alpha);
}`,Ke=48,xe=6,J=3.2,R=(l,v,A)=>Math.min(A,Math.max(v,l)),we=(l,v,A)=>{let x=l.createShader(v);return x?(l.shaderSource(x,A),l.compileShader(x),l.getShaderParameter(x,l.COMPILE_STATUS)?x:(l.deleteShader(x),null)):null},He=({color:l=[1,1,1],speed:v=1,amplitude:A=.1,mouseReact:x=!0,scale:Re=1,detail:Ee=8,rotation:Me=0,warp:Te=1,hueShift:ye=0,saturation:Se=1,brightness:Ae=1.5,contrast:be=1,stir:Fe=.5,sheen:Pe=.3,clickSwirl:_e=!0,grain:Ue=0,fade:Le=0,opacity:Ce=1,resolution:De=1,paused:Ie=!1,className:Z="",style:ke})=>{let j=_(null),ee=_(null),k=_(null),te={colorKey:Array.isArray(l)?l.join(","):String(l),color:l,speed:v,amplitude:A,mouseReact:x,scale:Math.max(.05,Re),detail:R(Math.round(Ee),1,24),rotation:Me,warp:Te,hueShift:ye,saturation:Math.max(0,Se),brightness:Math.max(0,Ae),contrast:Math.max(0,be),stir:Math.max(0,Fe),sheen:Math.max(0,Pe),clickSwirl:_e,grain:R(Ue,0,1),fade:R(Le,0,1),opacity:R(Ce,0,1),resolution:R(De,.1,2),paused:Ie},w=_(te);return w.current=te,$(()=>{let E=j.current,g=ee.current,e=g?.getContext("webgl2",{alpha:!0,premultipliedAlpha:!0,antialias:!1});if(!E||!g||!e)return;let X=we(e,e.VERTEX_SHADER,We),O=we(e,e.FRAGMENT_SHADER,Ne),p=e.createProgram();if(!X||!O||!p||(e.attachShader(p,X),e.attachShader(p,O),e.linkProgram(p),!e.getProgramParameter(p,e.LINK_STATUS)))return;e.useProgram(p);let oe=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,oe),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),e.STATIC_DRAW);let re=e.getAttribLocation(p,"aPosition");e.enableVertexAttribArray(re),e.vertexAttribPointer(re,2,e.FLOAT,!1,0,0);let a={};for(let o of["uResolution","uTime","uColor","uMouse","uAmplitude","uScale","uRotation","uDetail","uWarp","uHue","uSaturation","uBrightness","uContrast","uGrain","uSeed","uFade","uOpacity","uField","uStir","uPointer","uSheen","uSwirls"])a[o]=e.getUniformLocation(p,o);let L=e.createTexture();e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,L),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.uniform1i(a.uField,0);let B=document.createElement("canvas");B.width=1,B.height=1;let M=B.getContext("2d",{willReadFrequently:!0}),G=window.matchMedia?.("(prefers-reduced-motion: reduce)").matches??!1,u={x:.5,y:.5,px:0,py:0,inside:!1,tracked:!1},t={width:1,height:1,phase:0,mouse:[.5,.5],presence:0,color:[1,1,1],colorKey:"",cols:0,rows:0,field:new Float32Array(0),scratch:new Float32Array(0),fieldActive:!1,swirls:[],seed:0},W=new Float32Array(xe*4),T=0,b=0,C=!0,N=!0,Xe=o=>{if(o.colorKey===t.colorKey)return;if(t.colorKey=o.colorKey,Array.isArray(o.color)){t.color=[0,1,2].map(s=>R(Number(o.color[s]??1),0,1));return}if(!M)return;M.clearRect(0,0,1,1),M.fillStyle="#ffffff",M.fillStyle=String(o.color),M.fillRect(0,0,1,1);let[r,i,n]=M.getImageData(0,0,1,1).data;t.color=[r/255,i/255,n/255]},Oe=()=>{let o=Ke,r=R(Math.round(o*t.height/t.width),6,96);o===t.cols&&r===t.rows||(t.cols=o,t.rows=r,t.field=new Float32Array(o*r*2),t.scratch=new Float32Array(o*r*2),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,L),e.texImage2D(e.TEXTURE_2D,0,e.RG16F,o,r,0,e.RG,e.FLOAT,t.field))},Be=(o,r,i,n)=>{let{cols:s,rows:d,field:h}=t,c=.22,m=t.width/t.height,F=Math.max(0,Math.floor((o-c/m)*s)),z=Math.min(s-1,Math.ceil((o+c/m)*s)),q=Math.max(0,Math.floor((r-c)*d)),V=Math.min(d-1,Math.ceil((r+c)*d));for(let S=q;S<=V;S++)for(let f=F;f<=z;f++){let D=((f+.5)/s-o)*m,fe=(S+.5)/d-r,P=1-(D*D+fe*fe)/(c*c);if(P<=0)continue;let I=(S*s+f)*2,de=h[I]+i*P*P*3.2,me=h[I+1]+n*P*P*3.2,Y=Math.hypot(de,me),he=.4,pe=Y>0?he*Math.tanh(Y/he)/Y:0;h[I]=de*pe,h[I+1]=me*pe}t.fieldActive=!0},Ge=o=>{let{cols:r,rows:i,field:n,scratch:s}=t,d=Math.exp(-o*1.4),h=0;for(let c=0;c<i;c++)for(let m=0;m<r;m++){let F=(c*r+m)*2,z=(c*r+Math.max(0,m-1))*2,q=(c*r+Math.min(r-1,m+1))*2,V=(Math.max(0,c-1)*r+m)*2,S=(Math.min(i-1,c+1)*r+m)*2;for(let f=0;f<2;f++){let D=(n[F+f]*12+n[z+f]+n[q+f]+n[V+f]+n[S+f])/16;s[F+f]=D*d,h=Math.max(h,Math.abs(s[F+f]))}}n.set(s),h<4e-4&&(n.fill(0),t.fieldActive=!1)},K=()=>{let o=w.current;Xe(o),Oe(),e.viewport(0,0,g.width,g.height),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,L),e.texSubImage2D(e.TEXTURE_2D,0,0,0,t.cols,t.rows,e.RG,e.FLOAT,t.field),W.fill(0),t.swirls.forEach((r,i)=>{let n=.21*(1+.4*r.age),s=Math.exp(-r.age*1.35)-Math.exp(-r.age*10),d=Math.min(1,(J-r.age)/.8);W.set([r.x,r.y,n,3*s*d*(.21/n)**2],i*4)}),e.uniform2f(a.uResolution,t.width,t.height),e.uniform1f(a.uTime,t.phase),e.uniform3f(a.uColor,t.color[0],t.color[1],t.color[2]),e.uniform2f(a.uMouse,t.mouse[0],t.mouse[1]),e.uniform1f(a.uAmplitude,o.amplitude),e.uniform1f(a.uScale,o.scale),e.uniform1f(a.uRotation,o.rotation*Math.PI/180),e.uniform1i(a.uDetail,o.detail),e.uniform1f(a.uWarp,o.warp),e.uniform1f(a.uHue,o.hueShift*Math.PI/180),e.uniform1f(a.uSaturation,o.saturation),e.uniform1f(a.uBrightness,o.brightness),e.uniform1f(a.uContrast,o.contrast),e.uniform1f(a.uGrain,o.grain),e.uniform1f(a.uSeed,t.seed),e.uniform1f(a.uFade,o.fade),e.uniform1f(a.uOpacity,o.opacity),e.uniform1f(a.uStir,o.mouseReact?o.stir:0),e.uniform3f(a.uPointer,u.x,u.y,o.mouseReact?t.presence:0),e.uniform1f(a.uSheen,o.sheen),e.uniform4fv(a.uSwirls,W),e.clearColor(0,0,0,0),e.clear(e.COLOR_BUFFER_BIT),e.drawArrays(e.TRIANGLES,0,3)},ne=o=>{if(T=0,!N||!C)return;let r=w.current,i=b?Math.min(.05,(o-b)/1e3):1/60;b=o;let n=!r.paused&&!G;n&&(t.phase+=i*r.speed);let s=r.mouseReact&&u.tracked?[u.x,u.y]:[.5,.5],d=1-Math.exp(-i*5);t.mouse[0]+=(s[0]-t.mouse[0])*d,t.mouse[1]+=(s[1]-t.mouse[1])*d,t.presence+=((u.inside?1:0)-t.presence)*(1-Math.exp(-i*4)),t.fieldActive&&Ge(i),t.swirls=t.swirls.filter(c=>(c.age+=i)<J),r.grain>0&&n&&(t.seed=Math.floor(o/42)%997),K();let h=Math.abs(s[0]-t.mouse[0])>5e-4||Math.abs(s[1]-t.mouse[1])>5e-4||Math.abs((u.inside?1:0)-t.presence)>.002;n||h||t.fieldActive||t.swirls.length?T=requestAnimationFrame(ne):b=0},y=()=>{T||!N||!C||(T=requestAnimationFrame(ne))},ie=o=>{let r=E.getBoundingClientRect();return{x:(o.clientX-r.left)/Math.max(1,r.width),y:1-(o.clientY-r.top)/Math.max(1,r.height)}},ae=o=>{let r=w.current,{x:i,y:n}=ie(o),s=i>=0&&i<=1&&n>=0&&n<=1;s&&r.mouseReact&&!G&&u.inside&&r.stir>0&&Be(i,n,i-u.x,n-u.y),u.x=i,u.y=n,u.inside=s,s&&(u.tracked=!0),y()},se=()=>{u.inside=!1,y()},ce=o=>{if(!w.current.clickSwirl||G)return;let{x:i,y:n}=ie(o);if(!(i<0||i>1||n<0||n>1)){if(t.swirls.length>=xe){if(t.swirls[0].age<J-.4)return;t.swirls.shift()}t.swirls.push({x:i,y:n,age:0}),y()}},H=()=>{let o=w.current,r=Math.min(window.devicePixelRatio||1,2)*o.resolution;t.width=Math.max(1,E.clientWidth),t.height=Math.max(1,E.clientHeight),g.width=Math.max(1,Math.round(t.width*r)),g.height=Math.max(1,Math.round(t.height*r)),K(),y()};k.current=()=>{let o=Math.min(window.devicePixelRatio||1,2)*w.current.resolution;g.width!==Math.max(1,Math.round(t.width*o))?H():T||K(),y()};let ue=new ResizeObserver(H);ue.observe(E);let le=new IntersectionObserver(o=>{C=o.some(r=>r.isIntersecting),C&&(b=0,y())});return le.observe(E),window.addEventListener("pointermove",ae,{passive:!0}),window.addEventListener("pointerdown",ce,{passive:!0}),document.documentElement.addEventListener("pointerleave",se),H(),()=>{N=!1,cancelAnimationFrame(T),k.current=null,ue.disconnect(),le.disconnect(),window.removeEventListener("pointermove",ae),window.removeEventListener("pointerdown",ce),document.documentElement.removeEventListener("pointerleave",se),e.deleteTexture(L),e.deleteBuffer(oe),e.deleteProgram(p),e.deleteShader(X),e.deleteShader(O)}},[]),$(()=>{k.current?.()}),U("div",{ref:j,className:`iridescence-container${Z?` ${Z}`:""}`,style:ke,children:U("canvas",{ref:ee,className:"iridescence-canvas","aria-hidden":"true"})})},ge=He;var Q=document.getElementById("iridescence-mount"),ze=()=>{try{let v=document.createElement("canvas").getContext("webgl2");return v?(v.getExtension("WEBGL_lose_context")?.loseContext(),!0):!1}catch{return!1}},qe=window.matchMedia("(max-width: 860px)").matches;Q&&!window.matchMedia("(prefers-reduced-motion: reduce)").matches&&ze()&&(ve(U(ge,{color:"#aebbd6",speed:.24,amplitude:.08,mouseReact:!0,scale:1.18,detail:7,rotation:18,warp:.9,hueShift:8,saturation:.72,brightness:1.08,contrast:1.15,stir:.28,sheen:.38,clickSwirl:!0,grain:.025,fade:.42,opacity:.62,resolution:qe?.7:.85}),Q),Q.dataset.mounted="true");
