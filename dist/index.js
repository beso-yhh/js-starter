"use strict";(()=>{var p="5adb4164b44b050e0c8adad04b9dfa32",k="",l=async()=>{let t=localStorage.getItem("cart_id");console.log("cart_id = "+t),t?await E(t):await v()},E=async t=>{let e=`
 query GetCart { 
        cart(id: "${t}") {
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
`;await fetch("https://209c5e-2.myshopify.com/api/2024-01/graphql.json",{method:"POST",body:JSON.stringify({query:e}),headers:{"X-Shopify-Storefront-Access-Token":p,"Content-type":"application/json"}}).then(async o=>{let n=await o.json();console.log("Checkout URL = "+n.data.cart.checkoutUrl),k=n.data.cart.checkoutUrl,document.getElementById("checkout-btn-id").addEventListener("click",function(){window.open(n.data.cart.checkoutUrl,"_blank")}),n.data.cart.lines.edges.length>0?(document.getElementById("no-items-id").style.display="none",document.getElementById("div-loader-id").style.display="none",document.getElementById("cart-quantity-id").textContent=n.data.cart.lines.edges.length.toString(),document.getElementById("cart-quantity-id").style.display="flex",document.getElementById("cart-quantity-id").style.justifyContent="center",document.getElementById("subtotal-text-id").textContent=n.data.cart.cost.subtotalAmount.amount,document.getElementById("subtotal-div-id").style.display="flex",document.getElementById("cart-quantity-id").style.display="flex",document.getElementById("cart-quantity-id").style.justifyContent="center",document.getElementById("checkout-btn-id").style.display="block",B(n.data.cart.lines.edges)):(document.querySelectorAll(".cart-grid-item").forEach(i=>i.parentNode.removeChild(i)),document.getElementById("no-items-id").style.display="block",document.getElementById("div-loader-id").style.display="none",document.getElementById("subtotal-div-id").style.display="none",document.getElementById("cart-quantity-id").style.display="none",document.getElementById("checkout-btn-id").style.display="none")}).catch(o=>{document.getElementById("cart-quantity-id").style.display="none",console.log("e = "+o.toString())})},v=async()=>{let t=`
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
`;document.getElementById("div-loader-id").style.display="block",console.log("BEFORE -- "),await fetch("https://209c5e-2.myshopify.com/api/2024-01/graphql.json",{method:"POST",body:JSON.stringify({query:t}),headers:{"X-Shopify-Storefront-Access-Token":p,"Content-type":"application/json; charset=UTF-8"}}).then(async e=>{console.log("ddddd ss");let o=await e.json(),n=o.data.cartCreate.cart.id;console.log(o.data.cartCreate.cart.checkoutUrl),console.log(n),localStorage.setItem("cart_id",n),await E(n)}).catch(e=>{console.log("e = "+e.toString())})},B=t=>{document.querySelectorAll(".cart-grid-item").forEach(e=>e.parentNode.removeChild(e));for(let e=0;e<t.length;e++){let o=t[e].node,n=document.createElement("div");n.className="row",n.innerHTML=q(o.id,o.merchandise.title,o.merchandise.product.images.edges[0].node.url,o.cost.subtotalAmount.amount,o.discountAllocations.length===0?"":o.discountAllocations[0].discountedAmount.amount,o.quantity);let i=document.getElementById("checkout-items-grid-id"),a=document.createElement("div");a.setAttribute("class","cart-grid-item"),a.appendChild(n),i.appendChild(a),document.getElementById(`remove_${o.id}`)?.addEventListener("click",async function(){await x(localStorage.getItem("cart_id"),o.id)})}},q=(t,e,o,n,i,a)=>(console.log("title = "+e),`
<div class="w-commerce-commercecartitem cart-item-wrapper">
    <img 
        src=${o}
        alt="" class="w-commerce-commercecartitemimage cart-image-image">
    <div class="w-commerce-commercecartiteminfo">
        <div 
            class="w-commerce-commercecartproductname cart-item-title">${e}</div>
        <div 
            class="cart-item-price">${n} AED</div>
<ul 
            class="w-commerce-commercecartoptionlist"
            data-wf-collection="database.commerceOrder.userItems.0.product.f_sku_properties_3dr"
            data-wf-template-id="wf-template-22026248-201a-c94d-2bf0-3cf39e1de403">
            
        </ul><a href="#" role=""
            class="w-inline-block" data-wf-cart-action="remove-item" 
            aria-label="Remove item from cart" id="remove_${t}">
            <div class="cart-remove-link">Remove</div>
        </a>
    </div>
<input
        class="w-commerce-commercecartquantity input cart-quantity-input" required="" pattern="^[0-9]+$"
        inputmode="numeric" type="number" name="quantity" autocomplete="off" data-wf-cart-action="update-item-quantity"
        data-commerce-sku-id="659d238ff90eb981ff648528" value="${a}" readonly>

</div>`),g=async(t,e,o)=>{let n=`
 mutation AddToCart {
        cartLinesAdd(
          cartId: "${e}",
          lines: [{ quantity: ${t}, merchandiseId: "${o}"}]) {
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
`;document.getElementById("div-loader-id").style.display="block",await fetch("https://209c5e-2.myshopify.com/api/2024-01/graphql.json",{method:"POST",body:JSON.stringify({query:n}),headers:{"X-Shopify-Storefront-Access-Token":p,"Content-type":"application/json"}}).then(async i=>{document.querySelector(".ths02-menu-bars-wrapper-12").click(),document.getElementById("div-loader-id").style.display="none",await l()}).catch(i=>{console.log("e = "+i.toString())})},x=async(t,e)=>{let o=`
mutation cartLinesRemove {
  cartLinesRemove(cartId: "${t}", lineIds: ["${e}"]) {
    cart {
      id
    }
    userErrors {
      field
      message
    }
  }
}
`;document.getElementById("div-loader-id").style.display="block",await fetch("https://209c5e-2.myshopify.com/api/2024-01/graphql.json",{method:"POST",body:JSON.stringify({query:o}),headers:{"X-Shopify-Storefront-Access-Token":p,"Content-type":"application/json"}}).then(async n=>{console.log("result = "+n.data),console.log("FROM Delete"),document.getElementById("div-loader-id").style.display="none",await l()}).catch(n=>{console.log("e = "+n.toString())})};var h=(t=document)=>{let e="Last Published:";for(let o of t.childNodes)if(o.nodeType===Node.COMMENT_NODE&&o.textContent?.includes(e)){let n=o.textContent.trim().split(e)[1];if(n)return new Date(n)}};var I=t=>{let e=h();console.log(`Hello ${t}!`),console.log(`This site was last published on ${e?.toLocaleDateString("en-US",{year:"numeric",month:"long",day:"2-digit"})}.`)};var T="5adb4164b44b050e0c8adad04b9dfa32",C=async t=>{let e=null;return await fetch("https://209c5e-2.myshopify.com/api/2024-01/graphql.json",{method:"POST",body:JSON.stringify({query:t}),headers:{"X-Shopify-Storefront-Access-Token":T,"Content-type":"application/json"}}).then(async o=>{e=(await o.json()).data}).catch(o=>(console.log("e = "+o.toString()),"Error!")),e};var d="",u="",b="",s=0,m="",S=()=>{l();let t="",o=(document.currentScript?.baseURI.split("?")[1]).split("&");for(let n=0;n<o.length;n++){let i=o[n].split("=");i[0]==="product_id"&&(t=i[1])}L(t),A(t)},L=t=>{document.getElementById("add-to-cart-btn-id").addEventListener("click",async function(){s===1&&d===""||s===2&&(d===""||u==="")||s===3&&(d===""||u===""||b==="")?document.getElementById("error-text-id").style.display="block":(console.log("selectedVariantId = "+m),g(1,localStorage.getItem("cart_id"),m))}),document.getElementById("one-off-add-to-cart-id").addEventListener("click",async function(){let e=document.getElementById("product-quantity-field").value;console.log("valueeee = "+e),await g(e,localStorage.getItem("cart_id"),m),await g(e,localStorage.getItem("cart_id"),"gid://shopify/ProductVariant/40777319907395")})},A=async t=>{let e=await C(`{
  product(id:"gid://shopify/Product/${t}"){
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
        }}}}}`),o=e.product.options;s=o.length;for(let n=0;n<o.length;n++){document.getElementById(`option${n+1}-title-id`).style.display="block",document.getElementById(`option${n+1}-title-id`).textContent=o[n].name;for(let i=0;i<o[n].values.length;i++)P(o[n].values[i],o[n].id,`option${n+1}`,e.product.variants.edges)}};function P(t,e,o,n){let i=document.createElement("div");i.className="row",i.innerHTML=`

<div id="${o}-item${t}" class="${o}div ${t}${e.substring(28)}">
<div class="text-block-95">${t}</div></div>
    `;let a=document.getElementById(`variants-${o}-grid-id`),r=document.createElement("div");r.setAttribute("class",`${o}-div`),r.appendChild(i),a.appendChild(r),document.getElementById(`${o}-item${t}`).addEventListener("click",function(){o==="option1"?d=t:o==="option2"?u=t:b=t,document.getElementById("error-text-id").style.display="none",[...document.getElementsByClassName(`${o}div`)].forEach(c=>{c.style.borderColor="#f1eeee"}),[...document.getElementsByClassName(`${o}div ${t}${e.substring(28)}`)].forEach(c=>{c.style.borderColor="black"}),O(n)})}var O=t=>{if(s===1)for(let e=0;e<t.length;e++)t[e].node.title===d&&(m=t[e].node.id);else if(s===2)for(let e=0;e<t.length;e++)t[e].node.title===`${d} / ${u}`&&(m=t[e].node.id);else if(s===3)for(let e=0;e<t.length;e++)t[e].node.title===`${d} / ${u} / ${b}`&&(m=t[e].node.id)};window.Webflow||(window.Webflow=[]);window.Webflow.push(async()=>{I("John Do wewewewe")});l();if(document.currentScript?.baseURI.toString().includes("category-details")){let e=new URLSearchParams(window.location.search).get("collection");window.fsAttributes=window.fsAttributes||[],window.fsAttributes.push(["cmsload",async o=>{console.log("Hello from the CMS");let n=0,i=o.find(({wrapper:c})=>c.id==="products-cms-id")??o[0],[a]=i.items,r=a.element,w=await _(Number(e));i.clearItems(),await w.map(async c=>{r.id=c.id+"#becaby";let y=M(c,r);await i.addItems([y]),document.getElementById(`${c.id}#becaby`)?.addEventListener("click",function(){window.open(`https://becapy-new.webflow.io/product-details?product_id=${c.id}`,"_self")})});let f=await N();await f.map(async c=>{n++,c.id===Number(e)&&(document.getElementById("category-head-id")!=null&&(document.getElementById("category-head-id").textContent=c.title),document.getElementById("category-description-id").innerHTML=c.body_html),console.log("collectionsCount = "+n);let y="https://becapy-new.webflow.io/category-details?collection="+c.id;n===f.length?(console.log("collectionsCount = "+n),document.getElementById("flex-text-id").innerHTML+=`<a href=${y} class="text-decoration-none link">${c.title}</a>`):(console.log("collectionsCount = "+n),document.getElementById("flex-text-id").innerHTML+=`<a href=${y} class="text-decoration-none link">${c.title}</a> <div class="breadcrumb-divider-2">/</div>`)}),document.getElementById("loader-id").style.display="none",window.Webflow.push(function(){$("html").attr("data-wf-page","65cdfd5f1054c1ba09309d71"),window.Webflow&&window.Webflow.destroy(),window.Webflow&&window.Webflow.ready(),window.Webflow&&window.Webflow.require("ix2").init(),document.dispatchEvent(new Event("readystatechange"))})}])}else document.currentScript?.baseURI.toString().includes("product-details")&&S();var _=async t=>{try{return await(await fetch(`https://getproductsbycollectionidhttps-dkhndz7lcq-uc.a.run.app/?collectionId=${t}`)).json()}catch{return[]}},M=(t,e)=>{let o=e.cloneNode(!0),n=o.querySelector('[data-element="image"]'),i=o.querySelector('[data-element="title"]'),a=o.querySelector('[data-element="description"]'),r=o.querySelector('[data-element="price"]');return console.log(t.product.image),n&&t.product.image!==null&&(n.src=t.product.image.src),i&&(i.textContent=t.product.title),a&&(a.innerHTML=t.product.body_html),r&&(r.textContent=t.product.variants.length===0?"-":t.product.variants[0].price+" AED"),o};var N=async()=>{try{let t=[];return await fetch("https://getcustomcollections-dkhndz7lcq-uc.a.run.app").then(async e=>(t=(await e.json()).custom_collections,console.log(t[0].id),t)),t}catch{return[]}};})();
