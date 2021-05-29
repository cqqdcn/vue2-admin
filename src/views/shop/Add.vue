<template>
  <div>
    <el-card>
      <el-row class="addShop_top">
        <el-col :span="24">
          <i class="el-icon-info"></i>
          <p>添加商品信息</p>
        </el-col>
      </el-row>
      <!-- 步骤条 -->
      <el-row class="addShop_center">
        <el-col :span="16">
          <el-steps :active="active - 0" finish-status="success" align-center>
            <el-step title="基本信息"></el-step>
            <el-step title="商品参数"></el-step>
            <el-step title="商品属性"></el-step>
            <el-step title="商品图片"></el-step>
            <el-step title="商品内容"></el-step>
            <el-step title="完成"></el-step>
          </el-steps>
        </el-col>
      </el-row>
      <!-- tab -->
      <el-form :model="tabForm" :rules="tabRules" ref="ruleFormRef" label-width="60px" class="demo-ruleForm"
        label-position="top">
        <el-row class="addShop_bot">
          <el-col :span="24">
            <el-tabs :tab-position="tabPosition" v-model="active" :before-leave="tabLeave" @tab-click="tabClicked">
              <el-tab-pane label="基本信息" name="0">
                <el-form-item label="商品分类" prop="goods_cat">
                  <el-cascader v-model="tabForm.goods_cat" :options="options" :props="creatProp" clearable></el-cascader>
                </el-form-item>
                <el-form-item label="商品名称" prop="goods_name">
                  <el-input v-model="tabForm.goods_name"></el-input>
                </el-form-item>
                <el-form-item label="商品价格（元）" prop="goods_price">
                  <el-input v-model="tabForm.goods_price"></el-input>
                </el-form-item>
                <el-form-item label="商品数量" prop="goods_number">
                  <el-input v-model="tabForm.goods_number"></el-input>
                </el-form-item>
                <el-form-item label="商品重量" prop="goods_weight">
                  <el-input v-model="tabForm.goods_weight"></el-input>
                </el-form-item>
              </el-tab-pane>
              <el-tab-pane label="商品参数" name="1">
                <el-form-item v-for="item in shopCanshu" :key="item.id" :label="item.attr_name">
                  <el-checkbox-group v-model="item.attr_vals">
                    <el-checkbox :label="cb" v-for="(cb,i) in item.attr_vals" :key="i" border></el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </el-tab-pane>
              <el-tab-pane label="商品属性" name="2">
                <el-form-item :label="vauleItem.attr_name" v-for="vauleItem in shopVaule" :key="vauleItem.id">
                  <el-input v-model="vauleItem.attr_vals"></el-input>
                </el-form-item>
              </el-tab-pane>
              <el-tab-pane label="商品图片" name="3">
                <el-upload class="upload-demo" :action="impUrl" :on-preview="handlePreview" :on-remove="handleRemove"
                  list-type="picture" :headers="headers" :on-success="successPic">
                  <el-button size="small" type="primary">点击上传</el-button>
                </el-upload>
              </el-tab-pane>
              <el-tab-pane label="商品内容" name="4">
                <!-- 安装运行依赖vue-quill-editor富文本编辑器 -->
                <quill-editor v-model="tabForm.goods_introduce">
                </quill-editor>
                <el-button type="primary" class="buttt" @click="addAllShop">添加商品</el-button>
              </el-tab-pane>
            </el-tabs>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <!-- 图片弹出层 -->
    <el-dialog title="图片" :visible.sync="dialogPic" width="60%">
      <img :src="clickPic" alt="">
    </el-dialog>
  </div>
</template>

<script>
  import _ from 'lodash'
  export default {
    data() {
      return {
        active: '0',
        tabPosition: 'left',
        tabForm: {
          goods_cat: [],
          goods_name: 0,
          goods_price: 0,
          goods_number: 0,
          goods_weight: 0,
          // 上传图片
          pics: [],
          // 富文本编辑器
          goods_introduce: '',
          attrs: []
        },
        // 获取请求商品列表数据
        options: [],
        creatProp: {
          value: 'cat_id',
          label: 'cat_name',
          children: 'children',
          expandTrigger: 'hover'
        },
        // 验证表单规则
        tabRules: {
          goods_cat: [
            { required: true, message: '请输入商品分类', trigger: 'blur' }
          ],
          goods_name: [
            { required: true, message: '请输入商品名称', trigger: 'blur' }
          ],
          goods_price: [
            { required: true, message: '请输入商品价格', trigger: 'blur' }
          ],
          goods_number: [
            { required: true, message: '请输入商品数量', trigger: 'blur' }
          ],
          goods_weight: [
            { required: true, message: '请输入商品重量', trigger: 'blur' }
          ]
        },
        // 商品参数
        shopCanshu: [],
        // 商品属性
        shopVaule: [],
        // 图片上传接口地址
        impUrl: 'http://www.ysqorz.top:8888/api/private/v1/upload',
        // 请求接口权限headers
        headers: {
          Authorization: sessionStorage.getItem('Token')
        },
        // 控制弹出层显示隐藏
        dialogPic: false,
        clickPic: ''
      }
    },
    created() {
      this.shopFenglei()
    },
    methods: {
      async shopFenglei() {
        const { data: res } = await this.$http.get('categories')
        if (res.meta.status !== 200) return this.$message.error('获取商品列表失败')
        this.options = res.data
      },
      // 点击下一个tab
      tabLeave(activeName, oldActiveName) {
        let on = false
        this.$refs.ruleFormRef.validate(vaule => {
          if (!vaule) return this.$message.error('请填写完整商品的基本信息')
          on = true
        })
        return on
      },
      // 点击获取选中
      async tabClicked() {
        if (this.active === '1') {
          const { data: res } = await this.$http.get(`categories/${this.cataId}/attributes`, {
            params: { sel: 'many' }
          })
          if (res.meta.status !== 200) return this.$message.error('获取商品列表失败')
          res.data.forEach(item => {
            item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
          })
          this.shopCanshu = res.data
        } else if (this.active === '2') {
          const { data: res } = await this.$http.get(`categories/${this.cataId}/attributes`, {
            params: { sel: 'only' }
          })
          if (res.meta.status !== 200) return this.$message.error('获取商品列表失败')
          this.shopVaule = res.data
        }
      },
      // 处理图片预览效果
      handlePreview(file) {
        this.clickPic = file.response.data.url
        this.dialogPic = true
      },
      // 处理移除图片的操作
      handleRemove(file) {
        // console.log(file)
        //  1、获取将要删除的图片的临时路径
        const filePath = file.response.data.tmp_path
        //  2、从pics数组中，找到这个图片对应的索引值
        const picIndex = this.tabForm.pics.findIndex(x =>
          x.pic === filePath
        )
        //  3、调用数组的 splice 方法，把图片信息对象从数组中移除
        this.tabForm.pics.splice(picIndex, 1)
        console.log(this.tabForm)
      },
      // 图片上传成功的函数
      successPic(response) {
        const pic1 = { pic: response.data.tmp_path }
        this.tabForm.pics.push(pic1)
        console.log(this.tabForm)
      },
      // 提交添加的商品信息
      async addAllShop() {
        // 商品分类级联选择器要求goods_cat为数组，而发起请求的数据goods_cat为字符串，
        // 深拷贝tabForm对象处理此问题
        // lodash  cloneDeep(obj)
        const form = _.cloneDeep(this.tabForm)
        form.goods_cat = form.goods_cat.join(',')
        // 处理动态参数
        this.shopCanshu.forEach(item => {
          const newInfo = { attr_id: item.attr_id, attr_value: item.attr_vals.join(' ') }
          this.tabForm.attrs.push(newInfo)
        })
        // 处理静态属性
        this.shopVaule.forEach(item => {
          const newInfo = { attr_id: item.attr_id, attr_value: item.attr_vals }
          this.tabForm.attrs.push(newInfo)
        })
        form.attrs = this.tabForm.attrs
        console.log(form)
        //  发起请求
        //  商品的名称，必须是唯一
        const { data: res } = await this.$http.post('goods', form)
        console.log(res)
        if (res.meta.status !== 201) return this.$message.error('获取商品列表失败')
        this.$message.success('添加商品成功！')
        this.$router.push('/goods')
      }
    },
    computed: {
      cataId() {
        if (this.tabForm.goods_cat.length === 3) {
          return this.tabForm.goods_cat[2]
        }
        return null
      }
    }
  }
</script>

<style lang="less" scoped>
  .addShop_top {
    background-color: #f4f4f5;
    padding: 15px 0;

    .el-col {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;

      .el-icon-info {
        font-size: 18px;
        color: #909399;
      }

      p {
        margin-left: 7px;
        color: #909399;
      }
    }
  }

  .addShop_center {
    margin: 30px 0 30px 10px;
  }

  /deep/.el-step__title {
    font-size: 14px;
  }

  .el-dialog {
    img {
      width: 100%;
      height: auto;
    }
  }

  /deep/.ql-container {
    height: 400px;
  }

  .buttt {
    margin-top: 15px;
  }

  .el-popper  {
    height: 300px!important;
  }
</style>
