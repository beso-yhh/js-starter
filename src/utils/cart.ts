/* eslint-disable prettier/prettier */
const storeFrontAccessToken = "5adb4164b44b050e0c8adad04b9dfa32";
let checkoutURL = "";

export const loadCart = async () => {
  // console.log("document.currentScript?.baseURI.toString() = " + document.currentScript?.baseURI.toString());
  const cartId = localStorage.getItem('cart_id');
  console.log("cart_id = " + cartId);
  if (cartId) {
    await fillCartItems(cartId);
  } else {
    await createNewCart();
  }
};

const fillCartItems = async (cartId: string) => {

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
`;



  await fetch("https://209c5e-2.myshopify.com/api/2024-01/graphql.json", {
    method: "POST",
    body: JSON.stringify({
      query: query,
    }),
    headers: {
      "X-Shopify-Storefront-Access-Token": storeFrontAccessToken,
      "Content-type": "application/json",
    }
  }).then(async (result) => {

    const ql = await result.json();
    console.log("Checkout URL = " + ql.data.cart.checkoutUrl);
    checkoutURL = ql.data.cart.checkoutUrl;
    document.getElementById("checkout-btn-id")!.addEventListener('click', function () {
      window.open(ql.data.cart.checkoutUrl, "_blank");
    });
    if (ql.data.cart.lines.edges.length > 0) {
      document.getElementById("no-items-id")!.style.display = "none";
      document.getElementById("div-loader-id")!.style.display = "none";

      document.getElementById("cart-quantity-id")!.textContent = ql.data.cart.lines.edges.length.toString();
      document.getElementById("cart-quantity-id")!.style.display = "flex";
      document.getElementById("cart-quantity-id")!.style.justifyContent = "center";

      document.getElementById("subtotal-text-id")!.textContent = ql.data.cart.cost.subtotalAmount.amount;
      document.getElementById("subtotal-div-id")!.style.display = "flex";

      document.getElementById("cart-quantity-id")!.style.display = "flex";
      document.getElementById("cart-quantity-id")!.style.justifyContent = "center";

      document.getElementById("checkout-btn-id")!.style.display = "block";

      createElements(ql.data.cart.lines.edges);
    } else {
      // For Deleting Last item in the grid in deleting cases.
      document
        .querySelectorAll(".cart-grid-item")
        .forEach((e) => e.parentNode!.removeChild(e));

      document.getElementById("no-items-id")!.style.display = "block";
      document.getElementById("div-loader-id")!.style.display = "none";
      document.getElementById("subtotal-div-id")!.style.display = "none";
      document.getElementById("cart-quantity-id")!.style.display = "none";
      document.getElementById("checkout-btn-id")!.style.display = "none";
    }
  }).catch(e => {
    document.getElementById("cart-quantity-id")!.style.display = "none";
    console.log("e = " + e.toString());
  });
};

const createNewCart = async () => {

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
  document.getElementById("div-loader-id")!.style.display = "block";

  console.log("BEFORE -- ");
  await fetch("https://209c5e-2.myshopify.com/api/2024-01/graphql.json", {
    method: "POST",
    body: JSON.stringify({
      query: query,
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
    await fillCartItems(cartId);
  }).catch(e => {
    console.log("e = " + e.toString());
  });
};


const createElements = (data: any) => {
  document
    .querySelectorAll(".cart-grid-item")
    .forEach((e) => e.parentNode!.removeChild(e));
  for (let i = 0; i < data.length; i++) {
    const element = data[i].node;
    const div = document.createElement('div');

    div.className = 'row';
    div.innerHTML = getGridElement(
      element.id,
      element.merchandise.title,
      element.merchandise.product.images.edges[0].node.url,
      element.cost.subtotalAmount.amount,
      (element.discountAllocations.length === 0 ? "" : element.discountAllocations[0].discountedAmount.amount),
      element.quantity
    );
    const itemsGrid = document.getElementById(`checkout-items-grid-id`);
    const card = document.createElement('div');
    card.setAttribute('class', "cart-grid-item");
    card.appendChild(div);
    itemsGrid!.appendChild(card);
    document.getElementById(`remove_${element.id}`)?.addEventListener('click', async function () {
      await deleteLineItem(localStorage.getItem("cart_id")!, element.id);
    });
  }
}

const getGridElement = (lineId: string, title: string, image: string, price: string, discountedPrice: string, countItems: number) => {
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
            class="w-inline-block" data-wf-cart-action="remove-item" 
            aria-label="Remove item from cart" id="remove_${lineId}">
            <div class="cart-remove-link">Remove</div>
        </a>
    </div>
<input
        class="w-commerce-commercecartquantity input cart-quantity-input" required="" pattern="^[0-9]+$"
        inputmode="numeric" type="number" name="quantity" autocomplete="off" data-wf-cart-action="update-item-quantity"
        data-commerce-sku-id="659d238ff90eb981ff648528" value="${countItems}" readonly>

</div>`;
}

export const addToCart = async (quantity: number, cartId: string, variantId: string) => {
  const query = `
 mutation AddToCart {
        cartLinesAdd(
          cartId: "${cartId}",
          lines: [{ quantity: ${quantity}, merchandiseId: "${variantId}"}]) {
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
`;
  document.getElementById("div-loader-id")!.style.display = "block";

  await fetch("https://209c5e-2.myshopify.com/api/2024-01/graphql.json", {
    method: "POST",
    body: JSON.stringify({
      query: query,
    }),
    headers: {
      "X-Shopify-Storefront-Access-Token": storeFrontAccessToken,
      "Content-type": "application/json",
    }
  }).then(async (result) => {
    document.querySelector('.ths02-menu-bars-wrapper-12')!.click();

    document.getElementById("div-loader-id")!.style.display = "none";
    await loadCart();

  }).catch(e => {
    console.log("e = " + e.toString());
  });

};


const deleteLineItem = async (cartId: string, lineId: string) => {
  const query = `
mutation cartLinesRemove {
  cartLinesRemove(cartId: "${cartId}", lineIds: ["${lineId}"]) {
    cart {
      id
    }
    userErrors {
      field
      message
    }
  }
}
`;
  document.getElementById("div-loader-id")!.style.display = "block";

  await fetch("https://209c5e-2.myshopify.com/api/2024-01/graphql.json", {
    method: "POST",
    body: JSON.stringify({
      query: query,
    }),
    headers: {
      "X-Shopify-Storefront-Access-Token": storeFrontAccessToken,
      "Content-type": "application/json",
    }
  }).then(async (result: any) => {
    console.log("result = " + result.data);
    console.log("FROM Delete");
    document.getElementById("div-loader-id")!.style.display = "none";
    await loadCart();

  }).catch(e => {
    console.log("e = " + e.toString());
  });
};

// https://cdn.jsdelivr.net/gh/beso-yhh/js-starter@1.4.3/dist/index.js

document.getElementById("qr-plus-id").addEventListener('click', function () {
  if (parseInt(document.getElementById("qr-code-quantity-field").value) > 0) {
    document.getElementById("qr-code-quantity-field").value = parseInt(document.getElementById("qr-code-quantity-field").value) + 1;
  } else {
    document.getElementById("qr-code-quantity-field").value = 1;
  }
});
