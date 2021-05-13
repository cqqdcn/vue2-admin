<template>
  <div class="home">
    <el-container>
      <!-- 左侧导航栏 -->
      <el-aside :width="collapse?'64px':'200px'">
        <div class="homeTop">
          <img src="../assets/logo.png" alt="">
          <p v-show="!collapse">后台管理系统</p>
        </div>
        <el-menu :collapse-transition="false" unique-opened background-color="#304156" text-color="#fff"
          active-text-color="#409eff" :collapse="collapse" router :default-active="activepath">
          <!-- 一级栏目循环数据 -->
          <el-submenu :index="item.id + ''" v-for="(item,index) in menuList" :key="index">
            <template slot="title">
              <i :class="iconPic[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item-group>
              <!-- 二级栏目循环数据 -->
              <el-menu-item @click="activePath('/' + erjList.path,item.authName,erjList.authName)" :index="'/' + erjList.path"
                v-for="erjList in item.children" :key="erjList.id"><i class="el-icon-menu"></i>{{erjList.authName}}</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-container>
        <!-- 右侧头部 -->
        <el-header>
          <div class="headerLeft">
            <i :class="collapse?'el-icon-s-unfold':'el-icon-s-fold' " @click="hideMenu"></i>
            <!-- 头部面包屑 -->
            <el-breadcrumb separator-class="el-icon-arrow-right">
              <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
              <el-breadcrumb-item v-show="breadTit1">{{breadTit1}}</el-breadcrumb-item>
              <el-breadcrumb-item v-show="breadTit2">{{breadTit2}}</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          <!-- 推出登录 -->
          <div class="headerRight">
            <el-button type="info" @click="out">退出</el-button>
          </div>
        </el-header>
        <!-- 右侧主体内容 -->
        <el-main>
          <!-- 内容占位符 -->
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        menuList: [],
        iconPic: {
          125: 'el-icon-user-solid',
          103: 'el-icon-s-help',
          101: 'el-icon-s-goods',
          102: 'el-icon-s-data',
          145: 'el-icon-edit-outline'
        },
        collapse: false,
        activepath: '',
        breadTit1: '',
        breadTit2: ''
      }
    },
    created() {
      this.leftNav();
      this.activepath = sessionStorage.getItem('path')
      // 面包屑名称
      this.breadTit1 = sessionStorage.getItem('breadName1')
      this.breadTit2 = sessionStorage.getItem('breadName2')
    },
    methods: {
      // 退出登录并跳转到login
      out() {
        sessionStorage.clear('Token');
        this.$router.push('/login')
      },
      // 左侧菜单数据
      async leftNav() {
        const {
          data: res
        } = await this.$http.get('menus')
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
        this.menuList = res.data
      },
      // 点击折叠菜单
      hideMenu() {
        this.collapse = !this.collapse
      },
      // 点击跳转二级路径
      activePath(activepach, itemName, erjListName) {
        // 缓存传入的路径
        sessionStorage.setItem('path', activepach)
        this.activepath = activepach
        // 传入面包屑名称
        sessionStorage.setItem('breadName1', itemName)
        sessionStorage.setItem('breadName2', erjListName)
        this.breadTit1 = itemName
        this.breadTit2 = erjListName
      }
    }
  }
</script>

<style lang="less" scoped>
  .homeTop {
    display: flex;
    flex-direction: row;
    align-items: center;
    line-height: 60px;
    justify-content: center;

    img {
      width: 30px;
      display: block;
      margin-right: 10px;
    }

    p {
      color: #fff;
      font-size: 16px;
    }
  }

  .el-container {
    height: 100%;
  }

  .el-aside {
    background-color: #304156;
    height: 100%;
  }

  .home {
    height: 100%;
  }

  .el-header {
    background-color: #fff;
  }

  .el-main {
    background-color: #f0f2f5;
  }

  .el-menu {
    border-right: 0;
  }

  .el-menu-item-group {
    margin-top: -14px;
  }

  .el-header {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    .headerLeft {
      width: 40%;
      display: flex;
      flex-direction: row;
      align-items: center;

      i {
        margin-right: 8%;
        font-size: 20px;
        cursor: pointer;
      }
    }
  }
</style>
