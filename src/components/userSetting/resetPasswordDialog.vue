<template>
    <el-dialog v-model="visible" title="重置密码" width="500px" destroy-on-close>
        <!-- 重置密码表单 -->
        <div>重置密码对话框内容</div>
    </el-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
    modelValue: boolean;
    user: any;
}

const props = defineProps<Props>();
const emit = defineEmits(['update:modelValue', 'success']);

const visible = computed({
    get: () => props.modelValue,
    set: (value: boolean) => emit('update:modelValue', value)
});
</script>