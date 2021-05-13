<template>
  <div class="user">
    <el-card class="box-card">
      <el-row :gutter="20" class="box-card-1">
        <el-col :span="7">
          <el-input placeholder="请输入内容" v-model="paramsQuery.query" class="input-with-select">
            <el-button slot="append" icon="el-icon-search" @click="getUsers"></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="addUser">添加用户</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <!-- 用户列表 -->
          <el-table :data="tableData" style="width: 100%" border stripe>
            <el-table-column type="index" :index="1" label="#">
            </el-table-column>
            <el-table-column prop="username" label="姓名">
            </el-table-column>
            <el-table-column prop="email" label="邮箱">
            </el-table-column>
            <el-table-column prop="mobile" label="电话">
            </el-table-column>
            <el-table-column prop="role_name" label="角色">
            </el-table-column>
            <el-table-column prop="mg_state" label="状态">
              <!-- 用作用域插槽获取单列数据  slot-scope="scope"-->
              <template slot-scope="scope">
                <el-switch v-model="scope.row.mg_state" active-color="#409eff" inactive-color="#dcdfe6" @change="changeType(scope.row.mg_state,scope.row.id)">
                </el-switch>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" content="编辑用户" placement="top">
                  <el-button type="primary" icon="el-icon-edit" size="mini" @click="editUserClick(scope.row.id)"></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="更改用户权限" placement="top">
                  <el-button type="warning" icon="el-icon-setting" size="mini" @click="roleUserClick(scope.row)"></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="删除用户" placement="top">
                  <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserClick(scope.row.id)"></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <el-pagination :page-size="6" layout="total, sizes, prev, pager, next, jumper" :total="totalpage" :page-sizes="[10, 20, 30, 40,50,60,70]">
          </el-pagination>
        </el-col>
      </el-row>
    </el-card>
    <!-- 添加用户 -->
    <el-dialog title="添加用户" :visible.sync="dialogVisible" width="50%">
      <el-form ref="formRef" :rules="addUserRules" :model="formText">
        <el-form-item label="用户名" prop="username" label-width="70px">
          <el-input v-model="formText.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" label-width="70px">
          <el-input type="password" v-model="formText.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email" label-width="70px">
          <el-input v-model="formText.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile" label-width="70px">
          <el-input v-model="formText.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addYanzheng">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑用户 -->
    <el-dialog title="编辑用户" :visible.sync="editUserShow" width="50%">
      <el-form ref="editFormRef" :rules="editUserRules" :model="editformText">
        <el-form-item label="用户名" label-width="70px">
          <el-input v-model="editformText.username" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email" label-width="70px">
          <el-input v-model="editformText.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile" label-width="70px">
          <el-input v-model="editformText.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editUserShow = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑用户 -->
    <el-dialog title="分配角色" :visible.sync="roleShow" width="50%">
      <el-form>
        <div class="role_1">
          <p>当前的用户: {{roleUserName}}</p>
          <p>当前的角色: {{roleJueshe}}</p>
        </div>
        <div class="role_2">
          <p>分配角色:</p>
          <el-select v-model="raleValue" placeholder="请选择">
            <el-option v-for="item in options" :key="item.id" :label="item.roleName" :value="item.id">
            </el-option>
          </el-select>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="roleShow = false">取 消</el-button>
        <el-button type="primary" @click="roleUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      // 验证邮箱的校验规则
      var checkEmail = (rule, value, callback) => {
        // 验证邮箱的正则表达式
        const regEmail = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
        if (regEmail.test(value)) {
          // 合法邮箱
          return callback()
        }
        callback(new Error('请输入合法的邮箱'))
      }
      // 验证手机号的校验规则
      var checkMobile = (rule, value, callback) => {
        const regMobile = /^(13[0-9]|14[01456879]|15[0-3,5-9]|16[2567]|17[0-8]|18[0-9]|19[0-3,5-9])\d{8}$/
        if (regMobile.test(value)) {
          // 合法邮箱
          return callback()
        }
        callback(new Error('请输入合法的手机号'))
      }
      return {
        input: '',
        paramsQuery: {
          query: '',
          pagenum: '1',
          pagesize: '20'
        },
        totalpage: Number(),
        tableData: [],
        value: '',
        // 控制表单显示掩藏
        dialogVisible: false,
        // 编辑用户控制表单显示掩藏
        editUserShow: false,
        // 表单数据内容
        formText: {
          username: '',
          password: '',
          email: '',
          mobile: ''
        },
        // 编辑用户表单内容
        editformText: {},
        // 验证表单规则
        addUserRules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 6, max: 15, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
          ],
          email: [
            { required: true, message: '请输入邮箱', trigger: 'blur' },
            { validator: checkEmail, trigger: 'blur' }
          ],
          mobile: [
            { required: true, message: '请输入手机', trigger: 'blur' },
            { validator: checkMobile, trigger: 'blur' }
          ]
        },
        // 验证表单规则
        editUserRules: {
          email: [
            { required: true, message: '请输入邮箱', trigger: 'blur' },
            { validator: checkEmail, trigger: 'blur' }
          ],
          mobile: [
            { required: true, message: '请输入手机', trigger: 'blur' },
            { validator: checkMobile, trigger: 'blur' }
          ]
        },
        // 控制角色分配隐藏和显示
        roleShow: false,
        roleUserName: '',
        roleJueshe: '',
        // 角色列表
        options: [],
        raleValue: '',
        // 当前点击列ID
        roleId: ''
      }
    },
    created() {
      this.getUsers();
    },
    methods: {
      // 请求获取用户列表
      async getUsers() {
        const { data: res } = await this.$http.get('users', { params: this.paramsQuery })
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.tableData = res.data.users
        this.pagenum = res.data.pagenum
        this.totalpage = res.data.total
      },
      // 监听用户状态
      async changeType(value, id) {
        const { data: res } = await this.$http.put(`users/${id}/state/${value}`)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
      },
      // 添加用户
      addUser() {
        this.dialogVisible = !this.dialogVisible
      },
      // 点击验证表单的规则是否满足
      addYanzheng() {
        this.$refs.formRef.validate(async vaule => {
          if (vaule !== true) return this.$message.error('表单验证不通过！')
          const { data: res } = await this.$http.post('users', this.formText)
          if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
          this.$message.success(res.meta.msg)
          // 添加成功后重置表单
          this.$refs.formRef.resetFields()
          this.dialogVisible = false
          this.getUsers()
        })
      },
      // 点击显示编辑修改用户
      async editUserClick(id) {
        const { data: res } = await this.$http.get('users/' + id)
        if (res.meta.status !== 200) return
        this.editUserShow = true
        this.editformText = res.data
      },
      // 点击验证编辑用户的提交
      editUser() {
        this.$refs.editFormRef.validate(async vaule => {
          if (!vaule) return
          const { data: res } = await this.$http.put(`users/${this.editformText.id}`, {
            email: this.editformText.email,
            mobile: this.editformText.mobile
          })
          if (res.meta.status !== 200) return this.$message.error('修改用户信息失败')
          this.$message.success(res.meta.msg)
          this.editformText = res.data
          this.editUserShow = false
          this.getUsers()
        })
      },
      // 更改用户权限
      async roleUserClick(roleInfo) {
        this.roleUserName = roleInfo.username
        this.roleJueshe = roleInfo.role_name
        this.roleId = roleInfo.id
        const { data: res } = await this.$http.get('roles')
        if (res.meta.status !== 200) return Error(res.meta.msg)
        console.log(res.data)
        this.options = res.data
        this.roleShow = true
      },
      // 点击确定后验证规则的回调函数
      async roleUser() {
        if (!this.raleValue) return this.$message.error('请选择角色！')
        const { data: res } = await this.$http.put(`users/${this.roleId}/role`, { rid: this.raleValue })
        if (res.meta.status !== 200) return Error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.getUsers()
        this.roleShow = false
      },
      // 删除单个用户
      async removeUserClick(id) {
        this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const { data: res } = await this.$http.delete(`users/${id}`)
          if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
          this.$message.success('已成功删除')
          this.getUsers()
        }).catch(() => {
          this.$message.info('已取消删除')
        });
      }
    }
  }
</script>

<style lang="less" scoped>
  .box-card-1 {
    margin-bottom: 20px;
  }

  .el-pagination {
    margin-top: 15px;
  }

  .role_1 p {
    font-size: 15px;
    line-height: 35px;
  }

  .role_2 {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .role_2 p {
    margin-right: 5px;
  }
</style>
