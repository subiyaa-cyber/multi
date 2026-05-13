"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const ERROR_MESSAGES: Record<string, string> = {
  callback_error: "로그인 중 오류가 발생했습니다. 다시 시도해주세요.",
  invalid_state: "잘못된 접근입니다. 다시 시도해주세요.",
  no_email: "이메일 정보를 가져올 수 없습니다.",
  token_failed: "인증 토큰 발급에 실패했습니다.",
  link_failed: "로그인 처리에 실패했습니다.",
};

type Mode = "login" | "signup";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const urlError = searchParams.get("error");

  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [signupDone, setSignupDone] = useState(false);

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (mode === "signup" && password !== passwordConfirm) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }
    if (password.length < 6) {
      setError("비밀번호는 6자 이상이어야 합니다.");
      return;
    }

    setLoading("email");
    const supabase = createClient();

    if (mode === "signup") {
      const { error: err } = await supabase.auth.signUp({ email, password });
      if (err) {
        setError(err.message === "User already registered" ? "이미 가입된 이메일입니다." : err.message);
      } else {
        setSignupDone(true);
      }
    } else {
      const { error: err } = await supabase.auth.signInWithPassword({ email, password });
      if (err) {
        setError("이메일 또는 비밀번호가 올바르지 않습니다.");
      } else {
        router.push("/");
        router.refresh();
      }
    }
    setLoading(null);
  }

  async function signInWithGoogle() {
    setLoading("google");
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }

  if (signupDone) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm p-8 text-center">
          <div className="text-4xl mb-4">📧</div>
          <h2 className="text-lg font-bold text-gray-800 mb-2">이메일을 확인해주세요</h2>
          <p className="text-sm text-gray-500 mb-6">
            <span className="font-medium text-teal-600">{email}</span>로<br />
            인증 링크를 보냈습니다.
          </p>
          <button
            onClick={() => { setSignupDone(false); setMode("login"); }}
            className="text-sm text-teal-500 hover:text-teal-600 transition-colors"
          >
            로그인 화면으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* 로고 */}
        <div className="text-center mb-8">
          <Link href="/">
            <span className="text-3xl font-bold text-teal-500" style={{ fontFamily: "Jamsil, sans-serif" }}>
              스듯스토어
            </span>
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          {/* 탭 */}
          <div className="flex rounded-xl bg-gray-100 p-1 mb-5">
            <button
              onClick={() => { setMode("login"); setError(null); }}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors ${
                mode === "login" ? "bg-white text-teal-600 shadow-sm" : "text-gray-500"
              }`}
            >
              로그인
            </button>
            <button
              onClick={() => { setMode("signup"); setError(null); }}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors ${
                mode === "signup" ? "bg-white text-teal-600 shadow-sm" : "text-gray-500"
              }`}
            >
              회원가입
            </button>
          </div>

          {/* URL 에러 */}
          {urlError && ERROR_MESSAGES[urlError] && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 text-center">
              {ERROR_MESSAGES[urlError]}
            </div>
          )}

          {/* 이메일 폼 */}
          <form onSubmit={handleEmailSubmit} className="flex flex-col gap-3 mb-4">
            <input
              type="email"
              placeholder="이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-teal-400 transition-colors"
            />
            <input
              type="password"
              placeholder="비밀번호 (6자 이상)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-teal-400 transition-colors"
            />
            {mode === "signup" && (
              <input
                type="password"
                placeholder="비밀번호 확인"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-teal-400 transition-colors"
              />
            )}
            {error && (
              <p className="text-xs text-red-500 text-center">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading !== null}
              className="w-full py-3 rounded-xl bg-teal-500 text-white text-sm font-semibold hover:bg-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading === "email"
                ? "처리 중..."
                : mode === "login" ? "이메일로 로그인" : "회원가입"}
            </button>
          </form>

          {/* 구분선 */}
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">또는</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* 소셜 로그인 */}
          <div className="flex flex-col gap-3">
            <button
              onClick={signInWithGoogle}
              disabled={loading !== null}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span className="flex-1 text-sm font-semibold text-gray-700 text-center">
                {loading === "google" ? "연결 중..." : "구글로 계속하기"}
              </span>
            </button>

          </div>
        </div>

        <div className="text-center mt-5">
          <Link href="/" className="text-sm text-gray-400 hover:text-teal-500 transition-colors">
            로그인 없이 둘러보기 →
          </Link>
        </div>
      </div>
    </div>
  );
}
