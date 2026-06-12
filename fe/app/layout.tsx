import type { Metadata } from "next";
import { Lora, Plus_Jakarta_Sans } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import Providers from "./providers";
import Header from "@/components/header";
import Footer from "@/components/footer";
import ScrollToTop from "@/components/scroll-to-top";
import Splash from "@/components/splash";
import { API_BASE } from "@/lib/api";
import type { NguoiDung } from "@/lib/types";

/**
 * Đọc user hiện tại NGAY TRÊN SERVER từ cookie httpOnly (accessToken) bằng cách
 * gọi /auth/me và chuyển tiếp cookie của request. Nhờ vậy HTML trả về đã biết
 * trạng thái đăng nhập → header hiện avatar ngay, không "nháy" nút đăng nhập.
 */
async function getInitialUser(): Promise<NguoiDung | null> {
  try {
    const cookie = (await headers()).get("cookie") ?? "";
    if (!cookie.includes("accessToken")) return null;
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { cookie },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const body = await res.json();
    return (body?.content as NguoiDung) ?? null;
  } catch {
    return null;
  }
}

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
});

const lora = Lora({
  variable: "--font-bevn",
  subsets: ["latin", "vietnamese"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "airbnb · Đặt phòng khắp Việt Nam",
  description:
    "Khám phá hơn 1.200 chỗ ở độc đáo trên khắp Việt Nam — đặt phòng nhanh, an toàn.",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const initialUser = await getInitialUser();
  return (
    <html
      lang="vi"
      className={`${jakarta.variable} ${lora.variable} antialiased`}
    >
      <body className="flex min-h-screen flex-col">
        <Providers initialUser={initialUser}>
          <Header />
          <main className="flex-1 pt-[76px]">{children}</main>
          <Footer />
          <ScrollToTop />
        </Providers>
        <Splash />
      </body>
    </html>
  );
}
