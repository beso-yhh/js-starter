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
    console.log("document.currentScript?.baseURI = " + document.currentScript?.baseURI);
    window.fsAttributes = window.fsAttributes || [];
    window.fsAttributes.push([
      "cmsload",
      async (listInstances) => {
        console.log(`Hello from the CMS`);
        const listInstance = listInstances.find(({ wrapper }) => wrapper.id === "products-cms-id") ?? listInstances[0];
        const [firstItem] = listInstance.items;
        const itemTemplateElement = firstItem.element;
        const collectionProducts = await fetchCollectionProducts(277396226115);
        const products = await fetchProducts();
        listInstance.clearItems();
        await products.map(async (product) => {
          itemTemplateElement.id = product.id + "#becaby";
          const item = createItem(product, itemTemplateElement);
          await listInstance.addItems([item]);
          document.getElementById(`${product.id}#becaby`)?.addEventListener("click", function() {
            window.open(`https://becapy-new.webflow.io/product/${product.title}`, "_self");
          });
        });
        const collectionInstance = listInstances.find(({ wrapper }) => wrapper.id === "categories-cms-id") ?? listInstances[0];
        const collections = await getCustomCategories();
        console.log("collections[0].title = " + collections[0].title);
        const [firstCollectioItem] = collectionInstance.items;
        const collectionItemTemplateElement = firstCollectioItem.element;
        collectionInstance.clearItems();
        await collections.map(async (collection) => {
          collectionItemTemplateElement.id = collection.id + "#becaby";
          const item = createCollectionItem(collection, collectionItemTemplateElement);
          await collectionInstance.addItems([item]);
          document.getElementById(`${collection.id}#becaby`)?.addEventListener("click", function() {
            window.open(
              `https://becapy-new.webflow.io/category-details?collection=${collection.id}`,
              "_self"
            );
          });
        });
      }
    ]);
  }
  var fetchProducts = async () => {
    try {
      const response = await fetch("https://fakestoreapi.com/products");
      const data = await response.json();
      return data;
    } catch (error) {
      return [];
    }
  };
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
  var createItem = (product, templateElement) => {
    const newItem = templateElement.cloneNode(true);
    const image = newItem.querySelector('[data-element="image"]');
    const title = newItem.querySelector('[data-element="title"]');
    const category = newItem.querySelector('[data-element="category"]');
    const description = newItem.querySelector('[data-element="description"]');
    const price = newItem.querySelector('[data-element="price"]');
    if (image)
      image.src = product.image;
    if (title)
      title.textContent = product.title;
    if (category)
      category.textContent = product.category;
    if (description)
      description.textContent = product.description;
    if (price)
      price.textContent = "$ " + product.price + " USD";
    return newItem;
  };
  var createCollectionItem = (collection, templateElement) => {
    const newItem = templateElement.cloneNode(true);
    const title = newItem.querySelector('[data-element="collection_title"]');
    if (title)
      title.textContent = collection.title;
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
