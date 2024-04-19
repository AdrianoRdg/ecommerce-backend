export function generateSKU(
  productName: string,
  productId: number,
  category: string,
  categoryId: number,
) {
  const cleanedProductName = productName.replace(/\s+/g, '');
  const cleanedCategory = category.replace(/\s+/g, '');

  const productPrefix = cleanedProductName.slice(0, 3).toUpperCase();
  const categoryPrefix = cleanedCategory.slice(0, 3).toUpperCase();

  const prodId = productId < 10 ? `0${productId}` : productId;
  const catId = categoryId < 10 ? `0${categoryId}` : categoryId;

  const sku = `${categoryPrefix}${productPrefix}-${catId}${prodId}`;

  return sku;
}
