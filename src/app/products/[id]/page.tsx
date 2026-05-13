import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import ProductActions from "./ProductActions";

interface Props {
  params: Promise<{ id: string }>;
}

const STATUS_STYLE = {
  판매중: "bg-teal-500 text-white",
  예약중: "bg-amber-400 text-white",
  판매완료: "bg-gray-400 text-white",
} as const;

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "방금 전";
  if (mins < 60) return `${mins}분 전`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}일 전`;
  return new Date(dateStr).toLocaleDateString("ko-KR");
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (!product) notFound();

  return (
    <div className="min-h-screen bg-white">
      {/* 상단 네비바 */}
      <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-1 text-gray-700 hover:text-teal-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            <span className="text-sm font-medium">뒤로</span>
          </Link>
          <span className="text-sm font-bold text-teal-500" style={{ fontFamily: "Jamsil, sans-serif" }}>
            스듯스토어
          </span>
          {/* 더보기 메뉴 (ProductActions에서 렌더링) */}
          <div className="w-16" />
        </div>
      </div>

      <div className="max-w-xl mx-auto relative">
        {/* 상품 이미지 */}
        <div className="relative aspect-square bg-teal-50 w-full">
          {product.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.image_url}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-8xl">🛍️</span>
            </div>
          )}
          {product.status === "판매완료" && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="text-white font-bold text-2xl tracking-widest">거래완료</span>
            </div>
          )}
        </div>

        {/* ProductActions: 더보기 버튼 + 하단 액션바 */}
        <ProductActions
          productId={product.id}
          title={product.title}
          price={product.price}
          status={product.status}
        />

        {/* 판매자 섹션 */}
        <div className="px-4 py-4 flex items-center gap-3 border-b border-gray-100">
          <div className="w-11 h-11 rounded-full bg-teal-400 flex items-center justify-center text-white font-bold text-lg shrink-0">
            {product.seller_name[0]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900">{product.seller_name}</p>
            <p className="text-xs text-gray-400 mt-0.5">스듯스토어 판매자</p>
          </div>
          <button className="text-xs font-semibold text-teal-600 border border-teal-200 px-3 py-1.5 rounded-lg hover:bg-teal-50 transition-colors">
            프로필 보기
          </button>
        </div>

        {/* 상품 정보 */}
        <div className="px-4 py-5">
          {/* 카테고리 + 상태 + 시간 */}
          <div className="flex items-center gap-2 mb-3">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_STYLE[product.status as keyof typeof STATUS_STYLE]}`}>
              {product.status}
            </span>
            <span className="text-xs text-gray-400">{product.category}</span>
            <span className="text-xs text-gray-300">·</span>
            <span className="text-xs text-gray-400">{timeAgo(product.created_at)}</span>
          </div>

          {/* 제목 */}
          <h1 className="text-xl font-bold text-gray-900 leading-snug mb-4">
            {product.title}
          </h1>

          {/* 설명 */}
          {product.description ? (
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          ) : (
            <p className="text-sm text-gray-300">상품 설명이 없습니다.</p>
          )}

          {/* 관심 / 조회 */}
          <div className="flex items-center gap-3 mt-6 pt-4 border-t border-gray-100">
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
              관심 0
            </span>
            <span className="text-xs text-gray-300">·</span>
            <span className="text-xs text-gray-400">조회 0</span>
          </div>
        </div>

        {/* 하단 액션바 여백 */}
        <div className="h-24" />
      </div>
    </div>
  );
}
