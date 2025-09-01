/**
 * Collection ID: orders
 * Interface for Orders
 */
export interface Orders {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  orderNumber?: string;
  /** @wixFieldType datetime */
  orderDate?: Date | string;
  /** @wixFieldType number */
  totalAmount?: number;
  /** @wixFieldType text */
  orderStatus?: string;
  /** @wixFieldType text */
  shippingAddress?: string;
  /** @wixFieldType text */
  shippingMethod?: string;
  /** @wixFieldType text */
  trackingNumber?: string;
  /** @wixFieldType number */
  itemCount?: number;
  /** @wixFieldType text */
  userId?: string;
}
