<template>
  <div>
    <el-card class="box-card">
      <div class="bore-bot">
        <el-button type="primary" @click="addClick">添加角色</el-button>
      </div>
      <el-table :data="roleTableData" style="width: 100%" border stripe>
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-row v-for="(item1,index1) in props.row.children" :key="index1">
              <el-col :span="5">
                <el-tag closable @close="removeTag(props.row,item1.id)">
                  {{item1.authName}}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19" class="border">
                <div class="erji" v-for="item2 in item1.children" :key="item2.id">
                  <div class="whdk">
                    <el-tag closable type="success" @close="removeTag(props.row,item2.id)">
                      {{item2.authName}}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </div>
                  <div class="shanji">
                    <el-tag closable type="warning" v-for="item3 in item2.children" :key="item3.id" @close="removeTag(props.row,item3.id)">
                      {{item3.authName}}
                    </el-tag>
                  </div>
                </div>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="#" type="index" width="50px">
        </el-table-column>
        <el-table-column label="角色名称" prop="roleName">
        </el-table-column>
        <el-table-column label="角色描述" prop="roleDesc">
        </el-table-column>
        <el-table-column label="操作" prop="desc">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="small" @click="editInfo(scope.row)">编辑</el-button>
            <el-button type="warning" icon="el-icon-edit" size="small" @click="roleClick(scope.row)">分配权限</el-button>
            <el-button type="danger" icon="el-icon-edit" size="small" @click="removeRole(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色信息弹窗 -->
    <el-dialog title="添加角色" :visible.sync="addShow" width="50%">
      <el-form ref="addFormRef" :rules="addUser" :model="addformText">
        <el-form-item label="角色名称" label-width="80px" prop="roleName">
          <el-input v-model="addformText.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" label-width="80px" prop="roleDesc">
          <el-input v-model="addformText.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addShow = false">取 消</el-button>
        <el-button type="primary" @click="clickRule">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改角色信息弹窗 -->
    <el-dialog title="编辑角色" :visible.sync="editShow" width="50%">
      <el-form ref="editFormRef" :rules="editUser" :model="editformText">
        <el-form-item label="角色名称" label-width="80px" prop="roleName">
          <el-input v-model="editformText.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" label-width="80px">
          <el-input v-model="editformText.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editShow = false">取 消</el-button>
        <el-button type="primary" @click="clickEdit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限表单 -->
    <el-dialog title="分配权限" :visible.sync="roleShow" width="50%" @close="monitorClose">
      <el-tree ref="treeRef" :data="roleData" show-checkbox node-key="id" :props="roleProps" :default-checked-keys="defKeys"
        default-expand-all>
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="roleShow = false">取 消</el-button>
        <el-button type="primary" @click="clickRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        roleTableData: [],
        addShow: false,
        addformText: {
          roleName: '',
          roleDesc: ''
        },
        // 添加角色验证规则
        addUser: {
          roleName: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
          ]
        },
        // 控制编辑信息显示隐藏
        editShow: false,
        // 编辑添加角色验证规则
        editUser: {
          roleName: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
          ]
        },
        editformText: {
          roleName: '',
          roleDesc: ''
        },
        id: '',
        // 权限表单显示隐藏
        roleShow: false,
        roleData: [],
        node_key: '',
        roleProps: {
          children: 'children',
          label: 'authName'
        },
        defKeys: [],
        // 当前点击权限ID
        roleId: ''
      }
    },
    created() {
      this.roleRequest();
    },
    methods: {
      async roleRequest() {
        const { data: res } = await this.$http.get('roles')
        this.roleTableData = res.data
      },
      // 添加角色
      addClick() {
        this.addShow = true
      },
      // 点击确认添加角色的验证规则
      clickRule() {
        this.$refs.addFormRef.validate(async value => {
          if (!value) return this.$message.error('请输入正确的内容')
          const { data: res } = await this.$http.post('roles', this.addformText)
          if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
          this.$message.success(res.meta.msg)
          this.roleRequest()
          this.$refs.addFormRef.resetFields()
          this.addShow = false
        })
      },
      // 显示编辑角色弹出表单
      editInfo(vaule) {
        this.editformText.roleName = vaule.roleName
        this.editformText.roleDesc = vaule.roleDesc
        this.id = vaule.id
        this.editShow = true
      },
      clickEdit() {
        this.$refs.editFormRef.validate(async value => {
          if (!value) return this.$message.error('请输入正确的内容')
          const { data: res } = await this.$http.put(`roles/${this.id}`, this.editformText)
          if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
          this.$message.success(res.meta.msg)
          this.roleRequest()
          this.editShow = false
        })
      },
      // 分配权限表单显示隐藏
      async roleClick(role) {
        this.roleId = role.id
        const { data: res } = await this.$http.get('rights/tree')
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.roleData = res.data
        this.node_key = res.data.id
        this.getLeafKeys(role, this.defKeys)
        this.roleShow = true
      },
      // 权限表单请求数据
      async clickRole() {
        const keys = [
          ...this.$refs.treeRef.getCheckedKeys(),
          ...this.$refs.treeRef.getHalfCheckedKeys()
        ]
        const whd = keys.join(',')
        const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: whd })
        if (res.meta.status !== 200) return this.$message.error('权限分配失败')
        this.$message.success(res.meta.msg)
        this.roleRequest()
        this.roleShow = false
      },
      // 通过递归的形式，获取角色下所有三级权限的 ID，并保存到 defKeys 数组中
      getLeafKeys(node, arr) {
        // 如果当前node不包含 children 属性，则是三级节点
        if (!node.children) {
          return arr.push(node.id)
        }
        node.children.forEach(item => {
          this.getLeafKeys(item, arr)
        })
      },
      // 监听关闭表单后的事件
      monitorClose() {
        this.defKeys = []
      },
      // 删除角色
      async removeRole(id) {
        this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const { data: res } = await this.$http.delete(`roles/${id}`)
          if (res.meta.status !== 200) return this.$message.error(res.mata.msg)
          this.$message.success(res.meta.msg)
          this.roleRequest()
        }).catch(() => {
          this.$message.info('已取消删除')
        });
      },
      // 删除权限标签
      async removeTag(roleId, rightId) {
        this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const { data: res } = await this.$http.delete(`roles/${roleId.id}/rights/${rightId}`)
          if (res.meta.status !== 200) return this.$message.error('取消权限失败')
          this.$message.success(res.meta.msg)
          roleId.children = res.data
        }).catch(() => {
          this.$message.info('已取消删除')
        });
      }
    }
  }
</script>

<style lang="less" scoped>
  .bore-bot {
    margin-bottom: 15px;
  }

  .cell {
    font-weight: bold !important;
  }

  .el-row {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .border {
    padding: 5px 0;

    .whdk {
      margin-right: 60px;
    }

    i {
      margin-left: 10px;
    }

    .shanji {
      display: flex;
      flex-direction: column;
      margin-left: 60px !important;

      .el-tag {
        margin: 5px 0;
      }
    }

    .erji {
      display: flex;
      flex-direction: row;
      align-items: center;
      border-bottom: 1px solid #eee;

      div {
        margin: 10px 0;
      }
    }
  }
</style>
