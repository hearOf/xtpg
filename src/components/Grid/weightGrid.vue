<template>
  <Table class="weight_grid" border :columns="weightColumns" :data="weightData"></Table>
</template>

<script>
import { getHttp } from "@/utils/httpserver";
export default {
  data() {
    return {
      weightHeader: [],
      weightColumns: [],
      weightData: [],
    };
  },
  props: {
    dataList: {
      type: Array,
      default: () => [],
    },
    tableIndex: {
      type: Number,
      default: () => 0,
    },
    levelStr: {
      type: String,
      default: () => "1",
    },
  },
  components: {},

  computed: {},

  mounted() {
    this.getTableData();
  },

  methods: {
    getTableData(data) {
      let _this = this;
      this.weightHeader = [];
      this.weightColumns = [];
      this.weightData = [];

      // getHttp("/api/W2/getById", function (res) {
      // let _data = res.data.reverse();
      let _data = [];
      if (!this.isEmptyValue(data)) {
        _data = data;
      } else {
        _data = this.dataList;
      }
      _data = _data[_this.tableIndex];

      for (let i = 0; i < _data.length; i++) {
        let _weightItem = {};
        _this.weightHeader.push(_data[i].name);
        let _listData = _data[i].listData;
        for (let j in _listData) {
          if (_this.isEmptyValue(_listData[j])) {
            _listData[j] = "";
          } else {
          }

          _weightItem["zbId"] = _data[i].id;
          _weightItem["tag"] = _data[i].name;
          _weightItem["weight" + j] = _listData[j];
          _this.weightData.push(_weightItem);
        }
      }

      _this.weightData = _this.deteleObject(_this.weightData);
      let _weightHeader = _this.weightHeader;
      _this.weightColumns.push({
        title: "#",
        key: "tag",
      });
      for (let i = 0; i < _weightHeader.length; i++) {
        _this.weightColumns.push({
          title: _weightHeader[i],
          key: "weight" + i,
          render(h, params) {
            let _disabled = false;
            let _weightI = params.row["weight" + i];
            let _inputValueFirst = "";
            let _inputValueLast = "";

            if (
              !_this.isEmptyValue(_weightI) &&
              _weightI !== 1 &&
              typeof _weightI === "string"
            ) {
              _weightI = _weightI.split(",");
              _inputValueFirst = _weightI[0];
              _inputValueLast = _weightI[1];
            }
            if (_this.isEmptyValue(_weightI) || _weightI === undefined) {
              _inputValueFirst = "";
              _inputValueLast = "";
            }
            if (params.row.tag === params.column.title) {
              return h("div", {}, _weightI);
            }
            if (
              params.column._index < params.index ||
              params.column._index === params.index
            ) {
              _disabled = true;
            }
            return h("div", [
              h("Input", {
                props: {
                  type: "text",
                  value: _inputValueFirst,
                  disabled: _disabled,
                },
                style: {
                  width: "100px",
                },
                on: {
                  "on-blur": (event) => {
                    params["molecular"] = event.target.value;
                  },
                },
              }),
              h(
                "span",
                {
                  style: {
                    margin: "0 10px",
                    fontSize: "18px",
                    transform: "translateY(3px)",
                    display: "inline-box",
                  },
                },
                ":"
              ),
              h("Input", {
                props: {
                  type: "text",
                  value: _inputValueLast,
                  disabled: _disabled,
                },
                style: {
                  width: "100px",
                },
                on: {
                  "on-blur": (event) => {
                    params["denominator"] = event.target.value;
                    if (!_this.isEmptyValue(params.molecular)) {
                      let _zbId1 = params.row.zbId;
                      let _zbId2 = "";
                      for (let i = 0; i < _this.weightData.length; i++) {
                        if (_this.weightData[i].tag === params.column.title) {
                          _zbId2 = _this.weightData[i].zbId;
                        }
                      }
                      getHttp(
                        "/api/W2/save?zb_id1=" +
                          _zbId1 +
                          "&zb_id2=" +
                          _zbId2 +
                          "&molecular=" +
                          params.molecular +
                          "&denominator=" +
                          params.denominator,
                        function (res) {
                          _this.$Message["info"]({
                            background: true,
                            content: res.data,
                          });
                          getHttp("/api/W2/getById", function (res) {
                            let _resData = res.data;
                            let _paramsData = [];
                            if (_this.levelStr === "1") {
                              _paramsData = _resData.key1.concat(_resData.key2);
                            }
                            if (_this.levelStr === "2") {
                              _paramsData = _resData.key3;
                            }
                            if (_this.levelStr === "3") {
                              _paramsData = _resData.key4;
                            }
                            _this.getTableData(_paramsData);
                          });
                        }
                      );
                    }
                  },
                },
              }),
            ]);
          },
        });
      }
      // });
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
    deteleObject(obj) {
      var uniques = [];
      var stringify = {};
      for (var i = 0; i < obj.length; i++) {
        var keys = Object.keys(obj[i]);
        keys.sort(function (a, b) {
          return Number(a) - Number(b);
        });
        var str = "";
        for (var j = 0; j < keys.length; j++) {
          str += JSON.stringify(keys[j]);
          str += JSON.stringify(obj[i][keys[j]]);
        }
        if (!stringify.hasOwnProperty(str)) {
          uniques.push(obj[i]);
          stringify[str] = true;
        }
      }
      uniques = uniques;
      return uniques;
    },
  },
};
</script>
<style lang="scss"></style>
