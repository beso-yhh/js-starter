import type { CMSList } from 'src/types/CMSList';

/* eslint-disable prettier/prettier */
const storeFrontAccessToken = "5adb4164b44b050e0c8adad04b9dfa32";
let checkoutURL = "";
export const loadCart = () => {
  // console.log("document.currentScript?.baseURI.toString() = " + document.currentScript?.baseURI.toString());
  const cartId = localStorage.getItem('cart_id');
  console.log("cart_id = " + cartId);
  if (cartId) {
    fillCartItems(cartId);
  } else {
    createNewCart();
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
      document.getElementById("cart-quantity-id")!.textContent = ql.data.cart.lines.edges.length.toString();
      document.getElementById("cart-quantity-id")!.style.display = "flex";
      document.getElementById("cart-quantity-id")!.style.justifyContent = "center";
      createElements(ql.data.cart.lines.edges);
    } else {
      document.getElementById("cart-quantity-id")!.style.display = "none";

      // window.fsAttributes = window.fsAttributes || [];
      // window.fsAttributes.push([
      //     'cmsload',
      //     async (listInstances: CMSList[]) => {
      //         const listInstance =
      //             listInstances.find(({ wrapper }) => wrapper.id === 'checkout-items-id') ?? listInstances[0];

      //         // Remove existing items
      //         listInstance.clearItems();
      //     }
      // ]);
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
    fillCartItems(cartId);
  }).catch(e => {
    console.log("e = " + e.toString());
  });
};


const createElements = (data: any) => {
  for (let i = 0; i < data.length; i++) {
    const element = data[i].node;
    const div = document.createElement('div');
    div.className = 'row';
    div.innerHTML = getGridElement(
      element.merchandise.title,
      element.merchandise.product.images.edges[0].node.url,
      element.cost.subtotalAmount.amount,
      (element.discountAllocations.length === 0 ? "" : element.discountAllocations[0].discountedAmount.amount),
      element.quantity
    );
    const itemsGrid = document.getElementById(`checkout-items-grid-id`);
    const card = document.createElement('div');
    card.setAttribute('class', "grid-item");
    card.appendChild(div);
    itemsGrid!.appendChild(card);
  }
}

const getGridElement = (title: string, image: string, price: string, discountedPrice: string, countItems: number) => {
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
}
// https://cdn.jsdelivr.net/gh/beso-yhh/js-starter@1.4.1/dist/index.js