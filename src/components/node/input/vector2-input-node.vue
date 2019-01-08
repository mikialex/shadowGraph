<template>
  <NodeUIWrap 
    :boardInfo="boardInfo"
    :node="node">
    <input 
    type="number"  
    :disabled="isDisplayMode"
    v-model="valueX">

    <input 
    type="number" 
    :disabled="isDisplayMode"
    v-model="valueY">


    <span v-if="value">true</span> <span v-if="!value">false</span>
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
export default class Vector2InputNodeCom extends Vue {

  @Prop() node: ViewGraphNode
  @Prop() boardInfo;

  get isDisplayMode(){
    return this.node.inputParams[0].valueRef
  }

  get value(){
    return this.node.getValue();
  }

  get valueX(){
    return this.value.x;
  }

  set valueX(val){
    const value = this.value;
    value.x = val;
    this.$store.commit('setNodeValue', {
      node:this.node,
      value
    })
    this.node.updateGraphValue();
  }

}

</script>

<style scoped lang="scss">

</style>
