<template>
  <div class="container" :style="'min-height:'+minHeight"></div>
</template>

<script>
  export default {
    data() {
      return {
        minHeight: '',
        id: ''
      }
    },
    created() {
      this.$dialog.loading.close();
      this.minHeight = localStorage.getItem('minHeight');
      this.id=this.$route.query.id;


    },
    mounted() {

    },
    methods: {}
  }
</script>
<style scoped="true">

</style>
