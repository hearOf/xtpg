<!--  -->
<template>
  <div class="test_management">
    <navHeader></navHeader>
    <div class="test_management_mid">
      <div class="test_management_statistics"></div>
      <div class="test_management_content clearFix">
        <div class="test_table">
          <div class="clearFix">
            <Button
              type="primary"
              icon="md-add"
              @click="addTestRowData"
              style="float: left"
              >增加</Button
            >
          </div>
          <Modal
            v-model="addTestModal"
            draggable
            scrollable
            title="增加试验"
            @on-ok="addTestSave"
          >
            <Form :model="addTestFormItem" :label-width="80">
              <FormItem label="试验名称">
                <Input
                  v-model="addTestFormItem.testName"
                  placeholder="Enter something..."
                ></Input>
              </FormItem>
              <FormItem label="备注">
                <Input
                  v-model="addTestFormItem.testComment"
                  placeholder="Enter something..."
                ></Input>
              </FormItem>
            </Form>
          </Modal>
          <Table
            :loading="loading"
            border
            height="200"
            style="margin-top: 10px"
            highlight-row
            ref="currentRowTable"
            :columns="testColumns"
            :data="testData"
            @on-current-change="testTableCurrentChange"
          ></Table>
        </div>
        <div class="test_bottom_container clearFix">
          <div class="test_tree scrollbar">
            <Tree
              :data="treeData"
              :load-data="loadData"
              @on-select-change="testTreeSelectChange"
            ></Tree>
          </div>
          <div class="test_node_table clearFix">
            <div style="line-height: 32px" class="clearFix">
              <p style="float: left" class="currentTest"></p>
              <Button
                type="primary"
                :disabled="addRowDisabled"
                icon="md-add"
                style="float: left; margin: 0 10px"
                @click="addRowData"
                >增加</Button
              >
            </div>
            <Table
              height="430"
              style="margin-top: 10px; float: left"
              :columns="nodeColumns"
              :data="nodeData"
            ></Table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import navHeader from "@/components/navHeader";
import { getHttp, getHttpParams } from "@/utils/httpserver";
export default {
  data() {
    return {
      loading: true,
      addTestModal: false,
      addTestFormItem: {
        testName: "",
        testComment: "",
      },
      testColumns: [
        {
          title: "试验名称",
          key: "name",
          render: (h, params) => {
            if (params.row.$isEdit) {
              return h("Input", {
                props: {
                  type: "text",
                  value: params.row.name,
                },

                on: {
                  "on-blur": (event) => {
                    params.row.name = event.target.value;
                  },
                },
              });
            } else {
              return h("div", [
                h("Icon", {
                  props: {
                    type: "person",
                  },
                }),
                h("strong", params.row.name),
              ]);
            }
          },
        },
        {
          title: "备注",
          key: "bz",
          render: (h, params) => {
            if (params.row.$isEdit) {
              return h("Input", {
                props: {
                  type: "text",
                  value: params.row.bz,
                },

                on: {
                  "on-blur": (event) => {
                    params.row.bz = event.target.value;
                  },
                },
              });
            } else {
              return h(
                "div",
                {
                  on: {
                    click: () => {},
                  },
                },
                params.row.bz
              );
            }
          },
        },
        {
          title: "操作",
          key: "action",
          width: 250,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small",
                  },
                  style: {
                    marginRight: "5px",
                  },
                  on: {
                    click: () => {
                      this.$set(params.row, "$isEdit", true);
                    },
                  },
                },
                "编辑"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "info",
                    size: "small",
                  },
                  style: {
                    marginRight: "5px",
                  },
                  on: {
                    click: () => {
                      let _this = this;
                      this.$set(params.row, "$isEdit", false);
                      if (!this.isEmptyValue(params.row.id)) {
                        getHttpParams(
                          "/api/Sy/updateById",
                          function (res) {
                            _this.$Message["info"]({
                              background: true,
                              content: res.data,
                            });
                            _this.getTestData();
                          },
                          {
                            name: params.row.name,
                            bz: params.row.bz,
                          }
                        );
                      } else {
                      }
                    },
                  },
                },
                "保存"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small",
                  },
                  on: {
                    click: () => {
                      let _this = this;
                      if (!this.isEmptyValue(params.row.id)) {
                        getHttp("/api/Sy/del?ID=" + params.row.id, function (res) {
                          _this.testData.splice(params.index, 1);
                          _this.$Message["info"]({
                            background: true,
                            content: res.data,
                          });
                        });
                      } else {
                        this.testData.splice(params.index, 1);
                      }
                    },
                  },
                },
                "删除"
              ),
            ]);
          },
        },
      ],
      testData: [],
      treeData: [],
      testId: 1,
      testName: "",
      addRowDisabled: true,
      nodeColumns: [
        {
          title: "序号",
          type: "index",
          align: "center",
          width: 60,
        },
        {
          title: "数据",
          key: "data",
          align: "center",
          render: (h, params) => {
            if (params.row.$isEdit) {
              return h("Input", {
                props: {
                  type: "text",
                  value: params.row.data,
                },

                on: {
                  "on-blur": (event) => {
                    params.row.data = event.target.value;
                    // this.nodeData[params.index].data = event.target.value;
                  },
                },
              });
            } else {
              return h(
                "div",
                {
                  on: {
                    click: () => {},
                  },
                },
                params.row.data
              );
            }
          },
        },
        {
          title: "时间",
          key: "tm",
          align: "center",
          render: (h, params) => {
            if (params.row.$isEdit) {
              return h("Input", {
                props: {
                  type: "text",
                  value: params.row.tm,
                },

                on: {
                  "on-blur": (event) => {
                    params.row.tm = event.target.value;
                    // this.nodeData[params.index].tm = event.target.value;
                  },
                },
              });
            } else {
              return h(
                "div",
                {
                  on: {
                    click: () => {},
                  },
                },
                params.row.tm
              );
            }
          },
        },
        {
          title: "操作",
          key: "action",
          width: 250,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small",
                  },
                  style: {
                    marginRight: "5px",
                  },
                  on: {
                    click: () => {
                      this.$set(params.row, "$isEdit", true);
                    },
                  },
                },
                "编辑"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "info",
                    size: "small",
                  },
                  style: {
                    marginRight: "5px",
                  },
                  on: {
                    click: () => {
                      let _this = this;
                      this.$set(params.row, "$isEdit", false);
                      if (!this.isEmptyValue(params.row.id)) {
                        getHttp(
                          "/api/Sj/updateById?ID=" +
                            params.row.id +
                            "&data=" +
                            params.row.data +
                            "&tm=" +
                            params.row.tm,
                          function (res) {
                            _this.$Message["info"]({
                              background: true,
                              content: res.data,
                            });
                          }
                        );
                      } else {
                        getHttp(
                          "/api/Sj/saveSj?sy_id=" +
                            params.row.sy_id +
                            "&zb_id=" +
                            params.row.zb_id +
                            "&tm=" +
                            params.row.tm +
                            "&data=" +
                            params.row.data,
                          function (res) {
                            _this.$Message["info"]({
                              background: true,
                              content: res.data,
                            });
                            getHttp(
                              "/api/Sj/selectById?sy_id=" +
                                params.row.sy_id +
                                "&zb_id=" +
                                params.row.zb_id,
                              function (res) {
                                let _data = res.data;
                                _this.nodeData = _data;
                              }
                            );
                          }
                        );
                      }
                    },
                  },
                },
                "保存"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small",
                  },
                  on: {
                    click: () => {
                      let _this = this;
                      if (!this.isEmptyValue(params.row.id)) {
                        getHttp("/api/Sj/del?ID=" + params.row.id, function (res) {
                          _this.nodeData.splice(params.index, 1);
                          _this.$Message["info"]({
                            background: true,
                            content: res.data,
                          });
                        });
                      } else {
                        this.nodeData.splice(params.index, 1);
                      }
                    },
                  },
                },
                "删除"
              ),
            ]);
          },
        },
      ],
      nodeData: [],
      indicatorId: "",
      loadDataItem: [],
    };
  },

  components: {
    navHeader,
  },

  computed: {},

  mounted() {
    this.getTestData();
    this.getTreeData();
  },

  methods: {
    getTestData() {
      let _this = this;
      getHttp("/api/Sy/getAll", function (res) {
        let _data = res.data;
        _this.loading = false;
        _data[0]["_highlight"] = true;
        _this.testData = _data;
        _this.testName = _data[0].name;
        $(".currentTest").html("当前试验：" + _data[0].name);
      });
    },
    getTreeData() {
      let _this = this;

      getHttp("/api/Zb/getZBTreeDataList1?fount=0", function (res) {
        let _data = res.data;
        _this.loadDataItem.push(_data);
        for (let i = 0; i < _data.length; i++) {
          _this.treeData.push({
            title: _data[i].name,
            loading: false,
            children: [],
            indicatorId: _data[i].id,
            rear: _data[i].rear,
          });
        }
      });
    },
    loadData(item, callback) {
      let _this = this;
      getHttp("/api/Zb/getZBTreeDataList1?fount=" + item.indicatorId, function (res) {
        let _data = res.data;
        _this.loadDataItem.push(_data);
        let _dataList = [];
        for (let i = 0; i < _data.length; i++) {
          _dataList.push({
            title: _data[i].name,
            loading: false,
            children: [],
            indicatorId: _data[i].id,
            rear: _data[i].rear,
          });
        }
        callback(_dataList);
      });
    },
    testTableCurrentChange(currentRow, oldCurrentRow) {
      this.testId = currentRow.id;
      this.testName = currentRow.name;
      $(".currentTest").html("当前试验：" + currentRow.name);
    },
    testTreeSelectChange(currentSelect) {
      let _this = this;
      let _currentSelect = currentSelect[0];
      let _loadDataItem = this.loadDataItem;
      this.indicatorId = _currentSelect.indicatorId;
      console.log(_currentSelect);
      if (_currentSelect.rear === 0) {
        this.addRowDisabled = false;
      }
      if (_currentSelect.rear !== 0) {
        this.addRowDisabled = true;
      }

      for (let i = 0; i < _loadDataItem.length; i++) {
        let _loadDataItemObj = _loadDataItem[i];
        for (let j = 0; j < _loadDataItemObj.length; j++) {
          if (this.indicatorId === _loadDataItemObj[j].id) {
            let _currentTestHtml =
              "当前试验：" +
              this.testName +
              "，指标名称：" +
              _loadDataItemObj[j].name +
              "，定义：" +
              _loadDataItemObj[j].define;
            $(".currentTest").html(_currentTestHtml);
            this.nodeColumns[1].title = "数据(" + _loadDataItemObj[j].unit + ")";
          }
        }
      }

      getHttp(
        "/api/Sj/selectById?sy_id=" +
          this.testId +
          "&zb_id=" +
          _currentSelect.indicatorId,
        function (res) {
          let _data = res.data;
          _this.nodeData = _data;
        }
      );
    },
    addRowData() {
      this.nodeData.push({
        data: "",
        sy_id: this.testId,
        tm: "",
        zb_id: this.indicatorId,
        id: "",
      });
    },
    addTestRowData() {
      this.addTestModal = true;
      // this.testData.push({
      //   name: "",
      //   bz: "",
      // });
    },
    addTestSave() {
      let _this = this;
      getHttpParams(
        "/api/Sy/save",
        function (res) {
          _this.$Message["info"]({
            background: true,
            content: res.data,
          });
          _this.addTestFormItem.testName = "";
          _this.addTestFormItem.testComment = "";
          _this.getTestData();
        },
        {
          name: _this.addTestFormItem.testName,
          bz: _this.addTestFormItem.testComment,
        }
      );
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
.test_management {
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
  .clearFix {
    *zoom: 1;
  }

  .clearFix:after {
    content: "";
    display: block;
    height: 0;
    clear: both;
  }
  .test_management_mid {
    position: absolute;
    left: 20px;
    right: 20px;
    top: 100px;
    bottom: 42px;
    .test_management_statistics {
      width: 100%;
      height: 30px;
      background: rgba(0, 0, 0, 0.4);
      position: relative;
      z-index: 1;
    }
    .test_management_content {
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
      .test_table {
        width: 100%;
      }
      > div {
        float: left;
      }
      .test_bottom_container {
        margin-top: 10px;
        padding: 5px;
        border: 1px solid rgba(255, 255, 255, 0.5);
        .test_tree {
          width: 9%;
          height: 472px;
          text-align: left;
          overflow-y: auto;
          overflow-x: hidden;
          float: left;
          border-right: 1px solid rgba(255, 255, 255, 0.5);
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
        .test_node_table {
          margin-left: 10px;
          width: 90%;
          float: left;
        }
      }
    }
  }
}
</style>
