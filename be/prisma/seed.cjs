/**
 * Seed dữ liệu mẫu cho DB airbnb — mô phỏng đúng mock data của bản thiết kế.
 * Chạy: node prisma/seed.cjs   (đọc DATABASE_URL trong .env)
 *
 * Dùng driver mariadb trực tiếp (raw SQL) vì Prisma client được generate ở
 * dạng .ts nên không require thẳng từ Node thuần được.
 */
require('dotenv/config');
const mariadb = require('mariadb');
const bcrypt = require('bcrypt');

const img = (id, w = 900) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`;

// Ảnh cảnh quan cho vị trí (scenicPool trong thiết kế)
const scenic = [
  '1501183638710-841dd1904471',
  '1484154218962-a197022b5858',
  '1522771739844-6a9f6d5f14af',
  '1416331108676-a22ccb276e35',
  '1564013799919-ab600027ffc6',
  '1582719478250-c89cae4dc85b',
  '1512917774080-9991f1c4c750',
  '1583847268964-b28dc8f51f92',
];

const viTri = [
  { id: 1, tenViTri: 'Đà Lạt', tinhThanh: 'Lâm Đồng' },
  { id: 2, tenViTri: 'Vũng Tàu', tinhThanh: 'Bà Rịa - Vũng Tàu' },
  { id: 3, tenViTri: 'Phú Quốc', tinhThanh: 'Kiên Giang' },
  { id: 4, tenViTri: 'Hội An', tinhThanh: 'Quảng Nam' },
  { id: 5, tenViTri: 'Nha Trang', tinhThanh: 'Khánh Hòa' },
  { id: 6, tenViTri: 'Sa Pa', tinhThanh: 'Lào Cai' },
  { id: 7, tenViTri: 'Đà Nẵng', tinhThanh: 'Đà Nẵng' },
  { id: 8, tenViTri: 'Hà Nội', tinhThanh: 'Hà Nội' },
];

// Ảnh chính của mỗi phòng (roomPics[ id ][0] trong thiết kế)
const roomPic = {
  1: '1560185007-cde436f6a4d0',
  2: '1583847268964-b28dc8f51f92',
  3: '1582719478250-c89cae4dc85b',
  4: '1564013799919-ab600027ffc6',
  5: '1566073771259-6a8506099945',
  6: '1571003123894-1f0594d2b5d9',
  7: '1512917774080-9991f1c4c750',
  8: '1600585154340-be6161a56a0c',
  9: '1600566753086-00f18fb6b3ea',
  10: '1598928506311-c55ded91a20c',
};

// am: tập tiện nghi bật (true)
const phong = [
  { id: 1, viTri: 1, tenPhong: 'Căn hộ view đồi thông Đà Lạt', khach: 4, phongNgu: 2, giuong: 2, phongTam: 1, giaTien: 850000, am: ['wifi', 'dieuHoa', 'bep', 'tiVi', 'doXe', 'mayGiat'] },
  { id: 2, viTri: 1, tenPhong: 'Homestay săn mây Cầu Đất', khach: 2, phongNgu: 1, giuong: 1, phongTam: 1, giaTien: 650000, am: ['wifi', 'bep', 'tiVi', 'doXe'] },
  { id: 3, viTri: 3, tenPhong: 'Villa bãi biển riêng Phú Quốc', khach: 8, phongNgu: 4, giuong: 5, phongTam: 3, giaTien: 3200000, am: ['wifi', 'dieuHoa', 'bep', 'tiVi', 'hoBoi', 'doXe', 'mayGiat', 'banLa'] },
  { id: 4, viTri: 4, tenPhong: 'Nhà cổ phố Hội ấm cúng', khach: 3, phongNgu: 1, giuong: 2, phongTam: 1, giaTien: 1100000, am: ['wifi', 'dieuHoa', 'bep', 'tiVi'] },
  { id: 5, viTri: 5, tenPhong: 'Căn hộ biển Nha Trang tầng cao', khach: 4, phongNgu: 2, giuong: 2, phongTam: 2, giaTien: 1450000, am: ['wifi', 'dieuHoa', 'bep', 'tiVi', 'hoBoi', 'doXe'] },
  { id: 6, viTri: 2, tenPhong: 'Penthouse Vũng Tàu view biển', khach: 6, phongNgu: 3, giuong: 3, phongTam: 2, giaTien: 2400000, am: ['wifi', 'dieuHoa', 'bep', 'tiVi', 'hoBoi', 'doXe', 'mayGiat'] },
  { id: 7, viTri: 6, tenPhong: 'Bungalow giữa rừng Sa Pa', khach: 2, phongNgu: 1, giuong: 1, phongTam: 1, giaTien: 980000, am: ['wifi', 'bep', 'tiVi', 'doXe'] },
  { id: 8, viTri: 7, tenPhong: 'Studio Đà Nẵng gần biển Mỹ Khê', khach: 2, phongNgu: 1, giuong: 1, phongTam: 1, giaTien: 720000, am: ['wifi', 'dieuHoa', 'bep', 'tiVi', 'mayGiat'] },
  { id: 9, viTri: 8, tenPhong: 'Căn hộ phố cổ Hà Nội', khach: 3, phongNgu: 1, giuong: 2, phongTam: 1, giaTien: 1250000, am: ['wifi', 'dieuHoa', 'bep', 'tiVi', 'mayGiat'] },
  { id: 10, viTri: 3, tenPhong: 'Resort mini Bãi Sao Phú Quốc', khach: 5, phongNgu: 2, giuong: 3, phongTam: 2, giaTien: 2750000, am: ['wifi', 'dieuHoa', 'bep', 'tiVi', 'hoBoi', 'doXe'] },
];

const allAm = ['mayGiat', 'banLa', 'tiVi', 'dieuHoa', 'wifi', 'bep', 'doXe', 'hoBoi', 'banUi'];

const users = [
  { id: 1, name: 'Minh Anh', email: 'minhanh@gmail.com', phone: '0901234567', gender: 'Nữ', role: 'USER' },
  { id: 2, name: 'Trần Quốc Hải', email: 'hai.host@gmail.com', phone: '0912888777', gender: 'Nam', role: 'USER' },
  { id: 3, name: 'Lê Thuỳ Trang', email: 'trang.host@gmail.com', phone: '0987555333', gender: 'Nữ', role: 'USER' },
  { id: 4, name: 'Phạm Gia Huy', email: 'huy.pham@gmail.com', phone: '0934121212', gender: 'Nam', role: 'USER' },
  { id: 5, name: 'Admin CyberSoft', email: 'admin@cybersoft.edu.vn', phone: '0900000000', gender: 'Nam', role: 'ADMIN' },
  { id: 6, name: 'Nguyễn Bảo Ngọc', email: 'ngoc.nguyen@gmail.com', phone: '0978343434', gender: 'Nữ', role: 'USER' },
];

const binhLuan = [
  { maCongViec: 1, maNguoiBinhLuan: 1, saoBinhLuan: 5, noiDung: 'Căn hộ cực kỳ sạch sẽ, view đồi thông buổi sáng đẹp mê hồn. Chủ nhà thân thiện, hỗ trợ rất nhiệt tình!' },
  { maCongViec: 1, maNguoiBinhLuan: 3, saoBinhLuan: 5, noiDung: 'Vị trí yên tĩnh, decor xinh xắn đúng chất Đà Lạt. Chắc chắn sẽ quay lại lần sau.' },
  { maCongViec: 1, maNguoiBinhLuan: 4, saoBinhLuan: 4, noiDung: 'Phòng đẹp, đầy đủ tiện nghi. Đường lên hơi dốc một chút nhưng hoàn toàn ổn.' },
  { maCongViec: 3, maNguoiBinhLuan: 6, saoBinhLuan: 5, noiDung: 'Villa rộng rãi, hồ bơi riêng tuyệt vời cho nhóm bạn. Cả nhà ai cũng mê!' },
  { maCongViec: 3, maNguoiBinhLuan: 2, saoBinhLuan: 5, noiDung: 'Đáng từng đồng. Bãi biển ngay trước cửa, hoàng hôn cực phẩm.' },
  { maCongViec: 5, maNguoiBinhLuan: 4, saoBinhLuan: 5, noiDung: 'View biển Nha Trang từ tầng cao quá đỉnh, sáng dậy ngắm biển thư giãn vô cùng.' },
  { maCongViec: 6, maNguoiBinhLuan: 1, saoBinhLuan: 5, noiDung: 'Penthouse sang trọng, ban công rộng nhìn thẳng ra biển. Rất đáng tiền.' },
];

async function main() {
  const url = new URL(process.env.DATABASE_URL);
  const conn = await mariadb.createConnection({
    host: url.hostname,
    port: Number(url.port || 3306),
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: url.pathname.replace(/^\//, ''),
    allowPublicKeyRetrieval: true,
  });

  console.log('Đã kết nối DB. Bắt đầu seed...');
  await conn.query('SET FOREIGN_KEY_CHECKS = 0');
  for (const t of ['BinhLuanTb', 'DatPhongTb', 'PhongTb', 'ViTriTb', 'NguoiDungTb']) {
    await conn.query(`DELETE FROM ${t}`);
    await conn.query(`ALTER TABLE ${t} AUTO_INCREMENT = 1`);
  }
  await conn.query('SET FOREIGN_KEY_CHECKS = 1');

  // Users — cùng mật khẩu demo "123456"
  const hash = bcrypt.hashSync('123456', 10);
  for (const u of users) {
    await conn.query(
      'INSERT INTO NguoiDungTb (id, name, email, password, phone, gender, role) VALUES (?,?,?,?,?,?,?)',
      [u.id, u.name, u.email, hash, u.phone, u.gender, u.role],
    );
  }
  console.log(`+ ${users.length} người dùng (mật khẩu: 123456)`);

  // Vị trí
  for (let i = 0; i < viTri.length; i++) {
    const v = viTri[i];
    await conn.query(
      'INSERT INTO ViTriTb (id, tenViTri, tinhThanh, quocGia, hinhAnh) VALUES (?,?,?,?,?)',
      [v.id, v.tenViTri, v.tinhThanh, 84, img(scenic[i % scenic.length], 600)],
    );
  }
  console.log(`+ ${viTri.length} vị trí`);

  // Phòng
  for (const p of phong) {
    const amCols = allAm.map((k) => (p.am.includes(k) ? 1 : 0));
    const moTa =
      `Tận hưởng kỳ nghỉ đáng nhớ tại ${viTri.find((v) => v.id === p.viTri).tenViTri}. ` +
      `Không gian được thiết kế tinh tế, ngập tràn ánh sáng tự nhiên với đầy đủ tiện nghi hiện đại. ` +
      `Chủ nhà luôn sẵn sàng hỗ trợ để chuyến đi của bạn thật trọn vẹn.`;
    await conn.query(
      `INSERT INTO PhongTb
        (id, tenPhong, khach, phongNgu, giuong, phongTam, moTa, giaTien,
         mayGiat, banLa, tiVi, dieuHoa, wifi, bep, doXe, hoBoi, banUi, hinhAnh, viTri)
       VALUES (?,?,?,?,?,?,?,?, ?,?,?,?,?,?,?,?,?, ?,?)`,
      [
        p.id, p.tenPhong, p.khach, p.phongNgu, p.giuong, p.phongTam, moTa, p.giaTien,
        ...amCols, img(roomPic[p.id]), p.viTri,
      ],
    );
  }
  console.log(`+ ${phong.length} phòng`);

  // Bình luận
  for (const b of binhLuan) {
    await conn.query(
      'INSERT INTO BinhLuanTb (maCongViec, maNguoiBinhLuan, noiDung, saoBinhLuan) VALUES (?,?,?,?)',
      [b.maCongViec, b.maNguoiBinhLuan, b.noiDung, b.saoBinhLuan],
    );
  }
  console.log(`+ ${binhLuan.length} bình luận`);

  await conn.end();
  console.log('Seed hoàn tất ✓');
}

main().catch((e) => {
  console.error('Seed lỗi:', e);
  process.exit(1);
});
