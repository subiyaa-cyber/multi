"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/app/_components/Header";
import { createClient } from "@/lib/supabase/client";
import { detectCategory } from "@/lib/detectCategory";
import { CATEGORY_LIST, type ProductCategory } from "@/types/product";

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    title: "",
    price: "",
    description: "",
    image_url: "",
    seller_name: "",
  });

  const detectedCategory: ProductCategory = form.title.trim()
    ? detectCategory(form.title)
    : "기타";

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  function validate() {
    const next: Record<string, string> = {};
    if (!form.title.trim()) next.title = "상품명을 입력해주세요.";
    if (!form.price.trim()) next.price = "가격을 입력해주세요.";
    else if (isNaN(Number(form.price)) || Number(form.price) < 0)
      next.price = "올바른 가격을 입력해주세요.";
    if (!form.seller_name.trim()) next.seller_name = "판매자 이름을 입력해주세요.";
    return next;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.from("products").insert({
      title: form.title.trim(),
      price: Number(form.price),
      description: form.description.trim() || null,
      image_url: form.image_url.trim() || null,
      seller_name: form.seller_name.trim(),
      category: detectedCategory,
      status: "판매중",
    });

    setLoading(false);
    if (error) {
      setErrors({ submit: "등록 중 오류가 발생했습니다. 다시 시도해주세요." });
      return;
    }
    router.push("/");
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-xl mx-auto px-4 py-10">
          <div className="mb-6">
            <h1 className="text-xl font-bold text-gray-900">상품 등록</h1>
            <p className="text-sm text-gray-400 mt-1">판매할 상품 정보를 입력해주세요.</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-6 flex flex-col gap-5">

            {/* 상품명 */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700">
                상품명 <span className="text-teal-500">*</span>
              </label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="예) 아이폰 15 프로 256GB"
                className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-colors
                  ${errors.title ? "border-red-400 focus:border-red-400" : "border-gray-200 focus:border-teal-400"}`}
              />
              {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}

              {/* 자동 감지된 카테고리 */}
              {form.title.trim() && (
                <p className="text-xs text-teal-600">
                  자동 분류: <span className="font-semibold">
                    {CATEGORY_LIST.find(c => c.label === detectedCategory)?.emoji} {detectedCategory}
                  </span>
                </p>
              )}
            </div>

            {/* 가격 */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700">
                가격 <span className="text-teal-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">₩</span>
                <input
                  name="price"
                  type="number"
                  min="0"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="0"
                  className={`w-full pl-8 pr-4 py-2.5 rounded-xl border text-sm outline-none transition-colors
                    ${errors.price ? "border-red-400 focus:border-red-400" : "border-gray-200 focus:border-teal-400"}`}
                />
              </div>
              {errors.price && <p className="text-xs text-red-500">{errors.price}</p>}
            </div>

            {/* 상품 설명 */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700">상품 설명</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="상품 상태, 구성품, 거래 방법 등을 자유롭게 적어주세요."
                rows={4}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-teal-400 text-sm outline-none transition-colors resize-none"
              />
            </div>

            {/* 이미지 URL */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700">이미지 URL <span className="text-gray-400 font-normal">(선택)</span></label>
              <input
                name="image_url"
                value={form.image_url}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-teal-400 text-sm outline-none transition-colors"
              />
            </div>

            {/* 판매자 이름 */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700">
                판매자 이름 <span className="text-teal-500">*</span>
              </label>
              <input
                name="seller_name"
                value={form.seller_name}
                onChange={handleChange}
                placeholder="닉네임을 입력해주세요."
                className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-colors
                  ${errors.seller_name ? "border-red-400 focus:border-red-400" : "border-gray-200 focus:border-teal-400"}`}
              />
              {errors.seller_name && <p className="text-xs text-red-500">{errors.seller_name}</p>}
            </div>

            {/* 서버 에러 */}
            {errors.submit && (
              <p className="text-sm text-red-500 text-center">{errors.submit}</p>
            )}

            {/* 버튼 */}
            <div className="flex gap-3 pt-2">
              <Link
                href="/"
                className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 text-center hover:bg-gray-50 transition-colors"
              >
                취소
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 rounded-xl bg-teal-500 hover:bg-teal-600 text-white text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "등록 중..." : "등록하기"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
