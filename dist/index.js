"use strict";(()=>{var p="a6f6d54288d4907127991e86952bb7f9",x="",y=async()=>{let t=localStorage.getItem("cart_id");console.log("cart_id = "+t),t?await C(t):await l(!0)},C=async t=>{let n=`
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
`;await fetch("https://209c5e-2.myshopify.com/api/2024-01/graphql.json",{method:"POST",body:JSON.stringify({query:n}),headers:{"X-Shopify-Storefront-Access-Token":p,"Content-type":"application/json"}}).then(async o=>{let e=await o.json();console.log("Checkout URL = "+e.data.cart.checkoutUrl),x=e.data.cart.checkoutUrl,document.getElementById("checkout-btn-id").addEventListener("click",function(){window.open(e.data.cart.checkoutUrl,"_blank")}),e.data.cart.lines.edges.length>0?(document.getElementById("no-items-id").style.display="none",document.getElementById("div-loader-id").style.display="none",document.getElementById("cart-quantity-id").textContent=e.data.cart.lines.edges.length.toString(),document.getElementById("cart-quantity-id").style.display="flex",document.getElementById("cart-quantity-id").style.justifyContent="center",document.getElementById("subtotal-text-id").textContent=e.data.cart.cost.subtotalAmount.amount,document.getElementById("subtotal-div-id").style.display="flex",document.getElementById("cart-quantity-id").style.display="flex",document.getElementById("cart-quantity-id").style.justifyContent="center",document.getElementById("checkout-btn-id").style.display="block",T(e.data.cart.lines.edges)):(document.querySelectorAll(".cart-grid-item").forEach(i=>i.parentNode.removeChild(i)),document.getElementById("no-items-id").style.display="block",document.getElementById("div-loader-id").style.display="none",document.getElementById("subtotal-div-id").style.display="none",document.getElementById("cart-quantity-id").style.display="none",document.getElementById("checkout-btn-id").style.display="none")}).catch(async o=>{document.getElementById("cart-quantity-id").style.display="none",console.log("e = "+o.toString()),await l(!0)})},l=async t=>{let n=`
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
`;return document.getElementById("div-loader-id").style.display="block",await fetch("https://209c5e-2.myshopify.com/api/2024-01/graphql.json",{method:"POST",body:JSON.stringify({query:n}),headers:{"X-Shopify-Storefront-Access-Token":p,"Content-type":"application/json; charset=UTF-8"}}).then(async o=>{let e=await o.json(),i=e.data.cartCreate.cart.id;return t&&(localStorage.setItem("cart_id",i),await C(i)),e.data.cartCreate.cart}).catch(o=>{console.log("e = "+o)})},T=t=>{document.querySelectorAll(".cart-grid-item").forEach(n=>n.parentNode.removeChild(n));for(let n=0;n<t.length;n++){let o=t[n].node,e=document.createElement("div");e.className="row",e.innerHTML=L(o.id,o.merchandise.title,o.merchandise.product.images.edges[0].node.url,o.cost.subtotalAmount.amount,o.discountAllocations.length===0?"":o.discountAllocations[0].discountedAmount.amount,o.quantity);let i=document.getElementById("checkout-items-grid-id"),c=document.createElement("div");c.setAttribute("class","cart-grid-item"),c.appendChild(e),i.appendChild(c),document.getElementById(`remove_${o.id}`)?.addEventListener("click",async function(){await P(localStorage.getItem("cart_id"),o.id)})}},L=(t,n,o,e,i,c)=>(console.log("title = "+n),`
<div class="w-commerce-commercecartitem cart-item-wrapper">
    <img 
        src=${o}
        alt="" class="w-commerce-commercecartitemimage cart-image-image">
    <div class="w-commerce-commercecartiteminfo">
        <div 
            class="w-commerce-commercecartproductname cart-item-title">${n}</div>
        <div 
            class="cart-item-price">${e} AED</div>
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
        data-commerce-sku-id="659d238ff90eb981ff648528" value="${c}" readonly>

</div>`),h=async(t,n,o)=>{let e=`
 mutation AddToCart {
        cartLinesAdd(
          cartId: "${n}",
          lines: [{ quantity: ${t}, merchandiseId: "${o}" }]) {
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
`;document.getElementById("div-loader-id").style.display="block",await fetch("https://209c5e-2.myshopify.com/api/2024-01/graphql.json",{method:"POST",body:JSON.stringify({query:e}),headers:{"X-Shopify-Storefront-Access-Token":p,"Content-type":"application/json"}}).then(async i=>{document.querySelector(".ths02-menu-bars-wrapper-12").click(),document.getElementById("div-loader-id").style.display="none",await y()}).catch(async i=>{console.log("e = "+i.toString()),await l(!0)})},w=async(t,n,o,e,i)=>{let c=`
 mutation AddToCart {
        cartLinesAdd(
          cartId: "${n}",
          lines: [{ 
          attributes: [
                        {
                          key:"qr_id"
                          value:"${e}"
                        },
                        {
                          key:"plan"
                          value:"${i}"
                        }
            ], quantity: ${t}, merchandiseId: "${o}"}]) {
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
`;document.getElementById("div-loader-id").style.display="block",await fetch("https://209c5e-2.myshopify.com/api/2024-01/graphql.json",{method:"POST",body:JSON.stringify({query:c}),headers:{"X-Shopify-Storefront-Access-Token":p,"Content-type":"application/json"}}).then(async a=>await a.json()).catch(async a=>{console.log("e = "+a.toString()),await l(!0)})},P=async(t,n)=>{let o=`
mutation cartLinesRemove {
  cartLinesRemove(cartId: "${t}", lineIds: ["${n}"]) {
    cart {
      id
    }
    userErrors {
      field
      message
    }
  }
}
`;document.getElementById("div-loader-id").style.display="block",await fetch("https://209c5e-2.myshopify.com/api/2024-01/graphql.json",{method:"POST",body:JSON.stringify({query:o}),headers:{"X-Shopify-Storefront-Access-Token":p,"Content-type":"application/json"}}).then(async e=>{console.log("result = "+e.data),console.log("FROM Delete"),document.getElementById("div-loader-id").style.display="none",await y()}).catch(e=>{console.log("e = "+e.toString())})};var I=(t=document)=>{let n="Last Published:";for(let o of t.childNodes)if(o.nodeType===Node.COMMENT_NODE&&o.textContent?.includes(n)){let e=o.textContent.trim().split(n)[1];if(e)return new Date(e)}};var S=t=>{let n=I();console.log(`Hello ${t}!`),console.log(`This site was last published on ${n?.toLocaleDateString("en-US",{year:"numeric",month:"long",day:"2-digit"})}.`)};var k=()=>{console.log("initPurchaseFuncs");let t="",o=(document.currentScript?.baseURI.split("?")[1]).split("&");for(let e=0;e<o.length;e++){let i=o[e].split("=");i[0]==="id"&&(t=i[1])}document.getElementById("six-id").addEventListener("click",async function(){let e=await l(!1);await w(1,e.id,"gid://shopify/ProductVariant/41058158903363",t,"6-months"),window.open(e.checkoutUrl,"_blank")}),document.getElementById("recommend-id").addEventListener("click",async function(){let e=await l(!1);await w(1,e.id,"gid://shopify/ProductVariant/41058158936131",t,"1-year"),window.open(e.checkoutUrl,"_blank")}),document.getElementById("life-time-id").addEventListener("click",async function(){let e=await l(!1);await w(1,e.id,"gid://shopify/ProductVariant/41058158968899",t,"life-time"),window.open(e.checkoutUrl,"_blank")})};var A="a6f6d54288d4907127991e86952bb7f9",v=async t=>{let n=null;return await fetch("https://209c5e-2.myshopify.com/api/2024-01/graphql.json",{method:"POST",body:JSON.stringify({query:t}),headers:{"X-Shopify-Storefront-Access-Token":A,"Content-type":"application/json"}}).then(async o=>{n=(await o.json()).data}).catch(o=>(console.log("e = "+o.toString()),"Error!")),n};var s="",m="",b="",d=0,g="",B=()=>{y();let t="",o=(document.currentScript?.baseURI.split("?")[1]).split("&");for(let e=0;e<o.length;e++){let i=o[e].split("=");i[0]==="product_id"&&(t=i[1])}_(),j(t)},_=()=>{document.getElementById("add-to-cart-btn-id").addEventListener("click",async function(){d===1&&s===""||d===2&&(s===""||m==="")||d===3&&(s===""||m===""||b==="")?document.getElementById("error-text-id").style.display="block":h(1,localStorage.getItem("cart_id"),g)}),document.getElementById("one-off-add-to-cart-id").addEventListener("click",async function(){if(d===1&&s==="")document.getElementById("one-off-error-text-id").style.display="block";else if(d===2&&(s===""||m===""))document.getElementById("one-off-error-text-id").style.display="block";else if(d===3&&(s===""||m===""||b===""))document.getElementById("one-off-error-text-id").style.display="block";else{let t=document.getElementById("product-quantity-field").value;console.log("valueeee = "+t),await h(t,localStorage.getItem("cart_id"),g),await h(t,localStorage.getItem("cart_id"),"gid://shopify/ProductVariant/40777319907395")}})},j=async t=>{let n=await v(`{
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
        }}}}}`),o=n.product.options;d=o.length;for(let e=0;e<o.length;e++){document.getElementById(`option${e+1}-title-id`).style.display="block",document.getElementById(`option${e+1}-title-id`).textContent=o[e].name;for(let i=0;i<o[e].values.length;i++)O(o[e].values[i],o[e].id,`option${e+1}`,n.product.variants.edges)}};function O(t,n,o,e){let i=document.createElement("div");i.className="row",i.innerHTML=`

<div id="${o}-item${t}" class="${o}div ${t}${n.substring(28)}">
<div class="text-block-95">${t}</div></div>
    `;let c=document.getElementById(`variants-${o}-grid-id`),a=document.createElement("div");a.setAttribute("class",`${o}-div`),a.appendChild(i),c.appendChild(a),document.getElementById(`${o}-item${t}`).addEventListener("click",function(){o==="option1"?s=t:o==="option2"?m=t:b=t,document.getElementById("error-text-id").style.display="none",document.getElementById("one-off-error-text-id").style.display="none",[...document.getElementsByClassName(`${o}div`)].forEach(u=>{u.style.borderColor="#f1eeee"}),[...document.getElementsByClassName(`${o}div ${t}${n.substring(28)}`)].forEach(u=>{u.style.borderColor="black"}),N(e)})}var N=t=>{if(d===1)for(let n=0;n<t.length;n++)t[n].node.title===s&&(g=t[n].node.id);else if(d===2)for(let n=0;n<t.length;n++)t[n].node.title===`${s} / ${m}`&&(g=t[n].node.id);else if(d===3)for(let n=0;n<t.length;n++)t[n].node.title===`${s} / ${m} / ${b}`&&(g=t[n].node.id)};window.Webflow||(window.Webflow=[]);window.Webflow.push(async()=>{S("John Do wewewewe")});y();if(document.currentScript?.baseURI.toString().includes("category-details")){let n=new URLSearchParams(window.location.search).get("collection");window.fsAttributes=window.fsAttributes||[],window.fsAttributes.push(["cmsload",async o=>{console.log("Hello from the CMS");let e=0,i=o.find(({wrapper:r})=>r.id==="products-cms-id")??o[0],[c]=i.items,a=c.element,E=await M(Number(n));i.clearItems(),await E.map(async r=>{a.id=r.id+"#becaby";let f=U(r,a);await i.addItems([f]),document.getElementById(`${r.id}#becaby`)?.addEventListener("click",function(){window.open(`https://becapy-new.webflow.io/product-details?product_id=${r.id}`,"_self")})});let q=await D(),u=await H();await u.map(async r=>{e++,r.id===Number(n)&&(document.getElementById("category-head-id")!=null&&(document.getElementById("category-head-id").textContent=r.title),document.getElementById("category-description-id").innerHTML=r.body_html),console.log("collectionsCount = "+e);let f="https://becapy-new.webflow.io/category-details?collection="+r.id;e===u.length?(console.log("collectionsCount = "+e),document.getElementById("flex-text-id").innerHTML+=`<a href=${f} class="text-decoration-none link">${r.title}</a>`):(console.log("collectionsCount = "+e),document.getElementById("flex-text-id").innerHTML+=`<a href=${f} class="text-decoration-none link">${r.title}</a> <div class="breadcrumb-divider-2">/</div>`)}),document.getElementById("loader-id").style.display="none",window.Webflow.push(function(){$("html").attr("data-wf-page","65cdfd5f1054c1ba09309d71"),window.Webflow&&window.Webflow.destroy(),window.Webflow&&window.Webflow.ready(),window.Webflow&&window.Webflow.require("ix2").init(),document.dispatchEvent(new Event("readystatechange"))})}])}else document.currentScript?.baseURI.toString().includes("product-details")?B():document.currentScript?.baseURI.toString().includes("purchase")&&k();var M=async t=>{try{return await(await fetch(`https://getproductsbycollectionidhttps-dkhndz7lcq-uc.a.run.app/?collectionId=${t}`)).json()}catch{return[]}},U=(t,n)=>{let o=n.cloneNode(!0),e=o.querySelector('[data-element="image"]'),i=o.querySelector('[data-element="title"]'),c=o.querySelector('[data-element="description"]'),a=o.querySelector('[data-element="price"]');return console.log(t.product.image),e&&t.product.image!==null&&(e.src=t.product.image.src),i&&(i.textContent=t.product.title),c&&(c.innerHTML=t.product.body_html),a&&(a.textContent=t.product.variants.length===0?"-":t.product.variants[0].price+" AED"),o};var D=async()=>{try{let t=[];return await fetch("https://getcustomcollections-dkhndz7lcq-uc.a.run.app").then(async n=>(t=(await n.json()).custom_collections,t)),t}catch{return[]}},H=async()=>{try{let t=[],n=[];return await fetch("https://getcustomcollections-dkhndz7lcq-uc.a.run.app").then(async o=>{t=(await o.json()).custom_collections;for(let e=0;e<t.length;e++)(t[e].id===287584649283||t[e].id===287556894787||t[e].id===287582322755||t[e].id===287584550979||t[e].id===287584616515||t[e].id===287556927555)&&n.push(t[e]);return n}),n}catch{return[]}};})();
