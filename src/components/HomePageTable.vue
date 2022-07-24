<template>
  <div class="tableContainer">
    <el-button  @click="deleteSelectedRow" type="danger">Delete</el-button>
    <el-table
        :data="tableData"
        style="width: 100%"
        ref="elTable"
    >
        <el-table-column type="selection" width="70"/>
            
        
        <el-table-column
            v-for="(item, index) in tableLabel" :key="index"
            :prop="item"
            :label="item"
            width="250"
            align="center" 
            header-align="left"
        >
        </el-table-column>

        

    </el-table>

    <!-- 分页 -->
    <el-pagination
        class="pagination"
        layout="prev, pager, next"
        :total="pagination.tableDataLength"
        :page-size="10"
        v-model:current-page="pagination.page"
        @current-change="handlePagination"
    >
    </el-pagination>
  </div>
</template>

<script>
import { ElTable,ElButton,ElTableColumn,ElPagination } from 'element-plus'
import {ref} from 'vue'

export default {
    setup(props,context){
        console.log(`props.tableData ${props.tableData}`)
        
        //initialize 
        const elTable = ref()

        function handlePagination(page){
            context.emit('pageChange',page)
        }

        //handle delete
        function deleteSelectedRow(){
            
            context.emit('deleteRow',elTable.value.getSelectionRows())
        }
        return {elTable,handlePagination,deleteSelectedRow}
    },
    props:['tableData','tableLabel','pagination'],
    components:{ElTable,ElButton,ElTableColumn,ElPagination}
}
</script>

<style lang="less">
.tableContainer{
    height:520px;
    //background-color:aquamarine;
    position: relative;

    .pagination{
        position: absolute;
        bottom: 0;
        right:20px;
    }

    .cell{
        text-align: center !important;
    }
}



</style>