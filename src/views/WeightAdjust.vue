<template>
  <div class="weightAdjust">
    <navHeader></navHeader>
    <div class="weightAdjust_mid">
      <div class="weightAdjust_statistics"></div>
      <div class="weightAdjust_content">
        <div id="disk_Usage" style="width:100%;height:100%;"></div>
      </div>
    </div>
  </div>
</template>
<script>
import navHeader from "../components/navHeader";
import * as echarts from 'echarts';
import diskData from "@/assets/data/treemap.json";
export default {
  name: "weightAdjust",
  components: {
    navHeader,
  },
  data() {
    return {
      path: this.$root.portUrl + "weightAdjust",
      socket: "",
      treeSeriesChildren: [],
    };
  },
  mounted() {
    this.chartInit();
  },
  methods: {
    chartInit() {
      let _chartDom = document.getElementById("disk_Usage");
      let myChart = echarts.init(_chartDom);
      let option = {
        tooltip: {
          formatter: "{b}",
        },
        series: [
          {
            name: "宽带网系统评估",
            type: "treemap",
            itemStyle: {
              //   gapWidth: 1.5,
              borderColor: "#fff",
              borderWidth: 0.5,
            },
            data: diskData,
          },
        ],
      };
      myChart.setOption(option);
    },
  },
};
</script>
<style lang="scss">
.weightAdjust {
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
  .weightAdjust_mid {
    position: absolute;
    left: 20px;
    right: 20px;
    top: 100px;
    bottom: 42px;
    .weightAdjust_statistics {
      width: 100%;
      height: 30px;
      background: rgba(0, 0, 0, 0.4);
      position: relative;
      z-index: 1;
    }
    .weightAdjust_content {
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