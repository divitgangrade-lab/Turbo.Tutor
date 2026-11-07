var y,_t,$t,j,Be,Ce,ct,Te,ft,Ve,Oe,jt,me=Symbol.for("pv"),Me={},Pe=[],Yt=/^m(i|n|o|s|text|space)$/,Ue=Array.isArray,lt=Pe.slice,ee=Object.assign;function Q(e){e&&e.parentNode&&e.remove()}function Se(e,t,r,a,i){var u={type:e,props:t,key:r,ref:a,__k:null,__:null,__b:0,__e:null,__c:null,constructor:me,__v:i||++_t,__i:-1,__u:0};return!i&&y.vnode&&y.vnode(u),u}function q(e){return e.children}function Y(e,t){this.props=e,this.context=t,this.__g=0}function K(e,t){if(t==null)return e.__&&K(e.__,e.__i+1);for(var r;t<e.__k.length;t++)if((r=e.__k[t])&&r.__e)return r.__e;return typeof e.type!="function"||e.props.__P?null:K(e)}function Kt(e){var t,r=e.__v,a=r.__e,i=[],u=[],s=e.__P;s&&((t=ee({constructor:me},r)).__v=r.__v+1,y.vnode&&y.vnode(t),We(s,t,r,e.__n,s.namespaceURI,32&r.__u?[a]:null,i,a||K(r),32&r.__u,u),t.__v=r.__v,t.__.__k[t.__i]=t,gt(i,t,u),r.__=r.__e=null,t.__e!=a&&pt(t))}function pt(e){if((e=e.__)&&e.__c&&!e.props.__P)return e.__e=null,e.__k.some(function(t){return t&&(e.__e=t.__e)}),pt(e)}function ut(e){(8&e.__g||(e.__g|=8,j.push(e),Ce++))&&Be==y.debounceRendering||((Be=y.debounceRendering)||queueMicrotask)(dt)}function dt(){try{for(var e,t=1;j.length;)j.length>t&&j.sort(ct),e=j.shift(),t=j.length,8&e.__g&&Kt(e)}finally{(Ce=j.length)&&(Be||queueMicrotask)(dt)}}function mt(e,t,r,a,i,u,s,_,l,p,c){var v,m,o,d,S,E,k=a.__k||Pe,b=t.length;for(l=Zt(r,t,k,l,b),v=0;v<b;v++)(o=r.__k[v])!=null&&(m=~o.__i&&k[o.__i]||Me,o.__i=v,E=We(e,o,m,i,u,s,_,l,p,c),d=o.__e,(m.ref!=o.ref||8&m.__u)&&(m.ref&&Xe(m.ref,null,o,m),o.ref&&c.push(o.ref,o.__c||d,o)),S=S||d,4&o.__u?(l=ht(o,l,e,!m.__v),m.__e&&(m.__e=null)):typeof o.type=="function"&&E!==void 0?l=E:d&&(l=d.nextSibling),o.__u&=-21);return r.__e=S,l}function Zt(e,t,r,a,i){var u,s,_,l,p,c,v,m,o,d=r.length,S=d,E=0,k=0,b=e.__k=Array(i);for(u=0;u<i;u++)(s=t[u])!=null&&typeof s!="boolean"&&typeof s!="function"?(typeof s!="object"||s.constructor===String?s=b[u]=Se(null,s):Ue(s)?s=b[u]=Se(q,{children:s}):s.constructor===me&&s.__b?s=b[u]=Se(s.type,s.props,s.key,s.ref,s.__v):b[u]=s,l=u+E,s.__=e,s.__b=e.__b+1,_=null,~(p=s.__i=Jt(s,r,l,S))&&(S--,(_=r[p])&&(_.__u|=2)),_&&_.__v?(s.__u|=16,p==l-1?E--:p==l+1?E++:p!=l&&(p>l?E--:E++,k=1)):(~p||(i>d?E--:i<d&&E++),typeof s.type!="function"&&(s.__u|=4))):b[u]=null;if(k){for(c=[],v=[],u=0;u<i;u++)if((s=b[u])&&16&s.__u){for(E=0,m=c.length;E<m;)c[o=E+m>>1]<s.__i?E=o+1:m=o;c[E]=s.__i,v[u]=E+1}for(E=c.length;u--;)v[u]&&(v[u]==E?E--:b[u].__u|=4)}if(S)for(u=0;u<d;u++)!(_=r[u])||2&_.__u||(_.__e==a&&(a=K(_)),ze(_,_));return a}function ht(e,t,r,a){var i,u,s,_;if(typeof e.type=="function"){if(e.props.__P)return t;if(i=e.__k)for(u=0;u<i.length;u++)i[u]&&(i[u].__=e,t=ht(i[u],t,r,!1));return t}for(t&&!t.parentNode&&(t=K(e))&&!t.parentNode&&(t=null),s=e.__e,_=t;_&&_.nodeType==8;)_=_.nextSibling;for(s!=_&&(!a&&r.moveBefore&&s.parentNode?r.moveBefore(s,t):r.insertBefore(s,t||null)),t=s;(t=t&&t.nextSibling)&&t.nodeType==8&&!t.data.startsWith("$s"););return t}function He(e,t){return t=t||[],e!=null&&typeof e!="boolean"&&(Ue(e)?e.some(function(r){He(r,t)}):t.push(e)),t}function Jt(e,t,r,a){var i,u=e.key,s=e.type,_=t[r],l=_&&!(2&_.__u);if(_===null&&u==null||l&&u==_.key&&s==_.type)return r;if(a>(l?1:0)){for(i=r-1;i>=0;i--)if((_=t[i])&&!(2&_.__u)&&u==_.key&&s==_.type)return i;for(i=r+1;i<t.length;i++)if((_=t[i])&&!(2&_.__u)&&u==_.key&&s==_.type)return i}return-1}function st(e,t,r){r==null&&(r=""),t[0]=="-"?e.setProperty(t,r):e[t]=r}function we(e,t,r,a,i){var u,s;if(t=="style")if(typeof r=="string")e.style.cssText=r;else{if(typeof a=="string"&&(e.style.cssText=a=""),a)for(t in a)r&&t in r||st(e.style,t);if(r)for(t in r)a&&r[t]==a[t]||st(e.style,t,r[t])}else if(t[0]=="o"&&t[1]=="n")typeof r!="function"&&(r=null),typeof a!="function"&&(a=null),(e.__e||(e.__e={}))[t]=r,r&&a||(s=Oe[t]||(Oe[t]=Qt(t)),(e.__a||(e.__a={}))[t]=Ve,u=t!=(t=t.replace(ft,"$1")),(t=t.slice(2))[0]<"a"&&(t=t.toLowerCase()),r?e.addEventListener(t,s,u):e.removeEventListener(t,s,u));else{if(i=="http://www.w3.org/2000/svg")t=t.replace(/xlink(H|:h)/,"h").replace(/sName$/,"s");else if(t!="width"&&t!="height"&&t!="href"&&t!="list"&&t!="form"&&t!="tabIndex"&&t!="download"&&t!="rowSpan"&&t!="colSpan"&&t!="role"&&t!="popover"&&t in e)try{return void(e[t]=r??"")}catch{}if(typeof r=="function")return;r==null||r===!1&&t[4]!="-"?e.removeAttribute(t):e.setAttribute(t,t=="popover"&&r==1?"":r)}}function Qt(e){return function(t){var r=this.__e;if(r){if(r=r[e],t[Te]==null)t[Te]=Ve++;else if(t[Te]<this.__a[e])return;return r(y.event?y.event(t):t)}}}function We(e,t,r,a,i,u,s,_,l,p){var c,v,m,o,d,S,E,k,b,A,w,se,_e,te,O,ce,B,V,L=t.type;if(t.constructor!==me)return null;128&r.__u&&(l=32&r.__u,c=r.__c.__z)&&(t.__u|=l,v=u=[],c.nodeType==8?_=Ae(c,u):u.push(c),_=u[0]||_),(c=y.__b)&&c(t);e:if(typeof L=="function"){m=s.length;try{if(k=t.props,b=(c=L.prototype)&&c.render,A=(c=L.contextType)&&a[c.__c],w=c?A?A.props.value:c.__:a,(o=r.__c)?(t.__c=o,2&o.__g&&(o.__g|=1)):(b?t.__c=o=new L(k,w):(t.__c=o=new Y(k,w),o.constructor=L,o.render=tr),A&&A.sub(o),o.state||(o.state={}),o.__n=a,o.__g|=8,o.__h=[],o.__k=[]),b&&(o.__s||(o.__s=o.state),L.getDerivedStateFromProps&&(o.__s==o.state&&(o.__s=ee({},o.__s)),ee(o.__s,L.getDerivedStateFromProps(k,o.__s)))),d=o.props,S=o.state,o.__v=t,r.__c){if(k!==d&&b&&!L.getDerivedStateFromProps&&o.componentWillReceiveProps&&o.componentWillReceiveProps(k,w),t.__v==r.__v&&!(8&o.__g)||!(4&o.__g)&&o.shouldComponentUpdate&&o.shouldComponentUpdate(k,o.__s,w)===!1){t.__v!=r.__v&&(o.props=k,o.state=o.__s,o.__g&=-9),t.__e=r.__e,t.__k=r.__k,t.__k.some(function(x){x&&(x.__=t)}),Pe.push.apply(o.__h,o.__k),o.__k=[],o.__h.length&&s.push(o),_=K(r);break e}o.componentWillUpdate&&o.componentWillUpdate(k,o.__s,w),b&&o.componentDidUpdate&&o.__h.push(function(){o.componentDidUpdate(d,S,E)})}else b&&!L.getDerivedStateFromProps&&o.componentWillMount&&o.componentWillMount(),b&&o.componentDidMount&&o.__h.push(o.componentDidMount);o.context=w,o.props=k,o.__P=e,o.__g&=-5,se=y.__r,_e=b?25:0;do o.__g&=-9,se&&se(t),c=o.render(o.props,o.state=o.__s,o.context);while(8&o.__g&&++_e<25);b&&(Pe.push.apply(o.__h,o.__k),o.__k=[]),o.state=o.__s,o.getChildContext&&(a=ee({},a,o.getChildContext())),b&&r.__c&&o.getSnapshotBeforeUpdate&&(E=o.getSnapshotBeforeUpdate(d,S)),te=c&&c.type===q&&c.key==null?c.props.children:c,k.__P&&(c=_,i=(e=k.__P).namespaceURI,l=u=null,r.props&&r.props.__P!=e&&(r.__k.some(function(x){x&&ze(x,x)}),r.__k=null),_=r.__k?K(r,0):null),_=mt(e,Ue(te)?te:[te],t,r,a,i,u,s,_,l,p),k.__P&&(t.__e=null,_=c),t.__u&=-161,v&&v.some(Q),o.__h.length&&s.push(o),1&o.__g&&(o.__g&=-4)}catch(x){if(s.length=m,t.__v=null,l||u)if(x&&x.then){if(t.__u|=128|l,u){for(~(B=u.indexOf(_||void 0))||(B=u.length);(V=u[B-1])&&V.nodeType==8;)B--;for(;B<u.length;B++)if(V=u[B])if(u[B]=null,O){if(V==ce)break}else{if(V.nodeType!=8)break;V.data.startsWith("$s")&&(ce=Ae(O=V))}}if(!O){for(;_&&_.nodeType==8&&_.nextSibling;)_=_.nextSibling;O=_}(c=Ae(O=t.__c.__z||(t.__c.__z=O)))?(t.__e=O,_=c):t.__e=_,_=_&&_.nextSibling}else u&&u.some(Q);else t.__e=r.__e;t.__k||(t.__k=r.__k||[]),x&&x.then||vt(t),y.__e(x,t,r)}}else _=t.__e=er(r.__e,t,r,a,i,u,s,l,p,e);return(c=y.diffed)&&c(t),_}function Ae(e,t){if(e&&e.nodeType==8&&e.data.startsWith("$s"))for(var r=1;e=e.nextSibling;){if(e.nodeType==8){if(e.data.startsWith("$s"))r++;else if(e.data.startsWith("/$s")&&!--r)return e}t&&t.push(e)}}function vt(e){e&&(e.__c&&(e.__c.__g|=4),e.__k&&e.__k.some(vt))}function gt(e,t,r){for(var a=0;a<r.length;)Xe(r[a++],r[a++],r[a++]);y.__c&&y.__c(t,e),e.some(function(i){try{e=i.__h,i.__h=[],e.some(function(u){u.call(i)})}catch(u){y.__e(u,i.__v)}})}function er(e,t,r,a,i,u,s,_,l,p){var c,v,m,o,d,S,E,k,b=r.props||Me,A=t.props,w=t.type;if(w=="svg"?i="http://www.w3.org/2000/svg":w=="math"?i="http://www.w3.org/1998/Math/MathML":i||(i="http://www.w3.org/1999/xhtml"),u){for(c=0;c<u.length;c++)if((d=u[c])&&(w?d.localName==w:d.nodeType==3)){e=d,u[c]=null;break}}if(!e){if(k=p.ownerDocument||document,!w)return k.createTextNode(A);e=k.createElementNS(i,w,A.is?A:p),_&&(y.__m&&y.__m(t,u),_=!1),u=null}if(w){if(p=w=="template"&&e.content||e,u=w=="textarea"&&A.defaultValue!=null?null:u&&lt.call(p.childNodes),!_&&u)for(b={},c=0;c<e.attributes.length;c++)b[(d=e.attributes[c]).name]=d.value;for(c in b)d=b[c],c=="dangerouslySetInnerHTML"?m=d:c=="children"||c in A||c=="value"&&"defaultValue"in A||c=="checked"&&"defaultChecked"in A||we(e,c,null,d,i);for(c in A)d=A[c],c=="children"?o=d:c=="dangerouslySetInnerHTML"?v=d:c=="value"?S=d:c=="checked"?E=d:_&&typeof d!="function"||b[c]===d||we(e,c,d,b[c],i);v?(_||m&&(v.__html==m.__html||v.__html==e.innerHTML)||(e.innerHTML=v.__html),t.__k=[]):(m&&(e.textContent=""),(w=="foreignObject"||i=="http://www.w3.org/1998/Math/MathML"&&Yt.test(w))&&(i="http://www.w3.org/1999/xhtml"),mt(p,Ue(o)?o:[o],t,r,a,i,u,s,u?u[0]:r.__k&&K(r,0),_,l),u&&u.some(Q)),_&&w!="textarea"||(c="value",w=="progress"&&S==null?e.removeAttribute(c):S==null||S===e[c]&&(w!="progress"||S)||we(e,c,S,b[c],i),c="checked",E!=null&&E!=e[c]&&we(e,c,E,b[c],i))}else b===A||_&&e.data==A||(e.data=A);return e}function Xe(e,t,r,a){try{typeof e=="function"?t?t.__x=e(t)||1:a&&(a=a.__c||a.__e)&&(t=a.__x)&&(a.__x=null,typeof t=="function"?t():e(null)):e.current=t}catch(i){y.__e(i,r)}}function ze(e,t,r){var a,i,u,s;if(y.unmount&&y.unmount(e),!(a=e.ref)||a.current&&a.current!=e.__e||Xe(a,null,t,e),a=e.__c){if(a.componentWillUnmount)try{a.componentWillUnmount()}catch(_){y.__e(_,t)}a.__P=a.__n=null}if(a=e.__k)for(s=0;s<a.length;s++)a[s]&&ze(a[s],t,typeof e.type!="function"||r&&!e.props.__P);!r&&(a=e.__c)&&(a=a.__z)&&(i=Ae(a,u=[]))&&(a==e.__e&&u.some(Q),Q(i),Q(a)),r||Q(e.__e),e.__e=e.__c=e.__=null}function tr(e,t,r){return this.constructor(e,r)}function qe(e,t){var r,a,i,u;y.__&&y.__(e,t),t.nodeType==9&&(t=t.documentElement),a=(r=e&&32&e.__u)?null:t.__k,t.__k=Se(q,{children:[e]}),i=[],u=[],We(t,t.__k,a||Me,Me,t.namespaceURI,a?null:t.firstChild?lt.call(t.childNodes):null,i,a?a.__e:t.firstChild,r,u),gt(i,t.__k,u),t.__k.props.children=null}y={__e:function(e,t,r,a){for(var i,u,s;t=t.__;)if((i=t.__c)&&!(1&i.__g)){i.__g|=4;try{if((s=(u=i.constructor)&&u.getDerivedStateFromError)&&i.setState(u.getDerivedStateFromError(e)),i.componentDidCatch&&(i.componentDidCatch(e,a||{}),s=1),s&&8&i.__g)return void(i.__g|=2)}catch(_){e=_}}throw Ce=0,e}},_t=0,$t=function(e){return e!=null&&e.constructor===me},Y.prototype.setState=function(e,t){var r=this.__s;r&&r!=this.state||(r=this.__s=ee({},this.state)),typeof e=="function"&&(e=e(ee({},r),this.props)),e&&(ee(r,e),this.__v&&(t&&this.__k.push(t),ut(this)))},Y.prototype.forceUpdate=function(e){this.__v&&(this.__g|=4,e&&this.__h.push(e),ut(this))},Y.prototype.render=q,j=[],Ce=0,ct=function(e,t){return e.__v.__b-t.__v.__b},Te=Symbol(),ft=/(PointerCapture)$|Capture$/i,Ve=0,Oe={},jt=0;var De,I,Ge,yt,rr=Object.is,$e=0,At=[],je=[],C=y,bt=C.__b,Et=C.__r,xt=C.diffed,Rt=C.__c,kt=C.unmount,wt=C.__;function Ct(e,t){C.__h&&C.__h(I,e,$e||t),$e=0;var r=I.__H||(I.__H={__:[],__h:[]});return e>=r.__.length&&r.__.push({}),r.__[e]}function Fe(e,t){var r=Ct(De++,3);!C.__s&&Pt(r.__H,t)&&(r.__P=!0,r.__=e,r.u=t,I.__H.__h.push(r))}function ue(e){return $e=5,Mt(function(){return{current:e}},[])}function Mt(e,t){var r=Ct(De++,7);return Pt(r.__H,t)&&(r.__=e(),r.__H=t),r.__}function nr(){var e;do{for(;e=je.shift();)try{he(e)}catch(r){C.__e(r,{__:(e=e.__P)&&e.__v})}for(;e=At.shift();){var t=e.__H;if(e.__P&&t)try{t.__h.some(he),t.__h.some(Ye),t.__h=[]}catch(r){t.__h=[],C.__e(r,e.__v)}}}while(je.length)}C.__b=function(e){I=null,bt&&bt(e)},C.__=function(e,t){e&&t.__k&&t.__k.__m&&(e.__m=t.__k.__m),wt&&wt(e,t)},C.__r=function(e){Et&&Et(e),De=0;var t=(I=e.__c).__H;t&&(Ge==I?I.__h=[]:(t.__h.some(he),t.__h.some(Ye),De=0),t.__h=[],t.__.some(function(r){r.__N&&(r.__=r.__N),r.u=r.__N=void 0})),Ge=I},C.diffed=function(e){xt&&xt(e);var t=e.__c;t&&t.__H&&(t.__H.__h.length&&St(At.push(t)),t.__H.__.some(function(r){r.u&&(r.__H=r.u)})),Ge=I=null},C.__c=function(e,t){t.some(function(r){try{r.__h.some(he),r.__h=r.__h.filter(function(a){return!a.__||Ye(a)})}catch(a){r.__h=[function(){throw a}]}}),Rt&&Rt(e,t)},C.unmount=function(e){kt&&kt(e);var t,r,a=e.__c;a&&a.__H&&(a.__H.__.some(function(i){try{if(i.__P&&i.__c){if(r===void 0){for(r=e.__;r&&(!r.__c||!r.__c.__P);)r=r.__;r=r&&r.__c}i.__P=r,St(je.push(i))}else he(i)}catch(u){t=u}}),a.__H=void 0,t&&C.__e(t,a.__v))};var Tt=typeof requestAnimationFrame=="function";function or(e){var t,r=function(){clearTimeout(a),Tt&&cancelAnimationFrame(t),setTimeout(e)},a=setTimeout(r,35);Tt&&(t=requestAnimationFrame(r))}function St(e){e!=1&&yt==C.requestAnimationFrame||((yt=C.requestAnimationFrame)||or)(nr)}function he(e){var t=I,r=e.__c;typeof r=="function"&&(e.__c=void 0,r()),I=t}function Ye(e){var t=I;e.__c=e.__(),I=t}function Pt(e,t){return!e||e.length!=t.length||t.some(function(r,a){return!rr(r,e[a])})}var Ut=Object.assign;var sr=/^(-|f[lo].*[^se]$|g.{5,}[^ps]$|z|o[pr]|(W.{5})?[lL]i.*(t|mp)$|an|(bo|s).{4}Im|sca|m.{6}[ds]|ta|c.*[st]$|wido|ini|asp|fill|st)/;var _r=Symbol.for("react.element"),cr=/^(?:accent|alignment|arabic|baseline|cap|clip(?!PathU)|color|dominant|fill|flood|font|glyph(?!R)|horiz|image(?!S)|letter|lighting|marker(?!H|W|U)|overline|paint|pointer|shape|stop|strikethrough|stroke|text(?!L)|transform|underline|unicode|units|v|vector|vert|word|writing|x(?!C))[A-Z]/,fr=/[A-Z0-9]/g,lr=typeof document<"u";var pr=function(e){return/fil|che|rad/.test(e)};Y.prototype.isReactComponent=!0,["componentWillMount","componentWillReceiveProps","componentWillUpdate"].forEach(function(e){Object.defineProperty(Y.prototype,e,{configurable:!0,get:function(){return this["UNSAFE_"+e]},set:function(t){Object.defineProperty(this,e,{configurable:!0,writable:!0,value:t})}})});var Dt=y.event;y.event=function(e){return Dt&&(e=Dt(e)),e.persist=function(){},e.isPropagationStopped=function(){return this.cancelBubble},e.isDefaultPrevented=function(){return this.defaultPrevented},e.nativeEvent=e};var dr={configurable:!0,get:function(){return this.class}},Ft=y.vnode;y.vnode=function(e){if(typeof e.type=="string")(function(a){var i=a.props,u=a.type,s={},_=u.indexOf("-")==-1;for(var l in i){var p=i[l];if(!(l=="value"&&"defaultValue"in i&&p==null||lr&&l=="children"&&u=="noscript"||l=="class"||l=="className")){if(l=="style"&&p&&p.constructor==Object){var c=void 0;for(var v in p)typeof p[v]!="number"||sr.test(v)||(c||(c=p=Ut({},p)),p[v]+="px")}else if(l=="defaultValue"&&"value"in i&&i.value==null)l="value";else if(l=="download"&&p===!0)p="";else if(l=="translate"&&p==="no")p=!1;else if(l[0]=="o"&&l[1]=="n"){var m=l.toLowerCase();m=="ondoubleclick"?l="ondblclick":m!="onchange"||u!="input"&&u!="textarea"||pr(i.type)?m=="onfocus"?l="onfocusin":m=="onblur"&&(l="onfocusout"):m=l="oninput",m=="oninput"&&s[l=m]&&(l="oninputCapture")}else _&&cr.test(l)?l=l.replace(fr,"-$&").toLowerCase():p===null&&(p=void 0);s[l]=p}}if(u=="select"){var o=s.defaultValue!=null?s.defaultValue:s.multiple&&Array.isArray(s.value)?s.value:null;o!=null&&(s.value=He(i.children).forEach(function(d){d.props.selected=s.multiple?o.indexOf(d.props.value)!=-1:o==d.props.value}))}i.class&&!i.className?(s.class=i.class,Object.defineProperty(s,"className",dr)):i.className&&(s.class=s.className=i.className),a.props=s})(e);else if(typeof e.type=="function"&&("ref"in e.props&&"prototype"in e.type&&e.type.prototype.render&&(e.ref=e.props.ref,delete e.props.ref),e.type.defaultProps)){var t=Ut({},e.props);for(var r in e.type.defaultProps)t[r]===void 0&&(t[r]=e.type.defaultProps[r]);e.props=t}e.ref&&!("ref"in e.props)&&Object.defineProperty(e.props,"ref",{value:e.ref,configurable:!0,writable:!0}),e.$$typeof=_r,Ft&&Ft(e)};var mr=Symbol.for("pv"),hr=0;function ve(e,t,r,a,i,u){t||(t={});var s,_,l=t;if("ref"in l&&typeof e!="function")for(_ in l={},t)_=="ref"?s=t[_]:l[_]=t[_];var p={type:e,props:l,key:r,ref:s,__k:null,__:null,__b:0,__e:null,__c:null,constructor:mr,__v:--hr,__i:-1,__u:0};return(i||u)&&(p.__source=i,p.__self=u),y.vnode&&y.vnode(p),p}var vr="https://images.unsplash.com/photo-1693250707557-a846a014b321?q=80&w=1400&auto=format&fit=crop",gr=`#version 300 es
in vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`,yr=`#version 300 es
precision highp float;
uniform sampler2D uPrevious;
uniform vec2 uTexture;
uniform vec2 uView;
uniform vec2 uFrom;
uniform vec2 uTo;
uniform float uRadius;
uniform float uSoftness;
uniform float uStrength;
uniform float uFade;
out vec4 outColor;

float segment(vec2 p, vec2 a, vec2 b) {
  vec2 ab = b - a;
  float h = clamp(dot(p - a, ab) / max(dot(ab, ab), 0.0001), 0.0, 1.0);
  return length(p - a - ab * h);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uTexture;
  vec2 p = vec2(uv.x, 1.0 - uv.y) * uView;
  float trail = max(texture(uPrevious, uv).r - uFade, 0.0);
  float band = max(uRadius * uSoftness, 1.0);
  float brush = clamp((uRadius - segment(p, uFrom, uTo)) / band, 0.0, 1.0);
  brush = brush * brush * (3.0 - 2.0 * brush);
  outColor = vec4(max(trail, brush * uStrength), 0.0, 0.0, 1.0);
}`,br=`#version 300 es
precision highp float;
uniform sampler2D uImage;
uniform sampler2D uMask;
uniform vec2 uResolution;
uniform vec2 uView;
uniform float uDpr;
uniform vec4 uFrame;
uniform float uTexels;
uniform float uMode;
uniform float uShape;
uniform float uCell;
uniform float uAngle;
uniform float uScale;
uniform vec3 uInk;
uniform vec3 uAccent;
uniform vec3 uPaper;
uniform float uContrast;
uniform float uBrightness;
uniform float uInvert;
uniform float uRough;
uniform float uShift;
uniform vec3 uMatte;
uniform float uKey;
uniform float uReverse;
uniform float uIntro;
uniform vec4 uBursts[4];
uniform float uBurstWidth;
out vec4 outColor;

const vec3 LUMA = vec3(0.2126, 0.7152, 0.0722);
const vec3 CYAN = vec3(0.0, 0.64, 0.93);
const vec3 MAGENTA = vec3(0.92, 0.07, 0.56);
const vec3 YELLOW = vec3(1.0, 0.91, 0.0);
const vec3 KEY = vec3(0.11, 0.1, 0.12);
const vec3 RED = vec3(1.0, 0.16, 0.12);
const vec3 GREEN = vec3(0.12, 1.0, 0.3);
const vec3 BLUE = vec3(0.16, 0.32, 1.0);

mat2 rotate(float a) {
  float c = cos(a);
  float s = sin(a);
  return mat2(c, -s, s, c);
}

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

vec4 photo(vec2 p, float lod, float margin) {
  vec2 uv = (p - uFrame.xy) / uFrame.zw;
  vec4 c = textureLod(uImage, clamp(uv, 0.0, 1.0), lod);
  vec2 slack = margin * uCell / uFrame.zw;
  vec2 inside = step(-slack, uv) * step(uv, 1.0 + slack);
  float keep = inside.x * inside.y * c.a;
  keep *= mix(1.0, smoothstep(0.05, 0.2, distance(c.rgb, uMatte)), uKey);
  return vec4(c.rgb, keep);
}

float grade(float v) {
  v = clamp((v - 0.5) * uContrast + 0.5 + uBrightness, 0.0, 1.0);
  return mix(v, 1.0 - v, uInvert);
}

vec3 gradeColor(vec3 c) {
  return vec3(grade(c.r), grade(c.g), grade(c.b));
}

vec3 tone(vec3 c) {
  return pow(max(c, 0.0), vec3(1.5));
}

float press(float t, float alpha) {
  return (0.05 + clamp(t, 0.0, 1.0) * 0.89) * alpha;
}

float plate(float t, float alpha) {
  return (0.02 + clamp(t, 0.0, 1.0) * 0.92) * alpha;
}

vec3 decode(vec3 c) {
  return pow(max(c, 0.0), vec3(2.2));
}

vec4 separate(vec3 color) {
  vec3 target = clamp(tone(gradeColor(color)) / max(tone(uPaper), vec3(0.02)), 0.0, 1.0);
  vec3 absorbC = 1.0 - decode(CYAN);
  vec3 absorbM = 1.0 - decode(MAGENTA);
  vec3 absorbY = 1.0 - decode(YELLOW);
  float bright = pow(max(max(target.r, target.g), target.b), 0.4545);
  float key = pow(clamp(1.0 - bright / 0.62, 0.0, 1.0), 1.4) * 0.95;
  vec3 rest = clamp(target / max(1.0 - key * (1.0 - decode(KEY)), vec3(0.03)), 0.0, 1.0);
  vec3 a = 1.0 - rest;
  for (int i = 0; i < 3; i++) {
    vec3 tc = 1.0 - a.x * absorbC;
    vec3 tm = 1.0 - a.y * absorbM;
    vec3 ty = 1.0 - a.z * absorbY;
    mat3 slope = mat3(-absorbC * tm * ty, -absorbM * tc * ty, -absorbY * tc * tm);
    if (abs(determinant(slope)) < 1e-6) break;
    a = clamp(a - inverse(slope) * (tc * tm * ty - rest), 0.0, 1.0);
  }
  return vec4(a, key);
}

vec3 emit(vec3 color) {
  vec3 target = max(tone(gradeColor(color)) - tone(uPaper), 0.0);
  mat3 lights = mat3(decode(RED), decode(GREEN), decode(BLUE));
  return clamp(inverse(lights) * target, 0.0, 1.0);
}

float metric(vec2 f) {
  if (uShape < 0.5) return length(f);
  if (uShape < 1.5) return length(f * vec2(0.8, 1.15));
  if (uShape < 2.5) return max(abs(f.x), abs(f.y));
  if (uShape < 3.5) return abs(f.x) + abs(f.y);
  if (uShape < 4.5) return abs(f.y);
  return min(abs(f.x), abs(f.y));
}

float reach(float t) {
  t = clamp(t, 0.0, 1.0);
  if (uShape < 0.5) return t < 0.785 ? sqrt(t / 3.14159) : mix(0.5, 0.72, (t - 0.785) / 0.215);
  if (uShape < 1.5) return t < 0.7 ? sqrt(t * 0.92 / 3.14159) : mix(0.4497, 0.72, (t - 0.7) / 0.3);
  if (uShape < 2.5) return 0.5 * sqrt(t) + 0.02 * t;
  if (uShape < 3.5) return t < 0.5 ? sqrt(t * 0.5) : 1.0 - sqrt((1.0 - t) * 0.5);
  if (uShape < 4.5) return 0.52 * t;
  return (1.0 - sqrt(1.0 - t)) * 0.5 + 0.02 * t;
}

vec2 center(vec2 p, float angle) {
  vec2 q = rotate(angle) * p / uCell;
  vec2 c = floor(q) + 0.5;
  if (uShape > 3.5 && uShape < 4.5) c.x = q.x;
  return rotate(-angle) * c * uCell;
}

float dots(vec2 p, float angle, float t, float seed, float grow) {
  vec2 q = rotate(angle) * p / uCell;
  float d = metric(fract(q) - 0.5);
  d += (noise(p * 0.42 + seed * 17.0) - 0.5) * uRough * 0.18;
  float r = reach(t) * uScale * grow;
  float w = max(fwidth(d), 0.0001) * 0.75;
  return smoothstep(r + w, r - w, d) * clamp(r / (w * 2.0), 0.0, 1.0);
}

float coverage(vec4 image) {
  float shade = dot(tone(gradeColor(image.rgb)), LUMA);
  float paper = dot(tone(uPaper), LUMA);
  float span = dot(tone(uInk), LUMA) - paper;
  float t = abs(span) < 0.02 ? 1.0 - shade : (shade - paper) / span;
  return press(t, image.a);
}

float burst(vec2 p) {
  float value = 0.0;
  for (int i = 0; i < 4; i++) {
    vec4 b = uBursts[i];
    if (b.w <= 0.0) continue;
    float offset = distance(p, b.xy) - b.z;
    float edge = offset > 0.0 ? offset / (uBurstWidth * 0.35) : -offset / uBurstWidth;
    value = max(value, clamp(1.0 - edge, 0.0, 1.0) * b.w);
  }
  return value;
}

void main() {
  vec2 p = vec2(gl_FragCoord.x, uResolution.y - gl_FragCoord.y) / uDpr;
  float lod = log2(max(uCell * uTexels, 1.0));
  float base = uAngle;
  vec2 drift = vec2(uShift, uShift * -0.6);

  vec2 field = p / max(uView.x, uView.y) - uView / max(uView.x, uView.y) * 0.5;
  float delay = length(field) * 1.15 + hash(floor(p / uCell)) * 0.06;
  float grow = smoothstep(0.0, 1.0, clamp((uIntro * 1.7 - delay) / 0.45, 0.0, 1.0));

  vec3 print = uPaper;
  if (uMode < 0.5) {
    float k = dots(p, base, coverage(photo(center(p, base), lod, 0.5)), 0.0, grow);
    print = mix(uPaper, uInk, k);
  } else if (uMode < 1.5) {
    float second = base + 0.5236;
    float tA = coverage(photo(center(p, base), lod, 0.5));
    float tB = coverage(photo(center(p + drift, second) - drift, lod, 0.5));
    float kA = dots(p, base, pow(tA, 1.9), 0.0, grow);
    float kB = dots(p + drift, second, clamp(tB * 1.3, 0.0, 1.0) * 0.8, 1.0, grow);
    if (dot(uPaper, LUMA) > 0.5) {
      print = uPaper * mix(vec3(1.0), uAccent, kB) * mix(vec3(1.0), uInk, kA);
    } else {
      print = min(uPaper + uAccent * kB + uInk * kA, vec3(1.0));
    }
  } else if (dot(uPaper, LUMA) > 0.5) {
    float ac = base - 0.5236;
    float am = base + 0.5236;
    float ay = base - 0.7854;
    vec4 sc = photo(center(p + drift, ac) - drift, lod, 0.5);
    vec4 sm = photo(center(p - drift, am) + drift, lod, 0.5);
    vec4 sy = photo(center(p + drift.yx, ay) - drift.yx, lod, 0.5);
    vec4 sk = photo(center(p, base), lod, 0.5);
    float kc = sc.a > 0.0 ? dots(p + drift, ac, plate(separate(sc.rgb).x, sc.a), 1.0, grow) : 0.0;
    float km = sm.a > 0.0 ? dots(p - drift, am, plate(separate(sm.rgb).y, sm.a), 2.0, grow) : 0.0;
    float ky = sy.a > 0.0 ? dots(p + drift.yx, ay, plate(separate(sy.rgb).z, sy.a), 3.0, grow) : 0.0;
    float kk = sk.a > 0.0 ? dots(p, base, plate(separate(sk.rgb).w, sk.a), 4.0, grow) : 0.0;
    print = uPaper;
    print *= mix(vec3(1.0), CYAN, kc);
    print *= mix(vec3(1.0), MAGENTA, km);
    print *= mix(vec3(1.0), YELLOW, ky);
    print *= mix(vec3(1.0), KEY, kk);
  } else {
    float ar = base - 0.5236;
    float ag = base + 0.5236;
    vec4 sr = photo(center(p + drift, ar) - drift, lod, 0.5);
    vec4 sg = photo(center(p - drift, ag) + drift, lod, 0.5);
    vec4 sb = photo(center(p, base), lod, 0.5);
    float kr = dots(p + drift, ar, plate(emit(sr.rgb).x, sr.a), 1.0, grow);
    float kg = dots(p - drift, ag, plate(emit(sg.rgb).y, sg.a), 2.0, grow);
    float kb = dots(p, base, plate(emit(sb.rgb).z, sb.a), 3.0, grow);
    print = min(uPaper + RED * kr + GREEN * kg + BLUE * kb, vec3(1.0));
  }

  vec2 maskUv = vec2(p.x / uView.x, 1.0 - p.y / uView.y);
  float shown = max(texture(uMask, maskUv).r, burst(p));
  shown = mix(shown, 1.0 - shown, uReverse);
  shown = shown * shown * (3.0 - 2.0 * shown);
  vec2 q = rotate(base) * p / uCell;
  float d = metric(fract(q) - 0.5);
  float r = reach(1.0) * 1.08 * shown;
  float w = max(fwidth(d), 0.0001) * 0.75;
  float k = smoothstep(r + w, r - w, d) * clamp(r / (w * 2.0), 0.0, 1.0);
  vec4 sharp = photo(p, 0.0, 0.0);
  vec3 real = mix(uPaper, sharp.rgb, sharp.a);
  outColor = vec4(mix(print, real, k), 1.0);
}`,Er={mono:0,duotone:1,color:2},xr={dot:0,ellipse:1,square:2,diamond:3,line:4,cross:5},Lt=4,It=1.3,Rr=1.4,Nt=.5,ge=(e,t,r)=>Math.min(r,Math.max(t,e)),Bt=(e,t,r)=>{let a=e.createShader(t);return a?(e.shaderSource(a,r),e.compileShader(a),e.getShaderParameter(a,e.COMPILE_STATUS)?a:(e.deleteShader(a),null)):null},Ot=(e,t)=>{let r=Bt(e,e.VERTEX_SHADER,gr),a=Bt(e,e.FRAGMENT_SHADER,t),i=e.createProgram();return!r||!a||!i?null:(e.attachShader(i,r),e.attachShader(i,a),e.bindAttribLocation(i,0,"aPosition"),e.linkProgram(i),e.deleteShader(r),e.deleteShader(a),e.getProgramParameter(i,e.LINK_STATUS)?i:(e.deleteProgram(i),null))},Vt=(e,t,r)=>{let a={};for(let i of r)a[i]=e.getUniformLocation(t,i);return a},kr=(e,t,r)=>[t*(.5+.32*Math.sin(e*.53)+.08*Math.sin(e*1.31+.6)),r*(.5+.27*Math.sin(e*.71+1.1)+.07*Math.cos(e*1.57))],wr=(e,t)=>{e.canvas.width=32,e.canvas.height=32,e.clearRect(0,0,32,32),e.drawImage(t,0,0,32,32);let a=e.getImageData(0,0,32,32).data,i=[0,0,0],u=[0,0,0],s=0,_=0;for(let c=0;c<32;c++)for(let v=0;v<32;v++){if(v>0&&c>0&&v<31&&c<31)continue;let m=(c*32+v)*4;a[m+3]<250&&_++;for(let o=0;o<3;o++){let d=a[m+o]/255;i[o]+=d,u[o]+=d*d}s++}let l=[i[0]/s,i[1]/s,i[2]/s],p=l.reduce((c,v,m)=>c+Math.sqrt(Math.max(0,u[m]/s-v*v)),0)/3;return{matte:l,plain:_<s*.5&&p<.06}},Tr=({src:e=vr,fit:t="cover",mode:r="mono",shape:a="dot",cellSize:i=6,angle:u=45,dotScale:s=1,inkColor:_="#120f17",accentColor:l="#ff4f2a",paperColor:p="#ffffff",contrast:c=1.1,brightness:v=0,invert:m=!1,roughness:o=0,misregistration:d=0,revealRadius:S=160,softness:E=.6,linger:k=1.2,reverse:b=!1,wander:A=!1,clickBurst:w=!0,intro:se=!0,className:_e="",style:te})=>{let O=ue(null),ce=ue(null),B=ue(null),V={fit:t,mode:Er[r]??0,shape:xr[a]??0,cellSize:ge(i,2,80),angle:u,dotScale:ge(s,.2,2),inkColor:String(_),accentColor:String(l),paperColor:String(p),contrast:c,brightness:v,invert:m,roughness:ge(o,0,1),misregistration:ge(d,0,1),revealRadius:Math.max(0,S),softness:ge(E,0,1),linger:Math.max(0,k),reverse:b,wander:A,clickBurst:w,intro:se},L=ue(V);return L.current=V,Fe(()=>{let x=O.current,H=ce.current,n=H?.getContext("webgl2",{alpha:!1,antialias:!1,depth:!1,stencil:!1,preserveDrawingBuffer:!1});if(!x||!H||!n)return;let ye=Ot(n,yr),be=Ot(n,br);if(!ye||!be)return;let X=Vt(n,ye,["uPrevious","uTexture","uView","uFrom","uTo","uRadius","uSoftness","uStrength","uFade"]),R=Vt(n,be,["uImage","uMask","uResolution","uView","uDpr","uFrame","uTexels","uMode","uShape","uCell","uAngle","uScale","uInk","uAccent","uPaper","uContrast","uBrightness","uInvert","uRough","uShift","uMatte","uKey","uReverse","uIntro","uBursts","uBurstWidth"]),Ee=n.createVertexArray(),Ke=n.createBuffer();n.bindVertexArray(Ee),n.bindBuffer(n.ARRAY_BUFFER,Ke),n.bufferData(n.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),n.STATIC_DRAW),n.enableVertexAttribArray(0),n.vertexAttribPointer(0,2,n.FLOAT,!1,0,0),n.bindVertexArray(null);let Ze=!!n.getExtension("EXT_color_buffer_float"),xe=n.createTexture();n.bindTexture(n.TEXTURE_2D,xe),n.texImage2D(n.TEXTURE_2D,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,new Uint8Array(4)),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,n.LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MAG_FILTER,n.LINEAR);let Re=(f,g)=>{let T=n.createTexture();n.bindTexture(n.TEXTURE_2D,T),Ze?n.texImage2D(n.TEXTURE_2D,0,n.RGBA16F,f,g,0,n.RGBA,n.HALF_FLOAT,null):n.texImage2D(n.TEXTURE_2D,0,n.RGBA,f,g,0,n.RGBA,n.UNSIGNED_BYTE,null),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,n.LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MAG_FILTER,n.LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE);let P=n.createFramebuffer();return n.bindFramebuffer(n.FRAMEBUFFER,P),n.framebufferTexture2D(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,T,0),n.clearColor(0,0,0,1),n.clear(n.COLOR_BUFFER_BIT),n.bindFramebuffer(n.FRAMEBUFFER,null),{texture:T,framebuffer:P,width:f,height:g}},Je=f=>{n.deleteFramebuffer(f.framebuffer),n.deleteTexture(f.texture)},N=[Re(2,2),Re(2,2)],re=document.createElement("canvas").getContext("2d",{willReadFrequently:!0}),Qe=window.matchMedia?.("(prefers-reduced-motion: reduce)").matches??!1,Ie=new Map,G=[],ne=new Float32Array(Lt*4),M={x:0,y:0,inside:!1,fresh:!0,placed:!1},D={x:0,y:0,px:0,py:0},h={width:1,height:1,dpr:1,image:null,matte:[0,0,0],key:0,introStart:0,presence:0,drift:0,trailUntil:0},oe=0,ae=0,fe=!0,le=!0,Ne=f=>{if(Ie.has(f))return Ie.get(f);let g=[0,0,0];if(re&&f){re.clearRect(0,0,1,1),re.fillStyle="#000000",re.fillStyle=/^[0-9a-f]{3,8}$/i.test(f)?`#${f}`:f,re.fillRect(0,0,1,1);let[T,P,F]=re.getImageData(0,0,1,1).data;g=[T/255,P/255,F/255]}return Ie.set(f,g),g},Xt=f=>{let{image:g,width:T,height:P}=h;if(!g)return[0,0,T,P];let F=(f.fit==="cover"?Math.max:Math.min)(T/g.naturalWidth,P/g.naturalHeight),z=g.naturalWidth*F,W=g.naturalHeight*F;return[(T-z)/2,(P-W)/2,z,W]},et=()=>{let f=Math.max(1,x.clientWidth),g=Math.max(1,x.clientHeight),T=Math.min(window.devicePixelRatio||1,2);h.width=f,h.height=g,h.dpr=T,H.width=Math.max(1,Math.round(f*T)),H.height=Math.max(1,Math.round(g*T));let P=Math.max(2,Math.round(f*Nt)),F=Math.max(2,Math.round(g*Nt));(P!==N[0].width||F!==N[0].height)&&(N.forEach(Je),N=[Re(P,F),Re(P,F)]),M.placed||(M.x=f/2,M.y=g/2),Z()},zt=(f,g)=>{let T=Ze?0:.0058823529411764705;n.bindFramebuffer(n.FRAMEBUFFER,N[1].framebuffer),n.viewport(0,0,N[1].width,N[1].height),n.useProgram(ye),n.activeTexture(n.TEXTURE0),n.bindTexture(n.TEXTURE_2D,N[0].texture),n.uniform1i(X.uPrevious,0),n.uniform2f(X.uTexture,N[1].width,N[1].height),n.uniform2f(X.uView,h.width,h.height),n.uniform2f(X.uFrom,D.px,D.py),n.uniform2f(X.uTo,D.x,D.y),n.uniform1f(X.uRadius,f.revealRadius*(.45+.55*h.presence)),n.uniform1f(X.uSoftness,f.softness),n.uniform1f(X.uStrength,h.presence),n.uniform1f(X.uFade,Math.max(f.linger>0?g/f.linger:1,T)),n.bindVertexArray(Ee),n.drawArrays(n.TRIANGLES,0,3),n.bindFramebuffer(n.FRAMEBUFFER,null),N.reverse()},tt=(f,g)=>{let[T,P,F,z]=Xt(f),W=h.image,de=W?!f.intro||Qe?1:Math.min(1,(g-h.introStart)/1e3/Rr):0;return n.viewport(0,0,H.width,H.height),n.useProgram(be),n.activeTexture(n.TEXTURE0),n.bindTexture(n.TEXTURE_2D,xe),n.uniform1i(R.uImage,0),n.activeTexture(n.TEXTURE1),n.bindTexture(n.TEXTURE_2D,N[0].texture),n.uniform1i(R.uMask,1),n.uniform2f(R.uResolution,H.width,H.height),n.uniform2f(R.uView,h.width,h.height),n.uniform1f(R.uDpr,H.width/h.width),n.uniform4f(R.uFrame,T,P,F,z),n.uniform1f(R.uTexels,W?W.naturalWidth/F:1),n.uniform1f(R.uMode,f.mode),n.uniform1f(R.uShape,f.shape),n.uniform1f(R.uCell,f.cellSize),n.uniform1f(R.uAngle,f.angle*Math.PI/180),n.uniform1f(R.uScale,f.dotScale),n.uniform3fv(R.uInk,Ne(f.inkColor)),n.uniform3fv(R.uAccent,Ne(f.accentColor)),n.uniform3fv(R.uPaper,Ne(f.paperColor)),n.uniform1f(R.uContrast,f.contrast),n.uniform1f(R.uBrightness,f.brightness),n.uniform1f(R.uInvert,f.invert?1:0),n.uniform1f(R.uRough,f.roughness),n.uniform1f(R.uShift,f.misregistration*f.cellSize*.35),n.uniform3fv(R.uMatte,h.matte),n.uniform1f(R.uKey,h.key),n.uniform1f(R.uReverse,f.reverse?1:0),n.uniform1f(R.uIntro,1-(1-de)*(1-de)),n.uniform4fv(R.uBursts,ne),n.uniform1f(R.uBurstWidth,Math.max(60,f.revealRadius*.9)),n.bindVertexArray(Ee),n.drawArrays(n.TRIANGLES,0,3),n.bindVertexArray(null),W&&(H.dataset.ready="true"),de},rt=f=>{if(oe=0,!le||!fe||document.hidden)return;let g=L.current,T=ae?Math.min(.05,Math.max(0,(f-ae)/1e3)):1/60;ae=f;let P=g.wander&&!Qe,F=M.x,z=M.y;if(!M.inside&&P){h.drift=Math.min(1,h.drift+T/1.2);let[U,ie]=kr(f/1e3,h.width,h.height),J=h.drift*h.drift*(3-2*h.drift);F+=(U-F)*J,z+=(ie-z)*J}else h.drift=0;let W=M.inside||P;if(h.presence+=((W?1:0)-h.presence)*(1-Math.exp(-T/.16)),M.fresh)D.x=D.px=F,D.y=D.py=z,M.fresh=!1;else{let U=1-Math.exp(-T/.035);D.x+=(F-D.x)*U,D.y+=(z-D.y)*U}ne.fill(0);for(let U=G.length-1;U>=0;U--)(f-G[U].start)/1e3>=It&&G.splice(U,1);G.forEach((U,ie)=>{let J=Math.max(0,(f-U.start)/1e3/It),Gt=Math.hypot(Math.max(U.x,h.width-U.x),Math.max(U.y,h.height-U.y))+80;ne[ie*4]=U.x,ne[ie*4+1]=U.y,ne[ie*4+2]=Gt*Math.sin(J*Math.PI/2),ne[ie*4+3]=1-J*J*J}),h.presence>.002&&(h.trailUntil=f+g.linger*1e3+200),zt(g,T),D.px=D.x,D.py=D.y;let de=tt(g,f);W||h.presence>.002||G.length>0||f<h.trailUntil||h.image&&de<1?oe=requestAnimationFrame(rt):ae=0},Z=()=>{!oe&&le&&fe&&!document.hidden&&(oe=requestAnimationFrame(rt))},$=new Image;$.crossOrigin="anonymous",$.decoding="async",$.onload=()=>{if(!le)return;n.bindTexture(n.TEXTURE_2D,xe),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),n.texImage2D(n.TEXTURE_2D,0,n.RGBA,n.RGBA,n.UNSIGNED_BYTE,$),n.generateMipmap(n.TEXTURE_2D),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,n.LINEAR_MIPMAP_LINEAR);let f=document.createElement("canvas").getContext("2d",{willReadFrequently:!0});if(f)try{let g=wr(f,$);h.matte=g.matte,h.key=g.plain?1:0}catch{h.key=0}h.image=$,h.introStart=performance.now(),Z()},$.src=e;let qt=f=>{let g=x.getBoundingClientRect();M.x=f.clientX-g.left,M.y=f.clientY-g.top,M.placed=!0},pe=f=>{qt(f),M.inside||(M.inside=!0,M.fresh=!0),Z()},ke=()=>{M.inside=!1,Z()},nt=f=>{pe(f),!(!L.current.clickBurst||f.pointerType==="mouse"&&f.button!==0)&&(G.push({x:M.x,y:M.y,start:performance.now()}),G.length>Lt&&G.shift())},ot=()=>{ae=0,Z()};x.addEventListener("pointermove",pe,{passive:!0}),x.addEventListener("pointerenter",pe,{passive:!0}),x.addEventListener("pointerdown",nt,{passive:!0}),x.addEventListener("pointerleave",ke,{passive:!0}),x.addEventListener("pointercancel",ke,{passive:!0}),document.addEventListener("visibilitychange",ot);let at=new ResizeObserver(et);at.observe(x);let it=new IntersectionObserver(f=>{fe=f.some(g=>g.isIntersecting),fe&&(ae=0,Z())});return it.observe(x),et(),B.current=()=>{!oe&&le&&fe&&(tt(L.current,performance.now()),Z())},()=>{le=!1,cancelAnimationFrame(oe),B.current=null,$.onload=null,at.disconnect(),it.disconnect(),x.removeEventListener("pointermove",pe),x.removeEventListener("pointerenter",pe),x.removeEventListener("pointerdown",nt),x.removeEventListener("pointerleave",ke),x.removeEventListener("pointercancel",ke),document.removeEventListener("visibilitychange",ot),N.forEach(Je),n.deleteTexture(xe),n.deleteBuffer(Ke),n.deleteVertexArray(Ee),n.deleteProgram(ye),n.deleteProgram(be)}},[e]),Fe(()=>{B.current?.()}),ve("div",{ref:O,className:`halftone-reveal${_e?` ${_e}`:""}`,style:te,children:ve("canvas",{ref:ce,className:"halftone-reveal-canvas","aria-hidden":"true"})})},Ht=Tr;var Wt=document.getElementById("halftone-mount"),Le=document.getElementById("halftone-root");Wt&&qe(ve(Ht,{src:"go-kart.webp",fit:"cover",mode:"mono",shape:"dot",cellSize:6,angle:45,dotScale:1,inkColor:"#12161a",paperColor:"#f7f5f0",contrast:1.15,brightness:0,roughness:.18,revealRadius:95,softness:.6,linger:1.1,clickBurst:!0,intro:!0,style:{position:"absolute",inset:0}}),Wt);if(Le){let e=()=>{Le.querySelector('canvas[data-ready="true"]')&&(Le.dataset.mounted="true",t.disconnect())},t=new MutationObserver(e);t.observe(Le,{attributes:!0,attributeFilter:["data-ready"],childList:!0,subtree:!0}),e()}
