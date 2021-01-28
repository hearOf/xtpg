<template>
  <div class="table_cantainer">
    <div class="clearFix">
      <Input v-model="formItem.indicatorName" placeholder="指标名称" style="width: 250px">
        <span slot="prepend">指标名称</span>
      </Input>
      <Input
        v-model="formItem.testID"
        placeholder="试验ID"
        style="width: 200px; margin: 0 10px"
      >
        <span slot="prepend">试验ID</span>
      </Input>
      <Input v-model="formItem.dataMin" style="width: 200px">
        <span slot="prepend">数据值区间</span>
      </Input>

      <Input v-model="formItem.dataMax" style="width: 150px; margin: 1px 0 0 5px" />
      <Button @click="queryDataBtn" style="float: left; margin: 1px 0 0 5px">查询</Button>
    </div>
    <div class="demo-spin-container">
      <Spin fix v-show="loading">
        <Icon type="ios-loading" size="18" class="demo-spin-icon-load"></Icon>
        <div>Loading</div>
      </Spin>
      <Table
        border
        :columns="tableColumns"
        :data="tableData"
        ref="originalDataTable"
        :height="tableHeight"
        style="margin-top: 10px"
      ></Table>
    </div>
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
</template>

<script>
import $ from "jquery";
import { getHttp, getHttpParams } from "@/utils/httpserver";
export default {
  data() {
    return {
      formItem: {
        indicatorName: "",
        testID: "",
        dataMin: "",
        dataMax: "",
      },
      loading: true,
      // 表格高度
      tableHeight: 0,
      // 保存获取到的表格数据
      getAllData: [],
      // 初始化信息总条数
      dataCount: 0,
      // 每页显示多少条
      pageSize: 12,
      // 当前页码
      page: 1,
      tableColumns: [
        {
          title: "序号",
          key: "index",
          width: 60,
          align: "center",
          render: (h, params) => {
            return h("span", params.index + (this.page - 1) * this.pageSize + 1);
          },
        },
        {
          title: "指标名称",
          key: "zb_name",
        },
        {
          title: "试验ID",
          key: "sy_id",
        },
        {
          title: "试验名称",
          key: "name",
        },
        {
          title: "业务ID",
          key: "yw_id",
        },
        {
          title: "业务类型",
          key: "yw_type",
        },
        {
          title: "业务属性",
          key: "yw_attr",
        },
        {
          title: "链路类型",
          key: "link_type",
        },
        {
          title: "节点ID",
          key: "jd_id",
        },
        {
          title: "业务节点类型",
          key: "ywjd_type",
        },
        {
          title: "业务节点属性",
          key: "ywjd_attr",
        },
        {
          title: "数据",
          key: "data",
        },
      ],
      tableData: [],
    };
  },

  components: {},

  computed: {},

  mounted() {
    this.tableHeight =
      window.innerHeight - this.$refs.originalDataTable.$el.offsetTop - 320;
    this.getTableData();
  },

  methods: {
    // 获取数据
    getTableData(params) {
      let _this = this;
      getHttpParams(
        "/api/Cj_Sj/getSjData",
        function (res) {
          let _data = res.data;
          _this.loading = false;
          _this.getDataCreateTable(_data);
        },
        params
      );
    },
    // 获取数据创建表格
    getDataCreateTable(_data) {
      // 保存取到的所有数据
      this.getAllData = _data;
      this.dataCount = _data.length;
      // 初始化显示，小于每页显示条数，全显，大于每页显示条数，取前每页条数显示
      if (_data.length < this.pageSize) {
        this.tableData = this.getAllData;
      } else {
        this.tableData = this.getAllData.slice(0, this.pageSize);
      }
    },
    // 改变页数时事件
    changepage(index) {
      // 当前页码
      this.page = index;
      let _start = (index - 1) * this.pageSize;
      let _end = index * this.pageSize;
      this.tableData = this.getAllData.slice(_start, _end);
    },
    // 改变页数条数时事件
    pagesize(index) {
      let _start = (this.page - 1) * index;
      let _end = this.page * index;
      this.tableData = this.getAllData.slice(_start, _end);
      // 当前展示条数
      this.pageSize = index;
    },
    queryDataBtn() {
      this.getTableData({
        sy_id:
          this.isEmptyValue(this.formItem.testID) === true ? null : this.formItem.testID,
        zb_name:
          this.isEmptyValue(this.formItem.indicatorName) === true
            ? null
            : this.formItem.indicatorName,
        startInt:
          this.isEmptyValue(this.formItem.dataMin) === true
            ? null
            : this.formItem.dataMin,
        endInt:
          this.isEmptyValue(this.formItem.dataMax) === true
            ? null
            : this.formItem.dataMax,
      });
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
.table_cantainer {
  .clearFix {
    *zoom: 1;
  }

  .clearFix:after {
    content: "";
    display: block;
    height: 0;
    clear: both;
  }
  .demo-spin-container {
    position: relative;
  }
  .demo-spin-icon-load {
    animation: ani-demo-spin 1s linear infinite;
  }
  @keyframes ani-demo-spin {
    from {
      transform: rotate(0deg);
    }
    50% {
      transform: rotate(180deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  .demo-spin-col {
    height: 100px;
    position: relative;
    border: 1px solid #eee;
  }
  .ivu-input-wrapper {
    float: left;
  }
  .ivu-form {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: left;
    .ivu-form-item-label {
      color: white;
    }
  }
}
</style>
