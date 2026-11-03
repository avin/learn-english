var Nm=Object.defineProperty;var Om=(t,e,n)=>e in t?Nm(t,e,{enumerable:!0,configurable:!0,writable:!0,value:n}):t[e]=n;var xm=(t,e)=>()=>(e||t((e={exports:{}}).exports,e),e.exports);var An=(t,e,n)=>(Om(t,typeof e!="symbol"?e+"":e,n),n);var WS=xm((wt,Et)=>{(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))r(i);new MutationObserver(i=>{for(const s of i)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&r(o)}).observe(document,{childList:!0,subtree:!0});function n(i){const s={};return i.integrity&&(s.integrity=i.integrity),i.referrerPolicy&&(s.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?s.credentials="include":i.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function r(i){if(i.ep)return;i.ep=!0;const s=n(i);fetch(i.href,s)}})();function Dm(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}var Hd={exports:{}},to={},Wd={exports:{}},D={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var yi=Symbol.for("react.element"),Lm=Symbol.for("react.portal"),Mm=Symbol.for("react.fragment"),bm=Symbol.for("react.strict_mode"),Vm=Symbol.for("react.profiler"),jm=Symbol.for("react.provider"),Um=Symbol.for("react.context"),Fm=Symbol.for("react.forward_ref"),zm=Symbol.for("react.suspense"),$m=Symbol.for("react.memo"),Bm=Symbol.for("react.lazy"),$u=Symbol.iterator;function Hm(t){return t===null||typeof t!="object"?null:(t=$u&&t[$u]||t["@@iterator"],typeof t=="function"?t:null)}var Kd={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},Gd=Object.assign,qd={};function cr(t,e,n){this.props=t,this.context=e,this.refs=qd,this.updater=n||Kd}cr.prototype.isReactComponent={};cr.prototype.setState=function(t,e){if(typeof t!="object"&&typeof t!="function"&&t!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,t,e,"setState")};cr.prototype.forceUpdate=function(t){this.updater.enqueueForceUpdate(this,t,"forceUpdate")};function Qd(){}Qd.prototype=cr.prototype;function wl(t,e,n){this.props=t,this.context=e,this.refs=qd,this.updater=n||Kd}var El=wl.prototype=new Qd;El.constructor=wl;Gd(El,cr.prototype);El.isPureReactComponent=!0;var Bu=Array.isArray,Yd=Object.prototype.hasOwnProperty,Sl={current:null},Jd={key:!0,ref:!0,__self:!0,__source:!0};function Xd(t,e,n){var r,i={},s=null,o=null;if(e!=null)for(r in e.ref!==void 0&&(o=e.ref),e.key!==void 0&&(s=""+e.key),e)Yd.call(e,r)&&!Jd.hasOwnProperty(r)&&(i[r]=e[r]);var a=arguments.length-2;if(a===1)i.children=n;else if(1<a){for(var l=Array(a),u=0;u<a;u++)l[u]=arguments[u+2];i.children=l}if(t&&t.defaultProps)for(r in a=t.defaultProps,a)i[r]===void 0&&(i[r]=a[r]);return{$$typeof:yi,type:t,key:s,ref:o,props:i,_owner:Sl.current}}function Wm(t,e){return{$$typeof:yi,type:t.type,key:e,ref:t.ref,props:t.props,_owner:t._owner}}function Il(t){return typeof t=="object"&&t!==null&&t.$$typeof===yi}function Km(t){var e={"=":"=0",":":"=2"};return"$"+t.replace(/[=:]/g,function(n){return e[n]})}var Hu=/\/+/g;function Ao(t,e){return typeof t=="object"&&t!==null&&t.key!=null?Km(""+t.key):e.toString(36)}function Ji(t,e,n,r,i){var s=typeof t;(s==="undefined"||s==="boolean")&&(t=null);var o=!1;if(t===null)o=!0;else switch(s){case"string":case"number":o=!0;break;case"object":switch(t.$$typeof){case yi:case Lm:o=!0}}if(o)return o=t,i=i(o),t=r===""?"."+Ao(o,0):r,Bu(i)?(n="",t!=null&&(n=t.replace(Hu,"$&/")+"/"),Ji(i,e,n,"",function(u){return u})):i!=null&&(Il(i)&&(i=Wm(i,n+(!i.key||o&&o.key===i.key?"":(""+i.key).replace(Hu,"$&/")+"/")+t)),e.push(i)),1;if(o=0,r=r===""?".":r+":",Bu(t))for(var a=0;a<t.length;a++){s=t[a];var l=r+Ao(s,a);o+=Ji(s,e,n,l,i)}else if(l=Hm(t),typeof l=="function")for(t=l.call(t),a=0;!(s=t.next()).done;)s=s.value,l=r+Ao(s,a++),o+=Ji(s,e,n,l,i);else if(s==="object")throw e=String(t),Error("Objects are not valid as a React child (found: "+(e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e)+"). If you meant to render a collection of children, use an array instead.");return o}function Oi(t,e,n){if(t==null)return t;var r=[],i=0;return Ji(t,r,"","",function(s){return e.call(n,s,i++)}),r}function Gm(t){if(t._status===-1){var e=t._result;e=e(),e.then(function(n){(t._status===0||t._status===-1)&&(t._status=1,t._result=n)},function(n){(t._status===0||t._status===-1)&&(t._status=2,t._result=n)}),t._status===-1&&(t._status=0,t._result=e)}if(t._status===1)return t._result.default;throw t._result}var we={current:null},Xi={transition:null},qm={ReactCurrentDispatcher:we,ReactCurrentBatchConfig:Xi,ReactCurrentOwner:Sl};D.Children={map:Oi,forEach:function(t,e,n){Oi(t,function(){e.apply(this,arguments)},n)},count:function(t){var e=0;return Oi(t,function(){e++}),e},toArray:function(t){return Oi(t,function(e){return e})||[]},only:function(t){if(!Il(t))throw Error("React.Children.only expected to receive a single React element child.");return t}};D.Component=cr;D.Fragment=Mm;D.Profiler=Vm;D.PureComponent=wl;D.StrictMode=bm;D.Suspense=zm;D.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=qm;D.cloneElement=function(t,e,n){if(t==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+t+".");var r=Gd({},t.props),i=t.key,s=t.ref,o=t._owner;if(e!=null){if(e.ref!==void 0&&(s=e.ref,o=Sl.current),e.key!==void 0&&(i=""+e.key),t.type&&t.type.defaultProps)var a=t.type.defaultProps;for(l in e)Yd.call(e,l)&&!Jd.hasOwnProperty(l)&&(r[l]=e[l]===void 0&&a!==void 0?a[l]:e[l])}var l=arguments.length-2;if(l===1)r.children=n;else if(1<l){a=Array(l);for(var u=0;u<l;u++)a[u]=arguments[u+2];r.children=a}return{$$typeof:yi,type:t.type,key:i,ref:s,props:r,_owner:o}};D.createContext=function(t){return t={$$typeof:Um,_currentValue:t,_currentValue2:t,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},t.Provider={$$typeof:jm,_context:t},t.Consumer=t};D.createElement=Xd;D.createFactory=function(t){var e=Xd.bind(null,t);return e.type=t,e};D.createRef=function(){return{current:null}};D.forwardRef=function(t){return{$$typeof:Fm,render:t}};D.isValidElement=Il;D.lazy=function(t){return{$$typeof:Bm,_payload:{_status:-1,_result:t},_init:Gm}};D.memo=function(t,e){return{$$typeof:$m,type:t,compare:e===void 0?null:e}};D.startTransition=function(t){var e=Xi.transition;Xi.transition={};try{t()}finally{Xi.transition=e}};D.unstable_act=function(){throw Error("act(...) is not supported in production builds of React.")};D.useCallback=function(t,e){return we.current.useCallback(t,e)};D.useContext=function(t){return we.current.useContext(t)};D.useDebugValue=function(){};D.useDeferredValue=function(t){return we.current.useDeferredValue(t)};D.useEffect=function(t,e){return we.current.useEffect(t,e)};D.useId=function(){return we.current.useId()};D.useImperativeHandle=function(t,e,n){return we.current.useImperativeHandle(t,e,n)};D.useInsertionEffect=function(t,e){return we.current.useInsertionEffect(t,e)};D.useLayoutEffect=function(t,e){return we.current.useLayoutEffect(t,e)};D.useMemo=function(t,e){return we.current.useMemo(t,e)};D.useReducer=function(t,e,n){return we.current.useReducer(t,e,n)};D.useRef=function(t){return we.current.useRef(t)};D.useState=function(t){return we.current.useState(t)};D.useSyncExternalStore=function(t,e,n){return we.current.useSyncExternalStore(t,e,n)};D.useTransition=function(){return we.current.useTransition()};D.version="18.2.0";Wd.exports=D;var F=Wd.exports;const pn=Dm(F);/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Qm=F,Ym=Symbol.for("react.element"),Jm=Symbol.for("react.fragment"),Xm=Object.prototype.hasOwnProperty,Zm=Qm.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,eg={key:!0,ref:!0,__self:!0,__source:!0};function Zd(t,e,n){var r,i={},s=null,o=null;n!==void 0&&(s=""+n),e.key!==void 0&&(s=""+e.key),e.ref!==void 0&&(o=e.ref);for(r in e)Xm.call(e,r)&&!eg.hasOwnProperty(r)&&(i[r]=e[r]);if(t&&t.defaultProps)for(r in e=t.defaultProps,e)i[r]===void 0&&(i[r]=e[r]);return{$$typeof:Ym,type:t,key:s,ref:o,props:i,_owner:Zm.current}}to.Fragment=Jm;to.jsx=Zd;to.jsxs=Zd;Hd.exports=to;var k=Hd.exports,fa={},ef={exports:{}},Me={},tf={exports:{}},nf={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */(function(t){function e(C,N){var x=C.length;C.push(N);e:for(;0<x;){var J=x-1>>>1,re=C[J];if(0<i(re,N))C[J]=N,C[x]=re,x=J;else break e}}function n(C){return C.length===0?null:C[0]}function r(C){if(C.length===0)return null;var N=C[0],x=C.pop();if(x!==N){C[0]=x;e:for(var J=0,re=C.length,Ai=re>>>1;J<Ai;){var sn=2*(J+1)-1,Ro=C[sn],on=sn+1,Ni=C[on];if(0>i(Ro,x))on<re&&0>i(Ni,Ro)?(C[J]=Ni,C[on]=x,J=on):(C[J]=Ro,C[sn]=x,J=sn);else if(on<re&&0>i(Ni,x))C[J]=Ni,C[on]=x,J=on;else break e}}return N}function i(C,N){var x=C.sortIndex-N.sortIndex;return x!==0?x:C.id-N.id}if(typeof performance=="object"&&typeof performance.now=="function"){var s=performance;t.unstable_now=function(){return s.now()}}else{var o=Date,a=o.now();t.unstable_now=function(){return o.now()-a}}var l=[],u=[],m=1,h=null,p=3,y=!1,w=!1,I=!1,j=typeof setTimeout=="function"?setTimeout:null,f=typeof clearTimeout=="function"?clearTimeout:null,c=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function d(C){for(var N=n(u);N!==null;){if(N.callback===null)r(u);else if(N.startTime<=C)r(u),N.sortIndex=N.expirationTime,e(l,N);else break;N=n(u)}}function g(C){if(I=!1,d(C),!w)if(n(l)!==null)w=!0,Po(_);else{var N=n(u);N!==null&&Co(g,N.startTime-C)}}function _(C,N){w=!1,I&&(I=!1,f(P),P=-1),y=!0;var x=p;try{for(d(N),h=n(l);h!==null&&(!(h.expirationTime>N)||C&&!oe());){var J=h.callback;if(typeof J=="function"){h.callback=null,p=h.priorityLevel;var re=J(h.expirationTime<=N);N=t.unstable_now(),typeof re=="function"?h.callback=re:h===n(l)&&r(l),d(N)}else r(l);h=n(l)}if(h!==null)var Ai=!0;else{var sn=n(u);sn!==null&&Co(g,sn.startTime-N),Ai=!1}return Ai}finally{h=null,p=x,y=!1}}var E=!1,S=null,P=-1,b=5,A=-1;function oe(){return!(t.unstable_now()-A<b)}function He(){if(S!==null){var C=t.unstable_now();A=C;var N=!0;try{N=S(!0,C)}finally{N?yr():(E=!1,S=null)}}else E=!1}var yr;if(typeof c=="function")yr=function(){c(He)};else if(typeof MessageChannel<"u"){var zu=new MessageChannel,Am=zu.port2;zu.port1.onmessage=He,yr=function(){Am.postMessage(null)}}else yr=function(){j(He,0)};function Po(C){S=C,E||(E=!0,yr())}function Co(C,N){P=j(function(){C(t.unstable_now())},N)}t.unstable_IdlePriority=5,t.unstable_ImmediatePriority=1,t.unstable_LowPriority=4,t.unstable_NormalPriority=3,t.unstable_Profiling=null,t.unstable_UserBlockingPriority=2,t.unstable_cancelCallback=function(C){C.callback=null},t.unstable_continueExecution=function(){w||y||(w=!0,Po(_))},t.unstable_forceFrameRate=function(C){0>C||125<C?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):b=0<C?Math.floor(1e3/C):5},t.unstable_getCurrentPriorityLevel=function(){return p},t.unstable_getFirstCallbackNode=function(){return n(l)},t.unstable_next=function(C){switch(p){case 1:case 2:case 3:var N=3;break;default:N=p}var x=p;p=N;try{return C()}finally{p=x}},t.unstable_pauseExecution=function(){},t.unstable_requestPaint=function(){},t.unstable_runWithPriority=function(C,N){switch(C){case 1:case 2:case 3:case 4:case 5:break;default:C=3}var x=p;p=C;try{return N()}finally{p=x}},t.unstable_scheduleCallback=function(C,N,x){var J=t.unstable_now();switch(typeof x=="object"&&x!==null?(x=x.delay,x=typeof x=="number"&&0<x?J+x:J):x=J,C){case 1:var re=-1;break;case 2:re=250;break;case 5:re=1073741823;break;case 4:re=1e4;break;default:re=5e3}return re=x+re,C={id:m++,callback:N,priorityLevel:C,startTime:x,expirationTime:re,sortIndex:-1},x>J?(C.sortIndex=x,e(u,C),n(l)===null&&C===n(u)&&(I?(f(P),P=-1):I=!0,Co(g,x-J))):(C.sortIndex=re,e(l,C),w||y||(w=!0,Po(_))),C},t.unstable_shouldYield=oe,t.unstable_wrapCallback=function(C){var N=p;return function(){var x=p;p=N;try{return C.apply(this,arguments)}finally{p=x}}}})(nf);tf.exports=nf;var tg=tf.exports;/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var rf=F,Le=tg;function v(t){for(var e="https://reactjs.org/docs/error-decoder.html?invariant="+t,n=1;n<arguments.length;n++)e+="&args[]="+encodeURIComponent(arguments[n]);return"Minified React error #"+t+"; visit "+e+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var sf=new Set,Gr={};function Cn(t,e){Xn(t,e),Xn(t+"Capture",e)}function Xn(t,e){for(Gr[t]=e,t=0;t<e.length;t++)sf.add(e[t])}var It=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),ha=Object.prototype.hasOwnProperty,ng=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,Wu={},Ku={};function rg(t){return ha.call(Ku,t)?!0:ha.call(Wu,t)?!1:ng.test(t)?Ku[t]=!0:(Wu[t]=!0,!1)}function ig(t,e,n,r){if(n!==null&&n.type===0)return!1;switch(typeof e){case"function":case"symbol":return!0;case"boolean":return r?!1:n!==null?!n.acceptsBooleans:(t=t.toLowerCase().slice(0,5),t!=="data-"&&t!=="aria-");default:return!1}}function sg(t,e,n,r){if(e===null||typeof e>"u"||ig(t,e,n,r))return!0;if(r)return!1;if(n!==null)switch(n.type){case 3:return!e;case 4:return e===!1;case 5:return isNaN(e);case 6:return isNaN(e)||1>e}return!1}function Ee(t,e,n,r,i,s,o){this.acceptsBooleans=e===2||e===3||e===4,this.attributeName=r,this.attributeNamespace=i,this.mustUseProperty=n,this.propertyName=t,this.type=e,this.sanitizeURL=s,this.removeEmptyString=o}var de={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(t){de[t]=new Ee(t,0,!1,t,null,!1,!1)});[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(t){var e=t[0];de[e]=new Ee(e,1,!1,t[1],null,!1,!1)});["contentEditable","draggable","spellCheck","value"].forEach(function(t){de[t]=new Ee(t,2,!1,t.toLowerCase(),null,!1,!1)});["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(t){de[t]=new Ee(t,2,!1,t,null,!1,!1)});"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(t){de[t]=new Ee(t,3,!1,t.toLowerCase(),null,!1,!1)});["checked","multiple","muted","selected"].forEach(function(t){de[t]=new Ee(t,3,!0,t,null,!1,!1)});["capture","download"].forEach(function(t){de[t]=new Ee(t,4,!1,t,null,!1,!1)});["cols","rows","size","span"].forEach(function(t){de[t]=new Ee(t,6,!1,t,null,!1,!1)});["rowSpan","start"].forEach(function(t){de[t]=new Ee(t,5,!1,t.toLowerCase(),null,!1,!1)});var Tl=/[\-:]([a-z])/g;function kl(t){return t[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(t){var e=t.replace(Tl,kl);de[e]=new Ee(e,1,!1,t,null,!1,!1)});"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(t){var e=t.replace(Tl,kl);de[e]=new Ee(e,1,!1,t,"http://www.w3.org/1999/xlink",!1,!1)});["xml:base","xml:lang","xml:space"].forEach(function(t){var e=t.replace(Tl,kl);de[e]=new Ee(e,1,!1,t,"http://www.w3.org/XML/1998/namespace",!1,!1)});["tabIndex","crossOrigin"].forEach(function(t){de[t]=new Ee(t,1,!1,t.toLowerCase(),null,!1,!1)});de.xlinkHref=new Ee("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1);["src","href","action","formAction"].forEach(function(t){de[t]=new Ee(t,1,!1,t.toLowerCase(),null,!0,!0)});function Pl(t,e,n,r){var i=de.hasOwnProperty(e)?de[e]:null;(i!==null?i.type!==0:r||!(2<e.length)||e[0]!=="o"&&e[0]!=="O"||e[1]!=="n"&&e[1]!=="N")&&(sg(e,n,i,r)&&(n=null),r||i===null?rg(e)&&(n===null?t.removeAttribute(e):t.setAttribute(e,""+n)):i.mustUseProperty?t[i.propertyName]=n===null?i.type===3?!1:"":n:(e=i.attributeName,r=i.attributeNamespace,n===null?t.removeAttribute(e):(i=i.type,n=i===3||i===4&&n===!0?"":""+n,r?t.setAttributeNS(r,e,n):t.setAttribute(e,n))))}var At=rf.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,xi=Symbol.for("react.element"),On=Symbol.for("react.portal"),xn=Symbol.for("react.fragment"),Cl=Symbol.for("react.strict_mode"),pa=Symbol.for("react.profiler"),of=Symbol.for("react.provider"),af=Symbol.for("react.context"),Rl=Symbol.for("react.forward_ref"),ma=Symbol.for("react.suspense"),ga=Symbol.for("react.suspense_list"),Al=Symbol.for("react.memo"),Dt=Symbol.for("react.lazy"),lf=Symbol.for("react.offscreen"),Gu=Symbol.iterator;function _r(t){return t===null||typeof t!="object"?null:(t=Gu&&t[Gu]||t["@@iterator"],typeof t=="function"?t:null)}var Q=Object.assign,No;function Rr(t){if(No===void 0)try{throw Error()}catch(n){var e=n.stack.trim().match(/\n( *(at )?)/);No=e&&e[1]||""}return`
`+No+t}var Oo=!1;function xo(t,e){if(!t||Oo)return"";Oo=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(e)if(e=function(){throw Error()},Object.defineProperty(e.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(e,[])}catch(u){var r=u}Reflect.construct(t,[],e)}else{try{e.call()}catch(u){r=u}t.call(e.prototype)}else{try{throw Error()}catch(u){r=u}t()}}catch(u){if(u&&r&&typeof u.stack=="string"){for(var i=u.stack.split(`
`),s=r.stack.split(`
`),o=i.length-1,a=s.length-1;1<=o&&0<=a&&i[o]!==s[a];)a--;for(;1<=o&&0<=a;o--,a--)if(i[o]!==s[a]){if(o!==1||a!==1)do if(o--,a--,0>a||i[o]!==s[a]){var l=`
`+i[o].replace(" at new "," at ");return t.displayName&&l.includes("<anonymous>")&&(l=l.replace("<anonymous>",t.displayName)),l}while(1<=o&&0<=a);break}}}finally{Oo=!1,Error.prepareStackTrace=n}return(t=t?t.displayName||t.name:"")?Rr(t):""}function og(t){switch(t.tag){case 5:return Rr(t.type);case 16:return Rr("Lazy");case 13:return Rr("Suspense");case 19:return Rr("SuspenseList");case 0:case 2:case 15:return t=xo(t.type,!1),t;case 11:return t=xo(t.type.render,!1),t;case 1:return t=xo(t.type,!0),t;default:return""}}function va(t){if(t==null)return null;if(typeof t=="function")return t.displayName||t.name||null;if(typeof t=="string")return t;switch(t){case xn:return"Fragment";case On:return"Portal";case pa:return"Profiler";case Cl:return"StrictMode";case ma:return"Suspense";case ga:return"SuspenseList"}if(typeof t=="object")switch(t.$$typeof){case af:return(t.displayName||"Context")+".Consumer";case of:return(t._context.displayName||"Context")+".Provider";case Rl:var e=t.render;return t=t.displayName,t||(t=e.displayName||e.name||"",t=t!==""?"ForwardRef("+t+")":"ForwardRef"),t;case Al:return e=t.displayName||null,e!==null?e:va(t.type)||"Memo";case Dt:e=t._payload,t=t._init;try{return va(t(e))}catch{}}return null}function ag(t){var e=t.type;switch(t.tag){case 24:return"Cache";case 9:return(e.displayName||"Context")+".Consumer";case 10:return(e._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return t=e.render,t=t.displayName||t.name||"",e.displayName||(t!==""?"ForwardRef("+t+")":"ForwardRef");case 7:return"Fragment";case 5:return e;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return va(e);case 8:return e===Cl?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e}return null}function Zt(t){switch(typeof t){case"boolean":case"number":case"string":case"undefined":return t;case"object":return t;default:return""}}function uf(t){var e=t.type;return(t=t.nodeName)&&t.toLowerCase()==="input"&&(e==="checkbox"||e==="radio")}function lg(t){var e=uf(t)?"checked":"value",n=Object.getOwnPropertyDescriptor(t.constructor.prototype,e),r=""+t[e];if(!t.hasOwnProperty(e)&&typeof n<"u"&&typeof n.get=="function"&&typeof n.set=="function"){var i=n.get,s=n.set;return Object.defineProperty(t,e,{configurable:!0,get:function(){return i.call(this)},set:function(o){r=""+o,s.call(this,o)}}),Object.defineProperty(t,e,{enumerable:n.enumerable}),{getValue:function(){return r},setValue:function(o){r=""+o},stopTracking:function(){t._valueTracker=null,delete t[e]}}}}function Di(t){t._valueTracker||(t._valueTracker=lg(t))}function cf(t){if(!t)return!1;var e=t._valueTracker;if(!e)return!0;var n=e.getValue(),r="";return t&&(r=uf(t)?t.checked?"true":"false":t.value),t=r,t!==n?(e.setValue(t),!0):!1}function hs(t){if(t=t||(typeof document<"u"?document:void 0),typeof t>"u")return null;try{return t.activeElement||t.body}catch{return t.body}}function ya(t,e){var n=e.checked;return Q({},e,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:n??t._wrapperState.initialChecked})}function qu(t,e){var n=e.defaultValue==null?"":e.defaultValue,r=e.checked!=null?e.checked:e.defaultChecked;n=Zt(e.value!=null?e.value:n),t._wrapperState={initialChecked:r,initialValue:n,controlled:e.type==="checkbox"||e.type==="radio"?e.checked!=null:e.value!=null}}function df(t,e){e=e.checked,e!=null&&Pl(t,"checked",e,!1)}function _a(t,e){df(t,e);var n=Zt(e.value),r=e.type;if(n!=null)r==="number"?(n===0&&t.value===""||t.value!=n)&&(t.value=""+n):t.value!==""+n&&(t.value=""+n);else if(r==="submit"||r==="reset"){t.removeAttribute("value");return}e.hasOwnProperty("value")?wa(t,e.type,n):e.hasOwnProperty("defaultValue")&&wa(t,e.type,Zt(e.defaultValue)),e.checked==null&&e.defaultChecked!=null&&(t.defaultChecked=!!e.defaultChecked)}function Qu(t,e,n){if(e.hasOwnProperty("value")||e.hasOwnProperty("defaultValue")){var r=e.type;if(!(r!=="submit"&&r!=="reset"||e.value!==void 0&&e.value!==null))return;e=""+t._wrapperState.initialValue,n||e===t.value||(t.value=e),t.defaultValue=e}n=t.name,n!==""&&(t.name=""),t.defaultChecked=!!t._wrapperState.initialChecked,n!==""&&(t.name=n)}function wa(t,e,n){(e!=="number"||hs(t.ownerDocument)!==t)&&(n==null?t.defaultValue=""+t._wrapperState.initialValue:t.defaultValue!==""+n&&(t.defaultValue=""+n))}var Ar=Array.isArray;function Bn(t,e,n,r){if(t=t.options,e){e={};for(var i=0;i<n.length;i++)e["$"+n[i]]=!0;for(n=0;n<t.length;n++)i=e.hasOwnProperty("$"+t[n].value),t[n].selected!==i&&(t[n].selected=i),i&&r&&(t[n].defaultSelected=!0)}else{for(n=""+Zt(n),e=null,i=0;i<t.length;i++){if(t[i].value===n){t[i].selected=!0,r&&(t[i].defaultSelected=!0);return}e!==null||t[i].disabled||(e=t[i])}e!==null&&(e.selected=!0)}}function Ea(t,e){if(e.dangerouslySetInnerHTML!=null)throw Error(v(91));return Q({},e,{value:void 0,defaultValue:void 0,children:""+t._wrapperState.initialValue})}function Yu(t,e){var n=e.value;if(n==null){if(n=e.children,e=e.defaultValue,n!=null){if(e!=null)throw Error(v(92));if(Ar(n)){if(1<n.length)throw Error(v(93));n=n[0]}e=n}e==null&&(e=""),n=e}t._wrapperState={initialValue:Zt(n)}}function ff(t,e){var n=Zt(e.value),r=Zt(e.defaultValue);n!=null&&(n=""+n,n!==t.value&&(t.value=n),e.defaultValue==null&&t.defaultValue!==n&&(t.defaultValue=n)),r!=null&&(t.defaultValue=""+r)}function Ju(t){var e=t.textContent;e===t._wrapperState.initialValue&&e!==""&&e!==null&&(t.value=e)}function hf(t){switch(t){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function Sa(t,e){return t==null||t==="http://www.w3.org/1999/xhtml"?hf(e):t==="http://www.w3.org/2000/svg"&&e==="foreignObject"?"http://www.w3.org/1999/xhtml":t}var Li,pf=function(t){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(e,n,r,i){MSApp.execUnsafeLocalFunction(function(){return t(e,n,r,i)})}:t}(function(t,e){if(t.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in t)t.innerHTML=e;else{for(Li=Li||document.createElement("div"),Li.innerHTML="<svg>"+e.valueOf().toString()+"</svg>",e=Li.firstChild;t.firstChild;)t.removeChild(t.firstChild);for(;e.firstChild;)t.appendChild(e.firstChild)}});function qr(t,e){if(e){var n=t.firstChild;if(n&&n===t.lastChild&&n.nodeType===3){n.nodeValue=e;return}}t.textContent=e}var xr={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},ug=["Webkit","ms","Moz","O"];Object.keys(xr).forEach(function(t){ug.forEach(function(e){e=e+t.charAt(0).toUpperCase()+t.substring(1),xr[e]=xr[t]})});function mf(t,e,n){return e==null||typeof e=="boolean"||e===""?"":n||typeof e!="number"||e===0||xr.hasOwnProperty(t)&&xr[t]?(""+e).trim():e+"px"}function gf(t,e){t=t.style;for(var n in e)if(e.hasOwnProperty(n)){var r=n.indexOf("--")===0,i=mf(n,e[n],r);n==="float"&&(n="cssFloat"),r?t.setProperty(n,i):t[n]=i}}var cg=Q({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function Ia(t,e){if(e){if(cg[t]&&(e.children!=null||e.dangerouslySetInnerHTML!=null))throw Error(v(137,t));if(e.dangerouslySetInnerHTML!=null){if(e.children!=null)throw Error(v(60));if(typeof e.dangerouslySetInnerHTML!="object"||!("__html"in e.dangerouslySetInnerHTML))throw Error(v(61))}if(e.style!=null&&typeof e.style!="object")throw Error(v(62))}}function Ta(t,e){if(t.indexOf("-")===-1)return typeof e.is=="string";switch(t){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var ka=null;function Nl(t){return t=t.target||t.srcElement||window,t.correspondingUseElement&&(t=t.correspondingUseElement),t.nodeType===3?t.parentNode:t}var Pa=null,Hn=null,Wn=null;function Xu(t){if(t=Ei(t)){if(typeof Pa!="function")throw Error(v(280));var e=t.stateNode;e&&(e=oo(e),Pa(t.stateNode,t.type,e))}}function vf(t){Hn?Wn?Wn.push(t):Wn=[t]:Hn=t}function yf(){if(Hn){var t=Hn,e=Wn;if(Wn=Hn=null,Xu(t),e)for(t=0;t<e.length;t++)Xu(e[t])}}function _f(t,e){return t(e)}function wf(){}var Do=!1;function Ef(t,e,n){if(Do)return t(e,n);Do=!0;try{return _f(t,e,n)}finally{Do=!1,(Hn!==null||Wn!==null)&&(wf(),yf())}}function Qr(t,e){var n=t.stateNode;if(n===null)return null;var r=oo(n);if(r===null)return null;n=r[e];e:switch(e){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(r=!r.disabled)||(t=t.type,r=!(t==="button"||t==="input"||t==="select"||t==="textarea")),t=!r;break e;default:t=!1}if(t)return null;if(n&&typeof n!="function")throw Error(v(231,e,typeof n));return n}var Ca=!1;if(It)try{var wr={};Object.defineProperty(wr,"passive",{get:function(){Ca=!0}}),window.addEventListener("test",wr,wr),window.removeEventListener("test",wr,wr)}catch{Ca=!1}function dg(t,e,n,r,i,s,o,a,l){var u=Array.prototype.slice.call(arguments,3);try{e.apply(n,u)}catch(m){this.onError(m)}}var Dr=!1,ps=null,ms=!1,Ra=null,fg={onError:function(t){Dr=!0,ps=t}};function hg(t,e,n,r,i,s,o,a,l){Dr=!1,ps=null,dg.apply(fg,arguments)}function pg(t,e,n,r,i,s,o,a,l){if(hg.apply(this,arguments),Dr){if(Dr){var u=ps;Dr=!1,ps=null}else throw Error(v(198));ms||(ms=!0,Ra=u)}}function Rn(t){var e=t,n=t;if(t.alternate)for(;e.return;)e=e.return;else{t=e;do e=t,e.flags&4098&&(n=e.return),t=e.return;while(t)}return e.tag===3?n:null}function Sf(t){if(t.tag===13){var e=t.memoizedState;if(e===null&&(t=t.alternate,t!==null&&(e=t.memoizedState)),e!==null)return e.dehydrated}return null}function Zu(t){if(Rn(t)!==t)throw Error(v(188))}function mg(t){var e=t.alternate;if(!e){if(e=Rn(t),e===null)throw Error(v(188));return e!==t?null:t}for(var n=t,r=e;;){var i=n.return;if(i===null)break;var s=i.alternate;if(s===null){if(r=i.return,r!==null){n=r;continue}break}if(i.child===s.child){for(s=i.child;s;){if(s===n)return Zu(i),t;if(s===r)return Zu(i),e;s=s.sibling}throw Error(v(188))}if(n.return!==r.return)n=i,r=s;else{for(var o=!1,a=i.child;a;){if(a===n){o=!0,n=i,r=s;break}if(a===r){o=!0,r=i,n=s;break}a=a.sibling}if(!o){for(a=s.child;a;){if(a===n){o=!0,n=s,r=i;break}if(a===r){o=!0,r=s,n=i;break}a=a.sibling}if(!o)throw Error(v(189))}}if(n.alternate!==r)throw Error(v(190))}if(n.tag!==3)throw Error(v(188));return n.stateNode.current===n?t:e}function If(t){return t=mg(t),t!==null?Tf(t):null}function Tf(t){if(t.tag===5||t.tag===6)return t;for(t=t.child;t!==null;){var e=Tf(t);if(e!==null)return e;t=t.sibling}return null}var kf=Le.unstable_scheduleCallback,ec=Le.unstable_cancelCallback,gg=Le.unstable_shouldYield,vg=Le.unstable_requestPaint,X=Le.unstable_now,yg=Le.unstable_getCurrentPriorityLevel,Ol=Le.unstable_ImmediatePriority,Pf=Le.unstable_UserBlockingPriority,gs=Le.unstable_NormalPriority,_g=Le.unstable_LowPriority,Cf=Le.unstable_IdlePriority,no=null,st=null;function wg(t){if(st&&typeof st.onCommitFiberRoot=="function")try{st.onCommitFiberRoot(no,t,void 0,(t.current.flags&128)===128)}catch{}}var Je=Math.clz32?Math.clz32:Ig,Eg=Math.log,Sg=Math.LN2;function Ig(t){return t>>>=0,t===0?32:31-(Eg(t)/Sg|0)|0}var Mi=64,bi=4194304;function Nr(t){switch(t&-t){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return t&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return t}}function vs(t,e){var n=t.pendingLanes;if(n===0)return 0;var r=0,i=t.suspendedLanes,s=t.pingedLanes,o=n&268435455;if(o!==0){var a=o&~i;a!==0?r=Nr(a):(s&=o,s!==0&&(r=Nr(s)))}else o=n&~i,o!==0?r=Nr(o):s!==0&&(r=Nr(s));if(r===0)return 0;if(e!==0&&e!==r&&!(e&i)&&(i=r&-r,s=e&-e,i>=s||i===16&&(s&4194240)!==0))return e;if(r&4&&(r|=n&16),e=t.entangledLanes,e!==0)for(t=t.entanglements,e&=r;0<e;)n=31-Je(e),i=1<<n,r|=t[n],e&=~i;return r}function Tg(t,e){switch(t){case 1:case 2:case 4:return e+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function kg(t,e){for(var n=t.suspendedLanes,r=t.pingedLanes,i=t.expirationTimes,s=t.pendingLanes;0<s;){var o=31-Je(s),a=1<<o,l=i[o];l===-1?(!(a&n)||a&r)&&(i[o]=Tg(a,e)):l<=e&&(t.expiredLanes|=a),s&=~a}}function Aa(t){return t=t.pendingLanes&-1073741825,t!==0?t:t&1073741824?1073741824:0}function Rf(){var t=Mi;return Mi<<=1,!(Mi&4194240)&&(Mi=64),t}function Lo(t){for(var e=[],n=0;31>n;n++)e.push(t);return e}function _i(t,e,n){t.pendingLanes|=e,e!==536870912&&(t.suspendedLanes=0,t.pingedLanes=0),t=t.eventTimes,e=31-Je(e),t[e]=n}function Pg(t,e){var n=t.pendingLanes&~e;t.pendingLanes=e,t.suspendedLanes=0,t.pingedLanes=0,t.expiredLanes&=e,t.mutableReadLanes&=e,t.entangledLanes&=e,e=t.entanglements;var r=t.eventTimes;for(t=t.expirationTimes;0<n;){var i=31-Je(n),s=1<<i;e[i]=0,r[i]=-1,t[i]=-1,n&=~s}}function xl(t,e){var n=t.entangledLanes|=e;for(t=t.entanglements;n;){var r=31-Je(n),i=1<<r;i&e|t[r]&e&&(t[r]|=e),n&=~i}}var z=0;function Af(t){return t&=-t,1<t?4<t?t&268435455?16:536870912:4:1}var Nf,Dl,Of,xf,Df,Na=!1,Vi=[],$t=null,Bt=null,Ht=null,Yr=new Map,Jr=new Map,Mt=[],Cg="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function tc(t,e){switch(t){case"focusin":case"focusout":$t=null;break;case"dragenter":case"dragleave":Bt=null;break;case"mouseover":case"mouseout":Ht=null;break;case"pointerover":case"pointerout":Yr.delete(e.pointerId);break;case"gotpointercapture":case"lostpointercapture":Jr.delete(e.pointerId)}}function Er(t,e,n,r,i,s){return t===null||t.nativeEvent!==s?(t={blockedOn:e,domEventName:n,eventSystemFlags:r,nativeEvent:s,targetContainers:[i]},e!==null&&(e=Ei(e),e!==null&&Dl(e)),t):(t.eventSystemFlags|=r,e=t.targetContainers,i!==null&&e.indexOf(i)===-1&&e.push(i),t)}function Rg(t,e,n,r,i){switch(e){case"focusin":return $t=Er($t,t,e,n,r,i),!0;case"dragenter":return Bt=Er(Bt,t,e,n,r,i),!0;case"mouseover":return Ht=Er(Ht,t,e,n,r,i),!0;case"pointerover":var s=i.pointerId;return Yr.set(s,Er(Yr.get(s)||null,t,e,n,r,i)),!0;case"gotpointercapture":return s=i.pointerId,Jr.set(s,Er(Jr.get(s)||null,t,e,n,r,i)),!0}return!1}function Lf(t){var e=cn(t.target);if(e!==null){var n=Rn(e);if(n!==null){if(e=n.tag,e===13){if(e=Sf(n),e!==null){t.blockedOn=e,Df(t.priority,function(){Of(n)});return}}else if(e===3&&n.stateNode.current.memoizedState.isDehydrated){t.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}t.blockedOn=null}function Zi(t){if(t.blockedOn!==null)return!1;for(var e=t.targetContainers;0<e.length;){var n=Oa(t.domEventName,t.eventSystemFlags,e[0],t.nativeEvent);if(n===null){n=t.nativeEvent;var r=new n.constructor(n.type,n);ka=r,n.target.dispatchEvent(r),ka=null}else return e=Ei(n),e!==null&&Dl(e),t.blockedOn=n,!1;e.shift()}return!0}function nc(t,e,n){Zi(t)&&n.delete(e)}function Ag(){Na=!1,$t!==null&&Zi($t)&&($t=null),Bt!==null&&Zi(Bt)&&(Bt=null),Ht!==null&&Zi(Ht)&&(Ht=null),Yr.forEach(nc),Jr.forEach(nc)}function Sr(t,e){t.blockedOn===e&&(t.blockedOn=null,Na||(Na=!0,Le.unstable_scheduleCallback(Le.unstable_NormalPriority,Ag)))}function Xr(t){function e(i){return Sr(i,t)}if(0<Vi.length){Sr(Vi[0],t);for(var n=1;n<Vi.length;n++){var r=Vi[n];r.blockedOn===t&&(r.blockedOn=null)}}for($t!==null&&Sr($t,t),Bt!==null&&Sr(Bt,t),Ht!==null&&Sr(Ht,t),Yr.forEach(e),Jr.forEach(e),n=0;n<Mt.length;n++)r=Mt[n],r.blockedOn===t&&(r.blockedOn=null);for(;0<Mt.length&&(n=Mt[0],n.blockedOn===null);)Lf(n),n.blockedOn===null&&Mt.shift()}var Kn=At.ReactCurrentBatchConfig,ys=!0;function Ng(t,e,n,r){var i=z,s=Kn.transition;Kn.transition=null;try{z=1,Ll(t,e,n,r)}finally{z=i,Kn.transition=s}}function Og(t,e,n,r){var i=z,s=Kn.transition;Kn.transition=null;try{z=4,Ll(t,e,n,r)}finally{z=i,Kn.transition=s}}function Ll(t,e,n,r){if(ys){var i=Oa(t,e,n,r);if(i===null)Ho(t,e,r,_s,n),tc(t,r);else if(Rg(i,t,e,n,r))r.stopPropagation();else if(tc(t,r),e&4&&-1<Cg.indexOf(t)){for(;i!==null;){var s=Ei(i);if(s!==null&&Nf(s),s=Oa(t,e,n,r),s===null&&Ho(t,e,r,_s,n),s===i)break;i=s}i!==null&&r.stopPropagation()}else Ho(t,e,r,null,n)}}var _s=null;function Oa(t,e,n,r){if(_s=null,t=Nl(r),t=cn(t),t!==null)if(e=Rn(t),e===null)t=null;else if(n=e.tag,n===13){if(t=Sf(e),t!==null)return t;t=null}else if(n===3){if(e.stateNode.current.memoizedState.isDehydrated)return e.tag===3?e.stateNode.containerInfo:null;t=null}else e!==t&&(t=null);return _s=t,null}function Mf(t){switch(t){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(yg()){case Ol:return 1;case Pf:return 4;case gs:case _g:return 16;case Cf:return 536870912;default:return 16}default:return 16}}var Ft=null,Ml=null,es=null;function bf(){if(es)return es;var t,e=Ml,n=e.length,r,i="value"in Ft?Ft.value:Ft.textContent,s=i.length;for(t=0;t<n&&e[t]===i[t];t++);var o=n-t;for(r=1;r<=o&&e[n-r]===i[s-r];r++);return es=i.slice(t,1<r?1-r:void 0)}function ts(t){var e=t.keyCode;return"charCode"in t?(t=t.charCode,t===0&&e===13&&(t=13)):t=e,t===10&&(t=13),32<=t||t===13?t:0}function ji(){return!0}function rc(){return!1}function be(t){function e(n,r,i,s,o){this._reactName=n,this._targetInst=i,this.type=r,this.nativeEvent=s,this.target=o,this.currentTarget=null;for(var a in t)t.hasOwnProperty(a)&&(n=t[a],this[a]=n?n(s):s[a]);return this.isDefaultPrevented=(s.defaultPrevented!=null?s.defaultPrevented:s.returnValue===!1)?ji:rc,this.isPropagationStopped=rc,this}return Q(e.prototype,{preventDefault:function(){this.defaultPrevented=!0;var n=this.nativeEvent;n&&(n.preventDefault?n.preventDefault():typeof n.returnValue!="unknown"&&(n.returnValue=!1),this.isDefaultPrevented=ji)},stopPropagation:function(){var n=this.nativeEvent;n&&(n.stopPropagation?n.stopPropagation():typeof n.cancelBubble!="unknown"&&(n.cancelBubble=!0),this.isPropagationStopped=ji)},persist:function(){},isPersistent:ji}),e}var dr={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(t){return t.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},bl=be(dr),wi=Q({},dr,{view:0,detail:0}),xg=be(wi),Mo,bo,Ir,ro=Q({},wi,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Vl,button:0,buttons:0,relatedTarget:function(t){return t.relatedTarget===void 0?t.fromElement===t.srcElement?t.toElement:t.fromElement:t.relatedTarget},movementX:function(t){return"movementX"in t?t.movementX:(t!==Ir&&(Ir&&t.type==="mousemove"?(Mo=t.screenX-Ir.screenX,bo=t.screenY-Ir.screenY):bo=Mo=0,Ir=t),Mo)},movementY:function(t){return"movementY"in t?t.movementY:bo}}),ic=be(ro),Dg=Q({},ro,{dataTransfer:0}),Lg=be(Dg),Mg=Q({},wi,{relatedTarget:0}),Vo=be(Mg),bg=Q({},dr,{animationName:0,elapsedTime:0,pseudoElement:0}),Vg=be(bg),jg=Q({},dr,{clipboardData:function(t){return"clipboardData"in t?t.clipboardData:window.clipboardData}}),Ug=be(jg),Fg=Q({},dr,{data:0}),sc=be(Fg),zg={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},$g={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},Bg={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function Hg(t){var e=this.nativeEvent;return e.getModifierState?e.getModifierState(t):(t=Bg[t])?!!e[t]:!1}function Vl(){return Hg}var Wg=Q({},wi,{key:function(t){if(t.key){var e=zg[t.key]||t.key;if(e!=="Unidentified")return e}return t.type==="keypress"?(t=ts(t),t===13?"Enter":String.fromCharCode(t)):t.type==="keydown"||t.type==="keyup"?$g[t.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Vl,charCode:function(t){return t.type==="keypress"?ts(t):0},keyCode:function(t){return t.type==="keydown"||t.type==="keyup"?t.keyCode:0},which:function(t){return t.type==="keypress"?ts(t):t.type==="keydown"||t.type==="keyup"?t.keyCode:0}}),Kg=be(Wg),Gg=Q({},ro,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),oc=be(Gg),qg=Q({},wi,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Vl}),Qg=be(qg),Yg=Q({},dr,{propertyName:0,elapsedTime:0,pseudoElement:0}),Jg=be(Yg),Xg=Q({},ro,{deltaX:function(t){return"deltaX"in t?t.deltaX:"wheelDeltaX"in t?-t.wheelDeltaX:0},deltaY:function(t){return"deltaY"in t?t.deltaY:"wheelDeltaY"in t?-t.wheelDeltaY:"wheelDelta"in t?-t.wheelDelta:0},deltaZ:0,deltaMode:0}),Zg=be(Xg),ev=[9,13,27,32],jl=It&&"CompositionEvent"in window,Lr=null;It&&"documentMode"in document&&(Lr=document.documentMode);var tv=It&&"TextEvent"in window&&!Lr,Vf=It&&(!jl||Lr&&8<Lr&&11>=Lr),ac=" ",lc=!1;function jf(t,e){switch(t){case"keyup":return ev.indexOf(e.keyCode)!==-1;case"keydown":return e.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function Uf(t){return t=t.detail,typeof t=="object"&&"data"in t?t.data:null}var Dn=!1;function nv(t,e){switch(t){case"compositionend":return Uf(e);case"keypress":return e.which!==32?null:(lc=!0,ac);case"textInput":return t=e.data,t===ac&&lc?null:t;default:return null}}function rv(t,e){if(Dn)return t==="compositionend"||!jl&&jf(t,e)?(t=bf(),es=Ml=Ft=null,Dn=!1,t):null;switch(t){case"paste":return null;case"keypress":if(!(e.ctrlKey||e.altKey||e.metaKey)||e.ctrlKey&&e.altKey){if(e.char&&1<e.char.length)return e.char;if(e.which)return String.fromCharCode(e.which)}return null;case"compositionend":return Vf&&e.locale!=="ko"?null:e.data;default:return null}}var iv={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function uc(t){var e=t&&t.nodeName&&t.nodeName.toLowerCase();return e==="input"?!!iv[t.type]:e==="textarea"}function Ff(t,e,n,r){vf(r),e=ws(e,"onChange"),0<e.length&&(n=new bl("onChange","change",null,n,r),t.push({event:n,listeners:e}))}var Mr=null,Zr=null;function sv(t){Jf(t,0)}function io(t){var e=bn(t);if(cf(e))return t}function ov(t,e){if(t==="change")return e}var zf=!1;if(It){var jo;if(It){var Uo="oninput"in document;if(!Uo){var cc=document.createElement("div");cc.setAttribute("oninput","return;"),Uo=typeof cc.oninput=="function"}jo=Uo}else jo=!1;zf=jo&&(!document.documentMode||9<document.documentMode)}function dc(){Mr&&(Mr.detachEvent("onpropertychange",$f),Zr=Mr=null)}function $f(t){if(t.propertyName==="value"&&io(Zr)){var e=[];Ff(e,Zr,t,Nl(t)),Ef(sv,e)}}function av(t,e,n){t==="focusin"?(dc(),Mr=e,Zr=n,Mr.attachEvent("onpropertychange",$f)):t==="focusout"&&dc()}function lv(t){if(t==="selectionchange"||t==="keyup"||t==="keydown")return io(Zr)}function uv(t,e){if(t==="click")return io(e)}function cv(t,e){if(t==="input"||t==="change")return io(e)}function dv(t,e){return t===e&&(t!==0||1/t===1/e)||t!==t&&e!==e}var et=typeof Object.is=="function"?Object.is:dv;function ei(t,e){if(et(t,e))return!0;if(typeof t!="object"||t===null||typeof e!="object"||e===null)return!1;var n=Object.keys(t),r=Object.keys(e);if(n.length!==r.length)return!1;for(r=0;r<n.length;r++){var i=n[r];if(!ha.call(e,i)||!et(t[i],e[i]))return!1}return!0}function fc(t){for(;t&&t.firstChild;)t=t.firstChild;return t}function hc(t,e){var n=fc(t);t=0;for(var r;n;){if(n.nodeType===3){if(r=t+n.textContent.length,t<=e&&r>=e)return{node:n,offset:e-t};t=r}e:{for(;n;){if(n.nextSibling){n=n.nextSibling;break e}n=n.parentNode}n=void 0}n=fc(n)}}function Bf(t,e){return t&&e?t===e?!0:t&&t.nodeType===3?!1:e&&e.nodeType===3?Bf(t,e.parentNode):"contains"in t?t.contains(e):t.compareDocumentPosition?!!(t.compareDocumentPosition(e)&16):!1:!1}function Hf(){for(var t=window,e=hs();e instanceof t.HTMLIFrameElement;){try{var n=typeof e.contentWindow.location.href=="string"}catch{n=!1}if(n)t=e.contentWindow;else break;e=hs(t.document)}return e}function Ul(t){var e=t&&t.nodeName&&t.nodeName.toLowerCase();return e&&(e==="input"&&(t.type==="text"||t.type==="search"||t.type==="tel"||t.type==="url"||t.type==="password")||e==="textarea"||t.contentEditable==="true")}function fv(t){var e=Hf(),n=t.focusedElem,r=t.selectionRange;if(e!==n&&n&&n.ownerDocument&&Bf(n.ownerDocument.documentElement,n)){if(r!==null&&Ul(n)){if(e=r.start,t=r.end,t===void 0&&(t=e),"selectionStart"in n)n.selectionStart=e,n.selectionEnd=Math.min(t,n.value.length);else if(t=(e=n.ownerDocument||document)&&e.defaultView||window,t.getSelection){t=t.getSelection();var i=n.textContent.length,s=Math.min(r.start,i);r=r.end===void 0?s:Math.min(r.end,i),!t.extend&&s>r&&(i=r,r=s,s=i),i=hc(n,s);var o=hc(n,r);i&&o&&(t.rangeCount!==1||t.anchorNode!==i.node||t.anchorOffset!==i.offset||t.focusNode!==o.node||t.focusOffset!==o.offset)&&(e=e.createRange(),e.setStart(i.node,i.offset),t.removeAllRanges(),s>r?(t.addRange(e),t.extend(o.node,o.offset)):(e.setEnd(o.node,o.offset),t.addRange(e)))}}for(e=[],t=n;t=t.parentNode;)t.nodeType===1&&e.push({element:t,left:t.scrollLeft,top:t.scrollTop});for(typeof n.focus=="function"&&n.focus(),n=0;n<e.length;n++)t=e[n],t.element.scrollLeft=t.left,t.element.scrollTop=t.top}}var hv=It&&"documentMode"in document&&11>=document.documentMode,Ln=null,xa=null,br=null,Da=!1;function pc(t,e,n){var r=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;Da||Ln==null||Ln!==hs(r)||(r=Ln,"selectionStart"in r&&Ul(r)?r={start:r.selectionStart,end:r.selectionEnd}:(r=(r.ownerDocument&&r.ownerDocument.defaultView||window).getSelection(),r={anchorNode:r.anchorNode,anchorOffset:r.anchorOffset,focusNode:r.focusNode,focusOffset:r.focusOffset}),br&&ei(br,r)||(br=r,r=ws(xa,"onSelect"),0<r.length&&(e=new bl("onSelect","select",null,e,n),t.push({event:e,listeners:r}),e.target=Ln)))}function Ui(t,e){var n={};return n[t.toLowerCase()]=e.toLowerCase(),n["Webkit"+t]="webkit"+e,n["Moz"+t]="moz"+e,n}var Mn={animationend:Ui("Animation","AnimationEnd"),animationiteration:Ui("Animation","AnimationIteration"),animationstart:Ui("Animation","AnimationStart"),transitionend:Ui("Transition","TransitionEnd")},Fo={},Wf={};It&&(Wf=document.createElement("div").style,"AnimationEvent"in window||(delete Mn.animationend.animation,delete Mn.animationiteration.animation,delete Mn.animationstart.animation),"TransitionEvent"in window||delete Mn.transitionend.transition);function so(t){if(Fo[t])return Fo[t];if(!Mn[t])return t;var e=Mn[t],n;for(n in e)if(e.hasOwnProperty(n)&&n in Wf)return Fo[t]=e[n];return t}var Kf=so("animationend"),Gf=so("animationiteration"),qf=so("animationstart"),Qf=so("transitionend"),Yf=new Map,mc="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function tn(t,e){Yf.set(t,e),Cn(e,[t])}for(var zo=0;zo<mc.length;zo++){var $o=mc[zo],pv=$o.toLowerCase(),mv=$o[0].toUpperCase()+$o.slice(1);tn(pv,"on"+mv)}tn(Kf,"onAnimationEnd");tn(Gf,"onAnimationIteration");tn(qf,"onAnimationStart");tn("dblclick","onDoubleClick");tn("focusin","onFocus");tn("focusout","onBlur");tn(Qf,"onTransitionEnd");Xn("onMouseEnter",["mouseout","mouseover"]);Xn("onMouseLeave",["mouseout","mouseover"]);Xn("onPointerEnter",["pointerout","pointerover"]);Xn("onPointerLeave",["pointerout","pointerover"]);Cn("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));Cn("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));Cn("onBeforeInput",["compositionend","keypress","textInput","paste"]);Cn("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));Cn("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));Cn("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var Or="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),gv=new Set("cancel close invalid load scroll toggle".split(" ").concat(Or));function gc(t,e,n){var r=t.type||"unknown-event";t.currentTarget=n,pg(r,e,void 0,t),t.currentTarget=null}function Jf(t,e){e=(e&4)!==0;for(var n=0;n<t.length;n++){var r=t[n],i=r.event;r=r.listeners;e:{var s=void 0;if(e)for(var o=r.length-1;0<=o;o--){var a=r[o],l=a.instance,u=a.currentTarget;if(a=a.listener,l!==s&&i.isPropagationStopped())break e;gc(i,a,u),s=l}else for(o=0;o<r.length;o++){if(a=r[o],l=a.instance,u=a.currentTarget,a=a.listener,l!==s&&i.isPropagationStopped())break e;gc(i,a,u),s=l}}}if(ms)throw t=Ra,ms=!1,Ra=null,t}function B(t,e){var n=e[ja];n===void 0&&(n=e[ja]=new Set);var r=t+"__bubble";n.has(r)||(Xf(e,t,2,!1),n.add(r))}function Bo(t,e,n){var r=0;e&&(r|=4),Xf(n,t,r,e)}var Fi="_reactListening"+Math.random().toString(36).slice(2);function ti(t){if(!t[Fi]){t[Fi]=!0,sf.forEach(function(n){n!=="selectionchange"&&(gv.has(n)||Bo(n,!1,t),Bo(n,!0,t))});var e=t.nodeType===9?t:t.ownerDocument;e===null||e[Fi]||(e[Fi]=!0,Bo("selectionchange",!1,e))}}function Xf(t,e,n,r){switch(Mf(e)){case 1:var i=Ng;break;case 4:i=Og;break;default:i=Ll}n=i.bind(null,e,n,t),i=void 0,!Ca||e!=="touchstart"&&e!=="touchmove"&&e!=="wheel"||(i=!0),r?i!==void 0?t.addEventListener(e,n,{capture:!0,passive:i}):t.addEventListener(e,n,!0):i!==void 0?t.addEventListener(e,n,{passive:i}):t.addEventListener(e,n,!1)}function Ho(t,e,n,r,i){var s=r;if(!(e&1)&&!(e&2)&&r!==null)e:for(;;){if(r===null)return;var o=r.tag;if(o===3||o===4){var a=r.stateNode.containerInfo;if(a===i||a.nodeType===8&&a.parentNode===i)break;if(o===4)for(o=r.return;o!==null;){var l=o.tag;if((l===3||l===4)&&(l=o.stateNode.containerInfo,l===i||l.nodeType===8&&l.parentNode===i))return;o=o.return}for(;a!==null;){if(o=cn(a),o===null)return;if(l=o.tag,l===5||l===6){r=s=o;continue e}a=a.parentNode}}r=r.return}Ef(function(){var u=s,m=Nl(n),h=[];e:{var p=Yf.get(t);if(p!==void 0){var y=bl,w=t;switch(t){case"keypress":if(ts(n)===0)break e;case"keydown":case"keyup":y=Kg;break;case"focusin":w="focus",y=Vo;break;case"focusout":w="blur",y=Vo;break;case"beforeblur":case"afterblur":y=Vo;break;case"click":if(n.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":y=ic;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":y=Lg;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":y=Qg;break;case Kf:case Gf:case qf:y=Vg;break;case Qf:y=Jg;break;case"scroll":y=xg;break;case"wheel":y=Zg;break;case"copy":case"cut":case"paste":y=Ug;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":y=oc}var I=(e&4)!==0,j=!I&&t==="scroll",f=I?p!==null?p+"Capture":null:p;I=[];for(var c=u,d;c!==null;){d=c;var g=d.stateNode;if(d.tag===5&&g!==null&&(d=g,f!==null&&(g=Qr(c,f),g!=null&&I.push(ni(c,g,d)))),j)break;c=c.return}0<I.length&&(p=new y(p,w,null,n,m),h.push({event:p,listeners:I}))}}if(!(e&7)){e:{if(p=t==="mouseover"||t==="pointerover",y=t==="mouseout"||t==="pointerout",p&&n!==ka&&(w=n.relatedTarget||n.fromElement)&&(cn(w)||w[Tt]))break e;if((y||p)&&(p=m.window===m?m:(p=m.ownerDocument)?p.defaultView||p.parentWindow:window,y?(w=n.relatedTarget||n.toElement,y=u,w=w?cn(w):null,w!==null&&(j=Rn(w),w!==j||w.tag!==5&&w.tag!==6)&&(w=null)):(y=null,w=u),y!==w)){if(I=ic,g="onMouseLeave",f="onMouseEnter",c="mouse",(t==="pointerout"||t==="pointerover")&&(I=oc,g="onPointerLeave",f="onPointerEnter",c="pointer"),j=y==null?p:bn(y),d=w==null?p:bn(w),p=new I(g,c+"leave",y,n,m),p.target=j,p.relatedTarget=d,g=null,cn(m)===u&&(I=new I(f,c+"enter",w,n,m),I.target=d,I.relatedTarget=j,g=I),j=g,y&&w)t:{for(I=y,f=w,c=0,d=I;d;d=Nn(d))c++;for(d=0,g=f;g;g=Nn(g))d++;for(;0<c-d;)I=Nn(I),c--;for(;0<d-c;)f=Nn(f),d--;for(;c--;){if(I===f||f!==null&&I===f.alternate)break t;I=Nn(I),f=Nn(f)}I=null}else I=null;y!==null&&vc(h,p,y,I,!1),w!==null&&j!==null&&vc(h,j,w,I,!0)}}e:{if(p=u?bn(u):window,y=p.nodeName&&p.nodeName.toLowerCase(),y==="select"||y==="input"&&p.type==="file")var _=ov;else if(uc(p))if(zf)_=cv;else{_=lv;var E=av}else(y=p.nodeName)&&y.toLowerCase()==="input"&&(p.type==="checkbox"||p.type==="radio")&&(_=uv);if(_&&(_=_(t,u))){Ff(h,_,n,m);break e}E&&E(t,p,u),t==="focusout"&&(E=p._wrapperState)&&E.controlled&&p.type==="number"&&wa(p,"number",p.value)}switch(E=u?bn(u):window,t){case"focusin":(uc(E)||E.contentEditable==="true")&&(Ln=E,xa=u,br=null);break;case"focusout":br=xa=Ln=null;break;case"mousedown":Da=!0;break;case"contextmenu":case"mouseup":case"dragend":Da=!1,pc(h,n,m);break;case"selectionchange":if(hv)break;case"keydown":case"keyup":pc(h,n,m)}var S;if(jl)e:{switch(t){case"compositionstart":var P="onCompositionStart";break e;case"compositionend":P="onCompositionEnd";break e;case"compositionupdate":P="onCompositionUpdate";break e}P=void 0}else Dn?jf(t,n)&&(P="onCompositionEnd"):t==="keydown"&&n.keyCode===229&&(P="onCompositionStart");P&&(Vf&&n.locale!=="ko"&&(Dn||P!=="onCompositionStart"?P==="onCompositionEnd"&&Dn&&(S=bf()):(Ft=m,Ml="value"in Ft?Ft.value:Ft.textContent,Dn=!0)),E=ws(u,P),0<E.length&&(P=new sc(P,t,null,n,m),h.push({event:P,listeners:E}),S?P.data=S:(S=Uf(n),S!==null&&(P.data=S)))),(S=tv?nv(t,n):rv(t,n))&&(u=ws(u,"onBeforeInput"),0<u.length&&(m=new sc("onBeforeInput","beforeinput",null,n,m),h.push({event:m,listeners:u}),m.data=S))}Jf(h,e)})}function ni(t,e,n){return{instance:t,listener:e,currentTarget:n}}function ws(t,e){for(var n=e+"Capture",r=[];t!==null;){var i=t,s=i.stateNode;i.tag===5&&s!==null&&(i=s,s=Qr(t,n),s!=null&&r.unshift(ni(t,s,i)),s=Qr(t,e),s!=null&&r.push(ni(t,s,i))),t=t.return}return r}function Nn(t){if(t===null)return null;do t=t.return;while(t&&t.tag!==5);return t||null}function vc(t,e,n,r,i){for(var s=e._reactName,o=[];n!==null&&n!==r;){var a=n,l=a.alternate,u=a.stateNode;if(l!==null&&l===r)break;a.tag===5&&u!==null&&(a=u,i?(l=Qr(n,s),l!=null&&o.unshift(ni(n,l,a))):i||(l=Qr(n,s),l!=null&&o.push(ni(n,l,a)))),n=n.return}o.length!==0&&t.push({event:e,listeners:o})}var vv=/\r\n?/g,yv=/\u0000|\uFFFD/g;function yc(t){return(typeof t=="string"?t:""+t).replace(vv,`
`).replace(yv,"")}function zi(t,e,n){if(e=yc(e),yc(t)!==e&&n)throw Error(v(425))}function Es(){}var La=null,Ma=null;function ba(t,e){return t==="textarea"||t==="noscript"||typeof e.children=="string"||typeof e.children=="number"||typeof e.dangerouslySetInnerHTML=="object"&&e.dangerouslySetInnerHTML!==null&&e.dangerouslySetInnerHTML.__html!=null}var Va=typeof setTimeout=="function"?setTimeout:void 0,_v=typeof clearTimeout=="function"?clearTimeout:void 0,_c=typeof Promise=="function"?Promise:void 0,wv=typeof queueMicrotask=="function"?queueMicrotask:typeof _c<"u"?function(t){return _c.resolve(null).then(t).catch(Ev)}:Va;function Ev(t){setTimeout(function(){throw t})}function Wo(t,e){var n=e,r=0;do{var i=n.nextSibling;if(t.removeChild(n),i&&i.nodeType===8)if(n=i.data,n==="/$"){if(r===0){t.removeChild(i),Xr(e);return}r--}else n!=="$"&&n!=="$?"&&n!=="$!"||r++;n=i}while(n);Xr(e)}function Wt(t){for(;t!=null;t=t.nextSibling){var e=t.nodeType;if(e===1||e===3)break;if(e===8){if(e=t.data,e==="$"||e==="$!"||e==="$?")break;if(e==="/$")return null}}return t}function wc(t){t=t.previousSibling;for(var e=0;t;){if(t.nodeType===8){var n=t.data;if(n==="$"||n==="$!"||n==="$?"){if(e===0)return t;e--}else n==="/$"&&e++}t=t.previousSibling}return null}var fr=Math.random().toString(36).slice(2),rt="__reactFiber$"+fr,ri="__reactProps$"+fr,Tt="__reactContainer$"+fr,ja="__reactEvents$"+fr,Sv="__reactListeners$"+fr,Iv="__reactHandles$"+fr;function cn(t){var e=t[rt];if(e)return e;for(var n=t.parentNode;n;){if(e=n[Tt]||n[rt]){if(n=e.alternate,e.child!==null||n!==null&&n.child!==null)for(t=wc(t);t!==null;){if(n=t[rt])return n;t=wc(t)}return e}t=n,n=t.parentNode}return null}function Ei(t){return t=t[rt]||t[Tt],!t||t.tag!==5&&t.tag!==6&&t.tag!==13&&t.tag!==3?null:t}function bn(t){if(t.tag===5||t.tag===6)return t.stateNode;throw Error(v(33))}function oo(t){return t[ri]||null}var Ua=[],Vn=-1;function nn(t){return{current:t}}function W(t){0>Vn||(t.current=Ua[Vn],Ua[Vn]=null,Vn--)}function $(t,e){Vn++,Ua[Vn]=t.current,t.current=e}var en={},ge=nn(en),ke=nn(!1),_n=en;function Zn(t,e){var n=t.type.contextTypes;if(!n)return en;var r=t.stateNode;if(r&&r.__reactInternalMemoizedUnmaskedChildContext===e)return r.__reactInternalMemoizedMaskedChildContext;var i={},s;for(s in n)i[s]=e[s];return r&&(t=t.stateNode,t.__reactInternalMemoizedUnmaskedChildContext=e,t.__reactInternalMemoizedMaskedChildContext=i),i}function Pe(t){return t=t.childContextTypes,t!=null}function Ss(){W(ke),W(ge)}function Ec(t,e,n){if(ge.current!==en)throw Error(v(168));$(ge,e),$(ke,n)}function Zf(t,e,n){var r=t.stateNode;if(e=e.childContextTypes,typeof r.getChildContext!="function")return n;r=r.getChildContext();for(var i in r)if(!(i in e))throw Error(v(108,ag(t)||"Unknown",i));return Q({},n,r)}function Is(t){return t=(t=t.stateNode)&&t.__reactInternalMemoizedMergedChildContext||en,_n=ge.current,$(ge,t),$(ke,ke.current),!0}function Sc(t,e,n){var r=t.stateNode;if(!r)throw Error(v(169));n?(t=Zf(t,e,_n),r.__reactInternalMemoizedMergedChildContext=t,W(ke),W(ge),$(ge,t)):W(ke),$(ke,n)}var dt=null,ao=!1,Ko=!1;function eh(t){dt===null?dt=[t]:dt.push(t)}function Tv(t){ao=!0,eh(t)}function rn(){if(!Ko&&dt!==null){Ko=!0;var t=0,e=z;try{var n=dt;for(z=1;t<n.length;t++){var r=n[t];do r=r(!0);while(r!==null)}dt=null,ao=!1}catch(i){throw dt!==null&&(dt=dt.slice(t+1)),kf(Ol,rn),i}finally{z=e,Ko=!1}}return null}var jn=[],Un=0,Ts=null,ks=0,Ve=[],je=0,wn=null,pt=1,mt="";function an(t,e){jn[Un++]=ks,jn[Un++]=Ts,Ts=t,ks=e}function th(t,e,n){Ve[je++]=pt,Ve[je++]=mt,Ve[je++]=wn,wn=t;var r=pt;t=mt;var i=32-Je(r)-1;r&=~(1<<i),n+=1;var s=32-Je(e)+i;if(30<s){var o=i-i%5;s=(r&(1<<o)-1).toString(32),r>>=o,i-=o,pt=1<<32-Je(e)+i|n<<i|r,mt=s+t}else pt=1<<s|n<<i|r,mt=t}function Fl(t){t.return!==null&&(an(t,1),th(t,1,0))}function zl(t){for(;t===Ts;)Ts=jn[--Un],jn[Un]=null,ks=jn[--Un],jn[Un]=null;for(;t===wn;)wn=Ve[--je],Ve[je]=null,mt=Ve[--je],Ve[je]=null,pt=Ve[--je],Ve[je]=null}var Oe=null,Ne=null,K=!1,qe=null;function nh(t,e){var n=Ue(5,null,null,0);n.elementType="DELETED",n.stateNode=e,n.return=t,e=t.deletions,e===null?(t.deletions=[n],t.flags|=16):e.push(n)}function Ic(t,e){switch(t.tag){case 5:var n=t.type;return e=e.nodeType!==1||n.toLowerCase()!==e.nodeName.toLowerCase()?null:e,e!==null?(t.stateNode=e,Oe=t,Ne=Wt(e.firstChild),!0):!1;case 6:return e=t.pendingProps===""||e.nodeType!==3?null:e,e!==null?(t.stateNode=e,Oe=t,Ne=null,!0):!1;case 13:return e=e.nodeType!==8?null:e,e!==null?(n=wn!==null?{id:pt,overflow:mt}:null,t.memoizedState={dehydrated:e,treeContext:n,retryLane:1073741824},n=Ue(18,null,null,0),n.stateNode=e,n.return=t,t.child=n,Oe=t,Ne=null,!0):!1;default:return!1}}function Fa(t){return(t.mode&1)!==0&&(t.flags&128)===0}function za(t){if(K){var e=Ne;if(e){var n=e;if(!Ic(t,e)){if(Fa(t))throw Error(v(418));e=Wt(n.nextSibling);var r=Oe;e&&Ic(t,e)?nh(r,n):(t.flags=t.flags&-4097|2,K=!1,Oe=t)}}else{if(Fa(t))throw Error(v(418));t.flags=t.flags&-4097|2,K=!1,Oe=t}}}function Tc(t){for(t=t.return;t!==null&&t.tag!==5&&t.tag!==3&&t.tag!==13;)t=t.return;Oe=t}function $i(t){if(t!==Oe)return!1;if(!K)return Tc(t),K=!0,!1;var e;if((e=t.tag!==3)&&!(e=t.tag!==5)&&(e=t.type,e=e!=="head"&&e!=="body"&&!ba(t.type,t.memoizedProps)),e&&(e=Ne)){if(Fa(t))throw rh(),Error(v(418));for(;e;)nh(t,e),e=Wt(e.nextSibling)}if(Tc(t),t.tag===13){if(t=t.memoizedState,t=t!==null?t.dehydrated:null,!t)throw Error(v(317));e:{for(t=t.nextSibling,e=0;t;){if(t.nodeType===8){var n=t.data;if(n==="/$"){if(e===0){Ne=Wt(t.nextSibling);break e}e--}else n!=="$"&&n!=="$!"&&n!=="$?"||e++}t=t.nextSibling}Ne=null}}else Ne=Oe?Wt(t.stateNode.nextSibling):null;return!0}function rh(){for(var t=Ne;t;)t=Wt(t.nextSibling)}function er(){Ne=Oe=null,K=!1}function $l(t){qe===null?qe=[t]:qe.push(t)}var kv=At.ReactCurrentBatchConfig;function Ke(t,e){if(t&&t.defaultProps){e=Q({},e),t=t.defaultProps;for(var n in t)e[n]===void 0&&(e[n]=t[n]);return e}return e}var Ps=nn(null),Cs=null,Fn=null,Bl=null;function Hl(){Bl=Fn=Cs=null}function Wl(t){var e=Ps.current;W(Ps),t._currentValue=e}function $a(t,e,n){for(;t!==null;){var r=t.alternate;if((t.childLanes&e)!==e?(t.childLanes|=e,r!==null&&(r.childLanes|=e)):r!==null&&(r.childLanes&e)!==e&&(r.childLanes|=e),t===n)break;t=t.return}}function Gn(t,e){Cs=t,Bl=Fn=null,t=t.dependencies,t!==null&&t.firstContext!==null&&(t.lanes&e&&(Te=!0),t.firstContext=null)}function $e(t){var e=t._currentValue;if(Bl!==t)if(t={context:t,memoizedValue:e,next:null},Fn===null){if(Cs===null)throw Error(v(308));Fn=t,Cs.dependencies={lanes:0,firstContext:t}}else Fn=Fn.next=t;return e}var dn=null;function Kl(t){dn===null?dn=[t]:dn.push(t)}function ih(t,e,n,r){var i=e.interleaved;return i===null?(n.next=n,Kl(e)):(n.next=i.next,i.next=n),e.interleaved=n,kt(t,r)}function kt(t,e){t.lanes|=e;var n=t.alternate;for(n!==null&&(n.lanes|=e),n=t,t=t.return;t!==null;)t.childLanes|=e,n=t.alternate,n!==null&&(n.childLanes|=e),n=t,t=t.return;return n.tag===3?n.stateNode:null}var Lt=!1;function Gl(t){t.updateQueue={baseState:t.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function sh(t,e){t=t.updateQueue,e.updateQueue===t&&(e.updateQueue={baseState:t.baseState,firstBaseUpdate:t.firstBaseUpdate,lastBaseUpdate:t.lastBaseUpdate,shared:t.shared,effects:t.effects})}function St(t,e){return{eventTime:t,lane:e,tag:0,payload:null,callback:null,next:null}}function Kt(t,e,n){var r=t.updateQueue;if(r===null)return null;if(r=r.shared,M&2){var i=r.pending;return i===null?e.next=e:(e.next=i.next,i.next=e),r.pending=e,kt(t,n)}return i=r.interleaved,i===null?(e.next=e,Kl(r)):(e.next=i.next,i.next=e),r.interleaved=e,kt(t,n)}function ns(t,e,n){if(e=e.updateQueue,e!==null&&(e=e.shared,(n&4194240)!==0)){var r=e.lanes;r&=t.pendingLanes,n|=r,e.lanes=n,xl(t,n)}}function kc(t,e){var n=t.updateQueue,r=t.alternate;if(r!==null&&(r=r.updateQueue,n===r)){var i=null,s=null;if(n=n.firstBaseUpdate,n!==null){do{var o={eventTime:n.eventTime,lane:n.lane,tag:n.tag,payload:n.payload,callback:n.callback,next:null};s===null?i=s=o:s=s.next=o,n=n.next}while(n!==null);s===null?i=s=e:s=s.next=e}else i=s=e;n={baseState:r.baseState,firstBaseUpdate:i,lastBaseUpdate:s,shared:r.shared,effects:r.effects},t.updateQueue=n;return}t=n.lastBaseUpdate,t===null?n.firstBaseUpdate=e:t.next=e,n.lastBaseUpdate=e}function Rs(t,e,n,r){var i=t.updateQueue;Lt=!1;var s=i.firstBaseUpdate,o=i.lastBaseUpdate,a=i.shared.pending;if(a!==null){i.shared.pending=null;var l=a,u=l.next;l.next=null,o===null?s=u:o.next=u,o=l;var m=t.alternate;m!==null&&(m=m.updateQueue,a=m.lastBaseUpdate,a!==o&&(a===null?m.firstBaseUpdate=u:a.next=u,m.lastBaseUpdate=l))}if(s!==null){var h=i.baseState;o=0,m=u=l=null,a=s;do{var p=a.lane,y=a.eventTime;if((r&p)===p){m!==null&&(m=m.next={eventTime:y,lane:0,tag:a.tag,payload:a.payload,callback:a.callback,next:null});e:{var w=t,I=a;switch(p=e,y=n,I.tag){case 1:if(w=I.payload,typeof w=="function"){h=w.call(y,h,p);break e}h=w;break e;case 3:w.flags=w.flags&-65537|128;case 0:if(w=I.payload,p=typeof w=="function"?w.call(y,h,p):w,p==null)break e;h=Q({},h,p);break e;case 2:Lt=!0}}a.callback!==null&&a.lane!==0&&(t.flags|=64,p=i.effects,p===null?i.effects=[a]:p.push(a))}else y={eventTime:y,lane:p,tag:a.tag,payload:a.payload,callback:a.callback,next:null},m===null?(u=m=y,l=h):m=m.next=y,o|=p;if(a=a.next,a===null){if(a=i.shared.pending,a===null)break;p=a,a=p.next,p.next=null,i.lastBaseUpdate=p,i.shared.pending=null}}while(!0);if(m===null&&(l=h),i.baseState=l,i.firstBaseUpdate=u,i.lastBaseUpdate=m,e=i.shared.interleaved,e!==null){i=e;do o|=i.lane,i=i.next;while(i!==e)}else s===null&&(i.shared.lanes=0);Sn|=o,t.lanes=o,t.memoizedState=h}}function Pc(t,e,n){if(t=e.effects,e.effects=null,t!==null)for(e=0;e<t.length;e++){var r=t[e],i=r.callback;if(i!==null){if(r.callback=null,r=n,typeof i!="function")throw Error(v(191,i));i.call(r)}}}var oh=new rf.Component().refs;function Ba(t,e,n,r){e=t.memoizedState,n=n(r,e),n=n==null?e:Q({},e,n),t.memoizedState=n,t.lanes===0&&(t.updateQueue.baseState=n)}var lo={isMounted:function(t){return(t=t._reactInternals)?Rn(t)===t:!1},enqueueSetState:function(t,e,n){t=t._reactInternals;var r=_e(),i=qt(t),s=St(r,i);s.payload=e,n!=null&&(s.callback=n),e=Kt(t,s,i),e!==null&&(Xe(e,t,i,r),ns(e,t,i))},enqueueReplaceState:function(t,e,n){t=t._reactInternals;var r=_e(),i=qt(t),s=St(r,i);s.tag=1,s.payload=e,n!=null&&(s.callback=n),e=Kt(t,s,i),e!==null&&(Xe(e,t,i,r),ns(e,t,i))},enqueueForceUpdate:function(t,e){t=t._reactInternals;var n=_e(),r=qt(t),i=St(n,r);i.tag=2,e!=null&&(i.callback=e),e=Kt(t,i,r),e!==null&&(Xe(e,t,r,n),ns(e,t,r))}};function Cc(t,e,n,r,i,s,o){return t=t.stateNode,typeof t.shouldComponentUpdate=="function"?t.shouldComponentUpdate(r,s,o):e.prototype&&e.prototype.isPureReactComponent?!ei(n,r)||!ei(i,s):!0}function ah(t,e,n){var r=!1,i=en,s=e.contextType;return typeof s=="object"&&s!==null?s=$e(s):(i=Pe(e)?_n:ge.current,r=e.contextTypes,s=(r=r!=null)?Zn(t,i):en),e=new e(n,s),t.memoizedState=e.state!==null&&e.state!==void 0?e.state:null,e.updater=lo,t.stateNode=e,e._reactInternals=t,r&&(t=t.stateNode,t.__reactInternalMemoizedUnmaskedChildContext=i,t.__reactInternalMemoizedMaskedChildContext=s),e}function Rc(t,e,n,r){t=e.state,typeof e.componentWillReceiveProps=="function"&&e.componentWillReceiveProps(n,r),typeof e.UNSAFE_componentWillReceiveProps=="function"&&e.UNSAFE_componentWillReceiveProps(n,r),e.state!==t&&lo.enqueueReplaceState(e,e.state,null)}function Ha(t,e,n,r){var i=t.stateNode;i.props=n,i.state=t.memoizedState,i.refs=oh,Gl(t);var s=e.contextType;typeof s=="object"&&s!==null?i.context=$e(s):(s=Pe(e)?_n:ge.current,i.context=Zn(t,s)),i.state=t.memoizedState,s=e.getDerivedStateFromProps,typeof s=="function"&&(Ba(t,e,s,n),i.state=t.memoizedState),typeof e.getDerivedStateFromProps=="function"||typeof i.getSnapshotBeforeUpdate=="function"||typeof i.UNSAFE_componentWillMount!="function"&&typeof i.componentWillMount!="function"||(e=i.state,typeof i.componentWillMount=="function"&&i.componentWillMount(),typeof i.UNSAFE_componentWillMount=="function"&&i.UNSAFE_componentWillMount(),e!==i.state&&lo.enqueueReplaceState(i,i.state,null),Rs(t,n,i,r),i.state=t.memoizedState),typeof i.componentDidMount=="function"&&(t.flags|=4194308)}function Tr(t,e,n){if(t=n.ref,t!==null&&typeof t!="function"&&typeof t!="object"){if(n._owner){if(n=n._owner,n){if(n.tag!==1)throw Error(v(309));var r=n.stateNode}if(!r)throw Error(v(147,t));var i=r,s=""+t;return e!==null&&e.ref!==null&&typeof e.ref=="function"&&e.ref._stringRef===s?e.ref:(e=function(o){var a=i.refs;a===oh&&(a=i.refs={}),o===null?delete a[s]:a[s]=o},e._stringRef=s,e)}if(typeof t!="string")throw Error(v(284));if(!n._owner)throw Error(v(290,t))}return t}function Bi(t,e){throw t=Object.prototype.toString.call(e),Error(v(31,t==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":t))}function Ac(t){var e=t._init;return e(t._payload)}function lh(t){function e(f,c){if(t){var d=f.deletions;d===null?(f.deletions=[c],f.flags|=16):d.push(c)}}function n(f,c){if(!t)return null;for(;c!==null;)e(f,c),c=c.sibling;return null}function r(f,c){for(f=new Map;c!==null;)c.key!==null?f.set(c.key,c):f.set(c.index,c),c=c.sibling;return f}function i(f,c){return f=Qt(f,c),f.index=0,f.sibling=null,f}function s(f,c,d){return f.index=d,t?(d=f.alternate,d!==null?(d=d.index,d<c?(f.flags|=2,c):d):(f.flags|=2,c)):(f.flags|=1048576,c)}function o(f){return t&&f.alternate===null&&(f.flags|=2),f}function a(f,c,d,g){return c===null||c.tag!==6?(c=Zo(d,f.mode,g),c.return=f,c):(c=i(c,d),c.return=f,c)}function l(f,c,d,g){var _=d.type;return _===xn?m(f,c,d.props.children,g,d.key):c!==null&&(c.elementType===_||typeof _=="object"&&_!==null&&_.$$typeof===Dt&&Ac(_)===c.type)?(g=i(c,d.props),g.ref=Tr(f,c,d),g.return=f,g):(g=ls(d.type,d.key,d.props,null,f.mode,g),g.ref=Tr(f,c,d),g.return=f,g)}function u(f,c,d,g){return c===null||c.tag!==4||c.stateNode.containerInfo!==d.containerInfo||c.stateNode.implementation!==d.implementation?(c=ea(d,f.mode,g),c.return=f,c):(c=i(c,d.children||[]),c.return=f,c)}function m(f,c,d,g,_){return c===null||c.tag!==7?(c=gn(d,f.mode,g,_),c.return=f,c):(c=i(c,d),c.return=f,c)}function h(f,c,d){if(typeof c=="string"&&c!==""||typeof c=="number")return c=Zo(""+c,f.mode,d),c.return=f,c;if(typeof c=="object"&&c!==null){switch(c.$$typeof){case xi:return d=ls(c.type,c.key,c.props,null,f.mode,d),d.ref=Tr(f,null,c),d.return=f,d;case On:return c=ea(c,f.mode,d),c.return=f,c;case Dt:var g=c._init;return h(f,g(c._payload),d)}if(Ar(c)||_r(c))return c=gn(c,f.mode,d,null),c.return=f,c;Bi(f,c)}return null}function p(f,c,d,g){var _=c!==null?c.key:null;if(typeof d=="string"&&d!==""||typeof d=="number")return _!==null?null:a(f,c,""+d,g);if(typeof d=="object"&&d!==null){switch(d.$$typeof){case xi:return d.key===_?l(f,c,d,g):null;case On:return d.key===_?u(f,c,d,g):null;case Dt:return _=d._init,p(f,c,_(d._payload),g)}if(Ar(d)||_r(d))return _!==null?null:m(f,c,d,g,null);Bi(f,d)}return null}function y(f,c,d,g,_){if(typeof g=="string"&&g!==""||typeof g=="number")return f=f.get(d)||null,a(c,f,""+g,_);if(typeof g=="object"&&g!==null){switch(g.$$typeof){case xi:return f=f.get(g.key===null?d:g.key)||null,l(c,f,g,_);case On:return f=f.get(g.key===null?d:g.key)||null,u(c,f,g,_);case Dt:var E=g._init;return y(f,c,d,E(g._payload),_)}if(Ar(g)||_r(g))return f=f.get(d)||null,m(c,f,g,_,null);Bi(c,g)}return null}function w(f,c,d,g){for(var _=null,E=null,S=c,P=c=0,b=null;S!==null&&P<d.length;P++){S.index>P?(b=S,S=null):b=S.sibling;var A=p(f,S,d[P],g);if(A===null){S===null&&(S=b);break}t&&S&&A.alternate===null&&e(f,S),c=s(A,c,P),E===null?_=A:E.sibling=A,E=A,S=b}if(P===d.length)return n(f,S),K&&an(f,P),_;if(S===null){for(;P<d.length;P++)S=h(f,d[P],g),S!==null&&(c=s(S,c,P),E===null?_=S:E.sibling=S,E=S);return K&&an(f,P),_}for(S=r(f,S);P<d.length;P++)b=y(S,f,P,d[P],g),b!==null&&(t&&b.alternate!==null&&S.delete(b.key===null?P:b.key),c=s(b,c,P),E===null?_=b:E.sibling=b,E=b);return t&&S.forEach(function(oe){return e(f,oe)}),K&&an(f,P),_}function I(f,c,d,g){var _=_r(d);if(typeof _!="function")throw Error(v(150));if(d=_.call(d),d==null)throw Error(v(151));for(var E=_=null,S=c,P=c=0,b=null,A=d.next();S!==null&&!A.done;P++,A=d.next()){S.index>P?(b=S,S=null):b=S.sibling;var oe=p(f,S,A.value,g);if(oe===null){S===null&&(S=b);break}t&&S&&oe.alternate===null&&e(f,S),c=s(oe,c,P),E===null?_=oe:E.sibling=oe,E=oe,S=b}if(A.done)return n(f,S),K&&an(f,P),_;if(S===null){for(;!A.done;P++,A=d.next())A=h(f,A.value,g),A!==null&&(c=s(A,c,P),E===null?_=A:E.sibling=A,E=A);return K&&an(f,P),_}for(S=r(f,S);!A.done;P++,A=d.next())A=y(S,f,P,A.value,g),A!==null&&(t&&A.alternate!==null&&S.delete(A.key===null?P:A.key),c=s(A,c,P),E===null?_=A:E.sibling=A,E=A);return t&&S.forEach(function(He){return e(f,He)}),K&&an(f,P),_}function j(f,c,d,g){if(typeof d=="object"&&d!==null&&d.type===xn&&d.key===null&&(d=d.props.children),typeof d=="object"&&d!==null){switch(d.$$typeof){case xi:e:{for(var _=d.key,E=c;E!==null;){if(E.key===_){if(_=d.type,_===xn){if(E.tag===7){n(f,E.sibling),c=i(E,d.props.children),c.return=f,f=c;break e}}else if(E.elementType===_||typeof _=="object"&&_!==null&&_.$$typeof===Dt&&Ac(_)===E.type){n(f,E.sibling),c=i(E,d.props),c.ref=Tr(f,E,d),c.return=f,f=c;break e}n(f,E);break}else e(f,E);E=E.sibling}d.type===xn?(c=gn(d.props.children,f.mode,g,d.key),c.return=f,f=c):(g=ls(d.type,d.key,d.props,null,f.mode,g),g.ref=Tr(f,c,d),g.return=f,f=g)}return o(f);case On:e:{for(E=d.key;c!==null;){if(c.key===E)if(c.tag===4&&c.stateNode.containerInfo===d.containerInfo&&c.stateNode.implementation===d.implementation){n(f,c.sibling),c=i(c,d.children||[]),c.return=f,f=c;break e}else{n(f,c);break}else e(f,c);c=c.sibling}c=ea(d,f.mode,g),c.return=f,f=c}return o(f);case Dt:return E=d._init,j(f,c,E(d._payload),g)}if(Ar(d))return w(f,c,d,g);if(_r(d))return I(f,c,d,g);Bi(f,d)}return typeof d=="string"&&d!==""||typeof d=="number"?(d=""+d,c!==null&&c.tag===6?(n(f,c.sibling),c=i(c,d),c.return=f,f=c):(n(f,c),c=Zo(d,f.mode,g),c.return=f,f=c),o(f)):n(f,c)}return j}var tr=lh(!0),uh=lh(!1),Si={},ot=nn(Si),ii=nn(Si),si=nn(Si);function fn(t){if(t===Si)throw Error(v(174));return t}function ql(t,e){switch($(si,e),$(ii,t),$(ot,Si),t=e.nodeType,t){case 9:case 11:e=(e=e.documentElement)?e.namespaceURI:Sa(null,"");break;default:t=t===8?e.parentNode:e,e=t.namespaceURI||null,t=t.tagName,e=Sa(e,t)}W(ot),$(ot,e)}function nr(){W(ot),W(ii),W(si)}function ch(t){fn(si.current);var e=fn(ot.current),n=Sa(e,t.type);e!==n&&($(ii,t),$(ot,n))}function Ql(t){ii.current===t&&(W(ot),W(ii))}var G=nn(0);function As(t){for(var e=t;e!==null;){if(e.tag===13){var n=e.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||n.data==="$?"||n.data==="$!"))return e}else if(e.tag===19&&e.memoizedProps.revealOrder!==void 0){if(e.flags&128)return e}else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break;for(;e.sibling===null;){if(e.return===null||e.return===t)return null;e=e.return}e.sibling.return=e.return,e=e.sibling}return null}var Go=[];function Yl(){for(var t=0;t<Go.length;t++)Go[t]._workInProgressVersionPrimary=null;Go.length=0}var rs=At.ReactCurrentDispatcher,qo=At.ReactCurrentBatchConfig,En=0,q=null,te=null,ie=null,Ns=!1,Vr=!1,oi=0,Pv=0;function fe(){throw Error(v(321))}function Jl(t,e){if(e===null)return!1;for(var n=0;n<e.length&&n<t.length;n++)if(!et(t[n],e[n]))return!1;return!0}function Xl(t,e,n,r,i,s){if(En=s,q=e,e.memoizedState=null,e.updateQueue=null,e.lanes=0,rs.current=t===null||t.memoizedState===null?Nv:Ov,t=n(r,i),Vr){s=0;do{if(Vr=!1,oi=0,25<=s)throw Error(v(301));s+=1,ie=te=null,e.updateQueue=null,rs.current=xv,t=n(r,i)}while(Vr)}if(rs.current=Os,e=te!==null&&te.next!==null,En=0,ie=te=q=null,Ns=!1,e)throw Error(v(300));return t}function Zl(){var t=oi!==0;return oi=0,t}function nt(){var t={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return ie===null?q.memoizedState=ie=t:ie=ie.next=t,ie}function Be(){if(te===null){var t=q.alternate;t=t!==null?t.memoizedState:null}else t=te.next;var e=ie===null?q.memoizedState:ie.next;if(e!==null)ie=e,te=t;else{if(t===null)throw Error(v(310));te=t,t={memoizedState:te.memoizedState,baseState:te.baseState,baseQueue:te.baseQueue,queue:te.queue,next:null},ie===null?q.memoizedState=ie=t:ie=ie.next=t}return ie}function ai(t,e){return typeof e=="function"?e(t):e}function Qo(t){var e=Be(),n=e.queue;if(n===null)throw Error(v(311));n.lastRenderedReducer=t;var r=te,i=r.baseQueue,s=n.pending;if(s!==null){if(i!==null){var o=i.next;i.next=s.next,s.next=o}r.baseQueue=i=s,n.pending=null}if(i!==null){s=i.next,r=r.baseState;var a=o=null,l=null,u=s;do{var m=u.lane;if((En&m)===m)l!==null&&(l=l.next={lane:0,action:u.action,hasEagerState:u.hasEagerState,eagerState:u.eagerState,next:null}),r=u.hasEagerState?u.eagerState:t(r,u.action);else{var h={lane:m,action:u.action,hasEagerState:u.hasEagerState,eagerState:u.eagerState,next:null};l===null?(a=l=h,o=r):l=l.next=h,q.lanes|=m,Sn|=m}u=u.next}while(u!==null&&u!==s);l===null?o=r:l.next=a,et(r,e.memoizedState)||(Te=!0),e.memoizedState=r,e.baseState=o,e.baseQueue=l,n.lastRenderedState=r}if(t=n.interleaved,t!==null){i=t;do s=i.lane,q.lanes|=s,Sn|=s,i=i.next;while(i!==t)}else i===null&&(n.lanes=0);return[e.memoizedState,n.dispatch]}function Yo(t){var e=Be(),n=e.queue;if(n===null)throw Error(v(311));n.lastRenderedReducer=t;var r=n.dispatch,i=n.pending,s=e.memoizedState;if(i!==null){n.pending=null;var o=i=i.next;do s=t(s,o.action),o=o.next;while(o!==i);et(s,e.memoizedState)||(Te=!0),e.memoizedState=s,e.baseQueue===null&&(e.baseState=s),n.lastRenderedState=s}return[s,r]}function dh(){}function fh(t,e){var n=q,r=Be(),i=e(),s=!et(r.memoizedState,i);if(s&&(r.memoizedState=i,Te=!0),r=r.queue,eu(mh.bind(null,n,r,t),[t]),r.getSnapshot!==e||s||ie!==null&&ie.memoizedState.tag&1){if(n.flags|=2048,li(9,ph.bind(null,n,r,i,e),void 0,null),se===null)throw Error(v(349));En&30||hh(n,e,i)}return i}function hh(t,e,n){t.flags|=16384,t={getSnapshot:e,value:n},e=q.updateQueue,e===null?(e={lastEffect:null,stores:null},q.updateQueue=e,e.stores=[t]):(n=e.stores,n===null?e.stores=[t]:n.push(t))}function ph(t,e,n,r){e.value=n,e.getSnapshot=r,gh(e)&&vh(t)}function mh(t,e,n){return n(function(){gh(e)&&vh(t)})}function gh(t){var e=t.getSnapshot;t=t.value;try{var n=e();return!et(t,n)}catch{return!0}}function vh(t){var e=kt(t,1);e!==null&&Xe(e,t,1,-1)}function Nc(t){var e=nt();return typeof t=="function"&&(t=t()),e.memoizedState=e.baseState=t,t={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:ai,lastRenderedState:t},e.queue=t,t=t.dispatch=Av.bind(null,q,t),[e.memoizedState,t]}function li(t,e,n,r){return t={tag:t,create:e,destroy:n,deps:r,next:null},e=q.updateQueue,e===null?(e={lastEffect:null,stores:null},q.updateQueue=e,e.lastEffect=t.next=t):(n=e.lastEffect,n===null?e.lastEffect=t.next=t:(r=n.next,n.next=t,t.next=r,e.lastEffect=t)),t}function yh(){return Be().memoizedState}function is(t,e,n,r){var i=nt();q.flags|=t,i.memoizedState=li(1|e,n,void 0,r===void 0?null:r)}function uo(t,e,n,r){var i=Be();r=r===void 0?null:r;var s=void 0;if(te!==null){var o=te.memoizedState;if(s=o.destroy,r!==null&&Jl(r,o.deps)){i.memoizedState=li(e,n,s,r);return}}q.flags|=t,i.memoizedState=li(1|e,n,s,r)}function Oc(t,e){return is(8390656,8,t,e)}function eu(t,e){return uo(2048,8,t,e)}function _h(t,e){return uo(4,2,t,e)}function wh(t,e){return uo(4,4,t,e)}function Eh(t,e){if(typeof e=="function")return t=t(),e(t),function(){e(null)};if(e!=null)return t=t(),e.current=t,function(){e.current=null}}function Sh(t,e,n){return n=n!=null?n.concat([t]):null,uo(4,4,Eh.bind(null,e,t),n)}function tu(){}function Ih(t,e){var n=Be();e=e===void 0?null:e;var r=n.memoizedState;return r!==null&&e!==null&&Jl(e,r[1])?r[0]:(n.memoizedState=[t,e],t)}function Th(t,e){var n=Be();e=e===void 0?null:e;var r=n.memoizedState;return r!==null&&e!==null&&Jl(e,r[1])?r[0]:(t=t(),n.memoizedState=[t,e],t)}function kh(t,e,n){return En&21?(et(n,e)||(n=Rf(),q.lanes|=n,Sn|=n,t.baseState=!0),e):(t.baseState&&(t.baseState=!1,Te=!0),t.memoizedState=n)}function Cv(t,e){var n=z;z=n!==0&&4>n?n:4,t(!0);var r=qo.transition;qo.transition={};try{t(!1),e()}finally{z=n,qo.transition=r}}function Ph(){return Be().memoizedState}function Rv(t,e,n){var r=qt(t);if(n={lane:r,action:n,hasEagerState:!1,eagerState:null,next:null},Ch(t))Rh(e,n);else if(n=ih(t,e,n,r),n!==null){var i=_e();Xe(n,t,r,i),Ah(n,e,r)}}function Av(t,e,n){var r=qt(t),i={lane:r,action:n,hasEagerState:!1,eagerState:null,next:null};if(Ch(t))Rh(e,i);else{var s=t.alternate;if(t.lanes===0&&(s===null||s.lanes===0)&&(s=e.lastRenderedReducer,s!==null))try{var o=e.lastRenderedState,a=s(o,n);if(i.hasEagerState=!0,i.eagerState=a,et(a,o)){var l=e.interleaved;l===null?(i.next=i,Kl(e)):(i.next=l.next,l.next=i),e.interleaved=i;return}}catch{}finally{}n=ih(t,e,i,r),n!==null&&(i=_e(),Xe(n,t,r,i),Ah(n,e,r))}}function Ch(t){var e=t.alternate;return t===q||e!==null&&e===q}function Rh(t,e){Vr=Ns=!0;var n=t.pending;n===null?e.next=e:(e.next=n.next,n.next=e),t.pending=e}function Ah(t,e,n){if(n&4194240){var r=e.lanes;r&=t.pendingLanes,n|=r,e.lanes=n,xl(t,n)}}var Os={readContext:$e,useCallback:fe,useContext:fe,useEffect:fe,useImperativeHandle:fe,useInsertionEffect:fe,useLayoutEffect:fe,useMemo:fe,useReducer:fe,useRef:fe,useState:fe,useDebugValue:fe,useDeferredValue:fe,useTransition:fe,useMutableSource:fe,useSyncExternalStore:fe,useId:fe,unstable_isNewReconciler:!1},Nv={readContext:$e,useCallback:function(t,e){return nt().memoizedState=[t,e===void 0?null:e],t},useContext:$e,useEffect:Oc,useImperativeHandle:function(t,e,n){return n=n!=null?n.concat([t]):null,is(4194308,4,Eh.bind(null,e,t),n)},useLayoutEffect:function(t,e){return is(4194308,4,t,e)},useInsertionEffect:function(t,e){return is(4,2,t,e)},useMemo:function(t,e){var n=nt();return e=e===void 0?null:e,t=t(),n.memoizedState=[t,e],t},useReducer:function(t,e,n){var r=nt();return e=n!==void 0?n(e):e,r.memoizedState=r.baseState=e,t={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:t,lastRenderedState:e},r.queue=t,t=t.dispatch=Rv.bind(null,q,t),[r.memoizedState,t]},useRef:function(t){var e=nt();return t={current:t},e.memoizedState=t},useState:Nc,useDebugValue:tu,useDeferredValue:function(t){return nt().memoizedState=t},useTransition:function(){var t=Nc(!1),e=t[0];return t=Cv.bind(null,t[1]),nt().memoizedState=t,[e,t]},useMutableSource:function(){},useSyncExternalStore:function(t,e,n){var r=q,i=nt();if(K){if(n===void 0)throw Error(v(407));n=n()}else{if(n=e(),se===null)throw Error(v(349));En&30||hh(r,e,n)}i.memoizedState=n;var s={value:n,getSnapshot:e};return i.queue=s,Oc(mh.bind(null,r,s,t),[t]),r.flags|=2048,li(9,ph.bind(null,r,s,n,e),void 0,null),n},useId:function(){var t=nt(),e=se.identifierPrefix;if(K){var n=mt,r=pt;n=(r&~(1<<32-Je(r)-1)).toString(32)+n,e=":"+e+"R"+n,n=oi++,0<n&&(e+="H"+n.toString(32)),e+=":"}else n=Pv++,e=":"+e+"r"+n.toString(32)+":";return t.memoizedState=e},unstable_isNewReconciler:!1},Ov={readContext:$e,useCallback:Ih,useContext:$e,useEffect:eu,useImperativeHandle:Sh,useInsertionEffect:_h,useLayoutEffect:wh,useMemo:Th,useReducer:Qo,useRef:yh,useState:function(){return Qo(ai)},useDebugValue:tu,useDeferredValue:function(t){var e=Be();return kh(e,te.memoizedState,t)},useTransition:function(){var t=Qo(ai)[0],e=Be().memoizedState;return[t,e]},useMutableSource:dh,useSyncExternalStore:fh,useId:Ph,unstable_isNewReconciler:!1},xv={readContext:$e,useCallback:Ih,useContext:$e,useEffect:eu,useImperativeHandle:Sh,useInsertionEffect:_h,useLayoutEffect:wh,useMemo:Th,useReducer:Yo,useRef:yh,useState:function(){return Yo(ai)},useDebugValue:tu,useDeferredValue:function(t){var e=Be();return te===null?e.memoizedState=t:kh(e,te.memoizedState,t)},useTransition:function(){var t=Yo(ai)[0],e=Be().memoizedState;return[t,e]},useMutableSource:dh,useSyncExternalStore:fh,useId:Ph,unstable_isNewReconciler:!1};function rr(t,e){try{var n="",r=e;do n+=og(r),r=r.return;while(r);var i=n}catch(s){i=`
Error generating stack: `+s.message+`
`+s.stack}return{value:t,source:e,stack:i,digest:null}}function Jo(t,e,n){return{value:t,source:null,stack:n??null,digest:e??null}}function Wa(t,e){try{console.error(e.value)}catch(n){setTimeout(function(){throw n})}}var Dv=typeof WeakMap=="function"?WeakMap:Map;function Nh(t,e,n){n=St(-1,n),n.tag=3,n.payload={element:null};var r=e.value;return n.callback=function(){Ds||(Ds=!0,tl=r),Wa(t,e)},n}function Oh(t,e,n){n=St(-1,n),n.tag=3;var r=t.type.getDerivedStateFromError;if(typeof r=="function"){var i=e.value;n.payload=function(){return r(i)},n.callback=function(){Wa(t,e)}}var s=t.stateNode;return s!==null&&typeof s.componentDidCatch=="function"&&(n.callback=function(){Wa(t,e),typeof r!="function"&&(Gt===null?Gt=new Set([this]):Gt.add(this));var o=e.stack;this.componentDidCatch(e.value,{componentStack:o!==null?o:""})}),n}function xc(t,e,n){var r=t.pingCache;if(r===null){r=t.pingCache=new Dv;var i=new Set;r.set(e,i)}else i=r.get(e),i===void 0&&(i=new Set,r.set(e,i));i.has(n)||(i.add(n),t=Gv.bind(null,t,e,n),e.then(t,t))}function Dc(t){do{var e;if((e=t.tag===13)&&(e=t.memoizedState,e=e!==null?e.dehydrated!==null:!0),e)return t;t=t.return}while(t!==null);return null}function Lc(t,e,n,r,i){return t.mode&1?(t.flags|=65536,t.lanes=i,t):(t===e?t.flags|=65536:(t.flags|=128,n.flags|=131072,n.flags&=-52805,n.tag===1&&(n.alternate===null?n.tag=17:(e=St(-1,1),e.tag=2,Kt(n,e,1))),n.lanes|=1),t)}var Lv=At.ReactCurrentOwner,Te=!1;function ye(t,e,n,r){e.child=t===null?uh(e,null,n,r):tr(e,t.child,n,r)}function Mc(t,e,n,r,i){n=n.render;var s=e.ref;return Gn(e,i),r=Xl(t,e,n,r,s,i),n=Zl(),t!==null&&!Te?(e.updateQueue=t.updateQueue,e.flags&=-2053,t.lanes&=~i,Pt(t,e,i)):(K&&n&&Fl(e),e.flags|=1,ye(t,e,r,i),e.child)}function bc(t,e,n,r,i){if(t===null){var s=n.type;return typeof s=="function"&&!uu(s)&&s.defaultProps===void 0&&n.compare===null&&n.defaultProps===void 0?(e.tag=15,e.type=s,xh(t,e,s,r,i)):(t=ls(n.type,null,r,e,e.mode,i),t.ref=e.ref,t.return=e,e.child=t)}if(s=t.child,!(t.lanes&i)){var o=s.memoizedProps;if(n=n.compare,n=n!==null?n:ei,n(o,r)&&t.ref===e.ref)return Pt(t,e,i)}return e.flags|=1,t=Qt(s,r),t.ref=e.ref,t.return=e,e.child=t}function xh(t,e,n,r,i){if(t!==null){var s=t.memoizedProps;if(ei(s,r)&&t.ref===e.ref)if(Te=!1,e.pendingProps=r=s,(t.lanes&i)!==0)t.flags&131072&&(Te=!0);else return e.lanes=t.lanes,Pt(t,e,i)}return Ka(t,e,n,r,i)}function Dh(t,e,n){var r=e.pendingProps,i=r.children,s=t!==null?t.memoizedState:null;if(r.mode==="hidden")if(!(e.mode&1))e.memoizedState={baseLanes:0,cachePool:null,transitions:null},$($n,Re),Re|=n;else{if(!(n&1073741824))return t=s!==null?s.baseLanes|n:n,e.lanes=e.childLanes=1073741824,e.memoizedState={baseLanes:t,cachePool:null,transitions:null},e.updateQueue=null,$($n,Re),Re|=t,null;e.memoizedState={baseLanes:0,cachePool:null,transitions:null},r=s!==null?s.baseLanes:n,$($n,Re),Re|=r}else s!==null?(r=s.baseLanes|n,e.memoizedState=null):r=n,$($n,Re),Re|=r;return ye(t,e,i,n),e.child}function Lh(t,e){var n=e.ref;(t===null&&n!==null||t!==null&&t.ref!==n)&&(e.flags|=512,e.flags|=2097152)}function Ka(t,e,n,r,i){var s=Pe(n)?_n:ge.current;return s=Zn(e,s),Gn(e,i),n=Xl(t,e,n,r,s,i),r=Zl(),t!==null&&!Te?(e.updateQueue=t.updateQueue,e.flags&=-2053,t.lanes&=~i,Pt(t,e,i)):(K&&r&&Fl(e),e.flags|=1,ye(t,e,n,i),e.child)}function Vc(t,e,n,r,i){if(Pe(n)){var s=!0;Is(e)}else s=!1;if(Gn(e,i),e.stateNode===null)ss(t,e),ah(e,n,r),Ha(e,n,r,i),r=!0;else if(t===null){var o=e.stateNode,a=e.memoizedProps;o.props=a;var l=o.context,u=n.contextType;typeof u=="object"&&u!==null?u=$e(u):(u=Pe(n)?_n:ge.current,u=Zn(e,u));var m=n.getDerivedStateFromProps,h=typeof m=="function"||typeof o.getSnapshotBeforeUpdate=="function";h||typeof o.UNSAFE_componentWillReceiveProps!="function"&&typeof o.componentWillReceiveProps!="function"||(a!==r||l!==u)&&Rc(e,o,r,u),Lt=!1;var p=e.memoizedState;o.state=p,Rs(e,r,o,i),l=e.memoizedState,a!==r||p!==l||ke.current||Lt?(typeof m=="function"&&(Ba(e,n,m,r),l=e.memoizedState),(a=Lt||Cc(e,n,a,r,p,l,u))?(h||typeof o.UNSAFE_componentWillMount!="function"&&typeof o.componentWillMount!="function"||(typeof o.componentWillMount=="function"&&o.componentWillMount(),typeof o.UNSAFE_componentWillMount=="function"&&o.UNSAFE_componentWillMount()),typeof o.componentDidMount=="function"&&(e.flags|=4194308)):(typeof o.componentDidMount=="function"&&(e.flags|=4194308),e.memoizedProps=r,e.memoizedState=l),o.props=r,o.state=l,o.context=u,r=a):(typeof o.componentDidMount=="function"&&(e.flags|=4194308),r=!1)}else{o=e.stateNode,sh(t,e),a=e.memoizedProps,u=e.type===e.elementType?a:Ke(e.type,a),o.props=u,h=e.pendingProps,p=o.context,l=n.contextType,typeof l=="object"&&l!==null?l=$e(l):(l=Pe(n)?_n:ge.current,l=Zn(e,l));var y=n.getDerivedStateFromProps;(m=typeof y=="function"||typeof o.getSnapshotBeforeUpdate=="function")||typeof o.UNSAFE_componentWillReceiveProps!="function"&&typeof o.componentWillReceiveProps!="function"||(a!==h||p!==l)&&Rc(e,o,r,l),Lt=!1,p=e.memoizedState,o.state=p,Rs(e,r,o,i);var w=e.memoizedState;a!==h||p!==w||ke.current||Lt?(typeof y=="function"&&(Ba(e,n,y,r),w=e.memoizedState),(u=Lt||Cc(e,n,u,r,p,w,l)||!1)?(m||typeof o.UNSAFE_componentWillUpdate!="function"&&typeof o.componentWillUpdate!="function"||(typeof o.componentWillUpdate=="function"&&o.componentWillUpdate(r,w,l),typeof o.UNSAFE_componentWillUpdate=="function"&&o.UNSAFE_componentWillUpdate(r,w,l)),typeof o.componentDidUpdate=="function"&&(e.flags|=4),typeof o.getSnapshotBeforeUpdate=="function"&&(e.flags|=1024)):(typeof o.componentDidUpdate!="function"||a===t.memoizedProps&&p===t.memoizedState||(e.flags|=4),typeof o.getSnapshotBeforeUpdate!="function"||a===t.memoizedProps&&p===t.memoizedState||(e.flags|=1024),e.memoizedProps=r,e.memoizedState=w),o.props=r,o.state=w,o.context=l,r=u):(typeof o.componentDidUpdate!="function"||a===t.memoizedProps&&p===t.memoizedState||(e.flags|=4),typeof o.getSnapshotBeforeUpdate!="function"||a===t.memoizedProps&&p===t.memoizedState||(e.flags|=1024),r=!1)}return Ga(t,e,n,r,s,i)}function Ga(t,e,n,r,i,s){Lh(t,e);var o=(e.flags&128)!==0;if(!r&&!o)return i&&Sc(e,n,!1),Pt(t,e,s);r=e.stateNode,Lv.current=e;var a=o&&typeof n.getDerivedStateFromError!="function"?null:r.render();return e.flags|=1,t!==null&&o?(e.child=tr(e,t.child,null,s),e.child=tr(e,null,a,s)):ye(t,e,a,s),e.memoizedState=r.state,i&&Sc(e,n,!0),e.child}function Mh(t){var e=t.stateNode;e.pendingContext?Ec(t,e.pendingContext,e.pendingContext!==e.context):e.context&&Ec(t,e.context,!1),ql(t,e.containerInfo)}function jc(t,e,n,r,i){return er(),$l(i),e.flags|=256,ye(t,e,n,r),e.child}var qa={dehydrated:null,treeContext:null,retryLane:0};function Qa(t){return{baseLanes:t,cachePool:null,transitions:null}}function bh(t,e,n){var r=e.pendingProps,i=G.current,s=!1,o=(e.flags&128)!==0,a;if((a=o)||(a=t!==null&&t.memoizedState===null?!1:(i&2)!==0),a?(s=!0,e.flags&=-129):(t===null||t.memoizedState!==null)&&(i|=1),$(G,i&1),t===null)return za(e),t=e.memoizedState,t!==null&&(t=t.dehydrated,t!==null)?(e.mode&1?t.data==="$!"?e.lanes=8:e.lanes=1073741824:e.lanes=1,null):(o=r.children,t=r.fallback,s?(r=e.mode,s=e.child,o={mode:"hidden",children:o},!(r&1)&&s!==null?(s.childLanes=0,s.pendingProps=o):s=ho(o,r,0,null),t=gn(t,r,n,null),s.return=e,t.return=e,s.sibling=t,e.child=s,e.child.memoizedState=Qa(n),e.memoizedState=qa,t):nu(e,o));if(i=t.memoizedState,i!==null&&(a=i.dehydrated,a!==null))return Mv(t,e,o,r,a,i,n);if(s){s=r.fallback,o=e.mode,i=t.child,a=i.sibling;var l={mode:"hidden",children:r.children};return!(o&1)&&e.child!==i?(r=e.child,r.childLanes=0,r.pendingProps=l,e.deletions=null):(r=Qt(i,l),r.subtreeFlags=i.subtreeFlags&14680064),a!==null?s=Qt(a,s):(s=gn(s,o,n,null),s.flags|=2),s.return=e,r.return=e,r.sibling=s,e.child=r,r=s,s=e.child,o=t.child.memoizedState,o=o===null?Qa(n):{baseLanes:o.baseLanes|n,cachePool:null,transitions:o.transitions},s.memoizedState=o,s.childLanes=t.childLanes&~n,e.memoizedState=qa,r}return s=t.child,t=s.sibling,r=Qt(s,{mode:"visible",children:r.children}),!(e.mode&1)&&(r.lanes=n),r.return=e,r.sibling=null,t!==null&&(n=e.deletions,n===null?(e.deletions=[t],e.flags|=16):n.push(t)),e.child=r,e.memoizedState=null,r}function nu(t,e){return e=ho({mode:"visible",children:e},t.mode,0,null),e.return=t,t.child=e}function Hi(t,e,n,r){return r!==null&&$l(r),tr(e,t.child,null,n),t=nu(e,e.pendingProps.children),t.flags|=2,e.memoizedState=null,t}function Mv(t,e,n,r,i,s,o){if(n)return e.flags&256?(e.flags&=-257,r=Jo(Error(v(422))),Hi(t,e,o,r)):e.memoizedState!==null?(e.child=t.child,e.flags|=128,null):(s=r.fallback,i=e.mode,r=ho({mode:"visible",children:r.children},i,0,null),s=gn(s,i,o,null),s.flags|=2,r.return=e,s.return=e,r.sibling=s,e.child=r,e.mode&1&&tr(e,t.child,null,o),e.child.memoizedState=Qa(o),e.memoizedState=qa,s);if(!(e.mode&1))return Hi(t,e,o,null);if(i.data==="$!"){if(r=i.nextSibling&&i.nextSibling.dataset,r)var a=r.dgst;return r=a,s=Error(v(419)),r=Jo(s,r,void 0),Hi(t,e,o,r)}if(a=(o&t.childLanes)!==0,Te||a){if(r=se,r!==null){switch(o&-o){case 4:i=2;break;case 16:i=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:i=32;break;case 536870912:i=268435456;break;default:i=0}i=i&(r.suspendedLanes|o)?0:i,i!==0&&i!==s.retryLane&&(s.retryLane=i,kt(t,i),Xe(r,t,i,-1))}return lu(),r=Jo(Error(v(421))),Hi(t,e,o,r)}return i.data==="$?"?(e.flags|=128,e.child=t.child,e=qv.bind(null,t),i._reactRetry=e,null):(t=s.treeContext,Ne=Wt(i.nextSibling),Oe=e,K=!0,qe=null,t!==null&&(Ve[je++]=pt,Ve[je++]=mt,Ve[je++]=wn,pt=t.id,mt=t.overflow,wn=e),e=nu(e,r.children),e.flags|=4096,e)}function Uc(t,e,n){t.lanes|=e;var r=t.alternate;r!==null&&(r.lanes|=e),$a(t.return,e,n)}function Xo(t,e,n,r,i){var s=t.memoizedState;s===null?t.memoizedState={isBackwards:e,rendering:null,renderingStartTime:0,last:r,tail:n,tailMode:i}:(s.isBackwards=e,s.rendering=null,s.renderingStartTime=0,s.last=r,s.tail=n,s.tailMode=i)}function Vh(t,e,n){var r=e.pendingProps,i=r.revealOrder,s=r.tail;if(ye(t,e,r.children,n),r=G.current,r&2)r=r&1|2,e.flags|=128;else{if(t!==null&&t.flags&128)e:for(t=e.child;t!==null;){if(t.tag===13)t.memoizedState!==null&&Uc(t,n,e);else if(t.tag===19)Uc(t,n,e);else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break e;for(;t.sibling===null;){if(t.return===null||t.return===e)break e;t=t.return}t.sibling.return=t.return,t=t.sibling}r&=1}if($(G,r),!(e.mode&1))e.memoizedState=null;else switch(i){case"forwards":for(n=e.child,i=null;n!==null;)t=n.alternate,t!==null&&As(t)===null&&(i=n),n=n.sibling;n=i,n===null?(i=e.child,e.child=null):(i=n.sibling,n.sibling=null),Xo(e,!1,i,n,s);break;case"backwards":for(n=null,i=e.child,e.child=null;i!==null;){if(t=i.alternate,t!==null&&As(t)===null){e.child=i;break}t=i.sibling,i.sibling=n,n=i,i=t}Xo(e,!0,n,null,s);break;case"together":Xo(e,!1,null,null,void 0);break;default:e.memoizedState=null}return e.child}function ss(t,e){!(e.mode&1)&&t!==null&&(t.alternate=null,e.alternate=null,e.flags|=2)}function Pt(t,e,n){if(t!==null&&(e.dependencies=t.dependencies),Sn|=e.lanes,!(n&e.childLanes))return null;if(t!==null&&e.child!==t.child)throw Error(v(153));if(e.child!==null){for(t=e.child,n=Qt(t,t.pendingProps),e.child=n,n.return=e;t.sibling!==null;)t=t.sibling,n=n.sibling=Qt(t,t.pendingProps),n.return=e;n.sibling=null}return e.child}function bv(t,e,n){switch(e.tag){case 3:Mh(e),er();break;case 5:ch(e);break;case 1:Pe(e.type)&&Is(e);break;case 4:ql(e,e.stateNode.containerInfo);break;case 10:var r=e.type._context,i=e.memoizedProps.value;$(Ps,r._currentValue),r._currentValue=i;break;case 13:if(r=e.memoizedState,r!==null)return r.dehydrated!==null?($(G,G.current&1),e.flags|=128,null):n&e.child.childLanes?bh(t,e,n):($(G,G.current&1),t=Pt(t,e,n),t!==null?t.sibling:null);$(G,G.current&1);break;case 19:if(r=(n&e.childLanes)!==0,t.flags&128){if(r)return Vh(t,e,n);e.flags|=128}if(i=e.memoizedState,i!==null&&(i.rendering=null,i.tail=null,i.lastEffect=null),$(G,G.current),r)break;return null;case 22:case 23:return e.lanes=0,Dh(t,e,n)}return Pt(t,e,n)}var jh,Ya,Uh,Fh;jh=function(t,e){for(var n=e.child;n!==null;){if(n.tag===5||n.tag===6)t.appendChild(n.stateNode);else if(n.tag!==4&&n.child!==null){n.child.return=n,n=n.child;continue}if(n===e)break;for(;n.sibling===null;){if(n.return===null||n.return===e)return;n=n.return}n.sibling.return=n.return,n=n.sibling}};Ya=function(){};Uh=function(t,e,n,r){var i=t.memoizedProps;if(i!==r){t=e.stateNode,fn(ot.current);var s=null;switch(n){case"input":i=ya(t,i),r=ya(t,r),s=[];break;case"select":i=Q({},i,{value:void 0}),r=Q({},r,{value:void 0}),s=[];break;case"textarea":i=Ea(t,i),r=Ea(t,r),s=[];break;default:typeof i.onClick!="function"&&typeof r.onClick=="function"&&(t.onclick=Es)}Ia(n,r);var o;n=null;for(u in i)if(!r.hasOwnProperty(u)&&i.hasOwnProperty(u)&&i[u]!=null)if(u==="style"){var a=i[u];for(o in a)a.hasOwnProperty(o)&&(n||(n={}),n[o]="")}else u!=="dangerouslySetInnerHTML"&&u!=="children"&&u!=="suppressContentEditableWarning"&&u!=="suppressHydrationWarning"&&u!=="autoFocus"&&(Gr.hasOwnProperty(u)?s||(s=[]):(s=s||[]).push(u,null));for(u in r){var l=r[u];if(a=i!=null?i[u]:void 0,r.hasOwnProperty(u)&&l!==a&&(l!=null||a!=null))if(u==="style")if(a){for(o in a)!a.hasOwnProperty(o)||l&&l.hasOwnProperty(o)||(n||(n={}),n[o]="");for(o in l)l.hasOwnProperty(o)&&a[o]!==l[o]&&(n||(n={}),n[o]=l[o])}else n||(s||(s=[]),s.push(u,n)),n=l;else u==="dangerouslySetInnerHTML"?(l=l?l.__html:void 0,a=a?a.__html:void 0,l!=null&&a!==l&&(s=s||[]).push(u,l)):u==="children"?typeof l!="string"&&typeof l!="number"||(s=s||[]).push(u,""+l):u!=="suppressContentEditableWarning"&&u!=="suppressHydrationWarning"&&(Gr.hasOwnProperty(u)?(l!=null&&u==="onScroll"&&B("scroll",t),s||a===l||(s=[])):(s=s||[]).push(u,l))}n&&(s=s||[]).push("style",n);var u=s;(e.updateQueue=u)&&(e.flags|=4)}};Fh=function(t,e,n,r){n!==r&&(e.flags|=4)};function kr(t,e){if(!K)switch(t.tailMode){case"hidden":e=t.tail;for(var n=null;e!==null;)e.alternate!==null&&(n=e),e=e.sibling;n===null?t.tail=null:n.sibling=null;break;case"collapsed":n=t.tail;for(var r=null;n!==null;)n.alternate!==null&&(r=n),n=n.sibling;r===null?e||t.tail===null?t.tail=null:t.tail.sibling=null:r.sibling=null}}function he(t){var e=t.alternate!==null&&t.alternate.child===t.child,n=0,r=0;if(e)for(var i=t.child;i!==null;)n|=i.lanes|i.childLanes,r|=i.subtreeFlags&14680064,r|=i.flags&14680064,i.return=t,i=i.sibling;else for(i=t.child;i!==null;)n|=i.lanes|i.childLanes,r|=i.subtreeFlags,r|=i.flags,i.return=t,i=i.sibling;return t.subtreeFlags|=r,t.childLanes=n,e}function Vv(t,e,n){var r=e.pendingProps;switch(zl(e),e.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return he(e),null;case 1:return Pe(e.type)&&Ss(),he(e),null;case 3:return r=e.stateNode,nr(),W(ke),W(ge),Yl(),r.pendingContext&&(r.context=r.pendingContext,r.pendingContext=null),(t===null||t.child===null)&&($i(e)?e.flags|=4:t===null||t.memoizedState.isDehydrated&&!(e.flags&256)||(e.flags|=1024,qe!==null&&(il(qe),qe=null))),Ya(t,e),he(e),null;case 5:Ql(e);var i=fn(si.current);if(n=e.type,t!==null&&e.stateNode!=null)Uh(t,e,n,r,i),t.ref!==e.ref&&(e.flags|=512,e.flags|=2097152);else{if(!r){if(e.stateNode===null)throw Error(v(166));return he(e),null}if(t=fn(ot.current),$i(e)){r=e.stateNode,n=e.type;var s=e.memoizedProps;switch(r[rt]=e,r[ri]=s,t=(e.mode&1)!==0,n){case"dialog":B("cancel",r),B("close",r);break;case"iframe":case"object":case"embed":B("load",r);break;case"video":case"audio":for(i=0;i<Or.length;i++)B(Or[i],r);break;case"source":B("error",r);break;case"img":case"image":case"link":B("error",r),B("load",r);break;case"details":B("toggle",r);break;case"input":qu(r,s),B("invalid",r);break;case"select":r._wrapperState={wasMultiple:!!s.multiple},B("invalid",r);break;case"textarea":Yu(r,s),B("invalid",r)}Ia(n,s),i=null;for(var o in s)if(s.hasOwnProperty(o)){var a=s[o];o==="children"?typeof a=="string"?r.textContent!==a&&(s.suppressHydrationWarning!==!0&&zi(r.textContent,a,t),i=["children",a]):typeof a=="number"&&r.textContent!==""+a&&(s.suppressHydrationWarning!==!0&&zi(r.textContent,a,t),i=["children",""+a]):Gr.hasOwnProperty(o)&&a!=null&&o==="onScroll"&&B("scroll",r)}switch(n){case"input":Di(r),Qu(r,s,!0);break;case"textarea":Di(r),Ju(r);break;case"select":case"option":break;default:typeof s.onClick=="function"&&(r.onclick=Es)}r=i,e.updateQueue=r,r!==null&&(e.flags|=4)}else{o=i.nodeType===9?i:i.ownerDocument,t==="http://www.w3.org/1999/xhtml"&&(t=hf(n)),t==="http://www.w3.org/1999/xhtml"?n==="script"?(t=o.createElement("div"),t.innerHTML="<script><\/script>",t=t.removeChild(t.firstChild)):typeof r.is=="string"?t=o.createElement(n,{is:r.is}):(t=o.createElement(n),n==="select"&&(o=t,r.multiple?o.multiple=!0:r.size&&(o.size=r.size))):t=o.createElementNS(t,n),t[rt]=e,t[ri]=r,jh(t,e,!1,!1),e.stateNode=t;e:{switch(o=Ta(n,r),n){case"dialog":B("cancel",t),B("close",t),i=r;break;case"iframe":case"object":case"embed":B("load",t),i=r;break;case"video":case"audio":for(i=0;i<Or.length;i++)B(Or[i],t);i=r;break;case"source":B("error",t),i=r;break;case"img":case"image":case"link":B("error",t),B("load",t),i=r;break;case"details":B("toggle",t),i=r;break;case"input":qu(t,r),i=ya(t,r),B("invalid",t);break;case"option":i=r;break;case"select":t._wrapperState={wasMultiple:!!r.multiple},i=Q({},r,{value:void 0}),B("invalid",t);break;case"textarea":Yu(t,r),i=Ea(t,r),B("invalid",t);break;default:i=r}Ia(n,i),a=i;for(s in a)if(a.hasOwnProperty(s)){var l=a[s];s==="style"?gf(t,l):s==="dangerouslySetInnerHTML"?(l=l?l.__html:void 0,l!=null&&pf(t,l)):s==="children"?typeof l=="string"?(n!=="textarea"||l!=="")&&qr(t,l):typeof l=="number"&&qr(t,""+l):s!=="suppressContentEditableWarning"&&s!=="suppressHydrationWarning"&&s!=="autoFocus"&&(Gr.hasOwnProperty(s)?l!=null&&s==="onScroll"&&B("scroll",t):l!=null&&Pl(t,s,l,o))}switch(n){case"input":Di(t),Qu(t,r,!1);break;case"textarea":Di(t),Ju(t);break;case"option":r.value!=null&&t.setAttribute("value",""+Zt(r.value));break;case"select":t.multiple=!!r.multiple,s=r.value,s!=null?Bn(t,!!r.multiple,s,!1):r.defaultValue!=null&&Bn(t,!!r.multiple,r.defaultValue,!0);break;default:typeof i.onClick=="function"&&(t.onclick=Es)}switch(n){case"button":case"input":case"select":case"textarea":r=!!r.autoFocus;break e;case"img":r=!0;break e;default:r=!1}}r&&(e.flags|=4)}e.ref!==null&&(e.flags|=512,e.flags|=2097152)}return he(e),null;case 6:if(t&&e.stateNode!=null)Fh(t,e,t.memoizedProps,r);else{if(typeof r!="string"&&e.stateNode===null)throw Error(v(166));if(n=fn(si.current),fn(ot.current),$i(e)){if(r=e.stateNode,n=e.memoizedProps,r[rt]=e,(s=r.nodeValue!==n)&&(t=Oe,t!==null))switch(t.tag){case 3:zi(r.nodeValue,n,(t.mode&1)!==0);break;case 5:t.memoizedProps.suppressHydrationWarning!==!0&&zi(r.nodeValue,n,(t.mode&1)!==0)}s&&(e.flags|=4)}else r=(n.nodeType===9?n:n.ownerDocument).createTextNode(r),r[rt]=e,e.stateNode=r}return he(e),null;case 13:if(W(G),r=e.memoizedState,t===null||t.memoizedState!==null&&t.memoizedState.dehydrated!==null){if(K&&Ne!==null&&e.mode&1&&!(e.flags&128))rh(),er(),e.flags|=98560,s=!1;else if(s=$i(e),r!==null&&r.dehydrated!==null){if(t===null){if(!s)throw Error(v(318));if(s=e.memoizedState,s=s!==null?s.dehydrated:null,!s)throw Error(v(317));s[rt]=e}else er(),!(e.flags&128)&&(e.memoizedState=null),e.flags|=4;he(e),s=!1}else qe!==null&&(il(qe),qe=null),s=!0;if(!s)return e.flags&65536?e:null}return e.flags&128?(e.lanes=n,e):(r=r!==null,r!==(t!==null&&t.memoizedState!==null)&&r&&(e.child.flags|=8192,e.mode&1&&(t===null||G.current&1?ne===0&&(ne=3):lu())),e.updateQueue!==null&&(e.flags|=4),he(e),null);case 4:return nr(),Ya(t,e),t===null&&ti(e.stateNode.containerInfo),he(e),null;case 10:return Wl(e.type._context),he(e),null;case 17:return Pe(e.type)&&Ss(),he(e),null;case 19:if(W(G),s=e.memoizedState,s===null)return he(e),null;if(r=(e.flags&128)!==0,o=s.rendering,o===null)if(r)kr(s,!1);else{if(ne!==0||t!==null&&t.flags&128)for(t=e.child;t!==null;){if(o=As(t),o!==null){for(e.flags|=128,kr(s,!1),r=o.updateQueue,r!==null&&(e.updateQueue=r,e.flags|=4),e.subtreeFlags=0,r=n,n=e.child;n!==null;)s=n,t=r,s.flags&=14680066,o=s.alternate,o===null?(s.childLanes=0,s.lanes=t,s.child=null,s.subtreeFlags=0,s.memoizedProps=null,s.memoizedState=null,s.updateQueue=null,s.dependencies=null,s.stateNode=null):(s.childLanes=o.childLanes,s.lanes=o.lanes,s.child=o.child,s.subtreeFlags=0,s.deletions=null,s.memoizedProps=o.memoizedProps,s.memoizedState=o.memoizedState,s.updateQueue=o.updateQueue,s.type=o.type,t=o.dependencies,s.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext}),n=n.sibling;return $(G,G.current&1|2),e.child}t=t.sibling}s.tail!==null&&X()>ir&&(e.flags|=128,r=!0,kr(s,!1),e.lanes=4194304)}else{if(!r)if(t=As(o),t!==null){if(e.flags|=128,r=!0,n=t.updateQueue,n!==null&&(e.updateQueue=n,e.flags|=4),kr(s,!0),s.tail===null&&s.tailMode==="hidden"&&!o.alternate&&!K)return he(e),null}else 2*X()-s.renderingStartTime>ir&&n!==1073741824&&(e.flags|=128,r=!0,kr(s,!1),e.lanes=4194304);s.isBackwards?(o.sibling=e.child,e.child=o):(n=s.last,n!==null?n.sibling=o:e.child=o,s.last=o)}return s.tail!==null?(e=s.tail,s.rendering=e,s.tail=e.sibling,s.renderingStartTime=X(),e.sibling=null,n=G.current,$(G,r?n&1|2:n&1),e):(he(e),null);case 22:case 23:return au(),r=e.memoizedState!==null,t!==null&&t.memoizedState!==null!==r&&(e.flags|=8192),r&&e.mode&1?Re&1073741824&&(he(e),e.subtreeFlags&6&&(e.flags|=8192)):he(e),null;case 24:return null;case 25:return null}throw Error(v(156,e.tag))}function jv(t,e){switch(zl(e),e.tag){case 1:return Pe(e.type)&&Ss(),t=e.flags,t&65536?(e.flags=t&-65537|128,e):null;case 3:return nr(),W(ke),W(ge),Yl(),t=e.flags,t&65536&&!(t&128)?(e.flags=t&-65537|128,e):null;case 5:return Ql(e),null;case 13:if(W(G),t=e.memoizedState,t!==null&&t.dehydrated!==null){if(e.alternate===null)throw Error(v(340));er()}return t=e.flags,t&65536?(e.flags=t&-65537|128,e):null;case 19:return W(G),null;case 4:return nr(),null;case 10:return Wl(e.type._context),null;case 22:case 23:return au(),null;case 24:return null;default:return null}}var Wi=!1,me=!1,Uv=typeof WeakSet=="function"?WeakSet:Set,T=null;function zn(t,e){var n=t.ref;if(n!==null)if(typeof n=="function")try{n(null)}catch(r){Y(t,e,r)}else n.current=null}function Ja(t,e,n){try{n()}catch(r){Y(t,e,r)}}var Fc=!1;function Fv(t,e){if(La=ys,t=Hf(),Ul(t)){if("selectionStart"in t)var n={start:t.selectionStart,end:t.selectionEnd};else e:{n=(n=t.ownerDocument)&&n.defaultView||window;var r=n.getSelection&&n.getSelection();if(r&&r.rangeCount!==0){n=r.anchorNode;var i=r.anchorOffset,s=r.focusNode;r=r.focusOffset;try{n.nodeType,s.nodeType}catch{n=null;break e}var o=0,a=-1,l=-1,u=0,m=0,h=t,p=null;t:for(;;){for(var y;h!==n||i!==0&&h.nodeType!==3||(a=o+i),h!==s||r!==0&&h.nodeType!==3||(l=o+r),h.nodeType===3&&(o+=h.nodeValue.length),(y=h.firstChild)!==null;)p=h,h=y;for(;;){if(h===t)break t;if(p===n&&++u===i&&(a=o),p===s&&++m===r&&(l=o),(y=h.nextSibling)!==null)break;h=p,p=h.parentNode}h=y}n=a===-1||l===-1?null:{start:a,end:l}}else n=null}n=n||{start:0,end:0}}else n=null;for(Ma={focusedElem:t,selectionRange:n},ys=!1,T=e;T!==null;)if(e=T,t=e.child,(e.subtreeFlags&1028)!==0&&t!==null)t.return=e,T=t;else for(;T!==null;){e=T;try{var w=e.alternate;if(e.flags&1024)switch(e.tag){case 0:case 11:case 15:break;case 1:if(w!==null){var I=w.memoizedProps,j=w.memoizedState,f=e.stateNode,c=f.getSnapshotBeforeUpdate(e.elementType===e.type?I:Ke(e.type,I),j);f.__reactInternalSnapshotBeforeUpdate=c}break;case 3:var d=e.stateNode.containerInfo;d.nodeType===1?d.textContent="":d.nodeType===9&&d.documentElement&&d.removeChild(d.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(v(163))}}catch(g){Y(e,e.return,g)}if(t=e.sibling,t!==null){t.return=e.return,T=t;break}T=e.return}return w=Fc,Fc=!1,w}function jr(t,e,n){var r=e.updateQueue;if(r=r!==null?r.lastEffect:null,r!==null){var i=r=r.next;do{if((i.tag&t)===t){var s=i.destroy;i.destroy=void 0,s!==void 0&&Ja(e,n,s)}i=i.next}while(i!==r)}}function co(t,e){if(e=e.updateQueue,e=e!==null?e.lastEffect:null,e!==null){var n=e=e.next;do{if((n.tag&t)===t){var r=n.create;n.destroy=r()}n=n.next}while(n!==e)}}function Xa(t){var e=t.ref;if(e!==null){var n=t.stateNode;switch(t.tag){case 5:t=n;break;default:t=n}typeof e=="function"?e(t):e.current=t}}function zh(t){var e=t.alternate;e!==null&&(t.alternate=null,zh(e)),t.child=null,t.deletions=null,t.sibling=null,t.tag===5&&(e=t.stateNode,e!==null&&(delete e[rt],delete e[ri],delete e[ja],delete e[Sv],delete e[Iv])),t.stateNode=null,t.return=null,t.dependencies=null,t.memoizedProps=null,t.memoizedState=null,t.pendingProps=null,t.stateNode=null,t.updateQueue=null}function $h(t){return t.tag===5||t.tag===3||t.tag===4}function zc(t){e:for(;;){for(;t.sibling===null;){if(t.return===null||$h(t.return))return null;t=t.return}for(t.sibling.return=t.return,t=t.sibling;t.tag!==5&&t.tag!==6&&t.tag!==18;){if(t.flags&2||t.child===null||t.tag===4)continue e;t.child.return=t,t=t.child}if(!(t.flags&2))return t.stateNode}}function Za(t,e,n){var r=t.tag;if(r===5||r===6)t=t.stateNode,e?n.nodeType===8?n.parentNode.insertBefore(t,e):n.insertBefore(t,e):(n.nodeType===8?(e=n.parentNode,e.insertBefore(t,n)):(e=n,e.appendChild(t)),n=n._reactRootContainer,n!=null||e.onclick!==null||(e.onclick=Es));else if(r!==4&&(t=t.child,t!==null))for(Za(t,e,n),t=t.sibling;t!==null;)Za(t,e,n),t=t.sibling}function el(t,e,n){var r=t.tag;if(r===5||r===6)t=t.stateNode,e?n.insertBefore(t,e):n.appendChild(t);else if(r!==4&&(t=t.child,t!==null))for(el(t,e,n),t=t.sibling;t!==null;)el(t,e,n),t=t.sibling}var ae=null,Ge=!1;function Ot(t,e,n){for(n=n.child;n!==null;)Bh(t,e,n),n=n.sibling}function Bh(t,e,n){if(st&&typeof st.onCommitFiberUnmount=="function")try{st.onCommitFiberUnmount(no,n)}catch{}switch(n.tag){case 5:me||zn(n,e);case 6:var r=ae,i=Ge;ae=null,Ot(t,e,n),ae=r,Ge=i,ae!==null&&(Ge?(t=ae,n=n.stateNode,t.nodeType===8?t.parentNode.removeChild(n):t.removeChild(n)):ae.removeChild(n.stateNode));break;case 18:ae!==null&&(Ge?(t=ae,n=n.stateNode,t.nodeType===8?Wo(t.parentNode,n):t.nodeType===1&&Wo(t,n),Xr(t)):Wo(ae,n.stateNode));break;case 4:r=ae,i=Ge,ae=n.stateNode.containerInfo,Ge=!0,Ot(t,e,n),ae=r,Ge=i;break;case 0:case 11:case 14:case 15:if(!me&&(r=n.updateQueue,r!==null&&(r=r.lastEffect,r!==null))){i=r=r.next;do{var s=i,o=s.destroy;s=s.tag,o!==void 0&&(s&2||s&4)&&Ja(n,e,o),i=i.next}while(i!==r)}Ot(t,e,n);break;case 1:if(!me&&(zn(n,e),r=n.stateNode,typeof r.componentWillUnmount=="function"))try{r.props=n.memoizedProps,r.state=n.memoizedState,r.componentWillUnmount()}catch(a){Y(n,e,a)}Ot(t,e,n);break;case 21:Ot(t,e,n);break;case 22:n.mode&1?(me=(r=me)||n.memoizedState!==null,Ot(t,e,n),me=r):Ot(t,e,n);break;default:Ot(t,e,n)}}function $c(t){var e=t.updateQueue;if(e!==null){t.updateQueue=null;var n=t.stateNode;n===null&&(n=t.stateNode=new Uv),e.forEach(function(r){var i=Qv.bind(null,t,r);n.has(r)||(n.add(r),r.then(i,i))})}}function We(t,e){var n=e.deletions;if(n!==null)for(var r=0;r<n.length;r++){var i=n[r];try{var s=t,o=e,a=o;e:for(;a!==null;){switch(a.tag){case 5:ae=a.stateNode,Ge=!1;break e;case 3:ae=a.stateNode.containerInfo,Ge=!0;break e;case 4:ae=a.stateNode.containerInfo,Ge=!0;break e}a=a.return}if(ae===null)throw Error(v(160));Bh(s,o,i),ae=null,Ge=!1;var l=i.alternate;l!==null&&(l.return=null),i.return=null}catch(u){Y(i,e,u)}}if(e.subtreeFlags&12854)for(e=e.child;e!==null;)Hh(e,t),e=e.sibling}function Hh(t,e){var n=t.alternate,r=t.flags;switch(t.tag){case 0:case 11:case 14:case 15:if(We(e,t),tt(t),r&4){try{jr(3,t,t.return),co(3,t)}catch(I){Y(t,t.return,I)}try{jr(5,t,t.return)}catch(I){Y(t,t.return,I)}}break;case 1:We(e,t),tt(t),r&512&&n!==null&&zn(n,n.return);break;case 5:if(We(e,t),tt(t),r&512&&n!==null&&zn(n,n.return),t.flags&32){var i=t.stateNode;try{qr(i,"")}catch(I){Y(t,t.return,I)}}if(r&4&&(i=t.stateNode,i!=null)){var s=t.memoizedProps,o=n!==null?n.memoizedProps:s,a=t.type,l=t.updateQueue;if(t.updateQueue=null,l!==null)try{a==="input"&&s.type==="radio"&&s.name!=null&&df(i,s),Ta(a,o);var u=Ta(a,s);for(o=0;o<l.length;o+=2){var m=l[o],h=l[o+1];m==="style"?gf(i,h):m==="dangerouslySetInnerHTML"?pf(i,h):m==="children"?qr(i,h):Pl(i,m,h,u)}switch(a){case"input":_a(i,s);break;case"textarea":ff(i,s);break;case"select":var p=i._wrapperState.wasMultiple;i._wrapperState.wasMultiple=!!s.multiple;var y=s.value;y!=null?Bn(i,!!s.multiple,y,!1):p!==!!s.multiple&&(s.defaultValue!=null?Bn(i,!!s.multiple,s.defaultValue,!0):Bn(i,!!s.multiple,s.multiple?[]:"",!1))}i[ri]=s}catch(I){Y(t,t.return,I)}}break;case 6:if(We(e,t),tt(t),r&4){if(t.stateNode===null)throw Error(v(162));i=t.stateNode,s=t.memoizedProps;try{i.nodeValue=s}catch(I){Y(t,t.return,I)}}break;case 3:if(We(e,t),tt(t),r&4&&n!==null&&n.memoizedState.isDehydrated)try{Xr(e.containerInfo)}catch(I){Y(t,t.return,I)}break;case 4:We(e,t),tt(t);break;case 13:We(e,t),tt(t),i=t.child,i.flags&8192&&(s=i.memoizedState!==null,i.stateNode.isHidden=s,!s||i.alternate!==null&&i.alternate.memoizedState!==null||(su=X())),r&4&&$c(t);break;case 22:if(m=n!==null&&n.memoizedState!==null,t.mode&1?(me=(u=me)||m,We(e,t),me=u):We(e,t),tt(t),r&8192){if(u=t.memoizedState!==null,(t.stateNode.isHidden=u)&&!m&&t.mode&1)for(T=t,m=t.child;m!==null;){for(h=T=m;T!==null;){switch(p=T,y=p.child,p.tag){case 0:case 11:case 14:case 15:jr(4,p,p.return);break;case 1:zn(p,p.return);var w=p.stateNode;if(typeof w.componentWillUnmount=="function"){r=p,n=p.return;try{e=r,w.props=e.memoizedProps,w.state=e.memoizedState,w.componentWillUnmount()}catch(I){Y(r,n,I)}}break;case 5:zn(p,p.return);break;case 22:if(p.memoizedState!==null){Hc(h);continue}}y!==null?(y.return=p,T=y):Hc(h)}m=m.sibling}e:for(m=null,h=t;;){if(h.tag===5){if(m===null){m=h;try{i=h.stateNode,u?(s=i.style,typeof s.setProperty=="function"?s.setProperty("display","none","important"):s.display="none"):(a=h.stateNode,l=h.memoizedProps.style,o=l!=null&&l.hasOwnProperty("display")?l.display:null,a.style.display=mf("display",o))}catch(I){Y(t,t.return,I)}}}else if(h.tag===6){if(m===null)try{h.stateNode.nodeValue=u?"":h.memoizedProps}catch(I){Y(t,t.return,I)}}else if((h.tag!==22&&h.tag!==23||h.memoizedState===null||h===t)&&h.child!==null){h.child.return=h,h=h.child;continue}if(h===t)break e;for(;h.sibling===null;){if(h.return===null||h.return===t)break e;m===h&&(m=null),h=h.return}m===h&&(m=null),h.sibling.return=h.return,h=h.sibling}}break;case 19:We(e,t),tt(t),r&4&&$c(t);break;case 21:break;default:We(e,t),tt(t)}}function tt(t){var e=t.flags;if(e&2){try{e:{for(var n=t.return;n!==null;){if($h(n)){var r=n;break e}n=n.return}throw Error(v(160))}switch(r.tag){case 5:var i=r.stateNode;r.flags&32&&(qr(i,""),r.flags&=-33);var s=zc(t);el(t,s,i);break;case 3:case 4:var o=r.stateNode.containerInfo,a=zc(t);Za(t,a,o);break;default:throw Error(v(161))}}catch(l){Y(t,t.return,l)}t.flags&=-3}e&4096&&(t.flags&=-4097)}function zv(t,e,n){T=t,Wh(t)}function Wh(t,e,n){for(var r=(t.mode&1)!==0;T!==null;){var i=T,s=i.child;if(i.tag===22&&r){var o=i.memoizedState!==null||Wi;if(!o){var a=i.alternate,l=a!==null&&a.memoizedState!==null||me;a=Wi;var u=me;if(Wi=o,(me=l)&&!u)for(T=i;T!==null;)o=T,l=o.child,o.tag===22&&o.memoizedState!==null?Wc(i):l!==null?(l.return=o,T=l):Wc(i);for(;s!==null;)T=s,Wh(s),s=s.sibling;T=i,Wi=a,me=u}Bc(t)}else i.subtreeFlags&8772&&s!==null?(s.return=i,T=s):Bc(t)}}function Bc(t){for(;T!==null;){var e=T;if(e.flags&8772){var n=e.alternate;try{if(e.flags&8772)switch(e.tag){case 0:case 11:case 15:me||co(5,e);break;case 1:var r=e.stateNode;if(e.flags&4&&!me)if(n===null)r.componentDidMount();else{var i=e.elementType===e.type?n.memoizedProps:Ke(e.type,n.memoizedProps);r.componentDidUpdate(i,n.memoizedState,r.__reactInternalSnapshotBeforeUpdate)}var s=e.updateQueue;s!==null&&Pc(e,s,r);break;case 3:var o=e.updateQueue;if(o!==null){if(n=null,e.child!==null)switch(e.child.tag){case 5:n=e.child.stateNode;break;case 1:n=e.child.stateNode}Pc(e,o,n)}break;case 5:var a=e.stateNode;if(n===null&&e.flags&4){n=a;var l=e.memoizedProps;switch(e.type){case"button":case"input":case"select":case"textarea":l.autoFocus&&n.focus();break;case"img":l.src&&(n.src=l.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(e.memoizedState===null){var u=e.alternate;if(u!==null){var m=u.memoizedState;if(m!==null){var h=m.dehydrated;h!==null&&Xr(h)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(v(163))}me||e.flags&512&&Xa(e)}catch(p){Y(e,e.return,p)}}if(e===t){T=null;break}if(n=e.sibling,n!==null){n.return=e.return,T=n;break}T=e.return}}function Hc(t){for(;T!==null;){var e=T;if(e===t){T=null;break}var n=e.sibling;if(n!==null){n.return=e.return,T=n;break}T=e.return}}function Wc(t){for(;T!==null;){var e=T;try{switch(e.tag){case 0:case 11:case 15:var n=e.return;try{co(4,e)}catch(l){Y(e,n,l)}break;case 1:var r=e.stateNode;if(typeof r.componentDidMount=="function"){var i=e.return;try{r.componentDidMount()}catch(l){Y(e,i,l)}}var s=e.return;try{Xa(e)}catch(l){Y(e,s,l)}break;case 5:var o=e.return;try{Xa(e)}catch(l){Y(e,o,l)}}}catch(l){Y(e,e.return,l)}if(e===t){T=null;break}var a=e.sibling;if(a!==null){a.return=e.return,T=a;break}T=e.return}}var $v=Math.ceil,xs=At.ReactCurrentDispatcher,ru=At.ReactCurrentOwner,Fe=At.ReactCurrentBatchConfig,M=0,se=null,Z=null,ce=0,Re=0,$n=nn(0),ne=0,ui=null,Sn=0,fo=0,iu=0,Ur=null,Ie=null,su=0,ir=1/0,ct=null,Ds=!1,tl=null,Gt=null,Ki=!1,zt=null,Ls=0,Fr=0,nl=null,os=-1,as=0;function _e(){return M&6?X():os!==-1?os:os=X()}function qt(t){return t.mode&1?M&2&&ce!==0?ce&-ce:kv.transition!==null?(as===0&&(as=Rf()),as):(t=z,t!==0||(t=window.event,t=t===void 0?16:Mf(t.type)),t):1}function Xe(t,e,n,r){if(50<Fr)throw Fr=0,nl=null,Error(v(185));_i(t,n,r),(!(M&2)||t!==se)&&(t===se&&(!(M&2)&&(fo|=n),ne===4&&bt(t,ce)),Ce(t,r),n===1&&M===0&&!(e.mode&1)&&(ir=X()+500,ao&&rn()))}function Ce(t,e){var n=t.callbackNode;kg(t,e);var r=vs(t,t===se?ce:0);if(r===0)n!==null&&ec(n),t.callbackNode=null,t.callbackPriority=0;else if(e=r&-r,t.callbackPriority!==e){if(n!=null&&ec(n),e===1)t.tag===0?Tv(Kc.bind(null,t)):eh(Kc.bind(null,t)),wv(function(){!(M&6)&&rn()}),n=null;else{switch(Af(r)){case 1:n=Ol;break;case 4:n=Pf;break;case 16:n=gs;break;case 536870912:n=Cf;break;default:n=gs}n=Zh(n,Kh.bind(null,t))}t.callbackPriority=e,t.callbackNode=n}}function Kh(t,e){if(os=-1,as=0,M&6)throw Error(v(327));var n=t.callbackNode;if(qn()&&t.callbackNode!==n)return null;var r=vs(t,t===se?ce:0);if(r===0)return null;if(r&30||r&t.expiredLanes||e)e=Ms(t,r);else{e=r;var i=M;M|=2;var s=qh();(se!==t||ce!==e)&&(ct=null,ir=X()+500,mn(t,e));do try{Wv();break}catch(a){Gh(t,a)}while(!0);Hl(),xs.current=s,M=i,Z!==null?e=0:(se=null,ce=0,e=ne)}if(e!==0){if(e===2&&(i=Aa(t),i!==0&&(r=i,e=rl(t,i))),e===1)throw n=ui,mn(t,0),bt(t,r),Ce(t,X()),n;if(e===6)bt(t,r);else{if(i=t.current.alternate,!(r&30)&&!Bv(i)&&(e=Ms(t,r),e===2&&(s=Aa(t),s!==0&&(r=s,e=rl(t,s))),e===1))throw n=ui,mn(t,0),bt(t,r),Ce(t,X()),n;switch(t.finishedWork=i,t.finishedLanes=r,e){case 0:case 1:throw Error(v(345));case 2:ln(t,Ie,ct);break;case 3:if(bt(t,r),(r&130023424)===r&&(e=su+500-X(),10<e)){if(vs(t,0)!==0)break;if(i=t.suspendedLanes,(i&r)!==r){_e(),t.pingedLanes|=t.suspendedLanes&i;break}t.timeoutHandle=Va(ln.bind(null,t,Ie,ct),e);break}ln(t,Ie,ct);break;case 4:if(bt(t,r),(r&4194240)===r)break;for(e=t.eventTimes,i=-1;0<r;){var o=31-Je(r);s=1<<o,o=e[o],o>i&&(i=o),r&=~s}if(r=i,r=X()-r,r=(120>r?120:480>r?480:1080>r?1080:1920>r?1920:3e3>r?3e3:4320>r?4320:1960*$v(r/1960))-r,10<r){t.timeoutHandle=Va(ln.bind(null,t,Ie,ct),r);break}ln(t,Ie,ct);break;case 5:ln(t,Ie,ct);break;default:throw Error(v(329))}}}return Ce(t,X()),t.callbackNode===n?Kh.bind(null,t):null}function rl(t,e){var n=Ur;return t.current.memoizedState.isDehydrated&&(mn(t,e).flags|=256),t=Ms(t,e),t!==2&&(e=Ie,Ie=n,e!==null&&il(e)),t}function il(t){Ie===null?Ie=t:Ie.push.apply(Ie,t)}function Bv(t){for(var e=t;;){if(e.flags&16384){var n=e.updateQueue;if(n!==null&&(n=n.stores,n!==null))for(var r=0;r<n.length;r++){var i=n[r],s=i.getSnapshot;i=i.value;try{if(!et(s(),i))return!1}catch{return!1}}}if(n=e.child,e.subtreeFlags&16384&&n!==null)n.return=e,e=n;else{if(e===t)break;for(;e.sibling===null;){if(e.return===null||e.return===t)return!0;e=e.return}e.sibling.return=e.return,e=e.sibling}}return!0}function bt(t,e){for(e&=~iu,e&=~fo,t.suspendedLanes|=e,t.pingedLanes&=~e,t=t.expirationTimes;0<e;){var n=31-Je(e),r=1<<n;t[n]=-1,e&=~r}}function Kc(t){if(M&6)throw Error(v(327));qn();var e=vs(t,0);if(!(e&1))return Ce(t,X()),null;var n=Ms(t,e);if(t.tag!==0&&n===2){var r=Aa(t);r!==0&&(e=r,n=rl(t,r))}if(n===1)throw n=ui,mn(t,0),bt(t,e),Ce(t,X()),n;if(n===6)throw Error(v(345));return t.finishedWork=t.current.alternate,t.finishedLanes=e,ln(t,Ie,ct),Ce(t,X()),null}function ou(t,e){var n=M;M|=1;try{return t(e)}finally{M=n,M===0&&(ir=X()+500,ao&&rn())}}function In(t){zt!==null&&zt.tag===0&&!(M&6)&&qn();var e=M;M|=1;var n=Fe.transition,r=z;try{if(Fe.transition=null,z=1,t)return t()}finally{z=r,Fe.transition=n,M=e,!(M&6)&&rn()}}function au(){Re=$n.current,W($n)}function mn(t,e){t.finishedWork=null,t.finishedLanes=0;var n=t.timeoutHandle;if(n!==-1&&(t.timeoutHandle=-1,_v(n)),Z!==null)for(n=Z.return;n!==null;){var r=n;switch(zl(r),r.tag){case 1:r=r.type.childContextTypes,r!=null&&Ss();break;case 3:nr(),W(ke),W(ge),Yl();break;case 5:Ql(r);break;case 4:nr();break;case 13:W(G);break;case 19:W(G);break;case 10:Wl(r.type._context);break;case 22:case 23:au()}n=n.return}if(se=t,Z=t=Qt(t.current,null),ce=Re=e,ne=0,ui=null,iu=fo=Sn=0,Ie=Ur=null,dn!==null){for(e=0;e<dn.length;e++)if(n=dn[e],r=n.interleaved,r!==null){n.interleaved=null;var i=r.next,s=n.pending;if(s!==null){var o=s.next;s.next=i,r.next=o}n.pending=r}dn=null}return t}function Gh(t,e){do{var n=Z;try{if(Hl(),rs.current=Os,Ns){for(var r=q.memoizedState;r!==null;){var i=r.queue;i!==null&&(i.pending=null),r=r.next}Ns=!1}if(En=0,ie=te=q=null,Vr=!1,oi=0,ru.current=null,n===null||n.return===null){ne=1,ui=e,Z=null;break}e:{var s=t,o=n.return,a=n,l=e;if(e=ce,a.flags|=32768,l!==null&&typeof l=="object"&&typeof l.then=="function"){var u=l,m=a,h=m.tag;if(!(m.mode&1)&&(h===0||h===11||h===15)){var p=m.alternate;p?(m.updateQueue=p.updateQueue,m.memoizedState=p.memoizedState,m.lanes=p.lanes):(m.updateQueue=null,m.memoizedState=null)}var y=Dc(o);if(y!==null){y.flags&=-257,Lc(y,o,a,s,e),y.mode&1&&xc(s,u,e),e=y,l=u;var w=e.updateQueue;if(w===null){var I=new Set;I.add(l),e.updateQueue=I}else w.add(l);break e}else{if(!(e&1)){xc(s,u,e),lu();break e}l=Error(v(426))}}else if(K&&a.mode&1){var j=Dc(o);if(j!==null){!(j.flags&65536)&&(j.flags|=256),Lc(j,o,a,s,e),$l(rr(l,a));break e}}s=l=rr(l,a),ne!==4&&(ne=2),Ur===null?Ur=[s]:Ur.push(s),s=o;do{switch(s.tag){case 3:s.flags|=65536,e&=-e,s.lanes|=e;var f=Nh(s,l,e);kc(s,f);break e;case 1:a=l;var c=s.type,d=s.stateNode;if(!(s.flags&128)&&(typeof c.getDerivedStateFromError=="function"||d!==null&&typeof d.componentDidCatch=="function"&&(Gt===null||!Gt.has(d)))){s.flags|=65536,e&=-e,s.lanes|=e;var g=Oh(s,a,e);kc(s,g);break e}}s=s.return}while(s!==null)}Yh(n)}catch(_){e=_,Z===n&&n!==null&&(Z=n=n.return);continue}break}while(!0)}function qh(){var t=xs.current;return xs.current=Os,t===null?Os:t}function lu(){(ne===0||ne===3||ne===2)&&(ne=4),se===null||!(Sn&268435455)&&!(fo&268435455)||bt(se,ce)}function Ms(t,e){var n=M;M|=2;var r=qh();(se!==t||ce!==e)&&(ct=null,mn(t,e));do try{Hv();break}catch(i){Gh(t,i)}while(!0);if(Hl(),M=n,xs.current=r,Z!==null)throw Error(v(261));return se=null,ce=0,ne}function Hv(){for(;Z!==null;)Qh(Z)}function Wv(){for(;Z!==null&&!gg();)Qh(Z)}function Qh(t){var e=Xh(t.alternate,t,Re);t.memoizedProps=t.pendingProps,e===null?Yh(t):Z=e,ru.current=null}function Yh(t){var e=t;do{var n=e.alternate;if(t=e.return,e.flags&32768){if(n=jv(n,e),n!==null){n.flags&=32767,Z=n;return}if(t!==null)t.flags|=32768,t.subtreeFlags=0,t.deletions=null;else{ne=6,Z=null;return}}else if(n=Vv(n,e,Re),n!==null){Z=n;return}if(e=e.sibling,e!==null){Z=e;return}Z=e=t}while(e!==null);ne===0&&(ne=5)}function ln(t,e,n){var r=z,i=Fe.transition;try{Fe.transition=null,z=1,Kv(t,e,n,r)}finally{Fe.transition=i,z=r}return null}function Kv(t,e,n,r){do qn();while(zt!==null);if(M&6)throw Error(v(327));n=t.finishedWork;var i=t.finishedLanes;if(n===null)return null;if(t.finishedWork=null,t.finishedLanes=0,n===t.current)throw Error(v(177));t.callbackNode=null,t.callbackPriority=0;var s=n.lanes|n.childLanes;if(Pg(t,s),t===se&&(Z=se=null,ce=0),!(n.subtreeFlags&2064)&&!(n.flags&2064)||Ki||(Ki=!0,Zh(gs,function(){return qn(),null})),s=(n.flags&15990)!==0,n.subtreeFlags&15990||s){s=Fe.transition,Fe.transition=null;var o=z;z=1;var a=M;M|=4,ru.current=null,Fv(t,n),Hh(n,t),fv(Ma),ys=!!La,Ma=La=null,t.current=n,zv(n),vg(),M=a,z=o,Fe.transition=s}else t.current=n;if(Ki&&(Ki=!1,zt=t,Ls=i),s=t.pendingLanes,s===0&&(Gt=null),wg(n.stateNode),Ce(t,X()),e!==null)for(r=t.onRecoverableError,n=0;n<e.length;n++)i=e[n],r(i.value,{componentStack:i.stack,digest:i.digest});if(Ds)throw Ds=!1,t=tl,tl=null,t;return Ls&1&&t.tag!==0&&qn(),s=t.pendingLanes,s&1?t===nl?Fr++:(Fr=0,nl=t):Fr=0,rn(),null}function qn(){if(zt!==null){var t=Af(Ls),e=Fe.transition,n=z;try{if(Fe.transition=null,z=16>t?16:t,zt===null)var r=!1;else{if(t=zt,zt=null,Ls=0,M&6)throw Error(v(331));var i=M;for(M|=4,T=t.current;T!==null;){var s=T,o=s.child;if(T.flags&16){var a=s.deletions;if(a!==null){for(var l=0;l<a.length;l++){var u=a[l];for(T=u;T!==null;){var m=T;switch(m.tag){case 0:case 11:case 15:jr(8,m,s)}var h=m.child;if(h!==null)h.return=m,T=h;else for(;T!==null;){m=T;var p=m.sibling,y=m.return;if(zh(m),m===u){T=null;break}if(p!==null){p.return=y,T=p;break}T=y}}}var w=s.alternate;if(w!==null){var I=w.child;if(I!==null){w.child=null;do{var j=I.sibling;I.sibling=null,I=j}while(I!==null)}}T=s}}if(s.subtreeFlags&2064&&o!==null)o.return=s,T=o;else e:for(;T!==null;){if(s=T,s.flags&2048)switch(s.tag){case 0:case 11:case 15:jr(9,s,s.return)}var f=s.sibling;if(f!==null){f.return=s.return,T=f;break e}T=s.return}}var c=t.current;for(T=c;T!==null;){o=T;var d=o.child;if(o.subtreeFlags&2064&&d!==null)d.return=o,T=d;else e:for(o=c;T!==null;){if(a=T,a.flags&2048)try{switch(a.tag){case 0:case 11:case 15:co(9,a)}}catch(_){Y(a,a.return,_)}if(a===o){T=null;break e}var g=a.sibling;if(g!==null){g.return=a.return,T=g;break e}T=a.return}}if(M=i,rn(),st&&typeof st.onPostCommitFiberRoot=="function")try{st.onPostCommitFiberRoot(no,t)}catch{}r=!0}return r}finally{z=n,Fe.transition=e}}return!1}function Gc(t,e,n){e=rr(n,e),e=Nh(t,e,1),t=Kt(t,e,1),e=_e(),t!==null&&(_i(t,1,e),Ce(t,e))}function Y(t,e,n){if(t.tag===3)Gc(t,t,n);else for(;e!==null;){if(e.tag===3){Gc(e,t,n);break}else if(e.tag===1){var r=e.stateNode;if(typeof e.type.getDerivedStateFromError=="function"||typeof r.componentDidCatch=="function"&&(Gt===null||!Gt.has(r))){t=rr(n,t),t=Oh(e,t,1),e=Kt(e,t,1),t=_e(),e!==null&&(_i(e,1,t),Ce(e,t));break}}e=e.return}}function Gv(t,e,n){var r=t.pingCache;r!==null&&r.delete(e),e=_e(),t.pingedLanes|=t.suspendedLanes&n,se===t&&(ce&n)===n&&(ne===4||ne===3&&(ce&130023424)===ce&&500>X()-su?mn(t,0):iu|=n),Ce(t,e)}function Jh(t,e){e===0&&(t.mode&1?(e=bi,bi<<=1,!(bi&130023424)&&(bi=4194304)):e=1);var n=_e();t=kt(t,e),t!==null&&(_i(t,e,n),Ce(t,n))}function qv(t){var e=t.memoizedState,n=0;e!==null&&(n=e.retryLane),Jh(t,n)}function Qv(t,e){var n=0;switch(t.tag){case 13:var r=t.stateNode,i=t.memoizedState;i!==null&&(n=i.retryLane);break;case 19:r=t.stateNode;break;default:throw Error(v(314))}r!==null&&r.delete(e),Jh(t,n)}var Xh;Xh=function(t,e,n){if(t!==null)if(t.memoizedProps!==e.pendingProps||ke.current)Te=!0;else{if(!(t.lanes&n)&&!(e.flags&128))return Te=!1,bv(t,e,n);Te=!!(t.flags&131072)}else Te=!1,K&&e.flags&1048576&&th(e,ks,e.index);switch(e.lanes=0,e.tag){case 2:var r=e.type;ss(t,e),t=e.pendingProps;var i=Zn(e,ge.current);Gn(e,n),i=Xl(null,e,r,t,i,n);var s=Zl();return e.flags|=1,typeof i=="object"&&i!==null&&typeof i.render=="function"&&i.$$typeof===void 0?(e.tag=1,e.memoizedState=null,e.updateQueue=null,Pe(r)?(s=!0,Is(e)):s=!1,e.memoizedState=i.state!==null&&i.state!==void 0?i.state:null,Gl(e),i.updater=lo,e.stateNode=i,i._reactInternals=e,Ha(e,r,t,n),e=Ga(null,e,r,!0,s,n)):(e.tag=0,K&&s&&Fl(e),ye(null,e,i,n),e=e.child),e;case 16:r=e.elementType;e:{switch(ss(t,e),t=e.pendingProps,i=r._init,r=i(r._payload),e.type=r,i=e.tag=Jv(r),t=Ke(r,t),i){case 0:e=Ka(null,e,r,t,n);break e;case 1:e=Vc(null,e,r,t,n);break e;case 11:e=Mc(null,e,r,t,n);break e;case 14:e=bc(null,e,r,Ke(r.type,t),n);break e}throw Error(v(306,r,""))}return e;case 0:return r=e.type,i=e.pendingProps,i=e.elementType===r?i:Ke(r,i),Ka(t,e,r,i,n);case 1:return r=e.type,i=e.pendingProps,i=e.elementType===r?i:Ke(r,i),Vc(t,e,r,i,n);case 3:e:{if(Mh(e),t===null)throw Error(v(387));r=e.pendingProps,s=e.memoizedState,i=s.element,sh(t,e),Rs(e,r,null,n);var o=e.memoizedState;if(r=o.element,s.isDehydrated)if(s={element:r,isDehydrated:!1,cache:o.cache,pendingSuspenseBoundaries:o.pendingSuspenseBoundaries,transitions:o.transitions},e.updateQueue.baseState=s,e.memoizedState=s,e.flags&256){i=rr(Error(v(423)),e),e=jc(t,e,r,n,i);break e}else if(r!==i){i=rr(Error(v(424)),e),e=jc(t,e,r,n,i);break e}else for(Ne=Wt(e.stateNode.containerInfo.firstChild),Oe=e,K=!0,qe=null,n=uh(e,null,r,n),e.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling;else{if(er(),r===i){e=Pt(t,e,n);break e}ye(t,e,r,n)}e=e.child}return e;case 5:return ch(e),t===null&&za(e),r=e.type,i=e.pendingProps,s=t!==null?t.memoizedProps:null,o=i.children,ba(r,i)?o=null:s!==null&&ba(r,s)&&(e.flags|=32),Lh(t,e),ye(t,e,o,n),e.child;case 6:return t===null&&za(e),null;case 13:return bh(t,e,n);case 4:return ql(e,e.stateNode.containerInfo),r=e.pendingProps,t===null?e.child=tr(e,null,r,n):ye(t,e,r,n),e.child;case 11:return r=e.type,i=e.pendingProps,i=e.elementType===r?i:Ke(r,i),Mc(t,e,r,i,n);case 7:return ye(t,e,e.pendingProps,n),e.child;case 8:return ye(t,e,e.pendingProps.children,n),e.child;case 12:return ye(t,e,e.pendingProps.children,n),e.child;case 10:e:{if(r=e.type._context,i=e.pendingProps,s=e.memoizedProps,o=i.value,$(Ps,r._currentValue),r._currentValue=o,s!==null)if(et(s.value,o)){if(s.children===i.children&&!ke.current){e=Pt(t,e,n);break e}}else for(s=e.child,s!==null&&(s.return=e);s!==null;){var a=s.dependencies;if(a!==null){o=s.child;for(var l=a.firstContext;l!==null;){if(l.context===r){if(s.tag===1){l=St(-1,n&-n),l.tag=2;var u=s.updateQueue;if(u!==null){u=u.shared;var m=u.pending;m===null?l.next=l:(l.next=m.next,m.next=l),u.pending=l}}s.lanes|=n,l=s.alternate,l!==null&&(l.lanes|=n),$a(s.return,n,e),a.lanes|=n;break}l=l.next}}else if(s.tag===10)o=s.type===e.type?null:s.child;else if(s.tag===18){if(o=s.return,o===null)throw Error(v(341));o.lanes|=n,a=o.alternate,a!==null&&(a.lanes|=n),$a(o,n,e),o=s.sibling}else o=s.child;if(o!==null)o.return=s;else for(o=s;o!==null;){if(o===e){o=null;break}if(s=o.sibling,s!==null){s.return=o.return,o=s;break}o=o.return}s=o}ye(t,e,i.children,n),e=e.child}return e;case 9:return i=e.type,r=e.pendingProps.children,Gn(e,n),i=$e(i),r=r(i),e.flags|=1,ye(t,e,r,n),e.child;case 14:return r=e.type,i=Ke(r,e.pendingProps),i=Ke(r.type,i),bc(t,e,r,i,n);case 15:return xh(t,e,e.type,e.pendingProps,n);case 17:return r=e.type,i=e.pendingProps,i=e.elementType===r?i:Ke(r,i),ss(t,e),e.tag=1,Pe(r)?(t=!0,Is(e)):t=!1,Gn(e,n),ah(e,r,i),Ha(e,r,i,n),Ga(null,e,r,!0,t,n);case 19:return Vh(t,e,n);case 22:return Dh(t,e,n)}throw Error(v(156,e.tag))};function Zh(t,e){return kf(t,e)}function Yv(t,e,n,r){this.tag=t,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=e,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=r,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function Ue(t,e,n,r){return new Yv(t,e,n,r)}function uu(t){return t=t.prototype,!(!t||!t.isReactComponent)}function Jv(t){if(typeof t=="function")return uu(t)?1:0;if(t!=null){if(t=t.$$typeof,t===Rl)return 11;if(t===Al)return 14}return 2}function Qt(t,e){var n=t.alternate;return n===null?(n=Ue(t.tag,e,t.key,t.mode),n.elementType=t.elementType,n.type=t.type,n.stateNode=t.stateNode,n.alternate=t,t.alternate=n):(n.pendingProps=e,n.type=t.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=t.flags&14680064,n.childLanes=t.childLanes,n.lanes=t.lanes,n.child=t.child,n.memoizedProps=t.memoizedProps,n.memoizedState=t.memoizedState,n.updateQueue=t.updateQueue,e=t.dependencies,n.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext},n.sibling=t.sibling,n.index=t.index,n.ref=t.ref,n}function ls(t,e,n,r,i,s){var o=2;if(r=t,typeof t=="function")uu(t)&&(o=1);else if(typeof t=="string")o=5;else e:switch(t){case xn:return gn(n.children,i,s,e);case Cl:o=8,i|=8;break;case pa:return t=Ue(12,n,e,i|2),t.elementType=pa,t.lanes=s,t;case ma:return t=Ue(13,n,e,i),t.elementType=ma,t.lanes=s,t;case ga:return t=Ue(19,n,e,i),t.elementType=ga,t.lanes=s,t;case lf:return ho(n,i,s,e);default:if(typeof t=="object"&&t!==null)switch(t.$$typeof){case of:o=10;break e;case af:o=9;break e;case Rl:o=11;break e;case Al:o=14;break e;case Dt:o=16,r=null;break e}throw Error(v(130,t==null?t:typeof t,""))}return e=Ue(o,n,e,i),e.elementType=t,e.type=r,e.lanes=s,e}function gn(t,e,n,r){return t=Ue(7,t,r,e),t.lanes=n,t}function ho(t,e,n,r){return t=Ue(22,t,r,e),t.elementType=lf,t.lanes=n,t.stateNode={isHidden:!1},t}function Zo(t,e,n){return t=Ue(6,t,null,e),t.lanes=n,t}function ea(t,e,n){return e=Ue(4,t.children!==null?t.children:[],t.key,e),e.lanes=n,e.stateNode={containerInfo:t.containerInfo,pendingChildren:null,implementation:t.implementation},e}function Xv(t,e,n,r,i){this.tag=e,this.containerInfo=t,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=Lo(0),this.expirationTimes=Lo(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=Lo(0),this.identifierPrefix=r,this.onRecoverableError=i,this.mutableSourceEagerHydrationData=null}function cu(t,e,n,r,i,s,o,a,l){return t=new Xv(t,e,n,a,l),e===1?(e=1,s===!0&&(e|=8)):e=0,s=Ue(3,null,null,e),t.current=s,s.stateNode=t,s.memoizedState={element:r,isDehydrated:n,cache:null,transitions:null,pendingSuspenseBoundaries:null},Gl(s),t}function Zv(t,e,n){var r=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:On,key:r==null?null:""+r,children:t,containerInfo:e,implementation:n}}function ep(t){if(!t)return en;t=t._reactInternals;e:{if(Rn(t)!==t||t.tag!==1)throw Error(v(170));var e=t;do{switch(e.tag){case 3:e=e.stateNode.context;break e;case 1:if(Pe(e.type)){e=e.stateNode.__reactInternalMemoizedMergedChildContext;break e}}e=e.return}while(e!==null);throw Error(v(171))}if(t.tag===1){var n=t.type;if(Pe(n))return Zf(t,n,e)}return e}function tp(t,e,n,r,i,s,o,a,l){return t=cu(n,r,!0,t,i,s,o,a,l),t.context=ep(null),n=t.current,r=_e(),i=qt(n),s=St(r,i),s.callback=e??null,Kt(n,s,i),t.current.lanes=i,_i(t,i,r),Ce(t,r),t}function po(t,e,n,r){var i=e.current,s=_e(),o=qt(i);return n=ep(n),e.context===null?e.context=n:e.pendingContext=n,e=St(s,o),e.payload={element:t},r=r===void 0?null:r,r!==null&&(e.callback=r),t=Kt(i,e,o),t!==null&&(Xe(t,i,o,s),ns(t,i,o)),o}function bs(t){if(t=t.current,!t.child)return null;switch(t.child.tag){case 5:return t.child.stateNode;default:return t.child.stateNode}}function qc(t,e){if(t=t.memoizedState,t!==null&&t.dehydrated!==null){var n=t.retryLane;t.retryLane=n!==0&&n<e?n:e}}function du(t,e){qc(t,e),(t=t.alternate)&&qc(t,e)}function ey(){return null}var np=typeof reportError=="function"?reportError:function(t){console.error(t)};function fu(t){this._internalRoot=t}mo.prototype.render=fu.prototype.render=function(t){var e=this._internalRoot;if(e===null)throw Error(v(409));po(t,e,null,null)};mo.prototype.unmount=fu.prototype.unmount=function(){var t=this._internalRoot;if(t!==null){this._internalRoot=null;var e=t.containerInfo;In(function(){po(null,t,null,null)}),e[Tt]=null}};function mo(t){this._internalRoot=t}mo.prototype.unstable_scheduleHydration=function(t){if(t){var e=xf();t={blockedOn:null,target:t,priority:e};for(var n=0;n<Mt.length&&e!==0&&e<Mt[n].priority;n++);Mt.splice(n,0,t),n===0&&Lf(t)}};function hu(t){return!(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11)}function go(t){return!(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11&&(t.nodeType!==8||t.nodeValue!==" react-mount-point-unstable "))}function Qc(){}function ty(t,e,n,r,i){if(i){if(typeof r=="function"){var s=r;r=function(){var u=bs(o);s.call(u)}}var o=tp(e,r,t,0,null,!1,!1,"",Qc);return t._reactRootContainer=o,t[Tt]=o.current,ti(t.nodeType===8?t.parentNode:t),In(),o}for(;i=t.lastChild;)t.removeChild(i);if(typeof r=="function"){var a=r;r=function(){var u=bs(l);a.call(u)}}var l=cu(t,0,!1,null,null,!1,!1,"",Qc);return t._reactRootContainer=l,t[Tt]=l.current,ti(t.nodeType===8?t.parentNode:t),In(function(){po(e,l,n,r)}),l}function vo(t,e,n,r,i){var s=n._reactRootContainer;if(s){var o=s;if(typeof i=="function"){var a=i;i=function(){var l=bs(o);a.call(l)}}po(e,o,t,i)}else o=ty(n,e,t,i,r);return bs(o)}Nf=function(t){switch(t.tag){case 3:var e=t.stateNode;if(e.current.memoizedState.isDehydrated){var n=Nr(e.pendingLanes);n!==0&&(xl(e,n|1),Ce(e,X()),!(M&6)&&(ir=X()+500,rn()))}break;case 13:In(function(){var r=kt(t,1);if(r!==null){var i=_e();Xe(r,t,1,i)}}),du(t,1)}};Dl=function(t){if(t.tag===13){var e=kt(t,134217728);if(e!==null){var n=_e();Xe(e,t,134217728,n)}du(t,134217728)}};Of=function(t){if(t.tag===13){var e=qt(t),n=kt(t,e);if(n!==null){var r=_e();Xe(n,t,e,r)}du(t,e)}};xf=function(){return z};Df=function(t,e){var n=z;try{return z=t,e()}finally{z=n}};Pa=function(t,e,n){switch(e){case"input":if(_a(t,n),e=n.name,n.type==="radio"&&e!=null){for(n=t;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll("input[name="+JSON.stringify(""+e)+'][type="radio"]'),e=0;e<n.length;e++){var r=n[e];if(r!==t&&r.form===t.form){var i=oo(r);if(!i)throw Error(v(90));cf(r),_a(r,i)}}}break;case"textarea":ff(t,n);break;case"select":e=n.value,e!=null&&Bn(t,!!n.multiple,e,!1)}};_f=ou;wf=In;var ny={usingClientEntryPoint:!1,Events:[Ei,bn,oo,vf,yf,ou]},Pr={findFiberByHostInstance:cn,bundleType:0,version:"18.2.0",rendererPackageName:"react-dom"},ry={bundleType:Pr.bundleType,version:Pr.version,rendererPackageName:Pr.rendererPackageName,rendererConfig:Pr.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:At.ReactCurrentDispatcher,findHostInstanceByFiber:function(t){return t=If(t),t===null?null:t.stateNode},findFiberByHostInstance:Pr.findFiberByHostInstance||ey,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.2.0-next-9e3b772b8-20220608"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var Gi=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!Gi.isDisabled&&Gi.supportsFiber)try{no=Gi.inject(ry),st=Gi}catch{}}Me.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=ny;Me.createPortal=function(t,e){var n=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!hu(e))throw Error(v(200));return Zv(t,e,null,n)};Me.createRoot=function(t,e){if(!hu(t))throw Error(v(299));var n=!1,r="",i=np;return e!=null&&(e.unstable_strictMode===!0&&(n=!0),e.identifierPrefix!==void 0&&(r=e.identifierPrefix),e.onRecoverableError!==void 0&&(i=e.onRecoverableError)),e=cu(t,1,!1,null,null,n,!1,r,i),t[Tt]=e.current,ti(t.nodeType===8?t.parentNode:t),new fu(e)};Me.findDOMNode=function(t){if(t==null)return null;if(t.nodeType===1)return t;var e=t._reactInternals;if(e===void 0)throw typeof t.render=="function"?Error(v(188)):(t=Object.keys(t).join(","),Error(v(268,t)));return t=If(e),t=t===null?null:t.stateNode,t};Me.flushSync=function(t){return In(t)};Me.hydrate=function(t,e,n){if(!go(e))throw Error(v(200));return vo(null,t,e,!0,n)};Me.hydrateRoot=function(t,e,n){if(!hu(t))throw Error(v(405));var r=n!=null&&n.hydratedSources||null,i=!1,s="",o=np;if(n!=null&&(n.unstable_strictMode===!0&&(i=!0),n.identifierPrefix!==void 0&&(s=n.identifierPrefix),n.onRecoverableError!==void 0&&(o=n.onRecoverableError)),e=tp(e,null,t,1,n??null,i,!1,s,o),t[Tt]=e.current,ti(t),r)for(t=0;t<r.length;t++)n=r[t],i=n._getVersion,i=i(n._source),e.mutableSourceEagerHydrationData==null?e.mutableSourceEagerHydrationData=[n,i]:e.mutableSourceEagerHydrationData.push(n,i);return new mo(e)};Me.render=function(t,e,n){if(!go(e))throw Error(v(200));return vo(null,t,e,!1,n)};Me.unmountComponentAtNode=function(t){if(!go(t))throw Error(v(40));return t._reactRootContainer?(In(function(){vo(null,null,t,!1,function(){t._reactRootContainer=null,t[Tt]=null})}),!0):!1};Me.unstable_batchedUpdates=ou;Me.unstable_renderSubtreeIntoContainer=function(t,e,n,r){if(!go(n))throw Error(v(200));if(t==null||t._reactInternals===void 0)throw Error(v(38));return vo(t,e,n,!1,r)};Me.version="18.2.0-next-9e3b772b8-20220608";function rp(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(rp)}catch(t){console.error(t)}}rp(),ef.exports=Me;var iy=ef.exports,Yc=iy;fa.createRoot=Yc.createRoot,fa.hydrateRoot=Yc.hydrateRoot;const sy=9;class oy{constructor(e,n){An(this,"isRunning",!1);An(this,"container");An(this,"className");An(this,"handleKeyDown",e=>{e.which===sy&&(this.reset(),this.container.addEventListener("mousedown",this.handleMouseDown))});An(this,"handleMouseDown",()=>{this.reset(),this.container.classList.add(this.className),this.container.addEventListener("keydown",this.handleKeyDown)});this.container=e,this.className=n}isActive(){return this.isRunning}start(){this.container.addEventListener("mousedown",this.handleMouseDown),this.isRunning=!0}stop(){this.reset(),this.isRunning=!1}reset(){this.container.classList.remove(this.className),this.container.removeEventListener("keydown",this.handleKeyDown),this.container.removeEventListener("mousedown",this.handleMouseDown)}}function ay(t,e){return new oy(t,e)}var Jc={};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ip=function(t){const e=[];let n=0;for(let r=0;r<t.length;r++){let i=t.charCodeAt(r);i<128?e[n++]=i:i<2048?(e[n++]=i>>6|192,e[n++]=i&63|128):(i&64512)===55296&&r+1<t.length&&(t.charCodeAt(r+1)&64512)===56320?(i=65536+((i&1023)<<10)+(t.charCodeAt(++r)&1023),e[n++]=i>>18|240,e[n++]=i>>12&63|128,e[n++]=i>>6&63|128,e[n++]=i&63|128):(e[n++]=i>>12|224,e[n++]=i>>6&63|128,e[n++]=i&63|128)}return e},ly=function(t){const e=[];let n=0,r=0;for(;n<t.length;){const i=t[n++];if(i<128)e[r++]=String.fromCharCode(i);else if(i>191&&i<224){const s=t[n++];e[r++]=String.fromCharCode((i&31)<<6|s&63)}else if(i>239&&i<365){const s=t[n++],o=t[n++],a=t[n++],l=((i&7)<<18|(s&63)<<12|(o&63)<<6|a&63)-65536;e[r++]=String.fromCharCode(55296+(l>>10)),e[r++]=String.fromCharCode(56320+(l&1023))}else{const s=t[n++],o=t[n++];e[r++]=String.fromCharCode((i&15)<<12|(s&63)<<6|o&63)}}return e.join("")},sp={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(t,e){if(!Array.isArray(t))throw Error("encodeByteArray takes an array as a parameter");this.init_();const n=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[];for(let i=0;i<t.length;i+=3){const s=t[i],o=i+1<t.length,a=o?t[i+1]:0,l=i+2<t.length,u=l?t[i+2]:0,m=s>>2,h=(s&3)<<4|a>>4;let p=(a&15)<<2|u>>6,y=u&63;l||(y=64,o||(p=64)),r.push(n[m],n[h],n[p],n[y])}return r.join("")},encodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(t):this.encodeByteArray(ip(t),e)},decodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(t):ly(this.decodeStringToByteArray(t,e))},decodeStringToByteArray(t,e){this.init_();const n=e?this.charToByteMapWebSafe_:this.charToByteMap_,r=[];for(let i=0;i<t.length;){const s=n[t.charAt(i++)],a=i<t.length?n[t.charAt(i)]:0;++i;const u=i<t.length?n[t.charAt(i)]:64;++i;const h=i<t.length?n[t.charAt(i)]:64;if(++i,s==null||a==null||u==null||h==null)throw new uy;const p=s<<2|a>>4;if(r.push(p),u!==64){const y=a<<4&240|u>>2;if(r.push(y),h!==64){const w=u<<6&192|h;r.push(w)}}}return r},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let t=0;t<this.ENCODED_VALS.length;t++)this.byteToCharMap_[t]=this.ENCODED_VALS.charAt(t),this.charToByteMap_[this.byteToCharMap_[t]]=t,this.byteToCharMapWebSafe_[t]=this.ENCODED_VALS_WEBSAFE.charAt(t),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[t]]=t,t>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(t)]=t,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(t)]=t)}}};class uy extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const cy=function(t){const e=ip(t);return sp.encodeByteArray(e,!0)},Vs=function(t){return cy(t).replace(/\./g,"")},op=function(t){try{return sp.decodeString(t,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function dy(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const fy=()=>dy().__FIREBASE_DEFAULTS__,hy=()=>{if(typeof process>"u"||typeof Jc>"u")return;const t=Jc.__FIREBASE_DEFAULTS__;if(t)return JSON.parse(t)},py=()=>{if(typeof document>"u")return;let t;try{t=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=t&&op(t[1]);return e&&JSON.parse(e)},pu=()=>{try{return fy()||hy()||py()}catch(t){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${t}`);return}},ap=t=>{var e,n;return(n=(e=pu())===null||e===void 0?void 0:e.emulatorHosts)===null||n===void 0?void 0:n[t]},my=t=>{const e=ap(t);if(!e)return;const n=e.lastIndexOf(":");if(n<=0||n+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const r=parseInt(e.substring(n+1),10);return e[0]==="["?[e.substring(1,n-1),r]:[e.substring(0,n),r]},lp=()=>{var t;return(t=pu())===null||t===void 0?void 0:t.config},up=t=>{var e;return(e=pu())===null||e===void 0?void 0:e[`_${t}`]};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gy{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,n)=>{this.resolve=e,this.reject=n})}wrapCallback(e){return(n,r)=>{n?this.reject(n):this.resolve(r),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(n):e(n,r))}}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function vy(t,e){if(t.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const n={alg:"none",type:"JWT"},r=e||"demo-project",i=t.iat||0,s=t.sub||t.user_id;if(!s)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const o=Object.assign({iss:`https://securetoken.google.com/${r}`,aud:r,iat:i,exp:i+3600,auth_time:i,sub:s,user_id:s,firebase:{sign_in_provider:"custom",identities:{}}},t);return[Vs(JSON.stringify(n)),Vs(JSON.stringify(o)),""].join(".")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ve(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function yy(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(ve())}function _y(){const t=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof t=="object"&&t.id!==void 0}function wy(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function Ey(){const t=ve();return t.indexOf("MSIE ")>=0||t.indexOf("Trident/")>=0}function Sy(){try{return typeof indexedDB=="object"}catch{return!1}}function Iy(){return new Promise((t,e)=>{try{let n=!0;const r="validate-browser-context-for-indexeddb-analytics-module",i=self.indexedDB.open(r);i.onsuccess=()=>{i.result.close(),n||self.indexedDB.deleteDatabase(r),t(!0)},i.onupgradeneeded=()=>{n=!1},i.onerror=()=>{var s;e(((s=i.error)===null||s===void 0?void 0:s.message)||"")}}catch(n){e(n)}})}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ty="FirebaseError";class Nt extends Error{constructor(e,n,r){super(n),this.code=e,this.customData=r,this.name=Ty,Object.setPrototypeOf(this,Nt.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,Ii.prototype.create)}}class Ii{constructor(e,n,r){this.service=e,this.serviceName=n,this.errors=r}create(e,...n){const r=n[0]||{},i=`${this.service}/${e}`,s=this.errors[e],o=s?ky(s,r):"Error",a=`${this.serviceName}: ${o} (${i}).`;return new Nt(i,a,r)}}function ky(t,e){return t.replace(Py,(n,r)=>{const i=e[r];return i!=null?String(i):`<${r}?>`})}const Py=/\{\$([^}]+)}/g;function Cy(t){for(const e in t)if(Object.prototype.hasOwnProperty.call(t,e))return!1;return!0}function js(t,e){if(t===e)return!0;const n=Object.keys(t),r=Object.keys(e);for(const i of n){if(!r.includes(i))return!1;const s=t[i],o=e[i];if(Xc(s)&&Xc(o)){if(!js(s,o))return!1}else if(s!==o)return!1}for(const i of r)if(!n.includes(i))return!1;return!0}function Xc(t){return t!==null&&typeof t=="object"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ti(t){const e=[];for(const[n,r]of Object.entries(t))Array.isArray(r)?r.forEach(i=>{e.push(encodeURIComponent(n)+"="+encodeURIComponent(i))}):e.push(encodeURIComponent(n)+"="+encodeURIComponent(r));return e.length?"&"+e.join("&"):""}function Ry(t,e){const n=new Ay(t,e);return n.subscribe.bind(n)}class Ay{constructor(e,n){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=n,this.task.then(()=>{e(this)}).catch(r=>{this.error(r)})}next(e){this.forEachObserver(n=>{n.next(e)})}error(e){this.forEachObserver(n=>{n.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,n,r){let i;if(e===void 0&&n===void 0&&r===void 0)throw new Error("Missing Observer.");Ny(e,["next","error","complete"])?i=e:i={next:e,error:n,complete:r},i.next===void 0&&(i.next=ta),i.error===void 0&&(i.error=ta),i.complete===void 0&&(i.complete=ta);const s=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?i.error(this.finalError):i.complete()}catch{}}),this.observers.push(i),s}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let n=0;n<this.observers.length;n++)this.sendOne(n,e)}sendOne(e,n){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{n(this.observers[e])}catch(r){typeof console<"u"&&console.error&&console.error(r)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function Ny(t,e){if(typeof t!="object"||t===null)return!1;for(const n of e)if(n in t&&typeof t[n]=="function")return!0;return!1}function ta(){}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function lt(t){return t&&t._delegate?t._delegate:t}class Tn{constructor(e,n,r){this.name=e,this.instanceFactory=n,this.type=r,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const un="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Oy{constructor(e,n){this.name=e,this.container=n,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const n=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(n)){const r=new gy;if(this.instancesDeferred.set(n,r),this.isInitialized(n)||this.shouldAutoInitialize())try{const i=this.getOrInitializeService({instanceIdentifier:n});i&&r.resolve(i)}catch{}}return this.instancesDeferred.get(n).promise}getImmediate(e){var n;const r=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),i=(n=e==null?void 0:e.optional)!==null&&n!==void 0?n:!1;if(this.isInitialized(r)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:r})}catch(s){if(i)return null;throw s}else{if(i)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(Dy(e))try{this.getOrInitializeService({instanceIdentifier:un})}catch{}for(const[n,r]of this.instancesDeferred.entries()){const i=this.normalizeInstanceIdentifier(n);try{const s=this.getOrInitializeService({instanceIdentifier:i});r.resolve(s)}catch{}}}}clearInstance(e=un){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(n=>"INTERNAL"in n).map(n=>n.INTERNAL.delete()),...e.filter(n=>"_delete"in n).map(n=>n._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=un){return this.instances.has(e)}getOptions(e=un){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:n={}}=e,r=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(r))throw Error(`${this.name}(${r}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const i=this.getOrInitializeService({instanceIdentifier:r,options:n});for(const[s,o]of this.instancesDeferred.entries()){const a=this.normalizeInstanceIdentifier(s);r===a&&o.resolve(i)}return i}onInit(e,n){var r;const i=this.normalizeInstanceIdentifier(n),s=(r=this.onInitCallbacks.get(i))!==null&&r!==void 0?r:new Set;s.add(e),this.onInitCallbacks.set(i,s);const o=this.instances.get(i);return o&&e(o,i),()=>{s.delete(e)}}invokeOnInitCallbacks(e,n){const r=this.onInitCallbacks.get(n);if(r)for(const i of r)try{i(e,n)}catch{}}getOrInitializeService({instanceIdentifier:e,options:n={}}){let r=this.instances.get(e);if(!r&&this.component&&(r=this.component.instanceFactory(this.container,{instanceIdentifier:xy(e),options:n}),this.instances.set(e,r),this.instancesOptions.set(e,n),this.invokeOnInitCallbacks(r,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,r)}catch{}return r||null}normalizeInstanceIdentifier(e=un){return this.component?this.component.multipleInstances?e:un:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function xy(t){return t===un?void 0:t}function Dy(t){return t.instantiationMode==="EAGER"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ly{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const n=this.getProvider(e.name);if(n.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);n.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const n=new Oy(e,this);return this.providers.set(e,n),n}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var U;(function(t){t[t.DEBUG=0]="DEBUG",t[t.VERBOSE=1]="VERBOSE",t[t.INFO=2]="INFO",t[t.WARN=3]="WARN",t[t.ERROR=4]="ERROR",t[t.SILENT=5]="SILENT"})(U||(U={}));const My={debug:U.DEBUG,verbose:U.VERBOSE,info:U.INFO,warn:U.WARN,error:U.ERROR,silent:U.SILENT},by=U.INFO,Vy={[U.DEBUG]:"log",[U.VERBOSE]:"log",[U.INFO]:"info",[U.WARN]:"warn",[U.ERROR]:"error"},jy=(t,e,...n)=>{if(e<t.logLevel)return;const r=new Date().toISOString(),i=Vy[e];if(i)console[i](`[${r}]  ${t.name}:`,...n);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class mu{constructor(e){this.name=e,this._logLevel=by,this._logHandler=jy,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in U))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?My[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,U.DEBUG,...e),this._logHandler(this,U.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,U.VERBOSE,...e),this._logHandler(this,U.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,U.INFO,...e),this._logHandler(this,U.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,U.WARN,...e),this._logHandler(this,U.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,U.ERROR,...e),this._logHandler(this,U.ERROR,...e)}}const Uy=(t,e)=>e.some(n=>t instanceof n);let Zc,ed;function Fy(){return Zc||(Zc=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function zy(){return ed||(ed=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const cp=new WeakMap,sl=new WeakMap,dp=new WeakMap,na=new WeakMap,gu=new WeakMap;function $y(t){const e=new Promise((n,r)=>{const i=()=>{t.removeEventListener("success",s),t.removeEventListener("error",o)},s=()=>{n(Yt(t.result)),i()},o=()=>{r(t.error),i()};t.addEventListener("success",s),t.addEventListener("error",o)});return e.then(n=>{n instanceof IDBCursor&&cp.set(n,t)}).catch(()=>{}),gu.set(e,t),e}function By(t){if(sl.has(t))return;const e=new Promise((n,r)=>{const i=()=>{t.removeEventListener("complete",s),t.removeEventListener("error",o),t.removeEventListener("abort",o)},s=()=>{n(),i()},o=()=>{r(t.error||new DOMException("AbortError","AbortError")),i()};t.addEventListener("complete",s),t.addEventListener("error",o),t.addEventListener("abort",o)});sl.set(t,e)}let ol={get(t,e,n){if(t instanceof IDBTransaction){if(e==="done")return sl.get(t);if(e==="objectStoreNames")return t.objectStoreNames||dp.get(t);if(e==="store")return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return Yt(t[e])},set(t,e,n){return t[e]=n,!0},has(t,e){return t instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in t}};function Hy(t){ol=t(ol)}function Wy(t){return t===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...n){const r=t.call(ra(this),e,...n);return dp.set(r,e.sort?e.sort():[e]),Yt(r)}:zy().includes(t)?function(...e){return t.apply(ra(this),e),Yt(cp.get(this))}:function(...e){return Yt(t.apply(ra(this),e))}}function Ky(t){return typeof t=="function"?Wy(t):(t instanceof IDBTransaction&&By(t),Uy(t,Fy())?new Proxy(t,ol):t)}function Yt(t){if(t instanceof IDBRequest)return $y(t);if(na.has(t))return na.get(t);const e=Ky(t);return e!==t&&(na.set(t,e),gu.set(e,t)),e}const ra=t=>gu.get(t);function Gy(t,e,{blocked:n,upgrade:r,blocking:i,terminated:s}={}){const o=indexedDB.open(t,e),a=Yt(o);return r&&o.addEventListener("upgradeneeded",l=>{r(Yt(o.result),l.oldVersion,l.newVersion,Yt(o.transaction),l)}),n&&o.addEventListener("blocked",l=>n(l.oldVersion,l.newVersion,l)),a.then(l=>{s&&l.addEventListener("close",()=>s()),i&&l.addEventListener("versionchange",u=>i(u.oldVersion,u.newVersion,u))}).catch(()=>{}),a}const qy=["get","getKey","getAll","getAllKeys","count"],Qy=["put","add","delete","clear"],ia=new Map;function td(t,e){if(!(t instanceof IDBDatabase&&!(e in t)&&typeof e=="string"))return;if(ia.get(e))return ia.get(e);const n=e.replace(/FromIndex$/,""),r=e!==n,i=Qy.includes(n);if(!(n in(r?IDBIndex:IDBObjectStore).prototype)||!(i||qy.includes(n)))return;const s=async function(o,...a){const l=this.transaction(o,i?"readwrite":"readonly");let u=l.store;return r&&(u=u.index(a.shift())),(await Promise.all([u[n](...a),i&&l.done]))[0]};return ia.set(e,s),s}Hy(t=>({...t,get:(e,n,r)=>td(e,n)||t.get(e,n,r),has:(e,n)=>!!td(e,n)||t.has(e,n)}));/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Yy{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(n=>{if(Jy(n)){const r=n.getImmediate();return`${r.library}/${r.version}`}else return null}).filter(n=>n).join(" ")}}function Jy(t){const e=t.getComponent();return(e==null?void 0:e.type)==="VERSION"}const al="@firebase/app",nd="0.10.1";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const kn=new mu("@firebase/app"),Xy="@firebase/app-compat",Zy="@firebase/analytics-compat",e0="@firebase/analytics",t0="@firebase/app-check-compat",n0="@firebase/app-check",r0="@firebase/auth",i0="@firebase/auth-compat",s0="@firebase/database",o0="@firebase/database-compat",a0="@firebase/functions",l0="@firebase/functions-compat",u0="@firebase/installations",c0="@firebase/installations-compat",d0="@firebase/messaging",f0="@firebase/messaging-compat",h0="@firebase/performance",p0="@firebase/performance-compat",m0="@firebase/remote-config",g0="@firebase/remote-config-compat",v0="@firebase/storage",y0="@firebase/storage-compat",_0="@firebase/firestore",w0="@firebase/firestore-compat",E0="firebase",S0="10.11.0";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ll="[DEFAULT]",I0={[al]:"fire-core",[Xy]:"fire-core-compat",[e0]:"fire-analytics",[Zy]:"fire-analytics-compat",[n0]:"fire-app-check",[t0]:"fire-app-check-compat",[r0]:"fire-auth",[i0]:"fire-auth-compat",[s0]:"fire-rtdb",[o0]:"fire-rtdb-compat",[a0]:"fire-fn",[l0]:"fire-fn-compat",[u0]:"fire-iid",[c0]:"fire-iid-compat",[d0]:"fire-fcm",[f0]:"fire-fcm-compat",[h0]:"fire-perf",[p0]:"fire-perf-compat",[m0]:"fire-rc",[g0]:"fire-rc-compat",[v0]:"fire-gcs",[y0]:"fire-gcs-compat",[_0]:"fire-fst",[w0]:"fire-fst-compat","fire-js":"fire-js",[E0]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Us=new Map,T0=new Map,ul=new Map;function rd(t,e){try{t.container.addComponent(e)}catch(n){kn.debug(`Component ${e.name} failed to register with FirebaseApp ${t.name}`,n)}}function sr(t){const e=t.name;if(ul.has(e))return kn.debug(`There were multiple attempts to register component ${e}.`),!1;ul.set(e,t);for(const n of Us.values())rd(n,t);for(const n of T0.values())rd(n,t);return!0}function vu(t,e){const n=t.container.getProvider("heartbeat").getImmediate({optional:!0});return n&&n.triggerHeartbeat(),t.container.getProvider(e)}function gt(t){return t.settings!==void 0}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const k0={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},Jt=new Ii("app","Firebase",k0);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class P0{constructor(e,n,r){this._isDeleted=!1,this._options=Object.assign({},e),this._config=Object.assign({},n),this._name=n.name,this._automaticDataCollectionEnabled=n.automaticDataCollectionEnabled,this._container=r,this.container.addComponent(new Tn("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw Jt.create("app-deleted",{appName:this._name})}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const hr=S0;function fp(t,e={}){let n=t;typeof e!="object"&&(e={name:e});const r=Object.assign({name:ll,automaticDataCollectionEnabled:!1},e),i=r.name;if(typeof i!="string"||!i)throw Jt.create("bad-app-name",{appName:String(i)});if(n||(n=lp()),!n)throw Jt.create("no-options");const s=Us.get(i);if(s){if(js(n,s.options)&&js(r,s.config))return s;throw Jt.create("duplicate-app",{appName:i})}const o=new Ly(i);for(const l of ul.values())o.addComponent(l);const a=new P0(n,r,o);return Us.set(i,a),a}function hp(t=ll){const e=Us.get(t);if(!e&&t===ll&&lp())return fp();if(!e)throw Jt.create("no-app",{appName:t});return e}function Xt(t,e,n){var r;let i=(r=I0[t])!==null&&r!==void 0?r:t;n&&(i+=`-${n}`);const s=i.match(/\s|\//),o=e.match(/\s|\//);if(s||o){const a=[`Unable to register library "${i}" with version "${e}":`];s&&a.push(`library name "${i}" contains illegal characters (whitespace or "/")`),s&&o&&a.push("and"),o&&a.push(`version name "${e}" contains illegal characters (whitespace or "/")`),kn.warn(a.join(" "));return}sr(new Tn(`${i}-version`,()=>({library:i,version:e}),"VERSION"))}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const C0="firebase-heartbeat-database",R0=1,ci="firebase-heartbeat-store";let sa=null;function pp(){return sa||(sa=Gy(C0,R0,{upgrade:(t,e)=>{switch(e){case 0:try{t.createObjectStore(ci)}catch(n){console.warn(n)}}}}).catch(t=>{throw Jt.create("idb-open",{originalErrorMessage:t.message})})),sa}async function A0(t){try{const n=(await pp()).transaction(ci),r=await n.objectStore(ci).get(mp(t));return await n.done,r}catch(e){if(e instanceof Nt)kn.warn(e.message);else{const n=Jt.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});kn.warn(n.message)}}}async function id(t,e){try{const r=(await pp()).transaction(ci,"readwrite");await r.objectStore(ci).put(e,mp(t)),await r.done}catch(n){if(n instanceof Nt)kn.warn(n.message);else{const r=Jt.create("idb-set",{originalErrorMessage:n==null?void 0:n.message});kn.warn(r.message)}}}function mp(t){return`${t.name}!${t.options.appId}`}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const N0=1024,O0=30*24*60*60*1e3;class x0{constructor(e){this.container=e,this._heartbeatsCache=null;const n=this.container.getProvider("app").getImmediate();this._storage=new L0(n),this._heartbeatsCachePromise=this._storage.read().then(r=>(this._heartbeatsCache=r,r))}async triggerHeartbeat(){var e,n;const i=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),s=sd();if(!(((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((n=this._heartbeatsCache)===null||n===void 0?void 0:n.heartbeats)==null))&&!(this._heartbeatsCache.lastSentHeartbeatDate===s||this._heartbeatsCache.heartbeats.some(o=>o.date===s)))return this._heartbeatsCache.heartbeats.push({date:s,agent:i}),this._heartbeatsCache.heartbeats=this._heartbeatsCache.heartbeats.filter(o=>{const a=new Date(o.date).valueOf();return Date.now()-a<=O0}),this._storage.overwrite(this._heartbeatsCache)}async getHeartbeatsHeader(){var e;if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const n=sd(),{heartbeatsToSend:r,unsentEntries:i}=D0(this._heartbeatsCache.heartbeats),s=Vs(JSON.stringify({version:2,heartbeats:r}));return this._heartbeatsCache.lastSentHeartbeatDate=n,i.length>0?(this._heartbeatsCache.heartbeats=i,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),s}}function sd(){return new Date().toISOString().substring(0,10)}function D0(t,e=N0){const n=[];let r=t.slice();for(const i of t){const s=n.find(o=>o.agent===i.agent);if(s){if(s.dates.push(i.date),od(n)>e){s.dates.pop();break}}else if(n.push({agent:i.agent,dates:[i.date]}),od(n)>e){n.pop();break}r=r.slice(1)}return{heartbeatsToSend:n,unsentEntries:r}}class L0{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return Sy()?Iy().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const n=await A0(this.app);return n!=null&&n.heartbeats?n:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){var n;if(await this._canUseIndexedDBPromise){const i=await this.read();return id(this.app,{lastSentHeartbeatDate:(n=e.lastSentHeartbeatDate)!==null&&n!==void 0?n:i.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){var n;if(await this._canUseIndexedDBPromise){const i=await this.read();return id(this.app,{lastSentHeartbeatDate:(n=e.lastSentHeartbeatDate)!==null&&n!==void 0?n:i.lastSentHeartbeatDate,heartbeats:[...i.heartbeats,...e.heartbeats]})}else return}}function od(t){return Vs(JSON.stringify({version:2,heartbeats:t})).length}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function M0(t){sr(new Tn("platform-logger",e=>new Yy(e),"PRIVATE")),sr(new Tn("heartbeat",e=>new x0(e),"PRIVATE")),Xt(al,nd,t),Xt(al,nd,"esm2017"),Xt("fire-js","")}M0("");var b0="firebase",V0="10.11.0";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */Xt(b0,V0,"app");function yu(t,e){var n={};for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&e.indexOf(r)<0&&(n[r]=t[r]);if(t!=null&&typeof Object.getOwnPropertySymbols=="function")for(var i=0,r=Object.getOwnPropertySymbols(t);i<r.length;i++)e.indexOf(r[i])<0&&Object.prototype.propertyIsEnumerable.call(t,r[i])&&(n[r[i]]=t[r[i]]);return n}function gp(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const j0=gp,vp=new Ii("auth","Firebase",gp());/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Fs=new mu("@firebase/auth");function U0(t,...e){Fs.logLevel<=U.WARN&&Fs.warn(`Auth (${hr}): ${t}`,...e)}function us(t,...e){Fs.logLevel<=U.ERROR&&Fs.error(`Auth (${hr}): ${t}`,...e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ut(t,...e){throw wu(t,...e)}function Ze(t,...e){return wu(t,...e)}function _u(t,e,n){const r=Object.assign(Object.assign({},j0()),{[e]:n});return new Ii("auth","Firebase",r).create(e,{appName:t.name})}function vn(t){return _u(t,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function F0(t,e,n){const r=n;if(!(e instanceof r))throw r.name!==e.constructor.name&&ut(t,"argument-error"),_u(t,"argument-error",`Type of ${e.constructor.name} does not match expected instance.Did you pass a reference from a different Auth SDK?`)}function wu(t,...e){if(typeof t!="string"){const n=e[0],r=[...e.slice(1)];return r[0]&&(r[0].appName=t.name),t._errorFactory.create(n,...r)}return vp.create(t,...e)}function R(t,e,...n){if(!t)throw wu(e,...n)}function vt(t){const e="INTERNAL ASSERTION FAILED: "+t;throw us(e),new Error(e)}function Ct(t,e){t||vt(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function cl(){var t;return typeof self<"u"&&((t=self.location)===null||t===void 0?void 0:t.href)||""}function z0(){return ad()==="http:"||ad()==="https:"}function ad(){var t;return typeof self<"u"&&((t=self.location)===null||t===void 0?void 0:t.protocol)||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function $0(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(z0()||_y()||"connection"in navigator)?navigator.onLine:!0}function B0(){if(typeof navigator>"u")return null;const t=navigator;return t.languages&&t.languages[0]||t.language||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ki{constructor(e,n){this.shortDelay=e,this.longDelay=n,Ct(n>e,"Short delay should be less than long delay!"),this.isMobile=yy()||wy()}get(){return $0()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Eu(t,e){Ct(t.emulator,"Emulator should always be set here");const{url:n}=t.emulator;return e?`${n}${e.startsWith("/")?e.slice(1):e}`:n}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yp{static initialize(e,n,r){this.fetchImpl=e,n&&(this.headersImpl=n),r&&(this.responseImpl=r)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;vt("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;vt("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;vt("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const H0={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const W0=new ki(3e4,6e4);function Su(t,e){return t.tenantId&&!e.tenantId?Object.assign(Object.assign({},e),{tenantId:t.tenantId}):e}async function pr(t,e,n,r,i={}){return _p(t,i,async()=>{let s={},o={};r&&(e==="GET"?o=r:s={body:JSON.stringify(r)});const a=Ti(Object.assign({key:t.config.apiKey},o)).slice(1),l=await t._getAdditionalHeaders();return l["Content-Type"]="application/json",t.languageCode&&(l["X-Firebase-Locale"]=t.languageCode),yp.fetch()(wp(t,t.config.apiHost,n,a),Object.assign({method:e,headers:l,referrerPolicy:"no-referrer"},s))})}async function _p(t,e,n){t._canInitEmulator=!1;const r=Object.assign(Object.assign({},H0),e);try{const i=new G0(t),s=await Promise.race([n(),i.promise]);i.clearNetworkTimeout();const o=await s.json();if("needConfirmation"in o)throw qi(t,"account-exists-with-different-credential",o);if(s.ok&&!("errorMessage"in o))return o;{const a=s.ok?o.errorMessage:o.error.message,[l,u]=a.split(" : ");if(l==="FEDERATED_USER_ID_ALREADY_LINKED")throw qi(t,"credential-already-in-use",o);if(l==="EMAIL_EXISTS")throw qi(t,"email-already-in-use",o);if(l==="USER_DISABLED")throw qi(t,"user-disabled",o);const m=r[l]||l.toLowerCase().replace(/[_\s]+/g,"-");if(u)throw _u(t,m,u);ut(t,m)}}catch(i){if(i instanceof Nt)throw i;ut(t,"network-request-failed",{message:String(i)})}}async function K0(t,e,n,r,i={}){const s=await pr(t,e,n,r,i);return"mfaPendingCredential"in s&&ut(t,"multi-factor-auth-required",{_serverResponse:s}),s}function wp(t,e,n,r){const i=`${e}${n}?${r}`;return t.config.emulator?Eu(t.config,i):`${t.config.apiScheme}://${i}`}class G0{constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((n,r)=>{this.timer=setTimeout(()=>r(Ze(this.auth,"network-request-failed")),W0.get())})}clearNetworkTimeout(){clearTimeout(this.timer)}}function qi(t,e,n){const r={appName:t.name};n.email&&(r.email=n.email),n.phoneNumber&&(r.phoneNumber=n.phoneNumber);const i=Ze(t,e,r);return i.customData._tokenResponse=n,i}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function q0(t,e){return pr(t,"POST","/v1/accounts:delete",e)}async function Ep(t,e){return pr(t,"POST","/v1/accounts:lookup",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function zr(t){if(t)try{const e=new Date(Number(t));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function Q0(t,e=!1){const n=lt(t),r=await n.getIdToken(e),i=Iu(r);R(i&&i.exp&&i.auth_time&&i.iat,n.auth,"internal-error");const s=typeof i.firebase=="object"?i.firebase:void 0,o=s==null?void 0:s.sign_in_provider;return{claims:i,token:r,authTime:zr(oa(i.auth_time)),issuedAtTime:zr(oa(i.iat)),expirationTime:zr(oa(i.exp)),signInProvider:o||null,signInSecondFactor:(s==null?void 0:s.sign_in_second_factor)||null}}function oa(t){return Number(t)*1e3}function Iu(t){const[e,n,r]=t.split(".");if(e===void 0||n===void 0||r===void 0)return us("JWT malformed, contained fewer than 3 sections"),null;try{const i=op(n);return i?JSON.parse(i):(us("Failed to decode base64 JWT payload"),null)}catch(i){return us("Caught error parsing JWT payload as JSON",i==null?void 0:i.toString()),null}}function ld(t){const e=Iu(t);return R(e,"internal-error"),R(typeof e.exp<"u","internal-error"),R(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function di(t,e,n=!1){if(n)return e;try{return await e}catch(r){throw r instanceof Nt&&Y0(r)&&t.auth.currentUser===t&&await t.auth.signOut(),r}}function Y0({code:t}){return t==="auth/user-disabled"||t==="auth/user-token-expired"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class J0{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){var n;if(e){const r=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),r}else{this.errorBackoff=3e4;const i=((n=this.user.stsTokenManager.expirationTime)!==null&&n!==void 0?n:0)-Date.now()-3e5;return Math.max(0,i)}}schedule(e=!1){if(!this.isRunning)return;const n=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},n)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){(e==null?void 0:e.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dl{constructor(e,n){this.createdAt=e,this.lastLoginAt=n,this._initializeTime()}_initializeTime(){this.lastSignInTime=zr(this.lastLoginAt),this.creationTime=zr(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function zs(t){var e;const n=t.auth,r=await t.getIdToken(),i=await di(t,Ep(n,{idToken:r}));R(i==null?void 0:i.users.length,n,"internal-error");const s=i.users[0];t._notifyReloadListener(s);const o=!((e=s.providerUserInfo)===null||e===void 0)&&e.length?Sp(s.providerUserInfo):[],a=Z0(t.providerData,o),l=t.isAnonymous,u=!(t.email&&s.passwordHash)&&!(a!=null&&a.length),m=l?u:!1,h={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:a,metadata:new dl(s.createdAt,s.lastLoginAt),isAnonymous:m};Object.assign(t,h)}async function X0(t){const e=lt(t);await zs(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function Z0(t,e){return[...t.filter(r=>!e.some(i=>i.providerId===r.providerId)),...e]}function Sp(t){return t.map(e=>{var{providerId:n}=e,r=yu(e,["providerId"]);return{providerId:n,uid:r.rawId||"",displayName:r.displayName||null,email:r.email||null,phoneNumber:r.phoneNumber||null,photoURL:r.photoUrl||null}})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function e_(t,e){const n=await _p(t,{},async()=>{const r=Ti({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:i,apiKey:s}=t.config,o=wp(t,i,"/v1/token",`key=${s}`),a=await t._getAdditionalHeaders();return a["Content-Type"]="application/x-www-form-urlencoded",yp.fetch()(o,{method:"POST",headers:a,body:r})});return{accessToken:n.access_token,expiresIn:n.expires_in,refreshToken:n.refresh_token}}async function t_(t,e){return pr(t,"POST","/v2/accounts:revokeToken",Su(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qn{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){R(e.idToken,"internal-error"),R(typeof e.idToken<"u","internal-error"),R(typeof e.refreshToken<"u","internal-error");const n="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):ld(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,n)}updateFromIdToken(e){R(e.length!==0,"internal-error");const n=ld(e);this.updateTokensAndExpiration(e,null,n)}async getToken(e,n=!1){return!n&&this.accessToken&&!this.isExpired?this.accessToken:(R(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,n){const{accessToken:r,refreshToken:i,expiresIn:s}=await e_(e,n);this.updateTokensAndExpiration(r,i,Number(s))}updateTokensAndExpiration(e,n,r){this.refreshToken=n||null,this.accessToken=e||null,this.expirationTime=Date.now()+r*1e3}static fromJSON(e,n){const{refreshToken:r,accessToken:i,expirationTime:s}=n,o=new Qn;return r&&(R(typeof r=="string","internal-error",{appName:e}),o.refreshToken=r),i&&(R(typeof i=="string","internal-error",{appName:e}),o.accessToken=i),s&&(R(typeof s=="number","internal-error",{appName:e}),o.expirationTime=s),o}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new Qn,this.toJSON())}_performRefresh(){return vt("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function xt(t,e){R(typeof t=="string"||typeof t>"u","internal-error",{appName:e})}class yt{constructor(e){var{uid:n,auth:r,stsTokenManager:i}=e,s=yu(e,["uid","auth","stsTokenManager"]);this.providerId="firebase",this.proactiveRefresh=new J0(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=n,this.auth=r,this.stsTokenManager=i,this.accessToken=i.accessToken,this.displayName=s.displayName||null,this.email=s.email||null,this.emailVerified=s.emailVerified||!1,this.phoneNumber=s.phoneNumber||null,this.photoURL=s.photoURL||null,this.isAnonymous=s.isAnonymous||!1,this.tenantId=s.tenantId||null,this.providerData=s.providerData?[...s.providerData]:[],this.metadata=new dl(s.createdAt||void 0,s.lastLoginAt||void 0)}async getIdToken(e){const n=await di(this,this.stsTokenManager.getToken(this.auth,e));return R(n,this.auth,"internal-error"),this.accessToken!==n&&(this.accessToken=n,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),n}getIdTokenResult(e){return Q0(this,e)}reload(){return X0(this)}_assign(e){this!==e&&(R(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(n=>Object.assign({},n)),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const n=new yt(Object.assign(Object.assign({},this),{auth:e,stsTokenManager:this.stsTokenManager._clone()}));return n.metadata._copy(this.metadata),n}_onReload(e){R(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,n=!1){let r=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),r=!0),n&&await zs(this),await this.auth._persistUserIfCurrent(this),r&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(gt(this.auth.app))return Promise.reject(vn(this.auth));const e=await this.getIdToken();return await di(this,q0(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return Object.assign(Object.assign({uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>Object.assign({},e)),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId},this.metadata.toJSON()),{apiKey:this.auth.config.apiKey,appName:this.auth.name})}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,n){var r,i,s,o,a,l,u,m;const h=(r=n.displayName)!==null&&r!==void 0?r:void 0,p=(i=n.email)!==null&&i!==void 0?i:void 0,y=(s=n.phoneNumber)!==null&&s!==void 0?s:void 0,w=(o=n.photoURL)!==null&&o!==void 0?o:void 0,I=(a=n.tenantId)!==null&&a!==void 0?a:void 0,j=(l=n._redirectEventId)!==null&&l!==void 0?l:void 0,f=(u=n.createdAt)!==null&&u!==void 0?u:void 0,c=(m=n.lastLoginAt)!==null&&m!==void 0?m:void 0,{uid:d,emailVerified:g,isAnonymous:_,providerData:E,stsTokenManager:S}=n;R(d&&S,e,"internal-error");const P=Qn.fromJSON(this.name,S);R(typeof d=="string",e,"internal-error"),xt(h,e.name),xt(p,e.name),R(typeof g=="boolean",e,"internal-error"),R(typeof _=="boolean",e,"internal-error"),xt(y,e.name),xt(w,e.name),xt(I,e.name),xt(j,e.name),xt(f,e.name),xt(c,e.name);const b=new yt({uid:d,auth:e,email:p,emailVerified:g,displayName:h,isAnonymous:_,photoURL:w,phoneNumber:y,tenantId:I,stsTokenManager:P,createdAt:f,lastLoginAt:c});return E&&Array.isArray(E)&&(b.providerData=E.map(A=>Object.assign({},A))),j&&(b._redirectEventId=j),b}static async _fromIdTokenResponse(e,n,r=!1){const i=new Qn;i.updateFromServerResponse(n);const s=new yt({uid:n.localId,auth:e,stsTokenManager:i,isAnonymous:r});return await zs(s),s}static async _fromGetAccountInfoResponse(e,n,r){const i=n.users[0];R(i.localId!==void 0,"internal-error");const s=i.providerUserInfo!==void 0?Sp(i.providerUserInfo):[],o=!(i.email&&i.passwordHash)&&!(s!=null&&s.length),a=new Qn;a.updateFromIdToken(r);const l=new yt({uid:i.localId,auth:e,stsTokenManager:a,isAnonymous:o}),u={uid:i.localId,displayName:i.displayName||null,photoURL:i.photoUrl||null,email:i.email||null,emailVerified:i.emailVerified||!1,phoneNumber:i.phoneNumber||null,tenantId:i.tenantId||null,providerData:s,metadata:new dl(i.createdAt,i.lastLoginAt),isAnonymous:!(i.email&&i.passwordHash)&&!(s!=null&&s.length)};return Object.assign(l,u),l}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ud=new Map;function _t(t){Ct(t instanceof Function,"Expected a class definition");let e=ud.get(t);return e?(Ct(e instanceof t,"Instance stored in cache mismatched with class"),e):(e=new t,ud.set(t,e),e)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ip{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,n){this.storage[e]=n}async _get(e){const n=this.storage[e];return n===void 0?null:n}async _remove(e){delete this.storage[e]}_addListener(e,n){}_removeListener(e,n){}}Ip.type="NONE";const cd=Ip;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function cs(t,e,n){return`firebase:${t}:${e}:${n}`}class Yn{constructor(e,n,r){this.persistence=e,this.auth=n,this.userKey=r;const{config:i,name:s}=this.auth;this.fullUserKey=cs(this.userKey,i.apiKey,s),this.fullPersistenceKey=cs("persistence",i.apiKey,s),this.boundEventHandler=n._onStorageEvent.bind(n),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);return e?yt._fromJSON(this.auth,e):null}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const n=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,n)return this.setCurrentUser(n)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,n,r="authUser"){if(!n.length)return new Yn(_t(cd),e,r);const i=(await Promise.all(n.map(async u=>{if(await u._isAvailable())return u}))).filter(u=>u);let s=i[0]||_t(cd);const o=cs(r,e.config.apiKey,e.name);let a=null;for(const u of n)try{const m=await u._get(o);if(m){const h=yt._fromJSON(e,m);u!==s&&(a=h),s=u;break}}catch{}const l=i.filter(u=>u._shouldAllowMigration);return!s._shouldAllowMigration||!l.length?new Yn(s,e,r):(s=l[0],a&&await s._set(o,a.toJSON()),await Promise.all(n.map(async u=>{if(u!==s)try{await u._remove(o)}catch{}})),new Yn(s,e,r))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function dd(t){const e=t.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(Pp(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(Tp(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(Rp(e))return"Blackberry";if(Ap(e))return"Webos";if(Tu(e))return"Safari";if((e.includes("chrome/")||kp(e))&&!e.includes("edge/"))return"Chrome";if(Cp(e))return"Android";{const n=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,r=t.match(n);if((r==null?void 0:r.length)===2)return r[1]}return"Other"}function Tp(t=ve()){return/firefox\//i.test(t)}function Tu(t=ve()){const e=t.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function kp(t=ve()){return/crios\//i.test(t)}function Pp(t=ve()){return/iemobile/i.test(t)}function Cp(t=ve()){return/android/i.test(t)}function Rp(t=ve()){return/blackberry/i.test(t)}function Ap(t=ve()){return/webos/i.test(t)}function yo(t=ve()){return/iphone|ipad|ipod/i.test(t)||/macintosh/i.test(t)&&/mobile/i.test(t)}function n_(t=ve()){var e;return yo(t)&&!!(!((e=window.navigator)===null||e===void 0)&&e.standalone)}function r_(){return Ey()&&document.documentMode===10}function Np(t=ve()){return yo(t)||Cp(t)||Ap(t)||Rp(t)||/windows phone/i.test(t)||Pp(t)}function i_(){try{return!!(window&&window!==window.top)}catch{return!1}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Op(t,e=[]){let n;switch(t){case"Browser":n=dd(ve());break;case"Worker":n=`${dd(ve())}-${t}`;break;default:n=t}const r=e.length?e.join(","):"FirebaseCore-web";return`${n}/JsCore/${hr}/${r}`}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class s_{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,n){const r=s=>new Promise((o,a)=>{try{const l=e(s);o(l)}catch(l){a(l)}});r.onAbort=n,this.queue.push(r);const i=this.queue.length-1;return()=>{this.queue[i]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const n=[];try{for(const r of this.queue)await r(e),r.onAbort&&n.push(r.onAbort)}catch(r){n.reverse();for(const i of n)try{i()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:r==null?void 0:r.message})}}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function o_(t,e={}){return pr(t,"GET","/v2/passwordPolicy",Su(t,e))}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const a_=6;class l_{constructor(e){var n,r,i,s;const o=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=(n=o.minPasswordLength)!==null&&n!==void 0?n:a_,o.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=o.maxPasswordLength),o.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=o.containsLowercaseCharacter),o.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=o.containsUppercaseCharacter),o.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=o.containsNumericCharacter),o.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=o.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=(i=(r=e.allowedNonAlphanumericCharacters)===null||r===void 0?void 0:r.join(""))!==null&&i!==void 0?i:"",this.forceUpgradeOnSignin=(s=e.forceUpgradeOnSignin)!==null&&s!==void 0?s:!1,this.schemaVersion=e.schemaVersion}validatePassword(e){var n,r,i,s,o,a;const l={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,l),this.validatePasswordCharacterOptions(e,l),l.isValid&&(l.isValid=(n=l.meetsMinPasswordLength)!==null&&n!==void 0?n:!0),l.isValid&&(l.isValid=(r=l.meetsMaxPasswordLength)!==null&&r!==void 0?r:!0),l.isValid&&(l.isValid=(i=l.containsLowercaseLetter)!==null&&i!==void 0?i:!0),l.isValid&&(l.isValid=(s=l.containsUppercaseLetter)!==null&&s!==void 0?s:!0),l.isValid&&(l.isValid=(o=l.containsNumericCharacter)!==null&&o!==void 0?o:!0),l.isValid&&(l.isValid=(a=l.containsNonAlphanumericCharacter)!==null&&a!==void 0?a:!0),l}validatePasswordLengthOptions(e,n){const r=this.customStrengthOptions.minPasswordLength,i=this.customStrengthOptions.maxPasswordLength;r&&(n.meetsMinPasswordLength=e.length>=r),i&&(n.meetsMaxPasswordLength=e.length<=i)}validatePasswordCharacterOptions(e,n){this.updatePasswordCharacterOptionsStatuses(n,!1,!1,!1,!1);let r;for(let i=0;i<e.length;i++)r=e.charAt(i),this.updatePasswordCharacterOptionsStatuses(n,r>="a"&&r<="z",r>="A"&&r<="Z",r>="0"&&r<="9",this.allowedNonAlphanumericCharacters.includes(r))}updatePasswordCharacterOptionsStatuses(e,n,r,i,s){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=n)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=r)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=i)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=s))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class u_{constructor(e,n,r,i){this.app=e,this.heartbeatServiceProvider=n,this.appCheckServiceProvider=r,this.config=i,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new fd(this),this.idTokenSubscription=new fd(this),this.beforeStateQueue=new s_(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=vp,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=i.sdkClientVersion}_initializeWithPersistence(e,n){return n&&(this._popupRedirectResolver=_t(n)),this._initializationPromise=this.queue(async()=>{var r,i;if(!this._deleted&&(this.persistenceManager=await Yn.create(this,e),!this._deleted)){if(!((r=this._popupRedirectResolver)===null||r===void 0)&&r._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(n),this.lastNotifiedUid=((i=this.currentUser)===null||i===void 0?void 0:i.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const n=await Ep(this,{idToken:e}),r=await yt._fromGetAccountInfoResponse(this,n,e);await this.directlySetCurrentUser(r)}catch(n){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",n),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var n;if(gt(this.app)){const o=this.app.settings.authIdToken;return o?new Promise(a=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(o).then(a,a))}):this.directlySetCurrentUser(null)}const r=await this.assertedPersistence.getCurrentUser();let i=r,s=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const o=(n=this.redirectUser)===null||n===void 0?void 0:n._redirectEventId,a=i==null?void 0:i._redirectEventId,l=await this.tryRedirectSignIn(e);(!o||o===a)&&(l!=null&&l.user)&&(i=l.user,s=!0)}if(!i)return this.directlySetCurrentUser(null);if(!i._redirectEventId){if(s)try{await this.beforeStateQueue.runMiddleware(i)}catch(o){i=r,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(o))}return i?this.reloadAndSetCurrentUserOrClear(i):this.directlySetCurrentUser(null)}return R(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===i._redirectEventId?this.directlySetCurrentUser(i):this.reloadAndSetCurrentUserOrClear(i)}async tryRedirectSignIn(e){let n=null;try{n=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return n}async reloadAndSetCurrentUserOrClear(e){try{await zs(e)}catch(n){if((n==null?void 0:n.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=B0()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(gt(this.app))return Promise.reject(vn(this));const n=e?lt(e):null;return n&&R(n.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(n&&n._clone(this))}async _updateCurrentUser(e,n=!1){if(!this._deleted)return e&&R(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),n||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return gt(this.app)?Promise.reject(vn(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return gt(this.app)?Promise.reject(vn(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(_t(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const n=this._getPasswordPolicyInternal();return n.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):n.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await o_(this),n=new l_(e);this.tenantId===null?this._projectPasswordPolicy=n:this._tenantPasswordPolicies[this.tenantId]=n}_getPersistence(){return this.assertedPersistence.persistence.type}_updateErrorMap(e){this._errorFactory=new Ii("auth","Firebase",e())}onAuthStateChanged(e,n,r){return this.registerStateListener(this.authStateSubscription,e,n,r)}beforeAuthStateChanged(e,n){return this.beforeStateQueue.pushCallback(e,n)}onIdTokenChanged(e,n,r){return this.registerStateListener(this.idTokenSubscription,e,n,r)}authStateReady(){return new Promise((e,n)=>{if(this.currentUser)e();else{const r=this.onAuthStateChanged(()=>{r(),e()},n)}})}async revokeAccessToken(e){if(this.currentUser){const n=await this.currentUser.getIdToken(),r={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:n};this.tenantId!=null&&(r.tenantId=this.tenantId),await t_(this,r)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)===null||e===void 0?void 0:e.toJSON()}}async _setRedirectUser(e,n){const r=await this.getOrInitRedirectPersistenceManager(n);return e===null?r.removeCurrentUser():r.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const n=e&&_t(e)||this._popupRedirectResolver;R(n,this,"argument-error"),this.redirectPersistenceManager=await Yn.create(this,[_t(n._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var n,r;return this._isInitialized&&await this.queue(async()=>{}),((n=this._currentUser)===null||n===void 0?void 0:n._redirectEventId)===e?this._currentUser:((r=this.redirectUser)===null||r===void 0?void 0:r._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var e,n;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const r=(n=(e=this.currentUser)===null||e===void 0?void 0:e.uid)!==null&&n!==void 0?n:null;this.lastNotifiedUid!==r&&(this.lastNotifiedUid=r,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,n,r,i){if(this._deleted)return()=>{};const s=typeof n=="function"?n:n.next.bind(n);let o=!1;const a=this._isInitialized?Promise.resolve():this._initializationPromise;if(R(a,this,"internal-error"),a.then(()=>{o||s(this.currentUser)}),typeof n=="function"){const l=e.addObserver(n,r,i);return()=>{o=!0,l()}}else{const l=e.addObserver(n);return()=>{o=!0,l()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return R(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=Op(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var e;const n={"X-Client-Version":this.clientVersion};this.app.options.appId&&(n["X-Firebase-gmpid"]=this.app.options.appId);const r=await((e=this.heartbeatServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getHeartbeatsHeader());r&&(n["X-Firebase-Client"]=r);const i=await this._getAppCheckToken();return i&&(n["X-Firebase-AppCheck"]=i),n}async _getAppCheckToken(){var e;const n=await((e=this.appCheckServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getToken());return n!=null&&n.error&&U0(`Error while retrieving App Check token: ${n.error}`),n==null?void 0:n.token}}function _o(t){return lt(t)}class fd{constructor(e){this.auth=e,this.observer=null,this.addObserver=Ry(n=>this.observer=n)}get next(){return R(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let ku={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function c_(t){ku=t}function d_(t){return ku.loadJS(t)}function f_(){return ku.gapiScript}function h_(t){return`__${t}${Math.floor(Math.random()*1e6)}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function p_(t,e){const n=vu(t,"auth");if(n.isInitialized()){const i=n.getImmediate(),s=n.getOptions();if(js(s,e??{}))return i;ut(i,"already-initialized")}return n.initialize({options:e})}function m_(t,e){const n=(e==null?void 0:e.persistence)||[],r=(Array.isArray(n)?n:[n]).map(_t);e!=null&&e.errorMap&&t._updateErrorMap(e.errorMap),t._initializeWithPersistence(r,e==null?void 0:e.popupRedirectResolver)}function g_(t,e,n){const r=_o(t);R(r._canInitEmulator,r,"emulator-config-failed"),R(/^https?:\/\//.test(e),r,"invalid-emulator-scheme");const i=!!(n!=null&&n.disableWarnings),s=xp(e),{host:o,port:a}=v_(e),l=a===null?"":`:${a}`;r.config.emulator={url:`${s}//${o}${l}/`},r.settings.appVerificationDisabledForTesting=!0,r.emulatorConfig=Object.freeze({host:o,port:a,protocol:s.replace(":",""),options:Object.freeze({disableWarnings:i})}),i||y_()}function xp(t){const e=t.indexOf(":");return e<0?"":t.substr(0,e+1)}function v_(t){const e=xp(t),n=/(\/\/)?([^?#/]+)/.exec(t.substr(e.length));if(!n)return{host:"",port:null};const r=n[2].split("@").pop()||"",i=/^(\[[^\]]+\])(:|$)/.exec(r);if(i){const s=i[1];return{host:s,port:hd(r.substr(s.length+1))}}else{const[s,o]=r.split(":");return{host:s,port:hd(o)}}}function hd(t){if(!t)return null;const e=Number(t);return isNaN(e)?null:e}function y_(){function t(){const e=document.createElement("p"),n=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",n.position="fixed",n.width="100%",n.backgroundColor="#ffffff",n.border=".1em solid #000000",n.color="#b50000",n.bottom="0px",n.left="0px",n.margin="0px",n.zIndex="10000",n.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",t):t())}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Dp{constructor(e,n){this.providerId=e,this.signInMethod=n}toJSON(){return vt("not implemented")}_getIdTokenResponse(e){return vt("not implemented")}_linkToIdToken(e,n){return vt("not implemented")}_getReauthenticationResolver(e){return vt("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Jn(t,e){return K0(t,"POST","/v1/accounts:signInWithIdp",Su(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const __="http://localhost";class Pn extends Dp{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const n=new Pn(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(n.idToken=e.idToken),e.accessToken&&(n.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(n.nonce=e.nonce),e.pendingToken&&(n.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(n.accessToken=e.oauthToken,n.secret=e.oauthTokenSecret):ut("argument-error"),n}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const n=typeof e=="string"?JSON.parse(e):e,{providerId:r,signInMethod:i}=n,s=yu(n,["providerId","signInMethod"]);if(!r||!i)return null;const o=new Pn(r,i);return o.idToken=s.idToken||void 0,o.accessToken=s.accessToken||void 0,o.secret=s.secret,o.nonce=s.nonce,o.pendingToken=s.pendingToken||null,o}_getIdTokenResponse(e){const n=this.buildRequest();return Jn(e,n)}_linkToIdToken(e,n){const r=this.buildRequest();return r.idToken=n,Jn(e,r)}_getReauthenticationResolver(e){const n=this.buildRequest();return n.autoCreate=!1,Jn(e,n)}buildRequest(){const e={requestUri:__,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const n={};this.idToken&&(n.id_token=this.idToken),this.accessToken&&(n.access_token=this.accessToken),this.secret&&(n.oauth_token_secret=this.secret),n.providerId=this.providerId,this.nonce&&!this.pendingToken&&(n.nonce=this.nonce),e.postBody=Ti(n)}return e}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pu{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pi extends Pu{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vt extends Pi{constructor(){super("facebook.com")}static credential(e){return Pn._fromParams({providerId:Vt.PROVIDER_ID,signInMethod:Vt.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return Vt.credentialFromTaggedObject(e)}static credentialFromError(e){return Vt.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return Vt.credential(e.oauthAccessToken)}catch{return null}}}Vt.FACEBOOK_SIGN_IN_METHOD="facebook.com";Vt.PROVIDER_ID="facebook.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ht extends Pi{constructor(){super("google.com"),this.addScope("profile")}static credential(e,n){return Pn._fromParams({providerId:ht.PROVIDER_ID,signInMethod:ht.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:n})}static credentialFromResult(e){return ht.credentialFromTaggedObject(e)}static credentialFromError(e){return ht.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:n,oauthAccessToken:r}=e;if(!n&&!r)return null;try{return ht.credential(n,r)}catch{return null}}}ht.GOOGLE_SIGN_IN_METHOD="google.com";ht.PROVIDER_ID="google.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jt extends Pi{constructor(){super("github.com")}static credential(e){return Pn._fromParams({providerId:jt.PROVIDER_ID,signInMethod:jt.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return jt.credentialFromTaggedObject(e)}static credentialFromError(e){return jt.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return jt.credential(e.oauthAccessToken)}catch{return null}}}jt.GITHUB_SIGN_IN_METHOD="github.com";jt.PROVIDER_ID="github.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ut extends Pi{constructor(){super("twitter.com")}static credential(e,n){return Pn._fromParams({providerId:Ut.PROVIDER_ID,signInMethod:Ut.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:n})}static credentialFromResult(e){return Ut.credentialFromTaggedObject(e)}static credentialFromError(e){return Ut.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:n,oauthTokenSecret:r}=e;if(!n||!r)return null;try{return Ut.credential(n,r)}catch{return null}}}Ut.TWITTER_SIGN_IN_METHOD="twitter.com";Ut.PROVIDER_ID="twitter.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class or{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,n,r,i=!1){const s=await yt._fromIdTokenResponse(e,r,i),o=pd(r);return new or({user:s,providerId:o,_tokenResponse:r,operationType:n})}static async _forOperation(e,n,r){await e._updateTokensIfNecessary(r,!0);const i=pd(r);return new or({user:e,providerId:i,_tokenResponse:r,operationType:n})}}function pd(t){return t.providerId?t.providerId:"phoneNumber"in t?"phone":null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $s extends Nt{constructor(e,n,r,i){var s;super(n.code,n.message),this.operationType=r,this.user=i,Object.setPrototypeOf(this,$s.prototype),this.customData={appName:e.name,tenantId:(s=e.tenantId)!==null&&s!==void 0?s:void 0,_serverResponse:n.customData._serverResponse,operationType:r}}static _fromErrorAndOperation(e,n,r,i){return new $s(e,n,r,i)}}function Lp(t,e,n,r){return(e==="reauthenticate"?n._getReauthenticationResolver(t):n._getIdTokenResponse(t)).catch(s=>{throw s.code==="auth/multi-factor-auth-required"?$s._fromErrorAndOperation(t,s,e,r):s})}async function w_(t,e,n=!1){const r=await di(t,e._linkToIdToken(t.auth,await t.getIdToken()),n);return or._forOperation(t,"link",r)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function E_(t,e,n=!1){const{auth:r}=t;if(gt(r.app))return Promise.reject(vn(r));const i="reauthenticate";try{const s=await di(t,Lp(r,i,e,t),n);R(s.idToken,r,"internal-error");const o=Iu(s.idToken);R(o,r,"internal-error");const{sub:a}=o;return R(t.uid===a,r,"user-mismatch"),or._forOperation(t,i,s)}catch(s){throw(s==null?void 0:s.code)==="auth/user-not-found"&&ut(r,"user-mismatch"),s}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function S_(t,e,n=!1){if(gt(t.app))return Promise.reject(vn(t));const r="signIn",i=await Lp(t,r,e),s=await or._fromIdTokenResponse(t,r,i);return n||await t._updateCurrentUser(s.user),s}function I_(t,e,n,r){return lt(t).onIdTokenChanged(e,n,r)}function T_(t,e,n){return lt(t).beforeAuthStateChanged(e,n)}const Bs="__sak";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mp{constructor(e,n){this.storageRetriever=e,this.type=n}_isAvailable(){try{return this.storage?(this.storage.setItem(Bs,"1"),this.storage.removeItem(Bs),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,n){return this.storage.setItem(e,JSON.stringify(n)),Promise.resolve()}_get(e){const n=this.storage.getItem(e);return Promise.resolve(n?JSON.parse(n):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function k_(){const t=ve();return Tu(t)||yo(t)}const P_=1e3,C_=10;class bp extends Mp{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,n)=>this.onStorageEvent(e,n),this.listeners={},this.localCache={},this.pollTimer=null,this.safariLocalStorageNotSynced=k_()&&i_(),this.fallbackToPolling=Np(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const n of Object.keys(this.listeners)){const r=this.storage.getItem(n),i=this.localCache[n];r!==i&&e(n,i,r)}}onStorageEvent(e,n=!1){if(!e.key){this.forAllChangedKeys((o,a,l)=>{this.notifyListeners(o,l)});return}const r=e.key;if(n?this.detachListener():this.stopPolling(),this.safariLocalStorageNotSynced){const o=this.storage.getItem(r);if(e.newValue!==o)e.newValue!==null?this.storage.setItem(r,e.newValue):this.storage.removeItem(r);else if(this.localCache[r]===e.newValue&&!n)return}const i=()=>{const o=this.storage.getItem(r);!n&&this.localCache[r]===o||this.notifyListeners(r,o)},s=this.storage.getItem(r);r_()&&s!==e.newValue&&e.newValue!==e.oldValue?setTimeout(i,C_):i()}notifyListeners(e,n){this.localCache[e]=n;const r=this.listeners[e];if(r)for(const i of Array.from(r))i(n&&JSON.parse(n))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,n,r)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:n,newValue:r}),!0)})},P_)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,n){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(n)}_removeListener(e,n){this.listeners[e]&&(this.listeners[e].delete(n),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,n){await super._set(e,n),this.localCache[e]=JSON.stringify(n)}async _get(e){const n=await super._get(e);return this.localCache[e]=JSON.stringify(n),n}async _remove(e){await super._remove(e),delete this.localCache[e]}}bp.type="LOCAL";const R_=bp;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vp extends Mp{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,n){}_removeListener(e,n){}}Vp.type="SESSION";const jp=Vp;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function A_(t){return Promise.all(t.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(n){return{fulfilled:!1,reason:n}}}))}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wo{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const n=this.receivers.find(i=>i.isListeningto(e));if(n)return n;const r=new wo(e);return this.receivers.push(r),r}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const n=e,{eventId:r,eventType:i,data:s}=n.data,o=this.handlersMap[i];if(!(o!=null&&o.size))return;n.ports[0].postMessage({status:"ack",eventId:r,eventType:i});const a=Array.from(o).map(async u=>u(n.origin,s)),l=await A_(a);n.ports[0].postMessage({status:"done",eventId:r,eventType:i,response:l})}_subscribe(e,n){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(n)}_unsubscribe(e,n){this.handlersMap[e]&&n&&this.handlersMap[e].delete(n),(!n||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}wo.receivers=[];/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Cu(t="",e=10){let n="";for(let r=0;r<e;r++)n+=Math.floor(Math.random()*10);return t+n}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class N_{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,n,r=50){const i=typeof MessageChannel<"u"?new MessageChannel:null;if(!i)throw new Error("connection_unavailable");let s,o;return new Promise((a,l)=>{const u=Cu("",20);i.port1.start();const m=setTimeout(()=>{l(new Error("unsupported_event"))},r);o={messageChannel:i,onMessage(h){const p=h;if(p.data.eventId===u)switch(p.data.status){case"ack":clearTimeout(m),s=setTimeout(()=>{l(new Error("timeout"))},3e3);break;case"done":clearTimeout(s),a(p.data.response);break;default:clearTimeout(m),clearTimeout(s),l(new Error("invalid_response"));break}}},this.handlers.add(o),i.port1.addEventListener("message",o.onMessage),this.target.postMessage({eventType:e,eventId:u,data:n},[i.port2])}).finally(()=>{o&&this.removeMessageHandler(o)})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function at(){return window}function O_(t){at().location.href=t}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Up(){return typeof at().WorkerGlobalScope<"u"&&typeof at().importScripts=="function"}async function x_(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function D_(){var t;return((t=navigator==null?void 0:navigator.serviceWorker)===null||t===void 0?void 0:t.controller)||null}function L_(){return Up()?self:null}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Fp="firebaseLocalStorageDb",M_=1,Hs="firebaseLocalStorage",zp="fbase_key";class Ci{constructor(e){this.request=e}toPromise(){return new Promise((e,n)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{n(this.request.error)})})}}function Eo(t,e){return t.transaction([Hs],e?"readwrite":"readonly").objectStore(Hs)}function b_(){const t=indexedDB.deleteDatabase(Fp);return new Ci(t).toPromise()}function fl(){const t=indexedDB.open(Fp,M_);return new Promise((e,n)=>{t.addEventListener("error",()=>{n(t.error)}),t.addEventListener("upgradeneeded",()=>{const r=t.result;try{r.createObjectStore(Hs,{keyPath:zp})}catch(i){n(i)}}),t.addEventListener("success",async()=>{const r=t.result;r.objectStoreNames.contains(Hs)?e(r):(r.close(),await b_(),e(await fl()))})})}async function md(t,e,n){const r=Eo(t,!0).put({[zp]:e,value:n});return new Ci(r).toPromise()}async function V_(t,e){const n=Eo(t,!1).get(e),r=await new Ci(n).toPromise();return r===void 0?null:r.value}function gd(t,e){const n=Eo(t,!0).delete(e);return new Ci(n).toPromise()}const j_=800,U_=3;class $p{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db?this.db:(this.db=await fl(),this.db)}async _withRetries(e){let n=0;for(;;)try{const r=await this._openDb();return await e(r)}catch(r){if(n++>U_)throw r;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return Up()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=wo._getInstance(L_()),this.receiver._subscribe("keyChanged",async(e,n)=>({keyProcessed:(await this._poll()).includes(n.key)})),this.receiver._subscribe("ping",async(e,n)=>["keyChanged"])}async initializeSender(){var e,n;if(this.activeServiceWorker=await x_(),!this.activeServiceWorker)return;this.sender=new N_(this.activeServiceWorker);const r=await this.sender._send("ping",{},800);r&&!((e=r[0])===null||e===void 0)&&e.fulfilled&&!((n=r[0])===null||n===void 0)&&n.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||D_()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{if(!indexedDB)return!1;const e=await fl();return await md(e,Bs,"1"),await gd(e,Bs),!0}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,n){return this._withPendingWrite(async()=>(await this._withRetries(r=>md(r,e,n)),this.localCache[e]=n,this.notifyServiceWorker(e)))}async _get(e){const n=await this._withRetries(r=>V_(r,e));return this.localCache[e]=n,n}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(n=>gd(n,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){const e=await this._withRetries(i=>{const s=Eo(i,!1).getAll();return new Ci(s).toPromise()});if(!e)return[];if(this.pendingWrites!==0)return[];const n=[],r=new Set;if(e.length!==0)for(const{fbase_key:i,value:s}of e)r.add(i),JSON.stringify(this.localCache[i])!==JSON.stringify(s)&&(this.notifyListeners(i,s),n.push(i));for(const i of Object.keys(this.localCache))this.localCache[i]&&!r.has(i)&&(this.notifyListeners(i,null),n.push(i));return n}notifyListeners(e,n){this.localCache[e]=n;const r=this.listeners[e];if(r)for(const i of Array.from(r))i(n)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),j_)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,n){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(n)}_removeListener(e,n){this.listeners[e]&&(this.listeners[e].delete(n),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&this.stopPolling()}}$p.type="LOCAL";const F_=$p;new ki(3e4,6e4);/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Bp(t,e){return e?_t(e):(R(t._popupRedirectResolver,t,"argument-error"),t._popupRedirectResolver)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ru extends Dp{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return Jn(e,this._buildIdpRequest())}_linkToIdToken(e,n){return Jn(e,this._buildIdpRequest(n))}_getReauthenticationResolver(e){return Jn(e,this._buildIdpRequest())}_buildIdpRequest(e){const n={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(n.idToken=e),n}}function z_(t){return S_(t.auth,new Ru(t),t.bypassAuthState)}function $_(t){const{auth:e,user:n}=t;return R(n,e,"internal-error"),E_(n,new Ru(t),t.bypassAuthState)}async function B_(t){const{auth:e,user:n}=t;return R(n,e,"internal-error"),w_(n,new Ru(t),t.bypassAuthState)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Hp{constructor(e,n,r,i,s=!1){this.auth=e,this.resolver=r,this.user=i,this.bypassAuthState=s,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(n)?n:[n]}execute(){return new Promise(async(e,n)=>{this.pendingPromise={resolve:e,reject:n};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(r){this.reject(r)}})}async onAuthEvent(e){const{urlResponse:n,sessionId:r,postBody:i,tenantId:s,error:o,type:a}=e;if(o){this.reject(o);return}const l={auth:this.auth,requestUri:n,sessionId:r,tenantId:s||void 0,postBody:i||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(a)(l))}catch(u){this.reject(u)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return z_;case"linkViaPopup":case"linkViaRedirect":return B_;case"reauthViaPopup":case"reauthViaRedirect":return $_;default:ut(this.auth,"internal-error")}}resolve(e){Ct(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){Ct(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const H_=new ki(2e3,1e4);async function W_(t,e,n){if(gt(t.app))return Promise.reject(Ze(t,"operation-not-supported-in-this-environment"));const r=_o(t);F0(t,e,Pu);const i=Bp(r,n);return new hn(r,"signInViaPopup",e,i).executeNotNull()}class hn extends Hp{constructor(e,n,r,i,s){super(e,n,i,s),this.provider=r,this.authWindow=null,this.pollId=null,hn.currentPopupAction&&hn.currentPopupAction.cancel(),hn.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return R(e,this.auth,"internal-error"),e}async onExecution(){Ct(this.filter.length===1,"Popup operations only handle one event");const e=Cu();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(n=>{this.reject(n)}),this.resolver._isIframeWebStorageSupported(this.auth,n=>{n||this.reject(Ze(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)===null||e===void 0?void 0:e.associatedEvent)||null}cancel(){this.reject(Ze(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,hn.currentPopupAction=null}pollUserCancellation(){const e=()=>{var n,r;if(!((r=(n=this.authWindow)===null||n===void 0?void 0:n.window)===null||r===void 0)&&r.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(Ze(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,H_.get())};e()}}hn.currentPopupAction=null;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const K_="pendingRedirect",ds=new Map;class G_ extends Hp{constructor(e,n,r=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],n,void 0,r),this.eventId=null}async execute(){let e=ds.get(this.auth._key());if(!e){try{const r=await q_(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(r)}catch(n){e=()=>Promise.reject(n)}ds.set(this.auth._key(),e)}return this.bypassAuthState||ds.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const n=await this.auth._redirectUserForId(e.eventId);if(n)return this.user=n,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function q_(t,e){const n=J_(e),r=Y_(t);if(!await r._isAvailable())return!1;const i=await r._get(n)==="true";return await r._remove(n),i}function Q_(t,e){ds.set(t._key(),e)}function Y_(t){return _t(t._redirectPersistence)}function J_(t){return cs(K_,t.config.apiKey,t.name)}async function X_(t,e,n=!1){if(gt(t.app))return Promise.reject(vn(t));const r=_o(t),i=Bp(r,e),o=await new G_(r,i,n).execute();return o&&!n&&(delete o.user._redirectEventId,await r._persistUserIfCurrent(o.user),await r._setRedirectUser(null,e)),o}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Z_=10*60*1e3;class ew{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let n=!1;return this.consumers.forEach(r=>{this.isEventForConsumer(e,r)&&(n=!0,this.sendToConsumer(e,r),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!tw(e)||(this.hasHandledPotentialRedirect=!0,n||(this.queuedRedirectEvent=e,n=!0)),n}sendToConsumer(e,n){var r;if(e.error&&!Wp(e)){const i=((r=e.error.code)===null||r===void 0?void 0:r.split("auth/")[1])||"internal-error";n.onError(Ze(this.auth,i))}else n.onAuthEvent(e)}isEventForConsumer(e,n){const r=n.eventId===null||!!e.eventId&&e.eventId===n.eventId;return n.filter.includes(e.type)&&r}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=Z_&&this.cachedEventUids.clear(),this.cachedEventUids.has(vd(e))}saveEventToCache(e){this.cachedEventUids.add(vd(e)),this.lastProcessedEventTime=Date.now()}}function vd(t){return[t.type,t.eventId,t.sessionId,t.tenantId].filter(e=>e).join("-")}function Wp({type:t,error:e}){return t==="unknown"&&(e==null?void 0:e.code)==="auth/no-auth-event"}function tw(t){switch(t.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return Wp(t);default:return!1}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function nw(t,e={}){return pr(t,"GET","/v1/projects",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const rw=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,iw=/^https?/;async function sw(t){if(t.config.emulator)return;const{authorizedDomains:e}=await nw(t);for(const n of e)try{if(ow(n))return}catch{}ut(t,"unauthorized-domain")}function ow(t){const e=cl(),{protocol:n,hostname:r}=new URL(e);if(t.startsWith("chrome-extension://")){const o=new URL(t);return o.hostname===""&&r===""?n==="chrome-extension:"&&t.replace("chrome-extension://","")===e.replace("chrome-extension://",""):n==="chrome-extension:"&&o.hostname===r}if(!iw.test(n))return!1;if(rw.test(t))return r===t;const i=t.replace(/\./g,"\\.");return new RegExp("^(.+\\."+i+"|"+i+")$","i").test(r)}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const aw=new ki(3e4,6e4);function yd(){const t=at().___jsl;if(t!=null&&t.H){for(const e of Object.keys(t.H))if(t.H[e].r=t.H[e].r||[],t.H[e].L=t.H[e].L||[],t.H[e].r=[...t.H[e].L],t.CP)for(let n=0;n<t.CP.length;n++)t.CP[n]=null}}function lw(t){return new Promise((e,n)=>{var r,i,s;function o(){yd(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{yd(),n(Ze(t,"network-request-failed"))},timeout:aw.get()})}if(!((i=(r=at().gapi)===null||r===void 0?void 0:r.iframes)===null||i===void 0)&&i.Iframe)e(gapi.iframes.getContext());else if(!((s=at().gapi)===null||s===void 0)&&s.load)o();else{const a=h_("iframefcb");return at()[a]=()=>{gapi.load?o():n(Ze(t,"network-request-failed"))},d_(`${f_()}?onload=${a}`).catch(l=>n(l))}}).catch(e=>{throw fs=null,e})}let fs=null;function uw(t){return fs=fs||lw(t),fs}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const cw=new ki(5e3,15e3),dw="__/auth/iframe",fw="emulator/auth/iframe",hw={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},pw=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function mw(t){const e=t.config;R(e.authDomain,t,"auth-domain-config-required");const n=e.emulator?Eu(e,fw):`https://${t.config.authDomain}/${dw}`,r={apiKey:e.apiKey,appName:t.name,v:hr},i=pw.get(t.config.apiHost);i&&(r.eid=i);const s=t._getFrameworks();return s.length&&(r.fw=s.join(",")),`${n}?${Ti(r).slice(1)}`}async function gw(t){const e=await uw(t),n=at().gapi;return R(n,t,"internal-error"),e.open({where:document.body,url:mw(t),messageHandlersFilter:n.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:hw,dontclear:!0},r=>new Promise(async(i,s)=>{await r.restyle({setHideOnLeave:!1});const o=Ze(t,"network-request-failed"),a=at().setTimeout(()=>{s(o)},cw.get());function l(){at().clearTimeout(a),i(r)}r.ping(l).then(l,()=>{s(o)})}))}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const vw={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},yw=500,_w=600,ww="_blank",Ew="http://localhost";class _d{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function Sw(t,e,n,r=yw,i=_w){const s=Math.max((window.screen.availHeight-i)/2,0).toString(),o=Math.max((window.screen.availWidth-r)/2,0).toString();let a="";const l=Object.assign(Object.assign({},vw),{width:r.toString(),height:i.toString(),top:s,left:o}),u=ve().toLowerCase();n&&(a=kp(u)?ww:n),Tp(u)&&(e=e||Ew,l.scrollbars="yes");const m=Object.entries(l).reduce((p,[y,w])=>`${p}${y}=${w},`,"");if(n_(u)&&a!=="_self")return Iw(e||"",a),new _d(null);const h=window.open(e||"",a,m);R(h,t,"popup-blocked");try{h.focus()}catch{}return new _d(h)}function Iw(t,e){const n=document.createElement("a");n.href=t,n.target=e;const r=document.createEvent("MouseEvent");r.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),n.dispatchEvent(r)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Tw="__/auth/handler",kw="emulator/auth/handler",Pw=encodeURIComponent("fac");async function wd(t,e,n,r,i,s){R(t.config.authDomain,t,"auth-domain-config-required"),R(t.config.apiKey,t,"invalid-api-key");const o={apiKey:t.config.apiKey,appName:t.name,authType:n,redirectUrl:r,v:hr,eventId:i};if(e instanceof Pu){e.setDefaultLanguage(t.languageCode),o.providerId=e.providerId||"",Cy(e.getCustomParameters())||(o.customParameters=JSON.stringify(e.getCustomParameters()));for(const[m,h]of Object.entries(s||{}))o[m]=h}if(e instanceof Pi){const m=e.getScopes().filter(h=>h!=="");m.length>0&&(o.scopes=m.join(","))}t.tenantId&&(o.tid=t.tenantId);const a=o;for(const m of Object.keys(a))a[m]===void 0&&delete a[m];const l=await t._getAppCheckToken(),u=l?`#${Pw}=${encodeURIComponent(l)}`:"";return`${Cw(t)}?${Ti(a).slice(1)}${u}`}function Cw({config:t}){return t.emulator?Eu(t,kw):`https://${t.authDomain}/${Tw}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const aa="webStorageSupport";class Rw{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=jp,this._completeRedirectFn=X_,this._overrideRedirectResult=Q_}async _openPopup(e,n,r,i){var s;Ct((s=this.eventManagers[e._key()])===null||s===void 0?void 0:s.manager,"_initialize() not called before _openPopup()");const o=await wd(e,n,r,cl(),i);return Sw(e,o,Cu())}async _openRedirect(e,n,r,i){await this._originValidation(e);const s=await wd(e,n,r,cl(),i);return O_(s),new Promise(()=>{})}_initialize(e){const n=e._key();if(this.eventManagers[n]){const{manager:i,promise:s}=this.eventManagers[n];return i?Promise.resolve(i):(Ct(s,"If manager is not set, promise should be"),s)}const r=this.initAndGetManager(e);return this.eventManagers[n]={promise:r},r.catch(()=>{delete this.eventManagers[n]}),r}async initAndGetManager(e){const n=await gw(e),r=new ew(e);return n.register("authEvent",i=>(R(i==null?void 0:i.authEvent,e,"invalid-auth-event"),{status:r.onEvent(i.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:r},this.iframes[e._key()]=n,r}_isIframeWebStorageSupported(e,n){this.iframes[e._key()].send(aa,{type:aa},i=>{var s;const o=(s=i==null?void 0:i[0])===null||s===void 0?void 0:s[aa];o!==void 0&&n(!!o),ut(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const n=e._key();return this.originValidationPromises[n]||(this.originValidationPromises[n]=sw(e)),this.originValidationPromises[n]}get _shouldInitProactively(){return Np()||Tu()||yo()}}const Aw=Rw;var Ed="@firebase/auth",Sd="1.7.1";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Nw{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)===null||e===void 0?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const n=this.auth.onIdTokenChanged(r=>{e((r==null?void 0:r.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,n),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const n=this.internalListeners.get(e);n&&(this.internalListeners.delete(e),n(),this.updateProactiveRefresh())}assertAuthConfigured(){R(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ow(t){switch(t){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function xw(t){sr(new Tn("auth",(e,{options:n})=>{const r=e.getProvider("app").getImmediate(),i=e.getProvider("heartbeat"),s=e.getProvider("app-check-internal"),{apiKey:o,authDomain:a}=r.options;R(o&&!o.includes(":"),"invalid-api-key",{appName:r.name});const l={apiKey:o,authDomain:a,clientPlatform:t,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:Op(t)},u=new u_(r,i,s,l);return m_(u,n),u},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,n,r)=>{e.getProvider("auth-internal").initialize()})),sr(new Tn("auth-internal",e=>{const n=_o(e.getProvider("auth").getImmediate());return(r=>new Nw(r))(n)},"PRIVATE").setInstantiationMode("EXPLICIT")),Xt(Ed,Sd,Ow(t)),Xt(Ed,Sd,"esm2017")}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Dw=5*60,Lw=up("authIdTokenMaxAge")||Dw;let Id=null;const Mw=t=>async e=>{const n=e&&await e.getIdTokenResult(),r=n&&(new Date().getTime()-Date.parse(n.issuedAtTime))/1e3;if(r&&r>Lw)return;const i=n==null?void 0:n.token;Id!==i&&(Id=i,await fetch(t,{method:i?"POST":"DELETE",headers:i?{Authorization:`Bearer ${i}`}:{}}))};function bw(t=hp()){const e=vu(t,"auth");if(e.isInitialized())return e.getImmediate();const n=p_(t,{popupRedirectResolver:Aw,persistence:[F_,R_,jp]}),r=up("authTokenSyncURL");if(r&&typeof isSecureContext=="boolean"&&isSecureContext){const s=new URL(r,location.origin);if(location.origin===s.origin){const o=Mw(s.toString());T_(n,o,()=>o(n.currentUser)),I_(n,a=>o(a))}}const i=ap("auth");return i&&g_(n,`http://${i}`),n}function Vw(){var t,e;return(e=(t=document.getElementsByTagName("head"))===null||t===void 0?void 0:t[0])!==null&&e!==void 0?e:document}c_({loadJS(t){return new Promise((e,n)=>{const r=document.createElement("script");r.setAttribute("src",t),r.onload=e,r.onerror=i=>{const s=Ze("internal-error");s.customData=i,n(s)},r.type="text/javascript",r.charset="UTF-8",Vw().appendChild(r)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});xw("Browser");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Se{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}Se.UNAUTHENTICATED=new Se(null),Se.GOOGLE_CREDENTIALS=new Se("google-credentials-uid"),Se.FIRST_PARTY=new Se("first-party-uid"),Se.MOCK_USER=new Se("mock-user");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let mr="10.11.0";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ar=new mu("@firebase/firestore");function Ws(t,...e){if(ar.logLevel<=U.DEBUG){const n=e.map(Nu);ar.debug(`Firestore (${mr}): ${t}`,...n)}}function Au(t,...e){if(ar.logLevel<=U.ERROR){const n=e.map(Nu);ar.error(`Firestore (${mr}): ${t}`,...n)}}function Kp(t,...e){if(ar.logLevel<=U.WARN){const n=e.map(Nu);ar.warn(`Firestore (${mr}): ${t}`,...n)}}function Nu(t){if(typeof t=="string")return t;try{/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/return function(n){return JSON.stringify(n)}(t)}catch{return t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ee(t="Unexpected state"){const e=`FIRESTORE (${mr}) INTERNAL ASSERTION FAILED: `+t;throw Au(e),new Error(e)}function xe(t,e){t||ee()}function Gp(t,e){return t}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Td="ok",jw="cancelled",$r="unknown",V="invalid-argument",Uw="deadline-exceeded",Fw="not-found",zw="permission-denied",hl="unauthenticated",$w="resource-exhausted",lr="failed-precondition",Bw="aborted",Hw="out-of-range",Ww="unimplemented",Kw="internal",Gw="unavailable";class O extends Nt{constructor(e,n){super(e,n),this.code=e,this.message=n,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qp{constructor(e,n){this.user=n,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class qw{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,n){e.enqueueRetryable(()=>n(Se.UNAUTHENTICATED))}shutdown(){}}class Qw{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,n){this.changeListener=n,e.enqueueRetryable(()=>n(this.token.user))}shutdown(){this.changeListener=null}}class Yw{constructor(e){this.auth=null,e.onInit(n=>{this.auth=n})}getToken(){return this.auth?this.auth.getToken().then(e=>e?(xe(typeof e.accessToken=="string"),new qp(e.accessToken,new Se(this.auth.getUid()))):null):Promise.resolve(null)}invalidateToken(){}start(e,n){}shutdown(){}}class Jw{constructor(e,n,r){this.t=e,this.i=n,this.o=r,this.type="FirstParty",this.user=Se.FIRST_PARTY,this.u=new Map}l(){return this.o?this.o():null}get headers(){this.u.set("X-Goog-AuthUser",this.t);const e=this.l();return e&&this.u.set("Authorization",e),this.i&&this.u.set("X-Goog-Iam-Authorization-Token",this.i),this.u}}class Xw{constructor(e,n,r){this.t=e,this.i=n,this.o=r}getToken(){return Promise.resolve(new Jw(this.t,this.i,this.o))}start(e,n){e.enqueueRetryable(()=>n(Se.FIRST_PARTY))}shutdown(){}invalidateToken(){}}class Zw{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class e1{constructor(e){this.h=e,this.appCheck=null,e.onInit(n=>{this.appCheck=n})}getToken(){return this.appCheck?this.appCheck.getToken().then(e=>e?(xe(typeof e.token=="string"),new Zw(e.token)):null):Promise.resolve(null)}invalidateToken(){}start(e,n){}shutdown(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class t1{constructor(e,n,r,i,s,o,a,l,u){this.databaseId=e,this.appId=n,this.persistenceKey=r,this.host=i,this.ssl=s,this.forceLongPolling=o,this.autoDetectLongPolling=a,this.longPollingOptions=l,this.useFetchStreams=u}}class fi{constructor(e,n){this.projectId=e,this.database=n||"(default)"}static empty(){return new fi("","")}get isDefaultDatabase(){return this.database==="(default)"}isEqual(e){return e instanceof fi&&e.projectId===this.projectId&&e.database===this.database}}class hi{constructor(e,n,r){n===void 0?n=0:n>e.length&&ee(),r===void 0?r=e.length-n:r>e.length-n&&ee(),this.segments=e,this.offset=n,this.len=r}get length(){return this.len}isEqual(e){return hi.comparator(this,e)===0}child(e){const n=this.segments.slice(this.offset,this.limit());return e instanceof hi?e.forEach(r=>{n.push(r)}):n.push(e),this.construct(n)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let n=0;n<this.length;n++)if(this.get(n)!==e.get(n))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let n=0;n<this.length;n++)if(this.get(n)!==e.get(n))return!1;return!0}forEach(e){for(let n=this.offset,r=this.limit();n<r;n++)e(this.segments[n])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,n){const r=Math.min(e.length,n.length);for(let i=0;i<r;i++){const s=e.get(i),o=n.get(i);if(s<o)return-1;if(s>o)return 1}return e.length<n.length?-1:e.length>n.length?1:0}}class ue extends hi{construct(e,n,r){return new ue(e,n,r)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const n=[];for(const r of e){if(r.indexOf("//")>=0)throw new O(V,`Invalid segment (${r}). Paths must not contain // in them.`);n.push(...r.split("/").filter(i=>i.length>0))}return new ue(n)}static emptyPath(){return new ue([])}}const n1=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class Qe extends hi{construct(e,n,r){return new Qe(e,n,r)}static isValidIdentifier(e){return n1.test(e)}canonicalString(){return this.toArray().map(e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),Qe.isValidIdentifier(e)||(e="`"+e+"`"),e)).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)==="__name__"}static keyField(){return new Qe(["__name__"])}static fromServerFormat(e){const n=[];let r="",i=0;const s=()=>{if(r.length===0)throw new O(V,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);n.push(r),r=""};let o=!1;for(;i<e.length;){const a=e[i];if(a==="\\"){if(i+1===e.length)throw new O(V,"Path has trailing escape character: "+e);const l=e[i+1];if(l!=="\\"&&l!=="."&&l!=="`")throw new O(V,"Path has invalid escape sequence: "+e);r+=l,i+=2}else a==="`"?(o=!o,i++):a!=="."||o?(r+=a,i++):(s(),i++)}if(s(),o)throw new O(V,"Unterminated ` in path: "+e);return new Qe(n)}static emptyPath(){return new Qe([])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ye{constructor(e){this.path=e}static fromPath(e){return new Ye(ue.fromString(e))}static fromName(e){return new Ye(ue.fromString(e).popFirst(5))}static empty(){return new Ye(ue.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&ue.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,n){return ue.comparator(e.path,n.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new Ye(new ue(e.slice()))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function r1(t,e,n){if(!n)throw new O(V,`Function ${t}() cannot be called with an empty ${e}.`)}function kd(t){if(!Ye.isDocumentKey(t))throw new O(V,`Invalid document reference. Document references must have an even number of segments, but ${t} has ${t.length}.`)}function Ou(t){if(t===void 0)return"undefined";if(t===null)return"null";if(typeof t=="string")return t.length>20&&(t=`${t.substring(0,20)}...`),JSON.stringify(t);if(typeof t=="number"||typeof t=="boolean")return""+t;if(typeof t=="object"){if(t instanceof Array)return"an array";{const e=function(r){return r.constructor?r.constructor.name:null}(t);return e?`a custom ${e} object`:"an object"}}return typeof t=="function"?"a function":ee()}function xu(t,e){if("_delegate"in t&&(t=t._delegate),!(t instanceof e)){if(e.name===t.constructor.name)throw new O(V,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const n=Ou(t);throw new O(V,`Expected type '${e.name}', but it was: ${n}`)}}return t}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Qp(t){const e={};return t.timeoutSeconds!==void 0&&(e.timeoutSeconds=t.timeoutSeconds),e}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Qi=null;function i1(){return Qi===null?Qi=function(){return 268435456+Math.round(2147483648*Math.random())}():Qi++,"0x"+Qi.toString(16)}function Ks(t){return t===0&&1/t==-1/0}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const s1={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery"};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Pd,L;function Cd(t){if(t===void 0)return Au("RPC_ERROR","HTTP error has no status"),$r;switch(t){case 200:return Td;case 400:return lr;case 401:return hl;case 403:return zw;case 404:return Fw;case 409:return Bw;case 416:return Hw;case 429:return $w;case 499:return jw;case 500:return $r;case 501:return Ww;case 503:return Gw;case 504:return Uw;default:return t>=200&&t<300?Td:t>=400&&t<500?lr:t>=500&&t<600?Kw:$r}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(L=Pd||(Pd={}))[L.OK=0]="OK",L[L.CANCELLED=1]="CANCELLED",L[L.UNKNOWN=2]="UNKNOWN",L[L.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",L[L.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",L[L.NOT_FOUND=5]="NOT_FOUND",L[L.ALREADY_EXISTS=6]="ALREADY_EXISTS",L[L.PERMISSION_DENIED=7]="PERMISSION_DENIED",L[L.UNAUTHENTICATED=16]="UNAUTHENTICATED",L[L.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",L[L.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",L[L.ABORTED=10]="ABORTED",L[L.OUT_OF_RANGE=11]="OUT_OF_RANGE",L[L.UNIMPLEMENTED=12]="UNIMPLEMENTED",L[L.INTERNAL=13]="INTERNAL",L[L.UNAVAILABLE=14]="UNAVAILABLE",L[L.DATA_LOSS=15]="DATA_LOSS";class o1 extends class{constructor(n){this.databaseInfo=n,this.databaseId=n.databaseId;const r=n.ssl?"https":"http",i=encodeURIComponent(this.databaseId.projectId),s=encodeURIComponent(this.databaseId.database);this.m=r+"://"+n.host,this.A=`projects/${i}/databases/${s}`,this.T=this.databaseId.database==="(default)"?`project_id=${i}`:`project_id=${i}&database_id=${s}`}get R(){return!1}P(n,r,i,s,o){const a=i1(),l=this.I(n,r.toUriEncodedString());Ws("RestConnection",`Sending RPC '${n}' ${a}:`,l,i);const u={"google-cloud-resource-prefix":this.A,"x-goog-request-params":this.T};return this.V(u,s,o),this.p(n,l,u,i).then(m=>(Ws("RestConnection",`Received RPC '${n}' ${a}: `,m),m),m=>{throw Kp("RestConnection",`RPC '${n}' ${a} failed with error: `,m,"url: ",l,"request:",i),m})}g(n,r,i,s,o,a){return this.P(n,r,i,s,o)}V(n,r,i){n["X-Goog-Api-Client"]=function(){return"gl-js/ fire/"+mr}(),n["Content-Type"]="text/plain",this.databaseInfo.appId&&(n["X-Firebase-GMPID"]=this.databaseInfo.appId),r&&r.headers.forEach((s,o)=>n[o]=s),i&&i.headers.forEach((s,o)=>n[o]=s)}I(n,r){const i=s1[n];return`${this.m}/v1/${r}:${i}`}terminate(){}}{constructor(e,n){super(e),this.F=n}v(e,n){throw new Error("Not supported by FetchConnection")}async p(e,n,r,i){var s;const o=JSON.stringify(i);let a;try{a=await this.F(n,{method:"POST",headers:r,body:o})}catch(l){const u=l;throw new O(Cd(u.status),"Request failed with error: "+u.statusText)}if(!a.ok){let l=await a.json();Array.isArray(l)&&(l=l[0]);const u=(s=l==null?void 0:l.error)===null||s===void 0?void 0:s.message;throw new O(Cd(a.status),`Request failed with error: ${u??a.statusText}`)}return a.json()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function a1(t){const e=typeof self<"u"&&(self.crypto||self.msCrypto),n=new Uint8Array(t);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(n);else for(let r=0;r<t;r++)n[r]=Math.floor(256*Math.random());return n}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class l1{static newId(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",n=Math.floor(256/e.length)*e.length;let r="";for(;r.length<20;){const i=a1(40);for(let s=0;s<i.length;++s)r.length<20&&i[s]<n&&(r+=e.charAt(i[s]%e.length))}return r}}function pi(t,e){return t<e?-1:t>e?1:0}function Yp(t,e,n){return t.length===e.length&&t.every((r,i)=>n(r,e[i]))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Rd(t){let e=0;for(const n in t)Object.prototype.hasOwnProperty.call(t,n)&&e++;return e}function So(t,e){for(const n in t)Object.prototype.hasOwnProperty.call(t,n)&&e(n,t[n])}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class u1 extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Rt{constructor(e){this.binaryString=e}static fromBase64String(e){const n=function(i){try{return atob(i)}catch(s){throw typeof DOMException<"u"&&s instanceof DOMException?new u1("Invalid base64 string: "+s):s}}(e);return new Rt(n)}static fromUint8Array(e){const n=function(i){let s="";for(let o=0;o<i.length;++o)s+=String.fromCharCode(i[o]);return s}(e);return new Rt(n)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return function(n){return btoa(n)}(this.binaryString)}toUint8Array(){return function(n){const r=new Uint8Array(n.length);for(let i=0;i<n.length;i++)r[i]=n.charCodeAt(i);return r}(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return pi(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}Rt.EMPTY_BYTE_STRING=new Rt("");const c1=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function mi(t){if(xe(!!t),typeof t=="string"){let e=0;const n=c1.exec(t);if(xe(!!n),n[1]){let i=n[1];i=(i+"000000000").substr(0,9),e=Number(i)}const r=new Date(t);return{seconds:Math.floor(r.getTime()/1e3),nanos:e}}return{seconds:Ae(t.seconds),nanos:Ae(t.nanos)}}function Ae(t){return typeof t=="number"?t:typeof t=="string"?Number(t):0}function pl(t){return typeof t=="string"?Rt.fromBase64String(t):Rt.fromUint8Array(t)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class De{constructor(e,n){if(this.seconds=e,this.nanoseconds=n,n<0)throw new O(V,"Timestamp nanoseconds out of range: "+n);if(n>=1e9)throw new O(V,"Timestamp nanoseconds out of range: "+n);if(e<-62135596800)throw new O(V,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new O(V,"Timestamp seconds out of range: "+e)}static now(){return De.fromMillis(Date.now())}static fromDate(e){return De.fromMillis(e.getTime())}static fromMillis(e){const n=Math.floor(e/1e3),r=Math.floor(1e6*(e-1e3*n));return new De(n,r)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/1e6}_compareTo(e){return this.seconds===e.seconds?pi(this.nanoseconds,e.nanoseconds):pi(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{seconds:this.seconds,nanoseconds:this.nanoseconds}}valueOf(){const e=this.seconds- -62135596800;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Jp(t){var e,n;return((n=(((e=t==null?void 0:t.mapValue)===null||e===void 0?void 0:e.fields)||{}).__type__)===null||n===void 0?void 0:n.stringValue)==="server_timestamp"}function Xp(t){const e=t.mapValue.fields.__previous_value__;return Jp(e)?Xp(e):e}function ml(t){const e=mi(t.mapValue.fields.__local_write_time__.timestampValue);return new De(e.seconds,e.nanos)}function gl(t){return"nullValue"in t?0:"booleanValue"in t?1:"integerValue"in t||"doubleValue"in t?2:"timestampValue"in t?3:"stringValue"in t?5:"bytesValue"in t?6:"referenceValue"in t?7:"geoPointValue"in t?8:"arrayValue"in t?9:"mapValue"in t?Jp(t)?4:function(n){return(((n.mapValue||{}).fields||{}).__type__||{}).stringValue==="__max__"}(t)?9007199254740991:10:ee()}function vl(t,e){if(t===e)return!0;const n=gl(t);if(n!==gl(e))return!1;switch(n){case 0:case 9007199254740991:return!0;case 1:return t.booleanValue===e.booleanValue;case 4:return ml(t).isEqual(ml(e));case 3:return function(i,s){if(typeof i.timestampValue=="string"&&typeof s.timestampValue=="string"&&i.timestampValue.length===s.timestampValue.length)return i.timestampValue===s.timestampValue;const o=mi(i.timestampValue),a=mi(s.timestampValue);return o.seconds===a.seconds&&o.nanos===a.nanos}(t,e);case 5:return t.stringValue===e.stringValue;case 6:return function(i,s){return pl(i.bytesValue).isEqual(pl(s.bytesValue))}(t,e);case 7:return t.referenceValue===e.referenceValue;case 8:return function(i,s){return Ae(i.geoPointValue.latitude)===Ae(s.geoPointValue.latitude)&&Ae(i.geoPointValue.longitude)===Ae(s.geoPointValue.longitude)}(t,e);case 2:return function(i,s){if("integerValue"in i&&"integerValue"in s)return Ae(i.integerValue)===Ae(s.integerValue);if("doubleValue"in i&&"doubleValue"in s){const o=Ae(i.doubleValue),a=Ae(s.doubleValue);return o===a?Ks(o)===Ks(a):isNaN(o)&&isNaN(a)}return!1}(t,e);case 9:return Yp(t.arrayValue.values||[],e.arrayValue.values||[],vl);case 10:return function(i,s){const o=i.mapValue.fields||{},a=s.mapValue.fields||{};if(Rd(o)!==Rd(a))return!1;for(const l in o)if(o.hasOwnProperty(l)&&(a[l]===void 0||!vl(o[l],a[l])))return!1;return!0}(t,e);default:return ee()}}function la(t){return!!t&&"mapValue"in t}function Br(t){if(t.geoPointValue)return{geoPointValue:Object.assign({},t.geoPointValue)};if(t.timestampValue&&typeof t.timestampValue=="object")return{timestampValue:Object.assign({},t.timestampValue)};if(t.mapValue){const e={mapValue:{fields:{}}};return So(t.mapValue.fields,(n,r)=>e.mapValue.fields[n]=Br(r)),e}if(t.arrayValue){const e={arrayValue:{values:[]}};for(let n=0;n<(t.arrayValue.values||[]).length;++n)e.arrayValue.values[n]=Br(t.arrayValue.values[n]);return e}return Object.assign({},t)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pe{constructor(e){this.timestamp=e}static fromTimestamp(e){return new pe(e)}static min(){return new pe(new De(0,0))}static max(){return new pe(new De(253402300799,999999999))}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gs{constructor(e,n){this.comparator=e,this.root=n||le.EMPTY}insert(e,n){return new Gs(this.comparator,this.root.insert(e,n,this.comparator).copy(null,null,le.BLACK,null,null))}remove(e){return new Gs(this.comparator,this.root.remove(e,this.comparator).copy(null,null,le.BLACK,null,null))}get(e){let n=this.root;for(;!n.isEmpty();){const r=this.comparator(e,n.key);if(r===0)return n.value;r<0?n=n.left:r>0&&(n=n.right)}return null}indexOf(e){let n=0,r=this.root;for(;!r.isEmpty();){const i=this.comparator(e,r.key);if(i===0)return n+r.left.size;i<0?r=r.left:(n+=r.left.size+1,r=r.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal((n,r)=>(e(n,r),!1))}toString(){const e=[];return this.inorderTraversal((n,r)=>(e.push(`${n}:${r}`),!1)),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new Yi(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new Yi(this.root,e,this.comparator,!1)}getReverseIterator(){return new Yi(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new Yi(this.root,e,this.comparator,!0)}}class Yi{constructor(e,n,r,i){this.isReverse=i,this.nodeStack=[];let s=1;for(;!e.isEmpty();)if(s=n?r(e.key,n):1,n&&i&&(s*=-1),s<0)e=this.isReverse?e.left:e.right;else{if(s===0){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop();const n={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return n}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}}class le{constructor(e,n,r,i,s){this.key=e,this.value=n,this.color=r??le.RED,this.left=i??le.EMPTY,this.right=s??le.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,n,r,i,s){return new le(e??this.key,n??this.value,r??this.color,i??this.left,s??this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,n,r){let i=this;const s=r(e,i.key);return i=s<0?i.copy(null,null,null,i.left.insert(e,n,r),null):s===0?i.copy(null,n,null,null,null):i.copy(null,null,null,null,i.right.insert(e,n,r)),i.fixUp()}removeMin(){if(this.left.isEmpty())return le.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,n){let r,i=this;if(n(e,i.key)<0)i.left.isEmpty()||i.left.isRed()||i.left.left.isRed()||(i=i.moveRedLeft()),i=i.copy(null,null,null,i.left.remove(e,n),null);else{if(i.left.isRed()&&(i=i.rotateRight()),i.right.isEmpty()||i.right.isRed()||i.right.left.isRed()||(i=i.moveRedRight()),n(e,i.key)===0){if(i.right.isEmpty())return le.EMPTY;r=i.right.min(),i=i.copy(r.key,r.value,null,null,i.right.removeMin())}i=i.copy(null,null,null,null,i.right.remove(e,n))}return i.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){const e=this.copy(null,null,le.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){const e=this.copy(null,null,le.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){const e=this.left.copy(null,null,!this.left.color,null,null),n=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,n)}checkMaxDepth(){const e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed()||this.right.isRed())throw ee();const e=this.left.check();if(e!==this.right.check())throw ee();return e+(this.isRed()?0:1)}}le.EMPTY=null,le.RED=!0,le.BLACK=!1;le.EMPTY=new class{constructor(){this.size=0}get key(){throw ee()}get value(){throw ee()}get color(){throw ee()}get left(){throw ee()}get right(){throw ee()}copy(e,n,r,i,s){return this}insert(e,n,r){return new le(e,n)}remove(e,n){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qs{constructor(e){this.comparator=e,this.data=new Gs(this.comparator)}has(e){return this.data.get(e)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal((n,r)=>(e(n),!1))}forEachInRange(e,n){const r=this.data.getIteratorFrom(e[0]);for(;r.hasNext();){const i=r.getNext();if(this.comparator(i.key,e[1])>=0)return;n(i.key)}}forEachWhile(e,n){let r;for(r=n!==void 0?this.data.getIteratorFrom(n):this.data.getIterator();r.hasNext();)if(!e(r.getNext().key))return}firstAfterOrEqual(e){const n=this.data.getIteratorFrom(e);return n.hasNext()?n.getNext().key:null}getIterator(){return new Ad(this.data.getIterator())}getIteratorFrom(e){return new Ad(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let n=this;return n.size<e.size&&(n=e,e=this),e.forEach(r=>{n=n.add(r)}),n}isEqual(e){if(!(e instanceof qs)||this.size!==e.size)return!1;const n=this.data.getIterator(),r=e.data.getIterator();for(;n.hasNext();){const i=n.getNext().key,s=r.getNext().key;if(this.comparator(i,s)!==0)return!1}return!0}toArray(){const e=[];return this.forEach(n=>{e.push(n)}),e}toString(){const e=[];return this.forEach(n=>e.push(n)),"SortedSet("+e.toString()+")"}copy(e){const n=new qs(this.comparator);return n.data=e,n}}class Ad{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gi{constructor(e){this.fields=e,e.sort(Qe.comparator)}static empty(){return new gi([])}unionWith(e){let n=new qs(Qe.comparator);for(const r of this.fields)n=n.add(r);for(const r of e)n=n.add(r);return new gi(n.toArray())}covers(e){for(const n of this.fields)if(n.isPrefixOf(e))return!0;return!1}isEqual(e){return Yp(this.fields,e.fields,(n,r)=>n.isEqual(r))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class it{constructor(e){this.value=e}static empty(){return new it({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let n=this.value;for(let r=0;r<e.length-1;++r)if(n=(n.mapValue.fields||{})[e.get(r)],!la(n))return null;return n=(n.mapValue.fields||{})[e.lastSegment()],n||null}}set(e,n){this.getFieldsMap(e.popLast())[e.lastSegment()]=Br(n)}setAll(e){let n=Qe.emptyPath(),r={},i=[];e.forEach((o,a)=>{if(!n.isImmediateParentOf(a)){const l=this.getFieldsMap(n);this.applyChanges(l,r,i),r={},i=[],n=a.popLast()}o?r[a.lastSegment()]=Br(o):i.push(a.lastSegment())});const s=this.getFieldsMap(n);this.applyChanges(s,r,i)}delete(e){const n=this.field(e.popLast());la(n)&&n.mapValue.fields&&delete n.mapValue.fields[e.lastSegment()]}isEqual(e){return vl(this.value,e.value)}getFieldsMap(e){let n=this.value;n.mapValue.fields||(n.mapValue={fields:{}});for(let r=0;r<e.length;++r){let i=n.mapValue.fields[e.get(r)];la(i)&&i.mapValue.fields||(i={mapValue:{fields:{}}},n.mapValue.fields[e.get(r)]=i),n=i}return n.mapValue.fields}applyChanges(e,n,r){So(n,(i,s)=>e[i]=s);for(const i of r)delete e[i]}clone(){return new it(Br(this.value))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ft{constructor(e,n,r,i,s,o,a){this.key=e,this.documentType=n,this.version=r,this.readTime=i,this.createTime=s,this.data=o,this.documentState=a}static newInvalidDocument(e){return new ft(e,0,pe.min(),pe.min(),pe.min(),it.empty(),0)}static newFoundDocument(e,n,r,i){return new ft(e,1,n,pe.min(),r,i,0)}static newNoDocument(e,n){return new ft(e,2,n,pe.min(),pe.min(),it.empty(),0)}static newUnknownDocument(e,n){return new ft(e,3,n,pe.min(),pe.min(),it.empty(),2)}convertToFoundDocument(e,n){return!this.createTime.isEqual(pe.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=e),this.version=e,this.documentType=1,this.data=n,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=it.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=it.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=pe.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(e){return e instanceof ft&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new ft(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class d1{constructor(e,n=null,r=[],i=[],s=null,o="F",a=null,l=null){this.path=e,this.collectionGroup=n,this.explicitOrderBy=r,this.filters=i,this.limit=s,this.limitType=o,this.startAt=a,this.endAt=l,this.S=null,this.N=null,this.O=null,this.startAt,this.endAt}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function f1(t,e){return function(r){return typeof r=="number"&&Number.isInteger(r)&&!Ks(r)&&r<=Number.MAX_SAFE_INTEGER&&r>=Number.MIN_SAFE_INTEGER}(e)?function(r){return{integerValue:""+r}}(e):function(r,i){if(r.useProto3Json){if(isNaN(i))return{doubleValue:"NaN"};if(i===1/0)return{doubleValue:"Infinity"};if(i===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:Ks(i)?"-0":i}}(t,e)}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Io{constructor(){this._=void 0}}class h1 extends Io{}class p1 extends Io{constructor(e){super(),this.elements=e}}class m1 extends Io{constructor(e){super(),this.elements=e}}class g1 extends Io{constructor(e,n){super(),this.serializer=e,this.q=n}}class Hr{constructor(e,n){this.updateTime=e,this.exists=n}static none(){return new Hr}static exists(e){return new Hr(void 0,e)}static updateTime(e){return new Hr(e)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}class To{}class Zp extends To{constructor(e,n,r,i=[]){super(),this.key=e,this.value=n,this.precondition=r,this.fieldTransforms=i,this.type=0}getFieldMask(){return null}}class em extends To{constructor(e,n,r,i,s=[]){super(),this.key=e,this.data=n,this.fieldMask=r,this.precondition=i,this.fieldTransforms=s,this.type=1}getFieldMask(){return this.fieldMask}}class v1 extends To{constructor(e,n){super(),this.key=e,this.precondition=n,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class y1 extends To{constructor(e,n){super(),this.key=e,this.precondition=n,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}class _1{constructor(e,n){this.databaseId=e,this.useProto3Json=n}}function yl(t,e){return t.useProto3Json?`${new Date(1e3*e.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+e.nanoseconds).slice(-9)}Z`:{seconds:""+e.seconds,nanos:e.nanoseconds}}function w1(t,e){return t.useProto3Json?e.toBase64():e.toUint8Array()}function E1(t,e){return yl(t,e.toTimestamp())}function ua(t){return xe(!!t),pe.fromTimestamp(function(n){const r=mi(n);return new De(r.seconds,r.nanos)}(t))}function tm(t,e){return _l(t,e).canonicalString()}function _l(t,e){const n=function(i){return new ue(["projects",i.projectId,"databases",i.database])}(t).child("documents");return e===void 0?n:n.child(e)}function Qs(t,e){return tm(t.databaseId,e.path)}function Nd(t,e){const n=function(i){const s=ue.fromString(i);return xe(nm(s)),s}(e);if(n.get(1)!==t.databaseId.projectId)throw new O(V,"Tried to deserialize key from different project: "+n.get(1)+" vs "+t.databaseId.projectId);if(n.get(3)!==t.databaseId.database)throw new O(V,"Tried to deserialize key from different database: "+n.get(3)+" vs "+t.databaseId.database);return new Ye(function(i){return xe(i.length>4&&i.get(4)==="documents"),i.popFirst(5)}(n))}function Od(t,e,n){return{name:Qs(t,e),fields:n.value.mapValue.fields}}function S1(t,e){return"found"in e?function(r,i){xe(!!i.found),i.found.name,i.found.updateTime;const s=Nd(r,i.found.name),o=ua(i.found.updateTime),a=i.found.createTime?ua(i.found.createTime):pe.min(),l=new it({mapValue:{fields:i.found.fields}});return ft.newFoundDocument(s,o,a,l)}(t,e):"missing"in e?function(r,i){xe(!!i.missing),xe(!!i.readTime);const s=Nd(r,i.missing),o=ua(i.readTime);return ft.newNoDocument(s,o)}(t,e):ee()}function I1(t,e){let n;if(e instanceof Zp)n={update:Od(t,e.key,e.value)};else if(e instanceof v1)n={delete:Qs(t,e.key)};else if(e instanceof em)n={update:Od(t,e.key,e.data),updateMask:T1(e.fieldMask)};else{if(!(e instanceof y1))return ee();n={verify:Qs(t,e.key)}}return e.fieldTransforms.length>0&&(n.updateTransforms=e.fieldTransforms.map(r=>function(s,o){const a=o.transform;if(a instanceof h1)return{fieldPath:o.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(a instanceof p1)return{fieldPath:o.field.canonicalString(),appendMissingElements:{values:a.elements}};if(a instanceof m1)return{fieldPath:o.field.canonicalString(),removeAllFromArray:{values:a.elements}};if(a instanceof g1)return{fieldPath:o.field.canonicalString(),increment:a.q};throw ee()}(0,r))),e.precondition.isNone||(n.currentDocument=function(i,s){return s.updateTime!==void 0?{updateTime:E1(i,s.updateTime)}:s.exists!==void 0?{exists:s.exists}:ee()}(t,e.precondition)),n}function T1(t){const e=[];return t.fields.forEach(n=>e.push(n.canonicalString())),{fieldPaths:e}}function nm(t){return t.length>=4&&t.get(0)==="projects"&&t.get(2)==="databases"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Du(t){return new _1(t,!0)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class k1 extends class{}{constructor(e,n,r,i){super(),this.authCredentials=e,this.appCheckCredentials=n,this.connection=r,this.serializer=i,this.Y=!1}Z(){if(this.Y)throw new O(lr,"The client has already been terminated.")}P(e,n,r,i){return this.Z(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([s,o])=>this.connection.P(e,_l(n,r),i,s,o)).catch(s=>{throw s.name==="FirebaseError"?(s.code===hl&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),s):new O($r,s.toString())})}g(e,n,r,i,s){return this.Z(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([o,a])=>this.connection.g(e,_l(n,r),i,o,a,s)).catch(o=>{throw o.name==="FirebaseError"?(o.code===hl&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),o):new O($r,o.toString())})}terminate(){this.Y=!0,this.connection.terminate()}}async function P1(t,e){const n=Gp(t),r={writes:e.map(i=>I1(n.serializer,i))};await n.P("Commit",n.serializer.databaseId,ue.emptyPath(),r)}async function C1(t,e){const n=Gp(t),r={documents:e.map(a=>Qs(n.serializer,a))},i=await n.g("BatchGetDocuments",n.serializer.databaseId,ue.emptyPath(),r,e.length),s=new Map;i.forEach(a=>{const l=S1(n.serializer,a);s.set(l.key.toString(),l)});const o=[];return e.forEach(a=>{const l=s.get(a.toString());xe(!!l),o.push(l)}),o}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Wr=new Map;function rm(t){if(t._terminated)throw new O(lr,"The client has already been terminated.");if(!Wr.has(t)){Ws("ComponentProvider","Initializing Datastore");const e=function(s){return new o1(s,fetch.bind(null))}(function(s,o,a,l){return new t1(s,o,a,l.host,l.ssl,l.experimentalForceLongPolling,l.experimentalAutoDetectLongPolling,Qp(l.experimentalLongPollingOptions),l.useFetchStreams)}(t._databaseId,t.app.options.appId||"",t._persistenceKey,t._freezeSettings())),n=Du(t._databaseId),r=function(s,o,a,l){return new k1(s,o,a,l)}(t._authCredentials,t._appCheckCredentials,e,n);Wr.set(t,r)}return Wr.get(t)}class xd{constructor(e){var n,r;if(e.host===void 0){if(e.ssl!==void 0)throw new O(V,"Can't provide ssl option if host option is not set");this.host="firestore.googleapis.com",this.ssl=!0}else this.host=e.host,this.ssl=(n=e.ssl)===null||n===void 0||n;if(this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e.cacheSizeBytes===void 0)this.cacheSizeBytes=41943040;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<1048576)throw new O(V,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}(function(s,o,a,l){if(o===!0&&l===!0)throw new O(V,`${s} and ${a} cannot be used together.`)})("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=Qp((r=e.experimentalLongPollingOptions)!==null&&r!==void 0?r:{}),function(s){if(s.timeoutSeconds!==void 0){if(isNaN(s.timeoutSeconds))throw new O(V,`invalid long polling timeout: ${s.timeoutSeconds} (must not be NaN)`);if(s.timeoutSeconds<5)throw new O(V,`invalid long polling timeout: ${s.timeoutSeconds} (minimum allowed value is 5)`);if(s.timeoutSeconds>30)throw new O(V,`invalid long polling timeout: ${s.timeoutSeconds} (maximum allowed value is 30)`)}}(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&function(r,i){return r.timeoutSeconds===i.timeoutSeconds}(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}}class Lu{constructor(e,n,r,i){this._authCredentials=e,this._appCheckCredentials=n,this._databaseId=r,this._app=i,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new xd({}),this._settingsFrozen=!1}get app(){if(!this._app)throw new O(lr,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!==void 0}_setSettings(e){if(this._settingsFrozen)throw new O(lr,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new xd(e),e.credentials!==void 0&&(this._authCredentials=function(r){if(!r)return new qw;switch(r.type){case"firstParty":return new Xw(r.sessionIndex||"0",r.iamToken||null,r.authTokenFactory||null);case"provider":return r.client;default:throw new O(V,"makeAuthCredentialsProvider failed due to invalid credential type")}}(e.credentials))}_getSettings(){return this._settings}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask||(this._terminateTask=this._terminate()),this._terminateTask}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return function(n){const r=Wr.get(n);r&&(Ws("ComponentProvider","Removing Datastore"),Wr.delete(n),r.terminate())}(this),Promise.resolve()}}function R1(t,e){const n=typeof t=="object"?t:hp(),r=typeof t=="string"?t:e||"(default)",i=vu(n,"firestore/lite").getImmediate({identifier:r});if(!i._initialized){const s=my("firestore");s&&A1(i,...s)}return i}function A1(t,e,n,r={}){var i;const s=(t=xu(t,Lu))._getSettings(),o=`${e}:${n}`;if(s.host!=="firestore.googleapis.com"&&s.host!==o&&Kp("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used."),t._setSettings(Object.assign(Object.assign({},s),{host:o,ssl:!1})),r.mockUserToken){let a,l;if(typeof r.mockUserToken=="string")a=r.mockUserToken,l=Se.MOCK_USER;else{a=vy(r.mockUserToken,(i=t._app)===null||i===void 0?void 0:i.options.projectId);const u=r.mockUserToken.sub||r.mockUserToken.user_id;if(!u)throw new O(V,"mockUserToken must contain 'sub' or 'user_id' field!");l=new Se(u)}t._authCredentials=new Qw(new qp(a,l))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mu{constructor(e,n,r){this.converter=n,this._query=r,this.type="query",this.firestore=e}withConverter(e){return new Mu(this.firestore,e,this._query)}}class ze{constructor(e,n,r){this.converter=n,this._key=r,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new vi(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new ze(this.firestore,e,this._key)}}class vi extends Mu{constructor(e,n,r){super(e,n,function(s){return new d1(s)}(r)),this._path=r,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new ze(this.firestore,null,new Ye(e))}withConverter(e){return new vi(this.firestore,e,this._path)}}function im(t,e,...n){if(t=lt(t),arguments.length===1&&(e=l1.newId()),r1("doc","path",e),t instanceof Lu){const r=ue.fromString(e,...n);return kd(r),new ze(t,null,new Ye(r))}{if(!(t instanceof ze||t instanceof vi))throw new O(V,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=t._path.child(ue.fromString(e,...n));return kd(r),new ze(t.firestore,t instanceof vi?t.converter:null,new Ye(r))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ur{constructor(e){this._byteString=e}static fromBase64String(e){try{return new ur(Rt.fromBase64String(e))}catch(n){throw new O(V,"Failed to construct data from Base64 string: "+n)}}static fromUint8Array(e){return new ur(Rt.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bu{constructor(...e){for(let n=0;n<e.length;++n)if(e[n].length===0)throw new O(V,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new Qe(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sm{constructor(e){this._methodName=e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vu{constructor(e,n){if(!isFinite(e)||e<-90||e>90)throw new O(V,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(n)||n<-180||n>180)throw new O(V,"Longitude must be a number between -180 and 180, but was: "+n);this._lat=e,this._long=n}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}toJSON(){return{latitude:this._lat,longitude:this._long}}_compareTo(e){return pi(this._lat,e._lat)||pi(this._long,e._long)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const N1=/^__.*__$/;class O1{constructor(e,n,r){this.data=e,this.fieldMask=n,this.fieldTransforms=r}toMutation(e,n){return this.fieldMask!==null?new em(e,this.data,this.fieldMask,n,this.fieldTransforms):new Zp(e,this.data,n,this.fieldTransforms)}}function om(t){switch(t){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw ee()}}class ju{constructor(e,n,r,i,s,o){this.settings=e,this.databaseId=n,this.serializer=r,this.ignoreUndefinedProperties=i,s===void 0&&this.tt(),this.fieldTransforms=s||[],this.fieldMask=o||[]}get path(){return this.settings.path}get et(){return this.settings.et}rt(e){return new ju(Object.assign(Object.assign({},this.settings),e),this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}nt(e){var n;const r=(n=this.path)===null||n===void 0?void 0:n.child(e),i=this.rt({path:r,it:!1});return i.st(e),i}ot(e){var n;const r=(n=this.path)===null||n===void 0?void 0:n.child(e),i=this.rt({path:r,it:!1});return i.tt(),i}ut(e){return this.rt({path:void 0,it:!0})}_t(e){return Ys(e,this.settings.methodName,this.settings.ct||!1,this.path,this.settings.lt)}contains(e){return this.fieldMask.find(n=>e.isPrefixOf(n))!==void 0||this.fieldTransforms.find(n=>e.isPrefixOf(n.field))!==void 0}tt(){if(this.path)for(let e=0;e<this.path.length;e++)this.st(this.path.get(e))}st(e){if(e.length===0)throw this._t("Document fields must not be empty");if(om(this.et)&&N1.test(e))throw this._t('Document fields cannot begin and end with "__"')}}class x1{constructor(e,n,r){this.databaseId=e,this.ignoreUndefinedProperties=n,this.serializer=r||Du(e)}ht(e,n,r,i=!1){return new ju({et:e,methodName:n,lt:r,path:Qe.emptyPath(),it:!1,ct:i},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function D1(t){const e=t._freezeSettings(),n=Du(t._databaseId);return new x1(t._databaseId,!!e.ignoreUndefinedProperties,n)}function L1(t,e,n,r,i,s={}){const o=t.ht(s.merge||s.mergeFields?2:0,e,n,i);cm("Data must be an object, but it was:",o,r);const a=lm(r,o);let l,u;if(s.merge)l=new gi(o.fieldMask),u=o.fieldTransforms;else if(s.mergeFields){const m=[];for(const h of s.mergeFields){const p=M1(e,h,n);if(!o.contains(p))throw new O(V,`Field '${p}' is specified in your field mask but missing from your input data.`);V1(m,p)||m.push(p)}l=new gi(m),u=o.fieldTransforms.filter(h=>l.covers(h.field))}else l=null,u=o.fieldTransforms;return new O1(new it(a),l,u)}function am(t,e){if(um(t=lt(t)))return cm("Unsupported field value:",e,t),lm(t,e);if(t instanceof sm)return function(r,i){if(!om(i.et))throw i._t(`${r._methodName}() can only be used with update() and set()`);if(!i.path)throw i._t(`${r._methodName}() is not currently supported inside arrays`);const s=r._toFieldTransform(i);s&&i.fieldTransforms.push(s)}(t,e),null;if(t===void 0&&e.ignoreUndefinedProperties)return null;if(e.path&&e.fieldMask.push(e.path),t instanceof Array){if(e.settings.it&&e.et!==4)throw e._t("Nested arrays are not supported");return function(r,i){const s=[];let o=0;for(const a of r){let l=am(a,i.ut(o));l==null&&(l={nullValue:"NULL_VALUE"}),s.push(l),o++}return{arrayValue:{values:s}}}(t,e)}return function(r,i){if((r=lt(r))===null)return{nullValue:"NULL_VALUE"};if(typeof r=="number")return f1(i.serializer,r);if(typeof r=="boolean")return{booleanValue:r};if(typeof r=="string")return{stringValue:r};if(r instanceof Date){const s=De.fromDate(r);return{timestampValue:yl(i.serializer,s)}}if(r instanceof De){const s=new De(r.seconds,1e3*Math.floor(r.nanoseconds/1e3));return{timestampValue:yl(i.serializer,s)}}if(r instanceof Vu)return{geoPointValue:{latitude:r.latitude,longitude:r.longitude}};if(r instanceof ur)return{bytesValue:w1(i.serializer,r._byteString)};if(r instanceof ze){const s=i.databaseId,o=r.firestore._databaseId;if(!o.isEqual(s))throw i._t(`Document reference is for database ${o.projectId}/${o.database} but should be for database ${s.projectId}/${s.database}`);return{referenceValue:tm(r.firestore._databaseId||i.databaseId,r._key.path)}}throw i._t(`Unsupported field value: ${Ou(r)}`)}(t,e)}function lm(t,e){const n={};return function(i){for(const s in i)if(Object.prototype.hasOwnProperty.call(i,s))return!1;return!0}(t)?e.path&&e.path.length>0&&e.fieldMask.push(e.path):So(t,(r,i)=>{const s=am(i,e.nt(r));s!=null&&(n[r]=s)}),{mapValue:{fields:n}}}function um(t){return!(typeof t!="object"||t===null||t instanceof Array||t instanceof Date||t instanceof De||t instanceof Vu||t instanceof ur||t instanceof ze||t instanceof sm)}function cm(t,e,n){if(!um(n)||!function(i){return typeof i=="object"&&i!==null&&(Object.getPrototypeOf(i)===Object.prototype||Object.getPrototypeOf(i)===null)}(n)){const r=Ou(n);throw r==="an object"?e._t(t+" a custom object"):e._t(t+" "+r)}}function M1(t,e,n){if((e=lt(e))instanceof bu)return e._internalPath;if(typeof e=="string")return dm(t,e);throw Ys("Field path arguments must be of type string or ",t,!1,void 0,n)}const b1=new RegExp("[~\\*/\\[\\]]");function dm(t,e,n){if(e.search(b1)>=0)throw Ys(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,t,!1,void 0,n);try{return new bu(...e.split("."))._internalPath}catch{throw Ys(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,t,!1,void 0,n)}}function Ys(t,e,n,r,i){const s=r&&!r.isEmpty(),o=i!==void 0;let a=`Function ${e}() called with invalid data`;n&&(a+=" (via `toFirestore()`)"),a+=". ";let l="";return(s||o)&&(l+=" (found",s&&(l+=` in field ${r}`),o&&(l+=` in document ${i}`),l+=")"),new O(V,a+t+l)}function V1(t,e){return t.some(n=>n.isEqual(e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fm{constructor(e,n,r,i,s){this._firestore=e,this._userDataWriter=n,this._key=r,this._document=i,this._converter=s}get id(){return this._key.path.lastSegment()}get ref(){return new ze(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const e=new j1(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}get(e){if(this._document){const n=this._document.data.field(U1("DocumentSnapshot.get",e));if(n!==null)return this._userDataWriter.convertValue(n)}}}class j1 extends fm{data(){return super.data()}}function U1(t,e){return typeof e=="string"?dm(t,e):e instanceof bu?e._internalPath:e._delegate._internalPath}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function F1(t,e,n){let r;return r=t?n&&(n.merge||n.mergeFields)?t.toFirestore(e,n):t.toFirestore(e):e,r}class z1 extends class{convertValue(n,r="none"){switch(gl(n)){case 0:return null;case 1:return n.booleanValue;case 2:return Ae(n.integerValue||n.doubleValue);case 3:return this.convertTimestamp(n.timestampValue);case 4:return this.convertServerTimestamp(n,r);case 5:return n.stringValue;case 6:return this.convertBytes(pl(n.bytesValue));case 7:return this.convertReference(n.referenceValue);case 8:return this.convertGeoPoint(n.geoPointValue);case 9:return this.convertArray(n.arrayValue,r);case 10:return this.convertObject(n.mapValue,r);default:throw ee()}}convertObject(n,r){return this.convertObjectMap(n.fields,r)}convertObjectMap(n,r="none"){const i={};return So(n,(s,o)=>{i[s]=this.convertValue(o,r)}),i}convertGeoPoint(n){return new Vu(Ae(n.latitude),Ae(n.longitude))}convertArray(n,r){return(n.values||[]).map(i=>this.convertValue(i,r))}convertServerTimestamp(n,r){switch(r){case"previous":const i=Xp(n);return i==null?null:this.convertValue(i,r);case"estimate":return this.convertTimestamp(ml(n));default:return null}}convertTimestamp(n){const r=mi(n);return new De(r.seconds,r.nanos)}convertDocumentKey(n,r){const i=ue.fromString(n);xe(nm(i));const s=new fi(i.get(1),i.get(3)),o=new Ye(i.popFirst(5));return s.isEqual(r)||Au(`Document ${o} contains a document reference within a different database (${s.projectId}/${s.database}) which is not supported. It will be treated as a reference in the current database (${r.projectId}/${r.database}) instead.`),o}}{constructor(e){super(),this.firestore=e}convertBytes(e){return new ur(e)}convertReference(e){const n=this.convertDocumentKey(e,this.firestore._databaseId);return new ze(this.firestore,null,n)}}function hm(t){const e=rm((t=xu(t,ze)).firestore),n=new z1(t.firestore);return C1(e,[t._key]).then(r=>{xe(r.length===1);const i=r[0];return new fm(t.firestore,n,t._key,i.isFoundDocument()?i:null,t.converter)})}function Dd(t,e,n){const r=F1((t=xu(t,ze)).converter,e,n),i=L1(D1(t.firestore),"setDoc",t._key,r,t.converter!==null,n);return P1(rm(t.firestore),[i.toMutation(t._key,Hr.none())])}(function(){(function(n){mr=n})(`${hr}_lite`),sr(new Tn("firestore/lite",(e,{instanceIdentifier:n,options:r})=>{const i=e.getProvider("app").getImmediate(),s=new Lu(new Yw(e.getProvider("auth-internal")),new e1(e.getProvider("app-check-internal")),function(a,l){if(!Object.prototype.hasOwnProperty.apply(a.options,["projectId"]))throw new O(V,'"projectId" not provided in firebase.initializeApp.');return new fi(a.options.projectId,l)}(i,n),i);return r&&s._setSettings(r),s},"PUBLIC").setMultipleInstances(!0)),Xt("firestore-lite","4.6.0",""),Xt("firestore-lite","4.6.0","esm2017")})();const $1={apiKey:"AIzaSyAnx-2_hPh3uHa03Khd1zjNTgRtrlID3x0",authDomain:"learn-english-e8e0f.firebaseapp.com",projectId:"learn-english-e8e0f",storageBucket:"learn-english-e8e0f.appspot.com",messagingSenderId:"1016778087191",appId:"1:1016778087191:web:edef0ba5847872c6a2f552"},pm=fp($1),Ri=bw(pm),mm=R1(pm);function gm(t){var e,n,r="";if(typeof t=="string"||typeof t=="number")r+=t;else if(typeof t=="object")if(Array.isArray(t)){var i=t.length;for(e=0;e<i;e++)t[e]&&(n=gm(t[e]))&&(r&&(r+=" "),r+=n)}else for(n in t)t[n]&&(r&&(r+=" "),r+=n);return r}function yn(){for(var t,e,n=0,r="",i=arguments.length;n<i;n++)(t=arguments[n])&&(e=gm(t))&&(r&&(r+=" "),r+=e);return r}function B1({className:t,style:e,bottomSpace:n=20,children:r,...i}){const s=F.useRef(null),o=F.useRef(0);return F.useLayoutEffect(()=>{const a=s.current,l=()=>{const h=a.getBoundingClientRect(),p=window.innerHeight-h.top-n;a.style.height=`${p}px`},u=()=>{const{scrollHeight:h}=a,p=o.current;if(o.current=h,h<p){a.scrollTop=0,u();return}},m=new MutationObserver(h=>{h.forEach(p=>{(p.type==="childList"||p.type==="attributes")&&u()})});return m.observe(a,{attributes:!0,childList:!0,subtree:!0}),l(),window.addEventListener("resize",l),a.addEventListener("scroll",u),()=>{window.removeEventListener("resize",l),a.removeEventListener("scroll",u),m.disconnect()}},[]),k.jsx("div",{className:yn(t),ref:s,...i,style:{...e},children:r})}const H1="_spinner_11xi8_1",W1={spinner:H1},vm=({size:t=80,color:e,className:n,thickness:r})=>{const i=F.useRef(null),s=F.useRef(null);return F.useLayoutEffect(()=>{const a=()=>{const m=Date.now()/700*360%360;i.current&&(i.current.style.transform=`rotate(${m}deg)`),s.current=requestAnimationFrame(a)};return s.current=requestAnimationFrame(a),()=>{s.current&&cancelAnimationFrame(s.current)}},[]),k.jsx("div",{className:yn(W1.spinner,n),ref:i,style:{width:t,height:t,color:e,borderWidth:r}})},Js=({})=>k.jsx(B1,{children:k.jsx("div",{className:"h-full flex justify-center items-center",children:k.jsx(vm,{color:"#8a9ba8",size:48})})});var ym={color:void 0,size:void 0,className:void 0,style:void 0,attr:void 0},Ld=pn.createContext&&pn.createContext(ym),K1=["attr","size","title"];function G1(t,e){if(t==null)return{};var n=q1(t,e),r,i;if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(t);for(i=0;i<s.length;i++)r=s[i],!(e.indexOf(r)>=0)&&Object.prototype.propertyIsEnumerable.call(t,r)&&(n[r]=t[r])}return n}function q1(t,e){if(t==null)return{};var n={},r=Object.keys(t),i,s;for(s=0;s<r.length;s++)i=r[s],!(e.indexOf(i)>=0)&&(n[i]=t[i]);return n}function Xs(){return Xs=Object.assign?Object.assign.bind():function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(t[r]=n[r])}return t},Xs.apply(this,arguments)}function Md(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter(function(i){return Object.getOwnPropertyDescriptor(t,i).enumerable})),n.push.apply(n,r)}return n}function Zs(t){for(var e=1;e<arguments.length;e++){var n=arguments[e]!=null?arguments[e]:{};e%2?Md(Object(n),!0).forEach(function(r){Q1(t,r,n[r])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):Md(Object(n)).forEach(function(r){Object.defineProperty(t,r,Object.getOwnPropertyDescriptor(n,r))})}return t}function Q1(t,e,n){return e=Y1(e),e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function Y1(t){var e=J1(t,"string");return typeof e=="symbol"?e:String(e)}function J1(t,e){if(typeof t!="object"||t===null)return t;var n=t[Symbol.toPrimitive];if(n!==void 0){var r=n.call(t,e||"default");if(typeof r!="object")return r;throw new TypeError("@@toPrimitive must return a primitive value.")}return(e==="string"?String:Number)(t)}function _m(t){return t&&t.map((e,n)=>pn.createElement(e.tag,Zs({key:n},e.attr),_m(e.child)))}function gr(t){return e=>pn.createElement(X1,Xs({attr:Zs({},t.attr)},e),_m(t.child))}function X1(t){var e=n=>{var{attr:r,size:i,title:s}=t,o=G1(t,K1),a=i||n.size||"1em",l;return n.className&&(l=n.className),t.className&&(l=(l?l+" ":"")+t.className),pn.createElement("svg",Xs({stroke:"currentColor",fill:"currentColor",strokeWidth:"0"},n.attr,r,o,{className:l,style:Zs(Zs({color:t.color||n.color},n.style),t.style),height:a,width:a,xmlns:"http://www.w3.org/2000/svg"}),s&&pn.createElement("title",null,s),t.children)};return Ld!==void 0?pn.createElement(Ld.Consumer,null,n=>e(n)):e(ym)}function Z1(t){return gr({tag:"svg",attr:{viewBox:"0 0 488 512"},child:[{tag:"path",attr:{d:"M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"},child:[]}]})(t)}const eE=({})=>{const[t,e]=F.useState(!1),n=async()=>{try{e(!0);const r=new ht;await W_(Ri,r)}catch{e(!1)}};return k.jsx("div",{className:"flex h-full items-center justify-center",children:k.jsxs("div",{className:"border border-gray3 bg-white",children:[k.jsx("div",{className:"border-b border-gray3 bg-light-gray3 p-2",children:"English-Learn"}),k.jsxs("div",{className:"relative p-8",children:[k.jsx("div",{className:"flex space-x-2",children:k.jsxs("button",{type:"button",onClick:n,className:"flex items-center space-x-2 border border-gray3 p-2",children:[k.jsx(Z1,{})," ",k.jsx("span",{children:"Auth with Google"})]})}),t&&k.jsx("div",{className:"absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center bg-white",children:k.jsx(vm,{size:40,color:"#5c7080"})})]})]})})};function tE(t){return gr({tag:"svg",attr:{viewBox:"0 0 20 20",fill:"currentColor","aria-hidden":"true"},child:[{tag:"path",attr:{fillRule:"evenodd",d:"M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z",clipRule:"evenodd"},child:[]}]})(t)}function nE(t){return gr({tag:"svg",attr:{viewBox:"0 0 20 20",fill:"currentColor","aria-hidden":"true"},child:[{tag:"path",attr:{fillRule:"evenodd",d:"M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z",clipRule:"evenodd"},child:[]}]})(t)}function rE(t){return gr({tag:"svg",attr:{viewBox:"0 0 20 20",fill:"currentColor","aria-hidden":"true"},child:[{tag:"path",attr:{fillRule:"evenodd",d:"M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z",clipRule:"evenodd"},child:[]}]})(t)}function iE(t){return gr({tag:"svg",attr:{viewBox:"0 0 20 20",fill:"currentColor","aria-hidden":"true"},child:[{tag:"path",attr:{d:"M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"},child:[]}]})(t)}function sE(t){return gr({tag:"svg",attr:{fill:"none",viewBox:"0 0 24 24",strokeWidth:"2",stroke:"currentColor","aria-hidden":"true"},child:[{tag:"path",attr:{strokeLinecap:"round",strokeLinejoin:"round",d:"M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"},child:[]}]})(t)}const bd=({label:t,options:e,value:n,onChange:r,className:i,selectMinWidth:s,disabled:o,...a})=>{const l=h=>{const p=e.findIndex(w=>w.value===n),y=e[p+h];y&&r(y.value)},[u,m]=F.useMemo(()=>{const h=e.findIndex(w=>w.value===n),p=e[h+1];return[!!e[h-1],!!p]},[e,n]);return k.jsxs("div",{className:yn("flex items-center",i),...a,children:[k.jsxs("div",{className:"mr-2",children:[t,":"]}),k.jsxs("div",{className:"flex h-[32px] w-full rounded-md border-0 bg-white ring-1 ring-inset ring-gray3",children:[k.jsx("button",{type:"button",onClick:()=>l(-1),className:"h-full px-1 text-gray1 disabled:opacity-50",disabled:!u||o,children:k.jsx(nE,{size:24})}),k.jsx("select",{id:"location",name:"location",className:"block w-full border-0 px-2 text-center ring-1 ring-inset ring-gray3",value:n,onChange:h=>{r(h.target.value)},style:{minWidth:s},disabled:o,children:e.map(({label:h,value:p})=>k.jsx("option",{value:p,children:h},p))}),k.jsx("button",{type:"button",onClick:()=>l(1),className:"h-full px-1 text-gray1 disabled:opacity-50",disabled:!m||o,children:k.jsx(rE,{size:24})})]})]})},oE=({})=>{const t=async()=>{try{await Ri.signOut()}catch(e){console.error("Ошибка при выходе из системы:",e)}};return k.jsx("div",{children:k.jsx("button",{type:"button",onClick:t,children:"Logout"})})};function aE(t){var e=F.useRef();return F.useEffect(function(){e.current=t}),e.current}var wm=typeof global=="object"&&global&&global.Object===Object&&global,lE=typeof self=="object"&&self&&self.Object===Object&&self,Em=wm||lE||Function("return this")(),eo=Em.Symbol,Sm=Object.prototype,uE=Sm.hasOwnProperty,cE=Sm.toString,Cr=eo?eo.toStringTag:void 0;function dE(t){var e=uE.call(t,Cr),n=t[Cr];try{t[Cr]=void 0;var r=!0}catch{}var i=cE.call(t);return r&&(e?t[Cr]=n:delete t[Cr]),i}var fE=Object.prototype,hE=fE.toString;function pE(t){return hE.call(t)}var mE="[object Null]",gE="[object Undefined]",Vd=eo?eo.toStringTag:void 0;function Uu(t){return t==null?t===void 0?gE:mE:Vd&&Vd in Object(t)?dE(t):pE(t)}function Fu(t){return t!=null&&typeof t=="object"}function vE(t,e){for(var n=-1,r=t==null?0:t.length,i=Array(r);++n<r;)i[n]=e(t[n],n,t);return i}var Im=Array.isArray;function yE(t){var e=typeof t;return t!=null&&(e=="object"||e=="function")}var _E="[object AsyncFunction]",wE="[object Function]",EE="[object GeneratorFunction]",SE="[object Proxy]";function IE(t){if(!yE(t))return!1;var e=Uu(t);return e==wE||e==EE||e==_E||e==SE}function TE(t,e){var n=-1,r=t.length;for(e||(e=Array(r));++n<r;)e[n]=t[n];return e}var kE=9007199254740991,PE=/^(?:0|[1-9]\d*)$/;function CE(t,e){var n=typeof t;return e=e??kE,!!e&&(n=="number"||n!="symbol"&&PE.test(t))&&t>-1&&t%1==0&&t<e}var RE=9007199254740991;function Tm(t){return typeof t=="number"&&t>-1&&t%1==0&&t<=RE}function AE(t){return t!=null&&Tm(t.length)&&!IE(t)}var NE=Object.prototype;function OE(t){var e=t&&t.constructor,n=typeof e=="function"&&e.prototype||NE;return t===n}function xE(t,e){for(var n=-1,r=Array(t);++n<t;)r[n]=e(n);return r}var DE="[object Arguments]";function jd(t){return Fu(t)&&Uu(t)==DE}var km=Object.prototype,LE=km.hasOwnProperty,ME=km.propertyIsEnumerable,bE=jd(function(){return arguments}())?jd:function(t){return Fu(t)&&LE.call(t,"callee")&&!ME.call(t,"callee")};function VE(){return!1}var Pm=typeof wt=="object"&&wt&&!wt.nodeType&&wt,Ud=Pm&&typeof Et=="object"&&Et&&!Et.nodeType&&Et,jE=Ud&&Ud.exports===Pm,Fd=jE?Em.Buffer:void 0,UE=Fd?Fd.isBuffer:void 0,FE=UE||VE,zE="[object Arguments]",$E="[object Array]",BE="[object Boolean]",HE="[object Date]",WE="[object Error]",KE="[object Function]",GE="[object Map]",qE="[object Number]",QE="[object Object]",YE="[object RegExp]",JE="[object Set]",XE="[object String]",ZE="[object WeakMap]",eS="[object ArrayBuffer]",tS="[object DataView]",nS="[object Float32Array]",rS="[object Float64Array]",iS="[object Int8Array]",sS="[object Int16Array]",oS="[object Int32Array]",aS="[object Uint8Array]",lS="[object Uint8ClampedArray]",uS="[object Uint16Array]",cS="[object Uint32Array]",H={};H[nS]=H[rS]=H[iS]=H[sS]=H[oS]=H[aS]=H[lS]=H[uS]=H[cS]=!0;H[zE]=H[$E]=H[eS]=H[BE]=H[tS]=H[HE]=H[WE]=H[KE]=H[GE]=H[qE]=H[QE]=H[YE]=H[JE]=H[XE]=H[ZE]=!1;function dS(t){return Fu(t)&&Tm(t.length)&&!!H[Uu(t)]}function fS(t){return function(e){return t(e)}}var Cm=typeof wt=="object"&&wt&&!wt.nodeType&&wt,Kr=Cm&&typeof Et=="object"&&Et&&!Et.nodeType&&Et,hS=Kr&&Kr.exports===Cm,ca=hS&&wm.process,zd=function(){try{var t=Kr&&Kr.require&&Kr.require("util").types;return t||ca&&ca.binding&&ca.binding("util")}catch{}}(),$d=zd&&zd.isTypedArray,pS=$d?fS($d):dS,mS=Object.prototype,gS=mS.hasOwnProperty;function vS(t,e){var n=Im(t),r=!n&&bE(t),i=!n&&!r&&FE(t),s=!n&&!r&&!i&&pS(t),o=n||r||i||s,a=o?xE(t.length,String):[],l=a.length;for(var u in t)(e||gS.call(t,u))&&!(o&&(u=="length"||i&&(u=="offset"||u=="parent")||s&&(u=="buffer"||u=="byteLength"||u=="byteOffset")||CE(u,l)))&&a.push(u);return a}function yS(t,e){return function(n){return t(e(n))}}var _S=yS(Object.keys,Object),wS=Object.prototype,ES=wS.hasOwnProperty;function SS(t){if(!OE(t))return _S(t);var e=[];for(var n in Object(t))ES.call(t,n)&&n!="constructor"&&e.push(n);return e}function IS(t){return AE(t)?vS(t):SS(t)}function TS(t,e){return vE(e,function(n){return t[n]})}function kS(t){return t==null?[]:TS(t,IS(t))}var PS=Math.floor,CS=Math.random;function RS(t,e){return t+PS(CS()*(e-t+1))}function Rm(t,e){var n=-1,r=t.length,i=r-1;for(e=e===void 0?r:e;++n<e;){var s=RS(n,i),o=t[s];t[s]=t[n],t[n]=o}return t.length=e,t}function AS(t){return Rm(TE(t))}function NS(t){return Rm(kS(t))}function OS(t){var e=Im(t)?AS:NS;return e(t)}const da=({className:t,intent:e,...n})=>k.jsx("button",{className:yn("rounded px-2 py-1 text-xs font-semibold text-white shadow-sm ",{"bg-blue2 hover:bg-blue3":e==="primary","bg-red2 hover:bg-red3":e==="danger","bg-orange2 hover:bg-orange3":e==="warning"},t),type:"button",...n}),ko=async t=>{try{const e=Ri.currentUser.uid,n=im(mm,"users",e);(await hm(n)).exists()?await Dd(n,t,{merge:!0}):await Dd(n,t)}catch(e){console.error("Error saving user data: ",e,t)}},vr=async()=>{try{const t=Ri.currentUser.uid,e=im(mm,"users",t),n=await hm(e);return n.exists()?n.data():null}catch(t){return console.error("Error loading user data:",t),null}},xS=async t=>{await ko({favoriteTranslations:t})},Bd=async()=>{const t=await vr();if(t&&t.favoriteTranslations)try{return t.favoriteTranslations}catch(e){return console.error("Error parsing favorite translations:",e),[]}return[]},DS=async()=>{const t=await vr();return t&&t.lastCourse?t.lastCourse:"titan"},LS=async t=>{await ko({lastCourse:t})},MS=async t=>{const e=await vr();return e&&e.lastLessons?e.lastLessons[t]:null},bS=async(t,e)=>{const n=await vr(),r=n&&n.lastLessons||{};r[t]=e,await ko({lastLessons:r})},VS=async(t,e)=>{var r;const n=await vr();return n&&n.lastOpenSentences?((r=n.lastOpenSentences[t])==null?void 0:r[e])||[]:[]},jS=async(t,e,n)=>{const r=await vr(),i=r&&r.lastOpenSentences||{};i[t]||(i[t]={}),i[t][e]=n,await ko({lastOpenSentences:i})},US=({course:t,lesson:e})=>{const[n,r]=F.useState(null),[i,s]=F.useState([]),[o,a]=F.useState(null),l=aE(o),[u,m]=F.useState(null),h=F.useRef(null);F.useEffect(()=>()=>{var d;(d=h.current)==null||d.pause(),h.current=null},[t,e]);const p=d=>{var S;const _=`./${d.replace(/^\/src\/assets\//,"")}`;(S=h.current)==null||S.pause();const E=new Audio(_);h.current=E,E.play().catch(P=>{P instanceof DOMException&&P.name==="AbortError"||console.error("Error playing phrase audio:",P)})};F.useEffect(()=>{a(null),VS(t,e).then(d=>{a(d)})},[t,e]),F.useEffect(()=>{Bd().then(d=>{m(d)})},[]);const y=d=>{m(g=>{if(!g)return g;const _=(()=>{const E=g.find(S=>S.ru===d.ru&&S.en===d.en);return E?g.filter(S=>S!==E):[...g,d]})();return xS(_),_})};F.useEffect(()=>{let d=!0;return(async()=>{r(null);const g=await(async()=>{if(t==="favorites")return Bd();{const _=`translations/${encodeURIComponent(t)}/${encodeURIComponent(e)}`,E=await fetch(`./${_}/tasks.json`);if(!E.ok)throw new Error(`Failed to load translations: ${E.status}`);return(await E.json()).map(({id:P,ru:b,en:A})=>{const oe={},He=`${_}/audio/${String(P).padStart(3,"0")}`;return b.audio&&(oe.ru=`${He}_ru.m4a`),A.audio&&(oe.en=`${He}_en.m4a`),{ru:b.text,en:A.text,audio:oe}})}})();d&&(r(g),s(new Array(g.length).fill(0).map((_,E)=>E)))})(),()=>{d=!1}},[t,e]);const w=d=>{const g=Number(d.currentTarget.dataset.idx);a(_=>_&&(_.includes(g)?_:[..._,g]))};F.useEffect(()=>{o&&l&&o!==l&&t!=="favorites"&&jS(t,e,o)},[t,e,o,l]);const I=()=>{a([])},j=()=>{a(new Array(n==null?void 0:n.length).fill(0).map((d,g)=>g))},f=()=>{s(d=>OS(d))};if(!n||!o||!u)return k.jsx(Js,{});if(!n.length)return null;const c=k.jsxs("div",{className:"flex justify-center space-x-2",children:[k.jsx(da,{onClick:f,intent:"warning",children:"Перемешать"}),k.jsx(da,{onClick:j,intent:"primary",children:"Открыть все"}),k.jsx(da,{onClick:I,intent:"danger",children:"Закрыть все"})]});return k.jsxs("div",{className:"fade-in",children:[c,k.jsx("div",{className:"mx-auto my-8 max-w-[800px] overflow-hidden rounded-lg border border-gray3",children:k.jsx("table",{className:"w-full",children:k.jsx("tbody",{className:"divide-y divide-gray5 bg-white",children:i.map(d=>{const g=n[d],{ru:_,en:E,audio:S}=g,P=S==null?void 0:S.ru,b=S==null?void 0:S.en,A=o.includes(d),oe=u.find(He=>He.ru===_&&He.en===E);return k.jsxs("tr",{className:"w-[50%] bg-white hover:bg-light-gray5",children:[k.jsx("td",{className:"w-[1px] cursor-pointer px-2",onClick:()=>{y(g)},children:oe?k.jsx(iE,{size:24,className:"text-orange5 opacity-50"}):k.jsx(sE,{size:24,className:"text-light-gray3"})}),k.jsx("td",{className:"p-4 text-right align-top",children:P?k.jsx("button",{type:"button",className:"text-right",onClick:()=>p(P),children:k.jsx("span",{className:"audio-phrase",children:_})}):_}),k.jsx("td",{className:yn("w-[50%] p-4 align-top",{"cursor-pointer":!A}),onClick:w,"data-idx":d,children:k.jsx("div",{className:yn("transition-all",{"h-full w-full bg-gray5 text-left text-gray5":!A,"text-blue1":A}),children:b?k.jsx("button",{type:"button",className:"text-left",onClick:()=>p(b),children:k.jsx("span",{className:yn({"audio-phrase":A}),children:E})}):E})})]},`${t}_${e}_${d}`)})})})}),c]})},FS=(()=>{const t=[{from:1,to:50,prefix:"A0"},{from:51,to:100,prefix:"A1"},{from:101,to:150,prefix:"A2"},{from:151,to:200,prefix:"B1"},{from:201,to:250,prefix:"B2"}];return new Array(211).fill(null).map((e,n)=>{const r=n+1;return{label:`${t.find(s=>r>=s.from&&r<=s.to).prefix} - ${r}`,value:String(r)}})})(),zS=(()=>{const t=[{from:1,to:50,prefix:"A0"},{from:1,to:50,prefix:"A1"},{from:1,to:50,prefix:"A2"},{from:1,to:50,prefix:"B1"},{from:1,to:22,prefix:"B2"}],e=[];return t.forEach(n=>{for(let r=n.from;r<=n.to;r++)r%2&&e.push({label:`${n.prefix} - ${r}-${r+1}`,value:`${n.prefix} ${r}-${r+1}`})}),e})(),$S=()=>{const[t,e]=F.useState(null),[n,r]=F.useState(null),i=F.useMemo(()=>t==="titan"?FS:t==="express"?zS:[],[t]);F.useEffect(()=>{t===null&&DS().then(a=>e(a)),t&&!n&&MS(t).then(a=>{var l;r(a||((l=i[0])==null?void 0:l.value)||"")})},[t,n,i]);const s=a=>{const l=a;e(l),r(null),LS(l)},o=a=>{r(a),bS(t,a)};return t?k.jsxs("div",{children:[k.jsxs("div",{className:"flex items-center justify-between border-b border-gray3 bg-light-gray3 px-4 py-2",children:[k.jsx("h1",{className:"text-gray-500 text-lg font-bold",children:"Learn English"}),k.jsxs("div",{className:"flex items-center space-x-4",children:[k.jsx(bd,{label:"Курс",value:t,onChange:s,options:[{label:"Titan",value:"titan"},{label:"Express",value:"express"},{label:"Favorites",value:"favorites"}]}),k.jsx(bd,{label:"Урок",value:n||"",onChange:o,options:n?i:[],selectMinWidth:"120px",disabled:t==="favorites"}),k.jsx(oE,{})]})]}),k.jsx("div",{className:"p-8",children:t&&n!==null?k.jsx(US,{course:t,lesson:n}):k.jsx(Js,{})}),k.jsx("button",{type:"button",className:"group fixed bottom-0 right-0 z-10 block p-4",onClick:()=>window.scrollTo({top:0,behavior:"smooth"}),children:k.jsx("div",{className:"rounded-full border border-gray5 p-2 text-gray3 transition group-hover:border-dark-gray1 group-hover:text-dark-gray1 bg-light-gray5",children:k.jsx(tE,{size:24})})})]}):k.jsx(Js,{})},BS=({})=>{const[t,e]=F.useState(null),[n,r]=F.useState(!0);return F.useEffect(()=>{const i=Ri.onAuthStateChanged(s=>{e(s),r(!1)});return()=>i()},[]),n?k.jsx(Js,{}):t?k.jsx($S,{}):k.jsx(eE,{})},HS=ay(document.documentElement,"focus-disabled");HS.start();fa.createRoot(document.getElementById("root")).render(k.jsx(BS,{}))});export default WS();
