<template>
  <div>
    <!-- <span>add new node:</span> -->
    <!-- <div v-for="nodeGraph in manager.nodeGraphList" 
      :key="nodeGraph.name"
      class="new-node">
      {{nodeGraph.name}}
    </div> -->
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

</style>
