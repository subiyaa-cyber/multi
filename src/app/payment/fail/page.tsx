"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function PaymentFailPage() {
  const searchParams = useSearchParams();
  const message = searchParams.get("message");
  const orderId = searchParams.get("orderId");

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm p-8 text-center">
        <div className="text-5xl mb-4">❌</div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">결제 실패</h1>
        <p className="text-sm text-gray-500 mb-6">
          {message ?? "결제 중 오류가 발생했습니다."}
        </p>

        {orderId && (
          <div className="bg-gray-50 rounded-xl px-4 py-3 mb-6 text-left text-xs text-gray-500">
            <p>주문번호: <span className="font-medium text-gray-700">{orderId}</span></p>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <button
            onClick={() => history.back()}
            className="w-full py-3 rounded-xl bg-teal-500 hover:bg-teal-600 text-white text-sm font-bold transition-colors"
          >
            다시 시도하기
          </button>
          <Link
            href="/"
            className="block w-full py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}
