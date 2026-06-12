CREATE DATABASE /*!32312 IF NOT EXISTS*/ `airbnb` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `airbnb`;


DROP TABLE IF EXISTS `BinhLuanTb`;
CREATE TABLE `BinhLuanTb` (
  `id` int NOT NULL AUTO_INCREMENT,
  `maCongViec` int NOT NULL,
  `maNguoiBinhLuan` int NOT NULL,
  `ngayBinhLuan` datetime DEFAULT CURRENT_TIMESTAMP,
  `noiDung` varchar(1000) DEFAULT NULL,
  `saoBinhLuan` int DEFAULT '5',
  `deletedBy` int NOT NULL DEFAULT '0',
  `isDeleted` tinyint(1) NOT NULL DEFAULT '0',
  `deletedAt` timestamp NULL DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `maCongViec` (`maCongViec`),
  KEY `maNguoiBinhLuan` (`maNguoiBinhLuan`),
  CONSTRAINT `BinhLuanTb_ibfk_1` FOREIGN KEY (`maCongViec`) REFERENCES `PhongTb` (`id`),
  CONSTRAINT `BinhLuanTb_ibfk_2` FOREIGN KEY (`maNguoiBinhLuan`) REFERENCES `NguoiDungTb` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

LOCK TABLES `BinhLuanTb` WRITE;
INSERT INTO `BinhLuanTb` VALUES (1,1,1,'2026-06-11 15:02:37','Căn hộ cực kỳ sạch sẽ, view đồi thông buổi sáng đẹp mê hồn. Chủ nhà thân thiện, hỗ trợ rất nhiệt tình!',5,0,0,NULL,'2026-06-11 15:02:37','2026-06-11 15:02:37'),(2,1,3,'2026-06-11 15:02:37','Vị trí yên tĩnh, decor xinh xắn đúng chất Đà Lạt. Chắc chắn sẽ quay lại lần sau.',5,0,0,NULL,'2026-06-11 15:02:37','2026-06-11 15:02:37'),(3,1,4,'2026-06-11 15:02:37','Phòng đẹp, đầy đủ tiện nghi. Đường lên hơi dốc một chút nhưng hoàn toàn ổn.',4,0,0,NULL,'2026-06-11 15:02:37','2026-06-11 15:02:37'),(4,3,6,'2026-06-11 15:02:37','Villa rộng rãi, hồ bơi riêng tuyệt vời cho nhóm bạn. Cả nhà ai cũng mê!',5,0,0,NULL,'2026-06-11 15:02:37','2026-06-11 15:02:37'),(5,3,2,'2026-06-11 15:02:37','Đáng từng đồng. Bãi biển ngay trước cửa, hoàng hôn cực phẩm.',5,0,0,NULL,'2026-06-11 15:02:37','2026-06-11 15:02:37'),(6,5,4,'2026-06-11 15:02:37','View biển Nha Trang từ tầng cao quá đỉnh, sáng dậy ngắm biển thư giãn vô cùng.',5,0,0,NULL,'2026-06-11 15:02:37','2026-06-11 15:02:37'),(7,6,1,'2026-06-11 15:02:37','Penthouse sang trọng, ban công rộng nhìn thẳng ra biển. Rất đáng tiền.',5,0,0,NULL,'2026-06-11 15:02:37','2026-06-11 15:02:37'),(8,2,1,'2026-06-11 15:36:16','Ph�ng nh? xinh, view san m�y tuy?t v?i!',5,0,0,NULL,'2026-06-11 15:36:16','2026-06-11 15:36:16'),(9,1,7,'2026-06-12 00:10:07','Hello',5,0,0,NULL,'2026-06-12 00:10:07','2026-06-12 00:10:07');
UNLOCK TABLES;
DROP TABLE IF EXISTS `DatPhongTb`;
CREATE TABLE `DatPhongTb` (
  `id` int NOT NULL AUTO_INCREMENT,
  `maPhong` int NOT NULL,
  `ngayDen` datetime NOT NULL,
  `ngayDi` datetime NOT NULL,
  `soLuongKhach` int DEFAULT '1',
  `maNguoiDat` int NOT NULL,
  `deletedBy` int NOT NULL DEFAULT '0',
  `isDeleted` tinyint(1) NOT NULL DEFAULT '0',
  `deletedAt` timestamp NULL DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `maPhong` (`maPhong`),
  KEY `maNguoiDat` (`maNguoiDat`),
  CONSTRAINT `DatPhongTb_ibfk_1` FOREIGN KEY (`maPhong`) REFERENCES `PhongTb` (`id`),
  CONSTRAINT `DatPhongTb_ibfk_2` FOREIGN KEY (`maNguoiDat`) REFERENCES `NguoiDungTb` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
LOCK TABLES `DatPhongTb` WRITE;
INSERT INTO `DatPhongTb` VALUES (1,1,'2026-07-12 00:00:00','2026-07-15 00:00:00',2,1,0,0,NULL,'2026-06-11 15:22:11','2026-06-11 15:22:11'),(2,2,'2026-06-09 00:00:00','2026-06-10 00:00:00',2,7,0,1,'2026-06-12 09:23:09','2026-06-12 05:48:06','2026-06-12 09:23:07');
UNLOCK TABLES;

DROP TABLE IF EXISTS `NguoiDungTb`;
CREATE TABLE `NguoiDungTb` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `birthday` varchar(20) DEFAULT NULL,
  `gender` varchar(10) DEFAULT NULL,
  `role` varchar(20) DEFAULT 'USER',
  `avatar` varchar(255) DEFAULT NULL,
  `deletedBy` int NOT NULL DEFAULT '0',
  `isDeleted` tinyint(1) NOT NULL DEFAULT '0',
  `deletedAt` timestamp NULL DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

LOCK TABLES `NguoiDungTb` WRITE;
INSERT INTO `NguoiDungTb` VALUES (1,'Minh Anh','minhanh@gmail.com','$2b$10$mKIr7UjwOfZpCOb/OIyYCuxb56oyP1km1RPoDFfNxp./nKCsR0V6G','0901234567',NULL,'Nữ','USER',NULL,0,0,NULL,'2026-06-11 15:02:37','2026-06-11 15:02:37'),(2,'Trần Quốc Hải','hai.host@gmail.com','$2b$10$mKIr7UjwOfZpCOb/OIyYCuxb56oyP1km1RPoDFfNxp./nKCsR0V6G','0912888777',NULL,'Nam','USER',NULL,0,0,NULL,'2026-06-11 15:02:37','2026-06-11 15:02:37'),(3,'Lê Thuỳ Trang','trang.host@gmail.com','$2b$10$mKIr7UjwOfZpCOb/OIyYCuxb56oyP1km1RPoDFfNxp./nKCsR0V6G','0987555333',NULL,'Nữ','USER',NULL,0,0,NULL,'2026-06-11 15:02:37','2026-06-11 15:02:37'),(4,'Phạm Gia Huy','huy.pham@gmail.com','$2b$10$mKIr7UjwOfZpCOb/OIyYCuxb56oyP1km1RPoDFfNxp./nKCsR0V6G','0934121212',NULL,'Nam','USER',NULL,0,0,NULL,'2026-06-11 15:02:37','2026-06-11 15:02:37'),(5,'Admin CyberSoft','admin@cybersoft.edu.vn','$2b$10$mKIr7UjwOfZpCOb/OIyYCuxb56oyP1km1RPoDFfNxp./nKCsR0V6G','0900000000',NULL,'Nam','ADMIN',NULL,0,0,NULL,'2026-06-11 15:02:37','2026-06-11 15:02:37'),(6,'Nguyễn Bảo Ngọc','ngoc.nguyen@gmail.com','$2b$10$mKIr7UjwOfZpCOb/OIyYCuxb56oyP1km1RPoDFfNxp./nKCsR0V6G','0978343434',NULL,'Nữ','USER',NULL,0,0,NULL,'2026-06-11 15:02:37','2026-06-11 15:02:37'),(7,'Đỗ Hồng Nhất','nhat@gmail.com','$2b$10$.YNEIFJB65FUHoKp9vprBO0W17oocwItfxhxK.v1R6xh3FSq1XyQW','0379829733','2026-06-17','Nam','USER','/avatars/7-1781256705720.png',0,0,NULL,'2026-06-11 15:35:59','2026-06-12 09:31:43');
UNLOCK TABLES;

DROP TABLE IF EXISTS `PhongTb`;
CREATE TABLE `PhongTb` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tenPhong` varchar(200) NOT NULL,
  `khach` int DEFAULT '1',
  `phongNgu` int DEFAULT '1',
  `giuong` int DEFAULT '1',
  `phongTam` int DEFAULT '1',
  `moTa` varchar(1000) DEFAULT NULL,
  `giaTien` int NOT NULL,
  `mayGiat` tinyint(1) DEFAULT '0',
  `banLa` tinyint(1) DEFAULT '0',
  `tiVi` tinyint(1) DEFAULT '0',
  `dieuHoa` tinyint(1) DEFAULT '0',
  `wifi` tinyint(1) DEFAULT '0',
  `bep` tinyint(1) DEFAULT '0',
  `doXe` tinyint(1) DEFAULT '0',
  `hoBoi` tinyint(1) DEFAULT '0',
  `banUi` tinyint(1) DEFAULT '0',
  `hinhAnh` varchar(500) DEFAULT NULL,
  `viTri` int DEFAULT NULL,
  `deletedBy` int NOT NULL DEFAULT '0',
  `isDeleted` tinyint(1) NOT NULL DEFAULT '0',
  `deletedAt` timestamp NULL DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `viTri` (`viTri`),
  CONSTRAINT `PhongTb_ibfk_1` FOREIGN KEY (`viTri`) REFERENCES `ViTriTb` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

LOCK TABLES `PhongTb` WRITE;
INSERT INTO `PhongTb` VALUES (1,'Căn hộ view đồi thông Đà Lạt',4,2,2,1,'Tận hưởng kỳ nghỉ đáng nhớ tại Đà Lạt. Không gian được thiết kế tinh tế, ngập tràn ánh sáng tự nhiên với đầy đủ tiện nghi hiện đại. Chủ nhà luôn sẵn sàng hỗ trợ để chuyến đi của bạn thật trọn vẹn.',850000,1,0,1,1,1,1,1,0,0,'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=900&q=80&auto=format&fit=crop',1,0,0,NULL,'2026-06-11 15:02:37','2026-06-11 15:02:37'),(2,'Homestay săn mây Cầu Đất',2,1,1,1,'Tận hưởng kỳ nghỉ đáng nhớ tại Đà Lạt. Không gian được thiết kế tinh tế, ngập tràn ánh sáng tự nhiên với đầy đủ tiện nghi hiện đại. Chủ nhà luôn sẵn sàng hỗ trợ để chuyến đi của bạn thật trọn vẹn.',650000,0,0,1,0,1,1,1,0,0,'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=900&q=80&auto=format&fit=crop',1,0,0,NULL,'2026-06-11 15:02:37','2026-06-11 15:02:37'),(3,'Villa bãi biển riêng Phú Quốc',8,4,5,3,'Tận hưởng kỳ nghỉ đáng nhớ tại Phú Quốc. Không gian được thiết kế tinh tế, ngập tràn ánh sáng tự nhiên với đầy đủ tiện nghi hiện đại. Chủ nhà luôn sẵn sàng hỗ trợ để chuyến đi của bạn thật trọn vẹn.',3200000,1,1,1,1,1,1,1,1,0,'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=900&q=80&auto=format&fit=crop',3,0,0,NULL,'2026-06-11 15:02:37','2026-06-11 15:02:37'),(4,'Nhà cổ phố Hội ấm cúng',3,1,2,1,'Tận hưởng kỳ nghỉ đáng nhớ tại Hội An. Không gian được thiết kế tinh tế, ngập tràn ánh sáng tự nhiên với đầy đủ tiện nghi hiện đại. Chủ nhà luôn sẵn sàng hỗ trợ để chuyến đi của bạn thật trọn vẹn.',1100000,0,0,1,1,1,1,0,0,0,'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=900&q=80&auto=format&fit=crop',4,0,0,NULL,'2026-06-11 15:02:37','2026-06-11 15:02:37'),(5,'Căn hộ biển Nha Trang tầng cao',4,2,2,2,'Tận hưởng kỳ nghỉ đáng nhớ tại Nha Trang. Không gian được thiết kế tinh tế, ngập tràn ánh sáng tự nhiên với đầy đủ tiện nghi hiện đại. Chủ nhà luôn sẵn sàng hỗ trợ để chuyến đi của bạn thật trọn vẹn.',1450000,0,0,1,1,1,1,1,1,0,'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=900&q=80&auto=format&fit=crop',5,0,0,NULL,'2026-06-11 15:02:37','2026-06-11 15:02:37'),(6,'Penthouse Vũng Tàu view biển',6,3,3,2,'Tận hưởng kỳ nghỉ đáng nhớ tại Vũng Tàu. Không gian được thiết kế tinh tế, ngập tràn ánh sáng tự nhiên với đầy đủ tiện nghi hiện đại. Chủ nhà luôn sẵn sàng hỗ trợ để chuyến đi của bạn thật trọn vẹn.',2400000,1,0,1,1,1,1,1,1,0,'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=900&q=80&auto=format&fit=crop',2,0,0,NULL,'2026-06-11 15:02:37','2026-06-11 15:02:37'),(7,'Bungalow giữa rừng Sa Pa',2,1,1,1,'Tận hưởng kỳ nghỉ đáng nhớ tại Sa Pa. Không gian được thiết kế tinh tế, ngập tràn ánh sáng tự nhiên với đầy đủ tiện nghi hiện đại. Chủ nhà luôn sẵn sàng hỗ trợ để chuyến đi của bạn thật trọn vẹn.',980000,0,0,1,0,1,1,1,0,0,'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=900&q=80&auto=format&fit=crop',6,0,0,NULL,'2026-06-11 15:02:37','2026-06-11 15:02:37'),(8,'Studio Đà Nẵng gần biển Mỹ Khê',2,1,1,1,'Tận hưởng kỳ nghỉ đáng nhớ tại Đà Nẵng. Không gian được thiết kế tinh tế, ngập tràn ánh sáng tự nhiên với đầy đủ tiện nghi hiện đại. Chủ nhà luôn sẵn sàng hỗ trợ để chuyến đi của bạn thật trọn vẹn.',720000,1,0,1,1,1,1,0,0,0,'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=80&auto=format&fit=crop',7,0,0,NULL,'2026-06-11 15:02:37','2026-06-11 15:02:37'),(9,'Căn hộ phố cổ Hà Nội',3,1,2,1,'Tận hưởng kỳ nghỉ đáng nhớ tại Hà Nội. Không gian được thiết kế tinh tế, ngập tràn ánh sáng tự nhiên với đầy đủ tiện nghi hiện đại. Chủ nhà luôn sẵn sàng hỗ trợ để chuyến đi của bạn thật trọn vẹn.',1250000,1,0,1,1,1,1,0,0,0,'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=900&q=80&auto=format&fit=crop',8,0,0,NULL,'2026-06-11 15:02:37','2026-06-11 15:02:37'),(10,'Resort mini Bãi Sao Phú Quốc',5,2,3,2,'Tận hưởng kỳ nghỉ đáng nhớ tại Phú Quốc. Không gian được thiết kế tinh tế, ngập tràn ánh sáng tự nhiên với đầy đủ tiện nghi hiện đại. Chủ nhà luôn sẵn sàng hỗ trợ để chuyến đi của bạn thật trọn vẹn.',2750000,0,0,1,1,1,1,1,1,0,'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=900&q=80&auto=format&fit=crop',3,0,0,NULL,'2026-06-11 15:02:37','2026-06-11 15:02:37');
UNLOCK TABLES;

DROP TABLE IF EXISTS `ViTriTb`;
CREATE TABLE `ViTriTb` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tenViTri` varchar(150) NOT NULL,
  `tinhThanh` varchar(150) DEFAULT NULL,
  `quocGia` int DEFAULT NULL,
  `hinhAnh` varchar(500) DEFAULT NULL,
  `deletedBy` int NOT NULL DEFAULT '0',
  `isDeleted` tinyint(1) NOT NULL DEFAULT '0',
  `deletedAt` timestamp NULL DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

LOCK TABLES `ViTriTb` WRITE;
INSERT INTO `ViTriTb` VALUES (1,'Đà Lạt','Lâm Đồng',84,'https://images.unsplash.com/photo-1501183638710-841dd1904471?w=600&q=80&auto=format&fit=crop',0,0,NULL,'2026-06-11 15:02:37','2026-06-11 15:02:37'),(2,'Vũng Tàu','Bà Rịa - Vũng Tàu',84,'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&q=80&auto=format&fit=crop',0,0,NULL,'2026-06-11 15:02:37','2026-06-11 15:02:37'),(3,'Phú Quốc','Kiên Giang',84,'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&q=80&auto=format&fit=crop',0,0,NULL,'2026-06-11 15:02:37','2026-06-11 15:02:37'),(4,'Hội An','Quảng Nam',84,'https://images.unsplash.com/photo-1416331108676-a22ccb276e35?w=600&q=80&auto=format&fit=crop',0,0,NULL,'2026-06-11 15:02:37','2026-06-11 15:02:37'),(5,'Nha Trang','Khánh Hòa',84,'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&q=80&auto=format&fit=crop',0,0,NULL,'2026-06-11 15:02:37','2026-06-11 15:02:37'),(6,'Sa Pa','Lào Cai',84,'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80&auto=format&fit=crop',0,0,NULL,'2026-06-11 15:02:37','2026-06-11 15:02:37'),(7,'Đà Nẵng','Đà Nẵng',84,'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80&auto=format&fit=crop',0,0,NULL,'2026-06-11 15:02:37','2026-06-11 15:02:37'),(8,'Hà Nội','Hà Nội',84,'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=600&q=80&auto=format&fit=crop',0,0,NULL,'2026-06-11 15:02:37','2026-06-11 15:02:37');
UNLOCK TABLES;
