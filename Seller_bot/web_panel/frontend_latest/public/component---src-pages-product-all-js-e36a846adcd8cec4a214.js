"use strict";(self.webpackChunkwhatstore_merchant_panel=self.webpackChunkwhatstore_merchant_panel||[]).push([[914],{994:function(e,t,n){var l=n(4942),r=n(5987),a=n(5900),o=n.n(a),c=n(7294),i=n(9541),s=n(5893),u=["bsPrefix","className","as"];function d(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);t&&(l=l.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,l)}return n}function m(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?d(Object(n),!0).forEach((function(t){(0,l.Z)(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):d(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}var f=c.forwardRef((function(e,t){var n=e.bsPrefix,l=e.className,a=e.as,c=void 0===a?"div":a,d=(0,r.Z)(e,u),f=(0,i.vE)(n,"row"),p=(0,i.pi)(),g=(0,i.zG)(),h="".concat(f,"-cols"),E=[];return p.forEach((function(e){var t,n=d[e];delete d[e],t=null!=n&&"object"==typeof n?n.cols:n;var l=e!==g?"-".concat(e):"";null!=t&&E.push("".concat(h).concat(l,"-").concat(t))})),(0,s.jsx)(c,m(m({ref:t},d),{},{className:o().apply(void 0,[l,f].concat(E))}))}));f.displayName="Row",t.Z=f},3114:function(e,t,n){var l=n(4942),r=n(5987),a=n(5900),o=n.n(a),c=n(7294),i=n(9541),s=n(5893),u=["bsPrefix","variant","animation","size","as","className"];function d(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);t&&(l=l.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,l)}return n}function m(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?d(Object(n),!0).forEach((function(t){(0,l.Z)(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):d(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}var f=c.forwardRef((function(e,t){var n=e.bsPrefix,l=e.variant,a=e.animation,c=e.size,d=e.as,f=void 0===d?"div":d,p=e.className,g=(0,r.Z)(e,u);n=(0,i.vE)(n,"spinner");var h="".concat(n,"-").concat(a);return(0,s.jsx)(f,m(m({ref:t},g),{},{className:o()(p,h,c&&"".concat(h,"-").concat(c),l&&"text-".concat(l))}))}));f.displayName="Spinner",t.Z=f},3423:function(e,t,n){n.d(t,{Z:function(){return c}});var l=n(2982),r=(n(6636),n(7294)),a=n(8169),o=n(2957);n(9717);function c(e){var t=e.editable,n=e.setEditable,c=e.products,i=(e.setProducts,e.checked),s=e.setChecked,u=(e.tab,e.setEditingInto);(0,r.useEffect)((function(){n([])}),[]);return(0,r.useEffect)((function(){console.log(c),console.log(t),t.length?(1===t.length?u(t[0]):u(),i||s(!0)):s(!1)}),[t]),r.createElement("div",{style:{width:"90vw",overflowX:"auto"}},r.createElement(a.Z,{hover:!0,style:{margin:"1rem 0"}},r.createElement("thead",null,r.createElement("tr",null,r.createElement("th",null),r.createElement("th",null,"No."),r.createElement("th",null,"Status"),r.createElement("th",null,"Image"),r.createElement("th",null,"Title"),r.createElement("th",null,"Price"),r.createElement("th",null,"Regular price"),r.createElement("th",null,"Stock"),r.createElement("th",null,"Category"),r.createElement("th",null,"Description"),r.createElement("th",null,"Colors"),r.createElement("th",null,"Sizes"),r.createElement("th",null,"Variations"))),r.createElement("tbody",null,c.length?c.map((function(e,a){return e?r.createElement("tr",null,r.createElement("td",{"data-key":e._id},r.createElement(o.Z.Check,{type:"checkbox",style:{width:"1.5rem",height:"1.5rem"},"data-key":e._id,onClick:function(e){return function(e){var r=e.target.dataset.key;console.log(e.target.checked),e.target.checked?t.includes(r)||n((function(e){return[r].concat((0,l.Z)(e))})):n((function(e){var t=e.filter((function(e){return e!==r}));return console.log("old_editables",t),(0,l.Z)(t)}))}(e)}})),r.createElement("td",null,a),r.createElement("td",null,e.status?e.status:"private"),e.imageData||e.image?r.createElement("td",{style:{width:185,display:"block",paddingBottom:12,marginRight:"-1rem"}},r.createElement("img",{src:e.imageData||e.image,style:{maxWidth:150,minWidth:120,borderRadius:10,maxHeight:190,minHeight:160},alt:e.title})):r.createElement("td",null,e.image.replace("./static/images/",""),r.createElement("br",null),r.createElement("span",{style:{border:"#e11",color:"red"}},"Image Required ",console.log(e))),r.createElement("td",{style:{marginLeft:"1rem"}},r.createElement("b",null,e.title)),r.createElement("td",null,e.price),r.createElement("td",null,e.originalPrice),r.createElement("td",null,e.stock),r.createElement("td",null,e.category),r.createElement("td",{style:{padding:"0.5rem 0.2rem"}},r.createElement("div",{style:{width:"190px",height:160,background:"transparent",border:0,resize:"both",overflow:"auto"}},e.description)),r.createElement("td",null,e.colors),r.createElement("td",null,e.sizes),r.createElement("td",null,e.variations)):r.createElement("p",null,"No Products Found")})):null)))}},2167:function(e,t,n){n.r(t),n.d(t,{default:function(){return w}});var l=n(2982),r=n(7294),a=n(6594),o=n(6746),c=n(4650),i=n(3114),s=n(1984),u=n(8678),d=n(1372),m=n(9717),f=n(3423),p=n(6636),g=(n(1597),n(994)),h=n(7408),E={display:"flex",height:"calc(100vh)",background:"#fff"},v={flexGrow:2,flexFlow:"column",alignItems:"flex-start",paddingLeft:"12.5rem",overflowY:"auto",width:"100vw",height:"100vh"},y={flexGrow:2,flexFlow:"column",alignItems:"flex-start",paddingLeft:"6.5rem",overflowY:"auto",width:"100vw",height:"100vh"},b={position:"fixed",top:75,right:20,display:"flex",justifyContent:"space-between",padding:"1rem"};function w(){if("undefined"!=typeof window){var e=localStorage.getItem("collapsed"),t=(0,r.useState)(!0),n=t[0],w=t[1],O=(0,r.useState)([]),P=O[0],k=O[1],Z=(0,r.useState)(!1),j=(Z[0],Z[1],(0,r.useState)(null)),x=(j[0],j[1]),S=(0,r.useState)(!1),C=S[0],I=S[1],_=(0,r.useState)([]),N=_[0],D=_[1],R=(0,r.useState)("all"),z=R[0],A=R[1],K=(0,r.useState)(!1),L=K[0],F=K[1],T=(0,r.useState)("true"===e),G=T[0],Y=T[1];(0,r.useEffect)((function(){if(w(!0),"all"===z){F(!0);var e=JSON.parse(localStorage.getItem("store_"));if(!e||"undefined"===e)return console.log("store_"),w(!1);var t=JSON.parse(localStorage.getItem("store_")).seller_id;if(!t||"undefined"===t)return console.log("seller_id"),w(!1);(0,m.Rq)(t).then((function(e){console.log(e),F(!1),e&&(w(!0),console.log(n),k(e),console.log(e)),e&&Object.keys(e).length||(console.log("object keys"),w(!1))})).catch((function(e){console.log(e)}))}else k([])}),[]),(0,r.useEffect)((function(){console.log(P)}),[P]);return(0,r.useEffect)((function(){console.log(N)}),[N]),r.createElement(u.Z,null,r.createElement("div",{id:"wrapper",style:E},r.createElement(d.Y,{selected:"products",collapsed:G,setCollapsed:Y}),n?null:r.createElement("div",{style:{width:"100%",height:"100%",pointerEvents:"none",position:"absolute",display:"grid",placeItems:"center"}},r.createElement("p",null,"No Products Found")),L?r.createElement("div",{style:{width:"100%",height:"100%",pointerEvents:"none",position:"absolute",display:"grid",placeItems:"center"}},r.createElement(i.Z,{variant:"primary",animation:"border"})):null,r.createElement("div",{style:G?v:y},C?r.createElement("div",{style:b},r.createElement("div",{onClick:function(e){!function(e){p.Confirm.show("Are you Sure","Confirm to delete<br/><sub>p.s. It cannot be undone</sub>","Delete","Cancel",(function(){N.length&&(N.map((function(t,n){var r=P.filter((function(e,n){if(e._id===t)return e._id}))[0];console.log(r),(0,m.Kr)(r._id).then((function(e){})).catch((function(e){return console.log(e)})),console.log(t);var a=P.filter((function(e){return e._id!==t}));return k((0,l.Z)(a)),D([]),e.target.value="false",t})),F(!0),setTimeout((function(){return location.reload()}),2500))}),(function(){}),{plainText:!1}),k((function(e){var t=e;return console.log(t),(0,l.Z)(t)}))}(e)}},r.createElement(a.Z,{variant:"danger",style:{margin:"0 1.5rem"}},r.createElement(s.e,{style:{width:22,fill:"#fff"}}),"Delete"))):null,r.createElement("h3",{style:{marginTop:"2rem"}},"Manage Products"),r.createElement("p",null,"Convenient and simple way to Edit or Add new Products to the Inventory"),r.createElement(o.Z.Container,{defaultActiveKey:"all",onSelect:function(e){return A(e)}},r.createElement(c.Z,{variant:"tabs",className:"flex-column"},r.createElement(g.Z,{style:{marginBottom:"-22px"}},r.createElement(h.Z,{sm:2},r.createElement(c.Z.Item,null,r.createElement(c.Z.Link,{eventKey:"all",title:"All Items",bsPrefix:"nav-link"},"All Products"))),r.createElement(h.Z,{sm:2},r.createElement(c.Z.Item,null,r.createElement(c.Z.Link,{href:"/product/upload/",eventKey:"upload",bsPrefix:"nav-link"},"Add Items"))))),r.createElement(o.Z.Content,null,r.createElement(o.Z.Pane,{eventKey:"all"},r.createElement(f.Z,{products:P,setProducts:k,editable:N,setEditable:D,checked:C,setChecked:I,setEditingInto:x})),r.createElement(o.Z.Pane,{eventKey:"first"}))))))}return null}}}]);
//# sourceMappingURL=component---src-pages-product-all-js-e36a846adcd8cec4a214.js.map