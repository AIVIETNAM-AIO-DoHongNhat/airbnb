"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { NguoiDung } from "@/lib/types";
import { logout as apiLogout } from "@/lib/api";

interface AppCtx {
  user: NguoiDung | null;
  isLoggedIn: boolean;
  ready: boolean;
  setUser: (u: NguoiDung | null) => void;
  logout: () => void;
  favorites: Record<number, true>;
  isFav: (id: number) => boolean;
  toggleFav: (id: number) => void;
  flash: (msg: string) => void;
}

const Ctx = createContext<AppCtx | null>(null);

export function useApp(): AppCtx {
  const v = useContext(Ctx);
  if (!v) throw new Error("useApp phải dùng bên trong <Providers>");
  return v;
}

export default function Providers({
  children,
  initialUser = null,
}: {
  children: React.ReactNode;
  initialUser?: NguoiDung | null;
}) {
  // user được server resolve sẵn từ cookie → không nháy khi reload
  const [user, setUserState] = useState<NguoiDung | null>(initialUser);
  const [favorites, setFavorites] = useState<Record<number, true>>({});
  const [toast, setToast] = useState<string | null>(null);
  const [ready] = useState(true);

  // Đồng bộ localStorage (favorites là client-only; user lấy server làm chuẩn)
  useEffect(() => {
    try {
      if (initialUser) localStorage.setItem("airbnb_user", JSON.stringify(initialUser));
      else localStorage.removeItem("airbnb_user");
      const f = localStorage.getItem("airbnb_favs");
      if (f) setFavorites(JSON.parse(f));
    } catch {
      /* ignore */
    }
  }, [initialUser]);

  const setUser = (u: NguoiDung | null) => {
    setUserState(u);
    if (u) localStorage.setItem("airbnb_user", JSON.stringify(u));
    else localStorage.removeItem("airbnb_user");
  };

  const flash = (msg: string) => {
    setToast(msg);
    window.clearTimeout((flash as unknown as { _t?: number })._t);
    (flash as unknown as { _t?: number })._t = window.setTimeout(
      () => setToast(null),
      2600,
    );
  };

  const logout = () => {
    // Xoá cookie httpOnly ở backend (bỏ qua lỗi mạng — vẫn xoá phía client)
    apiLogout().catch(() => {});
    setUser(null);
    flash("Đăng xuất thành công 👋");
  };

  const toggleFav = (id: number) => {
    setFavorites((prev) => {
      const next = { ...prev };
      if (next[id]) {
        delete next[id];
        flash("Đã xóa khỏi yêu thích");
      } else {
        next[id] = true;
        flash("Đã thêm vào yêu thích ❤");
      }
      localStorage.setItem("airbnb_favs", JSON.stringify(next));
      return next;
    });
  };

  const isFav = (id: number) => !!favorites[id];

  return (
    <Ctx.Provider
      value={{
        user,
        isLoggedIn: !!user,
        ready,
        setUser,
        logout,
        favorites,
        isFav,
        toggleFav,
        flash,
      }}
    >
      {children}
      {toast && (
        <div
          className="fixed bottom-7 left-1/2 z-[90] flex items-center gap-2.5 rounded-2xl bg-[#0f0f12] px-[22px] py-3.5 text-sm font-semibold text-white shadow-[0_16px_40px_rgba(0,0,0,.3)]"
          style={{ animation: "slideToast .35s both" }}
        >
          <span className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-pink">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </span>
          {toast}
        </div>
      )}
    </Ctx.Provider>
  );
}
