export const IMAGE_BASE = "/images/products/";
export const toImgSrc = (filename?: string | null) =>
  filename ? `${IMAGE_BASE}${filename}` : "/images/products/placeholder.jpg";