import request from "@/utils/request";

// 商品详情接口定义
export interface Product {
    id: number;
    productType: number; // 产品类型：1-实体商品
    name: string;
    image: string;
    sliderImage: string;
    price: number;
    otPrice: number;
    stock: number;
    sales: number;
    ficti: number;
    unitName: string;
    categoryId: number;
    brandId?: number;
    isShow: boolean;
    auditStatus: number;
    type: number;
    createTime?: string;
    updateTime?: string;
    // 详情字段
    flatPattern?: string;
    intro?: string;
    keyword?: string;
    cateId?: string;
    guaranteeIds?: string;
    vipPrice?: number;
    cost?: number;
    tempId?: number;
    sort?: number;
    specType?: boolean;
    isSub?: boolean;
    isPaidMember?: boolean;
    deliveryMethod?: string;
    refundSwitch?: boolean;
    isHot?: number;
    redeemIntegral?: number;
    content?: string;
}

// 商品列表响应结构
export interface ProductListResponse {
    pageNum: number;
    pageSize: number;
    total: number;
    list: Product[];
}

// 商品统计数据接口
export interface ProductStats {
    total: number;
    onShelf: number;
    offShelf: number;
    pending: number;
}

// 商品规格接口
export interface ProductAttr {
    attributeName: string;
    isShowImage?: boolean;
    optionList: ProductAttrOption[];
}

export interface ProductAttrOption {
    optionName: string;
    image?: string;
}

// 商品SKU接口
export interface ProductSku {
    stock: number;
    price: number;
    image: string;
    cost: number;
    otPrice: number;
    weight: number;
    volume: number;
    attrValue: string;
    barCode?: string;
    isDefault?: boolean;
}

// 创建商品请求
export interface CreateProductRequest {
    image: string;
    flatPattern?: string;
    sliderImage: string;
    name: string;
    intro: string;
    keyword?: string;
    cateId: string;
    unitName: string;
    tempId: number;
    sort?: number;
    specType: boolean;
    isPaidMember: boolean;
    isAutoUp?: boolean;
    deliveryMethod: string;
    refundSwitch?: boolean;
    systemFormId?: number;
    isHot?: number;
    redeemIntegral?: number;
    attrList?: ProductAttr[];
    attrValueList?: ProductSku[];
    content?: string;
}

// 更新商品请求
export interface UpdateProductRequest extends Partial<CreateProductRequest> {
    id: number;
}

// 商品列表查询参数
export interface ProductListParams {
    page?: number;
    limit?: number;
    name?: string;
    categoryId?: number;
    isShow?: boolean;
    auditStatus?: number;
    priceMin?: string;
    priceMax?: string;
    sortField?: string;
    sortOrder?: string;
}

// 获取商品列表
export const getProductList = (params: ProductListParams) => {
    return request({
        url: "/admin/platform/physical-product/list",
        method: "get",
        params,
    });
};

// 获取商品详情
export const getProductDetail = (id: number) => {
    return request({
        url: `/admin/platform/physical-product/detail/${id}`,
        method: "get",
    });
};

// 创建商品
export const createProduct = (data: CreateProductRequest) => {
    return request({
        url: "/admin/platform/physical-product/create",
        method: "post",
        data,
    });
};

// 更新商品
export const updateProduct = (data: UpdateProductRequest) => {
    return request({
        url: "/admin/platform/physical-product/update",
        method: "post",
        data,
    });
};

// 删除商品
export const deleteProduct = (id: number) => {
    return request({
        url: `/admin/platform/physical-product/delete/${id}`,
        method: "post",
    });
};

// 批量删除商品
export const batchDeleteProduct = (ids: number[]) => {
    return request({
        url: "/admin/platform/physical-product/batch/delete",
        method: "post",
        data: ids,
    });
};

// 上架商品
export const onShelfProduct = (id: number) => {
    return request({
        url: `/admin/platform/physical-product/on-shelf/${id}`,
        method: "post",
    });
};

// 下架商品
export const offShelfProduct = (id: number) => {
    return request({
        url: `/admin/platform/physical-product/off-shelf/${id}`,
        method: "post",
    });
};

// 批量上架商品
export const batchOnShelfProduct = (ids: number[]) => {
    return request({
        url: "/admin/platform/physical-product/batch/on-shelf",
        method: "post",
        data: ids,
    });
};

// 批量下架商品
export const batchOffShelfProduct = (ids: number[]) => {
    return request({
        url: "/admin/platform/physical-product/batch/off-shelf",
        method: "post",
        data: ids,
    });
};

// 获取商品规格列表
export const getProductAttr = (productId: number) => {
    return request({
        url: `/admin/platform/physical-product/attr/${productId}`,
        method: "get",
    });
};

// 获取商品SKU列表
export const getProductSku = (productId: number) => {
    return request({
        url: `/admin/platform/physical-product/sku/${productId}`,
        method: "get",
    });
};

// 获取商品统计
export const getProductStats = () => {
    return request({
        url: "/admin/platform/physical-product/stats",
        method: "get",
    });
};

// 快速调整SKU库存
export const quickAdjustStock = (params: {
    productId: number;
    skuId: number;
    quantity: number;
}) => {
    return request({
        url: "/admin/platform/physical-product/stock/quick-adjust",
        method: "post",
        params,
    });
};

// 批量更新商品排序
export const updateProductSort = (data: Record<string, number>) => {
    return request({
        url: "/admin/platform/physical-product/sort",
        method: "post",
        data,
    });
};

// 获取商品销售排行
export const getProductSalesRank = (params?: {
    startDate?: string;
    endDate?: string;
    orderBy?: string;
    limit?: number;
}) => {
    return request({
        url: "/admin/platform/physical-product/sales-rank",
        method: "get",
        params,
    });
};

// ===== 商户端商品分类管理接口 =====

// 分类接口响应类型
export interface ProductCategory {
    id: number;
    merId?: number;
    pid: number;
    name: string;
    icon: string;
    level: number | null;  // 1-一级，2-二级，3-三级
    sort: number;
    isShow: boolean;
    createTime?: string;
    updateTime?: string;
    childList?: ProductCategory[];  // API返回的子分类字段是childList
}

export interface ProductCategoryTreeNode {
    value: number;
    label: string;
    disabled: boolean;
    children?: ProductCategoryTreeNode[];
}

// 获取商户分类列表（树形）
export const getMerchantCategoryList = () => {
    return request({
        url: "/admin/merchant/store/product/category/cache/tree",
        method: "get",
    });
};

// 创建商户分类
export const createMerchantCategory = (data: {
    pid: number;
    name: string;
    icon?: string;
    level: number;
    sort: number;
}) => {
    return request({
        url: "/admin/merchant/store/product/category/add",
        method: "post",
        data,
    });
};

// 更新商户分类
export const updateMerchantCategory = (data: {
    id: number;
    pid: number;
    name: string;
    icon?: string;
    level: number;
    sort: number;
}) => {
    return request({
        url: "/admin/merchant/store/product/category/update",
        method: "post",
        data,
    });
};

// 删除商户分类
export const deleteMerchantCategory = (id: number) => {
    return request({
        url: `/admin/merchant/store/product/category/delete/${id}`,
        method: "post",
    });
};

// 显示/隐藏商户分类
export const toggleMerchantCategoryShow = (id: number) => {
    return request({
        url: `/admin/merchant/store/product/category/update/show/${id}`,
        method: "post",
    });
};

// 获取商户分类缓存树（用于级联选择器）
export const getMerchantCategoryCacheTree = () => {
    return request({
        url: "/admin/merchant/store/product/category/cache/tree",
        method: "get",
    });
};
