"use strict";(()=>{var y="a6f6d54288d4907127991e86952bb7f9",q="",u=async()=>{let t=localStorage.getItem("cart_id");console.log("cart_id = "+t),t?await S(t):await l(!0)},S=async t=>{let n=`
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
`;await fetch("https://209c5e-2.myshopify.com/api/2024-01/graphql.json",{method:"POST",body:JSON.stringify({query:n}),headers:{"X-Shopify-Storefront-Access-Token":y,"Content-type":"application/json"}}).then(async e=>{let o=await e.json();console.log("Checkout URL = "+o.data.cart.checkoutUrl),q=o.data.cart.checkoutUrl,document.getElementById("checkout-btn-id").addEventListener("click",function(){window.open(o.data.cart.checkoutUrl,"_blank")}),o.data.cart.lines.edges.length>0?(document.getElementById("no-items-id").style.display="none",document.getElementById("div-loader-id").style.display="none",document.getElementById("cart-quantity-id").textContent=o.data.cart.lines.edges.length.toString(),document.getElementById("cart-quantity-id").style.display="flex",document.getElementById("cart-quantity-id").style.justifyContent="center",document.getElementById("subtotal-text-id").textContent=o.data.cart.cost.subtotalAmount.amount,document.getElementById("subtotal-div-id").style.display="flex",document.getElementById("cart-quantity-id").style.display="flex",document.getElementById("cart-quantity-id").style.justifyContent="center",document.getElementById("checkout-btn-id").style.display="block",x(o.data.cart.lines.edges)):(document.querySelectorAll(".cart-grid-item").forEach(i=>i.parentNode.removeChild(i)),document.getElementById("no-items-id").style.display="block",document.getElementById("div-loader-id").style.display="none",document.getElementById("subtotal-div-id").style.display="none",document.getElementById("cart-quantity-id").style.display="none",document.getElementById("checkout-btn-id").style.display="none")}).catch(async e=>{document.getElementById("cart-quantity-id").style.display="none",console.log("e = "+e.toString()),await l(!0)})},l=async t=>{let n=`
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
`;return document.getElementById("div-loader-id").style.display="block",await fetch("https://209c5e-2.myshopify.com/api/2024-01/graphql.json",{method:"POST",body:JSON.stringify({query:n}),headers:{"X-Shopify-Storefront-Access-Token":y,"Content-type":"application/json; charset=UTF-8"}}).then(async e=>{let o=await e.json(),i=o.data.cartCreate.cart.id;return t&&(localStorage.setItem("cart_id",i),await S(i)),o.data.cartCreate.cart}).catch(e=>{console.log("e = "+e)})},x=t=>{document.querySelectorAll(".cart-grid-item").forEach(n=>n.parentNode.removeChild(n));for(let n=0;n<t.length;n++){let e=t[n].node,o=document.createElement("div");o.className="row",o.innerHTML=T(e.id,e.merchandise.title,e.merchandise.product.images.edges[0].node.url,e.cost.subtotalAmount.amount,e.discountAllocations.length===0?"":e.discountAllocations[0].discountedAmount.amount,e.quantity);let i=document.getElementById("checkout-items-grid-id"),a=document.createElement("div");a.setAttribute("class","cart-grid-item"),a.appendChild(o),i.appendChild(a),document.getElementById(`remove_${e.id}`)?.addEventListener("click",async function(){await L(localStorage.getItem("cart_id"),e.id)})}},T=(t,n,e,o,i,a)=>(console.log("title = "+n),`
<div class="w-commerce-commercecartitem cart-item-wrapper">
    <img 
        src=${e}
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
            aria-label="Remove item from cart" id="remove_${t}">
            <div class="cart-remove-link">Remove</div>
        </a>
    </div>
<input
        class="w-commerce-commercecartquantity input cart-quantity-input" required="" pattern="^[0-9]+$"
        inputmode="numeric" type="number" name="quantity" autocomplete="off" data-wf-cart-action="update-item-quantity"
        data-commerce-sku-id="659d238ff90eb981ff648528" value="${a}" readonly>

</div>`),f=async(t,n,e)=>{let o=`
 mutation AddToCart {
        cartLinesAdd(
          cartId: "${n}",
          lines: [{ quantity: ${t}, merchandiseId: "${e}" }]) {
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
`;document.getElementById("div-loader-id").style.display="block",await fetch("https://209c5e-2.myshopify.com/api/2024-01/graphql.json",{method:"POST",body:JSON.stringify({query:o}),headers:{"X-Shopify-Storefront-Access-Token":y,"Content-type":"application/json"}}).then(async i=>{document.querySelector(".ths02-menu-bars-wrapper-12").click(),document.getElementById("div-loader-id").style.display="none",await u()}).catch(async i=>{console.log("e = "+i.toString()),await l(!0)})},h=async(t,n,e,o,i)=>{let a=`
 mutation AddToCart {
        cartLinesAdd(
          cartId: "${n}",
          lines: [{ 
          attributes: [
                        {
                          key:"qr_id"
                          value:"${o}"
                        },
                        {
                          key:"plan"
                          value:"${i}"
                        }
            ], quantity: ${t}, merchandiseId: "${e}"}]) {
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
`;document.getElementById("div-loader-id").style.display="block",await fetch("https://209c5e-2.myshopify.com/api/2024-01/graphql.json",{method:"POST",body:JSON.stringify({query:a}),headers:{"X-Shopify-Storefront-Access-Token":y,"Content-type":"application/json"}}).then(async r=>await r.json()).catch(async r=>{console.log("e = "+r.toString()),await l(!0)})},L=async(t,n)=>{let e=`
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
`;document.getElementById("div-loader-id").style.display="block",await fetch("https://209c5e-2.myshopify.com/api/2024-01/graphql.json",{method:"POST",body:JSON.stringify({query:e}),headers:{"X-Shopify-Storefront-Access-Token":y,"Content-type":"application/json"}}).then(async o=>{console.log("result = "+o.data),console.log("FROM Delete"),document.getElementById("div-loader-id").style.display="none",await u()}).catch(o=>{console.log("e = "+o.toString())})};var I=(t=document)=>{let n="Last Published:";for(let e of t.childNodes)if(e.nodeType===Node.COMMENT_NODE&&e.textContent?.includes(n)){let o=e.textContent.trim().split(n)[1];if(o)return new Date(o)}};var C=t=>{let n=I();console.log(`Hello ${t}!`),console.log(`This site was last published on ${n?.toLocaleDateString("en-US",{year:"numeric",month:"long",day:"2-digit"})}.`)};var k=()=>{console.log("initPurchaseFuncs");let t="",e=(document.currentScript?.baseURI.split("?")[1]).split("&");for(let o=0;o<e.length;o++){let i=e[o].split("=");i[0]==="id"&&(t=i[1])}document.getElementById("six-id").addEventListener("click",async function(){let o=await l(!1);await h(1,o.id,"gid://shopify/ProductVariant/41058158903363",t,"6-months"),window.open(o.checkoutUrl,"_blank")}),document.getElementById("recommend-id").addEventListener("click",async function(){let o=await l(!1);await h(1,o.id,"gid://shopify/ProductVariant/41058158936131",t,"1-year"),window.open(o.checkoutUrl,"_blank")}),document.getElementById("life-time-id").addEventListener("click",async function(){let o=await l(!1);await h(1,o.id,"gid://shopify/ProductVariant/41058158968899",t,"life-time"),window.open(o.checkoutUrl,"_blank")})};var A="a6f6d54288d4907127991e86952bb7f9",v=async t=>{let n=null;return await fetch("https://209c5e-2.myshopify.com/api/2024-01/graphql.json",{method:"POST",body:JSON.stringify({query:t}),headers:{"X-Shopify-Storefront-Access-Token":A,"Content-type":"application/json"}}).then(async e=>{n=(await e.json()).data}).catch(e=>(console.log("e = "+e.toString()),"Error!")),n};var s="",m="",b="",d=0,p="",B=()=>{u();let t="",e=(document.currentScript?.baseURI.split("?")[1]).split("&");for(let o=0;o<e.length;o++){let i=e[o].split("=");i[0]==="product_id"&&(t=i[1])}P(),_(t)},P=()=>{document.getElementById("add-to-cart-btn-id").addEventListener("click",async function(){d===1&&s===""||d===2&&(s===""||m==="")||d===3&&(s===""||m===""||b==="")?document.getElementById("error-text-id").style.display="block":f(1,localStorage.getItem("cart_id"),p)}),document.getElementById("one-off-add-to-cart-id").addEventListener("click",async function(){if(d===1&&s==="")document.getElementById("one-off-error-text-id").style.display="block";else if(d===2&&(s===""||m===""))document.getElementById("one-off-error-text-id").style.display="block";else if(d===3&&(s===""||m===""||b===""))document.getElementById("one-off-error-text-id").style.display="block";else{let t=document.getElementById("product-quantity-field").value;console.log("valueeee = "+t),await f(t,localStorage.getItem("cart_id"),p),await f(t,localStorage.getItem("cart_id"),"gid://shopify/ProductVariant/40777319907395")}})},_=async t=>{let n=await v(`{
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
        }}}}}`),e=n.product.options;d=e.length;for(let o=0;o<e.length;o++){document.getElementById(`option${o+1}-title-id`).style.display="block",document.getElementById(`option${o+1}-title-id`).textContent=e[o].name;for(let i=0;i<e[o].values.length;i++)O(e[o].values[i],e[o].id,`option${o+1}`,n.product.variants.edges)}};function O(t,n,e,o){let i=document.createElement("div");i.className="row",i.innerHTML=`

<div id="${e}-item${t}" class="${e}div ${t}${n.substring(28)}">
<div class="text-block-95">${t}</div></div>
    `;let a=document.getElementById(`variants-${e}-grid-id`),r=document.createElement("div");r.setAttribute("class",`${e}-div`),r.appendChild(i),a.appendChild(r),document.getElementById(`${e}-item${t}`).addEventListener("click",function(){e==="option1"?s=t:e==="option2"?m=t:b=t,document.getElementById("error-text-id").style.display="none",document.getElementById("one-off-error-text-id").style.display="none",[...document.getElementsByClassName(`${e}div`)].forEach(c=>{c.style.borderColor="#f1eeee"}),[...document.getElementsByClassName(`${e}div ${t}${n.substring(28)}`)].forEach(c=>{c.style.borderColor="black"}),j(o)})}var j=t=>{if(d===1)for(let n=0;n<t.length;n++)t[n].node.title===s&&(p=t[n].node.id);else if(d===2)for(let n=0;n<t.length;n++)t[n].node.title===`${s} / ${m}`&&(p=t[n].node.id);else if(d===3)for(let n=0;n<t.length;n++)t[n].node.title===`${s} / ${m} / ${b}`&&(p=t[n].node.id)};window.Webflow||(window.Webflow=[]);window.Webflow.push(async()=>{C("John Do wewewewe")});u();if(document.currentScript?.baseURI.toString().includes("category-details")){let n=new URLSearchParams(window.location.search).get("collection");window.fsAttributes=window.fsAttributes||[],window.fsAttributes.push(["cmsload",async e=>{console.log("Hello from the CMS");let o=0,i=e.find(({wrapper:c})=>c.id==="products-cms-id")??e[0],[a]=i.items,r=a.element,w=await N(Number(n));i.clearItems(),await w.map(async c=>{r.id=c.id+"#becaby";let g=M(c,r);await i.addItems([g]),document.getElementById(`${c.id}#becaby`)?.addEventListener("click",function(){window.open(`https://becapy-new.webflow.io/product-details?product_id=${c.id}`,"_self")})});let E=await U();await E.map(async c=>{o++,c.id===Number(n)&&(document.getElementById("category-head-id")!=null&&(document.getElementById("category-head-id").textContent=c.title),document.getElementById("category-description-id").innerHTML=c.body_html),console.log("collectionsCount = "+o);let g="https://becapy-new.webflow.io/category-details?collection="+c.id;o===E.length?(console.log("collectionsCount = "+o),document.getElementById("flex-text-id").innerHTML+=`<a href=${g} class="text-decoration-none link">${c.title}</a>`):(console.log("collectionsCount = "+o),document.getElementById("flex-text-id").innerHTML+=`<a href=${g} class="text-decoration-none link">${c.title}</a> <div class="breadcrumb-divider-2">/</div>`)}),document.getElementById("loader-id").style.display="none",window.Webflow.push(function(){$("html").attr("data-wf-page","65cdfd5f1054c1ba09309d71"),window.Webflow&&window.Webflow.destroy(),window.Webflow&&window.Webflow.ready(),window.Webflow&&window.Webflow.require("ix2").init(),document.dispatchEvent(new Event("readystatechange"))})}])}else document.currentScript?.baseURI.toString().includes("product-details")?B():document.currentScript?.baseURI.toString().includes("purchase")&&k();var N=async t=>{try{return await(await fetch(`https://getproductsbycollectionidhttps-dkhndz7lcq-uc.a.run.app/?collectionId=${t}`)).json()}catch{return[]}},M=(t,n)=>{let e=n.cloneNode(!0),o=e.querySelector('[data-element="image"]'),i=e.querySelector('[data-element="title"]'),a=e.querySelector('[data-element="description"]'),r=e.querySelector('[data-element="price"]');return console.log(t.product.image),o&&t.product.image!==null&&(o.src=t.product.image.src),i&&(i.textContent=t.product.title),a&&(a.innerHTML=t.product.body_html),r&&(r.textContent=t.product.variants.length===0?"-":t.product.variants[0].price+" AED"),e};var U=async()=>{try{let t=[];return await fetch("https://getcustomcollections-dkhndz7lcq-uc.a.run.app").then(async n=>(t=(await n.json()).custom_collections,console.log(t[0].id),t)),t}catch{return[]}};})();
