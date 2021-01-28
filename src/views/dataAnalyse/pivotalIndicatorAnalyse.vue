<template>
  <div class="privotal_indicator_analyse clearFix">
    <div id="line_Chart_TL"></div>
    <div id="line_Chart_TR"></div>
    <div id="line_Chart_BL"></div>
    <div id="line_Chart_BR"></div>
  </div>
</template>

<script>
const echarts = require("echarts");
import { getHttp } from "@/utils/httpserver";
export default {
  data() {
    return {
      f_chartData: {
        chartDataUrl: "/api/Cj_Sj/getData",
        chartTitle: "chartF",
        chartLegendField: "A",
        xAxisField: "X",
        seriesData: "Y",
        chartType: "bar",
      },
    };
  },

  components: {},

  computed: {},

  mounted() {
    this.getTestData();
  },

  methods: {
    getTestData() {
      let _this = this;
      let _chartDataUrl_Fir = "/api/Cj_Sj/getData2";
      let _chartDataUrl_Sec = "/api/Cj_Sj/getData";
      getHttp("/api/Sy/getAll", function (res) {
        let _data = res.data;
        let _testCheckbox = [];
        for (let i = 0; i < _data.length; i++) {
          _testCheckbox.push(_data[i].id);
        }
        _this.drawCharts(
          _chartDataUrl_Fir +
            "?type=1" +
            "&syIds=" +
            _testCheckbox.join(",") +
            "&zbId=1" +
            "&model=0",
          "line",
          "line_Chart_TL",
          "用户接入成功率",
          "A"
        );
        _this.drawCharts(
          _chartDataUrl_Sec +
            "?type=1" +
            "&syIds=" +
            _testCheckbox.join(",") +
            "&cjZbId=7" +
            "&model=0",
          "line",
          "line_Chart_TR",
          "数据发送量",
          "sy_id"
        );
        _this.drawCharts(
          _chartDataUrl_Sec +
            "?type=1" +
            "&syIds=" +
            _testCheckbox.join(",") +
            "&cjZbId=9" +
            "&model=0",
          "line",
          "line_Chart_BL",
          "传输时延",
          "sy_id"
        );
        _this.drawCharts(
          _chartDataUrl_Sec +
            "?type=1" +
            "&syIds=" +
            _testCheckbox.join(",") +
            "&cjZbId=10" +
            "&model=0",
          "line",
          "line_Chart_BR",
          "时延抖动",
          "sy_id"
        );
      });
    },
    drawCharts(chartDataUrl, chartType, chartID, chartTitle, chartLegendField) {
      let _this = this;
      //   let _chartContainer = document.getElementById(containerID);
      let _chartDom = document.getElementById(chartID);
      let myChart = echarts.init(_chartDom);
      let _chartDataUrl = chartDataUrl;
      //   let _chartContainerParentNode = _chartContainer.parentNode;
      //   let _clientWidth = _chartContainerParentNode.clientWidth;
      //   let _clientHeight = _chartContainerParentNode.clientHeight;

      //   let _chartWidth =
      //     this.checkIsNullOrEmpty(_clientWidth) === true ? _clientWidth : 600;
      //   let _chartHeight =
      //     this.checkIsNullOrEmpty(_clientHeight) === true ? _clientHeight - 50 : 400;

      var loadingNodata = function (api, opts) {
        opts = {
          text: "暂无数据",
          color: "#c23531",
          textColor: "#fff",
          maskColor: "rgba(255, 255, 255, 0.1)",
          zlevel: 0,
        };
        var mask = new echarts.graphic.Rect({
          style: {
            fill: opts.maskColor,
          },
          zlevel: opts.zlevel,
          z: 10000,
        });

        var labelRect = new echarts.graphic.Rect({
          style: {
            fill: "none",
            text: opts.text,
            textPosition: "center",
            textDistance: 10,
            textFill: opts.textColor,
          },
          zlevel: opts.zlevel,
          z: 10001,
        });

        var group = new echarts.graphic.Group();

        group.add(labelRect);
        group.add(mask); // Inject resize

        group.resize = function () {
          var cx = api.getWidth() / 2;
          var cy = api.getHeight() / 2;
          labelRect.setShape({
            x: cx - 20,
            y: cy - 20,
            width: 10 * 2,
            height: 10 * 2,
          });
          mask.setShape({
            x: 0,
            y: 0,
            width: api.getWidth(),
            height: api.getHeight(),
          });
        };

        group.resize();
        return group;
      };
      echarts.registerLoading("nodatas", loadingNodata);

      if (this.checkIsNullOrEmpty(_chartDataUrl)) {
        getHttp(_chartDataUrl, function (res) {
          let _data = res.data;
          let _axisShow = false;
          myChart.hideLoading();
          if (!_data.length) {
            myChart.showLoading("nodatas");
          }
          if (!_this.isEmptyValue(_data)) {
            _axisShow = true;
          }
          for (let i = 0; i < _data.length; i++) {
            _data[i][chartLegendField] = "试验" + _data[i][chartLegendField];
          }
          let option = {
            color: [
              "#c23531",
              "#fddd60",
              "#ff6e76",
              "#4992ff",
              "#58d9f9",
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
            ],
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
              text: chartTitle,
              textStyle: {
                fontSize: 14,
                color: "#fff",
              },
              top: 0,
              left: "center",
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
                return echarts.format.truncateText(
                  name,
                  100,
                  "14px Microsoft Yahei",
                  "…"
                );
              },
              itemWidth: 15,
              itemHeight: 8.4,
              data: _this.getLegendData(_data, chartLegendField),
            },
            grid: {
              left: "1%",
              right: "10%",
              bottom: "10%",
              containLabel: true,
            },
            xAxis: {
              show: _axisShow,
              type: "category",
              boundaryGap: true,
              name: "时间(ms)",
              nameLocation: "end",
              axisLine: {
                lineStyle: {
                  color: "white",
                },
              },
              data: _this.getXAxisData(_data),
            },
            yAxis: {
              show: _axisShow,
              type: "value",
              axisLine: {
                lineStyle: {
                  color: "white",
                },
              },
            },
            series: _this.getSeriesData(_data, chartType, chartLegendField),
          };
          // myChart.hideLoading();
          myChart.setOption(option, true);
        });
      }

      //   setTimeout(function () {
      //     myChart.resize({
      //       width: _chartWidth,
      //       height: _chartHeight,
      //     });
      //   }, 500);
    },
    getLegendData(data, chartLegendField) {
      // 最终返回图例数组
      let _legendData = [];
      let _legend = [];
      let _data = data;
      let _dataLen = _data.length;
      if (_dataLen > 0) {
        // 重复值不添加
        let set = new Set();
        for (let i = 0; i < _dataLen; i++) {
          let _legendField = _data[i][chartLegendField];
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
          let _xAxisValue = _dataItem[this.f_chartData.xAxisField];
          if (!set.has(_xAxisValue)) {
            set.add(_xAxisValue);
          }
        }
        _xAxisData = Array.from(set);
      }
      return _xAxisData;
    },
    getSeriesData(data, chartType, chartLegendField) {
      let _data = data;
      let _dataLen = _data.length;
      let _seriesData = [];
      let _seriesArr = []; //柱状图
      let _legendData = this.getLegendData(_data, chartLegendField);

      if (_dataLen > 0) {
        if (chartType === "line") {
          for (let mn = 0; mn < _legendData.length; mn++) {
            let d = [];
            for (let i = 0; i < _dataLen; i++) {
              let m = _data[i];
              let mLegendName = m[chartLegendField];
              if (_legendData[mn] === mLegendName) {
                let mValue = m[this.f_chartData.seriesData];
                d.push(mValue);
              }
            }
            _seriesData.push({
              name: _legendData[mn],
              type: "line",
              smooth: true, //是否平滑曲线显示
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
    checkIsNullOrEmpty(value) {
      //正则表达式用于判斷字符串是否全部由空格或换行符组成
      var reg = /^\s*$/;
      //返回值为true表示不是空字符串
      return value != null && value != undefined && !reg.test(value);
    },
  },
};
</script>
<style lang="scss">
.clearFix {
  *zoom: 1;
}

.clearFix:after {
  content: "";
  display: block;
  height: 0;
  clear: both;
}
.privotal_indicator_analyse {
  width: 100%;
  height: 100%;
  > div {
    width: 49%;
    height: 49%;
    margin: 5px;
    padding: 5px;
    float: left;
    background: linear-gradient(to left, #00a0e9, #00a0e9) left top no-repeat,
      linear-gradient(to bottom, #00a0e9, #00a0e9) left top no-repeat,
      linear-gradient(to left, #00a0e9, #00a0e9) right top no-repeat,
      linear-gradient(to bottom, #00a0e9, #00a0e9) right top no-repeat,
      linear-gradient(to left, #00a0e9, #00a0e9) left bottom no-repeat,
      linear-gradient(to bottom, #00a0e9, #00a0e9) left bottom no-repeat,
      linear-gradient(to left, #00a0e9, #00a0e9) right bottom no-repeat,
      linear-gradient(to left, #00a0e9, #00a0e9) right bottom no-repeat;
    background-size: 2px 15px, 15px 2px, 2px 15px, 15px 2px;
    box-shadow: 0px 0px 8px rgba(255, 255, 255, 0.5) inset;
  }
}
</style>
