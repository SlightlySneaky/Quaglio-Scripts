import{r as g,j as L,X as Ne,g as lo}from"./react-vendor-C3hsl3NC.js";import{V as Q,d as ie,e as co,C as uo,f as fo,H as po,R as ho,L as Ut,E as mo,g as go}from"./three-DnnX4Mxg.js";(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))o(r);new MutationObserver(r=>{for(const i of r)if(i.type==="childList")for(const s of i.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&o(s)}).observe(document,{childList:!0,subtree:!0});function e(r){const i={};return r.integrity&&(i.integrity=r.integrity),r.referrerPolicy&&(i.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?i.credentials="include":r.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function o(r){if(r.ep)return;r.ep=!0;const i=e(r);fetch(r.href,i)}})();const un=g.createContext(null);function Ms({children:t}){const n=g.useRef(null),e=g.useCallback(r=>{n.current=r},[]),o=g.useCallback((r,i)=>{const s=n.current;if(!s)return null;const a=s.domElement,l=a.getBoundingClientRect(),c=(r-l.left)*(a.width/l.width),u=(i-l.top)*(a.height/l.height);if(c<0||c>=a.width||u<0||u>=a.height)return null;const d=new Uint8Array(4),f=s.getContext();return f.readPixels(Math.floor(c),a.height-Math.floor(u)-1,1,1,f.RGBA,f.UNSIGNED_BYTE,d),{r:d[0]/255,g:d[1]/255,b:d[2]/255,a:d[3]/255}},[]);return L.jsx(un.Provider,{value:{setRenderer:e,pickColor:o},children:t})}function Ps(){const t=g.useContext(un);if(!t)throw new Error("useEyedropper must be used within EyedropperProvider");return t}const dn={textLayers:!1,keyframeAnimation:!1,meshGeneration:!1,savePremade:!1,isFigma:!1,isFramer:!1},fn=g.createContext(dn);function Ds({features:t,children:n}){const e=g.useMemo(()=>({...dn,...t}),[t]);return L.jsx(fn.Provider,{value:e,children:n})}function _s(){return g.useContext(fn)}const zt=t=>{let n;const e=new Set,o=(c,u)=>{const d=typeof c=="function"?c(n):c;if(!Object.is(d,n)){const f=n;n=u??(typeof d!="object"||d===null)?d:Object.assign({},n,d),e.forEach(p=>p(n,f))}},r=()=>n,a={setState:o,getState:r,getInitialState:()=>l,subscribe:c=>(e.add(c),()=>e.delete(c))},l=n=t(o,r,a);return a},pn=(t=>t?zt(t):zt),vo=t=>t;function xo(t,n=vo){const e=Ne.useSyncExternalStore(t.subscribe,Ne.useCallback(()=>n(t.getState()),[t,n]),Ne.useCallback(()=>n(t.getInitialState()),[t,n]));return Ne.useDebugValue(e),e}const jt=t=>{const n=pn(t),e=o=>xo(n,o);return Object.assign(e,n),e},yo=(t=>t?jt(t):jt);var Nt=(t,n,e)=>(r,i)=>({pastStates:e?.pastStates||[],futureStates:e?.futureStates||[],undo:(s=1)=>{if(i().pastStates.length){const a=e?.partialize?.(n())||n(),l=i().pastStates.splice(-s,s),c=l.shift();t(c),r({pastStates:i().pastStates,futureStates:i().futureStates.concat(e?.diff?.(a,c)||a,l.reverse())})}},redo:(s=1)=>{if(i().futureStates.length){const a=e?.partialize?.(n())||n(),l=i().futureStates.splice(-s,s),c=l.shift();t(c),r({pastStates:i().pastStates.concat(e?.diff?.(a,c)||a,l.reverse()),futureStates:i().futureStates})}},clear:()=>r({pastStates:[],futureStates:[]}),isTracking:!0,pause:()=>r({isTracking:!1}),resume:()=>r({isTracking:!0}),setOnSave:s=>r({_onSave:s}),_onSave:e?.onSave,_handleSet:(s,a,l,c)=>{e?.limit&&i().pastStates.length>=e?.limit&&i().pastStates.shift(),i()._onSave?.(s,l),r({pastStates:i().pastStates.concat(c||s),futureStates:[]})}}),wo=(t,n)=>(o,r,i)=>{i.temporal=pn(n?.wrapTemporal?.(Nt(o,r,n))||Nt(o,r,n));const s=n?.handleSet?.(i.temporal.getState()._handleSet)||i.temporal.getState()._handleSet,a=c=>{if(!i.temporal.getState().isTracking)return;const u=n?.partialize?.(r())||r(),d=n?.diff?.(c,u);d===null||n?.equality?.(c,u)||s(c,void 0,u,d)},l=i.setState;return i.setState=(...c)=>{const u=n?.partialize?.(r())||r();l(...c),a(u)},t((...c)=>{const u=n?.partialize?.(r())||r();o(...c),a(u)},r,i)};const Is={chromaticAberration:"Chromatic Aberration",filmGrain:"Film Grain",exposureContrast:"Exposure/Contrast",progressiveBlur:"Progressive Blur",halftone:"Halftone",hueSaturation:"Hue/Saturation",colorBalance:"Color Balance",glassDistortion:"Glass Distortion",pixelation:"Pixelation",watercolor:"Watercolor",vhs:"VHS"},St={exposure:0,contrast:0,hue:0,saturation:0,lightness:0};function Ht(t,n){const e={id:n,enabled:!0};switch(t){case"chromaticAberration":return{...e,type:"chromaticAberration",offset:3};case"filmGrain":return{...e,type:"filmGrain",intensity:.3,size:1.5};case"exposureContrast":return{...e,type:"exposureContrast",exposure:0,contrast:0};case"progressiveBlur":return{...e,type:"progressiveBlur",startX:.5,startY:0,endX:.5,endY:1,startBlur:0,endBlur:20,quality:1};case"halftone":return{...e,type:"halftone",radius:2,scatter:0,blending:1};case"hueSaturation":return{...e,type:"hueSaturation",hue:0,saturation:0,lightness:0};case"colorBalance":return{...e,type:"colorBalance",cyanRed:0,magentaGreen:0,yellowBlue:0};case"glassDistortion":return{...e,type:"glassDistortion",shape:"strips",cells:15,distortion:30,angle:0,aberration:.3,edge:.5,ior:1.5,fresnel:.5,frost:0,bevel:.15,cornerRadius:.033};case"pixelation":return{...e,type:"pixelation",pixelWidth:8,pixelHeight:8,density:1};case"watercolor":return{...e,type:"watercolor",edgeIntensity:.5,colorBleed:1.5,paperTexture:.3};case"vhs":return{...e,type:"vhs",scanlines:.4,grille:.3,roll:.5,noise:.4,aberration:.5,warp:1}}}function bo(t){const n=e=>Math.round(Math.max(0,Math.min(1,e))*255).toString(16).padStart(2,"0");return`#${n(t.r)}${n(t.g)}${n(t.b)}`}function hn(t,n){const e=t.replace("#",""),o=parseInt(e.slice(0,2),16)/255,r=parseInt(e.slice(2,4),16)/255,i=parseInt(e.slice(4,6),16)/255;return{r:o,g:r,b:i,a:n}}function Co(t){return{mode:"solid",color:bo(t),alpha:t.a}}function Ls(t){return hn(t.color,t.alpha)}function Es(t){return t.mode==="solid"?hn(t.color,t.alpha):null}const So={gridRows:3,gridCols:3,pattern:"corners",direction:"diagonal-tl",harmony:"custom",baseHue:200,hueRange:60,colorCount:4,saturationMin:.5,saturationMax:.9,lightnessMin:.4,lightnessMax:.7,randomness:.1,positionJitter:.5,handleLength:.3,handleVariation:.5,smoothness:.5,flowStrength:.5,flowType:"circular",seed:42};function ee(t,n,e,o,r){const i=r*r,s=i*r,a=1-r,l=a*a;return l*a*t+3*l*r*n+3*a*i*e+s*o}function Qe(t,n,e){return t+(n-t)*e}function ko(t,n,e){return{r:Qe(t.r,n.r,e),g:Qe(t.g,n.g,e),b:Qe(t.b,n.b,e),a:Qe(t.a,n.a,e)}}function re(){return Math.random().toString(36).substring(2,9)}function lt(t,n,e){const o=t.topCurve(n),r=t.bottomCurve(n),i=t.leftCurve(e),s=t.rightCurve(e),a={x:(1-n)*(1-e)*t.tl.x+n*(1-e)*t.tr.x+(1-n)*e*t.bl.x+n*e*t.br.x,y:(1-n)*(1-e)*t.tl.y+n*(1-e)*t.tr.y+(1-n)*e*t.bl.y+n*e*t.br.y};return{x:(1-e)*o.x+e*r.x+(1-n)*i.x+n*s.x-a.x,y:(1-e)*o.y+e*r.y+(1-n)*i.y+n*s.y-a.y}}function Mo(t,n,e=10){let o=.5,r=.5,i=1/0;for(let a=0;a<=e;a++)for(let l=0;l<=e;l++){const c=a/e,u=l/e,d=lt(t,c,u),f=(d.x-n.x)**2+(d.y-n.y)**2;f<i&&(i=f,o=c,r=u)}const s=1/e;for(let a=0;a<5;a++){const l=s/2**a;for(const c of[-l,0,l])for(const u of[-l,0,l]){const d=Math.max(0,Math.min(1,o+c)),f=Math.max(0,Math.min(1,r+u)),p=lt(t,d,f),h=(p.x-n.x)**2+(p.y-n.y)**2;h<i&&(i=h,o=d,r=f)}}return{u:o,v:r}}function _t(t,n,e,o,r,i){const s=u=>{const d=t.position.x+t.handles.handleRight.x*r,f=t.position.y+t.handles.handleRight.y*i,p=n.position.x+n.handles.handleLeft.x*r,h=n.position.y+n.handles.handleLeft.y*i;return{x:ee(t.position.x,d,p,n.position.x,u),y:ee(t.position.y,f,h,n.position.y,u)}},a=u=>{const d=e.position.x+e.handles.handleRight.x*r,f=e.position.y+e.handles.handleRight.y*i,p=o.position.x+o.handles.handleLeft.x*r,h=o.position.y+o.handles.handleLeft.y*i;return{x:ee(e.position.x,d,p,o.position.x,u),y:ee(e.position.y,f,h,o.position.y,u)}},l=u=>{const d=t.position.x+t.handles.handleDown.x*r,f=t.position.y+t.handles.handleDown.y*i,p=e.position.x+e.handles.handleUp.x*r,h=e.position.y+e.handles.handleUp.y*i;return{x:ee(t.position.x,d,p,e.position.x,u),y:ee(t.position.y,f,h,e.position.y,u)}},c=u=>{const d=n.position.x+n.handles.handleDown.x*r,f=n.position.y+n.handles.handleDown.y*i,p=o.position.x+o.handles.handleUp.x*r,h=o.position.y+o.handles.handleUp.y*i;return{x:ee(n.position.x,d,p,o.position.x,u),y:ee(n.position.y,f,h,o.position.y,u)}};return{tl:t.position,tr:n.position,bl:e.position,br:o.position,topCurve:s,bottomCurve:a,leftCurve:l,rightCurve:c}}function mn(t,n,e,o,r,i){if(i==="horizontal"){const s=t.position.x+t.handles.handleRight.x*o,a=t.position.y+t.handles.handleRight.y*r,l=n.position.x+n.handles.handleLeft.x*o,c=n.position.y+n.handles.handleLeft.y*r;return{x:ee(t.position.x,s,l,n.position.x,e),y:ee(t.position.y,a,c,n.position.y,e)}}else{const s=t.position.x+t.handles.handleDown.x*o,a=t.position.y+t.handles.handleDown.y*r,l=n.position.x+n.handles.handleUp.x*o,c=n.position.y+n.handles.handleUp.y*r;return{x:ee(t.position.x,s,l,n.position.x,e),y:ee(t.position.y,a,c,n.position.y,e)}}}function gn(t,n,e){return ko(t,n,e)}function vn(t,n,e,o,r,i){const s=r/(o-1),a=i/(e-1),l=s/3/r,c=a/3/i;return{handleLeft:n>0?{x:-l,y:0}:{x:0,y:0},handleRight:n<o-1?{x:l,y:0}:{x:0,y:0},handleUp:t>0?{x:0,y:-c}:{x:0,y:0},handleDown:t<e-1?{x:0,y:c}:{x:0,y:0},type:"smooth"}}function Po(t,n,e){const{rows:o,cols:r,points:i,width:s,height:a}=t;if(n<0||n>=o-1)return t;const l=o+1,c=[];for(let p=0;p<=n;p++)c.push(i[p].map(h=>({...h,row:p})));const u=[],d=i[n],f=i[n+1];for(let p=0;p<r;p++){const h=d[p],m=f[p],x=mn(h,m,e,s,a,"vertical"),y=gn(h.color,m.color,e);u.push({id:re(),row:n+1,col:p,position:x,color:y,handles:vn(n+1,p,l,r,s,a)})}c.push(u);for(let p=n+1;p<o;p++)c.push(i[p].map(h=>({...h,row:p+1})));return{rows:l,cols:r,points:c,width:s,height:a}}function Do(t,n,e){const{rows:o,cols:r,points:i,width:s,height:a}=t;if(n<0||n>=r-1)return t;const l=r+1,c=[];for(let u=0;u<o;u++){const d=[],f=i[u];for(let y=0;y<=n;y++)d.push({...f[y],col:y});const p=f[n],h=f[n+1],m=mn(p,h,e,s,a,"horizontal"),x=gn(p.color,h.color,e);d.push({id:re(),row:u,col:n+1,position:m,color:x,handles:vn(u,n+1,o,l,s,a)});for(let y=n+1;y<r;y++)d.push({...f[y],col:y+1});c.push(d)}return{rows:o,cols:l,points:c,width:s,height:a}}function _o(t,n){const{rows:e,cols:o,points:r,width:i,height:s}=t;if(e<=2||n<0||n>=e)return t;const a=e-1,l=[];for(let c=0;c<e;c++){if(c===n)continue;const u=c<n?c:c-1;l.push(r[c].map(d=>({...d,row:u})))}return{rows:a,cols:o,points:l,width:i,height:s}}function Io(t,n){const{rows:e,cols:o,points:r,width:i,height:s}=t;if(o<=2||n<0||n>=o)return t;const a=o-1,l=[];for(let c=0;c<e;c++){const u=[];for(let d=0;d<o;d++){if(d===n)continue;const f=d<n?d:d-1;u.push({...r[c][d],col:f})}l.push(u)}return{rows:e,cols:a,points:l,width:i,height:s}}function As(t,n,e,o=20){const{rows:r,cols:i,points:s}=t;for(let a=0;a<r-1;a++)for(let l=0;l<i-1;l++){const c=s[a][l],u=s[a][l+1],d=s[a+1][l],f=s[a+1][l+1],p=Math.min(c.position.x,u.position.x,d.position.x,f.position.x),h=Math.max(c.position.x,u.position.x,d.position.x,f.position.x),m=Math.min(c.position.y,u.position.y,d.position.y,f.position.y),x=Math.max(c.position.y,u.position.y,d.position.y,f.position.y);if(n>=p&&n<=h&&e>=m&&e<=x){const y={x:n,y:e},{width:S,height:C}=t,w=_t(c,u,d,f,S,C),{u:k,v:b}=Mo(w,y),M=w.topCurve(k),_=w.bottomCurve(k),O=w.leftCurve(b),z=w.rightCurve(b),F=Math.hypot(y.x-M.x,y.y-M.y),D=Math.hypot(y.x-_.x,y.y-_.y),A=Math.hypot(y.x-O.x,y.y-O.y),B=Math.hypot(y.x-z.x,y.y-z.y),$=F<o||D<o,K=A<o||B<o;let G="inside";return $&&K?G="inside":$?G="horizontal-edge":K&&(G="vertical-edge"),{patchRow:a,patchCol:l,localU:k,localV:b,hitType:G}}}return null}function Lo(t,n,e){const{cols:o,points:r,width:i,height:s}=t;if(n<0||n>=t.rows-1)return"";const a=[],l=10;for(let u=0;u<o-1;u++){const d=r[n][u],f=r[n][u+1],p=r[n+1][u],h=r[n+1][u+1],m=_t(d,f,p,h,i,s),x=u===0?0:1;for(let y=x;y<=l;y++){const S=y/l;a.push(lt(m,S,e))}}if(a.length===0)return"";let c=`M ${a[0].x} ${a[0].y}`;for(let u=1;u<a.length;u++)c+=` L ${a[u].x} ${a[u].y}`;return c}function Eo(t,n,e){const{rows:o,points:r,width:i,height:s}=t;if(n<0||n>=t.cols-1)return"";const a=[],l=10;for(let u=0;u<o-1;u++){const d=r[u][n],f=r[u][n+1],p=r[u+1][n],h=r[u+1][n+1],m=_t(d,f,p,h,i,s),x=u===0?0:1;for(let y=x;y<=l;y++){const S=y/l;a.push(lt(m,e,S))}}if(a.length===0)return"";let c=`M ${a[0].x} ${a[0].y}`;for(let u=1;u<a.length;u++)c+=` L ${a[u].x} ${a[u].y}`;return c}function De(t){const n=e=>e<=.04045?e/12.92:Math.pow((e+.055)/1.055,2.4);return{r:n(t.r),g:n(t.g),b:n(t.b),a:t.a}}function It(t){const n=e=>e<=.0031308?e*12.92:1.055*Math.pow(e,.4166666666666667)-.055;return{r:n(t.r),g:n(t.g),b:n(t.b),a:t.a}}function dt(t){return{r:Math.max(0,Math.min(1,t.r)),g:Math.max(0,Math.min(1,t.g)),b:Math.max(0,Math.min(1,t.b)),a:Math.max(0,Math.min(1,t.a))}}function Ze(t){const n=De(t),e=.4122214708*n.r+.5363325363*n.g+.0514459929*n.b,o=.2119034982*n.r+.6806995451*n.g+.1073969566*n.b,r=.0883024619*n.r+.2817188376*n.g+.6299787005*n.b,i=Math.cbrt(e),s=Math.cbrt(o),a=Math.cbrt(r);return{L:.2104542553*i+.793617785*s-.0040720468*a,a:1.9779984951*i-2.428592205*s+.4505937099*a,b:.0259040371*i+.7827717662*s-.808675766*a,alpha:t.a}}function Ao(t){const n=t.L+.3963377774*t.a+.2158037573*t.b,e=t.L-.1055613458*t.a-.0638541728*t.b,o=t.L-.0894841775*t.a-1.291485548*t.b,r=n*n*n,i=e*e*e,s=o*o*o,a={r:4.0767416621*r-3.3077115913*i+.2309699292*s,g:-1.2684380046*r+2.6097574011*i-.3413193965*s,b:-.0041960863*r-.7034186147*i+1.707614701*s,a:t.alpha};return dt(It(a))}const _e={X:.95047,Y:1,Z:1.08883};function Ro(t){const n=De(t),e=.4124564*n.r+.3575761*n.g+.1804375*n.b,o=.2126729*n.r+.7151522*n.g+.072175*n.b,r=.0193339*n.r+.119192*n.g+.9503041*n.b;return{X:e,Y:o,Z:r}}function To(t,n){const e=3.2404542*t.X-1.5371385*t.Y-.4985314*t.Z,o=-.969266*t.X+1.8760108*t.Y+.041556*t.Z,r=.0556434*t.X-.2040259*t.Y+1.0572252*t.Z;return dt(It({r:e,g:o,b:r,a:n}))}function He(t){const n=Ro(t),e=s=>s>.008856?Math.cbrt(s):7.787*s+16/116,o=e(n.X/_e.X),r=e(n.Y/_e.Y),i=e(n.Z/_e.Z);return{L:116*r-16,a:500*(o-r),b:200*(r-i),alpha:t.a}}function xn(t){const n=(t.L+16)/116,e=t.a/500+n,o=n-t.b/200,r=s=>{const a=s*s*s;return a>.008856?a:(s-16/116)/7.787},i={X:_e.X*r(e),Y:_e.Y*r(n),Z:_e.Z*r(o)};return To(i,t.alpha)}function Bo(t){const n=Math.sqrt(t.a*t.a+t.b*t.b);let e=Math.atan2(t.b,t.a);return e<0&&(e+=2*Math.PI),{L:t.L,C:n,h:e,alpha:t.alpha}}function Uo(t){return{L:t.L,a:t.C*Math.cos(t.h),b:t.C*Math.sin(t.h),alpha:t.alpha}}function Je(t){return Bo(He(t))}function zo(t){return xn(Uo(t))}function ae(t){const n=t.r,e=t.g,o=t.b,r=Math.max(n,e,o),i=Math.min(n,e,o),s=(r+i)/2;let a=0,l=0;if(r!==i){const c=r-i;switch(l=s>.5?c/(2-r-i):c/(r+i),r){case n:a=((e-o)/c+(e<o?6:0))/6;break;case e:a=((o-n)/c+2)/6;break;case o:a=((n-e)/c+4)/6;break}}return{h:a,s:l,l:s,alpha:t.a}}function Le(t){const{h:n,s:e,l:o,alpha:r}=t;if(e===0)return{r:o,g:o,b:o,a:r};const i=(l,c,u)=>(u<0&&(u+=1),u>1&&(u-=1),u<1/6?l+(c-l)*6*u:u<1/2?c:u<2/3?l+(c-l)*(2/3-u)*6:l),s=o<.5?o*(1+e):o+e-o*e,a=2*o-s;return dt({r:i(a,s,n+1/3),g:i(a,s,n),b:i(a,s,n-1/3),a:r})}function jo(t){let n=t;return()=>{n=n+1831565813|0;let e=n;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}function No(t,n,e,o,r){return Ho(t,n,e,o.hueRange).map((s,a)=>{const l=e>1?a/(e-1):.5,c=a%2===0?l:1-l,u=a%2===0?1-l:l,d=de(o.saturationMin,o.saturationMax,c+(r()-.5)*o.randomness*.5),f=de(o.lightnessMin,o.lightnessMax,u+(r()-.5)*o.randomness*.5),p=(r()-.5)*o.randomness*20;return Le({h:((s+p)%360+360)%360/360,s:Ie(d,0,1),l:Ie(f,0,1),alpha:1})})}function Ho(t,n,e,o){const r=Math.max(o,10);switch(n){case"monochromatic":return Array.from({length:e},(i,s)=>{const a=e>1?s/(e-1):.5;return t+(a-.5)*Math.min(r,30)});case"complementary":return Array.from({length:e},(i,s)=>{const a=s>=e/2,l=a?s-Math.floor(e/2):s,c=a?e-Math.floor(e/2):Math.floor(e/2),u=c>1?l/(c-1):.5,d=r*.3;return(a?t+180:t)+(u-.5)*d});case"analogous":return Array.from({length:e},(i,s)=>{const a=e>1?s/(e-1):.5;return t-r/2+a*r});case"triadic":return Array.from({length:e},(i,s)=>{const a=s%3*120,l=Math.floor(s/3),c=Math.ceil(e/3),u=c>1?l/(c-1):.5,d=r*.3;return t+a+(u-.5)*d});case"split-complementary":return Array.from({length:e},(i,s)=>{const l=[0,150,210][s%3],c=Math.floor(s/3),u=Math.ceil(e/3),d=u>1?c/(u-1):.5,f=r*.25;return t+l+(d-.5)*f});case"tetradic":return Array.from({length:e},(i,s)=>{const a=s%4*90,l=Math.floor(s/4),c=Math.ceil(e/4),u=c>1?l/(c-1):.5,d=r*.2;return t+a+(u-.5)*d});case"custom":default:return Array.from({length:e},(i,s)=>{const a=e>1?s/(e-1):.5;return t+a*r})}}function Fo(t,n,e,o,r,i,s,a){const l=o>1?n/(o-1):.5,c=e>1?t/(e-1):.5;let u;switch(r.pattern){case"linear":u=Oo(l,c,r.direction);break;case"radial":u=Go(l,c);break;case"diagonal":u=Vo(l,c,r.direction);break;case"noise":u=$o(l,c,r.seed);break;case"waves":u=Xo(l,c,r.seed);break;case"spiral":u=Ko(l,c);break;case"corners":default:return Yo(l,c,i,r.randomness,s,a)}return u=Ie(u+(s()-.5)*r.randomness*.5,0,1),Fe(i,u,a)}function Oo(t,n,e){switch(e){case"horizontal":return t;case"vertical":return n;case"diagonal-tl":return(t+n)/2;case"diagonal-tr":default:return(1-t+n)/2}}function Go(t,n){const e=t-.5,o=n-.5;return Math.min(1,Math.sqrt(e*e+o*o)*2)}function Vo(t,n,e){let o;switch(e){case"diagonal-tl":o=t+n;break;case"diagonal-tr":o=1-t+n;break;default:o=t+n}return(Math.sin(o*Math.PI*2)+1)/2}function $o(t,n,e){const r=t*3,i=n*3,s=Math.floor(r),a=Math.floor(i),l=r-s,c=i-a,u=l*l*(3-2*l),d=c*c*(3-2*c),f=(C,w)=>{const k=Math.sin(C*12.9898+w*78.233+e)*43758.5453;return k-Math.floor(k)},p=f(s,a),h=f(s+1,a),m=f(s,a+1),x=f(s+1,a+1),y=de(p,h,u),S=de(m,x,u);return de(y,S,d)}function Xo(t,n,e){const o=2+e%3,r=Math.sin(t*Math.PI*o),i=Math.sin(n*Math.PI*o*.7+e*.1);return(r*i+1)/2}function Ko(t,n){const e=t-.5,o=n-.5,r=Math.atan2(o,e),i=Math.sqrt(e*e+o*o),s=(r/(2*Math.PI)+i*2)%1;return s<0?s+1:s}function Yo(t,n,e,o,r,i){const s=Fe(e,0,i),a=Fe(e,.33,i),l=Fe(e,.67,i),c=Fe(e,1,i),u=ae(s),d=ae(a),f=ae(l),p=ae(c),h=[u.h,d.h,f.h,p.h],m=Wo(h),x=ht(m[0],m[1],m[2],m[3],t,n),y=ht(u.s,d.s,f.s,p.s,t,n),S=ht(u.l,d.l,f.l,p.l,t,n),C=(r()-.5)*o*.1;return Le({h:((x+C)%1+1)%1,s:Ie(y,0,1),l:Ie(S,0,1),alpha:1})}function Wo(t){const n=[...t],e=n[0];for(let o=1;o<n.length;o++){let r=n[o]-e;r>.5?n[o]=n[o]-1:r<-.5&&(n[o]=n[o]+1)}return n}function qo(t){const n=t.reduce((r,i)=>r+i,0);if(n===0)return t.map((r,i)=>i/(t.length-1||1));const e=[0];let o=0;for(let r=0;r<t.length-1;r++)o+=t[r]/n,e.push(o);return e.push(1),e}function Fe(t,n,e){if(t.length===0)return{r:1,g:1,b:1,a:1};if(t.length===1)return t[0];const o=e&&e.length===t.length?qo(e):t.map((m,x)=>x/(t.length-1));let r=0;for(let m=0;m<o.length-1;m++)if(n>=o[m]&&n<=o[m+1]){r=m;break}const i=o[r],a=(o[r+1]??1)-i,l=a>0?(n-i)/a:0,c=t[Math.min(r,t.length-1)],u=t[Math.min(r+1,t.length-1)],d=ae(c),f=ae(u);let p=d.h,h=f.h;return h-p>.5&&(p+=1),p-h>.5&&(h+=1),Le({h:(de(p,h,l)%1+1)%1,s:de(d.s,f.s,l),l:de(d.l,f.l,l),alpha:de(d.alpha,f.alpha,l)})}function Qo(t,n,e,o,r,i,s,a){if(e===0||e===r-1||o===0||o===i-1||s===0)return{x:t,y:n};const c=1/(i-1),u=1/(r-1),d=Math.min(c,u)*.4*s;return{x:t+(a()-.5)*2*d,y:n+(a()-.5)*2*d}}function Zo(t,n,e,o){const s=t-.5,a=n-.5;switch(e){case"circular":return Math.atan2(s,-a);case"spiral":const l=Math.atan2(s,-a),c=Math.atan2(a,s);return l*.7+c*.3;case"wave":return Math.sin(t*Math.PI*2+o*.1)*Math.PI*.5;case"diagonal":return Math.PI*.25;case"none":default:return 0}}function Jo(t,n,e,o,r,i,s,a){const l=s.handleLength,c=s.handleVariation,u=s.smoothness??.5,d=s.flowStrength??0,f=s.flowType??"none",p=o>1?n/(o-1):.5,h=e>1?t/(e-1):.5,m=()=>{const E=l*(1+(a()-.5)*2*c);return Ie(E,.05,.8)},x=m()*r*.5,y=m()*i*.5,S=n===0,C=n===o-1,w=t===0,k=t===e-1,b=Zo(p,h,f,s.seed),M=(a()-.5)*Math.PI*(1-u),_=b*d+M*(1-d*.5),O=Math.cos(_),z=Math.sin(_),F=u*d;let D=-x,A=x*z*F,B=x,$=-x*z*F,K=y*O*F,G=-y,N=-y*O*F,Y=y;const P=1-u*.5;return A*=P,$*=P,K*=P,N*=P,(w||k)&&(A=0,$=0),(S||C)&&(K=0,N=0),{handleLeft:{x:S?0:D,y:S?0:A},handleRight:{x:C?0:B,y:C?0:$},handleUp:{x:w?0:K,y:w?0:G},handleDown:{x:k?0:N,y:k?0:Y}}}function er(t,n,e){const o=jo(e.seed),r=e.colorCount||4;let i=e.harmony==="custom"&&e.customColors?.length?e.customColors:No(e.baseHue,e.harmony,r,e,o);const s=e.colorWeights,a=n>1?1/(n-1):1,l=t>1?1/(t-1):1,c=[];for(let u=0;u<t;u++)for(let d=0;d<n;d++){const f=n>1?d/(n-1):.5,p=t>1?u/(t-1):.5,{x:h,y:m}=Qo(f,p,u,d,t,n,e.positionJitter,o),x=Fo(u,d,t,n,e,i,o,s),y=Jo(u,d,t,n,a,l,e,o);c.push({row:u,col:d,position:{x:h,y:m},color:x,handles:y})}return c}function de(t,n,e){return t+(n-t)*e}function Ie(t,n,e){return Math.max(n,Math.min(e,t))}function ht(t,n,e,o,r,i){return(1-r)*(1-i)*t+r*(1-i)*n+(1-r)*i*e+r*i*o}const Ft=[330,270,220,180,140,80,45,15,0];function tr(t,n,e){t=t/360;let o,r,i;if(n===0)o=r=i=e;else{const s=(c,u,d)=>(d<0&&(d+=1),d>1&&(d-=1),d<.16666666666666666?c+(u-c)*6*d:d<.5?u:d<.6666666666666666?c+(u-c)*(.6666666666666666-d)*6:c),a=e<.5?e*(1+n):e+n-e*n,l=2*e-a;o=s(l,a,t+1/3),r=s(l,a,t),i=s(l,a,t-1/3)}return{r:o,g:r,b:i,a:1}}function yn(t){const n=Ft[Math.floor(Math.random()*Ft.length)],e=.7+Math.random()*.3,o=.35+Math.random()*.2,r=30+Math.random()*60;return Array.from({length:t},(i,s)=>{const a=s/(t-1||1)*r-r/2,l=(n+a+360)%360;return tr(l,e,o)})}const et=600;function nr(t){const n=t.width/t.height;return n>=1?{width:et,height:Math.round(et/n)}:{width:Math.round(et*n),height:et}}function or(t,n,e,o,r,i,s,a){const l=r/3/s,c=i/3/a;return{handleLeft:n>0?{x:-l,y:0}:{x:0,y:0},handleRight:n<o-1?{x:l,y:0}:{x:0,y:0},handleUp:t>0?{x:0,y:-c}:{x:0,y:0},handleDown:t<e-1?{x:0,y:c}:{x:0,y:0},type:"smooth"}}function Pe(t,n,e,o){const r=[],i=e/(n-1),s=o/(t-1),a=t*n,l=yn(a);for(let c=0;c<t;c++){const u=[];for(let d=0;d<n;d++){const f=c*n+d;u.push({id:re(),row:c,col:d,position:{x:d*i,y:c*s},color:l[f],handles:or(c,d,t,n,i,s,e,o)})}r.push(u)}return{rows:t,cols:n,points:r,width:e,height:o}}function rr(t,n,e,o,r,i,s,a,l){const c=2*Math.PI/o,u=4/3*Math.tan(c/4),d=-Math.sin(r),f=Math.cos(r),p=Math.cos(r),h=Math.sin(r),m=u*i,y=s/(e-1)/3;return t===0?{handleLeft:{x:0,y:0},handleRight:{x:0,y:0},handleUp:{x:0,y:0},handleDown:{x:0,y:0},type:"smooth"}:{handleLeft:{x:-d*m/a,y:-f*m/l},handleRight:{x:d*m/a,y:f*m/l},handleUp:t>0?{x:-p*y/a,y:-h*y/l}:{x:0,y:0},handleDown:t<e-1?{x:p*y/a,y:h*y/l}:{x:0,y:0},type:"smooth"}}function Be(t,n,e,o){const r=[],i=e/2,s=o/2,a=Math.min(e,o)/2*.9,l=t*n,c=yn(l);for(let u=0;u<t;u++){const d=[],f=u===0?0:u/(t-1)*a;for(let p=0;p<n;p++){const h=p/n*2*Math.PI-Math.PI/2,m=u===0?i:i+f*Math.cos(h),x=u===0?s:s+f*Math.sin(h),y=u*n+p;d.push({id:re(),row:u,col:p,position:{x:m,y:x},color:c[y],handles:rr(u,p,t,n,h,f,a,e,o)})}r.push(d)}return{rows:t,cols:n,points:r,width:e,height:o}}function ir(t,n,e){const o=n/t.width,r=e/t.height;return{...t,width:n,height:e,points:t.points.map(i=>i.map(s=>({...s,position:{x:s.position.x*o,y:s.position.y*r}})))}}const Ot={duration:3e3,fps:30,loop:"loop",autoPlay:!1},Gt={preset:"easeInOut"},sr={zoom:100,scrollX:0,trackHeight:60,snapToFrames:!0},Rs=[{id:"linear",label:"Linear",category:"basic"},{id:"easeIn",label:"Ease In",category:"basic"},{id:"easeOut",label:"Ease Out",category:"basic"},{id:"easeInOut",label:"Ease In Out",category:"basic"},{id:"easeInQuad",label:"Ease In Quad",category:"quad"},{id:"easeOutQuad",label:"Ease Out Quad",category:"quad"},{id:"easeInOutQuad",label:"Ease In Out Quad",category:"quad"},{id:"easeInCubic",label:"Ease In Cubic",category:"cubic"},{id:"easeOutCubic",label:"Ease Out Cubic",category:"cubic"},{id:"easeInOutCubic",label:"Ease In Out Cubic",category:"cubic"},{id:"easeInElastic",label:"Elastic In",category:"elastic"},{id:"easeOutElastic",label:"Elastic Out",category:"elastic"},{id:"easeInOutElastic",label:"Elastic In Out",category:"elastic"},{id:"easeInBounce",label:"Bounce In",category:"bounce"},{id:"easeOutBounce",label:"Bounce Out",category:"bounce"},{id:"easeInOutBounce",label:"Bounce In Out",category:"bounce"},{id:"cubicBezier",label:"Custom Bezier",category:"custom"}],ar={fixEdges:!0,pointMovement:.15,handleMovement:.2,colorSaturation:0,colorLightness:0,colorHue:0,easing:{preset:"linear"},duration:3e3,speed:1,randomness:.5,seed:Math.floor(Math.random()*1e3)};function Vt(t){return{rows:t.rows,cols:t.cols,points:t.points.map(n=>n.map(e=>({position:{...e.position},color:{...e.color},handles:{handleLeft:{...e.handles.handleLeft},handleRight:{...e.handles.handleRight},handleUp:{...e.handles.handleUp},handleDown:{...e.handles.handleDown},type:e.handles.type}})))}}function Ue(t){return{rows:t.rows,cols:t.cols,points:t.points.map(n=>n.map(e=>({position:{...e.position},color:{...e.color},handles:{handleLeft:{...e.handles.handleLeft},handleRight:{...e.handles.handleRight},handleUp:{...e.handles.handleUp},handleDown:{...e.handles.handleDown},type:e.handles.type}})))}}function tt(t,n){return t.rows!==n.rows||t.cols!==n.cols?(console.warn("[applySnapshotToGrid] Grid size mismatch! Grid:",t.rows,"x",t.cols,"Snapshot:",n.rows,"x",n.cols),t):{...t,points:t.points.map((e,o)=>e.map((r,i)=>{const s=n.points[o]?.[i];return s?{...r,position:{...s.position},color:{...s.color},handles:{handleLeft:{...s.handles.handleLeft},handleRight:{...s.handles.handleRight},handleUp:{...s.handles.handleUp},handleDown:{...s.handles.handleDown},type:s.handles.type}}:r}))}}function nt(t,n,e){return t.rows!==n.rows||t.cols!==n.cols?(console.warn("[applySnapshotToTrackedPoints] Grid size mismatch!"),t):e.size===0?t:{...t,points:t.points.map((o,r)=>o.map((i,s)=>{const a=`${r},${s}`;if(!e.has(a))return i;const l=n.points[r]?.[s];return l?{...i,position:{...l.position},color:{...l.color},handles:{handleLeft:{...l.handles.handleLeft},handleRight:{...l.handles.handleRight},handleUp:{...l.handles.handleUp},handleDown:{...l.handles.handleDown},type:l.handles.type}}:i}))}}function lr(t,n,e){return t.rows!==n.rows||t.cols!==n.cols?(console.warn("Snapshot size mismatch, returning from snapshot"),t):{rows:t.rows,cols:t.cols,points:t.points.map((o,r)=>o.map((i,s)=>{const a=n.points[r]?.[s];return a?cr(i,a,e):i}))}}function cr(t,n,e){return{position:Oe(t.position,n.position,e),color:dr(t.color,n.color,e),handles:ur(t.handles,n.handles,e)}}function ur(t,n,e){return{handleLeft:Oe(t.handleLeft,n.handleLeft,e),handleRight:Oe(t.handleRight,n.handleRight,e),handleUp:Oe(t.handleUp,n.handleUp,e),handleDown:Oe(t.handleDown,n.handleDown,e),type:e<.5?t.type:n.type}}function Oe(t,n,e){return{x:t.x+(n.x-t.x)*e,y:t.y+(n.y-t.y)*e}}function dr(t,n,e){return{r:t.r+(n.r-t.r)*e,g:t.g+(n.g-t.g)*e,b:t.b+(n.b-t.b)*e,a:t.a+(n.a-t.a)*e}}function fr(t,n){for(let e=0;e<t.rows;e++)for(let o=0;o<t.cols;o++)if(t.points[e]?.[o]?.id===n)return{row:e,col:o};return null}function mt(t,n,e){if(!t.animation?.baseSnapshot||t.animation.mode!=="procedural")return t;const o=fr(t.grid,n);if(!o)return t;const r=t.animation.baseSnapshot.points.map((i,s)=>i.map((a,l)=>s===o.row&&l===o.col?e(a):a));return{animation:{...t.animation,baseSnapshot:{...t.animation.baseSnapshot,points:r}}}}function kt(t,n){switch(t=Math.max(0,Math.min(1,t)),n.preset){case"linear":return t;case"easeIn":return t*t;case"easeOut":return 1-(1-t)*(1-t);case"easeInOut":return t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;case"easeInQuad":return t*t;case"easeOutQuad":return 1-(1-t)*(1-t);case"easeInOutQuad":return t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;case"easeInCubic":return t*t*t;case"easeOutCubic":return 1-Math.pow(1-t,3);case"easeInOutCubic":return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;case"easeInElastic":return pr(t);case"easeOutElastic":return hr(t);case"easeInOutElastic":return mr(t);case"easeInBounce":return 1-ot(1-t);case"easeOutBounce":return ot(t);case"easeInOutBounce":return t<.5?(1-ot(1-2*t))/2:(1+ot(2*t-1))/2;case"cubicBezier":return n.cubicBezier?gr(n.cubicBezier,t):t;default:return t}}function pr(t){if(t===0)return 0;if(t===1)return 1;const n=2*Math.PI/3;return-Math.pow(2,10*t-10)*Math.sin((t*10-10.75)*n)}function hr(t){if(t===0)return 0;if(t===1)return 1;const n=2*Math.PI/3;return Math.pow(2,-10*t)*Math.sin((t*10-.75)*n)+1}function mr(t){if(t===0)return 0;if(t===1)return 1;const n=2*Math.PI/4.5;return t<.5?-(Math.pow(2,20*t-10)*Math.sin((20*t-11.125)*n))/2:Math.pow(2,-20*t+10)*Math.sin((20*t-11.125)*n)/2+1}function ot(t){return t<1/2.75?7.5625*t*t:t<2/2.75?7.5625*(t-=1.5/2.75)*t+.75:t<2.5/2.75?7.5625*(t-=2.25/2.75)*t+.9375:7.5625*(t-=2.625/2.75)*t+.984375}function gr(t,n){const{x1:e,y1:o,x2:r,y2:i}=t;if(n<=0)return 0;if(n>=1)return 1;const s=3*e,a=3*(r-e)-s,l=1-s-a,c=3*o,u=3*(i-o)-c,d=1-c-u;function f(x){return((l*x+a)*x+s)*x}function p(x){return((d*x+u)*x+c)*x}function h(x){return(3*l*x+2*a)*x+s}let m=n;for(let x=0;x<8;x++){const y=f(m)-n;if(Math.abs(y)<1e-4)break;const S=h(m);if(Math.abs(S)<1e-4)break;m-=y/S}return m=Math.max(0,Math.min(1,m)),p(m)}function Ts(t,n=50){const e=[];for(let o=0;o<=n;o++){const r=o/n,i=kt(r,t);e.push({x:r,y:i})}return e}function vr(t,n,e){const{rows:o,cols:r,points:i}=t;let s=100,a=100;r>1&&i[0]&&i[0][0]&&i[0][1]&&(s=Math.abs(i[0][1].position.x-i[0][0].position.x)),o>1&&i[0]&&i[1]&&i[0][0]&&i[1][0]&&(a=Math.abs(i[1][0].position.y-i[0][0].position.y));const c=Math.min(s,a)*.8,u=r>1?1/(r-1):.5,d=o>1?1/(o-1):.5,p=Math.min(u,d)*.5,h=i.map((m,x)=>m.map((y,S)=>{const C=x*r+S,w=xr(x,S,o,r),k=n.randomness??1,b=ze(n.seed,C,e,0,k),M=ze(n.seed,C,e,.33,k),_=ze(n.seed,C,e,.5,k),O=ze(n.seed,C,e,.83,k),z=ze(n.seed,C,e,.66,k),F=n.pointMovement*c,D=n.handleMovement*p;let A=y.position.x,B=y.position.y;if(!(n.fixEdges&&w)){const Y=b*F,P=M*F;A=y.position.x+Y,B=y.position.y+P}const $=n.fixEdges&&w,K=$?0:_*D,G=$?0:O*D,N=yr(y.color,n,z);return{position:{x:A,y:B},color:N,handles:{handleLeft:{x:y.handles.handleLeft.x+K,y:y.handles.handleLeft.y+G},handleRight:{x:y.handles.handleRight.x-K,y:y.handles.handleRight.y-G},handleUp:{x:y.handles.handleUp.x+G,y:y.handles.handleUp.y+K},handleDown:{x:y.handles.handleDown.x-G,y:y.handles.handleDown.y-K},type:y.handles.type}}}));return{rows:o,cols:r,points:h}}function xr(t,n,e,o){return t===0||t===e-1||n===0||n===o-1}function ze(t,n,e,o,r){const i=n*(.3+r*1.5),s=t+i+o*Math.PI*2+e*Math.PI*2;return Math.sin(s)}function yr(t,n,e){if(n.colorSaturation===0&&n.colorLightness===0&&n.colorHue===0)return{...t};const o=ae(t);return o.h=(o.h*360+n.colorHue*e)%360/360,o.h<0&&(o.h+=1),o.s=Math.max(0,Math.min(1,o.s+n.colorSaturation*e)),o.l=Math.max(0,Math.min(1,o.l+n.colorLightness*e)),Le(o)}function wr(t,n){if(t.mode==="procedural"){const{baseSnapshot:a,proceduralConfig:l}=t;if(!a||!l)return null;const c=l.duration,u=n%c/c,d=kt(u,l.easing);return vr(a,l,d)}if(t.keyframes.length===0)return null;const{keyframes:e}=t;let o=null,r=null;for(let a=0;a<e.length;a++){const l=e[a];if(l.time<=n&&(o=l),l.time>n&&!r){r=l;break}}if(!o)return e[0].snapshot;if(!r||o.time===n)return o.snapshot;const i=(n-o.time)/(r.time-o.time),s=kt(i,o.easing);return lr(o.snapshot,r.snapshot,s)}const br=(t,n)=>({animation:null,timelineView:{...sr},isAnimationMode:!1,copiedKeyframe:null,snappedKeyframeId:null,isRecording:!1,createAnimation:(e="Untitled Animation")=>{const o=n().grid,r=Ue(o),i={id:re(),time:0,snapshot:r,easing:{...Gt},label:"Start"};t({animation:{id:re(),name:e,mode:"keyframe",settings:{...Ot},keyframes:[i],currentTime:0,playbackState:"stopped",selectedKeyframeIds:[i.id],trackedPoints:[]},isAnimationMode:!0,isRecording:!1})},createProceduralAnimation:(e="Procedural Animation")=>{const o=n().grid,r=Ue(o);t({animation:{id:re(),name:e,mode:"procedural",settings:{...Ot,loop:"loop"},keyframes:[],currentTime:0,playbackState:"stopped",selectedKeyframeIds:[],trackedPoints:[],proceduralConfig:{...ar},baseSnapshot:r},isAnimationMode:!0,isRecording:!1})},deleteAnimation:()=>{const{animation:e,grid:o}=n(),r={animation:null,isAnimationMode:!1,isRecording:!1};e?.mode==="procedural"&&e.baseSnapshot&&(r.grid=tt(o,e.baseSnapshot)),t(r)},setAnimationMode:e=>{t({isAnimationMode:e})},updateSettings:e=>{t(o=>o.animation?{animation:{...o.animation,settings:{...o.animation.settings,...e}}}:o)},updateProceduralConfig:e=>{t(o=>!o.animation||o.animation.mode!=="procedural"?o:{animation:{...o.animation,proceduralConfig:{...o.animation.proceduralConfig,...e}}})},updateBaseSnapshot:e=>{t(o=>{if(!o.animation||o.animation.mode!=="procedural")return o;const r=e??Ue(o.grid);return{animation:{...o.animation,baseSnapshot:r}}})},updatePointPositionInBase:(e,o)=>{t(r=>mt(r,e,i=>({...i,position:{...o}})))},updatePointColorInBase:(e,o)=>{t(r=>mt(r,e,i=>({...i,color:{...o}})))},updatePointHandleInBase:(e,o,r)=>{t(i=>mt(i,e,s=>{const a=`handle${o.charAt(0).toUpperCase()+o.slice(1)}`;return{...s,handles:{...s.handles,[a]:{...r}}}}))},addKeyframe:(e,o)=>{t(r=>{if(!r.animation)return r;const i=r.grid,s=r.getSelectedPoints(),a=e??r.animation.currentTime,l=[...s];if(o&&(l.some(h=>h.row===o.row&&h.col===o.col)||l.push(o)),l.length===0)return r;const c=Ue(i);let u=[...r.animation.keyframes],d=[...r.animation.trackedPoints||[]],f=null;for(const p of l){const h=d.find(x=>x.row===p.row&&x.col===p.col);let m;if(h&&(m=u.find(x=>h.keyframeIds.includes(x.id)&&Math.abs(x.time-a)<1)),m)u=u.map(x=>x.id===m.id?{...x,snapshot:c}:x),f=m.id;else{const x={id:re(),time:a,snapshot:c,easing:{...Gt}};u.push(x),f=x.id;const y=d.findIndex(S=>S.row===p.row&&S.col===p.col);y>=0?d[y]={...d[y],keyframeIds:[...d[y].keyframeIds,x.id]}:d.push({row:p.row,col:p.col,keyframeIds:[x.id]})}}return u.sort((p,h)=>p.time-h.time),{animation:{...r.animation,keyframes:u,selectedKeyframeIds:f?[f]:[],trackedPoints:d}}})},addKeyframeFromCurrent:()=>{n().addKeyframe()},removeKeyframe:e=>{t(o=>{if(!o.animation||o.animation.keyframes.length<=1)return o;const r=o.animation.keyframes.filter(a=>a.id!==e),i=o.animation.selectedKeyframeIds.filter(a=>a!==e),s=(o.animation.trackedPoints||[]).map(a=>({...a,keyframeIds:a.keyframeIds.filter(l=>l!==e)})).filter(a=>a.keyframeIds.length>0);return{animation:{...o.animation,keyframes:r,selectedKeyframeIds:i,trackedPoints:s}}})},removeSelectedKeyframe:()=>{const e=n();!e.animation||e.animation.selectedKeyframeIds.length===0||n().removeKeyframe(e.animation.selectedKeyframeIds[0])},copySelectedKeyframe:()=>{const e=n();if(!e.animation||e.animation.selectedKeyframeIds.length===0)return;const o=e.animation.keyframes.find(r=>r.id===e.animation.selectedKeyframeIds[0]);o&&t({copiedKeyframe:o})},pasteKeyframeAtPlayhead:()=>{const e=n();if(!e.animation||!e.copiedKeyframe)return;const o=e.animation.currentTime,r={id:re(),time:o,snapshot:Vt(e.copiedKeyframe.snapshot),easing:{...e.copiedKeyframe.easing},label:e.copiedKeyframe.label?`${e.copiedKeyframe.label} (copy)`:void 0},i=[...e.animation.keyframes,r].sort((l,c)=>l.time-c.time),s=e.copiedKeyframe.id,a=(e.animation.trackedPoints||[]).map(l=>l.keyframeIds.includes(s)?{...l,keyframeIds:[...l.keyframeIds,r.id]}:l);t({animation:{...e.animation,keyframes:i,selectedKeyframeIds:[r.id],trackedPoints:a}})},updateKeyframeTime:(e,o)=>{t(r=>{if(!r.animation)return r;const i=Math.max(0,Math.min(o,r.animation.settings.duration)),s=r.animation.keyframes.map(a=>a.id===e?{...a,time:i}:a).sort((a,l)=>a.time-l.time);return{animation:{...r.animation,keyframes:s}}})},updateKeyframeTimesBatch:e=>{t(o=>{if(!o.animation)return o;const r=o.animation.settings.duration,i=new Map(e.map(a=>[a.id,a.time])),s=o.animation.keyframes.map(a=>{const l=i.get(a.id);if(l!==void 0){const c=Math.max(0,Math.min(l,r));return{...a,time:c}}return a}).sort((a,l)=>a.time-l.time);return{animation:{...o.animation,keyframes:s}}})},updateKeyframeEasing:(e,o)=>{t(r=>{if(!r.animation)return r;const i=r.animation.keyframes.map(s=>s.id===e?{...s,easing:o}:s);return{animation:{...r.animation,keyframes:i}}})},updateKeyframeSnapshot:e=>{t(o=>{if(!o.animation)return o;const r=o.grid,i=o.getSelectedPoints(),s=Ue(r),a=o.animation.keyframes.map(u=>u.id===e?{...u,snapshot:s}:u),c=(o.animation.trackedPoints||[]).map(u=>i.some(f=>f.row===u.row&&f.col===u.col)&&!u.keyframeIds.includes(e)?{...u,keyframeIds:[...u.keyframeIds,e]}:u);for(const u of i)c.some(f=>f.row===u.row&&f.col===u.col)||c.push({row:u.row,col:u.col,keyframeIds:[e]});return{animation:{...o.animation,keyframes:a,trackedPoints:c}}})},selectKeyframe:e=>{const o=n();if(o.animation){if(e){const r=o.animation.keyframes.find(i=>i.id===e);if(r){const s=(o.animation.trackedPoints||[]).filter(u=>u.keyframeIds.includes(e)),a=new Set;for(const u of s)a.add(`${u.row},${u.col}`);const l=o.grid,c=nt(l,r.snapshot,a);o.setGridDirect(c),o.clearSelection();for(const u of s){const d=l.points[u.row]?.[u.col];d&&o.addToSelection(d.id)}t({animation:{...o.animation,currentTime:r.time,selectedKeyframeIds:e?[e]:[]}});return}}o.clearSelection(),t({animation:{...o.animation,selectedKeyframeIds:[]}})}},selectKeyframeForPoint:(e,o,r)=>{const i=n();if(!i.animation)return;const s=i.animation.keyframes.find(d=>d.id===e);if(!s)return;const a=new Set;a.add(`${o},${r}`);const l=i.grid,c=nt(l,s.snapshot,a);i.setGridDirect(c);const u=l.points[o]?.[r];u&&(i.clearSelection(),i.addToSelection(u.id)),t({animation:{...i.animation,currentTime:s.time,selectedKeyframeIds:[e]}})},addToKeyframeSelection:e=>{t(o=>!o.animation||o.animation.selectedKeyframeIds.includes(e)?o:{animation:{...o.animation,selectedKeyframeIds:[...o.animation.selectedKeyframeIds,e]}})},toggleKeyframeSelection:e=>{t(o=>{if(!o.animation)return o;const r=o.animation.selectedKeyframeIds.includes(e);return{animation:{...o.animation,selectedKeyframeIds:r?o.animation.selectedKeyframeIds.filter(i=>i!==e):[...o.animation.selectedKeyframeIds,e]}}})},setKeyframeSelection:e=>{t(o=>o.animation?{animation:{...o.animation,selectedKeyframeIds:e}}:o)},clearKeyframeSelection:()=>{t(e=>e.animation?{animation:{...e.animation,selectedKeyframeIds:[]}}:e)},duplicateKeyframe:e=>{t(o=>{if(!o.animation)return o;const r=o.animation.keyframes.find(c=>c.id===e);if(!r)return o;let s=r.time+500;s>o.animation.settings.duration&&(s=Math.min(r.time+100,o.animation.settings.duration));const a={id:re(),time:s,snapshot:Vt(r.snapshot),easing:{...r.easing},label:r.label?`${r.label} (copy)`:void 0},l=[...o.animation.keyframes,a].sort((c,u)=>c.time-u.time);return{animation:{...o.animation,keyframes:l,selectedKeyframeIds:[a.id]}}})},play:()=>{t(e=>e.animation?{animation:{...e.animation,playbackState:"playing"}}:e)},pause:()=>{t(e=>e.animation?{animation:{...e.animation,playbackState:"paused"}}:e)},stop:()=>{t(e=>{if(!e.animation)return e;const o={animation:{...e.animation,playbackState:"stopped",currentTime:0}};return e.animation.mode==="procedural"&&e.animation.baseSnapshot&&(o.grid=tt(e.grid,e.animation.baseSnapshot)),o})},togglePlayPause:()=>{const e=n();e.animation&&(e.animation.playbackState==="playing"?e.pause():e.play())},setCurrentTime:e=>{t(o=>{if(!o.animation)return o;const r=o.animation.mode==="procedural"&&o.animation.proceduralConfig?o.animation.proceduralConfig.duration:o.animation.settings.duration,i=Math.max(0,Math.min(e,r));return{animation:{...o.animation,currentTime:i}}})},seekToKeyframe:e=>{const o=n();if(!o.animation)return;const r=o.animation.keyframes.find(i=>i.id===e);r&&t({animation:{...o.animation,currentTime:r.time,selectedKeyframeIds:[e]}})},setTimelineZoom:e=>{t(o=>({timelineView:{...o.timelineView,zoom:Math.max(10,Math.min(500,e))}}))},setTimelineScroll:e=>{t(o=>({timelineView:{...o.timelineView,scrollX:Math.max(0,e)}}))},toggleSnapToFrames:()=>{t(e=>({timelineView:{...e.timelineView,snapToFrames:!e.timelineView.snapToFrames}}))},setSnappedKeyframeId:e=>{t({snappedKeyframeId:e})},toggleRecording:()=>{t(e=>({isRecording:!e.isRecording}))},recordPointChange:e=>{const o=n();if(!o.isRecording||!o.animation||o.animation.mode!=="keyframe")return;let r=null;if(e){const i=o.grid;for(let s=0;s<i.rows;s++){for(let a=0;a<i.cols;a++)if(i.points[s]?.[a]?.id===e){r={row:s,col:a};break}if(r)break}}n().addKeyframe(void 0,r)},getInterpolatedSnapshot:e=>{const o=n();return o.animation?wr(o.animation,e):null},applyInterpolatedState:e=>{const o=n(),r=o.getInterpolatedSnapshot(e);if(!r||o.grid.rows!==r.rows||o.grid.cols!==r.cols)return;if(o.animation?.mode==="procedural"){const a=tt(o.grid,r);o.setGridDirect(a);return}const i=new Set;if(o.animation?.trackedPoints)for(const a of o.animation.trackedPoints)i.add(`${a.row},${a.col}`);const s=nt(o.grid,r,i);o.setGridDirect(s)},applyTimeAndSnapshot:e=>{const o=n();if(!o.animation)return;const r=o.animation.mode==="procedural"&&o.animation.proceduralConfig?o.animation.proceduralConfig.duration:o.animation.settings.duration,i=Math.max(0,Math.min(e,r)),s=o.getInterpolatedSnapshot(i);if(!s||o.grid.rows!==s.rows||o.grid.cols!==s.cols)return;let a;if(o.animation.mode==="procedural")a=tt(o.grid,s);else{const l=new Set;if(o.animation.trackedPoints)for(const c of o.animation.trackedPoints)l.add(`${c.row},${c.col}`);a=nt(o.grid,s,l)}t({animation:{...o.animation,currentTime:i},grid:a},!1)},exportAnimation:()=>n().animation,importAnimation:e=>{t({animation:e,isAnimationMode:!0})}});function Lt(){const t=q.getState();return t.animation?.mode==="procedural"&&t.isAnimationMode}function rt(){const t=q.getState();return t.animation?.mode==="procedural"&&t.isAnimationMode&&t.animation?.playbackState==="playing"}function it(t,n,e){return t.points.map(o=>o.map(r=>{if(!n.includes(r.id))return r;const i={...r.handles},s=[["handleLeft",0,-1],["handleRight",0,1],["handleUp",-1,0],["handleDown",1,0]];for(const[a,l,c]of s){const u=t.points[r.row+l]?.[r.col+c];if(!u)continue;const d=e(r,u,t);d&&(i[a]=d)}return{...r,handles:i}}))}function ne(){const t=q.getState();t.animation?.mode==="procedural"&&t.isAnimationMode&&t.updateBaseSnapshot()}function Et(t,n){for(let e=0;e<t.rows;e++)for(let o=0;o<t.cols;o++)if(t.points[e]?.[o]?.id===n)return{row:e,col:o};return null}function gt(t,n,e,o){if(!Lt())return;const r=q.getState(),i=r.animation?.baseSnapshot;if(!i)return;const s=Et(t,n);if(!s)return;const a=i.points[s.row]?.[s.col]?.position;if(!a)return;const l={x:a.x+(e.x-o.x),y:a.y+(e.y-o.y)};r.updatePointPositionInBase(n,l)}function $t(t,n,e,o){if(!Lt())return;const r=q.getState(),i=r.animation?.baseSnapshot;if(!i)return;const s=Et(t,n);if(!s)return;const a=i.points[s.row]?.[s.col]?.color;if(!a)return;const l={r:Math.max(0,Math.min(1,a.r+(e.r-o.r))),g:Math.max(0,Math.min(1,a.g+(e.g-o.g))),b:Math.max(0,Math.min(1,a.b+(e.b-o.b))),a:Math.max(0,Math.min(1,a.a+(e.a-o.a)))};r.updatePointColorInBase(n,l)}function Xt(t,n,e,o,r){if(!Lt())return;const i=q.getState(),s=i.animation?.baseSnapshot;if(!s)return;const a=Et(t,n);if(!a)return;const l=`handle${e.charAt(0).toUpperCase()+e.slice(1)}`,c=s.points[a.row]?.[a.col]?.handles[l];if(!c)return;const u={x:c.x+(o.x-r.x),y:c.y+(o.y-r.y)};i.updatePointHandleInBase(n,e,u)}function xe(t){const n=q.getState();n.isRecording&&n.recordPointChange(t)}function Bs(){const t=q(s=>s.animation?.playbackState),n=q(s=>s.animation?.currentTime),e=g.useRef(null),o=g.useRef(0),r=g.useRef(0),i=g.useRef();i.current=s=>{const a=q.getState(),l=a.animation;if(!l||l.playbackState!=="playing"){e.current=null;return}o.current===0&&(o.current=s-r.current);const c=l.mode==="procedural"&&l.proceduralConfig?l.proceduralConfig.speed:1,u=(s-o.current)*c,d=l.mode==="procedural"&&l.proceduralConfig?l.proceduralConfig.duration:l.settings.duration,f=l.settings.loop;let p=u;if(p>=d)switch(f){case"none":p=d,a.applyTimeAndSnapshot(p),a.stop();return;case"loop":p=p%d,o.current=s-p;break;case"pingPong":{const h=Math.floor(p/d),m=p%d;p=h%2===0?m:d-m;break}}a.applyTimeAndSnapshot(p),e.current=requestAnimationFrame(h=>i.current(h))},g.useEffect(()=>(t==="playing"?(o.current=0,r.current=q.getState().animation?.currentTime??0,e.current=requestAnimationFrame(s=>i.current(s))):(e.current!==null&&(cancelAnimationFrame(e.current),e.current=null),t==="paused"?r.current=q.getState().animation?.currentTime??0:r.current=0),()=>{e.current!==null&&cancelAnimationFrame(e.current)}),[t]),g.useEffect(()=>{if(t==="playing")return;const s=q.getState();s.animation&&s.applyInterpolatedState(s.animation.currentTime)},[n,t])}function Kt(t){return`${(t/1e3).toFixed(2)}s`}var vt={exports:{}};/*!
	Copyright (c) 2018 Jed Watson.
	Licensed under the MIT License (MIT), see
	http://jedwatson.github.io/classnames
*/var Yt;function Cr(){return Yt||(Yt=1,(function(t){(function(){var n={}.hasOwnProperty;function e(){for(var i="",s=0;s<arguments.length;s++){var a=arguments[s];a&&(i=r(i,o(a)))}return i}function o(i){if(typeof i=="string"||typeof i=="number")return i;if(typeof i!="object")return"";if(Array.isArray(i))return e.apply(null,i);if(i.toString!==Object.prototype.toString&&!i.toString.toString().includes("[native code]"))return i.toString();var s="";for(var a in i)n.call(i,a)&&i[a]&&(s=r(s,a));return s}function r(i,s){return s?i?i+" "+s:i+s:i}t.exports?(e.default=e,t.exports=e):window.classNames=e})()})(vt)),vt.exports}var Sr=Cr();const Ge=lo(Sr),kr="_disabled_fyfwe_94",ye={"input-wrapper":"_input-wrapper_fyfwe_1","input-block":"_input-block_fyfwe_22","input-left-text":"_input-left-text_fyfwe_52","input-right-text":"_input-right-text_fyfwe_53","input-text":"_input-text_fyfwe_59","input-icon":"_input-icon_fyfwe_86",disabled:kr},Mr=g.forwardRef(({leftContent:t,leftText:n,rightText:e,disabled:o,children:r,className:i,...s},a)=>L.jsxs("div",{className:Ge(ye["input-wrapper"],o&&ye.disabled,i),children:[L.jsxs("div",{className:ye["input-block"],children:[t&&L.jsx("div",{className:ye["input-icon"],children:t}),n&&L.jsx("span",{className:ye["input-left-text"],children:n}),L.jsx("input",{...s,ref:a,className:ye["input-text"],disabled:o}),r]}),e&&L.jsx("span",{className:ye["input-right-text"],children:e})]}));Mr.displayName="Input";const Pr={"icon-wrapper":"_icon-wrapper_im3lf_1"},Dr=t=>g.createElement("svg",{width:16,height:16,viewBox:"0 0 16 16",fill:"none",xmlns:"http://www.w3.org/2000/svg",...t},g.createElement("path",{d:"M12 6L8 10L4 6",stroke:"currentColor",strokeLinecap:"round",strokeLinejoin:"round"})),_r=t=>g.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",width:16,height:16,fill:"none",viewBox:"0 0 16 16",...t},g.createElement("path",{stroke:"currentColor",strokeLinecap:"round",strokeLinejoin:"round",d:"M8 3v10m5-5H3"})),Ir=t=>g.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",width:12,height:12,viewBox:"0 0 12 12",fill:"none",...t},g.createElement("path",{d:"M3 9L9 3M3 3L9 9",stroke:"currentColor",strokeOpacity:.5,strokeLinecap:"round",strokeLinejoin:"round"})),Lr=t=>g.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",width:16,height:16,viewBox:"0 0 14 14",fill:"none",...t},g.createElement("path",{d:"M12.326 4.14235L1.24949 0.528263C1.14729 0.494881 1.03774 0.490986 0.933422 0.517024C0.829103 0.543063 0.734237 0.597979 0.659706 0.675474C0.585176 0.752969 0.533999 0.849904 0.512047 0.955158C0.490095 1.06041 0.498258 1.16972 0.535598 1.27055L4.63237 12.3562C4.65772 12.426 4.70432 12.486 4.7656 12.528C4.82688 12.5699 4.89977 12.5915 4.97399 12.5898C5.04822 12.5881 5.12004 12.5632 5.17937 12.5186C5.23869 12.474 5.28252 12.4118 5.30469 12.341L6.85619 7.46337C6.90117 7.32179 6.97671 7.19182 7.07747 7.08265C7.17823 6.97348 7.30174 6.88778 7.43927 6.83162L12.3524 4.82176C12.4213 4.79363 12.4798 4.74501 12.5202 4.68248C12.5605 4.61996 12.5807 4.54654 12.5779 4.47218C12.5751 4.39782 12.5496 4.32611 12.5047 4.26675C12.4598 4.20739 12.3978 4.16326 12.327 4.14032",stroke:"currentColor",strokeWidth:1,strokeLinecap:"round",strokeLinejoin:"round"})),Er=t=>g.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",width:16,height:16,fill:"none",viewBox:"0 0 16 16",...t},g.createElement("path",{stroke:"currentColor",strokeLinecap:"round",strokeLinejoin:"round",d:"M6 5.5H5A1.5 1.5 0 0 0 3.5 7v6A1.5 1.5 0 0 0 5 14.5h6a1.5 1.5 0 0 0 1.5-1.5V7A1.5 1.5 0 0 0 11 5.5h-1M6 8l2 2m0 0 2-2m-2 2V1.5"})),Ar=t=>g.createElement("svg",{width:15,height:12,viewBox:"0 0 15 12",fill:"none",xmlns:"http://www.w3.org/2000/svg",...t},g.createElement("path",{d:"M11 2.5L14.5 6L11 9.5M4 9.5L0.5 6L4 2.5M9 0.5L6 11.5",stroke:"currentColor",strokeLinecap:"round",strokeLinejoin:"round"})),Rr=t=>g.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",width:16,height:16,viewBox:"0 0 16 16",fill:"none",...t},g.createElement("path",{d:"M3.34375 0L0.34375 3L0 3.35938L0.34375 3.71875L3.34375 6.71875L4.0625 6L1.92188 3.85938H10.7031C12.0801 3.85938 13.2031 4.98242 13.2031 6.35938C13.2031 7.73633 12.0801 8.85938 10.7031 8.85938H9.20312V9.85938H10.7031C12.625 9.85938 14.2031 8.28125 14.2031 6.35938C14.2031 4.4375 12.625 2.85938 10.7031 2.85938H1.92188L4.0625 0.71875L3.34375 0Z",fill:"currentColor"})),Tr=t=>g.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",width:16,height:16,viewBox:"0 0 16 16",fill:"none",...t},g.createElement("path",{d:"M9.50337 0L12.1289 3.00019L12.4297 3.35959L12.1289 3.71899L9.50337 6.71918L8.87435 6.00038L10.7477 3.85962H3.06275C1.85769 3.85962 0.874847 4.98274 0.874847 6.35978C0.874847 7.73682 1.85769 8.85994 3.06275 8.85994H4.37549V9.86H3.06275C1.3808 9.86 -0.000311852 8.28177 -0.000311852 6.35978C-0.000311852 4.43778 1.3808 2.85956 3.06275 2.85956H10.7477L8.87435 0.718796L9.50337 0Z",fill:"currentColor"})),Br=t=>g.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",width:11,height:11,viewBox:"0 0 11 11",fill:"none",...t},g.createElement("path",{d:"M0.5 1.25163C0.5 0.680964 1.11133 0.31963 1.61133 0.594297L9.30467 4.82563C9.42242 4.89032 9.52063 4.98546 9.58904 5.10109C9.65745 5.21672 9.69354 5.34861 9.69354 5.48296C9.69354 5.61732 9.65745 5.7492 9.58904 5.86484C9.52063 5.98047 9.42242 6.07561 9.30467 6.1403L1.61133 10.3716C1.49712 10.4344 1.36852 10.4664 1.23821 10.4643C1.10789 10.4623 0.980357 10.4263 0.868179 10.3599C0.756001 10.2936 0.663049 10.1992 0.598487 10.0859C0.533925 9.97272 0.49998 9.84463 0.5 9.7143V1.25163Z",stroke:"currentColor",strokeLinecap:"round",strokeLinejoin:"round"})),Ur=t=>g.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",width:16,height:16,fill:"none",viewBox:"0 0 16 16",...t},g.createElement("path",{stroke:"currentColor",strokeLinecap:"round",strokeLinejoin:"round",d:"M10.5 3.5v9m-5-9v9"})),zr=t=>g.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",width:12,height:11,viewBox:"0 0 12 11",fill:"none",...t},g.createElement("path",{d:"M0.5 0.982476V9.98248M11.1934 9.71278C11.1934 10.2834 10.582 10.6448 10.082 10.3701L2.38869 6.13878C2.27094 6.07409 2.17273 5.97895 2.10432 5.86332C2.03591 5.74769 1.99982 5.6158 1.99982 5.48145C1.99982 5.34709 2.03591 5.21521 2.10432 5.09957C2.17273 4.98394 2.27094 4.8888 2.38869 4.82411L10.082 0.59278C10.1962 0.529988 10.3248 0.498043 10.4552 0.500093C10.5855 0.502142 10.713 0.538115 10.8252 0.604467C10.9374 0.670818 11.0303 0.765257 11.0949 0.878475C11.1594 0.991693 11.1934 1.11978 11.1934 1.25011L11.1934 9.71278Z",stroke:"currentColor",strokeLinecap:"round",strokeLinejoin:"round"})),jr=t=>g.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",width:15,height:11,viewBox:"0 0 15 11",fill:"none",...t},g.createElement("path",{d:"M12.5 5.49996C12.5 4.67863 12.4693 3.86463 12.408 3.05863C12.3608 2.42006 12.0858 1.81969 11.633 1.36692C11.1803 0.914157 10.5799 0.63913 9.94133 0.59196C8.31609 0.469347 6.68391 0.469347 5.05867 0.59196C4.4201 0.63913 3.81973 0.914157 3.36696 1.36692C2.9142 1.81969 2.63917 2.42006 2.592 3.05863C2.58067 3.20529 2.57067 3.35263 2.56133 3.49996M12.5 5.49996L14.5 3.49996M12.5 5.49996L10.5 3.49996M2.5 5.49996C2.5 6.32129 2.53067 7.13529 2.592 7.94129C2.63917 8.57986 2.9142 9.18023 3.36696 9.633C3.81973 10.0858 4.4201 10.3608 5.05867 10.408C6.68391 10.5306 8.31609 10.5306 9.94133 10.408C10.5799 10.3608 11.1803 10.0858 11.633 9.633C12.0858 9.18023 12.3608 8.57986 12.408 7.94129C12.4193 7.79463 12.4293 7.64729 12.4387 7.49996M2.5 5.49996L4.5 7.49996M2.5 5.49996L0.5 7.49996",stroke:"currentColor",strokeLinecap:"round",strokeLinejoin:"round"})),Nr=t=>g.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",width:12,height:12,viewBox:"0 0 12 12",fill:"none",...t},g.createElement("path",{d:"M9.71839 6.48932C9.62987 7.16432 9.35928 7.80249 8.93563 8.33539C8.51199 8.86829 7.95127 9.27582 7.31361 9.51427C6.67596 9.75272 5.98542 9.81309 5.31607 9.68891C4.64671 9.56473 4.02378 9.26068 3.51409 8.80938C3.00439 8.35808 2.62717 7.77654 2.42286 7.12714C2.21855 6.47775 2.19488 5.78498 2.35437 5.12315C2.51386 4.46131 2.8505 3.85538 3.32819 3.37033C3.80587 2.88528 4.40659 2.53941 5.06591 2.36982C6.89362 1.90106 8.78555 2.84187 9.48401 4.59504",stroke:"currentColor",strokeOpacity:.5,strokeWidth:.937529,strokeLinecap:"round",strokeLinejoin:"round"}),g.createElement("path",{d:"M9.75007 2.25098V4.5948H7.40625",stroke:"currentColor",strokeOpacity:.5,strokeWidth:.937529,strokeLinecap:"round",strokeLinejoin:"round"})),Hr=t=>g.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",width:16,height:16,fill:"none",viewBox:"0 0 16 16",...t},g.createElement("path",{stroke:"currentColor",d:"m2.963 11.197-.474-.159.474.159a6.753 6.753 0 0 1 1.632-2.64l5.97-5.971a1.757 1.757 0 1 1 2.486 2.484l-5.972 5.971a6.754 6.754 0 0 1-2.64 1.632l-.325.108a2.483 2.483 0 0 0-.97.6.16.16 0 0 1-.227 0l-.662-.662a.16.16 0 0 1 0-.227c.272-.272.478-.604.6-.97l.108-.325Z"}),g.createElement("path",{stroke:"currentColor",strokeLinecap:"round",d:"m7.818 3.828 3.99 3.99"})),Fr=t=>g.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",width:11,height:13,viewBox:"0 0 11 13",fill:"none",...t},g.createElement("path",{d:"M9.22867 0.715682C9.962 0.801016 10.5 1.43368 10.5 2.17235V12.501L5.5 10.001L0.5 12.501V2.17235C0.5 1.43368 1.03733 0.801016 1.77133 0.715682C4.24879 0.428106 6.75121 0.428106 9.22867 0.715682Z",stroke:"currentColor",strokeWidth:1,strokeLinecap:"round",strokeLinejoin:"round"})),Or={arrowDown:Dr,plus:_r,close:Ir,move:Lr,export:Er,embed:Ar,undo:Rr,redo:Tr,play:Br,pause:Ur,skipBack:zr,loop:jr,reset:Nr,colorpicker:Hr,bookmark:Fr},Mt=({icon:t,size:n=16,className:e,...o})=>{const r=Or[t];return r?L.jsx("div",{className:Ge(Pr["icon-wrapper"],e),...o,children:L.jsx(r,{preserveAspectRatio:"xMidYMid meet",width:n,height:n})}):null},Gr="_checkbox_scxuh_1",Vr="_disabled_scxuh_58",xt={"checkbox-wrapper":"_checkbox-wrapper_scxuh_1",checkbox:Gr,disabled:Vr},$r=g.forwardRef(({className:t,children:n,disabled:e,checked:o,...r},i)=>L.jsxs("label",{className:Ge(xt["checkbox-wrapper"],e&&xt.disabled,t),children:[L.jsx("input",{ref:i,type:"checkbox",className:Ge(xt.checkbox),disabled:e,checked:o,...r}),n]}));$r.displayName="Checkbox";const Xr="_button_1vgvq_1",Kr="_icon_1vgvq_30",yt={button:Xr,icon:Kr,"icon-button":"_icon-button_1vgvq_36"},Yr=g.forwardRef(({children:t,icon:n,iconSize:e,startIcon:o,className:r,...i},s)=>L.jsxs("button",{className:Ge(yt.button,!t&&yt["icon-button"],r),ref:s,...i,children:[o,n&&L.jsx(Mt,{icon:n,size:e,className:yt.icon}),t]}));Yr.displayName="Button";var wn={exports:{}},je={};/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Wt;function Wr(){if(Wt)return je;Wt=1;var t=Ne,n=Symbol.for("react.element"),e=Symbol.for("react.fragment"),o=Object.prototype.hasOwnProperty,r=t.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,i={key:!0,ref:!0,__self:!0,__source:!0};function s(a,l,c){var u,d={},f=null,p=null;c!==void 0&&(f=""+c),l.key!==void 0&&(f=""+l.key),l.ref!==void 0&&(p=l.ref);for(u in l)o.call(l,u)&&!i.hasOwnProperty(u)&&(d[u]=l[u]);if(a&&a.defaultProps)for(u in l=a.defaultProps,l)d[u]===void 0&&(d[u]=l[u]);return{$$typeof:n,type:a,key:f,ref:p,props:d,_owner:r.current}}return je.Fragment=e,je.jsx=s,je.jsxs=s,je}wn.exports=Wr();var H=wn.exports;const qt=()=>typeof window<"u"&&"EyeDropper"in window,qr=()=>{throw new Error("Unsupported browser.")},Qr=t=>{const n=g.useMemo(()=>{var a;return(a=qt()&&new EyeDropper(t))?EyeDropper.prototype.open.bind(a):qr},[t]),[e,o]=(()=>{const a=g.useRef(),[l,c]=g.useState(!1);g.useEffect(()=>(a.current=!0,c(qt()),()=>{a.current=!1}),[]);const u=g.useCallback(()=>l,[l]);return[a,u]})(),r=g.useRef(),i=g.useCallback(()=>{r.current!==void 0&&r.current.abort()},[r]),s=g.useCallback(async function(a){a===void 0&&(a={}),i();const{signal:l,...c}=a,u=new AbortController;r.current=u;const d=l!==void 0?(f=>{if("any"in AbortSignal)return AbortSignal.any(f);const p=new AbortController,h=()=>{p.abort();for(const m of f)m.removeEventListener("abort",h)};for(const m of f){if(m.aborted){h();break}m.addEventListener("abort",h)}return p.signal})([l,u.signal]):u.signal;try{return await n({...c,signal:d})}catch(f){throw e.current||(f.canceled=!0),f}},[r,e,i,n]);return g.useEffect(()=>i,[i]),{open:s,close:i,isSupported:o}},Zr=Qr,Jr=/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i,be=(t,n,e)=>Math.min(Math.max(t,n),e),te=t=>be(t,0,1),we=t=>{if(!t)return null;const n=t.trim();if(!Jr.test(n))return null;const e=n.replace("#","").toLowerCase();if(e.length===3){const[o,r,i]=e;return`#${o}${o}${r}${r}${i}${i}`}return`#${e}`},bn=t=>{const n=we(t);if(!n)throw new Error(`Cannot convert invalid hex value "${t}" to RGB`);const e=n.replace("#","");return{r:parseInt(e.slice(0,2),16),g:parseInt(e.slice(2,4),16),b:parseInt(e.slice(4,6),16)}},ei=({r:t,g:n,b:e})=>{const o=r=>be(Math.round(r),0,255).toString(16).padStart(2,"0");return`#${o(t)}${o(n)}${o(e)}`},ti=({r:t,g:n,b:e})=>{const o=t/255,r=n/255,i=e/255,s=Math.max(o,r,i),a=Math.min(o,r,i),l=s-a;let c=0;const u=s===0?0:l/s,d=s;if(l!==0){switch(s){case o:c=(r-i)/l+(r<i?6:0);break;case r:c=(i-o)/l+2;break;default:c=(o-r)/l+4;break}c/=6}return{h:Math.round(c*360),s:u,v:d}},ni=({h:t,s:n,v:e})=>{const o=be(t,0,360)%360/60,r=te(n),i=te(e),s=Math.floor(o),a=o-s,l=i*(1-r),c=i*(1-r*a),u=i*(1-r*(1-a));let d=0,f=0,p=0;switch(s%6){case 0:d=i,f=u,p=l;break;case 1:d=c,f=i,p=l;break;case 2:d=l,f=i,p=u;break;case 3:d=l,f=c,p=i;break;case 4:d=u,f=l,p=i;break;case 5:d=i,f=l,p=c;break}return{r:Math.round(d*255),g:Math.round(f*255),b:Math.round(p*255)}},oi=t=>ti(bn(t)),Pt=t=>ei(ni(t)),At=(t,n)=>{const{r:e,g:o,b:r}=bn(t);return`rgba(${e}, ${o}, ${r}, ${te(n)})`},ri=`<svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1.7552 10.1256L1.2809 9.96751M1.7552 10.1256C2.0867 9.13091 2.6453 8.22711 3.3867 7.48571L9.3578 1.51461C10.044 0.828462 11.1565 0.828462 11.8427 1.51461C12.5288 2.20081 12.5288 3.31331 11.8427 3.99951L5.8716 9.97061C5.1302 10.712 4.2264 11.2705 3.2317 11.6021L2.9061 11.7106C2.5405 11.8325 2.2084 12.0378 1.9359 12.3102C1.8732 12.373 1.7715 12.373 1.7087 12.3102L1.0471 11.6485C0.9843 11.5858 0.9843 11.4841 1.0471 11.4214C1.3195 11.1489 1.5248 10.8167 1.6466 10.4512L1.7552 10.1256Z" stroke="currentColor"/>
<path d="M6.61035 2.75684L10.6004 6.74684" stroke="currentColor" stroke-linecap="round"/>
</svg>
`,ii="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAABYlAAAWJQFJUiTwAAABaWlDQ1BEaXNwbGF5IFAzAAB4nHWQvUvDUBTFT6tS0DqIDh0cMolD1NIKdnFoKxRFMFQFq1OafgltfCQpUnETVyn4H1jBWXCwiFRwcXAQRAcR3Zw6KbhoeN6XVNoi3sfl/Ticc7lcwBtQGSv2AijplpFMxKS11Lrke4OHnlOqZrKooiwK/v276/PR9d5PiFlNu3YQ2U9cl84ul3aeAlN//V3Vn8maGv3f1EGNGRbgkYmVbYsJ3iUeMWgp4qrgvMvHgtMunzuelWSc+JZY0gpqhrhJLKc79HwHl4plrbWD2N6f1VeXxRzqUcxhEyYYilBRgQQF4X/8044/ji1yV2BQLo8CLMpESRETssTz0KFhEjJxCEHqkLhz634PrfvJbW3vFZhtcM4v2tpCAzidoZPV29p4BBgaAG7qTDVUR+qh9uZywPsJMJgChu8os2HmwiF3e38M6Hvh/GMM8B0CdpXzryPO7RqFn4Er/QcXKWq8MSlPPgAAAD9JREFUeAHt0TERAEAIxMDjxeDfDpjh8XAFTaJgZxJVNTLKTDk9HQcAAAAAAAAAiNlk1N1yYgEAAAAAAABwDvgyEgrFBiktOwAAAABJRU5ErkJggg==",Qt=({value:t,defaultValue:n,onChange:e})=>{const[o,r]=g.useState(()=>t??n),i=t!==void 0;g.useEffect(()=>{i&&r(t)},[i,t]);const s=g.useCallback(a=>{if(i){const l=typeof a=="function"?a(t):a;e?.(l);return}r(l=>{const c=typeof a=="function"?a(l):a;return e?.(c),c})},[i,e,t]);return[i?t:o,s]},si=({value:t,defaultValue:n,onChange:e})=>{const[o,r]=g.useState(()=>t??n),i=t!==void 0;g.useEffect(()=>{i&&r(t)},[i,t]);const s=g.useCallback(a=>{if(i){const l=typeof a=="function"?a(t):a;e?.(l);return}r(l=>{const c=typeof a=="function"?a(l):a;return e?.(c),c})},[i,e,t]);return[i?t:o,s]},st=.05,me=(t,n,e=1)=>{var o;return{id:`stop-${Math.random().toString(36).slice(2,10)}`,position:te(n),color:((o=we(t))==null?void 0:o.toUpperCase())??"#CCCCCC",alpha:te(e)}},ai=t=>{if(t.stops.length>=2)return t;if(t.stops.length===1){const[n]=t.stops;return{...t,stops:[{...n,position:st},{...me(n.color,1-st,n.alpha)}]}}return{...t,stops:[me("#CCCCCC",st),me("#050202",1-st)]}},Zt=(t,n)=>{var e;if(t.mode==="solid")return{id:"solid",position:0,color:((e=we(t.color))==null?void 0:e.toUpperCase())??"#FFFFFF",alpha:te(t.alpha)};const o=t.stops??[],r=o.find(s=>s.id===n),i=o[0]??me("#FFFFFF",.5);return r??i},li={mode:"solid",color:"#CCCCCC",alpha:1},Jt={start:{x:.2,y:.5},end:{x:.8,y:.5}},Dt={x:.5,y:.5},ct=.35,at=t=>{const n=Number.isFinite(t)?t:ct;return Math.max(n,.01)},he=t=>({x:t.x,y:t.y}),ci=t=>{const n=t%360;return n<0?n+360:n},ui=t=>{if(t.mode==="linear"&&t.line)return{start:he(t.line.start),end:he(t.line.end)};if(t.mode==="radial"){const n=t.center??Dt,e=at(t.radius??ct),o=((t.angle??90)-90)*Math.PI/180,r={x:n.x+Math.cos(o)*e,y:n.y+Math.sin(o)*e};return{start:he(n),end:r}}return{start:he(Jt.start),end:he(Jt.end)}},di=t=>{if(t.mode==="radial")return{center:he(t.center??Dt),radius:at(t.radius??ct),angle:t.angle??90};if(t.mode==="linear"&&t.line){const{start:n,end:e}=t.line,o=e.x-n.x,r=e.y-n.y,i=at(Math.sqrt(o*o+r*r)),s=ci(Math.atan2(r,o)*180/Math.PI+90);return{center:he(n),radius:i,angle:s}}return{center:he(Dt),radius:at(ct),angle:90}},en=(t,n,e)=>{if(n===t.mode)return t;if(n==="solid")return{mode:"solid",color:e.color,alpha:e.alpha};const o=t.mode==="solid"?[me(t.color,0,t.alpha),me(t.color,1,t.alpha)]:t.stops.map(a=>({...a})),r=ui(t),i=di(t),s=n==="linear"?{mode:"linear",angle:t.mode==="linear"?t.angle:90,line:r,stops:o}:{mode:"radial",center:i.center,radius:i.radius,angle:i.angle,stops:o};return ai(s)},fi=()=>"linear-gradient(90deg, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)",pi=t=>`linear-gradient(90deg, rgba(255,255,255,0) 0%, ${At(t,1)} 100%)`,hi=t=>({backgroundImage:`
      linear-gradient(0deg, #000000, rgba(0,0,0,0)),
      linear-gradient(90deg, #ffffff, ${Pt({h:t.h,s:1,v:1})})
    `}),mi=`<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="2.5" y="2.5" width="11" height="11" rx="1.5" stroke="currentColor" style="stroke:currentColor;stroke-opacity:1;"/>
</svg>
`,gi=`<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="2.42857" y="2.42857" width="11.1429" height="11.1429" rx="1.28571" stroke="currentColor" style="stroke:currentColor;stroke-opacity:1;" stroke-width="0.857143"/>
<rect opacity="0.5" x="3.92858" y="3.92858" width="8.14286" height="0.428571" rx="0.214286" stroke="currentColor" style="stroke:currentColor;stroke-opacity:1;" stroke-width="0.428571"/>
<rect opacity="0.2" x="3.92858" y="5.64287" width="8.14286" height="0.428571" rx="0.214286" stroke="currentColor" style="stroke:currentColor;stroke-opacity:1;" stroke-width="0.428571"/>
<rect opacity="0.1" x="3.92858" y="7.35714" width="8.14286" height="0.428571" rx="0.214286" stroke="currentColor" style="stroke:currentColor;stroke-opacity:1;" stroke-width="0.428571"/>
</svg>
`,vi=`<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="2.42857" y="2.42857" width="11.1429" height="11.1429" rx="1.28571" stroke="currentColor" style="stroke:currentColor;stroke-opacity:1;" stroke-width="0.857143"/>
<rect opacity="0.5" x="4.14287" y="4.14287" width="7.71429" height="7.71429" rx="0.428571" stroke="currentColor" style="stroke:currentColor;stroke-opacity:1;" stroke-width="0.857143"/>
<rect opacity="0.2" x="5.85716" y="5.85716" width="4.28571" height="4.28571" rx="0.428571" stroke="currentColor" style="stroke:currentColor;stroke-opacity:1;" stroke-width="0.857143"/>
</svg>
`,xi=`<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet"><path d="M12 6L8 10L4 6" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path></svg>
`,wt={solid:"Solid",linear:"Linear",radial:"Radial"},tn={solid:mi,linear:gi,radial:vi},yi=xi,wi=({currentMode:t,isMenuOpen:n,onToggleMenu:e,onModeSelect:o,onHeaderPointerDown:r,selectModeOff:i=!1})=>H.jsxs("div",{className:["ColorPicker__header",i?"ColorPicker__header--hidden":""].filter(Boolean).join(" "),onPointerDown:r,children:[H.jsx("div",{className:"ColorPicker__dragHandle"}),!i&&H.jsxs(H.Fragment,{children:[H.jsxs("button",{type:"button",className:"ColorPicker__modeTrigger",onClick:e,"aria-haspopup":"listbox","aria-expanded":n,children:[H.jsx("span",{className:"ColorPicker__modeIcon","aria-hidden":!0,dangerouslySetInnerHTML:{__html:tn[t]}}),H.jsx("span",{children:wt[t]}),H.jsx("span",{className:["ColorPicker__modeCaret",n?"ColorPicker__modeCaret--open":""].filter(Boolean).join(" "),"aria-hidden":!0,dangerouslySetInnerHTML:{__html:yi}})]}),n&&H.jsx("ul",{className:"ColorPicker__modeList",role:"listbox",children:Object.keys(wt).map(s=>H.jsx("li",{children:H.jsxs("button",{type:"button",className:"ColorPicker__modeOption",onClick:()=>o(s),"aria-selected":s===t,children:[H.jsx("span",{className:"ColorPicker__modeIcon","aria-hidden":!0,dangerouslySetInnerHTML:{__html:tn[s]}}),H.jsx("span",{className:"ColorPicker__modeOptionLabel",children:wt[s]})]})},s))})]})]}),bi=({isVisible:t,gradientTrackRef:n,gradientBackground:e,stops:o,activeStopId:r,onTrackClick:i,onStopPointerDown:s,onStopPointerMove:a,onStopPointerUp:l,onStopPointerCancel:c,onSelectStop:u})=>t?H.jsxs("div",{className:"ColorPicker__gradient",ref:n,onClick:i,children:[H.jsx("div",{className:"ColorPicker__gradientTrack",style:e?{backgroundImage:e}:void 0}),o.map(d=>H.jsx("button",{type:"button",className:["ColorPicker__gradientHandle",d.id===r?"ColorPicker__gradientHandle--active":""].filter(Boolean).join(" "),style:{left:`${d.position*100}%`},onPointerDown:f=>s(f,d.id),onPointerMove:a,onPointerUp:l,onPointerCancel:c,onClick:()=>u(d.id),onFocus:()=>u(d.id),"data-stop-id":d.id,title:`${Math.round(d.position*100)}%`,"aria-label":`Color stop at ${Math.round(d.position*100)} percent`},d.id))]}):null,Ci=({planeRef:t,backgroundStyle:n,saturation:e,value:o,onPointerDown:r,onPointerMove:i,onPointerUp:s,onPointerCancel:a})=>H.jsx("div",{className:"ColorPicker__planeWrapper",children:H.jsx("div",{ref:t,className:"ColorPicker__plane",style:{backgroundImage:n.backgroundImage},onPointerDown:r,onPointerMove:i,onPointerUp:s,onPointerCancel:a,children:H.jsx("div",{className:"ColorPicker__planeThumb",style:{left:`${e*100}%`,top:`${(1-o)*100}%`}})})}),nn=({trackRef:t,className:n,backgroundStyle:e,ariaLabel:o,ariaValueMin:r,ariaValueMax:i,ariaValueNow:s,onPointerDown:a,onPointerMove:l,onPointerUp:c,onPointerCancel:u,onKeyDown:d,handlePosition:f})=>H.jsx("div",{ref:t,className:n,style:e,role:"slider",tabIndex:0,"aria-label":o,"aria-valuemin":r,"aria-valuemax":i,"aria-valuenow":s,onPointerDown:a,onPointerMove:l,onPointerUp:c,onPointerCancel:u,onKeyDown:d,children:H.jsx("div",{className:"ColorPicker__gradientHandle ColorPicker__gradientHandle--active",style:{left:`${f*100}%`},"aria-hidden":"true"})}),Si=({hexValue:t,alphaValue:n,onHexChange:e,onAlphaChange:o,onAlphaKeyDown:r,onEyedropperClick:i,eyedropperIcon:s,eyeDropperAvailable:a,isEyeDropperActive:l,eyeDropperTitle:c})=>H.jsxs("div",{className:"ColorPicker__inputs",children:[H.jsx("button",{type:"button",className:"ColorPicker__eyedropper",onClick:i,disabled:!a||l,"aria-busy":l,"aria-label":"Выбрать цвет с экрана",title:c,children:H.jsx("span",{className:"ColorPicker__eyedropperIcon","aria-hidden":!0,dangerouslySetInnerHTML:{__html:s}})}),H.jsxs("div",{className:"ColorPicker__inputGroup ColorPicker__inputGroup--hex",children:[H.jsx("span",{className:"ColorPicker__inputPrefix",children:"#"}),H.jsx("input",{className:"ColorPicker__textInput",value:t,onChange:e,maxLength:6,spellCheck:!1,"aria-label":"Hex color"})]}),H.jsxs("div",{className:"ColorPicker__inputGroup ColorPicker__inputGroup--alpha",children:[H.jsx("input",{className:"ColorPicker__textInput",value:n,onChange:o,onKeyDown:r,maxLength:3,"aria-label":"Alpha percentage"}),H.jsx("span",{className:"ColorPicker__inputSuffix",children:"%"})]})]}),Us=({value:t,defaultValue:n,onChange:e,open:o,defaultOpen:r=!0,onOpenChange:i,draggable:s=!0,initialPosition:a,onPositionChange:l,className:c,activeStopId:u,defaultActiveStopId:d,onActiveStopIdChange:f,selectModeOff:p=!1})=>{var h,m;const[x,y]=Qt({value:t,defaultValue:n??li,onChange:e}),[S]=si({value:o,defaultValue:r,onChange:i}),[C,w]=g.useState(a??{x:48,y:48}),[k,b]=g.useState(!1),M=g.useRef(null),_=g.useRef(null),O=g.useRef(null),z=g.useRef(null),F=g.useRef(null),D=g.useRef(null),A=g.useRef(null),B=g.useRef(null),{open:$,close:K,isSupported:G}=Zr(),N=g.useRef({active:!1,offsetX:0,offsetY:0});g.useEffect(()=>{a&&w(a)},[a?.x,a?.y]);const Y=u!==void 0,[P,E]=Qt({value:u,defaultValue:d??(x.mode==="solid"?"solid":((h=x.stops[0])==null?void 0:h.id)??"solid"),onChange:f}),T=g.useCallback(v=>{w(v),l?.(v)},[l]),R=g.useMemo(()=>Zt(x,P),[x,P]);g.useEffect(()=>{var v;if(x.mode==="solid"){Y?u!=="solid"&&f?.("solid"):P!=="solid"&&E("solid");return}if(!x.stops||!x.stops.some(I=>I.id===P)){const I=((v=x.stops[0])==null?void 0:v.id)??"solid";Y?f?.(I):E(I)}},[P,u,Y,f,E,x]),g.useEffect(()=>{p&&x.mode!=="solid"&&y(v=>{if(v.mode==="solid")return v;const I=Zt(v,P);return en(v,"solid",I)})},[P,p,y,x.mode]);const V=((m=we(R.color))==null?void 0:m.toUpperCase())??"#FFFFFF",j=te(R.alpha),X=g.useMemo(()=>oi(V),[V]),[J,se]=g.useState(X.h);g.useEffect(()=>{X.s>0&&se(X.h)},[X.h,X.s]);const Z=g.useMemo(()=>X.s===0?{...X,h:J}:X,[J,X]),[le,ce]=g.useState(V),[Se,Ee]=g.useState(String(Math.round(j*100))),[Ae,Ve]=g.useState(!1);g.useEffect(()=>{ce(V)},[V]),g.useEffect(()=>{Ee(String(Math.round(j*100)))},[j]),g.useEffect(()=>{S||b(!1)},[S]),g.useEffect(()=>{p&&k&&b(!1)},[k,p]);const ue=g.useCallback(v=>{y(I=>v(I))},[y]),$e=g.useCallback(v=>{ue(I=>{if(I.mode==="solid"){const W=v(R);return{mode:"solid",color:we(W.color)??I.color,alpha:te(W.alpha)}}const U=(I.stops??[]).map(W=>W.id===R.id?{...v(W)}:W);return{...I,stops:U}})},[R,ue]),ge=g.useCallback(v=>{const I=v.length===9&&v.startsWith("#")?v.slice(0,7):v,U=we(I);U&&$e(W=>({...W,color:U.toUpperCase()}))},[$e]),ve=g.useCallback(v=>{$e(I=>({...I,alpha:te(v)}))},[$e]),Rt=g.useCallback(()=>{if(x.mode==="solid"||!x.stops||x.stops.length<=2)return;const v=[...x.stops].sort((W,oe)=>W.position-oe.position),I=v.findIndex(W=>W.id===R.id),U=v[I-1]??v[I+1]??v[0];ue(W=>W.mode==="solid"||!W.stops||W.stops.length<=2?W:{...W,stops:W.stops.filter(oe=>oe.id!==R.id)}),U&&E(U.id)},[R.id,ue,x]);g.useEffect(()=>{if(!S)return;const v=I=>{x.mode!=="solid"&&x.stops&&(x.stops.length<=2||R.id!=="solid"&&["Delete","Backspace","Del"].includes(I.key)&&(I.preventDefault(),Rt()))};return window.addEventListener("keydown",v),()=>{window.removeEventListener("keydown",v)}},[R.id,S,Rt,x]),g.useEffect(()=>()=>{K()},[K]);const Xe=g.useCallback(v=>{const I=be(v,0,360);se(I);const U=Pt({...Z,h:I});ge(U)},[Z,ge,se]),Ke=g.useCallback((v,I)=>{const U=_.current;if(!U)return;const{left:W,top:oe,width:Me,height:fe}=U.getBoundingClientRect(),pe=te((v-W)/Me),pt=te((I-oe)/fe),Te={h:Z.h,s:pe,v:1-pt};ge(Pt(Te))},[Z.h,ge]),Ln=g.useCallback(v=>{v.preventDefault(),D.current=v.pointerId,v.currentTarget.setPointerCapture(v.pointerId),Ke(v.clientX,v.clientY)},[Ke]),En=g.useCallback(v=>{D.current===v.pointerId&&(v.preventDefault(),Ke(v.clientX,v.clientY))},[Ke]),An=g.useCallback(v=>{D.current===v.pointerId&&(D.current=null,v.currentTarget.releasePointerCapture(v.pointerId))},[]),Rn=g.useCallback(v=>{D.current===v.pointerId&&(D.current=null,v.currentTarget.releasePointerCapture(v.pointerId))},[]),Tn=v=>{const I=v.target.value.toUpperCase().replace(/[^0-9A-F#]/g,"");ce(I);const U=we(I);U&&ge(U)},Bn=v=>{const I=v.target.value.replace(/[^0-9]/g,"");Ee(I);const U=te(Number(I)/100);ve(Number.isFinite(U)?U:0)},Un=g.useCallback(v=>{var I,U;if(v.key!=="ArrowUp"&&v.key!=="ArrowDown")return;v.preventDefault(),v.stopPropagation(),v.nativeEvent instanceof KeyboardEvent&&((U=(I=v.nativeEvent).stopImmediatePropagation)==null||U.call(I));const W=v.key==="ArrowUp"?1:-1,oe=be(Math.round(j*100)+W,0,100);ve(oe/100)},[j,ve]),Ye=g.useCallback(v=>{const I=z.current;if(!I)return;const{left:U,width:W}=I.getBoundingClientRect();if(W<=0)return;const oe=te((v-U)/W);Xe(oe*360)},[Xe]),zn=g.useCallback(v=>{v.preventDefault(),A.current=v.pointerId,v.currentTarget.setPointerCapture(v.pointerId),Ye(v.clientX)},[Ye]),jn=g.useCallback(v=>{A.current===v.pointerId&&(v.preventDefault(),Ye(v.clientX))},[Ye]),Nn=g.useCallback(v=>{A.current===v.pointerId&&(A.current=null,v.currentTarget.releasePointerCapture(v.pointerId))},[]),Hn=g.useCallback(v=>{A.current===v.pointerId&&(A.current=null,v.currentTarget.releasePointerCapture(v.pointerId))},[]),Fn=g.useCallback(v=>{const{key:I}=v;let U=Z.h;if(I==="ArrowLeft"||I==="ArrowDown")U-=1;else if(I==="ArrowRight"||I==="ArrowUp")U+=1;else if(I==="PageDown")U-=10;else if(I==="PageUp")U+=10;else if(I==="Home")U=0;else if(I==="End")U=360;else return;v.preventDefault(),Xe(U)},[Z.h,Xe]),We=g.useCallback(v=>{const I=F.current;if(!I)return;const{left:U,width:W}=I.getBoundingClientRect();if(W<=0)return;const oe=te((v-U)/W);ve(oe)},[ve]),On=g.useCallback(async()=>{if(G())try{Ve(!0);const v=await $();v!=null&&v.sRGBHex&&ge(v.sRGBHex)}catch(v){v?.name!=="AbortError"&&console.error("EyeDropper error",v)}finally{Ve(!1)}},[ge,G,$]),Gn=g.useCallback(v=>{v.preventDefault(),B.current=v.pointerId,v.currentTarget.setPointerCapture(v.pointerId),We(v.clientX)},[We]),Vn=g.useCallback(v=>{B.current===v.pointerId&&(v.preventDefault(),We(v.clientX))},[We]),$n=g.useCallback(v=>{B.current===v.pointerId&&(B.current=null,v.currentTarget.releasePointerCapture(v.pointerId))},[]),Xn=g.useCallback(v=>{B.current===v.pointerId&&(B.current=null,v.currentTarget.releasePointerCapture(v.pointerId))},[]),Kn=g.useCallback(v=>{const{key:I}=v;let U=j*100;if(I==="ArrowLeft"||I==="ArrowDown")U-=1;else if(I==="ArrowRight"||I==="ArrowUp")U+=1;else if(I==="PageDown")U-=10;else if(I==="PageUp")U+=10;else if(I==="Home")U=0;else if(I==="End")U=100;else return;v.preventDefault(),ve(U/100)},[j,ve]),Yn=v=>{var I;if(p)return;const U=en(x,v,R);if(b(!1),y(U),v!=="solid"){const W=((I=U.stops[0])==null?void 0:I.id)??"solid";E(W)}else E("solid")},ft=g.useMemo(()=>x.mode==="solid"||!x.stops?[]:[...x.stops].sort((v,I)=>v.position-I.position),[x]),Wn=g.useMemo(()=>x.mode==="solid"||!x.stops?"":`linear-gradient(90deg, ${ft.map(v=>`${At(v.color,v.alpha)} ${Math.round(v.position*100)}%`).join(", ")})`,[ft,x]),ke=g.useRef({id:null,pointerId:null}),qn=g.useCallback(v=>{const{id:I,pointerId:U}=ke.current;if(!I||x.mode==="solid"||U!==v.pointerId)return;const W=O.current;if(!W)return;const{left:oe,width:Me}=W.getBoundingClientRect(),fe=te((v.clientX-oe)/Me);ue(pe=>{if(pe.mode==="solid")return pe;const pt=pe.stops.map(Te=>Te.id===I?{...Te,position:fe}:Te);return{...pe,stops:pt}})},[ue,x.mode]),Qn=g.useCallback(v=>{const{pointerId:I}=ke.current;I===v.pointerId&&(ke.current={id:null,pointerId:null},v.currentTarget.releasePointerCapture(v.pointerId))},[]),Zn=g.useCallback(v=>{ke.current.pointerId===v.pointerId&&(ke.current={id:null,pointerId:null},v.currentTarget.releasePointerCapture(v.pointerId))},[]),Jn=(v,I)=>{v.preventDefault(),x.mode!=="solid"&&(E(I),ke.current={id:I,pointerId:v.pointerId},v.currentTarget.setPointerCapture(v.pointerId))},eo=v=>{if(x.mode==="solid"||v.target.dataset.stopId)return;const I=O.current;if(!I)return;const{left:U,width:W}=I.getBoundingClientRect(),oe=te((v.clientX-U)/W),Me=me(V,oe,j);ue(fe=>fe.mode==="solid"?fe:{...fe,stops:[...fe.stops,Me].map(pe=>({...pe}))}),E(Me.id)},Re=g.useCallback(v=>{if(!N.current.active)return;v.preventDefault();const I={x:v.clientX-N.current.offsetX,y:v.clientY-N.current.offsetY};T(I)},[T]),qe=g.useCallback(v=>{N.current.active&&(N.current={active:!1,offsetX:0,offsetY:0},v.preventDefault(),window.removeEventListener("pointermove",Re),window.removeEventListener("pointerup",qe))},[Re]);g.useEffect(()=>()=>{window.removeEventListener("pointermove",Re),window.removeEventListener("pointerup",qe)},[Re,qe]);const to=v=>{if(!s)return;const{clientX:I,clientY:U}=v;N.current={active:!0,offsetX:I-C.x,offsetY:U-C.y},window.addEventListener("pointermove",Re),window.addEventListener("pointerup",qe)},no=["ColorPicker",c].filter(Boolean).join(" "),oo=x.mode!=="solid",ro=fi(),Tt=pi(V),io=hi(Z),so=g.useMemo(()=>({backgroundImage:`${Tt}, url(${ii})`,backgroundSize:"100% 100%, 13px 13px",backgroundPosition:"0 0, 0 0",backgroundRepeat:"no-repeat, repeat"}),[Tt]),Bt=G(),ao=Bt?Ae?"Выбор цвета…":"Выбрать цвет с экрана":"Пипетка недоступна в этом браузере";return S?H.jsxs("div",{ref:M,className:no,style:{transform:`translate(${Math.round(C.x)}px, ${Math.round(C.y)}px)`},children:[H.jsx(wi,{currentMode:x.mode,isMenuOpen:k,onToggleMenu:()=>b(v=>!v),onModeSelect:Yn,onHeaderPointerDown:to,selectModeOff:p}),H.jsx(bi,{isVisible:oo,gradientTrackRef:O,gradientBackground:Wn,stops:ft,activeStopId:R.id,onTrackClick:eo,onStopPointerDown:Jn,onStopPointerMove:qn,onStopPointerUp:Qn,onStopPointerCancel:Zn,onSelectStop:E}),H.jsx(Ci,{planeRef:_,backgroundStyle:io,saturation:Z.s,value:Z.v,onPointerDown:Ln,onPointerMove:En,onPointerUp:An,onPointerCancel:Rn}),H.jsxs("div",{className:"ColorPicker__sliders",children:[H.jsx(nn,{trackRef:z,className:"ColorPicker__slider ColorPicker__slider--hue",backgroundStyle:{backgroundImage:ro},ariaLabel:"Hue",ariaValueMin:0,ariaValueMax:360,ariaValueNow:Math.round(Z.h),onPointerDown:zn,onPointerMove:jn,onPointerUp:Nn,onPointerCancel:Hn,onKeyDown:Fn,handlePosition:be(Z.h,0,360)/360}),H.jsx(nn,{trackRef:F,className:"ColorPicker__slider ColorPicker__slider--alpha",backgroundStyle:so,ariaLabel:"Alpha",ariaValueMin:0,ariaValueMax:100,ariaValueNow:Math.round(j*100),onPointerDown:Gn,onPointerMove:Vn,onPointerUp:$n,onPointerCancel:Xn,onKeyDown:Kn,handlePosition:j})]}),H.jsx(Si,{hexValue:le.replace("#",""),alphaValue:Se,onHexChange:Tn,onAlphaChange:Bn,onAlphaKeyDown:Un,onEyedropperClick:On,eyedropperIcon:ri,eyeDropperAvailable:Bt,isEyeDropperActive:Ae,eyeDropperTitle:ao})]}):null},ut=t=>be(t,-.25,1.25),Cn=t=>Math.max(t,.01),on=12,Ce=t=>({x:ut(t.x),y:ut(t.y)}),ki={start:{x:.2,y:.5},end:{x:.8,y:.5}},Mi={x:.5,y:.5},Pi=.35,rn=t=>{const n=t?.line??ki;return{start:Ce(n.start),end:Ce(n.end)}},Di=(t,n)=>{const e=n.width||1,o=n.height||1,r=Math.min(e,o)||1,i=t.center??Mi,s=Cn(t.radius??Pi),a=t.angle??90,l=(Sn(a)-90)*Math.PI/180,c=Math.cos(l)*s*r/e,u=Math.sin(l)*s*r/o,d={x:i.x+c,y:i.y+u};return{start:Ce(i),end:Ce(d)}},sn=(t,n)=>t?t.mode==="linear"?rn(t):Di(t,n):rn(null),Sn=t=>{const n=t%360;return n<0?n+360:n},zs=({value:t,onChange:n,activeStopId:e,onActiveStopChange:o,visible:r,onDrag:i,containerWidth:s,containerHeight:a})=>{const l=t,c=g.useRef(null),u=()=>s||(typeof window<"u"?window.innerWidth:0),d=()=>a||(typeof window<"u"?window.innerHeight:0),[f,p]=g.useState(()=>({width:u(),height:d()})),[h,m]=g.useState(()=>sn(l,{width:u()||1,height:d()||1})),[x,y]=g.useState({visible:!1,ratio:0}),S=g.useRef({type:"none"}),C=g.useCallback((P,E)=>{i&&i({phase:P,...E})},[i]);g.useEffect(()=>{if(!r)return;if(s&&a){p({width:s,height:a});return}const P=()=>{p({width:window.innerWidth,height:window.innerHeight})};return P(),window.addEventListener("resize",P),()=>{window.removeEventListener("resize",P)}},[r,s,a]),g.useEffect(()=>{r||y({visible:!1,ratio:0})},[r]),g.useEffect(()=>{l&&S.current.type==="none"&&m(sn(l,{width:f.width||1,height:f.height||1}))},[l,f.height,f.width]);const w=g.useMemo(()=>{const{width:P,height:E}=f,T={x:h.start.x*(P||1),y:h.start.y*(E||1)},R={x:h.end.x*(P||1),y:h.end.y*(E||1)},V={x:R.x-T.x,y:R.y-T.y},j={x:T.x+V.x/2,y:T.y+V.y/2},X=V.x*V.x+V.y*V.y;return{start:T,end:R,center:j,vector:V,lengthSquared:X}},[h.end.x,h.end.y,h.start.x,h.start.y,f]),k=g.useCallback((P,E)=>{const T=c.current;if(!T)return{x:P,y:E};const R=T.getBoundingClientRect(),V=(f.width||1)/R.width,j=(f.height||1)/R.height;return{x:(P-R.left)*V,y:(E-R.top)*j}},[f.width,f.height]),b=g.useCallback((P,E)=>{const T=k(P,E);return{x:ut(T.x/(f.width||1)),y:ut(T.y/(f.height||1))}},[f.height,f.width,k]),M=g.useCallback((P,E)=>{const T=k(P,E),{start:R,vector:V,lengthSquared:j}=w;if(j===0)return{ratio:0,distance:1/0,closest:{x:R.x,y:R.y}};const X=T.x-R.x,J=T.y-R.y,se=X*V.x+J*V.y,Z=te(se/j),le={x:R.x+V.x*Z,y:R.y+V.y*Z},ce=T.x-le.x,Se=T.y-le.y;return{ratio:Z,distance:Math.sqrt(ce*ce+Se*Se),closest:le}},[w,k]),_=g.useCallback((P,E)=>M(P,E).ratio,[M]),O=g.useCallback(()=>{S.current={type:"none"}},[]);g.useEffect(()=>{if(!r)return;const P=T=>{if(S.current.type==="none")return;const R=S.current;if(l)if(R.type==="stop"){if(!l.stops.some(X=>X.id===R.stopId))return;const V=_(T.clientX,T.clientY),j=[...l.stops.map(X=>X.id===R.stopId?{...X,position:V}:X)].sort((X,J)=>X.position-J.position);n(l.mode==="linear"?{...l,stops:j}:{...l,stops:j}),C("move",{target:"stop",stopId:R.stopId,ratio:V})}else{const V=b(T.clientX,T.clientY),j=R.type==="start"?{start:V,end:h.end}:{start:h.start,end:V};m(j);const X={x:j.start.x*(f.width||1),y:j.start.y*(f.height||1)},J={x:j.end.x*(f.width||1),y:j.end.y*(f.height||1)},se={x:J.x-X.x,y:J.y-X.y},Z=Sn(Math.atan2(se.y,se.x)*180/Math.PI+90),le=f.width||1,ce=f.height||1,Se=Math.min(le,ce)||1,Ee=j.end.x-j.start.x,Ae=j.end.y-j.start.y,Ve=Cn(Math.sqrt(Ee*le*(Ee*le)+Ae*ce*(Ae*ce))/Se);if(l.mode==="linear")n({...l,angle:Z,line:{start:Ce(j.start),end:Ce(j.end)}});else{const ue={...l,angle:Z,center:Ce(j.start),radius:Ve};n(ue)}C("move",{target:R.type==="start"?"lineStart":"lineEnd",point:V})}},E=T=>{var R,V;const j=S.current;if(j.type!=="none"&&j.pointerId===T.pointerId){if((V=(R=j.target).releasePointerCapture)==null||V.call(R,T.pointerId),j.type==="stop"){const X=_(T.clientX,T.clientY);C("end",{target:"stop",stopId:j.stopId,ratio:X})}else{const X=b(T.clientX,T.clientY);C("end",{target:j.type==="start"?"lineStart":"lineEnd",point:X})}O()}};return window.addEventListener("pointermove",P),window.addEventListener("pointerup",E),window.addEventListener("pointercancel",E),()=>{window.removeEventListener("pointermove",P),window.removeEventListener("pointerup",E),window.removeEventListener("pointercancel",E)}},[l,b,O,w,C,n,_,r,f.height,f.width]);const z=g.useCallback(P=>E=>{l&&(E.preventDefault(),E.currentTarget.setPointerCapture(E.pointerId),S.current={type:"stop",pointerId:E.pointerId,stopId:P.id,target:E.currentTarget},C("start",{target:"stop",stopId:P.id,ratio:te(P.position)}),o?.(P.id))},[C,l,o]),F=g.useCallback(P=>E=>{l&&(E.preventDefault(),E.currentTarget.setPointerCapture(E.pointerId),S.current={type:P,pointerId:E.pointerId,target:E.currentTarget},C("start",{target:P==="start"?"lineStart":"lineEnd",point:h[P]}))},[C,l,h.end,h.start]),D=g.useCallback(P=>{if(!l||P.target.classList&&P.target.classList.contains("ColorPickerControls__handle")||P.target.className&&typeof P.target.className=="object"&&P.target.className.baseVal&&P.target.className.baseVal.includes("ColorPickerControls__handle"))return;P.preventDefault();const{ratio:E,distance:T}=M(P.clientX,P.clientY);if(T>on)return;const R=e&&l.stops.find(Z=>Z.id===e)||l.stops[0],V=R?.color??"#FFFFFF",j=R?.alpha??1,X=me(V,E,j),J=[...l.stops,X].sort((Z,le)=>Z.position-le.position),se=l.mode==="linear"?{...l,stops:J}:{...l,stops:J};n(se),o?.(X.id)},[e,l,o,n,M]),A=g.useCallback(P=>{l&&S.current.type==="none"&&y(E=>{const{ratio:T,distance:R}=M(P.clientX,P.clientY);return R>on?E.visible?{...E,visible:!1}:E:{visible:!0,ratio:T}})},[l,M]),B=g.useCallback(()=>{S.current.type==="none"&&y(P=>({...P,visible:!1}))},[]),$=g.useMemo(()=>{if(!l)return[];const{start:P,end:E}=w;return l.stops.map(T=>{const R=te(T.position);return{stop:T,x:P.x+(E.x-P.x)*R,y:P.y+(E.y-P.y)*R}})},[l,w]);if(!r||!l)return null;const{width:K,height:G}=f,{start:N,end:Y}=w;return H.jsx("div",{className:"ColorPickerControls",children:H.jsxs("svg",{ref:c,className:"ColorPickerControls__canvas",width:"100%",height:"100%",viewBox:`0 0 ${K} ${G}`,preserveAspectRatio:"xMidYMid meet",onPointerDown:D,onPointerMove:A,onPointerLeave:B,children:[H.jsx("line",{x1:N.x,y1:N.y,x2:Y.x,y2:Y.y,className:"ColorPickerControls__axis"}),H.jsx("circle",{cx:N.x,cy:N.y,r:4,className:"ColorPickerControls__handle ColorPickerControls__handle--endpoint",onPointerDown:F("start")}),H.jsx("circle",{cx:Y.x,cy:Y.y,r:4,className:"ColorPickerControls__handle ColorPickerControls__handle--endpoint",onPointerDown:F("end")}),x.visible&&H.jsx("circle",{cx:N.x+(Y.x-N.x)*x.ratio,cy:N.y+(Y.y-N.y)*x.ratio,r:8,className:"ColorPickerControls__handle ColorPickerControls__handle--preview",pointerEvents:"none"}),$.map(({stop:P,x:E,y:T})=>H.jsx("circle",{cx:E,cy:T,r:8,className:["ColorPickerControls__handle",P.id===e?"ColorPickerControls__handle--active":""].filter(Boolean).join(" "),fill:At(P.color,P.alpha),onPointerDown:z(P)},P.id))]})})},js=g.memo(function(){const n=q(h=>h.animation?.playbackState),e=q(h=>h.animation?.currentTime??0),o=q(h=>h.animation?.mode),r=q(h=>h.animation?.settings.duration??0),i=q(h=>h.animation?.proceduralConfig?.duration),s=q(h=>h.play),a=q(h=>h.pause),l=q(h=>h.stop),c=q(h=>h.addKeyframe),u=q(h=>h.isRecording),d=q(h=>h.toggleRecording);if(!n)return null;const f=n==="playing",p=o==="procedural"&&i?i:r;return L.jsxs("div",{className:"playback-controls",children:[L.jsxs("div",{className:"playback-buttons",children:[L.jsx("button",{className:"playback-btn",onClick:l,title:"Stop (return to start)",children:L.jsx(Mt,{icon:"skipBack",size:12})}),L.jsx("button",{className:"playback-btn playback-btn--primary",onClick:f?a:s,title:f?"Pause":"Play",children:L.jsx(Mt,{icon:f?"pause":"play",size:12})}),o==="keyframe"&&L.jsx("button",{className:`playback-btn ${u?"playback-btn--recording":""}`,onClick:d,title:u?"Stop recording":"Start recording (auto-create keyframes)",children:L.jsx("svg",{width:"16",height:"16",viewBox:"0 0 16 16",fill:"currentColor",children:L.jsx("circle",{cx:"8",cy:"8",r:"5"})})}),o==="keyframe"&&L.jsx("button",{className:"playback-btn",onClick:()=>c(),title:"Add keyframe at current time (K)",children:L.jsx("svg",{width:"16",height:"16",viewBox:"0 0 16 16",fill:"currentColor",children:L.jsx("path",{d:"M8 1L14 8L8 15L2 8L8 1Z"})})})]}),L.jsxs("div",{className:"playback-time",children:[L.jsx("span",{className:"playback-time-current",children:Kt(e)}),L.jsx("span",{className:"playback-time-separator",children:"/"}),L.jsx("span",{className:"playback-time-total",children:Kt(p)})]})]})});function _i(t){const n=new Map;if(t)for(const e of t)n.set(e.id,e.time);return n}const Ns=g.memo(function({row:n,col:e,keyframes:o,selectedKeyframeIds:r,snappedKeyframeId:i,duration:s,totalWidth:a}){const l=q(w=>w.selectKeyframeForPoint),c=q(w=>w.updateKeyframeTime),u=q(w=>w.updateKeyframeTimesBatch),d=q(w=>w.animation?.keyframes),f=g.useMemo(()=>_i(d),[d]),[p,h]=g.useState(null),m=g.useRef(null),x=[...o].sort((w,k)=>w.time-k.time),y=[];for(let w=0;w<x.length-1;w++){const k=x[w],b=x[w+1],M=k.time/s*a,_=b.time/s*a;y.push({x1:M,x2:_})}const S=g.useCallback((w,k)=>{w.stopPropagation(),l(k,n,e)},[l,n,e]),C=g.useCallback((w,k,b)=>{if(w.button!==0)return;w.stopPropagation(),w.preventDefault(),h(k);const M=w.clientX,O=r.includes(k)&&r.length>1?r:[k],z=new Map;for(const A of O){const B=f.get(A);B!==void 0&&z.set(A,B)}const F=A=>{if(!m.current)return;const B=m.current.getBoundingClientRect(),K=(A.clientX-M)/B.width*s;if(O.length===1){const G=Math.max(0,Math.min(b+K,s));c(k,G)}else{const G=[];for(const[N,Y]of z){const P=Math.max(0,Math.min(Y+K,s));G.push({id:N,time:P})}u(G)}},D=()=>{h(null),document.removeEventListener("mousemove",F),document.removeEventListener("mouseup",D)};document.addEventListener("mousemove",F),document.addEventListener("mouseup",D)},[s,c,u,r,f]);return L.jsxs("div",{className:"point-track","data-row":n,"data-col":e,children:[L.jsx("div",{className:"point-track-label",children:L.jsxs("span",{children:[n,",",e]})}),L.jsxs("div",{className:"point-track-content",ref:m,children:[L.jsx("svg",{className:"point-track-lines",width:a,height:"100%",style:{position:"absolute",top:0,left:0,pointerEvents:"none"},children:y.map((w,k)=>L.jsx("line",{x1:w.x1,y1:"50%",x2:w.x2,y2:"50%",stroke:"var(--accent)",strokeWidth:"2",strokeOpacity:"0.3"},k))}),x.map(w=>{const k=w.time/s*a,b=`rgb(${Math.round(w.color.r*255)}, ${Math.round(w.color.g*255)}, ${Math.round(w.color.b*255)})`,M=r.includes(w.keyframeId),_=w.keyframeId===i,O=w.keyframeId===p;return L.jsx("div",{className:`point-keyframe-marker ${M?"point-keyframe-marker--selected":""} ${_?"point-keyframe-marker--snapped":""} ${O?"point-keyframe-marker--dragging":""}`,style:{left:k},onClick:z=>S(z,w.keyframeId),onMouseDown:z=>C(z,w.keyframeId,w.time),children:L.jsx("svg",{width:"10",height:"10",viewBox:"0 0 10 10",fill:b,children:L.jsx("path",{d:"M5 0L10 5L5 10L0 5L5 0Z"})})},w.keyframeId)})]})]})}),Ii=(t,n)=>({grid:Pe(3,4,800,600),topology:"rectangle",selection:{pointIds:[],handleType:null},tessellationLevel:64,isDragging:!1,toolMode:"select",colorInterpolation:"lch",fixEdges:!1,aspectRatio:{preset:"4:3",width:4,height:3},viewport:{zoom:1,panX:0,panY:0},zoomMode:"fit",showUI:!0,showSidePanels:!0,hideMesh:!1,backgroundColor:null,proceduralConfig:{...So,gridRows:4,gridCols:4,seed:Math.floor(Math.random()*1e4),pattern:["corners","linear","radial","diagonal","noise","waves","spiral"][Math.floor(Math.random()*7)]??"corners",harmony:"custom",customColors:[{r:.94,g:.36,b:.36,a:1},{r:.94,g:.65,b:.25,a:1},{r:.95,g:.85,b:.3,a:1},{r:.3,g:.78,b:.45,a:1},{r:.35,g:.55,b:.9,a:1}],colorWeights:[1,1,1,1,1],positionJitter:1.5,handleLength:1.5,handleVariation:1.5,smoothness:.5,flowStrength:.5,flowType:"circular"},hasManualEdits:!1,setTopology:e=>{const{grid:o}=n(),r=e==="circle"?Be(3,3,o.width,o.height):Pe(3,3,o.width,o.height);t({topology:e,grid:r,selection:{pointIds:[],handleType:null}}),ne()},setGridSize:(e,o)=>{const{grid:r,topology:i}=n(),s=r,a=i==="circle"?Be(e,o,r.width,r.height):Pe(e,o,r.width,r.height);if(s.points.length>0&&s.points[0].length>0)for(let l=0;l<e;l++)for(let c=0;c<o;c++){const u=o>1?c/(o-1):.5,f=(e>1?l/(e-1):.5)*(s.rows-1),p=u*(s.cols-1),h=Math.floor(f),m=Math.min(h+1,s.rows-1),x=Math.floor(p),y=Math.min(x+1,s.cols-1),S=f-h,C=p-x,w=s.points[h][x].color,k=s.points[h][y].color,b=s.points[m][x].color,M=s.points[m][y].color;a.points[l][c].color={r:(1-S)*((1-C)*w.r+C*k.r)+S*((1-C)*b.r+C*M.r),g:(1-S)*((1-C)*w.g+C*k.g)+S*((1-C)*b.g+C*M.g),b:(1-S)*((1-C)*w.b+C*k.b)+S*((1-C)*b.b+C*M.b),a:(1-S)*((1-C)*w.a+C*k.a)+S*((1-C)*b.a+C*M.a)}}t({grid:a}),ne()},setCanvasSize:(e,o)=>{const{grid:r}=n();t({grid:Pe(r.rows,r.cols,e,o)}),ne()},setAspectRatio:(e,o,r)=>{const{grid:i,topology:s}=n();let a;if(e==="custom"&&o&&r)a={preset:e,width:o,height:r};else{const u={"1:1":{width:1,height:1},"4:3":{width:4,height:3},"3:4":{width:3,height:4},"3:2":{width:3,height:2},"2:3":{width:2,height:3},"16:9":{width:16,height:9},"9:16":{width:9,height:16},"21:9":{width:21,height:9},"9:21":{width:9,height:21}},{width:d,height:f}=u[e]||{width:1,height:1};a={preset:e,width:d,height:f}}const l=nr(a);let c;if(s==="circle"){const u=i;c=Be(i.rows,i.cols,l.width,l.height);for(let d=0;d<Math.min(u.rows,c.rows);d++)for(let f=0;f<Math.min(u.cols,c.cols);f++)u.points[d]?.[f]&&c.points[d]?.[f]&&(c.points[d][f].color=u.points[d][f].color)}else c=ir(i,l.width,l.height);t({aspectRatio:a,grid:c}),ne()},setPointPosition:(e,o)=>{if(rt())return;const r=n().grid.points.flat().find(s=>s.id===e),i=r?{x:r.position.x,y:r.position.y}:null;t(s=>{const a=s.grid.points.flat().find(u=>u.id===e),l=s.topology==="circle"&&a?.row===0,c=s.grid.points.map((u,d)=>u.map(f=>f.id===e?{...f,position:o}:l&&d===0?{...f,position:o}:f));return{grid:{...s.grid,points:c},hasManualEdits:!0}}),i&&gt(n().grid,e,o,i),xe(e)},setPointColor:(e,o)=>{const r=n().grid.points.flat().find(s=>s.id===e),i=r?{...r.color}:null;t(s=>{const a=s.grid.points.map(l=>l.map(c=>c.id===e?{...c,color:o}:c));return{grid:{...s.grid,points:a},hasManualEdits:!0}}),i&&$t(n().grid,e,o,i),xe(e)},setHandle:(e,o,r)=>{if(rt())return;const s=n().grid.points.flat().find(a=>a.id===e)?.handles;if(t(a=>{const l=a.grid.points.map(c=>c.map(u=>{if(u.id!==e)return u;const d={...u.handles};switch(o){case"left":d.handleLeft=r,d.type==="smooth"&&(d.handleRight={x:-r.x,y:-r.y});break;case"right":d.handleRight=r,d.type==="smooth"&&(d.handleLeft={x:-r.x,y:-r.y});break;case"up":d.handleUp=r,d.type==="smooth"&&(d.handleDown={x:-r.x,y:-r.y});break;case"down":d.handleDown=r,d.type==="smooth"&&(d.handleUp={x:-r.x,y:-r.y});break}return{...u,handles:d}}));return{grid:{...a.grid,points:l},hasManualEdits:!0}}),s){const a={left:"handleLeft",right:"handleRight",up:"handleUp",down:"handleDown"};if(Xt(n().grid,e,o,r,s[a[o]]),s.type==="smooth"){const c={left:"right",right:"left",up:"down",down:"up"}[o];Xt(n().grid,e,c,{x:-r.x,y:-r.y},s[a[c]])}}xe(e)},toggleHandleType:e=>{t(o=>{const r=o.grid.points.map(i=>i.map(s=>{if(s.id!==e)return s;const a=s.handles.type==="smooth"?"corner":"smooth",l={...s.handles,type:a};if(a==="smooth"){const c=(Math.abs(s.handles.handleLeft.x)+Math.abs(s.handles.handleRight.x))/2;l.handleLeft={x:-c,y:0},l.handleRight={x:c,y:0};const u=(Math.abs(s.handles.handleUp.y)+Math.abs(s.handles.handleDown.y))/2;l.handleUp={x:0,y:-u},l.handleDown={x:0,y:u}}return{...s,handles:l}}));return{grid:{...o.grid,points:r}}})},resetGrid:()=>{const{grid:e,topology:o}=n(),r=o==="circle"?Be(e.rows,e.cols,e.width,e.height):Pe(e.rows,e.cols,e.width,e.height);t({grid:r,selection:{pointIds:[],handleType:null}}),ne()},setColorInterpolation:e=>t({colorInterpolation:e}),setFixEdges:e=>t({fixEdges:e}),applyProceduralGeneration:e=>{const{grid:o,topology:r}=n(),i=e.gridRows??o.rows,s=e.gridCols??o.cols;let a=o;(i!==o.rows||s!==o.cols)&&(a=r==="circle"?Be(i,s,o.width,o.height):Pe(i,s,o.width,o.height));const l=er(i,s,e),c=new Map(l.map(d=>[`${d.row},${d.col}`,d])),u=a.points.map((d,f)=>d.map((p,h)=>{const m=c.get(`${f},${h}`);return m?{...p,color:m.color,position:{x:m.position.x*a.width,y:m.position.y*a.height},handles:{...p.handles,handleLeft:m.handles.handleLeft,handleRight:m.handles.handleRight,handleUp:m.handles.handleUp,handleDown:m.handles.handleDown}}:p}));t({grid:{...a,points:u},selection:{pointIds:[],handleType:null},hasManualEdits:!1}),ne()},setProceduralConfig:e=>t(o=>({proceduralConfig:{...o.proceduralConfig,...e}})),setSelection:(e,o=null)=>t({selection:{pointIds:e?[e]:[],handleType:o}}),addToSelection:e=>{t(o=>o.selection.pointIds.includes(e)?o:{selection:{pointIds:[...o.selection.pointIds,e],handleType:null}})},toggleInSelection:e=>{t(o=>({selection:{pointIds:o.selection.pointIds.includes(e)?o.selection.pointIds.filter(i=>i!==e):[...o.selection.pointIds,e],handleType:null}}))},clearSelection:()=>t({selection:{pointIds:[],handleType:null}}),isPointSelected:e=>n().selection.pointIds.includes(e),setSelectedPointsColor:e=>{const{selection:o,grid:r}=n(),i=o.pointIds;if(i.length===0)return;const s=new Map;for(const a of r.points)for(const l of a)i.includes(l.id)&&s.set(l.id,{...l.color});t(a=>({grid:{...a.grid,points:a.grid.points.map(l=>l.map(c=>i.includes(c.id)?{...c,color:e}:c))}}));for(const a of i){const l=s.get(a);l&&$t(n().grid,a,e,l)}i.length>0&&xe(i[0])},setSelectedPointsHandleType:e=>{t(o=>{const r=o.selection.pointIds;if(r.length===0)return o;const i=o.grid.points.map(s=>s.map(a=>{if(!r.includes(a.id))return a;const l={...a.handles,type:e};if(e==="smooth"){const c=(Math.abs(a.handles.handleLeft.x)+Math.abs(a.handles.handleRight.x))/2;l.handleLeft={x:-c,y:0},l.handleRight={x:c,y:0};const u=(Math.abs(a.handles.handleUp.y)+Math.abs(a.handles.handleDown.y))/2;l.handleUp={x:0,y:-u},l.handleDown={x:0,y:u}}return{...a,handles:l}}));return{grid:{...o.grid,points:i}}})},smoothSelectedPointsHandles:()=>{t(e=>{const o=e.selection.pointIds;return o.length===0?e:{grid:{...e.grid,points:it(e.grid,o,(r,i,s)=>{const a=i.position.x-r.position.x,l=i.position.y-r.position.y,c=Math.sqrt(a*a+l*l);if(c===0)return{x:0,y:0};const u=c*.5;return{x:a/c*u/s.width,y:l/c*u/s.height}})}}}),ne()},minimizeSelectedPointsHandles:()=>{t(e=>{const o=e.selection.pointIds;return o.length===0?e:{grid:{...e.grid,points:it(e.grid,o,(r,i,s)=>{const a=i.position.x-r.position.x,l=i.position.y-r.position.y,c=Math.sqrt(a*a+l*l);if(c===0)return{x:0,y:0};const u=c*.15;return{x:a/c*u/s.width,y:l/c*u/s.height}})}}}),ne()},maximizeSelectedPointsHandles:()=>{t(e=>{const o=e.selection.pointIds;return o.length===0?e:{grid:{...e.grid,points:it(e.grid,o,(r,i,s)=>{const a=i.position.x-r.position.x,l=i.position.y-r.position.y,c=Math.sqrt(a*a+l*l);if(c===0)return{x:0,y:0};const u=c*.99;return{x:a/c*u/s.width,y:l/c*u/s.height}})}}}),ne()},perpendicularSelectedPointsHandles:()=>{t(e=>{const o=e.selection.pointIds;return o.length===0?e:{grid:{...e.grid,points:it(e.grid,o,(r,i,s)=>{const a=i.position.x-r.position.x,l=i.position.y-r.position.y,c=Math.sqrt(a*a+l*l);if(c===0)return{x:0,y:0};const u=c*.5;return{x:-l/c*u/s.width,y:a/c*u/s.height}})}}}),ne()},distributeSelectedPointsEvenly:()=>{const{grid:e,selection:o}=n();if(o.pointIds.length<3)return;const r=[];for(let m=0;m<e.points.length;m++)for(let x=0;x<e.points[m].length;x++){const y=e.points[m][x];o.pointIds.includes(y.id)&&r.push({point:y,row:m,col:x})}if(r.length<3)return;const i=Math.min(...r.map(m=>m.row)),s=Math.max(...r.map(m=>m.row)),a=Math.min(...r.map(m=>m.col)),l=Math.max(...r.map(m=>m.col));if(s===i&&l===a)return;const c=(m,x)=>{const y=e.points[m]?.[x];return y?{x:y.position.x,y:y.position.y}:null},u=c(i,a),d=c(i,l),f=c(s,a),p=c(s,l);if(!u||!d||!f||!p)return;const h=e.points.map(m=>m.map(x=>({...x,position:{...x.position}})));for(const m of r){const x=s===i?0:(m.row-i)/(s-i),y=l===a?0:(m.col-a)/(l-a),S=u.x+y*(d.x-u.x),C=u.y+y*(d.y-u.y),w=f.x+y*(p.x-f.x),k=f.y+y*(p.y-f.y);h[m.row][m.col].position.x=S+x*(w-S),h[m.row][m.col].position.y=C+x*(k-C)}t({grid:{...e,points:h}}),ne()},moveSelectedPoints:e=>{if(rt())return;const o=[];t(r=>{const i=r.selection.pointIds;if(i.length===0)return r;const s=r.topology==="circle"&&r.grid.points[0]?.some(l=>i.includes(l.id)),a=r.grid.points.map((l,c)=>l.map(u=>{if(i.includes(u.id)||s&&c===0){const d={x:u.position.x+e.x,y:u.position.y+e.y};return o.push({id:u.id,position:d}),{...u,position:d}}return u}));return{grid:{...r.grid,points:a}}});for(const{id:r,position:i}of o)gt(n().grid,r,i,{x:i.x-e.x,y:i.y-e.y});o.length>0&&xe(o[0].id)},updateSelectedPointPosition:(e,o)=>{if(rt())return;const r=new Map;for(const s of n().grid.points)for(const a of s)r.set(a.id,{...a.position});const i=[];t(s=>{const a=s.selection.pointIds;if(a.length===0)return s;const l=s.topology==="circle"&&s.grid.points[0]?.some(d=>a.includes(d.id)),c={x:e,y:o},u=s.grid.points.map((d,f)=>d.map(p=>a.includes(p.id)||l&&f===0?(i.push({id:p.id,position:c}),{...p,position:c}):p));return{grid:{...s.grid,points:u}}});for(const{id:s,position:a}of i){const l=r.get(s);l&&gt(n().grid,s,a,l)}},scaleSelectedPoints:(e,o)=>{t(i=>{const s=i.selection.pointIds;if(s.length<2)return i;const a=i.topology==="circle"&&i.grid.points[0]?.some(c=>s.includes(c.id)),l=i.grid.points.map((c,u)=>c.map(d=>!s.includes(d.id)&&!(a&&u===0)?d:{...d,position:{x:o.x+(d.position.x-o.x)*e.x,y:o.y+(d.position.y-o.y)*e.y},handles:{...d.handles,handleLeft:{x:d.handles.handleLeft.x*e.x,y:d.handles.handleLeft.y*e.y},handleRight:{x:d.handles.handleRight.x*e.x,y:d.handles.handleRight.y*e.y},handleUp:{x:d.handles.handleUp.x*e.x,y:d.handles.handleUp.y*e.y},handleDown:{x:d.handles.handleDown.x*e.x,y:d.handles.handleDown.y*e.y}}}));return{grid:{...i.grid,points:l}}}),ne();const r=n().selection.pointIds;r.length>0&&xe(r[0])},rotateSelectedPoints:(e,o)=>{t(i=>{const s=i.selection.pointIds;if(s.length<2)return i;const a=Math.cos(e),l=Math.sin(e),c=(p,h)=>({x:o.x+(p-o.x)*a-(h-o.y)*l,y:o.y+(p-o.x)*l+(h-o.y)*a}),u=p=>({x:p.x*a-p.y*l,y:p.x*l+p.y*a}),d=i.topology==="circle"&&i.grid.points[0]?.some(p=>s.includes(p.id)),f=i.grid.points.map((p,h)=>p.map(m=>!s.includes(m.id)&&!(d&&h===0)?m:{...m,position:c(m.position.x,m.position.y),handles:{...m.handles,handleLeft:u(m.handles.handleLeft),handleRight:u(m.handles.handleRight),handleUp:u(m.handles.handleUp),handleDown:u(m.handles.handleDown)}}));return{grid:{...i.grid,points:f}}}),ne();const r=n().selection.pointIds;r.length>0&&xe(r[0])},setDragging:e=>t({isDragging:e,tessellationLevel:e?16:64}),setTessellationLevel:e=>t({tessellationLevel:e}),setToolMode:e=>t({toolMode:e}),setViewport:e=>t(o=>({viewport:{...o.viewport,...e,zoom:Math.max(.1,Math.min(4,e.zoom??o.viewport.zoom))}})),resetViewport:()=>t({viewport:{zoom:1,panX:0,panY:0}}),fitToView:()=>t({zoomMode:"fit",viewport:{zoom:1,panX:0,panY:0}}),setZoomMode:e=>t({zoomMode:e}),toggleUI:()=>t(e=>({showUI:!e.showUI})),toggleSidePanels:()=>t(e=>({showSidePanels:!e.showSidePanels})),setHideMesh:e=>t({hideMesh:e}),insertRow:(e,o)=>{t({grid:Po(n().grid,e,o)}),ne()},insertColumn:(e,o)=>{t({grid:Do(n().grid,e,o)}),ne()},deleteRow:e=>{t({grid:_o(n().grid,e)}),ne()},deleteColumn:e=>{t({grid:Io(n().grid,e)}),ne()},findPointById:e=>{for(const o of n().grid.points)for(const r of o)if(r.id===e)return r;return null},getPointAt:(e,o)=>n().grid.points[e]?.[o]??null,isEdgePoint:e=>{const{grid:o,topology:r}=n();return r==="circle"?e.row===o.rows-1:e.row===0||e.row===o.rows-1||e.col===0||e.col===o.cols-1},getSelectedPoints:()=>{const{grid:e,selection:o}=n(),r=new Set(o.pointIds),i=[];for(const s of e.points)for(const a of s)r.has(a.id)&&i.push(a);return i},setBackgroundColor:e=>t({backgroundColor:e}),setGridDirect:e=>t({grid:e},!1)}),Li=t=>({effects:[],addEffect:n=>{const e=Ht(n,re());t(o=>({effects:[e,...o.effects]}))},removeEffect:n=>t(e=>({effects:e.effects.filter(o=>o.id!==n)})),updateEffect:(n,e)=>t(o=>({effects:o.effects.map(r=>r.id===n?{...r,...e}:r)})),reorderEffects:(n,e)=>{t(o=>{const r=[...o.effects],[i]=r.splice(n,1);return i&&r.splice(e,0,i),{effects:r}})},toggleEffect:n=>t(e=>({effects:e.effects.map(o=>o.id===n?{...o,enabled:!o.enabled}:o)})),resetEffect:n=>t(e=>({effects:e.effects.map(o=>o.id!==n?o:{...Ht(o.type,o.id),enabled:o.enabled})})),colorCorrection:{...St},updateColorCorrection:n=>t(e=>({colorCorrection:{...e.colorCorrection,...n}})),resetColorCorrection:()=>t(()=>({colorCorrection:{...St}}))}),Ei={content:"Double click to edit",x:.5,y:.5,rotation:0,scale:1,fontFamily:"Inter",fontSize:48,fontWeight:400,fontStyle:"normal",letterSpacing:0,lineHeight:1.2,textAlign:"center",color:{r:1,g:1,b:1,a:1},visible:!0,locked:!1},Ai=(t,n)=>({textLayers:[],selectedTextId:null,addTextLayer:()=>{const e=re(),{textLayers:o}=n();t({textLayers:[...o,{...Ei,id:e,zIndex:o.length}],selectedTextId:e})},updateTextLayer:(e,o)=>t(r=>({textLayers:r.textLayers.map(i=>i.id===e?{...i,...o}:i)})),deleteTextLayer:e=>t(o=>({textLayers:o.textLayers.filter(r=>r.id!==e),selectedTextId:o.selectedTextId===e?null:o.selectedTextId})),selectTextLayer:e=>t({selectedTextId:e}),reorderTextLayers:(e,o)=>{t(r=>{const i=[...r.textLayers],[s]=i.splice(e,1);return s?(i.splice(o,0,s),{textLayers:i.map((a,l)=>({...a,zIndex:l}))}):r})},duplicateTextLayer:e=>{const{textLayers:o}=n(),r=o.find(s=>s.id===e);if(!r)return;const i=re();t({textLayers:[...o,{...r,id:i,x:r.x+.02,y:r.y+.02,zIndex:o.length}],selectedTextId:i})}}),Hs={attract:"Attract",repel:"Repel",wave:"Wave",colorShift:"Color Shift",bulge:"Bulge",swirl:"Swirl"};function Ri(t,n){const e={id:n,enabled:!0,radius:.3,strength:.5,falloff:"smooth",fixEdges:!0};switch(t){case"attract":return{...e,type:"attract"};case"repel":return{...e,type:"repel"};case"wave":return{...e,type:"wave",amplitude:.1,frequency:3,speed:2};case"colorShift":return{...e,type:"colorShift",hueShift:30,saturation:0,lightness:0};case"bulge":return{...e,type:"bulge"};case"swirl":return{...e,type:"swirl",direction:1}}}const Ti=t=>({interactiveEffects:[],interactiveCursorPos:null,interactiveCursorActive:!1,addInteractiveEffect:n=>{const e=Ri(n,re());t(o=>({interactiveEffects:[e,...o.interactiveEffects]}))},removeInteractiveEffect:n=>t(e=>({interactiveEffects:e.interactiveEffects.filter(o=>o.id!==n)})),toggleInteractiveEffect:n=>t(e=>({interactiveEffects:e.interactiveEffects.map(o=>o.id===n?{...o,enabled:!o.enabled}:o)})),updateInteractiveEffect:(n,e)=>t(o=>({interactiveEffects:o.interactiveEffects.map(r=>r.id===n?{...r,...e}:r)})),setInteractiveCursorPos:n=>t({interactiveCursorPos:n}),setInteractiveCursorActive:n=>t({interactiveCursorActive:n,...n?{}:{interactiveCursorPos:null}})}),q=yo()(wo((t,n,e)=>({...Ii(t,n),...Li(t),...Ai(t,n),...br(t,n),...Ti(t),exportScene:()=>{const{grid:o,topology:r,colorInterpolation:i,fixEdges:s,aspectRatio:a,effects:l,colorCorrection:c,backgroundColor:u,animation:d,isAnimationMode:f,interactiveEffects:p}=n();let h=null;return d&&(h={...d,currentTime:0,playbackState:"stopped"}),{version:10,grid:o,topology:r,colorInterpolation:i,fixEdges:s,aspectRatio:a,effects:l,colorCorrection:c,backgroundColor:u,animation:h,isAnimationMode:f,interactiveEffects:p}},importScene:o=>{if(![1,2,3,4,5,6,7,8,9,10].includes(o.version)){console.warn("Unknown scene version:",o.version);return}let r=n().backgroundColor;if(o.backgroundColor!==void 0){const s=o.backgroundColor;s===null?r=null:"mode"in s?r=s:"r"in s&&"g"in s&&"b"in s&&(r=Co(s))}let i=null;o.animation&&(i={...o.animation,currentTime:0,playbackState:"stopped"}),t({grid:o.grid,topology:o.topology??"rectangle",colorInterpolation:o.colorInterpolation,fixEdges:o.fixEdges,aspectRatio:o.aspectRatio,effects:o.effects??n().effects,colorCorrection:o.colorCorrection??{...St},backgroundColor:r,selectedTextId:null,selection:{pointIds:[],handleType:null},viewport:{zoom:1,panX:0,panY:0},zoomMode:"fit",animation:i,isAnimationMode:o.isAnimationMode??!1,interactiveEffects:o.interactiveEffects??(o.interactiveEffect?[o.interactiveEffect]:[]),interactiveCursorPos:null,interactiveCursorActive:!1})}}),{partialize:t=>({grid:t.grid,topology:t.topology,colorInterpolation:t.colorInterpolation,fixEdges:t.fixEdges,aspectRatio:t.aspectRatio,effects:t.effects,colorCorrection:t.colorCorrection,animation:t.animation?{id:t.animation.id,name:t.animation.name,mode:t.animation.mode,settings:t.animation.settings,keyframes:t.animation.keyframes,selectedKeyframeIds:t.animation.selectedKeyframeIds,trackedPoints:t.animation.trackedPoints,proceduralConfig:t.animation.proceduralConfig,baseSnapshot:t.animation.baseSnapshot}:null,isAnimationMode:t.isAnimationMode,interactiveEffects:t.interactiveEffects}),limit:100,handleSet:t=>{let n=0,e=null;return(o,r)=>{const i=Date.now();e&&(clearTimeout(e),e=null),i-n>=300?(n=i,t(o,r)):e=setTimeout(()=>{n=Date.now(),t(o,r)},300)}}}));function kn(t,n,e,o,r){const{topLeft:i,topRight:s,bottomLeft:a,bottomRight:l}=t,c=o??Math.abs(s.position.x-i.position.x)*3,u=r??Math.abs(a.position.y-i.position.y)*3,d=ee(i.position.x,i.position.x+i.handles.handleRight.x*c,s.position.x+s.handles.handleLeft.x*c,s.position.x,n),f=ee(i.position.y,i.position.y+i.handles.handleRight.y*u,s.position.y+s.handles.handleLeft.y*u,s.position.y,n),p=ee(a.position.x,a.position.x+a.handles.handleRight.x*c,l.position.x+l.handles.handleLeft.x*c,l.position.x,n),h=ee(a.position.y,a.position.y+a.handles.handleRight.y*u,l.position.y+l.handles.handleLeft.y*u,l.position.y,n),m=ee(i.position.x,i.position.x+i.handles.handleDown.x*c,a.position.x+a.handles.handleUp.x*c,a.position.x,e),x=ee(i.position.y,i.position.y+i.handles.handleDown.y*u,a.position.y+a.handles.handleUp.y*u,a.position.y,e),y=ee(s.position.x,s.position.x+s.handles.handleDown.x*c,l.position.x+l.handles.handleUp.x*c,l.position.x,e),S=ee(s.position.y,s.position.y+s.handles.handleDown.y*u,l.position.y+l.handles.handleUp.y*u,l.position.y,e),C=(1-n)*(1-e)*i.position.x+n*(1-e)*s.position.x+(1-n)*e*a.position.x+n*e*l.position.x,w=(1-n)*(1-e)*i.position.y+n*(1-e)*s.position.y+(1-n)*e*a.position.y+n*e*l.position.y,k=(1-e)*d+e*p+(1-n)*m+n*y-C,b=(1-e)*f+e*h+(1-n)*x+n*S-w;return{x:k,y:b}}function Bi(t,n,e){const o=t[n]?.[e],r=t[n]?.[e+1],i=t[n+1]?.[e],s=t[n+1]?.[e+1];return!o||!r||!i||!s?null:{row:n,col:e,topLeft:o,topRight:r,bottomLeft:i,bottomRight:s}}function Ui(t,n,e,o){const r=(e+1)%o,i=t[n]?.[e],s=t[n]?.[r],a=t[n+1]?.[e],l=t[n+1]?.[r];return!i||!s||!a||!l?null:{row:n,col:e,topLeft:i,topRight:s,bottomLeft:a,bottomRight:l}}function Mn(t,n){const{topLeft:e,topRight:o,bottomLeft:r,bottomRight:i}=t,s=e.color,a=o.color,l=r.color,c=i.color;switch(n){case"oklab":return{c00:Ze(s),c10:Ze(a),c01:Ze(l),c11:Ze(c)};case"lab":return{c00:He(s),c10:He(a),c01:He(l),c11:He(c)};case"lch":return{c00:Je(s),c10:Je(a),c01:Je(l),c11:Je(c)};case"hsl":return{c00:ae(s),c10:ae(a),c01:ae(l),c11:ae(c)};case"linear":return{c00:De(s),c10:De(a),c01:De(l),c11:De(c)};default:return{c00:s,c10:a,c01:l,c11:c}}}function Pn(t,n){if(n==="lch"){const e=t.c00,o=t.c10,r=t.c01,i=t.c11;return{cosH00:Math.cos(e.h),sinH00:Math.sin(e.h),cosH10:Math.cos(o.h),sinH10:Math.sin(o.h),cosH01:Math.cos(r.h),sinH01:Math.sin(r.h),cosH11:Math.cos(i.h),sinH11:Math.sin(i.h)}}if(n==="hsl"){const e=t.c00,o=t.c10,r=t.c01,i=t.c11,s=2*Math.PI;return{cosH00:Math.cos(e.h*s),sinH00:Math.sin(e.h*s),cosH10:Math.cos(o.h*s),sinH10:Math.sin(o.h*s),cosH01:Math.cos(r.h*s),sinH01:Math.sin(r.h*s),cosH11:Math.cos(i.h*s),sinH11:Math.sin(i.h*s)}}return null}function an(t,n,e,o,r,i,s,a,l){const c=i*n,u=s*e,d=a*o,f=l*r;if(c+u+d+f<1e-4)return 0;const h=c*t.cosH00+u*t.cosH10+d*t.cosH01+f*t.cosH11,m=c*t.sinH00+u*t.sinH10+d*t.sinH01+f*t.sinH11;let x=Math.atan2(m,h);return x<0&&(x+=2*Math.PI),x}function Dn(t,n,e,o,r,i,s,a,l){switch(l){case"oklab":{const c=e.c00,u=e.c10,d=e.c01,f=e.c11,p=Ao({L:r*c.L+i*u.L+s*d.L+a*f.L,a:r*c.a+i*u.a+s*d.a+a*f.a,b:r*c.b+i*u.b+s*d.b+a*f.b,alpha:r*c.alpha+i*u.alpha+s*d.alpha+a*f.alpha});t[n]=p.r,t[n+1]=p.g,t[n+2]=p.b,t[n+3]=p.a;return}case"lab":{const c=e.c00,u=e.c10,d=e.c01,f=e.c11,p=xn({L:r*c.L+i*u.L+s*d.L+a*f.L,a:r*c.a+i*u.a+s*d.a+a*f.a,b:r*c.b+i*u.b+s*d.b+a*f.b,alpha:r*c.alpha+i*u.alpha+s*d.alpha+a*f.alpha});t[n]=p.r,t[n+1]=p.g,t[n+2]=p.b,t[n+3]=p.a;return}case"lch":{const c=e.c00,u=e.c10,d=e.c01,f=e.c11,p=an(o,c.C,u.C,d.C,f.C,r,i,s,a),h=zo({L:r*c.L+i*u.L+s*d.L+a*f.L,C:r*c.C+i*u.C+s*d.C+a*f.C,h:p,alpha:r*c.alpha+i*u.alpha+s*d.alpha+a*f.alpha});t[n]=h.r,t[n+1]=h.g,t[n+2]=h.b,t[n+3]=h.a;return}case"hsl":{const c=e.c00,u=e.c10,d=e.c01,f=e.c11;let h=an(o,c.s,u.s,d.s,f.s,r,i,s,a)/(2*Math.PI);h<0&&(h+=1);const m=Le({h,s:r*c.s+i*u.s+s*d.s+a*f.s,l:r*c.l+i*u.l+s*d.l+a*f.l,alpha:r*c.alpha+i*u.alpha+s*d.alpha+a*f.alpha});t[n]=m.r,t[n+1]=m.g,t[n+2]=m.b,t[n+3]=m.a;return}case"linear":{const c=e.c00,u=e.c10,d=e.c01,f=e.c11,p=dt(It({r:r*c.r+i*u.r+s*d.r+a*f.r,g:r*c.g+i*u.g+s*d.g+a*f.g,b:r*c.b+i*u.b+s*d.b+a*f.b,a:r*c.a+i*u.a+s*d.a+a*f.a}));t[n]=p.r,t[n+1]=p.g,t[n+2]=p.b,t[n+3]=p.a;return}default:{const c=e.c00,u=e.c10,d=e.c01,f=e.c11,p=r*c.r+i*u.r+s*d.r+a*f.r,h=r*c.g+i*u.g+s*d.g+a*f.g,m=r*c.b+i*u.b+s*d.b+a*f.b,x=r*c.a+i*u.a+s*d.a+a*f.a;t[n]=Math.max(0,Math.min(1,p)),t[n+1]=Math.max(0,Math.min(1,h)),t[n+2]=Math.max(0,Math.min(1,m)),t[n+3]=Math.max(0,Math.min(1,x));return}}}function Fs(t,n,e,o="rectangle"){if(o==="circle")return zi(t,n,e);const{rows:r,cols:i,width:s,height:a}=t,l=r-1,c=i-1,u=n*c,d=n*l,f=(u+1)*(d+1),p=u*d*6,h=new Float32Array(f*3),m=new Float32Array(f*4),x=new Uint32Array(p),y=l*c,S=new Array(y),C=new Array(y),w=new Array(y).fill(null);for(let z=0;z<l;z++)for(let F=0;F<c;F++){const D=z*c+F,A=Bi(t.points,z,F);if(A){S[D]=A;const B=Mn(A,e);C[D]=B,w[D]=Pn(B,e)}else S[D]=null,C[D]=null,w[D]=null}const k=1/u,b=1/d;let M=0;for(let z=0;z<=d;z++){const F=z*b,D=F*l;let A=D|0;A>=l&&(A=l-1);const B=D-A;for(let $=0;$<=u;$++){const K=$*k,G=K*c;let N=G|0;N>=c&&(N=c-1);const Y=G-N,P=A*c+N,E=S[P],T=M*3,R=M*4;if(E){const V=kn(E,Y,B,s,a);h[T]=V.x,h[T+1]=V.y,h[T+2]=0;const j=(1-Y)*(1-B),X=Y*(1-B),J=(1-Y)*B,se=Y*B;Dn(m,R,C[P],w[P]??null,j,X,J,se,e)}else h[T]=K*s,h[T+1]=F*a,h[T+2]=0,m[R]=.5,m[R+1]=.5,m[R+2]=.5,m[R+3]=1;M++}}const _=u+1;let O=0;for(let z=0;z<d;z++){const F=z*_,D=F+_;for(let A=0;A<u;A++){const B=F+A,$=B+1,K=D+A,G=K+1;x[O]=B,x[O+1]=K,x[O+2]=$,x[O+3]=$,x[O+4]=K,x[O+5]=G,O+=6}}return{positions:h,colors:m,indices:x,vertexCount:f,indexCount:p}}function zi(t,n,e){const{rows:o,cols:r,width:i,height:s}=t,a=o-1,l=r,c=n*a,u=n*l,d=(c+1)*(u+1),f=c*u*6,p=new Float32Array(d*3),h=new Float32Array(d*4),m=new Uint32Array(f),x=a*l,y=new Array(x),S=new Array(x),C=new Array(x);for(let O=0;O<a;O++)for(let z=0;z<l;z++){const F=O*l+z,D=Ui(t.points,O,z,r);if(D){y[F]=D;const A=Mn(D,e);S[F]=A,C[F]=Pn(A,e)}else y[F]=null,S[F]=null,C[F]=null}const w=1/c,k=1/u;let b=0;for(let O=0;O<=c;O++){const F=O*w*a;let D=F|0;D>=a&&(D=a-1);const A=F-D;for(let B=0;B<=u;B++){const K=B*k*l;let G=K|0,N;B===u?(G=l-1,N=1):(G>=l&&(G=0),N=K-(K|0));const Y=D*l+G,P=y[Y],E=b*3,T=b*4;if(P){const R=kn(P,N,A,i,s);p[E]=R.x,p[E+1]=R.y,p[E+2]=0;const V=(1-N)*(1-A),j=N*(1-A),X=(1-N)*A,J=N*A;Dn(h,T,S[Y],C[Y]??null,V,j,X,J,e)}else p[E]=i/2,p[E+1]=s/2,p[E+2]=0,h[T]=.5,h[T+1]=.5,h[T+2]=.5,h[T+3]=1;b++}}const M=u+1;let _=0;for(let O=0;O<c;O++){const z=O*M,F=z+M;for(let D=0;D<u;D++){const A=z+D,B=A+1,$=F+D,K=$+1;m[_]=A,m[_+1]=$,m[_+2]=B,m[_+3]=B,m[_+4]=$,m[_+5]=K,_+=6}}return{positions:p,colors:h,indices:m,vertexCount:d,indexCount:f}}function Os(){return{positions:new Float32Array(0),colors:new Float32Array(0),indices:new Uint32Array(0),vertexCapacity:0,indexCapacity:0}}function Gs(t,n){if("vertexCount"in t){const{vertexCount:r,indexCount:i}=t;if(r>n.vertexCapacity){const s=Math.ceil(r*1.25);n.positions=new Float32Array(s*3),n.colors=new Float32Array(s*4),n.vertexCapacity=s}if(i>n.indexCapacity){const s=Math.ceil(i*1.25);n.indices=new Uint32Array(s),n.indexCapacity=s}return n.positions.set(t.positions.subarray(0,r*3)),n.colors.set(t.colors.subarray(0,r*4)),n.indices.set(t.indices.subarray(0,i)),{vertexCount:r,indexCount:i}}const e=t.vertices.length,o=t.indices.length;if(e>n.vertexCapacity){const r=Math.ceil(e*1.25);n.positions=new Float32Array(r*3),n.colors=new Float32Array(r*4),n.vertexCapacity=r}if(o>n.indexCapacity){const r=Math.ceil(o*1.25);n.indices=new Uint32Array(r),n.indexCapacity=r}for(let r=0;r<e;r++){const i=t.vertices[r],s=r*3,a=r*4;n.positions[s]=i.position.x,n.positions[s+1]=i.position.y,n.positions[s+2]=0,n.colors[a]=i.color.r,n.colors[a+1]=i.color.g,n.colors[a+2]=i.color.b,n.colors[a+3]=i.color.a}for(let r=0;r<o;r++)n.indices[r]=t.indices[r];return{vertexCount:e,indexCount:o}}const _n={name:"ProgressiveBlurShader",uniforms:{tDiffuse:{value:null},resolution:{value:new Q(1,1)},uLineStart:{value:new Q(.5,0)},uLineEnd:{value:new Q(.5,1)},uStartBlur:{value:0},uEndBlur:{value:20},uDirection:{value:0},uQuality:{value:1}},vertexShader:`
    varying vec2 vUv;

    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,fragmentShader:`
    uniform sampler2D tDiffuse;
    uniform vec2 resolution;
    uniform vec2 uLineStart;
    uniform vec2 uLineEnd;
    uniform float uStartBlur;
    uniform float uEndBlur;
    uniform float uDirection;
    uniform float uQuality;

    varying vec2 vUv;

    float getBlurRadius(vec2 uv) {
      vec2 lineVec = uLineEnd - uLineStart;
      float lineLengthSq = dot(lineVec, lineVec);

      // If line is essentially a point, return start blur
      if (lineLengthSq < 0.0001) return uStartBlur;

      // Project point onto line segment
      vec2 pointVec = uv - uLineStart;
      float t = clamp(dot(pointVec, lineVec) / lineLengthSq, 0.0, 1.0);

      // Interpolate blur radius
      return mix(uStartBlur, uEndBlur, t);
    }

    float gaussian(float x, float sigma) {
      return exp(-(x * x) / (2.0 * sigma * sigma));
    }

    void main() {
      vec2 uv = vUv;
      float blurRadius = getBlurRadius(uv);

      // Skip blur if radius is too small
      if (blurRadius < 0.5) {
        gl_FragColor = texture2D(tDiffuse, uv);
        return;
      }

      vec2 pixelSize = 1.0 / resolution;
      vec2 dir = uDirection < 0.5 ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      float sigma = blurRadius / 3.0;

      // Step size to cover full blur radius with max 64 samples
      // For small blur: step=1, sample every pixel
      // For large blur: step=blurRadius/64, sample spread out to cover full radius
      float step = max(1.0, blurRadius / 64.0);

      // Number of samples needed to cover the blur radius
      int samples = int(min(ceil(blurRadius / step) * uQuality, 64.0));

      vec4 color = vec4(0.0);
      float weightSum = 0.0;

      // Center sample
      float centerWeight = gaussian(0.0, sigma);
      color += texture2D(tDiffuse, uv) * centerWeight;
      weightSum += centerWeight;

      // Symmetric samples with variable step size
      for (int i = 1; i <= 64; i++) {
        if (i > samples) break;

        float offset = float(i) * step;
        float weight = gaussian(offset, sigma);
        vec2 offsetVec = dir * pixelSize * offset;

        color += texture2D(tDiffuse, uv + offsetVec) * weight;
        color += texture2D(tDiffuse, uv - offsetVec) * weight;
        weightSum += weight * 2.0;
      }

      gl_FragColor = color / weightSum;
    }
  `},ji={name:"ColorCorrectionShader",uniforms:{tDiffuse:{value:null},exposure:{value:0},contrast:{value:0},hue:{value:0},saturation:{value:0},lightness:{value:0}},vertexShader:`
    varying vec2 vUv;

    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,fragmentShader:`
    uniform sampler2D tDiffuse;
    uniform float exposure;
    uniform float contrast;
    uniform float hue;
    uniform float saturation;
    uniform float lightness;

    varying vec2 vUv;

    // RGB to HSL conversion
    vec3 rgb2hsl(vec3 c) {
      float maxC = max(max(c.r, c.g), c.b);
      float minC = min(min(c.r, c.g), c.b);
      float l = (maxC + minC) / 2.0;

      if (maxC == minC) {
        return vec3(0.0, 0.0, l);
      }

      float d = maxC - minC;
      float s = l > 0.5 ? d / (2.0 - maxC - minC) : d / (maxC + minC);

      float h;
      if (maxC == c.r) {
        h = (c.g - c.b) / d + (c.g < c.b ? 6.0 : 0.0);
      } else if (maxC == c.g) {
        h = (c.b - c.r) / d + 2.0;
      } else {
        h = (c.r - c.g) / d + 4.0;
      }
      h /= 6.0;

      return vec3(h, s, l);
    }

    float hue2rgb(float p, float q, float t) {
      if (t < 0.0) t += 1.0;
      if (t > 1.0) t -= 1.0;
      if (t < 1.0 / 6.0) return p + (q - p) * 6.0 * t;
      if (t < 1.0 / 2.0) return q;
      if (t < 2.0 / 3.0) return p + (q - p) * (2.0 / 3.0 - t) * 6.0;
      return p;
    }

    vec3 hsl2rgb(vec3 c) {
      float h = c.x;
      float s = c.y;
      float l = c.z;

      if (s == 0.0) {
        return vec3(l);
      }

      float q = l < 0.5 ? l * (1.0 + s) : l + s - l * s;
      float p = 2.0 * l - q;

      float r = hue2rgb(p, q, h + 1.0 / 3.0);
      float g = hue2rgb(p, q, h);
      float b = hue2rgb(p, q, h - 1.0 / 3.0);

      return vec3(r, g, b);
    }

    void main() {
      vec4 texel = texture2D(tDiffuse, vUv);

      // 1. Exposure (exponential)
      float exposureMultiplier = pow(2.0, exposure);
      vec3 result = texel.rgb * exposureMultiplier;

      // 2. Contrast (around midpoint 0.5)
      float contrastFactor = 1.0 + contrast;
      result = (result - 0.5) * contrastFactor + 0.5;
      result = clamp(result, 0.0, 1.0);

      // 3. Hue / Saturation / Lightness (in HSL space)
      vec3 hsl = rgb2hsl(result);
      hsl.x = mod(hsl.x + hue / 360.0, 1.0);
      hsl.y = clamp(hsl.y + saturation, 0.0, 1.0);
      hsl.z = clamp(hsl.z + lightness, 0.0, 1.0);
      result = hsl2rgb(hsl);

      gl_FragColor = vec4(result, texel.a);
    }
  `},Ni={name:"ChromaticAberrationShader",uniforms:{tDiffuse:{value:null},offset:{value:.005}},vertexShader:`
    varying vec2 vUv;

    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,fragmentShader:`
    uniform sampler2D tDiffuse;
    uniform float offset;

    varying vec2 vUv;

    void main() {
      vec2 dir = vUv - vec2(0.5);
      float dist = length(dir);

      // Early exit for center region
      if (dist < 0.01) {
        gl_FragColor = texture2D(tDiffuse, vUv);
        return;
      }

      vec2 normalizedDir = normalize(dir);
      vec2 offsetDir = normalizedDir * offset * dist;

      // Classic chromatic aberration with multiple samples per channel
      // This creates visible color fringing like a prism
      const int samplesPerChannel = 8;

      float r = 0.0;
      float g = 0.0;
      float b = 0.0;
      float totalWeight = 0.0;

      // Sample RED channel (shifted outward most)
      for (int i = 0; i < samplesPerChannel; i++) {
        float t = float(i) / float(samplesPerChannel - 1); // 0 to 1
        float scale = 0.5 + t * 1.0; // 0.5 to 1.5 (red goes outward)
        vec2 uvR = vUv + offsetDir * scale;
        float weight = 1.0 - abs(t - 0.5) * 0.5; // Peak in middle
        r += texture2D(tDiffuse, uvR).r * weight;
        totalWeight += weight;
      }
      r /= totalWeight;

      // Sample GREEN channel (middle position)
      totalWeight = 0.0;
      for (int i = 0; i < samplesPerChannel; i++) {
        float t = float(i) / float(samplesPerChannel - 1); // 0 to 1
        float scale = 0.0 + t * 1.0; // 0.0 to 1.0 (green in middle)
        vec2 uvG = vUv + offsetDir * scale;
        float weight = 1.0 - abs(t - 0.5) * 0.5;
        g += texture2D(tDiffuse, uvG).g * weight;
        totalWeight += weight;
      }
      g /= totalWeight;

      // Sample BLUE channel (shifted inward most)
      totalWeight = 0.0;
      for (int i = 0; i < samplesPerChannel; i++) {
        float t = float(i) / float(samplesPerChannel - 1); // 0 to 1
        float scale = -0.5 + t * 1.0; // -0.5 to 0.5 (blue goes inward)
        vec2 uvB = vUv + offsetDir * scale;
        float weight = 1.0 - abs(t - 0.5) * 0.5;
        b += texture2D(tDiffuse, uvB).b * weight;
        totalWeight += weight;
      }
      b /= totalWeight;

      // Combine channels
      vec3 color = vec3(r, g, b);

      // Preserve alpha
      float a = texture2D(tDiffuse, vUv).a;

      gl_FragColor = vec4(color, a);
    }
  `},Hi={name:"FilmGrainShader",uniforms:{tDiffuse:{value:null},time:{value:0},intensity:{value:.5},size:{value:1},resolution:{value:null}},vertexShader:`
    varying vec2 vUv;

    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,fragmentShader:`
    uniform sampler2D tDiffuse;
    uniform float time;
    uniform float intensity;
    uniform float size;
    uniform vec2 resolution;

    varying vec2 vUv;

    // Permutation polynomial
    vec4 permute(vec4 x) {
      return mod(((x * 34.0) + 1.0) * x, 289.0);
    }

    vec4 taylorInvSqrt(vec4 r) {
      return 1.79284291400159 - 0.85373472095314 * r;
    }

    // 3D Simplex noise
    float snoise(vec3 v) {
      const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
      const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

      vec3 i = floor(v + dot(v, C.yyy));
      vec3 x0 = v - i + dot(i, C.xxx);

      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min(g.xyz, l.zxy);
      vec3 i2 = max(g.xyz, l.zxy);

      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy;
      vec3 x3 = x0 - D.yyy;

      i = mod(i, 289.0);
      vec4 p = permute(permute(permute(
        i.z + vec4(0.0, i1.z, i2.z, 1.0))
        + i.y + vec4(0.0, i1.y, i2.y, 1.0))
        + i.x + vec4(0.0, i1.x, i2.x, 1.0));

      float n_ = 1.0 / 7.0;
      vec3 ns = n_ * D.wyz - D.xzx;

      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_);

      vec4 x = x_ * ns.x + ns.yyyy;
      vec4 y = y_ * ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);

      vec4 b0 = vec4(x.xy, y.xy);
      vec4 b1 = vec4(x.zw, y.zw);

      vec4 s0 = floor(b0) * 2.0 + 1.0;
      vec4 s1 = floor(b1) * 2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));

      vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
      vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

      vec3 p0 = vec3(a0.xy, h.x);
      vec3 p1 = vec3(a0.zw, h.y);
      vec3 p2 = vec3(a1.xy, h.z);
      vec3 p3 = vec3(a1.zw, h.w);

      vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;

      vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
      m = m * m;
      return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
    }

    // Soft light blend mode
    vec3 blendSoftLight(vec3 base, vec3 blend) {
      return mix(
        sqrt(base) * (2.0 * blend - 1.0) + 2.0 * base * (1.0 - blend),
        2.0 * base * blend + base * base * (1.0 - 2.0 * blend),
        step(base, vec3(0.5))
      );
    }

    // Luminance calculation
    float luma(vec3 color) {
      return dot(color, vec3(0.299, 0.587, 0.114));
    }

    // Generate film grain
    float grain(vec2 texCoord, float grainSize, float frame) {
      vec2 mult = texCoord * resolution / grainSize;
      float offset = snoise(vec3(mult / 2.0, frame));
      float n = snoise(vec3(mult, offset));
      return n * 0.5 + 0.5;
    }

    void main() {
      vec4 texel = texture2D(tDiffuse, vUv);

      // Generate grain
      float grainSize = max(size, 0.1);
      float g = grain(vUv, grainSize, time * 0.5);
      vec3 grainColor = vec3(g);

      // Blend grain with soft light
      vec3 blended = blendSoftLight(texel.rgb, grainColor);

      // Get luminance and reduce grain in bright areas
      float luminance = luma(texel.rgb);
      float response = smoothstep(0.05, 0.5, luminance);

      // Mix based on intensity and luminance response
      vec3 result = mix(texel.rgb, blended, intensity * (1.0 - pow(response, 2.0) * 0.5));

      gl_FragColor = vec4(result, texel.a);
    }
  `},Fi={name:"ExposureContrastShader",uniforms:{tDiffuse:{value:null},exposure:{value:0},contrast:{value:0}},vertexShader:`
    varying vec2 vUv;

    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,fragmentShader:`
    uniform sampler2D tDiffuse;
    uniform float exposure;
    uniform float contrast;

    varying vec2 vUv;

    void main() {
      vec4 texel = texture2D(tDiffuse, vUv);

      // Apply exposure (multiplicative, using power for natural feel)
      // exposure range -2 to 2 maps to multiplier ~0.25 to ~4
      float exposureMultiplier = pow(2.0, exposure);
      vec3 result = texel.rgb * exposureMultiplier;

      // Apply contrast around midpoint (0.5)
      // contrast range -1 to 1
      float contrastFactor = 1.0 + contrast;
      result = (result - 0.5) * contrastFactor + 0.5;

      // Clamp to valid range
      result = clamp(result, 0.0, 1.0);

      gl_FragColor = vec4(result, texel.a);
    }
  `},Oi={name:"HalftoneShader",uniforms:{tDiffuse:{value:null},shape:{value:1},radius:{value:4},rotateR:{value:Math.PI/12*1},rotateG:{value:Math.PI/12*2},rotateB:{value:Math.PI/12*3},scatter:{value:0},width:{value:1},height:{value:1},blending:{value:1},blendingMode:{value:1},greyscale:{value:!1}},vertexShader:`
    varying vec2 vUV;

    void main() {
      vUV = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,fragmentShader:`
    #define SQRT2_MINUS_ONE 0.41421356
    #define SQRT2_HALF_MINUS_ONE 0.20710678
    #define PI2 6.28318531
    #define SHAPE_DOT 1
    #define SHAPE_ELLIPSE 2
    #define SHAPE_LINE 3
    #define SHAPE_SQUARE 4
    #define BLENDING_LINEAR 1
    #define BLENDING_MULTIPLY 2
    #define BLENDING_ADD 3
    #define BLENDING_LIGHTER 4
    #define BLENDING_DARKER 5

    uniform sampler2D tDiffuse;
    uniform float radius;
    uniform float rotateR;
    uniform float rotateG;
    uniform float rotateB;
    uniform float scatter;
    uniform float width;
    uniform float height;
    uniform int shape;
    uniform float blending;
    uniform int blendingMode;
    uniform bool greyscale;

    varying vec2 vUV;

    const int samples = 8;

    float blend(float a, float b, float t) {
      return a * (1.0 - t) + b * t;
    }

    float hypot(float x, float y) {
      return sqrt(x * x + y * y);
    }

    float rand(vec2 seed) {
      return fract(sin(dot(seed.xy, vec2(12.9898, 78.233))) * 43758.5453);
    }

    float distanceToDotRadius(float channel, vec2 coord, vec2 normal, vec2 p, float angle, float rad_max) {
      float dist = hypot(coord.x - p.x, coord.y - p.y);
      float rad = channel;

      if (shape == SHAPE_DOT) {
        rad = pow(abs(rad), 1.125) * rad_max;
      } else if (shape == SHAPE_ELLIPSE) {
        rad = pow(abs(rad), 1.125) * rad_max;
        if (dist != 0.0) {
          float dot_p = abs((p.x - coord.x) / dist * normal.x + (p.y - coord.y) / dist * normal.y);
          dist = (dist * (1.0 - SQRT2_HALF_MINUS_ONE)) + dot_p * dist * SQRT2_MINUS_ONE;
        }
      } else if (shape == SHAPE_LINE) {
        rad = pow(abs(rad), 1.5) * rad_max;
        float dot_p = (p.x - coord.x) * normal.x + (p.y - coord.y) * normal.y;
        dist = hypot(normal.x * dot_p, normal.y * dot_p);
      } else if (shape == SHAPE_SQUARE) {
        float theta = atan(p.y - coord.y, p.x - coord.x) - angle;
        float sin_t = abs(sin(theta));
        float cos_t = abs(cos(theta));
        rad = pow(abs(rad), 1.4);
        rad = rad_max * (rad + ((sin_t > cos_t) ? rad - sin_t * rad : rad - cos_t * rad));
      }

      return rad - dist;
    }

    struct Cell {
      vec2 normal;
      vec2 p1;
      vec2 p2;
      vec2 p3;
      vec2 p4;
      float samp2;
      float samp1;
      float samp3;
      float samp4;
    };

    vec4 getSample(vec2 point) {
      vec4 tex = texture2D(tDiffuse, vec2(point.x / width, point.y / height));
      float base = rand(vec2(floor(point.x), floor(point.y))) * PI2;
      float step = PI2 / float(samples);
      float dist = radius * 0.66;

      for (int i = 0; i < samples; ++i) {
        float r = base + step * float(i);
        vec2 coord = point + vec2(cos(r) * dist, sin(r) * dist);
        tex += texture2D(tDiffuse, vec2(coord.x / width, coord.y / height));
      }

      tex /= float(samples) + 1.0;
      return tex;
    }

    float getDotColour(Cell c, vec2 p, int channel, float angle, float aa) {
      float dist_c_1, dist_c_2, dist_c_3, dist_c_4, res;

      if (channel == 0) {
        c.samp1 = getSample(c.p1).r;
        c.samp2 = getSample(c.p2).r;
        c.samp3 = getSample(c.p3).r;
        c.samp4 = getSample(c.p4).r;
      } else if (channel == 1) {
        c.samp1 = getSample(c.p1).g;
        c.samp2 = getSample(c.p2).g;
        c.samp3 = getSample(c.p3).g;
        c.samp4 = getSample(c.p4).g;
      } else {
        c.samp1 = getSample(c.p1).b;
        c.samp3 = getSample(c.p3).b;
        c.samp2 = getSample(c.p2).b;
        c.samp4 = getSample(c.p4).b;
      }

      dist_c_1 = distanceToDotRadius(c.samp1, c.p1, c.normal, p, angle, radius);
      dist_c_2 = distanceToDotRadius(c.samp2, c.p2, c.normal, p, angle, radius);
      dist_c_3 = distanceToDotRadius(c.samp3, c.p3, c.normal, p, angle, radius);
      dist_c_4 = distanceToDotRadius(c.samp4, c.p4, c.normal, p, angle, radius);

      res = (dist_c_1 > 0.0) ? clamp(dist_c_1 / aa, 0.0, 1.0) : 0.0;
      res += (dist_c_2 > 0.0) ? clamp(dist_c_2 / aa, 0.0, 1.0) : 0.0;
      res += (dist_c_3 > 0.0) ? clamp(dist_c_3 / aa, 0.0, 1.0) : 0.0;
      res += (dist_c_4 > 0.0) ? clamp(dist_c_4 / aa, 0.0, 1.0) : 0.0;
      res = clamp(res, 0.0, 1.0);

      return res;
    }

    Cell getReferenceCell(vec2 p, vec2 origin, float grid_angle, float step) {
      Cell c;

      vec2 n = vec2(cos(grid_angle), sin(grid_angle));
      float threshold = step * 0.5;
      float dot_normal = n.x * (p.x - origin.x) + n.y * (p.y - origin.y);
      float dot_line = -n.y * (p.x - origin.x) + n.x * (p.y - origin.y);
      vec2 offset = vec2(n.x * dot_normal, n.y * dot_normal);
      float offset_normal = mod(hypot(offset.x, offset.y), step);
      float normal_dir = (dot_normal < 0.0) ? 1.0 : -1.0;
      float normal_scale = ((offset_normal < threshold) ? -offset_normal : step - offset_normal) * normal_dir;
      float offset_line = mod(hypot((p.x - offset.x) - origin.x, (p.y - offset.y) - origin.y), step);
      float line_dir = (dot_line < 0.0) ? 1.0 : -1.0;
      float line_scale = ((offset_line < threshold) ? -offset_line : step - offset_line) * line_dir;

      c.normal = n;
      c.p1.x = p.x - n.x * normal_scale + n.y * line_scale;
      c.p1.y = p.y - n.y * normal_scale - n.x * line_scale;

      if (scatter != 0.0) {
        float off_mag = scatter * threshold * 0.5;
        float off_angle = rand(vec2(floor(c.p1.x), floor(c.p1.y))) * PI2;
        c.p1.x += cos(off_angle) * off_mag;
        c.p1.y += sin(off_angle) * off_mag;
      }

      float normal_step = normal_dir * ((offset_normal < threshold) ? step : -step);
      float line_step = line_dir * ((offset_line < threshold) ? step : -step);
      c.p2.x = c.p1.x - n.x * normal_step;
      c.p2.y = c.p1.y - n.y * normal_step;
      c.p3.x = c.p1.x + n.y * line_step;
      c.p3.y = c.p1.y - n.x * line_step;
      c.p4.x = c.p1.x - n.x * normal_step + n.y * line_step;
      c.p4.y = c.p1.y - n.y * normal_step - n.x * line_step;

      return c;
    }

    float blendColour(float a, float b, float t) {
      if (blendingMode == BLENDING_LINEAR) {
        return blend(a, b, 1.0 - t);
      } else if (blendingMode == BLENDING_ADD) {
        return blend(a, min(1.0, a + b), t);
      } else if (blendingMode == BLENDING_MULTIPLY) {
        return blend(a, max(0.0, a * b), t);
      } else if (blendingMode == BLENDING_LIGHTER) {
        return blend(a, max(a, b), t);
      } else if (blendingMode == BLENDING_DARKER) {
        return blend(a, min(a, b), t);
      } else {
        return blend(a, b, 1.0 - t);
      }
    }

    void main() {
      vec2 p = vec2(vUV.x * width, vUV.y * height);
      vec2 origin = vec2(0, 0);
      float aa = (radius < 2.5) ? radius * 0.5 : 1.25;

      Cell cell_r = getReferenceCell(p, origin, rotateR, radius);
      Cell cell_g = getReferenceCell(p, origin, rotateG, radius);
      Cell cell_b = getReferenceCell(p, origin, rotateB, radius);

      float r = getDotColour(cell_r, p, 0, rotateR, aa);
      float g = getDotColour(cell_g, p, 1, rotateG, aa);
      float b = getDotColour(cell_b, p, 2, rotateB, aa);

      vec4 colour = texture2D(tDiffuse, vUV);
      r = blendColour(r, colour.r, blending);
      g = blendColour(g, colour.g, blending);
      b = blendColour(b, colour.b, blending);

      if (greyscale) {
        r = g = b = (r + b + g) / 3.0;
      }

      gl_FragColor = vec4(r, g, b, colour.a);
    }
  `},Gi={name:"HueSaturationShader",uniforms:{tDiffuse:{value:null},hue:{value:0},saturation:{value:0},lightness:{value:0}},vertexShader:`
    varying vec2 vUv;

    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,fragmentShader:`
    uniform sampler2D tDiffuse;
    uniform float hue;
    uniform float saturation;
    uniform float lightness;

    varying vec2 vUv;

    // RGB to HSL conversion
    vec3 rgb2hsl(vec3 c) {
      float maxC = max(max(c.r, c.g), c.b);
      float minC = min(min(c.r, c.g), c.b);
      float l = (maxC + minC) / 2.0;

      if (maxC == minC) {
        return vec3(0.0, 0.0, l);
      }

      float d = maxC - minC;
      float s = l > 0.5 ? d / (2.0 - maxC - minC) : d / (maxC + minC);

      float h;
      if (maxC == c.r) {
        h = (c.g - c.b) / d + (c.g < c.b ? 6.0 : 0.0);
      } else if (maxC == c.g) {
        h = (c.b - c.r) / d + 2.0;
      } else {
        h = (c.r - c.g) / d + 4.0;
      }
      h /= 6.0;

      return vec3(h, s, l);
    }

    // Helper function for HSL to RGB
    float hue2rgb(float p, float q, float t) {
      if (t < 0.0) t += 1.0;
      if (t > 1.0) t -= 1.0;
      if (t < 1.0 / 6.0) return p + (q - p) * 6.0 * t;
      if (t < 1.0 / 2.0) return q;
      if (t < 2.0 / 3.0) return p + (q - p) * (2.0 / 3.0 - t) * 6.0;
      return p;
    }

    // HSL to RGB conversion
    vec3 hsl2rgb(vec3 c) {
      float h = c.x;
      float s = c.y;
      float l = c.z;

      if (s == 0.0) {
        return vec3(l);
      }

      float q = l < 0.5 ? l * (1.0 + s) : l + s - l * s;
      float p = 2.0 * l - q;

      float r = hue2rgb(p, q, h + 1.0 / 3.0);
      float g = hue2rgb(p, q, h);
      float b = hue2rgb(p, q, h - 1.0 / 3.0);

      return vec3(r, g, b);
    }

    void main() {
      vec4 texel = texture2D(tDiffuse, vUv);

      // Convert to HSL
      vec3 hsl = rgb2hsl(texel.rgb);

      // Apply hue shift (normalize from degrees to 0-1)
      hsl.x = mod(hsl.x + hue / 360.0, 1.0);

      // Apply saturation adjustment
      hsl.y = clamp(hsl.y + saturation, 0.0, 1.0);

      // Apply lightness adjustment
      hsl.z = clamp(hsl.z + lightness, 0.0, 1.0);

      // Convert back to RGB
      vec3 rgb = hsl2rgb(hsl);

      gl_FragColor = vec4(rgb, texel.a);
    }
  `},Vi={name:"ColorBalanceShader",uniforms:{tDiffuse:{value:null},cyanRed:{value:0},magentaGreen:{value:0},yellowBlue:{value:0}},vertexShader:`
    varying vec2 vUv;

    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,fragmentShader:`
    uniform sampler2D tDiffuse;
    uniform float cyanRed;
    uniform float magentaGreen;
    uniform float yellowBlue;

    varying vec2 vUv;

    void main() {
      vec4 texel = texture2D(tDiffuse, vUv);

      // Apply color balance adjustments
      vec3 result = texel.rgb;

      // Cyan-Red: positive = more red, negative = more cyan
      result.r += cyanRed * 0.5;
      result.g -= cyanRed * 0.25;
      result.b -= cyanRed * 0.25;

      // Magenta-Green: positive = more green, negative = more magenta
      result.r -= magentaGreen * 0.25;
      result.g += magentaGreen * 0.5;
      result.b -= magentaGreen * 0.25;

      // Yellow-Blue: positive = more blue, negative = more yellow
      result.r -= yellowBlue * 0.25;
      result.g -= yellowBlue * 0.25;
      result.b += yellowBlue * 0.5;

      // Clamp to valid range
      result = clamp(result, 0.0, 1.0);

      gl_FragColor = vec4(result, texel.a);
    }
  `},$i={name:"GlassDistortionShader",uniforms:{tDiffuse:{value:null},resolution:{value:new Q(1,1)},uShape:{value:0},uCells:{value:15},uDistortion:{value:30},uAngle:{value:0},uAberration:{value:0},uEdge:{value:.5},uIOR:{value:1.5},uFresnel:{value:.5},uFrost:{value:0},uBevel:{value:.15},uCornerRadius:{value:.15}},vertexShader:`
    varying vec2 vUv;

    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,fragmentShader:`
    uniform sampler2D tDiffuse;
    uniform vec2 resolution;
    uniform int uShape;
    uniform float uCells;
    uniform float uDistortion;
    uniform float uAngle;
    uniform float uAberration;
    uniform float uEdge;
    uniform float uIOR;
    uniform float uFresnel;
    uniform float uFrost;
    uniform float uBevel;
    uniform float uCornerRadius;

    varying vec2 vUv;

    #define PI 3.14159265359
    #define SQRT3 1.732050808

    // Rotate a 2D vector by an angle
    vec2 rotate(vec2 v, float angle) {
      float c = cos(angle);
      float s = sin(angle);
      return vec2(v.x * c - v.y * s, v.x * s + v.y * c);
    }

    // Simple hash for pseudo-random values
    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }

    // ===== SHAPE PATTERN FUNCTIONS =====
    // Returns: vec4(normalX, normalY, edgeDistance, cellVariation)
    // normalX, normalY: simulated surface normal (curved glass)
    // edgeDistance: 0 at edge, 1 at center

    // Box distance for square cells
    float boxDist(vec2 p) {
      return max(abs(p.x), abs(p.y));
    }

    // Rounded box distance - creates smooth corners
    // Returns normalized distance: 0 at center, 1 at edge
    float roundedBoxDist(vec2 p, float radius) {
      // p is in range -0.5 to 0.5
      // Calculate distance to rounded rectangle edge
      vec2 q = abs(p) - (0.5 - radius);
      float dist = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0);
      // Normalize: dist is now distance from edge (negative inside, positive outside)
      // Convert to 0-1 range where 0 is edge, 1 is center
      return 1.0 - smoothstep(-0.5, 0.0, dist - radius);
    }

    // Strips pattern - curved cylinder glass
    // Note: UV is already aspect-corrected before being passed here
    vec4 patternStrips(vec2 uv, float cells) {
      float stripPos = uv.x * cells;
      float localX = fract(stripPos);

      // Simulate curved surface normal (like a cylinder)
      float t = (localX - 0.5) * 2.0; // -1 to 1
      float normalX = sin(t * PI * 0.5);
      float normalY = 0.0;
      float edgeDist = cos(t * PI * 0.5);

      vec2 cellId = vec2(floor(stripPos), 0.0);
      float variation = hash(cellId) * 0.2 + 0.9;

      return vec4(normalX, normalY, edgeDist, variation);
    }

    // Grid pattern - FLAT square panels with beveled edges and smooth rounded corners
    // Note: UV is already aspect-corrected before being passed here
    vec4 patternGrid(vec2 uv, float cells, float bevelWidth, float cornerRadius) {
      vec2 cellPos = uv * cells;
      vec2 local = fract(cellPos) - 0.5; // -0.5 to 0.5

      // Calculate smooth bulging distance using exponential blending
      float dist;
      vec2 normal2D = vec2(0.0);
      vec2 absLocal = abs(local);

      if (cornerRadius > 0.001) {
        // Smooth maximum using log-exp blend (creates natural bulging)
        // Higher k = sharper corners, lower k = rounder corners
        float k = 1.0 / (cornerRadius * 2.0 + 0.01);

        // Smooth maximum function: smoothly blends between X and Y distances
        // This creates the "pillowed" or "bulging" effect at corners
        float smoothMaxVal = log(exp(k * absLocal.x) + exp(k * absLocal.y)) / k;
        dist = 0.5 - smoothMaxVal;

        // Calculate normal from gradient of smooth distance field
        float eps = 0.005;
        vec2 dxLocal = absLocal + vec2(eps, 0.0);
        vec2 dyLocal = absLocal + vec2(0.0, eps);

        float dxSmooth = log(exp(k * dxLocal.x) + exp(k * dxLocal.y)) / k;
        float dySmooth = log(exp(k * dyLocal.x) + exp(k * dyLocal.y)) / k;

        // Gradient points toward edge (inward), negate to point outward
        vec2 grad = vec2(dxSmooth - smoothMaxVal, dySmooth - smoothMaxVal) / eps;

        // Apply sign to get correct direction
        if (length(grad) > 0.01) {
          normal2D = normalize(grad) * sign(local);
        }
      } else {
        // Sharp corners - standard box distance
        float boxD = max(absLocal.x, absLocal.y);
        dist = 0.5 - boxD;

        // Simple normal for sharp corners
        if (absLocal.x > absLocal.y) {
          normal2D = vec2(sign(local.x), 0.0);
        } else {
          normal2D = vec2(0.0, sign(local.y));
        }
      }

      // Panels (white areas) have refraction ONLY inside the panel boundaries
      // Gaps (black areas) between panels have NO refraction at all

      // If we're outside the panel (dist < 0), no refraction
      if (dist < 0.0) {
        return vec4(0.0, 0.0, 0.0, 1.0); // No normal, no edge, in gap
      }

      // Inside panel: calculate refraction based on distance from edge
      // Maximum refraction at the curved edges/corners (low dist)
      // Minimum refraction in the flat center (high dist)
      float bevelStart = bevelWidth;
      float refractionStrength;

      if (bevelWidth > 0.001) {
        // Refraction strongest at edges (dist near 0), weakest at center (dist near bevelStart)
        refractionStrength = 1.0 - smoothstep(0.0, bevelStart, dist);
        normal2D *= refractionStrength;
      } else {
        // No bevel: uniform refraction
        normal2D = vec2(0.0);
      }

      // edgeDist: 0 at panel edge, 1 at center (for other effects)
      float edgeDist = bevelWidth > 0.001 ? smoothstep(0.0, bevelStart, dist) : 1.0;
      edgeDist = clamp(edgeDist, 0.0, 1.0);

      vec2 cellId = floor(cellPos);
      float variation = hash(cellId) * 0.2 + 0.9;

      return vec4(normal2D.x, normal2D.y, edgeDist, variation);
    }

    // Get pattern based on shape type
    vec4 getPattern(vec2 uv, float cells, int shape, float bevelWidth, float cornerRadius) {
      if (shape == 0) return patternStrips(uv, cells);
      if (shape == 1) return patternGrid(uv, cells, bevelWidth, cornerRadius);
      return patternStrips(uv, cells);
    }

    // 2D refract approximation
    vec2 refract2D(vec2 incident, vec2 normal, float eta) {
      float cosI = -dot(incident, normal);
      float sinT2 = eta * eta * (1.0 - cosI * cosI);
      if (sinT2 > 1.0) return reflect(incident, normal); // Total internal reflection
      float cosT = sqrt(1.0 - sinT2);
      return eta * incident + (eta * cosI - cosT) * normal;
    }

    // Fresnel-Schlick approximation
    float fresnelSchlick(float cosTheta, float ior) {
      float r0 = pow((1.0 - ior) / (1.0 + ior), 2.0);
      return r0 + (1.0 - r0) * pow(1.0 - cosTheta, 5.0);
    }

    // Optimized Kawase blur - 5-tap (cross pattern) for better performance
    vec3 kawaseBlur(vec2 uv, vec2 pixelSize, float radius) {
      vec3 c = vec3(0.0);
      vec2 o = pixelSize * radius;

      // Cross pattern sampling with equal weights (5 samples)
      // Optimized from 9-tap to 5-tap for ~45% performance improvement
      c += texture2D(tDiffuse, clamp(uv, vec2(0.0), vec2(1.0))).rgb * 0.4;
      c += texture2D(tDiffuse, clamp(uv + vec2(-o.x, 0.0), vec2(0.0), vec2(1.0))).rgb * 0.15;
      c += texture2D(tDiffuse, clamp(uv + vec2( o.x, 0.0), vec2(0.0), vec2(1.0))).rgb * 0.15;
      c += texture2D(tDiffuse, clamp(uv + vec2(0.0, -o.y), vec2(0.0), vec2(1.0))).rgb * 0.15;
      c += texture2D(tDiffuse, clamp(uv + vec2(0.0,  o.y), vec2(0.0), vec2(1.0))).rgb * 0.15;

      return c;
    }

    // Highly optimized frost blur - adaptive quality based on frost strength
    // Uses 3-4 scales dynamically for best performance/quality balance
    vec3 frostBlur(vec2 uv, vec2 pixelSize, float frostAmount) {
      if (frostAmount < 0.01) {
        return texture2D(tDiffuse, clamp(uv, vec2(0.0), vec2(1.0))).rgb;
      }

      // Increased max radius for stronger blur effect
      // 4.0 * 20.0 = 80 pixels max (4x increase from before)
      float maxRadius = 20.0;
      float baseRadius = frostAmount * maxRadius;

      vec3 c = vec3(0.0);

      // Adaptive multi-scale blur:
      // - Low frost (< 1.0): 3 scales = 15 samples (fastest)
      // - High frost (>= 1.0): 4 scales = 20 samples (better quality)

      if (frostAmount < 1.0) {
        // Fast path: 3 scales only (15 samples)
        // Weights: 0.2 + 0.3 + 0.5 = 1.0
        c += kawaseBlur(uv, pixelSize, baseRadius * 0.3) * 0.2;
        c += kawaseBlur(uv, pixelSize, baseRadius * 0.6) * 0.3;
        c += kawaseBlur(uv, pixelSize, baseRadius * 1.0) * 0.5;
      } else {
        // Quality path: 4 scales (20 samples)
        // Weights: 0.1 + 0.2 + 0.3 + 0.4 = 1.0
        c += kawaseBlur(uv, pixelSize, baseRadius * 0.25) * 0.1;
        c += kawaseBlur(uv, pixelSize, baseRadius * 0.5) * 0.2;
        c += kawaseBlur(uv, pixelSize, baseRadius * 0.75) * 0.3;
        c += kawaseBlur(uv, pixelSize, baseRadius * 1.0) * 0.4;
      }

      return c;
    }

    // Sample with frost - applies frosted glass blur effect
    vec3 sampleWithFrost(vec2 uv, vec2 pixelSize, float frostAmount) {
      if (frostAmount < 0.01) {
        return texture2D(tDiffuse, clamp(uv, vec2(0.0), vec2(1.0))).rgb;
      }
      return frostBlur(uv, pixelSize, frostAmount);
    }

    // Chromatic aberration sampling with frost support - enhanced for rainbow effect
    vec3 sampleWithAberration(vec2 baseUV, vec2 refractOffset, float aberration, vec2 pixelSize, float frostAmount) {
      // No aberration - just sample with frost
      if (aberration < 0.01) {
        return sampleWithFrost(baseUV + refractOffset, pixelSize, frostAmount);
      }

      // Increased dispersion for more visible rainbow effect
      float dispersionStrength = aberration * 0.5;
      vec3 color = vec3(0.0);
      vec3 weights = vec3(0.0);

      // Highly optimized sample count:
      // - No frost: 24 samples (good quality)
      // - Low frost (<1): 12 samples (balanced)
      // - High frost (>=1): 8 samples (fast, frost hides artifacts)
      int samples = 24;
      if (frostAmount > 0.01) {
        samples = frostAmount < 1.0 ? 12 : 8;
      }

      for (int i = 0; i < 24; i++) {
        if (i >= samples) break;

        float t = float(i) / float(samples - 1);
        float scale = 1.0 + (t - 0.5) * 2.0 * dispersionStrength;

        vec2 sampleUV = baseUV + refractOffset * scale;
        vec3 texSample = sampleWithFrost(sampleUV, pixelSize, frostAmount);

        // Wider Gaussian curves for more spread-out rainbow effect
        // Reduced from -8.0 to -4.0 for wider color separation
        float rWeight = exp(-4.0 * t * t);
        float gWeight = exp(-4.0 * (t - 0.5) * (t - 0.5));
        float bWeight = exp(-4.0 * (t - 1.0) * (t - 1.0));

        color.r += texSample.r * rWeight;
        color.g += texSample.g * gWeight;
        color.b += texSample.b * bWeight;
        weights += vec3(rWeight, gWeight, bWeight);
      }

      return color / max(weights, vec3(0.001));
    }

    void main() {
      vec2 uv = vUv;
      vec2 pixelSize = 1.0 / resolution;
      float aspect = resolution.x / resolution.y;

      // IMPORTANT: Apply aspect correction FIRST, then rotate
      // This ensures shapes stay square/regular when rotated
      vec2 centeredUV = uv - 0.5;
      // Scale X by aspect to make coordinate space square
      vec2 aspectCorrectedUV = vec2(centeredUV.x * aspect, centeredUV.y);
      // Now rotate in the square space
      vec2 rotatedUV = rotate(aspectCorrectedUV, uAngle);

      // Get pattern data (normal, edgeDistance, variation)
      // Pattern functions receive already aspect-corrected, rotated UV
      vec4 pattern = getPattern(rotatedUV, uCells, uShape, uBevel, uCornerRadius);
      vec2 surfaceNormal = pattern.xy;
      float edgeDist = pattern.z;
      float cellVariation = pattern.w;

      // Transform normal back to screen space:
      // 1. Rotate back
      surfaceNormal = rotate(surfaceNormal, -uAngle);
      // 2. Un-correct aspect ratio (divide X by aspect)
      surfaceNormal.x /= aspect;

      // Scale normal by cell variation
      surfaceNormal *= cellVariation;

      // Calculate viewing angle for Fresnel
      float cosTheta = max(edgeDist, 0.1);

      // Use IOR for physically-based refraction offset
      // eta = 1/IOR (air to glass)
      float eta = 1.0 / uIOR;

      // Apply refraction using the 2D approximation
      vec2 incident = vec2(0.0, -1.0); // Looking straight down
      vec2 refracted = refract2D(incident, surfaceNormal, eta);

      // Enhanced refraction with edge boosting for more pronounced glass effect
      // Boost refraction at edges (where edgeDist is lower) for realistic panel separation
      float edgeBoost = 1.0 + (1.0 - edgeDist) * 0.3;
      vec2 refractOffset = (refracted - incident) * pixelSize * uDistortion * 0.5 * edgeBoost;

      // Sample with chromatic aberration and frost
      vec3 color = sampleWithAberration(uv, refractOffset, uAberration, pixelSize, uFrost);

      // Fresnel effect - edges are more reflective (brighten edges)
      float fresnelFactor = fresnelSchlick(cosTheta, uIOR);

      // Apply fresnel as subtle brightening at edges
      if (uFresnel > 0.01) {
        color = mix(color, color * 1.3 + vec3(0.1), fresnelFactor * uFresnel * 0.5);
      }

      gl_FragColor = vec4(color, 1.0);
    }
  `},ln={strips:0,grid:1},Xi={name:"PixelationShader",uniforms:{tDiffuse:{value:null},resolution:{value:null},pixelWidth:{value:8},pixelHeight:{value:8},density:{value:1}},vertexShader:`
    varying vec2 vUv;

    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,fragmentShader:`
    uniform sampler2D tDiffuse;
    uniform vec2 resolution;
    uniform float pixelWidth;
    uniform float pixelHeight;
    uniform float density;

    varying vec2 vUv;

    // High quality hash function for better randomness
    float hash(vec2 p) {
      // Use sine-based hash for better distribution
      vec3 p3 = fract(vec3(p.xyx) * 0.1031);
      p3 += dot(p3, p3.yzx + 33.33);
      return fract((p3.x + p3.y) * p3.z);
    }

    void main() {
      // Calculate pixel dimensions relative to resolution
      vec2 pixelSize = vec2(pixelWidth, pixelHeight) / resolution;

      // Get pixel block index
      vec2 pixelIndex = floor(vUv / pixelSize);

      // Snap UV coordinates to pixel grid
      vec2 pixelCoord = pixelIndex * pixelSize;

      // Generate random value for this pixel block using block indices
      // Add large prime numbers to break patterns
      float random = hash(pixelIndex + vec2(127.1, 311.7));

      // Determine if this pixel should be pixelated based on density
      bool shouldPixelate = random < density;

      vec4 color;
      if (shouldPixelate) {
        // Sample from the center of the pixel block (pixelated)
        vec2 sampleUv = pixelCoord + pixelSize * 0.5;
        color = texture2D(tDiffuse, sampleUv);
      } else {
        // Use original pixel (non-pixelated)
        color = texture2D(tDiffuse, vUv);
      }

      gl_FragColor = color;
    }
  `},Ki={name:"WatercolorShader",uniforms:{tDiffuse:{value:null},resolution:{value:null},edgeIntensity:{value:.5},colorBleed:{value:1.5},paperTexture:{value:.3}},vertexShader:`
    varying vec2 vUv;

    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,fragmentShader:`
    uniform sampler2D tDiffuse;
    uniform vec2 resolution;
    uniform float edgeIntensity;
    uniform float colorBleed;
    uniform float paperTexture;

    varying vec2 vUv;

    // FBM Noise for organic effects
    float hash(vec2 p) {
      vec3 p3 = fract(vec3(p.xyx) * 0.1031);
      p3 += dot(p3, p3.yzx + 33.33);
      return fract((p3.x + p3.y) * p3.z);
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

    float fbm(vec2 p, int octaves) {
      float value = 0.0;
      float amplitude = 0.5;
      float frequency = 1.0;

      for(int i = 0; i < 8; i++) {
        if(i >= octaves) break;
        value += amplitude * noise(p * frequency);
        frequency *= 2.0;
        amplitude *= 0.5;
      }

      return value;
    }

    float fbm(vec2 p) {
      return fbm(p, 4);
    }

    void main() {
      vec2 texelSize = 1.0 / resolution;

      // Sample center
      vec4 center = texture2D(tDiffuse, vUv);

      // Compute image gradient (direction of color change)
      // This tells us which way colors are flowing
      vec2 gradOffset = texelSize * 3.0;
      vec3 gradX = texture2D(tDiffuse, vUv + vec2(gradOffset.x, 0.0)).rgb
                   - texture2D(tDiffuse, vUv - vec2(gradOffset.x, 0.0)).rgb;
      vec3 gradY = texture2D(tDiffuse, vUv + vec2(0.0, gradOffset.y)).rgb
                   - texture2D(tDiffuse, vUv - vec2(0.0, gradOffset.y)).rgb;

      // Flow direction perpendicular to gradient (along edges)
      vec2 gradientDir = vec2(length(gradX), length(gradY));
      float gradientMag = length(gradientDir);

      // Perpendicular to gradient = flow along edges
      vec2 flowDirection = vec2(-gradientDir.y, gradientDir.x);
      if(length(flowDirection) > 0.001) {
        flowDirection = normalize(flowDirection);
      }

      // Turbulence adds organic variation to flow
      vec2 turbulence = vec2(
        fbm(vUv * 3.0, 4),
        fbm(vUv * 3.0 + vec2(5.2, 8.3), 4)
      ) - 0.5;

      // "Wetness" map - wet areas have more bleeding
      float wetness = fbm(vUv * 5.0, 4);
      wetness = smoothstep(0.35, 0.65, wetness);

      // Combine gradient-based flow with turbulence
      // Strong gradients = flow along edges
      // Weak gradients = more turbulent flow
      vec2 finalFlow = mix(
        turbulence * 2.0,                    // Random flow in flat areas
        flowDirection + turbulence * 0.3,    // Directional flow along edges
        smoothstep(0.1, 0.4, gradientMag)
      );

      // Color bleeding along flow direction
      vec4 bled = vec4(0.0);
      float totalWeight = 0.0;

      // Sample along flow direction and perpendicular
      int sampleCount = int(mix(8.0, 16.0, wetness));

      for(int i = 0; i < 16; i++) {
        if(i >= sampleCount) break;

        float angle = float(i) * 3.14159 * 2.0 / float(sampleCount);
        vec2 radialDir = vec2(cos(angle), sin(angle));

        // Bias samples towards flow direction
        vec2 sampleDir = normalize(mix(radialDir, finalFlow, 0.6));

        // Distance varies with wetness and gradient strength
        float bleedDist = colorBleed * 0.02 * (0.8 + wetness * 1.5);

        // Multiple distance rings
        for(int d = 1; d <= 3; d++) {
          float dist = float(d) * bleedDist;
          vec2 sampleUv = vUv + sampleDir * dist;

          float weight = 1.0 / (float(d) * (1.5 - wetness * 0.5));
          bled += texture2D(tDiffuse, sampleUv) * weight;
          totalWeight += weight;
        }
      }

      bled /= totalWeight;

      // Edge detection with turbulent offset
      vec2 edgeOffset = texelSize * 2.0;
      vec3 edgeX = texture2D(tDiffuse, vUv + vec2(edgeOffset.x, 0.0) + turbulence * 0.01).rgb
                  - texture2D(tDiffuse, vUv - vec2(edgeOffset.x, 0.0) - turbulence * 0.01).rgb;
      vec3 edgeY = texture2D(tDiffuse, vUv + vec2(0.0, edgeOffset.y) + turbulence * 0.01).rgb
                  - texture2D(tDiffuse, vUv - vec2(0.0, edgeOffset.y) - turbulence * 0.01).rgb;
      float edge = length(edgeX) + length(edgeY);

      // Mix with stronger bleeding in wet areas
      float bleedAmount = mix(0.5, 0.85, wetness);
      vec4 color = mix(center, bled, bleedAmount);

      // Clean edge darkening without texture variation
      float edgeDarken = 1.0 - smoothstep(0.0, 0.8, edge * edgeIntensity * 4.0);
      color.rgb *= edgeDarken;

      // Very subtle paper texture (optional)
      if(paperTexture > 0.01) {
        float paperNoise = fbm(vUv * 60.0, 3);
        float paper = paperNoise * 0.15 + 0.925; // Very subtle
        color.rgb = mix(color.rgb, color.rgb * paper, paperTexture * 0.5);
      }

      gl_FragColor = color;
    }
  `},Yi={name:"VHSShader",uniforms:{tDiffuse:{value:null},resolution:{value:null},time:{value:0},scanlines:{value:.4},grille:{value:.3},roll:{value:.5},noise:{value:.4},aberration:{value:.5},warp:{value:1}},vertexShader:`
    varying vec2 vUv;

    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,fragmentShader:`
    uniform sampler2D tDiffuse;
    uniform vec2 resolution;
    uniform float time;
    uniform float scanlines;
    uniform float grille;
    uniform float roll;
    uniform float noise;
    uniform float aberration;
    uniform float warp;

    varying vec2 vUv;

    // Pseudo random value between 0.0 and 1.0
    vec2 random(vec2 uv) {
      uv = vec2(dot(uv, vec2(127.1, 311.7)), dot(uv, vec2(269.5, 183.3)));
      return -1.0 + 2.0 * fract(sin(uv) * 43758.5453123);
    }

    // Perlin noise
    float perlinNoise(vec2 uv) {
      vec2 uv_index = floor(uv);
      vec2 uv_fract = fract(uv);
      vec2 blur = smoothstep(0.0, 1.0, uv_fract);

      return mix(
        mix(dot(random(uv_index + vec2(0.0, 0.0)), uv_fract - vec2(0.0, 0.0)),
            dot(random(uv_index + vec2(1.0, 0.0)), uv_fract - vec2(1.0, 0.0)), blur.x),
        mix(dot(random(uv_index + vec2(0.0, 1.0)), uv_fract - vec2(0.0, 1.0)),
            dot(random(uv_index + vec2(1.0, 1.0)), uv_fract - vec2(1.0, 1.0)), blur.x),
        blur.y
      ) * 0.5 + 0.5;
    }

    // Warp UV to simulate curved CRT screen
    vec2 warpUV(vec2 uv) {
      if (warp < 0.01) return uv;

      vec2 delta = uv - 0.5;
      float delta2 = dot(delta, delta);
      float delta4 = delta2 * delta2;
      float delta_offset = delta4 * warp * 0.1;

      return uv + delta * delta_offset;
    }

    // Black border for warped edges
    float border(vec2 uv) {
      if (warp < 0.01) return 1.0;

      float radius = min(warp * 0.1, 0.08);
      radius = max(min(min(abs(radius * 2.0), 1.0), 1.0), 1e-5);
      vec2 abs_uv = abs(uv * 2.0 - 1.0) - vec2(1.0, 1.0) + radius;
      float dist = length(max(vec2(0.0), abs_uv)) / radius;
      float square = smoothstep(0.96, 1.0, dist);
      return clamp(1.0 - square, 0.0, 1.0);
    }

    // Vignette
    float vignette(vec2 uv) {
      uv *= 1.0 - uv;
      float vig = uv.x * uv.y * 15.0;
      return pow(vig, 0.4 * 0.5);
    }

    void main() {
      vec2 uv = warpUV(vUv);

      // Rolling effect distortion (static)
      float roll_line = 0.0;
      vec2 roll_uv = vec2(0.0);

      if (roll > 0.01) {
        float roll_size = 15.0;
        float roll_variation = 1.8;
        float distort_intensity = 0.05 * roll;

        // Static roll pattern
        roll_line = smoothstep(0.3, 0.9, sin(uv.y * roll_size));
        roll_line *= roll_line * smoothstep(0.3, 0.9, sin(uv.y * roll_size * roll_variation));
        roll_uv = vec2(roll_line * distort_intensity * (1.0 - uv.x), 0.0);
      }

      // Pixelate based on resolution
      vec2 pixelSize = vec2(640.0, 480.0);
      vec2 text_uv = ceil(uv * pixelSize) / pixelSize;

      // Sample texture with chromatic aberration and roll distortion
      vec4 text;
      float aberr = aberration * 0.03;

      if (roll > 0.01) {
        text.r = texture2D(tDiffuse, text_uv + roll_uv * 0.8 + vec2(aberr, 0.0)).r;
        text.g = texture2D(tDiffuse, text_uv + roll_uv * 1.2 - vec2(aberr, 0.0)).g;
        text.b = texture2D(tDiffuse, text_uv + roll_uv).b;
      } else {
        text.r = texture2D(tDiffuse, text_uv + vec2(aberr, 0.0)).r;
        text.g = texture2D(tDiffuse, text_uv - vec2(aberr, 0.0)).g;
        text.b = texture2D(tDiffuse, text_uv).b;
      }
      text.a = 1.0;

      float r = text.r;
      float g = text.g;
      float b = text.b;

      // RGB grille effect (simulates CRT phosphor dots)
      if (grille > 0.01) {
        float g_r = smoothstep(0.85, 0.95, abs(sin(uv.x * (pixelSize.x * 3.14159265))));
        r = mix(r, r * g_r, grille);

        float g_g = smoothstep(0.85, 0.95, abs(sin(1.05 + uv.x * (pixelSize.x * 3.14159265))));
        g = mix(g, g * g_g, grille);

        float b_b = smoothstep(0.85, 0.95, abs(sin(2.1 + uv.x * (pixelSize.x * 3.14159265))));
        b = mix(b, b * b_b, grille);
      }

      // Apply without brightness compensation
      text.r = r;
      text.g = g;
      text.b = b;

      // Scanlines
      if (scanlines > 0.01) {
        float scanline = smoothstep(0.25, 0.75, abs(sin(uv.y * (pixelSize.y * 3.14159265))));
        text.rgb = mix(text.rgb, text.rgb * vec3(scanline), scanlines);
      }

      // Static noise (controlled by noise parameter)
      if (noise > 0.01) {
        float noiseValue = random(ceil(uv * pixelSize) / pixelSize).x;
        text.rgb += clamp(noiseValue, 0.0, 1.0) * noise * 0.2;
      }

      // Apply border for warped edges only
      text.rgb *= border(uv);

      gl_FragColor = text;
    }
  `},bt={chromaticAberration:{create:(t,n)=>{const e=new ie(Ni),o=t;return e.uniforms.offset&&(e.uniforms.offset.value=o.offset/1e3),e},update:(t,n)=>{const e=n;t.uniforms.offset&&(t.uniforms.offset.value=e.offset/1e3)}},filmGrain:{create:(t,n)=>{const e=new ie(Hi),o=n.getSize(new Q),r=t;return e.uniforms.intensity&&(e.uniforms.intensity.value=r.intensity),e.uniforms.size&&(e.uniforms.size.value=r.size),e.uniforms.time&&(e.uniforms.time.value=0),e.uniforms.resolution&&(e.uniforms.resolution.value=new Q(o.x,o.y)),e},update:(t,n)=>{const e=n;t.uniforms.intensity&&(t.uniforms.intensity.value=e.intensity),t.uniforms.size&&(t.uniforms.size.value=e.size)}},exposureContrast:{create:(t,n)=>{const e=new ie(Fi),o=t;return e.uniforms.exposure&&(e.uniforms.exposure.value=o.exposure),e.uniforms.contrast&&(e.uniforms.contrast.value=o.contrast),e},update:(t,n)=>{const e=n;t.uniforms.exposure&&(t.uniforms.exposure.value=e.exposure),t.uniforms.contrast&&(t.uniforms.contrast.value=e.contrast)}},progressiveBlur:{create:(t,n)=>{const e=new ie(_n),o=n.getSize(new Q),r=t;return e.uniforms.uLineStart&&(e.uniforms.uLineStart.value=new Q(r.startX,1-r.startY)),e.uniforms.uLineEnd&&(e.uniforms.uLineEnd.value=new Q(r.endX,1-r.endY)),e.uniforms.uStartBlur&&(e.uniforms.uStartBlur.value=r.startBlur),e.uniforms.uEndBlur&&(e.uniforms.uEndBlur.value=r.endBlur),e.uniforms.uDirection&&(e.uniforms.uDirection.value=0),e.uniforms.uQuality&&(e.uniforms.uQuality.value=r.quality),e.uniforms.resolution&&(e.uniforms.resolution.value=new Q(o.x,o.y)),e},update:(t,n)=>{const e=n;t.uniforms.uLineStart&&t.uniforms.uLineStart.value.set(e.startX,1-e.startY),t.uniforms.uLineEnd&&t.uniforms.uLineEnd.value.set(e.endX,1-e.endY),t.uniforms.uStartBlur&&(t.uniforms.uStartBlur.value=e.startBlur),t.uniforms.uEndBlur&&(t.uniforms.uEndBlur.value=e.endBlur),t.uniforms.uQuality&&(t.uniforms.uQuality.value=e.quality)}},halftone:{create:(t,n)=>{const e=new ie(Oi),o=n.getSize(new Q),r=t;return e.uniforms.shape&&(e.uniforms.shape.value=1),e.uniforms.rotateR&&(e.uniforms.rotateR.value=Math.PI/12),e.uniforms.rotateG&&(e.uniforms.rotateG.value=Math.PI/12*2),e.uniforms.rotateB&&(e.uniforms.rotateB.value=Math.PI/12*3),e.uniforms.blendingMode&&(e.uniforms.blendingMode.value=1),e.uniforms.greyscale&&(e.uniforms.greyscale.value=!1),e.uniforms.radius&&(e.uniforms.radius.value=r.radius),e.uniforms.scatter&&(e.uniforms.scatter.value=r.scatter),e.uniforms.blending&&(e.uniforms.blending.value=r.blending),e.uniforms.width&&(e.uniforms.width.value=o.x),e.uniforms.height&&(e.uniforms.height.value=o.y),e},update:(t,n)=>{const e=n;t.uniforms.radius&&(t.uniforms.radius.value=e.radius),t.uniforms.scatter&&(t.uniforms.scatter.value=e.scatter),t.uniforms.blending&&(t.uniforms.blending.value=e.blending)}},hueSaturation:{create:(t,n)=>{const e=new ie(Gi),o=t;return e.uniforms.hue&&(e.uniforms.hue.value=o.hue),e.uniforms.saturation&&(e.uniforms.saturation.value=o.saturation),e.uniforms.lightness&&(e.uniforms.lightness.value=o.lightness),e},update:(t,n)=>{const e=n;t.uniforms.hue&&(t.uniforms.hue.value=e.hue),t.uniforms.saturation&&(t.uniforms.saturation.value=e.saturation),t.uniforms.lightness&&(t.uniforms.lightness.value=e.lightness)}},colorBalance:{create:(t,n)=>{const e=new ie(Vi),o=t;return e.uniforms.cyanRed&&(e.uniforms.cyanRed.value=o.cyanRed),e.uniforms.magentaGreen&&(e.uniforms.magentaGreen.value=o.magentaGreen),e.uniforms.yellowBlue&&(e.uniforms.yellowBlue.value=o.yellowBlue),e},update:(t,n)=>{const e=n;t.uniforms.cyanRed&&(t.uniforms.cyanRed.value=e.cyanRed),t.uniforms.magentaGreen&&(t.uniforms.magentaGreen.value=e.magentaGreen),t.uniforms.yellowBlue&&(t.uniforms.yellowBlue.value=e.yellowBlue)}},glassDistortion:{create:(t,n)=>{const e=new ie($i),o=n.getSize(new Q),r=t;return e.uniforms.uShape&&(e.uniforms.uShape.value=ln[r.shape]??0),e.uniforms.uCells&&(e.uniforms.uCells.value=r.cells),e.uniforms.uDistortion&&(e.uniforms.uDistortion.value=r.distortion),e.uniforms.uAngle&&(e.uniforms.uAngle.value=r.angle*Math.PI/180),e.uniforms.uAberration&&(e.uniforms.uAberration.value=r.aberration),e.uniforms.uEdge&&(e.uniforms.uEdge.value=r.edge),e.uniforms.uIOR&&(e.uniforms.uIOR.value=r.ior),e.uniforms.uFresnel&&(e.uniforms.uFresnel.value=r.fresnel),e.uniforms.uFrost&&(e.uniforms.uFrost.value=r.frost??0),e.uniforms.uBevel&&(e.uniforms.uBevel.value=r.bevel??.15),e.uniforms.uCornerRadius&&(e.uniforms.uCornerRadius.value=r.cornerRadius??.15),e.uniforms.resolution&&(e.uniforms.resolution.value=new Q(o.x,o.y)),e},update:(t,n)=>{const e=n;t.uniforms.uShape&&(t.uniforms.uShape.value=ln[e.shape]??0),t.uniforms.uCells&&(t.uniforms.uCells.value=e.cells),t.uniforms.uDistortion&&(t.uniforms.uDistortion.value=e.distortion),t.uniforms.uAngle&&(t.uniforms.uAngle.value=e.angle*Math.PI/180),t.uniforms.uAberration&&(t.uniforms.uAberration.value=e.aberration),t.uniforms.uEdge&&(t.uniforms.uEdge.value=e.edge),t.uniforms.uIOR&&(t.uniforms.uIOR.value=e.ior),t.uniforms.uFresnel&&(t.uniforms.uFresnel.value=e.fresnel),t.uniforms.uFrost&&(t.uniforms.uFrost.value=e.frost??0),t.uniforms.uBevel&&(t.uniforms.uBevel.value=e.bevel??.15),t.uniforms.uCornerRadius&&(t.uniforms.uCornerRadius.value=e.cornerRadius??.15)}},pixelation:{create:(t,n)=>{const e=new ie(Xi),o=n.getSize(new Q),r=t;return e.uniforms.pixelWidth&&(e.uniforms.pixelWidth.value=r.pixelWidth),e.uniforms.pixelHeight&&(e.uniforms.pixelHeight.value=r.pixelHeight),e.uniforms.density&&(e.uniforms.density.value=r.density),e.uniforms.resolution&&(e.uniforms.resolution.value=new Q(o.x,o.y)),e},update:(t,n)=>{const e=n;t.uniforms.pixelWidth&&(t.uniforms.pixelWidth.value=e.pixelWidth),t.uniforms.pixelHeight&&(t.uniforms.pixelHeight.value=e.pixelHeight),t.uniforms.density&&(t.uniforms.density.value=e.density)}},watercolor:{create:(t,n)=>{const e=new ie(Ki),o=n.getSize(new Q),r=t;return e.uniforms.edgeIntensity&&(e.uniforms.edgeIntensity.value=r.edgeIntensity),e.uniforms.colorBleed&&(e.uniforms.colorBleed.value=r.colorBleed),e.uniforms.paperTexture&&(e.uniforms.paperTexture.value=r.paperTexture),e.uniforms.resolution&&(e.uniforms.resolution.value=new Q(o.x,o.y)),e},update:(t,n)=>{const e=n;t.uniforms.edgeIntensity&&(t.uniforms.edgeIntensity.value=e.edgeIntensity),t.uniforms.colorBleed&&(t.uniforms.colorBleed.value=e.colorBleed),t.uniforms.paperTexture&&(t.uniforms.paperTexture.value=e.paperTexture)}},vhs:{create:(t,n)=>{const e=new ie(Yi),o=n.getSize(new Q),r=t;return e.uniforms.scanlines&&(e.uniforms.scanlines.value=r.scanlines),e.uniforms.grille&&(e.uniforms.grille.value=r.grille),e.uniforms.roll&&(e.uniforms.roll.value=r.roll),e.uniforms.noise&&(e.uniforms.noise.value=r.noise),e.uniforms.aberration&&(e.uniforms.aberration.value=r.aberration),e.uniforms.warp&&(e.uniforms.warp.value=r.warp),e.uniforms.resolution&&(e.uniforms.resolution.value=new Q(o.x,o.y)),e.uniforms.time&&(e.uniforms.time.value=0),e},update:(t,n)=>{const e=n;t.uniforms.scanlines&&(t.uniforms.scanlines.value=e.scanlines),t.uniforms.grille&&(t.uniforms.grille.value=e.grille),t.uniforms.roll&&(t.uniforms.roll.value=e.roll),t.uniforms.noise&&(t.uniforms.noise.value=e.noise),t.uniforms.aberration&&(t.uniforms.aberration.value=e.aberration),t.uniforms.warp&&(t.uniforms.warp.value=e.warp)}}};class Vs{composer;renderPass;effectPasses=new Map;currentEffects=[];colorCorrectionPass=null;colorCorrectionActive=!1;renderer;scene;camera;clock=new co;cachedClearColor=new uo;constructor(n,e,o){this.renderer=n,this.scene=e,this.camera=o;const r=new fo(n.domElement.width,n.domElement.height,{minFilter:Ut,magFilter:Ut,format:ho,type:po});this.composer=new mo(n,r),this.renderPass=new go(e,o),this.renderPass.clearAlpha=0,this.composer.addPass(this.renderPass)}updateEffects(n){const e=(n||[]).filter(r=>r&&r.id&&typeof r.type=="string");e.length!==this.currentEffects.length||e.some((r,i)=>{const s=this.currentEffects[i];return!s||r.id!==s.id||r.type!==s.type||r.enabled!==s.enabled})?this.rebuildPipeline(e):this.updateParameters(e),this.currentEffects=e}updateColorCorrection(n){const e=n.exposure===0&&n.contrast===0&&n.hue===0&&n.saturation===0&&n.lightness===0;e&&this.colorCorrectionPass?(this.colorCorrectionPass.dispose?.(),this.colorCorrectionPass=null,this.colorCorrectionActive=!1,this.rebuildPipeline(this.currentEffects)):!e&&!this.colorCorrectionPass?(this.colorCorrectionPass=new ie(ji),this.colorCorrectionActive=!0,this.updateColorCorrectionUniforms(n),this.rebuildPipeline(this.currentEffects)):!e&&this.colorCorrectionPass&&this.updateColorCorrectionUniforms(n)}updateColorCorrectionUniforms(n){const e=this.colorCorrectionPass;e&&(e.uniforms.exposure&&(e.uniforms.exposure.value=n.exposure),e.uniforms.contrast&&(e.uniforms.contrast.value=n.contrast),e.uniforms.hue&&(e.uniforms.hue.value=n.hue),e.uniforms.saturation&&(e.uniforms.saturation.value=n.saturation),e.uniforms.lightness&&(e.uniforms.lightness.value=n.lightness))}rebuildPipeline(n){for(;this.composer.passes.length>1;)this.composer.passes.pop();this.effectPasses.forEach(e=>{e.dispose?.()}),this.effectPasses.clear(),this.colorCorrectionActive&&this.colorCorrectionPass&&this.composer.addPass(this.colorCorrectionPass);for(const e of n)if(!(!e||!e.enabled))if(e.type==="progressiveBlur"){const o=this.createPass(e);if(o){this.effectPasses.set(e.id+"-h",o),this.composer.addPass(o);const r=new ie(_n),i=this.renderer.getSize(new Q);r.uniforms.uLineStart&&(r.uniforms.uLineStart.value=new Q(e.startX,1-e.startY)),r.uniforms.uLineEnd&&(r.uniforms.uLineEnd.value=new Q(e.endX,1-e.endY)),r.uniforms.uStartBlur&&(r.uniforms.uStartBlur.value=e.startBlur),r.uniforms.uEndBlur&&(r.uniforms.uEndBlur.value=e.endBlur),r.uniforms.uDirection&&(r.uniforms.uDirection.value=1),r.uniforms.uQuality&&(r.uniforms.uQuality.value=e.quality),r.uniforms.resolution&&(r.uniforms.resolution.value=new Q(i.x,i.y)),this.effectPasses.set(e.id+"-v",r),this.composer.addPass(r)}}else{const o=this.createPass(e);o&&(this.effectPasses.set(e.id,o),this.composer.addPass(o))}}createPass(n){const e=bt[n.type];return e?e.create(n,this.renderer):null}updateParameters(n){for(const e of n){if(e.type==="progressiveBlur"){const i=bt.progressiveBlur;if(!i)continue;const s=this.effectPasses.get(e.id+"-h"),a=this.effectPasses.get(e.id+"-v");s&&i.update(s,e),a&&i.update(a,e);continue}const o=this.effectPasses.get(e.id);if(!o)continue;const r=bt[e.type];r&&r.update(o,e)}}render(){const n=this.clock.getDelta(),e=this.clock.getElapsedTime();for(const o of this.currentEffects){const r=this.effectPasses.get(o.id);r&&(o.type==="filmGrain"&&r.uniforms.time&&(r.uniforms.time.value=e),o.type==="vhs"&&r.uniforms.time&&(r.uniforms.time.value=e))}this.composer.render(n)}renderDirect(){this.renderer.render(this.scene,this.camera)}hasEnabledEffects(){return this.colorCorrectionActive||this.currentEffects.some(n=>n.enabled)}setSize(n,e){this.composer.setSize(n,e);for(const o of this.effectPasses.values())o.uniforms.resolution&&o.uniforms.resolution.value.set(n,e),o.uniforms.width&&(o.uniforms.width.value=n),o.uniforms.height&&(o.uniforms.height.value=e)}updateCamera(n){this.camera=n,this.renderPass.camera=n}setBackgroundColor(n){n?(this.cachedClearColor.setRGB(n.r,n.g,n.b),this.renderPass.clearColor=this.cachedClearColor,this.renderPass.clearAlpha=n.a):(this.cachedClearColor.setRGB(0,0,0),this.renderPass.clearColor=this.cachedClearColor,this.renderPass.clearAlpha=0)}dispose(){this.effectPasses.forEach(n=>{n.dispose?.()}),this.effectPasses.clear(),this.composer.dispose()}}function Wi(t,n){const e=1-t;switch(n){case"linear":return e;case"smooth":return e*e*(3-2*e);case"sharp":return e*e*e}}function qi(t,n,e,o,r){const i=n.x-t.x,s=n.y-t.y,a=Math.sqrt(i*i+s*s);if(a<.001)return t;const l=r*.15,c=e*o*l/a;return{x:t.x+i*c,y:t.y+s*c}}function Qi(t,n,e,o,r){const i=t.x-n.x,s=t.y-n.y,a=Math.sqrt(i*i+s*s);if(a<.001)return t;const l=r*.15,c=e*o*l/a;return{x:t.x+i*c,y:t.y+s*c}}function Zi(t,n,e,o,r,i,s){if(e<.001)return t;const a=i/r.frequency,l=e/a*Math.PI*2-s*.001*r.speed,c=Math.sin(l)*r.amplitude*i*o*r.strength,u=(t.x-n.x)/e,d=(t.y-n.y)/e;return{x:t.x+u*c,y:t.y+d*c}}function Ji(t,n,e,o){const r=t.x-n.x,i=t.y-n.y,s=1+o*e;return{x:n.x+r*s,y:n.y+i*s}}function es(t,n,e,o,r){const i=t.x-n.x,s=t.y-n.y,a=Math.PI*2*o*r,l=e*a,c=Math.cos(l),u=Math.sin(l);return{x:n.x+i*c-s*u,y:n.y+i*u+s*c}}function ts(t,n,e){const o=ae(t),r=e.hueShift/360*n*e.strength;let i=o.h+r;i<0&&(i+=1),i>1&&(i-=1);const s=Math.max(0,Math.min(1,o.s+e.saturation*n*e.strength)),a=Math.max(0,Math.min(1,o.l+e.lightness*n*e.strength));return Le({h:i,s,l:a,alpha:o.alpha})}function $s(t,n,e,o=0,r="rectangle"){let i=t;for(const s of e)s.enabled&&(i=ns(i,n,s,o,r));return i}function ns(t,n,e,o=0,r="rectangle"){if(!e.enabled)return t;const i=e.radius*t.width,s=t.points.length-1,a=t.points[0].length-1,l=t.points.map((c,u)=>c.map((d,f)=>{if(e.fixEdges){if(r==="circle"){if(u===s)return d}else if(u===0||u===s||f===0||f===a)return d}const p=d.position.x-n.x,h=d.position.y-n.y,m=Math.sqrt(p*p+h*h);if(m>i)return d;const x=m/i,y=Wi(x,e.falloff);let S=d.position,C=d.color;switch(e.type){case"attract":S=qi(d.position,n,y,e.strength,t.width);break;case"repel":S=Qi(d.position,n,y,e.strength,t.width);break;case"wave":S=Zi(d.position,n,m,y,e,t.width,o);break;case"colorShift":C=ts(d.color,y,e);break;case"bulge":S=Ji(d.position,n,y,e.strength);break;case"swirl":S=es(d.position,n,y,e.strength,e.direction);break}return S!==d.position||C!==d.color?{...d,position:S,color:C}:d}));return{...t,points:l}}const os=g.memo(({x:t,y:n,color:e,isSelected:o,scale:r=1,isMobile:i=!1,onPointerDown:s,onDoubleClick:a})=>{const l=i&&o?1.8:1,u=12*r*l/2,d=2*r,f=`rgba(${Math.round(e.r*255)}, ${Math.round(e.g*255)}, ${Math.round(e.b*255)}, ${e.a})`,p=o?"#000000":"#ffffff";return L.jsxs("g",{children:[L.jsx("circle",{cx:t,cy:n,r:22*r,fill:"transparent",pointerEvents:"all",onPointerDown:s,onDoubleClick:a}),L.jsx("circle",{cx:t,cy:n,r:u+d/2,fill:"none",stroke:"rgba(0, 0, 0, 0.2)",strokeWidth:d+1*r,style:{pointerEvents:"none"}}),L.jsx("circle",{cx:t,cy:n,r:u,fill:f,stroke:p,strokeWidth:d,style:{cursor:"move",pointerEvents:"none"}})]})});os.displayName="ControlPoint";const rs=g.memo(({parentX:t,parentY:n,handleX:e,handleY:o,isActive:r,scale:i=1,onPointerDown:s})=>{const a=r?"#000000":"#ffffff",l=r?"rgba(0, 0, 0, 0.8)":"rgba(255, 255, 255, 0.5)",u=8*i/2,d=(r?2:1)*i,f=1.5*i,p=`${4*i} ${2*i}`;return L.jsxs("g",{children:[L.jsx("line",{x1:t,y1:n,x2:e,y2:o,stroke:"rgba(0, 0, 0, 0.15)",strokeWidth:d+1.5*i,strokeDasharray:p,style:{pointerEvents:"none"}}),L.jsx("line",{x1:t,y1:n,x2:e,y2:o,stroke:l,strokeWidth:d,strokeDasharray:p,style:{pointerEvents:"none"}}),L.jsx("circle",{cx:e,cy:o,r:22*i,fill:"transparent",pointerEvents:"all",onPointerDown:s}),L.jsx("circle",{cx:e,cy:o,r:u+f/2,fill:"none",stroke:"rgba(0, 0, 0, 0.2)",strokeWidth:f+1*i,style:{pointerEvents:"none"}}),L.jsx("circle",{cx:e,cy:o,r:u,fill:a,stroke:r?"#000000":"#ffffff",strokeWidth:f,style:{cursor:"move",pointerEvents:"none"}})]})});rs.displayName="BezierHandle";const is=g.memo(({grid:t,topology:n,uiScale:e})=>{const o=g.useMemo(()=>n==="circle"?as(t):ss(t),[t,n]),r=1*e;return L.jsxs("g",{style:{pointerEvents:"none"},children:[L.jsx("path",{d:o,fill:"none",stroke:"rgba(0, 0, 0, 0.15)",strokeWidth:r+1*e}),L.jsx("path",{d:o,fill:"none",stroke:"rgba(255, 255, 255, 0.4)",strokeWidth:r})]})});function ss(t){const n=[];for(let e=0;e<t.rows;e++)for(let o=0;o<t.cols-1;o++){const r=t.points[e][o],i=t.points[e][o+1],s=r.position.x+r.handles.handleRight.x*t.width,a=r.position.y+r.handles.handleRight.y*t.height,l=i.position.x+i.handles.handleLeft.x*t.width,c=i.position.y+i.handles.handleLeft.y*t.height;n.push(`M ${r.position.x} ${r.position.y} C ${s} ${a}, ${l} ${c}, ${i.position.x} ${i.position.y}`)}for(let e=0;e<t.rows-1;e++)for(let o=0;o<t.cols;o++){const r=t.points[e][o],i=t.points[e+1][o],s=r.position.x+r.handles.handleDown.x*t.width,a=r.position.y+r.handles.handleDown.y*t.height,l=i.position.x+i.handles.handleUp.x*t.width,c=i.position.y+i.handles.handleUp.y*t.height;n.push(`M ${r.position.x} ${r.position.y} C ${s} ${a}, ${l} ${c}, ${i.position.x} ${i.position.y}`)}return n.join(" ")}function as(t){const n=[],{rows:e,cols:o}=t;for(let r=0;r<e-1;r++)for(let i=0;i<o;i++){const s=t.points[r][i],a=t.points[r+1][i],l=s.position.x+s.handles.handleDown.x*t.width,c=s.position.y+s.handles.handleDown.y*t.height,u=a.position.x+a.handles.handleUp.x*t.width,d=a.position.y+a.handles.handleUp.y*t.height;n.push(`M ${s.position.x} ${s.position.y} C ${l} ${c}, ${u} ${d}, ${a.position.x} ${a.position.y}`)}for(let r=1;r<e;r++)for(let i=0;i<o;i++){const s=(i+1)%o,a=t.points[r][i],l=t.points[r][s],c=a.position.x+a.handles.handleRight.x*t.width,u=a.position.y+a.handles.handleRight.y*t.height,d=l.position.x+l.handles.handleLeft.x*t.width,f=l.position.y+l.handles.handleLeft.y*t.height;n.push(`M ${a.position.x} ${a.position.y} C ${c} ${u}, ${d} ${f}, ${l.position.x} ${l.position.y}`)}return n.join(" ")}is.displayName="GridCurves";const ls=g.memo(({preview:t,grid:n,uiScale:e})=>t?L.jsxs(L.Fragment,{children:[(t.type==="horizontal"||t.type==="cross")&&L.jsx("path",{d:Lo(n,t.patchRow,t.tV),fill:"none",stroke:"#6366f1",strokeWidth:1*e,strokeDasharray:`${4*e} ${3*e}`,opacity:.9,style:{pointerEvents:"none"}}),(t.type==="vertical"||t.type==="cross")&&L.jsx("path",{d:Eo(n,t.patchCol,t.tU),fill:"none",stroke:"#6366f1",strokeWidth:1*e,strokeDasharray:`${4*e} ${3*e}`,opacity:.9,style:{pointerEvents:"none"}})]}):null);ls.displayName="PreviewLines";const cs=g.memo(({rect:t,uiScale:n})=>t?L.jsx("rect",{x:t.x,y:t.y,width:t.width,height:t.height,fill:"rgba(99, 102, 241, 0.15)",stroke:"#6366f1",strokeWidth:1*n,strokeDasharray:`${4*n} ${2*n}`,style:{pointerEvents:"none"}}):null);cs.displayName="MarqueeRect";const us=g.memo(({bounds:t,uiScale:n,svgRef:e})=>{const o=q(D=>D.scaleSelectedPoints),r=q(D=>D.rotateSelectedPoints),i=q(D=>D.setDragging),s=q(D=>D.grid),a=q(D=>D.viewport),l=g.useRef(null),[c,u]=g.useState(0),d=g.useRef(null),f=d.current??t,p=8*n,h=16*n,m=6*n,x=24*n,y=1.5*n,S=1*n,C=g.useMemo(()=>({nw:{x:f.x,y:f.y},ne:{x:f.x+f.width,y:f.y},sw:{x:f.x,y:f.y+f.height},se:{x:f.x+f.width,y:f.y+f.height}}),[f]),w=g.useMemo(()=>({n:{x:f.centerX,y:f.y},s:{x:f.centerX,y:f.y+f.height},e:{x:f.x+f.width,y:f.centerY},w:{x:f.x,y:f.centerY}}),[f]),k=g.useMemo(()=>({x:f.centerX,y:f.y-x}),[f.centerX,f.y,x]),b=g.useCallback(D=>({nw:C.se,ne:C.sw,sw:C.ne,se:C.nw,n:{x:f.centerX,y:f.y+f.height},s:{x:f.centerX,y:f.y},e:{x:f.x,y:f.centerY},w:{x:f.x+f.width,y:f.centerY}})[D],[C,f]),M=g.useCallback((D,A)=>{const B=e.current;if(!B)return{x:0,y:0};const $=B.getBoundingClientRect(),G=1e3*a.zoom,N=$.left+G,Y=$.top+G,P=$.width-G*2,E=$.height-G*2,T=s.width/P,R=s.height/E;return{x:(D-N)*T,y:(A-Y)*R}},[e,s.width,s.height,a.zoom]),_=g.useCallback((D,A)=>{A.stopPropagation(),A.preventDefault(),l.current=D,i(!0);const B=b(D);let $=M(A.clientX,A.clientY);const K=!["n","s"].includes(D),G=!["e","w"].includes(D),N=P=>{const E=M(P.clientX,P.clientY),T=Math.abs($.x-B.x),R=Math.abs($.y-B.y),V=Math.abs(E.x-B.x),j=Math.abs(E.y-B.y);let X=K&&T>1?V/T:1,J=G&&R>1?j/R:1;X=Math.max(.5,Math.min(2,X)),J=Math.max(.5,Math.min(2,J)),o({x:X,y:J},B),$=E},Y=()=>{l.current=null,i(!1),window.removeEventListener("pointermove",N),window.removeEventListener("pointerup",Y),window.removeEventListener("pointercancel",Y)};window.addEventListener("pointermove",N),window.addEventListener("pointerup",Y),window.addEventListener("pointercancel",Y)},[b,o,i,M]),O=g.useCallback(D=>{D.stopPropagation(),D.preventDefault(),l.current="rotate",i(!0),d.current={...t};const A={x:t.centerX,y:t.centerY},B=M(D.clientX,D.clientY);let $=Math.atan2(B.y-A.y,B.x-A.x),K=0;const G=Y=>{const P=M(Y.clientX,Y.clientY),E=Math.atan2(P.y-A.y,P.x-A.x),T=E-$;$=E,K+=T,u(K),r(T,A)},N=()=>{l.current=null,i(!1),u(0),d.current=null,window.removeEventListener("pointermove",G),window.removeEventListener("pointerup",N),window.removeEventListener("pointercancel",N)};window.addEventListener("pointermove",G),window.addEventListener("pointerup",N),window.addEventListener("pointercancel",N)},[t,r,i,M]),z=D=>({nw:"nwse-resize",ne:"nesw-resize",sw:"nesw-resize",se:"nwse-resize",n:"ns-resize",s:"ns-resize",e:"ew-resize",w:"ew-resize",rotate:"grab"})[D],F=c*180/Math.PI;return L.jsxs("g",{className:"transform-box",transform:`rotate(${F} ${f.centerX} ${f.centerY})`,children:[L.jsxs("g",{style:{pointerEvents:"none"},children:[L.jsx("rect",{x:f.x,y:f.y,width:f.width,height:f.height,fill:"none",stroke:"rgba(0,0,0,0.15)",strokeWidth:S+2*n,strokeDasharray:`${4*n} ${2*n}`}),L.jsx("line",{x1:f.centerX,y1:f.y,x2:k.x,y2:k.y,stroke:"rgba(0,0,0,0.15)",strokeWidth:S+2*n}),L.jsx("circle",{cx:k.x,cy:k.y,r:p/2+y/2,fill:"none",stroke:"rgba(0,0,0,0.15)",strokeWidth:y+1*n}),["nw","ne","sw","se"].map(D=>{const A=C[D];return L.jsx("rect",{x:A.x-p/2-.5*n,y:A.y-p/2-.5*n,width:p+1*n,height:p+1*n,fill:"none",stroke:"rgba(0,0,0,0.15)",strokeWidth:y+1*n},`shadow-${D}`)}),L.jsx("rect",{x:w.n.x-h/2-.5*n,y:w.n.y-m/2-.5*n,width:h+1*n,height:m+1*n,fill:"none",stroke:"rgba(0,0,0,0.15)",strokeWidth:y+1*n,rx:2*n}),L.jsx("rect",{x:w.s.x-h/2-.5*n,y:w.s.y-m/2-.5*n,width:h+1*n,height:m+1*n,fill:"none",stroke:"rgba(0,0,0,0.15)",strokeWidth:y+1*n,rx:2*n}),L.jsx("rect",{x:w.w.x-m/2-.5*n,y:w.w.y-h/2-.5*n,width:m+1*n,height:h+1*n,fill:"none",stroke:"rgba(0,0,0,0.15)",strokeWidth:y+1*n,rx:2*n}),L.jsx("rect",{x:w.e.x-m/2-.5*n,y:w.e.y-h/2-.5*n,width:m+1*n,height:h+1*n,fill:"none",stroke:"rgba(0,0,0,0.15)",strokeWidth:y+1*n,rx:2*n})]}),L.jsx("rect",{x:f.x,y:f.y,width:f.width,height:f.height,fill:"none",stroke:"#000000",strokeWidth:S,strokeDasharray:`${4*n} ${2*n}`,style:{pointerEvents:"none"}}),L.jsx("line",{x1:f.centerX,y1:f.y,x2:k.x,y2:k.y,stroke:"#000000",strokeWidth:S,style:{pointerEvents:"none"}}),L.jsx("circle",{cx:k.x,cy:k.y,r:p/2,fill:"#ffffff",stroke:"#000000",strokeWidth:y,style:{cursor:z("rotate"),pointerEvents:"auto"},onPointerDown:O}),["nw","ne","sw","se"].map(D=>{const A=C[D];return L.jsx("rect",{x:A.x-p/2,y:A.y-p/2,width:p,height:p,fill:"#ffffff",stroke:"#000000",strokeWidth:y,style:{cursor:z(D),pointerEvents:"auto"},onPointerDown:B=>_(D,B)},D)}),L.jsx("rect",{x:w.n.x-h/2,y:w.n.y-m/2,width:h,height:m,fill:"#ffffff",stroke:"#000000",strokeWidth:y,rx:2*n,style:{cursor:z("n"),pointerEvents:"auto"},onPointerDown:D=>_("n",D)}),L.jsx("rect",{x:w.s.x-h/2,y:w.s.y-m/2,width:h,height:m,fill:"#ffffff",stroke:"#000000",strokeWidth:y,rx:2*n,style:{cursor:z("s"),pointerEvents:"auto"},onPointerDown:D=>_("s",D)}),L.jsx("rect",{x:w.w.x-m/2,y:w.w.y-h/2,width:m,height:h,fill:"#ffffff",stroke:"#000000",strokeWidth:y,rx:2*n,style:{cursor:z("w"),pointerEvents:"auto"},onPointerDown:D=>_("w",D)}),L.jsx("rect",{x:w.e.x-m/2,y:w.e.y-h/2,width:m,height:h,fill:"#ffffff",stroke:"#000000",strokeWidth:y,rx:2*n,style:{cursor:z("e"),pointerEvents:"auto"},onPointerDown:D=>_("e",D)})]})});us.displayName="TransformBox";const ds="assets/glass-distortion-_LuS5N21.png",fs="assets/film-grain-DrOmxrf9.png",ps="assets/chromatic-aberration-ob_MkQmW.png",hs="assets/progressive-blur-BnJCD7Dg.png",ms="assets/halftone-MFdv176y.png",gs="assets/pixelation-HSC8eb_d.png",vs="assets/watercolor-KGSx3-UY.png",xs="assets/vhs-DjWiu7QD.png",ys={glassDistortion:ds,filmGrain:fs,chromaticAberration:ps,progressiveBlur:hs,halftone:ms,pixelation:gs,watercolor:vs,vhs:xs},ws=[{type:"glassDistortion",label:"Glass Distortion"},{type:"filmGrain",label:"Film Grain"},{type:"chromaticAberration",label:"Chromatic Aberration"},{type:"progressiveBlur",label:"Progressive Blur"},{type:"halftone",label:"Halftone"},{type:"pixelation",label:"Pixelation"},{type:"watercolor",label:"Watercolor"},{type:"vhs",label:"VHS"}],bs=g.forwardRef(({onClose:t,style:n},e)=>{const o=q(i=>i.addEffect),r=i=>{o(i),t()};return L.jsx("div",{ref:e,className:"effects-popover",style:n,children:ws.map(i=>L.jsxs("button",{className:"effects-popover-item",onClick:()=>r(i.type),children:[L.jsx("img",{src:ys[i.type],alt:"",className:"effects-popover-item-icon"}),i.label]},i.type))})});bs.displayName="AddEffectPopover";var Ct={exports:{}},cn;function Cs(){return cn||(cn=1,(function(t){var n=(function(){var e=String.fromCharCode,o="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",r="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$",i={};function s(l,c){if(!i[l]){i[l]={};for(var u=0;u<l.length;u++)i[l][l.charAt(u)]=u}return i[l][c]}var a={compressToBase64:function(l){if(l==null)return"";var c=a._compress(l,6,function(u){return o.charAt(u)});switch(c.length%4){default:case 0:return c;case 1:return c+"===";case 2:return c+"==";case 3:return c+"="}},decompressFromBase64:function(l){return l==null?"":l==""?null:a._decompress(l.length,32,function(c){return s(o,l.charAt(c))})},compressToUTF16:function(l){return l==null?"":a._compress(l,15,function(c){return e(c+32)})+" "},decompressFromUTF16:function(l){return l==null?"":l==""?null:a._decompress(l.length,16384,function(c){return l.charCodeAt(c)-32})},compressToUint8Array:function(l){for(var c=a.compress(l),u=new Uint8Array(c.length*2),d=0,f=c.length;d<f;d++){var p=c.charCodeAt(d);u[d*2]=p>>>8,u[d*2+1]=p%256}return u},decompressFromUint8Array:function(l){if(l==null)return a.decompress(l);for(var c=new Array(l.length/2),u=0,d=c.length;u<d;u++)c[u]=l[u*2]*256+l[u*2+1];var f=[];return c.forEach(function(p){f.push(e(p))}),a.decompress(f.join(""))},compressToEncodedURIComponent:function(l){return l==null?"":a._compress(l,6,function(c){return r.charAt(c)})},decompressFromEncodedURIComponent:function(l){return l==null?"":l==""?null:(l=l.replace(/ /g,"+"),a._decompress(l.length,32,function(c){return s(r,l.charAt(c))}))},compress:function(l){return a._compress(l,16,function(c){return e(c)})},_compress:function(l,c,u){if(l==null)return"";var d,f,p={},h={},m="",x="",y="",S=2,C=3,w=2,k=[],b=0,M=0,_;for(_=0;_<l.length;_+=1)if(m=l.charAt(_),Object.prototype.hasOwnProperty.call(p,m)||(p[m]=C++,h[m]=!0),x=y+m,Object.prototype.hasOwnProperty.call(p,x))y=x;else{if(Object.prototype.hasOwnProperty.call(h,y)){if(y.charCodeAt(0)<256){for(d=0;d<w;d++)b=b<<1,M==c-1?(M=0,k.push(u(b)),b=0):M++;for(f=y.charCodeAt(0),d=0;d<8;d++)b=b<<1|f&1,M==c-1?(M=0,k.push(u(b)),b=0):M++,f=f>>1}else{for(f=1,d=0;d<w;d++)b=b<<1|f,M==c-1?(M=0,k.push(u(b)),b=0):M++,f=0;for(f=y.charCodeAt(0),d=0;d<16;d++)b=b<<1|f&1,M==c-1?(M=0,k.push(u(b)),b=0):M++,f=f>>1}S--,S==0&&(S=Math.pow(2,w),w++),delete h[y]}else for(f=p[y],d=0;d<w;d++)b=b<<1|f&1,M==c-1?(M=0,k.push(u(b)),b=0):M++,f=f>>1;S--,S==0&&(S=Math.pow(2,w),w++),p[x]=C++,y=String(m)}if(y!==""){if(Object.prototype.hasOwnProperty.call(h,y)){if(y.charCodeAt(0)<256){for(d=0;d<w;d++)b=b<<1,M==c-1?(M=0,k.push(u(b)),b=0):M++;for(f=y.charCodeAt(0),d=0;d<8;d++)b=b<<1|f&1,M==c-1?(M=0,k.push(u(b)),b=0):M++,f=f>>1}else{for(f=1,d=0;d<w;d++)b=b<<1|f,M==c-1?(M=0,k.push(u(b)),b=0):M++,f=0;for(f=y.charCodeAt(0),d=0;d<16;d++)b=b<<1|f&1,M==c-1?(M=0,k.push(u(b)),b=0):M++,f=f>>1}S--,S==0&&(S=Math.pow(2,w),w++),delete h[y]}else for(f=p[y],d=0;d<w;d++)b=b<<1|f&1,M==c-1?(M=0,k.push(u(b)),b=0):M++,f=f>>1;S--,S==0&&(S=Math.pow(2,w),w++)}for(f=2,d=0;d<w;d++)b=b<<1|f&1,M==c-1?(M=0,k.push(u(b)),b=0):M++,f=f>>1;for(;;)if(b=b<<1,M==c-1){k.push(u(b));break}else M++;return k.join("")},decompress:function(l){return l==null?"":l==""?null:a._decompress(l.length,32768,function(c){return l.charCodeAt(c)})},_decompress:function(l,c,u){var d=[],f=4,p=4,h=3,m="",x=[],y,S,C,w,k,b,M,_={val:u(0),position:c,index:1};for(y=0;y<3;y+=1)d[y]=y;for(C=0,k=Math.pow(2,2),b=1;b!=k;)w=_.val&_.position,_.position>>=1,_.position==0&&(_.position=c,_.val=u(_.index++)),C|=(w>0?1:0)*b,b<<=1;switch(C){case 0:for(C=0,k=Math.pow(2,8),b=1;b!=k;)w=_.val&_.position,_.position>>=1,_.position==0&&(_.position=c,_.val=u(_.index++)),C|=(w>0?1:0)*b,b<<=1;M=e(C);break;case 1:for(C=0,k=Math.pow(2,16),b=1;b!=k;)w=_.val&_.position,_.position>>=1,_.position==0&&(_.position=c,_.val=u(_.index++)),C|=(w>0?1:0)*b,b<<=1;M=e(C);break;case 2:return""}for(d[3]=M,S=M,x.push(M);;){if(_.index>l)return"";for(C=0,k=Math.pow(2,h),b=1;b!=k;)w=_.val&_.position,_.position>>=1,_.position==0&&(_.position=c,_.val=u(_.index++)),C|=(w>0?1:0)*b,b<<=1;switch(M=C){case 0:for(C=0,k=Math.pow(2,8),b=1;b!=k;)w=_.val&_.position,_.position>>=1,_.position==0&&(_.position=c,_.val=u(_.index++)),C|=(w>0?1:0)*b,b<<=1;d[p++]=e(C),M=p-1,f--;break;case 1:for(C=0,k=Math.pow(2,16),b=1;b!=k;)w=_.val&_.position,_.position>>=1,_.position==0&&(_.position=c,_.val=u(_.index++)),C|=(w>0?1:0)*b,b<<=1;d[p++]=e(C),M=p-1,f--;break;case 2:return x.join("")}if(f==0&&(f=Math.pow(2,h),h++),d[M])m=d[M];else if(M===p)m=S+S.charAt(0);else return null;x.push(m),d[p++]=S+m.charAt(0),f--,S=m,f==0&&(f=Math.pow(2,h),h++)}}};return a})();t!=null?t.exports=n:typeof angular<"u"&&angular!=null&&angular.module("LZString",[]).factory("LZString",function(){return n})})(Ct)),Ct.exports}var In=Cs();function Xs(t){const n=JSON.stringify(t,(e,o)=>typeof o=="number"?Math.round(o*1e4)/1e4:o);return In.compressToEncodedURIComponent(n)}function Ks(t){try{const n=In.decompressFromEncodedURIComponent(t);return n?JSON.parse(n):null}catch{return null}}export{Xs as A,rs as B,$r as C,Ls as D,Vs as E,Mr as F,Us as G,Ms as H,Mt as I,Ds as J,zs as K,ys as L,cs as M,Is as N,bs as O,Ns as P,re as Q,Hs as R,Fr as S,us as T,$s as a,kt as b,Es as c,Ks as d,tt as e,nt as f,vr as g,Ge as h,lr as i,Rs as j,Ts as k,_s as l,Bs as m,js as n,xo as o,Ps as p,Os as q,Gs as r,As as s,Fs as t,q as u,is as v,ls as w,os as x,Yr as y,Co as z};
