<template>
  <div class="data_analyse_sec_mid clearFix">
    <div>
      <div class="select_Group clearFix">
        <Select
          v-model="dataModel.indicatorLeftModel"
          style="width: 180px"
          @on-change="indicatorLeftModelChange"
        >
          <Option
            v-for="option in dataList.indicatorLeftList"
            :value="option.id"
            :key="option.id"
            >{{ option.zb_name }}</Option
          >
        </Select>
        <Select
          v-model="dataModel.valueLeftModel"
          style="width: 100px"
          @on-change="valueLeftModelChange"
        >
          <Option value="0">平均值</Option>
          <Option value="1">最新值</Option>
        </Select>
        <Select
          v-model="dataModel.typeLeftModel"
          style="width: 100px"
          @on-change="typeLeftModelChange"
        >
          <Option value="0">试验</Option>
          <Option value="1">时间</Option>
        </Select>
        <CheckboxGroup v-model="dataModel.testCheckbox" @on-change="testCheckboxChange">
          <Checkbox
            v-for="(item, index) in dataList.testList"
            :key="index"
            :label="item.id"
            >{{ item.name }}</Checkbox
          >
        </CheckboxGroup>
      </div>
      <div id="lineChartLeftContainer" style="margin-top: 10px">
        <div id="lineChartLeft"></div>
      </div>
    </div>
    <div>
      <div class="select_Group clearFix">
        <Select
          v-model="dataRightModel.indicatorRightModel"
          style="width: 180px"
          @on-change="indicatorRightModelChange"
        >
          <Option
            v-for="option in dataList.indicatorRightList"
            :value="option.id"
            :key="option.id"
            >{{ option.zb_name }}</Option
          >
        </Select>
        <Select
          v-model="dataRightModel.valueRightModel"
          style="width: 100px"
          @on-change="valueRightModelChange"
        >
          <Option value="0">平均值</Option>
          <Option value="1">最新值</Option>
        </Select>
        <Select
          v-model="dataRightModel.typeRightModel"
          style="width: 100px"
          @on-change="typeRightModelChange"
        >
          <Option value="0">试验</Option>
          <Option value="1">时间</Option>
        </Select>
        <CheckboxGroup
          v-model="dataRightModel.testCheckbox"
          @on-change="testRightCheckboxChange"
        >
          <Checkbox
            v-for="(item, index) in dataList.testList"
            :key="index"
            :label="item.id"
            >{{ item.name }}</Checkbox
          >
        </CheckboxGroup>
      </div>
      <div id="lineChartRightContainer" style="margin-top: 10px">
        <div id="lineChartRight"></div>
      </div>
    </div>
    <div>
      <ScatterChart></ScatterChart>
    </div>
  </div>
</template>

<script>
const echarts = require("echarts");
import { getHttp } from "@/utils/httpserver";
import ScatterChart from "@/components/ECharts/ScatterChart/index.vue";
export default {
  data() {
    return {
      dataModel: {
        indicatorLeftModel: "",
        valueLeftModel: "0",
        typeLeftModel: "0",
        testCheckbox: [],
      },
      dataRightModel: {
        indicatorRightModel: "1",
        valueRightModel: "0",
        typeRightModel: "0",
        testCheckbox: [],
      },
      dataList: {
        indicatorLeftList: [],
        testList: [],
        indicatorRightList: [
          {
            id: "1",
            zb_name: "用户接入成功率",
          },
        ],
      },

      f_chartData: {
        chartDataUrl: "",
        chartTitle: "chartF",
        chartLegendField: "A",
        xAxisField: "X",
        seriesData: "Y",
        chartType: "bar",
      },
      s_chartData: {
        chartDataUrl: "",
        chartTitle: "chartS",
        chartLegendField: "A",
        xAxisField: "X",
        seriesData: "Y",
        chartType: "bar",
      },
    };
  },
  created() {},
  components: {
    ScatterChart,
  },

  computed: {},

  mounted() {
    this.getIndicatorLeftList();
  },

  methods: {
    getIndicatorLeftList() {
      let _this = this;

      getHttp("/api/CjZb/selectAll", function (res) {
        _this.dataList.indicatorLeftList = res.data;
        _this.dataModel.indicatorLeftModel = res.data[0].id;
        _this.getTestList();
      });
    },
    getTestList() {
      let _this = this;

      getHttp("/api/Sy/getAll", function (res) {
        let _data = res.data;
        _this.dataList.testList = _data;
        _this.dataModel.testCheckbox = [];
        for (let i = 0; i < _data.length; i++) {
          _this.dataModel.testCheckbox.push(_data[i].id);
          _this.dataRightModel.testCheckbox.push(_data[i].id);
        }
        _this.drawCharts(
          "/api/Cj_Sj/getData?type=" +
            _this.dataModel.typeLeftModel +
            "&syIds=" +
            _this.dataModel.testCheckbox.join(",") +
            "&cjZbId=" +
            _this.dataModel.indicatorLeftModel +
            "&model=" +
            _this.dataModel.valueLeftModel,
          "bar",
          "lineChartLeftContainer",
          "lineChartLeft"
        );
        _this.drawCharts(
          "/api/Cj_Sj/getData2?type=" +
            _this.dataRightModel.typeRightModel +
            "&syIds=" +
            _this.dataRightModel.testCheckbox.join(",") +
            "&zbId=" +
            _this.dataRightModel.indicatorRightModel +
            "&model=" +
            _this.dataRightModel.valueRightModel,
          "bar",
          "lineChartRightContainer",
          "lineChartRight"
        );
        //
      });
    },
    indicatorLeftModelChange() {
      if (this.dataModel.typeLeftModel === "1") {
        this.f_chartData.chartLegendField = "sy_id";
        this.f_chartData.chartType = "line";
      }
      if (this.dataModel.typeLeftModel === "0") {
        this.f_chartData.chartLegendField = "A";
        this.f_chartData.chartType = "bar";
      }
      this.drawCharts(
        "/api/Cj_Sj/getData?type=" +
          this.dataModel.typeLeftModel +
          "&syIds=" +
          this.dataModel.testCheckbox.join(",") +
          "&cjZbId=" +
          this.dataModel.indicatorLeftModel +
          "&model=" +
          this.dataModel.valueLeftModel,
        this.f_chartData.chartType,
        "lineChartLeftContainer",
        "lineChartLeft"
      );
    },
    valueLeftModelChange() {
      this.indicatorLeftModelChange();
    },
    typeLeftModelChange() {
      this.indicatorLeftModelChange();
    },
    testCheckboxChange() {
      this.indicatorLeftModelChange();
    },
    indicatorRightModelChange() {
      if (this.dataRightModel.typeRightModel === "1") {
        this.s_chartData.chartLegendField = "sy_id";
        this.s_chartData.chartType = "line";
      }
      if (this.dataRightModel.typeRightModel === "0") {
        this.s_chartData.chartLegendField = "A";
        this.s_chartData.chartType = "bar";
      }
      this.drawCharts(
        "/api/Cj_Sj/getData2?type=" +
          this.dataRightModel.typeRightModel +
          "&syIds=" +
          this.dataRightModel.testCheckbox.join(",") +
          "&zbId=" +
          this.dataRightModel.indicatorRightModel +
          "&model=" +
          this.dataRightModel.valueRightModel,
        this.s_chartData.chartType,
        "lineChartRightContainer",
        "lineChartRight"
      );
    },
    valueRightModelChange() {
      this.indicatorRightModelChange();
    },
    typeRightModelChange() {
      this.indicatorRightModelChange();
    },
    testRightCheckboxChange() {
      this.indicatorRightModelChange();
    },
    drawCharts(chartDataUrl, chartType, containerID, chartID) {
      let _this = this;
      let _chartContainer = document.getElementById(containerID);
      let _chartDom = document.getElementById(chartID);
      let myChart = echarts.init(_chartDom);
      let _chartDataUrl = chartDataUrl;

      let _chartContainerParentNode = _chartContainer.parentNode;
      let _clientWidth = _chartContainerParentNode.clientWidth;
      let _clientHeight = _chartContainerParentNode.clientHeight;

      let _chartWidth =
        this.checkIsNullOrEmpty(_clientWidth) === true ? _clientWidth : 600;
      let _chartHeight =
        this.checkIsNullOrEmpty(_clientHeight) === true ? _clientHeight - 50 : 400;

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
          let option = {
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
              text: _this.f_chartData.chartTitle,
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
                return echarts.format.truncateText(
                  name,
                  100,
                  "14px Microsoft Yahei",
                  "…"
                );
              },
              itemWidth: 15,
              itemHeight: 8.4,
              data: _this.getLegendData(_data),
            },
            grid: {
              left: "1%",
              right: "1%",
              bottom: "10%",
              containLabel: true,
            },
            xAxis: {
              show: _axisShow,
              type: "category",
              boundaryGap: true,
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
            series: _this.getSeriesData(_data, chartType),
          };
          myChart.setOption(option, true);
        });
      }

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
          let _legendField = _data[i][this.f_chartData.chartLegendField];
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
              let mLegendName = m[this.f_chartData.chartLegendField];
              if (_legendData[mn] === mLegendName) {
                let mValue = m[this.f_chartData.seriesData];
                d.push(mValue);
              }
            }
            _seriesData.push({
              name: _legendData[mn],
              type: "line",
              smooth: false, //是否平滑曲线显示
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
    filterObject(data, field, value) {
      for (let i = 0; i < data.length; i++) {
        if (data[i][field] === value) {
          return data[i];
        }
      }
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
.data_analyse_sec_mid {
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
    .select_Group {
      .ivu-select {
        float: left;
        margin: 0 5px;
      }
      .ivu-checkbox-group {
        float: left;
        line-height: 31px;
        margin: 0 5px;
      }
    }
  }
}
</style>
