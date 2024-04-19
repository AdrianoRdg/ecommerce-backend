export class CreateProductDto {
  id: number;
  name: string;
  sku: string;
  categoryId: number;
  description: string;
  largeDescription: string;
  price: number;
  // discountPrice: number;
  discountPercent: number | null;
  isNew: boolean;
  imageLink: string;
  otherImagesLink: string;
}
