import request from "@/utils/request";

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

// 文章编辑
export const updateArticle = (data: UpdateArticleRequest) => {
    return request({
        url: "/admin/platform/article/update",
        method: "post",
        data,
    });
};
