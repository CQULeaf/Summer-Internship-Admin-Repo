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
import { Topic } from '@/types/user';
import { fetchTopicData } from '@/api';
import TableCustom from '@/components/table-custom.vue';
import TableDetail from '@/components/table-detail.vue';
import TableSearch from '@/components/table-search.vue';
import { FormOption, FormOptionList } from '@/types/form-option';

// 查询相关
const query = reactive({
    name: '',
});
const searchOpt = ref<FormOptionList[]>([
    { type: 'input', label: '话题ID：', prop: 'topicId' }
])
const handleSearch = () => {
    changePage(1);
};

// 表格相关
let columns = ref([
    { type: 'index', label: '序号', width: 55, align: 'center' },
    { prop: 'topicId', label: '话题ID' },
    { prop: 'name', label: '话题名称' },
    { prop: 'description', label: '话题描述' },
    { prop: 'operator', label: '操作', width: 250 },
])
const page = reactive({
    index: 1,
    size: 10,
    total: 0,
})
const tableData = ref<Topic[]>([]);
const getData = async () => {
    const res = await fetchTopicData()
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
        { type: 'input', label: '话题名称', prop: 'name', required: true },
        { type: 'input', label: '封面', prop: 'cover', required: true },
        { type: 'input', label: '话题描述', prop: 'description', required: true },
    ]
})
const visible = ref(false);
const isEdit = ref(false);
const rowData = ref({});
const handleEdit = (row: Topic) => {
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
const handleView = (row: Topic) => {
    viewData.value.row = { ...row }
    viewData.value.list = [
        {
            prop: 'topicId',
            label: '话题ID',
        },
        {
            prop: 'name',
            label: '话题名称',
        },
        {
            prop: 'cover',
            label: '封面',
        },
        {
            prop: 'description',
            label: '话题描述',
        },
        {
            prop: 'postCount',
            label: '发帖数量',
        },
    ]
    visible1.value = true;
};

const deleteData = async (topicId: number) => {
    try {
        const response = await fetch(`http://localhost:1234/corner/deleteTopic/${topicId}`, {
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
const handleDelete = (row: Topic) => {
    deleteData(row.topicId);
    ElMessage.success('删除成功');
}
</script>

<style scoped></style>