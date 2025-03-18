export let products: any[] = [];

export const getProducts = () => products;
export const setProducts = (newProducts: any[]) => {
  products = newProducts;
};
