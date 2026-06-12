const COLUMNS = [
  {
    title: "Hỗ trợ",
    links: ["Trung tâm trợ giúp", "An toàn", "Hủy đặt phòng"],
  },
  {
    title: "Chủ nhà",
    links: ["Cho thuê chỗ ở", "Tài nguyên", "Cộng đồng"],
  },
  {
    title: "Khám phá",
    links: ["Điểm đến nổi bật", "Trải nghiệm", "Tạp chí du lịch"],
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#0b1512] px-5 pt-16 pb-9 text-white sm:px-8 lg:px-13">
      <div className="mx-auto grid max-w-[1320px] grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex h-[38px] w-[38px] items-center justify-center rounded-xl" style={{ background: "linear-gradient(135deg,#E3C77E,#C8A24A)" }}>
              <svg width="21" height="21" viewBox="0 0 24 24" fill="none">
                <path d="M3 11.4 12 4l9 7.4V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" fill="#0b1512" />
              </svg>
            </span>
            <span className="font-display text-[23px] font-extrabold text-gold">
              airbnb
            </span>
          </div>
          <p className="mt-4.5 max-w-[280px] text-[14.5px] leading-relaxed text-muted-2">
            Nền tảng đặt phòng giúp bạn khám phá những chỗ ở độc đáo trên khắp
            Việt Nam.
          </p>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h4 className="font-display mb-4 text-[15px] font-bold">
              {col.title}
            </h4>
            {col.links.map((l) => (
              <p
                key={l}
                className="mb-3 cursor-pointer text-sm text-muted-2 last:mb-0 hover:text-white"
              >
                {l}
              </p>
            ))}
          </div>
        ))}
      </div>

      <div className="mx-auto mt-10 flex max-w-[1320px] flex-wrap justify-between gap-3 border-t border-[#1e2a25] pt-6.5 text-[13.5px] text-muted">
        <span>© 2026 airbnb clone · Đề án CyberSoft</span>
        <span>Quyền riêng tư · Điều khoản · Sơ đồ trang</span>
      </div>
    </footer>
  );
}
