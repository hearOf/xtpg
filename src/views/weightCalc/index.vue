<!--
 * @Author: GuFan
 * @Date: 2020-12-22 10:25:28
 * @LastEditTime: 2020-12-22 15:03:12
 * @LastEditors: Please set LastEditors
 * @Description: 权重计算
 * @FilePath: \vue-echarts\src\views\weightCalc\index.vue
-->
<template>
  <div class="weight_calc">
    <navHeader></navHeader>
    <div class="weight_calc_mid">
      <div class="weight_calc_statistics"></div>
      <div class="weight_calc_content">
        <Form :model="weightRadio" inline :label-width="100">
          <FormItem label="权重配置方案" prop="radio">
            <RadioGroup v-model="weightRadio.radio" @on-change="weightRadioChange">
              <Radio label="1">方案1：专家打分法/德尔菲法</Radio>
              <Radio label="2">方案2：9标度法</Radio>
              <Radio label="3">方案3</Radio>
            </RadioGroup>
          </FormItem>

          <FormItem>
            <Button type="primary" @click="radioChange">设置</Button>
          </FormItem>
        </Form>
        <Divider orientation="left">指标权重配置</Divider>
        <div class="weight_calc_project_fir" v-show="weightProjectFir">
          <List item-layout="vertical">
            <ListItem>
              <ListItemMeta title="概述" />
              <ListItemMeta
                description="专家打分法是通过征询有关专家的意见，对专家意见进行统计、处理、分析和归纳，客观地综合多数专家经验与主观判断，对难以采用技术方法进行定量分析的指标元素权重做出合理估算。专家打分法最终给出的是基于专家经验知识的指标权重方案。"
              ></ListItemMeta>
              <ListItemMeta
                description="德尔菲法是一种反馈匿名函询法，通过对所要解决的问题征得专家的意见进行整理、归纳、统计，再匿名反馈给各专家，再次征求意见，再集中，再反馈，直至得到一致的意见为止。德尔菲法最终给出的是被所有专家认可的指标权重方案。"
              ></ListItemMeta>
            </ListItem>
          </List>
          <vxe-table
            border
            height="450"
            :scroll-y="{ enabled: false }"
            :span-method="rowspanMethod"
            :data="tableData"
            ref="xTable"
            :edit-config="{ trigger: 'manual', mode: 'row' }"
          >
            <vxe-table-column field="name1" title="一级指标">
              <template v-slot="{ row }">
                {{ row.name1 }}
              </template>
            </vxe-table-column>
            <vxe-table-column field="name2" title="二级指标">
              <template v-slot="{ row }">
                {{ row.name2 }}
              </template>
            </vxe-table-column>
            <vxe-table-column field="name3" title="三级指标">
              <template v-slot="{ row }">
                {{ row.name3 }}
              </template>
            </vxe-table-column>
            <vxe-table-column field="name4" title="四级指标">
              <template v-slot="{ row }">
                {{ row.name4 }}
              </template>
            </vxe-table-column>
            <vxe-table-column
              field="weight"
              title="权重值"
              :edit-render="{ name: 'input', attrs: { type: 'text' } }"
            >
              <template v-slot="{ row }">
                {{ row.weight }}
              </template>
            </vxe-table-column>
            <vxe-table-column title="操作" width="160">
              <template v-slot="{ row }">
                <template v-if="isActiveByRow(row)">
                  <vxe-button @click="saveRowEvent(row)">保存</vxe-button>
                  <vxe-button @click="cancelRowEvent(row)">取消</vxe-button>
                </template>
                <template v-else>
                  <vxe-button @click="editRowEvent(row)">编辑</vxe-button>
                </template>
              </template>
            </vxe-table-column>
          </vxe-table>
        </div>
        <div class="weight_calc_project_sec scrollbar" v-show="weightProjectSec">
          <projeceSec></projeceSec>
        </div>
        <div class="weight_calc_project_thir" v-show="weightProjectThir">
          <List item-layout="vertical">
            <ListItem>
              <ListItemMeta
                title="概述"
                description="按照信息论基本原理的解释，信息是系统有序程度的一个度量，熵是系统无序程度的一个度量；根据信息熵的定义，对于某项指标，可以用熵值来判断某个指标的离散程度，其信息熵值越小，指标的离散程度越大， 该指标对综合评价的影响（即权重）就越大，如果某项指标的值全部相等，则该指标在综合评价中不起作用。因此，可利用信息熵这个工具，计算出各个指标的权重，为多指标综合评价提供依据。"
              />
            </ListItem>
            <ListItem>
              <ListItemMeta title="熵权法赋权步骤" />
              <ListItemMeta description="1.数据标准化"></ListItemMeta>
              <div class="ivu_list_content">
                将各个指标的数据进行标准化处理。假设给定了k个指标X1,X2，……，Xk，其中<img
                  src="@/assets/img/content1.png"
                />。假设对各指标数据标准化后的值为<img
                  src="@/assets/img/content2.png"
                />，那么<img src="@/assets/img/content3.png" />。
              </div>
              <ListItemMeta description="2.求各指标的信息熵"></ListItemMeta>
              <div class="ivu_list_content">
                根据信息论中信息熵的定义，一组数据的信息熵<img
                  src="@/assets/img/content4.png"
                />。其中<img src="@/assets/img/content5.png" />，如果<img
                  src="@/assets/img/content6.png"
                />， 则定义<img src="@/assets/img/content7.png" />。
              </div>
              <ListItemMeta description="3.确定各指标权重"></ListItemMeta>
              <div class="ivu_list_content">
                根据信息熵的计算公式，计算出各个指标的信息熵为<img
                  src="@/assets/img/content8.png"
                />通过信息熵计算各指标的权重：<img src="@/assets/img/content9.png" />。
              </div>
            </ListItem>
          </List>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import XEUtils from "xe-utils";
import { getHttp } from "@/utils/httpserver";
import navHeader from "@/components/navHeader";
import projeceSec from "./weightProjectSec.vue";

export default {
  data() {
    return {
      weightRadio: {
        radio: null,
      },
      tableData: [],
      weightProjectFir: true,
      weightProjectSec: false,
      weightProjectThir: false,
    };
  },

  components: {
    navHeader,
    projeceSec,
  },

  created() {
    let _this = this;
    this.getWeightData(function (res) {
      for (let i = 0; i < res.length; i++) {
        res[i]["parentId"] = res[i].front;
      }
      const treeData = XEUtils.toArrayTree(res);
      _this.toColTreeData(treeData);
    });
  },
  computed: {},

  mounted() {
    this.getDefaultWeight();
  },

  methods: {
    // 获取默认权重
    getDefaultWeight() {
      let _this = this;
      getHttp("/api/Zb/getPlanData", function (res) {
        let _data = res.data;
        _this.weightRadio.radio = _data.toString();
      });
    },
    // 权重选择
    radioChange() {
      let _this = this;
      getHttp(
        "/api/Zb/updatePlan?plan=" + parseInt(this.weightRadio.radio),
        function (res) {
          let _data = res.data;
          _this.$Message["info"]({
            background: true,
            content: _data,
          });
        }
      );
    },
    weightRadioChange(value) {
      if (value === "1") {
        this.weightProjectFir = true;
        this.weightProjectSec = false;
        this.weightProjectThir = false;
      }
      if (value === "2") {
        this.weightProjectFir = false;
        this.weightProjectSec = true;
        this.weightProjectThir = false;
      }
      if (value === "3") {
        this.weightProjectFir = false;
        this.weightProjectSec = false;
        this.weightProjectThir = true;
      }
    },
    // 获取指标权重数据
    getWeightData(callback) {
      getHttp("/api/Zb/getAll", function (res) {
        let _data = res.data;
        callback(_data);
      });
    },
    // 将普通树结构转换为横向树列表
    toColTreeData(treeData) {
      const options = { children: "children" };
      const list = [];
      const keyMap = {};
      let _indicatorId = "";
      XEUtils.eachTree(
        treeData,
        (item, index, result, paths, parent) => {
          keyMap[item.id] = item;
          item.keys = parent ? parent.keys.concat([item.id]) : [item.id];
          if (!item.children || !item.children.length) {
            const row = {};
            item.keys.forEach((key, index) => {
              const level = index + 1;
              const obj = keyMap[key];
              if (obj.rear === 0) {
                _indicatorId = obj.id;
              }
              row[`id`] = _indicatorId;
              row[`name${level}`] = obj.name;
              row[`weight`] = obj.w1;
            });
            list.push(row);
          }
        },
        options
      );
      this.keyMap = keyMap;
      this.tableData = list;
    },
    // 通用行合并函数（将相同多列数据合并为一行）
    rowspanMethod({ row, _rowIndex, column, visibleData }) {
      const fields = ["name1", "name2", "name3", "name4"];
      const cellValue = XEUtils.get(row, column.property);
      if (cellValue && fields.includes(column.property)) {
        const prevRow = visibleData[_rowIndex - 1];
        let nextRow = visibleData[_rowIndex + 1];
        if (prevRow && XEUtils.get(prevRow, column.property) === cellValue) {
          return { rowspan: 0, colspan: 0 };
        } else {
          let countRowspan = 1;
          while (nextRow && XEUtils.get(nextRow, column.property) === cellValue) {
            nextRow = visibleData[++countRowspan + _rowIndex];
          }
          if (countRowspan > 1) {
            return { rowspan: countRowspan, colspan: 1 };
          }
        }
      }
    },
    isActiveByRow(row) {
      return this.$refs.xTable.isActiveByRow(row);
    },
    editRowEvent(row) {
      this.$refs.xTable.setActiveRow(row);
    },
    saveRowEvent(row) {
      let _this = this;
      this.$refs.xTable.clearActived().then(() => {
        getHttp(
          "/api/Zb/updatePlanById?ww=" + row.weight + "&id=" + row.id,
          function (res) {
            _this.$Message["info"]({
              background: true,
              content: res.data,
            });
          }
        );
      });
    },
    cancelRowEvent(row) {
      const xTable = this.$refs.xTable;
      xTable.clearActived().then(() => {
        // 还原行数据
        xTable.revertData(row);
      });
    },
  },
};
</script>
<style lang="scss">
.weight_calc {
  width: 100%;
  height: 100%;
  background: #2c3e50;
  color: white;
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
  .weight_calc_mid {
    position: absolute;
    left: 20px;
    right: 20px;
    top: 100px;
    bottom: 42px;
    .weight_calc_statistics {
      width: 100%;
      height: 30px;
      background: rgba(0, 0, 0, 0.4);
      position: relative;
      z-index: 1;
    }
    .weight_calc_content {
      position: absolute;
      top: 40px;
      left: 0;
      bottom: 0;
      right: 0;
      padding: 10px;
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
      .ivu-divider-horizontal.ivu-divider-with-text-left {
        color: white;
      }
      .ivu-form {
        text-align: left;
        .ivu-form-item-label {
          color: white;
        }
      }
      .weight_calc_project_sec {
        position: absolute;
        top: 122px;
        left: 10px;
        right: 10px;
        bottom: 10px;
        overflow-x: hidden;
        overflow-y: auto;
      }
      .weight_calc_project_thir,
      .weight_calc_project_fir {
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
      }
    }
  }
}
</style>
