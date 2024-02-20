export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: Category;
  image: string;
  rating: Rating;
}

export enum Category {
  Electronics = 'electronics',
  Jewelery = 'jewelery',
  MenSClothing = "men's clothing",
  WomenSClothing = "women's clothing",
}

interface Rating {
  rate: number;
  count: number;
}

export interface Collection {
  id: number;
  title: string;
  body_html: string;
}

// For collection products
export interface ProductC {
  id: number;
  title: string;
  body_html: string;
  image: Image;
  variants: Variant[];
}

export interface Variant {
  title: string;
  price: string;
}

export interface Image {
  src: string;
}

export interface CollectionProduct {
  product: ProductC;
  id: number;
}
