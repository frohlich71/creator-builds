export interface Product {
  id: string; // adicionado para compatibilidade com ComboWithImage
  _id: string;
  asin: string;
  title: string;
  imgUrl?: string;
  productURL?: string;
  stars?: number;
  reviews?: number;
  price?: number;
  listPrice?: number;
  category_id: number;
  isBestSeller?: boolean;
}
