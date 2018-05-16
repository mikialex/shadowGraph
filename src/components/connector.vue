<template>
  <svg v-if="this.$store.state.isConnecting"
  class="connector" width="1000px" height="1000px">
    <path class="connector" :d="this.svgPath" stroke="black" fill="transparent"/>
  </svg>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class NodeConnector extends Vue {

  get anchorMiddleX(){
    return (this.$store.state.connectorStartX + this.$store.state.connectorCursorX) * 0.5;
  }

  get anchorMiddleY(){
    return (this.$store.state.connectorStartY + this.$store.state.connectorCursorY) * 0.5;
  }

  get svgPath(){
    return 'M ' + this.$store.state.connectorStartX + ' ' +
    this.$store.state.connectorStartY + 
    ' C ' +  
    this.anchorMiddleX + ' ' +
    this.$store.state.connectorStartY +
    ' , ' + 
    this.anchorMiddleX + ' ' +
    this.$store.state.connectorCursorY +
    ' , ' +
    this.$store.state.connectorCursorX + ' ' +
    this.$store.state.connectorCursorY;
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
