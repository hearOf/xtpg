import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Iview from 'iview'
import 'iview/dist/styles/iview.css'
import "ztree";
import "ztree/css/metroStyle/metroStyle.css";
import 'xe-utils';
import VxeTable from 'vxe-table';
import 'vxe-table/lib/style.css';
Vue.use(Iview)
Vue.use(VxeTable);

Vue.config.productionTip = false

new Vue({
    router,
    store,
    data: function() {
        return {
            // portUrl: "ws://192.168.1.254:8088/websocket/"
            portUrl: "ws://192.168.1.252:8099/websocket/"
                // portUrl: "ws://172.16.10.10:8099/websocket/"
        }
    },
    render: h => h(App)
}).$mount('#app')