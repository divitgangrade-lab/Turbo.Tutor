import{g as C,i as V,j as m,l as f,p as l}from"./island-chunks/chunk-AA5OBDBZ.js";import"./island-chunks/chunk-SSQABL5H.js";var N=`#version 300 es
void main() {
  vec2 corner = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  gl_Position = vec4(corner * 2.0 - 1.0, 0.0, 1.0);
}`,O=`#version 300 es
precision highp float;

uniform vec2 resolution;
uniform float time;

out vec4 fragColor;

#define TWO_PI 6.2831853072
#define PI 3.14159265359

void main(void) {
  vec2 uv = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
  float t = time * 0.05;
  float lineWidth = 0.002;

  vec3 color = vec3(0.0);
  for (int j = 0; j < 3; j++) {
    for (int i = 0; i < 5; i++) {
      color[j] += lineWidth * float(i * i) / abs(fract(t - 0.01 * float(j) + float(i) * 0.01) * 5.0 - length(uv) + mod(uv.x + uv.y, 0.2));
    }
  }

  fragColor = vec4(color, 1.0);
}`,k=(e,o,s)=>{let t=e.createShader(o);return t?(e.shaderSource(t,s),e.compileShader(t),e.getShaderParameter(t,e.COMPILE_STATUS)?t:(console.error(e.getShaderInfoLog(t)),e.deleteShader(t),null)):null},W=(e,o,s)=>{let t=k(e,e.VERTEX_SHADER,o),i=k(e,e.FRAGMENT_SHADER,s),r=t&&i?e.createProgram():null;return!t||!i||!r?(t&&e.deleteShader(t),i&&e.deleteShader(i),null):(e.attachShader(r,t),e.attachShader(r,i),e.linkProgram(r),e.deleteShader(t),e.deleteShader(i),e.getProgramParameter(r,e.LINK_STATUS)?{program:r,time:e.getUniformLocation(r,"time"),resolution:e.getUniformLocation(r,"resolution")}:(console.error(e.getProgramInfoLog(r)),e.deleteProgram(r),null))},q=({className:e="",active:o=!0})=>{let s=f(null),t=f(null),i=f(null),r=f(o);return r.current=o,m(()=>{i.current?.()},[o]),m(()=>{let v=s.current,a=t.current;if(!v||!a)return;let n=a.getContext("webgl2",{alpha:!1,depth:!1,stencil:!1,antialias:!1,powerPreference:"high-performance"});if(!n)return;let h=W(n,N,O);if(!h)return;let x=n.createVertexArray();n.bindVertexArray(x);let S=window.matchMedia("(prefers-reduced-motion: reduce)").matches,u=0,w=0,L=1,p=!0,E=document.visibilityState!=="hidden",A=()=>{n.viewport(0,0,a.width,a.height),n.useProgram(h.program),n.uniform2f(h.resolution,a.width,a.height),n.uniform1f(h.time,L),n.drawArrays(n.TRIANGLES,0,3)},y=c=>{if(u=0,!r.current||!p||!E)return;let d=w?Math.min(.05,(c-w)/1e3):0;w=c,S||(L+=d*3),A(),S||(u=requestAnimationFrame(y))},g=()=>{u||S||!r.current||!p||!E||(w=0,u=requestAnimationFrame(y))};i.current=g;let P=()=>{let c=v.getBoundingClientRect(),d=Math.min(window.devicePixelRatio||1,1.5,Math.sqrt(24e5/Math.max(1,c.width*c.height))),M=Math.max(1,Math.round(c.width*d)),T=Math.max(1,Math.round(c.height*d));(a.width!==M||a.height!==T)&&(a.width=M,a.height=T),A()},R=new ResizeObserver(P);R.observe(v);let _=new IntersectionObserver(c=>{p=c.some(d=>d.isIntersecting),g()});_.observe(v);let I=()=>{E=document.visibilityState!=="hidden",g()};return document.addEventListener("visibilitychange",I),P(),g(),()=>{cancelAnimationFrame(u),i.current=null,R.disconnect(),_.disconnect(),document.removeEventListener("visibilitychange",I),n.isContextLost()||(n.deleteVertexArray(x),n.deleteProgram(h.program))}},[]),l("div",{ref:s,className:`shader-animation${e?` ${e}`:""}`,children:l("canvas",{ref:t,className:"shader-animation__canvas","aria-hidden":"true"})})},F=q;var b=document.getElementById("shader-animation-mount"),G=document.querySelector(".tt-loader"),D=()=>{try{let e=document.createElement("canvas").getContext("webgl2");return e?(e.getExtension("WEBGL_lose_context")?.loseContext(),!0):!1}catch{return!1}},U=()=>{let[e,o]=V(()=>!(G&&G.classList.contains("is-hidden")));return m(()=>{let s=()=>o(!0),t=()=>o(!1);return window.addEventListener("tt:loader-show",s),window.addEventListener("tt:loader-hidden",t),()=>{window.removeEventListener("tt:loader-show",s),window.removeEventListener("tt:loader-hidden",t)}},[]),l(F,{active:e})};b&&D()&&(C(l(U,{}),b),b.dataset.mounted="true");
