import { notFound } from "next/navigation";
import BookingClient from "@/components/booking-client";
import { getPhongById, getViTriList } from "@/lib/api";
import type { Phong, ViTri } from "@/lib/types";

export default async function DatPhongPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ checkIn?: string; checkOut?: string; guests?: string }>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  const phongId = Number(id);
  if (!Number.isInteger(phongId)) notFound();

  let room: Phong;
  let viTriList: ViTri[] = [];
  try {
    [room, viTriList] = await Promise.all([
      getPhongById(phongId),
      getViTriList(),
    ]);
  } catch {
    notFound();
  }

  return (
    <BookingClient
      room={room!}
      viTriList={viTriList}
      initialCheckIn={sp.checkIn ?? ""}
      initialCheckOut={sp.checkOut ?? ""}
      initialGuests={Number(sp.guests) || 2}
    />
  );
}
