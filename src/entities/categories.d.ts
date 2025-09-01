/**
 * Collection ID: categories
 * Interface for Categories
 */
export interface Categories {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  name?: string;
  /** @wixFieldType text */
  slug?: string;
  /** @wixFieldType text */
  description?: string;
  /** @wixFieldType image */
  categoryImage?: string;
  /** @wixFieldType boolean */
  isActive?: boolean;
  /** @wixFieldType number */
  displayOrder?: number;
}
