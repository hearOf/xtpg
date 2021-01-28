const webpack = require("webpack");
module.exports = {
    lintOnSave: false, //关闭eslint校验
    devServer: {
        port: 8087,
        proxy: {
            '/api': { //这里最好有一个 /
                // target: 'http://192.168.1.254:8088', // 后台接口域名
                target: 'http://192.168.1.252:8099', // 后台接口域名
                // target: 'http://172.16.10.10:8099', // 后台接口域名
                ws: true, //如果要代理 websockets，配置这个参数
                secure: false, // 如果是https接口，需要配置这个参数
                changeOrigin: true, //是否跨域
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    },
    configureWebpack: {
        //支持jquery
        plugins: [
            new webpack.ProvidePlugin({
                $: "jquery",
                jQuery: "jquery",
                "windows.jQuery": "jquery"
            })
        ]
    },

}