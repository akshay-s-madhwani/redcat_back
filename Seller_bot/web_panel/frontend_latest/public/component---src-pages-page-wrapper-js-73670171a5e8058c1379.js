"use strict";(self.webpackChunkwhatstore_merchant_panel=self.webpackChunkwhatstore_merchant_panel||[]).push([[567],{8500:function(e,t,n){n.d(t,{q:function(){return f}});var r=n(5893),i=n(7294),o=n(5900),a=n.n(o);function l(e,t){if(!t)return e;var n=Object.prototype.hasOwnProperty;return Object.keys(t).reduce((function(r,i){return n.call(t,i)&&t[i]&&(r="".concat(r," ").concat(e,"--").concat(i)),r}),e)}var c,s=function(){return s=Object.assign||function(e){for(var t,n=1,r=arguments.length;n<r;n++)for(var i in t=arguments[n])Object.prototype.hasOwnProperty.call(t,i)&&(e[i]=t[i]);return e},s.apply(this,arguments)},d=function(e,t){var n={};for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&t.indexOf(r)<0&&(n[r]=e[r]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var i=0;for(r=Object.getOwnPropertySymbols(e);i<r.length;i++)t.indexOf(r[i])<0&&Object.prototype.propertyIsEnumerable.call(e,r[i])&&(n[r[i]]=e[r[i]])}return n},u=(c="rmd-icon",function(e,t){return e?"string"!=typeof e?l(c,e):l("".concat(c,"__").concat(e),t):c}),f=(0,i.forwardRef)((function(e,t){var n=e["aria-hidden"],i=void 0===n||n,o=e.focusable,l=void 0===o?"false":o,c=e.xmlns,f=void 0===c?"http://www.w3.org/2000/svg":c,g=e.viewBox,m=void 0===g?"0 0 24 24":g,p=e.dense,v=void 0!==p&&p,h=e.className,y=e.use,x=e.children,b=d(e,["aria-hidden","focusable","xmlns","viewBox","dense","className","use","children"]),w=x;return!w&&y&&(w=(0,r.jsx)("use",{xlinkHref:y})),(0,r.jsx)("svg",s({},b,{"aria-hidden":i,ref:t,className:a()(u({svg:!0,dense:v}),h),focusable:l,xmlns:f,viewBox:m},{children:w}))}))},2933:function(e,t,n){n.d(t,{Y:function(){return k}});var r=n(5893),i=n(7294),o=n(8500),a=function(){return a=Object.assign||function(e){for(var t,n=1,r=arguments.length;n<r;n++)for(var i in t=arguments[n])Object.prototype.hasOwnProperty.call(t,i)&&(e[i]=t[i]);return e},a.apply(this,arguments)},l=(0,i.forwardRef)((function(e,t){return(0,r.jsx)(o.q,a({},e,{ref:t},{children:(0,r.jsx)("path",{d:"M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"})}))})),c=n(310),s=n(1597),d=n(6594),u=n(1951),f={position:"fixed",background:"rgba(0,103,86,255)",boxShadow:"0 8px 32px 0 rgba(0,103,86,255)",backdropFilter:"blur( 16.5px )",width:"11rem",height:"calc(100vw)",padding:"0px 20px",display:"flex",flexFlow:"column",alignItems:"stretch"},g={display:"flex",alignItems:"flex-end",marginTop:"2rem",color:"#fff"},m={width:"2.5rem",margin:"0 10px"},p={display:"flex",flexFlow:"column",alignItems:"stretch",padding:15},v={display:"flex",justifyContent:"center",alignItems:"center",width:"8rem",height:"8rem"},h={padding:"1rem",border:"1px solid  rgb(42 38 42 / 81%)",borderRadius:"50%",width:"7rem"},y={display:"flex",flexFlow:"column",justifyContent:"space-between",margin:"1rem 0"},x={color:"#eee",textAlign:"center",fontWeight:550,fontSize:".85rem"},b={textRendering:"optimizeLegibility",margin:"10px 0",cursor:"pointer"},w={border:" 2px solid #fff",textRendering:"optimizeLegibility",borderRadius:10,margin:"10px 0",background:"#eee",color:"#222"},E={color:"#eee",textAlign:"center",fontWeight:670},O=Object.assign({},E,{margin:"10px 0"}),S=Object.assign({},O,{color:"#222"});function k(e){var t=e.selected,n=(0,i.useState)(t),r=(n[0],n[1],(0,i.useState)({shop_name:"",city:"",profile_picture:""})),o=r[0],a=r[1],k=(0,i.useState)({text:"",action:""}),j=k[0],_=k[1];return(0,i.useEffect)((function(){_({text:"Login",action:function(){localStorage.removeItem("CSRF_token"),(0,s.navigate)("/login")}});var e=localStorage.getItem("store_");e&&"object"==typeof e&&a(Object.assign({},JSON.parse(e)))}),[]),(0,i.useEffect)((function(){var e=localStorage.getItem("CSRF_token");"undefined"!==e&&"null"!==e&&e||(0,s.navigate)("/login"),e&&e&&(0,u.T)().then((function(e){if(!e){if(location.href.includes("signup"))return void _({text:"Login",action:function(){localStorage.removeItem("CSRF_token"),(0,s.navigate)("/login")}});if(location.href.includes("login"))return void _({text:"Sign up",action:function(){localStorage.removeItem("CSRF_token"),(0,s.navigate)("/signup")}})}if(e.success||(0,s.navigate)("/login"),e.success){var t=JSON.parse(localStorage.store_);t.email=e.email,t.number=e.number,localStorage.setItem("store_",JSON.stringify(t)),_((function(e){return{text:"Logout",action:function(){localStorage.removeItem("CSRF_token"),(0,s.navigate)("/login")}}})),(location.href.includes("login")||location.href.includes("signup"))&&console.log("navigating to products")}})).catch((function(e){console.log(e.data)}))}),[]),i.createElement("div",{style:f},i.createElement("div",{style:g},i.createElement("img",{src:c.Z,style:m}),i.createElement("span",null,"watstore")),i.createElement("div",{style:y},i.createElement("div",{style:v},i.createElement(l,{style:h})),i.createElement("p",{style:E},o.shop_name),i.createElement("p",{style:x},o.city)),i.createElement("div",{style:p},i.createElement("div",{id:"links",style:"home"==t?w:b},i.createElement("p",{style:"home"==t?S:O,onClick:function(){return(0,s.navigate)("/dashboard")}},"Home"),i.createElement("div",{id:"underline"})),i.createElement("div",{id:"links",style:"products"==t?w:b},i.createElement("p",{style:"products"==t?S:O,onClick:function(){return(0,s.navigate)("/products")}},"Products"),i.createElement("div",{id:"underline"})),i.createElement("div",{id:"links",style:"orders"==t?w:b},i.createElement("p",{style:"orders"==t?S:O,onClick:function(){return(0,s.navigate)("/orders")}},"Orders"),i.createElement("div",{id:"underline"}))),i.createElement(d.Z,{variant:"outline-light",style:{marginTop:"5rem"},onClick:j.action},j.text))}},8685:function(e,t,n){n.r(t),n.d(t,{default:function(){return a}});var r=n(7294),i=n(2933),o={display:"flex",height:"calc(100vh)",background:"rgb(245, 241, 227)"};function a(e){var t=e.pageName,n=e.children;return"undefined"!=typeof window?r.createElement("div",{id:"wrapper",style:o},r.createElement(i.Y,{selected:t}),r.createElement("div",{style:{flexGrow:2,flexFlow:"column",alignItems:"flex-start",paddingLeft:"11rem",overflowY:"auto",width:"100vw",height:"100vh"}},n)):null}}}]);
//# sourceMappingURL=component---src-pages-page-wrapper-js-73670171a5e8058c1379.js.map