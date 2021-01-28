<template>
  <div class="synthetical_analyse">
    <div class="chart_container clearFix">
      <div class="tree_container scrollbar">
        <Tree :data="data1" @on-select-change="treeSelectChange"></Tree>
      </div>
      <div style="float: left; width: 86%">
        <Table height="280" border :columns="treeColumns" :data="treeData"></Table>
        <div
          id="pie_chart"
          style="width: 50%; height: 400px; margin-top: 20px; float: left"
        ></div>
        <div
          id="bar_chart"
          style="width: 50%; height: 400px; margin-top: 20px; float: left"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import $ from "jquery";
import { getHttp } from "@/utils/httpserver";
export default {
  data() {
    return {
      data1: [
        {
          title: "宽带系统评估",
          expand: true,
          selected: true,
          children: [],
        },
      ],
      treeColumns: [
        {
          title: "指标",
          key: "name",
        },
        {
          title: "指标权重",
          key: "weight",
        },
        {
          title: "指标值",
          key: "value",
        },
      ],
      treeData: [],
    };
  },

  components: {},

  computed: {},

  mounted() {
    let _this = this;
    this.getTreeData();
    getHttp("/api/Zb/getZBTreeDataList1?fount=0", function (res) {
      let _data = res.data;
      _this._RenderChart(_data);
      _this._RenderBarChart(_data);
      _this.treeData = _data;
    });
  },

  methods: {
    getTreeData() {
      let _this = this;
      getHttp("/api/Zb/getAll1", function (res) {
        console.log(_this.toTree(res.data));
        _this.data1[0].children = _this.toTree(res.data);
      });
    },
    toTree(data) {
      data[0]["open"] = true;
      // 删除 所有 children,以防止多次调用
      data.forEach(function (item) {
        delete item.children;
      });

      // 将数据存储为 以 id 为 KEY 的 map 索引数据列
      var map = {};
      data.forEach(function (item) {
        map[item.id] = item;
      });
      //        console.log(map);
      var val = [];
      data.forEach(function (item) {
        // 以当前遍历项，的pid,去map对象中找到索引的id
        item["title"] = item["name"];
        var parent = map[item.front];
        // 好绕啊，如果找到索引，那么说明此项不在顶级当中,那么需要把此项添加到，他对应的父级中
        if (parent) {
          (parent.children || (parent.children = [])).push(item);
        } else {
          //如果没有在map中找到对应的索引ID,那么直接把 当前的item添加到 val结果集中，作为顶级
          val.push(item);
        }
      });
      return val;
    },
    treeSelectChange(currentArray, currentItem) {
      let _this = this;
      let _id = 0;
      if (!this.isEmptyValue(currentItem.id)) {
        _id = currentItem.id;
      }
      getHttp("/api/Zb/getZBTreeDataList1?fount=" + _id, function (res) {
        let _data = res.data;
        _this._RenderChart(_data);
        _this._RenderBarChart(_data);
        _this.treeData = _data;
      });
    },

    _RenderChart: function (data) {
      var self = this;
      // TODO 获取数据 渲染饼图
      let dom = document.getElementById("pie_chart");
      let myChart = echarts.init(dom);

      let _titleText = "指标权重";

      let option = {
        title: {
          text: _titleText,
          x: "left",
          textStyle: {
            fontSize: 14,
            color: "#fff",
          },
        },
        tooltip: {
          trigger: "item",
          formatter: "{b} : {c} ({d}%)",
        },
        legend: {
          orient: "horizontal",
          left: "left",
          top: "5%",
          textStyle: {
            color: "#fff",
          },
          data: this._legendData(data).data,
        },
        series: [
          {
            name: this._seriesName(data),
            type: "pie",
            radius: "55%",
            center: ["50%", "50%"],
            data: this._seriesData(data),
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      };

      if (option && typeof option === "object") {
        myChart.setOption(option, true);
      }
    },
    _legendData: function (data) {
      let _legendData = [];
      let legend = [];
      let dataLen = data.length;
      let _d = data;

      if (dataLen && dataLen > 0) {
        let set = new Set();
        for (let i = 0; i < dataLen; i++) {
          let _legendField = _d[i]["name"];
          if (!set.has(_legendField)) {
            set.add(_legendField);
          }
        }
        legend = Array.from(set);
      }

      _legendData.push({
        data: legend,
      });

      return _legendData;
    },
    _seriesName: function (data) {
      let _seriesName = [];
      let dataLength = data.length;
      if (dataLength && dataLength > 0) {
        let set = new Set();
        let _d = data;
        for (let i = 0; i < dataLength; i++) {
          let m = _d[i];
          let t = m["name"];
          if (!set.has(t)) {
            set.add(t);
          }
        }
        _seriesName = Array.from(set);
      }
      return _seriesName;
    },
    _seriesData: function (data) {
      let _seriesData = [];
      let _legendData = this._legendData(data);

      let dataLength = data.length;
      if (dataLength && dataLength > 0) {
        let ld = _legendData[0].data;

        let _d = data;
        for (let mn = 0; mn < ld.length; mn++) {
          let d = {};
          for (let i = 0; i < dataLength; i++) {
            let m = _d[i];
            let mLegendName = m["name"];

            if (ld[mn] === mLegendName) {
              let mValue = m["weight"];
              d = {
                name: mLegendName,
                value: mValue,
              };
            }
          }
          _seriesData.push(d);
        }
      }

      return _seriesData;
    },
    _RenderBarChart(data) {
      var self = this;
      // TODO 获取数据 渲染柱状图
      let dom = document.getElementById("bar_chart");
      let myChart = echarts.init(dom);

      let _xAxisData = [];
      let _seriesData = [];
      for (let i = 0; i < data.length; i++) {
        _xAxisData.push(data[i].name);
        _seriesData.push(data[i].value);
      }

      let _titleText = "指标值";

      let option = {
        title: {
          text: _titleText,
          x: "left",
          textStyle: {
            fontSize: 14,
            color: "#fff",
          },
        },
        tooltip: {
          //   trigger: "item",
          //   formatter: "{a} <br/>{b} : {c} ({d}%)",
        },
        legend: {
          orient: "horizontal",
          left: "left",
          top: "5%",
          textStyle: {
            color: "#fff",
          },
          data: ["指标值"],
        },
        xAxis: {
          type: "category",
          boundaryGap: true,
          axisLine: {
            lineStyle: {
              color: "white",
            },
          },
          data: _xAxisData,
        },
        yAxis: {
          type: "value",
          axisLine: {
            lineStyle: {
              color: "white",
            },
          },
        },
        series: [
          {
            name: "指标值",
            type: "bar",
            data: _seriesData,
          },
        ],
      };

      if (option && typeof option === "object") {
        myChart.setOption(option, true);
      }
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
};
</script>
<style lang="scss">
.synthetical_analyse {
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
  .scrollbar::-webkit-scrollbar {
    width: 3px;
    height: 200px;
  }

  /*滚动条滑块*/

  .scrollbar::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 10px;
    box-shadow: inset 0 0 5px #00ffff;
    background: #535353;
  }

  /*滚动条轨道*/

  .scrollbar::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    box-shadow: inset 0 0 5px #d8d8d8;
    border-radius: 10px;
    background: #ededed;
  }
  .chart_container {
    width: 100%;
    height: 100%;
    .tree_container {
      float: left;
      width: 12%;
      height: 100%;
      overflow-x: hidden;
      overflow-y: auto;
      .ivu-tree-title {
        color: white;
      }
      .ivu-tree-title:hover {
        background: #2d8cf0;
      }
      .ivu-tree-title-selected,
      .ivu-tree-title-selected:hover {
        background: #2d8cf0;
      }
    }
  }
}
</style>
