"use strict";(()=>{var i=(t=document)=>{let e="Last Published:";for(let o of t.childNodes)if(o.nodeType===Node.COMMENT_NODE&&o.textContent?.includes(e)){let r=o.textContent.trim().split(e)[1];if(r)return new Date(r)}};var a=t=>{let e=i();console.log(`Hello ${t}!`),console.log(`This site was last published on ${e?.toLocaleDateString("en-US",{year:"numeric",month:"long",day:"2-digit"})}.`)};window.Webflow||(window.Webflow=[]);window.Webflow.push(async()=>{a("John Do wewewewe")});window.fsAttributes=window.fsAttributes||[];window.fsAttributes.push(["cmsload",async t=>{console.log("Hello from the CMS");let[e]=t,[o]=e.items,r=o.element,n=await l();e.clearItems();let s=n.map(c=>m(c,r));await e.addItems(s)}]);var l=async()=>{try{return await(await fetch("https://fakestoreapi.com/products")).json()}catch{return[]}},m=(t,e)=>{let o=e.cloneNode(!0),r=o.querySelector('[data-element="title"]'),n=o.querySelector('[data-element="category"]'),s=o.querySelector('[data-element="description"]');return r&&(r.textContent=t.title),n&&(n.textContent=t.category),s&&(s.textContent=t.description),o};})();
