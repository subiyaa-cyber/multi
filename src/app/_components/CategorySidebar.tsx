import Link from "next/link";
import { CATEGORY_LIST, type ProductCategory } from "@/types/product";

type CountMap = Partial<Record<ProductCategory, number>>;

interface Props {
  selected: string;
  counts: CountMap;
  total: number;
}

export default function CategorySidebar({ selected, counts, total }: Props) {
  return (
    <aside className="w-52 shrink-0">
      <nav className="sticky top-20">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3 px-3">
          카테고리
        </p>
        <ul className="space-y-0.5">
          {/* 전체 */}
          <li>
            <Link
              href="/"
              className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                !selected
                  ? "bg-teal-50 text-teal-600 font-semibold"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <span className="flex items-center gap-2">
                <span>🏪</span>
                <span>전체</span>
              </span>
              <span className={`text-xs ${!selected ? "text-teal-400" : "text-gray-400"}`}>
                {total}
              </span>
            </Link>
          </li>

          {/* 카테고리 목록 */}
          {CATEGORY_LIST.map(({ label, emoji }) => {
            const count = counts[label] ?? 0;
            const isActive = selected === label;
            return (
              <li key={label}>
                <Link
                  href={`/?category=${encodeURIComponent(label)}`}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive
                      ? "bg-teal-50 text-teal-600 font-semibold"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>{emoji}</span>
                    <span>{label}</span>
                  </span>
                  <span className={`text-xs ${isActive ? "text-teal-400" : "text-gray-400"}`}>
                    {count}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
