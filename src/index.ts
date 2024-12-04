import { loadCart } from '$utils/cart';
import { greetUser } from '$utils/greet';
import { initPurchaseFuncs } from '$utils/purchase';

import type { Collection, CollectionProduct } from './cms/populate-external-data/types';
import { initProductDetails } from './products/products-details';
import type { CMSList } from './types/CMSList';

window.Webflow ||= [];
window.Webflow.push(async () => {
  const name = 'John Do wewewewe';
  greetUser(name);
  // document.body.style.backgroundColor = 'blue';
});

/**
 * Populate CMS Data from an external API.
 */

/**
    1. Get Collection Products by Collection Id
    2. Get Collections
    3. Matching Collection Id with which one is belong to, for changing the header and description 
    4. Remove the Loader.
 */
loadCart();
if (document.currentScript?.baseURI.toString().includes('category-details')) {
  let url = '';
  if (document.currentScript?.baseURI.toString().includes('5eebf742287825892cd6c6d44ee1')) {
    url = 'https://becapy-new-5eebf742287825892cd6c6d44ee1.webflow.io';
  } else {
    url = 'https://becapy-new.webflow.io/';
  }
  // console.log('document.currentScript?.baseURI = ' + document.currentScript?.baseURI);
  const searchParams = new URLSearchParams(window.location.search);
  const currentCollectionId = searchParams.get('collection');
  window.fsAttributes = window.fsAttributes || [];
  window.fsAttributes.push([
    'cmsload',
    async (listInstances: CMSList[]) => {
      console.log(`Hello from the CMS`);
      let collectionsCount = 0;
      // Get the list instance
      //const [listInstance] = listInstances;
      const listInstance =
        listInstances.find(({ wrapper }) => wrapper.id === 'products-cms-id') ?? listInstances[0];

      // Save a copy of the template
      const [firstItem] = listInstance.items;
      const itemTemplateElement = firstItem.element;

      // Fetch external data
      const collectionProducts = await fetchCollectionProducts(Number(currentCollectionId)); // price_descending

      // Remove existing items
      listInstance.clearItems();

      // Create the new items
      await collectionProducts.map(async (collectionProduct) => {
        itemTemplateElement.id = collectionProduct.id + '#becaby';
        const item = createItem(collectionProduct, itemTemplateElement);
        await listInstance.addItems([item]);
        document
          .getElementById(`${collectionProduct.id}#becaby`)
          ?.addEventListener('click', function () {
            window.open(`${url}/product-details?product_id=${collectionProduct.id}`, '_self');
          });
      });
      // Populate the list
      // const collectionInstance =
      //   listInstances.find(({ wrapper }) => wrapper.id === 'categories-cms-id') ?? listInstances[0];
      const collections = await getCustomCategories();
      const flowersCollections = await getFlowersCategories();

      // console.log('collections[0].title = ' + collections[0].title);
      // const [firstCollectioItem] = collectionInstance.items;
      // const collectionItemTemplateElement = firstCollectioItem.element;
      // // Remove existing items
      // collectionInstance.clearItems();

      // Create the new items
      if (document.currentScript?.baseURI.toString().includes('5eebf742287825892cd6c6d44ee1')) {
        await flowersCollections.map(async (collection) => {
          collectionsCount++;
          if (collection.id === Number(currentCollectionId)) {
            if (document.getElementById('category-head-id') != null) {
              document.getElementById('category-head-id')!.textContent = collection.title;
            }
            document.getElementById('category-description-id')!.innerHTML = collection.body_html;
          }
          console.log('collectionsCount = ' + collectionsCount);
          const hURL = `${url}/category-details?collection=` + collection.id;
          if (collectionsCount === flowersCollections.length) {
            console.log('collectionsCount = ' + collectionsCount);
            document.getElementById('flex-text-id')!.innerHTML +=
              `<a href=${hURL} class="text-decoration-none link">${collection.title}</a>`;
          } else {
            console.log('collectionsCount = ' + collectionsCount);

            document.getElementById('flex-text-id')!.innerHTML +=
              `<a href=${hURL} class="text-decoration-none link">${collection.title}</a> <div class="breadcrumb-divider-2">/</div>`;
          }
        });
      } else {
        await collections.map(async (collection) => {
          collectionsCount++;
          if (collection.id === Number(currentCollectionId)) {
            if (document.getElementById('category-head-id') != null) {
              document.getElementById('category-head-id')!.textContent = collection.title;
            }
            document.getElementById('category-description-id')!.innerHTML = collection.body_html;
          }
          console.log('collectionsCount = ' + collectionsCount);
          const hURL = `${url}/category-details?collection=` + collection.id;
          if (collectionsCount === collections.length) {
            console.log('collectionsCount = ' + collectionsCount);
            document.getElementById('flex-text-id')!.innerHTML +=
              `<a href=${hURL} class="text-decoration-none link">${collection.title}</a>`;
          } else {
            console.log('collectionsCount = ' + collectionsCount);

            document.getElementById('flex-text-id')!.innerHTML +=
              `<a href=${hURL} class="text-decoration-none link">${collection.title}</a> <div class="breadcrumb-divider-2">/</div>`;
          }
        });
      }
      document.getElementById('loader-id')!.style.display = 'none';
      window.Webflow.push(function () {
        $('html').attr('data-wf-page', '65cdfd5f1054c1ba09309d71');
        window.Webflow && window.Webflow.destroy();
        window.Webflow && window.Webflow.ready();
        window.Webflow && window.Webflow.require('ix2').init();
        document.dispatchEvent(new Event('readystatechange'));
      });
    },
  ]);
} else if (document.currentScript?.baseURI.toString().includes('product-details')) {
  initProductDetails();
} else if (document.currentScript?.baseURI.toString().includes('purchase')) {
  initPurchaseFuncs();
}

const getFirstVariant = async (id: string) => {
  const query = `
{
  product(id:"gid://shopify/Product/${id}"){
    title
    tags
		variants(first: 1) {
		  edges {
		    node {
		      id
		    }
		  }
		}  
  }
}
`;
  let resultId = '';
  await fetch('https://209c5e-2.myshopify.com/api/2024-01/graphql.json', {
    method: 'POST',
    body: JSON.stringify({
      query: query,
    }),
    headers: {
      'X-Shopify-Storefront-Access-Token': 'a6f6d54288d4907127991e86952bb7f9',
      'Content-type': 'application/json',
    },
  })
    .then(async (result: any) => {
      resultId = result.data.product.variants.edges[0].node.id;
    })
    .catch((e) => {
      console.log('e = ' + e.toString());
    });
  return resultId;
};

/**
 * Fetches fake products from Fake Store API.
 * @returns An array of {@link Product}.
 */
// const fetchProducts = async (): Promise<Product[]> => {
//   try {
//     const response = await fetch('https://fakestoreapi.com/products');
//     const data: Product[] = await response.json();

//     return data;
//   } catch (error) {
//     return [];
//   }
// };

const fetchCollectionProducts = async (collectionId: number): Promise<CollectionProduct[]> => {
  try {
    const response = await fetch(
      `https://getproductsbycollectionidhttps-dkhndz7lcq-uc.a.run.app/?collectionId=${collectionId}`
    );
    const data: CollectionProduct[] = await response.json();

    return data;
  } catch (error) {
    return [];
  }
};

/**
 * Creates an item from the template element.
 * @param product The product data to create the item from.
 * @param templateElement The template element.
 *
 * @returns A new Collection Item element.
 */
const createItem = (collectionProduct: CollectionProduct, templateElement: HTMLDivElement) => {
  // Clone the template element
  const newItem = templateElement.cloneNode(true) as HTMLDivElement;

  // Query inner elements
  const image = newItem.querySelector<HTMLImageElement>('[data-element="image"]');
  const title = newItem.querySelector<HTMLHeadingElement>('[data-element="title"]');
  const description = newItem.querySelector<HTMLParagraphElement>('[data-element="description"]');
  const price = newItem.querySelector<HTMLParagraphElement>('[data-element="price"]');
  console.log(collectionProduct.product.image);
  // Populate inner elements
  if (image && collectionProduct.product.image !== null)
    image.src = collectionProduct.product.image.src;
  if (title) title.textContent = collectionProduct.product.title;
  if (description) description.innerHTML = collectionProduct.product.body_html;
  if (price)
    price.textContent =
      collectionProduct.product.variants.length === 0
        ? '-'
        : collectionProduct.product.variants[0].price + ' AED';

  return newItem;
};

const createCollectionItem = (
  collection: Collection,
  templateElement: HTMLDivElement,
  collectioId: string
) => {
  // Clone the template element
  const newItem = templateElement.cloneNode(true) as HTMLDivElement;

  // Query inner elements
  const title = newItem.querySelector<HTMLHeadingElement>('[data-element="collection_title"]');

  // Populate inner elements
  if (title) title.textContent = collection.title;
  if (collection.id === Number(collectioId)) {
    title!.style.fontWeight = 'bold';
    title!.style.color = 'black';
  }

  return newItem;
};

function getSyncScriptParams() {
  console.log('document.currentScript = ' + document.currentScript?.baseURI);
  const name = document.getElementById('helper')?.getAttribute('current_collection');
  console.log('name = ' + name);
  if (document.currentScript?.baseURI.toString().includes('category-details')) {
    console.log('TTT');
    isCollection = true;
  }
}

const getCustomCategories = async (): Promise<Collection[]> => {
  try {
    let data: Collection[] = [];
    await fetch('https://getcustomcollections-dkhndz7lcq-uc.a.run.app').then(async (result) => {
      data = (await result.json())['custom_collections'];
      return data;
    });

    return data;
  } catch (error) {
    return [];
  }
};

const getFlowersCategories = async (): Promise<Collection[]> => {
  try {
    let data: Collection[] = [];
    const fR: Collection[] = [];
    await fetch('https://getcustomcollections-dkhndz7lcq-uc.a.run.app').then(async (result) => {
      data = (await result.json())['custom_collections'];
      for (let i = 0; i < data.length; i++) {
        if (
          data[i].id === 287584649283 ||
          data[i].id === 287556894787 ||
          data[i].id === 287582322755 ||
          data[i].id === 287584550979 ||
          data[i].id === 287584616515 ||
          data[i].id === 287556927555
        ) {
          fR.push(data[i]);
        }
      }
      return fR;
    });

    return fR;
  } catch (error) {
    return [];
  }
};
