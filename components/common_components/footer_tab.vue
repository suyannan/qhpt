<template>


  <yd-tabbar fixed active-color="#B81F22" fontsize="0.22rem" color="#2f2f2f">
    <template v-for="(item,i) in list">
      <yd-tabbar-item :title="item.title" :link="item.link" :active="true" v-if="i==index">
        <i :class="'icon'+' iconfont '+item.icon" slot="icon"></i>
      </yd-tabbar-item>
      <yd-tabbar-item :title="item.title" :link="item.link" :active="false" v-else>
        <i :class="'icon'+' iconfont '+item.icon" slot="icon"></i>
      </yd-tabbar-item>
    </template>
  </yd-tabbar>
</template>

<script>
  export default {
    props: {
      index: 0,
      list:{
        type: Array,
        default:[]
      }
    },
    data() {
      return {
        activeIndex: 0,
        tabs:[]
      }
    },
    created() {
    },
  }
</script>
<style scoped="true">
  .foot-ul {
    padding: 0.13rem 0.39rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background: #fff;
    z-index: 100;
    font-size: 0.22rem;
    border-top: solid 1px #e5e5e5;
    color: #2f2f2f;
  }

  .active-color {
    color: #B81F22;
  }

  .iconfont {
    font-size: 0.48rem;
  }

  .icon-faxian {
    font-size: 0.52rem;
  }
</style>
