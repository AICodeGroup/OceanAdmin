<template>
    <div class="user-list">
        <h1>用户列表</h1>
        <ul>
            <li v-for="user in userList" :key="user.id">{{ user.name }}</li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

interface User {
    id: number;
    name: string;
}

const userList = ref<User[]>([]);

onMounted(() => {
    // 模拟异步获取用户数据
    setTimeout(() => {
        userList.value = [
            { id: 1, name: '张三' },
            { id: 2, name: '李四' },
            { id: 3, name: '王五' }
        ];
    }, 500);
});
</script>

<style lang="scss" scoped>
.user-list {
    padding: 20px;

    h1 {
        font-size: 24px;
        margin-bottom: 20px;
    }

    ul {
        list-style: none;
        padding: 0;

        li {
            margin-bottom: 10px;
            font-size: 18px;
        }
    }
}
</style>