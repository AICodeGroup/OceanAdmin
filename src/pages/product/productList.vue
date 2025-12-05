<template>
    <div class="product-management-page">
        <!-- 页面标题 -->
        <div class="page-header">
            <div class="header-left">
                <el-icon class="header-icon" :size="28">
                    <ShoppingBag />
                </el-icon>
                <h1 class="page-title">商品管理</h1>
            </div>
            <div class="header-actions">
                <el-button type="primary" size="large" @click="handleAddProduct" round>
                    <el-icon class="btn-icon">
                        <Plus />
                    </el-icon>
                    新增商品
                </el-button>
                <el-button size="large" @click="handleExport" round>
                    <el-icon class="btn-icon">
                        <Download />
                    </el-icon>
                    导出数据
                </el-button>
            </div>
        </div>

        <!-- 统计卡片 -->
        <div class="stats-section">
            <el-row :gutter="20">
                <el-col :xs="24" :sm="12" :md="6">
                    <el-card shadow="never" class="stat-card">
                        <div class="stat-content">
                            <div class="stat-icon" style="background: #e8eaf6">
                                <el-icon :size="28" color="#5c6bc0"><Box /></el-icon>
                            </div>
                            <div class="stat-info">
                                <div class="stat-value">{{ stats.total }}</div>
                                <div class="stat-label">商品总数</div>
                            </div>
                        </div>
                    </el-card>
                </el-col>
                <el-col :xs="24" :sm="12" :md="6">
                    <el-card shadow="never" class="stat-card">
                        <div class="stat-content">
                            <div class="stat-icon" style="background: #e8f5e9">
                                <el-icon :size="28" color="#66bb6a"><CircleCheck /></el-icon>
                            </div>
                            <div class="stat-info">
                                <div class="stat-value">{{ stats.onShelf }}</div>
                                <div class="stat-label">已上架</div>
                            </div>
                        </div>
                    </el-card>
                </el-col>
                <el-col :xs="24" :sm="12" :md="6">
                    <el-card shadow="never" class="stat-card">
                        <div class="stat-content">
                            <div class="stat-icon" style="background: #fff3e0">
                                <el-icon :size="28" color="#ffa726"><CircleClose /></el-icon>
                            </div>
                            <div class="stat-info">
                                <div class="stat-value">{{ stats.offShelf }}</div>
                                <div class="stat-label">已下架</div>
                            </div>
                        </div>
                    </el-card>
                </el-col>
                <el-col :xs="24" :sm="12" :md="6">
                    <el-card shadow="never" class="stat-card">
                        <div class="stat-content">
                            <div class="stat-icon" style="background: #e3f2fd">
                                <el-icon :size="28" color="#42a5f5"><Clock /></el-icon>
                            </div>
                            <div class="stat-info">
                                <div class="stat-value">{{ stats.pending }}</div>
                                <div class="stat-label">待审核</div>
                            </div>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
        </div>

        <!-- 搜索筛选区域 -->
        <div class="search-section">
            <el-card class="search-card">
                <el-form :model="searchForm" label-width="80px">
                    <el-row :gutter="20">
                        <el-col :xs="24" :sm="12" :md="8" :lg="6">
                            <el-form-item label="商品名称">
                                <el-input 
                                    v-model="searchForm.name" 
                                    placeholder="搜索商品名称" 
                                    clearable
                                    size="large"
                                    @keyup.enter="handleSearch"
                                >
                                    <template #prefix>
                                        <el-icon>
                                            <Search />
                                        </el-icon>
                                    </template>
                                </el-input>
                            </el-form-item>
                        </el-col>

                        <el-col :xs="24" :sm="12" :md="8" :lg="6">
                            <el-form-item label="商品分类">
                                <el-select v-model="searchForm.categoryId" placeholder="请选择分类" clearable size="large" style="width: 100%">
                                    <el-option 
                                        v-for="item in categoryList" 
                                        :key="item.id" 
                                        :label="item.name" 
                                        :value="item.id"
                                    />
                                </el-select>
                            </el-form-item>
                        </el-col>

                        <el-col :xs="24" :sm="12" :md="8" :lg="6">
                            <el-form-item label="上架状态">
                                <el-select v-model="searchForm.isShow" placeholder="请选择状态" clearable size="large" style="width: 100%">
                                    <el-option label="已上架" :value="true">
                                        <el-icon color="#67c23a" style="vertical-align: middle; margin-right: 8px"><CircleCheck /></el-icon>
                                        <span>已上架</span>
                                    </el-option>
                                    <el-option label="已下架" :value="false">
                                        <el-icon color="#909399" style="vertical-align: middle; margin-right: 8px"><CircleClose /></el-icon>
                                        <span>已下架</span>
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>

                        <el-col :xs="24" :sm="12" :md="8" :lg="6">
                            <el-form-item label="审核状态">
                                <el-select v-model="searchForm.auditStatus" placeholder="请选择审核状态" clearable size="large" style="width: 100%">
                                    <el-option label="无需审核" :value="0" />
                                    <el-option label="待审核" :value="1" />
                                    <el-option label="审核通过" :value="2" />
                                    <el-option label="审核拒绝" :value="3" />
                                </el-select>
                            </el-form-item>
                        </el-col>

                        <el-col :xs="24" :sm="12" :md="8" :lg="6">
                            <el-form-item label="价格范围">
                                <el-input v-model="searchForm.priceMin" placeholder="最低价" clearable size="large">
                                    <template #prefix>¥</template>
                                </el-input>
                            </el-form-item>
                        </el-col>

                        <el-col :xs="24" :sm="12" :md="8" :lg="6">
                            <el-form-item label="&nbsp;">
                                <el-input v-model="searchForm.priceMax" placeholder="最高价" clearable size="large">
                                    <template #prefix>¥</template>
                                </el-input>
                            </el-form-item>
                        </el-col>

                        <el-col :xs="24" :sm="12" :md="8" :lg="6">
                            <el-form-item>
                                <el-space>
                                    <el-button size="large" @click="handleReset" round>
                                        <el-icon class="btn-icon"><RefreshLeft /></el-icon>
                                        重置
                                    </el-button>
                                    <el-button type="primary" size="large" @click="handleSearch" round>
                                        <el-icon class="btn-icon"><Search /></el-icon>
                                        搜索
                                    </el-button>
                                </el-space>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </el-card>
        </div>

        <!-- 数据表格区域 -->
        <div class="table-section">
            <el-card>
                <!-- 表格操作栏 -->
                <div class="table-actions">
                    <div class="action-left">
                        <el-button 
                            :disabled="selectedRows.length === 0" 
                            type="success"
                            size="large" 
                            @click="handleBatchOnShelf" 
                            round
                        >
                            <el-icon class="btn-icon"><Top /></el-icon>
                            批量上架
                        </el-button>
                        <el-button 
                            :disabled="selectedRows.length === 0" 
                            type="warning" 
                            size="large" 
                            @click="handleBatchOffShelf" 
                            round
                        >
                            <el-icon class="btn-icon"><Bottom /></el-icon>
                            批量下架
                        </el-button>
                        <el-button 
                            :disabled="selectedRows.length === 0" 
                            type="danger" 
                            size="large" 
                            @click="handleBatchDelete" 
                            round
                        >
                            <el-icon class="btn-icon"><Delete /></el-icon>
                            批量删除
                        </el-button>
                    </div>

                    <div class="action-right">
                        <el-button text size="large" @click="handleRefresh" round>
                            <el-icon class="btn-icon"><Refresh /></el-icon>
                            刷新
                        </el-button>
                        <el-button text size="large">
                            <el-icon class="btn-icon"><Setting /></el-icon>
                            列设置
                        </el-button>
                    </div>
                </div>

                <!-- 商品数据表格 -->
                <el-table 
                    v-loading="loading" 
                    :data="productList" 
                    @selection-change="handleSelectionChange" 
                    style="width: 100%"
                >
                    <el-table-column type="selection" width="55" />

                    <!-- 商品信息列 -->
                    <el-table-column label="商品信息" min-width="300">
                        <template #default="{ row }">
                            <div class="product-info-cell">
                                <el-image :src="row.image" class="product-image" fit="cover">
                                    <template #error>
                                        <div class="image-slot">
                                            <el-icon>
                                                <Picture />
                                            </el-icon>
                                        </div>
                                    </template>
                                </el-image>
                                <div class="product-details">
                                    <div class="product-name">{{ row.name }}</div>
                                    <div class="product-id">ID: {{ row.id }}</div>
                                    <div class="product-meta">
                                        <el-tag v-if="row.isHot === 1" size="small" type="danger">热门</el-tag>
                                        <span class="unit">单位: {{ row.unitName }}</span>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </el-table-column>

                    <!-- 价格列 -->
                    <el-table-column label="价格" width="120" align="center">
                        <template #default="{ row }">
                            <div class="price-cell">
                                <div class="current-price">¥{{ row.price }}</div>
                                <div class="original-price">¥{{ row.otPrice }}</div>
                            </div>
                        </template>
                    </el-table-column>

                    <!-- 库存列 -->
                    <el-table-column label="库存" prop="stock" width="100" align="center">
                        <template #default="{ row }">
                            <el-tag :type="row.stock > 50 ? 'success' : row.stock > 10 ? 'warning' : 'danger'">
                                {{ row.stock }}
                            </el-tag>
                        </template>
                    </el-table-column>

                    <!-- 销量列 -->
                    <el-table-column label="销量" width="100" align="center">
                        <template #default="{ row }">
                            <div class="sales-cell">
                                <div>{{ row.sales + row.ficti }}</div>
                                <div class="sales-tip">(真实: {{ row.sales }})</div>
                            </div>
                        </template>
                    </el-table-column>

                    <!-- 上架状态列 -->
                    <el-table-column label="上架状态" width="100" align="center">
                        <template #default="{ row }">
                            <el-tag :type="row.isShow ? 'success' : 'info'">
                                {{ row.isShow ? '已上架' : '已下架' }}
                            </el-tag>
                        </template>
                    </el-table-column>

                    <!-- 审核状态列 -->
                    <el-table-column label="审核状态" width="100" align="center">
                        <template #default="{ row }">
                            <el-tag :type="getAuditStatusType(row.auditStatus)">
                                {{ getAuditStatusText(row.auditStatus) }}
                            </el-tag>
                        </template>
                    </el-table-column>

                    <!-- 创建时间列 -->
                    <el-table-column label="创建时间" width="160" prop="createTime">
                        <template #default="{ row }">
                            <div v-if="row.createTime">
                                {{ formatTime(row.createTime) }}
                            </div>
                            <span v-else class="text-muted">-</span>
                        </template>
                    </el-table-column>

                    <!-- 操作列 -->
                    <el-table-column label="操作" width="280" fixed="right">
                        <template #default="{ row }">
                            <div class="action-buttons">
                                <el-button size="small" text type="primary" @click="handleEdit(row)">
                                    <el-icon><Edit /></el-icon>
                                    编辑
                                </el-button>
                                <el-button size="small" text type="info" @click="handleView(row)">
                                    <el-icon><View /></el-icon>
                                    查看
                                </el-button>
                                <el-button 
                                    size="small" 
                                    text 
                                    :type="row.isShow ? 'warning' : 'success'" 
                                    @click="handleToggleShelf(row)"
                                >
                                    <el-icon v-if="row.isShow"><Bottom /></el-icon>
                                    <el-icon v-else><Top /></el-icon>
                                    {{ row.isShow ? '下架' : '上架' }}
                                </el-button>
                                <el-button size="small" text type="danger" @click="handleDelete(row)">
                                    <el-icon><Delete /></el-icon>
                                    删除
                                </el-button>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>

                <!-- 分页控制 -->
                <div class="pagination-section">
                    <el-pagination 
                        v-model:current-page="pagination.current" 
                        v-model:page-size="pagination.size" 
                        :page-sizes="[10, 20, 50, 100]" 
                        :total="pagination.total" 
                        layout="total, sizes, prev, pager, next, jumper" 
                        @size-change="handleSizeChange" 
                        @current-change="handleCurrentChange" 
                    />
                </div>
            </el-card>
        </div>

        <!-- 查看商品详情弹窗 -->
        <el-dialog v-model="viewDialogVisible" title="商品详情" width="900px" destroy-on-close>
            <el-descriptions :column="2" border v-if="currentProduct">
                <el-descriptions-item label="商品ID">{{ currentProduct.id }}</el-descriptions-item>
                <el-descriptions-item label="商品名称">{{ currentProduct.name }}</el-descriptions-item>
                <el-descriptions-item label="商品价格">¥{{ currentProduct.price }}</el-descriptions-item>
                <el-descriptions-item label="市场价">¥{{ currentProduct.otPrice }}</el-descriptions-item>
                <el-descriptions-item label="库存">{{ currentProduct.stock }}</el-descriptions-item>
                <el-descriptions-item label="销量">{{ currentProduct.sales }}</el-descriptions-item>
                <el-descriptions-item label="单位">{{ currentProduct.unitName }}</el-descriptions-item>
                <el-descriptions-item label="是否上架">
                    <el-tag :type="currentProduct.isShow ? 'success' : 'info'">
                        {{ currentProduct.isShow ? '已上架' : '已下架' }}
                    </el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="审核状态">
                    <el-tag :type="getAuditStatusType(currentProduct.auditStatus)">
                        {{ getAuditStatusText(currentProduct.auditStatus) }}
                    </el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="创建时间">
                    {{ currentProduct.createTime ? formatTime(currentProduct.createTime) : '-' }}
                </el-descriptions-item>
                <el-descriptions-item label="商品主图" :span="2">
                    <el-image 
                        :src="currentProduct.image" 
                        style="width: 200px; height: 200px; border-radius: 4px;" 
                        fit="cover" 
                        :preview-src-list="[currentProduct.image]" 
                        preview-teleported
                    >
                        <template #error>
                            <div class="image-slot" style="width: 200px; height: 200px;">
                                <el-icon><Picture /></el-icon>
                            </div>
                        </template>
                    </el-image>
                </el-descriptions-item>
            </el-descriptions>

            <template #footer>
                <el-button @click="viewDialogVisible = false">关闭</el-button>
                <el-button type="primary" @click="handleEditFromView">编辑</el-button>
            </template>
        </el-dialog>

        <!-- 新增/编辑商品弹窗 -->
        <el-dialog
            v-model="editDialogVisible"
            :title="editForm.id ? '编辑商品' : '新增商品'"
            width="900px"
            :close-on-click-modal="false"
        >
            <el-form
                ref="editFormRef"
                :model="editForm"
                :rules="editFormRules"
                label-width="120px"
            >
                <el-tabs v-model="activeTab">
                    <!-- 基本信息 -->
                    <el-tab-pane label="基本信息" name="basic">
                        <el-form-item label="商品名称" prop="name">
                            <el-input v-model="editForm.name" placeholder="请输入商品名称" maxlength="50" show-word-limit />
                        </el-form-item>

                        <el-form-item label="商品简介" prop="intro">
                            <el-input
                                v-model="editForm.intro"
                                type="textarea"
                                :rows="3"
                                placeholder="请输入商品简介"
                                maxlength="100"
                                show-word-limit
                            />
                        </el-form-item>

                        <el-form-item label="商品主图" prop="image">
                            <el-input v-model="editForm.image" placeholder="请输入商品主图URL" />
                            <div class="form-tip">建议尺寸：800x800px</div>
                        </el-form-item>

                        <el-form-item label="商品轮播图" prop="sliderImage">
                            <el-input v-model="editForm.sliderImage" placeholder="请输入轮播图URLs，多个用逗号分隔" />
                            <div class="form-tip">多张图片URL用英文逗号分隔</div>
                        </el-form-item>

                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="商品分类" prop="cateId">
                                    <el-select v-model="editForm.cateId" placeholder="请选择分类" style="width: 100%" clearable>
                                        <el-option
                                            v-for="cat in categoryList"
                                            :key="cat.id"
                                            :label="cat.name"
                                            :value="cat.id.toString()"
                                        />
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="商品单位" prop="unitName">
                                    <el-input v-model="editForm.unitName" placeholder="如：件、个、盒" maxlength="32" />
                                </el-form-item>
                            </el-col>
                        </el-row>

                        <el-row :gutter="20">
                            <el-col :span="8">
                                <el-form-item label="商品价格" prop="price">
                                    <el-input-number v-model="editForm.price" :min="0" :precision="2" :step="1" style="width: 100%" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="市场价" prop="otPrice">
                                    <el-input-number v-model="editForm.otPrice" :min="0" :precision="2" :step="1" style="width: 100%" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="成本价" prop="cost">
                                    <el-input-number v-model="editForm.cost" :min="0" :precision="2" :step="1" style="width: 100%" />
                                </el-form-item>
                            </el-col>
                        </el-row>

                        <el-row :gutter="20">
                            <el-col :span="8">
                                <el-form-item label="库存" prop="stock">
                                    <el-input-number v-model="editForm.stock" :min="0" :step="1" style="width: 100%" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="虚拟销量" prop="ficti">
                                    <el-input-number v-model="editForm.ficti" :min="0" :step="1" style="width: 100%" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="排序" prop="sort">
                                    <el-input-number v-model="editForm.sort" :min="0" :step="1" style="width: 100%" />
                                </el-form-item>
                            </el-col>
                        </el-row>

                        <el-form-item label="关键词">
                            <el-input v-model="editForm.keyword" placeholder="多个关键词用逗号分隔" />
                        </el-form-item>
                    </el-tab-pane>

                    <!-- 商品设置 -->
                    <el-tab-pane label="商品设置" name="settings">
                        <el-form-item label="规格类型">
                            <el-radio-group v-model="editForm.specType">
                                <el-radio :label="false">单规格</el-radio>
                                <el-radio :label="true">多规格</el-radio>
                            </el-radio-group>
                            <div class="form-tip">多规格商品需要在保存后设置SKU信息</div>
                        </el-form-item>

                        <el-form-item label="配送方式">
                            <el-checkbox-group v-model="deliveryMethods">
                                <el-checkbox label="1">商家配送</el-checkbox>
                                <el-checkbox label="2">到店核销</el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>

                        <el-form-item label="是否支持退款">
                            <el-switch v-model="editForm.refundSwitch" />
                        </el-form-item>

                        <el-form-item label="付费会员商品">
                            <el-switch v-model="editForm.isPaidMember" />
                        </el-form-item>

                        <el-form-item label="热门推荐">
                            <el-radio-group v-model="editForm.isHot">
                                <el-radio :label="0">否</el-radio>
                                <el-radio :label="1">是</el-radio>
                            </el-radio-group>
                        </el-form-item>

                        <el-form-item label="兑换积分">
                            <el-input-number v-model="editForm.redeemIntegral" :min="0" :step="1" style="width: 100%" />
                        </el-form-item>

                        <el-form-item label="自动上架">
                            <el-switch v-model="editForm.isAutoUp" />
                        </el-form-item>
                    </el-tab-pane>

                    <!-- 商品规格 -->
                    <el-tab-pane label="商品规格" name="specs" v-if="editForm.specType">
                        <el-alert
                            title="多规格商品需要配置规格信息和SKU信息"
                            type="info"
                            :closable="false"
                            style="margin-bottom: 20px"
                        />

                        <!-- 规格列表 -->
                        <div class="spec-section" style="margin-top: 20px;">
                            <div class="section-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding: 8px 16px; background: #f5f7fa; border-radius: 8px;">
                                <span class="section-title" style="font-size: 16px; font-weight: 600; color: #303133;">商品规格</span>
                                <el-button type="primary" size="small" @click="handleAddSpec">
                                    <el-icon><Plus /></el-icon>
                                    添加规格
                                </el-button>
                            </div>

                            <div v-for="(spec, specIndex) in specList" :key="specIndex" class="spec-item" style="margin-bottom: 24px;">
                                <el-card shadow="never" style="background: #fafafa; border: 1px solid #e4e7ed;">
                                    <div class="spec-header">
                                        <el-input
                                            v-model="spec.attributeName"
                                            placeholder="请输入规格名称，如：颜色、尺码"
                                            style="width: 200px; margin-right: 10px"
                                        />
                                        <el-checkbox v-model="spec.isShowImage">显示规格图片</el-checkbox>
                                        <el-button
                                            type="danger"
                                            text
                                            @click="handleRemoveSpec(specIndex)"
                                            style="margin-left: auto"
                                        >
                                            <el-icon><Delete /></el-icon>
                                            删除规格
                                        </el-button>
                                    </div>

                                    <div class="spec-options">
                                        <div class="option-label">规格选项：</div>
                                        <div class="option-list">
                                            <el-tag
                                                v-for="(option, optIndex) in spec.optionList"
                                                :key="optIndex"
                                                closable
                                                @close="handleRemoveOption(specIndex, optIndex)"
                                            >
                                                {{ option.optionName }}
                                            </el-tag>
                                            <div style="margin-left: 40px; display: flex; align-items: center; padding-left: 20px; border-left: 2px solid #e4e7ed;">
                                                <el-input
                                                    v-if="spec.showInput"
                                                    v-model="spec.inputValue"
                                                    size="small"
                                                    style="width: 100px"
                                                    @keyup.enter="handleAddOption(specIndex)"
                                                    @blur="handleAddOption(specIndex)"
                                                    placeholder="输入选项"
                                                />
                                                <el-button
                                                    v-else
                                                    size="small"
                                                    @click="showOptionInput(specIndex)"
                                                >
                                                    <el-icon><Plus /></el-icon>
                                                    添加选项
                                                </el-button>
                                            </div>
                                        </div>
                                    </div>
                                </el-card>
                            </div>
                        </div>

                        <!-- SKU列表 -->
                        <div class="sku-section" v-if="specList.length > 0" style="margin-top: 32px;">
                            <div class="section-header" style="display: flex; justify-content: space-between; align-items: center; margin: 16px 0 20px 0; padding: 8px 16px; background: #f5f7fa; border-radius: 8px;">
                                <span class="section-title" style="font-size: 16px; font-weight: 600; color: #303133;">SKU信息</span>
                                <el-button type="primary" size="small" @click="generateSkuList">
                                    <el-icon><Refresh /></el-icon>
                                    生成SKU
                                </el-button>
                            </div>

                            <el-table :data="skuList" border style="width: 100%; margin-top: 10px">
                                <el-table-column label="规格" min-width="150">
                                    <template #default="{ row }">
                                        {{ row.specText }}
                                    </template>
                                </el-table-column>
                                <el-table-column label="价格" width="120">
                                    <template #default="{ row }">
                                        <el-input-number v-model="row.price" :min="0" :precision="2" size="small" />
                                    </template>
                                </el-table-column>
                                <el-table-column label="市场价" width="120">
                                    <template #default="{ row }">
                                        <el-input-number v-model="row.otPrice" :min="0" :precision="2" size="small" />
                                    </template>
                                </el-table-column>
                                <el-table-column label="成本价" width="120">
                                    <template #default="{ row }">
                                        <el-input-number v-model="row.cost" :min="0" :precision="2" size="small" />
                                    </template>
                                </el-table-column>
                                <el-table-column label="库存" width="100">
                                    <template #default="{ row }">
                                        <el-input-number v-model="row.stock" :min="0" size="small" />
                                    </template>
                                </el-table-column>
                                <el-table-column label="重量(kg)" width="120">
                                    <template #default="{ row }">
                                        <el-input-number v-model="row.weight" :min="0" :precision="2" size="small" />
                                    </template>
                                </el-table-column>
                                <el-table-column label="体积(m³)" width="120">
                                    <template #default="{ row }">
                                        <el-input-number v-model="row.volume" :min="0" :precision="2" size="small" />
                                    </template>
                                </el-table-column>
                                <el-table-column label="条码" width="150">
                                    <template #default="{ row }">
                                        <el-input v-model="row.barCode" size="small" placeholder="商品条码" />
                                    </template>
                                </el-table-column>
                                <el-table-column label="图片URL" min-width="200">
                                    <template #default="{ row }">
                                        <el-input v-model="row.image" size="small" placeholder="SKU图片URL" />
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </el-tab-pane>

                    <!-- 商品详情 -->
                    <el-tab-pane label="商品详情" name="content">
                        <el-form-item label="详情内容">
                            <el-input
                                v-model="editForm.content"
                                type="textarea"
                                :rows="10"
                                placeholder="请输入商品详情HTML内容，支持富文本"
                            />
                            <div class="form-tip">支持HTML格式，建议使用富文本编辑器生成</div>
                        </el-form-item>
                    </el-tab-pane>
                </el-tabs>
            </el-form>

            <template #footer>
                <el-button @click="editDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="handleSaveProduct" :loading="saving">保存</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import dayjs from 'dayjs';

// 图标引入
import {
    Search, Plus, Download, Delete, Refresh, Setting, Edit, View, Picture,
    RefreshLeft, CircleCheck, CircleClose, ShoppingBag, Top, Bottom, Box, Clock
} from '@element-plus/icons-vue';

// API导入
import {
    getProductList,
    deleteProduct,
    onShelfProduct,
    offShelfProduct,
    batchOnShelfProduct,
    batchOffShelfProduct,
    batchDeleteProduct,
    getProductStats,
    getProductDetail,
    getProductCategoryList,
    createProduct,
    updateProduct,
    Product,
    ProductListResponse,
    ProductStats,
    ProductCategory
} from '@/api/product';

// 类型定义
interface SearchForm {
    name: string;
    categoryId: number | string;
    isShow: boolean | string;
    auditStatus: number | string;
    priceMin: string;
    priceMax: string;
}

interface Pagination {
    current: number;
    size: number;
    total: number;
}

// 响应式数据
const loading = ref(false);
const productList = ref<Product[]>([]);
const selectedRows = ref<Product[]>([]);
const categoryList = ref<ProductCategory[]>([]);
const viewDialogVisible = ref(false);
const currentProduct = ref<Product | null>(null);
const editDialogVisible = ref(false);
const editFormRef = ref();
const saving = ref(false);
const activeTab = ref('basic');
const deliveryMethods = ref<string[]>(['1']);

// 规格和SKU数据
const specList = ref<any[]>([]);
const skuList = ref<any[]>([]);

// 编辑表单数据
const editForm = reactive<any>({
    id: undefined,
    name: '',
    intro: '',
    image: '',
    sliderImage: '',
    cateId: '',
    unitName: '件',
    price: 0,
    otPrice: 0,
    cost: 0,
    stock: 0,
    ficti: 0,
    sort: 0,
    keyword: '',
    tempId: 0,
    specType: false,
    refundSwitch: false,
    isPaidMember: false,
    isHot: 0,
    redeemIntegral: 0,
    isAutoUp: false,
    content: ''
});

// 表单验证规则
const editFormRules = {
    name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
    intro: [{ required: true, message: '请输入商品简介', trigger: 'blur' }],
    image: [{ required: true, message: '请输入商品主图', trigger: 'blur' }],
    sliderImage: [{ required: true, message: '请输入轮播图', trigger: 'blur' }],
    cateId: [{ required: true, message: '请选择商品分类', trigger: 'change' }],
    unitName: [{ required: true, message: '请输入商品单位', trigger: 'blur' }]
};

const stats = reactive<ProductStats>({
    total: 0,
    onShelf: 0,
    offShelf: 0,
    pending: 0
});

const searchForm = reactive<SearchForm>({
    name: '',
    categoryId: '',
    isShow: '',
    auditStatus: '',
    priceMin: '',
    priceMax: ''
});

const pagination = reactive<Pagination>({
    current: 1,
    size: 20,
    total: 0
});

// 生命周期
onMounted(() => {
    loadProductList();
    loadStats();
    loadCategoryList();
});

// 加载商品列表
const loadProductList = async () => {
    loading.value = true;
    try {
        const params = {
            page: pagination.current,
            limit: pagination.size,
            name: searchForm.name || undefined,
            categoryId: searchForm.categoryId !== '' ? Number(searchForm.categoryId) : undefined,
            isShow: searchForm.isShow !== '' ? Boolean(searchForm.isShow) : undefined,
            auditStatus: searchForm.auditStatus !== '' ? Number(searchForm.auditStatus) : undefined,
            priceMin: searchForm.priceMin || undefined,
            priceMax: searchForm.priceMax || undefined,
        };

        const response = await getProductList(params) as unknown as ProductListResponse;
        productList.value = response.list || [];
        pagination.total = response.total || 0;
    } catch (error) {
        console.error('加载商品列表失败:', error);
        ElMessage.error('加载商品列表失败');
    } finally {
        loading.value = false;
    }
};

// 加载统计数据
const loadStats = async () => {
    try {
        const response = await getProductStats() as unknown as ProductStats;
        Object.assign(stats, response);
    } catch (error) {
        console.error('加载统计数据失败:', error);
    }
};

// 加载分类列表
const loadCategoryList = async () => {
    try {
        const response = await getProductCategoryList() as unknown as ProductCategory[];
        categoryList.value = flattenCategories(response);
    } catch (error) {
        console.error('加载分类列表失败:', error);
    }
};

// 扁平化分类树
const flattenCategories = (categories: ProductCategory[]): ProductCategory[] => {
    const result: ProductCategory[] = [];
    const flatten = (items: ProductCategory[]) => {
        items.forEach(item => {
            result.push(item);
            if (item.children && item.children.length > 0) {
                flatten(item.children);
            }
        });
    };
    flatten(categories);
    return result;
};

// 搜索
const handleSearch = () => {
    pagination.current = 1;
    loadProductList();
};

// 重置搜索
const handleReset = () => {
    Object.assign(searchForm, {
        name: '',
        categoryId: '',
        isShow: '',
        auditStatus: '',
        priceMin: '',
        priceMax: ''
    });
    handleSearch();
};

// 刷新
const handleRefresh = () => {
    loadProductList();
    loadStats();
};

// 分页变化
const handleSizeChange = () => {
    pagination.current = 1;
    loadProductList();
};

const handleCurrentChange = () => {
    loadProductList();
};

// 表格选择变化
const handleSelectionChange = (rows: Product[]) => {
    selectedRows.value = rows;
};

// 新增商品
const handleAddProduct = () => {
    // 重置表单
    Object.assign(editForm, {
        id: undefined,
        name: '',
        intro: '',
        image: '',
        sliderImage: '',
        cateId: '',
        unitName: '件',
        price: 0,
        otPrice: 0,
        cost: 0,
        stock: 0,
        ficti: 0,
        sort: 0,
        keyword: '',
        tempId: 0,
        specType: false,
        refundSwitch: false,
        isPaidMember: false,
        isHot: 0,
        redeemIntegral: 0,
        isAutoUp: false,
        content: ''
    });
    deliveryMethods.value = ['1'];
    specList.value = [];
    skuList.value = [];
    activeTab.value = 'basic';
    editDialogVisible.value = true;
};

// 编辑商品
const handleEdit = async (row: Product) => {
    try {
        const detail = await getProductDetail(row.id) as unknown as any;
        Object.assign(editForm, {
            id: detail.id,
            name: detail.name,
            intro: detail.intro,
            image: detail.image,
            sliderImage: detail.sliderImage,
            cateId: detail.cateId,
            unitName: detail.unitName,
            price: detail.price,
            otPrice: detail.otPrice,
            cost: detail.cost,
            stock: detail.stock,
            ficti: detail.ficti,
            sort: detail.sort,
            keyword: detail.keyword,
            tempId: detail.tempId,
            specType: detail.specType,
            refundSwitch: detail.refundSwitch,
            isPaidMember: detail.isPaidMember,
            isHot: detail.isHot,
            redeemIntegral: detail.redeemIntegral,
            content: detail.content || ''
        });
        deliveryMethods.value = detail.deliveryMethod ? detail.deliveryMethod.split(',') : ['1'];
        activeTab.value = 'basic';
        editDialogVisible.value = true;
    } catch (error) {
        console.error('获取商品详情失败:', error);
        ElMessage.error('获取商品详情失败');
    }
};

// 添加规格
const handleAddSpec = () => {
    specList.value.push({
        attributeName: '',
        isShowImage: false,
        optionList: [],
        showInput: false,
        inputValue: ''
    });
};

// 删除规格
const handleRemoveSpec = (index: number) => {
    specList.value.splice(index, 1);
    // 重新生成SKU
    if (specList.value.length > 0) {
        generateSkuList();
    } else {
        skuList.value = [];
    }
};

// 显示选项输入框
const showOptionInput = (specIndex: number) => {
    specList.value[specIndex].showInput = true;
};

// 添加选项
const handleAddOption = (specIndex: number) => {
    const spec = specList.value[specIndex];
    if (spec.inputValue && spec.inputValue.trim()) {
        spec.optionList.push({
            optionName: spec.inputValue.trim(),
            image: ''
        });
        spec.inputValue = '';
        // 保持输入框显示，支持连续添加多个选项
    } else if (!spec.inputValue || !spec.inputValue.trim()) {
        // 只有在失焦且内容为空时才隐藏输入框
        spec.showInput = false;
    }
};

// 删除选项
const handleRemoveOption = (specIndex: number, optIndex: number) => {
    specList.value[specIndex].optionList.splice(optIndex, 1);
};

// 生成SKU列表
const generateSkuList = () => {
    // 过滤掉没有选项的规格
    const validSpecs = specList.value.filter(spec => 
        spec.attributeName && spec.optionList.length > 0
    );
    
    if (validSpecs.length === 0) {
        skuList.value = [];
        ElMessage.warning('请先添加规格和选项');
        return;
    }
    
    // 生成笛卡尔积（所有可能的组合）
    const combinations: any[] = [];
    
    const generate = (current: any[], specIndex: number) => {
        if (specIndex === validSpecs.length) {
            combinations.push([...current]);
            return;
        }
        
        const spec = validSpecs[specIndex];
        for (const option of spec.optionList) {
            current.push({
                specName: spec.attributeName,
                optionName: option.optionName
            });
            generate(current, specIndex + 1);
            current.pop();
        }
    };
    
    generate([], 0);
    
    // 生成SKU列表
    skuList.value = combinations.map(combo => {
        // 生成attrValue JSON字符串
        const attrValue: any = {};
        let specText = '';
        
        combo.forEach((item: any, index: number) => {
            attrValue[item.specName] = item.optionName;
            specText += (index > 0 ? ' / ' : '') + item.optionName;
        });
        
        return {
            specText,
            attrValue: JSON.stringify(attrValue),
            price: editForm.price || 0,
            otPrice: editForm.otPrice || 0,
            cost: editForm.cost || 0,
            stock: 0,
            weight: 0,
            volume: 0,
            barCode: '',
            image: editForm.image || ''
        };
    });
    
    ElMessage.success(`生成了 ${skuList.value.length} 个SKU`);
};

// 保存商品
const handleSaveProduct = async () => {
    if (!editFormRef.value) return;
    
    try {
        await editFormRef.value.validate();
        
        // 如果是多规格商品，验证规格和SKU
        if (editForm.specType) {
            if (specList.value.length === 0 || skuList.value.length === 0) {
                ElMessage.warning('多规格商品需要配置规格信息和SKU信息');
                activeTab.value = 'specs';
                return;
            }
        }
        
        saving.value = true;
        
        const formData: any = {
            ...editForm,
            deliveryMethod: deliveryMethods.value.join(',')
        };
        
        // 如果是多规格，添加规格和SKU数据
        if (editForm.specType) {
            formData.attrList = specList.value.filter(spec => 
                spec.attributeName && spec.optionList.length > 0
            ).map(spec => ({
                attributeName: spec.attributeName,
                isShowImage: spec.isShowImage,
                optionList: spec.optionList
            }));
            
            formData.attrValueList = skuList.value.map(sku => ({
                stock: sku.stock,
                price: sku.price,
                image: sku.image,
                cost: sku.cost,
                otPrice: sku.otPrice,
                weight: sku.weight,
                volume: sku.volume,
                attrValue: sku.attrValue,
                barCode: sku.barCode,
                isDefault: false
            }));
            
            // 设置第一个SKU为默认
            if (formData.attrValueList.length > 0) {
                formData.attrValueList[0].isDefault = true;
            }
        }
        
        if (editForm.id) {
            // 编辑
            await updateProduct(formData);
            ElMessage.success('商品更新成功');
        } else {
            // 新增
            await createProduct(formData);
            ElMessage.success('商品创建成功');
        }
        
        editDialogVisible.value = false;
        loadProductList();
        loadStats();
    } catch (error: any) {
        if (error !== 'cancel') {
            console.error('保存商品失败:', error);
            ElMessage.error(error.message || '保存商品失败');
        }
    } finally {
        saving.value = false;
    }
};

// 查看商品
const handleView = async (row: Product) => {
    try {
        const response = await getProductDetail(row.id) as unknown as Product;
        currentProduct.value = response;
        viewDialogVisible.value = true;
    } catch (error) {
        console.error('获取商品详情失败:', error);
        ElMessage.error('获取商品详情失败');
    }
};

// 删除商品
const handleDelete = async (row: Product) => {
    try {
        await ElMessageBox.confirm(
            `确定要删除商品"${row.name}"吗？此操作不可恢复。`,
            '删除确认',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }
        );

        await deleteProduct(row.id);
        ElMessage.success('删除成功');
        loadProductList();
        loadStats();
    } catch (error: any) {
        if (error !== 'cancel') {
            console.error('删除商品失败:', error);
            ElMessage.error('删除商品失败');
        }
    }
};

// 从查看详情跳转到编辑
const handleEditFromView = () => {
    if (currentProduct.value) {
        viewDialogVisible.value = false;
        handleEdit(currentProduct.value);
    }
};

// 切换上下架
const handleToggleShelf = async (row: Product) => {
    try {
        if (row.isShow) {
            await offShelfProduct(row.id);
            ElMessage.success('商品已下架');
        } else {
            await onShelfProduct(row.id);
            ElMessage.success('商品已上架');
        }
        loadProductList();
        loadStats();
    } catch (error) {
        console.error('操作失败:', error);
        ElMessage.error('操作失败');
    }
};

// 批量上架
const handleBatchOnShelf = async () => {
    try {
        await ElMessageBox.confirm(
            `确定要上架选中的 ${selectedRows.value.length} 个商品吗？`,
            '批量上架',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }
        );

        const ids = selectedRows.value.map(item => item.id);
        await batchOnShelfProduct(ids);
        ElMessage.success('批量上架成功');
        loadProductList();
        loadStats();
    } catch (error: any) {
        if (error !== 'cancel') {
            console.error('批量上架失败:', error);
            ElMessage.error('批量上架失败');
        }
    }
};

// 批量下架
const handleBatchOffShelf = async () => {
    try {
        await ElMessageBox.confirm(
            `确定要下架选中的 ${selectedRows.value.length} 个商品吗？`,
            '批量下架',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }
        );

        const ids = selectedRows.value.map(item => item.id);
        await batchOffShelfProduct(ids);
        ElMessage.success('批量下架成功');
        loadProductList();
        loadStats();
    } catch (error: any) {
        if (error !== 'cancel') {
            console.error('批量下架失败:', error);
            ElMessage.error('批量下架失败');
        }
    }
};

// 批量删除
const handleBatchDelete = async () => {
    try {
        await ElMessageBox.confirm(
            `确定要删除选中的 ${selectedRows.value.length} 个商品吗？此操作不可恢复。`,
            '批量删除',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }
        );

        const ids = selectedRows.value.map(item => item.id);
        await batchDeleteProduct(ids);
        ElMessage.success('批量删除成功');
        loadProductList();
        loadStats();
    } catch (error: any) {
        if (error !== 'cancel') {
            console.error('批量删除失败:', error);
            ElMessage.error('批量删除失败');
        }
    }
};

// 导出数据
const handleExport = () => {
    ElMessage.info('导出功能开发中...');
};

// 格式化时间
const formatTime = (time: string) => {
    return dayjs(time).format('YYYY-MM-DD HH:mm:ss');
};

// 获取审核状态类型
const getAuditStatusType = (status: number) => {
    const typeMap: Record<number, string> = {
        0: 'info',
        1: 'warning',
        2: 'success',
        3: 'danger'
    };
    return typeMap[status] || 'info';
};

// 获取审核状态文本
const getAuditStatusText = (status: number) => {
    const textMap: Record<number, string> = {
        0: '无需审核',
        1: '待审核',
        2: '审核通过',
        3: '审核拒绝'
    };
    return textMap[status] || '未知';
};
</script>

<style scoped lang="scss">
.product-management-page {
    padding: 12px;
    background-color: #f5f7fa;
    min-height: 100vh;
}

// 页面标题
.page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    padding: 12px 20px;
    background: #f5f7fa;
    border-radius: 12px;
    border: 1px solid #e4e7ed;

    .header-left {
        display: flex;
        align-items: center;
        gap: 12px;

        .header-icon {
            color: #606266;
            font-size: 20px;
        }

        .page-title {
            font-size: 20px;
            font-weight: 700;
            color: #303133;
            margin: 0;
        }
    }

    .header-actions {
        display: flex;
        gap: 12px;

        .btn-icon {
            margin-right: 4px;
        }
    }
}

// 统计卡片
.stats-section {
    margin-bottom: 20px;

    .stat-card {
        border-radius: 8px;
        transition: all 0.3s;
        cursor: pointer;
        border: 1px solid #e4e7ed;
        background: #ffffff;

        :deep(.el-card__body) {
            padding: 16px;
        }

        &:hover {
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
            border-color: #d0d4db;
        }

        .stat-content {
            display: flex;
            align-items: center;
            gap: 16px;

            .stat-icon {
                width: 56px;
                height: 56px;
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .stat-info {
                flex: 1;

                .stat-value {
                    font-size: 24px;
                    font-weight: 600;
                    color: #303133;
                    margin-bottom: 4px;
                }

                .stat-label {
                    font-size: 13px;
                    color: #909399;
                }
            }
        }
    }
}

// 搜索区域
.search-section {
    margin-bottom: 20px;

    .search-card {
        border-radius: 8px;
        border: 1px solid #e4e7ed;
        box-shadow: none;
    }

    .btn-icon {
        margin-right: 4px;
    }
}

// 表格区域
.table-section {
    .el-card {
        border-radius: 8px;
        border: 1px solid #e4e7ed;
        box-shadow: none;
    }

    .table-actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;

        .action-left,
        .action-right {
            display: flex;
            gap: 8px;
        }

        .btn-icon {
            margin-right: 4px;
        }
    }

    .product-info-cell {
        display: flex;
        gap: 12px;
        align-items: center;

        .product-image {
            width: 80px;
            height: 80px;
            border-radius: 8px;
            flex-shrink: 0;
        }

        .product-details {
            flex: 1;
            min-width: 0;

            .product-name {
                font-size: 14px;
                font-weight: 500;
                color: #303133;
                margin-bottom: 4px;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                line-clamp: 2;
                -webkit-box-orient: vertical;
            }

            .product-id {
                font-size: 12px;
                color: #909399;
                margin-bottom: 4px;
            }

            .product-meta {
                display: flex;
                gap: 8px;
                align-items: center;

                .unit {
                    font-size: 12px;
                    color: #909399;
                }
            }
        }
    }

    .price-cell {
        .current-price {
            font-size: 16px;
            font-weight: 600;
            color: #f56c6c;
        }

        .original-price {
            font-size: 12px;
            color: #909399;
            text-decoration: line-through;
        }
    }

    .sales-cell {
        .sales-tip {
            font-size: 12px;
            color: #909399;
        }
    }

    .action-buttons {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
    }

    .image-slot {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        background-color: #f5f7fa;
        color: #909399;
    }

    .pagination-section {
        display: flex;
        justify-content: flex-end;
        margin-top: 20px;
    }

    .form-tip {
        font-size: 12px;
        color: #909399;
        margin-top: 4px;
        line-height: 1.5;
    }

    // 规格和SKU样式
    .spec-section,
    .sku-section {
        margin-bottom: 24px;

        .section-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;
            padding: 0 12px 12px 12px;
            border-bottom: 2px solid #e4e7ed;
            gap: 20px;

            .section-title {
                font-size: 16px;
                font-weight: 600;
                color: #303133;
                flex: 1;
            }
        }

        .spec-item {
            margin-bottom: 16px;

            :deep(.el-card__body) {
                padding: 20px;
            }

            .spec-header {
                display: flex;
                align-items: center;
                gap: 16px;
                margin-bottom: 20px;
                padding-bottom: 16px;
                border-bottom: 1px solid #e4e7ed;
            }

            .spec-options {
                display: flex;
                gap: 16px;
                margin-top: 8px;

                .option-label {
                    font-size: 14px;
                    color: #606266;
                    white-space: nowrap;
                    line-height: 32px;
                    font-weight: 500;
                }

                .option-list {
                    flex: 1;
                    display: flex;
                    flex-wrap: wrap;
                    align-items: center;
                    gap: 20px;
                }
            }
        }
    }
}
</style>
