import { SITE_TEXT } from "../constants/siteText";

export const toSlug = (text) =>
  text
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const productCatalog = SITE_TEXT.products.list.map((item) => {
  const categoryName = item.category || item.title;
  const categorySlug = toSlug(categoryName);
  const productSlug = toSlug(item.model || item.title);

  return {
    ...item,
    category: categoryName,
    categorySlug,
    productSlug,
  };
});

export const findProductsByCategorySlug = (categorySlug) => {
  return productCatalog.filter((item) => item.categorySlug === categorySlug);
};

export const findProductBySlugs = (categorySlug, productSlug) => {
  return productCatalog.find(
    (item) =>
      item.categorySlug === categorySlug && item.productSlug === productSlug,
  );
};
