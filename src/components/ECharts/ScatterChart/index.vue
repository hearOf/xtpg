<template>
  <div class="scatter_chart">
    <Select
      v-model="indicatorModel"
      style="width: 180px"
      @on-change="indicatorModelChange"
    >
      <Option v-for="option in indicatorList" :value="option.id" :key="option.id">{{
        option.zb_name
      }}</Option>
    </Select>
    <div id="scatter_chart" style="width: 100%; height: 90%"></div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import { getHttp } from "@/utils/httpserver";
import { get } from "xe-utils";
export default {
  data() {
    return {
      indicatorModel: "5",
      indicatorList: [
        {
          id: "5",
          zb_name: "业务申请时延",
        },
        {
          id: "7",
          zb_name: "数据发送量",
        },
        {
          id: "10",
          zb_name: "时延抖动",
        },
        {
          id: "11",
          zb_name: "平均跳数",
        },
      ],
    };
  },

  components: {},

  computed: {},

  mounted() {
    this.indicatorModelChange();
  },

  methods: {
    initChart(data, chartLegendField, xAxisField, seriesData) {
      let _myChartDom = document.getElementById("scatter_chart");
      let _myChart = echarts.init(_myChartDom);
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
      _myChart.hideLoading();
      if (!data.length) {
        _myChart.showLoading("nodatas");
      }
      let _color = [
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
        "#c23531",
      ];
      let _yName = [];
      for (let i = 0; i < data.length; i++) {
        _yName.push(data[i].A);
      }
      _yName = Array.from(new Set(_yName));
      let _minVisualMap = 0;
      let _maxVisualMap = 0;
      let _visualMapShow = false;
      let _axisShow = false;
      if (!this.isEmptyValue(data)) {
        // _minVisualMap =
        let _dataCompare = data.sort(this.compare("time"));
        _visualMapShow = true;
        _axisShow = true;
        _minVisualMap = _dataCompare[0].time;
        _maxVisualMap = _dataCompare[_dataCompare.length - 1].time;
      }

      let option = {
        color: _color,
        legend: {
          type: "scroll",
          top: 20,
          // left: 0,
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
          data: this.getLegendData(data, chartLegendField),
        },
        tooltip: {
          padding: 10,
          backgroundColor: "#222",
          borderColor: "#777",
          borderWidth: 1,
          formatter: function (obj) {
            var value = obj.value;
            return (
              '<div style="border-bottom: 1px solid rgba(255,255,255,.3); font-size: 18px;padding-bottom: 7px;margin-bottom: 7px">' +
              obj.seriesName +
              "</div>" +
              "业务ID" +
              "：" +
              value[2] +
              "<br>" +
              "业务类型" +
              "：" +
              value[3] +
              "<br>" +
              "时间" +
              "：" +
              value[4] +
              "<br>" +
              "值" +
              "：" +
              value[5] +
              "<br>"
            );
          },
        },
        grid: {
          left: "5%",
          right: "10%",
          bottom: "10%",
          containLabel: true,
        },
        xAxis: {
          show: _axisShow,
          name: "业务",
          axisLine: {
            lineStyle: {
              color: "white",
            },
          },
          minInterval: 1,
          splitLine: {
            show: true,
          },
          data: this.getXAxisData(data, xAxisField),
        },
        yAxis: {
          show: _axisShow,
          name: _yName,
          axisLine: {
            lineStyle: {
              color: "white",
            },
          },
          min: "dataMin",
          max: "dataMax",
          splitLine: {
            show: false,
          },
        },
        visualMap: [
          {
            show: _visualMapShow,
            left: "right",
            top: "10%",
            dimension: 4,
            min: _minVisualMap,
            max: _maxVisualMap,
            itemWidth: 10,
            itemHeight: 120,
            calculable: true,
            precision: 0.1,
            text: ["时间"],
            textGap: 30,
            textStyle: {
              color: "#fff",
            },
            inRange: {
              symbolSize: [10, 10],
            },
            outOfRange: {
              symbolSize: [10, 10],
              color: ["rgba(255,255,255,.2)"],
            },
            controller: {
              inRange: {
                color: ["#d53a35"],
              },
              outOfRange: {
                color: ["#444"],
              },
            },
          },
        ],
        series: this.getSeriesData(data, chartLegendField, xAxisField, seriesData),
      };

      option && _myChart.setOption(option, true);
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
    getXAxisData(data, xAxisField) {
      // 最终返回x轴数组
      let _xAxisData = [];
      let _data = data;
      let _dataLen = _data.length;
      if (_dataLen > 0) {
        let set = new Set();
        for (let i = 0; i < _dataLen; i++) {
          let _dataItem = _data[i];
          let _xAxisValue = _dataItem[xAxisField];
          if (!set.has(_xAxisValue)) {
            set.add("" + _xAxisValue + "");
          }
        }
        _xAxisData = Array.from(set);
      }
      return _xAxisData;
    },
    getSeriesData(data, chartLegendField, xAxisField, seriesData) {
      let _data = data;
      let _dataLen = _data.length;
      let _seriesData = [];
      let _legendData = this.getLegendData(_data, chartLegendField);

      if (_dataLen > 0) {
        for (let mn = 0; mn < _legendData.length; mn++) {
          let d = [];
          for (let i = 0; i < _dataLen; i++) {
            let m = _data[i];
            let mLegendName = m[chartLegendField];
            if (_legendData[mn] === mLegendName) {
              let mValue = [
                "" + m[xAxisField] + "",
                m[seriesData],
                m["X_id"],
                m["yw_type"],
                m["time"],
                m["Y_data"],
              ];
              d.push(mValue);
            }
          }
          _seriesData.push({
            name: _legendData[mn],
            type: "scatter",
            symbolSize: 20,
            itemStyle: {
              opacity: 0.8,
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowOffsetY: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
            data: d,
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
    compare(prop) {
      return function (obj1, obj2) {
        var val1 = obj1[prop];
        var val2 = obj2[prop];
        if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
          val1 = Number(val1);
          val2 = Number(val2);
        }
        if (val1 < val2) {
          return -1;
        } else if (val1 > val2) {
          return 1;
        } else {
          return 0;
        }
      };
    },
    indicatorModelChange() {
      let _this = this;
      getHttp("/api/Cj_Sj/getOriginalData?cjZbId=" + this.indicatorModel, function (res) {
        let _data = res.data;
        for (let i = 0; i < _data.length; i++) {
          _data[i]["sy_id"] = "试验" + _data[i]["sy_id"];
        }

        _this.initChart(_data, "sy_id", "X_id", "Y_data");
      });
    },
  },
};
</script>
<style lang="scss">
.scatter_chart {
  width: 100%;
  height: 100%;
  .ivu-select {
    margin: 0 5px;
  }
}
</style>
