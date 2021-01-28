<template>
  <div class="weight_project_sec clearFix">
    <List item-layout="vertical">
      <ListItem>
        <ListItemMeta title="概述" />
        <ListItemMeta
          description="由于层次分析模型中同一层的每个指标元素对上一层指标元素或下一层指标元素的重要性一般不同。因此，在确定层次分析模型后，需要在各层指标元素中进行两两比较，按照描述重要性的标度，构造出比较判断矩阵。判断矩阵反映了本层次有关指标对上一层次某个指标的相对重要性，是系统评估的基本依据。两个指标元素比较时，一般采用下表中的9个标度来表示。利用这些标度，可以将量纲不一致的定性指标进行定量比较。"
        ></ListItemMeta>
      </ListItem>
    </List>
    <Table :columns="descriptionColumns" :data="descriptionData"></Table>
    <div class="page_turning_btn">
      <Button
        type="primary"
        :disabled="lastIndicatorDisabled"
        @click="lastIndicatorChange"
        >上一步</Button
      >
      <Button
        type="primary"
        :disabled="nextIndicatorDisabled"
        @click="nextIndicatorChange"
        >下一步</Button
      >
    </div>
    <div v-show="indicatorPage.indicatorPageFir">
      <weightGrid
        v-for="(item, index) in indicatorPage.tableListFir"
        :key="index"
        :tableIndex="index"
        :dataList="indicatorPage.tableListFir"
        levelStr="1"
      ></weightGrid>
    </div>
    <div v-show="indicatorPage.indicatorPageSec">
      <weightGrid
        v-for="(itemSec, indexSec) in indicatorPage.tableListSec"
        :key="indexSec"
        :tableIndex="indexSec"
        :dataList="indicatorPage.tableListSec"
        levelStr="2"
      ></weightGrid>
    </div>
    <div v-show="indicatorPage.indicatorPageThir">
      <weightGrid
        v-for="(itemThir, indexThir) in indicatorPage.tableListThir"
        :key="indexThir"
        :tableIndex="indexThir"
        :dataList="indicatorPage.tableListThir"
        levelStr="3"
      ></weightGrid>
    </div>
  </div>
</template>

<script>
import { getHttp } from "@/utils/httpserver";
import weightGrid from "@/components/Grid/weightGrid.vue";
export default {
  data() {
    return {
      nextIndicatorNum: 1,
      nextIndicatorDisabled: false,
      lastIndicatorDisabled: true,
      indicatorPage: {
        indicatorPageFir: true,
        indicatorPageSec: false,
        indicatorPageThir: false,
        tableListFir: [],
        tableListSec: [],
        tableListThir: [],
      },
      descriptionColumns: [
        {
          title: "标度（i，j）",
          key: "biaodu",
        },
        {
          title: "标度（j，i）",
          key: "biaodu2",
        },
        {
          title: "含义",
          key: "hanyi",
        },
      ],
      descriptionData: [
        {
          biaodu: "1",
          biaodu2: "1",
          hanyi: "指标i与指标j具有同样重要性",
        },
        {
          biaodu: "3",
          biaodu2: "1/3",
          hanyi: "指标i比指标j稍微重要",
        },
        {
          biaodu: "5",
          biaodu2: "1/5",
          hanyi: "指标i比指标j明显重要",
        },
        {
          biaodu: "7",
          biaodu2: "1/7",
          hanyi: "指标i比指标j强烈重要",
        },
        {
          biaodu: "9",
          biaodu2: "1/9",
          hanyi: "指标i比指标j极端重要",
        },
        {
          biaodu: "2,4,6,8",
          biaodu2: "1/2，1/4，1/6，1/8",
          hanyi: "上述两相邻判断的中值",
        },
      ],
    };
  },

  components: {
    weightGrid,
  },

  computed: {},

  mounted() {
    this.getTableData();
  },

  methods: {
    getTableData() {
      let _this = this;
      getHttp("/api/W2/getById", function (res) {
        let _data = res.data;
        _this.indicatorPage.tableListFir = _data.key1.concat(_data.key2);
        _this.indicatorPage.tableListSec = _data.key3;
        _this.indicatorPage.tableListThir = _data.key4;
      });
    },
    nextIndicatorChange() {
      this.nextIndicatorNum += 1;
      this.lastIndicatorDisabled = false;
      if (this.nextIndicatorNum === 3) {
        this.nextIndicatorDisabled = true;
        this.indicatorPage.indicatorPageFir = false;
        this.indicatorPage.indicatorPageSec = false;
        this.indicatorPage.indicatorPageThir = true;
      }
      if (this.nextIndicatorNum === 2) {
        this.indicatorPage.indicatorPageFir = false;
        this.indicatorPage.indicatorPageSec = true;
        this.indicatorPage.indicatorPageThir = false;
      }
    },
    lastIndicatorChange() {
      this.nextIndicatorNum -= 1;
      this.nextIndicatorDisabled = false;
      if (this.nextIndicatorNum === 1) {
        this.lastIndicatorDisabled = true;
        this.indicatorPage.indicatorPageFir = true;
        this.indicatorPage.indicatorPageSec = false;
        this.indicatorPage.indicatorPageThir = false;
      }
      if (this.nextIndicatorNum === 2) {
        this.indicatorPage.indicatorPageFir = false;
        this.indicatorPage.indicatorPageSec = true;
        this.indicatorPage.indicatorPageThir = false;
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
.clearFix {
  *zoom: 1;
}

.clearFix:after {
  content: "";
  display: block;
  height: 0;
  clear: both;
}
.weight_project_sec {
  .ivu-list-split .ivu-list-item {
    border: none;
  }
  img {
    margin: 0 5px;
  }
  .ivu_list_content {
    text-align: left;
    text-indent: 2em;
  }
  .ivu-list-item-meta-content {
    text-align: left;
    .ivu-list-item-meta-title {
      color: white;
    }
    .ivu-list-item-meta-description {
      color: white;
      text-indent: 2em;
      margin: 5px 0;
    }
  }
  .page_turning_btn {
    text-align: right;
    padding: 0 10px;
    button {
      margin: 5px;
    }
  }
  .weight_grid {
    width: 100%;
    margin: 10px 0;
  }
}
</style>
