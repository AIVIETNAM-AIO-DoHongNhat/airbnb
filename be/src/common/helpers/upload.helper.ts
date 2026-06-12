import { BadRequestException } from '@nestjs/common';

// Map mimetype ảnh hợp lệ -> phần mở rộng chuẩn
const ALLOWED_IMAGE: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
};

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5MB

/**
 * Kiểm tra file ảnh upload và sinh tên file AN TOÀN.
 * - Chặn path-traversal: KHÔNG dùng file.originalname để dựng đường dẫn,
 *   chỉ lấy phần mở rộng suy ra từ mimetype.
 * - Chặn file không phải ảnh / quá lớn.
 *
 * @param file   object multer (memory storage)
 * @param prefix tiền tố tên file (vd userId, maPhong)
 * @param seed   giá trị thay cho Date.now() (controller truyền vào để dễ test)
 */
export function buildSafeImageName(
  file: { mimetype?: string; size?: number; originalname?: string } | undefined,
  prefix: string | number,
  seed: number,
): string {
  if (!file) {
    throw new BadRequestException('Không có file được tải lên');
  }

  const ext = file.mimetype ? ALLOWED_IMAGE[file.mimetype] : undefined;
  if (!ext) {
    throw new BadRequestException(
      'Chỉ chấp nhận ảnh định dạng JPG, PNG, WEBP hoặc GIF',
    );
  }

  if (typeof file.size === 'number' && file.size > MAX_IMAGE_BYTES) {
    throw new BadRequestException('Kích thước ảnh tối đa 5MB');
  }

  // Chỉ giữ chữ/số ở prefix, ext lấy từ whitelist -> không thể chứa '../'
  const safePrefix = String(prefix).replace(/[^a-zA-Z0-9_-]/g, '');
  return `${safePrefix}-${seed}${ext}`;
}
