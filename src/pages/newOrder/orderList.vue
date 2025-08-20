<template>
  <div>
    <!-- 搜索表单 -->
    <el-card shadow="never" class="mb-4">
      <el-form :model="searchForm" label-width="80px" :inline="true">

        <el-form-item label="订单号" >
          <el-input v-model="searchForm.orderNo" placeholder="请输入订单号" style="width: 150px" clearable />
        </el-form-item>

        <el-form-item label="手机号">
          <el-input v-model="searchForm.phone" placeholder="请输入手机号" style="width: 150px" clearable />
        </el-form-item>

        <el-form-item label="课程名称">
          <el-input v-model="searchForm.productName" placeholder="请输入课程名称" style="width: 150px" clearable />
        </el-form-item>

        <el-form-item label="订单状态" >
          <el-select v-model="searchForm.status" placeholder="请选择订单状态" style="width: 150px" clearable>
            <el-option label="待支付" :value="0" />
            <el-option label="已支付" :value="1" />
            <el-option label="已退款" :value="2" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="创建日期">
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

    <el-card shadow="never" class="mb-4">
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        添加订单
      </el-button>
    </el-card>

    <!-- 数据表格 -->
    <el-card shadow="never">
      <el-table :data="tableData" v-loading="loading" style="width: 100%">
        <el-table-column prop="orderNo" label="订单号" width="180" />
        <el-table-column prop="userNickname" label="用户昵称" width="80"/>
        <el-table-column prop="phone" label="手机号码" width="120"/>
        <el-table-column prop="productName" label="课程名称" width="120"/>
        <el-table-column prop="location" label="地点" width="60"/>
        <el-table-column prop="scheduleName" label="期次" width="80"/>
        <el-table-column prop="startDate" label="开始日期" width="160" />
        <el-table-column prop="endDate" label="结束日期" width="160" />
        <el-table-column prop="payAmount" label="支付金额" width="90"/>
        <!-- <el-table-column prop="points" label="积分" /> -->
        <el-table-column prop="payType" label="支付方式" width="80"/>
        <el-table-column prop="status" label="订单状态" width="80">
          <template #default="{ row }">
            <el-tag :type="statusType(row.status)">{{ formatStatus(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="paidAt" label="支付时间" width="120" />
        <el-table-column prop="createdAt" label="创建时间" width="160" />


        <el-table-column label="操作" width="150" fixed="right">
            <template #default="scope">
              <el-button type="primary" size="small" @click="handleEdit(scope.row)">
                修改
              </el-button>
              <el-button type="danger" size="small" @click="handleDelete(scope.row)">
                删除
              </el-button>
            </template>
          </el-table-column>


      </el-table>

      <!-- 分页 -->
      <div class="flex justify-end mt-4">
        <el-pagination
          :current-page="pagination.page"
          :page-size="pagination.limit"
          :total="pagination.total"
          layout="sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>


  <el-dialog
      v-model="formVisible"
      :title="formTitle"
      width="600px"
      @close="resetForm"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入手机号" style="width: 150px" clearable @blur="handlePhoneBlur">

          <template #suffix>
          <el-icon v-if="phoneChecking" class="is-loading">
            <Loading />
          </el-icon>
        </template>

        </el-input>

      <div v-if="phoneCheckMessage" :class="['el-form-item__error', phoneCheckMessage.type]">
        {{ phoneCheckMessage.text }}
      </div>
        </el-form-item>

        <el-form-item label="课程" prop="productId">
          <el-select 
            v-model="form.productId" 
            placeholder="请选择课程" 
            filterable
            clearable
            @change="handleCourseChange"
          >
            <el-option
              v-for="course in courseList"
              :key="course.id"
              :label="`${course.name}`"
              :value="course.id"
            />
          </el-select>
        </el-form-item>
        <!-- 课程排期要联动 scheduleId，scheduleName -->
         
        <el-form-item label="期次" prop="scheduleId">
          <el-select 
            v-model="form.scheduleId" 
            placeholder="请选择期次" 
            filterable
            clearable
            @change="handleScheduleChange"
          >
            <el-option
              v-for="schedule in scheduleList"
              :key="schedule.id"
              :label="`${schedule.name}：${schedule.startDate} - ${schedule.endDate}`"
              :value="schedule.id"
            />
          </el-select>
        </el-form-item>
        <!-- 开始日期，结束日期 -->
        <!-- <el-form-item label="期次名称" prop="scheduleName">
          <el-input v-model="form.scheduleName" placeholder="请输入期次名称" style="width: 150px" clearable />
        </el-form-item>

        <el-form-item label="开始日期" prop="startDate">
          <el-date-picker
            v-model="form.startDate"
            type="date"
            placeholder="选择开始日期"
            style="width: 150px"
          />
        </el-form-item>

        <el-form-item label="结束日期" prop="endDate">
          <el-date-picker
            v-model="form.endDate"
            type="date"
            placeholder="选择结束日期"
            style="width: 150px"
          />
        </el-form-item> -->

        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" :rows="3" placeholder="请输入备注" />
        </el-form-item>

        <el-form-item label="支付金额" prop="payAmount">
          <el-input v-model="form.payAmount" type="textarea" :rows="3" placeholder="请输入支付金额" />
        </el-form-item>

        <!-- <el-form-item label="积分" prop="points">
          <el-input v-model="form.points" type="textarea" :rows="3" placeholder="请输入积分" />
        </el-form-item>   -->

        <el-form-item label="订单状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择订单状态" clearable>
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="支付方式" prop="payType">
        <el-select v-model="form.payType" placeholder="请选择支付方式" clearable>
          <el-option
            v-for="item in payTypeOptions"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="支付时间" prop="payTime">
        <div class="demo-datetime-picker">
          <el-date-picker
            v-model="form.paidAt"
            type="datetime"
            placeholder="Select date and time"
          />
        </div>
      </el-form-item>
        
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="formVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted,watch } from 'vue';
// 假设你有一个API服务来发送请求
import { getAllOrder, type Order } from '@/api/newOrder'; // 请替换为你的API请求方法
import type { FormInstance,FormRules } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import { judgeUser,getCourseList,getScheduleById,createOrder,updateOrder,deleteOrderApi } from '@/api/newOrder'
import { Loading } from '@element-plus/icons-vue'

// 在 setup 中添加以下代码
const phoneChecking = ref(false)
const phoneCheckMessage = ref<{text: string, type: 'error' | 'success'} | null>(null)
const formTitle = ref('新增订单')
const statusOptions = [
  { value: '0', label: '待支付' },
  { value: '1', label: '已支付' },
  { value: '2', label: '已退款' },
]
// 手机号失焦事件处理
const handlePhoneBlur = async () => {
  const phone = form.phone.trim()
  if (!phone) {
    phoneCheckMessage.value = { text: '请输入手机号', type: 'error' }
    return
  }
  // 简单的手机号格式验证
  if (!/^1[3-9]\d{9}$/.test(phone)) {
    phoneCheckMessage.value = { text: '请输入正确的手机号', type: 'error' }
    return
  }
  try {
    phoneChecking.value = true
    phoneCheckMessage.value = null
    
    const res = await judgeUser(phone)
    console.log(res)
    if (res) {
      // 用户存在
      
      // 可以在这里设置用户信息到表单
      form.userId = res
      // addForm.userName = res.userName
    } else {
      // 用户不存在
      phoneCheckMessage.value = { 
        text: '该手机号未注册，请确认后重试', 
        type: 'error' 
      }
    }
  } catch (error) {
    console.error('检查手机号失败:', error)
    ElMessage.error('检查手机号失败，请稍后重试')
  } finally {
    phoneChecking.value = false
  }
}

const courseList = ref([])
const scheduleList = ref([])
// 获取课程列表
const fetchCourseList = async () => {
  try {
    const res = await getCourseList() // 假设这是获取课程列表的API
    courseList.value = res
  } catch (error) {
    console.error('获取课程列表失败:', error)
    ElMessage.error('获取课程列表失败')
  }
}
// 获取期次列表

const value1 = ref('')
const defaultTime = new Date(2000, 1, 1, 12, 0, 0)
const shortcuts = [
  {
    text: 'Today',
    value: new Date(),
  },
  {
    text: 'Yesterday',
    value: () => {
      const date = new Date()
      date.setDate(date.getDate() - 1)
      return date
    },
  },
  {
    text: 'A week ago',
    value: () => {
      const date = new Date()
      date.setDate(date.getDate() - 7)
      return date
    },
  },
]
// 支付方式选项
const payTypeOptions = ref([
  '微信支付',
  '支付宝',
  '银行转账',
  '现金支付',
  '其他'
])
const formRef = ref<FormInstance>()
const formVisible = ref(false)
const rules: FormRules = {
  phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
  productId: [{ required: true, message: '请选择课程', trigger: 'change' }],
  scheduleId: [{ required: true, message: '请选择期次', trigger: 'change' }],
  payType: [{ required: true, message: '请选择支付方式', trigger: 'change' }]
}

//处理新加订单
const handleAdd = () => {
  formTitle.value = '新增订单'
  formVisible.value = true
  formRef.value?.resetFields()
}
// 处理添加订单提交
const handleSubmit = async () => {
  formRef.value?.validate(async (valid) => {
    if (valid) {
      try {
        if(form.id){
          await updateOrder(form)
          ElMessage.success('订单更新成功')
        }else{
          await createOrder(form)
          ElMessage.success('订单创建成功')
        }
        formVisible.value = false
        // 重置表单
        formRef.value?.resetFields()
        // 刷新列表数据 - 使用与页面加载时相同的参数
      // 假设你的API方法是 getProductOrders
      const res = await getAllOrder(searchForm,pagination.page,pagination.limit); // 替换为你的API调用
      console.log(res)
      tableData.value = res;
        // fetchData()
      } catch (error) {
        console.error('创建订单失败:', error)
      }
    }
  })
}

const form = reactive({
  id:null,
  phone: '',
  productId: null,    // 改为 null
  productName: '',
  scheduleId: null,   // 改为 null
  scheduleName: '', // 添加这个字段
  startDate: null,    // 日期也可以使用 null
  endDate: null,      // 日期也可以使用 null
  payAmount: null,    // 改为 null
  points: null,       // 改为 null
  payType: null,      // 选择框也可以使用 null
  status: null,       // 状态使用 null
  paidAt: null,       // 日期使用 null
  remark: null,
  userId:null
})

// 重置表单时也使用 null
const resetForm = () => {
  Object.assign(form, {
    id:null,
    userId: null,
    phone: '',
    productId: null,
    productName: '',
    scheduleId: null,
    scheduleName: '', // 添加这个字段
    startDate: null,
    endDate: null,
    payAmount: null,
    points: null,
    payType: null,
    status: null,
    paidAt: null,
    remark: null
  })
  phoneCheckMessage.value = null
  phoneChecking.value = false
  formRef.value?.resetFields()
}

// 监听课程ID变化
watch(() => form.productId, async (newVal, oldVal) => {
  // 清空期次相关数据
  scheduleList.value = [];
  form.scheduleId = null;
  form.scheduleName = '';
  
  if (newVal) {
    await fetchScheduleList(newVal);
  }
});

// 获取期次列表
const fetchScheduleList = async (courseId) => {
  try {
    loading.value = true;
    const res = await getScheduleById(courseId);
    // 确保清空当前期次选择
    form.scheduleId = null;
    form.scheduleName = '';
    scheduleList.value = res || [];
  } catch (error) {
    console.error('获取期次列表失败:', error);
    ElMessage.error('获取期次列表失败');
  } finally {
    loading.value = false;
  }
};

const handleCourseChange = (productId) => {
    if (productId) {
      // addForm.productId = courseList.id;
      const selectName =  courseList.value.find(item => item.id === productId);
      // console.log(selectName)
      form.productName = selectName.name
      // console.log(addForm.productName)
    } else {
      // addForm.productId = null;
      form.productName = '';
    }
  };
// 处理期次选择变化
const handleScheduleChange = (scheduleId) => {
  const selectedSchedule = scheduleList.value.find(item => item.id === scheduleId);
  if (selectedSchedule) {
    form.scheduleName = selectedSchedule.name;
    // 设置其他相关字段
    if (selectedSchedule.startDate) {
      form.startDate = selectedSchedule.startDate;
    }
    if (selectedSchedule.endDate) {
      form.endDate = selectedSchedule.endDate;
    }
  } else {
    // 如果没有选择期次，清空相关字段
    form.scheduleName = '';
    form.startDate = null;
    form.endDate = null;
  }
};

// 搜索表单
const searchForm = reactive({
  orderNo: '',
  phone: '',
  productName: '',
  status: '',
  startTime: '',
  endTime: '',
});
const dateRange = ref([]);

// 表格数据和分页
const tableData = ref<Order[]>([])
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
      searchForm,
      page: pagination.page,
      limit: pagination.limit,
    };
    // 假设你的API方法是 getProductOrders
    const res = await getAllOrder(params.searchForm,params.page,params.limit); // 替换为你的API调用
    console.log(res)
    tableData.value = res;
    
  } catch (error) {
    console.error("获取订单数据失败", error);
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
    orderNo: '',
    phone: '',
    productName: '',
    status: null,
    startTime: '',
  });
  dateRange.value = [];
  handleSearch();
};

// 日期选择器变化
const handleDateChange = (dates:string[]) => {
  if (dates && dates.length === 2) {
    searchForm.startTime = dates[0];
    searchForm.endTime = dates[1];
  } else {
    searchForm.startTime = '';
    searchForm.endTime = '';
  }
};

// 分页大小变化
const handleSizeChange = (limit:number) => {
  pagination.limit = limit;
  fetchData();
};

// 当前页变化
const handleCurrentChange = (page:number) => {
  pagination.page = page;
  fetchData();
};

// 格式化状态
const formatStatus = (status:number) => {
  const statusMap = {
    0: '待支付',
    1: '已支付',
    2: '已退款',
  };
  return statusMap[status] || '未知';
};

const statusType = (status:number) => {
  const typeMap = {
    0: 'warning',
    1: 'success',
    2: 'info',
  };
  return typeMap[status] || '';
}

// 初始加载
onMounted(() => {
  fetchData();
  fetchCourseList(); // 添加这行
});

const handleEdit = (row) => {
  formTitle.value = '编辑订单'
  Object.assign(form, row)
  formVisible.value = true
}
// 处理删除 - 待实现
const handleDelete = async (row) => {
    try {
      await ElMessageBox.confirm(`确定要删除订单 “${row.productName}” 吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      
      // 在这里调用删除接口
      await deleteOrderApi(row.id)
      
      const res = await getAllOrder(searchForm,pagination.page,pagination.limit); // 替换为你的API调用
      console.log(res)
      tableData.value = res;
      ElMessage.success('删除成功')
      // getList() // 重新加载列表
    } catch (error) {
      if (error !== 'cancel') {
        console.error('删除失败:', error)
      }
    }
  }
</script>

<style scoped>
.mb-4 {
  margin-bottom: 16px;
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
/* 手机号验证信息样式 */
.phone-check-message {
  margin-top: 4px;
  font-size: 12px;
  line-height: 1;
  padding-top: 4px;
}

.phone-check-message.success {
  color: #67c23a;
}

.phone-check-message.error {
  color: #f56c6c;
}
.demo-datetime-picker {
  display: flex;
  width: 100%;
  padding: 0;
  flex-wrap: wrap;
}
.demo-datetime-picker .block {
  padding: 30px 0;
  text-align: center;
  border-right: solid 1px var(--el-border-color);
  flex: 1;
}
.demo-datetime-picker .block:last-child {
  border-right: none;
}
.demo-datetime-picker .demonstration {
  display: block;
  color: var(--el-text-color-secondary);
  font-size: 14px;
  margin-bottom: 20px;
}
</style>