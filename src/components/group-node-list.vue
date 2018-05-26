<template>
  <div>
    <span>node group list:</span>
    <div v-for="nodeGroup in manager.nodeGroupList" 
      :key="nodeGroup.name">
      <button>{{nodeGroup.name}}</button>
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
export default class GroupNodeListCom extends Vue {
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
