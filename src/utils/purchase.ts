import { addToCartForPlan, createNewCart, fill } from '$utils/cart';

/* eslint-disable prefer-destructuring */
/* eslint-disable prettier/prettier */
export const initPurchaseFuncs = () => {
    console.log("initPurchaseFuncs");
    let qrId = '';
    const paramString = document.currentScript?.baseURI.split('?')[1];
    const params_arr = paramString!.split('&');

    for (let i = 0; i < params_arr.length; i++) {
        const pair = params_arr[i].split('=');
        if (pair[0] === 'id') {
            qrId = pair[1];
        }
    }
    document.getElementById('six-id')!.addEventListener('click', async function () {
        // document.getElementById("loader-id")!.style.display = "block";
        const cartObj: any = await createNewCart(false);
        await addToCartForPlan(1, cartObj!.id, "gid://shopify/ProductVariant/41058158903363", qrId, "6-months");
        window.open(cartObj.checkoutUrl, "_blank");
    });
    document.getElementById('recommend-id')!.addEventListener('click', async function () {
        // document.getElementById("loader-id")!.style.display = "block";
        const cartObj: any = await createNewCart(false);
        await addToCartForPlan(1, cartObj!.id, "gid://shopify/ProductVariant/41058158936131", qrId, "1-year");
        window.open(cartObj.checkoutUrl, "_blank");
    });
    document.getElementById('life-time-id')!.addEventListener('click', async function () {
        // document.getElementById("loader-id")!.style.display = "block";
        const cartObj: any = await createNewCart(false);
        await addToCartForPlan(1, cartObj!.id, "gid://shopify/ProductVariant/41058158968899", qrId, "life-time");
        window.open(cartObj.checkoutUrl, "_blank");
    });
};
