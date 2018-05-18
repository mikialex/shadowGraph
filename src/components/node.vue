<template>
  <NodeUIWrap 
    :boardInfo="boardInfo"
    :node="node">
    ADD
  </NodeUIWrap>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { ViewFunctionNode } from "../core/view-function-node";
import NodeUIWrap from './node-wrap.vue';

@Component({
  components: {
    NodeUIWrap,
  }
})
export default class NevaNodeCom extends Vue {

  @Prop() node: ViewFunctionNode
  @Prop() boardInfo;

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
