var x,He,bt,F,ye,_e,Ge,ae,$e,be,xe,Et,ee=Symbol.for("pv"),ce={},le=[],Rt=/^m(i|n|o|s|text|space)$/,fe=Array.isArray,ze=le.slice,z=Object.assign;function $(e){e&&e.parentNode&&e.remove()}function ue(e,t,n,o,r){var i={type:e,props:t,key:n,ref:o,__k:null,__:null,__b:0,__e:null,__c:null,constructor:ee,__v:r||++He,__i:-1,__u:0};return!r&&x.vnode&&x.vnode(i),i}function N(e){return e.children}function V(e,t){this.props=e,this.context=t,this.__g=0}function O(e,t){if(t==null)return e.__&&O(e.__,e.__i+1);for(var n;t<e.__k.length;t++)if((n=e.__k[t])&&n.__e)return n.__e;return typeof e.type!="function"||e.props.__P?null:O(e)}function wt(e){var t,n=e.__v,o=n.__e,r=[],i=[],s=e.__P;s&&((t=z({constructor:ee},n)).__v=n.__v+1,x.vnode&&x.vnode(t),Re(s,t,n,e.__n,s.namespaceURI,32&n.__u?[o]:null,r,o||O(n),32&n.__u,i),t.__v=n.__v,t.__.__k[t.__i]=t,Qe(r,t,i),n.__=n.__e=null,t.__e!=o&&je(t))}function je(e){if((e=e.__)&&e.__c&&!e.props.__P)return e.__e=null,e.__k.some(function(t){return t&&(e.__e=t.__e)}),je(e)}function Xe(e){(8&e.__g||(e.__g|=8,F.push(e),_e++))&&ye==x.debounceRendering||((ye=x.debounceRendering)||queueMicrotask)(Ye)}function Ye(){try{for(var e,t=1;F.length;)F.length>t&&F.sort(Ge),e=F.shift(),t=F.length,8&e.__g&&wt(e)}finally{(_e=F.length)&&(ye||queueMicrotask)(Ye)}}function qe(e,t,n,o,r,i,s,_,f,l,c){var p,m,u,v,E,b,h=o.__k||le,y=t.length;for(f=Tt(n,t,h,f,y),p=0;p<y;p++)(u=n.__k[p])!=null&&(m=~u.__i&&h[u.__i]||ce,u.__i=p,b=Re(e,u,m,r,i,s,_,f,l,c),v=u.__e,(m.ref!=u.ref||8&m.__u)&&(m.ref&&we(m.ref,null,u,m),u.ref&&c.push(u.ref,u.__c||v,u)),E=E||v,4&u.__u?(f=Ze(u,f,e,!m.__v),m.__e&&(m.__e=null)):typeof u.type=="function"&&b!==void 0?f=b:v&&(f=v.nextSibling),u.__u&=-21);return n.__e=E,f}function Tt(e,t,n,o,r){var i,s,_,f,l,c,p,m,u,v=n.length,E=v,b=0,h=0,y=e.__k=Array(r);for(i=0;i<r;i++)(s=t[i])!=null&&typeof s!="boolean"&&typeof s!="function"?(typeof s!="object"||s.constructor===String?s=y[i]=ue(null,s):fe(s)?s=y[i]=ue(N,{children:s}):s.constructor===ee&&s.__b?s=y[i]=ue(s.type,s.props,s.key,s.ref,s.__v):y[i]=s,f=i+b,s.__=e,s.__b=e.__b+1,_=null,~(l=s.__i=Ct(s,n,f,E))&&(E--,(_=n[l])&&(_.__u|=2)),_&&_.__v?(s.__u|=16,l==f-1?b--:l==f+1?b++:l!=f&&(l>f?b--:b++,h=1)):(~l||(r>v?b--:r<v&&b++),typeof s.type!="function"&&(s.__u|=4))):y[i]=null;if(h){for(c=[],p=[],i=0;i<r;i++)if((s=y[i])&&16&s.__u){for(b=0,m=c.length;b<m;)c[u=b+m>>1]<s.__i?b=u+1:m=u;c[b]=s.__i,p[i]=b+1}for(b=c.length;i--;)p[i]&&(p[i]==b?b--:y[i].__u|=4)}if(E)for(i=0;i<v;i++)!(_=n[i])||2&_.__u||(_.__e==o&&(o=O(_)),Te(_,_));return o}function Ze(e,t,n,o){var r,i,s,_;if(typeof e.type=="function"){if(e.props.__P)return t;if(r=e.__k)for(i=0;i<r.length;i++)r[i]&&(r[i].__=e,t=Ze(r[i],t,n,!1));return t}for(t&&!t.parentNode&&(t=O(e))&&!t.parentNode&&(t=null),s=e.__e,_=t;_&&_.nodeType==8;)_=_.nextSibling;for(s!=_&&(!o&&n.moveBefore&&s.parentNode?n.moveBefore(s,t):n.insertBefore(s,t||null)),t=s;(t=t&&t.nextSibling)&&t.nodeType==8&&!t.data.startsWith("$s"););return t}function Ee(e,t){return t=t||[],e!=null&&typeof e!="boolean"&&(fe(e)?e.some(function(n){Ee(n,t)}):t.push(e)),t}function Ct(e,t,n,o){var r,i=e.key,s=e.type,_=t[n],f=_&&!(2&_.__u);if(_===null&&i==null||f&&i==_.key&&s==_.type)return n;if(o>(f?1:0)){for(r=n-1;r>=0;r--)if((_=t[r])&&!(2&_.__u)&&i==_.key&&s==_.type)return r;for(r=n+1;r<t.length;r++)if((_=t[r])&&!(2&_.__u)&&i==_.key&&s==_.type)return r}return-1}function We(e,t,n){n==null&&(n=""),t[0]=="-"?e.setProperty(t,n):e[t]=n}function ie(e,t,n,o,r){var i,s;if(t=="style")if(typeof n=="string")e.style.cssText=n;else{if(typeof o=="string"&&(e.style.cssText=o=""),o)for(t in o)n&&t in n||We(e.style,t);if(n)for(t in n)o&&n[t]==o[t]||We(e.style,t,n[t])}else if(t[0]=="o"&&t[1]=="n")typeof n!="function"&&(n=null),typeof o!="function"&&(o=null),(e.__e||(e.__e={}))[t]=n,n&&o||(s=xe[t]||(xe[t]=kt(t)),(e.__a||(e.__a={}))[t]=be,i=t!=(t=t.replace($e,"$1")),(t=t.slice(2))[0]<"a"&&(t=t.toLowerCase()),n?e.addEventListener(t,s,i):e.removeEventListener(t,s,i));else{if(r=="http://www.w3.org/2000/svg")t=t.replace(/xlink(H|:h)/,"h").replace(/sName$/,"s");else if(t!="width"&&t!="height"&&t!="href"&&t!="list"&&t!="form"&&t!="tabIndex"&&t!="download"&&t!="rowSpan"&&t!="colSpan"&&t!="role"&&t!="popover"&&t in e)try{return void(e[t]=n??"")}catch{}if(typeof n=="function")return;n==null||n===!1&&t[4]!="-"?e.removeAttribute(t):e.setAttribute(t,t=="popover"&&n==1?"":n)}}function kt(e){return function(t){var n=this.__e;if(n){if(n=n[e],t[ae]==null)t[ae]=be++;else if(t[ae]<this.__a[e])return;return n(x.event?x.event(t):t)}}}function Re(e,t,n,o,r,i,s,_,f,l){var c,p,m,u,v,E,b,h,y,R,w,K,Q,X,U,L,T,P,a=t.type;if(t.constructor!==ee)return null;128&n.__u&&(f=32&n.__u,c=n.__c.__z)&&(t.__u|=f,p=i=[],c.nodeType==8?_=se(c,i):i.push(c),_=i[0]||_),(c=x.__b)&&c(t);e:if(typeof a=="function"){m=s.length;try{if(h=t.props,y=(c=a.prototype)&&c.render,R=(c=a.contextType)&&o[c.__c],w=c?R?R.props.value:c.__:o,(u=n.__c)?(t.__c=u,2&u.__g&&(u.__g|=1)):(y?t.__c=u=new a(h,w):(t.__c=u=new V(h,w),u.constructor=a,u.render=At),R&&R.sub(u),u.state||(u.state={}),u.__n=o,u.__g|=8,u.__h=[],u.__k=[]),y&&(u.__s||(u.__s=u.state),a.getDerivedStateFromProps&&(u.__s==u.state&&(u.__s=z({},u.__s)),z(u.__s,a.getDerivedStateFromProps(h,u.__s)))),v=u.props,E=u.state,u.__v=t,n.__c){if(h!==v&&y&&!a.getDerivedStateFromProps&&u.componentWillReceiveProps&&u.componentWillReceiveProps(h,w),t.__v==n.__v&&!(8&u.__g)||!(4&u.__g)&&u.shouldComponentUpdate&&u.shouldComponentUpdate(h,u.__s,w)===!1){t.__v!=n.__v&&(u.props=h,u.state=u.__s,u.__g&=-9),t.__e=n.__e,t.__k=n.__k,t.__k.some(function(A){A&&(A.__=t)}),le.push.apply(u.__h,u.__k),u.__k=[],u.__h.length&&s.push(u),_=O(n);break e}u.componentWillUpdate&&u.componentWillUpdate(h,u.__s,w),y&&u.componentDidUpdate&&u.__h.push(function(){u.componentDidUpdate(v,E,b)})}else y&&!a.getDerivedStateFromProps&&u.componentWillMount&&u.componentWillMount(),y&&u.componentDidMount&&u.__h.push(u.componentDidMount);u.context=w,u.props=h,u.__P=e,u.__g&=-5,K=x.__r,Q=y?25:0;do u.__g&=-9,K&&K(t),c=u.render(u.props,u.state=u.__s,u.context);while(8&u.__g&&++Q<25);y&&(le.push.apply(u.__h,u.__k),u.__k=[]),u.state=u.__s,u.getChildContext&&(o=z({},o,u.getChildContext())),y&&n.__c&&u.getSnapshotBeforeUpdate&&(b=u.getSnapshotBeforeUpdate(v,E)),X=c&&c.type===N&&c.key==null?c.props.children:c,h.__P&&(c=_,r=(e=h.__P).namespaceURI,f=i=null,n.props&&n.props.__P!=e&&(n.__k.some(function(A){A&&Te(A,A)}),n.__k=null),_=n.__k?O(n,0):null),_=qe(e,fe(X)?X:[X],t,n,o,r,i,s,_,f,l),h.__P&&(t.__e=null,_=c),t.__u&=-161,p&&p.some($),u.__h.length&&s.push(u),1&u.__g&&(u.__g&=-4)}catch(A){if(s.length=m,t.__v=null,f||i)if(A&&A.then){if(t.__u|=128|f,i){for(~(T=i.indexOf(_||void 0))||(T=i.length);(P=i[T-1])&&P.nodeType==8;)T--;for(;T<i.length;T++)if(P=i[T])if(i[T]=null,U){if(P==L)break}else{if(P.nodeType!=8)break;P.data.startsWith("$s")&&(L=se(U=P))}}if(!U){for(;_&&_.nodeType==8&&_.nextSibling;)_=_.nextSibling;U=_}(c=se(U=t.__c.__z||(t.__c.__z=U)))?(t.__e=U,_=c):t.__e=_,_=_&&_.nextSibling}else i&&i.some($);else t.__e=n.__e;t.__k||(t.__k=n.__k||[]),A&&A.then||Ke(t),x.__e(A,t,n)}}else _=t.__e=St(n.__e,t,n,o,r,i,s,f,l,e);return(c=x.diffed)&&c(t),_}function se(e,t){if(e&&e.nodeType==8&&e.data.startsWith("$s"))for(var n=1;e=e.nextSibling;){if(e.nodeType==8){if(e.data.startsWith("$s"))n++;else if(e.data.startsWith("/$s")&&!--n)return e}t&&t.push(e)}}function Ke(e){e&&(e.__c&&(e.__c.__g|=4),e.__k&&e.__k.some(Ke))}function Qe(e,t,n){for(var o=0;o<n.length;)we(n[o++],n[o++],n[o++]);x.__c&&x.__c(t,e),e.some(function(r){try{e=r.__h,r.__h=[],e.some(function(i){i.call(r)})}catch(i){x.__e(i,r.__v)}})}function St(e,t,n,o,r,i,s,_,f,l){var c,p,m,u,v,E,b,h,y=n.props||ce,R=t.props,w=t.type;if(w=="svg"?r="http://www.w3.org/2000/svg":w=="math"?r="http://www.w3.org/1998/Math/MathML":r||(r="http://www.w3.org/1999/xhtml"),i){for(c=0;c<i.length;c++)if((v=i[c])&&(w?v.localName==w:v.nodeType==3)){e=v,i[c]=null;break}}if(!e){if(h=l.ownerDocument||document,!w)return h.createTextNode(R);e=h.createElementNS(r,w,R.is?R:l),_&&(x.__m&&x.__m(t,i),_=!1),i=null}if(w){if(l=w=="template"&&e.content||e,i=w=="textarea"&&R.defaultValue!=null?null:i&&ze.call(l.childNodes),!_&&i)for(y={},c=0;c<e.attributes.length;c++)y[(v=e.attributes[c]).name]=v.value;for(c in y)v=y[c],c=="dangerouslySetInnerHTML"?m=v:c=="children"||c in R||c=="value"&&"defaultValue"in R||c=="checked"&&"defaultChecked"in R||ie(e,c,null,v,r);for(c in R)v=R[c],c=="children"?u=v:c=="dangerouslySetInnerHTML"?p=v:c=="value"?E=v:c=="checked"?b=v:_&&typeof v!="function"||y[c]===v||ie(e,c,v,y[c],r);p?(_||m&&(p.__html==m.__html||p.__html==e.innerHTML)||(e.innerHTML=p.__html),t.__k=[]):(m&&(e.textContent=""),(w=="foreignObject"||r=="http://www.w3.org/1998/Math/MathML"&&Rt.test(w))&&(r="http://www.w3.org/1999/xhtml"),qe(l,fe(u)?u:[u],t,n,o,r,i,s,i?i[0]:n.__k&&O(n,0),_,f),i&&i.some($)),_&&w!="textarea"||(c="value",w=="progress"&&E==null?e.removeAttribute(c):E==null||E===e[c]&&(w!="progress"||E)||ie(e,c,E,y[c],r),c="checked",b!=null&&b!=e[c]&&ie(e,c,b,y[c],r))}else y===R||_&&e.data==R||(e.data=R);return e}function we(e,t,n,o){try{typeof e=="function"?t?t.__x=e(t)||1:o&&(o=o.__c||o.__e)&&(t=o.__x)&&(o.__x=null,typeof t=="function"?t():e(null)):e.current=t}catch(r){x.__e(r,n)}}function Te(e,t,n){var o,r,i,s;if(x.unmount&&x.unmount(e),!(o=e.ref)||o.current&&o.current!=e.__e||we(o,null,t,e),o=e.__c){if(o.componentWillUnmount)try{o.componentWillUnmount()}catch(_){x.__e(_,t)}o.__P=o.__n=null}if(o=e.__k)for(s=0;s<o.length;s++)o[s]&&Te(o[s],t,typeof e.type!="function"||n&&!e.props.__P);!n&&(o=e.__c)&&(o=o.__z)&&(r=se(o,i=[]))&&(o==e.__e&&i.some($),$(r),$(o)),n||$(e.__e),e.__e=e.__c=e.__=null}function At(e,t,n){return this.constructor(e,n)}function Ce(e,t){var n,o,r,i;x.__&&x.__(e,t),t.nodeType==9&&(t=t.documentElement),o=(n=e&&32&e.__u)?null:t.__k,t.__k=ue(N,{children:[e]}),r=[],i=[],Re(t,t.__k,o||ce,ce,t.namespaceURI,o?null:t.firstChild?ze.call(t.childNodes):null,r,o?o.__e:t.firstChild,n,i),Qe(r,t.__k,i),t.__k.props.children=null}x={__e:function(e,t,n,o){for(var r,i,s;t=t.__;)if((r=t.__c)&&!(1&r.__g)){r.__g|=4;try{if((s=(i=r.constructor)&&i.getDerivedStateFromError)&&r.setState(i.getDerivedStateFromError(e)),r.componentDidCatch&&(r.componentDidCatch(e,o||{}),s=1),s&&8&r.__g)return void(r.__g|=2)}catch(_){e=_}}throw _e=0,e}},He=0,bt=function(e){return e!=null&&e.constructor===ee},V.prototype.setState=function(e,t){var n=this.__s;n&&n!=this.state||(n=this.__s=z({},this.state)),typeof e=="function"&&(e=e(z({},n),this.props)),e&&(z(n,e),this.__v&&(t&&this.__k.push(t),Xe(this)))},V.prototype.forceUpdate=function(e){this.__v&&(this.__g|=4,e&&this.__h.push(e),Xe(this))},V.prototype.render=N,F=[],_e=0,Ge=function(e,t){return e.__v.__b-t.__v.__b},ae=Symbol(),$e=/(PointerCapture)$|Capture$/i,be=0,xe={},Et=0;var de,I,ke,Je,Pt=Object.is,Se=0,st=[],Ae=[],k=x,et=k.__b,tt=k.__r,nt=k.diffed,ot=k.__c,rt=k.unmount,it=k.__;function _t(e,t){k.__h&&k.__h(I,e,Se||t),Se=0;var n=I.__H||(I.__H={__:[],__h:[]});return e>=n.__.length&&n.__.push({}),n.__[e]}function ne(e,t){var n=_t(de++,3);!k.__s&&lt(n.__H,t)&&(n.__P=!0,n.__=e,n.u=t,I.__H.__h.push(n))}function Z(e){return Se=5,ct(function(){return{current:e}},[])}function ct(e,t){var n=_t(de++,7);return lt(n.__H,t)&&(n.__=e(),n.__H=t),n.__}function Ut(){var e;do{for(;e=Ae.shift();)try{te(e)}catch(n){k.__e(n,{__:(e=e.__P)&&e.__v})}for(;e=st.shift();){var t=e.__H;if(e.__P&&t)try{t.__h.some(te),t.__h.some(Pe),t.__h=[]}catch(n){t.__h=[],k.__e(n,e.__v)}}}while(Ae.length)}k.__b=function(e){I=null,et&&et(e)},k.__=function(e,t){e&&t.__k&&t.__k.__m&&(e.__m=t.__k.__m),it&&it(e,t)},k.__r=function(e){tt&&tt(e),de=0;var t=(I=e.__c).__H;t&&(ke==I?I.__h=[]:(t.__h.some(te),t.__h.some(Pe),de=0),t.__h=[],t.__.some(function(n){n.__N&&(n.__=n.__N),n.u=n.__N=void 0})),ke=I},k.diffed=function(e){nt&&nt(e);var t=e.__c;t&&t.__H&&(t.__H.__h.length&&ut(st.push(t)),t.__H.__.some(function(n){n.u&&(n.__H=n.u)})),ke=I=null},k.__c=function(e,t){t.some(function(n){try{n.__h.some(te),n.__h=n.__h.filter(function(o){return!o.__||Pe(o)})}catch(o){n.__h=[function(){throw o}]}}),ot&&ot(e,t)},k.unmount=function(e){rt&&rt(e);var t,n,o=e.__c;o&&o.__H&&(o.__H.__.some(function(r){try{if(r.__P&&r.__c){if(n===void 0){for(n=e.__;n&&(!n.__c||!n.__c.__P);)n=n.__;n=n&&n.__c}r.__P=n,ut(Ae.push(r))}else te(r)}catch(i){t=i}}),o.__H=void 0,t&&k.__e(t,o.__v))};var at=typeof requestAnimationFrame=="function";function It(e){var t,n=function(){clearTimeout(o),at&&cancelAnimationFrame(t),setTimeout(e)},o=setTimeout(n,35);at&&(t=requestAnimationFrame(n))}function ut(e){e!=1&&Je==k.requestAnimationFrame||((Je=k.requestAnimationFrame)||It)(Ut)}function te(e){var t=I,n=e.__c;typeof n=="function"&&(e.__c=void 0,n()),I=t}function Pe(e){var t=I;e.__c=e.__(),I=t}function lt(e,t){return!e||e.length!=t.length||t.some(function(n,o){return!Pt(n,e[o])})}var ft=Object.assign;var Nt=/^(-|f[lo].*[^se]$|g.{5,}[^ps]$|z|o[pr]|(W.{5})?[lL]i.*(t|mp)$|an|(bo|s).{4}Im|sca|m.{6}[ds]|ta|c.*[st]$|wido|ini|asp|fill|st)/;var Lt=Symbol.for("react.element"),Ft=/^(?:accent|alignment|arabic|baseline|cap|clip(?!PathU)|color|dominant|fill|flood|font|glyph(?!R)|horiz|image(?!S)|letter|lighting|marker(?!H|W|U)|overline|paint|pointer|shape|stop|strikethrough|stroke|text(?!L)|transform|underline|unicode|units|v|vector|vert|word|writing|x(?!C))[A-Z]/,Vt=/[A-Z0-9]/g,Ot=typeof document<"u";var Xt=function(e){return/fil|che|rad/.test(e)};V.prototype.isReactComponent=!0,["componentWillMount","componentWillReceiveProps","componentWillUpdate"].forEach(function(e){Object.defineProperty(V.prototype,e,{configurable:!0,get:function(){return this["UNSAFE_"+e]},set:function(t){Object.defineProperty(this,e,{configurable:!0,writable:!0,value:t})}})});var dt=x.event;x.event=function(e){return dt&&(e=dt(e)),e.persist=function(){},e.isPropagationStopped=function(){return this.cancelBubble},e.isDefaultPrevented=function(){return this.defaultPrevented},e.nativeEvent=e};var Wt={configurable:!0,get:function(){return this.class}},pt=x.vnode;x.vnode=function(e){if(typeof e.type=="string")(function(o){var r=o.props,i=o.type,s={},_=i.indexOf("-")==-1;for(var f in r){var l=r[f];if(!(f=="value"&&"defaultValue"in r&&l==null||Ot&&f=="children"&&i=="noscript"||f=="class"||f=="className")){if(f=="style"&&l&&l.constructor==Object){var c=void 0;for(var p in l)typeof l[p]!="number"||Nt.test(p)||(c||(c=l=ft({},l)),l[p]+="px")}else if(f=="defaultValue"&&"value"in r&&r.value==null)f="value";else if(f=="download"&&l===!0)l="";else if(f=="translate"&&l==="no")l=!1;else if(f[0]=="o"&&f[1]=="n"){var m=f.toLowerCase();m=="ondoubleclick"?f="ondblclick":m!="onchange"||i!="input"&&i!="textarea"||Xt(r.type)?m=="onfocus"?f="onfocusin":m=="onblur"&&(f="onfocusout"):m=f="oninput",m=="oninput"&&s[f=m]&&(f="oninputCapture")}else _&&Ft.test(f)?f=f.replace(Vt,"-$&").toLowerCase():l===null&&(l=void 0);s[f]=l}}if(i=="select"){var u=s.defaultValue!=null?s.defaultValue:s.multiple&&Array.isArray(s.value)?s.value:null;u!=null&&(s.value=Ee(r.children).forEach(function(v){v.props.selected=s.multiple?u.indexOf(v.props.value)!=-1:u==v.props.value}))}r.class&&!r.className?(s.class=r.class,Object.defineProperty(s,"className",Wt)):r.className&&(s.class=s.className=r.className),o.props=s})(e);else if(typeof e.type=="function"&&("ref"in e.props&&"prototype"in e.type&&e.type.prototype.render&&(e.ref=e.props.ref,delete e.props.ref),e.type.defaultProps)){var t=ft({},e.props);for(var n in e.type.defaultProps)t[n]===void 0&&(t[n]=e.type.defaultProps[n]);e.props=t}e.ref&&!("ref"in e.props)&&Object.defineProperty(e.props,"ref",{value:e.ref,configurable:!0,writable:!0}),e.$$typeof=Lt,pt&&pt(e)};var Ht=Symbol.for("pv"),Gt=0;function oe(e,t,n,o,r,i){t||(t={});var s,_,f=t;if("ref"in f&&typeof e!="function")for(_ in f={},t)_=="ref"?s=t[_]:f[_]=t[_];var l={type:e,props:f,key:n,ref:s,__k:null,__:null,__b:0,__e:null,__c:null,constructor:Ht,__v:--Gt,__i:-1,__u:0};return(r||i)&&(l.__source=r,l.__self=i),x.vnode&&x.vnode(l),l}var $t=512,pe=2048,mt=2560*1600*2,zt=`#version 300 es
layout(location = 0) in vec2 a_position;
uniform vec2 u_resolution;
uniform float u_imageAspect;
uniform float u_scale;
uniform float u_rotation;
out vec2 v_imageUV;

void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
  vec2 uv = a_position * 0.5;
  float r = u_rotation * 3.14159265358979323846 / 180.0;
  mat2 turn = mat2(cos(r), sin(r), -sin(r), cos(r));
  vec2 imageBox;
  imageBox.x = min(u_resolution.x / u_imageAspect, u_resolution.y) * u_imageAspect;
  imageBox.y = imageBox.x / u_imageAspect;
  v_imageUV = uv * (u_resolution / imageBox) / u_scale;
  v_imageUV.x *= u_imageAspect;
  v_imageUV = turn * v_imageUV;
  v_imageUV.x /= u_imageAspect;
  v_imageUV += 0.5;
  v_imageUV.y = 1.0 - v_imageUV.y;
}`,jt=`#version 300 es
precision highp float;

uniform sampler2D u_image;
uniform vec2 u_resolution;
uniform float u_time;
uniform vec4 u_colorBack;
uniform vec4 u_colorTint;
uniform float u_softness;
uniform float u_repetition;
uniform float u_shiftRed;
uniform float u_shiftBlue;
uniform float u_distortion;
uniform float u_contour;
uniform float u_angle;
uniform vec2 u_tilt;
uniform float u_reveal;
uniform float u_light;

in vec2 v_imageUV;

out vec4 fragColor;

#define PI 3.14159265358979323846

vec2 rotate(vec2 uv, float th) {
  return mat2(cos(th), sin(th), -sin(th), cos(th)) * uv;
}

vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

float getColorChanges(float c1, float c2, float stripe, vec3 w, float blur, float bump, float tint) {
  float ch = mix(c2, c1, smoothstep(0.0, 2.0 * blur, stripe));
  float border = w[0];
  ch = mix(ch, c2, smoothstep(border, border + 2.0 * blur, stripe));
  bump = smoothstep(0.2, 0.8, bump);
  border = w[0] + 0.4 * (1.0 - bump) * w[1];
  ch = mix(ch, c1, smoothstep(border, border + 2.0 * blur, stripe));
  border = w[0] + 0.5 * (1.0 - bump) * w[1];
  ch = mix(ch, c2, smoothstep(border, border + 2.0 * blur, stripe));
  border = w[0] + w[1];
  ch = mix(ch, c1, smoothstep(border, border + 2.0 * blur, stripe));
  float gradientT = (stripe - w[0] - w[1]) / w[2];
  float gradient = mix(c1, c2, smoothstep(0.0, 1.0, gradientT));
  ch = mix(ch, gradient, smoothstep(border, border + 0.5 * blur, stripe));
  ch = mix(ch, 1.0 - min(1.0, (1.0 - ch) / max(tint, 0.0001)), u_colorTint.a);
  return ch;
}

float getImgFrame(vec2 uv, float th) {
  float frame = 1.0;
  frame *= smoothstep(0.0, th, uv.y);
  frame *= 1.0 - smoothstep(1.0 - th, 1.0, uv.y);
  frame *= smoothstep(0.0, th, uv.x);
  frame *= 1.0 - smoothstep(1.0 - th, 1.0, uv.x);
  return frame;
}

float blurEdge3x3(sampler2D tex, vec2 uv, vec2 dudx, vec2 dudy, float radius, float centerSample) {
  vec2 texel = 1.0 / vec2(textureSize(tex, 0));
  vec2 r = radius * texel;
  float sum = 4.0 * centerSample;
  sum += 2.0 * textureGrad(tex, uv + vec2(0.0, -r.y), dudx, dudy).r;
  sum += 2.0 * textureGrad(tex, uv + vec2(0.0, r.y), dudx, dudy).r;
  sum += 2.0 * textureGrad(tex, uv + vec2(-r.x, 0.0), dudx, dudy).r;
  sum += 2.0 * textureGrad(tex, uv + vec2(r.x, 0.0), dudx, dudy).r;
  sum += textureGrad(tex, uv + vec2(-r.x, -r.y), dudx, dudy).r;
  sum += textureGrad(tex, uv + vec2(r.x, -r.y), dudx, dudy).r;
  sum += textureGrad(tex, uv + vec2(-r.x, r.y), dudx, dudy).r;
  sum += textureGrad(tex, uv + vec2(r.x, r.y), dudx, dudy).r;
  return sum / 16.0;
}

void main() {
  const float firstFrameOffset = 2.8;
  float t = 0.3 * (u_time + firstFrameOffset);

  vec2 uv = v_imageUV;
  vec2 dudx = dFdx(v_imageUV);
  vec2 dudy = dFdy(v_imageUV);
  vec4 img = textureGrad(u_image, uv, dudx, dudy);

  float cycleWidth = u_repetition;

  vec2 rotatedUV = uv - vec2(0.5);
  float angle = (-u_angle + 70.0) * PI / 180.0;
  float cosA = cos(angle);
  float sinA = sin(angle);
  rotatedUV = vec2(rotatedUV.x * cosA - rotatedUV.y * sinA, rotatedUV.x * sinA + rotatedUV.y * cosA) + vec2(0.5);

  float edge = blurEdge3x3(u_image, uv, dudx, dudy, 6.0, img.r);
  edge = pow(edge, 1.6);
  edge *= smoothstep(0.0, 0.4, u_contour);

  float opacity = img.g * getImgFrame(v_imageUV, 0.0);
  float depth = img.r;

  float diagBLtoTR = rotatedUV.x - rotatedUV.y;
  float diagTLtoBR = rotatedUV.x + rotatedUV.y;

  vec3 color1 = mix(vec3(0.98, 0.98, 1.0), vec3(0.9, 0.9, 0.93), u_light);
  vec3 color2 = vec3(0.1, 0.1, 0.1 + 0.1 * smoothstep(0.7, 1.3, diagTLtoBR));

  vec2 gradUV = uv - 0.5 - u_tilt * vec2(0.18, -0.12);
  float dist = length(gradUV + vec2(0.0, 0.2 * diagBLtoTR));
  gradUV = rotate(gradUV, (0.25 - 0.2 * diagBLtoTR) * PI);
  float direction = gradUV.x;

  float bump = pow(1.8 * dist, 1.2);
  bump = 1.0 - bump;
  bump *= pow(uv.y, 0.3);

  float thinStrip1 = 0.12 / cycleWidth * (1.0 - 0.4 * bump);
  float thinStrip2 = 0.07 / cycleWidth * (1.0 + 0.4 * bump);
  float wideStrip = 1.0 - thinStrip1 - thinStrip2;

  float noise = snoise(uv - t);
  edge += (1.0 - edge) * u_distortion * noise;

  direction += diagBLtoTR;
  direction -= 2.0 * noise * diagBLtoTR * (smoothstep(0.0, 1.0, edge) * (1.0 - smoothstep(0.0, 1.0, edge)));
  direction *= mix(1.0, 1.0 - edge, smoothstep(0.5, 1.0, u_contour));
  direction -= 1.7 * edge * smoothstep(0.5, 1.0, u_contour);
  direction += 0.2 * pow(u_contour, 4.0) * (1.0 - smoothstep(0.0, 1.0, edge));

  bump *= clamp(pow(uv.y, 0.1), 0.3, 1.0);
  direction *= 0.1 + (1.1 - edge) * bump;
  direction *= 0.4 + 0.6 * (1.0 - smoothstep(0.5, 1.0, edge));
  direction += 0.18 * (smoothstep(0.1, 0.2, uv.y) * (1.0 - smoothstep(0.2, 0.4, uv.y)));
  direction += 0.03 * (smoothstep(0.1, 0.2, 1.0 - uv.y) * (1.0 - smoothstep(0.2, 0.4, 1.0 - uv.y)));
  direction *= 0.5 + 0.5 * pow(uv.y, 2.0);
  direction *= cycleWidth;
  direction -= t + dot(u_tilt, vec2(0.35, 0.2));

  float colorDispersion = clamp(1.0 - bump, 0.0, 1.0);
  float dispersionRed = colorDispersion;
  dispersionRed += 0.03 * bump * noise;
  dispersionRed += 5.0 * (smoothstep(-0.1, 0.2, uv.y) * (1.0 - smoothstep(0.1, 0.5, uv.y))) * (smoothstep(0.4, 0.6, bump) * (1.0 - smoothstep(0.4, 1.0, bump)));
  dispersionRed -= diagBLtoTR;

  float dispersionBlue = colorDispersion * 1.3;
  dispersionBlue += (smoothstep(0.0, 0.4, uv.y) * (1.0 - smoothstep(0.1, 0.8, uv.y))) * (smoothstep(0.4, 0.6, bump) * (1.0 - smoothstep(0.4, 0.8, bump)));
  dispersionBlue -= 0.2 * edge;

  dispersionRed *= u_shiftRed / 20.0;
  dispersionBlue *= u_shiftBlue / 20.0;

  float softness = 0.05 * u_softness;
  float blur = softness + 0.5 * smoothstep(1.0, 10.0, u_repetition) * smoothstep(0.0, 1.0, edge);
  float smallCanvas = 1.0 - smoothstep(100.0, 500.0, min(u_resolution.x, u_resolution.y));
  blur += smallCanvas * smoothstep(0.0, 1.0, edge);
  float rExtraBlur = softness * (0.05 + 0.1 * (u_shiftRed / 20.0) * bump);
  float gExtraBlur = softness * 0.05 / max(0.001, abs(1.0 - diagBLtoTR));

  vec3 w = vec3(thinStrip1 * cycleWidth, thinStrip2 * cycleWidth, wideStrip);
  w[1] -= 0.02 * smoothstep(0.0, 1.0, edge + bump);
  float stripeR = fract(direction + dispersionRed);
  float r = getColorChanges(color1.r, color2.r, stripeR, w, blur + fwidth(stripeR) + rExtraBlur, bump, u_colorTint.r);
  float stripeG = fract(direction);
  float g = getColorChanges(color1.g, color2.g, stripeG, w, blur + fwidth(stripeG) + gExtraBlur, bump, u_colorTint.g);
  float stripeB = fract(direction - dispersionBlue);
  float b = getColorChanges(color1.b, color2.b, stripeB, w, blur + fwidth(stripeB), bump, u_colorTint.b);

  vec3 sheen = mix(vec3(1.0), u_colorTint.rgb, 0.45 * u_colorTint.a);
  r *= sheen.r;
  g *= sheen.g;
  b *= sheen.b;

  float rim = smoothstep(0.78, 1.0, depth) * u_light;
  r *= 1.0 - rim * 0.62;
  g *= 1.0 - rim * 0.62;
  b *= 1.0 - rim * 0.58;

  float pour = u_reveal * 1.25 - 0.1;
  opacity *= smoothstep(1.0 - pour, 1.15 - pour, depth) * smoothstep(0.0, 0.25, u_reveal);

  vec3 color = vec3(r, g, b) * opacity;
  vec3 back = u_colorBack.rgb * u_colorBack.a;
  color += back * (1.0 - opacity);
  opacity += u_colorBack.a * (1.0 - opacity);
  color += 1.0 / 256.0 * (fract(sin(dot(0.014 * gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453123) - 0.5);
  fragColor = vec4(color, opacity);
}`,B=(e,t,n)=>Math.min(n,Math.max(t,e)),ht=(()=>{let e=null;return(t,n)=>{if(typeof document>"u"||(e??(e=document.createElement("canvas").getContext("2d",{willReadFrequently:!0})),!e))return n;e.clearRect(0,0,1,1),e.fillStyle="rgba(0, 0, 0, 0)",e.fillStyle=String(t),e.fillRect(0,0,1,1);let[o,r,i,s]=e.getImageData(0,0,1,1).data;return[o/255,r/255,i/255,s/255]}})(),Yt=e=>new Promise((t,n)=>{let o=new Image;o.crossOrigin="anonymous",o.onload=()=>t(o),o.onerror=()=>n(new Error("MetallicPaint: failed to load the image")),o.src=e}),qt=async e=>{if(/\.svg($|[?#])/i.test(e)||e.startsWith("data:image/svg+xml"))return!0;if(!e.startsWith("blob:"))return!1;try{return(await(await fetch(e)).blob()).type==="image/svg+xml"}catch{return!1}},Zt=async e=>{let[t,n]=await Promise.all([Yt(e),qt(e)]),o=t.naturalWidth||t.width||pe,r=t.naturalHeight||t.height||pe,i=Math.max(o,r),s=n?pe/i:B(1024/i,1,pe/i);o=Math.max(1,Math.round(o*s)),r=Math.max(1,Math.round(r*s));let _=document.createElement("canvas");_.width=o,_.height=r;let f=_.getContext("2d",{willReadFrequently:!0});f.drawImage(t,0,0,o,r);let l=f.getImageData(0,0,o,r),c=!0;for(let p=3;p<l.data.length;p+=4)if(l.data[p]<250){c=!1;break}if(c){for(let p=0;p<l.data.length;p+=4){let m=Math.min(l.data[p],l.data[p+1],l.data[p+2]);l.data[p+3]=Math.round(B((250-m)/30,0,1)*255)}f.putImageData(l,0,0)}return _},Kt=async(e,t,n)=>{let r=`${n} 320px ${t}`;try{await document.fonts?.load(r,e)}catch{return null}let i=document.createElement("canvas").getContext("2d");i.font=r;let s=i.measureText(e),_=s.actualBoundingBoxAscent||320*.8,f=s.actualBoundingBoxDescent||320*.2,l=s.actualBoundingBoxLeft||0,c=s.actualBoundingBoxRight||s.width,p=320*.12,m=document.createElement("canvas");m.width=Math.ceil(l+c+p*2),m.height=Math.ceil(_+f+p*2);let u=m.getContext("2d");return u.font=r,u.fillStyle="#000",u.textBaseline="alphabetic",u.fillText(e,p+l,p+_),m},Qt=(e,t,n)=>{let o=[];for(let l=0;l<n;l++)for(let c=0;c<t;c++){let p=l*t+c;if(!e[p])continue;c===0||l===0||c===t-1||l===n-1||!e[p-1]||!e[p+1]||!e[p-t]||!e[p+t]||!e[p-t-1]||!e[p-t+1]||!e[p+t-1]||!e[p+t+1]||o.push(p)}let r=new Float32Array(t*n),i=[],s=[];o.forEach(l=>(l%t+Math.floor(l/t))%2===0?i.push(l):s.push(l));let _=l=>{for(let c=0;c<l.length;c++){let p=l[c],m=r[p+1]+r[p-1]+r[p-t]+r[p+t];r[p]=1.9*((.01+m)/4)-.9*r[p]}};for(let l=0;l<40;l++)_(i),_(s);let f=0;return o.forEach(l=>{r[l]>f&&(f=r[l])}),{field:r,peak:f||1}},Jt=e=>{let t=e.width,n=e.height,o=$t/Math.min(t,n),r=Math.max(2,Math.round(t*o)),i=Math.max(2,Math.round(n*o)),s=document.createElement("canvas");s.width=r,s.height=i;let _=s.getContext("2d",{willReadFrequently:!0});_.drawImage(e,0,0,r,i);let f=_.getImageData(0,0,r,i).data,l=new Uint8Array(r*i);for(let h=0;h<l.length;h++)l[h]=f[h*4+3]>0?1:0;let{field:c,peak:p}=Qt(l,r,i),m=_.createImageData(r,i);for(let h=0;h<l.length;h++){let y=h*4,R=l[h]?255*(1-c[h]/p):255;m.data[y]=R,m.data[y+1]=R,m.data[y+2]=R,m.data[y+3]=l[h]?255:0}_.putImageData(m,0,0);let u=document.createElement("canvas");u.width=t,u.height=n;let v=u.getContext("2d",{willReadFrequently:!0});v.imageSmoothingEnabled=!0,v.imageSmoothingQuality="high",v.drawImage(s,0,0,r,i,0,0,t,n);let E=v.getImageData(0,0,t,n),b=e.getContext("2d",{willReadFrequently:!0}).getImageData(0,0,t,n).data;for(let h=0;h<E.data.length;h+=4){let y=b[h+3];y===0?(E.data[h]=255,E.data[h+1]=0):(E.data[h]=E.data[h+3]===0?0:E.data[h],E.data[h+1]=y),E.data[h+2]=255,E.data[h+3]=255}return E},vt=(e,t,n)=>{let o=e.createShader(t);return o?(e.shaderSource(o,n),e.compileShader(o),e.getShaderParameter(o,e.COMPILE_STATUS)?o:(e.deleteShader(o),null)):null};function Ue({imageSrc:e,text:t,fontFamily:n="system-ui, sans-serif",fontWeight:o=800,color:r="#ffffff",backgroundColor:i="transparent",density:s=2,softness:_=.1,dispersion:f=.3,distortion:l=.07,edgeBend:c=.6,angle:p=70,speed:m=1,scale:u=.6,rotation:v=0,mouseTilt:E=.5,lightMode:b=!1,intro:h=!0,paused:y=!1,dpr:R,className:w="",style:K}){let Q=Z(null),X=Z(null),U=Z(null),L=Z(null);return L.current={tint:ht(r,[1,1,1,1]),back:ht(i,[0,0,0,0]),density:B(s,.5,12),softness:B(_,0,1),dispersion:B(f,-1,1),distortion:B(l,0,1),edgeBend:B(c,0,1),angle:p,speed:m,scale:Math.max(.05,u),rotation:v,mouseTilt:B(E,0,1.5),lightMode:b,intro:h,paused:y,dpr:R},ne(()=>{let T=Q.current,P=X.current;if(!T||!P)return;let a=P.getContext("webgl2",{alpha:!0,premultipliedAlpha:!0,antialias:!1});if(!a)return;let A=vt(a,a.VERTEX_SHADER,zt),me=vt(a,a.FRAGMENT_SHADER,jt),M=a.createProgram();if(!A||!me||!M||(a.attachShader(M,A),a.attachShader(M,me),a.linkProgram(M),a.deleteShader(A),a.deleteShader(me),!a.getProgramParameter(M,a.LINK_STATUS)))return;a.useProgram(M);let S={},xt=a.getProgramParameter(M,a.ACTIVE_UNIFORMS);for(let g=0;g<xt;g++){let C=a.getActiveUniform(M,g);C&&(S[C.name]=a.getUniformLocation(M,C.name))}let he=a.createVertexArray(),Ie=a.createBuffer();a.bindVertexArray(he),a.bindBuffer(a.ARRAY_BUFFER,Ie),a.bufferData(a.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),a.STATIC_DRAW),a.enableVertexAttribArray(0),a.vertexAttribPointer(0,2,a.FLOAT,!1,0,0);let ve=a.createTexture();a.activeTexture(a.TEXTURE0),a.bindTexture(a.TEXTURE_2D,ve),a.texImage2D(a.TEXTURE_2D,0,a.RGBA,1,1,0,a.RGBA,a.UNSIGNED_BYTE,new Uint8Array([255,0,255,255])),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_WRAP_S,a.CLAMP_TO_EDGE),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_WRAP_T,a.CLAMP_TO_EDGE),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_MIN_FILTER,a.LINEAR),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_MAG_FILTER,a.LINEAR),a.uniform1i(S.u_image,0);let Me=window.matchMedia?.("(prefers-reduced-motion: reduce)").matches??!1,d={raf:0,last:0,time:0,visible:!0,pending:!1,hasImage:!1,imageAspect:1,width:0,height:0,revealStart:-1,reveal:L.current.intro&&!Me?0:1,tiltX:0,tiltY:0,velocityX:0,velocityY:0,targetX:0,targetY:0,alive:!0},ge=()=>{let g=L.current,C=T.getBoundingClientRect(),Y=g.dpr??Math.min(window.devicePixelRatio||1,2),D=Math.max(Y,2),q=C.width*C.height*D*D;q>mt&&(D*=Math.sqrt(mt/q));let H=Math.max(1,Math.round(C.width*D)),G=Math.max(1,Math.round(C.height*D));H===d.width&&G===d.height||(d.width=H,d.height=G,P.width=H,P.height=G,a.viewport(0,0,H,G))},j=()=>{let g=L.current;if(d.pending||!d.hasImage){a.clearColor(0,0,0,0),a.clear(a.COLOR_BUFFER_BIT);return}a.useProgram(M),a.uniform2f(S.u_resolution,d.width,d.height),a.uniform1f(S.u_time,d.time),a.uniform1f(S.u_imageAspect,d.imageAspect),a.uniform1f(S.u_scale,g.scale),a.uniform1f(S.u_rotation,g.rotation),a.uniform4f(S.u_colorBack,g.back[0],g.back[1],g.back[2],g.back[3]),a.uniform4f(S.u_colorTint,g.tint[0],g.tint[1],g.tint[2],g.tint[3]),a.uniform1f(S.u_softness,g.softness),a.uniform1f(S.u_repetition,g.density),a.uniform1f(S.u_shiftRed,g.dispersion),a.uniform1f(S.u_shiftBlue,g.dispersion),a.uniform1f(S.u_distortion,g.distortion),a.uniform1f(S.u_contour,g.edgeBend),a.uniform1f(S.u_angle,g.angle),a.uniform2f(S.u_tilt,d.tiltX,d.tiltY),a.uniform1f(S.u_reveal,d.reveal),a.uniform1f(S.u_light,g.lightMode?1:0),a.clearColor(0,0,0,0),a.clear(a.COLOR_BUFFER_BIT),a.bindVertexArray(he),a.drawArrays(a.TRIANGLE_STRIP,0,4)},Be=g=>{if(d.raf=0,!d.alive)return;let C=L.current,Y=d.last?Math.min(.05,(g-d.last)/1e3):1/60;d.last=g;let D=!C.paused&&!Me&&C.speed!==0;D&&(d.time+=Y*C.speed);let q=D;if(d.reveal<1&&!d.pending){d.revealStart<0&&(d.revealStart=g);let J=B((g-d.revealStart)/1600,0,1);d.reveal=1-(1-J)**3,D&&(d.time+=Y*2.4*(1-J)**2),q=!0}let H=60,G=14,Oe=Math.max(1,Math.ceil(Y/(1/240))),re=Y/Oe;for(let J=0;J<Oe;J++)d.velocityX+=(H*(d.targetX*C.mouseTilt-d.tiltX)-G*d.velocityX)*re,d.velocityY+=(H*(d.targetY*C.mouseTilt-d.tiltY)-G*d.velocityY)*re,d.tiltX+=d.velocityX*re,d.tiltY+=d.velocityY*re;(Math.abs(d.targetX*C.mouseTilt-d.tiltX)>5e-4||Math.abs(d.targetY*C.mouseTilt-d.tiltY)>5e-4||Math.abs(d.velocityX)+Math.abs(d.velocityY)>5e-4)&&(q=!0),j(),q&&d.visible?d.raf=requestAnimationFrame(Be):d.last=0},W=()=>{!d.raf&&d.alive&&d.visible&&(d.raf=requestAnimationFrame(Be))},De=g=>{let C=T.getBoundingClientRect();d.targetX=B((g.clientX-C.left)/C.width*2-1,-1.2,1.2),d.targetY=B((g.clientY-C.top)/C.height*2-1,-1.2,1.2),W()},Ne=()=>{d.targetX=0,d.targetY=0,W()},Le=new ResizeObserver(()=>{ge(),j()});Le.observe(T);let Fe=new IntersectionObserver(g=>{d.visible=g.some(C=>C.isIntersecting),d.visible&&W()});Fe.observe(T);let Ve=g=>{g.preventDefault(),d.alive=!1,cancelAnimationFrame(d.raf)};return P.addEventListener("webglcontextlost",Ve),T.addEventListener("pointermove",De),T.addEventListener("pointerleave",Ne),U.current={setPending:g=>{d.pending=g,j()},setImage:g=>{d.pending=!1,a.bindTexture(a.TEXTURE_2D,ve),g?(a.texImage2D(a.TEXTURE_2D,0,a.RGBA,a.RGBA,a.UNSIGNED_BYTE,g),a.generateMipmap(a.TEXTURE_2D),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_MIN_FILTER,a.LINEAR_MIPMAP_LINEAR),d.imageAspect=g.width/g.height,d.hasImage=!0):(a.texImage2D(a.TEXTURE_2D,0,a.RGBA,1,1,0,a.RGBA,a.UNSIGNED_BYTE,new Uint8Array([255,0,255,255])),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_MIN_FILTER,a.LINEAR),d.imageAspect=1,d.hasImage=!1),j(),W()},wake:W,redraw:()=>{ge(),j(),W()}},ge(),j(),W(),()=>{d.alive=!1,cancelAnimationFrame(d.raf),Le.disconnect(),Fe.disconnect(),P.removeEventListener("webglcontextlost",Ve),T.removeEventListener("pointermove",De),T.removeEventListener("pointerleave",Ne),U.current=null,a.deleteTexture(ve),a.deleteBuffer(Ie),a.deleteVertexArray(he),a.deleteProgram(M)}},[]),ne(()=>{let T=!0,P=t?Kt(t,n,o):e?Zt(e):null;if(!P){U.current?.setImage(null);return}return U.current?.setPending(!0),P.then(a=>{if(!T||!a)return;let A=Jt(a);T&&U.current?.setImage(A)}).catch(()=>{T&&U.current?.setImage(null)}),()=>{T=!1}},[e,t,n,o]),ne(()=>{U.current?.redraw()}),oe("div",{ref:Q,className:`metallic-paint ${w}`.trim(),style:K,children:oe("canvas",{ref:X,className:"metallic-paint-canvas"})})}var gt=document.getElementById("metallic-paint-root"),yt=document.getElementById("metallic-paint-mount"),en=(()=>{try{return!!document.createElement("canvas").getContext("webgl2")}catch{return!1}})();gt&&yt&&en&&(Ce(oe(Ue,{text:"TT",fontFamily:'"Barlow Condensed", Impact, sans-serif',fontWeight:900,color:"#e4ebf1",density:2.2,softness:.12,dispersion:.34,distortion:.06,edgeBend:.85,angle:62,speed:.7,scale:.86,rotation:-2,mouseTilt:.4,intro:!0,className:"metallic-paint-monogram"}),yt),gt.dataset.mounted="true");
