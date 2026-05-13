import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import UserMenu from "./UserMenu";

export default async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-50 bg-teal-400 shadow-sm">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* 로고 */}
          <Link
            href="/"
            className="text-2xl font-bold text-white tracking-tight"
            style={{ fontFamily: "Jamsil, sans-serif", fontWeight: 700 }}
          >
            스듯스토어
          </Link>

          {/* 네비게이션 */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-white/80">
            <Link href="/" className="hover:text-white transition-colors">
              전체
            </Link>
            <Link href="/?status=판매중" className="hover:text-white transition-colors">
              판매중
            </Link>
            <Link href="/?status=예약중" className="hover:text-white transition-colors">
              예약중
            </Link>
            <Link href="/?status=판매완료" className="hover:text-white transition-colors">
              판매완료
            </Link>
          </nav>

          {/* 액션 */}
          <div className="flex items-center gap-2 sm:gap-3">
            {user ? (
              <UserMenu user={user} />
            ) : (
              <Link
                href="/auth/login"
                className="text-sm font-medium text-white/80 hover:text-white transition-colors"
              >
                로그인
              </Link>
            )}
            <Link
              href="/products/new"
              className="text-xs sm:text-sm font-semibold bg-white text-teal-600 px-3 sm:px-4 py-2 rounded-full hover:bg-teal-50 transition-colors shadow-sm whitespace-nowrap"
            >
              + 등록
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
