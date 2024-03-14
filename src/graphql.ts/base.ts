/* eslint-disable prettier/prettier */

// const storeFrontAccessToken = "5adb4164b44b050e0c8adad04b9dfa32";
const storeFrontAccessToken = "1dba4d16bdf57a57f61e90de5a60175d";

export const callGraphQL: any = async (query: string) => {
    let res = null;
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
        const r = await result.json();
        res = r.data;
    }).catch(e => {
        console.log("e = " + e.toString());
        return "Error!";
    });
    return res;

};
