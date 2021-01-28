<template>
  <div class="pivotalFactorAnalysis">
    <navHeader></navHeader>
    <div class="pivotalFactorAnalysis_mid">
      <div class="pivotalFactorAnalysis_statistics"></div>
      <div class="pivotalFactorAnalysis_content">
        <div id="sunburst_Chart" style="width:100%;height:100%;"></div>
      </div>
    </div>
  </div>
</template>
<script>
import navHeader from "../components/navHeader";
import * as echarts from 'echarts';
import sunburstData from "@/assets/data/treemap.json";
export default {
  name: "pivotalFactorAnalysis",
  components: {
    navHeader,
  },
  mounted() {
    this.chartInit();
  },
  methods: {
    chartInit() {
      let _chartDom = document.getElementById("sunburst_Chart");
      let myChart = echarts.init(_chartDom);
      var item1 = {
        color: "#F54F4A",
      };
      var item2 = {
        color: "#FF8C75",
      };
      var item3 = {
        color: "#FFB499",
      };

      let data = sunburstData;

      let option = {
        series: {
          radius: ["15%", "80%"],
          type: "sunburst",
          sort: null,
          highlightPolicy: "ancestor",
          data: data,
          label: {
            rotate: "radial",
          },
          levels: [],
          itemStyle: {
            // color: "#ddd",
            borderWidth: 1,
            borderColor: "#000",
          },
        },
      };
      myChart.setOption(option);
    },
  },
};
</script>
<style lang="scss">
.pivotalFactorAnalysis {
  width: 100%;
  height: 100%;
  background: #2c3e50;
  color: white;
  .clearFix {
    *zoom: 1;
  }

  .clearFix:after {
    content: "";
    display: block;
    height: 0;
    clear: both;
  }
  .pivotalFactorAnalysis_mid {
    position: absolute;
    left: 20px;
    right: 20px;
    top: 100px;
    bottom: 42px;
    .pivotalFactorAnalysis_statistics {
      width: 100%;
      height: 30px;
      background: rgba(0, 0, 0, 0.4);
      position: relative;
      z-index: 1;
    }
    .pivotalFactorAnalysis_content {
      position: absolute;
      top: 40px;
      left: 0;
      bottom: 0;
      right: 0;
      background: linear-gradient(to left, #00ffff, #00ffff) left top no-repeat,
        linear-gradient(to bottom, #00ffff, #00ffff) left top no-repeat,
        linear-gradient(to left, #00ffff, #00ffff) right top no-repeat,
        linear-gradient(to bottom, #00ffff, #00ffff) right top no-repeat,
        linear-gradient(to left, #00ffff, #00ffff) left bottom no-repeat,
        linear-gradient(to bottom, #00ffff, #00ffff) left bottom no-repeat,
        linear-gradient(to left, #00ffff, #00ffff) right bottom no-repeat,
        linear-gradient(to left, #00ffff, #00ffff) right bottom no-repeat;
      background-size: 1px 15px, 15px 1px, 1px 15px, 15px 1px;
      background-color: rgba(0, 0, 0, 0.2);
      /* -webkit-box-shadow: 2px 5px 5px rgba(0, 0, 0, 0.5); */
      /* box-shadow: 2px 5px 5px rgba(0, 0, 0, 0.5); */
      border-radius: 5px;
    }
  }
}
</style>