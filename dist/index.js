"use strict";
(() => {
  // bin/live-reload.js
  new EventSource(`${"http://localhost:3000"}/esbuild`).addEventListener("change", () => location.reload());

  // src/utils/cart.ts
  var storeFrontAccessToken = "5adb4164b44b050e0c8adad04b9dfa32";
  var checkoutURL = "";
  var loadCart = () => {
    const cartId = localStorage.getItem("cart_id");
    console.log("cart_id = " + cartId);
    if (cartId) {
      fillCartItems(cartId);
    } else {
      createNewCart();
    }
  };
  var fillCartItems = async (cartId) => {
    const query = `
 query GetCart { 
        cart(id: "${cartId}") {
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
`;
    await fetch("https://209c5e-2.myshopify.com/api/2024-01/graphql.json", {
      method: "POST",
      body: JSON.stringify({
        query
      }),
      headers: {
        "X-Shopify-Storefront-Access-Token": storeFrontAccessToken,
        "Content-type": "application/json"
      }
    }).then(async (result) => {
      const ql = await result.json();
      console.log("Checkout URL = " + ql.data.cart.checkoutUrl);
      checkoutURL = ql.data.cart.checkoutUrl;
      document.getElementById("checkout-btn-id").addEventListener("click", function() {
        window.open(ql.data.cart.checkoutUrl, "_blank");
      });
      if (ql.data.cart.lines.edges.length > 0) {
        document.getElementById("cart-quantity-id").textContent = ql.data.cart.lines.edges.length.toString();
        document.getElementById("cart-quantity-id").style.display = "flex";
        document.getElementById("cart-quantity-id").style.justifyContent = "center";
        createElements(ql.data.cart.lines.edges);
      } else {
        document.getElementById("cart-quantity-id").style.display = "none";
      }
    }).catch((e) => {
      document.getElementById("cart-quantity-id").style.display = "none";
      console.log("e = " + e.toString());
    });
  };
  var createNewCart = async () => {
    const query = `
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
`;
    console.log("BEFORE -- ");
    await fetch("https://209c5e-2.myshopify.com/api/2024-01/graphql.json", {
      method: "POST",
      body: JSON.stringify({
        query
        // variables: "{}"
      }),
      headers: {
        "X-Shopify-Storefront-Access-Token": storeFrontAccessToken,
        "Content-type": "application/json; charset=UTF-8"
      }
    }).then(async (result) => {
      console.log("ddddd ss");
      const ql = await result.json();
      const cartId = ql.data.cartCreate.cart.id;
      console.log(ql.data.cartCreate.cart.checkoutUrl);
      console.log(cartId);
      localStorage.setItem("cart_id", cartId);
      fillCartItems(cartId);
    }).catch((e) => {
      console.log("e = " + e.toString());
    });
  };
  var createElements = (data) => {
    for (let i = 0; i < data.length; i++) {
      const element = data[i].node;
      const div = document.createElement("div");
      div.className = "row";
      div.innerHTML = getGridElement(
        element.merchandise.title,
        element.merchandise.product.images.edges[0].node.url,
        element.cost.subtotalAmount.amount,
        element.discountAllocations.length === 0 ? "" : element.discountAllocations[0].discountedAmount.amount,
        element.quantity
      );
      const itemsGrid = document.getElementById(`checkout-items-grid-id`);
      const card = document.createElement("div");
      card.setAttribute("class", "grid-item");
      card.appendChild(div);
      itemsGrid.appendChild(card);
    }
  };
  var getGridElement = (title, image, price, discountedPrice, countItems) => {
    console.log("title = " + title);
    return `
<div class="w-commerce-commercecartitem cart-item-wrapper">
    <img 
        src=${image}
        alt="" class="w-commerce-commercecartitemimage cart-image-image">
    <div class="w-commerce-commercecartiteminfo">
        <div 
            class="w-commerce-commercecartproductname cart-item-title">${title}</div>
        <div 
            class="cart-item-price">${price} AED</div>
<ul 
            class="w-commerce-commercecartoptionlist"
            data-wf-collection="database.commerceOrder.userItems.0.product.f_sku_properties_3dr"
            data-wf-template-id="wf-template-22026248-201a-c94d-2bf0-3cf39e1de403">
            
        </ul><a href="#" role=""
            class="w-inline-block" data-wf-cart-action="remove-item" data-commerce-sku-id="659d238ff90eb981ff648528"
            aria-label="Remove item from cart">
            <div class="cart-remove-link">Remove</div>
        </a>
    </div><input
        class="w-commerce-commercecartquantity input cart-quantity-input" required="" pattern="^[0-9]+$"
        inputmode="numeric" type="number" name="quantity" autocomplete="off" data-wf-cart-action="update-item-quantity 
        data-commerce-sku-id="659d238ff90eb981ff648528" value="${countItems}" readonly>
</div>`;
  };

  // node_modules/.pnpm/@finsweet+ts-utils@0.40.0/node_modules/@finsweet/ts-utils/dist/webflow/getPublishDate.js
  var getPublishDate = (page = document) => {
    const publishDatePrefix = "Last Published:";
    for (const node of page.childNodes) {
      if (node.nodeType === Node.COMMENT_NODE && node.textContent?.includes(publishDatePrefix)) {
        const publishDateValue = node.textContent.trim().split(publishDatePrefix)[1];
        if (publishDateValue)
          return new Date(publishDateValue);
      }
    }
  };

  // src/utils/greet.ts
  var greetUser = (name) => {
    const publishDate = getPublishDate();
    console.log(`Hello ${name}!`);
    console.log(
      `This site was last published on ${publishDate?.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "2-digit"
      })}.`
    );
  };

  // src/index.ts
  window.Webflow ||= [];
  window.Webflow.push(async () => {
    const name = "John Do wewewewe";
    greetUser(name);
  });
  if (document.currentScript?.baseURI.toString().includes("category-details")) {
    const searchParams = new URLSearchParams(window.location.search);
    const currentCollectionId = searchParams.get("collection");
    window.fsAttributes = window.fsAttributes || [];
    window.fsAttributes.push([
      "cmsload",
      async (listInstances) => {
        console.log(`Hello from the CMS`);
        let collectionsCount = 0;
        const listInstance = listInstances.find(({ wrapper }) => wrapper.id === "products-cms-id") ?? listInstances[0];
        const [firstItem] = listInstance.items;
        const itemTemplateElement = firstItem.element;
        const collectionProducts = await fetchCollectionProducts(Number(currentCollectionId));
        listInstance.clearItems();
        await collectionProducts.map(async (collectionProduct) => {
          itemTemplateElement.id = collectionProduct.id + "#becaby";
          const item = createItem(collectionProduct, itemTemplateElement);
          await listInstance.addItems([item]);
          document.getElementById(`${collectionProduct.id}#becaby`)?.addEventListener("click", function() {
            window.open(
              `https://becapy-new.webflow.io/product-details?product_id=${collectionProduct.id}`,
              "_self"
            );
          });
        });
        const collections = await getCustomCategories();
        await collections.map(async (collection) => {
          collectionsCount++;
          if (collection.id === Number(currentCollectionId)) {
            if (document.getElementById("category-head-id") != null) {
              document.getElementById("category-head-id").textContent = collection.title;
            }
            document.getElementById("category-description-id").innerHTML = collection.body_html;
          }
          if (collectionsCount === collections.length) {
            if (collection.id === Number(currentCollectionId)) {
              document.getElementById("flex-text-id").innerHTML += `<a href="/" class="text-decoration-none link">${collection.title}</a>`;
            } else {
              document.getElementById("flex-text-id").innerHTML += `<a href="/" class="text-decoration-none link">${collection.title}</a>`;
            }
          } else {
            if (collection.id === Number(currentCollectionId)) {
              document.getElementById("flex-text-id").innerHTML += `<a href="/" class="text-decoration-none link">${collection.title}</a> <div class="breadcrumb-divider-2">/</div>`;
            } else {
              document.getElementById("flex-text-id").innerHTML += `<a href="/" class="text-decoration-none link">${collection.title}</a> <div class="breadcrumb-divider-2">/</div>`;
            }
          }
        });
        document.getElementById("loader-id").style.display = "none";
        window.Webflow.push(function() {
          $("html").attr("data-wf-page", "65cdfd5f1054c1ba09309d71");
          window.Webflow && window.Webflow.destroy();
          window.Webflow && window.Webflow.ready();
          window.Webflow && window.Webflow.require("ix2").init();
          document.dispatchEvent(new Event("readystatechange"));
        });
      }
    ]);
  } else if (document.currentScript?.baseURI.toString().includes("product-details")) {
    loadCart();
  }
  var fetchCollectionProducts = async (collectionId) => {
    try {
      const response = await fetch(
        `https://getproductsbycollectionidhttps-dkhndz7lcq-uc.a.run.app/?collectionId=${collectionId}`
      );
      const data = await response.json();
      return data;
    } catch (error) {
      return [];
    }
  };
  var createItem = (collectionProduct, templateElement) => {
    const newItem = templateElement.cloneNode(true);
    const image = newItem.querySelector('[data-element="image"]');
    const title = newItem.querySelector('[data-element="title"]');
    const description = newItem.querySelector('[data-element="description"]');
    const price = newItem.querySelector('[data-element="price"]');
    console.log(collectionProduct.product.image);
    if (image && collectionProduct.product.image !== null)
      image.src = collectionProduct.product.image.src;
    if (title)
      title.textContent = collectionProduct.product.title;
    if (description)
      description.innerHTML = collectionProduct.product.body_html;
    if (price)
      price.textContent = collectionProduct.product.variants.length === 0 ? "-" : collectionProduct.product.variants[0].price + " AED";
    return newItem;
  };
  var getCustomCategories = async () => {
    try {
      let data = [];
      await fetch("https://getcustomcollections-dkhndz7lcq-uc.a.run.app").then(async (result) => {
        data = (await result.json())["custom_collections"];
        console.log(data[0].id);
        return data;
      });
      return data;
    } catch (error) {
      return [];
    }
  };
})();
//# sourceMappingURL=index.js.map
