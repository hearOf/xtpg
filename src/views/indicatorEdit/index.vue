<template>
  <div class="indicatorEdit">
    <navHeader></navHeader>
    <indicatorEditTree></indicatorEditTree>
    <indicatorEditMid></indicatorEditMid>
  </div>
</template>
<script>
import navHeader from "@/components/navHeader";
import indicatorEditTree from "./indicatorEditTree.vue";
import indicatorEditMid from "./indicatorEditMid.vue";
export default {
  name: "indicatorEdit",
  components: {
    navHeader,
    indicatorEditTree,
    indicatorEditMid,
  },
};
</script>
<style lang="scss">
.indicatorEdit {
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
}
</style>