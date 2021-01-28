import axios from 'axios' // 引入axios插件
export function getHttp(url, callFun) { //get请求方法
    axios.get(url).then(callFun)
        .catch(function(err) {
            console.log(err)
        })
}

export function postHttp(url, callFun) { //post请求方法
    axios.post(url).then(callFun)
        .catch(function(err) {
            console.log(err)
        })
}

export function getHttpParams(url, callFun, params) { //post请求方法
    axios.get(url, {
            params: params
        })
        .then(callFun)
        .catch(function(error) {
            console.log(error);
        });
}