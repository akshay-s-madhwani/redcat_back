"use strict";(self.webpackChunkwhatstore_merchant_panel=self.webpackChunkwhatstore_merchant_panel||[]).push([[96],{3114:function(e,t,n){var r=n(4942),a=n(5987),c=n(5900),o=n.n(c),i=n(7294),s=n(9541),l=n(5893),u=["bsPrefix","variant","animation","size","as","className"];function p(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function f(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?p(Object(n),!0).forEach((function(t){(0,r.Z)(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):p(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}var m=i.forwardRef((function(e,t){var n=e.bsPrefix,r=e.variant,c=e.animation,i=e.size,p=e.as,m=void 0===p?"div":p,v=e.className,d=(0,a.Z)(e,u);n=(0,s.vE)(n,"spinner");var h="".concat(n,"-").concat(c);return(0,l.jsx)(m,f(f({ref:t},d),{},{className:o()(v,h,i&&"".concat(h,"-").concat(i),r&&"text-".concat(r))}))}));m.displayName="Spinner",t.Z=m},7792:function(e,t,n){n.r(t),n.d(t,{default:function(){return y}});var r=n(5861),a=n(4687),c=n.n(a),o=n(7294),i=n(3114),s=n(2957),l=n(2729),u=n(6594),p=n(1951),f=n(1597),m={display:"grid",placeItems:"center",height:"100vh"},v={width:"50rem",height:"20rem",borderRadius:10,padding:"1rem",boxShadow:"#4f49 0px 1px 16px 1px"},d={display:"flex",flexFlow:"column",alignItems:"center"},h={color:"red",fontSize:14,marginLeft:12};function y(){var e=(0,o.useState)(!1),t=e[0],n=e[1],a=(0,o.useState)(""),y=a[0],g=a[1],b=(0,o.useState)(""),O=b[0],w=b[1],E=function(e){e.preventDefault(),e.stopPropagation()};(0,o.useEffect)((function(){(0,p.vB)().then((function(e){e.success||(0,f.navigate)("/login")})).catch((function(e){(0,f.navigate)("/login")}))}),[]);var x=function(){var e=(0,r.Z)(c().mark((function e(){var t;return c().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,(0,p.qD)(y);case 3:(t=e.sent).success||w(t.msg),n(!1),setTimeout((function(){(0,f.navigate)("/dashboard")}),1500),e.next=12;break;case 9:e.prev=9,e.t0=e.catch(0),console.trace(e.t0);case 12:case"end":return e.stop()}}),e,null,[[0,9]])})));return function(){return e.apply(this,arguments)}}();return o.createElement("div",{style:m},o.createElement(s.Z,{noValidate:!0,onSubmit:function(){return E},validated:!1,onKeyDown:function(e){return"Enter"===e.key?x():null},controlId:"formGroup",className:"mb-3",style:v},o.createElement("h3",{style:{textAlign:"center"}},"Please verify to proceed"),o.createElement("h4",{style:{textAlign:"center",marginBottom:"1rem"}},"You will receive an OTP in your Whatsapp"),t?o.createElement("div",{style:{display:"grid",placeItems:"center",height:"70%"}},o.createElement(i.Z,{variant:"primary",animation:"border"})):o.createElement("div",{style:d},o.createElement(l.Z,{controlId:"floatingInput",label:"Enter OTP"},o.createElement(s.Z.Control,{onChange:function(e){return g(e.target.value)},placeholder:"OTP"}),o.createElement("p",{className:"form-error",style:h},O)),o.createElement(u.Z,{variant:"primary",onClick:x},"Verify"))))}}}]);
//# sourceMappingURL=component---src-pages-verify-js-ed92281c761de62df2eb.js.map