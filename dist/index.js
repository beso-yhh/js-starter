"use strict";(()=>{var p="5adb4164b44b050e0c8adad04b9dfa32",y=()=>{console.log("document.currentScript?.baseURI.toString() = "+document.currentScript?.baseURI.toString());let t=localStorage.getItem("cart_id");t?g(t):h()},g=async t=>{let o=`
 query GetCart($cartId: ID!) { 
        cart(id: $cartId) {
          checkoutUrl
          cost {
            totalAmount {
              amount
            }
            subtotalAmount{
              amount
            }
          }
          lines(first: 100) {
            edges {
              node {
                quantity
                discountAllocations {
                  discountedAmount {
                    amount
                    currencyCode
                  }
                  
                }
                cost {
                  subtotalAmount {
                    amount
                    currencyCode
                  }
                  totalAmount {
                    amount
                    currencyCode
                  }
                }
                merchandise {
                  ... on ProductVariant {
                    title
                    product {
                      title
                    }
                    price {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
          }
        }
      }
`,e=`
{
  "cartId": ${t}
}
`;await fetch("https://209c5e-2.myshopify.com/api/2024-01/graphql.json",{method:"POST",body:JSON.stringify({query:o,variables:e}),headers:{"X-Shopify-Storefront-Access-Token":p,"Content-type":"application/json; charset=UTF-8"}}).then(async r=>{let c=await r.json();console.log(c.data.cart.checkoutUrl),c.data.lines.edges.length>0?(document.getElementById("cart-quantity-id").textContent=c.data.lines.edges.length.toString(),document.getElementById("cart-quantity-id").style.display="block"):document.getElementById("cart-quantity-id").style.display="none"})},h=async()=>{await fetch("https://209c5e-2.myshopify.com/api/2024-01/graphql.json",{method:"POST",body:JSON.stringify({query:`
mutation cartCreate {
  cartCreate {
    cart {
      id
      checkoutUrl
    }
    userErrors {
      field
      message
    }
  }
}
`}),headers:{"X-Shopify-Storefront-Access-Token":p,"Content-type":"application/json; charset=UTF-8"}}).then(async o=>{let e=await o.json();console.log(e.cartCreate.cart.checkoutUrl),console.log(e.cartCreate.cart.id),localStorage.setItem("cart_id",e.cartCreate.cart.id),g(e.cartCreate.cart.id)})};var d=(t=document)=>{let o="Last Published:";for(let e of t.childNodes)if(e.nodeType===Node.COMMENT_NODE&&e.textContent?.includes(o)){let r=e.textContent.trim().split(o)[1];if(r)return new Date(r)}};var f=t=>{let o=d();console.log(`Hello ${t}!`),console.log(`This site was last published on ${o?.toLocaleDateString("en-US",{year:"numeric",month:"long",day:"2-digit"})}.`)};window.Webflow||(window.Webflow=[]);window.Webflow.push(async()=>{f("John Do wewewewe")});if(document.currentScript?.baseURI.toString().includes("category-details")){let o=new URLSearchParams(window.location.search).get("collection");window.fsAttributes=window.fsAttributes||[],window.fsAttributes.push(["cmsload",async e=>{console.log("Hello from the CMS");let r=e.find(({wrapper:n})=>n.id==="products-cms-id")??e[0],[c]=r.items,a=c.element,i=await b(Number(o));r.clearItems(),await i.map(async n=>{a.id=n.id+"#becaby";let l=C(n,a);await r.addItems([l]),document.getElementById(`${n.id}#becaby`)?.addEventListener("click",function(){window.open(`https://becapy-new.webflow.io/product-details?product_id=${n.id}`,"_self")})});let s=e.find(({wrapper:n})=>n.id==="categories-cms-id")??e[0],m=await I();console.log("collections[0].title = "+m[0].title);let[w]=s.items,u=w.element;s.clearItems(),await m.map(async n=>{n.id===Number(o)&&(document.getElementById("category-head-id")!=null&&(document.getElementById("category-head-id").textContent=n.title),document.getElementById("category-description-id").innerHTML=n.body_html),u.id=n.id+"#becaby";let l=S(n,u,o);await s.addItems([l]),document.getElementById(`${n.id}#becaby`)?.addEventListener("click",function(){window.open(`https://becapy-new.webflow.io/category-details?collection=${n.id}`,"_self")})}),document.getElementById("loader-id").style.display="none",window.Webflow.push(function(){$("html").attr("data-wf-page","65cdfd5f1054c1ba09309d71"),window.Webflow&&window.Webflow.destroy(),window.Webflow&&window.Webflow.ready(),window.Webflow&&window.Webflow.require("ix2").init(),document.dispatchEvent(new Event("readystatechange"))})}])}else document.currentScript?.baseURI.toString().includes("product-details")&&y();var b=async t=>{try{return await(await fetch(`https://getproductsbycollectionidhttps-dkhndz7lcq-uc.a.run.app/?collectionId=${t}`)).json()}catch{return[]}},C=(t,o)=>{let e=o.cloneNode(!0),r=e.querySelector('[data-element="image"]'),c=e.querySelector('[data-element="title"]'),a=e.querySelector('[data-element="description"]'),i=e.querySelector('[data-element="price"]');return console.log(t.product.image),r&&t.product.image!==null&&(r.src=t.product.image.src),c&&(c.textContent=t.product.title),a&&(a.innerHTML=t.product.body_html),i&&(i.textContent=t.product.variants.length===0?"-":t.product.variants[0].price+" AED"),e},S=(t,o,e)=>{let r=o.cloneNode(!0),c=r.querySelector('[data-element="collection_title"]');return c&&(c.textContent=t.title),t.id===Number(e)&&(c.style.fontWeight="bold",c.style.color="black"),r};var I=async()=>{try{let t=[];return await fetch("https://getcustomcollections-dkhndz7lcq-uc.a.run.app").then(async o=>(t=(await o.json()).custom_collections,console.log(t[0].id),t)),t}catch{return[]}};})();
