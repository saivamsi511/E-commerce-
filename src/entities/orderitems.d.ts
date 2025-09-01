/**
 * Collection ID: orderitems
 * Interface for OrderItems
 */
export interface OrderItems {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  orderId?: string;
  /** @wixFieldType text */
  productName?: string;
  /** @wixFieldType text */
  productSku?: string;
  /** @wixFieldType image */
  productImage?: string;
  /** @wixFieldType text */
  productDescription?: string;
  /** @wixFieldType number */
  quantity?: number;
  /** @wixFieldType number */
  unitPrice?: number;
  /** @wixFieldType number */
  lineItemTotal?: number;
}
