import Link from "next/link";
import { Product, ProductStatus } from "@/types/product";

const STATUS_CONFIG: Record<ProductStatus, { label: string; className: string }> = {
  판매중: { label: "판매중", className: "bg-teal-500 text-white" },
  예약중: { label: "예약중", className: "bg-amber-400 text-white" },
  판매완료: { label: "판매완료", className: "bg-gray-400 text-white" },
};

export default function ProductCard({ product }: { product: Product }) {
  const status = STATUS_CONFIG[product.status];
  const isSoldOut = product.status === "판매완료";

  return (
    <Link href={`/products/${product.id}`} className="group block rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 bg-white">
      {/* 이미지 영역 */}
      <div className="relative overflow-hidden bg-teal-50 aspect-[3/4] rounded-t-xl">
        {product.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image_url}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-5xl select-none">🛍️</span>
          </div>
        )}

        {/* 상태 뱃지 */}
        <span className={`absolute top-2 left-2 text-xs font-semibold px-2.5 py-1 rounded-full ${status.className}`}>
          {status.label}
        </span>

        {/* 판매완료 오버레이 */}
        {isSoldOut && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-t-xl">
            <span className="text-white font-bold text-lg tracking-wide">판매완료</span>
          </div>
        )}
      </div>

      {/* 상품 정보 */}
      <div className="p-3 space-y-1">
        <p className="text-xs text-gray-400">{product.seller_name}</p>
        <p className="text-sm font-medium text-gray-900 leading-snug line-clamp-2">{product.title}</p>
        <p className="text-base font-bold text-teal-600">
          ₩{product.price.toLocaleString("ko-KR")}
        </p>
      </div>
    </Link>
  );
}
