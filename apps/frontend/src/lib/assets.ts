export function productImg(imageUrl?: string | null, imageFilename?: string | null) {
  if (imageUrl) return imageUrl; // backend-decorated absolute URL (optional)
  if (imageFilename) return `/images/products/${imageFilename}`;
  return `/images/placeholder-product.png`;
}

export function bundleImg(filename?: string | null) {
  if (filename) return `/images/bundles/${filename}`;
  return `/images/placeholder-bundle.png`;
}
