<template>
    <div>
        <TableSearch :query="query" :options="searchOpt" :search="handleSearch" />
        <div class="container">
            <TableCustom :columns="columns" :tableData="tableData" :total="page.total" :viewFunc="handleView"
                :delFunc="handleDelete" :page-change="changePage" :editFunc="handleEdit">
                <template #toolbarBtn>
                    <el-button type="warning" :icon="CirclePlusFilled" @click="visible = true">新增</el-button>
                </template>
            </TableCustom>

        </div>
        <el-dialog :title="isEdit ? '编辑' : '新增'" v-model="visible" width="700px" destroy-on-close
            :close-on-click-modal="false" @close="closeDialog">
            <TableEdit :form-data="rowData" :options="options" :edit="isEdit" :update="updateData" />
        </el-dialog>
        <el-dialog title="查看详情" v-model="visible1" width="700px" destroy-on-close>
            <TableDetail :data="viewData"></TableDetail>
        </el-dialog>
    </div>
</template>

<script setup lang="ts" name="system-user">
import { ref, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import { CirclePlusFilled } from '@element-plus/icons-vue';
import { Post } from '@/types/user';
import { fetchPostData } from '@/api';
import TableCustom from '@/components/table-custom.vue';
import TableDetail from '@/components/table-detail.vue';
import TableSearch from '@/components/table-search.vue';
import { FormOption, FormOptionList } from '@/types/form-option';

// 查询相关
const query = reactive({
    name: '',
});
const searchOpt = ref<FormOptionList[]>([
    { type: 'input', label: '帖子ID：', prop: 'postId' }
])
const handleSearch = () => {
    changePage(1);
};

// 表格相关
let columns = ref([
    { type: 'index', label: '序号', width: 55, align: 'center' },
    { prop: 'postId', label: '帖子ID' },
    { prop: 'userId', label: '发布者ID' },
    { prop: 'createdAt', label: '发帖时间' },
    { prop: 'operator', label: '操作', width: 250 },
])
const page = reactive({
    index: 1,
    size: 10,
    total: 0,
})
const tableData = ref<Post[]>([]);
const getData = async () => {
    const res = await fetchPostData()
    tableData.value = res.data.data;
    page.total = res.data.pageTotal;
};
getData();

const changePage = (val: number) => {
    page.index = val;
    getData();
};

// 新增/编辑弹窗相关
let options = ref<FormOption>({
    labelWidth: '100px',
    span: 12,
    list: [
        { type: 'input', label: '标题', prop: 'title', required: true },
        { type: 'input', label: '内容', prop: 'postContent', required: true },
    ]
})
const visible = ref(false);
const isEdit = ref(false);
const rowData = ref({});
const handleEdit = (row: Post) => {
    rowData.value = { ...row };
    isEdit.value = true;
    visible.value = true;
};
const updateData = () => {
    closeDialog();
    getData();
};

const closeDialog = () => {
    visible.value = false;
    isEdit.value = false;
};

// 查看详情弹窗相关
const visible1 = ref(false);
const viewData = ref({
    row: {},
    list: []
});
const handleView = (row: Post) => {
    viewData.value.row = { ...row }
    viewData.value.list = [
        {
            prop: 'postId',
            label: '帖子ID',
        },
        {
            prop: 'userId',
            label: '用户ID',
        },
        {
            prop: 'title',
            label: '标题',
        },
        {
            prop: 'postContent',
            label: '内容',
        },
        {
            prop: 'createdAt',
            label: '发帖时间',
        },
        {
            prop: 'cover',
            label: '图片',
        },
        {
            prop: 'topicId',
            label: '话题ID',
        },
    ]
    visible1.value = true;
};

const deleteData = async (postId: number) => {
    try {
        const response = await fetch(`http://localhost:1234/ccPost/delete/${postId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();
        getData();
    } catch (error) {
        ElMessage.error('删除请求失败');
        console.error(error);
    }
};

// 删除相关
const handleDelete = (row: Post) => {
    deleteData(row.postId);
    ElMessage.success('删除成功');
}
</script>

<style scoped></style>