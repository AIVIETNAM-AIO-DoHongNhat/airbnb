import HomeClient from "@/components/home-client";
import { getPhongList, getViTriList } from "@/lib/api";
import type { Phong, ViTri } from "@/lib/types";

export default async function HomePage() {
  let viTriList: ViTri[] = [];
  let phongList: Phong[] = [];
  let error: string | null = null;

  try {
    [viTriList, phongList] = await Promise.all([
      getViTriList(),
      getPhongList(),
    ]);
  } catch (e) {
    error = e instanceof Error ? e.message : "Không tải được dữ liệu";
  }

  if (error) {
    return (
      <div className="mx-auto max-w-md px-6 py-32 text-center">
        <h1 className="font-display text-2xl font-extrabold">
          Không kết nối được máy chủ
        </h1>
        <p className="mt-3 text-muted">
          Hãy chắc chắn backend đang chạy ở{" "}
          <code className="rounded bg-cream px-1.5 py-0.5">localhost:3099</code>.
        </p>
        <p className="mt-2 text-sm text-muted-2">{error}</p>
      </div>
    );
  }

  return <HomeClient viTriList={viTriList} phongList={phongList} />;
}
