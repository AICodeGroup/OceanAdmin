<template>
  <div class="app-container">
    <!-- 搜索表单 -->
    <el-card shadow="never" class="search-card">
      <el-form :model="searchForm" label-width="80px" :inline="true" >
        <el-form-item label="用户id" style="margin-right: 0px;margin-left: 0px;">
          <el-input v-model="searchForm.user_id" placeholder="请输入用户id" clearable />
        </el-form-item>
        <el-form-item label="课程名称" style="margin-right: 0px;margin-left: 0px;">
          <el-input v-model="searchForm.productName" placeholder="请输入课程名称" clearable />
        </el-form-item>
        <el-form-item label="标题" style="margin-right: 0px;margin-left: 0px;">
          <el-input v-model="searchForm.title" placeholder="请输入标题" clearable />
        </el-form-item>
        <el-form-item label="审核状态" style="margin-right: 21px;margin-left: 0px;">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 100px">
            <el-option label="待审核" :value="0" />
            <el-option label="已通过" :value="1" />
            <el-option label="已驳回" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间" style="margin-right: 16px;">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD HH:mm:ss"
            @change="handleDateChange"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="resetSearchForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 数据表格 -->
    <el-card shadow="never">
      <el-table :data="tableData" v-loading="loading" style="width: 100%">
        <el-table-column label="用户/课程信息" width="250">
          <template #default="{ row }">
            <div class="user-course-cell">
              <div class="user-info">
                <el-avatar :size="40" :src="row.userAvatar" />
                <span class="nickname">{{ row.userNickname }}</span>
              </div>
              <div class="course-info">
                <div class="course-name">{{ row.productName }}</div>
                <div class="course-time">{{ row.startDate }} - {{ row.endDate }}</div>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="内容" min-width="200">
          <template #default="{ row }">
            <div class="content-cell">
              <p class="title">{{ row.title }}</p>
              <p class="content-text">{{ row.content }}</p>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="观察图片" width="150">
          <template #default="{ row }">
            <div class="gallery-cell" v-if="row.imageUrls && row.imageUrls.length">
              <el-image
                v-for="(url, index) in row.imageUrls"
                :key="index"
                :src="url"
                :preview-src-list="row.imageUrls"
                :preview-teleported="true"
                fit="cover"
                class="table-gallery-item"
              />
            </div>
          </template>
        </el-table-column>

        <el-table-column label="关联物种" width="200">
          <template #default="{ row }">
            <div class="gallery-cell species-gallery">
              <div v-for="species in row.selectedSpecies" :key="species.id" class="species-item">
                <el-image :src="species.imageUrl" :preview-teleported="true" fit="cover" class="table-gallery-item" />
                <span class="species-name">{{ species.name }}</span>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="createdAt" label="提交时间" width="180" />
        
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="statusType(row.status)">{{ formatStatus(row.status) }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="100" fixed="right">
          <template #default="{ row }">
            <el-button type="danger" icon="Delete" size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          :current-page="pagination.page"
          :page-size="pagination.limit"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { getObservationsList } from '@/api/observe';
import request from '@/utils/request';
import type { Dayjs } from 'dayjs';

// 搜索表单
const searchForm = reactive({
  user_id: '',
  productName: '',
  title: '',
  status: null as number | null,
  startTime: '',
  endTime: '',
});
const dateRange = ref<[Dayjs, Dayjs] | []>([]);

// 表格数据和分页
const tableData = ref<any[]>([]);
const loading = ref(false);
const pagination = reactive({
  page: 1,
  limit: 10,
  total: 0,
});

// 获取数据
const fetchData = async () => {
  loading.value = true;
  try {
    const params = {
      ...searchForm,
      page: pagination.page,
      limit: pagination.limit,
    };
    const params1 = {
      ...searchForm,
    };
    const res = await getObservationsList(params);
    console.log(res)
    tableData.value = res.observationsDetailVo;
    pagination.total = res.total;

  } catch (error) {
    console.error("获取观察记录失败", error);
    tableData.value = [];
    pagination.total = 0;
  } finally {
    loading.value = false;
  }
};

// 搜索
const handleSearch = () => {
  pagination.page = 1;
  fetchData();
};

// 重置搜索
const resetSearchForm = () => {
  Object.assign(searchForm, {
    user_id: '',
    productName: '',
    title: '',
    status: null,
    startTime: '',
    endTime: '',
  });
  dateRange.value = [];
  handleSearch();
};

// 日期选择器变化
const handleDateChange = (dates: [string, string] | null) => {
  if (dates && dates.length === 2) {
    searchForm.startTime = dates[0];
    searchForm.endTime = dates[1];
  } else {
    searchForm.startTime = '';
    searchForm.endTime = '';
  }
};

// 分页大小变化
const handleSizeChange = (limit: number) => {
  pagination.limit = limit;
  fetchData();
};

// 当前页变化
const handleCurrentChange = (page: number) => {
  pagination.page = page;
  fetchData();
};

// 格式化状态
const formatStatus = (status: number) => {
  const statusMap: { [key: number]: string } = {
    0: '待审核',
    1: '已通过',
    2: '已驳回',
  };
  return statusMap[status] || '未知';
};

const statusType = (status: number) => {
  const typeMap: { [key: number]: string } = {
    0: 'warning',
    1: 'success',
    2: 'danger',
  };
  return typeMap[status] || 'info';
}

// 删除观察记录
const handleDelete = (row: any) => {
  ElMessageBox.confirm(
    `确定要删除用户"${row.userNickname}"的观察记录"${row.title}"吗？`,
    '删除确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(async () => {
    try {
      await request({
        url: `/admin/platform/observations/delete/${row.id}`,
        method: 'delete',
      });
      ElMessage.success('删除成功');
      fetchData(); // 重新加载数据
    } catch (error) {
      console.error('删除失败:', error);
      ElMessage.error('删除失败');
    }
  }).catch(() => {
    // 用户取消删除
  });
};

// 初始加载
onMounted(() => {
  fetchData();
});
</script>

<style lang="scss" scoped>
.app-container {
  padding: 20px;
}

.search-card {
  margin-bottom: 10px;
}

.user-course-cell {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  .nickname {
    font-weight: bold;
  }
}

.course-info {
  font-size: 12px;
  color: #606266;
  .course-name {
    font-weight: 500;
  }
}

.content-cell {
  .title {
    font-weight: bold;
    margin-bottom: 5px;
  }
  .content-text {
    font-size: 13px;
    color: #303133;
    white-space: pre-wrap;
    word-break: break-all;
  }
}

.gallery-cell {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.table-gallery-item {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  cursor: pointer;
}

.species-gallery {
  flex-direction: column;
  align-items: flex-start;
}

.species-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
}

.species-name {
  white-space: nowrap;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>