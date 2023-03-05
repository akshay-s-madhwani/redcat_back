"use strict";(self.webpackChunkwhatstore_merchant_panel=self.webpackChunkwhatstore_merchant_panel||[]).push([[832],{4280:function(e,t,n){n.d(t,{G:function(){return u},Q:function(){return o}});var r=n(5861),l=n(4687),a=n.n(l),c=n(448),o=function(){var e=(0,r.Z)(a().mark((function e(t){var n,r,l;return a().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return void 0===t&&(t=0),e.prev=1,n=JSON.parse(localStorage.getItem("store_")),r=n.seller_id,e.next=5,fetch(c.D.DOMAIN+"/orders/"+r+"/10/"+t);case 5:return l=e.sent,e.next=8,l.json();case 8:return l=e.sent,e.abrupt("return",l);case 12:throw e.prev=12,e.t0=e.catch(1),console.log(e.t0),e.t0;case 16:case"end":return e.stop()}}),e,null,[[1,12]])})));return function(t){return e.apply(this,arguments)}}(),u=function(){var e=(0,r.Z)(a().mark((function e(t,n,r,l){var o;return a().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,fetch(c.D.DOMAIN+"/order/"+t+"/"+n+"/"+r+"/"+l,{method:"PUT","content-type":"application/json"});case 3:return o=e.sent,e.next=6,o.json();case 6:return o=e.sent,console.log(o),e.abrupt("return",o);case 11:return e.prev=11,e.t0=e.catch(0),console.log(e.t0),e.abrupt("return",{data:"error"});case 15:case"end":return e.stop()}}),e,null,[[0,11]])})));return function(t,n,r,l){return e.apply(this,arguments)}}()},5031:function(e,t,n){n.r(t),n.d(t,{default:function(){return M}});var r=n(5861),l=n(2982),a=n(4687),c=n.n(a),o=n(7294),u=n(8678),i=(n(9051),n(2933)),s=n(2511),m=n(6746),d=n(9655),p=n(4280),E=n(8169),v=n(6594),f=n(2957),h=n(5987),g=n(4942),y=n(5900),b=n.n(y),x=n(8870),w=n(9541),_=n(4709),S=o.createContext(null);S.displayName="InputGroupContext";var O=S,j=n(5893),k=["bsPrefix","size","hasValidation","className","as"];function Z(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function N(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?Z(Object(n),!0).forEach((function(t){(0,g.Z)(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):Z(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}var C=(0,x.Z)("input-group-text",{Component:"span"}),A=o.forwardRef((function(e,t){var n=e.bsPrefix,r=e.size,l=e.hasValidation,a=e.className,c=e.as,u=void 0===c?"div":c,i=(0,h.Z)(e,k);n=(0,w.vE)(n,"input-group");var s=(0,o.useMemo)((function(){return{}}),[]);return(0,j.jsx)(O.Provider,{value:s,children:(0,j.jsx)(u,N(N({ref:t},i),{},{className:b()(a,n,r&&"".concat(n,"-").concat(r),l&&"has-validation")}))})}));A.displayName="InputGroup";var D=Object.assign(A,{Text:C,Radio:function(e){return(0,j.jsx)(C,{children:(0,j.jsx)(_.Z,N({type:"radio"},e))})},Checkbox:function(e){return(0,j.jsx)(C,{children:(0,j.jsx)(_.Z,N({type:"checkbox"},e))})}}),I=n(8500),P=function(){return P=Object.assign||function(e){for(var t,n=1,r=arguments.length;n<r;n++)for(var l in t=arguments[n])Object.prototype.hasOwnProperty.call(t,l)&&(e[l]=t[l]);return e},P.apply(this,arguments)},R=(0,o.forwardRef)((function(e,t){return(0,j.jsx)(I.q,P({},e,{ref:t},{children:(0,j.jsx)("path",{d:"M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"})}))}));function z(e,t){var n="undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(n)return(n=n.call(e)).next.bind(n);if(Array.isArray(e)||(n=function(e,t){if(!e)return;if("string"==typeof e)return K(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);"Object"===n&&e.constructor&&(n=e.constructor.name);if("Map"===n||"Set"===n)return Array.from(e);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return K(e,t)}(e))||t&&e&&"number"==typeof e.length){n&&(e=n);var r=0;return function(){return r>=e.length?{done:!0}:{done:!1,value:e[r++]}}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function K(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}var H={display:"flex",height:"calc(100vh)",background:"rgb(250,250,250)"},$={position:"absolute",top:"20vh",background:"#333a",width:"100vw",height:"100vh",display:"grid",transform:"translate(0vw , -20vh)",placeItems:"center"},q={background:"#fff",placeItems:"center",isolation:"isolate",minWidth:"60vw",padding:"3rem",borderRadius:"10PX",height:"fit-content",boxShadow:"0 0 0 10px #333c"};function M(){var e=(0,o.useState)("active"),t=e[0],n=e[1],a=(0,o.useState)([]),h=a[0],g=a[1],y=(0,o.useState)([]),b=y[0],x=y[1],w=(0,o.useState)([]),_=w[0],S=w[1],O=(0,o.useState)([]),j=O[0],k=O[1],Z=(0,o.useState)(!1),N=Z[0],C=Z[1],A=(0,o.useState)({}),I=A[0],P=A[1],K=(0,o.useState)(""),M=K[0],F=K[1],G=(0,o.useState)(!1),L=G[0],Q=G[1],T=(0,o.useState)(""),W=T[0],V=T[1];(0,o.useEffect)((function(){(0,p.Q)().then((function(e){if(console.log(e),e)if(e.order.length){for(var t,n=z(e.order);!(t=n()).done;)for(var r,a=t.value,c=z(a.products);!(r=c()).done;){var o=r.value;a.amount?a.amount+=Number(o.product.price)*Number(o.quantity):a.amount=Number(o.product.price)*Number(o.quantity)}g((0,l.Z)(e.order.filter((function(e){return"completed"!==e.order_status&&"delivered"!==e.delivery_status})))),x((0,l.Z)(e.order.filter((function(e){return"completed"===e.order_status||"delivered"===e.delivery_status})))),C(!1)}else V("No Orders have been made till now")})).catch((function(e){console.log(e),V("Something Went wrong While looking for Invoices ")}))}),[j]),(0,o.useEffect)((function(){S((0,l.Z)(h))}),[h]),(0,o.useEffect)((function(){console.log(t),S("active"===t?(0,l.Z)(h):(0,l.Z)(b))}),[t]);var U=function(e){var t=e.delivery_status;switch(console.log(t),t){case"delivered":break;case"order_placed":return o.createElement(f.Z.Select,{size:"md","data-invoice":I.invoice_number,onChange:function(e){F(e.target.value),Q(!0)}},o.createElement("option",{value:"order_placed"},"Order Placed"),o.createElement("option",{value:"en-route"},"En-Route"),o.createElement("option",{value:"delivered"},"Delivered"));default:return o.createElement(f.Z.Select,{size:"md","data-invoice":I.invoice_number,onChange:function(e){F(e.target.value),Q(!0)}},o.createElement("option",{value:"en-route"},"En-Route"),o.createElement("option",{value:"delivered"},"Delivered"))}},Y=function(e){var t=e.target.parentElement.dataset.key;console.log(t),console.log(e.target.parentElement),_.length&&(console.log(e.target.parentElement),C(!0),P(Object.assign({},_[Number(t)])))},J=function(){var e=(0,r.Z)(c().mark((function e(t,n){var r,a;return c().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,(0,p.G)(t,n);case 2:r=e.sent,console.log(r),Q(!1),"completed"!==(a=r.order).order_status&&"delivered"!==a.delivery_status?g((function(e){var t=e.filter((function(e,t){if(e.invoice_number===a.invoice_number)return t}));return t&&(e[t]=a),(0,l.Z)(e)})):x((function(e){var t=e.filter((function(e,t){if(e.invoice_number===a.invoice_number)return t}));return t&&(e[t]=a),(0,l.Z)(e)})),k(50*Math.random());case 8:case"end":return e.stop()}}),e)})));return function(t,n){return e.apply(this,arguments)}}();return(0,o.useEffect)((function(){console.log(I)}),[I]),o.createElement(u.Z,null,o.createElement("div",{id:"wrapper",style:H},o.createElement(i.Y,{selected:"orders"}),W?o.createElement("div",{style:{width:"100vw",height:"calc(100vh)",background:"azure",display:"grid",placeItems:"center"}},o.createElement("p",null,W)):N&&Object.keys(I).length?o.createElement("div",{style:$},o.createElement("div",{style:q},o.createElement(d.Z,{onClick:function(){return C(!1)},style:{float:"right",margin:"-1.5rem"}}),o.createElement("div",{style:{borderRadius:10,boxShadow:"0 1px 30px 1px #3335",padding:"2rem"}},o.createElement("header",null,o.createElement("p",null,"Date : ",new Date(I.created_on).toLocaleString()),o.createElement("p",null,"Invoice No.",I.invoice_number),o.createElement("h6",null,"Customer Name: Akshay"),o.createElement("h6",null,"Address: Rf/23 , new street , Hunghom , hongkong")),o.createElement("article",null,o.createElement(E.Z,null,o.createElement("thead",null,o.createElement("tr",null,o.createElement("th",null,"No."),o.createElement("th",null,"Product Name"),o.createElement("th",null,"Quantity"),o.createElement("th",null,"Price ($HKD)"),o.createElement("th",null,"Added cost ($HKD)"),o.createElement("th",null,"Amt.($HKD)"))),o.createElement("tbody",null,I.products.length?I.products.map((function(e,t){return o.createElement("tr",null,o.createElement("td",null,t),o.createElement("td",null,o.createElement("p",{style:{margin:"10px 0"}},o.createElement("b",null,e.product.title)),o.createElement("p",{style:{margin:0}},e.properties.length?Object.entries(e.properties[0]).map((function(e){return e.join(" : ")})).join("  "):null)),o.createElement("td",null,e.quantity),o.createElement("td",null,e.product.price),o.createElement("td",null,e.extra_charges),o.createElement("td",null,Number(e.quantity)*Number(e.product.price)))})):o.createElement("tr",null,o.createElement("td",{colspan:"6",style:{textAlign:"center"}},"No Products found"))),o.createElement("tfoot",null,o.createElement("tr",null,o.createElement("td",{colspan:5},o.createElement("b",null,"Total")),o.createElement("td",null,I.gross_price))))),o.createElement("div",null,o.createElement("p",null,"Delivery Status:"),"delivered"!==I.delivery_status&&"confirmed_delivery"!==I.delivery_status?o.createElement(o.Fragment,null,o.createElement(U,{delivery_status:I.delivery_status}),L?o.createElement(v.Z,{style:{margin:"15px 0"},onClick:function(){return J(I.invoice_number,M)}},"Save Changes"):null):o.createElement("b",null,I.delivery_status))))):o.createElement("div",{style:{flexGrow:2,flexFlow:"column",alignItems:"flex-start",paddingLeft:"12.5rem",overflowY:"auto",width:"100vw",height:"calc(100vh)"}},o.createElement("h3",{style:{marginTop:"2rem"}},"Received Orders"),o.createElement("p",null,'Make sure to Update Status of Order as "En-Route" As soon is it Sent for shipping'),o.createElement(s.Z,{activeKey:t,onSelect:function(e){return n(e)},className:"mb-3"},o.createElement(m.Z,{eventKey:"active",title:"Active Orders"},o.createElement("div",null,o.createElement("div",null,o.createElement(D,null,o.createElement(f.Z.Control,{placeholder:"Search by invoice No.","aria-label":"Search invoices by invoice no."}),o.createElement(v.Z,{variant:"outlined-primary"},o.createElement(R,null)))),o.createElement(E.Z,null,o.createElement("thead",null,o.createElement("th",null,"Status"),o.createElement("th",null,"Date"),o.createElement("th",null,"Invoice No."),o.createElement("th",null,"Customer"),o.createElement("th",null,"Item"),o.createElement("th",null,"Options"),o.createElement("th",null,"Qty."),o.createElement("th",null,"Rate (HK$)"),o.createElement("th",null,"Amount (HK$)")),o.createElement("tbody",null,_.length?_.map((function(e,t){return o.createElement("tr",{onClickCapture:function(e){return Y(e)},"data-key":t,key:t,style:{verticalAlign:"middle"}},o.createElement("td",{onClick:function(e){return Y(e)},style:{borderRadius:"10px 0 0 10px",padding:"1.5rem 0",textAlign:"center",background:"order_placed"===e.delivery_status?"#65f265":"#65e0f2",fontWeight:"700"}},e.delivery_status),o.createElement("td",null,new Date(""+e.created_on).toLocaleString()),o.createElement("td",null,e.invoice_number?e.invoice_number:"00"+t),o.createElement("td",null,"Customer"),e.products.map((function(t,n){return o.createElement(o.Fragment,null,o.createElement("td",null,o.createElement("p",{style:{margin:"1.2rem 0 0 0"}},o.createElement("b",null,e.products.length>1?n:null),t.product.title),o.createElement("br",null)),o.createElement("td",null,t.properties.map((function(e){return console.log(e),o.createElement(o.Fragment,null,o.createElement("p",{style:{margin:0}},o.createElement("b",null,"Color")," : ",e.colors?e.colors:"-"),o.createElement("p",{style:{margin:0}},o.createElement("b",null,"Size")," : ",e.sizes?e.sizes:"-"),o.createElement("p",{style:{margin:0}},o.createElement("b",null,"Variation")," : ",e.variations?e.variations:"-"))}))),o.createElement("td",null,t.quantity),o.createElement("td",null,Number(t.product.price)))})),o.createElement("td",null,e.amount),o.createElement("td",null),o.createElement("td",null))})):null)))),o.createElement(m.Z,{eventKey:"completed",title:"Completed Orders"},o.createElement("div",null,o.createElement("div",null,o.createElement(D,null,o.createElement(f.Z.Control,{placeholder:"Search by invoice No.","aria-label":"Search invoices by invoice no."}),o.createElement(v.Z,{variant:"outlined-primary"},o.createElement(R,null)))),o.createElement(E.Z,{className:"hover"},o.createElement("thead",null,o.createElement("th",null,"Status"),o.createElement("th",null,"Date"),o.createElement("th",null,"Invoice No."),o.createElement("th",null,"Customer"),o.createElement("th",null,"Item"),o.createElement("th",null,"Options"),o.createElement("th",null,"Qty."),o.createElement("th",null,"Rate (HK$)"),o.createElement("th",null,"Amount (HK$)")),o.createElement("tbody",null,_.length?_.map((function(e,t){return o.createElement("tr",{onClick:function(e){return Y(e)},"data-key":t,key:t,style:{verticalAlign:"middle"}},o.createElement("td",{style:{borderRadius:"10px 0 0 10px",padding:"1.5rem 0",textAlign:"center",background:"order_placed"===e.delivery_status?"#65f265":"#65e0f2",fontWeight:"700"}},e.delivery_status),o.createElement("td",null,new Date(""+e.created_on).toLocaleString()),o.createElement("td",null,e.invoice_number?e.invoice_number:"00"+t),o.createElement("td",null,"Customer"),e.products.map((function(t,n){return o.createElement(o.Fragment,null,o.createElement("td",null,o.createElement("p",{style:{margin:"1.2rem 0 0 0"}},o.createElement("b",null,e.products.length>1?n:null),t.product.title),o.createElement("br",null)),o.createElement("td",null,t.properties.map((function(e){return console.log(e),o.createElement(o.Fragment,null,o.createElement("p",{style:{margin:0}},o.createElement("b",null,"Color")," : ",e.colors?e.colors:"-"),o.createElement("p",{style:{margin:0}},o.createElement("b",null,"Size")," : ",e.sizes?e.sizes:"-"),o.createElement("p",{style:{margin:0}},o.createElement("b",null,"Variation")," : ",e.variations?e.variations:"-"))}))),o.createElement("td",null,t.quantity),o.createElement("td",null,Number(t.product.price)))})),o.createElement("td",null,e.amount),o.createElement("td",null),o.createElement("td",null))})):null))))))))}}}]);
//# sourceMappingURL=component---src-pages-orders-js-564741b85d74f7b97cc0.js.map