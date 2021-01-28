<template>
  <div class="indicatorEdit_left scrollbar">
    <div class="indicatorEdit_tree">
      <ul id="treeDemo" class="ztree"></ul>
    </div>
    <Modal
      width="940"
      v-model="indicatorEditModal"
      draggable
      scrollable
      :title="modalTitle"
      :footer-hide="modalFooterHide"
      @on-cancel="cancelIndicatorEditModal"
    >
      <div class="tree_form_container">
        <Form
          ref="indicatorParams"
          :rules="ruleValidate"
          :model="indicatorParams"
          inline
          :label-width="140"
        >
          <FormItem label="指标名称" prop="indicatorName">
            <Input v-model="indicatorParams.indicatorName" />
          </FormItem>
          <FormItem label="指标属性" prop="indicatorAttr">
            <Select v-model="indicatorParams.indicatorAttr">
              <Option value="0">正向指标</Option>
              <Option value="1">负向指标</Option>
            </Select>
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
          <FormItem label="最大值" prop="indicatorMax">
            <Input
              v-model="indicatorParams.indicatorMax"
              placeholder="Enter something..."
              @on-blur="indicatorMaxBlur"
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

          <FormItem>
            <Button type="primary" @click="modalSave">提交</Button>
            <Button style="margin-left: 10px" @click="modalReset">重置</Button>
          </FormItem>
        </Form>
      </div>
    </Modal>
  </div>
</template>
<script>
import communicate from "@/utils/communicate.js";
import $ from "jquery";
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
      indicatorEditModal: false,
      modalTitle: "",
      modalFooterHide: true,
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
      },
      subValueDisabled: false,
      ruleValidate: {
        indicatorName: [
          { required: true, message: "The name cannot be empty", trigger: "blur" },
        ],

        indicatorAttr: [
          { required: true, message: "Please select the attr", trigger: "change" },
        ],
        indicatorMax: [{ validator: validateIndicatorMax, trigger: "blur" }],
        indicatorMin: [{ validator: validateIndicatorMin, trigger: "blur" }],
        indicatorGYHWay: [
          { required: true, message: "Please select the GYHWay", trigger: "change" },
        ],
        dataCalc: [
          { required: true, message: "Please select the dataCalc", trigger: "change" },
        ],
      },
    };
  },

  methods: {
    zTreeDemo(treeData) {
      let _this = this;
      var setting = {
        view: {
          addHoverDom: addHoverDom,
          removeHoverDom: removeHoverDom,
          showIcon: false,
        },
        edit: {
          enable: true,
        },
        data: {
          simpleData: {
            enable: true,
          },
        },
        callback: {
          beforeDrag: beforeDrag,
          onClick: onClick,
          beforeRemove: zTreeBeforeRemove,
          onRemove: zTreeOnRemove,
        },
      };

      var zNodes = treeData;

      function beforeDrag(treeId, treeNodes) {
        return false;
      }

      var newCount = 1;
      function addHoverDom(treeId, treeNode) {
        var sObj = $("#" + treeNode.tId + "_span");
        if (treeNode.editNameFlag || $("#addBtn_" + treeNode.tId).length > 0) return;
        var addStr =
          "<span class='button add' id='addBtn_" +
          treeNode.tId +
          "' title='add node' onfocus='this.blur();'></span>";
        sObj.after(addStr);
        var btn = $("#addBtn_" + treeNode.tId);
        if (btn)
          btn.bind("click", function () {
            _this.indicatorEditModal = true;
            _this.modalTitle = treeNode.name;
            _this.indicatorParams.id = treeNode.id;

            // var zTree = $.fn.zTree.getZTreeObj("treeDemo");
            // zTree.addNodes(treeNode, {
            //   id: 100 + newCount,
            //   pId: treeNode.id,
            //   name: "new node" + newCount++,
            // });
            return false;
          });
      }
      function removeHoverDom(treeId, treeNode) {
        $("#addBtn_" + treeNode.tId)
          .unbind()
          .remove();
      }
      function zTreeBeforeRemove(treeId, treeNode) {
        if (treeNode.rear !== 0) {
          _this.$Message["info"]({
            background: true,
            content: "有下级指标，删除失败！",
          });
          return false;
        }
      }
      function zTreeOnRemove(event, treeId, treeNode) {
        getHttp("/api/Zb/del?ID=" + treeNode.id, function (res) {
          _this.$Message["info"]({
            background: true,
            content: res.data,
          });
        });
      }
      function onClick(event, treeId, treeNode, clickFlag) {
        if (treeNode.rear === 0) {
          communicate.$emit("indicatorTreeChange", {
            indicatorId: treeNode.id,
            indicatorName: treeNode.name,
          });
        }
      }
      $.fn.zTree.init($("#treeDemo"), setting, zNodes);
    },
    getTreeData() {
      let _this = this;
      getHttp("/api/Zb/getAll", function (res) {
        _this.zTreeDemo(_this.toTree(res.data));
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
      var val = [];
      data.forEach(function (item) {
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
          { required: true, message: "The max2GYH cannot be empty", trigger: "blur" },
        ];
        this.ruleValidate["indicatorMin2GYH"] = [
          { required: true, message: "The min2GYH cannot be empty", trigger: "blur" },
        ];
      }
    },
    modalSave() {
      let _this = this;
      let _indicatorParams = this.indicatorParams;
      this.$refs["indicatorParams"].validate((valid) => {
        if (valid) {
          getHttpParams(
            "/api/Zb/save",
            function (res) {
              _this.$Message.success(res.data);
              _this.indicatorEditModal = false;
              _this.modalReset();
              _this.getTreeData();
            },
            {
              name: _indicatorParams.indicatorName,
              front: _indicatorParams.id,
              rear: 0,
              max: _indicatorParams.indicatorMax,
              min: _indicatorParams.indicatorMin,
              max2: _indicatorParams.indicatorMax2,
              min2: _indicatorParams.indicatorMin2,
              dir: _indicatorParams.indicatorAttr,
              gy_hfs: _indicatorParams.indicatorGYHWay,
              sj_js: _indicatorParams.dataCalc,
              max2_y: _indicatorParams.indicatorMax2GYH,
              min2_y: _indicatorParams.indicatorMin2GYH,
            }
          );
        } else {
          this.$Message.error("请确保信息填写完整");
        }
      });
    },
    modalReset() {
      this.subValueDisabled = false;
      delete this.ruleValidate["indicatorMax2"];
      delete this.ruleValidate["indicatorMin2"];
      delete this.ruleValidate["indicatorMax2GYH"];
      delete this.ruleValidate["indicatorMin2GYH"];
      this.$refs["indicatorParams"].resetFields();
    },
    cancelIndicatorEditModal() {
      this.modalReset();
    },
    indicatorMaxBlur() {
      let _indicatorParams = this.indicatorParams;
      let _max = _indicatorParams.indicatorMax;
      let _min = _indicatorParams.indicatorMin;
      let _max2 = _indicatorParams.indicatorMax2;
      let _min2 = _indicatorParams.indicatorMin2;
      if (this.checkIsNullOrEmpty(_min)) {
        if (_max < _min) {
        }
      }
    },
    // 判断对象是否为空
    checkIsNullOrEmpty(value) {
      //正则表达式用于判斷字符串是否全部由空格或换行符组成
      var reg = /^\s*$/;
      //返回值为true表示不是空字符串
      return value != null && value != undefined && !reg.test(value);
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
  mounted() {
    this.getTreeData();
  },
};
</script>
<style lang="scss">
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

.tree_form_container {
  .ivu-divider-horizontal.ivu-divider-with-text-left {
    color: white;
  }
  .ivu-form {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: left;
    width: 100%;

    .ivu-form-item-content {
      width: 300px;
    }
    .formBtn .ivu-form-item-content {
      width: auto;
    }
  }
}
.indicatorEdit_left {
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
  box-shadow: 2px 5px 5px rgba(0, 0, 0, 0.5);
  border-radius: 5px;
  width: 300px;
  height: 85%;
  overflow-x: hidden;
  overflow-y: auto;
  position: absolute;
  top: 100px;
  left: 50px;
  .indicatorEdit_tree {
    .ztree {
      li {
        a {
          color: white;
          // .node_name {
          //   width: 70px;
          //   display: block;
          //   overflow: hidden;
          //   text-overflow: ellipsis;
          //   white-space: nowrap;
          // }
        }
        a.curSelectedNode {
          background: black;
        }
      }
    }
  }
}
</style>
