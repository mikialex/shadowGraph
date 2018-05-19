<template>
<div>
  <svg
  class="connector" width="1000px" height="1000px">
    <path class="connector" 
    v-if="this.$store.state.isConnecting"
    :d="this.svgPath" 
    stroke="black" fill="transparent"/>

    <path class="connector"
    v-for="line in lines"
    :key="line" 
    :d="line" 
    stroke="black" fill="transparent"/>


  </svg>
</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { createSVGConnectionLine } from '../util/line';
import { ViewFunctionNode } from '../core/view-function-node';

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

  get lines(){
    let params = [];
    this.$store.state.nodeList.forEach(node => {
      params = params.concat(node.inputParams);
    })
    params = params.filter(para=>{
      return para.valueRef !== null;
    })
    .map(para=>{
      console.log(para)
      const nodeBefore = para.valueRef as ViewFunctionNode;
      let paraIndex;
      for (let i = 0; i < para.self.inputParams.length; i++) {
        const p = para.self.inputParams[i];
        if(p.name === para.name){
          paraIndex =i;
          break;
        }
      }
      para.self.inputParams
      return createSVGConnectionLine(
        nodeBefore.positionX + nodeBefore.connectEmitorX,
        nodeBefore.positionY + nodeBefore.connectEmitorY,
        para.self.positionX +  para.self.inputsPositions[paraIndex].reciverX,
        para.self.positionY + para.self.inputsPositions[paraIndex].reciverY,
      )
    })
    return params;
  }
}
</script>

<style scoped lang="scss">
.connector{
  position: fixed;
  top:0px;
  left:0px;
  z-index: -10;
}
</style>
