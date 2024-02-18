"use strict";
(() => {
  // bin/live-reload.js
  new EventSource(`${"http://localhost:3000"}/esbuild`).addEventListener("change", () => location.reload());

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
        const collectionInstance = listInstances.find(({ wrapper }) => wrapper.id === "categories-cms-id") ?? listInstances[0];
        const collections = await getCustomCategories();
        console.log("collections[0].title = " + collections[0].title);
        const [firstCollectioItem] = collectionInstance.items;
        const collectionItemTemplateElement = firstCollectioItem.element;
        collectionInstance.clearItems();
        await collections.map(async (collection) => {
          if (collection.id === Number(currentCollectionId)) {
            if (document.getElementById("category-head-id") != null) {
              document.getElementById("category-head-id").textContent = collection.title.toUpperCase();
            }
            document.getElementById("category-description-id").innerHTML = collection.body_html.toUpperCase();
          }
          collectionItemTemplateElement.id = collection.id + "#becaby";
          const item = createCollectionItem(
            collection,
            collectionItemTemplateElement,
            currentCollectionId
          );
          await collectionInstance.addItems([item]);
          document.getElementById(`${collection.id}#becaby`)?.addEventListener("click", function() {
            window.open(
              `https://becapy-new.webflow.io/category-details?collection=${collection.id}`,
              "_self"
            );
          });
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
    if (image)
      image.src = collectionProduct.product.image.src;
    if (title)
      title.textContent = collectionProduct.product.title;
    if (description)
      description.innerHTML = collectionProduct.product.body_html;
    if (price)
      price.textContent = "19.99 AED";
    return newItem;
  };
  var createCollectionItem = (collection, templateElement, collectioId) => {
    const newItem = templateElement.cloneNode(true);
    const title = newItem.querySelector('[data-element="collection_title"]');
    if (title)
      title.textContent = collection.title;
    if (collection.id === Number(collectioId)) {
      title.style.fontWeight = "bold";
      title.style.color = "black";
    }
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
