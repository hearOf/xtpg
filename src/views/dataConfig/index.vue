<template>
  <div class="data_config">
    <navHeader></navHeader>
    <div class="data_config_mid">
      <div class="data_config_statistics"></div>
      <div class="data_config_content">
        <div class="data_config_top">
          <Divider orientation="left">自动采集参数配置</Divider>
          <Form :model="testIDConfig" inline :label-width="100">
            <FormItem label="试验ID：" prop="originalID">
              <Input
                size="small"
                v-model="testIDConfig.originalID"
                style="width: 100px"
                @on-change="queryState = false"
              />
            </FormItem>
            <FormItem>
              <Button type="primary" @click="queryTestIDBtn">查询</Button>
              <Button type="primary" style="margin-left: 10px" @click="setTestIDBtn"
                >配置</Button
              >
            </FormItem>
            <FormItem class="ivu_test_table">
              <Table
                style="width: 100%"
                size="small"
                border
                :columns="testInfoColumns"
                :data="testInfoData"
              ></Table>
            </FormItem>
          </Form>
          <div class="data_config_bottom">
            <div class="clearFix">
              <p style="float: left; line-height: 32px; text-indent: 1em">
                采集指标配置：
              </p>
              <div class="clearFix" style="float: left; margin-left: 10px">
                <Button
                  type="primary"
                  icon="md-add"
                  @click="addRowData"
                  style="float: left"
                  >增加</Button
                >
              </div>
              <Modal
                v-model="addIndicatorModal"
                draggable
                scrollable
                title="增加采集指标"
                @on-ok="addIndicatorSave"
              >
                <Form :model="addIndicatorFormItem" :label-width="80">
                  <FormItem label="指标采集ID">
                    <Input
                      v-model="addIndicatorFormItem.indicatorID"
                      placeholder="Enter something..."
                    ></Input>
                  </FormItem>
                  <FormItem label="指标标识">
                    <Input
                      v-model="addIndicatorFormItem.indicatorIdentification"
                      placeholder="Enter something..."
                    ></Input>
                  </FormItem>
                  <FormItem label="指标名称">
                    <Input
                      v-model="addIndicatorFormItem.indicatorName"
                      placeholder="Enter something..."
                    ></Input>
                  </FormItem>
                  <FormItem label="备注">
                    <Input
                      v-model="addIndicatorFormItem.indicatorComment"
                      placeholder="Enter something..."
                    ></Input>
                  </FormItem>
                </Form>
              </Modal>
            </div>
            <Table
              :columns="configColumns"
              height="285"
              :data="configData"
              border
              style="margin-top: 10px"
            ></Table>
            <div style="margin: 10px; overflow: hidden">
              <div style="float: right">
                <Page
                  :total="dataCount"
                  :page-size="pageSize"
                  show-total
                  show-elevator
                  :current="page"
                  @on-change="changepage"
                  @on-page-size-change="pagesize"
                ></Page>
              </div>
            </div>
          </div>
        </div>
        <div class="data_config_middle">
          <Divider orientation="left">评估计算参数配置</Divider>
          <Form :model="dataSource" inline :label-width="100">
            <FormItem label="数据来源：" prop="originalID">
              <CheckboxGroup v-model="dataSource.dataSourceCheckbox">
                <Checkbox
                  v-for="(item, index) in testList"
                  :key="index"
                  :label="item.id"
                  >{{ item.name }}</Checkbox
                >
              </CheckboxGroup>
            </FormItem>
            <FormItem>
              <Button type="primary" @click="syncSourceBtn">设置</Button>
            </FormItem>
            <FormItem>
              <Button type="primary" @click="initConfigBtn">初始化配置</Button>
            </FormItem>
          </Form>
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
      addIndicatorModal: false,
      addIndicatorFormItem: {
        indicatorID: "",
        indicatorIdentification: "",
        indicatorName: "",
        indicatorComment: "",
      },
      // 保存获取到的表格数据
      getAllData: [],
      // 初始化信息总条数
      dataCount: 0,
      // 每页显示多少条
      pageSize: 5,
      // 当前页码
      page: 1,
      configColumns: [
        {
          title: "序号",
          key: "index",
          align: "center",
          width: 60,
          render: (h, params) => {
            return h("span", params.index + (this.page - 1) * this.pageSize + 1);
          },
        },
        {
          title: "指标采集ID",
          key: "id",
          align: "center",
          width: 100,
          render: (h, params) => {
            if (params.row.$isEdit && this.isEmptyValue(params.row.id)) {
              return h("Input", {
                props: {
                  type: "text",
                  value: params.row.id,
                },

                on: {
                  "on-blur": (event) => {
                    params.row.id = event.target.value;
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
                params.row.id
              );
            }
          },
        },
        {
          title: "指标标识",
          key: "zb_flag",
          render: (h, params) => {
            if (params.row.$isEdit && this.isEmptyValue(params.row.id)) {
              return h("Input", {
                props: {
                  type: "text",
                  value: params.row.zb_flag,
                },

                on: {
                  "on-blur": (event) => {
                    params.row.zb_flag = event.target.value;
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
                params.row.zb_flag
              );
            }
          },
        },
        {
          title: "指标名称",
          key: "zb_name",
          render: (h, params) => {
            if (params.row.$isEdit) {
              return h("Input", {
                props: {
                  type: "text",
                  value: params.row.zb_name,
                },

                on: {
                  "on-blur": (event) => {
                    params.row.zb_name = event.target.value;
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
                h("strong", params.row.zb_name),
              ]);
            }
          },
        },
        {
          title: "备注",
          key: "bz",
          align: "center",
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
                      // if (
                      //   !this.isEmptyValue(params.row.new_increased) &&
                      //   params.row.new_increased === true
                      // ) {

                      // } else {
                      getHttpParams(
                        "/api/CjZb/updateById",
                        function (res) {
                          _this.$Message["info"]({
                            background: true,
                            content: res.data,
                          });
                          _this.getTableData();
                        },
                        {
                          ID: params.row.id,
                          zb_name: params.row.zb_name,
                          bz: params.row.bz,
                          zb_flag: params.row.zb_flag,
                        }
                      );
                      // }
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
                      // if (
                      //   !this.isEmptyValue(params.row.new_increased) &&
                      //   params.row.new_increased === true
                      // ) {
                      //   this.configData.splice(params.index, 1);
                      // } else {
                      getHttp("/api/CjZb/del?ID=" + params.row.id, function (res) {
                        // _this.configData.splice(params.index, 1);
                        _this.$Message["info"]({
                          background: true,
                          content: res.data,
                        });
                        _this.getTableData();
                      });
                      // }
                    },
                  },
                },
                "删除"
              ),
            ]);
          },
        },
      ],
      configData: [],
      testIDConfig: {
        originalID: "",
        // 无数据时取上次成功的试验id
        hasTestID: "",
      },
      queryState: true,
      testInfoColumns: [
        {
          title: "试验名称",
          key: "name",
        },
        {
          title: "备注",
          key: "bz",
        },
      ],
      testInfoData: [],
      // 数据来源
      testList: [],
      dataSource: {
        dataSourceCheckbox: [],
      },
    };
  },

  components: {
    navHeader,
  },

  computed: {},

  mounted() {
    this.getTestData();
    this.getDataSource();
    this.getTableData();
  },

  methods: {
    // 获取试验数据
    getTestData() {
      let _this = this;
      this.testInfoData = [];
      getHttp("/api/Sy/getPresentSy?syId=", function (res) {
        let _data = res.data;
        if (!_this.isEmptyValue(_data)) {
          _this.testIDConfig.originalID = _data.id;
          _this.testIDConfig.hasTestID = _data.id;
          _this.testInfoData.push(_data);
        }
      });
    },
    queryTestIDBtn() {
      let _this = this;
      this.testInfoData = [];
      this.queryState = true;
      getHttp(
        "/api/Sy/getPresentSy?syId=" + this.testIDConfig.originalID,
        function (res) {
          let _data = res.data;
          if (!_this.isEmptyValue(_data)) {
            _this.testIDConfig.hasTestID = _data.id;
            _this.testInfoData.push(_data);
          }
        }
      );
    },
    setTestIDBtn() {
      let _this = this;
      if (this.queryState === true) {
        if (!this.isEmptyValue(this.testInfoData)) {
          getHttp(
            "/api/Sy/getPresentSy?syId=" + this.testIDConfig.originalID,
            function (res) {
              let _data = res.data;
              _this.$Message["info"]({
                background: true,
                content: "设置成功！",
              });
              _this.testInfoData = [];
              _this.testInfoData.push(_data);
            }
          );
        } else {
          this.$Message["error"]({
            background: true,
            content: "无该试验！",
          });
          getHttp(
            "/api/Sy/getPresentSy?syId=" + this.testIDConfig.hasTestID,
            function (res) {}
          );
        }
      } else {
        this.$Message["error"]({
          background: true,
          content: "请查询有无该试验！",
        });
      }
    },
    getDataSource() {
      let _this = this;
      getHttp("/api/Sy/getAll", function (res) {
        let _data = res.data;
        _this.testList = _data;
        _this.dataSource.dataSourceCheckbox = [];
        getHttp("/api/Ly/getSyIds", function (params) {
          let _resData = params.data;
          for (let i = 0; i < _resData.length; i++) {
            _this.dataSource.dataSourceCheckbox.push(parseInt(_resData[i]));
          }
        });
      });
    },
    // 同步数据来源
    syncSourceBtn() {
      let _this = this;
      getHttp(
        "/api/Ly/updateAll?sy_ids=" + this.dataSource.dataSourceCheckbox.join(","),
        function (res) {
          _this.$Message["info"]({
            background: true,
            content: res.data,
          });
        }
      );
    },
    // 初始化配置
    initConfigBtn() {
      let _this = this;
      this.$Modal.confirm({
        title: "初始化配置",
        content: "<p>是否初始化</p>",
        onOk: () => {
          getHttp("/api/Ly/delAll", function (res) {
            _this.dataSource.dataSourceCheckbox = [];
            _this.$Message["info"]({
              background: true,
              content: res.data,
            });
          });
        },
        onCancel: () => {},
      });
    },
    // 获取数据
    getTableData() {
      let _this = this;
      getHttp("/api/CjZb/selectAll", function (res) {
        let _data = res.data;
        _this.getDataCreateTable(_data);
      });
    },
    // 获取数据创建表格
    getDataCreateTable(_data) {
      // 保存取到的所有数据
      this.getAllData = _data;
      this.dataCount = _data.length;
      // 初始化显示，小于每页显示条数，全显，大于每页显示条数，取前每页条数显示
      if (_data.length < this.pageSize) {
        this.configData = this.getAllData;
      } else {
        this.configData = this.getAllData.slice(0, this.pageSize);
      }
    },
    // 改变页数时事件
    changepage(index) {
      // 当前页码
      this.page = index;
      let _start = (index - 1) * this.pageSize;
      let _end = index * this.pageSize;
      this.configData = this.getAllData.slice(_start, _end);
    },
    // 改变页数条数时事件
    pagesize(index) {
      let _start = (this.page - 1) * index;
      let _end = this.page * index;
      this.configData = this.getAllData.slice(_start, _end);
      // 当前展示条数
      this.pageSize = index;
    },
    addRowData() {
      this.addIndicatorModal = true;
      // let _pageTotal = Math.ceil(this.dataCount / this.pageSize);
      // this.changepage(_pageTotal);
      // this.configData.push({
      //   id: "",
      //   zb_name: "",
      //   bz: "",
      //   new_increased: true,
      //   zb_flag: "",
      // });
    },
    addIndicatorSave() {
      let _this = this;

      getHttpParams(
        "/api/CjZb/save",
        function (res) {
          _this.$Message["info"]({
            background: true,
            content: res.data,
          });
          _this.getTableData();
        },
        {
          ID: _this.addIndicatorFormItem.indicatorID,
          zb_name: _this.addIndicatorFormItem.indicatorIdentification,
          bz: _this.addIndicatorFormItem.indicatorName,
          zb_flag: _this.addIndicatorFormItem.indicatorComment,
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
.data_config {
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
  .data_config_mid {
    position: absolute;
    left: 20px;
    right: 20px;
    top: 100px;
    bottom: 42px;
    .data_config_statistics {
      width: 100%;
      height: 30px;
      background: rgba(0, 0, 0, 0.4);
      position: relative;
      z-index: 1;
    }
    .data_config_content {
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
      .data_config_top {
        .ivu_test_table {
          width: 100%;
          .ivu-form-item-content {
            margin-left: 0 !important;
            width: 100%;
          }
        }
      }
      .data_config_bottom {
        > p {
          text-align: left;
          line-height: 30px;
          font-size: 14px;
        }
      }
      .data_config_middle {
        .ivu-form {
          width: 600px;
        }
      }
      .ivu-form {
        text-align: left;
        .ivu-form-item-label {
          color: white;
        }
      }
      .ivu-divider-horizontal {
        margin: 0;
      }
      .ivu-divider-horizontal.ivu-divider-with-text-left {
        color: white;
      }
    }
  }
}
</style>
