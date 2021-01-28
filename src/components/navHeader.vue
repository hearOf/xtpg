<!--
 * @Author: GuFan
 * @Date: 2020-11-11 14:20:29
 * @LastEditTime: 2020-12-22 10:36:31
 * @LastEditors: Please set LastEditors
 * @Description: 添加权重计算路由
 * @FilePath: \vue-echarts\src\components\navHeader.vue
-->
<template>
  <div class="header">
    <!-- <router-link to="/index">评估指标</router-link>

    <router-link to="/weightAdjust">权重调整</router-link> -->
    <router-link to="/index">
      <div class="header-center">系统评估</div>
    </router-link>
    <router-link to="/testManagement">试验管理</router-link>
    <router-link to="/indicatorEdit">指标编辑</router-link>
    <router-link to="/weightCalc">权重计算</router-link>
    <router-link to="/dataConfig">参数配置</router-link>
    <router-link to="/originalData">原始数据</router-link>
    <router-link to="/dataAnalyse">数据分析</router-link>
    <!-- <router-link to="">评估方案对比</router-link>
    <router-link to="/pivotalFactorAnalysis">关键因素分析</router-link> -->
  </div>
</template>

<script></script>

<style lang="scss">
.header {
  display: flex;
  justify-content: space-around;
  background: url("../assets/img/header.png") no-repeat;
  position: absolute;
  top: 0;
  left: 50%;
  z-index: 1;
  width: 95%;
  /* background-size: 100% 100%; */
  height: 111px;
  transform: translateX(-50%);
  a {
    height: 60px;
    line-height: 60px;
    text-align: center;
    color: #fff;
    font-size: 20px;
    position: absolute;
    top: 50%;

    transform: translateY(-50%);
    font-weight: bold;
  }
  a:first-of-type {
    // left: 160px;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  a:nth-child(2) {
    // left: 330px;
    left: 130px;
  }
  a:nth-child(3) {
    left: 300px;
    // left: 500px;
  }
  a:nth-child(4) {
    left: 470px;
  }
  a:nth-child(5) {
    // right: 450px;
    right: 470px;
  }
  a:nth-child(6) {
    right: 300px;
  }
  a:nth-child(7) {
    right: 130px;
  }
  div {
    height: 60px;
    line-height: 60px;
    text-align: center;
    color: #fff;
    font-size: 20px;
  }
  .header-center {
    width: 300px;
    /* height: 60px; */
    /* background-color: aqua; */
    font-size: 25px;
    text-align: center;
    /* line-height: 60px; */
    font-size: 32px;
    // position: absolute;

    font-weight: bold;
    color: #00ffff;
  }
  .router-link-active {
    color: rgb(133, 200, 240);
  }
  a:hover {
    color: rgb(133, 200, 240);
  }
}
</style>
