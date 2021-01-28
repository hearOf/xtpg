<template>
  <div id="app">
    <!-- <div id="nav">
      <router-link to="/">视图</router-link>
      <router-link to="/home">数据</router-link>
    </div>
    <transition :name="transitionName">
      <router-view class="router" />
    </transition> -->
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "app",
  data() {
    return {
      transitionName: "slide-left",
    };
  },
  watch: {
    // $route(to, from) {
    //   console.log(from.path);
    //   console.log(to.path);
    //   if (to.path === "/home") {
    //     this.transitionName = "slide-left";
    //   } else if (from.path === "/home") {
    //     this.transitionName = "slide-right";
    //   }
    // },
  },
};
</script>

<style lang="scss">
html,
body {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
#app {
  width: 100%;
  height: 100%;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: white;
  position: relative;
  .router {
    position: absolute;
    width: 100%;
    transition: all 0.8s ease;
  }
  .slide-left-enter,
  .slide-right-leave-active {
    opacity: 0;
    transform: translate(100%, 0);
  }
  .slide-left-leave-active,
  .slide-right-enter {
    opacity: 0;
    transform: translate(-100%, 0);
  }
}

#nav {
  // padding: 30px;
  position: absolute;
  right: 0;
  top: 2px;
  z-index: 1;

  a {
    font-weight: bold;
    color: #ccc;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
