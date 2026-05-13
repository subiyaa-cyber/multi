import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/app/_components/Header";
import EditForm from "./EditForm";
import { Product } from "@/types/product";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (!product) notFound();

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-xl mx-auto px-4 py-10">
          <div className="flex items-center gap-3 mb-6">
            <Link
              href={`/products/${id}`}
              className="text-sm text-gray-500 hover:text-teal-600 transition-colors"
            >
              ← 상세 페이지
            </Link>
          </div>
          <div className="mb-6">
            <h1 className="text-xl font-bold text-gray-900">상품 수정</h1>
            <p className="text-sm text-gray-400 mt-1">상품 정보를 수정하세요.</p>
          </div>
          <EditForm product={product as Product} />
        </div>
      </div>
    </>
  );
}
