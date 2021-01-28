<template>
  <div :id="echartsContainerGuid" class="echartsContainer" ref="echartsContainerGuid">
    <div :id="echartsGuid" class="lineCharts" ref="echartsGuid"></div>
    <div class="nodataTip" v-if="noData">暂无图形数据</div>
  </div>
</template>

<script>
const echarts = require("echarts");
import { getHttp } from "@/utils/httpserver.js";
import communicate from "@/utils/communicate.js";

export default {
  name: "lineChart",
  components: {},
  props: {
    chartDataUrl: {
      type: String,
      default: () => "",
    },
    chartTitle: {
      type: String,
      default: () => "LineCharts",
    },
    chartLegendField: {
      type: String,
      default: () => "",
    },
    chartXField: {
      type: String,
      default: () => "",
    },
    chartDataField: {
      type: String,
      default: () => "",
    },
    chartType: {
      type: String,
      default: () => "bar",
    },
  },
  data() {
    return {
      noData: false,
    };
  },
  methods: {
    drawCharts() {
      let _this = this;
      let _chartContainer = document.getElementById(this.echartsContainerGuid);
      let _chartDom = document.getElementById(this.echartsGuid);
      let myChart = echarts.init(_chartDom);
      let _chartDataUrl = this.chartDataUrl;

      let _chartContainerParentNode = _chartContainer.parentNode;
      let _clientWidth = _chartContainerParentNode.clientWidth;
      let _clientHeight = _chartContainerParentNode.clientHeight;

      let _chartWidth =
        this.checkIsNullOrEmpty(_clientWidth) === true ? _clientWidth : 600;
      let _chartHeight =
        this.checkIsNullOrEmpty(_clientHeight) === true ? _clientHeight : 400;

      let _loadingConfig = {
        text: "loading",
        color: "#c23531",
        textColor: "#000",
        maskColor: "rgba(255, 255, 255, 0.8)",
        zlevel: 0,

        // 字体大小。从 `v4.8.0` 开始支持。
        fontSize: 12,
        // 是否显示旋转动画（spinner）。从 `v4.8.0` 开始支持。
        showSpinner: true,
        // 旋转动画（spinner）的半径。从 `v4.8.0` 开始支持。
        spinnerRadius: 10,
        // 旋转动画（spinner）的线宽。从 `v4.8.0` 开始支持。
        lineWidth: 5,
      };
      myChart.showLoading("default", _loadingConfig);
      myChart.setOption({
        textStyle: {
          color: "#fff",
        },
        toolbox: {
          show: false,
          top: 20,
          feature: {
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ["line", "bar"] },
            restore: { show: true },
            saveAsImage: { show: true },
          },
        },
        title: {
          text: _this.chartTitle,
          textStyle: {
            fontSize: 14,
            color: "#fff",
          },
          top: 0,
          padding: 5,
        },
        tooltip: {
          trigger: "axis",
          // axisPointer: {
          //   type: "shadow",
          // },
          // confine: true,
        },
        legend: {
          type: "scroll",
          top: 20,
          left: 0,
          tooltip: {
            show: true,
          },
          textStyle: {
            color: "#fff",
          },
          formatter: function (name) {
            return echarts.format.truncateText(name, 100, "14px Microsoft Yahei", "…");
          },
          itemWidth: 15,
          itemHeight: 8.4,
          data: [],
        },
        grid: {
          left: "1%",
          right: "1%",
          bottom: "10%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          boundaryGap: true,
          axisLine: {
            lineStyle: {
              color: "white",
            },
          },
          data: [],
        },
        yAxis: {
          type: "value",
          axisLine: {
            lineStyle: {
              color: "white",
            },
          },
        },
        series: [],
      });
console.log(_chartDataUrl)
      if (this.checkIsNullOrEmpty(_chartDataUrl)) {
        getHttp(_chartDataUrl, function (res) {
          let _data = res.data;
          myChart.hideLoading();
          if (!_this.isEmptyValue(_data)) {
            _this.noData = false;
            myChart.setOption({
              legend: {
                data: _this.getLegendData(_data),
              },
              xAxis: {
                data: _this.getXAxisData(_data),
              },
              series: _this.getSeriesData(_data, _this.chartType),
            });
          } else {
            _this.noData = true;
          }
        });
      }
      communicate.$on("leftConditionChange", (val) => {
        getHttp(val.chartDataUrl, function (res) {
          let _data = res.data;
          myChart.hideLoading();
          if (!_this.isEmptyValue(_data)) {
            _this.noData = false;
            myChart.setOption({
              legend: {
                data: _this.getLegendData(_data),
              },
              xAxis: {
                data: _this.getXAxisData(_data),
              },
              series: _this.getSeriesData(_data, _this.chartType),
            });
          } else {
            _this.noData = true;
          }
        });
      });

      setTimeout(function () {
        myChart.resize({
          width: _chartWidth,
          height: _chartHeight,
        });
      }, 500);
    },
    getLegendData(data) {
      // 最终返回图例数组
      let _legendData = [];
      let _legend = [];
      let _data = data;
      let _dataLen = _data.length;

      if (_dataLen > 0) {
        // 重复值不添加
        let set = new Set();
        for (let i = 0; i < _dataLen; i++) {
          let _legendField = _data[i][this.chartLegendField];
          if (!set.has(_legendField)) {
            set.add(_legendField);
          }
        }
        // 浅拷贝数组
        _legend = Array.from(set);
      }
      _legendData = _legend;
      return _legendData;
    },
    getXAxisData(data) {
      // 最终返回x轴数组
      let _xAxisData = [];
      let _data = data;
      let _dataLen = _data.length;
      if (_dataLen > 0) {
        let set = new Set();
        for (let i = 0; i < _dataLen; i++) {
          let _dataItem = _data[i];
          let _xAxisValue = _dataItem[this.chartXField];
          if (!set.has(_xAxisValue)) {
            set.add(_xAxisValue);
          }
        }
        _xAxisData = Array.from(set);
      }
      return _xAxisData;
    },
    getSeriesData(data, chartType) {
      let _data = data;
      let _dataLen = _data.length;
      let _seriesData = [];
      let _seriesArr = []; //柱状图
      let _legendData = this.getLegendData(_data);

      if (_dataLen > 0) {
        if (chartType === "line") {
          for (let mn = 0; mn < _legendData.length; mn++) {
            let d = [];
            for (let i = 0; i < _dataLen; i++) {
              let m = _data[i];
              let mLegendName = m[this.chartLegendField];
              if (_legendData[mn] === mLegendName) {
                let mValue = m[this.chartDataField];
                d.push(mValue);
              }
            }
            _seriesData.push({
              name: _legendData[mn],
              type: "line",
              // smooth: false, //是否平滑曲线显示
              //symbol:'circle',  // 默认是空心圆（中间是白色的），改成实心圆
              // symbolSize: 0,
              // lineStyle: {
              //   normal: {
              //     color: "#3deaff", // 线条颜色
              //   },
              // },
              // areaStyle: {
              //   //区域填充样式
              //   normal: {
              //     //线性渐变，前4个参数分别是x0,y0,x2,y2(范围0~1);相当于图形包围盒中的百分比。如果最后一个参数是‘true’，则该四个值是绝对像素位置。
              //     color: new echarts.graphic.LinearGradient(
              //       0,
              //       0,
              //       0,
              //       1,
              //       [
              //         { offset: 0, color: "rgba(61,234,255, 0.2)" },
              //         { offset: 0.7, color: "rgba(61,234,255, 0)" },
              //       ],
              //       false
              //     ),

              //     shadowColor: "rgba(53,142,215, 0.9)", //阴影颜色
              //     shadowBlur: 20, //shadowBlur设图形阴影的模糊大小。配合shadowColor,shadowOffsetX/Y, 设置图形的阴影效果。
              //   },
              // },
              data: d,
            });
          }
        }
        if (chartType === "bar") {
          for (let i = 0; i < _data.length; i++) {
            _seriesArr.push(_data[i].Y);
          }
          _seriesData.push({
            name: _legendData[0],
            type: "bar",
            data: _seriesArr,
          });
        }
      }
      return _seriesData;
    },
    // 判断对象是否为空
    checkIsNullOrEmpty(value) {
      //正则表达式用于判斷字符串是否全部由空格或换行符组成
      var reg = /^\s*$/;
      //返回值为true表示不是空字符串
      return value != null && value != undefined && !reg.test(value);
    },
    isEmptyValue(value) {
      let type;
      if (value == null) {
        // 等同于 value === undefined || value === null
        return true;
      }
      type = Object.prototype.toString.call(value).slice(8, -1);
      switch (type) {
        case "String":
          return !$.trim(value);
        case "Array":
          return !value.length;
        case "Object":
          return $.isEmptyObject(value); // 普通对象使用 for...in 判断，有 key 即为 false
        default:
          return false; // 其他对象均视作非空
      }
    },
  },
  computed: {
    echartsGuid() {
      return "echarts" + Math.random() * 100000;
    },
    echartsContainerGuid() {
      return "echartsContainer" + Math.random() * 100000;
    },
  },
  mounted() {
    this.drawCharts();
  },
  beforeDestroy() {
    communicate.$off("leftConditionChange");
  },
};
</script>

<style lang="scss">
.echartsContainer {
  position: relative;
  .nodataTip {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
