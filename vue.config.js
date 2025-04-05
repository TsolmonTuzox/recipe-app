const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  publicPath: '/',
  transpileDependencies: [],

  devServer: {
    headers: { 'Access-Control-Allow-Origin': '*' }
  },

  css: {
    loaderOptions: {
      scss: {
        additionalData: `
          @import "@/styles/variables.scss";
          @import "@/styles/mixins.scss";
        `
      }
    }
  }
});
