"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loadTossPayments, ANONYMOUS } from "@tosspayments/tosspayments-sdk";
import { createClient } from "@/lib/supabase/client";

interface Props {
  productId: string;
  title: string;
  price: number;
  status: string;
}

export default function ProductActions({ productId, title, price, status }: Props) {
  const router = useRouter();
  const [liked, setLiked] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [paying, setPaying] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm("정말 삭제하겠습니까?\n삭제된 상품은 복구할 수 없습니다.");
    if (!confirmed) return;
    setDeleting(true);
    const supabase = createClient();
    await supabase.from("products").delete().eq("id", productId);
    router.push("/");
  }

  async function handlePayment() {
    setPaying(true);
    try {
      const tossPayments = await loadTossPayments(
        process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY!
      );
      const payment = tossPayments.payment({ customerKey: ANONYMOUS });
      await payment.requestPayment({
        method: "CARD",
        amount: { currency: "KRW", value: price },
        orderId: crypto.randomUUID(),
        orderName: title,
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment/fail`,
      });
    } catch {
      setPaying(false);
    }
  }

  const isSoldOut = status === "판매완료";

  return (
    <>
      {/* 하단 고정 액션바 */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100">
        <div className="max-w-xl mx-auto px-4 py-3 flex items-center gap-4">
          {/* 찜 버튼 */}
          <button
            onClick={() => setLiked((v) => !v)}
            className="flex flex-col items-center gap-0.5 text-gray-400 hover:text-teal-500 transition-colors"
          >
            <svg className="w-6 h-6" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
            <span className="text-[10px] font-medium">{liked ? "찜 완료" : "찜하기"}</span>
          </button>

          {/* 구분선 */}
          <div className="w-px h-8 bg-gray-100" />

          {/* 가격 */}
          <div className="flex-1">
            <p className="text-base font-bold text-gray-900">
              ₩{price.toLocaleString("ko-KR")}
            </p>
            <p className="text-xs text-gray-400">가격 제안 불가</p>
          </div>

          {/* 결제하기 버튼 */}
          <button
            onClick={handlePayment}
            disabled={isSoldOut || paying}
            className="px-6 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-white text-sm font-bold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isSoldOut ? "거래 완료" : paying ? "결제 중..." : "결제하기"}
          </button>
        </div>
      </div>

      {/* 우상단 더보기 버튼 (수정/삭제) */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={() => setShowMenu((v) => !v)}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm text-gray-600 hover:bg-white transition-colors shadow-sm"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="19" r="1.5" />
          </svg>
        </button>

        {showMenu && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
            <div className="absolute right-0 top-10 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-20 w-28">
              <Link
                href={`/products/${productId}/edit`}
                className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => setShowMenu(false)}
              >
                수정하기
              </Link>
              <button
                onClick={() => { setShowMenu(false); handleDelete(); }}
                disabled={deleting}
                className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
              >
                {deleting ? "삭제 중..." : "삭제하기"}
              </button>
            </div>
          </>
        )}
      </div>

    </>
  );
}
