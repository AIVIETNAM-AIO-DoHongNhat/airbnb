// Helper phân trang dùng chung cho mọi bảng Prisma
// (model nào cũng có sẵn count + findMany nên dùng được cho tất cả)

interface PrismaDelegate {
  count: (args?: any) => Promise<number>;
  findMany: (args?: any) => Promise<any[]>;
}

export interface PhanTrangOptions {
  pageIndex?: number;
  pageSize?: number;
  where?: any;
  orderBy?: any;
  select?: any;
  omit?: any;
  include?: any;
}

/**
 * Phân trang một model Prisma, trả về { pageIndex, pageSize, totalRow, totalPage, data }.
 *
 * @example
 *   phanTrang(this.prisma.nguoiDungTb, {
 *     pageIndex, pageSize,
 *     where: { name: { contains: keyword } },
 *     omit: { password: true },
 *   });
 */
export async function phanTrang(model: PrismaDelegate, options: PhanTrangOptions = {}) {
  // Mặc định trang 1, 10 dòng; luôn >= 1
  const pageIndex = Math.max(1, Number(options.pageIndex) || 1);
  const pageSize = Math.max(1, Number(options.pageSize) || 10);

  const { where, orderBy, select, omit, include } = options;

  // Đếm tổng + lấy dữ liệu trang hiện tại cùng lúc cho nhanh
  const [totalRow, data] = await Promise.all([
    model.count({ where }),
    model.findMany({
      where,
      orderBy,
      select,
      omit,
      include,
      skip: (pageIndex - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  return {
    pageIndex,
    pageSize,
    totalRow,
    totalPage: Math.ceil(totalRow / pageSize),
    data,
  };
}
