"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useApp } from "@/app/providers";
import { assetUrl } from "@/lib/api";
import { initial } from "@/lib/format";

const NAV = [
  { href: "/", label: "Trang chủ" },
  { href: "/phong", label: "Chỗ ở" },
  { href: "/trai-nghiem", label: "Trải nghiệm" },
  { href: "/dich-vu", label: "Dịch vụ" },
];

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <span className="flex h-[38px] w-[38px] items-center justify-center rounded-xl bg-gradient-to-br from-brand to-brand-pink shadow-[0_6px_16px_rgba(14,59,51,.32)]">
        <svg width="21" height="21" viewBox="0 0 24 24" fill="none">
          <path d="M3 11.4 12 4l9 7.4V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" fill="#fff" />
        </svg>
      </span>
      <span className="font-display text-[23px] font-extrabold tracking-tight text-brand">
        airbnb
      </span>
    </Link>
  );
}

export default function Header() {
  const { isLoggedIn, user, logout, ready } = useApp();
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Đóng menu khi click ra ngoài
  useEffect(() => {
    if (!menuOpen) return;
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [menuOpen]);

  // Đóng menu khi chuyển trang
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header className="fixed inset-x-0 top-0 z-[60] flex h-[76px] items-center justify-between border-b border-white/55 px-5 shadow-[0_4px_30px_rgba(17,17,20,.05)] backdrop-blur-[26px] sm:px-8 lg:px-13" style={{ background: "rgba(255,255,255,.62)" }}>
      <Logo />

      <nav className="hidden items-center gap-1 rounded-full border border-white/60 bg-[rgba(246,246,248,.65)] p-1.5 backdrop-blur-[10px] md:flex">
        {NAV.map((item) => {
          const active =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-full px-4.5 py-2.5 text-[14.5px] transition-colors ${active ? "bg-white font-bold shadow-[0_2px_8px_rgba(0,0,0,.06)]" : "font-semibold text-muted hover:text-ink"}`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center gap-2.5">
        {!ready ? (
          // Chưa khôi phục xong trạng thái đăng nhập từ localStorage —
          // hiện placeholder để không nháy nút Đăng nhập/Đăng ký
          <span className="h-9 w-[88px] rounded-full bg-[rgba(0,0,0,.05)]" aria-hidden />
        ) : isLoggedIn ? (
          <div ref={menuRef} className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Tài khoản"
              aria-expanded={menuOpen}
              className="flex cursor-pointer items-center gap-2.5 rounded-full border border-line-2 py-1.5 pr-2 pl-3.5 shadow-[0_2px_8px_rgba(0,0,0,.04)] transition-shadow hover:shadow-[0_4px_16px_rgba(0,0,0,.12)]"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1A1A1F" strokeWidth="2.2" strokeLinecap="round">
                <path d="M3 7h18M3 12h18M3 17h18" />
              </svg>
              <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-brand to-brand-pink text-[13px] font-bold text-white">
                {user?.avatar ? (
                  <Image src={assetUrl(user.avatar)} alt="" width={32} height={32} className="h-full w-full object-cover" />
                ) : (
                  initial(user?.name)
                )}
              </span>
            </button>

            {menuOpen && (
              <div
                className="absolute right-0 mt-2.5 w-60 overflow-hidden rounded-2xl border border-line-2 bg-white shadow-[0_16px_44px_rgba(0,0,0,.16)]"
                style={{ animation: "scaleIn .18s both" }}
              >
                <div className="flex items-center gap-3 border-b border-line px-4 py-3.5">
                  <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-brand to-brand-pink text-sm font-bold text-white">
                    {user?.avatar ? (
                      <Image src={assetUrl(user.avatar)} alt="" width={36} height={36} className="h-full w-full object-cover" />
                    ) : (
                      initial(user?.name)
                    )}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold">{user?.name}</p>
                    <p className="truncate text-[12.5px] text-muted-2">{user?.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => router.push("/profile")}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-semibold transition-colors hover:bg-cream"
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>
                  Tài khoản của tôi
                </button>
                <div className="h-px bg-line" />
                <button
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                    router.push("/");
                  }}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-semibold text-brand transition-colors hover:bg-[#eef3f0]"
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" /></svg>
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link
              href="/auth"
              className="rounded-full px-3.5 py-2.5 text-sm font-semibold transition-colors hover:bg-[#f3f3f5]"
            >
              Đăng nhập
            </Link>
            <Link
              href="/auth?mode=register"
              className="rounded-full bg-gradient-to-br from-brand to-brand-pink px-4.5 py-2.5 text-sm font-bold text-white shadow-[0_6px_16px_rgba(14,59,51,.32)] transition-transform hover:-translate-y-px"
            >
              Đăng ký
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
