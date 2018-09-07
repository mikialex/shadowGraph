<template>
  <div>
    <span>node graph list:</span>
    <div v-for="nodeGraph in manager.nodeGraphList" 
      :key="nodeGraph.name">
      <button>{{nodeGraph.name}}</button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { ViewFunctionNode } from "../core/view-function-node";

@Component({
  components: {
  }
})
export default class GraphNodeListCom extends Vue {
  get manager(){
    return this.$store.state.nodeManager
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
