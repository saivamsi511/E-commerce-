/**
 * Collection ID: products
 * Interface for Products
 */
export interface Products {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  productName?: string;
  /** @wixFieldType text */
  currency?: string;
  /** @wixFieldType text */
  category?: string;
  /** @wixFieldType image */
  mainImage?: string;
  /** @wixFieldType text */
  shortDescription?: string;
  /** @wixFieldType text */
  longDescription?: string;
  /** @wixFieldType number */
  price?: number;
  /** @wixFieldType text */
  sku?: string;
  /** @wixFieldType boolean */
  isFeatured?: boolean;
}
