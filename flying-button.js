var $,zt,wo,ke,ht,Qe,Ht,Ke,Wt,vt,dt,To,Be=Symbol.for("pv"),et={},tt=[],Co=/^m(i|n|o|s|text|space)$/,ot=Array.isArray,Vt=tt.slice,Re=Object.assign;function Se(t){t&&t.parentNode&&t.remove()}function Ye(t,o,n,u,i){var s={type:t,props:o,key:n,ref:u,__k:null,__:null,__b:0,__e:null,__c:null,constructor:Be,__v:i||++zt,__i:-1,__u:0};return!i&&$.vnode&&$.vnode(s),s}function de(t){return t.children}function we(t,o){this.props=t,this.context=o,this.__g=0}function Te(t,o){if(o==null)return t.__&&Te(t.__,t.__i+1);for(var n;o<t.__k.length;o++)if((n=t.__k[o])&&n.__e)return n.__e;return typeof t.type!="function"||t.props.__P?null:Te(t)}function Mo(t){var o,n=t.__v,u=n.__e,i=[],s=[],_=t.__P;_&&((o=Re({constructor:Be},n)).__v=n.__v+1,$.vnode&&$.vnode(o),yt(_,o,n,t.__n,_.namespaceURI,32&n.__u?[u]:null,i,u||Te(n),32&n.__u,s),o.__v=n.__v,o.__.__k[o.__i]=o,Kt(i,o,s),n.__=n.__e=null,o.__e!=u&&Ot(o))}function Ot(t){if((t=t.__)&&t.__c&&!t.props.__P)return t.__e=null,t.__k.some(function(o){return o&&(t.__e=o.__e)}),Ot(t)}function Bt(t){(8&t.__g||(t.__g|=8,ke.push(t),Qe++))&&ht==$.debounceRendering||((ht=$.debounceRendering)||queueMicrotask)(qt)}function qt(){try{for(var t,o=1;ke.length;)ke.length>o&&ke.sort(Ht),t=ke.shift(),o=ke.length,8&t.__g&&Mo(t)}finally{(Qe=ke.length)&&(ht||queueMicrotask)(qt)}}function Jt(t,o,n,u,i,s,_,h,e,k,a){var D,T,c,M,G,E,W=u.__k||tt,U=o.length;for(e=Eo(n,o,W,e,U),D=0;D<U;D++)(c=n.__k[D])!=null&&(T=~c.__i&&W[c.__i]||et,c.__i=D,E=yt(t,c,T,i,s,_,h,e,k,a),M=c.__e,(T.ref!=c.ref||8&T.__u)&&(T.ref&&xt(T.ref,null,c,T),c.ref&&a.push(c.ref,c.__c||M,c)),G=G||M,4&c.__u?(e=Xt(c,e,t,!T.__v),T.__e&&(T.__e=null)):typeof c.type=="function"&&E!==void 0?e=E:M&&(e=M.nextSibling),c.__u&=-21);return n.__e=G,e}function Eo(t,o,n,u,i){var s,_,h,e,k,a,D,T,c,M=n.length,G=M,E=0,W=0,U=t.__k=Array(i);for(s=0;s<i;s++)(_=o[s])!=null&&typeof _!="boolean"&&typeof _!="function"?(typeof _!="object"||_.constructor===String?_=U[s]=Ye(null,_):ot(_)?_=U[s]=Ye(de,{children:_}):_.constructor===Be&&_.__b?_=U[s]=Ye(_.type,_.props,_.key,_.ref,_.__v):U[s]=_,e=s+E,_.__=t,_.__b=t.__b+1,h=null,~(k=_.__i=So(_,n,e,G))&&(G--,(h=n[k])&&(h.__u|=2)),h&&h.__v?(_.__u|=16,k==e-1?E--:k==e+1?E++:k!=e&&(k>e?E--:E++,W=1)):(~k||(i>M?E--:i<M&&E++),typeof _.type!="function"&&(_.__u|=4))):U[s]=null;if(W){for(a=[],D=[],s=0;s<i;s++)if((_=U[s])&&16&_.__u){for(E=0,T=a.length;E<T;)a[c=E+T>>1]<_.__i?E=c+1:T=c;a[E]=_.__i,D[s]=E+1}for(E=a.length;s--;)D[s]&&(D[s]==E?E--:U[s].__u|=4)}if(G)for(s=0;s<M;s++)!(h=n[s])||2&h.__u||(h.__e==u&&(u=Te(h)),bt(h,h));return u}function Xt(t,o,n,u){var i,s,_,h;if(typeof t.type=="function"){if(t.props.__P)return o;if(i=t.__k)for(s=0;s<i.length;s++)i[s]&&(i[s].__=t,o=Xt(i[s],o,n,!1));return o}for(o&&!o.parentNode&&(o=Te(t))&&!o.parentNode&&(o=null),_=t.__e,h=o;h&&h.nodeType==8;)h=h.nextSibling;for(_!=h&&(!u&&n.moveBefore&&_.parentNode?n.moveBefore(_,o):n.insertBefore(_,o||null)),o=_;(o=o&&o.nextSibling)&&o.nodeType==8&&!o.data.startsWith("$s"););return o}function mt(t,o){return o=o||[],t!=null&&typeof t!="boolean"&&(ot(t)?t.some(function(n){mt(n,o)}):o.push(t)),o}function So(t,o,n,u){var i,s=t.key,_=t.type,h=o[n],e=h&&!(2&h.__u);if(h===null&&s==null||e&&s==h.key&&_==h.type)return n;if(u>(e?1:0)){for(i=n-1;i>=0;i--)if((h=o[i])&&!(2&h.__u)&&s==h.key&&_==h.type)return i;for(i=n+1;i<o.length;i++)if((h=o[i])&&!(2&h.__u)&&s==h.key&&_==h.type)return i}return-1}function It(t,o,n){n==null&&(n=""),o[0]=="-"?t.setProperty(o,n):t[o]=n}function Ge(t,o,n,u,i){var s,_;if(o=="style")if(typeof n=="string")t.style.cssText=n;else{if(typeof u=="string"&&(t.style.cssText=u=""),u)for(o in u)n&&o in n||It(t.style,o);if(n)for(o in n)u&&n[o]==u[o]||It(t.style,o,n[o])}else if(o[0]=="o"&&o[1]=="n")typeof n!="function"&&(n=null),typeof u!="function"&&(u=null),(t.__e||(t.__e={}))[o]=n,n&&u||(_=dt[o]||(dt[o]=Ro(o)),(t.__a||(t.__a={}))[o]=vt,s=o!=(o=o.replace(Wt,"$1")),(o=o.slice(2))[0]<"a"&&(o=o.toLowerCase()),n?t.addEventListener(o,_,s):t.removeEventListener(o,_,s));else{if(i=="http://www.w3.org/2000/svg")o=o.replace(/xlink(H|:h)/,"h").replace(/sName$/,"s");else if(o!="width"&&o!="height"&&o!="href"&&o!="list"&&o!="form"&&o!="tabIndex"&&o!="download"&&o!="rowSpan"&&o!="colSpan"&&o!="role"&&o!="popover"&&o in t)try{return void(t[o]=n??"")}catch{}if(typeof n=="function")return;n==null||n===!1&&o[4]!="-"?t.removeAttribute(o):t.setAttribute(o,o=="popover"&&n==1?"":n)}}function Ro(t){return function(o){var n=this.__e;if(n){if(n=n[t],o[Ke]==null)o[Ke]=vt++;else if(o[Ke]<this.__a[t])return;return n($.event?$.event(o):o)}}}function yt(t,o,n,u,i,s,_,h,e,k){var a,D,T,c,M,G,E,W,U,V,F,S,g,p,y,L,H,z,Y=o.type;if(o.constructor!==Be)return null;128&n.__u&&(e=32&n.__u,a=n.__c.__z)&&(o.__u|=e,D=s=[],a.nodeType==8?h=Ze(a,s):s.push(a),h=s[0]||h),(a=$.__b)&&a(o);e:if(typeof Y=="function"){T=_.length;try{if(W=o.props,U=(a=Y.prototype)&&a.render,V=(a=Y.contextType)&&u[a.__c],F=a?V?V.props.value:a.__:u,(c=n.__c)?(o.__c=c,2&c.__g&&(c.__g|=1)):(U?o.__c=c=new Y(W,F):(o.__c=c=new we(W,F),c.constructor=Y,c.render=Do),V&&V.sub(c),c.state||(c.state={}),c.__n=u,c.__g|=8,c.__h=[],c.__k=[]),U&&(c.__s||(c.__s=c.state),Y.getDerivedStateFromProps&&(c.__s==c.state&&(c.__s=Re({},c.__s)),Re(c.__s,Y.getDerivedStateFromProps(W,c.__s)))),M=c.props,G=c.state,c.__v=o,n.__c){if(W!==M&&U&&!Y.getDerivedStateFromProps&&c.componentWillReceiveProps&&c.componentWillReceiveProps(W,F),o.__v==n.__v&&!(8&c.__g)||!(4&c.__g)&&c.shouldComponentUpdate&&c.shouldComponentUpdate(W,c.__s,F)===!1){o.__v!=n.__v&&(c.props=W,c.state=c.__s,c.__g&=-9),o.__e=n.__e,o.__k=n.__k,o.__k.some(function(Q){Q&&(Q.__=o)}),tt.push.apply(c.__h,c.__k),c.__k=[],c.__h.length&&_.push(c),h=Te(n);break e}c.componentWillUpdate&&c.componentWillUpdate(W,c.__s,F),U&&c.componentDidUpdate&&c.__h.push(function(){c.componentDidUpdate(M,G,E)})}else U&&!Y.getDerivedStateFromProps&&c.componentWillMount&&c.componentWillMount(),U&&c.componentDidMount&&c.__h.push(c.componentDidMount);c.context=F,c.props=W,c.__P=t,c.__g&=-5,S=$.__r,g=U?25:0;do c.__g&=-9,S&&S(o),a=c.render(c.props,c.state=c.__s,c.context);while(8&c.__g&&++g<25);U&&(tt.push.apply(c.__h,c.__k),c.__k=[]),c.state=c.__s,c.getChildContext&&(u=Re({},u,c.getChildContext())),U&&n.__c&&c.getSnapshotBeforeUpdate&&(E=c.getSnapshotBeforeUpdate(M,G)),p=a&&a.type===de&&a.key==null?a.props.children:a,W.__P&&(a=h,i=(t=W.__P).namespaceURI,e=s=null,n.props&&n.props.__P!=t&&(n.__k.some(function(Q){Q&&bt(Q,Q)}),n.__k=null),h=n.__k?Te(n,0):null),h=Jt(t,ot(p)?p:[p],o,n,u,i,s,_,h,e,k),W.__P&&(o.__e=null,h=a),o.__u&=-161,D&&D.some(Se),c.__h.length&&_.push(c),1&c.__g&&(c.__g&=-4)}catch(Q){if(_.length=T,o.__v=null,e||s)if(Q&&Q.then){if(o.__u|=128|e,s){for(~(H=s.indexOf(h||void 0))||(H=s.length);(z=s[H-1])&&z.nodeType==8;)H--;for(;H<s.length;H++)if(z=s[H])if(s[H]=null,y){if(z==L)break}else{if(z.nodeType!=8)break;z.data.startsWith("$s")&&(L=Ze(y=z))}}if(!y){for(;h&&h.nodeType==8&&h.nextSibling;)h=h.nextSibling;y=h}(a=Ze(y=o.__c.__z||(o.__c.__z=y)))?(o.__e=y,h=a):o.__e=h,h=h&&h.nextSibling}else s&&s.some(Se);else o.__e=n.__e;o.__k||(o.__k=n.__k||[]),Q&&Q.then||Gt(o),$.__e(Q,o,n)}}else h=o.__e=Lo(n.__e,o,n,u,i,s,_,e,k,t);return(a=$.diffed)&&a(o),h}function Ze(t,o){if(t&&t.nodeType==8&&t.data.startsWith("$s"))for(var n=1;t=t.nextSibling;){if(t.nodeType==8){if(t.data.startsWith("$s"))n++;else if(t.data.startsWith("/$s")&&!--n)return t}o&&o.push(t)}}function Gt(t){t&&(t.__c&&(t.__c.__g|=4),t.__k&&t.__k.some(Gt))}function Kt(t,o,n){for(var u=0;u<n.length;)xt(n[u++],n[u++],n[u++]);$.__c&&$.__c(o,t),t.some(function(i){try{t=i.__h,i.__h=[],t.some(function(s){s.call(i)})}catch(s){$.__e(s,i.__v)}})}function Lo(t,o,n,u,i,s,_,h,e,k){var a,D,T,c,M,G,E,W,U=n.props||et,V=o.props,F=o.type;if(F=="svg"?i="http://www.w3.org/2000/svg":F=="math"?i="http://www.w3.org/1998/Math/MathML":i||(i="http://www.w3.org/1999/xhtml"),s){for(a=0;a<s.length;a++)if((M=s[a])&&(F?M.localName==F:M.nodeType==3)){t=M,s[a]=null;break}}if(!t){if(W=k.ownerDocument||document,!F)return W.createTextNode(V);t=W.createElementNS(i,F,V.is?V:k),h&&($.__m&&$.__m(o,s),h=!1),s=null}if(F){if(k=F=="template"&&t.content||t,s=F=="textarea"&&V.defaultValue!=null?null:s&&Vt.call(k.childNodes),!h&&s)for(U={},a=0;a<t.attributes.length;a++)U[(M=t.attributes[a]).name]=M.value;for(a in U)M=U[a],a=="dangerouslySetInnerHTML"?T=M:a=="children"||a in V||a=="value"&&"defaultValue"in V||a=="checked"&&"defaultChecked"in V||Ge(t,a,null,M,i);for(a in V)M=V[a],a=="children"?c=M:a=="dangerouslySetInnerHTML"?D=M:a=="value"?G=M:a=="checked"?E=M:h&&typeof M!="function"||U[a]===M||Ge(t,a,M,U[a],i);D?(h||T&&(D.__html==T.__html||D.__html==t.innerHTML)||(t.innerHTML=D.__html),o.__k=[]):(T&&(t.textContent=""),(F=="foreignObject"||i=="http://www.w3.org/1998/Math/MathML"&&Co.test(F))&&(i="http://www.w3.org/1999/xhtml"),Jt(k,ot(c)?c:[c],o,n,u,i,s,_,s?s[0]:n.__k&&Te(n,0),h,e),s&&s.some(Se)),h&&F!="textarea"||(a="value",F=="progress"&&G==null?t.removeAttribute(a):G==null||G===t[a]&&(F!="progress"||G)||Ge(t,a,G,U[a],i),a="checked",E!=null&&E!=t[a]&&Ge(t,a,E,U[a],i))}else U===V||h&&t.data==V||(t.data=V);return t}function xt(t,o,n,u){try{typeof t=="function"?o?o.__x=t(o)||1:u&&(u=u.__c||u.__e)&&(o=u.__x)&&(u.__x=null,typeof o=="function"?o():t(null)):t.current=o}catch(i){$.__e(i,n)}}function bt(t,o,n){var u,i,s,_;if($.unmount&&$.unmount(t),!(u=t.ref)||u.current&&u.current!=t.__e||xt(u,null,o,t),u=t.__c){if(u.componentWillUnmount)try{u.componentWillUnmount()}catch(h){$.__e(h,o)}u.__P=u.__n=null}if(u=t.__k)for(_=0;_<u.length;_++)u[_]&&bt(u[_],o,typeof t.type!="function"||n&&!t.props.__P);!n&&(u=t.__c)&&(u=u.__z)&&(i=Ze(u,s=[]))&&(u==t.__e&&s.some(Se),Se(i),Se(u)),n||Se(t.__e),t.__e=t.__c=t.__=null}function Do(t,o,n){return this.constructor(t,n)}function gt(t,o){var n,u,i,s;$.__&&$.__(t,o),o.nodeType==9&&(o=o.documentElement),u=(n=t&&32&t.__u)?null:o.__k,o.__k=Ye(de,{children:[t]}),i=[],s=[],yt(o,o.__k,u||et,et,o.namespaceURI,u?null:o.firstChild?Vt.call(o.childNodes):null,i,u?u.__e:o.firstChild,n,s),Kt(i,o.__k,s),o.__k.props.children=null}$={__e:function(t,o,n,u){for(var i,s,_;o=o.__;)if((i=o.__c)&&!(1&i.__g)){i.__g|=4;try{if((_=(s=i.constructor)&&s.getDerivedStateFromError)&&i.setState(s.getDerivedStateFromError(t)),i.componentDidCatch&&(i.componentDidCatch(t,u||{}),_=1),_&&8&i.__g)return void(i.__g|=2)}catch(h){t=h}}throw Qe=0,t}},zt=0,wo=function(t){return t!=null&&t.constructor===Be},we.prototype.setState=function(t,o){var n=this.__s;n&&n!=this.state||(n=this.__s=Re({},this.state)),typeof t=="function"&&(t=t(Re({},n),this.props)),t&&(Re(n,t),this.__v&&(o&&this.__k.push(o),Bt(this)))},we.prototype.forceUpdate=function(t){this.__v&&(this.__g|=4,t&&this.__h.push(t),Bt(this))},we.prototype.render=de,ke=[],Qe=0,Ht=function(t,o){return t.__v.__b-o.__v.__b},Ke=Symbol(),Wt=/(PointerCapture)$|Capture$/i,vt=0,dt={},To=0;var nt,ue,kt,Yt,Po=Object.is,wt=0,so=[],Tt=[],oe=$,Zt=oe.__b,Qt=oe.__r,eo=oe.diffed,to=oe.__c,oo=oe.unmount,no=oe.__;function io(t,o){oe.__h&&oe.__h(ue,t,wt||o),wt=0;var n=ue.__H||(ue.__H={__:[],__h:[]});return t>=n.__.length&&n.__.push({}),n.__[t]}function ze(t,o){var n=io(nt++,3);!oe.__s&&uo(n.__H,o)&&(n.__P=!0,n.__=t,n.u=o,ue.__H.__h.push(n))}function ve(t){return wt=5,co(function(){return{current:t}},[])}function co(t,o){var n=io(nt++,7);return uo(n.__H,o)&&(n.__=t(),n.__H=o),n.__}function Uo(){var t;do{for(;t=Tt.shift();)try{Ie(t)}catch(n){oe.__e(n,{__:(t=t.__P)&&t.__v})}for(;t=so.shift();){var o=t.__H;if(t.__P&&o)try{o.__h.some(Ie),o.__h.some(Ct),o.__h=[]}catch(n){o.__h=[],oe.__e(n,t.__v)}}}while(Tt.length)}oe.__b=function(t){ue=null,Zt&&Zt(t)},oe.__=function(t,o){t&&o.__k&&o.__k.__m&&(t.__m=o.__k.__m),no&&no(t,o)},oe.__r=function(t){Qt&&Qt(t),nt=0;var o=(ue=t.__c).__H;o&&(kt==ue?ue.__h=[]:(o.__h.some(Ie),o.__h.some(Ct),nt=0),o.__h=[],o.__.some(function(n){n.__N&&(n.__=n.__N),n.u=n.__N=void 0})),kt=ue},oe.diffed=function(t){eo&&eo(t);var o=t.__c;o&&o.__H&&(o.__H.__h.length&&ao(so.push(o)),o.__H.__.some(function(n){n.u&&(n.__H=n.u)})),kt=ue=null},oe.__c=function(t,o){o.some(function(n){try{n.__h.some(Ie),n.__h=n.__h.filter(function(u){return!u.__||Ct(u)})}catch(u){n.__h=[function(){throw u}]}}),to&&to(t,o)},oe.unmount=function(t){oo&&oo(t);var o,n,u=t.__c;u&&u.__H&&(u.__H.__.some(function(i){try{if(i.__P&&i.__c){if(n===void 0){for(n=t.__;n&&(!n.__c||!n.__c.__P);)n=n.__;n=n&&n.__c}i.__P=n,ao(Tt.push(i))}else Ie(i)}catch(s){o=s}}),u.__H=void 0,o&&oe.__e(o,u.__v))};var ro=typeof requestAnimationFrame=="function";function No(t){var o,n=function(){clearTimeout(u),ro&&cancelAnimationFrame(o),setTimeout(t)},u=setTimeout(n,35);ro&&(o=requestAnimationFrame(n))}function ao(t){t!=1&&Yt==oe.requestAnimationFrame||((Yt=oe.requestAnimationFrame)||No)(Uo)}function Ie(t){var o=ue,n=t.__c;typeof n=="function"&&(t.__c=void 0,n()),ue=o}function Ct(t){var o=ue;t.__c=t.__(),ue=o}function uo(t,o){return!t||t.length!=o.length||o.some(function(n,u){return!Po(n,t[u])})}var lo=Object.assign;var $o=/^(-|f[lo].*[^se]$|g.{5,}[^ps]$|z|o[pr]|(W.{5})?[lL]i.*(t|mp)$|an|(bo|s).{4}Im|sca|m.{6}[ds]|ta|c.*[st]$|wido|ini|asp|fill|st)/;var Bo=Symbol.for("react.element"),Io=/^(?:accent|alignment|arabic|baseline|cap|clip(?!PathU)|color|dominant|fill|flood|font|glyph(?!R)|horiz|image(?!S)|letter|lighting|marker(?!H|W|U)|overline|paint|pointer|shape|stop|strikethrough|stroke|text(?!L)|transform|underline|unicode|units|v|vector|vert|word|writing|x(?!C))[A-Z]/,zo=/[A-Z0-9]/g,Ho=typeof document<"u";var Wo=function(t){return/fil|che|rad/.test(t)};we.prototype.isReactComponent=!0,["componentWillMount","componentWillReceiveProps","componentWillUpdate"].forEach(function(t){Object.defineProperty(we.prototype,t,{configurable:!0,get:function(){return this["UNSAFE_"+t]},set:function(o){Object.defineProperty(this,t,{configurable:!0,writable:!0,value:o})}})});var fo=$.event;$.event=function(t){return fo&&(t=fo(t)),t.persist=function(){},t.isPropagationStopped=function(){return this.cancelBubble},t.isDefaultPrevented=function(){return this.defaultPrevented},t.nativeEvent=t};var Vo={configurable:!0,get:function(){return this.class}},_o=$.vnode;$.vnode=function(t){if(typeof t.type=="string")(function(u){var i=u.props,s=u.type,_={},h=s.indexOf("-")==-1;for(var e in i){var k=i[e];if(!(e=="value"&&"defaultValue"in i&&k==null||Ho&&e=="children"&&s=="noscript"||e=="class"||e=="className")){if(e=="style"&&k&&k.constructor==Object){var a=void 0;for(var D in k)typeof k[D]!="number"||$o.test(D)||(a||(a=k=lo({},k)),k[D]+="px")}else if(e=="defaultValue"&&"value"in i&&i.value==null)e="value";else if(e=="download"&&k===!0)k="";else if(e=="translate"&&k==="no")k=!1;else if(e[0]=="o"&&e[1]=="n"){var T=e.toLowerCase();T=="ondoubleclick"?e="ondblclick":T!="onchange"||s!="input"&&s!="textarea"||Wo(i.type)?T=="onfocus"?e="onfocusin":T=="onblur"&&(e="onfocusout"):T=e="oninput",T=="oninput"&&_[e=T]&&(e="oninputCapture")}else h&&Io.test(e)?e=e.replace(zo,"-$&").toLowerCase():k===null&&(k=void 0);_[e]=k}}if(s=="select"){var c=_.defaultValue!=null?_.defaultValue:_.multiple&&Array.isArray(_.value)?_.value:null;c!=null&&(_.value=mt(i.children).forEach(function(M){M.props.selected=_.multiple?c.indexOf(M.props.value)!=-1:c==M.props.value}))}i.class&&!i.className?(_.class=i.class,Object.defineProperty(_,"className",Vo)):i.className&&(_.class=_.className=i.className),u.props=_})(t);else if(typeof t.type=="function"&&("ref"in t.props&&"prototype"in t.type&&t.type.prototype.render&&(t.ref=t.props.ref,delete t.props.ref),t.type.defaultProps)){var o=lo({},t.props);for(var n in t.type.defaultProps)o[n]===void 0&&(o[n]=t.type.defaultProps[n]);t.props=o}t.ref&&!("ref"in t.props)&&Object.defineProperty(t.props,"ref",{value:t.ref,configurable:!0,writable:!0}),t.$$typeof=Bo,_o&&_o(t)};var Oo=Symbol.for("pv"),qo=0;function re(t,o,n,u,i,s){o||(o={});var _,h,e=o;if("ref"in e&&typeof t!="function")for(h in e={},o)h=="ref"?_=o[h]:e[h]=o[h];var k={type:t,props:e,key:n,ref:_,__k:null,__:null,__b:0,__e:null,__c:null,constructor:Oo,__v:--qo,__i:-1,__u:0};return(i||s)&&(k.__source=i,k.__self=s),$.vnode&&$.vnode(k),k}var ae=1100,yo=380,Jo=10,le=ae/(2*yo),Xo=5,se=4,po=.55,Mt=ae*.75,Et=.42,at={small:{h:36,px:16,fs:13,k:.82},medium:{h:44,px:22,fs:14,k:1},large:{h:52,px:26,fs:16,k:1.18},"extra-large":{h:60,px:30,fs:18,k:1.36}},B=(t,o,n)=>Math.min(n,Math.max(o,t)),me=(t,o)=>Number.isFinite(Number(t))&&t!==null&&t!==""?Number(t):o,Le=t=>{let o=B(t,0,1);return o*o*(3-2*o)},ho=t=>{let o=B(t,0,1);return o*o*o*(10+o*(6*o-15))},vo=t=>{let o=B(t,0,1);return 30*o*o*(1-o)*(1-o)},Go=t=>{let o=B(t,0,1);return 60*o*(1-o)*(1-2*o)},rt=(t,o)=>Math.sin(t*1.31+o)*.5+Math.sin(t*2.73+o*1.7)*.3+Math.sin(t*5.19+o*2.3)*.2,Ko=(t,o)=>Math.cos(t*1.31+o)*.655+Math.cos(t*2.73+o*1.7)*.819+Math.cos(t*5.19+o*2.3)*1.038,mo=t=>{let o=String(t||"").replace("#",""),n=o.length===3?o.replace(/(.)/g,"$1$1"):o.padEnd(6,"0").slice(0,6),u=parseInt(n,16);return Number.isFinite(u)?[(u>>16&255)/255,(u>>8&255)/255,(u&255)/255]:[1,1,1]},Yo=`#version 300 es
out vec2 vUv;
void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  vUv = p;
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`,pe=`#version 300 es
precision highp float;
precision highp sampler2D;
in vec2 vUv;
out vec4 outColor;
`,St=`
uniform vec4 uJetA[${se}];
uniform vec4 uJetB[${se}];
uniform float uJetBend[${se}];
float jetWeight(vec2 p, vec4 a, vec4 b, out float along) {
  vec2 rel = p - a.xy;
  along = dot(rel, a.zw);
  vec2 off = rel - a.zw * clamp(along, 0.0, b.z);
  return exp(-dot(off, off) / (b.y * b.y)) * smoothstep(-b.y, 0.0, along);
}
`,Rt=`
float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}
`,Zo=`${pe}
uniform sampler2D uVelocity;
uniform sampler2D uSource;
uniform vec2 uWorld;
uniform float uDt;
uniform float uKeep;
void main() {
  vec2 v = textureLod(uVelocity, vUv, 0.0).xy;
  if (!(abs(v.x) < 4000.0 && abs(v.y) < 4000.0)) v = vec2(0.0);
  vec4 c = textureLod(uSource, vUv - uDt * v / uWorld, 0.0) * uKeep;
  outColor = all(lessThan(abs(c), vec4(1e4))) ? c : vec4(0.0);
}`,Qo=`${pe}
uniform sampler2D uVelocity;
uniform sampler2D uDye;
uniform vec2 uWorld;
uniform float uDt;
uniform float uBuoyancy;
uniform float uLift;
uniform float uDamping;
uniform float uSpread;
uniform float uSplash;
uniform float uFriction;
uniform float uWind;
uniform vec3 uKick;
uniform vec4 uCraft;
uniform vec4 uCraftMotion;
uniform vec2 uTurb;
uniform float uTime;
uniform float uObstacle;
${St}
${Rt}
vec2 curlNoise(vec2 p) {
  float e = 0.35;
  float a = noise(p + vec2(0.0, e));
  float b = noise(p - vec2(0.0, e));
  float c = noise(p + vec2(e, 0.0));
  float d = noise(p - vec2(e, 0.0));
  return vec2(a - b, d - c) / (2.0 * e);
}
void main() {
  vec2 p = vUv * uWorld;
  vec2 v = textureLod(uVelocity, vUv, 0.0).xy;
  vec2 d = textureLod(uDye, vUv, 1.0).xy;
  float smokeHere = smoothstep(0.02, 0.4, d.x + d.y);
  vec2 tq = p / uTurb.y;
  vec2 turb = curlNoise(tq + vec2(uTime * 0.21, -uTime * 0.37)) + 0.5 * curlNoise(tq * 2.3 + vec2(-uTime * 0.53, uTime * 0.29) + 7.0);
  v += turb * uTurb.x * smokeHere * uDt;
  v.y += (uBuoyancy * d.y + uLift * d.x) * uDt;
  v /= 1.0 + uDamping * uDt;
  v.x /= 1.0 + uFriction * exp(-p.y / 18.0) * uDt;
  v.x += (uWind - v.x) * (1.0 - exp(-0.35 * uDt)) * smoothstep(0.0, 60.0, p.y);
  for (int i = 0; i < ${se}; i++) {
    vec4 b = uJetB[i];
    if (b.w <= 0.0) continue;
    vec4 a = uJetA[i];
    vec2 rel = p - a.xy;
    float along = dot(rel, a.zw);
    float across = dot(rel, vec2(-a.w, a.z));
    float reach = a.w < -0.2 ? a.y / -a.w : max(b.z, 1.0);
    float bn = clamp(along / max(reach, 1.0), 0.0, 1.0);
    across -= uJetBend[i] * bn * bn;
    vec2 dir = normalize(a.zw + vec2(-a.w, a.z) * (2.0 * uJetBend[i] * bn / max(reach, 1.0)));
    float sN = clamp(along / max(b.z, 1.0), 0.0, 1.0);
    float R = b.y + uSpread * clamp(along, 0.0, b.z);
    float wr = exp(-across * across / (R * R));
    float wa = smoothstep(-b.y, 0.0, along) * (1.0 - smoothstep(0.55, 1.0, sN));
    float rate = mix(46.0, 7.0, sN);
    float w = (1.0 - exp(-uDt * rate)) * wr * wa * clamp(b.w * 3.0, 0.0, 1.0);
    float U = b.x * sqrt(b.y / R);
    v = mix(v, dir * U, w);
  }
  for (int i = 0; i < ${se}; i++) {
    vec4 b = uJetB[i];
    if (b.w <= 0.0) continue;
    vec4 a = uJetA[i];
    if (a.w > -0.2) continue;
    float reach = a.y / -a.w;
    float gx = a.x + a.z * reach - a.w * uJetBend[i];
    float near = exp(-reach / uKick.x);
    float sx = uKick.y + reach * 0.25;
    float kx = (p.x - gx) / (sx * 1.6);
    float ky = p.y / (uKick.z * 1.5);
    float k = exp(-kx * kx - ky * ky);
    float side = clamp((p.x - gx) / sx, -1.0, 1.0);
    v += uDt * uSplash * b.w * near * k * vec2(side * 0.7, 0.9);
  }
  vec2 q = p - uCraft.xy;
  float c = cos(uCraftMotion.z);
  float s = sin(uCraftMotion.z);
  vec2 lq = vec2(c * q.x + s * q.y, -s * q.x + c * q.y);
  vec2 e = abs(lq) - uCraft.zw + uCraft.w;
  float sd = length(max(e, 0.0)) + min(max(e.x, e.y), 0.0) - uCraft.w;
  float inside = smoothstep(2.0, -2.0, sd) * uObstacle;
  vec2 cv = uCraftMotion.xy + uCraftMotion.w * vec2(-q.y, q.x);
  v = mix(v, cv, inside);
  float speed = length(v);
  if (!(speed < 1e5)) v = vec2(0.0);
  else if (speed > 2600.0) v *= 2600.0 / speed;
  outColor = vec4(v, 0.0, 1.0);
}`,en=`${pe}
uniform sampler2D uVelocity;
uniform vec2 uTexel;
void main() {
  float L = textureLod(uVelocity, vUv - vec2(uTexel.x, 0.0), 0.0).y;
  float R = textureLod(uVelocity, vUv + vec2(uTexel.x, 0.0), 0.0).y;
  float B = textureLod(uVelocity, vUv - vec2(0.0, uTexel.y), 0.0).x;
  float T = textureLod(uVelocity, vUv + vec2(0.0, uTexel.y), 0.0).x;
  outColor = vec4(0.5 * (R - L - T + B), 0.0, 0.0, 1.0);
}`,tn=`${pe}
uniform sampler2D uVelocity;
uniform sampler2D uCurl;
uniform vec2 uTexel;
uniform float uStrength;
uniform float uDt;
void main() {
  float L = textureLod(uCurl, vUv - vec2(uTexel.x, 0.0), 0.0).x;
  float R = textureLod(uCurl, vUv + vec2(uTexel.x, 0.0), 0.0).x;
  float B = textureLod(uCurl, vUv - vec2(0.0, uTexel.y), 0.0).x;
  float T = textureLod(uCurl, vUv + vec2(0.0, uTexel.y), 0.0).x;
  float C = textureLod(uCurl, vUv, 0.0).x;
  vec2 f = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
  f /= length(f) + 1e-4;
  f *= uStrength * C;
  f.y *= -1.0;
  vec2 v = textureLod(uVelocity, vUv, 0.0).xy + f * uDt;
  if (!(abs(v.x) < 4000.0 && abs(v.y) < 4000.0)) v = vec2(0.0);
  outColor = vec4(v, 0.0, 1.0);
}`,on=`${pe}
uniform sampler2D uVelocity;
uniform vec2 uTexel;
void main() {
  vec2 C = textureLod(uVelocity, vUv, 0.0).xy;
  float L = textureLod(uVelocity, vUv - vec2(uTexel.x, 0.0), 0.0).x;
  float R = textureLod(uVelocity, vUv + vec2(uTexel.x, 0.0), 0.0).x;
  float B = textureLod(uVelocity, vUv - vec2(0.0, uTexel.y), 0.0).y;
  float T = textureLod(uVelocity, vUv + vec2(0.0, uTexel.y), 0.0).y;
  if (vUv.y - uTexel.y < 0.0) B = -C.y;
  outColor = vec4(0.5 * (R - L + T - B), 0.0, 0.0, 1.0);
}`,xo=`
float pressureAt(sampler2D tex, vec2 uv, vec2 texel, float c, int side) {
  if (side == 0 && uv.x - texel.x < 0.0) return 0.0;
  if (side == 1 && uv.x + texel.x > 1.0) return 0.0;
  if (side == 2 && uv.y - texel.y < 0.0) return c;
  if (side == 3 && uv.y + texel.y > 1.0) return 0.0;
  vec2 o = side == 0 ? vec2(-texel.x, 0.0) : side == 1 ? vec2(texel.x, 0.0) : side == 2 ? vec2(0.0, -texel.y) : vec2(0.0, texel.y);
  return textureLod(tex, uv + o, 0.0).x;
}
`,nn=`${pe}
uniform sampler2D uPressure;
uniform sampler2D uDivergence;
uniform vec2 uTexel;
${xo}
void main() {
  float C = textureLod(uPressure, vUv, 0.0).x;
  float L = pressureAt(uPressure, vUv, uTexel, C, 0);
  float R = pressureAt(uPressure, vUv, uTexel, C, 1);
  float B = pressureAt(uPressure, vUv, uTexel, C, 2);
  float T = pressureAt(uPressure, vUv, uTexel, C, 3);
  float div = textureLod(uDivergence, vUv, 0.0).x;
  float pr = (L + R + B + T - div) * 0.25;
  outColor = vec4(abs(pr) < 1e6 ? pr : 0.0, 0.0, 0.0, 1.0);
}`,rn=`${pe}
uniform sampler2D uPressure;
uniform sampler2D uVelocity;
uniform vec2 uTexel;
${xo}
void main() {
  float C = textureLod(uPressure, vUv, 0.0).x;
  float L = pressureAt(uPressure, vUv, uTexel, C, 0);
  float R = pressureAt(uPressure, vUv, uTexel, C, 1);
  float B = pressureAt(uPressure, vUv, uTexel, C, 2);
  float T = pressureAt(uPressure, vUv, uTexel, C, 3);
  vec2 v = textureLod(uVelocity, vUv, 0.0).xy - 0.5 * vec2(R - L, T - B);
  if (vUv.y - uTexel.y < 0.0) v.y = max(v.y, 0.0);
  if (!(abs(v.x) < 4000.0 && abs(v.y) < 4000.0)) v = vec2(0.0);
  outColor = vec4(v, 0.0, 1.0);
}`,an=`${pe}
uniform sampler2D uSource;
uniform vec2 uStep;
void main() {
  vec2 c = textureLod(uSource, vUv, 0.0).xy * 0.2270270;
  c += textureLod(uSource, vUv + uStep * 1.3846154, 0.0).xy * 0.3162162;
  c += textureLod(uSource, vUv - uStep * 1.3846154, 0.0).xy * 0.3162162;
  c += textureLod(uSource, vUv + uStep * 3.2307692, 0.0).xy * 0.0702703;
  c += textureLod(uSource, vUv - uStep * 3.2307692, 0.0).xy * 0.0702703;
  outColor = vec4(c, 0.0, 1.0);
}`,sn=`${pe}
uniform sampler2D uSource;
uniform float uScale;
void main() {
  outColor = textureLod(uSource, vUv, 0.0) * uScale;
}`,cn=`${pe}
uniform sampler2D uVelocity;
uniform sampler2D uSource;
uniform vec2 uWorld;
uniform float uDt;
uniform vec2 uKeep;
uniform vec4 uRate;
uniform vec4 uCol;
uniform vec3 uKick;
uniform float uDisperse;
uniform float uDispV;
uniform vec4 uCraft;
uniform vec4 uCraftMotion;
uniform vec2 uGap;
uniform float uJetX[${se}];
uniform float uJetN;
uniform float uFloor;
uniform float uTime;
${St}
${Rt}
void main() {
  vec2 v = textureLod(uVelocity, vUv, 0.0).xy;
  vec2 val = textureLod(uSource, vUv - uDt * v / uWorld, 0.0).xy * uKeep;
  val.x *= exp(-uDisperse * max(length(v) - uDispV, 0.0) * 0.01 * uDt);
  {
    vec2 q = vUv * uWorld - uCraft.xy;
    float c = cos(uCraftMotion.z);
    float sn = sin(uCraftMotion.z);
    vec2 lq = vec2(c * q.x + sn * q.y, -sn * q.x + c * q.y);
    float belly = uCraft.y - uCraft.w - 7.0;
    float depth = 0.68 * belly * smoothstep(40.0, 110.0, belly);
    float below = -lq.y - uCraft.w;
    float wy = smoothstep(-4.0, 6.0, below) * (1.0 - smoothstep(depth * 0.7, depth, below));
    float nearest = 1e4;
    float outer = 0.0;
    for (int k = 0; k < ${se}; k++) {
      if (float(k) >= uJetN) break;
      nearest = min(nearest, abs(lq.x - uJetX[k]));
      outer = max(outer, abs(uJetX[k]));
    }
    float wx = uGap.x > 1.0 ? smoothstep(uGap.x * 0.22, uGap.x * 0.4, nearest) * (1.0 - smoothstep(outer - uGap.x * 0.1, outer, abs(lq.x))) : 0.0;
    val.x *= exp(-uGap.y * wx * wy * uDt);
  }
  val.x = max(val.x - uFloor * uDt, 0.0);
  vec2 p = vUv * uWorld;
  for (int i = 0; i < ${se}; i++) {
    vec4 jb = uJetB[i];
    if (jb.w <= 0.0) continue;
    vec4 ja = uJetA[i];
    vec2 rel = p - ja.xy;
    float along = dot(rel, ja.zw);
    float across = dot(rel, vec2(-ja.w, ja.z));
    vec2 off = rel - ja.zw * clamp(along, 0.0, 6.0);
    float wn = exp(-dot(off, off) / (jb.y * jb.y)) * smoothstep(-jb.y, 0.0, along);
    float pulse = 0.6 + 0.8 * noise(vec2(uTime * 6.0 + float(i) * 13.1, along * 0.06 + float(i)));
    val.x += uRate.x * jb.w * wn * pulse * uDt;
    val.y += uRate.y * jb.w * wn * uDt;
    float reach = ja.w < -0.2 ? ja.y / -ja.w : 1e4;
    float sN = clamp(along / max(reach, 1.0), 0.0, 1.0);
    across -= uJetBend[i] * sN * sN;
    float R = uCol.y + uCol.x * clamp(along, 0.0, reach);
    float wc = exp(-across * across / (R * R)) * smoothstep(0.45, 0.8, sN) * (1.0 - step(reach + 2.0, along));
    float grain = 0.45 + 1.1 * noise(vec2(across * 0.12 + float(i) * 3.0, along * 0.05 - uTime * 9.0));
    val.x += uRate.w * jb.w * wc * grain * uDt;
    val.y += uRate.y * 0.25 * jb.w * wc * uDt;
    if (reach < 1e3) {
      float gx = ja.x + ja.z * reach - ja.w * uJetBend[i];
      float near = exp(-reach / uKick.x);
      float spread = uKick.y + reach * 0.25;
      float kx = (p.x - gx) / spread;
      float ky = p.y / uKick.z;
      float k = exp(-kx * kx - ky * ky);
      float g2 = 0.5 + noise(vec2(p.x * 0.08, uTime * 4.0 + float(i) * 9.0));
      val.x += uRate.z * jb.w * near * k * g2 * uDt;
      val.y += uRate.y * 0.4 * jb.w * near * k * uDt;
    }
  }
  if (!(val.x < 1e3 && val.y < 1e3 && val.x >= 0.0 && val.y >= 0.0)) val = vec2(0.0);
  outColor = vec4(val, 0.0, 1.0);
}`,un=`${pe}
uniform sampler2D uDye;
uniform vec2 uWorld;
uniform vec2 uDyeSize;
uniform float uTime;
uniform float uLightTheme;
uniform vec3 uSmoke;
uniform vec3 uShade;
uniform vec3 uThrust;
uniform vec4 uLook;
uniform vec4 uLook2;
uniform vec4 uLook3;
uniform vec4 uCol;
uniform float uGamma;
uniform float uTone;
uniform vec3 uLight2;
uniform float uThreshold;
uniform float uScale;
uniform vec4 uCraft;
uniform vec4 uCraftMotion;
${St}
${Rt}
float dens(vec2 p, float lod) {
  return textureLod(uDye, p / uWorld, lod).x;
}
float hash1(float n) {
  return fract(sin(n * 127.1) * 43758.5453);
}
float fbm2(vec2 p) {
  return noise(p) * 0.65 + noise(p * 2.13 + 17.0) * 0.35;
}
float flowNoise(float q, float xn, float t, float id, float rate) {
  float c = t / 0.7;
  float f1 = fract(c);
  float f2 = fract(c + 0.5);
  float k1 = floor(c);
  float k2 = floor(c + 0.5);
  float n1 = fbm2(vec2(q - f1 * 0.7 * rate + hash1(k1 + id * 7.0) * 41.0, xn * 1.15 + id * 3.7));
  float n2 = fbm2(vec2(q - f2 * 0.7 * rate + hash1(k2 + id * 7.0 + 0.5) * 41.0, xn * 1.15 + id * 3.7 + 11.0));
  float w1 = 1.0 - abs(2.0 * f1 - 1.0);
  float w2 = 1.0 - w1;
  return 0.5 + (n1 * w1 + n2 * w2 - 0.5) / sqrt(w1 * w1 + w2 * w2);
}
float column(vec2 p, vec4 a, float str, float id, float t, float bend, out float xn, out float s) {
  vec2 rel = p - a.xy;
  s = dot(rel, a.zw);
  float x = dot(rel, vec2(-a.w, a.z));
  float S = a.w < -0.2 ? a.y / -a.w : 1e4;
  float bn = clamp(s / max(S, 1.0), 0.0, 1.0);
  x -= bend * bn * bn;
  xn = 0.0;
  if (s < -4.0 || s > S + 6.0) return 0.0;
  float sc = clamp(s, 0.0, S);
  float R = uCol.y + uCol.x * sc;
  float flare = smoothstep(S - 32.0 * uScale, S + 2.0, sc);
  R *= 1.0 + 1.3 * flare * flare;
  xn = x / R;
  if (abs(xn) > 3.2) return 0.0;
  float q = log(1.0 + 0.22 * sc / (9.0 * uScale)) / 0.22;
  float lam = 9.0 * uScale + 0.22 * sc;
  float U = uCol.w * sqrt(str) * sqrt(uCol.y / R);
  float n = flowNoise(q, xn, t, id, U / lam);
  float amp = 0.12 + 0.5 * smoothstep(4.0, 70.0, sc);
  float u = abs(xn) * (1.0 - amp * (n - 0.5) * 1.8);
  float prof = exp(-u * u * 1.7);
  float dil = pow(uCol.y / R, 0.5);
  float onset = smoothstep(2.0 * uScale, 16.0 * uScale, s);
  float tail = 1.0 - smoothstep(S - 2.0, S + 6.0, s);
  return uCol.z * str * prof * dil * onset * tail * (0.7 + 0.6 * n);
}
float shape(vec2 p, float lod) {
  return log(1.0 + 3.0 * dens(p, lod));
}
void main() {
  vec2 p = vUv * uWorld;
  float texel = uWorld.x / uDyeSize.x;
  float D = textureLod(uDye, vUv, uLook.w).x;
  float heat = textureLod(uDye, vUv, 0.5).y;

  float e = uLook3.x;
  float lodN = max(log2(e / texel), 0.0) + uLook3.y;
  vec2 g = vec2(shape(p + vec2(e, 0.0), lodN) - shape(p - vec2(e, 0.0), lodN), shape(p + vec2(0.0, e), lodN) - shape(p - vec2(0.0, e), lodN)) / (2.0 * e);
  float e2 = e * 3.0;
  float lodB = lodN + 1.6;
  vec2 g2 = vec2(shape(p + vec2(e2, 0.0), lodB) - shape(p - vec2(e2, 0.0), lodB), shape(p + vec2(0.0, e2), lodB) - shape(p - vec2(0.0, e2), lodB)) / (2.0 * e2);
  vec3 nS = normalize(vec3(-(g * uLook3.z + g2 * uLook3.w) * uLook.y, 1.0));

  float colD = 0.0;
  vec2 colN = vec2(0.0);
  float colHot = 0.0;
  float colNear = 0.0;
  for (int i = 0; i < ${se}; i++) {
    vec4 jb = uJetB[i];
    if (jb.w <= 0.0) continue;
    vec4 ja = uJetA[i];
    float xn;
    float sa;
    float cd = column(p, ja, min(jb.w, 1.6), float(i), uTime, uJetBend[i], xn, sa);
    colD += cd;
    colN += vec2(-ja.w, ja.z) * clamp(xn, -1.6, 1.6) * cd;
    colHot += cd * exp(-max(sa, 0.0) / 45.0);
    colNear += cd * exp(-max(sa, 0.0) / 16.0);
  }
  float Dt = D + colD;
  float alpha = 1.0 - exp(-uLook.x * pow(max(D - uThreshold, 0.0) + colD, uGamma));
  vec2 cn = colD > 1e-5 ? colN / colD : vec2(0.0);
  vec3 nC = normalize(vec3(cn * 0.85, sqrt(max(1.0 - dot(cn, cn) * 0.72, 0.08))));
  float wC = colD / max(Dt, 1e-5);
  vec3 n = normalize(mix(nS, nC, wC));
  vec3 L = normalize(vec3(-0.38, 0.6, 0.72));
  float diff = clamp((dot(n, L) + uLook2.z) / (1.0 + uLook2.z), 0.0, 1.0);

  vec2 ld = normalize(L.xy);
  float tau = 0.0;
  float dist = 2.0;
  float stepLen = 3.0;
  for (int i = 0; i < 9; i++) {
    float lod = max(log2(stepLen / texel), 0.0);
    tau += dens(p + ld * dist, lod) * stepLen;
    dist += stepLen;
    stepLen *= 1.4;
  }
  float sun = mix(exp(-uLook.z * tau), 1.0, wC * 0.6);
  float ao = mix(exp(-uLook2.w * dens(p, 4.5)), 1.0, wC);

  vec3 amb = vec3(0.84, 0.88, 1.0) * uLook2.x;
  vec3 key = vec3(1.0, 0.985, 0.96) * uLook2.y;
  vec3 lit = amb * ao + key * sun * diff;

  vec3 jl = vec3(0.0);
  vec3 core = vec3(0.0);
  for (int i = 0; i < ${se}; i++) {
    vec4 jb = uJetB[i];
    if (jb.w <= 0.0) continue;
    vec4 ja = uJetA[i];
    vec2 rel = p - ja.xy;
    float along = dot(rel, ja.zw);
    float across = dot(rel, vec2(-ja.w, ja.z));
    float str = min(jb.w, 1.6);
    float flick = 0.9 + 0.2 * noise(vec2(uTime * 38.0, float(i) * 5.0));
    float len = (8.0 + 12.0 * str) * flick * uScale;
    float sN = along / len;
    float wid = 3.2 * uScale * (0.9 - 0.5 * clamp(sN, 0.0, 1.0)) + 0.3;
    float radial = exp(-across * across / (wid * wid));
    float axial = smoothstep(-0.12, 0.04, sN) * pow(clamp(1.0 - sN, 0.0, 1.0), 1.5);
    float c = radial * axial * str;
    core += mix(uThrust, vec3(1.0), smoothstep(0.25, 0.9, c)) * c * 1.3;
    float d = length(rel - ja.zw * clamp(along, 0.0, len));
    core += uThrust * str * (0.22 * exp(-d / (5.0 * uScale)) + 0.06 * exp(-d / (18.0 * uScale)));
    jl += uThrust * str * uLight2.x * (exp(-d / (30.0 * uScale)) + 0.45 * exp(-d / (100.0 * uScale)));
  }

  vec3 jlNear = jl * 0.35 + uThrust * colNear / max(Dt, 1e-4) * 0.9;
  jl += uThrust * colHot / max(Dt, 1e-4) * 0.9;
  if (uLightTheme > 0.5) {
    float shade = dot(lit + jl * 0.8, vec3(0.3333)) * uLight2.z;
    vec3 ink = mix(uShade, uSmoke, smoothstep(0.15, 1.2, shade));
    alpha = 1.0 - pow(1.0 - alpha, 1.25);
    ink = mix(ink, uThrust, clamp(dot(jlNear, vec3(0.3333)) * 0.5, 0.0, 0.3));
    float ca = clamp(max(core.r, max(core.g, core.b)) * 0.85, 0.0, 1.0);
    vec3 coreInk = mix(uThrust, vec3(1.0), 0.35 * smoothstep(0.7, 1.0, ca));
    vec3 lc = ink * alpha * (1.0 - ca) + coreInk * ca;
    float la = alpha + ca * (1.0 - alpha);
    outColor = vec4(lc, la);
    return;
  }
  vec3 smoke = uSmoke * (lit + jl) * uLight2.z;
  smoke = mix(smoke / (1.0 + 0.35 * max(smoke - 0.8, 0.0)), 1.0 - exp(-smoke * 1.35), uTone);
  vec3 emit = mix(uThrust, vec3(1.0), 0.5) * heat * heat * uLight2.y;
  vec3 col = (smoke + emit) * alpha + core;
  float a = clamp(max(alpha, max(col.r, max(col.g, col.b))), 0.0, 1.0);
  col = min(col, vec3(a));
  col += (hash(gl_FragCoord.xy + fract(uTime) * 61.0) - 0.5) / 255.0 * a;
  outColor = vec4(max(col, 0.0), a);
}`,st={colSpread:.1,colR:3.6,colD:1.25,colU:420,splash:400,friction:5,disperse:.6,dispV:60,gap:10,wind:8,turb:350,turbScale:34,jetLight:.3,threshold:.035,blur:3,emit:0,exposure:1.3,tone:1,gamma:.6,kickNear:45,kickW:18,kickH:14,vort:6,spread:.1,floor:.02,keepD:.3,keepIdle:.45,keepH:1.6,rateN:0,rateH:6,rateK:20,rateC:3,buoy:330,lift:22,damp:.55,radius:6,speed:380,reach:.9,forceMax:240,alphaK:4,relief:9,shadow:.026,alphaLod:0,ambient:.58,key:.82,wrap:.35,ao:.35,normalE:3,normalLod:-.8,fine:.35,broad:.9,iters:20};function ln({root:t,canvas:o,button:n,cursor:u,ramp:i,props:s}){let _=o.getContext("webgl2",{alpha:!0,premultipliedAlpha:!0,antialias:!1,depth:!1,stencil:!1,powerPreference:"high-performance"}),h=typeof window<"u"&&window.matchMedia?window.matchMedia("(prefers-reduced-motion: reduce)"):null,e={W:0,H:0,dpr:1,bw:0,bh:0,x:0,vx:0,y:-le,vy:0,th:0,w:0,fvx:0,fvy:0,thrust:[0,0,0,0],delay:[0,0,0,0],phase:"rest",pt:0,clock:0,seed:Math.random()*100,wind:1,alt:160,climbT:1.6,y0:0,vrPrev:0,hold:2.4,xRef:0,landX:0,boost:!1,contact:!0,placed:!1,track:null,back:null,flip:null,rampKey:"",rampGeo:null,strip:null,u:0,v:0,target:{x:0,y:0},pointer:{in:!1,x:0,y:0,type:"mouse"},off:{x:0,y:0},attached:!1,hover:!1,armed:!0,carry:!1,pressed:!1,press:null,drag:null,suppress:!1,lastC:null,lastTh:0,quiet:0,running:!1,last:0,raf:0,simTime:0,activity:0},k=null;if(_&&(_.getExtension("EXT_color_buffer_float")||_.getExtension("EXT_color_buffer_half_float")))try{k=fn(_)}catch{k=null}let a=()=>!!(h&&h.matches),D=()=>(at[s.current.size]||at.medium).k,T=()=>Xo*D(),c=()=>B(Math.round(me(s.current.jets,2)),1,se),M=()=>{let r=c();if(r===1)return[0];let l=e.bw*(r===2?.3:.34);return Array.from({length:r},(f,d)=>l*(2*d/(r-1)-1))},G=()=>{let r=M();return r.length>1?[r[0],r[r.length-1]]:[-.3*e.bw,.3*e.bw]},E=()=>e.thrust[0]+e.thrust[1]+e.thrust[2]+e.thrust[3],W=()=>e.phase==="ignite"||e.phase==="climb"||e.phase==="hover"||e.phase==="descend"||e.phase==="drag",U=()=>e.phase==="drive"||e.phase==="loop"||e.phase==="flip"||e.phase==="return",V=()=>[e.bw/2+4,Math.max(e.bw/2+4,e.W-e.bw/2-4)],F=()=>!!s.current.ramp,S=()=>{let r=T()+e.bh/2,l=`${e.W}|${e.H}|${e.bw}|${r}`;if(e.rampKey===l&&e.rampGeo)return e.rampGeo;let f=Math.max(e.H*.24,T()+e.bh+40),d=1/f,b=f*.4,x=f*Math.PI/2-b,w=(q,J)=>{let te=[[b,0,d],[x,d,d],[b,d,0],[q,0,0],[b,0,d],[x,d,d],[b,d,0],[J,0,0]],K={ss:[0],xs:[0],ys:[0],ps:[0],ks:[0]},ne=0,ie=0,ce=0,xe=0;return te.forEach(([be,Ue,Ae])=>{let Me=Math.max(1,Math.round(be/1.5)),ge=be/Me;for(let Ee=0;Ee<Me;Ee+=1){let je=Ue+(Ae-Ue)*((Ee+.5)/Me),Fe=ce+je*ge/2;ne+=Math.cos(Fe)*ge,ie+=Math.sin(Fe)*ge,ce+=je*ge,xe+=ge,K.ss.push(xe),K.xs.push(ne),K.ys.push(ie),K.ps.push(ce),K.ks.push(Ue+(Ae-Ue)*((Ee+1)/Me))}}),K},A=w(0,0),R=Math.max(0,e.H*.66-Math.max(...A.ys)),I=w(R,Math.max(48,e.W*.16)),N=B(f*.12,8,16),O=e.W-Math.max(18,e.W*.05)-N-Math.max(...I.xs),X=I.xs.map(q=>q+O),ee=I.ss.length-1,C=I.ys.findIndex(q=>q>3),m=C<0?X[ee]:X[C],j={...I,xs:X,r:f,T:N,x0:O,foot:m,S:I.ss[ee],clear:Math.min(m,X[ee])-12,ok:Math.max(...I.ys)+N<e.H-8};return e.rampKey=l,e.rampGeo=j,j},g=()=>{let[r,l]=V();if(!F())return B(e.W/2,r,l);let f=S();return B(Math.min(f.foot*.5,f.x0-90,f.clear-e.bw/2-40),r,l)},p=()=>({x:e.x,y:T()+e.bh/2+e.y+le}),y=()=>{let r=p(),l=Math.cos(e.th),f=Math.sin(e.th),d=s.current.thrusters?-(e.bh/2+T())+1:-(e.bh/2)+2;return M().map(b=>({x:r.x+b*l-d*f,y:r.y+b*f+d*l,dx:f,dy:-l}))},L=()=>{let r=p();return{x:r.x,y:e.H-r.y}},H=(r,l,f,d,b,x,w)=>{let A=b[0]-x[0],R=w[0]-x[0],I=d[0]-b[0]+x[0]-w[0],N=b[1]-x[1],O=w[1]-x[1],X=d[1]-b[1]+x[1]-w[1],ee=A*O-R*N||1e-6,C=(I*O-R*X)/ee,m=(A*X-I*N)/ee,j=b[0]-d[0]+C*b[0],q=w[0]-d[0]+m*w[0],J=b[1]-d[1]+C*b[1],te=w[1]-d[1]+m*w[1],K=d[0]-j*r/l,ne=d[1]-J*r/l;return Math.abs(C)<1e-7&&Math.abs(m)<1e-7?`matrix(${[j/l,J/l,q/f,te/f,K,ne].map(ce=>ce.toFixed(6)).join(",")})`:`matrix3d(${[j/l,J/l,0,C/l,q/f,te/f,0,m/f,0,0,1,0,K,ne,0,1-C*r/l].map(ce=>ce.toFixed(6)).join(",")})`},z=()=>{e.strip&&(e.strip.wrap.remove(),e.strip.ink.remove(),e.strip=null,n.style.visibility="")},Y=()=>{z();let r=e.track;if(!r)return;let l=r.geo,f=T()+e.bh/2,d=[0];for(let C=1;C<l.ss.length;C+=1){let m=(l.ks[C]+l.ks[C-1])/2;d.push(d[C-1]+(l.ss[C]-l.ss[C-1])*Math.max(1-m*f,.2))}let b=B(Math.round(e.bw/8),8,32),x=document.createElement("div");x.setAttribute("aria-hidden","true"),x.style.cssText="position:absolute;inset:0;z-index:1;pointer-events:none";let w=document.createElement("div");w.setAttribute("aria-hidden","true"),w.style.cssText="position:absolute;inset:0;z-index:2;pointer-events:none;will-change:transform";let A=Array.from(n.children),R=A[1],I=A.slice(2).map(C=>{let m=C.cloneNode(!0);return m.style.left="0px",m.style.top="0px",m.style.transformOrigin="0 0",x.appendChild(m),{el:m,x:C.offsetLeft,y:C.offsetTop+C.offsetHeight/2,k:1}}),N=[];for(let C=0;C<b;C+=1){let m=n.cloneNode(!0);m.removeAttribute("data-hover"),m.removeAttribute("data-pressed"),m.setAttribute("tabindex","-1"),m.setAttribute("inert",""),Array.from(m.children).slice(1).forEach(J=>{J.style.visibility="hidden"});let j=e.bw*C/b-(C?.75:2),q=e.bw*(C+1)/b+(C<b-1?.75:2);m.style.visibility="visible",m.style.transformOrigin="0 0",m.style.clipPath=`polygon(${j}px -2px, ${q}px -2px, ${q}px ${e.bh+2}px, ${j}px ${e.bh+2}px)`,x.appendChild(m),N.push(m)}let O=[],X=R&&R.textContent||"",ee=document.createElement("canvas").getContext("2d");if(R&&ee&&X.trim()&&!R.children.length){let C=getComputedStyle(R),m=`${C.fontStyle} ${C.fontWeight} ${C.fontSize} ${C.fontFamily}`;ee.font=m;let j=Array.from(X),q=K=>ee.measureText(j.slice(0,K).join("")).width,J=q(j.length)||1,te=R.offsetTop+R.offsetHeight/2;j.forEach((K,ne)=>{let ie=document.createElement("span");ie.textContent=K,ie.style.cssText=`position:absolute;left:0;top:0;white-space:pre;line-height:1;transform-origin:0 0;font:${m};color:${C.color}`,w.appendChild(ie),O.push({el:ie,x:R.offsetLeft+(q(ne)+q(ne+1))/2*(R.offsetWidth/J),y:te,k:.5})})}else if(R){let C=R.cloneNode(!0);C.style.position="absolute",C.style.left="0px",C.style.top="0px",C.style.transformOrigin="0 0",w.appendChild(C),O.push({el:C,x:R.offsetLeft+R.offsetWidth/2,y:R.offsetTop+R.offsetHeight/2,k:0})}t.appendChild(x),t.appendChild(w),n.style.visibility="hidden",e.strip={wrap:x,ink:w,parts:N,n:b,sn:d,pods:I,items:O}},Q=()=>{let r=e.strip,l=e.track;if(!r||!l)return;let f=l.geo,d=f.ss[f.ss.length-1],b=r.sn[r.sn.length-1],x=(m,j,q)=>{let J=0,te=m.length-1;for(;te-J>1;){let K=J+te>>1;m[K]<=q?J=K:te=K}return j[J]+(j[te]-j[J])*((q-m[J])/(m[te]-m[J]))},w=m=>m<=0?m:m>=d?b+m-d:x(f.ss,r.sn,m),A=m=>m<=0?m:m>=b?d+m-b:x(r.sn,f.ss,m),R=w(e.u),I=T(),N=(m,j)=>{let[q,J,te]=Ve(f,A(R+m-e.bw/2)),K=I+e.bh-j;return[q-Math.sin(te)*K,e.H-J-Math.cos(te)*K,te]},O=(m,j,q,J)=>{m.style.transform=`translate(${j.toFixed(2)}px, ${q.toFixed(2)}px) rotate(${(-J).toFixed(4)}rad) translate(-50%, -50%)`},X=e.bw/r.n,ee=[],C=[];for(let m=0;m<=r.n;m+=1)ee.push(N(m*X,0)),C.push(N(m*X,e.bh));r.parts.forEach((m,j)=>{m.style.transform=H(j*X,X,e.bh,ee[j],ee[j+1],C[j+1],C[j])}),r.pods.forEach(m=>{let[j,q,J]=N(m.x,m.y);O(m.el,j,q,J)}),r.items.forEach(m=>{let[j,q,J]=N(m.x,m.y),[te,K,ne]=N(e.bw/2,m.y),ie=m.x-e.bw/2,ce=te+Math.cos(ne)*ie,xe=K-Math.sin(ne)*ie;O(m.el,ce+(j-ce)*m.k,xe+(q-xe)*m.k,ne+(J-ne)*m.k)})},ye=()=>{e.strip&&Q();let r=p(),l=r.x-e.bw/2,f=e.H-r.y-e.bh/2;n.style.transform=`translate3d(${l.toFixed(2)}px, ${f.toFixed(2)}px, 0) rotate(${(-e.th).toFixed(5)}rad)`,t.style.setProperty("--fly-thrust",B(E()*.9,0,1.2).toFixed(3))},He=()=>{if(!i)return;let r=S(),l=i.querySelectorAll("path"),f=l[0],d=l[1],b=w=>w.toFixed(1),x=w=>{let A=[];for(let I=0;I<r.ss.length;I+=2){let N=r.ps[I];A.push(`${b(r.xs[I]+Math.sin(N)*w)} ${b(e.H-r.ys[I]+Math.cos(N)*w)}`)}let R=r.ps[r.ss.length-1];return A.push(`${b(r.xs[r.ss.length-1]+Math.sin(R)*w)} ${b(e.H-r.ys[r.ss.length-1]+Math.cos(R)*w)}`),`M ${A.join(" L ")}`};i.setAttribute("viewBox",`0 0 ${b(e.W)} ${b(e.H)}`),i.style.visibility=r.ok?"":"hidden",f&&(f.setAttribute("d",x(r.T/2)),f.setAttribute("stroke-width",b(r.T))),d&&d.setAttribute("d",x(.75))},ct=r=>{let l=new Float32Array(se*4),f=new Float32Array(se*4),d=[0,0,0,0],b=r.length,x=st,w=D();return r.forEach((A,R)=>{let I=B(e.thrust[R]*b,0,2),N=A.dy<-.2?A.y/-A.dy:x.forceMax;l.set([A.x,A.y,A.dx,A.dy],R*4),f.set([x.speed*Math.sqrt(I),x.radius*w,Math.min(x.forceMax,N*x.reach),I>.004?I:0],R*4);let O=e.fvx*-A.dy+e.fvy*A.dx;d[R]=B(-O*.22,-.55*N,.55*N)}),{a:l,b:f,bend:d}},De=r=>{if(!k)return;let l=s.current,f=y(),d=ct(f),b=p(),x=M(),w=D(),A=[b.x,b.y,e.bw/2,e.bh/2],R=[e.vx,e.vy,e.th,e.w],I=(1-Le((Math.abs(e.fvx)-40)/100))*(1-Le((Math.abs(e.th)-.1)/.2))*(U()?0:1);r>0&&(e.simTime+=r,k.step(r,{jets:d,craft:A,motion:R,calm:I,scale:w,activity:e.activity,jetX:[0,1,2,3].map(O=>O<x.length?x[O]:0),jetN:x.length,spacing:x.length>1?x[1]-x[0]:0,wind:e.wind*st.wind,time:e.simTime,smoke:B(me(l.smoke,1),0,3),turbulence:B(me(l.turbulence,1),0,3)}));let N=mo(l.smokeColor);k.render(o.width,o.height,{jets:d,craft:A,motion:R,scale:w,activity:e.activity,time:e.simTime,light:l.theme==="light",smokeColor:N,shadeColor:N.map((O,X)=>O*.74+[0,.012,.045][X]),thrustColor:mo(l.thrustColor)})},Pe=()=>{let r=t.getBoundingClientRect(),l=e.W;if(e.W=Math.max(1,r.width),e.H=Math.max(1,r.height),e.bw=n.offsetWidth,e.bh=n.offsetHeight,e.placed?l>0&&l!==e.W&&(e.x*=e.W/l):(e.x=g(),e.placed=!0),!U()){let[b,x]=V();e.x=B(e.x,b,x)}e.dpr=Math.min(window.devicePixelRatio||1,1);let f=Math.round(e.W*e.dpr),d=Math.round(e.H*e.dpr);(o.width!==f||o.height!==d)&&(o.width=f,o.height=d),k&&k.resize(e.W,e.H),He(),t.dataset.ready="",ye(),e.running||De(0)},We=(r,l,f=0)=>{let d=L(),b=e.th,x=r-d.x,w=l-d.y,A=x*Math.cos(b)-w*Math.sin(b),R=x*Math.sin(b)+w*Math.cos(b);return Math.abs(A)<=e.bw/2+2+f&&R>=-e.bh/2-2-f&&R<=e.bh/2+T()+f},he=()=>{e.pt=0,e.armed=!1,e.seed=Math.random()*100,e.wind=Math.random()<.5?-1-Math.random():1+Math.random(),e.vrPrev=0,e.quiet=0,e.boost=!1},Ce=()=>{if(e.phase!=="rest"||a())return!1;let r=s.current;he(),e.phase="ignite",e.delay=e.delay.map(()=>Math.random()*.07);let l=e.H-e.bh-T()-30-le;return e.alt=B(e.y+me(r.altitude,170),e.y+24,Math.max(e.y+24,l)),e.climbT=1.15+(e.alt-e.y)/420,e.hold=Math.max(0,me(r.hoverTime,2.4)),e.xRef=e.x,lt(),!0},Ve=(r,l)=>{if(l<=0)return[r.x0+l,0,0,0];let f=0,d=r.ss.length-1;if(l>=r.ss[d]){let x=r.ps[d];return[r.xs[d]+Math.cos(x)*(l-r.ss[d]),r.ys[d]+Math.sin(x)*(l-r.ss[d]),x,0]}for(;d-f>1;){let x=f+d>>1;r.ss[x]<=l?f=x:d=x}let b=(l-r.ss[f])/(r.ss[d]-r.ss[f]);return[r.xs,r.ys,r.ps,r.ks].map(x=>x[f]+(x[d]-x[f])*b)},fe=(r,l)=>{let[f,d,b,x]=Ve(r.geo,l);return{x:f-Math.sin(b)*r.base,cy:d+Math.cos(b)*r.base,th:b,bend:x*r.base}},Oe=()=>{if(e.phase!=="rest"||a()||!F())return!1;let r=S(),l=r.x0-e.x;if(l<60||!r.ok)return Ce();he();let f=T()+e.bh/2,d=Math.max(...r.ys)-2*f,b=Math.sqrt(2*Mt*d+2.2*Mt*(r.r-f));return e.track={geo:r,base:f,v0:b,acc:b*b/(2*l)},e.phase="drive",e.u=-l,e.v=0,e.thrust=[0,0,0,0],Y(),lt(),!0},Dt=r=>{let[l,f]=V(),d=e.x+r;F()&&(d=Math.min(d,S().clear-e.bw/2)),e.landX=B(d,l,f)},bo=r=>{let l=s.current,f=B(me(l.wobble,1),0,3);if(e.pt+=r,e.clock+=r,e.phase==="return"){let v=e.back,P=Math.min(e.pt/v.time,1);e.x=v.from+(v.to-v.from)*ho(P),e.vx=(v.to-v.from)*vo(P)/v.time,e.y=-le,e.vy=0,e.th=0,e.w=0,P>=1&&(e.phase="rest",e.pt=0,e.vx=0);return}if(e.phase==="drive"||e.phase==="loop"){let v=e.track,P=fe(v,e.u);e.phase==="drive"?e.v=Math.min(v.v0,e.v+v.acc*r):e.v=Math.sqrt(Math.max(v.v0*v.v0-2*Mt*(P.cy-v.base),.2*v.v0*v.v0)),e.u+=e.v*r/Math.max(1-P.bend,.25),e.phase==="drive"&&e.u>=0&&(e.phase="loop");let Z=fe(v,e.u);e.vx=(Z.x-P.x)/r,e.vy=(Z.cy-P.cy)/r,e.w=(Z.th-P.th)/r,e.x=Z.x,e.y=Z.cy-T()-e.bh/2-le,e.th=Z.th,e.thrust=e.thrust.map(_e=>_e*Math.exp(-r/.1)),e.phase==="loop"&&e.u>=v.geo.S&&(z(),e.phase="flip",e.pt=0,e.flip={th:e.th,w:e.w});return}let d=(e.bw*e.bw+e.bh*e.bh)/12,b=Math.max(Math.cos(e.th),.5),x=0,w=!1,A=e.xRef,R=3,I=3.6,N=null;if(e.phase==="flip"){let v=Math.min(e.pt/Et,1),P=e.flip,Z=Math.PI*2;N={th:(2*v*v*v-3*v*v+1)*P.th+(v*v*v-2*v*v+v)*Et*P.w+(3*v*v-2*v*v*v)*Z,w:(6*v*v-6*v)*(P.th-Z)/Et+(3*v*v-4*v+1)*P.w},x=2.4*Le((Math.cos(N.th)-.8)/.15);let _e=e.y+le<e.bh*.6;(v>=1||_e)&&(N=null,e.th-=Math.PI*2*Math.round(e.th/(Math.PI*2)),e.phase="descend",e.pt=0,e.boost=!0,e.vrPrev=e.vy,Dt(e.vx*Math.abs(e.vx)/700))}if(e.phase==="ignite"&&(x=.9*Le(e.pt/.5),e.pt>=.5&&(e.phase="climb",e.pt=0,e.y0=e.y)),e.phase==="climb"){let v=e.pt/e.climbT,P=e.alt-e.y0,Z=e.y0+P*ho(v),_e=P*vo(v)/e.climbT,Ne=P*Go(v)/(e.climbT*e.climbT);x=(ae+Ne+30*(Z-e.y)+8*(_e-e.vy))/(ae*b),w=!0,v>=1&&(e.phase="hover",e.pt=0)}else if(e.phase==="hover"){let v=e.clock*.8,P=e.alt+3.5*f*rt(v,e.seed),Z=3.5*f*.8*Ko(v,e.seed);x=(ae+30*(P-e.y)+8*(Z-e.vy))/(ae*b),w=!0,e.pt>=e.hold&&(e.phase="descend",e.pt=0,e.vrPrev=0,Dt(0))}else if(e.phase==="drag"){let v=e.target.y-T()-e.bh/2-le;x=(ae+34*(v-e.y)-10*e.vy)/(ae*b),w=!0}else if(e.phase==="descend"){A=e.landX,R=e.boost?5:4,I=e.boost?4.6:4.2;let v=170,P=32,Z=e.boost?Le((Math.abs(e.landX-e.x)-20)/40):Le((Math.abs(e.landX-e.x)-3)/23),_e=Math.max(e.y+le,0),Ne=(P+(v-P)*(1-Math.exp(-_e/52)))*(1-(e.boost?.45:.88)*Z),pt=e.boost?v*3:v*Le(e.pt/.9)+1,$e=-Math.min(Ne,pt),Xe=B(($e-e.vrPrev)/Math.max(r,1e-4),-600,600);e.vrPrev=$e,x=(ae+Xe+(e.boost?9:7)*($e-e.vy))/(ae*b),w=!0,e.contact&&e.pt>.3&&(e.phase="landed",e.pt=0,e.boost=!1)}else if(e.phase==="landed"&&(x=0,e.pt>.6&&E()<.03)){let v=F()&&e.track?g():e.x;e.phase=Math.abs(v-e.x)>6?"return":"rest",e.pt=0,e.thrust=[0,0,0,0],e.vy=0,e.w=0,e.vx=0,e.track=null,e.back={from:e.x,to:v,time:B(Math.abs(v-e.x)/200,.7,1.8)}}x=Number.isFinite(x)?B(x,0,e.boost||e.phase==="flip"?2.6:1.9):1;let O=M(),X=O.length,ee=O.reduce((v,P)=>v+P*P,0),C=e.phase==="drag"?B(100*(e.target.x-e.x)-17*e.vx,-2400,2400):0,m=0;if(w){let v=.8*f*rt(e.clock*1.7,e.seed+3),P=e.phase==="drag"?C*.75:R*(A-e.x)-I*e.vx,Z=e.boost?.45:.32,_e=B(-Math.atan2(P,ae),-Z,Z);m=-81*(e.th-_e)-14*e.w-v}let j=(e.boost||e.phase==="flip"?2.6:2.4)/X,q=(v,P)=>v+(P-v)*(1-Math.exp(-r/(P>v?.08:.17))),J=ee>1?m*d/(ae*ee):0,te=Math.abs(J)*Math.max(0,...O.map(Math.abs)),K=Math.min(x/X,Math.max(j-te,j*.5)),ne=0;for(let v=0;v<se;v+=1){let P=0;v<X&&(P=B(K+J*O[v],0,j),e.phase==="ignite"&&e.pt<e.delay[v]&&(P=0)),e.thrust[v]=q(e.thrust[v],P),v<X&&(ne+=e.thrust[v]*O[v])}let ie=E()*ae,ce=e.phase==="drag"?C:-ie*Math.sin(e.th)-.8*e.vx,xe=ie*Math.cos(e.th)-ae-.3*e.vy,be=e.phase==="flip"?0:ne*ae/d-1.2*e.w;w&&(e.phase!=="drag"&&(ce+=12*f*rt(e.clock*.7,e.seed+7)),be+=.9*f*rt(e.clock*2.3,e.seed+11),ee<1&&(be+=m),Math.abs(e.th)>.35&&(be-=(e.th-Math.sign(e.th)*.35)*160));let Ue=p(),Ae=Math.cos(e.th),Me=Math.sin(e.th),ge=-(e.bh/2+T()),Ee=!1;e.phase!=="flip"&&G().forEach(v=>{let P=v*Ae-ge*Me,Z=v*Me+ge*Ae,_e=Ue.y+Z,Ne=le-_e;if(Ne>0){Ee=!0;let pt=e.vy+e.w*P,$e=e.vx-e.w*Z,Xe=Math.max(0,yo*Ne-Jo*pt),$t=-10*$e;xe+=Xe,ce+=$t,be+=(P*Xe-Z*$t)/d}}),e.contact=Ee,e.vx=B(e.vx+ce*r,-1500,1500),e.vy=B(e.vy+xe*r,-1500,1500),e.w=B(e.w+be*r,-14,14),e.x+=e.vx*r,e.y+=e.vy*r,e.th+=e.w*r,N&&(e.th=N.th,e.w=N.w),e.phase!=="flip"&&Math.abs(e.th)>po&&(e.th=Math.sign(e.th)*po,e.w*e.th>0&&(e.w=0));let[je,Fe]=V();(e.x<je||e.x>Fe)&&(e.x=B(e.x,je,Fe),e.vx=0),e.y+le<-40&&(e.y=-le,e.vy=0),Number.isFinite(e.y+e.x+e.th+e.vy+e.vx+e.w+E())||(Object.assign(e,{x:e.W/2,vx:0,y:-le,vy:0,th:0,w:0,thrust:[0,0,0,0],phase:"rest"}),e.drag=null)},ut=r=>{let l=s.current,f=e.pointer,d=L();if(e.attached&&!e.drag&&e.lastC){let R=f.x+e.off.x,I=f.y+e.off.y,N=-(e.th-e.lastTh),O=R-e.lastC.x,X=I-e.lastC.y,ee=d.x+O*Math.cos(N)-X*Math.sin(N),C=d.y+O*Math.sin(N)+X*Math.cos(N);e.off.x+=ee-R,e.off.y+=C-I}e.lastC=d,e.lastTh=e.th;let b=f.x+e.off.x,x=f.y+e.off.y,w=f.in&&We(b,x,e.attached||e.drag?10:0);if(w!==e.hover&&(e.hover=w,w?n.dataset.hover="":delete n.dataset.hover),!w&&!e.drag&&(e.attached=!1,e.phase==="rest"&&(e.armed=!0)),w&&e.armed&&e.phase==="rest"&&f.type==="mouse"&&l.trigger!=="click"&&!F()&&Ce()&&(e.attached=!!l.carryCursor),e.phase==="rest"&&Math.abs(e.off.x)+Math.abs(e.off.y)<12){let R=Math.exp(-r*6);e.off.x*=R,e.off.y*=R}Math.abs(e.off.x)+Math.abs(e.off.y)<.3&&(!e.attached||e.phase==="rest")&&(e.off.x=0,e.off.y=0,e.phase==="rest"&&(e.attached=!1));let A=!!l.carryCursor&&f.in&&f.type==="mouse"&&(e.attached||!!e.drag||e.off.x!==0||e.off.y!==0);A!==e.carry&&(e.carry=A,A?t.dataset.carry="":delete t.dataset.carry),A&&u&&(u.style.transform=`translate3d(${(b-1.8).toFixed(2)}px, ${(x-1.75).toFixed(2)}px, 0)`)},Pt=r=>{e.raf=0;let l=e.last?B((r-e.last)/1e3,0,1/30):1/60;if(e.last=r,l>0){if(e.phase!=="rest")for(let w=0;w<6;w+=1)bo(l/6);let f=1-Math.exp(-l/.12);e.fvx+=(e.vx-e.fvx)*f,e.fvy+=(e.vy-e.fvy)*f,ut(l),ye(),De(l);let d=E();e.quiet=d>.01||e.phase!=="rest"?0:e.quiet+l;let b=d>.05?1:0;e.activity+=(b-e.activity)*(1-Math.exp(-l/(b?.25:1.6)))}e.phase!=="rest"||e.quiet<7||e.carry?e.raf=requestAnimationFrame(Pt):(e.running=!1,e.last=0,k&&k.clear(),De(0))},lt=()=>{e.raf||(e.running=!0,e.raf=requestAnimationFrame(Pt))},Ut=r=>{let l=t.getBoundingClientRect();return{x:r.clientX-l.left,y:r.clientY-l.top}},ft=()=>{let r=e.pointer,l=r.type==="mouse";return{x:r.x+(l?e.off.x:0),y:r.y+(l?e.off.y:0)}},Nt=()=>{if(!e.drag)return;let r=ft(),[l,f]=V(),d=T()+e.bh/2;e.target.x=B(r.x-e.drag.gx,l,f),e.target.y=B(e.H-(r.y-e.drag.gy),d,Math.max(d,e.H-e.bh/2-6))},go=r=>{let l=ft(),f=L();e.drag={gx:l.x-f.x,gy:l.y-f.y},e.phase="drag",e.pt=0,e.attached=!1,e.pressed=!1,e.suppress=!0,e.boost=!1,delete n.dataset.pressed,t.dataset.dragging="";try{t.setPointerCapture(r.pointerId)}catch{}Nt()},ko=r=>{e.drag=null,e.press=null,delete t.dataset.dragging;try{t.releasePointerCapture(r.pointerId)}catch{}e.phase="hover",e.pt=0,e.alt=e.y;let[l,f]=V();e.xRef=B(e.x+e.vx*.3,l,f),e.hold=Math.min(Math.max(0,me(s.current.hoverTime,2.4)),.9)},qe=r=>{let l=Ut(r),f=e.pointer;if(f.in&&!e.attached&&!e.drag&&(e.off.x||e.off.y)){let d=Math.exp(-Math.hypot(l.x-f.x,l.y-f.y)/110);e.off.x*=d,e.off.y*=d}f.x=l.x,f.y=l.y,f.in=!0,f.type=r.pointerType||"mouse",e.press&&!e.drag&&W()&&Math.hypot(l.x-e.press.x,l.y-e.press.y)>4&&go(r),e.drag&&Nt(),ut(0),(e.carry||e.phase!=="rest")&&lt()},At=()=>{e.drag||(e.pointer.in=!1,e.attached=!1,e.off.x=0,e.off.y=0,ut(0))},jt=r=>{let l=Ut(r),f=e.pointer;f.x=l.x,f.y=l.y,f.in=!0,f.type=r.pointerType||"mouse",e.suppress=!1;let d=ft();We(d.x,d.y,e.attached?10:0)&&(f.type!=="mouse"&&e.phase==="rest"&&s.current.trigger!=="click"&&!F()&&Ce(),e.press={x:l.x,y:l.y},e.carry&&f.type==="mouse"&&(e.pressed=!0,n.dataset.pressed=""))},Je=r=>{if(e.drag){ko(r);return}e.press=null,e.pressed&&(e.pressed=!1,delete n.dataset.pressed,e.carry&&e.hover&&(e.phase==="rest"&&F()?Oe():s.current.trigger==="click"&&Ce()&&(e.attached=!!s.current.carryCursor),s.current.onClick&&s.current.onClick(r)))},Ft=r=>{if(e.suppress){e.suppress=!1,r.stopPropagation(),r.preventDefault();return}if(e.phase==="rest"){if(F()){Oe();return}Ce()&&e.pointer.type==="mouse"&&e.pointer.in&&e.hover&&(e.attached=!!s.current.carryCursor)}};t.addEventListener("pointermove",qe),t.addEventListener("pointerenter",qe),t.addEventListener("pointerleave",At),t.addEventListener("pointerdown",jt),t.addEventListener("pointerup",Je),t.addEventListener("pointercancel",Je),n.addEventListener("click",Ft);let _t=new ResizeObserver(Pe);return _t.observe(t),_t.observe(n),Pe(),{refresh:Pe,rehome(){Pe(),e.phase==="rest"&&(e.x=g(),ye(),e.running||De(0))},destroy(){_t.disconnect(),z(),e.raf&&cancelAnimationFrame(e.raf),t.removeEventListener("pointermove",qe),t.removeEventListener("pointerenter",qe),t.removeEventListener("pointerleave",At),t.removeEventListener("pointerdown",jt),t.removeEventListener("pointerup",Je),t.removeEventListener("pointercancel",Je),n.removeEventListener("click",Ft),k&&k.dispose()}}}function fn(t){let o=(S,g)=>{let p=t.createShader(S);if(t.shaderSource(p,g),t.compileShader(p),!t.getShaderParameter(p,t.COMPILE_STATUS)){let y=t.getShaderInfoLog(p);throw t.deleteShader(p),new Error(y)}return p},n=o(t.VERTEX_SHADER,Yo),u=[],i=S=>{let g=o(t.FRAGMENT_SHADER,S),p=t.createProgram();if(t.attachShader(p,n),t.attachShader(p,g),t.linkProgram(p),!t.getProgramParameter(p,t.LINK_STATUS))throw new Error(t.getProgramInfoLog(p));t.deleteShader(g);let y={},L=t.getProgramParameter(p,t.ACTIVE_UNIFORMS);for(let z=0;z<L;z+=1){let Y=t.getActiveUniform(p,z);y[Y.name.replace(/\[0\]$/,"")]=t.getUniformLocation(p,Y.name)}let H={p,u:y};return u.push(H),H},s={advect:i(Zo),force:i(Qo),curl:i(en),vorticity:i(tn),divergence:i(on),pressure:i(nn),gradient:i(rn),scale:i(sn),blur:i(an),dye:i(cn),render:i(un)},_=t.createVertexArray(),h=[],e=(S,g,p,y)=>{let L=t.createTexture();t.bindTexture(t.TEXTURE_2D,L);let H=y?Math.floor(Math.log2(Math.max(S,g)))+1:1;t.texStorage2D(t.TEXTURE_2D,H,p,S,g),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,y?t.LINEAR_MIPMAP_LINEAR:t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE);let z=t.createFramebuffer();t.bindFramebuffer(t.FRAMEBUFFER,z),t.framebufferTexture2D(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,L,0),t.viewport(0,0,S,g),t.clearColor(0,0,0,0),t.clear(t.COLOR_BUFFER_BIT);let Y={tex:L,fbo:z,w:S,h:g,mips:y};return h.push(Y),Y},k=(S,g,p,y)=>{let L={read:e(S,g,p,y),write:e(S,g,p,y)};return L.swap=()=>{let H=L.read;L.read=L.write,L.write=H},L},a=null,D=[1,1],T=()=>{h.forEach(S=>{t.deleteTexture(S.tex),t.deleteFramebuffer(S.fbo)}),h.length=0},c=(S,g)=>{let p=Math.max(2,S/520,g/300),y=Math.max(16,Math.round(S/p)),L=Math.max(16,Math.round(g/p)),H=Math.max(16,Math.round(S/(p/2))),z=Math.max(16,Math.round(g/(p/2)));D=[S,g],!(a&&a.vw===y&&a.vh===L&&a.dw===H&&a.dh===z)&&(T(),a={vw:y,vh:L,dw:H,dh:z,velocity:k(y,L,t.RG16F,!1),pressure:k(y,L,t.R16F,!1),divergence:e(y,L,t.R16F,!1),curl:e(y,L,t.R16F,!1),dye:k(H,z,t.RG16F,!1),soft:e(H,z,t.RG16F,!0),temp:e(H,z,t.RG16F,!1)})},M=0,G=(S,g)=>{t.useProgram(S.p),M=0,Object.entries(g).forEach(([p,y])=>{let L=S.u[p];L!=null&&(typeof y=="number"?t.uniform1f(L,y):y.f1?t.uniform1fv(L,y.f1):y.tex?(t.activeTexture(t.TEXTURE0+M),t.bindTexture(t.TEXTURE_2D,y.tex),t.uniform1i(L,M),M+=1):y.length===2?t.uniform2fv(L,y):y.length===3?t.uniform3fv(L,y):t.uniform4fv(L,y))})},E=(S,g,p)=>{G(S,g),p&&(t.bindFramebuffer(t.FRAMEBUFFER,p.fbo),t.viewport(0,0,p.w,p.h)),t.bindVertexArray(_),t.drawArrays(t.TRIANGLES,0,3)};return{step:(S,g)=>{if(!a)return;let p=st;t.disable(t.BLEND);let y=[1/a.vw,1/a.vh];E(s.advect,{uVelocity:a.velocity.read,uSource:a.velocity.read,uWorld:D,uDt:S,uKeep:1},a.velocity.write),a.velocity.swap(),E(s.force,{uVelocity:a.velocity.read,uDye:a.soft,uWorld:D,uDt:S,uBuoyancy:p.buoy,uLift:p.lift,uDamping:p.damp,uSpread:p.spread,uSplash:p.splash,uFriction:p.friction,uWind:g.wind,uTurb:[p.turb*(.35+.65*g.activity),p.turbScale],uTime:g.time,uObstacle:g.calm,uKick:[p.kickNear*g.scale,p.kickW*g.scale,p.kickH*g.scale],uCraft:g.craft,uCraftMotion:g.motion,uJetA:g.jets.a,uJetB:g.jets.b,uJetBend:{f1:g.jets.bend}},a.velocity.write),a.velocity.swap(),E(s.curl,{uVelocity:a.velocity.read,uTexel:y},a.curl),E(s.vorticity,{uVelocity:a.velocity.read,uCurl:a.curl,uTexel:y,uStrength:p.vort*g.turbulence*(.4+.6*g.activity),uDt:S},a.velocity.write),a.velocity.swap(),E(s.divergence,{uVelocity:a.velocity.read,uTexel:y},a.divergence),E(s.scale,{uSource:a.pressure.read,uScale:.8},a.pressure.write),a.pressure.swap();for(let H=0;H<p.iters;H+=1)E(s.pressure,{uPressure:a.pressure.read,uDivergence:a.divergence,uTexel:y},a.pressure.write),a.pressure.swap();E(s.gradient,{uPressure:a.pressure.read,uVelocity:a.velocity.read,uTexel:y},a.velocity.write),a.velocity.swap(),E(s.dye,{uVelocity:a.velocity.read,uSource:a.dye.read,uWorld:D,uDt:S,uKeep:[Math.exp(-(p.keepD+p.keepIdle*(1-g.activity))*S),Math.exp(-p.keepH*S)],uRate:[p.rateN*g.smoke,p.rateH,p.rateK*g.smoke,p.rateC*g.smoke],uSpread:p.spread,uCol:[p.colSpread,p.colR*g.scale,p.colD,p.colU],uKick:[p.kickNear*g.scale,p.kickW*g.scale,p.kickH*g.scale],uDisperse:p.disperse,uDispV:p.dispV,uCraft:g.craft,uCraftMotion:g.motion,uGap:[g.spacing,p.gap*g.calm],uJetX:{f1:g.jetX},uJetN:g.jetN,uFloor:p.floor,uTime:g.time,uJetA:g.jets.a,uJetB:g.jets.b,uJetBend:{f1:g.jets.bend}},a.dye.write),a.dye.swap();let L=p.blur/2;E(s.blur,{uSource:a.dye.read,uStep:[L/a.dw,0]},a.temp),E(s.blur,{uSource:a.temp,uStep:[0,L/a.dh]},a.soft),t.bindTexture(t.TEXTURE_2D,a.soft.tex),t.generateMipmap(t.TEXTURE_2D)},render:(S,g,p)=>{if(!a)return;let y=st;t.bindFramebuffer(t.FRAMEBUFFER,null),t.viewport(0,0,S,g),t.disable(t.BLEND),E(s.render,{uDye:a.soft,uWorld:D,uDyeSize:[a.dw,a.dh],uTime:p.time,uLightTheme:p.light?1:0,uSmoke:p.smokeColor,uShade:p.shadeColor,uThrust:p.thrustColor,uLook:[y.alphaK*(.6+.4*p.activity),y.relief,y.shadow,y.alphaLod],uLook2:[y.ambient,y.key,y.wrap,y.ao],uLook3:[y.normalE,y.normalLod,y.fine,y.broad],uCol:[y.colSpread,y.colR*p.scale,y.colD,y.colU],uScale:p.scale,uGamma:y.gamma,uTone:y.tone,uLight2:[y.jetLight,y.emit,y.exposure],uThreshold:y.threshold*(.3+.7*p.activity),uCraft:p.craft,uCraftMotion:p.motion,uJetA:p.jets.a,uJetB:p.jets.b,uJetBend:{f1:p.jets.bend}})},resize:c,clear:()=>{a&&([a.velocity.read,a.velocity.write,a.pressure.read,a.pressure.write,a.dye.read,a.dye.write,a.soft,a.temp].forEach(S=>{t.bindFramebuffer(t.FRAMEBUFFER,S.fbo),t.clearColor(0,0,0,0),t.clear(t.COLOR_BUFFER_BIT)}),t.bindTexture(t.TEXTURE_2D,a.soft.tex),t.generateMipmap(t.TEXTURE_2D))},dispose:()=>{T(),u.forEach(S=>t.deleteProgram(S.p)),t.deleteShader(n),t.deleteVertexArray(_)}}}function Lt({children:t="Take off",onClick:o,theme:n="dark",size:u="medium",radius:i,altitude:s=170,hoverTime:_=2.4,jets:h=2,thrusters:e=!0,trigger:k="hover",carryCursor:a=!0,ramp:D=!1,rampColor:T,smoke:c=1,turbulence:M=1,wobble:G=1,thrustColor:E,smokeColor:W,buttonColor:U,textColor:V,className:F="",style:S}){let g=ve(null),p=ve(null),y=ve(null),L=ve(null),H=ve(null),z=ve(null),Y=ve({}),Q=n==="light",ye=at[u]||at.medium,He=E||(Q?"#4f8cff":"#8ec5ff"),ct=W||(Q?"#e9ebf0":"#eef1f6"),De=U||(Q?"#18181b":"#27272a"),Pe=V||(Q?"#fafafa":"#f5f5f5"),We=T||(Q?"#ececf0":"#25222b"),he=B(Math.round(me(h,2)),1,se),Ce=he===1?0:he===2?.3:.34,Ve=e?Array.from({length:he},(fe,Oe)=>he===1?50:50+Ce*100*(2*Oe/(he-1)-1)):[];return Y.current={size:u,altitude:s,hoverTime:_,jets:he,thrusters:!!e,trigger:k,carryCursor:a,ramp:!!D,smoke:c,turbulence:M,wobble:G,thrustColor:He,smokeColor:ct,theme:n,onClick:o},ze(()=>{let fe=ln({root:g.current,canvas:p.current,button:y.current,cursor:L.current,ramp:H.current,props:Y});return z.current=fe,()=>{z.current=null,fe.destroy()}},[]),ze(()=>{z.current&&z.current.refresh()},[u,he,e,i]),ze(()=>{z.current&&z.current.rehome()},[D]),re("div",{ref:g,className:`flying-button ${F}`.trim(),"data-theme":n,"data-trigger":D?"click":k,style:{"--fly-bg":De,"--fly-ink":Pe,"--fly-glow":He,"--fly-ramp":We,"--fly-h":`${ye.h}px`,"--fly-px":`${ye.px}px`,"--fly-fs":`${ye.fs}px`,"--fly-scale":ye.k,...i!=null?{"--fly-radius":`${me(i,0)}px`}:{},...S},children:[re("svg",{ref:H,className:"flying-button__ramp",style:D?void 0:{display:"none"},"aria-hidden":"true",children:[re("path",{className:"flying-button__ramp-body"}),re("path",{className:"flying-button__ramp-edge"})]}),re("canvas",{ref:p,className:"flying-button__smoke","aria-hidden":"true"}),re("button",{ref:y,type:"button",className:"flying-button__craft",onClick:fe=>Y.current.onClick&&Y.current.onClick(fe),children:[re("span",{className:"flying-button__face","aria-hidden":"true"}),re("span",{className:"flying-button__label",children:t}),Ve.map(fe=>re("span",{className:"flying-button__pod",style:{left:`${fe}%`},"aria-hidden":"true"},fe))]}),re("svg",{ref:L,className:"flying-button__cursor",viewBox:"0 0 24 34","aria-hidden":"true",children:re("path",{d:"M2.2 2.1v24.6l6.1-5.9 4.1 9.6 4.4-1.9-4.1-9.4h8.6z",fill:"#0a0a0c",stroke:"#fff",strokeWidth:"1.9",strokeLinejoin:"round"})})]})}var it=document.getElementById("flying-button-root");it&&(it.dataset.mounted="true",it.querySelector(".launch-fallback")?.remove(),gt(re(Lt,{theme:"dark",size:"large",altitude:170,hoverTime:2.4,jets:2,thrusters:!0,trigger:"hover",carryCursor:!0,smoke:1,turbulence:1,wobble:1,ramp:!1,thrustColor:"#8ec5ff",smokeColor:"#eef1f6",onClick:()=>document.getElementById("launch-cta")?.click(),children:"Take off"}),it));
