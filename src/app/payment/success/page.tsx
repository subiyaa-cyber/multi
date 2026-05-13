import Link from "next/link";

interface Props {
  searchParams: Promise<{
    paymentKey?: string;
    orderId?: string;
    amount?: string;
  }>;
}

export default async function PaymentSuccessPage({ searchParams }: Props) {
  const { orderId, amount } = await searchParams;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm p-8 text-center">
        <div className="text-5xl mb-4">✅</div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">결제 완료</h1>
        <p className="text-sm text-gray-500 mb-6">결제가 성공적으로 완료되었습니다.</p>

        {orderId && (
          <div className="bg-gray-50 rounded-xl px-4 py-3 mb-6 text-left text-xs text-gray-500 space-y-1">
            <p>주문번호: <span className="font-medium text-gray-700">{orderId}</span></p>
            {amount && (
              <p>결제금액: <span className="font-medium text-gray-700">₩{Number(amount).toLocaleString("ko-KR")}</span></p>
            )}
          </div>
        )}

        <Link
          href="/"
          className="block w-full py-3 rounded-xl bg-teal-500 hover:bg-teal-600 text-white text-sm font-bold transition-colors"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
