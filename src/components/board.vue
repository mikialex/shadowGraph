<template>
  <div>
    <div class="tool-bar">
      <GroupNodeListCom/>
      <div >
        <button
        v-for="config in nodeTypeList" :key="config.name"
         @click="switchCurrentType(config)"
        :class="{'current-type':config === currentType}"
        >
          {{config.name}}
        </button>
        <button 
        @click="switchCurrentType(null)"
        >normal</button>
      </div>
    </div>
    <NodeConnector></NodeConnector>
    <div class="neva-board" id="board" @mousedown.self="addNode">
      <NevaNodeCom v-for="node in functionNodeList" 
      :node="node"
      :boardInfo="boardInfo"
      :key="node.id"></NevaNodeCom>

      <NevaNodeNumberInputCom v-for="node in inputList" 
      :node="node"
      :boardInfo="boardInfo"
      :key="node.id"></NevaNodeNumberInputCom>

    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import NevaNodeCom from "@/components/node.vue";
import NevaNodeNumberInputCom from "@/components/node/input/number-input-node.vue";
import NevaNodeBooleanInputCom from "@/components/node/input/number-input-node.vue";
import GroupNodeListCom from "@/components/group-node-list.vue";
import { ViewFunctionNode } from "../core/view-function-node";
import { NodeType } from "../core/node-interface";
import NodeConnector from "@/components/connector.vue";

@Component({
  components: {
    NevaNodeCom,
    NevaNodeNumberInputCom,NevaNodeBooleanInputCom,
    NodeConnector,
    GroupNodeListCom,
  }
})
export default class NevaBoard extends Vue {
  currentType = null;
  switchCurrentType(newType){
    this.currentType = newType;
  }

  get nodeTypeList() {
    return Object.keys(this.manager.nodeConfigs).map(key =>
    this.manager.nodeConfigs[key])
  }

  get boardInfo(){
    return {
      offsetX: document.querySelector('#board').getBoundingClientRect().left,
      offsetY: document.querySelector('#board').getBoundingClientRect().top,
    }
  }

  get inputList(){
    return this.manager.currentNodeGroup.nodes.filter(n=>{
      return n.type === NodeType.inputNode
    })
  }

  get numberInputList(){
    return this.inputList.filter(n=>{
      return n.type === NodeType.inputNode
    })
  }

  get manager() {
    return this.$store.state.nodeManager;
  }

  get functionNodeList(){
    return this.$store.state.nodeManager.currentNodeGroup.nodes.filter(n=>{
      return n.type !== NodeType.inputNode
    })
  }

  addNode(e: MouseEvent){
    if(this.currentType){
      let newNode = new ViewFunctionNode(this.currentType.name, this.manager);
      newNode.positionX = e.clientX;
      newNode.positionY = e.clientY;
      this.$store.commit('addNode',newNode);
    }
    this.switchCurrentType(null);
  }

}
</script>

<style scoped lang="scss">
.neva-board{
  width:600px;
  height:400px;
  border:1px solid #000;
  position: relative;
}

.tool-bar{
  display: flex;
}

.current-type{
  background: #88f;
}
</style>
