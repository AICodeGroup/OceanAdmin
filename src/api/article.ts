import request from "@/utils/request";

// 文章详情接口定义
export interface Article {
    id: number;
    author: string;
    cid: number;
    content: string;
    cover: string;
    isBanner: boolean;
    isHot: boolean;
    sort: number;
    synopsis: string;
    title: string;
    type: number;
    status?: boolean;
    createTime?: string;
    updateTime?: string;
}

// 文章列表响应结构
export interface ArticleListResponse {
    page: number;
    limit: number;
    totalPage: number;
    total: number;
    list: Article[];
}

// 文章列表接口定义
export interface ArticleRequest {
    author: string;
    cid: number;
    content: string;
    cover: string;
    id?: number;
    isBanner?: boolean;
    isHot?: boolean;
    sort?: number;
    synopsis: string;
    title: string;
    type: number;
}
export interface CreateArticleRequest extends ArticleRequest {}

export interface UpdateArticleRequest extends CreateArticleRequest {
    id: number; // 文章ID -- 新增时不传，修改时必传
}

// 删除文章
export const deleteArticle = (id: number) => {
    return request({
        url: `/admin/platform/article/delete/${id}`,
        method: "post",
    });
};
// 文章详情
export const getArticleDetail = (id: number) => {
    return request({
        url: `/admin/platform/article/info/${id}`,
        method: "get",
    });
};
// 文章分页列表
export const getArticleList = (params: any) => {
    return request({
        url: "/admin/platform/article/list",
        method: "get",
        params,
    });
};

// 文章新增
export const createArticle = (data: CreateArticleRequest) => {
    return request({
        url: "/admin/platform/article/save",
        method: "post",
        data,
    });
};

// 文章开关
export const switchArticle = (id: number) => {
    return request({
        url: `/admin/platform/article/switch/${id}`,
        method: "post",
    });
};

// 批量启用文章
export const batchEnableArticle = (ids: number[]) => {
    return request({
        url: "/admin/platform/article/batch/enable",
        method: "post",
        data: { ids },
    });
};

// 批量禁用文章
export const batchDisableArticle = (ids: number[]) => {
    return request({
        url: "/admin/platform/article/batch/disable",
        method: "post",
        data: { ids },
    });
};

// 批量删除文章
export const batchDeleteArticle = (ids: number[]) => {
    return request({
        url: "/admin/platform/article/batch/delete",
        method: "post",
        data: { ids },
    });
};

// 文章编辑
export const updateArticle = (data: UpdateArticleRequest) => {
    return request({
        url: "/admin/platform/article/update",
        method: "post",
        data,
    });
};

// ==================== 文章分类接口 ====================

// 文章分类类型定义
export interface ArticleCategory {
    id: number;
    name: string;
    icon?: string;
    sort: number;
    status: boolean;
}

// 获取文章分类列表
export const getArticleCategoryList = () => {
    return request({
        url: "/admin/platform/article/category/list",
        method: "get",
    });
};

// 新增文章分类
export const createArticleCategory = (data: {
    name: string;
    icon?: string;
    sort: number;
}) => {
    return request({
        url: "/admin/platform/article/category/add",
        method: "post",
        data,
    });
};

// 修改文章分类
export const updateArticleCategory = (data: {
    id: number;
    name: string;
    icon?: string;
    sort: number;
}) => {
    return request({
        url: "/admin/platform/article/category/update",
        method: "post",
        data,
    });
};

// 删除文章分类
export const deleteArticleCategory = (id: number) => {
    return request({
        url: `/admin/platform/article/category/delete/${id}`,
        method: "post",
    });
};

// 文章分类开关
export const switchArticleCategory = (id: number) => {
    return request({
        url: `/admin/platform/article/category/switch/${id}`,
        method: "post",
    });
};

// ==================== 文章轮播图接口 ====================

// 轮播图列表响应结构
export interface BannerListResponse {
    list: Article[];
    total: number;
    pageNum: number;
    pageSize: number;
}

// 获取轮播图列表
export const getBannerList = (params: { page: number; limit: number }) => {
    return request({
        url: "/admin/platform/article/banner/list",
        method: "get",
        params,
    });
};

// 新增轮播图
export const createBanner = (data: {
    cid: number;
    type: number;
    title: string;
    author: string;
    cover: string;
    synopsis: string;
    content: string;
    sort?: number;
}) => {
    return request({
        url: "/admin/platform/article/banner/save",
        method: "post",
        data,
    });
};

// 取消轮播图
export const cancelBanner = (id: number) => {
    return request({
        url: `/admin/platform/article/banner/cancel/${id}`,
        method: "post",
    });
};
