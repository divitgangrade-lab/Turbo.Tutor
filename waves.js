import"./island-chunks/chunk-32GSOU5I.js";import{g as ze,k as Ee,m as Z,r as ee}from"./island-chunks/chunk-6DTBS2I7.js";import"./island-chunks/chunk-SSQABL5H.js";var wt={solid:0,dashed:1},_=12,xt=4,yt=2.2,je=640,Te=64,Et=Te*Math.sqrt(Math.PI/2)/je,He=16e5,Mt=`#version 300 es
precision highp float;
precision highp int;
uniform vec2 uView;
uniform float uRatio;
uniform vec2 uAxis;
uniform float uSpacing;
uniform float uStep;
uniform vec2 uStart;
uniform float uAmplitude;
uniform vec2 uFrequency;
uniform vec2 uDrift;
uniform float uTwist;
uniform uint uSeed;
uniform sampler2D uField;
uniform ivec2 uFieldSize;
uniform float uCell;
uniform float uLimit;
uniform float uReach;
uniform float uReveal;
uniform float uBand;
out float vAcross;
out float vAlong;
out float vEnergy;
out float vShow;
out float vPhase;

const vec2 GRADIENTS[12] = vec2[12](
  vec2(1.0, 1.0), vec2(-1.0, 1.0), vec2(1.0, -1.0), vec2(-1.0, -1.0),
  vec2(1.0, 0.0), vec2(-1.0, 0.0), vec2(1.0, 0.0), vec2(-1.0, 0.0),
  vec2(0.0, 1.0), vec2(0.0, -1.0), vec2(0.0, 1.0), vec2(0.0, -1.0)
);

vec2 gradient(vec2 cell) {
  uvec2 q = uvec2(ivec2(cell) + 65536) + uvec2(uSeed * 7919u, uSeed * 104729u);
  q = 1103515245u * ((q >> 1u) ^ q.yx);
  uint n = 1103515245u * (q.x ^ (q.y >> 3u));
  return GRADIENTS[(n >> 16u) % 12u];
}

float ease(float t) {
  return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}

float perlin(vec2 p) {
  vec2 i = floor(p);
  vec2 f = p - i;
  float n00 = dot(gradient(i), f);
  float n10 = dot(gradient(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0));
  float n01 = dot(gradient(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0));
  float n11 = dot(gradient(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0));
  vec2 u = vec2(ease(f.x), ease(f.y));
  return mix(mix(n00, n10, u.x), mix(n01, n11, u.x), u.y);
}

vec2 node(ivec2 cell) {
  return texelFetch(uField, clamp(cell, ivec2(0), uFieldSize - 1), 0).xy;
}

void weights(float f, out vec4 w, out vec4 d) {
  float g = 1.0 - f;
  float f2 = f * f;
  float f3 = f2 * f;
  w = vec4(g * g * g, 3.0 * f3 - 6.0 * f2 + 4.0, -3.0 * f3 + 3.0 * f2 + 3.0 * f + 1.0, f3) / 6.0;
  d = vec4(-g * g, 3.0 * f2 - 4.0 * f, -3.0 * f2 + 2.0 * f + 1.0, f2) * 0.5;
}

vec2 field(vec2 point, out mat2 slope) {
  vec2 t = point / uCell;
  vec2 base = floor(t);
  vec2 f = t - base;
  vec4 wx;
  vec4 dx;
  vec4 wy;
  vec4 dy;
  weights(f.x, wx, dx);
  weights(f.y, wy, dy);
  ivec2 origin = ivec2(base) - 1;
  vec2 value = vec2(0.0);
  vec2 alongX = vec2(0.0);
  vec2 alongY = vec2(0.0);
  for (int j = 0; j < 4; j++) {
    vec2 row = vec2(0.0);
    vec2 rowSlope = vec2(0.0);
    for (int i = 0; i < 4; i++) {
      vec2 tap = node(origin + ivec2(i, j));
      row += tap * wx[i];
      rowSlope += tap * dx[i];
    }
    value += row * wy[j];
    alongX += rowSlope * wy[j];
    alongY += row * dy[j];
  }
  float size = length(value);
  float scale = size > 0.0001 ? uLimit * tanh(size / uLimit) / size : 1.0;
  slope = mat2(alongX, alongY) * (scale / uCell);
  return value * scale;
}

vec2 wave(vec2 rest) {
  float turn = perlin(rest * uFrequency + uDrift) * 12.0 * uTwist;
  vec2 local = rest + vec2(cos(turn), sin(turn) * 0.5) * uAmplitude;
  return uView * 0.5 + vec2(local.x * uAxis.x - local.y * uAxis.y, local.x * uAxis.y + local.y * uAxis.x);
}

void main() {
  int index = gl_VertexID >> 1;
  float side = float(gl_VertexID & 1) * 2.0 - 1.0;
  float u = uStart.x + float(gl_InstanceID) * uSpacing;
  float v = uStart.y + float(index) * uStep;
  vec2 flowing = wave(vec2(u, v));
  vec2 bend = wave(vec2(u, v + uStep)) - wave(vec2(u, v - uStep));
  mat2 slope;
  vec2 shift = field(flowing, slope);
  vec2 point = flowing + shift;
  float energy = length(shift);
  vec2 tangent = bend + slope * bend;
  float span = max(length(tangent), 0.0001);
  vec2 normal = vec2(-tangent.y, tangent.x) / span;
  vec2 corner = point + normal * side * uReach / uRatio;
  vAcross = side * uReach;
  vAlong = v;
  vEnergy = energy;
  vShow = clamp((uReveal - abs(u)) / uBand, 0.0, 1.0);
  uint line = uint(gl_InstanceID) * 747796405u + uSeed * 2891336453u + 1u;
  line = ((line >> ((line >> 28u) + 4u)) ^ line) * 277803737u;
  vPhase = float((line >> 22u) ^ line) / 4294967295.0;
  vec2 clip = corner / uView * 2.0 - 1.0;
  gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
}`,Tt=`#version 300 es
precision highp float;
uniform vec2 uView;
uniform float uRatio;
uniform float uHalf;
uniform float uThin;
uniform int uStyle;
uniform float uPeriod;
uniform float uFlow;
uniform vec3 uColor;
uniform vec3 uAccent;
uniform float uBase;
uniform float uHeat;
uniform float uFade;
uniform float uOpacity;
in float vAcross;
in float vAlong;
in float vEnergy;
in float vShow;
in float vPhase;
out vec4 outColor;

float smootherstep(float edge, float x) {
  float t = clamp(x / max(edge, 0.0001), 0.0, 1.0);
  return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}

void main() {
  float coverage = clamp(uHalf + 0.5 - abs(vAcross), 0.0, 1.0) * uThin;
  if (uStyle == 1) {
    float phase = (vAlong + uFlow) / uPeriod + vPhase;
    float blur = max(fwidth(phase), 0.0001);
    coverage *= clamp((0.25 - abs(fract(phase) - 0.5)) / blur + 0.5, 0.0, 1.0);
  }
  float heat = smoothstep(0.0, uHeat, vEnergy);
  vec2 uv = gl_FragCoord.xy / (uView * uRatio);
  float edge = uFade * 0.5;
  float mask = smootherstep(edge, uv.x) * smootherstep(edge, 1.0 - uv.x) * smootherstep(edge, uv.y) * smootherstep(edge, 1.0 - uv.y);
  float alpha = coverage * mix(uBase, 1.0, heat) * mask * vShow * uOpacity;
  outColor = vec4(mix(uColor, uAccent, heat) * alpha, alpha);
}`,T=(a,u,S)=>Math.min(S,Math.max(u,a)),Me=a=>{let u=T(a,0,1);return u*u*u*(u*(u*6-15)+10)},Ye=(a,u,S)=>{let f=a.createShader(u);return f?(a.shaderSource(f,S),a.compileShader(f),a.getShaderParameter(f,a.COMPILE_STATUS)?f:(a.deleteShader(f),null)):null},St=a=>{let u=Ye(a,a.VERTEX_SHADER,Mt),S=Ye(a,a.FRAGMENT_SHADER,Tt),f=a.createProgram();if(!u||!S||!f)return null;if(a.attachShader(f,u),a.attachShader(f,S),a.linkProgram(f),a.deleteShader(u),a.deleteShader(S),!a.getProgramParameter(f,a.LINK_STATUS))return a.deleteProgram(f),null;let te={},le=a.getProgramParameter(f,a.ACTIVE_UNIFORMS);for(let B=0;B<le;B++){let z=a.getActiveUniform(f,B);z&&(te[z.name]=a.getUniformLocation(f,z.name))}return{program:f,uniforms:te}},Rt=({lineColor:a="#ffffff",accentColor:u,backgroundColor:S="transparent",lineStyle:f="solid",spacing:te=10,lineWidth:le=1,rotation:B=0,amplitude:z=32,scale:Je=1,twist:Qe=1,speed:Ze=1,variation:et=0,mouseInteraction:tt=!0,mouseRadius:ot=175,mouseStrength:nt=1,bounce:it=.5,returnDuration:at=1.4,clickRipple:rt=!0,intro:st=!0,fade:ct=0,opacity:lt=1,lightMode:ut=!1,paused:ft=!1,dpr:mt,className:be="",style:dt})=>{let Ae=Z(null),_e=Z(null),ue=Z(null),Pe={lineColor:String(a),accentColor:u?String(u):"",lineStyle:wt[f]??0,spacing:Math.max(2,te),lineWidth:Math.max(.25,le),rotation:B,amplitude:Math.max(0,z),scale:Math.max(.05,Je),twist:Math.max(0,Qe),speed:Ze,variation:Math.max(0,Math.round(et)),mouseInteraction:tt,mouseRadius:Math.max(20,ot),mouseStrength:Math.max(0,nt),bounce:T(it,0,1),returnDuration:Math.max(.2,at),clickRipple:rt,intro:st,fade:T(ct,0,1),opacity:T(lt,0,1),lightMode:ut,paused:ft,dpr:mt},y=Z(Pe);return y.current=Pe,Ee(()=>{let V=Ae.current,F=_e.current,e=F?.getContext("webgl2",{alpha:!0,premultipliedAlpha:!0,antialias:!1,depth:!1,stencil:!1});if(!V||!F||!e)return;let oe=St(e);if(!oe)return;let r=oe.uniforms,Le=e.createVertexArray(),H=e.createTexture();e.bindTexture(e.TEXTURE_2D,H),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.pixelStorei(e.UNPACK_ALIGNMENT,1);let q=document.createElement("canvas").getContext("2d",{willReadFrequently:!0}),P=window.matchMedia?.("(prefers-reduced-motion: reduce)").matches??!1,fe=new Map,Ie=t=>{if(fe.has(t))return fe.get(t);let i=[1,1,1];if(q){q.clearRect(0,0,1,1),q.fillStyle="#ffffff",q.fillStyle=t,q.fillRect(0,0,1,1);let[s,l,c]=q.getImageData(0,0,1,1).data;i=[s/255,l/255,c/255]}return fe.set(t,i),i},ht=t=>{let i=t.map(c=>Math.pow(c,2.2)),s=.2126*i[0]+.7152*i[1]+.0722*i[2],l=Math.min(1,.045/Math.max(s,1e-4));return i.map(c=>Math.pow(c*l,1/2.2))},v={width:1,height:1,ratio:1},o={cols:0,rows:0,shift:new Float32Array(0),speed:new Float32Array(0),top:0,bottom:-1,left:0,right:-1},n={x:0,y:0,sx:0,sy:0,vx:0,vy:0,inside:!1},C=[],E={flow:0,intro:y.current.intro&&!P?0:1},G=0,U=0,ne=!0,vt=t=>Math.max(12,t.mouseRadius*.5),pt=()=>{o.cols=Math.ceil(v.width/_)+2,o.rows=Math.ceil(v.height/_)+2,o.shift=new Float32Array(o.cols*o.rows*2),o.speed=new Float32Array(o.cols*o.rows*2),o.top=0,o.bottom=-1,o.left=0,o.right=-1,e.bindTexture(e.TEXTURE_2D,H),e.texImage2D(e.TEXTURE_2D,0,e.RG32F,o.cols,o.rows,0,e.RG,e.FLOAT,o.shift)},De=(t,i,s,l)=>{let c=T(Math.floor(t/_),0,o.cols-1),d=T(Math.ceil(s/_),0,o.cols-1),R=T(Math.floor(i/_),0,o.rows-1),g=T(Math.ceil(l/_),0,o.rows-1),h=o.bottom<o.top;o.top=h?R:Math.min(o.top,R),o.bottom=h?g:Math.max(o.bottom,g),o.left=h?c:Math.min(o.left,c),o.right=h?d:Math.max(o.right,d)},gt=t=>{let i=y.current,s=1-Math.exp(-t/.045),l=n.sx+(n.x-n.sx)*s,c=n.sy+(n.y-n.sy)*s,d=1-Math.exp(-t/.06);n.vx+=((l-n.sx)/t-n.vx)*d,n.vy+=((c-n.sy)/t-n.vy)*d,n.sx=l,n.sy=c;let R=1-.85*i.bounce,g=4/(R*i.returnDuration),h=i.mouseRadius,b=Math.hypot(n.vx,n.vy),L=i.mouseInteraction&&n.inside&&!P?26e3*Math.tanh(b/1400)*i.mouseStrength:0;L>1&&De(n.sx-h,n.sy-h,n.sx+h,n.sy+h);let I=[];for(let m=C.length-1;m>=0;m--){let w=C[m];w.age+=t;let D=w.age*je,k=1-D/w.range;if(k<=0){C.splice(m,1);continue}let p=D+Te*3;De(w.x-p,w.y-p,w.x+p,w.y+p),I.push({x:w.x,y:w.y,front:D,power:150*g*k*Math.sqrt(k)/Et})}if(o.bottom<o.top)return!1;let Y=g*g,j=2*R*g,re=Math.min(16,Math.max(1,Math.ceil(t/Math.min(1/120,.6/g)))),N=t/re,de=b>.001?n.vx/b:0,he=b>.001?n.vy/b:0,{cols:x,shift:A,speed:O,left:W,right:ve}=o,pe=0;for(let m=o.top;m<=o.bottom;m++){let w=m*_;for(let D=W;D<=ve;D++){let k=D*_,p=(m*x+D)*2,we=0,xe=0;if(L>1){let M=Math.hypot(k-n.sx,w-n.sy);if(M<h){let J=Me(1-M/h)*L;we+=de*J,xe+=he*J}}for(let M of I){let J=k-M.x,ke=w-M.y,Q=Math.hypot(J,ke),ye=(Q-M.front)/Te;if(Q>.001&&Math.abs(ye)<3){let Be=M.power*Math.exp(-ye*ye*2)*Me(Q/56);we+=J/Q*Be,xe+=ke/Q*Be}}let se=A[p],ce=A[p+1],K=O[p],$=O[p+1];for(let M=0;M<re;M++)K+=(we-Y*se-j*K)*N,$+=(xe-Y*ce-j*$)*N,se+=K*N,ce+=$*N;A[p]=se,A[p+1]=ce,O[p]=K,O[p+1]=$,pe=Math.max(pe,Math.abs(se)+Math.abs(ce)+(Math.abs(K)+Math.abs($))*.05)}}let ge=o.top,We=o.bottom-o.top+1;if(pe<.02&&L<=1&&!I.length){for(let m=o.top;m<=o.bottom;m++)A.fill(0,(m*x+W)*2,(m*x+ve+1)*2),O.fill(0,(m*x+W)*2,(m*x+ve+1)*2);o.top=0,o.bottom=-1}return e.bindTexture(e.TEXTURE_2D,H),e.texSubImage2D(e.TEXTURE_2D,0,0,ge,x,We,e.RG,e.FLOAT,A.subarray(ge*x*2,(ge+We)*x*2)),o.bottom>=o.top},ie=()=>{let t=y.current,i=t.rotation*Math.PI/180,s=Math.cos(i),l=Math.sin(i),c=vt(t),d=t.amplitude*1.1+c+t.spacing*2+8,R=(v.width*Math.abs(s)+v.height*Math.abs(l))/2+d,g=(v.width*Math.abs(l)+v.height*Math.abs(s))/2+d,h=Math.ceil(R/t.spacing),b=h*2+1,L=xt,I=Math.ceil(g*2/L)+1;b*I*2>He&&(I=Math.max(16,Math.floor(He/(b*2))),L=g*2/(I-1));let Y=t.lineWidth*v.ratio,j=Math.max(.5,Y/2),re=j+1,N=E.intro,de=t.intro&&!P?(1-Math.pow(1-T(N/.7,0,1),3))*R*1.3:1e6,he=t.intro&&!P?Me((N-.1)/.9):1,x=Ie(t.lineColor),A=t.lightMode?ht(x):x,O=t.accentColor?Ie(t.accentColor):A,W=E.flow+t.variation*37.1;e.viewport(0,0,F.width,F.height),e.clearColor(0,0,0,0),e.clear(e.COLOR_BUFFER_BIT),e.enable(e.BLEND),e.blendFunc(e.ONE,e.ONE_MINUS_SRC_ALPHA),e.useProgram(oe.program),e.bindVertexArray(Le),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,H),e.uniform1i(r.uField,0),e.uniform2f(r.uView,v.width,v.height),e.uniform1f(r.uRatio,v.ratio),e.uniform2f(r.uAxis,s,l),e.uniform1f(r.uSpacing,t.spacing),e.uniform1f(r.uStep,L),e.uniform2f(r.uStart,-h*t.spacing,-g),e.uniform1f(r.uAmplitude,t.amplitude*he),e.uniform2f(r.uFrequency,.002/t.scale,.0015/t.scale),e.uniform2f(r.uDrift,W*.025,W*.0075),e.uniform1f(r.uTwist,t.twist),e.uniform1ui(r.uSeed,t.variation),e.uniform2i(r.uFieldSize,o.cols,o.rows),e.uniform1f(r.uCell,_),e.uniform1f(r.uLimit,c),e.uniform1f(r.uReach,re),e.uniform1f(r.uReveal,de),e.uniform1f(r.uBand,Math.max(1,R*.3)),e.uniform1f(r.uHalf,j),e.uniform1f(r.uThin,Math.min(1,Y)),e.uniform1i(r.uStyle,t.lineStyle),e.uniform1f(r.uPeriod,t.spacing*2.6),e.uniform1f(r.uFlow,E.flow*16%(t.spacing*2.6)),e.uniform3fv(r.uColor,A),e.uniform3fv(r.uAccent,O),e.uniform1f(r.uBase,.62),e.uniform1f(r.uHeat,c*.55),e.uniform1f(r.uFade,t.fade),e.uniform1f(r.uOpacity,t.opacity),e.drawArraysInstanced(e.TRIANGLE_STRIP,0,I*2,b)},Fe=t=>{if(G=0,!ne||document.hidden)return;let i=y.current,s=U?T((t-U)/1e3,5e-4,.05):1/60;if(U=t,i.paused){E.intro=1,ie(),U=0;return}P||(E.flow+=s*i.speed),!i.intro||P?E.intro=1:E.intro<1&&(E.intro=Math.min(1,E.intro+s/yt));let l=gt(s);ie();let c=n.inside&&i.mouseInteraction&&Math.hypot(n.vx,n.vy)>1;!P||l||c||C.length||E.intro<1?G=requestAnimationFrame(Fe):U=0},X=()=>{!G&&ne&&!document.hidden&&(G=requestAnimationFrame(Fe))},me=()=>{let t=y.current,i=Math.max(1,V.clientWidth),s=Math.max(1,V.clientHeight),l=Math.min(t.dpr||window.devicePixelRatio||1,2);v.width=i,v.height=s,F.width=Math.max(1,Math.round(i*l)),F.height=Math.max(1,Math.round(s*l)),v.ratio=F.width/i,pt(),ie(),X()},Ce=(t,i)=>{let s=V.getBoundingClientRect(),l=t.clientX-s.left,c=t.clientY-s.top,d=l>=0&&c>=0&&l<=s.width&&c<=s.height;return(i||d&&!n.inside)&&(n.sx=l,n.sy=c,n.vx=0,n.vy=0),n.inside=d,n.x=l,n.y=c,{x:l,y:c,rect:s,inside:d}},Ue=t=>{Ce(t,!1),y.current.paused||X()},Xe=t=>{let i=y.current,{x:s,y:l,rect:c,inside:d}=Ce(t,t.pointerType!=="mouse");d&&i.clickRipple&&!i.paused&&!P&&(C.push({x:s,y:l,age:0,range:Math.max(360,Math.hypot(c.width,c.height)*.55)}),C.length>6&&C.shift()),X()},ae=t=>{t.pointerType!=="mouse"&&(n.inside=!1)},Ne=()=>{n.inside=!1,X()},Oe=()=>{U=0,X()},Ve=new ResizeObserver(me);Ve.observe(V);let qe=new IntersectionObserver(t=>{ne=t.some(i=>i.isIntersecting),ne&&(U=0,X())});qe.observe(V),window.addEventListener("pointermove",Ue,{passive:!0}),window.addEventListener("pointerdown",Xe,{passive:!0}),window.addEventListener("pointerup",ae,{passive:!0}),window.addEventListener("pointercancel",ae,{passive:!0}),document.documentElement.addEventListener("pointerleave",Ne),document.addEventListener("visibilitychange",Oe),me();let Ge=y.current.dpr;return ue.current=()=>{let t=y.current;if(t.dpr!==Ge){Ge=t.dpr,me();return}G||ie(),X()},()=>{cancelAnimationFrame(G),ue.current=null,Ve.disconnect(),qe.disconnect(),window.removeEventListener("pointermove",Ue),window.removeEventListener("pointerdown",Xe),window.removeEventListener("pointerup",ae),window.removeEventListener("pointercancel",ae),document.documentElement.removeEventListener("pointerleave",Ne),document.removeEventListener("visibilitychange",Oe),e.deleteProgram(oe.program),e.deleteVertexArray(Le),e.deleteTexture(H),e.getExtension("WEBGL_lose_context")?.loseContext()}},[]),Ee(()=>{ue.current?.()}),ee("div",{ref:Ae,className:`waves${be?` ${be}`:""}`,style:{backgroundColor:S,...dt},children:ee("canvas",{ref:_e,className:"waves__canvas","aria-hidden":"true"})})},Ke=Rt;var Se=document.getElementById("waves-mount"),bt=()=>{try{let u=document.createElement("canvas").getContext("webgl2");return u?(u.getExtension("WEBGL_lose_context")?.loseContext(),!0):!1}catch{return!1}},Re=window.matchMedia("(max-width: 860px)").matches,At=window.matchMedia("(prefers-reduced-motion: reduce)").matches,$e=(a=0)=>{if(!(!Se||At)){if(!bt()){a<8&&window.setTimeout(()=>$e(a+1),350);return}ze(ee(Ke,{lineColor:"#8ff3e6",accentColor:"#f2fffd",lineStyle:"solid",spacing:Re?22:27,lineWidth:1,rotation:0,amplitude:Re?12:18,scale:1.8,twist:.65,speed:.32,variation:0,mouseInteraction:!0,mouseRadius:220,mouseStrength:.65,bounce:.42,returnDuration:1.7,clickRipple:!0,intro:!0,fade:.24,opacity:.78,lightMode:!1,dpr:Re?1.35:1.75}),Se),Se.dataset.mounted="true"}};$e();
