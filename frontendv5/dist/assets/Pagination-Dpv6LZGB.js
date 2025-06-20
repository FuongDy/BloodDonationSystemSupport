import{g as p,j as n,B as l}from"./index---XYpbwv.js";/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const x=[["path",{d:"m15 18-6-6 6-6",key:"1wnfg3"}]],u=p("chevron-left",x);/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const j=[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]],v=p("chevron-right",j);/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const k=[["path",{d:"m11 17-5-5 5-5",key:"13zhaf"}],["path",{d:"m18 17-5-5 5-5",key:"h8a8et"}]],N=p("chevrons-left",k);/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const y=[["path",{d:"m6 17 5-5-5-5",key:"xnjwq"}],["path",{d:"m13 17 5-5-5-5",key:"17xmmf"}]],_=p("chevrons-right",y),w=({currentPage:e,totalPages:i,onPageChange:c,isLoading:r=!1,maxVisiblePages:o=5})=>{if(i<=1)return null;const f=(()=>{const t=[];if(i<=o)for(let s=0;s<i;s++)t.push(s);else{let s=Math.max(0,e-Math.floor(o/2));const h=Math.min(i-1,s+o-1);h-s+1<o&&(s=h-o+1),s=Math.max(0,s),s>0&&(t.push(0),s>1&&t.push("..."));for(let a=s;a<=h;a++)t.push(a);h<i-1&&(h<i-2&&t.push("..."),t.push(i-1))}return t})(),d=e===0,m=e===i-1;return n.jsxs("div",{className:"flex items-center space-x-1",children:[n.jsx(l,{onClick:()=>c(0),disabled:d||r,variant:"outline",className:"p-2",title:"Trang đầu",children:n.jsx(N,{size:18})}),n.jsx(l,{onClick:()=>c(e-1),disabled:d||r,variant:"outline",className:"p-2",title:"Trang trước",children:n.jsx(u,{size:18})}),f.map((t,s)=>typeof t=="number"?n.jsx(l,{onClick:()=>c(t),disabled:r,variant:e===t?"primary":"outline",className:"p-2 min-w-[36px]",children:t+1},t):n.jsx("span",{className:"px-3 py-2 text-gray-500",children:"..."},`ellipsis-${s}`)),n.jsx(l,{onClick:()=>c(e+1),disabled:m||r,variant:"outline",className:"p-2",title:"Trang sau",children:n.jsx(v,{size:18})}),n.jsx(l,{onClick:()=>c(i-1),disabled:m||r,variant:"outline",className:"p-2",title:"Trang cuối",children:n.jsx(_,{size:18})})]})};export{w as P};
