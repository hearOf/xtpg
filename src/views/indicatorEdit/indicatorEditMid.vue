<template>
  <div class="indicatorEdit_mid">
    <div class="indicatorEdit_statistics"></div>
    <div class="indicatorEdit_content">
      <!-- inline -->
      <div class="form_container">
        <Form
          ref="indicatorParams"
          :rules="ruleValidate"
          :model="indicatorParams"
          inline
          :label-width="140"
        >
          <FormItem label="指标名称" prop="indicatorName">
            <Input v-model="indicatorParams.indicatorName" readonly />
          </FormItem>
          <FormItem label="权重" prop="indicatorWeight">
            <Input v-model="indicatorParams.indicatorWeight" readonly />
          </FormItem>
          <FormItem label="归一化方式" prop="indicatorGYHWay">
            <Select
              v-model="indicatorParams.indicatorGYHWay"
              @on-change="indicatorGYHWayChange"
            >
              <Option value="0">线性归一化</Option>
              <Option value="1">阶梯归一化</Option>
            </Select>
          </FormItem>
          <FormItem label="指标属性" prop="indicatorAttr">
            <Select v-model="indicatorParams.indicatorAttr">
              <Option value="0">正向指标</Option>
              <Option value="1">负向指标</Option>
            </Select>
          </FormItem>
          <FormItem label="最大值" prop="indicatorMax">
            <Input
              v-model="indicatorParams.indicatorMax"
              placeholder="Enter something..."
            />
          </FormItem>
          <FormItem label="最小值" prop="indicatorMin">
            <Input
              v-model="indicatorParams.indicatorMin"
              placeholder="Enter something..."
            />
          </FormItem>
          <FormItem v-show="subValueDisabled" label="次大值" prop="indicatorMax2">
            <Input
              v-model="indicatorParams.indicatorMax2"
              placeholder="Enter something..."
            />
          </FormItem>
          <FormItem
            v-show="subValueDisabled"
            label="次大值对应的归一化值"
            prop="indicatorMax2GYH"
          >
            <Input
              v-model="indicatorParams.indicatorMax2GYH"
              placeholder="Enter something..."
            />
          </FormItem>
          <FormItem v-show="subValueDisabled" label="次小值" prop="indicatorMin2">
            <Input
              v-model="indicatorParams.indicatorMin2"
              placeholder="Enter something..."
            />
          </FormItem>
          <FormItem
            v-show="subValueDisabled"
            label="次小值对应的归一化值"
            prop="indicatorMin2GYH"
          >
            <Input
              v-model="indicatorParams.indicatorMin2GYH"
              placeholder="Enter something..."
            />
          </FormItem>

          <FormItem label="数据计算" prop="dataCalc">
            <Select v-model="indicatorParams.dataCalc">
              <Option value="0">最大值</Option>
              <Option value="1">最小值</Option>
              <Option value="2">最新值</Option>
              <Option value="3">平均值</Option>
              <Option value="4">倒数</Option>
              <Option value="5">对数</Option>
            </Select>
          </FormItem>
          <FormItem label="定义" prop="definition">
            <Input v-model="indicatorParams.definition" placeholder="Enter number" />
          </FormItem>
          <FormItem label="单位" prop="unit">
            <Input v-model="indicatorParams.unit" placeholder="Enter number" />
          </FormItem>
          <FormItem prop="dataSourceCheckbox" label="数据来源">
            <CheckboxGroup v-model="indicatorParams.dataSourceCheckbox">
              <Checkbox v-for="(item, index) in testList" :key="index" :label="item.id">{{
                item.name
              }}</Checkbox>
            </CheckboxGroup>
          </FormItem>
          <FormItem class="formBtn">
            <Button type="primary" @click="saveIndicatorData">保存</Button>
            <Button style="margin-left: 8px" @click="resetIndicatorData">重置</Button>
          </FormItem>
        </Form>

        <div style="margin-top: 20px">
          <Table
            border
            height="212"
            :columns="indicatorDataCalcColumns"
            :data="indicatorDataCalc"
          ></Table>
          <div style="margin: 10px; overflow: hidden">
            <div style="float: right">
              <Page
                :total="dataCount"
                :page-size="pageSize"
                show-total
                show-elevator
                @on-change="changepage"
                @on-page-size-change="pagesize"
              ></Page>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import communicate from "@/utils/communicate.js";
import { getHttp, getHttpParams } from "@/utils/httpserver";

export default {
  data() {
    const validateIndicatorMax = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("The max cannot be empty"));
      } else {
        if (!this.isEmptyValue(this.indicatorParams.indicatorMin)) {
          if (value < this.indicatorParams.indicatorMin) {
            callback(new Error("请确保最大值不小于最小值、次大值、次小值"));
          }
        }
        if (!this.isEmptyValue(this.indicatorParams.indicatorMax2)) {
          if (value < this.indicatorParams.indicatorMax2) {
            callback(new Error("请确保最大值不小于最小值、次大值、次小值"));
          }
        }
        if (!this.isEmptyValue(this.indicatorParams.indicatorMin2)) {
          if (value < this.indicatorParams.indicatorMin2) {
            callback(new Error("请确保最大值不小于最小值、次大值、次小值"));
          }
        }
        callback();
      }
    };
    const validateIndicatorMin = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("The min cannot be empty"));
      } else {
        if (!this.isEmptyValue(this.indicatorParams.indicatorMax)) {
          if (value > this.indicatorParams.indicatorMax) {
            callback(new Error("请确保最小值不大于最大值、次大值、次小值"));
          }
        }
        if (!this.isEmptyValue(this.indicatorParams.indicatorMax2)) {
          if (value > this.indicatorParams.indicatorMax2) {
            callback(new Error("请确保最小值不大于最大值、次大值、次小值"));
          }
        }
        if (!this.isEmptyValue(this.indicatorParams.indicatorMin2)) {
          if (value > this.indicatorParams.indicatorMin2) {
            callback(new Error("请确保最小值不大于最大值、次大值、次小值"));
          }
        }
        callback();
      }
    };
    return {
      testList: [],
      indicatorParams: {
        id: "",
        indicatorName: "",
        indicatorWeight: "",
        indicatorMax: "",
        indicatorMin: "",
        indicatorMax2: "",
        indicatorMin2: "",
        indicatorMax2GYH: "",
        indicatorMin2GYH: "",
        indicatorAttr: "",
        indicatorGYHWay: "",
        dataCalc: "",
        dataSourceCheckbox: [],
        definition: "",
        unit: "",
      },
      // 控制次值的隐藏与显示
      subValueDisabled: false,
      ruleValidate: {
        indicatorMax: [{ validator: validateIndicatorMax, trigger: "blur" }],
        indicatorMin: [{ validator: validateIndicatorMin, trigger: "blur" }],
        indicatorAttr: [
          { required: true, message: "Please select the attr", trigger: "change" },
        ],
        indicatorGYHWay: [
          { required: true, message: "Please select the GYHWay", trigger: "change" },
        ],
        dataCalc: [
          { required: true, message: "Please select the dataCalc", trigger: "change" },
        ],
      },
      indicatorDataCalcColumns: [
        {
          title: "序号",
          type: "index",
          width: 60,
          align: "center",
        },
        {
          title: "指标名称",
          key: "zbName",
        },
        {
          title: "试验名称",
          key: "syName",
        },
        {
          title: "指标数据",
          key: "DataList",
          render: (h, params) => {
            let _h = [];
            let _moreBtn = "";
            let row = params.row;
            let _styles = {
              width: "60px",
              marginRight: "5px",
            };
            for (let i = 0; i < row.DataList.length; i++) {
              // if (i > 2) {
              //   _styles = {
              //     width: "60px",
              //     marginRight: "5px",
              //     marginTop: "5px",
              //   };
              // }
              if (i < 5) {
                _h.push(
                  h("Input", {
                    props: {
                      type: "text",
                      value: row.DataList[i],
                      readonly: true,
                    },
                    style: _styles,
                    on: {
                      "on-blur": (event) => {},
                    },
                  })
                );
              } else {
                _moreBtn = h(
                  "Button",
                  {
                    // props: {
                    //   type: "primary",
                    //   size: "small",
                    // },
                    style: {
                      width: "60px",
                      height: "32px",
                      marginRight: "5px",
                    },
                    on: {
                      click: () => {},
                    },
                  },
                  "更多"
                );
              }
            }

            return h("div", [_h, _moreBtn]);
          },
        },
      ],
      // 保存获取到的表格数据
      getAllData: [],
      // 初始化信息总条数
      dataCount: 0,
      // 每页显示多少条
      pageSize: 3,
      // 当前页码
      page: 1,
      // 数据计算表格数据
      indicatorDataCalc: [],
    };
  },
  computed: {},
  mounted() {
    communicate.$on("indicatorTreeChange", (val) => {
      this.indicatorParams.id = val.indicatorId;
      this.getIndicatorData();
      this.getTestData();
      this.getDataCalc();
      this.$refs["indicatorParams"].resetFields();
    });
  },
  methods: {
    validateSubValue() {
      const validateIndicatorMax2 = (rule, value, callback) => {
        if (value === "") {
          callback(new Error("The max2 cannot be empty"));
        } else {
          if (!this.isEmptyValue(this.indicatorParams.indicatorMax)) {
            if (value > this.indicatorParams.indicatorMax) {
              callback(new Error("请确保次大值不大于最大值，不小于最小值、次小值"));
            }
          }
          if (!this.isEmptyValue(this.indicatorParams.indicatorMin)) {
            if (value < this.indicatorParams.indicatorMin) {
              callback(new Error("请确保次大值不大于最大值，不小于最小值、次小值"));
            }
          }
          if (!this.isEmptyValue(this.indicatorParams.indicatorMin2)) {
            if (value < this.indicatorParams.indicatorMin2) {
              callback(new Error("请确保次大值不大于最大值，不小于最小值、次小值"));
            }
          }
          callback();
        }
      };
      const validateIndicatorMin2 = (rule, value, callback) => {
        if (value === "") {
          callback(new Error("The min2 cannot be empty"));
        } else {
          if (!this.isEmptyValue(this.indicatorParams.indicatorMax)) {
            if (value > this.indicatorParams.indicatorMax) {
              callback(new Error("请确保次小值不小于最小值，不大于最大值、次大值"));
            }
          }
          if (!this.isEmptyValue(this.indicatorParams.indicatorMin)) {
            if (value < this.indicatorParams.indicatorMin) {
              callback(new Error("请确保次小值不小于最小值，不大于最大值、次大值"));
            }
          }
          if (!this.isEmptyValue(this.indicatorParams.indicatorMax2)) {
            if (value > this.indicatorParams.indicatorMax2) {
              callback(new Error("请确保次小值不小于最小值，不大于最大值、次大值"));
            }
          }
          callback();
        }
      };
      return [validateIndicatorMax2, validateIndicatorMin2];
    },
    getTestData() {
      let _this = this;
      getHttp("/api/Sy/getAll", function (res) {
        let _data = res.data;
        _this.testList = _data;
      });
    },
    // 点击指标树末节点,获取指标信息
    getIndicatorData() {
      let _this = this;
      let _indicatorParams = this.indicatorParams;
      _indicatorParams.dataSourceCheckbox = [];
      getHttp("/api/Zb/getZBDataById?ID=" + _indicatorParams.id, function (res) {
        let _data = res.data;
        _indicatorParams.indicatorName = _data.name;
        _indicatorParams.indicatorWeight = _data.weight;
        _indicatorParams.indicatorMax = _data.max;
        _indicatorParams.indicatorMin = _data.min;
        _indicatorParams.indicatorAttr = _data.dir.toString();
        _indicatorParams.indicatorGYHWay = _data.gy_hfs.toString();
        _indicatorParams.dataCalc = _data.sj_js.toString();
        _indicatorParams.definition = _data.define;
        _indicatorParams.unit = _data.unit;

        if (_data.gy_hfs === 0) {
          _this.subValueDisabled = false;
          delete _this.ruleValidate["indicatorMax2"];
          delete _this.ruleValidate["indicatorMin2"];
          delete _this.ruleValidate["indicatorMax2GYH"];
          delete _this.ruleValidate["indicatorMin2GYH"];
        }
        if (_data.gy_hfs === 1) {
          _this.indicatorParams.indicatorMax2 = _data.max2;
          _this.indicatorParams.indicatorMin2 = _data.min2;
          _this.indicatorParams.indicatorMax2GYH = _data.max2_y;
          _this.indicatorParams.indicatorMin2GYH = _data.min2_y;
          _this.subValueDisabled = true;
          _this.ruleValidate["indicatorMax2"] = [
            { validator: _this.validateSubValue()[0], trigger: "blur" },
          ];
          _this.ruleValidate["indicatorMin2"] = [
            { validator: _this.validateSubValue()[1], trigger: "blur" },
          ];
          _this.ruleValidate["indicatorMax2GYH"] = [
            { validator: _this.validateSubValue()[0], trigger: "blur" },
          ];
          _this.ruleValidate["indicatorMin2GYH"] = [
            { validator: _this.validateSubValue()[1], trigger: "blur" },
          ];
        }
      });
      getHttp("/api/Ly/selectByZbId?zb_id=" + _indicatorParams.id, function (res) {
        let _data = res.data;
        for (let i = 0; i < _data.length; i++) {
          _indicatorParams.dataSourceCheckbox.push(_data[i].sy_id);
        }
      });
    },
    indicatorGYHWayChange(value) {
      if (value === "0") {
        this.subValueDisabled = false;
        delete this.ruleValidate["indicatorMax2"];
        delete this.ruleValidate["indicatorMin2"];
        delete this.ruleValidate["indicatorMax2GYH"];
        delete this.ruleValidate["indicatorMin2GYH"];
      }
      if (value === "1") {
        this.indicatorParams.indicatorMax2 = "";
        this.indicatorParams.indicatorMin2 = "";
        this.indicatorParams.indicatorMax2GYH = "";
        this.indicatorParams.indicatorMin2GYH = "";
        this.subValueDisabled = true;
        this.ruleValidate["indicatorMax2"] = [
          { validator: this.validateSubValue()[0], trigger: "blur" },
        ];
        this.ruleValidate["indicatorMin2"] = [
          { validator: this.validateSubValue()[1], trigger: "blur" },
        ];
        this.ruleValidate["indicatorMax2GYH"] = [
          { validator: this.validateSubValue()[0], trigger: "blur" },
        ];
        this.ruleValidate["indicatorMin2GYH"] = [
          { validator: this.validateSubValue()[1], trigger: "blur" },
        ];
      }
    },
    saveIndicatorData() {
      let _this = this;
      let _indicatorParams = this.indicatorParams;
      let _dataSourceCheckbox = _indicatorParams.dataSourceCheckbox.join(",");
      this.$refs["indicatorParams"].validate((valid) => {
        if (valid) {
          getHttpParams(
            "/api/Zb/updateZBDataById",
            function (res) {
              _this.$Message["info"]({
                background: true,
                content: "指标数据" + res.data,
              });
            },
            {
              id: _indicatorParams.id,
              max: _indicatorParams.indicatorMax,
              min: _indicatorParams.indicatorMin,
              max2: _indicatorParams.indicatorMax2,
              min2: _indicatorParams.indicatorMin2,
              max2_y: _indicatorParams.indicatorMax2GYH,
              min2_y: _indicatorParams.indicatorMin2GYH,
              dir: _indicatorParams.indicatorAttr,
              gy_hfs: _indicatorParams.indicatorGYHWay,
              sj_js: _indicatorParams.dataCalc,
              define: _indicatorParams.definition,
              unit: _indicatorParams.unit,
            }
          );
        } else {
          this.$Message.error("请确保信息填写完整");
        }
      });

      getHttp(
        "/api/Ly/update?zb_id=" + _indicatorParams.id + "&sy_ids=" + _dataSourceCheckbox,
        function (res) {
          _this.$Message["info"]({
            background: true,
            content: "数据来源" + res.data,
          });
        }
      );
    },
    resetIndicatorData() {
      this.getIndicatorData();
      this.indicatorParams.dataSourceCheckbox = [];
      this.$refs["indicatorParams"].resetFields();
    },
    getDataCalc() {
      let _this = this;
      getHttp("/api/Sj/getByZbId?zb_id=" + _this.indicatorParams.id, function (res) {
        _this.getDataCreateTable(res.data);
      });
    },
    // 获取数据创建表格
    getDataCreateTable(_data) {
      // 保存取到的所有数据
      this.getAllData = _data;
      this.dataCount = _data.length;
      // 初始化显示，小于每页显示条数，全显，大于每页显示条数，取前每页条数显示
      if (_data.length < this.pageSize) {
        this.indicatorDataCalc = this.getAllData;
      } else {
        this.indicatorDataCalc = this.getAllData.slice(0, this.pageSize);
      }
    },
    // 改变页数时事件
    changepage(index) {
      // 当前页码
      this.page = index;
      let _start = (index - 1) * this.pageSize;
      let _end = index * this.pageSize;
      this.indicatorDataCalc = this.getAllData.slice(_start, _end);
      this.conditions.currentPage = index;
    },
    // 改变页数条数时事件
    pagesize(index) {
      let _start = (this.page - 1) * index;
      let _end = this.page * index;
      this.indicatorDataCalc = this.getAllData.slice(_start, _end);
      // 当前展示条数
      this.pageSize = index;
      this.conditions.pageSize = index;
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
  beforeDestroy() {
    communicate.$off("indicatorTreeChange");
  },
};
</script>
<style lang="scss">
.indicatorEdit_mid {
  position: absolute;
  left: 370px;
  right: 20px;
  top: 100px;
  bottom: 42px;
  .clearFix {
    *zoom: 1;
  }

  .clearFix:after {
    content: "";
    display: block;
    height: 0;
    clear: both;
  }
  .indicatorEdit_statistics {
    width: 100%;
    height: 30px;
    background: rgba(0, 0, 0, 0.4);
    position: relative;
    z-index: 1;
  }
  .indicatorEdit_content {
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
    padding: 10px;
    .form_container {
      .ivu-divider-horizontal.ivu-divider-with-text-left {
        color: white;
      }
      .ivu-form {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: left;
        width: 60%;
        .ivu-form-item-label {
          color: white;
        }
        .ivu-form-item-content {
          width: 300px;
        }
        .formBtn .ivu-form-item-content {
          width: auto;
        }
      }
    }
  }
}
</style>
