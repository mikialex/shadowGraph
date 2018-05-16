<template>
  <svg v-if="this.$store.state.isConnecting"
  class="connector" width="1000px" height="1000px">
    <path class="connector" :d="this.svgPath" stroke="black" fill="transparent"/>
  </svg>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { createSVGConnectionLine } from '../util/line';

@Component
export default class NodeConnector extends Vue {
  get svgPath(){
    return createSVGConnectionLine(
      this.$store.state.connectorStartX,
      this.$store.state.connectorStartY,
      this.$store.state.connectorCursorX,
      this.$store.state.connectorCursorY
    )
  }
}
</script>

<style scoped lang="scss">
.connector{
  position: fixed;
  top:0px;
  left:0px;
}
</style>
