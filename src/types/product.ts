export type ProductStatus = "판매중" | "예약중" | "판매완료";

export type ProductCategory =
  | "전자기기"
  | "패션/의류"
  | "가전"
  | "가구/인테리어"
  | "스포츠/레저"
  | "도서/취미"
  | "뷰티"
  | "주방/생활"
  | "유아동"
  | "반려동물"
  | "기업굿즈"
  | "기타";

export const CATEGORY_LIST: { label: ProductCategory; emoji: string }[] = [
  { label: "전자기기",    emoji: "📱" },
  { label: "패션/의류",   emoji: "👗" },
  { label: "가전",        emoji: "🏠" },
  { label: "가구/인테리어", emoji: "🛋️" },
  { label: "스포츠/레저", emoji: "🏃" },
  { label: "도서/취미",   emoji: "📚" },
  { label: "뷰티",        emoji: "💄" },
  { label: "주방/생활",   emoji: "🍳" },
  { label: "유아동",      emoji: "🧸" },
  { label: "반려동물",    emoji: "🐾" },
  { label: "기업굿즈",    emoji: "🎁" },
  { label: "기타",        emoji: "📦" },
];

export type Product = {
  id: string;
  title: string;
  description: string | null;
  price: number;
  image_url: string | null;
  seller_name: string;
  status: ProductStatus;
  category: ProductCategory;
  created_at: string;
};
