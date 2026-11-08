import"./island-chunks/chunk-SXAG5OYS.js";import{e as dt,h as Ne,j as ye,n as Le}from"./island-chunks/chunk-OS2XOP7G.js";import"./island-chunks/chunk-SSQABL5H.js";var Rt=`#version 300 es
in vec2 aPosition;
in vec2 aRest;
in vec4 aStrain;
in vec3 aDent;
uniform vec2 uViewport;
uniform vec2 uOffset;
out vec2 vRest;
out vec4 vStrain;
out vec3 vDent;
void main() {
  vRest = aRest;
  vStrain = aStrain;
  vDent = aDent;
  vec2 clip = (aPosition + uOffset) / uViewport * 2.0 - 1.0;
  gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
}`,St=`#version 300 es
precision highp float;
in vec2 vRest;
in vec4 vStrain;
in vec3 vDent;
uniform sampler2D uField;
uniform vec3 uShadowColor;
uniform float uShadow;
uniform vec4 uParts[64];
uniform float uClock;

float arrival(float delay) {
  float t = max(uClock - delay, 0.0);
  float omega = 15.0;
  float zeta = 0.38;
  float damped = omega * sqrt(1.0 - zeta * zeta);
  return 1.0 - exp(-zeta * omega * t) * (cos(damped * t) + zeta * omega / damped * sin(damped * t));
}

float owner(vec2 rest) {
  ivec2 size = textureSize(uField, 0);
  ivec2 texel = clamp(ivec2(rest * vec2(size)), ivec2(0), size - 1);
  return floor(texelFetch(uField, texel, 0).w + 0.5);
}

vec3 settle(vec2 rest) {
  if (uClock > 9.0) return vec3(rest, 1.0);
  float id = owner(rest);
  if (id < 0.5 || id > 64.5) return vec3(rest, 1.0);
  vec4 part = uParts[int(id) - 1];
  float presence = arrival(part.z);
  float size = max(mix(0.5, 1.0, presence), 0.05);
  vec2 moved = part.xy + (rest - part.xy) / size;
  return vec3(moved, presence * step(abs(owner(moved) - id), 0.5));
}
out vec4 outColor;
void main() {
  vec3 arrived = settle(vRest);
  float shade = texture(uField, arrived.xy).z * uShadow * clamp(arrived.z, 0.0, 1.0) * (1.0 - 0.35 * clamp(vDent.x, 0.0, 1.0));
  outColor = vec4(uShadowColor * shade, shade);
}`,kt=`#version 300 es
precision highp float;
in vec2 vRest;
in vec4 vStrain;
in vec3 vDent;
uniform sampler2D uField;
uniform sampler2D uSlope;
uniform sampler2D uPaint;
uniform vec3 uColor;
uniform float uPaintMix;
uniform float uMaterial;
uniform float uLight;
uniform float uInflate;
uniform mat3 uTurn;
uniform vec4 uParts[64];
uniform float uClock;
out vec4 outColor;

float arrival(float delay) {
  float t = max(uClock - delay, 0.0);
  float omega = 15.0;
  float zeta = 0.38;
  float damped = omega * sqrt(1.0 - zeta * zeta);
  return 1.0 - exp(-zeta * omega * t) * (cos(damped * t) + zeta * omega / damped * sin(damped * t));
}

float owner(vec2 rest) {
  ivec2 size = textureSize(uField, 0);
  ivec2 texel = clamp(ivec2(rest * vec2(size)), ivec2(0), size - 1);
  return floor(texelFetch(uField, texel, 0).w + 0.5);
}

vec3 settle(vec2 rest) {
  if (uClock > 9.0) return vec3(rest, 1.0);
  float id = owner(rest);
  if (id < 0.5 || id > 64.5) return vec3(rest, 1.0);
  vec4 part = uParts[int(id) - 1];
  float presence = arrival(part.z);
  float size = max(mix(0.5, 1.0, presence), 0.05);
  vec2 moved = part.xy + (rest - part.xy) / size;
  return vec3(moved, presence * step(abs(owner(moved) - id), 0.5));
}
vec4 cubic(float v) {
  vec4 n = vec4(1.0, 2.0, 3.0, 4.0) - v;
  vec4 s = n * n * n;
  float x = s.x;
  float y = s.y - 4.0 * s.x;
  float z = s.z - 4.0 * s.y + 6.0 * s.x;
  return vec4(x, y, z, 6.0 - x - y - z) / 6.0;
}

vec2 smoothSlope(vec2 uv) {
  vec2 size = vec2(textureSize(uSlope, 0));
  vec2 cell = uv * size - 0.5;
  vec2 f = fract(cell);
  cell -= f;
  vec4 xc = cubic(f.x);
  vec4 yc = cubic(f.y);
  vec4 corner = cell.xxyy + vec2(-0.5, 1.5).xyxy;
  vec4 sum = vec4(xc.xz + xc.yw, yc.xz + yc.yw);
  vec4 offset = (corner + vec4(xc.yw, yc.yw) / sum) / size.xxyy;
  vec2 a = texture(uSlope, offset.xz).xy;
  vec2 b = texture(uSlope, offset.yz).xy;
  vec2 c = texture(uSlope, offset.xw).xy;
  vec2 d = texture(uSlope, offset.yw).xy;
  float sx = sum.x / (sum.x + sum.y);
  float sy = sum.z / (sum.z + sum.w);
  return mix(mix(d, c, sx), mix(b, a, sx), sy);
}

float panel(vec3 r, vec3 center, vec2 size, float soft) {
  vec3 forward = normalize(center);
  vec3 side = normalize(cross(vec3(0.0, 1.0, 0.0), forward));
  vec3 lift = cross(forward, side);
  float facing = dot(r, forward);
  vec2 local = vec2(dot(r, side), dot(r, lift)) / max(facing, 0.1);
  vec2 q = abs(local) - size;
  float d = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0);
  return smoothstep(soft, -soft, d) * smoothstep(0.05, 0.3, facing);
}

vec3 studio(vec3 r, float blur) {
  float y = r.y;
  vec3 skyLow = mix(vec3(0.92, 0.95, 1.0), vec3(1.0), uLight);
  vec3 skyHigh = mix(vec3(0.1, 0.11, 0.14), vec3(0.62, 0.64, 0.7), uLight);
  vec3 groundNear = mix(vec3(0.12, 0.11, 0.1), vec3(0.3, 0.29, 0.28), uLight);
  vec3 groundFar = mix(vec3(0.005), vec3(0.1), uLight);
  vec3 sky = mix(skyLow, skyHigh, smoothstep(0.0, 0.75, y));
  vec3 ground = mix(groundNear, groundFar, smoothstep(0.0, -0.4, y));
  float edge = 0.004 + blur;
  vec3 c = mix(ground, sky, smoothstep(-edge, edge, y));
  float glow = 0.035 + blur;
  c += vec3(2.2) * exp(-pow((y - 0.02) / glow, 2.0)) * (0.035 / glow);
  c += vec3(7.0) * panel(r, vec3(-0.55, 0.55, 0.62), vec2(0.36, 0.2), 0.025 + blur);
  c += vec3(4.5) * panel(r, vec3(0.9, 0.18, 0.4), vec2(0.045, 0.85), 0.01 + blur) * (0.045 / (0.045 + blur));
  c += vec3(3.2) * panel(r, vec3(-0.95, 0.1, 0.32), vec2(0.035, 0.7), 0.01 + blur) * (0.035 / (0.035 + blur));
  c += vec3(2.4) * panel(r, vec3(0.0, 0.92, 0.38), vec2(1.1, 0.045), 0.01 + blur) * (0.045 / (0.045 + blur));
  return c;
}

vec3 tone(vec3 x) {
  return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0);
}

void main() {
  vec3 arrived = settle(vRest);
  vec2 rest = arrived.xy;
  float presence = arrived.z;
  vec4 field = texture(uField, rest);
  float edge = field.y;
  float edgeWidth = max(fwidth(edge), 0.0001);
  if (edge < -3.0 * edgeWidth || presence <= 0.001) discard;
  float cover = clamp(edge / edgeWidth + 0.5, 0.0, 1.0);

  vec2 slope = smoothSlope(rest);
  mat2 strain = mat2(vStrain.xy, vStrain.zw);
  float area = max(determinant(strain), 0.2);
  float lift = uInflate * presence * inversesqrt(area);
  float keep = clamp(1.0 - vDent.x, 0.15, 1.6);
  vec2 restGradient = (slope * keep - field.x * vDent.yz) * lift;
  vec2 gradient = inverse(transpose(strain)) * restGradient;
  vec3 normal = normalize(vec3(-gradient.x, gradient.y, 1.0));
  float depth = field.x * keep * lift;

  vec3 turned = uTurn * normal;
  vec3 reflected = uTurn * reflect(vec3(0.0, 0.0, -1.0), normal);
  float footprint = length(fwidth(reflected));
  float facing = max(normal.z, 0.0);
  float fresnel = pow(1.0 - facing, 5.0);
  vec3 lightDir = normalize(vec3(-0.5, 0.62, 0.62));
  float wrap = max((dot(turned, lightDir) + 0.45) / 1.45, 0.0);
  float key = max(dot(turned, lightDir), 0.0);
  float occlusion = mix(0.55, 1.0, smoothstep(0.0, 12.0, depth));

  vec3 paint = texture(uPaint, rest).rgb;
  vec3 base = mix(uColor, paint, uPaintMix);
  vec3 color;
  if (uMaterial < 0.5) {
    vec3 env = studio(reflected, 0.04 + footprint * 0.6);
    float reflectance = 0.045 + 0.955 * fresnel;
    vec3 deep = base * base * 0.55;
    vec3 body = mix(deep, base * 1.08, wrap) * occlusion;
    body += base * pow(1.0 - facing, 2.0) * 0.18;
    color = body * (1.0 - reflectance) + tone(env * reflectance * 0.9);
  } else if (uMaterial < 1.5) {
    vec3 env = studio(reflected, footprint * 0.6);
    vec3 tint = mix(vec3(1.0), base, 0.6) * 0.92;
    vec3 reflectance = tint + (1.0 - tint) * fresnel;
    color = tone(env * reflectance * mix(0.55, 1.0, occlusion) * 1.1);
  } else if (uMaterial < 2.5) {
    vec3 env = studio(reflected, 0.03 + footprint * 0.6);
    float core = smoothstep(0.0, 1.0, facing);
    vec3 glow = mix(base * base * 0.35, min(base * 1.45 + 0.08, vec3(1.0)), core * core);
    vec3 body = glow * mix(0.7, 1.0, occlusion) + base * wrap * 0.18;
    float reflectance = 0.03 + 0.97 * fresnel;
    color = body * (1.0 - reflectance) + tone(env * reflectance * 0.85);
  } else {
    vec3 env = studio(reflected, 0.35 + footprint * 0.6);
    vec3 body = base * (0.3 + 0.7 * wrap) * mix(0.68, 1.0, occlusion);
    body += base * key * 0.12;
    color = body + tone(env * (0.012 + 0.18 * fresnel)) * 0.5;
  }
  float alpha = cover * smoothstep(0.0, 0.18, presence);
  outColor = vec4(color * alpha, alpha);
}`,Dt={balloon:0,chrome:1,jelly:2,clay:3},_t=720,Lt=5200,Qe=1/480,W=(u,d,_)=>Math.min(_,Math.max(d,u)),mt=(u,d,_)=>{let y=u.createShader(d);return y?(u.shaderSource(y,_),u.compileShader(y),u.getShaderParameter(y,u.COMPILE_STATUS)?y:(u.deleteShader(y),null)):null},ht=(u,d)=>{let _=mt(u,u.VERTEX_SHADER,Rt),y=mt(u,u.FRAGMENT_SHADER,d),x=u.createProgram();return!_||!y||!x?null:(u.attachShader(x,_),u.attachShader(x,y),u.bindAttribLocation(x,0,"aPosition"),u.bindAttribLocation(x,1,"aRest"),u.bindAttribLocation(x,2,"aStrain"),u.bindAttribLocation(x,3,"aDent"),u.linkProgram(x),u.deleteShader(_),u.deleteShader(y),u.getProgramParameter(x,u.LINK_STATUS)?x:(u.deleteProgram(x),null))},vt=(u,d,_)=>{let y={};for(let x of _)y[x]=u.getUniformLocation(d,x);return y},xt=(u,d,_,y,x)=>{let g=0;y[0]=0,x[0]=-1/0,x[1]=1/0;for(let w=1;w<d;w++){let X=(u[w]+w*w-(u[y[g]]+y[g]*y[g]))/(2*w-2*y[g]);for(;X<=x[g];)g--,X=(u[w]+w*w-(u[y[g]]+y[g]*y[g]))/(2*w-2*y[g]);g++,y[g]=w,x[g]=X,x[g+1]=1/0}g=0;for(let w=0;w<d;w++){for(;x[g+1]<w;)g++;_[w]=(w-y[g])*(w-y[g])+u[y[g]]}},yt=(u,d,_)=>{let y=Math.max(d,_),x=new Float64Array(y),g=new Float64Array(y),w=new Int32Array(y),X=new Float64Array(y+1);for(let P=0;P<d;P++){for(let A=0;A<_;A++)x[A]=u[A*d+P];xt(x,_,g,w,X);for(let A=0;A<_;A++)u[A*d+P]=g[A]}for(let P=0;P<_;P++){for(let A=0;A<d;A++)x[A]=u[P*d+A];xt(x,d,g,w,X);for(let A=0;A<d;A++)u[P*d+A]=Math.sqrt(g[A])}return u},Pt=(u,d,_)=>{let x=new Float64Array(d*_),g=new Int32Array(d*_);for(let R=0;R<d;R++){let v=-1;for(let f=0;f<_;f++){let M=f*d+R;u[M]&&(v=f),g[M]=v,x[M]=v>=0?(f-v)*(f-v):1e20}v=-1;for(let f=_-1;f>=0;f--){let M=f*d+R;u[M]&&(v=f),v>=0&&(v-f)*(v-f)<x[M]&&(x[M]=(v-f)*(v-f),g[M]=v)}}let w=new Float32Array(d*_),X=new Float64Array(d),P=new Int32Array(d),A=new Float64Array(d+1);for(let R=0;R<_;R++){for(let f=0;f<d;f++)X[f]=x[R*d+f];let v=0;P[0]=0,A[0]=-1/0,A[1]=1/0;for(let f=1;f<d;f++){let M=(X[f]+f*f-(X[P[v]]+P[v]*P[v]))/(2*f-2*P[v]);for(;M<=A[v];)v--,M=(X[f]+f*f-(X[P[v]]+P[v]*P[v]))/(2*f-2*P[v]);v++,P[v]=f,A[v]=M,A[v+1]=1/0}v=0;for(let f=0;f<d;f++){for(;A[v+1]<f;)v++;let M=P[v],O=g[R*d+M];w[R*d+f]=O>=0?u[O*d+M]:0}}return w},It=(u,d,_)=>{let y=[{width:d,height:_,mask:u}];for(;Math.max(y[y.length-1].width,y[y.length-1].height)>48;){let g=y[y.length-1],w=Math.ceil(g.width/2),X=Math.ceil(g.height/2),P=new Float32Array(w*X);for(let A=0;A<X;A++)for(let R=0;R<w;R++){let v=0,f=0;for(let M=0;M<2;M++)for(let O=0;O<2;O++){let q=R*2+O,ie=A*2+M;q<g.width&&ie<g.height&&(v+=g.mask[ie*g.width+q],f++)}P[A*w+R]=v/f}y.push({width:w,height:X,mask:P})}let x=null;for(let g=y.length-1;g>=0;g--){let{width:w,height:X,mask:P}=y[g],A=new Float32Array(w*X);if(x){let f=y[g+1].width,M=y[g+1].height;for(let O=0;O<X;O++)for(let q=0;q<w;q++){let ie=W((q+.5)/2-.5,0,f-1),ve=W((O+.5)/2-.5,0,M-1),fe=Math.floor(ie),ue=Math.floor(ve),Re=Math.min(f-1,fe+1),Se=Math.min(M-1,ue+1),de=ie-fe,pe=ve-ue,ne=x[ue*f+fe]*(1-de)+x[ue*f+Re]*de,Z=x[Se*f+fe]*(1-de)+x[Se*f+Re]*de;A[O*w+q]=ne*(1-pe)+Z*pe}}let R=4**g,v=g===y.length-1?300:60;for(let f=0;f<v;f++)for(let M=0;M<X;M++)for(let O=0;O<w;O++){let q=M*w+O;if(P[q]<.5){A[q]=0;continue}let ie=O>0?A[q-1]:0,ve=O<w-1?A[q+1]:0,fe=M>0?A[q-w]:0,ue=M<X-1?A[q+w]:0;A[q]+=((ie+ve+fe+ue+R)*.25-A[q])*1.85}x=A}return x},Ze=(u,d,_,y)=>{let x=Math.max(1,Math.round(y)),g=x/2.5,w=[],X=0;for(let R=-x;R<=x;R++){let v=Math.exp(-(R*R)/(2*g*g));w.push(v),X+=v}for(let R=0;R<w.length;R++)w[R]/=X;let P=new Float32Array(d*_),A=new Float32Array(d*_);for(let R=0;R<_;R++)for(let v=0;v<d;v++){let f=0;for(let M=-x;M<=x;M++)f+=u[R*d+W(v+M,0,d-1)]*w[M+x];P[R*d+v]=f}for(let R=0;R<_;R++)for(let v=0;v<d;v++){let f=0;for(let M=-x;M<=x;M++)f+=P[W(R+M,0,_-1)*d+v]*w[M+x];A[R*d+v]=f}return A},zt=({text:u="Squish",src:d="",fontFamily:_="system-ui, sans-serif",fontWeight:y=900,color:x="#3b5bff",imageColors:g=!0,material:w="balloon",inflate:X=1,stiffness:P=.5,wobble:A=.6,grabRadius:R=70,stretch:v=.5,press:f=.5,shadow:M=.5,intro:O=!0,theme:q="dark",dpr:ie,className:ve="",style:fe,...ue})=>{let Re=ye(null),Se=ye(null),de=ye(null),pe=ye(null),ne={text:String(u),src:String(d||""),fontFamily:String(_),fontWeight:y,color:String(x),imageColors:g,material:Dt[w]??0,inflate:W(X,.1,3),stiffness:W(P,0,1),wobble:W(A,0,1),grabRadius:W(R,10,400),stretch:W(v,0,1),press:W(f,0,1),shadow:W(M,0,1),intro:O,light:q==="light",dpr:ie},Z=ye(ne);Z.current=ne;let Pe=`${ne.text}|${ne.src}|${ne.fontFamily}|${ne.fontWeight}`,et=ye(Pe);return Ne(()=>{let ee=Re.current,ge=Se.current,e=ge?.getContext("webgl2",{alpha:!0,premultipliedAlpha:!0,antialias:!1,depth:!1,stencil:!1});if(!ee||!ge||!e)return;let Ie=ht(e,kt),ze=ht(e,St);if(!Ie||!ze)return;let K=vt(e,Ie,["uViewport","uOffset","uField","uPaint","uSlope","uColor","uPaintMix","uMaterial","uLight","uInflate","uTurn","uClock","uParts"]),me=vt(e,ze,["uViewport","uOffset","uField","uShadowColor","uShadow","uClock","uParts"]),Be=e.createTexture(),Ue=e.createTexture(),Xe=e.createTexture();for(let o of[Be,Ue,Xe])e.bindTexture(e.TEXTURE_2D,o),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,1,1,0,e.RGBA,e.UNSIGNED_BYTE,new Uint8Array(4));let Oe=e.createVertexArray(),qe=e.createBuffer(),Ge=e.createBuffer(),Ve=e.createBuffer();e.bindVertexArray(Oe),e.bindBuffer(e.ARRAY_BUFFER,qe),e.enableVertexAttribArray(1),e.vertexAttribPointer(1,2,e.FLOAT,!1,0,0),e.bindBuffer(e.ARRAY_BUFFER,Ge),e.enableVertexAttribArray(0),e.vertexAttribPointer(0,2,e.FLOAT,!1,36,0),e.enableVertexAttribArray(2),e.vertexAttribPointer(2,4,e.FLOAT,!1,36,8),e.enableVertexAttribArray(3),e.vertexAttribPointer(3,3,e.FLOAT,!1,36,24),e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,Ve),e.bindVertexArray(null);let ke=document.createElement("canvas").getContext("2d",{willReadFrequently:!0}),we=window.matchMedia?.("(prefers-reduced-motion: reduce)").matches??!1,Ae=new Float32Array(256),oe=new Float32Array([1,0,0,0,1,0,0,0,1]),s={cols:0,rows:0,spacing:1,count:0,indices:0,restX:new Float32Array(0),restY:new Float32Array(0),x:new Float32Array(0),y:new Float32Array(0),vx:new Float32Array(0),vy:new Float32Array(0),dent:new Float32Array(0),dentV:new Float32Array(0),grip:new Float32Array(0),gripX:new Float32Array(0),gripY:new Float32Array(0),active:new Uint8Array(0),neighbors:new Int32Array(0),dynamic:new Float32Array(0),anchorX:new Float32Array(0),anchorY:new Float32Array(0),indexType:e.UNSIGNED_SHORT,activeCount:0,width:1,height:1},t={width:1,height:1,ready:!1,fieldWidth:1,fieldHeight:1,fieldScale:1,sdf:new Float32Array(0),parts:[],clock:Z.current.intro&&!we?0:10,colorKey:"",color:[.31,.42,1],pointer:{x:0,y:0,inside:!1,down:!1,startX:0,startY:0,startTime:0,dragging:!1},hover:{x:0,y:0,vx:0,vy:0,power:0},turn:{x:0,y:0,vx:0,vy:0},accumulator:0,energy:1,buildToken:0},be=0,Me=0,Ce=!0,We=!0,He=0,gt=o=>{if(!ke||!o)return[.31,.42,1];ke.fillStyle="#000000",ke.fillStyle=/^[0-9a-f]{3,8}$/i.test(o)?`#${o}`:o,ke.fillRect(0,0,1,1);let[l,m,i]=ke.getImageData(0,0,1,1).data;return[l/255,m/255,i/255]},$e=(o,l)=>{let m=W(Math.round(o*t.fieldScale),0,t.fieldWidth-1),i=W(Math.round(l*t.fieldScale),0,t.fieldHeight-1);return t.sdf[i*t.fieldWidth+m]||-1e6},wt=()=>{let{width:o,height:l}=t,m=Math.max(7,Math.sqrt(o*l/Lt)),i=Math.ceil(o/m)+1,c=Math.ceil(l/m)+1,n=i*c,p=o/(i-1),z=l/(c-1);s.cols=i,s.rows=c,s.width=o,s.height=l,s.spacing=(p+z)/2,s.count=n,s.restX=new Float32Array(n),s.restY=new Float32Array(n),s.x=new Float32Array(n),s.y=new Float32Array(n),s.vx=new Float32Array(n),s.vy=new Float32Array(n),s.dent=new Float32Array(n),s.dentV=new Float32Array(n),s.grip=new Float32Array(n),s.gripX=new Float32Array(n),s.gripY=new Float32Array(n),s.active=new Uint8Array(n),s.dynamic=new Float32Array(n*9);let k=new Float32Array(n*2),D=-2.5*s.spacing;for(let T=0;T<c;T++)for(let F=0;F<i;F++){let b=T*i+F,N=F*p,G=T*z;s.restX[b]=N,s.restY[b]=G,s.x[b]=N,s.y[b]=G,k[b*2]=N/o,k[b*2+1]=G/l,s.active[b]=t.ready&&$e(N,G)>D?1:0}let L=new Int32Array(n*8).fill(-1),r=[[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[1,-1],[-1,1],[1,1]];for(let T=0;T<c;T++)for(let F=0;F<i;F++){let b=T*i+F;s.active[b]&&r.forEach(([N,G],ce)=>{let re=F+N,xe=T+G;if(re<0||xe<0||re>=i||xe>=c)return;let Te=xe*i+re;s.active[Te]&&(L[b*8+ce]=Te)})}s.neighbors=L,s.activeCount=s.active.reduce((T,F)=>T+F,0);let U=-(Math.min(o,l)*.14+s.spacing*3),S=new Uint8Array(n);for(let T=0;T<n;T++)S[T]=t.ready&&$e(s.restX[T],s.restY[T])>U?1:0;let B=[];for(let T=0;T<c-1;T++)for(let F=0;F<i-1;F++){let b=T*i+F,N=b+1,G=b+i,ce=G+1;(S[b]||S[N]||S[G]||S[ce])&&B.push(b,G,N,N,G,ce)}let I=n>65535?new Uint32Array(B):new Uint16Array(B);s.indexType=n>65535?e.UNSIGNED_INT:e.UNSIGNED_SHORT,s.indices=B.length,e.bindBuffer(e.ARRAY_BUFFER,qe),e.bufferData(e.ARRAY_BUFFER,k,e.STATIC_DRAW),e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,Ve),e.bufferData(e.ELEMENT_ARRAY_BUFFER,I,e.STATIC_DRAW),tt()},tt=()=>{let{cols:o,rows:l,x:m,y:i,dent:c,dynamic:n,spacing:p}=s,z=s.width/Math.max(1,o-1),k=s.height/Math.max(1,l-1);for(let D=0;D<l;D++)for(let L=0;L<o;L++){let r=D*o+L,U=L>0?r-1:r,S=L<o-1?r+1:r,B=D>0?r-o:r,I=D<l-1?r+o:r,T=(S-U)*z||p,F=(I-B)/o*k||p,b=r*9;n[b]=m[r],n[b+1]=i[r],n[b+2]=(m[S]-m[U])/T,n[b+3]=(i[S]-i[U])/T,n[b+4]=(m[I]-m[B])/F,n[b+5]=(i[I]-i[B])/F,n[b+6]=c[r],n[b+7]=(c[S]-c[U])/T,n[b+8]=(c[I]-c[B])/F}e.bindBuffer(e.ARRAY_BUFFER,Ge),e.bufferData(e.ARRAY_BUFFER,n,e.DYNAMIC_DRAW)},Ke=async()=>{let o=Z.current,l=++t.buildToken,{width:m,height:i}=t,c=Math.min(1,_t/Math.max(m,i)),n=Math.max(8,Math.round(m*c)),p=Math.max(8,Math.round(i*c)),z=document.createElement("canvas");z.width=n,z.height=p;let k=z.getContext("2d",{willReadFrequently:!0});if(!k)return;let D=!1;if(o.src){let a=new Image;a.crossOrigin="anonymous",a.decoding="async",a.src=o.src;try{await a.decode()}catch{return}if(l!==t.buildToken)return;let E=Math.min(n*.78/a.naturalWidth,p*.74/a.naturalHeight),H=a.naturalWidth*E,Y=a.naturalHeight*E;k.drawImage(a,(n-H)/2,(p-Y)/2,H,Y),D=!0}else{let a=o.fontFamily,E=o.fontWeight;if(document.fonts&&await document.fonts.load(`${E} 100px ${a}`).catch(()=>null),l!==t.buildToken)return;let H=o.text.split(`
`);k.font=`${E} 100px ${a}`;let Y=1,h=0,j=0;for(let J of H){let V=k.measureText(J||" ");Y=Math.max(Y,V.actualBoundingBoxLeft+V.actualBoundingBoxRight),h=Math.max(h,V.actualBoundingBoxAscent),j=Math.max(j,V.actualBoundingBoxDescent)}let le=100*1.02,C=h+j+le*(H.length-1),$=Math.min(n*.8/Y,p*.7/C)*100;k.font=`${E} ${$}px ${a}`,k.fillStyle="#ffffff",k.textAlign="center",k.textBaseline="alphabetic";let te=$/100,Je=(p-C*te)/2+h*te;H.forEach((J,V)=>{let ae=k.measureText(J||" "),Ft=(ae.actualBoundingBoxLeft-ae.actualBoundingBoxRight)/2;k.fillText(J,n/2+Ft,Je+V*le*te)}),D=!0}if(!D||l!==t.buildToken)return;let L=k.getImageData(0,0,n,p).data,r=n*p,U=new Float32Array(r),S=new Float64Array(r),B=new Float64Array(r);for(let a=0;a<r;a++){let E=L[a*4+3]/255;U[a]=E,S[a]=E>.5?1e10:0,B[a]=E>.5?0:1e10}yt(S,n,p),yt(B,n,p);let I=new Float32Array(r),T=new Float32Array(r);for(let a=0;a<r;a++)I[a]=U[a]>.5?1:0,T[a]=U[a]>.02&&U[a]<.98?U[a]-.5:S[a]>0?S[a]-.5:.5-B[a];let F=new Int32Array(r),b=[],N=new Int32Array(r);for(let a=0;a<r;a++){if(!I[a]||F[a])continue;let E=b.length+1,H=0,Y=0,h=0,j=0,le=1/0;for(N[Y++]=a,F[a]=E;H<Y;){let C=N[H++],$=C%n,te=(C-$)/n;h+=$,j+=te,$<le&&(le=$),$>0&&I[C-1]&&!F[C-1]&&(F[C-1]=E,N[Y++]=C-1),$<n-1&&I[C+1]&&!F[C+1]&&(F[C+1]=E,N[Y++]=C+1),te>0&&I[C-n]&&!F[C-n]&&(F[C-n]=E,N[Y++]=C-n),te<p-1&&I[C+n]&&!F[C+n]&&(F[C+n]=E,N[Y++]=C+n)}b.push({x:h/Y/c,y:j/Y/c,left:le,size:Y,delay:0})}let G=[...b].sort((a,E)=>a.left-E.left),ce=G.length>1?Math.min(.07,.5/(G.length-1)):0;G.forEach((a,E)=>{a.delay=E*ce});let re=b.length<=64?Pt(F,n,p):new Float32Array(r),xe=Ze(It(I,n,p),n,p,2),Te=Ze(T,n,p,2),De=Ze(I,n,p,Math.max(4,Math.min(n,p)*.045)),he=new Float32Array(r*4),_e=new Float32Array(r),Q=new Float32Array(r);for(let a=0;a<r;a++){let E=Te[a]/c;_e[a]=E,Q[a]=Math.sqrt(Math.max(0,2*xe[a]))/c,he[a*4]=Q[a],he[a*4+1]=E,he[a*4+2]=De[a],he[a*4+3]=re[a]}let Ee=new Float32Array(r*2);for(let a=0;a<p;a++)for(let E=0;E<n;E++){let H=a*n+E,Y=(Q[a*n+Math.min(n-1,E+1)]-Q[a*n+Math.max(0,E-1)])*.5*c,h=(Q[Math.min(p-1,a+1)*n+E]-Q[Math.max(0,a-1)*n+E])*.5*c,j=Math.hypot(Y,h);j>7&&(Y*=7/j,h*=7/j),Ee[H*2]=Y,Ee[H*2+1]=h}e.bindTexture(e.TEXTURE_2D,Be),e.texImage2D(e.TEXTURE_2D,0,e.RGBA16F,n,p,0,e.RGBA,e.FLOAT,he),e.bindTexture(e.TEXTURE_2D,Xe),e.texImage2D(e.TEXTURE_2D,0,e.RG16F,n,p,0,e.RG,e.FLOAT,Ee),e.bindTexture(e.TEXTURE_2D,Ue),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,e.RGBA,e.UNSIGNED_BYTE,z),t.fieldWidth=n,t.fieldHeight=p,t.fieldScale=c,t.sdf=_e,t.parts=b,Ae.fill(0),b.slice(0,64).forEach((a,E)=>{Ae[E*4]=a.x/m,Ae[E*4+1]=a.y/i,Ae[E*4+2]=a.delay}),t.ready=!0,wt(),se()},At=(o,l)=>{let{count:m,x:i,y:c,vx:n,vy:p,restX:z,restY:k,dent:D,dentV:L,active:r,neighbors:U,grip:S,gripX:B,gripY:I,spacing:T}=s,F=.4+l.stiffness*1.2,b=350*F*F,N=b*(52/Math.sqrt(F)/T)**2,G=we?.8:.5-l.wobble*.42,ce=2*G*Math.sqrt(b),re=b*1.4,xe=re*(18/T)**2,Te=2*(G+.06)*Math.sqrt(re),De=b*30,he=1.2*Math.sqrt(De),_e=t.pointer.dragging?0:10,Q=t.hover,Ee=l.grabRadius*.32,a=1/(2*Ee*Ee),E=Q.power*l.press,H=t.pointer.dragging?1.6:1,Y=0;for(let h=0;h<m;h++){if(!r[h])continue;let j=i[h]-z[h],le=c[h]-k[h],C=-b*j-ce*n[h],$=-b*le-ce*p[h],te=-re*D[h]-Te*L[h],Je=h*8;for(let J=0;J<8;J++){let V=U[Je+J];if(V<0)continue;let ae=J<4?1:.5;C+=N*ae*(i[V]-z[V]-j),$+=N*ae*(c[V]-k[V]-le),te+=xe*ae*(D[V]-D[h])}if(E>.001){let J=i[h]-Q.x,V=c[h]-Q.y,ae=Math.exp(-(J*J+V*V)*a);te+=re*2.6*H*E*ae,C+=(b*.3*J+_e*Q.vx)*E*ae,$+=(b*.3*V+_e*Q.vy)*E*ae}S[h]>0&&(C+=S[h]*(De*(B[h]-i[h])-he*n[h]),$+=S[h]*(De*(I[h]-c[h])-he*p[h])),n[h]+=C*o,p[h]+=$*o,L[h]+=te*o,Y+=Math.abs(n[h])+Math.abs(p[h])+Math.abs(L[h])*T}for(let h=0;h<m;h++)r[h]&&(i[h]+=n[h]*o,c[h]+=p[h]*o,D[h]=W(D[h]+L[h]*o,-.6,.85));return Y},bt=o=>{let{pointer:l}=t,{count:m,grip:i,gripX:c,gripY:n}=s;if(!l.dragging)return;let p=Math.max(20,Math.min(t.width,t.height)*(.08+o.stretch*.32)),z=l.x-l.startX,k=l.y-l.startY,D=Math.hypot(z,k),L=D>0?p*Math.tanh(D/p)/D:0;for(let r=0;r<m;r++)i[r]<=0||(c[r]=s.anchorX[r]+z*L,n[r]=s.anchorY[r]+k*L)},Mt=(o,l,m)=>{let{count:i,x:c,y:n,grip:p,active:z}=s,k=m.grabRadius*.3,D=1/(2*k*k);s.anchorX=new Float32Array(i),s.anchorY=new Float32Array(i);let L=0;for(let r=0;r<i;r++){if(!z[r])continue;let U=c[r]-o,S=n[r]-l,B=Math.exp(-(U*U+S*S)*D);p[r]=B>.03?B:0,s.anchorX[r]=c[r],s.anchorY[r]=n[r],L+=p[r]}return L>0},Tt=()=>{s.grip.fill(0),t.pointer.dragging=!1},Et=(o,l,m)=>{let{count:i,x:c,y:n,vx:p,vy:z,dentV:k,active:D}=s,L=m.grabRadius,r=1/(2*L*L),U=.4+m.press;for(let S=0;S<i;S++){if(!D[S])continue;let B=c[S]-o,I=n[S]-l,T=Math.exp(-(B*B+I*I)*r);k[S]+=9*U*T,p[S]+=B*9*U*T,z[S]+=I*9*U*T}},nt=(o,l)=>{let{cols:m,rows:i,x:c,y:n,active:p,spacing:z}=s,k=1/0,D=-1,L=Math.ceil(80/z),r=W(Math.round(o/(s.width/Math.max(1,m-1))),0,m-1),U=W(Math.round(l/(s.height/Math.max(1,i-1))),0,i-1);for(let S=Math.max(0,U-L);S<=Math.min(i-1,U+L);S++)for(let B=Math.max(0,r-L);B<=Math.min(m-1,r+L);B++){let I=S*m+B;if(!p[I])continue;let T=Math.hypot(c[I]-o,n[I]-l);T<k&&(k=T,D=I)}return D<0?!1:$e(s.restX[D]+(o-c[D]),s.restY[D]+(l-n[D]))>-4},ot=()=>{let o=Z.current,l=Math.max(1,ee.clientWidth),m=Math.max(1,ee.clientHeight),i=Math.min(o.dpr||window.devicePixelRatio||1,2);if(ge.width=Math.max(1,Math.round(l*i)),ge.height=Math.max(1,Math.round(m*i)),l!==t.width||m!==t.height){let c=!t.ready&&!t.buildToken;t.width=l,t.height=m,window.clearTimeout(He),c?Ke():He=window.setTimeout(Ke,160)}se()},rt=()=>{let o=Z.current,l=o.color;if(l!==t.colorKey&&(t.colorKey=l,t.color=gt(o.color)),e.viewport(0,0,ge.width,ge.height),e.clearColor(0,0,0,0),e.clear(e.COLOR_BUFFER_BIT),!t.ready||!s.indices)return;if(e.enable(e.BLEND),e.blendFunc(e.ONE,e.ONE_MINUS_SRC_ALPHA),e.bindVertexArray(Oe),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,Be),e.activeTexture(e.TEXTURE1),e.bindTexture(e.TEXTURE_2D,Ue),e.activeTexture(e.TEXTURE2),e.bindTexture(e.TEXTURE_2D,Xe),o.shadow>0){e.useProgram(ze),e.uniform2f(me.uViewport,s.width,s.height);let k=Math.min(s.width,s.height)*.035*o.inflate;e.uniform2f(me.uOffset,k*.25,k),e.uniform1i(me.uField,0),o.light?e.uniform3f(me.uShadowColor,.08,.08,.14):e.uniform3f(me.uShadowColor,0,0,0),e.uniform1f(me.uShadow,o.shadow*(o.light?.35:.7)),e.uniform1f(me.uClock,t.clock),e.uniform4fv(me.uParts,Ae),e.drawElements(e.TRIANGLES,s.indices,s.indexType,0)}e.useProgram(Ie),e.uniform2f(K.uViewport,s.width,s.height),e.uniform2f(K.uOffset,0,0),e.uniform1i(K.uField,0),e.uniform1i(K.uPaint,1),e.uniform1i(K.uSlope,2);let m=t.turn.x,i=t.turn.y,c=Math.cos(m),n=Math.sin(m),p=Math.cos(i),z=Math.sin(i);oe[0]=c,oe[1]=n*z,oe[2]=-n*p,oe[3]=0,oe[4]=p,oe[5]=z,oe[6]=n,oe[7]=-c*z,oe[8]=c*p,e.uniformMatrix3fv(K.uTurn,!1,oe),e.uniform3f(K.uColor,t.color[0],t.color[1],t.color[2]),e.uniform1f(K.uPaintMix,o.src&&o.imageColors?1:0),e.uniform1f(K.uMaterial,o.material),e.uniform1f(K.uLight,o.light?1:0),e.uniform1f(K.uInflate,o.inflate),e.uniform1f(K.uClock,t.clock),e.uniform4fv(K.uParts,Ae),e.drawElements(e.TRIANGLES,s.indices,s.indexType,0),e.bindVertexArray(null)},at=o=>{if(be=0,!We||!Ce||document.hidden)return;let l=Z.current,m=Me?Math.min(.05,(o-Me)/1e3):1/60;Me=o,we||!l.intro?t.clock=10:t.ready&&t.clock<10&&(t.clock=t.clock+m>1.8?10:t.clock+m);let i=t.hover,c=t.pointer,n=t.ready&&(c.dragging||c.inside&&!c.down&&nt(c.x,c.y)),p=1-Math.exp(-m/.05),z=i.x+(c.x-i.x)*p,k=i.y+(c.y-i.y)*p,D=1-Math.exp(-m/.04);i.vx+=((z-i.x)/Math.max(m,.001)-i.vx)*D,i.vy+=((k-i.y)/Math.max(m,.001)-i.vy)*D,i.x=z,i.y=k;let L=n?1:0;i.power+=(L-i.power)*(1-Math.exp(-m/(n?.12:.25)));let r=t.turn,U=c.inside&&!we?(c.x/Math.max(1,s.width)-.5)*.7:0,S=c.inside&&!we?(c.y/Math.max(1,s.height)-.5)*.4:0;r.vx+=(28*(U-r.x)-10*r.vx)*m,r.vy+=(28*(S-r.y)-10*r.vy)*m,r.x+=r.vx*m,r.y+=r.vy*m;let B=Math.abs(U-r.x)>5e-4||Math.abs(S-r.y)>5e-4||Math.abs(r.vx)>.001||Math.abs(r.vy)>.001,I=0;if(t.ready){bt(l),t.accumulator+=m;let F=0;for(;t.accumulator>=Qe&&F<40;)I=At(Qe,l),t.accumulator-=Qe,F++;F===40&&(t.accumulator=0),tt()}t.energy=I,rt(),!t.ready||t.clock<10||Math.abs(L-i.power)>.002||B||Math.hypot(c.x-i.x,c.y-i.y)>.1||c.dragging||I>.05*Math.max(1,s.activeCount)?be=requestAnimationFrame(at):Me=0},se=()=>{!be&&We&&Ce&&!document.hidden&&(be=requestAnimationFrame(at))},je=o=>{let l=ee.getBoundingClientRect();t.pointer.x=o.clientX-l.left,t.pointer.y=o.clientY-l.top,t.pointer.inside=t.pointer.x>=0&&t.pointer.y>=0&&t.pointer.x<=l.width&&t.pointer.y<=l.height},it=o=>{je(o),se()},st=o=>{if(je(o),!t.ready||!nt(t.pointer.x,t.pointer.y))return;let l=Z.current;t.pointer.down=!0,t.pointer.startX=t.pointer.x,t.pointer.startY=t.pointer.y,t.pointer.startTime=performance.now(),t.pointer.dragging=Mt(t.pointer.x,t.pointer.y,l),ee.setPointerCapture?.(o.pointerId),se()},Ye=o=>{if(!t.pointer.down)return;je(o);let l=Z.current,m=Math.hypot(t.pointer.x-t.pointer.startX,t.pointer.y-t.pointer.startY),i=performance.now()-t.pointer.startTime<260;Tt(),m<8&&i&&Et(t.pointer.x,t.pointer.y,l),t.pointer.down=!1,se()},ct=()=>{t.pointer.inside=!1,se()},lt=()=>{Me=0,se()},ft=new ResizeObserver(ot);ft.observe(ee);let ut=new IntersectionObserver(o=>{Ce=o.some(l=>l.isIntersecting),Ce&&(Me=0,se())});return ut.observe(ee),ee.addEventListener("pointerdown",st),window.addEventListener("pointermove",it,{passive:!0}),window.addEventListener("pointerup",Ye),window.addEventListener("pointercancel",Ye),ee.addEventListener("pointerleave",ct),document.addEventListener("visibilitychange",lt),ot(),pe.current=()=>{t.ready=!1,t.clock=Z.current.intro&&!we?0:10,Ke()},de.current=()=>{be||rt(),se()},()=>{We=!1,t.buildToken++,cancelAnimationFrame(be),window.clearTimeout(He),de.current=null,pe.current=null,ft.disconnect(),ut.disconnect(),ee.removeEventListener("pointerdown",st),window.removeEventListener("pointermove",it),window.removeEventListener("pointerup",Ye),window.removeEventListener("pointercancel",Ye),ee.removeEventListener("pointerleave",ct),document.removeEventListener("visibilitychange",lt),e.deleteBuffer(qe),e.deleteBuffer(Ge),e.deleteBuffer(Ve),e.deleteVertexArray(Oe),e.deleteTexture(Be),e.deleteTexture(Ue),e.deleteTexture(Xe),e.deleteProgram(Ie),e.deleteProgram(ze)}},[]),Ne(()=>{et.current!==Pe&&(et.current=Pe,pe.current?.())},[Pe]),Ne(()=>{de.current?.()}),Le("div",{ref:Re,className:`elastic-mesh${ve?` ${ve}`:""}`,style:fe,role:"img","aria-label":ne.src?"Elastic logo":ne.text,...ue,children:Le("canvas",{ref:Se,className:"elastic-mesh-canvas","aria-hidden":"true"})})},pt=zt;var Fe=document.getElementById("elastic-mesh-root");if(Fe){let u=new MutationObserver(()=>{let d=Fe.querySelector("canvas");d&&d.getContext("webgl2")&&(Fe.dataset.mounted="true",u.disconnect())});u.observe(Fe,{childList:!0,subtree:!0}),window.setTimeout(()=>{Fe.querySelector("canvas")||u.disconnect()},1600),dt(Le(pt,{text:"404",material:"balloon",color:"#ffd400",inflate:1.15,stiffness:.45,wobble:.65,grabRadius:80,stretch:.5,press:.55,shadow:.45,intro:!0,theme:"dark",fontFamily:"'Barlow Condensed', 'Arial Narrow', sans-serif",fontWeight:900,className:"error-mesh",style:{position:"absolute",inset:0}}),Fe)}
