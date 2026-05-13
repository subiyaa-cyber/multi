"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { detectCategory } from "@/lib/detectCategory";
import { CATEGORY_LIST, type Product, type ProductCategory, type ProductStatus } from "@/types/product";

const STATUS_OPTIONS: ProductStatus[] = ["판매중", "예약중", "판매완료"];

export default function EditForm({ product }: { product: Product }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    title: product.title,
    price: String(product.price),
    description: product.description ?? "",
    image_url: product.image_url ?? "",
    seller_name: product.seller_name,
    status: product.status,
  });

  const detectedCategory: ProductCategory = form.title.trim()
    ? detectCategory(form.title)
    : product.category;

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
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
    const { error } = await supabase
      .from("products")
      .update({
        title: form.title.trim(),
        price: Number(form.price),
        description: form.description.trim() || null,
        image_url: form.image_url.trim() || null,
        seller_name: form.seller_name.trim(),
        status: form.status,
        category: detectedCategory,
      })
      .eq("id", product.id);

    setLoading(false);
    if (error) {
      setErrors({ submit: "수정 중 오류가 발생했습니다. 다시 시도해주세요." });
      return;
    }
    router.push(`/products/${product.id}`);
  }

  return (
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
          className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-colors
            ${errors.title ? "border-red-400" : "border-gray-200 focus:border-teal-400"}`}
        />
        {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
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
            className={`w-full pl-8 pr-4 py-2.5 rounded-xl border text-sm outline-none transition-colors
              ${errors.price ? "border-red-400" : "border-gray-200 focus:border-teal-400"}`}
          />
        </div>
        {errors.price && <p className="text-xs text-red-500">{errors.price}</p>}
      </div>

      {/* 판매 상태 */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-gray-700">판매 상태</label>
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-teal-400 text-sm outline-none transition-colors bg-white"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* 상품 설명 */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-gray-700">상품 설명</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={4}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-teal-400 text-sm outline-none transition-colors resize-none"
        />
      </div>

      {/* 이미지 URL */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-gray-700">
          이미지 URL <span className="text-gray-400 font-normal">(선택)</span>
        </label>
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
          className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-colors
            ${errors.seller_name ? "border-red-400" : "border-gray-200 focus:border-teal-400"}`}
        />
        {errors.seller_name && <p className="text-xs text-red-500">{errors.seller_name}</p>}
      </div>

      {errors.submit && (
        <p className="text-sm text-red-500 text-center">{errors.submit}</p>
      )}

      {/* 버튼 */}
      <div className="flex gap-3 pt-2">
        <Link
          href={`/products/${product.id}`}
          className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 text-center hover:bg-gray-50 transition-colors"
        >
          취소
        </Link>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 py-3 rounded-xl bg-teal-500 hover:bg-teal-600 text-white text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "저장 중..." : "저장하기"}
        </button>
      </div>
    </form>
  );
}
