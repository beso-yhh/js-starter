import { greetUser } from '$utils/greet';

import type { Collection, CollectionProduct, Product } from './cms/populate-external-data/types';
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
if (document.currentScript?.baseURI.toString().includes('category-details')) {
  console.log('document.currentScript?.baseURI = ' + document.currentScript?.baseURI);
  window.fsAttributes = window.fsAttributes || [];
  window.fsAttributes.push([
    'cmsload',
    async (listInstances: CMSList[]) => {
      console.log(`Hello from the CMS`);

      // Get the list instance
      //const [listInstance] = listInstances;
      const listInstance =
        listInstances.find(({ wrapper }) => wrapper.id === 'products-cms-id') ?? listInstances[0];

      // Save a copy of the template
      const [firstItem] = listInstance.items;
      const itemTemplateElement = firstItem.element;

      const collectionProducts = await fetchCollectionProducts(277396226115);

      // Fetch external data
      const products = await fetchProducts();

      // Remove existing items
      listInstance.clearItems();

      // Create the new items
      await products.map(async (product) => {
        itemTemplateElement.id = product.id + '#becaby';
        const item = createItem(product, itemTemplateElement);
        await listInstance.addItems([item]);
        document.getElementById(`${product.id}#becaby`)?.addEventListener('click', function () {
          window.open(`https://becapy-new.webflow.io/product/${product.title}`, '_self');
        });
      });
      // Populate the list
      const collectionInstance =
        listInstances.find(({ wrapper }) => wrapper.id === 'categories-cms-id') ?? listInstances[0];
      const collections = await getCustomCategories();
      console.log('collections[0].title = ' + collections[0].title);
      const [firstCollectioItem] = collectionInstance.items;
      const collectionItemTemplateElement = firstCollectioItem.element;
      // Remove existing items
      collectionInstance.clearItems();

      // Create the new items
      await collections.map(async (collection) => {
        collectionItemTemplateElement.id = collection.id + '#becaby';
        const item = createCollectionItem(collection, collectionItemTemplateElement);
        await collectionInstance.addItems([item]);
        document.getElementById(`${collection.id}#becaby`)?.addEventListener('click', function () {
          window.open(
            `https://becapy-new.webflow.io/category-details?collection=${collection.id}`,
            '_self'
          );
        });
      });
    },
  ]);
}

/**
 * Fetches fake products from Fake Store API.
 * @returns An array of {@link Product}.
 */
const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch('https://fakestoreapi.com/products');
    const data: Product[] = await response.json();

    return data;
  } catch (error) {
    return [];
  }
};

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
const createItem = (product: Product, templateElement: HTMLDivElement) => {
  // Clone the template element
  const newItem = templateElement.cloneNode(true) as HTMLDivElement;

  // Query inner elements
  const image = newItem.querySelector<HTMLImageElement>('[data-element="image"]');
  const title = newItem.querySelector<HTMLHeadingElement>('[data-element="title"]');
  const category = newItem.querySelector<HTMLParagraphElement>('[data-element="category"]');
  const description = newItem.querySelector<HTMLParagraphElement>('[data-element="description"]');
  const price = newItem.querySelector<HTMLParagraphElement>('[data-element="price"]');

  // Populate inner elements
  if (image) image.src = product.image;
  if (title) title.textContent = product.title;
  if (category) category.textContent = product.category;
  if (description) description.textContent = product.description;
  if (price) price.textContent = '$ ' + product.price + ' USD';

  return newItem;
};

const createCollectionItem = (collection: Collection, templateElement: HTMLDivElement) => {
  // Clone the template element
  const newItem = templateElement.cloneNode(true) as HTMLDivElement;

  // Query inner elements
  const title = newItem.querySelector<HTMLImageElement>('[data-element="collection_title"]');

  // Populate inner elements
  if (title) title.textContent = collection.title;

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
      console.log(data[0].id);
      return data;
    });

    return data;
  } catch (error) {
    return [];
  }
};
