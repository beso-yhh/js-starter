"use strict";(()=>{var p="1dba4d16bdf57a57f61e90de5a60175d",k="",m=async()=>{let e=localStorage.getItem("cart_id");console.log("cart_id = "+e),e?await E(e):await v()},E=async e=>{let o=`
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
`;await fetch("https://209c5e-2.myshopify.com/api/2024-01/graphql.json",{method:"POST",body:JSON.stringify({query:o}),headers:{"X-Shopify-Storefront-Access-Token":p,"Content-type":"application/json"}}).then(async t=>{let n=await t.json();console.log("Checkout URL = "+n.data.cart.checkoutUrl),k=n.data.cart.checkoutUrl,document.getElementById("checkout-btn-id").addEventListener("click",function(){window.open(n.data.cart.checkoutUrl,"_blank")}),n.data.cart.lines.edges.length>0?(document.getElementById("no-items-id").style.display="none",document.getElementById("div-loader-id").style.display="none",document.getElementById("cart-quantity-id").textContent=n.data.cart.lines.edges.length.toString(),document.getElementById("cart-quantity-id").style.display="flex",document.getElementById("cart-quantity-id").style.justifyContent="center",document.getElementById("subtotal-text-id").textContent=n.data.cart.cost.subtotalAmount.amount,document.getElementById("subtotal-div-id").style.display="flex",document.getElementById("cart-quantity-id").style.display="flex",document.getElementById("cart-quantity-id").style.justifyContent="center",document.getElementById("checkout-btn-id").style.display="block",B(n.data.cart.lines.edges)):(document.querySelectorAll(".cart-grid-item").forEach(i=>i.parentNode.removeChild(i)),document.getElementById("no-items-id").style.display="block",document.getElementById("div-loader-id").style.display="none",document.getElementById("subtotal-div-id").style.display="none",document.getElementById("cart-quantity-id").style.display="none",document.getElementById("checkout-btn-id").style.display="none")}).catch(t=>{document.getElementById("cart-quantity-id").style.display="none",console.log("e = "+t.toString())})},v=async()=>{let e=`
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
`;document.getElementById("div-loader-id").style.display="block",console.log("BEFORE -- "),await fetch("https://209c5e-2.myshopify.com/api/2024-01/graphql.json",{method:"POST",body:JSON.stringify({query:e}),headers:{"X-Shopify-Storefront-Access-Token":p,"Content-type":"application/json; charset=UTF-8"}}).then(async o=>{console.log("ddddd ss");let t=await o.json(),n=t.data.cartCreate.cart.id;console.log(t.data.cartCreate.cart.checkoutUrl),console.log(n),localStorage.setItem("cart_id",n),await E(n)}).catch(o=>{console.log("e = "+o.toString())})},B=e=>{document.querySelectorAll(".cart-grid-item").forEach(o=>o.parentNode.removeChild(o));for(let o=0;o<e.length;o++){let t=e[o].node,n=document.createElement("div");n.className="row",n.innerHTML=x(t.id,t.merchandise.title,t.merchandise.product.images.edges[0].node.url,t.cost.subtotalAmount.amount,t.discountAllocations.length===0?"":t.discountAllocations[0].discountedAmount.amount,t.quantity);let i=document.getElementById("checkout-items-grid-id"),r=document.createElement("div");r.setAttribute("class","cart-grid-item"),r.appendChild(n),i.appendChild(r),document.getElementById(`remove_${t.id}`)?.addEventListener("click",async function(){await q(localStorage.getItem("cart_id"),t.id)})}},x=(e,o,t,n,i,r)=>(console.log("title = "+o),`
<div class="w-commerce-commercecartitem cart-item-wrapper">
    <img 
        src=${t}
        alt="" class="w-commerce-commercecartitemimage cart-image-image">
    <div class="w-commerce-commercecartiteminfo">
        <div 
            class="w-commerce-commercecartproductname cart-item-title">${o}</div>
        <div 
            class="cart-item-price">${n} AED</div>
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

</div>`),g=async(e,o,t)=>{let n=`
 mutation AddToCart {
        cartLinesAdd(
          cartId: "${o}",
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
`;document.getElementById("div-loader-id").style.display="block",await fetch("https://209c5e-2.myshopify.com/api/2024-01/graphql.json",{method:"POST",body:JSON.stringify({query:n}),headers:{"X-Shopify-Storefront-Access-Token":p,"Content-type":"application/json"}}).then(async i=>{document.querySelector(".ths02-menu-bars-wrapper-12").click(),document.getElementById("div-loader-id").style.display="none",await m()}).catch(i=>{console.log("e = "+i.toString())})},q=async(e,o)=>{let t=`
mutation cartLinesRemove {
  cartLinesRemove(cartId: "${e}", lineIds: ["${o}"]) {
    cart {
      id
    }
    userErrors {
      field
      message
    }
  }
}
`;document.getElementById("div-loader-id").style.display="block",await fetch("https://209c5e-2.myshopify.com/api/2024-01/graphql.json",{method:"POST",body:JSON.stringify({query:t}),headers:{"X-Shopify-Storefront-Access-Token":p,"Content-type":"application/json"}}).then(async n=>{console.log("result = "+n.data),console.log("FROM Delete"),document.getElementById("div-loader-id").style.display="none",await m()}).catch(n=>{console.log("e = "+n.toString())})};var b=(e=document)=>{let o="Last Published:";for(let t of e.childNodes)if(t.nodeType===Node.COMMENT_NODE&&t.textContent?.includes(o)){let n=t.textContent.trim().split(o)[1];if(n)return new Date(n)}};var I=e=>{let o=b();console.log(`Hello ${e}!`),console.log(`This site was last published on ${o?.toLocaleDateString("en-US",{year:"numeric",month:"long",day:"2-digit"})}.`)};var T="1dba4d16bdf57a57f61e90de5a60175d",C=async e=>{let o=null;return await fetch("https://209c5e-2.myshopify.com/api/2024-01/graphql.json",{method:"POST",body:JSON.stringify({query:e}),headers:{"X-Shopify-Storefront-Access-Token":T,"Content-type":"application/json"}}).then(async t=>{o=(await t.json()).data}).catch(t=>(console.log("e = "+t.toString()),"Error!")),o};var a="",l="",f="",d=0,u="",S=()=>{m();let e="",t=(document.currentScript?.baseURI.split("?")[1]).split("&");for(let n=0;n<t.length;n++){let i=t[n].split("=");i[0]==="product_id"&&(e=i[1])}L(),A(e)},L=()=>{document.getElementById("add-to-cart-btn-id").addEventListener("click",async function(){d===1&&a===""||d===2&&(a===""||l==="")||d===3&&(a===""||l===""||f==="")?document.getElementById("error-text-id").style.display="block":g(1,localStorage.getItem("cart_id"),u)}),document.getElementById("one-off-add-to-cart-id").addEventListener("click",async function(){if(d===1&&a==="")document.getElementById("one-off-error-text-id").style.display="block";else if(d===2&&(a===""||l===""))document.getElementById("one-off-error-text-id").style.display="block";else if(d===3&&(a===""||l===""||f===""))document.getElementById("one-off-error-text-id").style.display="block";else{let e=document.getElementById("product-quantity-field").value;console.log("valueeee = "+e),await g(e,localStorage.getItem("cart_id"),u),await g(e,localStorage.getItem("cart_id"),"gid://shopify/ProductVariant/40777319907395")}})},A=async e=>{let o=await C(`{
  product(id:"gid://shopify/Product/${e}"){
    title
    tags
    options {
      id
      name
      values
    }
    variants(first: 100){
      edges{
        node{
          id
          title
        }}}}}`),t=o.product.options;d=t.length;for(let n=0;n<t.length;n++){document.getElementById(`option${n+1}-title-id`).style.display="block",document.getElementById(`option${n+1}-title-id`).textContent=t[n].name;for(let i=0;i<t[n].values.length;i++)P(t[n].values[i],t[n].id,`option${n+1}`,o.product.variants.edges)}};function P(e,o,t,n){let i=document.createElement("div");i.className="row",i.innerHTML=`

<div id="${t}-item${e}" class="${t}div ${e}${o.substring(28)}">
<div class="text-block-95">${e}</div></div>
    `;let r=document.getElementById(`variants-${t}-grid-id`),s=document.createElement("div");s.setAttribute("class",`${t}-div`),s.appendChild(i),r.appendChild(s),document.getElementById(`${t}-item${e}`).addEventListener("click",function(){t==="option1"?a=e:t==="option2"?l=e:f=e,document.getElementById("error-text-id").style.display="none",document.getElementById("one-off-error-text-id").style.display="none",[...document.getElementsByClassName(`${t}div`)].forEach(c=>{c.style.borderColor="#f1eeee"}),[...document.getElementsByClassName(`${t}div ${e}${o.substring(28)}`)].forEach(c=>{c.style.borderColor="black"}),O(n)})}var O=e=>{if(d===1)for(let o=0;o<e.length;o++)e[o].node.title===a&&(u=e[o].node.id);else if(d===2)for(let o=0;o<e.length;o++)e[o].node.title===`${a} / ${l}`&&(u=e[o].node.id);else if(d===3)for(let o=0;o<e.length;o++)e[o].node.title===`${a} / ${l} / ${f}`&&(u=e[o].node.id)};window.Webflow||(window.Webflow=[]);window.Webflow.push(async()=>{I("John Do wewewewe")});m();if(document.currentScript?.baseURI.toString().includes("category-details")){let o=new URLSearchParams(window.location.search).get("collection");window.fsAttributes=window.fsAttributes||[],window.fsAttributes.push(["cmsload",async t=>{console.log("Hello from the CMS");let n=0,i=t.find(({wrapper:c})=>c.id==="products-cms-id")??t[0],[r]=i.items,s=r.element,w=await _(Number(o));i.clearItems(),await w.map(async c=>{s.id=c.id+"#becaby";let y=M(c,s);await i.addItems([y]),document.getElementById(`${c.id}#becaby`)?.addEventListener("click",function(){window.open(`https://becapy-new.webflow.io/product-details?product_id=${c.id}`,"_self")})});let h=await N();await h.map(async c=>{n++,c.id===Number(o)&&(document.getElementById("category-head-id")!=null&&(document.getElementById("category-head-id").textContent=c.title),document.getElementById("category-description-id").innerHTML=c.body_html),console.log("collectionsCount = "+n);let y="https://becapy-new.webflow.io/category-details?collection="+c.id;n===h.length?(console.log("collectionsCount = "+n),document.getElementById("flex-text-id").innerHTML+=`<a href=${y} class="text-decoration-none link">${c.title}</a>`):(console.log("collectionsCount = "+n),document.getElementById("flex-text-id").innerHTML+=`<a href=${y} class="text-decoration-none link">${c.title}</a> <div class="breadcrumb-divider-2">/</div>`)}),document.getElementById("loader-id").style.display="none",window.Webflow.push(function(){$("html").attr("data-wf-page","65cdfd5f1054c1ba09309d71"),window.Webflow&&window.Webflow.destroy(),window.Webflow&&window.Webflow.ready(),window.Webflow&&window.Webflow.require("ix2").init(),document.dispatchEvent(new Event("readystatechange"))})}])}else document.currentScript?.baseURI.toString().includes("product-details")&&S();var _=async e=>{try{return await(await fetch(`https://getproductsbycollectionidhttps-dkhndz7lcq-uc.a.run.app/?collectionId=${e}`)).json()}catch{return[]}},M=(e,o)=>{let t=o.cloneNode(!0),n=t.querySelector('[data-element="image"]'),i=t.querySelector('[data-element="title"]'),r=t.querySelector('[data-element="description"]'),s=t.querySelector('[data-element="price"]');return console.log(e.product.image),n&&e.product.image!==null&&(n.src=e.product.image.src),i&&(i.textContent=e.product.title),r&&(r.innerHTML=e.product.body_html),s&&(s.textContent=e.product.variants.length===0?"-":e.product.variants[0].price+" AED"),t};var N=async()=>{try{let e=[];return await fetch("https://getcustomcollections-dkhndz7lcq-uc.a.run.app").then(async o=>(e=(await o.json()).custom_collections,console.log(e[0].id),e)),e}catch{return[]}};})();
