import"./island-chunks/chunk-XKFHMPKF.js";import{g as De,i as Z,j as z,l as q,p as C}from"./island-chunks/chunk-CANNF34S.js";var Ye=24e5,He=14e4,Ke=32,Q=256,je=`#version 300 es
const vec2 corners[3] = vec2[3](vec2(-1.0, -1.0), vec2(3.0, -1.0), vec2(-1.0, 3.0));
out vec2 vUv;
void main() {
  vUv = corners[gl_VertexID] * 0.5 + 0.5;
  gl_Position = vec4(corners[gl_VertexID], 0.0, 1.0);
}`,X=`#version 300 es
precision highp float;
precision highp sampler2D;
in vec2 vUv;
out vec4 fragColor;
uniform vec2 uTexel;
`,Je=`${X}
uniform sampler2D uVelocity;
uniform vec2 uSize;
uniform vec4 uSegment;
uniform vec2 uForce;
uniform float uRadius;

float segment(vec2 p, vec2 a, vec2 b) {
  vec2 ab = b - a;
  float t = clamp(dot(p - a, ab) / max(dot(ab, ab), 1e-4), 0.0, 1.0);
  return length(p - a - ab * t);
}

void main() {
  float d = segment(vUv * uSize, uSegment.xy, uSegment.zw) / uRadius;
  vec2 velocity = texture(uVelocity, vUv).xy + uForce * exp(-d * d * 6.0);
  fragColor = vec4(velocity, 0.0, 1.0);
}`,Ze=`${X}
uniform sampler2D uVelocity;
uniform float uAmount;

void main() {
  vec2 center = texture(uVelocity, vUv).xy;
  vec2 around =
    texture(uVelocity, vUv - vec2(uTexel.x, 0.0)).xy +
    texture(uVelocity, vUv + vec2(uTexel.x, 0.0)).xy +
    texture(uVelocity, vUv - vec2(0.0, uTexel.y)).xy +
    texture(uVelocity, vUv + vec2(0.0, uTexel.y)).xy;
  fragColor = vec4(mix(center, around * 0.25, uAmount), 0.0, 1.0);
}`,Qe=`${X}
uniform sampler2D uVelocity;
uniform float uWalls;

void main() {
  vec2 center = texture(uVelocity, vUv).xy;
  float left = texture(uVelocity, vUv - vec2(uTexel.x, 0.0)).x;
  float right = texture(uVelocity, vUv + vec2(uTexel.x, 0.0)).x;
  float down = texture(uVelocity, vUv - vec2(0.0, uTexel.y)).y;
  float up = texture(uVelocity, vUv + vec2(0.0, uTexel.y)).y;
  float edge = uWalls > 0.5 ? -1.0 : 0.0;
  if (vUv.x - uTexel.x < 0.0) left = edge * center.x;
  if (vUv.x + uTexel.x > 1.0) right = edge * center.x;
  if (vUv.y - uTexel.y < 0.0) down = edge * center.y;
  if (vUv.y + uTexel.y > 1.0) up = edge * center.y;
  fragColor = vec4(0.5 * (right - left + up - down), 0.0, 0.0, 1.0);
}`,Ve=`
uniform float uWalls;

float pressureAt(sampler2D field, vec2 uv) {
  vec2 inside = step(vec2(0.0), uv) * step(uv, vec2(1.0));
  return texture(field, uv).x * mix(inside.x * inside.y, 1.0, uWalls);
}
`,et=`${X}
uniform sampler2D uPressure;
uniform sampler2D uDivergence;
${Ve}
void main() {
  vec2 reach = uTexel * 2.0;
  float sum =
    pressureAt(uPressure, vUv - vec2(reach.x, 0.0)) +
    pressureAt(uPressure, vUv + vec2(reach.x, 0.0)) +
    pressureAt(uPressure, vUv - vec2(0.0, reach.y)) +
    pressureAt(uPressure, vUv + vec2(0.0, reach.y));
  fragColor = vec4(sum * 0.25 - texture(uDivergence, vUv).x, 0.0, 0.0, 1.0);
}`,tt=`${X}
uniform sampler2D uPressure;
uniform sampler2D uVelocity;
${Ve}
void main() {
  float left = pressureAt(uPressure, vUv - vec2(uTexel.x, 0.0));
  float right = pressureAt(uPressure, vUv + vec2(uTexel.x, 0.0));
  float down = pressureAt(uPressure, vUv - vec2(0.0, uTexel.y));
  float up = pressureAt(uPressure, vUv + vec2(0.0, uTexel.y));
  vec2 velocity = texture(uVelocity, vUv).xy - 0.5 * vec2(right - left, up - down);
  fragColor = vec4(velocity, 0.0, 1.0);
}`,rt=`${X}
uniform sampler2D uVelocity;
uniform vec2 uStep;
uniform float uKeep;
uniform float uWalls;

vec2 at(vec2 uv) {
  vec2 outside = max(-uv, uv - 1.0) / uTexel;
  float open = clamp(1.0 - max(outside.x, outside.y) / 1.5, 0.0, 1.0);
  return texture(uVelocity, uv).xy * mix(open, 1.0, uWalls);
}

void main() {
  vec2 start = vUv - at(vUv) * uStep;
  vec2 back = start + at(start) * uStep;
  vec2 corrected = vUv - (back - vUv) * 0.5;
  vec2 origin = corrected - at(corrected) * uStep;
  vec2 a = at(origin + vec2(-0.5, -0.5) * uTexel);
  vec2 b = at(origin + vec2(0.5, -0.5) * uTexel);
  vec2 c = at(origin + vec2(-0.5, 0.5) * uTexel);
  vec2 d = at(origin + vec2(0.5, 0.5) * uTexel);
  vec2 velocity = clamp(at(origin), min(min(a, b), min(c, d)), max(max(a, b), max(c, d)));
  fragColor = vec4(velocity * uKeep, 0.0, 1.0);
}`,ot=`${X}
uniform sampler2D uVelocity;
uniform sampler2D uPalette;
uniform vec2 uSimSize;
uniform float uSpeedScale;
uniform float uLight;
uniform vec4 uBackground;

vec2 velocityAt(vec2 uv) {
  vec2 st = uv * uSimSize - 0.5;
  vec2 i = floor(st);
  vec2 f = st - i;
  vec2 f2 = f * f;
  vec2 f3 = f2 * f;
  vec2 w0 = (-f3 + 3.0 * f2 - 3.0 * f + 1.0) / 6.0;
  vec2 w1 = (3.0 * f3 - 6.0 * f2 + 4.0) / 6.0;
  vec2 w2 = (-3.0 * f3 + 3.0 * f2 + 3.0 * f + 1.0) / 6.0;
  vec2 w3 = f3 / 6.0;
  vec2 g0 = w0 + w1;
  vec2 g1 = w2 + w3;
  vec2 h0 = (i - 0.5 + w1 / g0) / uSimSize;
  vec2 h1 = (i + 1.5 + w3 / g1) / uSimSize;
  vec2 a = texture(uVelocity, vec2(h0.x, h0.y)).xy;
  vec2 b = texture(uVelocity, vec2(h1.x, h0.y)).xy;
  vec2 c = texture(uVelocity, vec2(h0.x, h1.y)).xy;
  vec2 d = texture(uVelocity, vec2(h1.x, h1.y)).xy;
  return g0.y * (g0.x * a + g1.x * b) + g1.y * (g0.x * c + g1.x * d);
}

void main() {
  float speed = length(velocityAt(vUv)) * uSpeedScale;
  float level = speed < 0.75 ? speed : 0.75 + 0.25 * tanh((speed - 0.75) * 4.0);
  vec3 ink = texture(uPalette, vec2(level, 0.5)).rgb;
  float alpha = level;
  if (uLight > 0.5) {
    float hollow = smoothstep(0.7, 1.6, speed);
    alpha = smoothstep(0.08, 0.5, level) * mix(0.85, 0.1, hollow);
  } else {
    float hot = 1.0 - exp(-max(speed - 0.75, 0.0) * 1.2);
    ink = mix(ink, min(ink * 1.8 + 0.06, vec3(1.0)), hot);
  }
  vec3 color = ink * alpha + uBackground.rgb * uBackground.a * (1.0 - alpha);
  float coverage = alpha + uBackground.a * (1.0 - alpha);
  float grain = fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(0.06711056, 0.00583715))));
  color += (grain - 0.5) / 255.0 * step(0.002, coverage);
  fragColor = vec4(clamp(color, vec3(0.0), vec3(coverage)), coverage);
}`,y=(n,d,c)=>Math.min(c,Math.max(d,n)),Le=(n,d)=>Math.pow(.5,d/(.35+n*n*12)),Xe=n=>{let d=String(n||"").trim(),c=/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(d);if(c){let l=c[1].length===3?c[1].replace(/./g,m=>m+m):c[1];return[0,2,4].map(m=>parseInt(l.slice(m,m+2),16)/255)}let s=/^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/i.exec(d);return s?[s[1],s[2],s[3]].map(l=>y(parseFloat(l)/255,0,1)):null},nt=n=>n<=.04045?n/12.92:Math.pow((n+.055)/1.055,2.4),it=n=>{let d=[];n.forEach(l=>{let m=Xe(l);m&&d.push(m)}),d.length||d.push([1,1,1]);let c=d.map(l=>l.map(nt)),s=new Uint8Array(Q*4);for(let l=0;l<Q;l++){let m=y(l/(Q-1)*c.length-.5,0,c.length-1),_=Math.min(Math.floor(m),Math.max(c.length-2,0)),A=Math.min(_+1,c.length-1),w=m-_,ee=w*w*(3-2*w);for(let U=0;U<3;U++){let te=c[_][U]+(c[A][U]-c[_][U])*ee;s[l*4+U]=Math.round(y(te,0,1)*255)}s[l*4+3]=255}return s},Fe=(n,d,c)=>{let s=n.createShader(d);return s?(n.shaderSource(s,c),n.compileShader(s),n.getShaderParameter(s,n.COMPILE_STATUS)?s:(console.error(n.getShaderInfoLog(s)),n.deleteShader(s),null)):null},V=(n,d)=>{let c=Fe(n,n.VERTEX_SHADER,je),s=Fe(n,n.FRAGMENT_SHADER,d),l=c&&s?n.createProgram():null;if(!c||!s||!l)return c&&n.deleteShader(c),s&&n.deleteShader(s),null;if(n.attachShader(l,c),n.attachShader(l,s),n.linkProgram(l),n.deleteShader(c),n.deleteShader(s),!n.getProgramParameter(l,n.LINK_STATUS))return console.error(n.getProgramInfoLog(l)),n.deleteProgram(l),null;let m={},_=n.getProgramParameter(l,n.ACTIVE_UNIFORMS);for(let A=0;A<_;A++){let w=n.getActiveUniform(l,A);w&&(m[w.name]=n.getUniformLocation(l,w.name))}return{program:l,uniforms:m}},at=({colors:n=["#5227FF","#FF9FFC","#B497CF"],intensity:d=1,mouseForce:c=20,cursorSize:s=100,persistence:l=.75,viscosity:m=0,resolution:_=.5,bounceEdges:A=!1,clickBurst:w=!0,autoDemo:ee=!0,autoSpeed:U=.5,autoIntensity:te=2.2,autoResumeDelay:ke=1e3,intro:Ce=!0,lightMode:Ne=!1,backgroundColor:le="transparent",maxDevicePixelRatio:Be=2,className:ve="",style:Oe})=>{let de=q(null),fe=q(null),re=q(null),[me,Ge]=Z(0),he=Array.isArray(n)?n:[n],xe=le==="transparent"?null:Xe(le),pe={colors:he,paletteKey:he.join(","),intensity:Math.max(0,d),force:Math.max(0,c),radius:y(s,4,600),persistence:y(l,0,1),viscosity:y(m,0,1),resolution:y(_,.05,1),walls:A,clickBurst:w,autoDemo:ee,autoSpeed:Math.max(0,U),autoIntensity:Math.max(0,te),autoResumeDelay:Math.max(0,ke),intro:Ce,light:Ne,background:xe?[...xe,1]:[0,0,0,0],maxRatio:y(Be,.5,3)},N=q(pe);return N.current=pe,z(()=>{re.current?.()}),z(()=>{let B=de.current,g=fe.current;if(!B||!g)return;let e=g.getContext("webgl2",{alpha:!0,premultipliedAlpha:!0,antialias:!1,depth:!1,stencil:!1,powerPreference:"high-performance"});if(!e||!e.getExtension("EXT_color_buffer_float")&&!e.getExtension("EXT_color_buffer_half_float"))return;let b={splat:V(e,Je),smooth:V(e,Ze),divergence:V(e,Qe),pressure:V(e,et),project:V(e,tt),advect:V(e,rt),display:V(e,ot)};if(Object.values(b).some(t=>!t))return;let $=window.matchMedia("(prefers-reduced-motion: reduce)").matches,ye=e.createVertexArray(),h={width:1,height:1},E={width:0,height:0},u={},a={x:0,y:0,fromX:0,fromY:0,dx:0,dy:0,inside:!1,ready:!1,moved:!1,last:0},x={phase:Math.random()*100,x:0,y:0,ready:!1,ramp:0},R={active:N.current.intro&&!$&&me===0,time:0},Y=[],O=[],I=1,H=-1/0,P=0,K=0,oe=!0,ne=document.visibilityState!=="hidden",ie=!1,ge="",j=e.createTexture();e.bindTexture(e.TEXTURE_2D,j),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE);let We=t=>{t.paletteKey!==ge&&(ge=t.paletteKey,e.bindTexture(e.TEXTURE_2D,j),e.texImage2D(e.TEXTURE_2D,0,e.RGBA8,Q,1,0,e.RGBA,e.UNSIGNED_BYTE,it(t.colors)))},G=(t,r,o)=>{let v=e.createTexture();e.bindTexture(e.TEXTURE_2D,v),e.texImage2D(e.TEXTURE_2D,0,o===2?e.RG16F:e.R16F,t,r,0,o===2?e.RG:e.RED,e.HALF_FLOAT,null),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE);let i=e.createFramebuffer();return e.bindFramebuffer(e.FRAMEBUFFER,i),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,v,0),e.clearColor(0,0,0,0),e.clear(e.COLOR_BUFFER_BIT),{texture:v,framebuffer:i}},Ee=()=>{Object.keys(u).forEach(t=>{e.deleteTexture(u[t].texture),e.deleteFramebuffer(u[t].framebuffer),delete u[t]})},ae=()=>{let t=N.current,r=B.getBoundingClientRect(),o=Math.max(1,r.width),v=Math.max(1,r.height),i=Math.min(window.devicePixelRatio||1,t.maxRatio,Math.sqrt(Ye/(o*v))),f=Math.max(1,Math.round(o*i)),S=Math.max(1,Math.round(v*i));(g.width!==f||g.height!==S)&&(g.width=f,g.height=S),h.width=o,h.height=v;let p=t.resolution*.5,k=p*Math.min(1,Math.sqrt(He/(o*v*p*p))),M=y(Math.round(o*k),16,1024),F=y(Math.round(v*k),16,1024);M===E.width&&F===E.height||(Ee(),E.width=M,E.height=F,u.velocity=G(M,F,2),u.velocityNext=G(M,F,2),u.divergence=G(M,F,1),u.pressure=G(M,F,1),u.pressureNext=G(M,F,1),e.bindFramebuffer(e.FRAMEBUFFER,null))},W=(t,r)=>{let o=u[t];u[t]=u[r],u[r]=o},T=(t,r,o)=>{e.activeTexture(e.TEXTURE0+t),e.bindTexture(e.TEXTURE_2D,r),e.uniform1i(o,t)},D=(t,r,o)=>{e.useProgram(t.program),e.uniform2f(t.uniforms.uTexel,1/E.width,1/E.height),o(t.uniforms),e.bindFramebuffer(e.FRAMEBUFFER,r?r.framebuffer:null),e.drawArrays(e.TRIANGLES,0,3)},ze=(t,r)=>{e.viewport(0,0,E.width,E.height);let o=t.walls?1:0;Y.forEach(i=>{D(b.splat,u.velocityNext,f=>{T(0,u.velocity.texture,f.uVelocity),e.uniform2f(f.uSize,h.width,h.height),e.uniform4f(f.uSegment,i.ax,i.ay,i.bx,i.by),e.uniform2f(f.uForce,i.vx,i.vy),e.uniform1f(f.uRadius,i.radius)}),W("velocity","velocityNext")}),Y.length=0;let v=Math.ceil(t.viscosity*4);for(let i=0;i<v;i++)D(b.smooth,u.velocityNext,f=>{T(0,u.velocity.texture,f.uVelocity),e.uniform1f(f.uAmount,Math.min(1,t.viscosity*4-i)*.9)}),W("velocity","velocityNext");D(b.divergence,u.divergence,i=>{T(0,u.velocity.texture,i.uVelocity),e.uniform1f(i.uWalls,o)});for(let i=0;i<Ke;i++)D(b.pressure,u.pressureNext,f=>{T(0,u.pressure.texture,f.uPressure),T(1,u.divergence.texture,f.uDivergence),e.uniform1f(f.uWalls,o)}),W("pressure","pressureNext");D(b.project,u.velocityNext,i=>{T(0,u.pressure.texture,i.uPressure),T(1,u.velocity.texture,i.uVelocity),e.uniform1f(i.uWalls,o)}),W("velocity","velocityNext"),D(b.advect,u.velocityNext,i=>{T(0,u.velocity.texture,i.uVelocity),e.uniform2f(i.uStep,r/h.width,r/h.height),e.uniform1f(i.uKeep,Le(t.persistence,r)),e.uniform1f(i.uWalls,o)}),W("velocity","velocityNext")},qe=t=>{e.viewport(0,0,g.width,g.height),D(b.display,null,r=>{T(0,u.velocity.texture,r.uVelocity),T(1,j,r.uPalette),e.uniform2f(r.uSimSize,E.width,E.height),e.uniform1f(r.uSpeedScale,1.25*t.intensity/(.84*Math.max(h.width,h.height))),e.uniform1f(r.uLight,t.light?1:0),e.uniform4f(r.uBackground,t.background[0],t.background[1],t.background[2],t.background[3])})},$e=t=>{let r=.62*Math.sin(t*.83+1.3)+.38*Math.sin(t*1.71+.4),o=.6*Math.sin(t*1.07+2.1)+.4*Math.cos(t*.61+.7);return[(.5+.41*r)*h.width,(.5+.41*o)*h.height]},Te=t=>{let r=y(t/1.4,0,1),o=1-Math.pow(1-r,3),v=-.6+o*3.6,i=.08+.3*o;return[(.5+Math.cos(v)*i*1.1)*h.width,(.5+Math.sin(v)*i*(h.width/h.height)*.75)*h.height]},ce=(t,r,o,v,i)=>{Y.push({ax:t[0],ay:t[1],bx:r[0],by:r[1],vx:y((r[0]-t[0])/o*v,-6e3,6e3),vy:y((r[1]-t[1])/o*v,-6e3,6e3),radius:i})},we=t=>{if(P=0,ie)return;let r=N.current;We(r);let o=y((t-K)/1e3||0,0,1/30);K=Math.max(K,t);let v=Math.min(1,o*60),i=t-H>r.autoResumeDelay&&!a.inside;if(R.active&&o>0){let p=Te(R.time);R.time+=o;let k=Math.sin(Math.min(1,R.time/1.4)*Math.PI);ce(p,Te(R.time),o,.2*k,r.radius),I=1,R.time>1.4&&(R.active=!1)}else if(r.autoDemo&&!$&&i&&o>0){x.ramp=Math.min(1,x.ramp+o/.8),x.phase+=o*r.autoSpeed*1.6;let p=$e(x.phase);if(x.ready){let k=.3+.7*Math.pow(.5+.5*Math.sin(x.phase*2.6),2),M=r.force/20*.45*r.autoIntensity*x.ramp*x.ramp*k*v;ce([x.x,x.y],p,o,M,r.radius)}x.x=p[0],x.y=p[1],x.ready=!0,I=1}else x.ramp=0;if(a.moved&&o>0){a.moved=!1;let p=Math.max(t-a.last,8)/1e3;ce([a.fromX,a.fromY],[a.x,a.y],p,r.force/20*.15*v,r.radius),a.fromX=a.x,a.fromY=a.y,a.last=t,I=1}let f=O.shift();f&&Y.push(f),e.bindVertexArray(ye),e.disable(e.BLEND),o>0&&ze(r,o),qe(r),I*=Le(r.persistence,o),(R.active||r.autoDemo&&!$||I>.002||O.length>0||a.moved)&&oe&&ne&&(P=requestAnimationFrame(we))},L=()=>{P||ie||!oe||!ne||(K=performance.now(),P=requestAnimationFrame(we))};re.current=()=>{ae(),L()};let be=t=>{let r=B.getBoundingClientRect();return{x:t.clientX-r.left,y:r.bottom-t.clientY,inside:t.clientX>=r.left&&t.clientX<=r.right&&t.clientY>=r.top&&t.clientY<=r.bottom}},Re=t=>{let r=be(t);if(a.inside=r.inside,!r.inside){a.ready=!1;return}H=performance.now(),R.active=!1,a.ready||(a.fromX=r.x,a.fromY=r.y,a.x=r.x,a.y=r.y,a.last=H,a.ready=!0);let o=r.x-a.x,v=r.y-a.y;Math.hypot(o,v)>.5&&(a.dx=a.dx*.7+o*.3,a.dy=a.dy*.7+v*.3),a.x=r.x,a.y=r.y,a.moved=!0,L()},Me=t=>{let r=N.current,o=be(t);if(!o.inside||(H=performance.now(),!r.clickBurst||$))return;let v=Math.hypot(a.dx,a.dy)>1?Math.atan2(a.dy,a.dx):Math.random()*Math.PI*2,i=Math.cos(v),f=Math.sin(v),S=r.radius*.5,p=1400*(r.force/20);O.push({ax:o.x-i*S,ay:o.y-f*S,bx:o.x+i*S,by:o.y+f*S,vx:i*p,vy:f*p,radius:r.radius*.9}),O.length>4&&O.shift(),I=1,L()},se=()=>{a.inside=!1,a.ready=!1},J=t=>{t.pointerType!=="mouse"&&se()};window.addEventListener("pointermove",Re,{passive:!0}),window.addEventListener("pointerdown",Me,{passive:!0}),window.addEventListener("pointerup",J,{passive:!0}),window.addEventListener("pointercancel",J,{passive:!0}),document.documentElement.addEventListener("pointerleave",se);let _e=t=>{t.preventDefault(),ie=!0,cancelAnimationFrame(P),P=0},Ue=()=>Ge(t=>t+1);g.addEventListener("webglcontextlost",_e),g.addEventListener("webglcontextrestored",Ue);let Se=new ResizeObserver(()=>{ae(),L()});Se.observe(B);let Ae=new IntersectionObserver(t=>{oe=t.some(r=>r.isIntersecting),L()});Ae.observe(B);let Pe=()=>{ne=document.visibilityState!=="hidden",L()};return document.addEventListener("visibilitychange",Pe),ae(),L(),()=>{cancelAnimationFrame(P),re.current=null,Se.disconnect(),Ae.disconnect(),window.removeEventListener("pointermove",Re),window.removeEventListener("pointerdown",Me),window.removeEventListener("pointerup",J),window.removeEventListener("pointercancel",J),document.documentElement.removeEventListener("pointerleave",se),document.removeEventListener("visibilitychange",Pe),g.removeEventListener("webglcontextlost",_e),g.removeEventListener("webglcontextrestored",Ue),e.isContextLost()||(Ee(),e.deleteTexture(j),e.deleteVertexArray(ye),Object.values(b).forEach(t=>e.deleteProgram(t.program)))}},[me]),C("div",{ref:de,className:`liquid-ether${ve?` ${ve}`:""}`,style:Oe,children:C("canvas",{ref:fe,className:"liquid-ether__canvas","aria-hidden":"true"})})},Ie=at;var ue=document.getElementById("liquid-ether-mount"),ct=()=>{try{let d=document.createElement("canvas").getContext("webgl2");if(!d)return!1;let c=!!(d.getExtension("EXT_color_buffer_float")||d.getExtension("EXT_color_buffer_half_float"));return d.getExtension("WEBGL_lose_context")?.loseContext(),c}catch{return!1}};function st(){let[n,d]=Z(document.documentElement.dataset.theme==="dark"),c=window.matchMedia("(max-width: 860px)").matches;return z(()=>{let s=new MutationObserver(()=>{d(document.documentElement.dataset.theme==="dark")});return s.observe(document.documentElement,{attributes:!0,attributeFilter:["data-theme"]}),()=>s.disconnect()},[]),C(Ie,{colors:["#252a27","#7d2c24","#6f5a1c"],intensity:1.2,mouseForce:21,cursorSize:215,persistence:.8,viscosity:.1,resolution:c?.3:.5,autoDemo:!0,autoSpeed:1.05,autoIntensity:3,autoResumeDelay:650,clickBurst:!1,bounceEdges:!1,intro:!0,lightMode:!n,backgroundColor:"transparent",maxDevicePixelRatio:c?1.25:1.75})}ue&&!window.matchMedia("(prefers-reduced-motion: reduce)").matches&&ct()&&(De(C(st,{}),ue),ue.dataset.mounted="true");
