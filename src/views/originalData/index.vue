<template>
  <div class="original_data">
    <navHeader></navHeader>
    <div class="original_data_mid">
      <div class="original_data_statistics"></div>
      <div class="original_data_linkSet_content">
        <originalDataTable></originalDataTable>
      </div>
    </div>
  </div>
</template>

<script>
import navHeader from "@/components/navHeader";
import originalDataTable from "./originalDataTable";
export default {
  data() {
    return {};
  },

  components: {
    navHeader,
    originalDataTable,
  },

  computed: {},

  mounted() {},

  methods: {},
};
</script>
<style lang="scss">
.original_data {
  width: 100%;
  height: 100%;
  background: #2c3e50;
  color: white;
  .original_data_mid {
    position: absolute;
    left: 20px;
    right: 20px;
    top: 100px;
    bottom: 42px;
    .original_data_statistics {
      width: 100%;
      height: 30px;
      background: rgba(0, 0, 0, 0.4);
      position: relative;
      z-index: 1;
    }
    .original_data_linkSet_content {
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
    }
  }
}
</style>
