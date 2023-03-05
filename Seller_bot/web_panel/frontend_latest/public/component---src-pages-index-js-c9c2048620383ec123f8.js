"use strict";(self.webpackChunkwhatstore_merchant_panel=self.webpackChunkwhatstore_merchant_panel||[]).push([[634],{2719:function(e,t,n){n.d(t,{Z:function(){return y}});var r=n(5987),a=n(4942),o=n(5900),c=n.n(o),i=n(7294),s=n(8870),l=n(9541),u=n(4709),f=i.createContext(null);f.displayName="InputGroupContext";var p=f,m=n(5893),d=["bsPrefix","size","hasValidation","className","as"];function g(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function b(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?g(Object(n),!0).forEach((function(t){(0,a.Z)(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):g(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}var v=(0,s.Z)("input-group-text",{Component:"span"}),h=i.forwardRef((function(e,t){var n=e.bsPrefix,a=e.size,o=e.hasValidation,s=e.className,u=e.as,f=void 0===u?"div":u,g=(0,r.Z)(e,d);n=(0,l.vE)(n,"input-group");var v=(0,i.useMemo)((function(){return{}}),[]);return(0,m.jsx)(p.Provider,{value:v,children:(0,m.jsx)(f,b(b({ref:t},g),{},{className:c()(s,n,a&&"".concat(n,"-").concat(a),o&&"has-validation")}))})}));h.displayName="InputGroup";var y=Object.assign(h,{Text:v,Radio:function(e){return(0,m.jsx)(v,{children:(0,m.jsx)(u.Z,b({type:"radio"},e))})},Checkbox:function(e){return(0,m.jsx)(v,{children:(0,m.jsx)(u.Z,b({type:"checkbox"},e))})}})},3114:function(e,t,n){var r=n(4942),a=n(5987),o=n(5900),c=n.n(o),i=n(7294),s=n(9541),l=n(5893),u=["bsPrefix","variant","animation","size","as","className"];function f(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function p(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?f(Object(n),!0).forEach((function(t){(0,r.Z)(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):f(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}var m=i.forwardRef((function(e,t){var n=e.bsPrefix,r=e.variant,o=e.animation,i=e.size,f=e.as,m=void 0===f?"div":f,d=e.className,g=(0,a.Z)(e,u);n=(0,s.vE)(n,"spinner");var b="".concat(n,"-").concat(o);return(0,l.jsx)(m,p(p({ref:t},g),{},{className:c()(d,b,i&&"".concat(b,"-").concat(i),r&&"text-".concat(r))}))}));m.displayName="Spinner",t.Z=m},8161:function(e,t,n){n.d(t,{Z:function(){return p}});var r=n(7294),a=n(310),o=n(6594),c=n(1597),i=n(1951),s=n(9029),l={height:65,color:"rgb(238, 238, 238)",display:"grid",gridTemplateColumns:"1fr 6fr 1fr",padding:"0.6rem",placeItems:"center",background:"rgba(0,103,86,255)",boxShadow:"0 8px 32px 0 rgba(0,103,86,255)",backdropFilter:"blur( 16.5px )",fontFamily:"sans-serif",fontWeight:"700"},u={display:"flex",alignItems:"flex-end"},f={width:"2.5rem",margin:"0 10px"};function p(e){var t=e.button_text,n=e.button_action;if(s.j){var p=(0,r.useState)({text:t,action:n}),m=p[0];p[1];return(0,r.useEffect)((function(){if(s.j){var e=localStorage.getItem("CSRF_token");"undefined"!==e&&"null"!==e&&e||location.href.includes("login")||location.href.includes("signup")||(0,c.navigate)("/login"),e&&(0,i.T)().then((function(e){if(e.success){var t=JSON.parse(localStorage.store_);t.email=e.email,t.number=e.number,localStorage.setItem("store_",JSON.stringify(t)),(location.href.includes("login")||location.href.includes("signup"))&&(0,c.navigate)("/products/")}else"/login/"!==location.pathname&&"/signup/"!==location.pathname&&(0,c.navigate)("/login/")})).catch((function(e){console.log(e.data)}))}}),[]),console.log(m),r.createElement("header",null,r.createElement("nav",{style:l},r.createElement("div",{style:u},r.createElement("img",{src:a.Z,style:f}),r.createElement("span",null,"Redcat")),r.createElement("div",null),r.createElement(o.Z,{variant:"outline-light",onClick:m.action},m.text)))}}},8678:function(e,t,n){n.d(t,{Z:function(){return a}});var r=n(7294);function a(e){var t=e.children;return r.createElement("div",null,t)}},1226:function(e,t,n){n.d(t,{Z:function(){return v}});var r=n(5861),a=n(4687),o=n.n(a),c=n(7294),i=n(6594),s=n(2957),l=n(2729),u=n(2719),f=n(3114),p=n(1951),m=n(1597),d={width:"60%",minWidth:"300px",maxWidth:"550px",height:"350px",padding:"30px",display:"flex",flexFlow:"column",justifyContent:"space-evenly",borderRadius:"12px",boxShadow:"#4f49 0px 1px 16px 1px"},g={margin:3},b={color:"red",fontSize:14,marginLeft:12};function v(){var e=(0,c.useState)(""),t=e[0],n=e[1],a=(0,c.useState)(""),v=a[0],h=a[1],y=(0,c.useState)(""),x=y[0],w=y[1],O=(0,c.useState)(""),j=O[0],E=O[1],S=(0,c.useState)(""),P=S[0],k=S[1],Z=(0,c.useState)(!1),C=Z[0],N=Z[1],_=(0,c.useState)(),I=_[0],D=_[1],R=(0,c.useState)(),z=R[0],F=R[1];(0,c.useEffect)((function(){I&&localStorage.setItem("store_",JSON.stringify(Object.assign({},I)))}),[I]),(0,c.useEffect)((function(){z&&(localStorage.setItem("CSRF_token",z),(0,m.navigate)("/products"))}),[z]);var L=function(){var e=(0,r.Z)(o().mark((function e(t){var n,r,a,c,i,s,l,u;return o().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=t.number,r=t.password,w(""),E(""),k(""),N(!0),e.next=7,(0,p.Lo)({number:n,password:r});case 7:if(a=e.sent,console.log(a),!0===a.success){e.next=18;break}if("user"!==a.type){e.next=12;break}return e.abrupt("return",w(a.msg));case 12:if("password"!==a.type){e.next=14;break}return e.abrupt("return",E(a.msg));case 14:if("error"!==a.type){e.next=16;break}return e.abrupt("return",k("Couldn't connect to server"));case 16:e.next=22;break;case 18:F(a.token),c=a.seller_id,i=a.name,s=a.email,l=a.number,u=a.currency,D({seller_id:c,shop_name:i,email:s,number:l,currency:u});case 22:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}();return c.createElement("div",{style:d,onKeyDown:function(e){13===e.keyCode?L({number:t,password:v}):console.log(e.keyCode)}},c.createElement("h3",{style:g},"Login"),c.createElement(u.Z,{className:"mb-3"},c.createElement(u.Z.Text,{id:"basic-addon1",style:{maxHeight:"3.6rem"}},"+"),c.createElement(l.Z,{controlId:"floatingInput",label:"Whatsapp Number",className:"mb-3"},c.createElement(s.Z.Control,{type:"number",onChange:function(e){return n(e.target.value)},placeholder:"Area Code & Phone number"}),c.createElement("p",{class:"form-error",style:b},x))),c.createElement(l.Z,{controlId:"floatingPassword",label:"Password"},c.createElement(s.Z.Control,{type:"password",onChange:function(e){return h(e.target.value)},placeholder:"Password"}),c.createElement("p",{class:"form-error",style:b},j),c.createElement("p",{class:"form-error",style:b},P)),c.createElement(i.Z,{variant:"primary",onClick:function(){return L({number:t,password:v})}},"Login  ",C?c.createElement(f.Z,{variant:"warning",animation:"border",style:{marginLeft:10,width:"1rem",height:"1rem"}}):null))}},6558:function(e,t,n){n.r(t),n.d(t,{Head:function(){return o}});var r=n(7294),a=(n(8678),n(1226),n(8161),n(1597));t.default=function(){return"undefined"!=typeof window?(0,a.navigate)("/signup"):null};var o=function(){return r.createElement("title",null,"Home Page")}}}]);
//# sourceMappingURL=component---src-pages-index-js-c9c2048620383ec123f8.js.map