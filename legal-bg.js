import{a as lo}from"./island-chunks/chunk-J4ROVTEG.js";import"./island-chunks/chunk-XKFHMPKF.js";import{g as Ot,i as co,j as st,l as _e,p as De}from"./island-chunks/chunk-CANNF34S.js";var so=50,Je=20,to=1.5,et=16,Et=12,uo=.01,fo={satin:{roughness:.42,metalness:0,coat:.35,coatRoughness:.22,scatter:1,frost:0},matte:{roughness:.92,metalness:0,coat:0,coatRoughness:.5,scatter:.5,frost:0},gloss:{roughness:.2,metalness:0,coat:1,coatRoughness:.08,scatter:1,frost:0},frosted:{roughness:.55,metalness:0,coat:.6,coatRoughness:.18,scatter:1.5,frost:1},metal:{roughness:.3,metalness:1,coat:0,coatRoughness:.2,scatter:0,frost:0}},bo=`#version 300 es
precision highp float;
layout(location = 0) in vec2 aCorner;
layout(location = 1) in vec4 aSphere;
layout(location = 2) in vec4 aColor;
layout(location = 3) in vec4 aShade;
uniform mat4 uProj;
uniform float uCameraZ;
uniform float uPixel;
out vec3 vPoint;
flat out vec3 vCenter;
flat out float vRadius;
flat out vec4 vColor;
flat out vec4 vShade;
void main() {
  vec3 c = vec3(aSphere.xy, aSphere.z - uCameraZ);
  float r = aSphere.w;
  float d = length(c);
  vec3 toCamera = -c / d;
  vec3 right = normalize(cross(vec3(0.0, 1.0, 0.0), toCamera));
  vec3 up = cross(toCamera, right);
  float reach = r * d / sqrt(max(d * d - r * r, 1e-4)) + uPixel * d * 2.0;
  vec3 p = c + (right * aCorner.x + up * aCorner.y) * reach;
  vPoint = p;
  vCenter = c;
  vRadius = r;
  vColor = aColor;
  vShade = aShade;
  gl_Position = uProj * vec4(p, 1.0);
}`,Fo=`#version 300 es
precision highp float;
in vec3 vPoint;
flat in vec3 vCenter;
flat in float vRadius;
flat in vec4 vColor;
flat in vec4 vShade;
uniform mat4 uProj;
uniform vec3 uLightPos;
uniform vec3 uLight;
uniform float uExposure;
uniform float uShadow;
uniform vec4 uSurface;
uniform vec2 uExtra;
out vec4 outColor;

const float PI = 3.14159265;

float lobe(vec3 d, vec3 axis, float sharp) {
  return pow(max(dot(d, axis), 0.0), sharp) * (sharp + 1.0) * 0.16;
}

vec3 studio(vec3 d, float rough) {
  float r = clamp(rough, 0.0, 1.0);
  float sharp = mix(60.0, 1.2, sqrt(r));
  vec3 col = mix(vec3(0.085, 0.085, 0.09), vec3(0.38, 0.38, 0.39), smoothstep(-0.7, 0.9, d.y));
  col += vec3(1.0, 0.99, 0.97) * 2.6 * lobe(d, normalize(vec3(-0.42, 0.78, 0.47)), sharp);
  col += vec3(0.97, 0.98, 1.0) * 1.1 * lobe(d, normalize(vec3(0.78, 0.22, 0.58)), sharp * 0.7);
  col += vec3(1.0) * 1.3 * lobe(d, normalize(vec3(0.15, 0.55, -0.82)), sharp * 0.8);
  return col;
}

vec2 envBRDF(float NoV, float rough) {
  vec4 c0 = vec4(-1.0, -0.0275, -0.572, 0.022);
  vec4 c1 = vec4(1.0, 0.0425, 1.04, -0.04);
  vec4 r = rough * c0 + c1;
  float a = min(r.x * r.x, exp2(-9.28 * NoV)) * r.x + r.y;
  return vec2(-1.04, 1.04) * a + r.zw;
}

float ggx(float NoH, float a) {
  float a2 = a * a;
  float d = NoH * NoH * (a2 - 1.0) + 1.0;
  return a2 / (PI * d * d);
}

float smith(float NoV, float NoL, float a) {
  float k = a * 0.5;
  return 0.25 / max((NoV * (1.0 - k) + k) * (NoL * (1.0 - k) + k), 1e-4);
}

vec3 aces(vec3 x) {
  return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0);
}

void main() {
  vec3 rd = normalize(vPoint);
  float b = dot(vCenter, rd);
  float h = length(vCenter - rd * b);
  float r = vRadius;
  float aa = max(fwidth(h), 1e-5);
  float cover = clamp((r - h) / aa + 0.5, 0.0, 1.0);
  if (cover <= 0.002) discard;
  float hc = min(h, r * 0.9995);
  float t = b - sqrt(r * r - hc * hc);
  vec3 pos = rd * t;
  vec3 n = normalize(pos - vCenter);
  vec4 clip = uProj * vec4(pos, 1.0);
  gl_FragDepth = clamp(clip.z / clip.w * 0.5 + 0.5, 0.0, 1.0);

  vec3 v = -rd;
  vec3 albedo = vColor.rgb;
  bool lamp = vColor.a > 0.5;
  vec3 dn = fwidth(n);
  float rough = sqrt(min(uSurface.x * uSurface.x + dot(dn, dn) * 0.6, 1.0));
  float metal = uSurface.y;
  float coat = uSurface.z;
  float coatRough = sqrt(min(uSurface.w * uSurface.w + dot(dn, dn) * 0.6, 1.0));
  float NoV = clamp(dot(n, v), 1e-4, 1.0);
  vec3 R = reflect(-v, n);

  float occlusion = vShade.w * smoothstep(-0.15, 0.9, dot(n, vShade.xyz));
  float ao = 1.0 - uShadow * occlusion;
  float specAo = 1.0 - uShadow * occlusion * 0.7;

  vec3 L = uLightPos - pos;
  float dist2 = dot(L, L);
  L *= inversesqrt(dist2);
  vec3 radiance = lamp ? vec3(0.0) : uLight / (dist2 + 1.0);
  float NoL = clamp(dot(n, L), 0.0, 1.0);
  vec3 H = normalize(L + v);
  float NoH = clamp(dot(n, H), 0.0, 1.0);
  float VoH = clamp(dot(v, H), 0.0, 1.0);

  vec3 F0 = mix(vec3(0.04), albedo, metal);
  vec2 ab = envBRDF(NoV, rough);
  vec3 Fr = max(vec3(1.0 - rough), F0) - F0;
  vec3 kS = F0 + Fr * pow(1.0 - NoV, 5.0);
  vec3 diffuseColor = albedo * (1.0 - metal);
  vec3 irradiance = studio(n, 1.0) * 1.15;
  vec3 envSpec = studio(R, rough) * (F0 * ab.x + ab.y);
  vec3 col = diffuseColor * irradiance * (1.0 - kS) * ao + envSpec * specAo;
  vec3 F = F0 + (1.0 - F0) * pow(1.0 - VoH, 5.0);
  float a = max(rough * rough, 0.06);
  vec3 spec = ggx(NoH, a) * smith(NoV, NoL, a) * F;
  float wrap = clamp((dot(n, L) + 0.3) / 1.3, 0.0, 1.0);
  col += (diffuseColor * (1.0 - F) / PI * wrap + spec * NoL) * radiance;
  vec3 sh = normalize(L + n * 0.1);
  float scatter = pow(clamp(dot(v, -sh), 0.0, 1.0), 2.0) * 10.0 + 0.04;
  col += scatter * albedo * radiance * 0.03 * uExtra.x;
  float alpha = 1.0;
  if (uExtra.y > 0.5) {
    float rim = pow(1.0 - NoV, 2.5);
    col += albedo * (studio(-R, 1.0) * 0.35 + 0.06) * (1.0 - rim);
    col += radiance * albedo * pow(max(dot(-v, L), 0.0), 3.0) * 0.08;
    alpha = mix(0.5, 0.96, rim);
  }
  if (coat > 0.0) {
    float Fc = 0.04 + 0.96 * pow(1.0 - NoV, 5.0);
    float ca = max(coatRough * coatRough, 0.03);
    vec3 coatEnv = studio(R, coatRough) * Fc;
    float coatSpec = ggx(NoH, ca) * smith(NoV, NoL, ca) * (0.04 + 0.96 * pow(1.0 - VoH, 5.0)) * NoL;
    col = col * (1.0 - Fc * coat) + (coatEnv * specAo + radiance * coatSpec) * coat;
    alpha = mix(alpha, 1.0, Fc * coat);
  }
  if (lamp) col += uLight * 0.0025 * (0.4 + 0.6 * albedo);
  col = aces(col * uExposure);
  col = pow(col, vec3(1.0 / 2.2));
  col += (fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) / 255.0;
  float a2 = alpha * cover;
  outColor = vec4(col * a2, a2);
}`,ye=(l,x,p)=>Math.min(p,Math.max(x,l)),ho=(l,x,p)=>{let d=l.createShader(x);return d?(l.shaderSource(d,p),l.compileShader(d),l.getShaderParameter(d,l.COMPILE_STATUS)?d:(l.deleteShader(d),null)):null},Ro=l=>{let x=ho(l,l.VERTEX_SHADER,bo),p=ho(l,l.FRAGMENT_SHADER,Fo),d=l.createProgram();if(!x||!p||!d)return null;if(l.attachShader(d,x),l.attachShader(d,p),l.linkProgram(d),l.deleteShader(x),l.deleteShader(p),!l.getProgramParameter(d,l.LINK_STATUS))return l.deleteProgram(d),null;let A={},k=l.getProgramParameter(d,l.ACTIVE_UNIFORMS);for(let J=0;J<k;J++){let ce=l.getActiveUniform(d,J);ce&&(A[ce.name]=l.getUniformLocation(d,ce.name))}return{program:d,uniforms:A}},mo=l=>{let x;if(typeof l=="number")x=[(l>>16&255)/255,(l>>8&255)/255,(l&255)/255];else{let p=String(l||"#ffffff").replace("#","").trim();(p.length===3||p.length===4)&&(p=p.slice(0,3).split("").map(A=>A+A).join(""));let d=parseInt(p.slice(0,6),16);x=Number.isNaN(d)?[1,1,1]:[(d>>16&255)/255,(d>>8&255)/255,(d&255)/255]}return x.map(p=>Math.pow(p,2.2))},So=({count:l=200,colors:x=["#ffffff"],material:p="satin",minSize:d=.5,maxSize:A=1,gravity:k=.5,friction:J=.9975,wallBounce:ce=.95,bounce:de=.85,depth:le=2,drift:fe=0,followCursor:me=!0,cursorSize:we=1,grab:Ue=!0,clickEffect:Wt="burst",lightColor:jt="#ffffff",lightIntensity:ft=1,exposure:Zt=1,shadows:Tt=.6,intro:$t=!0,dpr:Yt,className:Kt="",style:Qt})=>{let At=_e(null),Ct=_e(null),ht=_e(null),Lt={count:Math.round(ye(l,1,4e3)),colors:Array.isArray(x)&&x.length?x:["#ffffff"],material:fo[p]?p:"satin",minSize:Math.max(.05,Math.min(d,A)),maxSize:Math.max(.05,Math.max(d,A)),gravity:k,friction:ye(J,.5,1),wallBounce:ye(ce,0,1),bounce:ye(de,0,1),depth:Math.max(0,le),drift:Math.max(0,fe),followCursor:me,cursorSize:Math.max(0,we),grab:Ue,clickEffect:Wt,lightColor:jt,lightIntensity:ft>20?ft/200:Math.max(0,ft),exposure:Math.max(0,Zt),shadows:ye(Tt,0,1),intro:$t,dpr:Yt},Ce=_e(Lt);return Ce.current=Lt,st(()=>{let Be=At.current,Ne=Ct.current,g=Ne?.getContext("webgl2",{alpha:!0,premultipliedAlpha:!0,antialias:!1,depth:!0,stencil:!1,powerPreference:"high-performance"});if(!Be||!Ne||!g)return;let je=Ro(g);if(!je)return;let Me=je.uniforms,Ve=window.matchMedia?.("(prefers-reduced-motion: reduce)").matches??!1,F={width:1,height:1,ratio:1,halfW:9,halfH:9,fit:1,tan:Math.tan(so*Math.PI/360)},Ie=new Float32Array(16),nt=g.createVertexArray();g.bindVertexArray(nt);let ve=g.createBuffer();g.bindBuffer(g.ARRAY_BUFFER,ve),g.bufferData(g.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),g.STATIC_DRAW),g.enableVertexAttribArray(0),g.vertexAttribPointer(0,2,g.FLOAT,!1,0,0);let Se=g.createBuffer();g.bindBuffer(g.ARRAY_BUFFER,Se);for(let t=0;t<3;t++)g.enableVertexAttribArray(1+t),g.vertexAttribPointer(1+t,4,g.FLOAT,!1,Et*4,t*16),g.vertexAttribDivisor(1+t,1);g.bindVertexArray(null);let re=0,Y=0,e=new Float32Array(0),I=new Float32Array(0),O=new Float32Array(0),z=new Float32Array(0),_=new Float32Array(0),B=new Float32Array(0),X=new Float32Array(0),ge=new Float32Array(0),Le=new Float32Array(0),Ze=new Float32Array(0),ee=new Float32Array(0),Te=new Float32Array(0),$e=new Uint16Array(0),he=new Uint8Array(0),Xe=new Int32Array(0),Ye=new Int32Array(0),pe=new Int32Array(1),G=new Float32Array(Et),oe=new Int32Array(2),ke=new Int32Array(2),V=[],He="",Pt="",Ee=t=>{let i=(o,f=1)=>{let h=new Float32Array(t*f);return h.set(o.subarray(0,Math.min(o.length,h.length))),h},s=o=>{let f=new Uint8Array(t);return f.set(o.subarray(0,Math.min(o.length,f.length))),f};e=i(e),I=i(I),O=i(O),z=i(z),_=i(_),B=i(B),X=i(X),ge=i(ge),Le=i(Le),Ze=i(Ze),ee=i(ee,4),Te=i(Te,3);let u=new Uint16Array(t);u.set($e.subarray(0,Math.min($e.length,t))),$e=u,he=s(he),Xe=new Int32Array(t),Ye=new Int32Array(t),pe=new Int32Array(t+1),G=new Float32Array((t+1)*Et),re=t,g.bindBuffer(g.ARRAY_BUFFER,Se),g.bufferData(g.ARRAY_BUFFER,G.byteLength,g.DYNAMIC_DRAW)},j={x:0,y:0,inside:!1,down:!1,downX:0,downY:0,downAt:0,moved:!1},R={x:0,y:0,z:0,r:0,tx:0,ty:0,vx:0,vy:0},K={x:0,y:5,z:6,flash:0},L={index:-1,ox:0,oy:0,tx:0,ty:0,vx:0,vy:0},ne=0,Oe=0,se=0,xe=0,ie=!0,N=0,a=(t,i,s)=>{let u=X[t],o=Math.max(i.depth-u,0);if(he[t]=1,s&&i.gravity>.05)e[t]=(Math.random()*2-1)*Math.max(F.halfW-u,.01),I[t]=F.halfH+u+Math.random()*F.halfH*2.2,O[t]=(Math.random()*2-1)*o,z[t]=(Math.random()-.5)*2,_[t]=-(4+Math.random()*5),B[t]=0,he[t]=0;else if(s){let f=(Math.random()*2-1)*Math.max(F.halfW-u,.01),h=(Math.random()*2-1)*Math.max(F.halfH-u,.01),y=(Math.random()*2-1)*o;e[t]=(Math.random()*2-1)*.6,I[t]=(Math.random()*2-1)*.6,O[t]=(Math.random()*2-1)*Math.min(o,.3),z[t]=(f-e[t])*2.2,_[t]=(h-I[t])*2.2,B[t]=(y-O[t])*2.2,Oe=1}else e[t]=(Math.random()*2-1)*Math.max(F.halfW-u,.01),I[t]=(Math.random()*2-1)*Math.max(F.halfH-u,.01),O[t]=(Math.random()*2-1)*o,z[t]=0,_[t]=0,B[t]=0},Ke=t=>{for(let i=0;i<Y;i++)X[i]=(t.minSize+Le[i]*(t.maxSize-t.minSize))*F.fit,ge[i]=1/(X[i]*X[i]*X[i])},at=t=>{V=t.colors.map(mo),He=t.colors.join("|")},Qe=(t,i)=>{let s=`${t.minSize}:${t.maxSize}:${F.fit}`;if(t.count!==Y){t.count>re&&Ee(Math.max(t.count,Math.ceil(re*1.5)));let u=Y;Y=t.count;for(let o=u;o<Y;o++)Le[o]=Math.random(),$e[o]=o,Ze[o]=Math.random()*Math.PI*2,X[o]=(t.minSize+Le[o]*(t.maxSize-t.minSize))*F.fit,ge[o]=1/(X[o]*X[o]*X[o]),a(o,t,(i?t.intro:!0)&&!Ve);for(let o=0;o<=Y;o++)pe[o]=o}s!==Pt&&(Pt=s,Ke(t)),t.colors.join("|")!==He&&at(t)},T=new Float32Array(0),ue=0,$={scale:1,x0:0,y0:0,z0:0,nx:1,ny:1,nz:1},dt=(t,i)=>{$.scale=1/t,$.x0=-F.halfW-t,$.y0=-F.halfH-t,$.z0=-Math.max(i.depth,i.maxSize)-t,$.nx=Math.max(1,Math.ceil((F.halfW*2+t*2)*$.scale)+1),$.ny=Math.max(1,Math.ceil((F.halfH*2+t*2)*$.scale)+1),$.nz=Math.max(1,Math.ceil((Math.max(i.depth,i.maxSize)*2+t*2)*$.scale)+1);let s=$.nx*$.ny*$.nz;oe.length<s+1&&(oe=new Int32Array(s+1),ke=new Int32Array(s+1)),oe.fill(0,0,s+1);for(let u=0;u<Y;u++){let o=ye(Math.floor((e[u]-$.x0)*$.scale),0,$.nx-1),f=ye(Math.floor((I[u]-$.y0)*$.scale),0,$.ny-1),y=(ye(Math.floor((O[u]-$.z0)*$.scale),0,$.nz-1)*$.ny+f)*$.nx+o;Xe[u]=y,oe[y+1]++}for(let u=1;u<=s;u++)oe[u]+=oe[u-1];ke.set(oe.subarray(0,s+1));for(let u=0;u<Y;u++)Ye[ke[Xe[u]]++]=u},Pe=(t,i,s,u,o,f,h)=>{if(i>=h||ue*8>=T.length)return;let y=z[t]*s+_[t]*u+B[t]*o,r=ue*8;T[r]=t,T[r+1]=-2,T[r+2]=s,T[r+3]=u,T[r+4]=o,T[r+5]=i,T[r+6]=y<-1.5?-f*y:0,T[r+7]=0,ue++},zt=(t,i,s,u)=>{let o=L.index,{nx:f,ny:h,nz:y}=$;ue=0;for(let r=0;r<Y;r++){let b=Xe[r],M=b%f,H=Math.floor(b/f)%h,Q=Math.floor(b/(f*h));for(let Z=Q>0?-1:0;Z<=(Q<y-1?1:0);Z++)for(let W=H>0?-1:0;W<=(H<h-1?1:0);W++){let w=((Q+Z)*h+H+W)*f;for(let D=M>0?-1:0;D<=(M<f-1?1:0);D++){let P=w+M+D;for(let q=oe[P];q<oe[P+1];q++){let m=Ye[q];if(m<=r)continue;let C=e[m]-e[r],Fe=I[m]-I[r],ze=O[m]-O[r],Re=C*C+Fe*Fe+ze*ze,ct=X[r]+X[m],ao=Math.max(ct+u,s?ct*1.4:0);if(Re>=ao*ao||Re<1e-12)continue;let lt=Math.sqrt(Re),It=C/lt,kt=Fe/lt,Ht=ze/lt;if(s){let We=ye(1-(lt-ct)/(ct*.4),0,1);ee[r*4]+=It*We,ee[r*4+1]+=kt*We,ee[r*4+2]+=Ht*We,ee[r*4+3]+=We,ee[m*4]-=It*We,ee[m*4+1]-=kt*We,ee[m*4+2]-=Ht*We,ee[m*4+3]+=We}if(lt>=ct+u||ue*8>=T.length||r===o&&m===o)continue;let io=(z[m]-z[r])*It+(_[m]-_[r])*kt+(B[m]-B[r])*Ht,qe=ue*8;T[qe]=r,T[qe+1]=m,T[qe+2]=It,T[qe+3]=kt,T[qe+4]=Ht,T[qe+5]=lt-ct,T[qe+6]=io<-1.5?-t.bounce*io:0,T[qe+7]=0,ue++}}}if(r!==o){let Z=X[r],W=Math.max(t.depth-Z,0);Pe(r,e[r]+F.halfW-Z,1,0,0,t.wallBounce,u),Pe(r,F.halfW-Z-e[r],-1,0,0,t.wallBounce,u),Pe(r,I[r]+F.halfH-Z,0,1,0,t.wallBounce,u),he[r]&&Pe(r,F.halfH-Z-I[r],0,-1,0,t.wallBounce,u),Pe(r,O[r]+W,0,0,1,t.wallBounce,u),Pe(r,W-O[r],0,0,-1,t.wallBounce,u)}if(R.r>.01&&r!==o&&ue*8<T.length){let Z=e[r]-R.x,W=I[r]-R.y,w=O[r]-R.z,D=X[r]+R.r,P=Z*Z+W*W+w*w;if(P<(D+u)*(D+u)&&P>1e-12){let q=Math.sqrt(P),m=Z/q,C=W/q,Fe=w/q,ze=(z[r]-R.vx)*m+(_[r]-R.vy)*C+B[r]*Fe,Re=ue*8;T[Re]=r,T[Re+1]=-1,T[Re+2]=m,T[Re+3]=C,T[Re+4]=Fe,T[Re+5]=q-D,T[Re+6]=ze<-1.5?-t.bounce*ze:0,T[Re+7]=0,ue++}}}},Jt=t=>{let i=L.index,s=Y>800?5:8;for(let u=0;u<s;u++)for(let o=0;o<ue;o++){let f=o*8,h=T[f],y=T[f+1],r=T[f+2],b=T[f+3],M=T[f+4],H=T[f+5],Q=H>0?-H/t:T[f+6],Z=T[f+7];if(y<0){let C=y===-1?(z[h]-R.vx)*r+(_[h]-R.vy)*b+B[h]*M:z[h]*r+_[h]*b+B[h]*M,Fe=Math.max(Z+Q-C,0),ze=Fe-Z;T[f+7]=Fe,z[h]+=ze*r,_[h]+=ze*b,B[h]+=ze*M;continue}let W=h===i?0:ge[h],w=y===i?0:ge[y],D=W+w;if(D<=0)continue;let P=(z[y]-z[h])*r+(_[y]-_[h])*b+(B[y]-B[h])*M,q=Math.max(Z+(Q-P)/D,0),m=q-Z;T[f+7]=q,z[h]-=m*W*r,_[h]-=m*W*b,B[h]-=m*W*M,z[y]+=m*w*r,_[y]+=m*w*b,B[y]+=m*w*M}},_t=()=>{let t=L.index;for(let i=0;i<2;i++)for(let s=0;s<ue;s++){let u=s*8,o=T[u],f=T[u+1];if(f===-2)continue;if(f<0){let w=e[o]-R.x,D=I[o]-R.y,P=O[o]-R.z,q=Math.sqrt(w*w+D*D+P*P),m=X[o]+R.r-q-uo;if(m<=0||q<1e-6)continue;let C=m*.5/q;e[o]+=w*C,I[o]+=D*C,O[o]+=P*C;continue}let h=e[f]-e[o],y=I[f]-I[o],r=O[f]-O[o],b=Math.sqrt(h*h+y*y+r*r),M=X[o]+X[f]-b-uo;if(M<=0||b<1e-6)continue;let H=o===t?0:ge[o],Q=f===t?0:ge[f],Z=H+Q;if(Z<=0)continue;let W=M*.3/(b*Z);e[o]-=h*W*H,I[o]-=y*W*H,O[o]-=r*W*H,e[f]+=h*W*Q,I[f]+=y*W*Q,O[f]+=r*W*Q}},eo=t=>{let i=F.halfW,s=F.halfH,u=t.wallBounce;for(let o=0;o<Y;o++){let f=X[o];e[o]<-i+f?(e[o]=-i+f,z[o]<0&&(z[o]=z[o]<-1.5?-z[o]*u:0)):e[o]>i-f&&(e[o]=i-f,z[o]>0&&(z[o]=z[o]>1.5?-z[o]*u:0)),I[o]<-s+f?(I[o]=-s+f,_[o]<0&&(_[o]=_[o]<-1.5?-_[o]*u:0),z[o]*=.995,B[o]*=.995):he[o]&&I[o]>s-f&&(I[o]=s-f,_[o]>0&&(_[o]=_[o]>1.5?-_[o]*u:0)),!he[o]&&I[o]<s-f&&(he[o]=1);let h=Math.max(t.depth-f,0);O[o]<-h?(O[o]=-h,B[o]<0&&(B[o]=B[o]<-1.5?-B[o]*u:0)):O[o]>h&&(O[o]=h,B[o]>0&&(B[o]=B[o]>1.5?-B[o]*u:0))}},Dt=(t,i,s)=>{let u=t.gravity*45,o=Math.pow(t.friction,i*60)*(Oe>0?Math.exp(-2.2*i):1),f=Ve?0:t.drift*2.2,h=t.maxSize*F.fit,y=h*.3;T.length<Y*96&&(T=new Float32Array(Y*96));for(let r=0;r<Y;r++){if(r===L.index){let M=1-Math.exp(-i/.02);z[r]=(L.tx-e[r])*M/i,_[r]=(L.ty-I[r])*M/i,B[r]=0;continue}if(_[r]-=u*i,f){let M=Ze[r];z[r]+=Math.sin(ne*.63+M)*f*i,_[r]+=Math.cos(ne*.47+M*1.7)*f*i,B[r]+=Math.sin(ne*.41+M*2.3)*f*i*.5}z[r]*=o,_[r]*=o,B[r]*=o;let b=z[r]*z[r]+_[r]*_[r]+B[r]*B[r];if(b>et*et){let M=et/Math.sqrt(b);z[r]*=M,_[r]*=M,B[r]*=M}}dt(h*(s?2.8:2.3),t),s&&ee.fill(0,0,Y*4),zt(t,i,s,y),Jt(i);for(let r=0;r<Y;r++)e[r]+=z[r]*i,I[r]+=_[r]*i,O[r]+=B[r]*i;if(_t(),eo(t),s)for(let r=0;r<Y;r++){let b=I[r]-X[r]+F.halfH,M=X[r]*.5;if(b>=M)continue;let H=1-Math.max(b,0)/M;ee[r*4+1]-=H,ee[r*4+3]+=H}if(L.index>=0){let r=L.index;L.vx+=(z[r]-L.vx)*(1-Math.exp(-i/.05)),L.vy+=(_[r]-L.vy)*(1-Math.exp(-i/.05))}},mt=(t,i)=>{let s=Be.getBoundingClientRect(),u=(t-s.left)/Math.max(s.width,1)*2-1,o=1-(i-s.top)/Math.max(s.height,1)*2;return[u*F.tan*(F.width/F.height),o*F.tan,-1]},it=(t,i)=>{let s=(i-Je)/t[2];return[t[0]*s,t[1]*s]},Bt=t=>{let i=Math.hypot(t[0],t[1],t[2]),s=t[0]/i,u=t[1]/i,o=t[2]/i,f=-1,h=1/0;for(let y=0;y<Y;y++){let r=-e[y],b=-I[y],M=Je-O[y],H=r*s+b*u+M*o,Q=X[y]*1.15,Z=r*r+b*b+M*M-Q*Q,W=H*H-Z;if(W<0)continue;let w=-H-Math.sqrt(W);w>0&&w<h&&(h=w,f=y)}return f},vt=(t,i)=>{let s=Ce.current,u=F.halfH*.7;for(let o=0;o<Y;o++){let f=e[o]-t,h=I[o]-i,y=O[o],r=Math.hypot(f,h,y);if(r>=u||r<1e-4)continue;let b=Math.pow(1-r/u,2)*26*(1+.6/(X[o]+.4));z[o]+=f/r*b,_[o]+=h/r*b+b*.25,B[o]+=y/r*b*.5}K.x=t,K.y=i,K.z=Math.max(s.depth,1)+1.5,K.flash=1},pt=Ce.current.dpr,be=()=>{let t=Ce.current;pt=t.dpr,F.width=Math.max(1,Be.clientWidth),F.height=Math.max(1,Be.clientHeight),F.ratio=Math.min(t.dpr||window.devicePixelRatio||1,2),Ne.width=Math.max(1,Math.round(F.width*F.ratio)),Ne.height=Math.max(1,Math.round(F.height*F.ratio));let i=F.width/F.height,s=Math.tan(so*Math.PI/360);F.tan=i>to?s*to/i:s,F.halfH=F.tan*Je,F.halfW=F.halfH*i,F.fit=ye(Math.sqrt(F.halfW*F.halfH/(s*s*Je*Je*to)),.4,1);let u=1/F.tan,o=1,f=80;Ie.fill(0),Ie[0]=u/i,Ie[5]=u,Ie[10]=(f+o)/(o-f),Ie[11]=-1,Ie[14]=2*f*o/(o-f),Y||Qe(t,!0),xt(),Ae()},xt=()=>{let t=Ce.current,i=fo[t.material],s=0,u=Y+1;for(let h=1;h<u;h++){let y=pe[h],r=y===Y?R.z:O[y],b=h-1;for(;b>=0&&(pe[b]===Y?R.z:O[pe[b]])>r;)pe[b+1]=pe[b],b--;pe[b+1]=y}for(let h=0;h<u;h++){let y=pe[h],r=s*Et;if(y===Y){if(R.r<.01||!t.followCursor)continue;let b=V[0]||[1,1,1];G[r]=R.x,G[r+1]=R.y,G[r+2]=R.z,G[r+3]=R.r,G[r+4]=b[0],G[r+5]=b[1],G[r+6]=b[2],G[r+7]=1,G[r+8]=0,G[r+9]=0,G[r+10]=0,G[r+11]=0}else{let b=V[$e[y]%V.length];G[r]=e[y],G[r+1]=I[y],G[r+2]=O[y],G[r+3]=X[y],G[r+4]=b[0],G[r+5]=b[1],G[r+6]=b[2],G[r+7]=0;let M=ee[y*4+3],H=Math.hypot(ee[y*4],ee[y*4+1],ee[y*4+2])||1;G[r+8]=ee[y*4]/H,G[r+9]=ee[y*4+1]/H,G[r+10]=ee[y*4+2]/H,G[r+11]=Math.min(M*.55,1)}s++}if(g.viewport(0,0,Ne.width,Ne.height),g.clearColor(0,0,0,0),g.clearDepth(1),g.clear(g.COLOR_BUFFER_BIT|g.DEPTH_BUFFER_BIT),!s)return;g.enable(g.DEPTH_TEST),g.depthFunc(g.LEQUAL),g.enable(g.BLEND),g.blendFunc(g.ONE,g.ONE_MINUS_SRC_ALPHA),g.useProgram(je.program),g.uniformMatrix4fv(Me.uProj,!1,Ie),g.uniform1f(Me.uCameraZ,Je),g.uniform1f(Me.uPixel,2*F.tan/Ne.height);let o=mo(t.lightColor),f=t.lightIntensity*60*(1+K.flash*3);g.uniform3f(Me.uLight,o[0]*f,o[1]*f,o[2]*f),g.uniform3f(Me.uLightPos,K.x,K.y,K.z-Je),g.uniform1f(Me.uExposure,t.exposure),g.uniform1f(Me.uShadow,t.shadows),g.uniform4f(Me.uSurface,i.roughness,i.metalness,i.coat,i.coatRoughness),g.uniform2f(Me.uExtra,i.scatter,i.frost),g.bindBuffer(g.ARRAY_BUFFER,Se),g.bufferSubData(g.ARRAY_BUFFER,0,G,0,s*Et),g.bindVertexArray(nt),g.drawArraysInstanced(g.TRIANGLE_STRIP,0,4,s),g.bindVertexArray(null)},gt=t=>{if(se=0,!ie||document.hidden)return;let i=Ce.current;i.dpr!==pt&&be();let s=xe?ye((t-xe)/1e3,0,1/20):1/60;xe=t,ne+=s,Oe=Math.max(0,Oe-s),Qe(i,!1);let u=i.followCursor&&j.inside&&L.index<0?i.cursorSize*F.fit:0;R.r+=(u-R.r)*(1-Math.exp(-s/.12));let o=1-Math.exp(-s/.06),f=R.x,h=R.y;R.x+=(R.tx-R.x)*o,R.y+=(R.ty-R.y)*o,R.vx=ye((R.x-f)/Math.max(s,.001),-et,et),R.vy=ye((R.y-h)/Math.max(s,.001),-et,et);let y=0,r=F.halfH*.75,b=i.depth+4,M=j.inside?[R.x,R.y,i.followCursor?R.z:1.5]:K.flash>.05?[K.x,K.y,K.z]:[y,r,b],H=1-Math.exp(-s/.08);if(K.x+=(M[0]-K.x)*H,K.y+=(M[1]-K.y)*H,K.z+=(M[2]-K.z)*H,K.flash*=Math.exp(-s/.3),s>1e-4){let w=Math.min(6,Math.max(1,Math.ceil(s/.005555555555555556))),D=s/w;for(let P=0;P<w;P++)Dt(i,D,P===w-1)}xt();let Q=0;for(let w=0;w<Y;w++){let D=w*3,P=Math.abs(e[w]-Te[D])+Math.abs(I[w]-Te[D+1])+Math.abs(O[w]-Te[D+2]);P>Q&&(Q=P),Te[D]=e[w],Te[D+1]=I[w],Te[D+2]=O[w]}N=Q/Math.max(s,.001)>.6||j.inside||L.index>=0||K.flash>.01||Oe>0||R.r>.01||i.drift>0&&!Ve?0:N+s,N<.8&&(se=requestAnimationFrame(gt))};function Ae(){N=0,!se&&ie&&!document.hidden&&(xe=0,se=requestAnimationFrame(gt))}let Ge=t=>{let i=Be.getBoundingClientRect(),s=t.clientX-i.left,u=t.clientY-i.top;return s>=0&&u>=0&&s<=i.width&&u<=i.height},yt=t=>{let i=mt(t.clientX,t.clientY),[s,u]=it(i,R.z);if(R.tx=s,R.ty=u,L.index>=0){let[o,f]=it(i,O[L.index]);L.tx=o-L.ox,L.ty=f-L.oy}return i},wt=t=>{let i=j.inside;j.inside=Ge(t)||L.index>=0,j.inside&&(yt(t),i||(R.x=R.tx,R.y=R.ty),j.down&&Math.hypot(t.clientX-j.downX,t.clientY-j.downY)>6&&(j.moved=!0)),(j.inside||i)&&Ae()},Nt=t=>t instanceof Element&&t.closest('a, button, input, textarea, select, label, [role="button"]'),Mt=t=>{if(t.button!==0||!Ge(t)||Nt(t.target))return;let i=Ce.current;j.down=!0,j.moved=!1,j.downX=t.clientX,j.downY=t.clientY,j.downAt=performance.now();let s=yt(t);if(i.grab){let u=Bt(s);if(u>=0){let[o,f]=it(s,O[u]);L.index=u,L.ox=o-e[u],L.oy=f-I[u],L.tx=e[u],L.ty=I[u],L.vx=0,L.vy=0,t.pointerType==="mouse"&&t.preventDefault()}}Ae()},n=t=>{let i=Ce.current;if(L.index>=0){let s=L.index,u=Math.hypot(L.vx,L.vy),o=u>22?22/u:1;z[s]=L.vx*o,_[s]=L.vy*o,L.index=-1,he[s]=1}else if(t&&j.down&&!j.moved&&performance.now()-j.downAt<400&&i.clickEffect==="burst"&&!Ve&&Ge(t)){let[s,u]=it(mt(t.clientX,t.clientY),0);vt(s,u)}j.down=!1,Ae()},c=t=>n(t),v=()=>n(null),S=()=>{j.inside=L.index>=0,Ae()},E=()=>Ae(),U=new ResizeObserver(be);U.observe(Be);let te=new IntersectionObserver(t=>{ie=t.some(i=>i.isIntersecting),ie&&Ae()});return te.observe(Be),window.addEventListener("pointermove",wt,{passive:!0}),window.addEventListener("pointerdown",Mt),window.addEventListener("pointerup",c,{passive:!0}),window.addEventListener("pointercancel",v,{passive:!0}),document.documentElement.addEventListener("pointerleave",S),document.addEventListener("visibilitychange",E),be(),ht.current=Ae,()=>{cancelAnimationFrame(se),ht.current=null,U.disconnect(),te.disconnect(),window.removeEventListener("pointermove",wt),window.removeEventListener("pointerdown",Mt),window.removeEventListener("pointerup",c),window.removeEventListener("pointercancel",v),document.documentElement.removeEventListener("pointerleave",S),document.removeEventListener("visibilitychange",E),g.deleteBuffer(ve),g.deleteBuffer(Se),g.deleteVertexArray(nt),g.deleteProgram(je.program),g.getExtension("WEBGL_lose_context")?.loseContext()}},[]),st(()=>{ht.current?.()}),De("div",{ref:At,className:Kt,style:{position:"relative",width:"100%",height:"100%",overflow:"hidden",...Qt},children:De("canvas",{ref:Ct,style:{display:"block",width:"100%",height:"100%"},"aria-hidden":"true"})})},vo=So;var To=.32,po=9,ut=.05,Vt=160,bt=1.7,Ft=.45,Ao=2.8,Gt=4,xo=4,St=256,Xt=48,oo=2e5,Co=[-.81,.58,-.02],go={forward:[0,1],backward:[0,-1],left:[-1,0],right:[1,0]},Lo=["lift","trace","light"],Po={plus:0,dots:1},zo=1.25,qt=`
precision highp float;
precision highp int;

uniform float uFrequency;
uniform vec2 uMorph;
uniform sampler2D uSculpt;
uniform float uSculptOn;
uniform vec4 uPulses[${Gt}];
uniform vec3 uEye;
uniform vec3 uForward;
uniform vec3 uNear;

uint lattice(ivec2 p) {
  uvec2 q = uvec2(p + 1073741824);
  uint h = q.x * 2654435761u + q.y * 2246822519u;
  h = (h ^ (h >> 15u)) * 739982445u;
  h = (h ^ (h >> 12u)) * 695872825u;
  return h ^ (h >> 15u);
}

float corner(ivec2 c, vec2 f) {
  uint h = lattice(c);
  vec2 g = vec2(float(h & 65535u), float(h >> 16u)) / 32767.5 - 1.0;
  return dot(g, f);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = p - i;
  ivec2 c = ivec2(i);
  vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  float a = corner(c, f);
  float b = corner(c + ivec2(1, 0), f - vec2(1.0, 0.0));
  float d = corner(c + ivec2(0, 1), f - vec2(0.0, 1.0));
  float e = corner(c + ivec2(1, 1), f - vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(d, e, u.x), u.y);
}

vec2 octave(vec2 p, vec2 shift) {
  return vec2(1.6 * p.x - 1.2 * p.y, 1.2 * p.x + 1.6 * p.y) + shift;
}

float relief(vec2 t) {
  vec2 p = t * uFrequency;
  vec2 w = vec2(noise(p * 0.42 + uMorph), noise(p * 0.42 - uMorph.yx + vec2(5.2, 1.3)));
  p += w * 0.8;
  float n = noise(p) * 0.55;
  p = octave(p, vec2(7.1, 3.7));
  n += noise(p) * 0.15;
  p = octave(p, vec2(1.9, 8.3));
  n += noise(p) * 0.04;
  float s = log(1.0 + exp(7.0 * (3.0 * n + 0.05))) / 7.0;
  return s * s * 1.4 + 0.1 * n;
}

float swell(vec2 t) {
  float lift = 0.0;
  for (int i = 0; i < ${Gt}; i++) {
    vec4 p = uPulses[i];
    if (p.w <= 0.0) continue;
    float x = (length(t - p.xy) - p.z) / (0.28 + p.z * 0.05);
    lift += exp(-x * x) * p.w;
  }
  return lift;
}

vec4 sculpted(vec2 t) {
  return uSculptOn > 0.5 ? textureLod(uSculpt, t / ${Xt}.0, 0.0) : vec4(0.0);
}

float settle(vec2 world) {
  float depth = dot(vec3(world.x, 0.0, world.y) - uEye, uForward);
  float x = clamp((depth - uNear.x) / max(uNear.y - uNear.x, 1e-3), 0.0, 1.0);
  return mix(uNear.z, 1.0, x * x * x * (x * (x * 6.0 - 15.0) + 10.0));
}
`,_o=`#version 300 es
${qt}
uniform ivec2 uBase;
uniform float uCell;
uniform float uDetail;
layout(location = 0) out vec4 outField;
layout(location = 1) out vec4 outHeight;

void main() {
  vec2 t = vec2(uBase + ivec2(gl_FragCoord.xy)) * uCell;
  vec4 carved = sculpted(t);
  float ring = swell(t);
  float ground = relief(t) + carved.r + ring * 0.14;
  vec2 dp = t * uFrequency * 5.0 + vec2(13.1, 4.7);
  float fine = noise(dp) * 0.6 + noise(octave(dp, vec2(2.3, 6.1))) * 0.3;
  outField = vec4(carved.g, ring, ground, carved.r);
  outHeight = vec4(ground + uDetail * 0.1 * fine, 0.0, 0.0, 1.0);
}`,Do=l=>`#version 300 es
#define BAKED ${l?1:0}
${qt}
uniform sampler2D uField;
uniform ivec2 uOrigin;
uniform ivec2 uCamCell;
uniform vec2 uCamFrac;
uniform float uCell;
uniform int uStride;
uniform float uHeight;
uniform mat4 uViewProj;
out vec2 vTexel;
out vec2 vTerrain;
out float vDepth;
out float vLift;
out vec3 vNormal;

float ground(vec2 t) {
  return relief(t) + swell(t) * 0.14;
}

void main() {
  ivec2 step = ivec2(gl_VertexID >> 1, gl_InstanceID + (gl_VertexID & 1)) * uStride;
  ivec2 local = uOrigin + step;
  vec2 terrain = vec2(local + uCamCell) * uCell;
  vec2 world = vec2(local) * uCell - uCamFrac;
  float k = settle(world);
#if BAKED
  ivec2 texel = step + 2;
  vec4 c = texelFetch(uField, texel, 0);
  vec4 l = texelFetch(uField, texel - ivec2(1, 0), 0);
  vec4 r = texelFetch(uField, texel + ivec2(1, 0), 0);
  vec4 d = texelFetch(uField, texel - ivec2(0, 1), 0);
  vec4 u = texelFetch(uField, texel + ivec2(0, 1), 0);
  float h = (c.b - c.a) * k + c.a;
  float dx = (l.b - l.a - r.b + r.a) * k + l.a - r.a;
  float dz = (d.b - d.a - u.b + u.a) * k + d.a - u.a;
  vNormal = vec3(dx * uHeight / (2.0 * uCell), 1.0, dz * uHeight / (2.0 * uCell));
  vTexel = vec2(texel) + 0.5;
#else
  float h = ground(terrain) * k;
  float hx = ground(terrain + vec2(0.04, 0.0)) * k;
  float hz = ground(terrain + vec2(0.0, 0.04)) * k;
  vNormal = vec3((h - hx) * uHeight / 0.04, 1.0, (h - hz) * uHeight / 0.04);
  vTexel = vec2(0.0);
#endif
  vec4 clip = uViewProj * vec4(world.x, h * uHeight, world.y, 1.0);
  gl_Position = clip;
  vTerrain = terrain;
  vDepth = clip.w;
  vLift = h * uHeight;
}`,Bo=l=>`#version 300 es
#define BAKED ${l?1:0}
${qt}
uniform sampler2D uField;
uniform highp sampler2D uHeightField;
uniform float uDetail;
uniform float uLines;
uniform float uLineWidth;
uniform float uMajor;
uniform vec3 uColor;
uniform float uBrightness;
uniform vec2 uFade;
uniform vec3 uFocus;
uniform vec4 uHeat;
uniform vec4 uLamp;
uniform vec4 uTrace;
uniform vec3 uSun;
uniform float uRefDepth;
uniform float uReveal;
uniform float uLightMode;
uniform float uOpacity;
uniform vec4 uGlitch[3];
uniform float uGlitchSeed;
uniform float uPixel;
in vec2 vTexel;
in vec2 vTerrain;
in float vDepth;
in float vLift;
in vec3 vNormal;
out vec4 outColor;

float smoother(float x) {
  x = clamp(x, 0.0, 1.0);
  return x * x * x * (x * (x * 6.0 - 15.0) + 10.0);
}

float stroke(float dist, float width, float soft, float density, float crowd) {
  float cover = max(0.0, min(min(width, soft), 0.5 * (width + soft) - dist)) / soft;
  return mix(cover, min(width * density, 1.0) * 0.6, crowd);
}

float sampleHeight(vec2 coord, out vec2 slope) {
  vec2 u = coord - 0.5;
  vec2 i = floor(u + 0.5);
  vec2 f = u - i;
  vec3 wx = vec3(0.5 * (0.5 - f.x) * (0.5 - f.x), 0.75 - f.x * f.x, 0.5 * (0.5 + f.x) * (0.5 + f.x));
  vec3 wy = vec3(0.5 * (0.5 - f.y) * (0.5 - f.y), 0.75 - f.y * f.y, 0.5 * (0.5 + f.y) * (0.5 + f.y));
  vec3 dx = vec3(f.x - 0.5, -2.0 * f.x, 0.5 + f.x);
  vec3 dy = vec3(f.y - 0.5, -2.0 * f.y, 0.5 + f.y);
  ivec2 base = ivec2(i) - 1;
  float total = 0.0;
  slope = vec2(0.0);
  for (int y = 0; y < 3; y++) {
    float a = texelFetch(uHeightField, base + ivec2(0, y), 0).r;
    float b = texelFetch(uHeightField, base + ivec2(1, y), 0).r;
    float c = texelFetch(uHeightField, base + ivec2(2, y), 0).r;
    float row = a * wx.x + b * wx.y + c * wx.z;
    total += row * wy[y];
    slope += vec2((a * dx.x + b * dx.y + c * dx.z) * wy[y], row * dy[y]);
  }
  return total;
}

void main() {
  float py = gl_FragCoord.y / uPixel;
  float shift = 0.0;
  float split = 0.0;
  for (int i = 0; i < 3; i++) {
    if (py >= uGlitch[i].x && py < uGlitch[i].y) {
      shift = uGlitch[i].z * uPixel;
      split = uGlitch[i].w * uPixel;
    }
  }
  vec2 spot = vTerrain - dFdx(vTerrain) * shift;
#if BAKED
  vec2 ex = dFdx(vTexel);
  vec2 ey = dFdy(vTexel);
  vec2 coord = vTexel - ex * shift;
  vec2 slope;
  float h = sampleHeight(coord, slope);
  vec4 field = texture(uField, coord / vec2(textureSize(uField, 0)));
  float trail = field.r;
  float ring = field.g;
  float gx = dot(slope, ex) * uLines;
  float gy = dot(slope, ey) * uLines;
#else
  vec2 dp = spot * uFrequency * 5.0 + vec2(13.1, 4.7);
  float ring = swell(spot);
  float h = relief(spot) + ring * 0.14 + uDetail * 0.1 * (noise(dp) * 0.6 + noise(octave(dp, vec2(2.3, 6.1))) * 0.3);
  float trail = 0.0;
  float gx = dFdx(h) * uLines;
  float gy = dFdy(h) * uLines;
#endif

  float lc = h * uLines + 0.5;
  float density = max(sqrt(gx * gx + gy * gy), 1e-5);
  float dist = abs(fract(lc + 0.5) - 0.5) / density;
  float major = uMajor * (1.0 - step(0.5, mod(floor(lc + 0.5), 5.0)));

  vec2 hd = spot - uHeat.xy;
  float heat = exp(-dot(hd, hd) / (uHeat.z * uHeat.z)) * uHeat.w + trail * 0.6;
  float energy = heat + ring;

  float depth = max(vDepth, 0.01);
  float persp = clamp(sqrt(uRefDepth / depth), 0.6, 1.6);
  float width = uLineWidth * persp * (1.0 + 0.6 * major) * (1.0 + 0.45 * min(energy, 1.5));
  float soft = 1.0 + min(uFocus.y * abs(1.0 - uFocus.x / depth), uFocus.z);
  float crowd = smoothstep(0.3, 0.75, density * max(width, soft));
  float cover = stroke(dist, width, soft, density, crowd);
  vec3 cover3 = vec3(cover);
  if (split > 0.0) {
    float offset = split * density;
    cover3.r = stroke(abs(fract(lc + offset + 0.5) - 0.5) / density, width, soft, density, crowd);
    cover3.b = stroke(abs(fract(lc - offset + 0.5) - 0.5) / density, width, soft, density, crowd);
    vec2 block = floor(vec2(gl_FragCoord.x / (uPixel * 26.0), py / 5.0)) + uGlitchSeed * 71.0;
    float drop = fract(sin(dot(block, vec2(12.9898, 78.233))) * 43758.5453);
    cover3 *= drop > 0.82 ? 0.1 : 1.2;
  }

  vec3 normal = normalize(vNormal);
  float sun = clamp(dot(normal, uSun), 0.0, 1.0);
  vec3 toLamp = uLamp.xyz - vec3(vTerrain.x, vLift, vTerrain.y);
  float lampDistance = length(toLamp);
  float lamp = clamp(dot(normal, toLamp / max(lampDistance, 1e-3)), 0.0, 1.0) * uLamp.w / (1.0 + lampDistance * lampDistance * 0.9);
  float level = mix(0.45, 1.05, smoothstep(0.0, 1.1, h)) * mix(0.35, 1.25, sun * sun) * (1.0 + 0.6 * major);
  level += heat * 1.4 + ring * 3.0 + lamp * 1.2;

  float fade = 1.0 - smoother((depth - uFade.x) / max(uFade.y - uFade.x, 1e-3));
  vec3 light = cover3 * level;

  if (uTrace.y > 0.0) {
    float traceWidth = uLineWidth * persp * 1.8;
    float trace = stroke(abs(h - uTrace.x) * uLines / density, traceWidth, soft, density, crowd);
    vec2 td = spot - uTrace.zw;
    light += trace * uTrace.y * mix(0.35, 1.0, exp(-dot(td, td) / 20.0)) * 2.6;
  }
  light *= fade * uBrightness * uReveal;

  if (uLightMode > 0.5) {
    float ink = (1.0 - exp(-max(max(light.r, light.g), light.b) * 1.8)) * 0.92 * uOpacity;
    outColor = vec4(uColor * ink, ink);
    return;
  }

  vec3 color = 1.0 - exp(-uColor * light * 1.8);
  float top = max(max(color.r, color.g), color.b);
  float dither = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) - 0.5;
  color = max(color + dither / 255.0 * step(0.002, top), 0.0);
  outColor = vec4(color, max(max(color.r, color.g), color.b)) * uOpacity;
}`,No=`#version 300 es
${qt}
uniform ivec2 uOrigin;
uniform ivec2 uCamCell;
uniform vec2 uCamFrac;
uniform float uSpacing;
uniform int uColumns;
uniform float uHeight;
uniform mat4 uViewProj;
uniform vec2 uView;
uniform float uSize;
uniform float uRefDepth;
uniform vec4 uHeat;
uniform float uTime;
uniform vec4 uGlitch[3];
uniform float uPixel;
out vec2 vCorner;
out float vSize;
out float vGlow;
out float vFrame;
out float vDepth;

void main() {
  ivec2 local = uOrigin + ivec2(gl_InstanceID % uColumns, gl_InstanceID / uColumns);
  ivec2 id = local + uCamCell;
  vec2 terrain = vec2(id) * uSpacing;
  vec2 world = vec2(local) * uSpacing - uCamFrac;
  float ring = swell(terrain);
  float h = (relief(terrain) + ring * 0.14) * settle(world) + sculpted(terrain).r;
  vec4 clip = uViewProj * vec4(world.x, h * uHeight + 0.05, world.y, 1.0);
  uint seed = lattice(id + ivec2(911, 377));
  float a = float(seed & 1023u) / 1023.0;
  float b = float((seed >> 10u) & 1023u) / 1023.0;
  vec2 hd = terrain - uHeat.xy;
  float heat = exp(-dot(hd, hd) / (uHeat.z * uHeat.z)) * uHeat.w;
  float blink = step(0.92, a) * (0.5 + 0.5 * sin(uTime * (1.4 + b * 2.2) + b * 40.0));
  float size = uSize * clamp(sqrt(uRefDepth / max(clip.w, 0.01)), 0.6, 1.3) * (1.0 + 0.4 * heat + 0.35 * blink);
  float frame = max(smoothstep(0.55, 0.95, blink), smoothstep(0.3, 0.8, heat));
  vec2 corner = vec2(float(gl_VertexID & 1), float(gl_VertexID >> 1)) * 2.0 - 1.0;
  vec2 offset = corner * (size * (frame > 0.001 ? 2.6 : 1.0) + 1.5);
  float py = (clip.y / clip.w * 0.5 + 0.5) * uView.y / uPixel;
  float shift = 0.0;
  for (int i = 0; i < 3; i++) {
    if (py >= uGlitch[i].x && py < uGlitch[i].y) shift = uGlitch[i].z;
  }
  clip.xy += (offset + vec2(shift * uPixel, 0.0)) / uView * 2.0 * clip.w;
  gl_Position = clip;
  vCorner = offset;
  vSize = size;
  vFrame = frame;
  vGlow = 0.5 + 0.4 * b + blink * 0.9 + heat * 1.8 + ring * 3.0;
  vDepth = clip.w;
}`,Io=`#version 300 es
precision highp float;
uniform vec3 uColor;
uniform vec2 uFade;
uniform float uReveal;
uniform float uBrightness;
uniform float uLightMode;
uniform float uOpacity;
uniform float uStyle;
uniform float uPixel;
in vec2 vCorner;
in float vSize;
in float vGlow;
in float vFrame;
in float vDepth;
out vec4 outColor;

float smoother(float x) {
  x = clamp(x, 0.0, 1.0);
  return x * x * x * (x * (x * 6.0 - 15.0) + 10.0);
}

void main() {
  vec2 a = abs(vCorner);
  float cover;
  if (uStyle < 0.5) {
    float thick = max(0.6 * uPixel, 0.5);
    float across = clamp(vSize - a.x + 0.5, 0.0, 1.0) * clamp(thick - a.y + 0.5, 0.0, 1.0);
    float down = clamp(vSize - a.y + 0.5, 0.0, 1.0) * clamp(thick - a.x + 0.5, 0.0, 1.0);
    cover = max(across, down);
  } else {
    cover = clamp(vSize * 0.42 - length(vCorner) + 0.5, 0.0, 1.0);
  }
  if (vFrame > 0.001) {
    float edge = vSize * 2.3;
    float reach = edge * 0.45;
    float line = max(0.5 * uPixel, 0.5);
    float sides = clamp(line - abs(a.x - edge) + 0.5, 0.0, 1.0) * clamp(a.y - edge + reach + 0.5, 0.0, 1.0) * clamp(edge + line - a.y + 0.5, 0.0, 1.0);
    float caps = clamp(line - abs(a.y - edge) + 0.5, 0.0, 1.0) * clamp(a.x - edge + reach + 0.5, 0.0, 1.0) * clamp(edge + line - a.x + 0.5, 0.0, 1.0);
    cover = max(cover, max(sides, caps) * vFrame * 0.8);
  }
  float fade = 1.0 - smoother((vDepth - uFade.x) / max(uFade.y - uFade.x, 1e-3));
  float light = cover * vGlow * fade * fade * uReveal * uBrightness;
  if (uLightMode > 0.5) {
    float ink = (1.0 - exp(-light * 1.8)) * 0.92 * uOpacity;
    outColor = vec4(uColor * ink, ink);
    return;
  }
  vec3 color = 1.0 - exp(-uColor * light * 1.8);
  outColor = vec4(color, max(max(color.r, color.g), color.b)) * uOpacity;
}`,Rt=`#version 300 es
void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`,ko=`#version 300 es
precision highp float;
uniform sampler2D uPrevious;
uniform vec4 uSegment;
uniform vec4 uBrush;
uniform vec4 uBurst;
uniform vec2 uDecay;
out vec4 outColor;

vec2 wrapped(vec2 d) {
  return d - ${Xt}.0 * floor(d / ${Xt}.0 + 0.5);
}

void main() {
  vec4 previous = texelFetch(uPrevious, ivec2(gl_FragCoord.xy), 0);
  vec2 t = gl_FragCoord.xy / ${St}.0 * ${Xt}.0;
  vec2 a = wrapped(t - uSegment.xy);
  vec2 ab = uSegment.zw - uSegment.xy;
  float k = clamp(dot(a, ab) / max(dot(ab, ab), 1e-6), 0.0, 1.0);
  vec2 d = a - ab * k;
  float g = exp(-dot(d, d) / (uBrush.x * uBrush.x)) * uBrush.w;
  float height = previous.r * uDecay.x;
  height += (uBrush.y - height) * g * uBrush.z;
  float heat = previous.g * uDecay.y;
  heat += (1.0 - heat) * g * uBrush.z;
  vec2 b = wrapped(t - uBurst.xy);
  height += uBurst.w * exp(-dot(b, b) / (uBurst.z * uBurst.z));
  outColor = vec4(height, heat, 0.0, 1.0);
}`,Ho=`#version 300 es
precision highp float;
uniform sampler2D uSource;
uniform vec2 uTarget;
uniform vec2 uTexel;
out vec4 outColor;

void main() {
  vec2 uv = gl_FragCoord.xy / uTarget;
  vec4 color = texture(uSource, uv - uTexel);
  color += texture(uSource, uv + uTexel);
  color += texture(uSource, uv + vec2(uTexel.x, -uTexel.y));
  color += texture(uSource, uv + vec2(-uTexel.x, uTexel.y));
  outColor = min(color * 0.25, vec4(1.0));
}`,Oo=`#version 300 es
precision highp float;
uniform sampler2D uSource;
uniform vec2 uTarget;
uniform vec2 uStep;
out vec4 outColor;

void main() {
  vec2 uv = gl_FragCoord.xy / uTarget;
  vec4 color = texture(uSource, uv) * 0.181862;
  color += (texture(uSource, uv + uStep * 1.423135) + texture(uSource, uv - uStep * 1.423135)) * 0.284316;
  color += (texture(uSource, uv + uStep * 3.326702) + texture(uSource, uv - uStep * 3.326702)) * 0.106598;
  color += (texture(uSource, uv + uStep * 5.242989) + texture(uSource, uv - uStep * 5.242989)) * 0.018156;
  outColor = color;
}`,Uo=`#version 300 es
precision highp float;
uniform sampler2D uBloom0;
uniform sampler2D uBloom1;
uniform sampler2D uBloom2;
uniform sampler2D uBloom3;
uniform vec2 uView;
uniform float uGlow;
uniform float uLightMode;
out vec4 outColor;

void main() {
  vec2 uv = gl_FragCoord.xy / uView;
  vec4 halo = texture(uBloom0, uv) * 0.4;
  halo += texture(uBloom1, uv) * 0.3;
  halo += texture(uBloom2, uv) * 0.2;
  halo += texture(uBloom3, uv) * 0.1;
  if (uLightMode > 0.5) {
    outColor = halo * uGlow * 0.35;
    return;
  }
  vec3 color = halo.rgb * uGlow * 1.6;
  color = color / (1.0 + color);
  outColor = vec4(color, max(max(color.r, color.g), color.b));
}`,ae=(l,x,p)=>Math.min(p,Math.max(x,l)),tt=l=>{let x=ae(l,0,1);return x*x*x*(x*(x*6-15)+10)},Vo=(l,x)=>{let p=Math.imul(l+1073741824,2654435761)+Math.imul(x+1073741824,2246822519)>>>0;return p=Math.imul(p^p>>>15,739982445)>>>0,p=Math.imul(p^p>>>12,695872825)>>>0,(p^p>>>15)>>>0},Ut=(l,x,p,d)=>{let A=Vo(l,x);return((A&65535)/32767.5-1)*p+((A>>>16)/32767.5-1)*d},rt=(l,x)=>{let p=Math.floor(l),d=Math.floor(x),A=l-p,k=x-d,J=A*A*A*(A*(A*6-15)+10),ce=k*k*k*(k*(k*6-15)+10),de=Ut(p,d,A,k),le=Ut(p+1,d,A-1,k),fe=Ut(p,d+1,A,k-1),me=Ut(p+1,d+1,A-1,k-1),we=de+(le-de)*J;return we+(fe+(me-fe)*J-we)*ce},yo=(l,x,p,d,A)=>{let k=l*p,J=x*p,ce=rt(k*.42+d,J*.42+A),de=rt(k*.42-A+5.2,J*.42-d+1.3);k+=ce*.8,J+=de*.8;let le=rt(k,J)*.55,fe=1.6*k-1.2*J+7.1,me=1.2*k+1.6*J+3.7;le+=rt(fe,me)*.15,le+=rt(1.6*fe-1.2*me+1.9,1.2*fe+1.6*me+8.3)*.04;let we=Math.log(1+Math.exp(7*(3*le+.05)))/7;return we*we*1.4+.1*le},Xo=(l,x,p)=>{let d=l*p*5+13.1,A=x*p*5+4.7;return rt(d,A)*.6+rt(1.6*d-1.2*A+2.3,1.2*d+1.6*A+6.1)*.3},wo=(l,x,p)=>{let d=l.createShader(x);return d?(l.shaderSource(d,p),l.compileShader(d),l.getShaderParameter(d,l.COMPILE_STATUS)?d:(l.deleteShader(d),null)):null},ot=(l,x,p)=>{let d=wo(l,l.VERTEX_SHADER,x),A=wo(l,l.FRAGMENT_SHADER,p),k=l.createProgram();if(!d||!A||!k)return null;if(l.attachShader(k,d),l.attachShader(k,A),l.linkProgram(k),l.deleteShader(d),l.deleteShader(A),!l.getProgramParameter(k,l.LINK_STATUS))return l.deleteProgram(k),null;let J={},ce=l.getProgramParameter(k,l.ACTIVE_UNIFORMS);for(let de=0;de<ce;de++){let le=l.getActiveUniform(k,de);le&&(J[le.name.replace(/\[0\]$/,"")]=l.getUniformLocation(k,le.name))}return{program:k,uniforms:J}},Go=l=>{let x=String(l||"#ffffff").replace("#","").trim();(x.length===3||x.length===4)&&(x=x.slice(0,3).split("").map(d=>d+d).join(""));let p=parseInt(x.slice(0,6),16);return Number.isNaN(p)?[1,1,1]:[(p>>16&255)/255,(p>>8&255)/255,(p&255)/255]},qo=(l,x)=>{let p=Math.cos(x),d=[Math.sin(l)*p,-Math.sin(x),Math.cos(l)*p],A=[Math.cos(l),0,-Math.sin(l)],k=[d[1]*A[2]-d[2]*A[1],d[2]*A[0]-d[0]*A[2],d[0]*A[1]-d[1]*A[0]];return{f:d,r:A,u:k}},ro=l=>ae(.4877/l,To,.6),Wo=({eye:l,f:x,r:p,u:d},A,k)=>{let J=1/ro(A),ce=1/(ut-Vt),de=[p[0],d[0],-x[0],0,p[1],d[1],-x[1],0,p[2],d[2],-x[2],0,-(p[0]*l[0]+p[1]*l[1]+p[2]*l[2]),-(d[0]*l[0]+d[1]*l[1]+d[2]*l[2]),x[0]*l[0]+x[1]*l[1]+x[2]*l[2],1],le=[J/A,0,0,0,0,J,0,0,0,0,(Vt+ut)*ce,-1,0,0,2*Vt*ut*ce,0];for(let fe=0;fe<4;fe++)for(let me=0;me<4;me++){let we=0;for(let Ue=0;Ue<4;Ue++)we+=le[Ue*4+me]*de[fe*4+Ue];k[fe*4+me]=we}return k},jo=({color:l="#4f7cff",lineCount:x=22,lineWidth:p=1.2,majorLines:d=!0,elevation:A=1,foreground:k=.2,scale:J=1,detail:ce=.35,tilt:de=32,speed:le=.25,direction:fe="forward",morph:me=.2,glow:we=.6,depthOfField:Ue=.4,fog:Wt=.35,brightness:jt=1,opacity:ft=1,mouseInteraction:Zt=!0,hoverEffect:Tt="lift",mouseRadius:$t=1,mouseStrength:Yt=.6,trail:Kt=.3,parallax:Qt=.5,clickEffect:At="pulse",markers:Ct="none",glitch:ht=0,intro:Lt=!0,lightMode:Ce=!1,dpr:Be,className:Ne="",style:g})=>{let je=_e(null),Me=_e(null),Ve=_e(null),[F,Ie]=co(0),nt={color:l,lineCount:ae(x,2,80),lineWidth:Math.max(.2,p),majorLines:d,elevation:ae(A,0,3),foreground:ae(k,0,1),scale:ae(J,.2,5),detail:ae(ce,0,1),tilt:ae(de,12,90),speed:le,direction:go[fe]??go.forward,morph:Math.max(0,me),glow:Math.max(0,we),depthOfField:ae(Ue,0,1),fog:ae(Wt,0,1),brightness:Math.max(0,jt),opacity:ae(ft,0,1),mouseInteraction:Zt,hoverEffect:Lo.includes(Tt)?Tt:"lift",mouseRadius:Math.max(.1,$t),mouseStrength:Math.max(0,Yt),trail:ae(Kt,0,1),parallax:ae(Qt,0,1),clickEffect:At,markers:Po[Ct]??-1,glitch:ae(ht,0,1),intro:Lt,lightMode:Ce,dpr:Be},ve=_e(nt);return ve.current=nt,st(()=>{let Se=je.current,re=Me.current,Y=Math.min(ve.current.dpr||window.devicePixelRatio||1,2),e=re?.getContext("webgl2",{alpha:!0,premultipliedAlpha:!0,antialias:Y<1.5,depth:!0,stencil:!1,powerPreference:"high-performance"});if(!Se||!re||!e)return;let I=!!e.getExtension("EXT_color_buffer_float"),O=ot(e,Do(I),Bo(I)),z=I?ot(e,Rt,_o):null,_=I?ot(e,Rt,ko):null,B=ot(e,Rt,Ho),X=ot(e,Rt,Oo),ge=ot(e,Rt,Uo),Le=ot(e,No,Io);if(!O||!B||!X||!ge||!Le)return;let Ze=n=>n.preventDefault(),ee=()=>Ie(n=>n+1);re.addEventListener("webglcontextlost",Ze),re.addEventListener("webglcontextrestored",ee);let Te=e.createVertexArray(),$e=I?e.RGBA16F:e.RGBA8,he=(n,c,v,S)=>{let E=e.createTexture();return e.bindTexture(e.TEXTURE_2D,E),e.texStorage2D(e.TEXTURE_2D,1,v,n,c),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,S),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,S),E},Xe=()=>({texture:null,framebuffer:e.createFramebuffer(),depth:null,width:0,height:0}),Ye=(n,c,v,S)=>{n.texture&&n.width===c&&n.height===v||(n.texture&&e.deleteTexture(n.texture),n.texture=he(c,v,$e,e.CLAMP_TO_EDGE),n.width=c,n.height=v,e.bindFramebuffer(e.FRAMEBUFFER,n.framebuffer),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,n.texture,0),S&&(n.depth||(n.depth=e.createRenderbuffer()),e.bindRenderbuffer(e.RENDERBUFFER,n.depth),e.renderbufferStorage(e.RENDERBUFFER,e.DEPTH_COMPONENT24,c,v),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.DEPTH_ATTACHMENT,e.RENDERBUFFER,n.depth)))},pe=Xe(),G=Array.from({length:xo},()=>[Xe(),Xe()]),oe=_?[0,1].map(()=>{let n=he(St,St,e.RG16F,e.REPEAT),c=e.createFramebuffer();return e.bindFramebuffer(e.FRAMEBUFFER,c),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,n,0),e.clearColor(0,0,0,0),e.clear(e.COLOR_BUFFER_BIT),{texture:n,framebuffer:c}}):null,ke=he(1,1,e.RGBA8,e.REPEAT),V={texture:null,heights:null,framebuffer:e.createFramebuffer(),width:0,height:0},He=0,Pt=(n,c)=>{V.texture&&n<=V.width&&c<=V.height||(V.texture&&e.deleteTexture(V.texture),V.heights&&e.deleteTexture(V.heights),V.width=Math.max(n,Math.ceil(V.width*1.25),64),V.height=Math.max(c,Math.ceil(V.height*1.25),64),V.texture=he(V.width,V.height,e.RGBA16F,e.CLAMP_TO_EDGE),V.heights=he(V.width,V.height,e.R32F,e.CLAMP_TO_EDGE),e.bindTexture(e.TEXTURE_2D,V.heights),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST),e.bindFramebuffer(e.FRAMEBUFFER,V.framebuffer),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,V.texture,0),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT1,e.TEXTURE_2D,V.heights,0),e.drawBuffers([e.COLOR_ATTACHMENT0,e.COLOR_ATTACHMENT1]))},Ee=(n,c)=>{e.activeTexture(e.TEXTURE0+n),e.bindTexture(e.TEXTURE_2D,c)},j=window.matchMedia?.("(prefers-reduced-motion: reduce)").matches??!1,R=new Float32Array(16),K=new Float32Array(Gt*4),L=new Float32Array(12),ne={until:0,next:1.5,roll:0,seed:0},Oe=7919,se=()=>(Oe=Oe*16807%2147483647,(Oe-1)/2147483646),xe=[],ie={x:0,y:0,inside:!1},N={width:1,height:1,ratio:1,cell:.05,cellKey:""},a={intro:ve.current.intro&&!j?0:1,rise:1,travelX:0,travelZ:0,morph:0,yaw:0,pitch:0,yawVelocity:0,pitchVelocity:0,presence:0,focus:po,hit:null,brushFrom:null,sculptLife:0,burst:null,level:0,trace:0,clock:0,tilt:ve.current.tilt,elevation:ve.current.elevation,scale:ve.current.scale};a.rise=tt(a.intro);let Ke=0,at=0,Qe=!0,T=0,ue=()=>{let n=Math.min(a.tilt*Math.PI/180+a.pitch,Math.PI/2-1e-4),c=qo(a.yaw,n),v=a.elevation*bt*a.rise*.18,S=a.elevation*bt*a.rise*1.3+.9,E=Math.max(po,(S-v)/Math.sin(n));return{...c,distance:E,eye:[-c.f[0]*E,v-c.f[1]*E,-c.f[2]*E]}},$=(n,c,v)=>{let S=N.width/N.height,E=ro(S),U=[0,1,2].map(t=>n.f[t]+n.r[t]*c*E*S+n.u[t]*v*E),te=Math.hypot(U[0],U[1],U[2]);return U.map(t=>t/te)},dt=(n,c)=>c[0]*n.f[0]+c[1]*n.f[1]+c[2]*n.f[2],Pe=(n,c)=>{let v=$(n,0,c);return v[1]>-.001?1/0:n.eye[1]/-v[1]*dt(n,v)},zt=(n,c)=>[Pe(n,-1)*.9,n.distance,c.foreground],Jt=(n,c,v,S)=>{let E=(v-n.eye[0])*n.f[0]-n.eye[1]*n.f[1]+(S-n.eye[2])*n.f[2];return c[2]+(1-c[2])*tt((E-c[0])/Math.max(c[1]-c[0],.001))},_t=(n,c,v,S)=>{let E=$(n,v,S),U=a.elevation*bt*a.rise,te=Ft/a.scale,t=zt(n,c),i=o=>{let f=n.eye[0]+E[0]*o,h=n.eye[2]+E[2]*o,y=yo(a.travelX+f,a.travelZ+h,te,a.morph*.37,a.morph*.23);return n.eye[1]+E[1]*o-y*U*Jt(n,t,f,h)},s=ut,u=i(s);for(let o=0;o<200&&s<Vt*.5;o++){let f=s+Math.max(.02,u*.4),h=i(f);if(h<0){let y=s,r=f;for(let b=0;b<10;b++){let M=(y+r)*.5;i(M)<0?r=M:y=M}return{x:a.travelX+n.eye[0]+E[0]*r,y:n.eye[1]+E[1]*r,z:a.travelZ+n.eye[2]+E[2]*r,depth:r*dt(n,E)}}s=f,u=h}return null},eo=(n,c,v)=>{let S=a.elevation*bt*a.rise*1.7+.2+c.mouseStrength,E={minX:1/0,maxX:-1/0,minZ:1/0,maxZ:-1/0,near:1/0},U=(te,t)=>{let i=n.eye[0]+te[0]*t,s=n.eye[2]+te[2]*t;E.minX=Math.min(E.minX,i),E.maxX=Math.max(E.maxX,i),E.minZ=Math.min(E.minZ,s),E.maxZ=Math.max(E.maxZ,s)};for(let te of[-1.08,0,1.08])for(let t of[-1.08,1.08]){let i=$(n,te,t),s=Math.max(dt(n,i),.001),u=ut,o=v*1.05/s;i[1]<-1e-4&&(u=Math.max(ut,(n.eye[1]-S)/-i[1]),o=Math.min(o,n.eye[1]/-i[1])),u=Math.min(u,o),U(i,u),U(i,o),E.near=Math.min(E.near,u*s)}return E},Dt=(n,c)=>{let v=Math.floor(a.travelX/c),S=Math.floor(a.travelZ/c),E=a.travelX-v*c,U=a.travelZ-S*c,te=Math.floor((n.minX+E)/c)-2,t=Math.floor((n.minZ+U)/c)-2,i=ae(Math.ceil((n.maxX+E)/c)+2-te,1,4e3),s=ae(Math.ceil((n.maxZ+U)/c)+2-t,1,Math.floor(oo*1.5/i));return{cell:c,camX:v,camZ:S,fracX:E,fracZ:U,k0:te,m0:t,columns:i,rows:s}},mt=()=>{let n=ve.current,c=ue();Wo(c,N.width/N.height,R);let v=Pe(c,-1),S=Math.min(Pe(c,1),c.distance*3.2),E=Math.max(S,v*1.6,c.distance*1.4),U=E+(v*1.8-E)*n.fog,te=U*.7+(v*.7-U*.7)*n.fog,t=eo(c,n,U),i=`${N.width}x${N.height}@${N.ratio}|${Math.round(a.tilt/4)}|${Math.round(a.elevation*5)}|${n.fog}`;if(i!==N.cellKey){N.cellKey=i;let w=N.height*N.ratio*.5/ro(N.width/N.height),D=ae(14*Math.max(t.near,.5)/w,.02,.4),P=(t.maxX-t.minX)*(t.maxZ-t.minZ)/(D*D);P>oo&&(D*=Math.sqrt(P/oo)),N.cell=D}let s=Go(n.color),u=a.elevation*bt*a.rise,o=Dt(t,N.cell),f=zt(c,n),h=n.markers>=0?Dt(t,zo):null,r=(a.hit&&n.mouseInteraction?a.presence:0)*(.35+.5*n.mouseStrength),b=n.depthOfField*N.height*.016,M=tt(a.intro/.35),H=a.hit?a.hit.x:0,Q=a.hit?a.hit.z:0;if(K.fill(0),xe.forEach((w,D)=>{K.set([w.x,w.z,w.age*4.2,Math.exp(-w.age*1.1)*tt(w.age/.08)],D*4)}),e.bindVertexArray(Te),z){let w=o.columns+7,D=o.rows+7;Pt(w,D),e.bindFramebuffer(e.FRAMEBUFFER,V.framebuffer),e.viewport(0,0,w,D),e.useProgram(z.program);let P=z.uniforms;Ee(0,oe?oe[He].texture:ke),e.uniform1i(P.uSculpt,0),e.uniform1f(P.uSculptOn,oe?1:0),e.uniform1f(P.uFrequency,Ft/a.scale),e.uniform2f(P.uMorph,a.morph*.37,a.morph*.23),e.uniform4fv(P.uPulses,K),e.uniform2i(P.uBase,o.k0-2+o.camX,o.m0-2+o.camZ),e.uniform1f(P.uCell,o.cell),e.uniform1f(P.uDetail,n.detail),e.disable(e.DEPTH_TEST),e.disable(e.BLEND),e.drawArrays(e.TRIANGLES,0,3)}let Z=(w,D,P,q)=>{e.viewport(0,0,D,P),e.useProgram(O.program);let m=O.uniforms;if(Ee(0,z?V.texture:ke),e.uniform1i(m.uField,0),Ee(1,z?V.heights:ke),e.uniform1i(m.uHeightField,1),e.uniform1f(m.uFrequency,Ft/a.scale),e.uniform2f(m.uMorph,a.morph*.37,a.morph*.23),e.uniform4fv(m.uPulses,K),e.uniform2i(m.uOrigin,o.k0,o.m0),e.uniform2i(m.uCamCell,o.camX,o.camZ),e.uniform2f(m.uCamFrac,o.fracX,o.fracZ),e.uniform1f(m.uCell,o.cell),e.uniform1i(m.uStride,q),e.uniform1f(m.uHeight,u),e.uniform3fv(m.uEye,c.eye),e.uniform3fv(m.uForward,c.f),e.uniform3fv(m.uNear,f),e.uniform1f(m.uRefDepth,c.distance),e.uniformMatrix4fv(m.uViewProj,!1,R),e.uniform1f(m.uDetail,n.detail),e.uniform1f(m.uLines,n.lineCount),e.uniform1f(m.uLineWidth,n.lineWidth*w),e.uniform1f(m.uMajor,n.majorLines?1:0),e.uniform3fv(m.uColor,s),e.uniform1f(m.uBrightness,n.brightness),e.uniform2f(m.uFade,te,U),e.uniform3f(m.uFocus,a.focus,b*w,N.height*.03*w),e.uniform4f(m.uHeat,H,Q,.9*n.mouseRadius,r),e.uniform4f(m.uLamp,H,a.hit?a.hit.y+1.4:0,Q,r),e.uniform4f(m.uTrace,a.level,a.trace,H,Q),e.uniform3fv(m.uSun,Co),e.uniform1f(m.uReveal,M),e.uniform1f(m.uLightMode,n.lightMode?1:0),e.uniform1f(m.uOpacity,n.opacity),e.uniform4fv(m.uGlitch,L),e.uniform1f(m.uGlitchSeed,ne.seed),e.uniform1f(m.uPixel,w),e.enable(e.DEPTH_TEST),e.depthFunc(e.LESS),e.disable(e.BLEND),e.clearColor(0,0,0,0),e.clearDepth(1),e.clear(e.COLOR_BUFFER_BIT|e.DEPTH_BUFFER_BIT),e.drawArraysInstanced(e.TRIANGLE_STRIP,0,2*(Math.ceil(o.columns/q)+1),Math.ceil(o.rows/q)),h){e.useProgram(Le.program);let C=Le.uniforms;Ee(2,oe?oe[He].texture:ke),e.uniform1i(C.uSculpt,2),e.uniform1f(C.uSculptOn,oe?1:0),e.uniform1f(C.uFrequency,Ft/a.scale),e.uniform2f(C.uMorph,a.morph*.37,a.morph*.23),e.uniform4fv(C.uPulses,K),e.uniform3fv(C.uEye,c.eye),e.uniform3fv(C.uForward,c.f),e.uniform3fv(C.uNear,f),e.uniform2i(C.uOrigin,h.k0,h.m0),e.uniform2i(C.uCamCell,h.camX,h.camZ),e.uniform2f(C.uCamFrac,h.fracX,h.fracZ),e.uniform1f(C.uSpacing,h.cell),e.uniform1i(C.uColumns,h.columns+1),e.uniform1f(C.uHeight,u),e.uniformMatrix4fv(C.uViewProj,!1,R),e.uniform2f(C.uView,D,P),e.uniform1f(C.uSize,4*w),e.uniform1f(C.uRefDepth,c.distance),e.uniform4f(C.uHeat,H,Q,1.2*n.mouseRadius,r),e.uniform1f(C.uTime,a.clock),e.uniform4fv(C.uGlitch,L),e.uniform1f(C.uPixel,w),e.uniform3fv(C.uColor,s),e.uniform2f(C.uFade,te,U),e.uniform1f(C.uReveal,M),e.uniform1f(C.uBrightness,n.brightness),e.uniform1f(C.uLightMode,n.lightMode?1:0),e.uniform1f(C.uOpacity,n.opacity),e.uniform1f(C.uStyle,n.markers),e.depthFunc(e.LEQUAL),e.depthMask(!1),e.enable(e.BLEND),e.blendFunc(e.ONE,e.ONE_MINUS_SRC_ALPHA),e.drawArraysInstanced(e.TRIANGLE_STRIP,0,4,(h.columns+1)*(h.rows+1)),e.disable(e.BLEND),e.depthMask(!0)}e.disable(e.DEPTH_TEST)},W=n.glow>.001;if(W){let w=Math.max(1,Math.round(N.width/2)),D=Math.max(1,Math.round(N.height/2));Ye(pe,w,D,!0),G.forEach((q,m)=>{let C=Math.max(1,Math.round(N.width/2**(m+2))),Fe=Math.max(1,Math.round(N.height/2**(m+2)));Ye(q[0],C,Fe,!1),Ye(q[1],C,Fe,!1)}),e.bindFramebuffer(e.FRAMEBUFFER,pe.framebuffer),Z(.5,w,D,2);let P=pe;G.forEach(([q,m])=>{e.bindFramebuffer(e.FRAMEBUFFER,q.framebuffer),e.viewport(0,0,q.width,q.height),e.useProgram(B.program),Ee(0,P.texture),e.uniform1i(B.uniforms.uSource,0),e.uniform2f(B.uniforms.uTarget,q.width,q.height),e.uniform2f(B.uniforms.uTexel,1/P.width,1/P.height),e.drawArrays(e.TRIANGLES,0,3),e.useProgram(X.program),e.uniform1i(X.uniforms.uSource,0),e.uniform2f(X.uniforms.uTarget,m.width,m.height),e.bindFramebuffer(e.FRAMEBUFFER,m.framebuffer),Ee(0,q.texture),e.uniform2f(X.uniforms.uStep,1/q.width,0),e.drawArrays(e.TRIANGLES,0,3),e.bindFramebuffer(e.FRAMEBUFFER,q.framebuffer),Ee(0,m.texture),e.uniform2f(X.uniforms.uStep,0,1/m.height),e.drawArrays(e.TRIANGLES,0,3),P=q})}if(e.bindFramebuffer(e.FRAMEBUFFER,null),Z(N.ratio,re.width,re.height,1),W){e.viewport(0,0,re.width,re.height),e.useProgram(ge.program);let w=ge.uniforms;G.forEach(([D],P)=>{Ee(P,D.texture),e.uniform1i(w[`uBloom${P}`],P)}),e.uniform2f(w.uView,re.width,re.height),e.uniform1f(w.uGlow,n.glow*M),e.uniform1f(w.uLightMode,n.lightMode?1:0),e.enable(e.BLEND),n.lightMode?e.blendFunc(e.ONE,e.ONE_MINUS_SRC_ALPHA):e.blendFunc(e.ONE,e.ONE),e.drawArrays(e.TRIANGLES,0,3),e.disable(e.BLEND)}for(let w=xo;w>=0;w--)Ee(w,null)},it=(n,c)=>{if(!oe||!_)return!1;let v=n.mouseInteraction&&n.hoverEffect==="lift"&&a.presence>.001?a.hit:null,S=a.burst;if(!v&&!S&&a.sculptLife<=0)return!1;let E=a.brushFrom||v,U=oe[He],te=oe[1-He];e.bindFramebuffer(e.FRAMEBUFFER,te.framebuffer),e.viewport(0,0,St,St),e.useProgram(_.program);let t=_.uniforms;if(Ee(0,U.texture),e.uniform1i(t.uPrevious,0),v&&E?e.uniform4f(t.uSegment,E.x,E.z,v.x,v.z):e.uniform4f(t.uSegment,0,0,0,0),e.uniform4f(t.uBrush,1.1*n.mouseRadius,.9*n.mouseStrength,1-Math.exp(-c*7),v?a.presence:0),S){let s=tt(S.age/.7);S.age+=c;let u=(tt(S.age/.7)-s)*.9*Math.max(n.mouseStrength,.3);e.uniform4f(t.uBurst,S.x,S.z,1.6*n.mouseRadius,u),S.age>=.7&&(a.burst=null)}else e.uniform4f(t.uBurst,0,0,1,0);let i=.25+3*n.trail*n.trail;return e.uniform2f(t.uDecay,Math.exp(-c/i),Math.exp(-c/.7)),e.disable(e.BLEND),e.drawArrays(e.TRIANGLES,0,3),He=1-He,a.brushFrom=v?{x:v.x,z:v.z}:null,v||S?a.sculptLife=i*6:a.sculptLife-=c,!0},Bt=ve.current.dpr,vt=()=>{let n=ve.current;Bt=n.dpr,N.width=Math.max(1,Se.clientWidth),N.height=Math.max(1,Se.clientHeight),N.ratio=Math.min(n.dpr||window.devicePixelRatio||1,2),re.width=Math.max(1,Math.round(N.width*N.ratio)),re.height=Math.max(1,Math.round(N.height*N.ratio)),mt(),be()},pt=n=>{if(Ke=0,!Qe||document.hidden)return;let c=ve.current;c.dpr!==Bt&&vt();let v=at?ae((n-at)/1e3,0,1/20):1/60;at=n,!c.intro||j?a.intro=1:a.intro<1&&(a.intro=Math.min(1,a.intro+v/Ao)),a.rise=tt(a.intro);let S=j?1:1-Math.exp(-v/.4);a.tilt+=(c.tilt-a.tilt)*S,a.elevation+=(c.elevation-a.elevation)*S,a.scale=c.scale,a.clock+=v;let E=j?0:c.glitch;if(E>0)if(a.clock>=ne.next&&a.clock>=ne.until&&(ne.until=a.clock+.1+se()*.22*(.5+E),ne.next=ne.until+(9-7.4*E)*(.45+se()*1.1),ne.roll=0),a.clock<ne.until){if(a.clock>=ne.roll){L.fill(0);let M=1+Math.floor(se()*3);for(let H=0;H<M;H++){let Q=3+se()*se()*N.height*.14,Z=se()*N.height,W=(se()-.5)*2*(10+46*E);L.set([Z,Z+Q,W,1+se()*3*E],H*4)}ne.seed=se(),ne.roll=a.clock+.04+se()*.05}}else L.fill(0);else L.fill(0);j||(a.travelX+=c.direction[0]*c.speed*.8*v,a.travelZ+=c.direction[1]*c.speed*.8*v,a.morph+=c.morph*.12*v);let U=ie.inside&&c.mouseInteraction;a.presence+=((U?1:0)-a.presence)*(1-Math.exp(-v/(U?.18:.45)));let te=ie.x/N.width*2-1,t=1-ie.y/N.height*2,i=j||!U?0:c.parallax,s=te*i*.09,u=-t*i*.045;a.yawVelocity+=(38*(s-a.yaw)-11*a.yawVelocity)*v,a.pitchVelocity+=(38*(u-a.pitch)-11*a.pitchVelocity)*v,a.yaw+=a.yawVelocity*v,a.pitch+=a.pitchVelocity*v;let o=ue();U?(a.hit=_t(o,c,te,t),a.hit&&a.brushFrom&&Math.hypot(a.hit.x-a.brushFrom.x,a.hit.z-a.brushFrom.z)>3*c.mouseRadius&&(a.brushFrom=null)):a.presence<.002&&(a.hit=null,a.brushFrom=null);let f=a.hit&&c.mouseInteraction&&c.hoverEffect==="trace"?a.presence:0;if(a.hit){let M=Ft/a.scale,H=yo(a.hit.x,a.hit.z,M,a.morph*.37,a.morph*.23)+c.detail*.1*Xo(a.hit.x,a.hit.z,M);a.level=a.trace<.01?H:a.level+(H-a.level)*(1-Math.exp(-v/.09))}a.trace+=(f-a.trace)*(1-Math.exp(-v/.2));let h=a.hit&&c.depthOfField>0?a.hit.depth:o.distance;a.focus+=(h-a.focus)*(1-Math.exp(-v/.35));for(let M=xe.length-1;M>=0;M--)xe[M].age+=v,xe[M].age>4&&xe.splice(M,1);let y=it(c,v);mt();let r=Math.abs(c.tilt-a.tilt)>.01||Math.abs(c.elevation-a.elevation)>1e-4||Math.abs(a.yaw-s)>1e-4||Math.abs(a.pitch-u)>1e-4||Math.abs(a.yawVelocity)>1e-4||Math.abs(a.pitchVelocity)>1e-4||Math.abs(h-a.focus)>.001||Math.abs(f-a.trace)>.001;T=!j&&(c.speed!==0||c.morph!==0||c.glitch>0||c.markers>=0)||a.intro<1||xe.length>0||y||r||a.presence>.001&&a.presence<.999?0:T+v,T<.5&&(Ke=requestAnimationFrame(pt))};function be(){T=0,!Ke&&Qe&&!document.hidden&&(at=0,Ke=requestAnimationFrame(pt))}let xt=n=>{let c=Se.getBoundingClientRect(),v=n.clientX-c.left,S=n.clientY-c.top;return{x:v,y:S,inside:v>=0&&S>=0&&v<=c.width&&S<=c.height}},gt=n=>{let{x:c,y:v,inside:S}=xt(n),E=ie.inside;ie.inside=S,S&&(ie.x=c,ie.y=v),(S||E)&&be()},Ae=n=>{let c=ve.current,{x:v,y:S,inside:E}=xt(n);if(!E||(ie.x=v,ie.y=S,ie.inside=!0,be(),c.glitch>0&&!j&&(ne.until=a.clock+.16,ne.roll=0),!c.mouseInteraction||c.clickEffect!=="pulse"&&c.clickEffect!=="peak"))return;let U=_t(ue(),c,v/N.width*2-1,1-S/N.height*2);U&&(c.clickEffect==="peak"&&oe?a.burst={x:U.x,z:U.z,age:0}:c.clickEffect==="pulse"&&(xe.length>=Gt&&xe.shift(),xe.push({x:U.x,z:U.z,age:0})))},Ge=n=>{n.pointerType==="touch"&&(ie.inside=!1,be())},yt=()=>{ie.inside=!1,be()},wt=()=>be(),Nt=new ResizeObserver(vt);Nt.observe(Se);let Mt=new IntersectionObserver(n=>{Qe=n.some(c=>c.isIntersecting),Qe&&be()});return Mt.observe(Se),window.addEventListener("pointermove",gt,{passive:!0}),window.addEventListener("pointerdown",Ae,{passive:!0}),window.addEventListener("pointerup",Ge,{passive:!0}),window.addEventListener("pointercancel",Ge,{passive:!0}),document.documentElement.addEventListener("pointerleave",yt),document.addEventListener("visibilitychange",wt),vt(),Ve.current=be,()=>{cancelAnimationFrame(Ke),Ve.current=null,Nt.disconnect(),Mt.disconnect(),window.removeEventListener("pointermove",gt),window.removeEventListener("pointerdown",Ae),window.removeEventListener("pointerup",Ge),window.removeEventListener("pointercancel",Ge),document.documentElement.removeEventListener("pointerleave",yt),document.removeEventListener("visibilitychange",wt),re.removeEventListener("webglcontextlost",Ze),re.removeEventListener("webglcontextrestored",ee),[pe,...G.flat()].forEach(n=>{n.texture&&e.deleteTexture(n.texture),n.depth&&e.deleteRenderbuffer(n.depth),e.deleteFramebuffer(n.framebuffer)}),oe?.forEach(n=>{e.deleteTexture(n.texture),e.deleteFramebuffer(n.framebuffer)}),e.deleteTexture(ke),e.deleteVertexArray(Te),V.texture&&e.deleteTexture(V.texture),V.heights&&e.deleteTexture(V.heights),e.deleteFramebuffer(V.framebuffer),[O,z,_,B,X,ge,Le].forEach(n=>n&&e.deleteProgram(n.program)),e.getExtension("WEBGL_lose_context")?.loseContext()}},[F]),st(()=>{Ve.current?.()}),De("div",{ref:je,className:`topography-container ${Ne}`.trim(),style:g,children:De("canvas",{ref:Me,className:"topography-canvas","aria-hidden":"true"})})},Mo=jo;var Eo=document.documentElement,Zo=window.matchMedia?.("(prefers-reduced-motion: reduce)").matches??!1,no=window.matchMedia?.("(max-width: 760px)").matches??!1,$o=()=>{try{let x=document.createElement("canvas").getContext("webgl2");return x?(x.getExtension("WEBGL_lose_context")?.loseContext(),!0):!1}catch{return!1}},Yo=()=>{document.querySelectorAll("[data-legal-fall]").forEach(l=>{let x=l.getAttribute("data-legal-fall");!x||l.dataset.mounted||(Ot(De(lo,{text:x,trigger:"click",variant:"tile",split:"words",order:"random",stagger:.045,gravity:1.05,bounciness:.18,scatter:.24,restoreDelay:4.2,cursorPush:.35,fontSize:no?"0.78rem":"0.92rem",accentColor:"#28e0c8",theme:"dark",draggable:!0,className:"legal-fall__body"}),l),l.dataset.mounted="true")})},Ko=()=>{if(document.querySelector(".legal-scene"))return;let l=document.createElement("div");l.className="legal-scene",l.setAttribute("aria-hidden","true");let x=document.createElement("div");x.className="legal-scene__topo";let p=document.createElement("div");p.className="legal-scene__balls",l.append(x,p),document.body.prepend(l),Eo.dataset.legalScene="live",Ot(De(Mo,{color:"#28e0c8",lineCount:no?18:24,lineWidth:1.3,majorLines:!0,elevation:1.15,foreground:.28,scale:1.05,detail:.4,tilt:38,speed:.14,direction:"forward",morph:.6,glow:1,depthOfField:.5,fog:.5,brightness:1.6,opacity:1,mouseInteraction:!0,hoverEffect:"trace",mouseRadius:2.2,mouseStrength:1.1,trail:.42,parallax:.8,clickEffect:"pulse",markers:"dots",glitch:.24,dpr:1.5}),x),Ot(De(vo,{count:no?44:90,colors:["#eef3f5","#28e0c8","#ff3d81"],material:"metal",minSize:.38,maxSize:1,gravity:.34,friction:.998,wallBounce:.92,bounce:.82,depth:2.4,drift:.22,followCursor:!0,cursorSize:.9,grab:!0,clickEffect:"burst",lightColor:"#ff3d81",lightIntensity:1.15,exposure:1.2,shadows:.38,dpr:1.5}),p)};Zo?Eo.dataset.legalStatic="true":(Yo(),$o()&&Ko());
