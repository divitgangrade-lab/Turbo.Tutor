import{k as Y,m as b,r as $}from"./chunk-6DTBS2I7.js";var Oe=`#version 300 es
in vec2 aPosition;
out vec2 vUv;
void main() {
  vUv = aPosition * 0.5 + 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`,Ge=`#version 300 es
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
}`,Be=48,ve=6,j=3.2,w=(f,S,A)=>Math.min(A,Math.max(S,f)),pe=(f,S,A)=>{let p=f.createShader(S);return p?(f.shaderSource(p,A),f.compileShader(p),f.getShaderParameter(p,f.COMPILE_STATUS)?p:(f.deleteShader(p),null)):null},Ne=({color:f=[1,1,1],speed:S=1,amplitude:A=.1,mouseReact:p=!0,scale:xe=1,detail:Re=8,rotation:we=0,warp:ge=1,hueShift:Ee=0,saturation:Me=1,brightness:Te=1.5,contrast:ye=1,stir:Se=.5,sheen:Ae=.3,clickSwirl:Fe=!0,grain:Pe=0,fade:_e=0,opacity:be=1,resolution:Ue=1,paused:Le=!1,className:J="",style:De})=>{let Q=b(null),Z=b(null),I=b(null),ee={colorKey:Array.isArray(f)?f.join(","):String(f),color:f,speed:S,amplitude:A,mouseReact:p,scale:Math.max(.05,xe),detail:w(Math.round(Re),1,24),rotation:we,warp:ge,hueShift:Ee,saturation:Math.max(0,Me),brightness:Math.max(0,Te),contrast:Math.max(0,ye),stir:Math.max(0,Se),sheen:Math.max(0,Ae),clickSwirl:Fe,grain:w(Pe,0,1),fade:w(_e,0,1),opacity:w(be,0,1),resolution:w(Ue,.1,2),paused:Le},x=b(ee);return x.current=ee,Y(()=>{let g=Q.current,R=Z.current,e=R?.getContext("webgl2",{alpha:!0,premultipliedAlpha:!0,antialias:!1});if(!g||!R||!e)return;let X=pe(e,e.VERTEX_SHADER,Oe),k=pe(e,e.FRAGMENT_SHADER,Ge),v=e.createProgram();if(!X||!k||!v||(e.attachShader(v,X),e.attachShader(v,k),e.linkProgram(v),!e.getProgramParameter(v,e.LINK_STATUS)))return;e.useProgram(v);let te=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,te),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),e.STATIC_DRAW);let oe=e.getAttribLocation(v,"aPosition");e.enableVertexAttribArray(oe),e.vertexAttribPointer(oe,2,e.FLOAT,!1,0,0);let n={};for(let o of["uResolution","uTime","uColor","uMouse","uAmplitude","uScale","uRotation","uDetail","uWarp","uHue","uSaturation","uBrightness","uContrast","uGrain","uSeed","uFade","uOpacity","uField","uStir","uPointer","uSheen","uSwirls"])n[o]=e.getUniformLocation(v,o);let U=e.createTexture();e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,U),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.uniform1i(n.uField,0);let O=document.createElement("canvas");O.width=1,O.height=1;let E=O.getContext("2d",{willReadFrequently:!0}),G=window.matchMedia?.("(prefers-reduced-motion: reduce)").matches??!1,u={x:.5,y:.5,px:0,py:0,inside:!1,tracked:!1},t={width:1,height:1,phase:0,mouse:[.5,.5],presence:0,color:[1,1,1],colorKey:"",cols:0,rows:0,field:new Float32Array(0),scratch:new Float32Array(0),fieldActive:!1,swirls:[],seed:0},B=new Float32Array(ve*4),M=0,F=0,L=!0,N=!0,Ce=o=>{if(o.colorKey===t.colorKey)return;if(t.colorKey=o.colorKey,Array.isArray(o.color)){t.color=[0,1,2].map(s=>w(Number(o.color[s]??1),0,1));return}if(!E)return;E.clearRect(0,0,1,1),E.fillStyle="#ffffff",E.fillStyle=String(o.color),E.fillRect(0,0,1,1);let[r,a,i]=E.getImageData(0,0,1,1).data;t.color=[r/255,a/255,i/255]},Ie=()=>{let o=Be,r=w(Math.round(o*t.height/t.width),6,96);o===t.cols&&r===t.rows||(t.cols=o,t.rows=r,t.field=new Float32Array(o*r*2),t.scratch=new Float32Array(o*r*2),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,U),e.texImage2D(e.TEXTURE_2D,0,e.RG16F,o,r,0,e.RG,e.FLOAT,t.field))},Xe=(o,r,a,i)=>{let{cols:s,rows:d,field:h}=t,c=.22,m=t.width/t.height,P=Math.max(0,Math.floor((o-c/m)*s)),H=Math.min(s-1,Math.ceil((o+c/m)*s)),z=Math.max(0,Math.floor((r-c)*d)),q=Math.min(d-1,Math.ceil((r+c)*d));for(let y=z;y<=q;y++)for(let l=P;l<=H;l++){let D=((l+.5)/s-o)*m,le=(y+.5)/d-r,_=1-(D*D+le*le)/(c*c);if(_<=0)continue;let C=(y*s+l)*2,fe=h[C]+a*_*_*3.2,de=h[C+1]+i*_*_*3.2,V=Math.hypot(fe,de),me=.4,he=V>0?me*Math.tanh(V/me)/V:0;h[C]=fe*he,h[C+1]=de*he}t.fieldActive=!0},ke=o=>{let{cols:r,rows:a,field:i,scratch:s}=t,d=Math.exp(-o*1.4),h=0;for(let c=0;c<a;c++)for(let m=0;m<r;m++){let P=(c*r+m)*2,H=(c*r+Math.max(0,m-1))*2,z=(c*r+Math.min(r-1,m+1))*2,q=(Math.max(0,c-1)*r+m)*2,y=(Math.min(a-1,c+1)*r+m)*2;for(let l=0;l<2;l++){let D=(i[P+l]*12+i[H+l]+i[z+l]+i[q+l]+i[y+l])/16;s[P+l]=D*d,h=Math.max(h,Math.abs(s[P+l]))}}i.set(s),h<4e-4&&(i.fill(0),t.fieldActive=!1)},W=()=>{let o=x.current;Ce(o),Ie(),e.viewport(0,0,R.width,R.height),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,U),e.texSubImage2D(e.TEXTURE_2D,0,0,0,t.cols,t.rows,e.RG,e.FLOAT,t.field),B.fill(0),t.swirls.forEach((r,a)=>{let i=.21*(1+.4*r.age),s=Math.exp(-r.age*1.35)-Math.exp(-r.age*10),d=Math.min(1,(j-r.age)/.8);B.set([r.x,r.y,i,3*s*d*(.21/i)**2],a*4)}),e.uniform2f(n.uResolution,t.width,t.height),e.uniform1f(n.uTime,t.phase),e.uniform3f(n.uColor,t.color[0],t.color[1],t.color[2]),e.uniform2f(n.uMouse,t.mouse[0],t.mouse[1]),e.uniform1f(n.uAmplitude,o.amplitude),e.uniform1f(n.uScale,o.scale),e.uniform1f(n.uRotation,o.rotation*Math.PI/180),e.uniform1i(n.uDetail,o.detail),e.uniform1f(n.uWarp,o.warp),e.uniform1f(n.uHue,o.hueShift*Math.PI/180),e.uniform1f(n.uSaturation,o.saturation),e.uniform1f(n.uBrightness,o.brightness),e.uniform1f(n.uContrast,o.contrast),e.uniform1f(n.uGrain,o.grain),e.uniform1f(n.uSeed,t.seed),e.uniform1f(n.uFade,o.fade),e.uniform1f(n.uOpacity,o.opacity),e.uniform1f(n.uStir,o.mouseReact?o.stir:0),e.uniform3f(n.uPointer,u.x,u.y,o.mouseReact?t.presence:0),e.uniform1f(n.uSheen,o.sheen),e.uniform4fv(n.uSwirls,B),e.clearColor(0,0,0,0),e.clear(e.COLOR_BUFFER_BIT),e.drawArrays(e.TRIANGLES,0,3)},re=o=>{if(M=0,!N||!L)return;let r=x.current,a=F?Math.min(.05,(o-F)/1e3):1/60;F=o;let i=!r.paused&&!G;i&&(t.phase+=a*r.speed);let s=r.mouseReact&&u.tracked?[u.x,u.y]:[.5,.5],d=1-Math.exp(-a*5);t.mouse[0]+=(s[0]-t.mouse[0])*d,t.mouse[1]+=(s[1]-t.mouse[1])*d,t.presence+=((u.inside?1:0)-t.presence)*(1-Math.exp(-a*4)),t.fieldActive&&ke(a),t.swirls=t.swirls.filter(c=>(c.age+=a)<j),r.grain>0&&i&&(t.seed=Math.floor(o/42)%997),W();let h=Math.abs(s[0]-t.mouse[0])>5e-4||Math.abs(s[1]-t.mouse[1])>5e-4||Math.abs((u.inside?1:0)-t.presence)>.002;i||h||t.fieldActive||t.swirls.length?M=requestAnimationFrame(re):F=0},T=()=>{M||!N||!L||(M=requestAnimationFrame(re))},ie=o=>{let r=g.getBoundingClientRect();return{x:(o.clientX-r.left)/Math.max(1,r.width),y:1-(o.clientY-r.top)/Math.max(1,r.height)}},ae=o=>{let r=x.current,{x:a,y:i}=ie(o),s=a>=0&&a<=1&&i>=0&&i<=1;s&&r.mouseReact&&!G&&u.inside&&r.stir>0&&Xe(a,i,a-u.x,i-u.y),u.x=a,u.y=i,u.inside=s,s&&(u.tracked=!0),T()},ne=()=>{u.inside=!1,T()},se=o=>{if(!x.current.clickSwirl||G)return;let{x:a,y:i}=ie(o);if(!(a<0||a>1||i<0||i>1)){if(t.swirls.length>=ve){if(t.swirls[0].age<j-.4)return;t.swirls.shift()}t.swirls.push({x:a,y:i,age:0}),T()}},K=()=>{let o=x.current,r=Math.min(window.devicePixelRatio||1,2)*o.resolution;t.width=Math.max(1,g.clientWidth),t.height=Math.max(1,g.clientHeight),R.width=Math.max(1,Math.round(t.width*r)),R.height=Math.max(1,Math.round(t.height*r)),W(),T()};I.current=()=>{let o=Math.min(window.devicePixelRatio||1,2)*x.current.resolution;R.width!==Math.max(1,Math.round(t.width*o))?K():M||W(),T()};let ce=new ResizeObserver(K);ce.observe(g);let ue=new IntersectionObserver(o=>{L=o.some(r=>r.isIntersecting),L&&(F=0,T())});return ue.observe(g),window.addEventListener("pointermove",ae,{passive:!0}),window.addEventListener("pointerdown",se,{passive:!0}),document.documentElement.addEventListener("pointerleave",ne),K(),()=>{N=!1,cancelAnimationFrame(M),I.current=null,ce.disconnect(),ue.disconnect(),window.removeEventListener("pointermove",ae),window.removeEventListener("pointerdown",se),document.documentElement.removeEventListener("pointerleave",ne),e.deleteTexture(U),e.deleteBuffer(te),e.deleteProgram(v),e.deleteShader(X),e.deleteShader(k)}},[]),Y(()=>{I.current?.()}),$("div",{ref:Q,className:`iridescence-container${J?` ${J}`:""}`,style:De,children:$("canvas",{ref:Z,className:"iridescence-canvas","aria-hidden":"true"})})},Ve=Ne;export{Ve as a};
