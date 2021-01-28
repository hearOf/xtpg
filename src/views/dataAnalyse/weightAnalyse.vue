<template>
  <div class="data_analyse_fir_mid">
    <div class="data_analyse_linkSet_content">
      <div id="sunburst_Chart" style="width: 100%; height: 100%"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import sunburstData from "@/assets/data/treemap.json";
import { getHttp } from "@/utils/httpserver";
export default {
  data() {
    return {};
  },

  components: {},

  computed: {},

  mounted() {
    this.getTreeData();
  },

  methods: {
    getTreeData() {
      let _this = this;
      getHttp("/api/Zb/getAll2", function (res) {
        _this.chartInit(_this.toTree(res.data));
      });
    },
    toTree(data) {
      // data[0]["open"] = true;
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
        var parent = map[item.front];
        // 如果找到索引，那么说明此项不在顶级当中,那么需要把此项添加到，他对应的父级中;
        if (parent) {
          (parent.children || (parent.children = [])).push(item);
        } else {
          //如果没有在map中找到对应的索引ID,那么直接把 当前的item添加到 val结果集中，作为顶级
          val.push(item);
        }
      });
      return val;
    },
    chartInit(sunburstData) {
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
            formatter: function (params) {
              return ["{a|" + params.name + "}", "{b|指标值：" + params.data.data + "}"];
              console.log(params);
            },
            rich: {
              a: {
                color: "blue",
              },
              b: {
                color: "green",
              },
            },
            // minAngle:5
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
      myChart.on("click", function (params) {
        console.log(params);
        params.data["children"] = [];
        params.data["children"].push({
          rear: 0,
          data: 0,
          name: "test2",
          id: 174,
          front: 7,
          value: 1,
        });
      });
    },
  },
};
</script>
<style lang="scss">
.data_analyse_fir_mid {
  width: 100%;
  height: 100%;
  .data_analyse_linkSet_content {
    width: 100%;
    height: 100%;
  }
}
</style>
