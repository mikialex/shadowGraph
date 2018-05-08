<template>
  <div>
    <div class="tool-bar">
      <button @click="eval">eval</button>
      <div v-for="config in nodeTypeList" :key="config.name">
        <button @click="switchCurrentType(config)"
        :class="{'current-type':config === currentType}"
        >
          {{config.type}}
        </button>
      </div>
    </div>
    <div class="neva-board" @click.self="addNode">
      <NevaNodeCom v-for="node in this.$store.state.nodeList" 
      :node="node"
      :key="node.id"></NevaNodeCom>

      <NevaNodeInputCom v-for="node in this.$store.state.inputNodeList" 
      :node="node"
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

@Component({
  components: {
    NevaNodeCom,
    NevaNodeInputCom
  }
})
export default class NevaBoard extends Vue {

  nodeTypeList = [
    AdditionNodeConfig,
    InputNodeConfig
  ]
  currentType = InputNodeConfig;
  switchCurrentType(newType){
    this.currentType = newType;
  }

  nodeList=[];
  inputList = [];
  addNode(e){
    console.log(e);
    let newNode = new ViewFunctionNode(this.currentType);
    newNode.positionX = e.offsetX;
    newNode.positionY = e.offsetY;
    this.$store.commit('addNode',newNode);
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

.current-type{
  background: #f00;
}
</style>
