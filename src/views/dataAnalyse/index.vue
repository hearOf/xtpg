<template>
  <div class="data_analyse">
    <navHeader></navHeader>
    <div class="data_analyse_left scrollbar">
      <ul class="ivu_menu">
        <li class="ivu_menu_submenu ivu_menu_opened">
          <div class="ivu_menu_submenu_title">
            <i class="ivu-icon ivu-icon-ios-paper"></i>
            数据分析
          </div>
          <ul class="ivu_menu ivu_menu_children">
            <router-link to="/syntheticalAnalyse">
              <li class="ivu_menu_item active">综合分析</li>
            </router-link>
            <router-link to="/pivotalIndicatorAnalyse">
              <li class="ivu_menu_item">关键指标分析</li>
            </router-link>
            <router-link to="/indicatorAnalyse">
              <li class="ivu_menu_item">指标分析</li>
            </router-link>
            <router-link to="/originalDataAnalyse">
              <li class="ivu_menu_item">原始数据分析</li>
            </router-link>
            <router-link to="/weightAnalyse">
              <li class="ivu_menu_item">权重分析</li>
            </router-link>
          </ul>
        </li>
      </ul>
    </div>
    <div class="data_analyse_mid">
      <div class="data_analyse_statistics">
        <Breadcrumb>
          <BreadcrumbItem v-for="(item, index) in breadcrumbList" :key="index">{{
            item.name
          }}</BreadcrumbItem>
        </Breadcrumb>
      </div>
      <div class="data_analyse_content">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import navHeader from "@/components/navHeader";

export default {
  data() {
    return {
      breadcrumbList: [],
    };
  },

  components: {
    navHeader,
  },

  computed: {},
  watch: {
    $route() {
      this.breadcrumbList = [];
      this.breadcrumbList = this.$route.matched;
    },
  },
  mounted() {
    this.breadcrumbList = this.$route.matched;
    this.menuActive();
  },

  methods: {
    menuActive() {
      let _this = this;
      $(".ivu_menu_children a").each(function () {
        let _ivu_menu_item = $(this).find(".ivu_menu_item");

        if (_this.$route.name === _ivu_menu_item.html()) {
          _ivu_menu_item.parent().siblings().find(".ivu_menu_item").removeClass("active");
          _ivu_menu_item.addClass("active");
        }
        _ivu_menu_item.click(function () {
          $(this).parent().siblings().find(".ivu_menu_item").removeClass("active");
          $(this).addClass("active");
        });
      });
    },
  },
};
</script>
<style lang="scss">
.data_analyse {
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
  .data_analyse_left {
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
    float: left;
    width: 250px;
    height: 85%;
    overflow-x: hidden;
    overflow-y: auto;
    position: absolute;
    top: 100px;
    left: 50px;
    .ivu_menu {
      display: block;
      margin: 0;
      padding: 0;
      outline: 0;
      list-style: none;
      color: #515a6e;
      font-size: 14px;
      position: relative;
      z-index: 900;
      text-align: left;

      .ivu_menu_item {
        display: block;
        outline: 0;
        list-style: none;
        font-size: 14px;
        padding: 14px 24px;
        position: relative;
        cursor: pointer;
        z-index: 1;
        transition: all 0.2s ease-in-out;
        padding-left: 43px;
      }
      .ivu_menu_item.active {
        background: #2d8cf0;
        color: white;
      }
      .ivu_menu_opened {
        background: #363e4f;
      }
      a {
        display: block;
        color: rgba(255, 255, 255, 0.7);
      }
      a:hover {
        color: white;
      }
      .ivu_menu_submenu_title {
        background: #515a6e;
        color: rgba(255, 255, 255, 0.7);
        padding: 14px 24px;
        position: relative;
        cursor: pointer;
        z-index: 1;
        transition: all 0.2s ease-in-out;

        i {
          margin-right: 8px;
        }
        .ivu_menu_submenu_title_icon {
          position: absolute;
          top: 50%;
          right: 24px;
          transform: translateY(-50%) rotate(180deg);
          transition: transform 0.2s ease-in-out;
        }
      }
      .ivu_menu_submenu_title:hover {
        color: white;
      }
    }
    .ivu-menu-item {
      a {
        color: rgba(255, 255, 255, 0.7);
      }
      a:hover {
        color: white;
      }
    }
  }
  .data_analyse_mid {
    position: absolute;
    left: 320px;
    right: 20px;
    top: 100px;
    bottom: 42px;
    text-align: left;

    .data_analyse_statistics {
      width: 100%;
      height: 30px;
      background: rgba(0, 0, 0, 0.4);
      position: relative;
      z-index: 1;
      .ivu-breadcrumb {
        line-height: 30px;
        margin-left: 10px;
        > span:last-child {
          color: rgba(255, 255, 255, 0.8);
        }
      }
    }
    .data_analyse_content {
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
