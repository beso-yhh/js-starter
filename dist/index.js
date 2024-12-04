"use strict";(()=>{var g="a6f6d54288d4907127991e86952bb7f9",T="",p=async()=>{let t=localStorage.getItem("cart_id");console.log("cart_id = "+t),t?await k(t):await l(!0)},k=async t=>{let n=`
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
`;await fetch("https://209c5e-2.myshopify.com/api/2024-01/graphql.json",{method:"POST",body:JSON.stringify({query:n}),headers:{"X-Shopify-Storefront-Access-Token":g,"Content-type":"application/json"}}).then(async o=>{let e=await o.json();console.log("Checkout URL = "+e.data.cart.checkoutUrl),T=e.data.cart.checkoutUrl,document.getElementById("checkout-btn-id").addEventListener("click",function(){window.open(e.data.cart.checkoutUrl,"_blank")}),e.data.cart.lines.edges.length>0?(document.getElementById("no-items-id").style.display="none",document.getElementById("div-loader-id").style.display="none",document.getElementById("cart-quantity-id").textContent=e.data.cart.lines.edges.length.toString(),document.getElementById("cart-quantity-id").style.display="flex",document.getElementById("cart-quantity-id").style.justifyContent="center",document.getElementById("subtotal-text-id").textContent=e.data.cart.cost.subtotalAmount.amount,document.getElementById("subtotal-div-id").style.display="flex",document.getElementById("cart-quantity-id").style.display="flex",document.getElementById("cart-quantity-id").style.justifyContent="center",document.getElementById("checkout-btn-id").style.display="block",L(e.data.cart.lines.edges)):(document.querySelectorAll(".cart-grid-item").forEach(i=>i.parentNode.removeChild(i)),document.getElementById("no-items-id").style.display="block",document.getElementById("div-loader-id").style.display="none",document.getElementById("subtotal-div-id").style.display="none",document.getElementById("cart-quantity-id").style.display="none",document.getElementById("checkout-btn-id").style.display="none")}).catch(async o=>{document.getElementById("cart-quantity-id").style.display="none",console.log("e = "+o.toString()),await l(!0)})},l=async t=>{let n=`
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
`;return document.getElementById("div-loader-id").style.display="block",await fetch("https://209c5e-2.myshopify.com/api/2024-01/graphql.json",{method:"POST",body:JSON.stringify({query:n}),headers:{"X-Shopify-Storefront-Access-Token":g,"Content-type":"application/json; charset=UTF-8"}}).then(async o=>{let e=await o.json(),i=e.data.cartCreate.cart.id;return t&&(localStorage.setItem("cart_id",i),await k(i)),e.data.cartCreate.cart}).catch(o=>{console.log("e = "+o)})},L=t=>{document.querySelectorAll(".cart-grid-item").forEach(n=>n.parentNode.removeChild(n));for(let n=0;n<t.length;n++){let o=t[n].node,e=document.createElement("div");e.className="row",e.innerHTML=P(o.id,o.merchandise.title,o.merchandise.product.images.edges[0].node.url,o.cost.subtotalAmount.amount,o.discountAllocations.length===0?"":o.discountAllocations[0].discountedAmount.amount,o.quantity);let i=document.getElementById("checkout-items-grid-id"),a=document.createElement("div");a.setAttribute("class","cart-grid-item"),a.appendChild(e),i.appendChild(a),document.getElementById(`remove_${o.id}`)?.addEventListener("click",async function(){await A(localStorage.getItem("cart_id"),o.id)})}},P=(t,n,o,e,i,a)=>(console.log("title = "+n),`
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
        data-commerce-sku-id="659d238ff90eb981ff648528" value="${a}" readonly>

</div>`),b=async(t,n,o)=>{let e=`
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
`;document.getElementById("div-loader-id").style.display="block",await fetch("https://209c5e-2.myshopify.com/api/2024-01/graphql.json",{method:"POST",body:JSON.stringify({query:e}),headers:{"X-Shopify-Storefront-Access-Token":g,"Content-type":"application/json"}}).then(async i=>{document.querySelector(".ths02-menu-bars-wrapper-12").click(),document.getElementById("div-loader-id").style.display="none",await p()}).catch(async i=>{console.log("e = "+i.toString()),await l(!0)})},w=async(t,n,o,e,i)=>{let a=`
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
`;document.getElementById("div-loader-id").style.display="block",await fetch("https://209c5e-2.myshopify.com/api/2024-01/graphql.json",{method:"POST",body:JSON.stringify({query:a}),headers:{"X-Shopify-Storefront-Access-Token":g,"Content-type":"application/json"}}).then(async r=>await r.json()).catch(async r=>{console.log("e = "+r.toString()),await l(!0)})},A=async(t,n)=>{let o=`
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
`;document.getElementById("div-loader-id").style.display="block",await fetch("https://209c5e-2.myshopify.com/api/2024-01/graphql.json",{method:"POST",body:JSON.stringify({query:o}),headers:{"X-Shopify-Storefront-Access-Token":g,"Content-type":"application/json"}}).then(async e=>{console.log("result = "+e.data),console.log("FROM Delete"),document.getElementById("div-loader-id").style.display="none",await p()}).catch(e=>{console.log("e = "+e.toString())})};var I=(t=document)=>{let n="Last Published:";for(let o of t.childNodes)if(o.nodeType===Node.COMMENT_NODE&&o.textContent?.includes(n)){let e=o.textContent.trim().split(n)[1];if(e)return new Date(e)}};var v=t=>{let n=I();console.log(`Hello ${t}!`),console.log(`This site was last published on ${n?.toLocaleDateString("en-US",{year:"numeric",month:"long",day:"2-digit"})}.`)};var B=()=>{console.log("initPurchaseFuncs");let t="",o=(document.currentScript?.baseURI.split("?")[1]).split("&");for(let e=0;e<o.length;e++){let i=o[e].split("=");i[0]==="id"&&(t=i[1])}document.getElementById("six-id").addEventListener("click",async function(){let e=await l(!1);await w(1,e.id,"gid://shopify/ProductVariant/41058158903363",t,"6-months"),window.open(e.checkoutUrl,"_blank")}),document.getElementById("recommend-id").addEventListener("click",async function(){let e=await l(!1);await w(1,e.id,"gid://shopify/ProductVariant/41058158936131",t,"1-year"),window.open(e.checkoutUrl,"_blank")}),document.getElementById("life-time-id").addEventListener("click",async function(){let e=await l(!1);await w(1,e.id,"gid://shopify/ProductVariant/41058158968899",t,"life-time"),window.open(e.checkoutUrl,"_blank")})};var _="a6f6d54288d4907127991e86952bb7f9",x=async t=>{let n=null;return await fetch("https://209c5e-2.myshopify.com/api/2024-01/graphql.json",{method:"POST",body:JSON.stringify({query:t}),headers:{"X-Shopify-Storefront-Access-Token":_,"Content-type":"application/json"}}).then(async o=>{n=(await o.json()).data}).catch(o=>(console.log("e = "+o.toString()),"Error!")),n};var d="",u="",E="",s=0,f="",q=()=>{p();let t="",o=(document.currentScript?.baseURI.split("?")[1]).split("&");for(let e=0;e<o.length;e++){let i=o[e].split("=");i[0]==="product_id"&&(t=i[1])}j(),O(t)},j=()=>{document.getElementById("add-to-cart-btn-id").addEventListener("click",async function(){s===1&&d===""||s===2&&(d===""||u==="")||s===3&&(d===""||u===""||E==="")?document.getElementById("error-text-id").style.display="block":b(1,localStorage.getItem("cart_id"),f)}),document.getElementById("one-off-add-to-cart-id").addEventListener("click",async function(){if(s===1&&d==="")document.getElementById("one-off-error-text-id").style.display="block";else if(s===2&&(d===""||u===""))document.getElementById("one-off-error-text-id").style.display="block";else if(s===3&&(d===""||u===""||E===""))document.getElementById("one-off-error-text-id").style.display="block";else{let t=document.getElementById("product-quantity-field").value;console.log("valueeee = "+t),await b(t,localStorage.getItem("cart_id"),f),await b(t,localStorage.getItem("cart_id"),"gid://shopify/ProductVariant/40777319907395")}})},O=async t=>{let n=await x(`{
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
        }}}}}`),o=n.product.options;s=o.length;for(let e=0;e<o.length;e++){document.getElementById(`option${e+1}-title-id`).style.display="block",document.getElementById(`option${e+1}-title-id`).textContent=o[e].name;for(let i=0;i<o[e].values.length;i++)U(o[e].values[i],o[e].id,`option${e+1}`,n.product.variants.edges)}};function U(t,n,o,e){let i=document.createElement("div");i.className="row",i.innerHTML=`

<div id="${o}-item${t}" class="${o}div ${t}${n.substring(28)}">
<div class="text-block-95">${t}</div></div>
    `;let a=document.getElementById(`variants-${o}-grid-id`),r=document.createElement("div");r.setAttribute("class",`${o}-div`),r.appendChild(i),a.appendChild(r),document.getElementById(`${o}-item${t}`).addEventListener("click",function(){o==="option1"?d=t:o==="option2"?u=t:E=t,document.getElementById("error-text-id").style.display="none",document.getElementById("one-off-error-text-id").style.display="none",[...document.getElementsByClassName(`${o}div`)].forEach(y=>{y.style.borderColor="#f1eeee"}),[...document.getElementsByClassName(`${o}div ${t}${n.substring(28)}`)].forEach(y=>{y.style.borderColor="black"}),M(e)})}var M=t=>{if(s===1)for(let n=0;n<t.length;n++)t[n].node.title===d&&(f=t[n].node.id);else if(s===2)for(let n=0;n<t.length;n++)t[n].node.title===`${d} / ${u}`&&(f=t[n].node.id);else if(s===3)for(let n=0;n<t.length;n++)t[n].node.title===`${d} / ${u} / ${E}`&&(f=t[n].node.id)};window.Webflow||(window.Webflow=[]);window.Webflow.push(async()=>{v("John Do wewewewe")});p();if(document.currentScript?.baseURI.toString().includes("category-details")){let t="";document.currentScript?.baseURI.toString().includes("5eebf742287825892cd6c6d44ee1")?t="https://becapy-new-5eebf742287825892cd6c6d44ee1.webflow.io":t="https://becapy-new.webflow.io/";let o=new URLSearchParams(window.location.search).get("collection");window.fsAttributes=window.fsAttributes||[],window.fsAttributes.push(["cmsload",async e=>{console.log("Hello from the CMS");let i=0,a=e.find(({wrapper:c})=>c.id==="products-cms-id")??e[0],[r]=a.items,h=r.element,C=await N(Number(o));a.clearItems(),await C.map(async c=>{h.id=c.id+"#becaby";let m=H(c,h);await a.addItems([m]),document.getElementById(`${c.id}#becaby`)?.addEventListener("click",function(){window.open(`${t}/product-details?product_id=${c.id}`,"_self")})});let y=await D(),S=await R();document.currentScript?.baseURI.toString().includes("5eebf742287825892cd6c6d44ee1")?await S.map(async c=>{i++,c.id===Number(o)&&(document.getElementById("category-head-id")!=null&&(document.getElementById("category-head-id").textContent=c.title),document.getElementById("category-description-id").innerHTML=c.body_html),console.log("collectionsCount = "+i);let m=`${t}/category-details?collection=`+c.id;i===S.length?(console.log("collectionsCount = "+i),document.getElementById("flex-text-id").innerHTML+=`<a href=${m} class="text-decoration-none link">${c.title}</a>`):(console.log("collectionsCount = "+i),document.getElementById("flex-text-id").innerHTML+=`<a href=${m} class="text-decoration-none link">${c.title}</a> <div class="breadcrumb-divider-2">/</div>`)}):await y.map(async c=>{i++,c.id===Number(o)&&(document.getElementById("category-head-id")!=null&&(document.getElementById("category-head-id").textContent=c.title),document.getElementById("category-description-id").innerHTML=c.body_html),console.log("collectionsCount = "+i);let m=`${t}/category-details?collection=`+c.id;i===y.length?(console.log("collectionsCount = "+i),document.getElementById("flex-text-id").innerHTML+=`<a href=${m} class="text-decoration-none link">${c.title}</a>`):(console.log("collectionsCount = "+i),document.getElementById("flex-text-id").innerHTML+=`<a href=${m} class="text-decoration-none link">${c.title}</a> <div class="breadcrumb-divider-2">/</div>`)}),document.getElementById("loader-id").style.display="none",window.Webflow.push(function(){$("html").attr("data-wf-page","65cdfd5f1054c1ba09309d71"),window.Webflow&&window.Webflow.destroy(),window.Webflow&&window.Webflow.ready(),window.Webflow&&window.Webflow.require("ix2").init(),document.dispatchEvent(new Event("readystatechange"))})}])}else document.currentScript?.baseURI.toString().includes("product-details")?q():document.currentScript?.baseURI.toString().includes("purchase")&&B();var N=async t=>{try{return await(await fetch(`https://getproductsbycollectionidhttps-dkhndz7lcq-uc.a.run.app/?collectionId=${t}`)).json()}catch{return[]}},H=(t,n)=>{let o=n.cloneNode(!0),e=o.querySelector('[data-element="image"]'),i=o.querySelector('[data-element="title"]'),a=o.querySelector('[data-element="description"]'),r=o.querySelector('[data-element="price"]');return console.log(t.product.image),e&&t.product.image!==null&&(e.src=t.product.image.src),i&&(i.textContent=t.product.title),a&&(a.innerHTML=t.product.body_html),r&&(r.textContent=t.product.variants.length===0?"-":t.product.variants[0].price+" AED"),o};var D=async()=>{try{let t=[];return await fetch("https://getcustomcollections-dkhndz7lcq-uc.a.run.app").then(async n=>(t=(await n.json()).custom_collections,t)),t}catch{return[]}},R=async()=>{try{let t=[],n=[];return await fetch("https://getcustomcollections-dkhndz7lcq-uc.a.run.app").then(async o=>{t=(await o.json()).custom_collections;for(let e=0;e<t.length;e++)(t[e].id===287584649283||t[e].id===287556894787||t[e].id===287582322755||t[e].id===287584550979||t[e].id===287584616515||t[e].id===287556927555)&&n.push(t[e]);return n}),n}catch{return[]}};})();
