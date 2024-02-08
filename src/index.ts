import { greetUser } from '$utils/greet';

import type { Product } from './cms/populate-external-data/types';
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
window.fsAttributes = window.fsAttributes || [];
window.fsAttributes.push([
  'cmsload',
  async (listInstances: CMSList[]) => {
    console.log(`Hello from the CMS`);

    // Get the list instance
    //const [listInstance] = listInstances;
    const listInstance =
      listInstances.find(({ wrapper }) => wrapper.id === 'products-wrapper') ?? listInstances[0];

    // Save a copy of the template
    const [firstItem] = listInstance.items;
    const itemTemplateElement = firstItem.element;

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
  },
]);

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
