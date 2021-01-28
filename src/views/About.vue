<template>
  <div class="chartContainer">
    <ul class="clearFix">
      <li style="width:20%;height:60%;">
        <div id="pjsy"></div>
        <div id="dbl"></div>
      </li>
      <li style="width:60%;height:60%;">
        <div id="xtpg"></div>
      </li>
      <li style="width:20%;height:60%;">
        <div id="jrcgl"></div>
        <!-- <div style="width:100%;height:50%;">
          <LineChart
          :chartData="successRate.chartData"
          :chartTheme="successRate.chartTheme"
          :chartLegendField="successRate.chartLegendField"
          :chartXField="successRate.xAxisField"
          :chartDataField="successRate.seriesData"
          :chartTitle="successRate.chartTitle"
        ></LineChart>
        </div>-->
        <div id="ywl"></div>
      </li>
      <li class="clearFix" style="width:100%;height:40%;">
        <div id="wx1"></div>
        <div id="wx2"></div>
        <div id="wx3"></div>
        <div id="wx4"></div>
        <div id="wx5"></div>
      </li>
    </ul>
  </div>
</template>
<script>
import echarts from "echarts";
import axios from "axios";
import LineChart from "@/components/ECharts/LineChart/index.vue";

export default {
  components: {
    LineChart,
  },
  data() {
    return {
      // 接入成功率曲线图数据
      successRate: {
        chartData: [],
        chartTheme: "dark",
        chartTitle: "接入成功率",
        chartLegendField: "id",
        xAxisField: "id",
        seriesData: "cgl",
      },
    };
  },
  mounted() {
    let _self = this;
    _self.init();
    // axios.get("/api/Jr/demo").then(function (res) {
    //   let _data = res.data;
    //   for (let i = 0; i < _data.length; i++) {
    //     let _dataItem = _data[i];
    //     _dataItem["cgl"] = _dataItem.jrl / _dataItem.qql;
    //     _self.successRate.chartData.push(_dataItem);
    //   }
    // });
  },
  methods: {
    init() {
      let _self = this;
      this.pjsy();
      this.dbl();
      this.ywl();
      this.jrcgl();

      this.xtpg();

      axios.get("/api/Zylyl_show/demo").then(function (res) {
        let _data = res.data;
        for (let i = 0; i < 5; i++) {
          let _index = i + 1;
          _self.zylylChart(
            "wx" + _index,
            _index,
            _self.renderData(_data, _index)
          );
        }
        //
      });
    },
    pjsy() {
      let pjsy = echarts.init(document.getElementById("pjsy"), "dark");

      axios.get("/api/Pjsy/demo").then(function (res) {
        let _data = res.data;
        let xAxisData = [];
        let data = [];

        for (let i = 0; i < _data.length; i++) {
          xAxisData.push(_data[i].id);
          for (let j = 0; j < xAxisData.length; j++) {
            if (xAxisData[j] === _data[i].id) {
              data.push(_data[i].pjsy);
            }
          }
        }

        let option = {
          title: {
            text: "平均时延",
            left: "center",
          },
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "cross",
            },
          },
          toolbox: {
            show: false,
            feature: {
              saveAsImage: {},
            },
          },
          xAxis: {
            type: "category",
            boundaryGap: false,
            data: xAxisData,
          },
          yAxis: {
            type: "value",
            axisLabel: {
              formatter: "{value}ms",
            },
            axisPointer: {
              snap: true,
            },
          },

          series: [
            {
              name: "平均时延",
              type: "line",
              smooth: true,
              data: data,
            },
          ],
        };

        pjsy.setOption(option);
      });
    },
    ywl() {
      let ywl = echarts.init(document.getElementById("ywl"), "dark");

      axios.get("/api/Ywl/demo").then(function (res) {
        let _data = res.data;
        let xAxisData = [];
        let data_yy = [];
        let data_kd = [];
        let data_zj = [];

        for (let i = 0; i < _data.length; i++) {
          xAxisData.push(_data[i].id);
          for (let j = 0; j < xAxisData.length; j++) {
            if (xAxisData[j] === _data[i].id) {
              data_yy.push(_data[i].yy);
              data_kd.push(_data[i].kd);
              data_zj.push(_data[i].zj);
            }
          }
        }

        let option = {
          title: {
            text: "业务量",
            left: "center",
          },
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "cross",
              crossStyle: {
                color: "#999",
              },
            },
          },
          toolbox: {
            show: false,
            feature: {
              dataView: {
                show: true,
                readOnly: false,
              },
              magicType: {
                show: true,
                type: ["line", "bar"],
              },
              restore: {
                show: true,
              },
              saveAsImage: {
                show: true,
              },
            },
          },
          legend: {
            data: ["语音", "宽带", "中继"],
            top: "10%",
          },
          xAxis: [
            {
              type: "category",
              data: xAxisData,
              axisPointer: {
                type: "shadow",
              },
            },
          ],
          yAxis: [
            {
              type: "value",
              name: "实时业务量",
              min: 0,
              max: 250,
              interval: 50,
              axisLabel: {
                formatter: "{value}",
              },
            },
          ],
          series: [
            {
              name: "语音",
              type: "line",
              smooth: true,
              data: data_yy,
            },
            {
              name: "宽带",
              type: "line",
              smooth: true,
              data: data_kd,
            },
            {
              name: "中继",
              type: "line",
              smooth: true,
              data: data_zj,
            },
          ],
        };

        ywl.setOption(option);
      });
    },
    dbl() {
      let dbl = echarts.init(document.getElementById("dbl"), "dark");

      axios.get("/api/Dbl/demo").then(function (res) {
        let _data = res.data;
        let xAxisData = [];
        let data = [];

        for (let i = 0; i < _data.length; i++) {
          xAxisData.push(_data[i].id);
          for (let j = 0; j < xAxisData.length; j++) {
            if (xAxisData[j] === _data[i].id) {
              data.push(_data[i].lost_package / _data[i].total_package);
            }
          }
        }

        let yMax = 500;
        let dataShadow = [];

        for (let i = 0; i < data.length; i++) {
          dataShadow.push(yMax);
        }
        let option = {
          title: {
            text: "丢包率",
            left: "center",
          },
          xAxis: {
            data: xAxisData,
            axisLabel: {
              textStyle: {
                color: "#fff",
              },
            },
            axisTick: {
              show: false,
            },
            axisLine: {
              show: false,
            },
            z: 10,
          },
          yAxis: {
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              textStyle: {
                color: "#999",
              },
            },
          },
          dataZoom: [
            {
              type: "inside",
            },
          ],
          series: [
            {
              type: "line",
              smooth: true,
              data: data,
            },
          ],
        };
        dbl.setOption(option);
      });
    },
    jrcgl() {
      let jrcgl = echarts.init(document.getElementById("jrcgl"), "dark");
      axios.get("/api/Jr/demo").then(function (res) {
        let _data = res.data;
        let xAxisData = [];
        let data = [];

        for (let i = 0; i < _data.length; i++) {
          xAxisData.push(_data[i].id);
          for (let j = 0; j < xAxisData.length; j++) {
            if (xAxisData[j] === _data[i].id) {
              data.push(_data[i].jrl / _data[i].qql);
            }
          }
        }

        let option = {
          title: {
            text: "接入成功率",
            left: "center",
          },
          toolbox: {
            // y: 'bottom',
            show: false,
            feature: {
              magicType: {
                type: ["stack", "tiled"],
              },
              dataView: {},
              saveAsImage: {
                pixelRatio: 2,
              },
            },
          },
          tooltip: {},
          xAxis: {
            data: xAxisData,
            splitLine: {
              show: false,
            },
          },
          yAxis: {},
          series: [
            {
              name: "line",
              type: "line",
              smooth: true,
              data: data,
              animationDelay: function (idx) {
                return idx * 10 + 100;
              },
            },
          ],
          animationEasing: "elasticOut",
          animationDelayUpdate: function (idx) {
            return idx * 5;
          },
        };
        jrcgl.setOption(option);
      });
    },
    zylylChart(domId, index, obj) {
      let zylyl = echarts.init(document.getElementById(domId), "dark");

      let option = {
        title: {
          text: "卫星" + index + "资源利用率",
          left: "center",
        },
        tooltip: {
          trigger: "item",
        },
        xAxis: {
          type: "category",
          data: obj.xAxis,
          splitArea: {},
          splitLine: { show: true },
        },
        yAxis: { type: "value" },
        series: [
          {
            type: "custom",
            renderItem: this.renderItem,
            itemStyle: { normal: { opacity: 0.8 } },
            encode: { y: [1, 2], x: 0 },
            data: obj.series,
          },
        ],
      };
      zylyl.setOption(option);
    },
    xtpg() {
      let xtpg = echarts.init(document.getElementById("xtpg"), "dark");

      let option = {
        title: {
          text: "系统评估",
          left: "center",
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)",
        },
        series: [
          {
            name: "评估指标",
            type: "pie",
            selectedMode: "single",
            radius: [0, "30%"],

            label: {
              position: "inner",
            },
            labelLine: {
              show: false,
            },
            data: [
              { value: 950, name: "总体维" },
              { value: 520, name: "用户维" },
              { value: 1000, name: "网元维" },
              { value: 1180, name: "业务维" },
              { value: 900, name: "态势维" },
            ],
          },
          {
            name: "评估指标",
            type: "pie",
            radius: ["40%", "55%"],
            roseType: "angle",
            label: {
              formatter: " {b|{b}：}{c}  {per|{d}%}  ",
              backgroundColor: "#000",
              borderColor: "#aaa",
              borderWidth: 1,
              borderRadius: 4,
              // shadowBlur:3,
              // shadowOffsetX: 2,
              // shadowOffsetY: 2,
              // shadowColor: '#999',
              // padding: [0, 7],
              rich: {
                a: {
                  color: "#fff",
                  lineHeight: 22,
                  align: "center",
                },
                // abg: {
                //     backgroundColor: '#333',
                //     width: '100%',
                //     align: 'right',
                //     height: 22,
                //     borderRadius: [4, 4, 0, 0]
                // },
                hr: {
                  borderColor: "#aaa",
                  width: "100%",
                  borderWidth: 0.5,
                  height: 0,
                },
                b: {
                  fontSize: 16,
                  lineHeight: 33,
                },
                per: {
                  color: "#eee",
                  backgroundColor: "#334455",
                  padding: [2, 4],
                  borderRadius: 2,
                },
              },
            },
            data: [
              { value: 200, name: "覆盖特性", selected: true },
              { value: 250, name: "通信容量" },
              { value: 300, name: "通信质量" },
              { value: 200, name: "组网能力" },
              { value: 240, name: "服务质量" },
              { value: 280, name: "服务能力" },
              { value: 300, name: "节点" },
              { value: 400, name: "链路" },
              { value: 300, name: "架构" },
              { value: 250, name: "语音业务" },
              { value: 280, name: "移动通信" },
              { value: 400, name: "宽带通信" },
              { value: 100, name: "天基中继" },
              { value: 150, name: "天基物联" },
              { value: 200, name: "运行态势" },
              { value: 300, name: "安全态势" },
              { value: 400, name: "资产态势" },
            ],
          },
        ],
      };

      xtpg.setOption(option);
    },
    renderData(data, index) {
      let _self = this;
      let _xAxisData = [];
      let _series = [];
      let _seriesItem = [];
      let _lineColor = [
        "#c23531",
        "#2f4554",
        "#61a0a8",
        "#d48265",
        "#91c7ae",
        "#749f83",
        "#ca8622",
        "#bda29a",
        "#6e7074",
        "#546570",
        "#c4ccd3",
      ];

      for (let i = 0; i < data.length; i++) {
        if (data[i].SatelliteID === index) {
          _xAxisData.push("天线" + data[i].BeamID);
          _xAxisData = _self.unique(_xAxisData);
          for (let j = 0; j < _xAxisData.length; j++) {
            if (parseInt(_xAxisData[j].substring(2)) === data[i].BeamID) {
              _seriesItem.push(data[i]);
            }
          }
        }
      }
      _seriesItem = _self.groupBy(_seriesItem, function (item) {
        return [item.BeamID];
      });

      for (let k = 0; k < _seriesItem.length; k++) {
        for (let mn = 0; mn < _seriesItem[k].length; mn++) {
          _series.push({
            itemStyle: { normal: { color: _lineColor[mn] } },
            name: "波束" + _seriesItem[k][mn].ChannelID,
            value: [
              k,
              0,
              _seriesItem[k][mn].lyl,
              mn + 1,
              _seriesItem[k].length,
            ],
          });
        }
      }
      return {
        xAxis: _xAxisData,
        series: _series,
      };
    },
    renderItem: function (params, api) {
      let categoryIndex = api.value(0);
      let start = api.coord([categoryIndex, api.value(1)]);
      let end = api.coord([categoryIndex, api.value(2)]);
      let width = api.size([0, api.value(2)])[0] * 0.8;

      const num = api.value(4); // 每个系列柱子数
      const currentIndex = api.value(3);
      const isOdd = num % 2 === 0;
      const midN = isOdd ? num / 2 : (num + 1) / 2;

      var rect = "";

      width = width / num;

      let rectX = start[0] - width / 2;

      const FIXED_WIDTH = 0; // 柱子间距

      // 数据处理，结构为 { itemStyle: { normal: { color: 'lightgreen' } }, name: '2011', value: [0, 0, 150, 2, 5] }
      // 其中value 分为五个维度，分别为{系列项}（从0开始）、y轴起始值(均为0)、实际值、同系列中索引值（从1开始）、同系列数据项总数

      if (num > 1) {
        if (isOdd) {
          if (currentIndex <= midN) {
            // 中位数左侧
            rectX =
              start[0] -
              width / 2 -
              width / 2 +
              (currentIndex - midN) * width -
              FIXED_WIDTH * (midN + 1 - currentIndex);
          } else {
            // 中位数右侧
            rectX =
              start[0] -
              width / 2 +
              width / 2 +
              (currentIndex - midN - 1) * width +
              FIXED_WIDTH * (currentIndex - midN);
          }
        } else {
          rectX =
            start[0] -
            width / 2 +
            (currentIndex - midN) * (width + FIXED_WIDTH);
        }
      }

      rect = {
        type: "rect",
        shape: echarts.graphic.clipRectByRect(
          { x: rectX, y: end[1], width: width, height: start[1] - end[1] },
          {
            x: params.coordSys.x,
            y: params.coordSys.y,
            width: params.coordSys.width,
            height: params.coordSys.height,
          }
        ),
        style: api.style(),
      };

      return rect;
    },
    unique(arr) {
      return arr.filter(function (item, index, arr) {
        return arr.indexOf(item, 0) === index;
      });
    },
    groupBy(array, f) {
      let groups = {};
      array.forEach(function (o) {
        let group = JSON.stringify(f(o));
        groups[group] = groups[group] || [];
        groups[group].push(o);
      });
      return Object.keys(groups).map(function (group) {
        return groups[group];
      });
    },
  },
};
</script>
<style lang="scss">
.chartContainer {
  width: 100%;
  height: 100%;
  .clearFix {
    *zoom: 1;
  }

  .clearFix:after {
    content: "";
    display: block;
    height: 0;
    clear: both;
  }

  ul {
    width: 100%;
    height: 100%;
    li {
      float: left;
      // border: 1px solid black;
    }
    li:first-of-type > div {
      width: 100%;
      height: 50%;
    }
    li:nth-of-type(2) > div {
      width: 100%;
      height: 100%;
    }
    li:nth-of-type(3) > div {
      width: 100%;
      height: 50%;
    }
    li:nth-of-type(4) > div {
      width: 20%;
      height: 100%;
      float: left;
    }
  }
}
</style>
