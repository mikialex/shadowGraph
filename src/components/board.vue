<template>
  <div>
    <div class="tool-bar">
      <button @click="eval">eval</button>
      <!-- <div @click="">addition</div> -->
    </div>
    <div class="neva-board" @click="addNode">
      <NevaNodeCom v-for="node in nodeList" 
      :node="node"
      :key="node.id"></NevaNodeCom>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import NevaNodeCom from "@/components/node.vue";
import { ViewFunctionNode } from "../core/view-function-node";

@Component({
  components: {
    NevaNodeCom
  }
})
export default class NevaBoard extends Vue {
  nodeList=[];

  addNode(e){
    console.log(e);
    let newNode = new ViewFunctionNode({
      evaluFunction: (params: any[]) => {
        return 12;
      },
      paramsDescriptor: []
    });
    newNode.positionX = e.offsetX;
    newNode.positionY = e.offsetY;
    this.nodeList.push(newNode);
  }

  eval(){

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.neva-board{
  width:600px;
  height:400px;
  border:1px solid #000;
  position: relative;
}

.tool-bar{

}
</style>
