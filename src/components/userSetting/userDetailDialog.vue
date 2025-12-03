<template>
    <el-dialog v-model="visible" title="用户详情" width="800px" destroy-on-close>
        <!-- 用户详情内容 -->
        <div>用户详情对话框内容</div>
    </el-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
    modelValue: boolean;
    userId: string;
}

const props = defineProps<Props>();
const emit = defineEmits(['update:modelValue', 'refresh']);

const visible = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
});
</script>