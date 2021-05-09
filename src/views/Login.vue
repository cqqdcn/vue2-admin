<template>
  <div class="login">
    <div class="login_box">
      <div class="login_box_1">
        <img src="../assets/logo.png" alt="">
      </div>
      <div class="login_box_2">
        <el-form :model="form" :rules="rules">
          <el-form-item prop="formName">
            <el-input prefix-icon="el-icon-user-solid" v-model="form.formName" placeholder="请输入账号"></el-input>
          </el-form-item>
          <el-form-item prop="formPassWord">
            <el-input type="password" prefix-icon="el-icon-s-cooperation" v-model="form.formPassWord" placeholder="请输入密码"
              ></el-input>
          </el-form-item>
          <el-form-item class="whd1">
            <el-button type="primary">登录</el-button>
            <el-button type="info">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        form: {
          formName: '',
          formPassWord: ''
        },
        rules: {
          formName: [{
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
          formPassWord: [{
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
