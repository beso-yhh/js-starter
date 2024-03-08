"use strict";(()=>{var l="5adb4164b44b050e0c8adad04b9dfa32",h="",d=async()=>{let e=localStorage.getItem("cart_id");console.log("cart_id = "+e),e?await p(e):await w()},p=async e=>{let n=`
 query GetCart { 
        cart(id: "${e}") {
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
                id
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
                      images(first: 1){
                        edges{
                          node{
                            url
                          }
                        }
                      }
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
`;await fetch("https://209c5e-2.myshopify.com/api/2024-01/graphql.json",{method:"POST",body:JSON.stringify({query:n}),headers:{"X-Shopify-Storefront-Access-Token":l,"Content-type":"application/json"}}).then(async t=>{let o=await t.json();console.log("Checkout URL = "+o.data.cart.checkoutUrl),h=o.data.cart.checkoutUrl,document.getElementById("checkout-btn-id").addEventListener("click",function(){window.open(o.data.cart.checkoutUrl,"_blank")}),o.data.cart.lines.edges.length>0?(document.getElementById("no-items-id").style.display="none",document.getElementById("div-loader-id").style.display="none",document.getElementById("cart-quantity-id").textContent=o.data.cart.lines.edges.length.toString(),document.getElementById("cart-quantity-id").style.display="flex",document.getElementById("cart-quantity-id").style.justifyContent="center",document.getElementById("subtotal-text-id").textContent=o.data.cart.cost.subtotalAmount.amount,document.getElementById("cart-quantity-id").style.display="flex",document.getElementById("cart-quantity-id").style.justifyContent="center",b(o.data.cart.lines.edges)):(document.querySelectorAll(".cart-grid-item").forEach(c=>c.parentNode.removeChild(c)),document.getElementById("no-items-id").style.display="block",document.getElementById("div-loader-id").style.display="none",document.getElementById("subtotal-div-id").style.display="none",document.getElementById("cart-quantity-id").style.display="none")}).catch(t=>{document.getElementById("cart-quantity-id").style.display="none",console.log("e = "+t.toString())})},w=async()=>{let e=`
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
`;document.getElementById("div-loader-id").style.display="block",console.log("BEFORE -- "),await fetch("https://209c5e-2.myshopify.com/api/2024-01/graphql.json",{method:"POST",body:JSON.stringify({query:e}),headers:{"X-Shopify-Storefront-Access-Token":l,"Content-type":"application/json; charset=UTF-8"}}).then(async n=>{console.log("ddddd ss");let t=await n.json(),o=t.data.cartCreate.cart.id;console.log(t.data.cartCreate.cart.checkoutUrl),console.log(o),localStorage.setItem("cart_id",o),await p(o)}).catch(n=>{console.log("e = "+n.toString())})},b=e=>{document.querySelectorAll(".cart-grid-item").forEach(n=>n.parentNode.removeChild(n));for(let n=0;n<e.length;n++){let t=e[n].node,o=document.createElement("div");o.className="row",o.innerHTML=E(t.id,t.merchandise.title,t.merchandise.product.images.edges[0].node.url,t.cost.subtotalAmount.amount,t.discountAllocations.length===0?"":t.discountAllocations[0].discountedAmount.amount,t.quantity);let c=document.getElementById("checkout-items-grid-id"),r=document.createElement("div");r.setAttribute("class","cart-grid-item"),r.appendChild(o),c.appendChild(r),document.getElementById(`remove_${t.id}`)?.addEventListener("click",async function(){await C(localStorage.getItem("cart_id"),t.id)})}},E=(e,n,t,o,c,r)=>(console.log("title = "+n),`
<div class="w-commerce-commercecartitem cart-item-wrapper">
    <img 
        src=${t}
        alt="" class="w-commerce-commercecartitemimage cart-image-image">
    <div class="w-commerce-commercecartiteminfo">
        <div 
            class="w-commerce-commercecartproductname cart-item-title">${n}</div>
        <div 
            class="cart-item-price">${o} AED</div>
<ul 
            class="w-commerce-commercecartoptionlist"
            data-wf-collection="database.commerceOrder.userItems.0.product.f_sku_properties_3dr"
            data-wf-template-id="wf-template-22026248-201a-c94d-2bf0-3cf39e1de403">
            
        </ul><a href="#" role=""
            class="w-inline-block" data-wf-cart-action="remove-item" 
            aria-label="Remove item from cart" id="remove_${e}">
            <div class="cart-remove-link">Remove</div>
        </a>
    </div>
<input
        class="w-commerce-commercecartquantity input cart-quantity-input" required="" pattern="^[0-9]+$"
        inputmode="numeric" type="number" name="quantity" autocomplete="off" data-wf-cart-action="update-item-quantity"
        data-commerce-sku-id="659d238ff90eb981ff648528" value="${r}" readonly>

</div>`),m=async(e,n,t)=>{let o=`
 mutation AddToCart {
        cartLinesAdd(
          cartId: "${n}",
          lines: [{ quantity: ${e}, merchandiseId: "${t}"}]) {
          cart {
            lines(first: 100) {
              edges {
                node {
                  id
                  quantity
                  merchandise {
                    ... on ProductVariant {
                      product {
                        title
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
`;document.getElementById("div-loader-id").style.display="block",await fetch("https://209c5e-2.myshopify.com/api/2024-01/graphql.json",{method:"POST",body:JSON.stringify({query:o}),headers:{"X-Shopify-Storefront-Access-Token":l,"Content-type":"application/json"}}).then(async c=>{document.querySelector(".ths02-menu-bars-wrapper-12").click(),document.getElementById("div-loader-id").style.display="none",await d()}).catch(c=>{console.log("e = "+c.toString())})},C=async(e,n)=>{let t=`
mutation cartLinesRemove {
  cartLinesRemove(cartId: "${e}", lineIds: ["${n}"]) {
    cart {
      id
    }
    userErrors {
      field
      message
    }
  }
}
`;document.getElementById("div-loader-id").style.display="block",await fetch("https://209c5e-2.myshopify.com/api/2024-01/graphql.json",{method:"POST",body:JSON.stringify({query:t}),headers:{"X-Shopify-Storefront-Access-Token":l,"Content-type":"application/json"}}).then(async o=>{console.log("result = "+o.data),console.log("FROM Delete"),document.getElementById("div-loader-id").style.display="none",await d()}).catch(o=>{console.log("e = "+o.toString())})};var u=(e=document)=>{let n="Last Published:";for(let t of e.childNodes)if(t.nodeType===Node.COMMENT_NODE&&t.textContent?.includes(n)){let o=t.textContent.trim().split(n)[1];if(o)return new Date(o)}};var g=e=>{let n=u();console.log(`Hello ${e}!`),console.log(`This site was last published on ${n?.toLocaleDateString("en-US",{year:"numeric",month:"long",day:"2-digit"})}.`)};window.Webflow||(window.Webflow=[]);window.Webflow.push(async()=>{g("John Do wewewewe")});d();if(document.currentScript?.baseURI.toString().includes("category-details")){let n=new URLSearchParams(window.location.search).get("collection");window.fsAttributes=window.fsAttributes||[],window.fsAttributes.push(["cmsload",async t=>{console.log("Hello from the CMS");let o=0,c=t.find(({wrapper:a})=>a.id==="products-cms-id")??t[0],[r]=c.items,i=r.element,f=await I(Number(n));c.clearItems(),await f.map(async a=>{i.id=a.id+"#becaby";let s=S(a,i);await c.addItems([s]),document.getElementById(`${a.id}#becaby`)?.addEventListener("click",function(){window.open(`https://becapy-new.webflow.io/product-details?product_id=${a.id}`,"_self")})});let y=await v();await y.map(async a=>{o++,a.id===Number(n)&&(document.getElementById("category-head-id")!=null&&(document.getElementById("category-head-id").textContent=a.title),document.getElementById("category-description-id").innerHTML=a.body_html),console.log("collectionsCount = "+o);let s="https://becapy-new.webflow.io/category-details?collection="+a.id;o===y.length?(console.log("collectionsCount = "+o),document.getElementById("flex-text-id").innerHTML+=`<a href=${s} class="text-decoration-none link">${a.title}</a>`):(console.log("collectionsCount = "+o),document.getElementById("flex-text-id").innerHTML+=`<a href=${s} class="text-decoration-none link">${a.title}</a> <div class="breadcrumb-divider-2">/</div>`)}),document.getElementById("loader-id").style.display="none",window.Webflow.push(function(){$("html").attr("data-wf-page","65cdfd5f1054c1ba09309d71"),window.Webflow&&window.Webflow.destroy(),window.Webflow&&window.Webflow.ready(),window.Webflow&&window.Webflow.require("ix2").init(),document.dispatchEvent(new Event("readystatechange"))})}])}else document.currentScript?.baseURI.toString().includes("product-details")&&(d(),document.getElementById("add-to-cart-btn-id").addEventListener("click",async function(){await m(Number(document.getElementById("qr-code-quantity-field").value),localStorage.getItem("cart_id"),"gid://shopify/ProductVariant/40777319907395"),await m(Number(document.getElementById("product-quantity-field").value),localStorage.getItem("cart_id"),"gid://shopify/ProductVariant/40992758038595")}));var I=async e=>{try{return await(await fetch(`https://getproductsbycollectionidhttps-dkhndz7lcq-uc.a.run.app/?collectionId=${e}`)).json()}catch{return[]}},S=(e,n)=>{let t=n.cloneNode(!0),o=t.querySelector('[data-element="image"]'),c=t.querySelector('[data-element="title"]'),r=t.querySelector('[data-element="description"]'),i=t.querySelector('[data-element="price"]');return console.log(e.product.image),o&&e.product.image!==null&&(o.src=e.product.image.src),c&&(c.textContent=e.product.title),r&&(r.innerHTML=e.product.body_html),i&&(i.textContent=e.product.variants.length===0?"-":e.product.variants[0].price+" AED"),t};var v=async()=>{try{let e=[];return await fetch("https://getcustomcollections-dkhndz7lcq-uc.a.run.app").then(async n=>(e=(await n.json()).custom_collections,console.log(e[0].id),e)),e}catch{return[]}};})();
