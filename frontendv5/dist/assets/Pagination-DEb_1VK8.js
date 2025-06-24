import{i as m,j as t,B as p}from"./index-1dtSQISR.js";import{C as u}from"./chevron-left-ByYWtYPx.js";import{C as x}from"./chevron-right-B4c0w1B6.js";/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const j=[["path",{d:"m11 17-5-5 5-5",key:"13zhaf"}],["path",{d:"m18 17-5-5 5-5",key:"h8a8et"}]],v=m("chevrons-left",j);/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const k=[["path",{d:"m6 17 5-5-5-5",key:"xnjwq"}],["path",{d:"m13 17 5-5-5-5",key:"17xmmf"}]],y=m("chevrons-right",k),T=({currentPage:e=0,totalPages:n=0,onPageChange:r,isLoading:c=!1,maxVisiblePages:o=5})=>{if(!r||typeof r!="function")return console.warn("Pagination: onPageChange prop is required and must be a function"),null;if(n<=1||e<0||e>=n)return null;const d=(()=>{const i=[];if(n<=o)for(let s=0;s<n;s++)i.push(s);else{let s=Math.max(0,e-Math.floor(o/2));const l=Math.min(n-1,s+o-1);l-s+1<o&&(s=l-o+1),s=Math.max(0,s),s>0&&(i.push(0),s>1&&i.push("..."));for(let h=s;h<=l;h++)i.push(h);l<n-1&&(l<n-2&&i.push("..."),i.push(n-1))}return i})(),a=e===0,f=e===n-1;return t.jsxs("div",{className:"flex items-center space-x-1",children:[t.jsx(p,{onClick:()=>r(0),disabled:a||c,variant:"outline",className:"p-2",title:"Trang đầu",children:t.jsx(v,{size:18})}),t.jsx(p,{onClick:()=>r(e-1),disabled:a||c,variant:"outline",className:"p-2",title:"Trang trước",children:t.jsx(u,{size:18})}),d.map((i,s)=>typeof i=="number"?t.jsx(p,{onClick:()=>r(i),disabled:c,variant:e===i?"primary":"outline",className:"p-2 min-w-[36px]",children:i+1},i):t.jsx("span",{className:"px-3 py-2 text-gray-500",children:"..."},`ellipsis-${s}`)),t.jsx(p,{onClick:()=>r(e+1),disabled:f||c,variant:"outline",className:"p-2",title:"Trang sau",children:t.jsx(x,{size:18})}),t.jsx(p,{onClick:()=>r(n-1),disabled:f||c,variant:"outline",className:"p-2",title:"Trang cuối",children:t.jsx(y,{size:18})})]})};export{T as P};
