<template>
  <div class="app-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-left">
        <el-icon class="header-icon" :size="20">
          <Reading />
        </el-icon>
        <h1 class="page-title">课程管理</h1>
      </div>
      <div class="header-actions">
        <el-button type="primary" size="large" @click="handleAdd" round>
          <el-icon class="btn-icon"><Plus /></el-icon>
          新增课程
        </el-button>
      </div>
    </div>

    <el-card>
      <!-- 搜索表单 -->
      <el-form :model="queryParams" ref="queryForm" :inline="true">
        <el-form-item label="课程名称" prop="name">
          <el-input v-model="queryParams.name" placeholder="请输入课程名称" clearable @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="是否出境" prop="isAbroad" style="width: 180px;">
          <el-select v-model="queryParams.isAbroad" placeholder="请选择" clearable>
            <el-option label="是" :value="true" />
            <el-option label="否" :value="false" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否接触海洋" prop="isOcean" style="width: 190px;">
          <el-select v-model="queryParams.isOcean" placeholder="请选择" clearable>
            <el-option label="是" :value="true" />
            <el-option label="否" :value="false" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否上架" prop="isShow" style="width: 180px;">
          <el-select v-model="queryParams.isShow" placeholder="请选择" clearable>
            <el-option label="是" :value="true" />
            <el-option label="否" :value="false" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
          <el-button icon="Refresh" @click="resetQuery">重置</el-button>
          <el-button type="primary" plain icon="Plus" @click="handleAdd">新增课程</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="mt-4">
      <!-- 数据表格 -->
      <el-table v-loading="loading" :data="courseList" row-key="id">
        <!-- 扩展表格 -->
        <el-table-column type="expand"> 
            <template #default="props">
                <div class="p-4 bg-gray-100">
                <el-descriptions title="课程详情" :column="2" border>
                    <el-descriptions-item label="简介">{{ props.row.intro }}</el-descriptions-item>
                    <el-descriptions-item label="活动亮点"><div v-html="formatJson(props.row.activityLight)"></div></el-descriptions-item>
                    <el-descriptions-item label="活动日程"><div v-html="formatJson(props.row.activitySchedule)"></div></el-descriptions-item>
                </el-descriptions>
                </div>
            </template>
        </el-table-column>

        <el-table-column label="课程分类" width="150">
            <template #default="scope">
                <span>{{ getCategoryName(scope.row.categoryId) }}</span>
            </template>
        </el-table-column>
        <el-table-column label="技能课程" width="100" align="center">
            <template #default="scope">
                <el-tag :type="scope.row.isSkillProduct ? 'success' : 'info'">
                    {{ scope.row.isSkillProduct ? '是' : '否' }}
                </el-tag>
            </template>
        </el-table-column>
        <el-table-column label="轮播图" align="center" width="200">
          <template #default="scope">
            <div class="flex flex-wrap gap-2">
               <el-image
                v-for="(img, index) in parseSliderImage(scope.row.sliderImage)"
                :key="index"
                style="width: 60px; height: 60px"
                :src="img"
                :preview-src-list="parseSliderImage(scope.row.sliderImage)"
                :initial-index="index"
                :preview-teleported="true"
                fit="cover"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column label="课程名称" prop="name" width="300" :show-overflow-tooltip="true" />
        <el-table-column label="价格" prop="price" width="260" />
        <el-table-column label="上架状态" width="150">
          <template #default="scope">
            <el-tag :type="scope.row.isShow ? 'success' : 'danger'">{{ scope.row.isShow ? '上架' : '下架' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="相关技能" width="150">
            <template #default="scope">
                <el-tag v-for="skill in getSkillNames(scope.row.skillIds)" :key="skill" class="mr-1 mb-1">{{ skill }}</el-tag>
            </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="300" fixed="right">
          <template #default="scope">
            <el-button type="primary" icon="Edit" size="small" @click="handleUpdate(scope.row)">修改</el-button>
            <el-button type="danger" icon="Delete" size="small" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页组件 -->
      <div class="mt-4 flex justify-end">
        <el-pagination
          :current-page="queryParams.page"
          :page-size="queryParams.limit"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 新增/修改课程弹窗 -->
    <el-dialog :title="dialogTitle" v-model="dialogVisible" width="70%" append-to-body>
      <el-form ref="formRef" :model="form" label-width="120px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="课程分类" prop="course.categoryId">
              <el-select v-model="form.course.categoryId" placeholder="请选择课程分类" style="width: 100%;">
                <el-option v-for="category in categoryList" :key="category.id" :label="category.name" :value="category.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="课程名称" prop="course.name">
              <el-input v-model="form.course.name" placeholder="请输入课程名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="技能课程" prop="course.isSkillProduct">
              <el-switch v-model="form.course.isSkillProduct" @change="handleSkillProductChange" />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.course.isSkillProduct">
            <el-form-item label="课程阶级" prop="course.productLevel">
              <el-select v-model="form.course.productLevel" placeholder="请选择课程阶级" style="width: 100%;">
                <el-option label="初阶" :value="0" />
                <el-option label="中阶" :value="1" />
                <el-option label="高阶" :value="2" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="价格" prop="course.price">
              <el-input-number v-model="form.course.price" :precision="2" :step="1" :min="0" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="简介" prop="course.intro">
          <el-input type="textarea" v-model="form.course.intro" placeholder="请输入简介" />
        </el-form-item>
        <el-form-item label="活动亮点" prop="course.activityLight">
            <RichTextEditor v-model="form.course.activityLight" />
            <!-- <el-input type="textarea" v-model="form.course.activityLight" placeholder='请输入活动亮点，使用 JSON 格式，例如：{"亮点1": "描述1", "亮点2": "描述2"}' /> -->
        </el-form-item>
        <el-form-item label="活动日程" prop="course.activitySchedule">
            <RichTextEditor v-model="form.course.activitySchedule" />
            <!-- <el-input type="textarea" v-model="form.course.activitySchedule" placeholder='请输入活动日程，使用 JSON 格式，例如：{"第一天": "活动安排", "第二天": "活动安排"}' /> -->
        </el-form-item>
        <el-form-item label="轮播图" prop="course.sliderImage">
            <el-upload
                v-model:file-list="fileList"
                action="/admin/platform/upload/image"
                list-type="picture-card"
                multiple
                :on-success="handleUploadSuccess"
                :on-remove="handleRemove"
                :headers="{ Authorization: getToken() }"
                :data="{ model: 'product', pid: 1 }"
                name="multipart" >
                <el-icon><Plus /></el-icon>
            </el-upload>
        </el-form-item>
        <el-row>
            <el-col :span="8">
                <el-form-item prop="course.iconUrl">
                    <template #label>
                        <span style="display: inline-flex; align-items: center; gap: 4px;">
                            icon图标
                            <el-tooltip content="用于足迹地图显示" placement="top">
                                <el-icon style="font-size: 14px; color: #909399; cursor: help;" @mouseenter="$event.target.style.color='#409eff'" @mouseleave="$event.target.style.color='#909399'">
                                    <InfoFilled />
                                </el-icon>
                            </el-tooltip>
                        </span>
                    </template>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <el-image 
                            v-if="form.course.iconUrl" 
                            :src="form.course.iconUrl" 
                            style="width: 40px; height: 40px; border-radius: 4px; border: 1px solid #dcdfe6;" 
                            fit="cover"
                        />
                        <el-upload
                            :show-file-list="false"
                            action="/api/admin/platform/upload/image"
                            :on-success="handleIconUploadSuccess"
                            :headers="{ Authorization: 'Bearer ' + getToken() }"
                            accept="image/*"
                            :data="{ model: 'product', pid: 1 }"
                            name="multipart"
                        >
                            <el-button size="small" type="primary" plain>
                                {{ form.course.iconUrl ? '更换' : '上传' }}
                            </el-button>
                        </el-upload>
                        <el-button 
                            v-if="form.course.iconUrl" 
                            size="small" 
                            type="danger" 
                            plain 
                            @click="handleIconRemove"
                        >
                            删除
                        </el-button>
                    </div>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="8">
                <el-form-item label="时长" prop="course.duration">
                    <el-input v-model="form.course.duration" placeholder="例如: 9天8晚" />
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="地点" prop="course.location">
                    <el-input v-model="form.course.location" placeholder="请输入地点" />
                </el-form-item>
            </el-col>
            <el-col :span="8">
                 <el-form-item label="适合用户" prop="course.userType">
                    <el-input v-model="form.course.userType" placeholder="例如: 12-16岁" />
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="8">
                <el-form-item label="标签" prop="course.label">
                    <el-input v-model="form.course.label" placeholder="例如: 国际营" />
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="活动天数" prop="course.activityDays">
                    <el-input-number v-model="form.course.activityDays" :min="0" />
                </el-form-item>
            </el-col>
             <el-col :span="8">
                <el-form-item label="相关技能" prop="course.skillIds">
                    <el-select v-model="form.course.skillIds" multiple placeholder="请选择技能">
                        <el-option v-for="(name, id) in skillMap" :key="id" :label="name" :value="id" />
                    </el-select>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="6">
                <el-form-item label="是否上架" prop="course.isShow">
                    <el-switch v-model="form.course.isShow" />
                </el-form-item>
            </el-col>
            <el-col :span="6">
                <el-form-item label="家庭营" prop="course.isFamily">
                    <el-switch v-model="form.course.isFamily" />
                </el-form-item>
            </el-col>
            <el-col :span="6">
                <el-form-item label="是否出境" prop="course.isAbroad">
                    <el-switch v-model="form.course.isAbroad" />
                </el-form-item>
            </el-col>
            <el-col :span="6">
                <el-form-item label="接触海洋" prop="course.isOcean">
                    <el-switch v-model="form.course.isOcean" />
                </el-form-item>
            </el-col>
        </el-row>

        <el-divider content-position="left">排期信息</el-divider>
        <div v-for="(schedule, index) in form.schedules" :key="index" class="schedule-item mb-4 p-4 border rounded">
            <el-form-item
                :label="`排期名称 ` + (index + 1)"
                :prop="`schedules.${index}.name`"
                :rules="{ required: true, message: '排期名称不能为空', trigger: 'blur' }"
            >
                <el-input v-model="schedule.name" placeholder="例如: 2025暑期第一期" />
            </el-form-item>
            <el-form-item
                :label="`排期日期 ` + (index + 1)"
                :prop="`schedules.${index}.dateRange`"
                :rules="{ required: true, message: '排期日期不能为空', trigger: 'change' }"
            >
                <el-date-picker
                    v-model="schedule.dateRange"
                    type="datetimerange"
                    range-separator="至"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间"
                    value-format="YYYY-MM-DD HH:mm:ss"
                />
            </el-form-item>
            <el-form-item v-if="form.schedules.length > 1">
                <el-button type="danger" @click="removeSchedule(index)">删除排期</el-button>
            </el-form-item>
        </div>
        <el-form-item>
            <el-button type="primary" plain @click="addSchedule">新增排期</el-button>
        </el-form-item>

      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="submitForm">确 定</el-button>
        </div>
      </template>
    </el-dialog>

  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import type { FormInstance, UploadProps, UploadUserFile } from 'element-plus';
import { InfoFilled, Plus, Reading } from '@element-plus/icons-vue';
import request from '@/utils/request';
import { getToken } from '@/utils/auth';
import  RichTextEditor from '@/components/Editor/index.vue';


interface Category {
    id: number;
    name: string;
}

interface Course {
    id: number;
    categoryId: number;
    name: string;
    intro: string;
    sliderImage: string;
    image: string;
    iconUrl: string;
    price: number;
    isShow: boolean;
    duration: string;
    location: string;
    userType: string;
    isFamily: boolean;
    label: string;
    isAbroad: boolean;
    activityDays: number;
    isSkillProduct: boolean;
    productLevel: number | null;
    skillIds: string | string[];
    isOcean: boolean;
    activityLight: string;
    activitySchedule: string;
}

const loading = ref(true);
const courseList = ref<Course[]>([]);
const total = ref(0);
const queryParams = reactive({
  page: 1,
  limit: 10,
  name: '',
  isAbroad: null,
  isOcean: null,
  isShow: null,
});

const dialogVisible = ref(false);
const dialogTitle = ref('');
const formRef = ref<FormInstance>();
const fileList = ref<UploadUserFile[]>([]);
const categoryList = ref<Category[]>([]);

const getInitialForm = () => ({
    course: {
        id: undefined,
        name: '',
        intro: '',
        sliderImage: '[]',
        image: '',
        iconUrl: '',
        price: 0.00,
        isShow: true,
        duration: '',
        location: '',
        userType: '',
        isFamily: false,
        label: '',
        isAbroad: false,
        activityDays: 0,
        isSkillProduct: false,
        productLevel: null,
        categoryId: undefined,
        skillIds: [] as string[], // 明确指定类型为 string[]
        isOcean: false,
        activityLight: '请输入活动亮点，使用 JSON 格式，例如：{"亮点1": "描述1", "亮点2": "描述2"}',
        activitySchedule: '请输入活动日程，使用 JSON 格式，例如：{"日期1": "描述1", "日期2": "描述2"}',
    },
    schedules: [
        {
            name: '',
            dateRange: [] as string[], // 明确指定类型
            startDate: '',
            endDate: '',
        }
    ]
});

let form = reactive(getInitialForm());

const skillMap: { [key: string]: string } = {
    '0': '水肺潜水', '1': '浮潜', '2': '游泳', '3': '帆船', '4': '浆板', '5': '冲浪', '6': '皮划艇', '7': '全技能'
};

const getCategoryName = (categoryId: number) => {
    const category = categoryList.value.find(c => c.id === categoryId);
    return category ? category.name : '未分类';
};

const getSkillNames = (skillIds: string[] | string) => {
    if (!skillIds) return [];
    const ids = Array.isArray(skillIds) ? skillIds : String(skillIds).split(',');
    return ids.map(id => skillMap[id.trim()] || '未知技能').filter(name => name !== '未知技能');
}

const getList = async () => {
  loading.value = true;
  try {
    const response = await request({
      url: '/admin/platform/product/course/list',
      method: 'get',
      params: queryParams,
    });
    
    // 根据实际API响应结构，数据直接在response下
    if (response && (response as any).list) {
        courseList.value = (response as any).list;
        total.value = (response as any).total || 0;
        console.log('成功加载课程数据:', courseList.value.length, '条课程');
    } else {
        console.warn('API响应格式异常:', response);
        courseList.value = [];
        total.value = 0;
    }
  } catch (error) {
    console.error('获取课程列表失败:', error);
    ElMessage.error('获取课程列表失败');
  } finally {
    loading.value = false;
  }
};

const resetForm = () => {
    Object.assign(form, getInitialForm());
    fileList.value = [];
    formRef.value?.resetFields();
};

const handleAdd = () => {
    resetForm();
    dialogTitle.value = '新增课程';
    dialogVisible.value = true;
};

const handleUpdate = async (row: any) => {
    resetForm();
    dialogTitle.value = '修改课程';
    
    // 深拷贝课程信息
    Object.assign(form.course, row);

    // 将 skillIds 字符串转为数组以适应多选框
    if (form.course.skillIds && typeof form.course.skillIds === 'string') {
        form.course.skillIds = (form.course.skillIds as string).split(',');
    } else if (!form.course.skillIds) {
        form.course.skillIds = [];
    }

    // 解析轮播图并填充 fileList
    if (form.course.sliderImage) {
        try {
            const imageUrls = JSON.parse(form.course.sliderImage);
            fileList.value = imageUrls.map((url: string) => ({ name: url, url: url, uid: Date.now() + Math.random() }));
        } catch (e) {
            fileList.value = [];
            console.error("Failed to parse sliderImage JSON:", e);
        }
    } else {
        fileList.value = [];
    }

    // icon图标已经在form.course.iconUrl中，无需额外处理

    // 获取并填充排期信息
    try {
        const response = await request({
            url: `/admin/platform/product/getProductSchedulesByProductId/${row.id}`,
            method: 'get',
        });
        const schedules = (response as any) || [];
        if (schedules && schedules.length > 0) {
            form.schedules = schedules.map((s: any) => ({
                name: s.name,
                dateRange: [s.startDate, s.endDate],
                startDate: s.startDate,
                endDate: s.endDate,
            }));
        } else {
            // 如果没有排期，则提供一个空的默认排期表单
            form.schedules = [{ name: '', dateRange: [], startDate: '', endDate: '' }];
        }
    } catch (error) {
        ElMessage.error('获取排期信息失败');
        form.schedules = [{ name: '', dateRange: [], startDate: '', endDate: '' }];
    }

    dialogVisible.value = true;
};

const handleDelete = (row: Course) => {
    ElMessageBox.confirm(`确定要删除课程 "${row.name}" 吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    }).then(async () => {
        try {
            await request({
                url: `/admin/platform/product/course/delete/${row.id}`,
                method: 'post',
            });
            ElMessage.success('删除成功');
            getList();
        } catch (error) {
            ElMessage.error('删除失败');
        }
    }).catch(() => {});
};

const cancel = () => {
    dialogVisible.value = false;
    resetForm();
};

const submitForm = () => {
    formRef.value?.validate(async (valid) => {
        if (valid) {
            const isUpdate = !!form.course.id;
            const apiPath = isUpdate ? '/admin/platform/product/course/update' : '/admin/platform/product/course/create';
            
            // 准备提交的数据
            const requestData = JSON.parse(JSON.stringify(form));

            // 从 fileList 生成图片 URL 列表
            const imageUrls = fileList.value.map(f => f.url);

            // 格式化 sliderImage 和 image 字段
            requestData.course.sliderImage = JSON.stringify(imageUrls);
            requestData.course.image = imageUrls.length > 0 ? imageUrls[0] : '';

            // 格式化 skillIds
            requestData.course.skillIds = Array.isArray(requestData.course.skillIds) ? requestData.course.skillIds.join(',') : '';
            // 处理排期日期
            requestData.schedules = form.schedules.map(schedule => {
                if (schedule.dateRange && schedule.dateRange.length === 2) {
                    return {
                        name: schedule.name,
                        startDate: schedule.dateRange[0],
                        endDate: schedule.dateRange[1],
                    };
                }
                return schedule;
            });
            try {
                await request({
                    url: apiPath,
                    method: 'post',
                    data: requestData,
                });
                ElMessage.success(isUpdate ? '修改成功' : '新增成功');
                dialogVisible.value = false;
                getList();
            } catch (error) {
                ElMessage.error(isUpdate ? '修改失败' : '新增失败');
            }
        }
    });
};

const handleUploadSuccess: UploadProps['onSuccess'] = (response, uploadFile, uploadFiles) => {
    // 根据你的 API 响应 { code: 200, data: { url: '...' } } 进行调整
    if (response.code === 200 && response.data?.url) {
        // 关键：找到当前文件在 fileList 中的索引并更新其 url
        const index = uploadFiles.findIndex(f => f.uid === uploadFile.uid);
        if (index !== -1) {
            uploadFiles[index].url = response.data.url;
        }
        // 立即更新 fileList 和 form.course.sliderImage
        fileList.value = uploadFiles;
        form.course.sliderImage = JSON.stringify(fileList.value.map(f => f.url));
    } else {
        ElMessage.error('上传失败，响应数据不正确');
        // 从列表中移除上传失败的文件
        const index = fileList.value.findIndex(f => f.uid === uploadFile.uid);
        if (index > -1) {
            fileList.value.splice(index, 1);
        }
    }
};

const handleRemove: UploadProps['onRemove'] = (_, uploadFiles) => {
    fileList.value = uploadFiles;
    form.course.sliderImage = JSON.stringify(fileList.value.map(f => f.url));
};

const handleIconUploadSuccess: UploadProps['onSuccess'] = (response) => {
    if (response.code === 200 && response.data?.url) {
        form.course.iconUrl = response.data.url;
        ElMessage.success('图标上传成功');
    } else {
        ElMessage.error('图标上传失败，响应数据不正确');
    }
};

const handleIconRemove = () => {
    form.course.iconUrl = '';
    ElMessage.success('图标已删除');
};

const parseSliderImage = (sliderImage: string) => {
  try {
    const images = JSON.parse(sliderImage);
    return Array.isArray(images) ? images : [];
  } catch (e) { return []; }
};

const formatJson = (jsonStr: string) => {
  try {
    const obj = JSON.parse(jsonStr);
    return Object.entries(obj).map(([key, value]) => `<b>${key}:</b> ${value}`).join('<br>');
  } catch (e) { return jsonStr; }
};

const handleQuery = () => { queryParams.page = 1; getList(); };
const resetQuery = () => { queryParams.name = ''; queryParams.isAbroad = null; queryParams.isOcean = null; queryParams.isShow = null; handleQuery(); };
const handleSizeChange = (val: number) => { queryParams.limit = val; getList(); };
const handleCurrentChange = (val: number) => { queryParams.page = val; getList(); };

const addSchedule = () => {
    form.schedules.push({
        name: '',
        dateRange: [],
        startDate: '',
        endDate: '',
    });
};

const handleSkillProductChange = (isSkill: boolean) => {
    if (!isSkill) {
        form.course.productLevel = null;
    }
};

const removeSchedule = (index: number) => {
    if (form.schedules.length > 1) {
        form.schedules.splice(index, 1);
    }
};

const getCategoryList = async () => {
    try {
        const response = await request({
            url: '/admin/platform/getAllCategory',
            method: 'get',
        });
        if (response) {
            categoryList.value = response as any;
        }
    } catch (error) {
        ElMessage.error('获取课程分类失败');
    }
};

onMounted(() => { 
    getList(); 
    getCategoryList(); 
});
</script>

<style scoped>
.app-container {
  padding: 12px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

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
  }
}

.btn-icon {
  margin-right: 4px;
}

.mt-4 {
  margin-top: 16px;
}

.flex {
  display: flex;
}

.justify-end {
  justify-content: flex-end;
}

.mt-4 { margin-top: 1rem; }
.p-4 { padding: 1rem; }
.bg-gray-100 { background-color: #f7fafc; }
.flex { display: flex; }
.flex-wrap { flex-wrap: wrap; }
.gap-2 { gap: 0.5rem; }
.justify-end { justify-content: flex-end; }
.mr-1 { margin-right: 0.25rem; }
.mb-1 { margin-bottom: 0.25rem; }
.mb-4 { margin-bottom: 1rem; }
.p-4 { padding: 1rem; }
.border { border: 1px solid #dcdfe6; }
.rounded { border-radius: 4px; }
</style>