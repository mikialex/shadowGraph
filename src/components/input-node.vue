<template>
  <div class="neva-node" :style="{
    left: viewPositionX,
    top: viewPositionY
  }">
    <span>{{node.name}}</span>
    <input type="number">
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { ViewFunctionNode } from "../core/view-function-node";

@Component
export default class NevaNumberInputNodeCom extends Vue {

  @Prop() node: ViewFunctionNode

  get viewPositionX(){
    return this.node.positionX + 'px';
  }

  get viewPositionY(){
    return this.node.positionY + 'px';
  }

}

</script>

<style scoped lang="scss">
.neva-node{
  width:100px;
  height:50px;
  border:1px solid #000;
  position: absolute;
}
</style>
