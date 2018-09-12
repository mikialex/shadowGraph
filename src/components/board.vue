<template>
  <div>
    <div class="tool-bar">
      <GraphNodeListCom/>
      <div >
        <span>add node:</span>
        <div
        v-for="config in nodeTypeList" :key="config.name"
         @click="switchCurrentType(config)"
        class="new-node"
        :class="{'current-type':config === currentType}"
        >
          {{config.name}}
        </div>

        <button v-if="currentType !== null"
        @click="switchCurrentType(null)"
        >cancel</button>

      </div>
    </div>
    <NodeConnector></NodeConnector>
    <div class="neva-board" 
    id="board" 
    @mousedown.self="addNode"
    :style="{cursor:this.$store.state.isConnecting?'crosshair': ''}"
    >
      <NevaNodeCom v-for="node in functionNodeList" 
      :node="node"
      :boardInfo="boardInfo"
      :key="node.id"></NevaNodeCom>

      <NevaNodeNumberInputCom v-for="node in numberInputList" 
      :node="node"
      :boardInfo="boardInfo"
      :key="node.id"></NevaNodeNumberInputCom>

      <NevaNodeBooleanInputCom v-for="node in booleanInputList" 
      :node="node"
      :boardInfo="boardInfo"
      :key="node.id"></NevaNodeBooleanInputCom>

    </div>

  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import NevaNodeCom from "@/components/node.vue";
import NevaNodeNumberInputCom from "@/components/node/input/number-input-node.vue";
import NevaNodeBooleanInputCom from "@/components/node/input/boolean-input-node.vue";
import GraphNodeListCom from "@/components/graph-node-list.vue";
import { ViewFunctionNode } from "../core/view-function-node";
import { NodeType } from "../core/node-interface";
import NodeConnector from "@/components/connector.vue";

@Component({
  components: {
    NevaNodeCom,
    NevaNodeNumberInputCom,
    NevaNodeBooleanInputCom,
    NodeConnector,
    GraphNodeListCom
  }
})
export default class NevaBoard extends Vue {
  currentType = null;
  switchCurrentType(newType) {
    this.currentType = newType;
  }

  get nodeTypeList() {
    return Object.keys(this.manager.nodeConfigs).map(
      key => this.manager.nodeConfigs[key]
    );
  }

  mounted(){
    this.updateBoardInfo();
  }

  boardInfo = {
        offsetX: 0,
        offsetY: 0,
      }

  updateBoardInfo(){
    if(!document.querySelector("#board")){
      this.boardInfo = {
        offsetX: 0,
        offsetY: 0,
      }
      return;
    } 
    this.boardInfo =  {
      offsetX: document.querySelector("#board").getBoundingClientRect().left,
      offsetY: document.querySelector("#board").getBoundingClientRect().top
    };
  }

  get inputList() {
    return this.manager.currentNodeGraph.nodes.filter(n => {
      return n.type === NodeType.inputNode;
    });
  }

  get numberInputList() {
    return this.inputList.filter(n => {
      return n.name === "number-input";
    });
  }

  get booleanInputList() {
    return this.inputList.filter(n => {
      return n.name === "boolean-input";
    });
  }

  get manager() {
    return this.$store.state.nodeManager;
  }

  get functionNodeList() {
    return this.$store.state.nodeManager.currentNodeGraph.nodes.filter(n => {
      return n.type !== NodeType.inputNode;
    });
  }

  addNode(e: MouseEvent) {
    if (this.currentType) {
      let newNode = new ViewFunctionNode(this.currentType.name, this.manager);
      newNode.positionX = e.clientX;
      newNode.positionY = e.clientY;
      this.$store.commit("addNode", newNode);
    }
    this.switchCurrentType(null);
  }
}
</script>

<style scoped lang="scss">
.neva-board {
  width: 600px;
  height: 400px;
  border: 1px solid #888;
  margin: 5px;
  position: relative;
}

.new-node {
  font-size: 12px;
  display: inline-block;
  border: 1px solid #eee;
  padding: 3px;
  cursor: pointer;
  &:hover {
    background: #eee;
  }
  &:active {
    background: #ddd;
  }
}

.tool-bar {
  display: flex;
}

.current-type {
  background: #88f;
}
</style>
