import{i as m,j as t,B as h}from"./index-CLUoxoAg.js";import{a as x,C as u}from"./chevron-right-Dplm1_a-.js";/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const j=[["path",{d:"m11 17-5-5 5-5",key:"13zhaf"}],["path",{d:"m18 17-5-5 5-5",key:"h8a8et"}]],v=m("chevrons-left",j);/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const k=[["path",{d:"m6 17 5-5-5-5",key:"xnjwq"}],["path",{d:"m13 17 5-5-5-5",key:"17xmmf"}]],N=m("chevrons-right",k),M=({currentPage:n,totalPages:e,onPageChange:r,isLoading:c=!1,maxVisiblePages:l=5})=>{if(e<=1)return null;const f=(()=>{const i=[];if(e<=l)for(let s=0;s<e;s++)i.push(s);else{let s=Math.max(0,n-Math.floor(l/2));const o=Math.min(e-1,s+l-1);o-s+1<l&&(s=o-l+1),s=Math.max(0,s),s>0&&(i.push(0),s>1&&i.push("..."));for(let a=s;a<=o;a++)i.push(a);o<e-1&&(o<e-2&&i.push("..."),i.push(e-1))}return i})(),p=n===0,d=n===e-1;return t.jsxs("div",{className:"flex items-center space-x-1",children:[t.jsx(h,{onClick:()=>r(0),disabled:p||c,variant:"outline",className:"p-2",title:"Trang đầu",children:t.jsx(v,{size:18})}),t.jsx(h,{onClick:()=>r(n-1),disabled:p||c,variant:"outline",className:"p-2",title:"Trang trước",children:t.jsx(x,{size:18})}),f.map((i,s)=>typeof i=="number"?t.jsx(h,{onClick:()=>r(i),disabled:c,variant:n===i?"primary":"outline",className:"p-2 min-w-[36px]",children:i+1},i):t.jsx("span",{className:"px-3 py-2 text-gray-500",children:"..."},`ellipsis-${s}`)),t.jsx(h,{onClick:()=>r(n+1),disabled:d||c,variant:"outline",className:"p-2",title:"Trang sau",children:t.jsx(u,{size:18})}),t.jsx(h,{onClick:()=>r(e-1),disabled:d||c,variant:"outline",className:"p-2",title:"Trang cuối",children:t.jsx(N,{size:18})})]})};export{M as P};
