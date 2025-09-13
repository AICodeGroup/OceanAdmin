import request from '@/utils/request'

// 定义 Banner 对象的接口类型
export interface Banner {
  id?: number
  title: string
  imageUrl: string
  linkUrl: string
  sort: number
  status: boolean
  bannerType: number
  isDel?: boolean
  createdAt?: string
  updatedAt?: string
}

// 定义轮播图列表响应的数据结构
interface BannerListResponse {
  page: number;
  limit: number;
  totalPage: number;
  total: number;
  list: Banner[];
}

// 分页获取轮播图列表 (包含筛选条件)
export async function getBannersList(params: any): Promise<BannerListResponse> {
  const response = await request({
    url: '/admin/platform/banners/list',
    method: 'get',
    params
  }) as BannerListResponse;

  // 修复 imageUrl 中可能存在的重复前缀
  if (response && response.list) {
    const prefix = 'https://beniocean.com/';
    response.list.forEach((banner: Banner) => {
      // 使用 while 循环，确保移除所有重复的前缀
      while (banner.imageUrl && banner.imageUrl.startsWith(prefix + prefix)) {
        banner.imageUrl = banner.imageUrl.substring(prefix.length);
      }
    });
  }

  return response;
}

// 新增轮播图
export function createBanner(data: Omit<Banner, 'id'>) {
  return request({
    url: '/admin/platform/banners/create',
    method: 'post',
    data
  })
}

// 修改轮播图
export function updateBanner(data: Banner) {
  return request({
    url: '/admin/platform/banners/update',
    method: 'post',
    data
  })
}

// 删除轮播图
export function deleteBanner(id: number) {
  return request({
    url: `/admin/platform/banners/delete/${id}`,
    method: 'delete'
  })
}