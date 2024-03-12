"use strict";(()=>{var p="5adb4164b44b050e0c8adad04b9dfa32",k="",m=async()=>{let t=localStorage.getItem("cart_id");console.log("cart_id = "+t),t?await E(t):await v()},E=async t=>{let o=`
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
`;await fetch("https://209c5e-2.myshopify.com/api/2024-01/graphql.json",{method:"POST",body:JSON.stringify({query:o}),headers:{"X-Shopify-Storefront-Access-Token":p,"Content-type":"application/json"}}).then(async e=>{let n=await e.json();console.log("Checkout URL = "+n.data.cart.checkoutUrl),k=n.data.cart.checkoutUrl,document.getElementById("checkout-btn-id").addEventListener("click",function(){window.open(n.data.cart.checkoutUrl,"_blank")}),n.data.cart.lines.edges.length>0?(document.getElementById("no-items-id").style.display="none",document.getElementById("div-loader-id").style.display="none",document.getElementById("cart-quantity-id").textContent=n.data.cart.lines.edges.length.toString(),document.getElementById("cart-quantity-id").style.display="flex",document.getElementById("cart-quantity-id").style.justifyContent="center",document.getElementById("subtotal-text-id").textContent=n.data.cart.cost.subtotalAmount.amount,document.getElementById("subtotal-div-id").style.display="flex",document.getElementById("cart-quantity-id").style.display="flex",document.getElementById("cart-quantity-id").style.justifyContent="center",document.getElementById("checkout-btn-id").style.display="block",B(n.data.cart.lines.edges)):(document.querySelectorAll(".cart-grid-item").forEach(i=>i.parentNode.removeChild(i)),document.getElementById("no-items-id").style.display="block",document.getElementById("div-loader-id").style.display="none",document.getElementById("subtotal-div-id").style.display="none",document.getElementById("cart-quantity-id").style.display="none",document.getElementById("checkout-btn-id").style.display="none")}).catch(e=>{document.getElementById("cart-quantity-id").style.display="none",console.log("e = "+e.toString())})},v=async()=>{let t=`
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
`;document.getElementById("div-loader-id").style.display="block",console.log("BEFORE -- "),await fetch("https://209c5e-2.myshopify.com/api/2024-01/graphql.json",{method:"POST",body:JSON.stringify({query:t}),headers:{"X-Shopify-Storefront-Access-Token":p,"Content-type":"application/json; charset=UTF-8"}}).then(async o=>{console.log("ddddd ss");let e=await o.json(),n=e.data.cartCreate.cart.id;console.log(e.data.cartCreate.cart.checkoutUrl),console.log(n),localStorage.setItem("cart_id",n),await E(n)}).catch(o=>{console.log("e = "+o.toString())})},B=t=>{document.querySelectorAll(".cart-grid-item").forEach(o=>o.parentNode.removeChild(o));for(let o=0;o<t.length;o++){let e=t[o].node,n=document.createElement("div");n.className="row",n.innerHTML=x(e.id,e.merchandise.title,e.merchandise.product.images.edges[0].node.url,e.cost.subtotalAmount.amount,e.discountAllocations.length===0?"":e.discountAllocations[0].discountedAmount.amount,e.quantity);let i=document.getElementById("checkout-items-grid-id"),a=document.createElement("div");a.setAttribute("class","cart-grid-item"),a.appendChild(n),i.appendChild(a),document.getElementById(`remove_${e.id}`)?.addEventListener("click",async function(){await q(localStorage.getItem("cart_id"),e.id)})}},x=(t,o,e,n,i,a)=>(console.log("title = "+o),`
<div class="w-commerce-commercecartitem cart-item-wrapper">
    <img 
        src=${e}
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
            aria-label="Remove item from cart" id="remove_${t}">
            <div class="cart-remove-link">Remove</div>
        </a>
    </div>
<input
        class="w-commerce-commercecartquantity input cart-quantity-input" required="" pattern="^[0-9]+$"
        inputmode="numeric" type="number" name="quantity" autocomplete="off" data-wf-cart-action="update-item-quantity"
        data-commerce-sku-id="659d238ff90eb981ff648528" value="${a}" readonly>

</div>`),g=async(t,o,e)=>{let n=`
 mutation AddToCart {
        cartLinesAdd(
          cartId: "${o}",
          lines: [{ quantity: ${t}, merchandiseId: "${e}"}]) {
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
`;document.getElementById("div-loader-id").style.display="block",await fetch("https://209c5e-2.myshopify.com/api/2024-01/graphql.json",{method:"POST",body:JSON.stringify({query:n}),headers:{"X-Shopify-Storefront-Access-Token":p,"Content-type":"application/json"}}).then(async i=>{document.querySelector(".ths02-menu-bars-wrapper-12").click(),document.getElementById("div-loader-id").style.display="none",await m()}).catch(i=>{console.log("e = "+i.toString())})},q=async(t,o)=>{let e=`
mutation cartLinesRemove {
  cartLinesRemove(cartId: "${t}", lineIds: ["${o}"]) {
    cart {
      id
    }
    userErrors {
      field
      message
    }
  }
}
`;document.getElementById("div-loader-id").style.display="block",await fetch("https://209c5e-2.myshopify.com/api/2024-01/graphql.json",{method:"POST",body:JSON.stringify({query:e}),headers:{"X-Shopify-Storefront-Access-Token":p,"Content-type":"application/json"}}).then(async n=>{console.log("result = "+n.data),console.log("FROM Delete"),document.getElementById("div-loader-id").style.display="none",await m()}).catch(n=>{console.log("e = "+n.toString())})};var b=(t=document)=>{let o="Last Published:";for(let e of t.childNodes)if(e.nodeType===Node.COMMENT_NODE&&e.textContent?.includes(o)){let n=e.textContent.trim().split(o)[1];if(n)return new Date(n)}};var I=t=>{let o=b();console.log(`Hello ${t}!`),console.log(`This site was last published on ${o?.toLocaleDateString("en-US",{year:"numeric",month:"long",day:"2-digit"})}.`)};var T="5adb4164b44b050e0c8adad04b9dfa32",C=async t=>{let o=null;return await fetch("https://209c5e-2.myshopify.com/api/2024-01/graphql.json",{method:"POST",body:JSON.stringify({query:t}),headers:{"X-Shopify-Storefront-Access-Token":T,"Content-type":"application/json"}}).then(async e=>{o=(await e.json()).data}).catch(e=>(console.log("e = "+e.toString()),"Error!")),o};var r="",l="",f="",d=0,u="",S=()=>{m();let t="",e=(document.currentScript?.baseURI.split("?")[1]).split("&");for(let n=0;n<e.length;n++){let i=e[n].split("=");i[0]==="product_id"&&(t=i[1])}L(),A(t)},L=()=>{document.getElementById("add-to-cart-btn-id").addEventListener("click",async function(){d===1&&r===""||d===2&&(r===""||l==="")||d===3&&(r===""||l===""||f==="")?document.getElementById("error-text-id").style.display="block":g(1,localStorage.getItem("cart_id"),u)}),document.getElementById("one-off-add-to-cart-id").addEventListener("click",async function(){if(d===1&&r==="")document.getElementById("one-off-error-text-id").style.display="block";else if(d===2&&(r===""||l===""))document.getElementById("one-off-error-text-id").style.display="block";else if(d===3&&(r===""||l===""||f===""))document.getElementById("one-off-error-text-id").style.display="block";else{let t=document.getElementById("product-quantity-field").value;console.log("valueeee = "+t),await g(t,localStorage.getItem("cart_id"),u),await g(t,localStorage.getItem("cart_id"),"gid://shopify/ProductVariant/40777319907395")}})},A=async t=>{let o=await C(`{
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
        }}}}}`),e=o.product.options;d=e.length;for(let n=0;n<e.length;n++){document.getElementById(`option${n+1}-title-id`).style.display="block",document.getElementById(`option${n+1}-title-id`).textContent=e[n].name;for(let i=0;i<e[n].values.length;i++)P(e[n].values[i],e[n].id,`option${n+1}`,o.product.variants.edges)}};function P(t,o,e,n){let i=document.createElement("div");i.className="row",i.innerHTML=`

<div id="${e}-item${t}" class="${e}div ${t}${o.substring(28)}">
<div class="text-block-95">${t}</div></div>
    `;let a=document.getElementById(`variants-${e}-grid-id`),s=document.createElement("div");s.setAttribute("class",`${e}-div`),s.appendChild(i),a.appendChild(s),document.getElementById(`${e}-item${t}`).addEventListener("click",function(){e==="option1"?r=t:e==="option2"?l=t:f=t,document.getElementById("error-text-id").style.display="none",document.getElementById("one-off-error-text-id").style.display="none",[...document.getElementsByClassName(`${e}div`)].forEach(c=>{c.style.borderColor="#f1eeee"}),[...document.getElementsByClassName(`${e}div ${t}${o.substring(28)}`)].forEach(c=>{c.style.borderColor="black"}),O(n)})}var O=t=>{if(d===1)for(let o=0;o<t.length;o++)t[o].node.title===r&&(u=t[o].node.id);else if(d===2)for(let o=0;o<t.length;o++)t[o].node.title===`${r} / ${l}`&&(u=t[o].node.id);else if(d===3)for(let o=0;o<t.length;o++)t[o].node.title===`${r} / ${l} / ${f}`&&(u=t[o].node.id)};window.Webflow||(window.Webflow=[]);window.Webflow.push(async()=>{I("John Do wewewewe")});m();if(document.currentScript?.baseURI.toString().includes("category-details")){let o=new URLSearchParams(window.location.search).get("collection");window.fsAttributes=window.fsAttributes||[],window.fsAttributes.push(["cmsload",async e=>{console.log("Hello from the CMS");let n=0,i=e.find(({wrapper:c})=>c.id==="products-cms-id")??e[0],[a]=i.items,s=a.element,w=await _(Number(o));i.clearItems(),await w.map(async c=>{s.id=c.id+"#becaby";let y=M(c,s);await i.addItems([y]),document.getElementById(`${c.id}#becaby`)?.addEventListener("click",function(){window.open(`https://becapy-new.webflow.io/product-details?product_id=${c.id}`,"_self")})});let h=await N();await h.map(async c=>{n++,c.id===Number(o)&&(document.getElementById("category-head-id")!=null&&(document.getElementById("category-head-id").textContent=c.title),document.getElementById("category-description-id").innerHTML=c.body_html),console.log("collectionsCount = "+n);let y="https://becapy-new.webflow.io/category-details?collection="+c.id;n===h.length?(console.log("collectionsCount = "+n),document.getElementById("flex-text-id").innerHTML+=`<a href=${y} class="text-decoration-none link">${c.title}</a>`):(console.log("collectionsCount = "+n),document.getElementById("flex-text-id").innerHTML+=`<a href=${y} class="text-decoration-none link">${c.title}</a> <div class="breadcrumb-divider-2">/</div>`)}),document.getElementById("loader-id").style.display="none",window.Webflow.push(function(){$("html").attr("data-wf-page","65cdfd5f1054c1ba09309d71"),window.Webflow&&window.Webflow.destroy(),window.Webflow&&window.Webflow.ready(),window.Webflow&&window.Webflow.require("ix2").init(),document.dispatchEvent(new Event("readystatechange"))})}])}else document.currentScript?.baseURI.toString().includes("product-details")&&S();var _=async t=>{try{return await(await fetch(`https://getproductsbycollectionidhttps-dkhndz7lcq-uc.a.run.app/?collectionId=${t}`)).json()}catch{return[]}},M=(t,o)=>{let e=o.cloneNode(!0),n=e.querySelector('[data-element="image"]'),i=e.querySelector('[data-element="title"]'),a=e.querySelector('[data-element="description"]'),s=e.querySelector('[data-element="price"]');return console.log(t.product.image),n&&t.product.image!==null&&(n.src=t.product.image.src),i&&(i.textContent=t.product.title),a&&(a.innerHTML=t.product.body_html),s&&(s.textContent=t.product.variants.length===0?"-":t.product.variants[0].price+" AED"),e};var N=async()=>{try{let t=[];return await fetch("https://getcustomcollections-dkhndz7lcq-uc.a.run.app").then(async o=>(t=(await o.json()).custom_collections,console.log(t[0].id),t)),t}catch{return[]}};})();
