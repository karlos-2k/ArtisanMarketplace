export interface Review {
  user: string;
  rating: number;
  comment: string;
  image?: string;
}

export interface Product {
  id: string;
  name: string;
  artisan: string;
  category: string;
  price: number;
  rating: number;
  reviewCount: number;
  stock: number;
  images: string[];
  description: string;
  highlights: string[];
  reviews: Review[];
}
