<template>
  <div>
    <div class="tool-bar">
      <button @click="eval">eval</button>
      <div >
        <button
        v-for="config in nodeTypeList" :key="config.name"
         @click="switchCurrentType(config)"
        :class="{'current-type':config === currentType}"
        >
          {{config.type}}
        </button>
        <button 
        @click="switchCurrentType('')"
        >normal</button>
      </div>
    </div>
    <NodeConnector></NodeConnector>
    <div class="neva-board" id="board" @mousedown.self="addNode">
      <NevaNodeCom v-for="node in this.$store.state.nodeList" 
      :node="node"
      :boardInfo="boardInfo"
      :key="node.id"></NevaNodeCom>

      <NevaNodeInputCom v-for="node in this.$store.state.inputNodeList" 
      :node="node"
      :boardInfo="boardInfo"
      :key="node.id"></NevaNodeInputCom>


    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import NevaNodeCom from "@/components/node.vue";
import NevaNodeInputCom from "@/components/input-node.vue";
import { ViewFunctionNode } from "../core/view-function-node";
import {AdditionNodeConfig} from '../nodes/addition';
import {InputNodeConfig} from '../nodes/input';
import {ConditionNodeConfig} from '../nodes/condition';
import NodeConnector from "@/components/connector.vue";

@Component({
  components: {
    NevaNodeCom,
    NevaNodeInputCom,
    NodeConnector
  }
})
export default class NevaBoard extends Vue {

  nodeTypeList = [
    AdditionNodeConfig,
    InputNodeConfig,
    ConditionNodeConfig
  ]
  currentType = InputNodeConfig;
  switchCurrentType(newType){
    this.currentType = newType;
  }

  get boardInfo(){
    return {
      offsetX: document.querySelector('#board').getBoundingClientRect().left,
      offsetY: document.querySelector('#board').getBoundingClientRect().top,
    }
  }

  nodeList=[];
  inputList = [];
  addNode(e: MouseEvent){
    if(this.currentType){
      let newNode = new ViewFunctionNode(this.currentType);
      newNode.positionX = e.clientX;
      newNode.positionY = e.clientY;
      this.$store.commit('addNode',newNode);
    }
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
  display: flex;
}

.current-type{
  background: #88f;
}
</style>
