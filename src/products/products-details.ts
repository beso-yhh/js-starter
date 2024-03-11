/* eslint-disable prefer-destructuring */
import { callGraphQL } from 'src/graphql.ts/base';

import { addToCart, loadCart } from '$utils/cart';

/* eslint-disable prettier/prettier */

// for variants;
let option1 = "";
let option2 = "";
let option3 = "";
let countOfVariants = 0;
let selectedVariantId = "";

export const initProductDetails = () => {
    loadCart();
    let productId = '';
    const paramString = document.currentScript?.baseURI.split('?')[1];
    const params_arr = paramString!.split('&');

    for (let i = 0; i < params_arr.length; i++) {
        const pair = params_arr[i].split('=');
        if (pair[0] === 'product_id') {
            productId = pair[1];
        }
    }
    initListeneres(productId);
    loadVariants(productId);

};

const initListeneres = (productId: string) => {
    document.getElementById('add-to-cart-btn-id')!.addEventListener('click', async function () {
        if (countOfVariants === 1 && option1 === "") {
            document.getElementById("error-text-id")!.style.display = "block";
        } else if (countOfVariants === 2 && (option1 === "" || option2 === "")) {
            document.getElementById("error-text-id")!.style.display = "block";
        } else if (countOfVariants === 3 && (option1 === "" || option2 === "" || option3 === "")) {
            document.getElementById("error-text-id")!.style.display = "block";

        } else {
            console.log("selectedVariantId = " + selectedVariantId);
            addToCart(1, localStorage.getItem("cart_id")!, selectedVariantId);
        }
    });

    document.getElementById('one-off-add-to-cart-id')!.addEventListener('click', async function () {
        await addToCart(1, localStorage.getItem("cart_id")!, selectedVariantId);
        await addToCart(1, localStorage.getItem("cart_id")!, "gid://shopify/ProductVariant/40777319907395");
    });


}

const loadVariants = async (productId: string) => {
    const result = await callGraphQL(`{
  product(id:"gid://shopify/Product/${productId}"){
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
        }}}}}`);

    const productOptions = result.product.options;
    countOfVariants = productOptions.length;
    for (let i = 0; i < productOptions.length; i++) {
        document.getElementById(`option${i + 1}-title-id`)!.style.display = "block";
        document.getElementById(`option${i + 1}-title-id`)!.textContent = productOptions[i].name;
        for (let j = 0; j < productOptions[i].values.length; j++) {
            addElementToGrid(
                productOptions[i].values[j],
                productOptions[i].id,
                `option${i + 1}`,
                result.product.variants.edges);
        }
    }
};


function addElementToGrid(value: string, valueId: string, type: string, variants: any) {
    const div = document.createElement('div');
    div.className = 'row';
    div.innerHTML = `

<div id="${type}-item${value}" class="${type}div ${value}${valueId.substring(28)}">
<div class="text-block-95">${value}</div></div>
    `;
    const options = document.getElementById(`variants-${type}-grid-id`);
    const card = document.createElement('div');
    card.setAttribute('class', `${type}-div`);
    card.appendChild(div);
    options!.appendChild(card);
    document.getElementById(`${type}-item${value}`)!.addEventListener("click", function () {
        if (type === "option1") {
            option1 = value;

        } else if (type === "option2") {
            option2 = value;
        }
        else {
            option3 = value;
        }
        document.getElementById("error-text-id")!.style.display = "none";

        const items = [...document.getElementsByClassName(`${type}div`)];
        items.forEach(item => {
            item.style.borderColor = "#f1eeee";
        });
        const itemsBlack = [...document.getElementsByClassName(`${type}div ${value}${valueId.substring(28)}`)];
        itemsBlack.forEach(item => {
            item.style.borderColor = "black";
        });
        getSelectedVariant(variants);
        // checkOneOffVisibility();
    });
}

const getSelectedVariant = (variants: any) => {
    if (countOfVariants === 1) {
        for (let i = 0; i < variants.length; i++) {
            if (variants[i].node.title === option1) {
                selectedVariantId = variants[i].node.id;
            }
        }
    } else if (countOfVariants === 2) {
        for (let i = 0; i < variants.length; i++) {
            if (variants[i].node.title === (`${option1} / ${option2}`)) {
                selectedVariantId = variants[i].node.id;
            }
        }
    } else if (countOfVariants === 3) {
        for (let i = 0; i < variants.length; i++) {
            if (variants[i].node.title === (`${option1} / ${option2} / ${option3}`)) {
                selectedVariantId = variants[i].node.id;
            }
        }
    }
};

const checkOneOffVisibility = () => {
    if (countOfVariants === 1 && option1 !== "") {
        document.getElementById("make-it-one-off-btn-id")!.style.display = "block";
    }
    else if (countOfVariants === 2 && (option1 !== "" && option2 !== "")) {
        document.getElementById("make-it-one-off-btn-id")!.style.display = "block";
    }
    else if (countOfVariants === 3 && (option1 !== "" && option2 !== "" && option3 !== "")) {
        document.getElementById("make-it-one-off-btn-id")!.style.display = "block";
    }
}