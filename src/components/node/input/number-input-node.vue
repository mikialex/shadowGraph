<template>
  <NodeUIWrap 
    :boardInfo="boardInfo"
    :node="node">
    <input 
    type="number" 
    :disabled="isDisplayMode"
    v-model="value">
  </NodeUIWrap>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { ViewGraphNode } from "@/core/view-graph-node";
import NodeUIWrap from '@/components/node-wrap.vue';

@Component({
  components: {
    NodeUIWrap,
  }
})
export default class shadowNumberInputNodeCom extends Vue {

  @Prop() node: ViewGraphNode
  @Prop() boardInfo;

  get isDisplayMode(){
    return this.node.inputParams[0].valueRef
  }

  get value(){
    return this.node.getValue();
  }

  set value(val){
    this.$store.commit('setNodeValue', {
      node:this.node,
      value:parseFloat(val)
    })
    this.node.updateGraphValue();
  }

}

</script>

<style scoped lang="scss">
.shadow-node{
  width:100px;
  height:50px;
  border:1px solid #000;
  position: absolute;
}

input{
  width:calc(100% - 7px);
}
</style>
