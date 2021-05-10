module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://www.ysqorz.top:8888/api/private/v1/',  // 此处为接口地址
        changeOrigin: true,   // 是否允许跨域
        pathRewrite: {  // 重写路径 目的是把/api开始的接口重写 （如/api/users 改成/users）
          '^/api': ''
        }
      }
    }
  }
}

