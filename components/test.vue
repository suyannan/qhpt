<template>
    <div class="container" :style="'min-height:'+minHeight">

<!--      <img src="../../static/img/connect/kf-icon.png" alt="" id="image">-->
      <img
        data-caman="saturation(-10) brightness(20) vignette('10%')"
        src="../../static/img/connect/kf-icon.png" id="#my-image"
      >
    </div>
</template>

<script>

    export default {
        data() {
            return {
                minHeight: '',
            }
        },
        created() {
            this.$dialog.loading.close();
            this.minHeight = localStorage.getItem('minHeight');
        },
        mounted() {
//          Caman('#my-image', function () {
//            this.brightness(10);
//            this.contrast(30);
//            this.sepia(60);
//            this.saturation(-30);
//            this.render();
//          });
          /*try {
            var canvas = fx.canvas();
          } catch (e) {
            alert(e);
            return;
          }

          // convert the image to a texture
          var image = document.getElementById('image');
          var texture = canvas.texture(image);

          // apply the ink filter
          canvas.draw(texture).brightnessContrast(0.5,0).update();

          // replace the image with the canvas
          image.parentNode.insertBefore(canvas, image);
          image.parentNode.removeChild(image);
*/
        },
        methods: {}
    }
</script>
<style scoped="true">

</style>
