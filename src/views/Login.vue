<template>
  <div class="login">
    <div class="login_box">
      <div class="login_box_1">
        <img src="../assets/logo.png" alt="">
      </div>
      <div class="login_box_2">
        <el-form :model="form" :rules="rules" ref="resetForm">
          <el-form-item prop="username">
            <el-input prefix-icon="el-icon-user-solid" v-model="form.username" placeholder="请输入账号" clearable></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password" prefix-icon="el-icon-s-cooperation" v-model="form.password" placeholder="请输入密码"
              clearable></el-input>
          </el-form-item>
          <el-form-item class="whd1">
            <el-button type="primary" @click="loginForm">登录</el-button>
            <el-button type="info" @click="reset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        form: {
          username: 'admin',
          password: '123456'
        },
        // 表单校验规则
        rules: {
          username: [{
              required: true,
              message: '请输入账号',
              trigger: 'blur'
            },
            {
              min: 3,
              max: 10,
              message: '长度在 3 到 10 个字符',
              trigger: 'blur'
            }
          ],
          password: [{
              required: true,
              message: '请输入密码',
              trigger: 'blur'
            },
            {
              min: 3,
              max: 10,
              message: '长度在 3 到 10 个字符',
              trigger: 'blur'
            }
          ]
        }
      }
    },
    methods: {
      // 重置表单
      reset() {
        this.$refs.resetForm.resetFields();
      },
      // 登录发送请求
      loginForm() {
        this.$refs.resetForm.validate(async validate => {
          if (!validate) return;
          const {
            data: res
          } = await this.$http.post('login', this.form);
          if (res.meta.status !== 200) return this.$message.error('登录失败！');
          this.$message.success('恭喜你，登录成功了！');
          sessionStorage.setItem('Token', res.data.token);
          this.$router.push('/home')
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .login {
    height: 100%;
    background-color: #5dbe8a;
    position: relative;

    .login_box {
      background-color: #fff;
      width: 500px;
      height: 350px;
      border-radius: 5px;
      position: absolute;
      top: 50%;
      left: 50%;
      margin-left: -250px;
      margin-top: -200px;

      .login_box_1 {
        width: 150px;
        height: 150px;
        border: 1px solid #ccc;
        border-radius: 50%;
        padding: 8px;
        position: absolute;
        left: 50%;
        top: 0%;
        margin-left: -75px;
        margin-top: -75px;

        img {
          width: 150px;
          height: 150px;
          border-radius: 50%;
          background-color: #eee;
        }
      }
    }
  }

  .login_box_2 {
    margin-top: 140px;
    padding: 0 40px;
  }

  .whd1 {
    float: right;
  }
</style>
