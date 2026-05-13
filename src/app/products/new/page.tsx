import Header from "@/app/_components/Header";
import NewProductForm from "./NewProductForm";

export default function NewProductPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-xl mx-auto px-4 py-10">
          <div className="mb-6">
            <h1 className="text-xl font-bold text-gray-900">상품 등록</h1>
            <p className="text-sm text-gray-400 mt-1">판매할 상품 정보를 입력해주세요.</p>
          </div>
          <NewProductForm />
        </div>
      </div>
    </>
  );
}
