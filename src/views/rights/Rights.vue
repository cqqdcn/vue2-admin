<template>
  <div>
    <el-card class="box-card">
      <el-table :data="rightsData" stripe style="width: 100%" border>
        <el-table-column label="#" width="50" type="index">
        </el-table-column>
        <el-table-column prop="authName" label="权限名称">
        </el-table-column>
        <el-table-column prop="path" label="路径">
        </el-table-column>
        <el-table-column prop="level" label="权限等级" v-slot="scope">
          <el-tag v-if="scope.row.level==='0'">一级</el-tag>
          <el-tag v-else-if="scope.row.level==='1'" type="success">二级</el-tag>
          <el-tag v-else-if="scope.row.level==='2'" type="warning">三级</el-tag>
          <!-- <el-tag v-else type="danger">四级</el-tag> -->
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        rightsData: []
      }
    },
    created() {
      this.rigthsRequest()
    },
    methods: {
      async rigthsRequest() {
        const { data: res } = await this.$http.get('rights/list')
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.rightsData = res.data
        this.$message.success(res.meta.msg)
      }
    }
  }
</script>

<style>
</style>
