<template>
  <div>
    <el-card class="box-card">
      <el-row class="box-card-1">
        <el-col :span="9">
          <el-input placeholder="请输入内容" class="input-with-select" v-model="shopChanshu.query" clearable>
            <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="6" class="but">
          <el-button type="primary" @click="addShop">添加商品</el-button>
        </el-col>
      </el-row>
      <el-row class="box-card-2">
        <el-table :data="shopData" stripe style="width: 100%" border>
          <el-table-column prop="date" label="#" type="index">
          </el-table-column>
          <el-table-column prop="goods_name" label="商品名称">
          </el-table-column>
          <el-table-column prop="goods_price" label="价格(元)" width="90px">
          </el-table-column>
          <el-table-column prop="goods_number" label="商品数量" width="90px">
          </el-table-column>
          <el-table-column prop="goods_weight" label="商品重量" width="90px">
          </el-table-column>
          <el-table-column prop="add_time" label="创建时间" width="180px">
            <template slot-scope="scope">
              {{scope.row.add_time | dateFormat}}
            </template>
          </el-table-column>
          <el-table-column prop="address" label="操作" width="120px">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="editPage(scope.row.goods_id)"></el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeShop(scope.row.goods_id)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="shopChanshu.pagenum"
        :page-sizes="[4, 8, 12, 16, 20]" :page-size="shopChanshu.pagesize" layout="sizes,total,prev, pager, next, jumper"
        :total="total" background>
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        shopData: [],
        shopChanshu: {
          query: '',
          pagenum: 1,
          pagesize: 8
        },
        total: 0
      }
    },
    created() {
      this.shopRequest()
    },
    methods: {
      // 请求商品列表
      async shopRequest() {
        const { data: res } = await this.$http.get('goods', { params: this.shopChanshu })
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.shopData = res.data.goods
        this.total = res.data.total
      },
      // 监听pageSize的参数对象
      handleSizeChange(newSize) {
        this.shopChanshu.pagesize = newSize
        this.shopRequest()
      },
      // 监听 页码值 的改变
      handleCurrentChange(newPage) {
        this.shopChanshu.pagenum = newPage
        this.shopRequest()
      },
      // 搜索
      search() {
        this.shopRequest()
      },
      // 删除一条商品信息
      async removeShop(id) {
        this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const { data: res } = await this.$http.delete(`goods/${id}`)
          if (res.meta.status !== 200) return this.$message.error(res.mata.msg)
          this.$message.success(res.meta.msg)
          this.shopRequest()
        }).catch(() => {
          this.$message.info('已取消删除')
        });
      },
      // 添加商品
      addShop() {
        this.$router.push('/goods/add')
      },
      // 跳转到编辑商品
      editPage(goodsId) {
        this.$router.push(`/goods/edit/${goodsId}`)
      }
    }
  }
</script>

<style lang="less" scoped>
  .but {
    margin-left: 20px;
  }

  .box-card-2 {
    margin-top: 15px;
  }

  .el-table thead {
    font-weight: bold !important;
  }

  .el-pagination {
    margin-top: 15px;
  }
</style>
