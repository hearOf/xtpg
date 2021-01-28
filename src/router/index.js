/*
 * @Author: GuFan
 * @Date: 2020-09-29 13:49:33
 * @LastEditTime: 2020-12-22 10:34:14
 * @LastEditors: Please set LastEditors
 * @Description: 添加权重计算
 * @FilePath: \vue-echarts\src\router\index.js
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
const Index = () =>
    import ("../views/Home.vue");
const WeightAdjust = () =>
    import ("../views/WeightAdjust.vue");
const PivotalFactorAnalysis = () =>
    import ("../views/PivotalFactorAnalysis.vue");
const IndicatorEdit = () =>
    import ("../views/indicatorEdit/index.vue");
const TestManagement = () =>
    import ("../views/testManagement/index.vue");
const WeightCalc = () =>
    import ("../views/weightCalc/index.vue");
const DataConfig = () =>
    import ("../views/dataConfig/index.vue");
const OriginalData = () =>
    import ("../views/originalData/index.vue");
const DataAnalyse = () =>
    import ("../views/dataAnalyse/index.vue");
const WeightAnalyse = () =>
    import ("../views/dataAnalyse/weightAnalyse.vue");
const IndicatorAnalyse = () =>
    import ("../views/dataAnalyse/indicatorAnalyse.vue");
const SyntheticalAnalyse = () =>
    import ("../views/dataAnalyse/syntheticalAnalyse.vue");
const PivotalIndicatorAnalyse = () =>
    import ("../views/dataAnalyse/pivotalIndicatorAnalyse.vue");
const OriginalDataAnalyse = () =>
    import ("../views/dataAnalyse/originalDataAnalyse.vue");

Vue.use(VueRouter)

const routes = [{
        path: '/',
        name: '首页',
        component: Index
    },

    {
        path: '/index',
        name: '系统评估',
        component: Index
    },
    {
        path: '/indicatorEdit',
        name: '指标编辑',
        component: IndicatorEdit
    },
    {
        path: '/testManagement',
        name: '试验管理',
        component: TestManagement
    },
    {
        path: '/weightCalc',
        name: '权重计算',
        component: WeightCalc
    },
    {
        path: '/dataConfig',
        name: '参数配置',
        component: DataConfig
    },
    {
        path: '/originalData',
        name: '原始数据',
        component: OriginalData
    },
    {
        path: '/dataAnalyse',
        name: '数据分析',
        component: DataAnalyse,
        redirect: '/syntheticalAnalyse',
        children: [{
                path: '/weightAnalyse',
                name: '权重分析',
                component: WeightAnalyse,
            },
            {
                path: '/indicatorAnalyse',
                name: '指标分析',
                component: IndicatorAnalyse,
            },
            {
                path: '/syntheticalAnalyse',
                name: '综合分析',
                component: SyntheticalAnalyse,
            },
            {
                path: '/pivotalIndicatorAnalyse',
                name: '关键指标分析',
                component: PivotalIndicatorAnalyse,
            },
            {
                path: '/originalDataAnalyse',
                name: '原始数据分析',
                component: OriginalDataAnalyse,
            }
        ]
    },

]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router