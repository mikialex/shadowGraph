<template>
  <div>
    <canvas class="shadow-canvas"></canvas>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  components: {
  }
})
export default class ResultCanvas extends Vue {
}
</script>

<style scoped lang="scss">
.shadow-canvas{
  width:300px;
  height:200px;
  border:solid 1px #000;
}
</style>
