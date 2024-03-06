/* eslint-disable prettier/prettier */
const storeFrontAccessToken = "5adb4164b44b050e0c8adad04b9dfa32";
export const loadCart = () => {
    console.log("document.currentScript?.baseURI.toString() = " + document.currentScript?.baseURI.toString());
    const cartId = localStorage.getItem('cart_id');
    if (cartId) {
        fillCartItems(cartId);
    } else {
        createNewCart();
    }
};

const fillCartItems = async (cartId: string) => {

    const ql = `
 query GetCart($cartId: ID!) { 
        cart(id: $cartId) {
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

    const vars = `
{
  "cartId": ${cartId}
}
`;

    await fetch("https://209c5e-2.myshopify.com/api/2024-01/graphql.json", {
        method: "POST",
        body: JSON.stringify({
            query: ql,
            variables: vars,
        }),
        headers: {
            "X-Shopify-Storefront-Access-Token": storeFrontAccessToken,
            "Content-type": "application/json; charset=UTF-8"
        }
    }).then(async (result) => {
        const ql = await result.json();
        console.log(ql.data.cart.checkoutUrl);
        if (ql.data.lines.edges.length > 0) {
            document.getElementById("cart-quantity-id")!.textContent = ql.data.lines.edges.length.toString();
            document.getElementById("cart-quantity-id")!.style.display = "block";
        } else {
            document.getElementById("cart-quantity-id")!.style.display = "none";
        }
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
    await fetch("https://209c5e-2.myshopify.com/api/2024-01/graphql.json", {
        method: "POST",
        body: JSON.stringify({
            query: query,
        }),
        headers: {
            "X-Shopify-Storefront-Access-Token": storeFrontAccessToken,
            "Content-type": "application/json; charset=UTF-8"
        }
    }).then(async (result) => {
        const ql = await result.json();
        console.log(ql.cartCreate.cart.checkoutUrl);
        console.log(ql.cartCreate.cart.id);
        localStorage.setItem("cart_id", ql.cartCreate.cart.id);
        fillCartItems(ql.cartCreate.cart.id);
    });
};

