import"./island-chunks/chunk-SXAG5OYS.js";import{e as Se,g as H,h as _,j as q,n as A}from"./island-chunks/chunk-OS2XOP7G.js";import"./island-chunks/chunk-SSQABL5H.js";var Ne=24e5,Te=4,Re=1/120,Ye=`#version 300 es
const vec2 corners[3] = vec2[3](vec2(-1.0, -1.0), vec2(3.0, -1.0), vec2(-1.0, 3.0));
void main() {
  gl_Position = vec4(corners[gl_VertexID], 0.0, 1.0);
}`,Ve=`#version 300 es
precision highp float;
uniform sampler2D uState;
uniform vec2 uSize;
uniform vec4 uStroke;
uniform vec2 uImpulse;
out vec4 fragColor;

float segment(vec2 p, vec2 a, vec2 b) {
  vec2 ab = b - a;
  float t = clamp(dot(p - a, ab) / max(dot(ab, ab), 1e-4), 0.0, 1.0);
  return length(p - a - ab * t);
}

void main() {
  vec2 texel = 1.0 / uSize;
  vec2 uv = gl_FragCoord.xy * texel;
  vec2 state = texture(uState, uv).rg;
  vec2 around =
    texture(uState, uv - vec2(texel.x, 0.0)).rg +
    texture(uState, uv + vec2(texel.x, 0.0)).rg +
    texture(uState, uv - vec2(0.0, texel.y)).rg +
    texture(uState, uv + vec2(0.0, texel.y)).rg -
    4.0 * state;
  float next = state.r + (state.r - state.g) * 0.982 + 0.3 * around.r + 0.08 * (around.r - around.g);
  next *= 0.998;
  if (uImpulse.x != 0.0) {
    float d = segment(gl_FragCoord.xy, uStroke.xy, uStroke.zw) / uImpulse.y;
    next += uImpulse.x * exp(-d * d);
  }
  fragColor = vec4(next, state.r, 0.0, 1.0);
}`,He=`#version 300 es
precision highp float;
uniform sampler2D uState;
uniform vec2 uSize;
out vec4 fragColor;

void main() {
  vec2 texel = 1.0 / uSize;
  vec2 uv = gl_FragCoord.xy * texel;
  float left = texture(uState, uv - vec2(texel.x, 0.0)).r;
  float right = texture(uState, uv + vec2(texel.x, 0.0)).r;
  float down = texture(uState, uv - vec2(0.0, texel.y)).r;
  float up = texture(uState, uv + vec2(0.0, texel.y)).r;
  fragColor = vec4((right - left) * 0.5, (up - down) * 0.5, 0.0, 1.0);
}`,We=`#version 300 es
precision highp float;
uniform vec2 uResolution;
uniform float uUnit;
uniform float uTime;
uniform float uAmplitude;
uniform vec2 uFrequency;
uniform float uDetail;
uniform float uSharpness;
uniform float uDepth;
uniform float uPresence;
uniform vec3 uTint;
uniform vec2 uShift;
uniform float uRoughness;
uniform float uExposure;
uniform float uLight;
uniform sampler2D uSlope;
uniform vec2 uSlopeSize;
uniform float uRipple;
out vec4 fragColor;

vec2 slopeAt(vec2 uv) {
  vec2 st = uv * uSlopeSize - 0.5;
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
  vec2 h0 = (i - 0.5 + w1 / g0) / uSlopeSize;
  vec2 h1 = (i + 1.5 + w3 / g1) / uSlopeSize;
  vec2 a = texture(uSlope, vec2(h0.x, h0.y)).rg;
  vec2 b = texture(uSlope, vec2(h1.x, h0.y)).rg;
  vec2 c = texture(uSlope, vec2(h0.x, h1.y)).rg;
  vec2 d = texture(uSlope, vec2(h1.x, h1.y)).rg;
  return g0.y * (g0.x * a + g1.x * b) + g1.y * (g0.x * c + g1.x * d);
}

float lamp(vec2 p, vec2 center, vec2 size, float soft) {
  vec2 grown = size + soft;
  vec2 q = (p - center) / grown;
  q *= q;
  float d = sqrt(sqrt(dot(q, q)));
  float edge = soft / min(grown.x, grown.y);
  float shape = (1.0 - smoothstep(1.0 - edge, 1.0 + edge, d)) * (1.0 - 0.45 * d * d);
  return shape * size.x * size.y / (grown.x * grown.y);
}

vec3 studio(vec3 r, float blur) {
  vec2 p = r.xy / max(r.z + 1.0, 0.05);
  p += uShift * smoothstep(0.3, 1.0, length(p));
  float radius = length(p);
  float soft = 0.008 + blur;
  vec2 dir = p / max(radius, 1e-3);
  float key = lamp(p, vec2(-0.25, 0.42), vec2(0.3, 0.12), soft);
  float side = lamp(p, vec2(0.48, 0.12), vec2(0.06, 0.3), soft);
  float ground = lamp(p, vec2(-0.1, -0.55), vec2(0.45, 0.06), soft);
  float rise = smoothstep(-1.0, 1.0, dir.y);
  if (uLight > 0.5) {
    float edge = 0.008 + blur * 0.8;
    float lobe = smoothstep(0.15, 0.85, 0.5 + 0.5 * sin(atan(dir.y, dir.x) * 2.0 + 0.9));
    float tone = mix(2.4, 0.95, smoothstep(0.5 - edge, 1.0 + edge, radius));
    tone = mix(tone, 0.02, smoothstep(0.98 - edge, 1.12 + edge, radius));
    tone = mix(tone, mix(0.03, 0.3, lobe) * (0.8 + 0.4 * rise), smoothstep(1.15 - edge, 1.3 + edge, radius));
    float width = 0.035 + edge;
    tone += 2.4 * exp(-pow((radius - 1.4) / width, 2.0)) * min(1.0, 0.06 / width) * (0.6 + 0.4 * rise);
    return vec3(tone) * (1.0 - 0.5 * side) * (1.0 - 0.3 * ground) + 0.8 * key;
  }
  float width = 0.015 + soft * 2.0;
  float rim = exp(-abs(radius - 1.0) / width) * 0.031 / width * (0.8 + smoothstep(-0.5, 0.8, p.y));
  float band = 1.0 - 0.95 * smoothstep(1.04 - soft, 1.12 + soft, radius);
  float wall = smoothstep(1.25, 1.55, radius) * (0.6 + 0.4 * rise);
  float streak = smoothstep(0.2, 0.8, 0.5 + 0.5 * sin(atan(dir.y, dir.x) * 3.0 + 0.6));
  vec3 color = vec3(0.004, 0.004, 0.005) + 0.02 * smoothstep(-0.4, 0.6, p.y);
  color += vec3(1.0, 0.97, 0.94) * key * 4.0 + vec3(0.9, 0.95, 1.0) * side * 3.0 + ground * 1.2;
  color += vec3(1.0, 0.98, 0.95) * rim;
  color *= band;
  return color + vec3(mix(0.45, 1.8, streak)) * wall;
}

vec3 shade(vec2 slope, vec3 v, float blur, vec3 f0) {
  float steep = length(slope);
  slope *= 3.0 * tanh(steep / 3.0) / max(steep, 1e-6);
  vec3 n = normalize(vec3(-slope, 1.0));
  vec3 r = reflect(v, n);
  float facing = clamp(dot(n, -v), 0.0, 1.0);
  return studio(r, blur) * (f0 + (1.0 - f0) * pow(1.0 - facing, 5.0));
}

vec3 aces(vec3 x) {
  return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0);
}

void main() {
  vec2 frag = gl_FragCoord.xy;
  vec2 uv = (2.0 * frag - uResolution) / uUnit;
  vec2 p = uv;
  vec2 rowX = vec2(1.0, 0.0);
  vec2 rowY = vec2(0.0, 1.0);
  float amplitude = uAmplitude * uPresence;
  for (float i = 1.0; i < 9.0; i++) {
    if (i > uDetail) break;
    float a = amplitude / i;
    float soften = exp(0.3 - 0.3 * i);
    float argX = i * uFrequency.x * p.y + uTime;
    p.x += a * cos(argX);
    rowX -= a * sin(argX) * i * uFrequency.x * soften * rowY;
    float argY = i * uFrequency.y * p.x + uTime;
    p.y += a * cos(argY);
    rowY -= a * sin(argY) * i * uFrequency.y * soften * rowX;
  }
  float phase = uTime - p.x - p.y;
  vec2 field = -(rowX + rowY);
  float density = max(length(field), 1e-3);
  vec2 across = field / density;
  float k = uSharpness;
  float sn = sin(phase);
  float cs = cos(phase);
  float th = tanh(k * sn);
  float bevel = (1.0 - th * th) / tanh(k);
  float fade = smoothstep(3.0, 9.0, 3.14159 * uUnit / density);
  float weight = uDepth * uPresence * fade;
  vec2 slope = k * cs * bevel * weight * across + slopeAt(frag / uResolution) * uRipple;
  vec2 sweep = -k * bevel * (sn + 2.0 * k * cs * cs * th) * weight * density * 2.0 / uUnit * across;
  vec2 stepX = dFdx(slope);
  vec2 stepY = dFdy(slope);
  vec2 crease = dot(stepX, stepX) > dot(stepY, stepY) ? stepX : stepY;
  if (dot(crease, crease) > dot(sweep, sweep)) sweep = crease;
  float bend = length(sweep);
  float alpha = smoothstep(0.0, 0.1, length(slope));
  vec3 f0 = mix(vec3(1.0), uTint, smoothstep(0.05, 0.6, length(slope))) * 0.92;
  vec3 v = normalize(vec3(uv * 0.08, -1.0));
  float blur = uRoughness * 0.35;
  vec3 light;
  if (bend < 0.01) {
    light = shade(slope, v, blur + bend * 0.5, f0);
  } else {
    light = vec3(0.0);
    for (float t = -0.375; t < 0.4; t += 0.25) {
      light += shade(slope + sweep * t, v, blur + bend * 0.15, f0);
    }
    light *= 0.25;
  }
  vec3 color = pow(aces(light * uExposure), vec3(1.0 / 2.2));
  float grain = fract(52.9829189 * fract(dot(frag, vec2(0.06711056, 0.00583715))));
  color += (grain - 0.5) / 255.0;
  fragColor = vec4(clamp(color, 0.0, 1.0) * alpha, alpha);
}`,m=(n,u,a)=>Math.min(a,Math.max(u,n)),$e=n=>{if(Array.isArray(n))return[0,1,2].map(s=>m(Number(n[s])||0,0,1));let u=String(n||"").trim(),a=/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(u);if(a){let s=a[1].length===3?a[1].replace(/./g,p=>p+p):a[1];return[0,2,4].map(p=>parseInt(s.slice(p,p+2),16)/255)}let i=/^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/i.exec(u);return i?[i[1],i[2],i[3]].map(s=>m(parseFloat(s)/255,0,1)):[1,1,1]},Me=(n,u,a)=>{let i=n.createShader(u);return i?(n.shaderSource(i,a),n.compileShader(i),n.getShaderParameter(i,n.COMPILE_STATUS)?i:(console.error(n.getShaderInfoLog(i)),n.deleteShader(i),null)):null},re=(n,u)=>{let a=Me(n,n.VERTEX_SHADER,Ye),i=Me(n,n.FRAGMENT_SHADER,u),s=a&&i?n.createProgram():null;if(!a||!i||!s)return a&&n.deleteShader(a),i&&n.deleteShader(i),null;if(n.attachShader(s,a),n.attachShader(s,i),n.linkProgram(s),n.deleteShader(a),n.deleteShader(i),!n.getProgramParameter(s,n.LINK_STATUS))return console.error(n.getProgramInfoLog(s)),n.deleteProgram(s),null;let p={},W=n.getProgramParameter(s,n.ACTIVE_UNIFORMS);for(let P=0;P<W;P++){let U=n.getActiveUniform(s,P);U&&(p[U.name]=n.getUniformLocation(s,U.name))}return{program:s,uniforms:p}},Ke=({color:n="#ffffff",speed:u=.2,amplitude:a=.3,frequencyX:i=3,frequencyY:s=3,detail:p=4,thickness:W=1,depth:P=1,roughness:U=.3,exposure:Ae=1,interactive:Pe=!0,rippleStrength:Ue=1,rippleSize:Ie=1,tilt:Xe=1,intro:qe=!0,lightMode:Ce=!1,maxDevicePixelRatio:De=2,active:ie=!0,className:ae="",style:ze})=>{let se=q(null),ue=q(null),C=q(null),[ce,ke]=H(0),le={tint:$e(n).map(S=>Math.pow(S,2.2)),speed:Math.max(0,u),amplitude:m(a,0,2),frequency:[Math.max(.1,i),Math.max(.1,s)],detail:m(Math.round(p),1,8),thickness:m(W,.25,4),depth:Math.max(0,P),roughness:m(U,0,1),exposure:Math.max(0,Ae),interactive:Pe,rippleStrength:Math.max(0,Ue),rippleSize:m(Ie,.2,4),tilt:Math.max(0,Xe),intro:qe,light:Ce,maxRatio:m(De,.5,3),active:ie},b=q(le);return b.current=le,_(()=>{C.current?.()},[ie]),_(()=>{C.current?.()}),_(()=>{let S=se.current,f=ue.current;if(!S||!f)return;let e=f.getContext("webgl2",{alpha:!0,premultipliedAlpha:!0,antialias:!1,depth:!1,stencil:!1,powerPreference:"high-performance"}),D=e?re(e,We):null;if(!e||!D)return;let $=!!e.getExtension("EXT_color_buffer_float"),v=$?re(e,Ve):null,T=$?re(e,He):null,z=window.matchMedia("(prefers-reduced-motion: reduce)").matches,fe=e.createVertexArray(),h={width:1,height:1},w=[],g=null,I=0,de=1,c={x:0,y:0,inside:!1,ready:!1,nx:0,ny:0},l={yaw:0,pitch:0,vyaw:0,vpitch:0},X=[],k=Math.random()*40,O=b.current.intro&&!z&&ce===0?0:1,B=0,K=0,R=0,G=0,J=!0,Q=document.visibilityState!=="hidden",Z=!1,j=(o,r)=>{let t=e.createTexture();e.bindTexture(e.TEXTURE_2D,t),e.texImage2D(e.TEXTURE_2D,0,e.RG16F,o,r,0,e.RG,e.HALF_FLOAT,null),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE);let d=e.createFramebuffer();return e.bindFramebuffer(e.FRAMEBUFFER,d),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,t,0),e.clearColor(0,0,0,1),e.clear(e.COLOR_BUFFER_BIT),e.bindFramebuffer(e.FRAMEBUFFER,null),{texture:t,framebuffer:d}},N=o=>{o&&(e.deleteTexture(o.texture),e.deleteFramebuffer(o.framebuffer))},ee=()=>{let o=b.current,r=S.getBoundingClientRect(),t=Math.max(1,r.width),d=Math.max(1,r.height),M=Math.min(window.devicePixelRatio||1,o.maxRatio,Math.sqrt(Ne/(t*d))),L=Math.max(1,Math.round(t*M)),F=Math.max(1,Math.round(d*M));if((f.width!==L||f.height!==F)&&(f.width=L,f.height=F),de=Math.min(L,F),!$||!v||!T)return;let x=m(Math.round(t/Te),16,512),E=m(Math.round(d/Te),16,512);x===h.width&&E===h.height&&w.length||(w.forEach(N),w.length=0,N(g),Object.assign(h,{width:x,height:E}),w.push(j(x,E),j(x,E)),g=j(x,E))},Oe=o=>{if(!(!v||!T||!g)){e.useProgram(v.program),e.viewport(0,0,h.width,h.height),e.uniform2f(v.uniforms.uSize,h.width,h.height),e.activeTexture(e.TEXTURE0),e.uniform1i(v.uniforms.uState,0);for(let r=0;r<o;r++){let t=r===0?X.shift():null;t?(e.uniform4f(v.uniforms.uStroke,t.ax,t.ay,t.bx,t.by),e.uniform2f(v.uniforms.uImpulse,t.strength,t.radius)):e.uniform2f(v.uniforms.uImpulse,0,1);let d=w[I],M=w[1-I];e.bindTexture(e.TEXTURE_2D,d.texture),e.bindFramebuffer(e.FRAMEBUFFER,M.framebuffer),e.drawArrays(e.TRIANGLES,0,3),I=1-I}e.useProgram(T.program),e.uniform2f(T.uniforms.uSize,h.width,h.height),e.uniform1i(T.uniforms.uState,0),e.bindTexture(e.TEXTURE_2D,w[I].texture),e.bindFramebuffer(e.FRAMEBUFFER,g.framebuffer),e.drawArrays(e.TRIANGLES,0,3)}},Be=o=>{e.bindFramebuffer(e.FRAMEBUFFER,null),e.viewport(0,0,f.width,f.height);let r=D.uniforms;e.useProgram(D.program),e.uniform2f(r.uResolution,f.width,f.height),e.uniform1f(r.uUnit,de),e.uniform1f(r.uTime,k),e.uniform1f(r.uAmplitude,o.amplitude),e.uniform2f(r.uFrequency,o.frequency[0],o.frequency[1]),e.uniform1f(r.uDepth,o.depth),e.uniform1f(r.uDetail,o.detail),e.uniform1f(r.uSharpness,5/(3*o.thickness)),e.uniform1f(r.uPresence,1-Math.pow(1-O,3)),e.uniform3fv(r.uTint,o.tint),e.uniform2f(r.uShift,l.yaw,l.pitch),e.uniform1f(r.uRoughness,o.roughness),e.uniform1f(r.uExposure,o.exposure),e.uniform1f(r.uLight,o.light?1:0),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,g?g.texture:null),e.uniform1i(r.uSlope,0),e.uniform2f(r.uSlopeSize,h.width,h.height),e.uniform1f(r.uRipple,g?o.rippleStrength*2.2:0),e.drawArrays(e.TRIANGLES,0,3)},he=o=>{if(R=0,Z||!b.current.active)return;let r=b.current,t=m((o-G)/1e3||0,0,.05);G=Math.max(G,o),k+=t*r.speed*(z?.25:1),O=Math.min(1,O+t/1.8);let d=r.interactive&&c.inside,M=z?0:r.tilt,L=(d?c.nx*.35:.22*Math.sin(k*1.3))*M,F=(d?-c.ny*.28:.16*Math.sin(k*.9+1.7))*M,x=36,E=2*Math.sqrt(x)*.95;if(l.vyaw+=((L-l.yaw)*x-l.vyaw*E)*t,l.vpitch+=((F-l.pitch)*x-l.vpitch*E)*t,l.yaw+=l.vyaw*t,l.pitch+=l.vpitch*t,e.bindVertexArray(fe),g){K+=t;let V=Math.min(4,Math.floor(K/Re));K-=V*Re,V>0&&(Oe(V),B=Math.max(0,B*Math.pow(.982,V)))}Be(r);let Ge=Math.abs(l.vyaw)+Math.abs(l.vpitch)>1e-4||Math.abs(L-l.yaw)+Math.abs(F-l.pitch)>1e-4;(r.speed>0||O<1||Ge||B>.002||X.length>0)&&J&&Q&&(R=requestAnimationFrame(he))},y=()=>{R||Z||!J||!Q||(G=performance.now(),R=requestAnimationFrame(he))};C.current=()=>{ee(),y()};let me=(o,r)=>{let t=S.getBoundingClientRect();return{x:(o-t.left)/t.width*h.width,y:(1-(r-t.top)/t.height)*h.height,nx:(o-t.left)/t.width*2-1,ny:(r-t.top)/t.height*2-1,inside:o>=t.left&&o<=t.right&&r>=t.top&&r<=t.bottom}},pe=(o,r)=>{!g||!r.interactive||z||(X.push(o),X.length>6&&X.shift(),B=1)},ve=o=>{let r=b.current,t=me(o.clientX,o.clientY);if(c.nx=m(t.nx,-1,1),c.ny=m(t.ny,-1,1),c.inside=t.inside,t.inside&&c.ready){let d=Math.hypot(t.x-c.x,t.y-c.y);d>.25&&pe({ax:c.x,ay:c.y,bx:t.x,by:t.y,strength:-Math.min(.45,.04+d*.045)*r.rippleSize,radius:4*r.rippleSize},r)}c.x=t.x,c.y=t.y,c.ready=t.inside,y()},ge=o=>{let r=b.current,t=me(o.clientX,o.clientY);t.inside&&(pe({ax:t.x,ay:t.y,bx:t.x,by:t.y,strength:-1.6*r.rippleSize,radius:6*r.rippleSize},r),y())},te=()=>{c.inside=!1,c.ready=!1,y()},Y=o=>{o.pointerType!=="mouse"&&te()};window.addEventListener("pointermove",ve,{passive:!0}),window.addEventListener("pointerdown",ge,{passive:!0}),window.addEventListener("pointerup",Y,{passive:!0}),window.addEventListener("pointercancel",Y,{passive:!0}),document.documentElement.addEventListener("pointerleave",te);let xe=o=>{o.preventDefault(),Z=!0,cancelAnimationFrame(R),R=0},we=()=>ke(o=>o+1);f.addEventListener("webglcontextlost",xe),f.addEventListener("webglcontextrestored",we);let ye=new ResizeObserver(()=>{ee(),y()});ye.observe(S);let Ee=new IntersectionObserver(o=>{J=o.some(r=>r.isIntersecting),y()});Ee.observe(S);let be=()=>{Q=document.visibilityState!=="hidden",y()};return document.addEventListener("visibilitychange",be),ee(),y(),()=>{cancelAnimationFrame(R),C.current=null,ye.disconnect(),Ee.disconnect(),window.removeEventListener("pointermove",ve),window.removeEventListener("pointerdown",ge),window.removeEventListener("pointerup",Y),window.removeEventListener("pointercancel",Y),document.documentElement.removeEventListener("pointerleave",te),document.removeEventListener("visibilitychange",be),f.removeEventListener("webglcontextlost",xe),f.removeEventListener("webglcontextrestored",we),e.isContextLost()||(w.forEach(N),N(g),e.deleteVertexArray(fe),e.deleteProgram(D.program),v&&e.deleteProgram(v.program),T&&e.deleteProgram(T.program))}},[ce]),A("div",{ref:se,className:`liquid-chrome${ae?` ${ae}`:""}`,style:ze,children:A("canvas",{ref:ue,className:"liquid-chrome__canvas","aria-hidden":"true"})})},Le=Ke;var oe=document.getElementById("liquid-chrome-mount"),Fe=document.querySelector(".tt-loader"),_e=window.matchMedia("(prefers-reduced-motion: reduce)").matches,ne=window.matchMedia("(max-width: 760px)").matches,Je=()=>{try{let u=document.createElement("canvas").getContext("webgl2");return u?(u.getExtension("WEBGL_lose_context")?.loseContext(),!0):!1}catch{return!1}},Qe=()=>{let[n,u]=H(()=>!(Fe&&Fe.classList.contains("is-hidden")));return _(()=>{let a=()=>u(!0),i=()=>u(!1);return window.addEventListener("tt:loader-show",a),window.addEventListener("tt:loader-hidden",i),()=>{window.removeEventListener("tt:loader-show",a),window.removeEventListener("tt:loader-hidden",i)}},[]),A(Le,{color:"#dfe3e8",speed:_e?0:ne?1.25:1.55,amplitude:.9,frequencyX:4.2,frequencyY:3.4,detail:ne?6:8,thickness:1.2,depth:2,roughness:.22,exposure:1.1,interactive:!_e,rippleStrength:3.5,rippleSize:2.8,tilt:1.4,intro:!1,maxDevicePixelRatio:ne?1.5:1.75,active:n})};oe&&Je()&&(Se(A(Qe,{}),oe),oe.dataset.mounted="true");
