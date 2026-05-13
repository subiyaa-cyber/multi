import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Product, ProductCategory, CATEGORY_LIST } from "@/types/product";
import Header from "./_components/Header";
import ProductCard from "./_components/ProductCard";
import CategorySidebar from "./_components/CategorySidebar";

interface Props {
  searchParams: Promise<{ category?: string }>;
}

export default async function Home({ searchParams }: Props) {
  const { category } = await searchParams;
  const supabase = await createClient();

  // 카테고리별 상품 수 집계
  const { data: allProducts } = await supabase
    .from("products")
    .select("category");

  const counts = (allProducts ?? []).reduce<Partial<Record<ProductCategory, number>>>(
    (acc, p) => {
      const cat = p.category as ProductCategory;
      acc[cat] = (acc[cat] ?? 0) + 1;
      return acc;
    },
    {}
  );

  // 선택된 카테고리로 필터링
  const query = supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  const validCategory = CATEGORY_LIST.map((c) => c.label).includes(
    category as ProductCategory
  )
    ? (category as ProductCategory)
    : null;

  if (validCategory) {
    query.eq("category", validCategory);
  }

  const { data: products } = await query;

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-6">

          {/* 모바일 카테고리 가로 스크롤 */}
          <div className="md:hidden -mx-4 px-4 mb-4 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div className="flex gap-2 pb-1 w-max">
              <Link
                href="/"
                className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  !validCategory
                    ? "bg-teal-500 text-white"
                    : "bg-white text-gray-600 border border-gray-200"
                }`}
              >
                🏪 전체
              </Link>
              {CATEGORY_LIST.map(({ label, emoji }) => (
                <Link
                  key={label}
                  href={`/?category=${encodeURIComponent(label)}`}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    validCategory === label
                      ? "bg-teal-500 text-white"
                      : "bg-white text-gray-600 border border-gray-200"
                  }`}
                >
                  {emoji} {label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex gap-8">
            {/* 데스크탑 사이드바 */}
            <div className="hidden md:block">
              <CategorySidebar
                selected={validCategory ?? ""}
                counts={counts}
                total={allProducts?.length ?? 0}
              />
            </div>

            {/* 상품 목록 */}
            <main className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-gray-900">
                  {validCategory ?? "전체 상품"}{" "}
                  <span className="text-teal-500">{products?.length ?? 0}</span>
                </h2>
              </div>

              {products && products.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-6">
                  {products.map((product: Product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-32 gap-4 bg-white rounded-2xl border border-dashed border-teal-200">
                  <span className="text-5xl">🛍️</span>
                  <p className="text-gray-500 font-medium">등록된 상품이 없습니다.</p>
                  <p className="text-sm text-gray-400">
                    {validCategory
                      ? `아직 ${validCategory} 카테고리에 상품이 없어요.`
                      : "첫 번째 상품을 등록해보세요!"}
                  </p>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </>
  );
}
