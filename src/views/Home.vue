<template>
  <div class="home">
    <navHeader></navHeader>
    <div class="device_management_mid">
      <div class="device_statistics"></div>
      <div class="device_linkSet_content">
        <!-- position:absolute;left:50%;transform:translateX(-50%); -->
        <div id="liquidFill_chart" style="width: 100px; height: 100px"></div>
        <div
          id="tree_chart"
          style="width: 100%; height: 100%; position: absolute; top: 0"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import navHeader from "../components/navHeader";
import liquidFillCharts from "echarts-liquidfill";
import $ from "jquery";
import { getHttp } from "@/utils/httpserver";
export default {
  name: "home",
  components: {
    navHeader,
  },
  data() {
    return {
      path: this.$root.portUrl + "home",
      socket: "",
      treeSeriesChildren: [],
    };
  },
  mounted() {
    this.init();
    this.getTreeData();
  },
  methods: {
    init: function () {
      if (typeof WebSocket === "undefined") {
        alert("您的浏览器不支持socket");
      } else {
        // 实例化socket
        this.socket = new WebSocket(this.path);
        // 监听socket连接
        this.socket.onopen = this.open;
        // 监听socket错误信息
        this.socket.onerror = this.error;
        // 监听socket消息
        this.socket.onmessage = this.getMessage;
        this.socket.onclose = this.close;
      }
    },
    open: function () {
      console.log("home------socket连接成功");
    },
    error: function () {
      console.log("home------socket连接错误");
    },
    getMessage: function (msg) {
      let _data = eval("(" + msg.data + ")");
      this.liquidFillChart(_data.assessmentData);
    },
    send: function () {
      this.socket.send("aaaa");
    },
    close: function () {
      console.log("home------socket已经关闭");
    },
    getTreeData() {
      let _this = this;
      getHttp("/api/Zb/getAll", function (res) {
        _this.chartInit(_this.toTree(res.data));
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
        // TODO 显示id(暂时)
        // item["name"] = item["name"] + item["id"];
        // 以当前遍历项，的pid,去map对象中找到索引的id
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
    chartInit(chartData) {
      let _chartDom = document.getElementById("tree_chart");
      let myChart = echarts.init(_chartDom);
      let option = {
        tooltip: {
          trigger: "item",
          triggerOn: "mousemove",
        },
        series: [
          {
            type: "tree",

            data: [
              {
                name: "宽带网系统评估",
                label: {
                  rotate: 360,
                  align: "center",
                  fontSize: 20,
                  fontWeight: "bold",
                },
                children: chartData,
              },
            ],

            left: "2%",
            right: "2%",
            top: "8%",
            bottom: "20%",

            symbol: "emptyCircle",

            orient: "vertical",

            expandAndCollapse: false,

            label: {
              position: "top",
              rotate: -90,
              verticalAlign: "middle",
              align: "right",
              fontSize: 12,
              color: "rgba(255,255,255,.8)",
            },

            leaves: {
              label: {
                position: "bottom",
                rotate: -90,
                verticalAlign: "middle",
                align: "left",
              },
            },

            animationDurationUpdate: 750,
            edgeShape: "polyline",
          },
        ],
      };
      myChart.setOption(option);
    },
    liquidFillChart(gradeValue) {
      let _chartDom = document.getElementById("liquidFill_chart");
      let myChart = echarts.init(_chartDom);
      let option = {
        series: [
          {
            type: "liquidFill",
            radius: "60%",
            center: ["50%", "40%"],
            data: [
              {
                name: gradeValue,
                value: gradeValue / 100,
              },
              gradeValue / 100 + 0.05,
              gradeValue / 100 + 0.03,
              gradeValue / 100 + 0.01,
            ],
            backgroundStyle: {
              borderWidth: 2,
              borderColor: "#459DBD",
              // color: "rgba(0,0,0,.2)",
            },
            color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
              {
                offset: 1,
                color: "rgba(73, 126, 255, 0.36)",
              },
              {
                offset: 0,
                color: "rgba(135, 241, 244, 0.7)",
              },
            ]),
            itemStyle: {
              shadowBlur: 0,
              color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                {
                  offset: 1,
                  color: "rgba(135, 241, 244, 0.7)",
                },
                {
                  offset: 0,
                  color: "rgba(73, 192, 255, 0.7)",
                },
              ]),
              opacity: 1,
            },
            outline: {
              show: false,
            },
            label: {
              fontSize: 14,
              formatter: "{b}",
              align: "center",
            },
          },
        ],
      };
      myChart.setOption(option);
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
  destroyed() {
    this.socket.close(); //离开路由之后断开websocket连接
  },
};
</script>

<style lang="scss">
.home {
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
  .device_management_mid {
    position: absolute;
    left: 20px;
    right: 20px;
    top: 100px;
    bottom: 42px;
    .device_statistics {
      width: 100%;
      height: 30px;
      background: rgba(0, 0, 0, 0.4);
      position: relative;
      z-index: 1;
    }
    .device_linkSet_content {
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
