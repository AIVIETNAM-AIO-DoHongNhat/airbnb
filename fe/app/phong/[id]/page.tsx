import { notFound } from "next/navigation";
import DetailClient from "@/components/detail-client";
import {
  getBinhLuanByPhong,
  getPhongById,
  getPhongList,
  getViTriList,
} from "@/lib/api";
import type { BinhLuan, Phong, ViTri } from "@/lib/types";

export default async function PhongDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const phongId = Number(id);
  if (!Number.isInteger(phongId)) notFound();

  let room: Phong;
  let viTriList: ViTri[] = [];
  let comments: BinhLuan[] = [];
  let allRooms: Phong[] = [];

  try {
    [room, viTriList, comments, allRooms] = await Promise.all([
      getPhongById(phongId),
      getViTriList(),
      getBinhLuanByPhong(phongId),
      getPhongList(),
    ]);
  } catch {
    notFound();
  }

  // Gợi ý: ưu tiên cùng vị trí, rồi tới các phòng khác
  const sameLoc = allRooms.filter((r) => r.id !== room!.id && r.viTri === room!.viTri);
  const others = allRooms.filter((r) => r.id !== room!.id && r.viTri !== room!.viTri);
  const related = [...sameLoc, ...others].slice(0, 3);

  return (
    <DetailClient
      room={room!}
      viTriList={viTriList}
      comments={comments}
      related={related}
    />
  );
}
