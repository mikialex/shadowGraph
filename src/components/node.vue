<template>
  <NodeUIWrap 
    :boardInfo="boardInfo"
    :node="node">
    
  </NodeUIWrap>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { ViewGraphNode } from "../core/view-graph-node";
import NodeUIWrap from './node-wrap.vue';

@Component({
  components: {
    NodeUIWrap,
  }
})
export default class BaseNodeCom extends Vue {

  @Prop() node: ViewGraphNode
  @Prop() boardInfo;

}

</script>

<style scoped lang="scss">
.shadow-node{
  width:100px;
  height:50px;
  border:1px solid #000;
  position: absolute;
}
</style>
