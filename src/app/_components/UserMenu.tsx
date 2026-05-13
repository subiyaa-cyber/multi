"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export default function UserMenu({ user }: { user: User }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const name =
    user.user_metadata?.full_name ||
    user.email?.split("@")[0] ||
    "사용자";
  const avatar = user.user_metadata?.avatar_url as string | undefined;

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 text-white/90 hover:text-white transition-colors"
      >
        {avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatar} alt={name} className="w-7 h-7 rounded-full object-cover" />
        ) : (
          <div className="w-7 h-7 rounded-full bg-white/30 flex items-center justify-center text-xs font-bold text-white">
            {name[0]}
          </div>
        )}
        <span className="text-sm font-medium hidden sm:block">{name}</span>
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
          <path d="M7 10l5 5 5-5z" />
        </svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-10 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-20 w-44">
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-xs font-semibold text-gray-900 truncate">{name}</p>
              <p className="text-xs text-gray-400 truncate">{user.email}</p>
            </div>
            <button
              onClick={handleSignOut}
              className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
            >
              로그아웃
            </button>
          </div>
        </>
      )}
    </div>
  );
}
