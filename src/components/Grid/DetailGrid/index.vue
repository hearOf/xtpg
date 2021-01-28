<template>
  <div :id="detailGridGuid" class="detailGrid">
    <table>
      <!-- <tr>
        <td class="detailColumns">
          <div class="detail-table-columns">
            <span>姓名</span>
          </div>
        </td>
        <td>
          <div class="detail-table-data">
            <span>小明</span>
          </div>
        </td>
      </tr>
      <tr>
        <td class="detailColumns">
          <div class="detail-table-columns">
            <span>性别</span>
          </div>
        </td>
        <td>
          <div class="detail-table-data">
            <span>男</span>
          </div>
        </td>
      </tr>-->
    </table>
  </div>
</template>
<script>
export default {
  name: "detailGrid",
  components: {},
  props: {
    columns: {
      type: Array,
      default: () => [],
    },
    data: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      columns1: [
        {
          title: "Name",
          key: "name",
        },
        {
          title: "Age",
          key: "age",
        },
        {
          title: "Address",
          key: "address",
        },
      ],
      data1: [
        {
          name: "John Brown",
          age: 18,
          address: "New York No. 1 Lake Park",
          date: "2016-10-03",
        },
        {
          name: "Jim Green",
          age: 24,
          address: "London No. 1 Lake Park",
          date: "2016-10-01",
        },
        {
          name: "Joe Black",
          age: 30,
          address: "Sydney No. 1 Lake Park",
          date: "2016-10-02",
        },
        {
          name: "Jon Snow",
          age: 26,
          address: "Ottawa No. 2 Lake Park",
          date: "2016-10-04",
        },
      ],
    };
  },
  computed: {
    detailGridGuid() {
      return "detailGrid" + Math.random() * 100000;
    },
  },
  mounted() {
    this.getDataCreateTable();
  },
  methods: {
    getDataCreateTable() {
      let _columns1Str = "";
      for (let i = 0; i < this.columns1.length; i++) {
        _columns1Str +=
          "<tr>" +
          '<td class="detailColumns">' +
          '<div class="detail-table-columns">' +
          "<span>" +
          this.columns1[i].title +
          "</span>" +
          "</div>" +
          "</td>" +
          "<td>" +
          '<div class="detail-table-data">' +
          "<span>姓名</span>" +
          "</div>" +
          "</td>" +
          "</tr>";
      }

      document
        .getElementById(this.detailGridGuid)
        .getElementsByTagName("table")[0].innerHTML = _columns1Str;
    },
  },
};
</script>

<style lang="scss">
.detailGrid {
  table {
    table-layout: fixed;
    border-collapse: collapse;
    width: 100%;
    th,
    td {
      min-width: 0;
      height: 40px;
      box-sizing: border-box;
      text-align: left;
      text-overflow: ellipsis;
      vertical-align: middle;
      border: 1px solid #e8eaec;
      white-space: nowrap;
      overflow: hidden;
    }
    .detailColumns {
      background-color: #f8f8f9;
    }
    .detail-table-columns,
    .detail-table-data {
      padding-left: 18px;
      padding-right: 18px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: normal;
      word-break: break-all;
      box-sizing: border-box;
      display: inline-block;
      vertical-align: middle;
      font-weight: bold;
    }
    .detail-table-data {
      font-weight: normal;
    }
  }
}
</style>